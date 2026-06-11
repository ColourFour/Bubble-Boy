import json
import re
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from bubble_boy.config import BUBBLE_ROOT
from bubble_boy.storage import append_log, read_text, write_text


class BubbleProposalError(ValueError):
    pass


def _slugify(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return slug[:48] or "proposal"


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def create_proposal(proposal: dict[str, object]) -> tuple[Path, dict[str, object]]:
    title = str(proposal.get("title") or "Untitled proposal")
    created_at = _utc_now()
    proposal_id = (
        f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}-"
        f"{_slugify(title)}-"
        f"{uuid4().hex[:8]}"
    )

    record: dict[str, object] = {
        "id": proposal_id,
        "created_at": created_at,
        "status": "proposed",
        "title": title,
        "reason": proposal.get("reason", ""),
        "planned_changes": proposal.get("planned_changes", []),
        "risk": proposal.get("risk", "unknown"),
        "checks": proposal.get("checks", []),
    }

    path = write_text(
        f"proposals/{proposal_id}.json",
        json.dumps(record, indent=2, ensure_ascii=False) + "\n",
    )
    return path, record


def _proposal_paths() -> list[Path]:
    proposals_root = BUBBLE_ROOT / "proposals"
    if not proposals_root.exists():
        return []
    return sorted(path for path in proposals_root.glob("*.json") if path.is_file())


def load_proposal(proposal_ref: str) -> tuple[Path, dict[str, object]]:
    matches = [
        path
        for path in _proposal_paths()
        if path.stem == proposal_ref or path.stem.startswith(proposal_ref)
    ]

    if not matches:
        raise BubbleProposalError(f"No proposal matched: {proposal_ref}")
    if len(matches) > 1:
        matched_ids = ", ".join(path.stem for path in matches[:5])
        raise BubbleProposalError(f"Proposal ref is ambiguous: {proposal_ref}. Matches: {matched_ids}")

    path = matches[0]
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise BubbleProposalError(f"Proposal is not valid JSON: {path.name}") from exc

    if not isinstance(record, dict):
        raise BubbleProposalError(f"Proposal is not an object: {path.name}")

    return path, record


def _planned_text(record: dict[str, object]) -> str:
    parts = [str(record.get("title", "")), str(record.get("reason", ""))]
    planned_changes = record.get("planned_changes", [])
    if isinstance(planned_changes, list):
        parts.extend(str(item) for item in planned_changes)
    return "\n".join(parts).lower()


def _replace_status_line(status_text: str, prefix: str, replacement: str) -> str:
    lines = status_text.splitlines()
    replaced = False
    for index, line in enumerate(lines):
        if line.startswith(prefix):
            lines[index] = replacement
            replaced = True
    if not replaced:
        lines.append(replacement)
    return "\n".join(lines).rstrip() + "\n"


def _apply_seed_action_log(record: dict[str, object]) -> list[str]:
    timestamp = _utc_now()
    memory = read_text("memory.json")
    status = read_text("status.md")

    initial_state = (
        "# Initial Bubble State\n\n"
        f"Timestamp: {timestamp}\n\n"
        f"Proposal: {record.get('id')} — {record.get('title')}\n\n"
        "## Status at approval\n\n"
        f"{status.strip()}\n\n"
        "## Memory snapshot\n\n"
        "```json\n"
        f"{memory.strip()}\n"
        "```\n"
    )
    write_text("logs/initial_state.md", initial_state)

    updated_status = _replace_status_line(status, "Current goal:", "Current goal: Make first useful artifact")
    updated_status = _replace_status_line(updated_status, "Last action:", "Last action: Seeded action log")
    write_text("status.md", updated_status)

    append_log(f"approved and applied proposal {record.get('id')}: seeded initial action log")
    return ["logs/initial_state.md", "status.md"]


def _apply_proposal_ledger_index(record: dict[str, object]) -> list[str]:
    timestamp = _utc_now()
    rows: list[str] = []
    for path in _proposal_paths():
        try:
            proposal = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if not isinstance(proposal, dict):
            continue
        rows.append(
            f"- `{proposal.get('id', path.stem)}` — "
            f"{proposal.get('status', 'unknown')} — "
            f"{proposal.get('title', 'Untitled proposal')}"
        )

    content = (
        "# Proposal Ledger\n\n"
        f"Last updated: {timestamp}\n\n"
        "## Proposals\n\n"
        + ("\n".join(rows) if rows else "No proposals yet.")
        + "\n"
    )
    write_text("proposals/index.md", content)
    append_log(f"approved and applied proposal {record.get('id')}: refreshed proposal ledger index")
    return ["proposals/index.md"]


def _select_apply_action(record: dict[str, object]) -> str:
    text = _planned_text(record)
    if "logs/initial_state.md" in text or "seed the action log" in text:
        return "seed_action_log"
    if "proposals/index.md" in text or "proposal ledger index" in text:
        return "proposal_ledger_index"
    raise BubbleProposalError(
        "No safe apply handler matched this proposal. Nothing was changed. "
        "Add an explicit allowlisted handler before approving it."
    )


def approve_proposal(proposal_ref: str) -> dict[str, object]:
    path, record = load_proposal(proposal_ref)

    if record.get("status") != "proposed":
        raise BubbleProposalError(f"Proposal is not proposed; current status is {record.get('status')!r}")

    action = _select_apply_action(record)

    if action == "seed_action_log":
        changed_files = _apply_seed_action_log(record)
    elif action == "proposal_ledger_index":
        changed_files = _apply_proposal_ledger_index(record)
    else:
        raise BubbleProposalError(f"Unsupported apply action: {action}")

    record["status"] = "applied"
    record["approved_at"] = _utc_now()
    record["apply_action"] = action
    record["changed_files"] = changed_files
    path.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    return record
