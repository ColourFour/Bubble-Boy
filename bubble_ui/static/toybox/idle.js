export const idleDelaySeconds = 4.0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothValue(current, target, deltaSeconds, speed) {
  return current + (target - current) * (1 - Math.exp(-deltaSeconds * speed));
}

export function createIdleState() {
  return {
    calmFactor: 0,
    curiosityFactor: 0,
    spikeFactor: 0,
    inactiveTime: 0,
    wasPlayerActive: false
  };
}

export function updateIdleState(state, deltaSeconds, envState) {
  const playerActive = Boolean(envState.playerActive);
  const time = envState.time || 0;
  const fireIntensity = clamp(envState.fireIntensity || 0, 0, 1);
  const nightFactor = envState.timeOfDay === "night" ? 1 : envState.timeOfDay === "twilight" ? 0.35 : 0;

  if (playerActive) {
    state.inactiveTime = 0;
    if (!state.wasPlayerActive) state.spikeFactor = 1;
  } else {
    state.inactiveTime += deltaSeconds;
  }

  const idleDepth = clamp((state.inactiveTime - idleDelaySeconds) / 18, 0, 1);
  const curiosityWave = 0.5 + Math.sin(time * 0.17 + 0.8) * 0.5;
  const calmTarget = playerActive ? 0.10 : clamp(0.34 + idleDepth * 0.54 + nightFactor * 0.12, 0, 1);
  const curiosityTarget = playerActive
    ? 0.04
    : clamp(0.12 + idleDepth * (0.20 + curiosityWave * 0.16) + fireIntensity * 0.08 - nightFactor * 0.05, 0, 1);

  state.calmFactor = smoothValue(state.calmFactor, calmTarget, deltaSeconds, playerActive ? 18 : 0.90);
  state.curiosityFactor = smoothValue(state.curiosityFactor, curiosityTarget, deltaSeconds, playerActive ? 18 : 0.62);
  state.spikeFactor = smoothValue(state.spikeFactor, 0, deltaSeconds, playerActive ? 8.5 : 4.2);
  state.wasPlayerActive = playerActive;

  return {
    calmFactor: state.calmFactor,
    curiosityFactor: state.curiosityFactor,
    spikeFactor: state.spikeFactor
  };
}
