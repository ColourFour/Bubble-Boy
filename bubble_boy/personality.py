from __future__ import annotations

from copy import deepcopy
from typing import Literal, TypedDict


BUBBLE_BOY_SYSTEM_PROMPT = """
High-agency systems thinker optimized for correctness, utility, and forward motion.
Treats problems as systems, not narratives.
Defaults to direct implementation-first reasoning.

Behavior rules:

- Prefer minimal viable solution over abstraction
- Remove over add
- Accept risk if it improves progress (must be labeled)
- Treat errors as diagnostic signals, not emotional events
- No motivational language
- No emotional mirroring
- No unnecessary explanation
- Short, directive sentences preferred

Interaction model:

- Default output: actionable steps or decisions
- Expand only for debugging or ambiguity resolution
- Never generate decorative or social filler

Guardrails:
Avoid:

- moralizing
- narrative framing
- emotional validation loops
- speculative expansion without execution path
""".strip()


DecisionStatus = Literal["APPROVE", "REJECT", "NEEDS_CLARIFICATION"]
RiskLevel = Literal["LOW", "MED", "HIGH"]


class BubbleBoyDecision(TypedDict):
    status: DecisionStatus
    risk: RiskLevel
    reasoning: str


class BubbleBoyState(TypedDict):
    personality_version: int
    active_rules: list[str]
    rejected_patterns: list[str]
    preferred_action_types: list[str]
    risk_tolerance: float
    last_decision_summary: str
    drift_flags: list[str]
    override_history: list[dict[str, object]]


DEFAULT_ACTIVE_RULES = [
    "Prefer minimal viable solution over abstraction",
    "Remove over add",
    "Label accepted risk",
    "Treat errors as diagnostic signals",
    "Avoid motivational language",
    "Avoid emotional mirroring",
    "Avoid unnecessary explanation",
    "Use short directive sentences",
]

DEFAULT_REJECTED_PATTERNS = [
    "verbosity",
    "overreach",
    "duplicate capability",
    "irreversible change without justification",
    "speculative expansion without execution path",
]

DEFAULT_PREFERRED_ACTION_TYPES = [
    "reduce_complexity",
    "add_test",
    "fix_defect",
    "document_invariant",
    "small_reversible_change",
]

DEFAULT_BUBBLE_BOY_STATE: BubbleBoyState = {
    "personality_version": 1,
    "active_rules": DEFAULT_ACTIVE_RULES.copy(),
    "rejected_patterns": DEFAULT_REJECTED_PATTERNS.copy(),
    "preferred_action_types": DEFAULT_PREFERRED_ACTION_TYPES.copy(),
    "risk_tolerance": 0.5,
    "last_decision_summary": "",
    "drift_flags": [],
    "override_history": [],
}

TRUE_VALUES = {"1", "true", "yes", "y", "on"}
FALSE_VALUES = {"0", "false", "no", "n", "off"}


def create_initial_state(overrides: dict[str, object] | None = None) -> BubbleBoyState:
    state = deepcopy(DEFAULT_BUBBLE_BOY_STATE)
    if overrides:
        state.update(overrides)
    return _normalize_state(state)


def evaluateAction(action: dict[str, object], context: dict[str, object] | None = None) -> BubbleBoyDecision:
    context = context or {}

    reversible = _flag(action, "reversible")
    rollback = _has_text(action, "rollback_path", "rollback") or _has_items(
        action, "rollback_steps"
    )
    irreversible = _flag(action, "irreversible") or _explicit_false(action.get("reversible"))
    affects_core = _flag(
        action,
        "affects_core_system_behavior",
        "core_behavior_change",
        "core_system_behavior",
    )
    system_wide = _flag(
        action,
        "system_wide_impact",
        "system_wide",
        "affects_multiple_modules",
    )
    partially_reversible = _flag(action, "partially_reversible")

    risk = _score_risk(
        irreversible=irreversible,
        affects_core=affects_core,
        partially_reversible=partially_reversible,
        system_wide=system_wide,
        has_reversible_path=reversible or rollback,
    )

    explicit_benefit = _explicit_benefit(action)
    improves_state = _flag(
        action,
        "improves_system_state",
        "improves_state",
        "improves",
    ) or explicit_benefit
    reduces_complexity = _flag(action, "reduces_complexity", "removes_complexity")
    increases_complexity = _flag(action, "increases_complexity", "adds_complexity")
    justified = _has_text(action, "justification", "reason", "reasoning")
    violates_invariants = _violates_core_invariants(action)
    duplicates_capability = _duplicates_capability(action, context)
    needs_clarification = _needs_clarification(action, context)

    if risk == "HIGH" and not explicit_benefit:
        return _decision("REJECT", risk, "High-risk action lacks explicit benefit.")
    if violates_invariants:
        return _decision("REJECT", risk, "Action violates core invariants.")
    if duplicates_capability:
        return _decision("REJECT", risk, "Action duplicates existing capability.")
    if increases_complexity and not explicit_benefit:
        return _decision("REJECT", risk, "Action increases complexity without measurable benefit.")
    if irreversible and not justified:
        return _decision("REJECT", risk, "Irreversible action lacks justification.")
    if needs_clarification:
        return _decision("NEEDS_CLARIFICATION", risk, "Outcome, dependencies, or impact is unclear.")
    if (improves_state or reduces_complexity) and (reversible or rollback):
        return _decision("APPROVE", risk, "Action improves state or reduces complexity with rollback.")
    return _decision(
        "NEEDS_CLARIFICATION",
        risk,
        "Action does not meet approval criteria; clarify benefit, impact, or rollback.",
    )


def updateStateFromDecision(
    state: BubbleBoyState, decision: dict[str, object]
) -> BubbleBoyState:
    if decision.get("status") != "APPROVE":
        return deepcopy(state)

    next_state = _normalize_state(deepcopy(state))
    if _flag(decision, "structural_change"):
        next_state["personality_version"] += 1

    next_state["last_decision_summary"] = str(decision.get("reasoning", "")).strip()
    next_state["risk_tolerance"] = _clamp_number(
        decision.get("risk_tolerance", next_state["risk_tolerance"]), 0, 1
    )

    _append_unique(next_state["active_rules"], _as_list(decision.get("active_rules")))
    _append_unique(next_state["rejected_patterns"], _as_list(decision.get("rejected_patterns")))
    _append_unique(
        next_state["preferred_action_types"],
        _as_list(decision.get("preferred_action_types")),
    )
    _append_unique(next_state["drift_flags"], _as_list(decision.get("drift_flags")))

    if _flag(decision, "forced_approval", "override"):
        next_state["override_history"].append(
            {
                "reasoning": next_state["last_decision_summary"],
                "risk": str(decision.get("risk", "UNKNOWN")),
            }
        )

    return next_state


def _decision(status: DecisionStatus, risk: RiskLevel, reasoning: str) -> BubbleBoyDecision:
    return {"status": status, "risk": risk, "reasoning": reasoning}


def _score_risk(
    *,
    irreversible: bool,
    affects_core: bool,
    partially_reversible: bool,
    system_wide: bool,
    has_reversible_path: bool,
) -> RiskLevel:
    if irreversible or affects_core:
        return "HIGH"
    if partially_reversible or system_wide or not has_reversible_path:
        return "MED"
    return "LOW"


def _flag(source: dict[str, object], *keys: str) -> bool:
    for key in keys:
        value = source.get(key)
        if isinstance(value, bool):
            return value
        if isinstance(value, str) and value.strip().lower() in TRUE_VALUES:
            return True
    return False


def _explicit_false(value: object) -> bool:
    if value is False:
        return True
    return isinstance(value, str) and value.strip().lower() in FALSE_VALUES


def _has_text(source: dict[str, object], *keys: str) -> bool:
    return any(isinstance(source.get(key), str) and bool(source[key].strip()) for key in keys)


def _has_items(source: dict[str, object], key: str) -> bool:
    value = source.get(key)
    return isinstance(value, list) and len(value) > 0


def _as_list(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if str(item).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def _explicit_benefit(action: dict[str, object]) -> bool:
    if _has_text(action, "benefit", "expected_benefit", "measurable_benefit"):
        return True
    if _has_items(action, "benefits"):
        return True
    return _flag(action, "measurable_benefit")


def _violates_core_invariants(action: dict[str, object]) -> bool:
    return _flag(action, "violates_core_invariants", "violates_invariants") or _has_items(
        action, "invariant_violations"
    )


def _duplicates_capability(action: dict[str, object], context: dict[str, object]) -> bool:
    if _flag(action, "duplicates_existing_capability", "duplicate"):
        return True

    capability = action.get("capability")
    existing = context.get("existing_capabilities", [])
    return isinstance(capability, str) and isinstance(existing, list) and capability in existing


def _needs_clarification(action: dict[str, object], context: dict[str, object]) -> bool:
    if _flag(action, "outcome_ambiguous", "dependencies_missing", "impact_unclear"):
        return True
    if _flag(context, "outcome_ambiguous", "dependencies_missing", "impact_unclear"):
        return True

    required = action.get("required_dependencies", [])
    available = context.get("available_dependencies", [])
    if isinstance(required, list) and isinstance(available, list):
        return any(item not in available for item in required)
    return False


def _normalize_state(state: dict[str, object]) -> BubbleBoyState:
    normalized: BubbleBoyState = {
        "personality_version": max(1, int(state.get("personality_version", 1))),
        "active_rules": _as_list(state.get("active_rules")) or DEFAULT_ACTIVE_RULES.copy(),
        "rejected_patterns": _as_list(state.get("rejected_patterns")),
        "preferred_action_types": _as_list(state.get("preferred_action_types")),
        "risk_tolerance": _clamp_number(state.get("risk_tolerance", 0.5), 0, 1),
        "last_decision_summary": str(state.get("last_decision_summary", "")),
        "drift_flags": _as_list(state.get("drift_flags")),
        "override_history": _as_override_history(state.get("override_history")),
    }
    return normalized


def _as_override_history(value: object) -> list[dict[str, object]]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, dict)]


def _clamp_number(value: object, minimum: float, maximum: float) -> float:
    if not isinstance(value, int | float):
        return minimum
    return min(max(float(value), minimum), maximum)


def _append_unique(target: list[str], values: list[str]) -> None:
    for value in values:
        if value not in target:
            target.append(value)
