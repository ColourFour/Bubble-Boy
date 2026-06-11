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