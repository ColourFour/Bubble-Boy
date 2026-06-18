from __future__ import annotations

import hashlib
from copy import deepcopy
from typing import Literal, TypedDict

from bubble_boy.personality import BubbleBoyDecision, DecisionStatus, RiskLevel, evaluateAction


class BubbleBoyDrives(TypedDict):
    curiosity: float
    comfort: float
    ambition: float
    attachment: dict[str, float]
    fatigue: float


class DriveScore(TypedDict):
    action: dict[str, object]
    score: float
    curiosity: float
    comfort: float
    ambition: float
    attachment: float
    fatigue: float
    pressure_offset: float


class DriveLoopResult(TypedDict, total=False):
    candidate: dict[str, object] | None
    decision: BubbleBoyDecision
    drives: BubbleBoyDrives
    scores: list[DriveScore]
    debug: dict[str, object]


DriveDecisionReason = Literal[
    "approval_gate",
    "fatigue_pressure",
    "no_candidate",
]


DEFAULT_BUBBLE_BOY_DRIVES: BubbleBoyDrives = {
    "curiosity": 45,
    "comfort": 45,
    "ambition": 55,
    "attachment": {},
    "fatigue": 20,
}

ACTION_PROFILES: dict[str, dict[str, float]] = {
    "simple_answer": {
        "curiosity_alignment": 0.15,
        "comfort_alignment": 0.85,
        "ambition_alignment": 0.25,
        "fatigue_penalty": 0.12,
    },
    "known_solution": {
        "curiosity_alignment": 0.1,
        "comfort_alignment": 0.95,
        "ambition_alignment": 0.35,
        "fatigue_penalty": 0.15,
    },
    "explore": {
        "curiosity_alignment": 0.95,
        "comfort_alignment": 0.2,
        "ambition_alignment": 0.45,
        "fatigue_penalty": 0.45,
    },
    "branch_ideas": {
        "curiosity_alignment": 0.9,
        "comfort_alignment": 0.1,
        "ambition_alignment": 0.35,
        "fatigue_penalty": 0.55,
    },
    "experiment": {
        "curiosity_alignment": 0.85,
        "comfort_alignment": 0.2,
        "ambition_alignment": 0.55,
        "fatigue_penalty": 0.6,
    },
    "build": {
        "curiosity_alignment": 0.35,
        "comfort_alignment": 0.25,
        "ambition_alignment": 0.9,
        "fatigue_penalty": 0.65,
    },
    "structural_refactor": {
        "curiosity_alignment": 0.35,
        "comfort_alignment": 0.1,
        "ambition_alignment": 0.98,
        "fatigue_penalty": 0.85,
    },
    "simplify": {
        "curiosity_alignment": 0.05,
        "comfort_alignment": 0.9,
        "ambition_alignment": 0.45,
        "fatigue_penalty": 0.08,
    },
    "clarify": {
        "curiosity_alignment": 0.2,
        "comfort_alignment": 0.75,
        "ambition_alignment": 0.25,
        "fatigue_penalty": 0.08,
    },
    "refuse": {
        "curiosity_alignment": 0,
        "comfort_alignment": 0.65,
        "ambition_alignment": 0,
        "fatigue_penalty": 0,
    },
}

TRUE_VALUES = {"1", "true", "yes", "y", "on"}


def createDrives(overrides: dict[str, object] | None = None) -> BubbleBoyDrives:
    drives = deepcopy(DEFAULT_BUBBLE_BOY_DRIVES)
    if overrides:
        drives.update(overrides)
    return _normalize_drives(drives)


def score(
    action: dict[str, object],
    drives: BubbleBoyDrives,
    context: dict[str, object] | None = None,
) -> DriveScore:
    context = context or {}
    normalized_drives = _normalize_drives(drives)
    curiosity_alignment = _alignment(action, "curiosity_alignment")
    comfort_alignment = _alignment(action, "comfort_alignment")
    ambition_alignment = _alignment(action, "ambition_alignment")
    fatigue_penalty = _alignment(action, "fatigue_penalty")
    attachment_bonus = attachmentAlignment(action, normalized_drives, context)

    curiosity_reward = normalized_drives["curiosity"] * curiosity_alignment
    comfort_reward = normalized_drives["comfort"] * comfort_alignment
    ambition_reward = normalized_drives["ambition"] * ambition_alignment
    fatigue_cost = normalized_drives["fatigue"] * fatigue_penalty
    pressure_offset = _pressure_offset(action, context)

    return {
        "action": deepcopy(action),
        "score": curiosity_reward + comfort_reward + ambition_reward + attachment_bonus - fatigue_cost,
        "curiosity": curiosity_reward,
        "comfort": comfort_reward,
        "ambition": ambition_reward,
        "attachment": attachment_bonus,
        "fatigue": fatigue_cost,
        "pressure_offset": pressure_offset,
    }


def scoreAction(
    action: dict[str, object],
    drives: BubbleBoyDrives,
    context: dict[str, object] | None = None,
) -> DriveScore:
    return score(action, drives, context)


def selectCandidateAction(
    actions: list[dict[str, object]],
    drives: BubbleBoyDrives,
    context: dict[str, object] | None = None,
) -> DriveScore | None:
    if not actions:
        return None

    scored_actions = [score(action, drives, context) for action in actions]
    return max(
        enumerate(scored_actions),
        key=lambda item: (item[1]["score"] + item[1]["pressure_offset"], -item[0]),
    )[1]


def runDriveLoop(
    actions: list[dict[str, object]],
    context: dict[str, object] | None = None,
    drives: BubbleBoyDrives | None = None,
    *,
    debug: bool = False,
) -> DriveLoopResult:
    context = context or {}
    current_drives = createDrives(drives)
    scored_actions = [score(action, current_drives, context) for action in actions]
    selected = selectCandidateAction(actions, current_drives, context)

    if selected is None:
        decision = _decision("NEEDS_CLARIFICATION", "LOW", "No candidate action supplied.")
        return _loop_result(None, decision, current_drives, scored_actions, debug, "no_candidate")

    candidate = selected["action"]
    approval = evaluateAction(candidate, context)
    if approval["status"] != "APPROVE":
        return _loop_result(candidate, approval, current_drives, scored_actions, debug, "approval_gate")

    fatigue_decision = _fatigue_decision(candidate, current_drives)
    if fatigue_decision is not None:
        return _loop_result(candidate, fatigue_decision, current_drives, scored_actions, debug, "fatigue_pressure")

    next_drives = updateDrivesAfterTurn(current_drives, candidate, approval, context)
    return _loop_result(candidate, approval, next_drives, scored_actions, debug, "approval_gate")


def updateDrivesAfterTurn(
    drives: BubbleBoyDrives,
    action: dict[str, object],
    decision: BubbleBoyDecision,
    context: dict[str, object] | None = None,
) -> BubbleBoyDrives:
    if decision.get("status") == "REJECT":
        return deepcopy(drives)

    if decision.get("status") != "APPROVE":
        return deepcopy(drives)

    context = context or {}
    next_drives = _normalize_drives(deepcopy(drives))
    effort = _effort(action)

    next_drives["curiosity"] += 5 if _flag(action, "novel", "exploratory") else -1
    next_drives["comfort"] += 5 if _flag(action, "known_solution", "low_change") else -2
    next_drives["ambition"] += 6 if _flag(action, "completed", "successful_outcome") else -1
    next_drives["fatigue"] += effort

    if _simplifies(action):
        next_drives["comfort"] += 4
        next_drives["fatigue"] -= 6
    if _flag(action, "restores_capacity", "short_response"):
        next_drives["fatigue"] -= 5
    if _flag(action, "branching_task", "multi_path"):
        next_drives["comfort"] -= 3
        next_drives["curiosity"] += 3

    next_drives["attachment"] = _update_attachment(next_drives["attachment"], action, context)
    return _normalize_drives(next_drives)


def attachmentAlignment(
    action: dict[str, object],
    drives: BubbleBoyDrives,
    context: dict[str, object] | None = None,
) -> float:
    context = context or {}
    attachment = drives.get("attachment", {})
    keys = _attachment_keys(action, context)
    if not keys:
        return 0.0

    alignment_value = action.get("attachment_alignment")
    alignment = (
        _clamp(float(alignment_value), 0, 1)
        if isinstance(alignment_value, int | float)
        else 1.0
    )
    return min(sum(float(attachment.get(key, 0)) * alignment for key in keys), 100)


def _loop_result(
    candidate: dict[str, object] | None,
    decision: BubbleBoyDecision,
    drives: BubbleBoyDrives,
    scores: list[DriveScore],
    debug: bool,
    reason: DriveDecisionReason,
) -> DriveLoopResult:
    result: DriveLoopResult = {
        "candidate": candidate,
        "decision": decision,
        "drives": drives,
        "scores": scores,
    }
    if debug:
        result["debug"] = {
            "reason": reason,
            "drive_summary": driveSummary(drives),
        }
    return result


def driveSummary(drives: BubbleBoyDrives) -> dict[str, object]:
    normalized = _normalize_drives(drives)
    return {
        "curiosity": round(normalized["curiosity"], 2),
        "comfort": round(normalized["comfort"], 2),
        "ambition": round(normalized["ambition"], 2),
        "fatigue": round(normalized["fatigue"], 2),
        "attachment": {
            key: round(value, 2)
            for key, value in sorted(normalized["attachment"].items())
            if value > 0
        },
    }


def _decision(status: DecisionStatus, risk: RiskLevel, reasoning: str) -> BubbleBoyDecision:
    return {"status": status, "risk": risk, "reasoning": reasoning}


def _fatigue_decision(
    action: dict[str, object],
    drives: BubbleBoyDrives,
) -> BubbleBoyDecision | None:
    if drives["fatigue"] < 80:
        return None
    if _alignment(action, "fatigue_penalty") >= 0.65 or _effort(action) >= 8:
        return _decision(
            "NEEDS_CLARIFICATION",
            "MED",
            "Fatigue pressure requires simplification before execution.",
        )
    return None


def _alignment(action: dict[str, object], key: str) -> float:
    value = action.get(key)
    if isinstance(value, int | float):
        return _clamp(float(value), 0, 1)
    profile = ACTION_PROFILES.get(_action_type(action), ACTION_PROFILES["simple_answer"])
    return profile[key]


def _action_type(action: dict[str, object]) -> str:
    value = action.get("action_type", action.get("type", "simple_answer"))
    return str(value or "simple_answer").strip().lower()


def _effort(action: dict[str, object]) -> float:
    value = action.get("effort")
    if isinstance(value, int | float):
        return _clamp(float(value), 0, 15)
    return _alignment(action, "fatigue_penalty") * 12


def _attachment_keys(action: dict[str, object], context: dict[str, object]) -> list[str]:
    keys: list[str] = []
    for source in (action, context):
        for field in ("attachment_keys", "topics", "anchors"):
            value = source.get(field)
            if isinstance(value, str):
                keys.append(value)
            elif isinstance(value, list):
                keys.extend(str(item) for item in value if str(item).strip())
    return list(dict.fromkeys(key.strip() for key in keys if key.strip()))


def _update_attachment(
    attachment: dict[str, float],
    action: dict[str, object],
    context: dict[str, object],
) -> dict[str, float]:
    next_attachment = {
        key: _clamp(value - _decay_amount(context), 0, 100)
        for key, value in attachment.items()
    }
    for key in _attachment_keys(action, context):
        increase = 2.0
        if _flag(action, "successful_outcome", "completed"):
            increase += 5
        if _flag(action, "user_emphasis") or _flag(context, "user_emphasis"):
            increase += 8
        if _flag(action, "repeated_reference") or _flag(context, "repeated_reference"):
            increase += 4
        next_attachment[key] = _clamp(next_attachment.get(key, 0) + increase, 0, 100)
    return {key: value for key, value in next_attachment.items() if value > 0}


def _decay_amount(context: dict[str, object]) -> float:
    turns = context.get("turns_elapsed", 1)
    if not isinstance(turns, int | float):
        return 1.0
    return _clamp(float(turns), 0, 10)


def _pressure_offset(action: dict[str, object], context: dict[str, object]) -> float:
    variance = context.get("pressure_variance", 0)
    seed = context.get("selection_seed", context.get("seed", ""))
    if not isinstance(variance, int | float) or variance <= 0:
        return 0.0
    digest = hashlib.sha256(f"{seed}:{_action_identity(action)}".encode("utf-8")).hexdigest()
    normalized = int(digest[:8], 16) / 0xFFFFFFFF
    return (normalized * 2 - 1) * float(variance)


def _action_identity(action: dict[str, object]) -> str:
    value = action.get("id", action.get("title", _action_type(action)))
    return str(value)


def _simplifies(action: dict[str, object]) -> bool:
    return _flag(action, "simplifies", "reduces_complexity", "removes_complexity") or _action_type(
        action
    ) == "simplify"


def _flag(source: dict[str, object], *keys: str) -> bool:
    for key in keys:
        value = source.get(key)
        if isinstance(value, bool):
            return value
        if isinstance(value, str) and value.strip().lower() in TRUE_VALUES:
            return True
    return False


def _normalize_drives(drives: dict[str, object]) -> BubbleBoyDrives:
    return {
        "curiosity": _clamp_number(drives.get("curiosity", 45), 0, 100),
        "comfort": _clamp_number(drives.get("comfort", 45), 0, 100),
        "ambition": _clamp_number(drives.get("ambition", 55), 0, 100),
        "attachment": _normalize_attachment(drives.get("attachment", {})),
        "fatigue": _clamp_number(drives.get("fatigue", 20), 0, 100),
    }


def _normalize_attachment(value: object) -> dict[str, float]:
    if not isinstance(value, dict):
        return {}
    return {
        str(key): _clamp_number(raw_value, 0, 100)
        for key, raw_value in value.items()
        if str(key).strip()
    }


def _clamp_number(value: object, minimum: float, maximum: float) -> float:
    if not isinstance(value, int | float):
        return minimum
    return _clamp(float(value), minimum, maximum)


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return min(max(value, minimum), maximum)
