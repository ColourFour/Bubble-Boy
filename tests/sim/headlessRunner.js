import { simulate } from "../../bubble_ui/static/toybox/simulation/simulate.js";
import {
  FIXED_DT,
  createInitialWorldState,
  normalizeWorldState
} from "../../bubble_ui/static/toybox/simulation/worldState.js";
import { captureSnapshot, captureSnapshots, hashState, serializeWorldState } from "./snapshot.js";
import { createSimMetrics, finalizeSimMetrics, recordSimMetrics } from "./simMetrics.js";

const DEFAULT_TICKS = 10000;
const DEFAULT_SNAPSHOT_INTERVAL = 60;

export function runSimulation({
  ticks = DEFAULT_TICKS,
  seed = 1,
  worldState = null,
  intents = [],
  snapshotInterval = DEFAULT_SNAPSHOT_INTERVAL
} = {}) {
  const totalTicks = Math.max(0, Math.floor(ticks));
  const state = prepareInitialState(worldState, seed);
  const snapshots = [captureSnapshot(state, state.sim.tick)];
  const metrics = createSimMetrics();
  let previousState = captureTransitionState(state);

  for (let index = 0; index < totalTicks; index += 1) {
    const tickIntents = intentsForTick(intents, state.sim.tick + 1, state);
    simulate(FIXED_DT, state, tickIntents);
    recordSimMetrics(metrics, state, previousState);
    captureSnapshots(state, snapshots, { interval: snapshotInterval });
    previousState = captureTransitionState(state);
  }

  captureSnapshots(state, snapshots, { interval: snapshotInterval, force: true });

  return {
    finalState: serializeWorldState(state),
    finalStateHash: hashState(state),
    snapshots,
    metrics: finalizeSimMetrics(metrics),
    summary: {
      ticks: totalTicks,
      fixedDt: FIXED_DT,
      finalTick: state.sim.tick,
      elapsedSeconds: state.sim.elapsedSeconds,
      snapshotCount: snapshots.length
    }
  };
}

function prepareInitialState(worldState, seed) {
  const state = worldState ? clonePlainObject(worldState) : createInitialWorldState({ seed });
  state.sim.seed = seed;
  state.sim.fixedDt = FIXED_DT;
  return normalizeWorldState(state);
}

function intentsForTick(intentStream, tick, state) {
  if (!Array.isArray(intentStream) || intentStream.length === 0) return [];

  if (Array.isArray(intentStream[tick])) {
    return clonePlainObject(intentStream[tick]);
  }

  const scheduled = [];
  let hasScheduledEntries = false;
  for (const entry of intentStream) {
    if (!entry || typeof entry !== "object") continue;
    if (Number.isInteger(entry.tick)) {
      hasScheduledEntries = true;
      if (entry.tick === tick) {
        if (Array.isArray(entry.intents)) {
          scheduled.push(...entry.intents);
        } else if (typeof entry.type === "string") {
          scheduled.push(entry);
        }
      }
    }
  }

  if (hasScheduledEntries) {
    return clonePlainObject(scheduled);
  }

  return clonePlainObject(intentStream);
}

function clonePlainObject(value) {
  return JSON.parse(JSON.stringify(value));
}

function captureTransitionState(state) {
  return {
    bubbleBoy: {
      goal: state.bubbleBoy.goal,
      currentAction: state.bubbleBoy.currentAction,
      attention: state.bubbleBoy.attention,
      focus: {
        kind: state.bubbleBoy.focus.kind
      }
    },
    time: {
      phase: state.time.phase
    }
  };
}
