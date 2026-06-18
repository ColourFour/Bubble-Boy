import { createHash } from "node:crypto";

const DEFAULT_INTERVAL = 60;

export function captureSnapshot(worldState, tick = worldState && worldState.sim && worldState.sim.tick) {
  return {
    tick,
    state: serializeWorldState(worldState),
    hash: hashState(worldState)
  };
}

export function captureSnapshots(worldState, snapshots, options = {}) {
  const interval = Math.max(1, Math.floor(options.interval || DEFAULT_INTERVAL));
  const tick = worldState.sim.tick;
  if (tick === 0 || tick % interval === 0 || options.force) {
    const last = snapshots[snapshots.length - 1];
    if (!last || last.tick !== tick) {
      snapshots.push(captureSnapshot(worldState, tick));
    }
  }
  return snapshots;
}

export function serializeWorldState(worldState) {
  return stableClone(worldState);
}

export function hashState(worldState) {
  return createHash("sha256").update(stableStringify(serializeWorldState(worldState))).digest("hex");
}

export function snapshotsEqual(left, right) {
  return stableStringify(left) === stableStringify(right);
}

export function stableStringify(value) {
  return JSON.stringify(stableClone(value));
}

function stableClone(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stableClone(item));
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  const clone = {};
  for (const key of Object.keys(value).sort()) {
    clone[key] = stableClone(value[key]);
  }
  return clone;
}
