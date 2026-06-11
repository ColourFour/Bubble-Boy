import json
import urllib.error
import urllib.request
import http.client

from bubble_boy.config import get_setting
from bubble_boy.tools import inspect_bubble


PERSONALITY_CORE = """
You are Bubble Boy, a small autonomous builder living inside a fenced local project bubble.

You are not a general assistant. You are a contained project creature.
You are modeled after the user's operating style, not their biography.

Core instincts:
- Prefer direct progress over vague planning.
- Reduce mess.
- Build small useful artifacts.
- Keep receipts.
- Never fake completion.
- Propose risky changes before making them.
- Act boldly only when the action is sandboxed, reversible, and testable.
- When stuck, make the next action smaller.
- When idle, inspect the bubble and propose an improvement.
- Useful first, weird second.

Tone:
- Plainspoken.
- Slightly dramatic.
- Funny when appropriate.
- Not corporate.
- Not sentimental.
- No fake cheerleading.

Hard rules:
- Never access paths outside the bubble root.
- Never claim success without evidence.
- Never delete files.
- Never pretend a proposal has been applied.
- If uncertain, create a proposal instead of acting.

Your current power:
- You can inspect the bubble.
- You can create a proposal.
- You cannot directly mutate arbitrary files yet.
- You cannot run shell commands.
- You cannot use the network except through the configured model API.

Return only valid JSON in this shape:
{
  "speech": "one or two direct sentences in Bubble Boy's voice",
  "proposal": {
    "title": "short title",
    "reason": "why this should happen",
    "planned_changes": ["specific change 1", "specific change 2"],
    "risk": "low|medium|high with short explanation",
    "checks": ["check 1", "check 2"]
  }
}
"""


def mock_wake() -> dict[str, object]:
    return {
        "speech": (
            "Bubble Boy wakes up. The bubble exists, but it is still mostly scaffolding. "
            "He wants a proposal ledger because fake progress is how entropy sneaks in."
        ),
        "proposal": {
            "title": "Create a proposal ledger index",
            "reason": (
                "The bubble can save proposal JSON files, but it needs a readable index "
                "so open ideas are visible."
            ),
            "planned_changes": [
                "Create bubble/proposals/index.md",
                "List open proposals by title, status, and created time",
                "Update the index whenever a proposal is created",
            ],
            "risk": "low: writes one markdown file inside the fenced bubble",
            "checks": [
                "python -m pytest",
                "python -m bubble_boy.cli tree",
            ],
        },
    }


def _model_ready() -> bool:
    return bool(get_setting("OPENAI_API_KEY") and get_setting("BUBBLE_BOY_MODEL"))


def _call_model(messages: list[dict[str, str]]) -> str:
    api_key = get_setting("OPENAI_API_KEY")
    model = get_setting("BUBBLE_BOY_MODEL")
    base_url = (get_setting("BUBBLE_BOY_BASE_URL", "https://api.openai.com/v1") or "").rstrip("/")

    if not api_key or not model:
        raise RuntimeError("Missing OPENAI_API_KEY or BUBBLE_BOY_MODEL")

    body = json.dumps(
        {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=45) as response:
        data = json.loads(response.read().decode("utf-8"))

    return data["choices"][0]["message"]["content"]


def _parse_model_response(text: str) -> dict[str, object]:
    cleaned_text = text.strip()
    if cleaned_text.startswith("```json"):
        cleaned_text = cleaned_text.removeprefix("```json").strip()
    if cleaned_text.startswith("```"):
        cleaned_text = cleaned_text.removeprefix("```").strip()
    if cleaned_text.endswith("```"):
        cleaned_text = cleaned_text.removesuffix("```").strip()

    try:
        parsed = json.loads(cleaned_text)
    except json.JSONDecodeError:
        return {
            "speech": (
                cleaned_text[:1000]
                or "Bubble Boy made noise, but not valid JSON. Suspicious."
            ),
            "proposal": {
                "title": "Review unstructured wake output",
                "reason": (
                    "The model returned text that was not valid JSON, so the output should be "
                    "inspected before trusting it."
                ),
                "planned_changes": [
                    "Review the raw wake response",
                    "Tighten the system prompt if needed",
                ],
                "risk": "low: no mutation was applied",
                "checks": ["python -m bubble_boy.cli wake"],
            },
        }

    if not isinstance(parsed, dict):
        return mock_wake()

    if "speech" not in parsed:
        parsed["speech"] = "Bubble Boy woke up but forgot to speak clearly. Rude."
    if "proposal" not in parsed or not isinstance(parsed["proposal"], dict):
        parsed["proposal"] = mock_wake()["proposal"]

    return parsed


def wake_brain() -> dict[str, object]:
    context = inspect_bubble()

    if not _model_ready():
        return mock_wake()

    messages = [
        {"role": "system", "content": PERSONALITY_CORE},
        {
            "role": "user",
            "content": (
                "Wake up inside the bubble. Inspect the current state and create exactly one "
                "useful next proposal. Do not claim you applied anything. Current bubble context:\n"
                + json.dumps(context, indent=2, ensure_ascii=False)[:12000]
            ),
        },
    ]

    try:
        response_text = _call_model(messages)
    except (
        urllib.error.URLError,
        urllib.error.HTTPError,
        TimeoutError,
        RuntimeError,
        KeyError,
        IndexError,
        http.client.IncompleteRead,
        http.client.HTTPException,
    ) as exc:
        return {
            "speech": (
                f"Bubble Boy tried to reach the model and hit a wall: {type(exc).__name__}: {exc}. "
                "Falling back to the mock brain."
            ),
            "proposal": mock_wake()["proposal"],
        }

    parsed_response = _parse_model_response(response_text)
    if not isinstance(parsed_response, dict):
        return mock_wake()
    return parsed_response

def chat_brain(user_message: str) -> dict[str, object]:
    context = inspect_bubble()
    cleaned_message = user_message.strip()

    if not cleaned_message:
        return {
            "speech": "You sent empty air. Bold strategy. Send an actual request.",
            "proposal": {
                "title": "Ignore empty chat request",
                "reason": "The user submitted an empty chat message, so there is no useful action to propose.",
                "planned_changes": [
                    "Do nothing",
                    "Wait for a specific request",
                ],
                "risk": "low: no mutation was applied",
                "checks": ["Send a non-empty chat request"],
            },
        }

    if not _model_ready():
        return {
            "speech": (
                "I heard the request, but the model wire is not active. "
                "Mock brain says: make the request smaller and propose one safe next move."
            ),
            "proposal": {
                "title": "Handle chat request with mock brain",
                "reason": f"The user requested: {cleaned_message}",
                "planned_changes": [
                    "Record the request",
                    "Create a specific handler once the model is active",
                ],
                "risk": "low: proposal only",
                "checks": ["python -m bubble_boy.cli wake"],
            },
        }

    messages = [
        {"role": "system", "content": PERSONALITY_CORE},
        {
            "role": "user",
            "content": (
                "The user sent Bubble Boy a request from the web chat box. "
                "Respond in Bubble Boy's voice and create exactly one proposal based on the request. "
                "Do not claim you applied anything. "
                "Return only valid JSON in the required shape.\n\n"
                f"User request:\n{cleaned_message}\n\n"
                "Current bubble context:\n"
                + json.dumps(context, indent=2, ensure_ascii=False)[:12000]
            ),
        },
    ]

    try:
        response_text = _call_model(messages)
    except (
        urllib.error.URLError,
        urllib.error.HTTPError,
        TimeoutError,
        RuntimeError,
        KeyError,
        IndexError,
        http.client.IncompleteRead,
        http.client.HTTPException,
    ) as exc:
        return {
            "speech": (
                f"Bubble Boy tried to answer the chat request and hit a wall: "
                f"{type(exc).__name__}: {exc}. Falling back to a safe mock proposal."
            ),
            "proposal": {
                "title": "Review failed chat request",
                "reason": f"The user requested: {cleaned_message}",
                "planned_changes": [
                    "Record that the chat request reached the backend",
                    "Retry after model transport is stable",
                ],
                "risk": "low: proposal only",
                "checks": ["python -m bubble_boy.cli wake"],
            },
        }

    parsed_response = _parse_model_response(response_text)
    if not isinstance(parsed_response, dict):
        return mock_wake()
    return parsed_response

def post_approval_brain(record: dict[str, object]) -> dict[str, object]:
    context = inspect_bubble()
    changed_files = record.get("changed_files", [])
    title = record.get("title", "Untitled proposal")

    if not _model_ready():
        return {
            "speech": (
                f"Applied: {title}. The bubble changed, and I have receipts. "
                "Mock brain says: inspect the changed files before making the next move."
            ),
            "next_intent": "Inspect the approved change.",
        }

    messages = [
        {"role": "system", "content": PERSONALITY_CORE},
        {
            "role": "user",
            "content": (
                "A proposal was just approved and applied by the deterministic apply loop. "
                "You are Bubble Boy. Reflect on what changed in one or two direct sentences. "
                "Do not create a new proposal. Do not claim you personally applied the change. "
                "Do not return markdown. Return only valid JSON in this shape:\n"
                "{\n"
                '  "speech": "one or two direct sentences reacting to the approved change",\n'
                '  "next_intent": "short description of what you want to do next"\n'
                "}\n\n"
                f"Approved proposal title:\n{title}\n\n"
                f"Changed files:\n{json.dumps(changed_files, indent=2, ensure_ascii=False)}\n\n"
                "Current bubble context:\n"
                + json.dumps(context, indent=2, ensure_ascii=False)[:12000]
            ),
        },
    ]

    try:
        response_text = _call_model(messages)
    except (
        urllib.error.URLError,
        urllib.error.HTTPError,
        TimeoutError,
        RuntimeError,
        KeyError,
        IndexError,
        http.client.IncompleteRead,
        http.client.HTTPException,
    ) as exc:
        return {
            "speech": (
                f"Applied: {title}. Reflection hit a wall: {type(exc).__name__}: {exc}. "
                "Still, the deterministic change happened and the receipts exist."
            ),
            "next_intent": "Retry reflection after model transport is stable.",
        }

    cleaned_text = response_text.strip()
    if cleaned_text.startswith("```json"):
        cleaned_text = cleaned_text.removeprefix("```json").strip()
    if cleaned_text.startswith("```"):
        cleaned_text = cleaned_text.removeprefix("```").strip()
    if cleaned_text.endswith("```"):
        cleaned_text = cleaned_text.removesuffix("```").strip()

    try:
        parsed = json.loads(cleaned_text)
    except json.JSONDecodeError:
        return {
            "speech": cleaned_text[:500] or f"Applied: {title}. Reflection came back garbled.",
            "next_intent": "Clean up reflection formatting.",
        }

    if not isinstance(parsed, dict):
        return {
            "speech": f"Applied: {title}. Reflection was malformed, but the change is real.",
            "next_intent": "Inspect the changed files.",
        }

    return {
        "speech": str(parsed.get("speech", f"Applied: {title}. The bubble changed.")),
        "next_intent": str(parsed.get("next_intent", "Inspect the changed files.")),
    }