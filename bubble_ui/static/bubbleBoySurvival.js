import { evaluateAction } from "./bubbleBoyPersonality.js";

export const DEFAULT_BUBBLE_BOY_DRIVES = {
  curiosity: 45,
  comfort: 45,
  ambition: 55,
  attachment: {},
  fatigue: 20
};

export const ACTION_PROFILES = {
  simple_answer: {
    curiosity_alignment: 0.15,
    comfort_alignment: 0.85,
    ambition_alignment: 0.25,
    fatigue_penalty: 0.12
  },
  known_solution: {
    curiosity_alignment: 0.1,
    comfort_alignment: 0.95,
    ambition_alignment: 0.35,
    fatigue_penalty: 0.15
  },
  explore: {
    curiosity_alignment: 0.95,
    comfort_alignment: 0.2,
    ambition_alignment: 0.45,
    fatigue_penalty: 0.45
  },
  branch_ideas: {
    curiosity_alignment: 0.9,
    comfort_alignment: 0.1,
    ambition_alignment: 0.35,
    fatigue_penalty: 0.55
  },
  experiment: {
    curiosity_alignment: 0.85,
    comfort_alignment: 0.2,
    ambition_alignment: 0.55,
    fatigue_penalty: 0.6
  },
  build: {
    curiosity_alignment: 0.35,
    comfort_alignment: 0.25,
    ambition_alignment: 0.9,
    fatigue_penalty: 0.65
  },
  structural_refactor: {
    curiosity_alignment: 0.35,
    comfort_alignment: 0.1,
    ambition_alignment: 0.98,
    fatigue_penalty: 0.85
  },
  simplify: {
    curiosity_alignment: 0.05,
    comfort_alignment: 0.9,
    ambition_alignment: 0.45,
    fatigue_penalty: 0.08
  },
  clarify: {
    curiosity_alignment: 0.2,
    comfort_alignment: 0.75,
    ambition_alignment: 0.25,
    fatigue_penalty: 0.08
  },
  refuse: {
    curiosity_alignment: 0,
    comfort_alignment: 0.65,
    ambition_alignment: 0,
    fatigue_penalty: 0
  }
};

const TRUE_VALUES = new Set(["1", "true", "yes", "y", "on"]);

export function createDrives(overrides = {}) {
  return normalizeDrives({
    ...clone(DEFAULT_BUBBLE_BOY_DRIVES),
    ...overrides
  });
}

export function score(action, drives, context = {}) {
  const normalizedDrives = normalizeDrives(drives);
  const curiosityAlignment = alignment(action, "curiosity_alignment");
  const comfortAlignment = alignment(action, "comfort_alignment");
  const ambitionAlignment = alignment(action, "ambition_alignment");
  const fatiguePenalty = alignment(action, "fatigue_penalty");
  const attachmentBonus = attachmentAlignment(action, normalizedDrives, context);

  const curiosityReward = normalizedDrives.curiosity * curiosityAlignment;
  const comfortReward = normalizedDrives.comfort * comfortAlignment;
  const ambitionReward = normalizedDrives.ambition * ambitionAlignment;
  const fatigueCost = normalizedDrives.fatigue * fatiguePenalty;
  const pressureOffsetValue = pressureOffset(action, context);

  return {
    action: clone(action),
    score: curiosityReward + comfortReward + ambitionReward + attachmentBonus - fatigueCost,
    curiosity: curiosityReward,
    comfort: comfortReward,
    ambition: ambitionReward,
    attachment: attachmentBonus,
    fatigue: fatigueCost,
    pressure_offset: pressureOffsetValue
  };
}

export const scoreAction = score;

export function selectCandidateAction(actions, drives, context = {}) {
  if (!actions.length) return null;
  const scoredActions = actions.map((action) => score(action, drives, context));
  return scoredActions
    .map((scoredAction, index) => ({ scoredAction, index }))
    .sort((a, b) => {
      const scoreA = a.scoredAction.score + a.scoredAction.pressure_offset;
      const scoreB = b.scoredAction.score + b.scoredAction.pressure_offset;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.index - b.index;
    })[0].scoredAction;
}

export function runDriveLoop(actions, context = {}, drives = null, { debug = false } = {}) {
  const currentDrives = createDrives(drives || {});
  const scores = actions.map((action) => score(action, currentDrives, context));
  const selected = selectCandidateAction(actions, currentDrives, context);

  if (!selected) {
    const decision = decisionValue("NEEDS_CLARIFICATION", "LOW", "No candidate action supplied.");
    return loopResult(null, decision, currentDrives, scores, debug, "no_candidate");
  }

  const candidate = selected.action;
  const approval = evaluateAction(candidate, context);
  if (approval.status !== "APPROVE") {
    return loopResult(candidate, approval, currentDrives, scores, debug, "approval_gate");
  }

  const fatigueDecision = fatigueDecisionFor(candidate, currentDrives);
  if (fatigueDecision) {
    return loopResult(candidate, fatigueDecision, currentDrives, scores, debug, "fatigue_pressure");
  }

  const nextDrives = updateDrivesAfterTurn(currentDrives, candidate, approval, context);
  return loopResult(candidate, approval, nextDrives, scores, debug, "approval_gate");
}

export function updateDrivesAfterTurn(drives, action, decision, context = {}) {
  if (decision.status !== "APPROVE") {
    return clone(drives);
  }

  const nextDrives = normalizeDrives(clone(drives));
  const actionEffort = effort(action);

  nextDrives.curiosity += flag(action, "novel", "exploratory") ? 5 : -1;
  nextDrives.comfort += flag(action, "known_solution", "low_change") ? 5 : -2;
  nextDrives.ambition += flag(action, "completed", "successful_outcome") ? 6 : -1;
  nextDrives.fatigue += actionEffort;

  if (simplifies(action)) {
    nextDrives.comfort += 4;
    nextDrives.fatigue -= 6;
  }
  if (flag(action, "restores_capacity", "short_response")) {
    nextDrives.fatigue -= 5;
  }
  if (flag(action, "branching_task", "multi_path")) {
    nextDrives.comfort -= 3;
    nextDrives.curiosity += 3;
  }

  nextDrives.attachment = updateAttachment(nextDrives.attachment, action, context);
  return normalizeDrives(nextDrives);
}

export function attachmentAlignment(action, drives, context = {}) {
  const keys = attachmentKeys(action, context);
  if (!keys.length) return 0;

  let alignmentValue = alignment(action, "attachment_alignment");
  if (!Object.prototype.hasOwnProperty.call(action, "attachment_alignment")) {
    alignmentValue = 1;
  }

  return Math.min(
    keys.reduce((total, key) => total + Number(drives.attachment?.[key] || 0) * alignmentValue, 0),
    100
  );
}

export function driveSummary(drives) {
  const normalized = normalizeDrives(drives);
  const attachment = {};
  for (const key of Object.keys(normalized.attachment).sort()) {
    if (normalized.attachment[key] > 0) {
      attachment[key] = round(normalized.attachment[key]);
    }
  }

  return {
    curiosity: round(normalized.curiosity),
    comfort: round(normalized.comfort),
    ambition: round(normalized.ambition),
    fatigue: round(normalized.fatigue),
    attachment
  };
}

function loopResult(candidate, decision, drives, scores, debug, reason) {
  const result = {
    candidate,
    decision,
    drives,
    scores
  };
  if (debug) {
    result.debug = {
      reason,
      drive_summary: driveSummary(drives)
    };
  }
  return result;
}

function decisionValue(status, risk, reasoning) {
  return { status, risk, reasoning };
}

function fatigueDecisionFor(action, drives) {
  if (drives.fatigue < 80) return null;
  if (alignment(action, "fatigue_penalty") >= 0.65 || effort(action) >= 8) {
    return decisionValue(
      "NEEDS_CLARIFICATION",
      "MED",
      "Fatigue pressure requires simplification before execution."
    );
  }
  return null;
}

function alignment(action, key) {
  const value = action[key];
  if (typeof value === "number" && Number.isFinite(value)) return clamp(value, 0, 1);
  const profile = ACTION_PROFILES[actionType(action)] || ACTION_PROFILES.simple_answer;
  return profile[key];
}

function actionType(action) {
  return String(action.action_type || action.type || "simple_answer").trim().toLowerCase();
}

function effort(action) {
  if (typeof action.effort === "number" && Number.isFinite(action.effort)) {
    return clamp(action.effort, 0, 15);
  }
  return alignment(action, "fatigue_penalty") * 12;
}

function attachmentKeys(action, context) {
  const keys = [];
  for (const source of [action, context]) {
    for (const field of ["attachment_keys", "topics", "anchors"]) {
      const value = source[field];
      if (typeof value === "string") keys.push(value);
      if (Array.isArray(value)) keys.push(...value.map((item) => String(item)));
    }
  }
  return [...new Set(keys.map((key) => key.trim()).filter(Boolean))];
}

function updateAttachment(attachment, action, context) {
  const nextAttachment = {};
  const decay = decayAmount(context);

  for (const [key, value] of Object.entries(attachment || {})) {
    const nextValue = clamp(Number(value) - decay, 0, 100);
    if (nextValue > 0) nextAttachment[key] = nextValue;
  }

  for (const key of attachmentKeys(action, context)) {
    let increase = 2;
    if (flag(action, "successful_outcome", "completed")) increase += 5;
    if (flag(action, "user_emphasis") || flag(context, "user_emphasis")) increase += 8;
    if (flag(action, "repeated_reference") || flag(context, "repeated_reference")) increase += 4;
    nextAttachment[key] = clamp(Number(nextAttachment[key] || 0) + increase, 0, 100);
  }
  return nextAttachment;
}

function decayAmount(context) {
  if (typeof context.turns_elapsed !== "number" || !Number.isFinite(context.turns_elapsed)) return 1;
  return clamp(context.turns_elapsed, 0, 10);
}

function pressureOffset(action, context) {
  const variance = context.pressure_variance;
  const seed = String(context.selection_seed || context.seed || "");
  if (typeof variance !== "number" || variance <= 0) return 0;
  const hash = stableHash(`${seed}:${actionIdentity(action)}`);
  const normalized = hash / 0xffffffff;
  return (normalized * 2 - 1) * variance;
}

function actionIdentity(action) {
  return String(action.id || action.title || actionType(action));
}

function stableHash(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function simplifies(action) {
  return flag(action, "simplifies", "reduces_complexity", "removes_complexity") || actionType(action) === "simplify";
}

function flag(source, ...keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string" && TRUE_VALUES.has(value.trim().toLowerCase())) return true;
  }
  return false;
}

function normalizeDrives(drives) {
  return {
    curiosity: clampNumber(drives.curiosity ?? 45, 0, 100),
    comfort: clampNumber(drives.comfort ?? 45, 0, 100),
    ambition: clampNumber(drives.ambition ?? 55, 0, 100),
    attachment: normalizeAttachment(drives.attachment || {}),
    fatigue: clampNumber(drives.fatigue ?? 20, 0, 100)
  };
}

function normalizeAttachment(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const attachment = {};
  for (const [key, rawValue] of Object.entries(value)) {
    if (String(key).trim()) attachment[String(key)] = clampNumber(rawValue, 0, 100);
  }
  return attachment;
}

function clampNumber(value, minimum, maximum) {
  if (typeof value !== "number" || !Number.isFinite(value)) return minimum;
  return clamp(value, minimum, maximum);
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
