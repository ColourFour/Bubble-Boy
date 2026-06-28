const ACTION_LABELS = ["wander", "rest", "gaze_fire", "interact", "attend_user", "builder"];

export function createSimMetrics() {
  return {
    ticks: 0,
    energy: {
      min: Infinity,
      max: -Infinity,
      sum: 0,
      avg: 0
    },
    actionDistribution: {
      wander: 0,
      rest: 0,
      gaze_fire: 0,
      interact: 0,
      attend_user: 0,
      builder: 0
    },
    goalTime: {},
    transitionsPerTick: [],
    instability: {
      invalidValues: [],
      rapidOscillation: [],
      excessiveTransitions: []
    },
    summary: {
      totalTransitions: 0,
      maxTransitionsPerTick: 0
    }
  };
}

export function recordSimMetrics(metrics, worldState, previousState = null) {
  const boy = worldState.bubbleBoy;
  const tick = worldState.sim.tick;
  const energy = boy.energy;
  const actionLabel = classifyAction(worldState);
  const transition = countTransitions(worldState, previousState);

  metrics.ticks += 1;
  metrics.energy.min = Math.min(metrics.energy.min, energy);
  metrics.energy.max = Math.max(metrics.energy.max, energy);
  metrics.energy.sum += energy;
  metrics.energy.avg = metrics.energy.sum / metrics.ticks;
  metrics.actionDistribution[actionLabel] += 1;
  metrics.goalTime[boy.goal] = (metrics.goalTime[boy.goal] || 0) + 1;
  metrics.transitionsPerTick.push({
    tick,
    count: transition.count,
    changes: transition.changes
  });
  metrics.summary.totalTransitions += transition.count;
  metrics.summary.maxTransitionsPerTick = Math.max(
    metrics.summary.maxTransitionsPerTick,
    transition.count
  );

  detectInvalidValues(worldState, metrics.instability.invalidValues, tick);
  detectRapidOscillation(metrics.transitionsPerTick, metrics.instability, worldState);

  if (transition.count > 4) {
    metrics.instability.excessiveTransitions.push({
      tick,
      count: transition.count,
      changes: transition.changes
    });
  }

  return metrics;
}

export function finalizeSimMetrics(metrics) {
  if (metrics.ticks === 0) {
    metrics.energy.min = 0;
    metrics.energy.max = 0;
    metrics.energy.avg = 0;
  }
  for (const label of ACTION_LABELS) {
    metrics.actionDistribution[label] ||= 0;
  }
  return metrics;
}

export function hasInstability(metrics) {
  return (
    metrics.instability.invalidValues.length > 0 ||
    metrics.instability.rapidOscillation.length > 0 ||
    metrics.instability.excessiveTransitions.length > 0
  );
}

export function classifyAction(worldState) {
  const boy = worldState.bubbleBoy;
  if (boy.goal === "attendUser" || boy.attention === "userIntent" || boy.focus.kind === "player") {
    return "attend_user";
  }
  if (
    boy.goal === "gatherWood" ||
    boy.goal === "buildProject" ||
    boy.goal === "inspectBuildable" ||
    boy.goal === "celebrateBuild" ||
    boy.goal === "lifeBuildRestSpot" ||
    boy.goal === "lifeBuildStorage" ||
    boy.goal === "lifeDepositStorage" ||
    boy.goal === "lifeClearDebris" ||
    boy.goal === "lifeOrganizeTools" ||
    boy.goal === "lifeSweepCamp" ||
    boy.goal === "lifeMarkZone" ||
    boy.goal === "lifeInspectCamp" ||
    boy.currentAction === "gatheringWood" ||
    boy.currentAction === "building" ||
    boy.currentAction === "buildHammock" ||
    boy.currentAction === "sortMaterials" ||
    boy.currentAction === "depositStorage" ||
    boy.currentAction === "tidyCamp" ||
    boy.currentAction === "rakePath" ||
    boy.currentAction === "sweepLeaves" ||
    boy.currentAction === "kneelMarkZone" ||
    boy.currentAction === "inspectCampLayout" ||
    boy.currentAction === "inspect" ||
    boy.currentAction === "celebrate" ||
    boy.attention === "builder"
  ) {
    return "builder";
  }
  if (boy.goal === "interact" || boy.currentAction === "interacting") return "interact";
  if (
    boy.goal === "rest" ||
    boy.goal === "useBed" ||
    boy.currentAction === "resting" ||
    boy.currentAction === "sitting" ||
    boy.currentAction === "sleep"
  ) {
    return "rest";
  }
  if (
    boy.goal === "warmUp" ||
    boy.goal === "approachFire" ||
    boy.goal === "tendFire" ||
    boy.goal === "cookFish" ||
    boy.currentAction === "warmingHands" ||
    boy.currentAction === "tendingFire" ||
    boy.currentAction === "cookingFish"
  ) {
    return "gaze_fire";
  }
  return "wander";
}

function countTransitions(worldState, previousState) {
  if (!previousState) {
    return { count: 0, changes: [] };
  }

  const current = transitionFields(worldState);
  const previous = transitionFields(previousState);
  const changes = [];
  for (const key of Object.keys(current)) {
    if (current[key] !== previous[key]) {
      changes.push({ key, from: previous[key], to: current[key] });
    }
  }
  return { count: changes.length, changes };
}

function transitionFields(worldState) {
  return {
    goal: worldState.bubbleBoy.goal,
    currentAction: worldState.bubbleBoy.currentAction,
    attention: worldState.bubbleBoy.attention,
    focus: worldState.bubbleBoy.focus.kind,
    phase: worldState.time.phase
  };
}

function detectInvalidValues(value, invalidValues, tick, path = "worldState") {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      invalidValues.push({ tick, path, value: String(value) });
    }
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => detectInvalidValues(item, invalidValues, tick, `${path}[${index}]`));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    detectInvalidValues(child, invalidValues, tick, `${path}.${key}`);
  }
}

function detectRapidOscillation(transitionsPerTick, instability, worldState) {
  const recentActionChanges = transitionsPerTick
    .filter((entry) => entry.changes.some((change) => change.key === "currentAction"))
    .slice(-4);
  if (recentActionChanges.length < 4) return;

  const actions = recentActionChanges.map((entry) => {
    const actionChange = entry.changes.find((change) => change.key === "currentAction");
    return actionChange.to;
  });
  const alternates = actions[0] === actions[2] && actions[1] === actions[3] && actions[0] !== actions[1];
  const windowTicks = recentActionChanges.at(-1).tick - recentActionChanges[0].tick;
  const compactWindow = windowTicks <= 12;
  if (alternates && compactWindow) {
    instability.rapidOscillation.push({
      tick: worldState.sim.tick,
      actions,
      windowTicks
    });
  }
}
