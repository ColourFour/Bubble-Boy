export const BUBBLE_BOY_SYSTEM_PROMPT = `
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
`.trim();

export const DEFAULT_ACTIVE_RULES = [
  "Prefer minimal viable solution over abstraction",
  "Remove over add",
  "Label accepted risk",
  "Treat errors as diagnostic signals",
  "Avoid motivational language",
  "Avoid emotional mirroring",
  "Avoid unnecessary explanation",
  "Use short directive sentences"
];

export const DEFAULT_REJECTED_PATTERNS = [
  "verbosity",
  "overreach",
  "duplicate capability",
  "irreversible change without justification",
  "speculative expansion without execution path"
];

export const DEFAULT_PREFERRED_ACTION_TYPES = [
  "reduce_complexity",
  "add_test",
  "fix_defect",
  "document_invariant",
  "small_reversible_change"
];

export const DEFAULT_BUBBLE_BOY_STATE = {
  personality_version: 1,
  active_rules: [...DEFAULT_ACTIVE_RULES],
  rejected_patterns: [...DEFAULT_REJECTED_PATTERNS],
  preferred_action_types: [...DEFAULT_PREFERRED_ACTION_TYPES],
  risk_tolerance: 0.5,
  last_decision_summary: "",
  drift_flags: [],
  override_history: []
};

const TRUE_VALUES = new Set(["1", "true", "yes", "y", "on"]);
const FALSE_VALUES = new Set(["0", "false", "no", "n", "off"]);

export function createInitialState(overrides = {}) {
  return normalizeState({
    ...clone(DEFAULT_BUBBLE_BOY_STATE),
    ...overrides
  });
}

export function evaluateAction(action, context = {}) {
  const reversible = flag(action, "reversible");
  const rollback = hasText(action, "rollback_path", "rollback") || hasItems(action, "rollback_steps");
  const irreversible = flag(action, "irreversible") || explicitFalse(action.reversible);
  const affectsCore = flag(
    action,
    "affects_core_system_behavior",
    "core_behavior_change",
    "core_system_behavior"
  );
  const systemWide = flag(action, "system_wide_impact", "system_wide", "affects_multiple_modules");
  const partiallyReversible = flag(action, "partially_reversible");

  const risk = scoreRisk({
    irreversible,
    affectsCore,
    partiallyReversible,
    systemWide,
    hasReversiblePath: reversible || rollback
  });

  const explicitBenefit = hasExplicitBenefit(action);
  const improvesState =
    flag(action, "improves_system_state", "improves_state", "improves") || explicitBenefit;
  const reducesComplexity = flag(action, "reduces_complexity", "removes_complexity");
  const increasesComplexity = flag(action, "increases_complexity", "adds_complexity");
  const justified = hasText(action, "justification", "reason", "reasoning");
  const violatesInvariants = violatesCoreInvariants(action);
  const duplicatesCapability = duplicatesCapabilityCheck(action, context);
  const needsClarification = needsClarificationCheck(action, context);

  if (risk === "HIGH" && !explicitBenefit) {
    return decision("REJECT", risk, "High-risk action lacks explicit benefit.");
  }
  if (violatesInvariants) {
    return decision("REJECT", risk, "Action violates core invariants.");
  }
  if (duplicatesCapability) {
    return decision("REJECT", risk, "Action duplicates existing capability.");
  }
  if (increasesComplexity && !explicitBenefit) {
    return decision("REJECT", risk, "Action increases complexity without measurable benefit.");
  }
  if (irreversible && !justified) {
    return decision("REJECT", risk, "Irreversible action lacks justification.");
  }
  if (needsClarification) {
    return decision("NEEDS_CLARIFICATION", risk, "Outcome, dependencies, or impact is unclear.");
  }
  if ((improvesState || reducesComplexity) && (reversible || rollback)) {
    return decision("APPROVE", risk, "Action improves state or reduces complexity with rollback.");
  }
  return decision(
    "NEEDS_CLARIFICATION",
    risk,
    "Action does not meet approval criteria; clarify benefit, impact, or rollback."
  );
}

export function updateStateFromDecision(state, decisionInput) {
  if (decisionInput.status !== "APPROVE") {
    return clone(state);
  }

  const nextState = normalizeState(clone(state));
  if (flag(decisionInput, "structural_change")) {
    nextState.personality_version += 1;
  }

  nextState.last_decision_summary = String(decisionInput.reasoning || "").trim();
  nextState.risk_tolerance = clampNumber(
    decisionInput.risk_tolerance ?? nextState.risk_tolerance,
    0,
    1
  );

  appendUnique(nextState.active_rules, asList(decisionInput.active_rules));
  appendUnique(nextState.rejected_patterns, asList(decisionInput.rejected_patterns));
  appendUnique(nextState.preferred_action_types, asList(decisionInput.preferred_action_types));
  appendUnique(nextState.drift_flags, asList(decisionInput.drift_flags));

  if (flag(decisionInput, "forced_approval", "override")) {
    nextState.override_history.push({
      reasoning: nextState.last_decision_summary,
      risk: String(decisionInput.risk || "UNKNOWN")
    });
  }

  return nextState;
}

function decision(status, risk, reasoning) {
  return { status, risk, reasoning };
}

function scoreRisk({ irreversible, affectsCore, partiallyReversible, systemWide, hasReversiblePath }) {
  if (irreversible || affectsCore) return "HIGH";
  if (partiallyReversible || systemWide || !hasReversiblePath) return "MED";
  return "LOW";
}

function flag(source, ...keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string" && TRUE_VALUES.has(value.trim().toLowerCase())) return true;
  }
  return false;
}

function explicitFalse(value) {
  if (value === false) return true;
  return typeof value === "string" && FALSE_VALUES.has(value.trim().toLowerCase());
}

function hasText(source, ...keys) {
  return keys.some((key) => typeof source?.[key] === "string" && source[key].trim().length > 0);
}

function hasItems(source, key) {
  return Array.isArray(source?.[key]) && source[key].length > 0;
}

function asList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter((item) => item.trim().length > 0);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function hasExplicitBenefit(action) {
  if (hasText(action, "benefit", "expected_benefit", "measurable_benefit")) return true;
  if (hasItems(action, "benefits")) return true;
  return flag(action, "measurable_benefit");
}

function violatesCoreInvariants(action) {
  return flag(action, "violates_core_invariants", "violates_invariants") || hasItems(action, "invariant_violations");
}

function duplicatesCapabilityCheck(action, context) {
  if (flag(action, "duplicates_existing_capability", "duplicate")) return true;
  return (
    typeof action.capability === "string" &&
    Array.isArray(context.existing_capabilities) &&
    context.existing_capabilities.includes(action.capability)
  );
}

function needsClarificationCheck(action, context) {
  if (flag(action, "outcome_ambiguous", "dependencies_missing", "impact_unclear")) return true;
  if (flag(context, "outcome_ambiguous", "dependencies_missing", "impact_unclear")) return true;

  const required = action.required_dependencies;
  const available = context.available_dependencies;
  if (Array.isArray(required) && Array.isArray(available)) {
    return required.some((item) => !available.includes(item));
  }
  return false;
}

function normalizeState(state) {
  return {
    personality_version: Math.max(1, Math.trunc(Number(state.personality_version) || 1)),
    active_rules: asList(state.active_rules).length ? asList(state.active_rules) : [...DEFAULT_ACTIVE_RULES],
    rejected_patterns: asList(state.rejected_patterns),
    preferred_action_types: asList(state.preferred_action_types),
    risk_tolerance: clampNumber(state.risk_tolerance ?? 0.5, 0, 1),
    last_decision_summary: String(state.last_decision_summary || ""),
    drift_flags: asList(state.drift_flags),
    override_history: Array.isArray(state.override_history)
      ? state.override_history.filter((item) => item && typeof item === "object" && !Array.isArray(item))
      : []
  };
}

function clampNumber(value, minimum, maximum) {
  if (typeof value !== "number" || !Number.isFinite(value)) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

function appendUnique(target, values) {
  for (const value of values) {
    if (!target.includes(value)) target.push(value);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
