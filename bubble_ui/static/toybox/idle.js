function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothValue(current, target, deltaSeconds, speed) {
  return current + (target - current) * (1 - Math.exp(-deltaSeconds * speed));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function createBehaviorState() {
  return {
    attention: 0,
    curiosity: 0,
    comfort: 0,
    stimulus: 0
  };
}

export function updateBehaviorState(state, deltaSeconds, envState) {
  const time = envState.time || 0;
  const fireIntensity = clamp(envState.fireIntensity || 0, 0, 1);
  const windStrength = clamp(envState.windStrength || 0, 0, 1);
  const windGust = clamp(((envState.wind && envState.wind.gust) || 0.58) - 0.58, 0, 0.72) / 0.72;
  const ambientEnergy = clamp(envState.ambientEnergy == null ? 0.34 : envState.ambientEnergy, 0, 1);
  const emotionalField = clamp(envState.emotionalField || 0, 0, 1);
  const fireCoherence = clamp(envState.fireCoherence == null ? fireIntensity : envState.fireCoherence, 0, 1);
  const playerActive = Boolean(envState.playerActive);
  const playerDistance = envState.playerDistance == null ? 8 : envState.playerDistance;
  const playerNear = 1 - smoothstep(1.4, 8.4, playerDistance);
  const dayFactor = clamp(envState.dayFactor || 0, 0, 1);
  const nightFactor = clamp(envState.nightFactor || 0, 0, 1);
  const twilightFactor = envState.timeOfDay === "twilight" ? 1 : envState.timeOfDay === "dawn" ? 0.45 : 0;
  const environmentalMotion = clamp(windStrength * 1.12 + windGust * 0.42 + emotionalField * 0.18, 0, 1);
  const flamePulse = (0.5 + Math.sin(time * 4.2) * 0.5) * fireIntensity;
  const quietScan = 0.5 + Math.sin(time * 0.09 + 1.4) * 0.5;
  const fireAnchor = clamp(fireIntensity * 0.62 + fireCoherence * 0.38, 0, 1);

  const stimulusTarget = clamp(
    (playerActive ? 0.92 : 0) +
      playerNear * (playerActive ? 0.24 : 0.08) +
      fireIntensity * 0.13 +
      flamePulse * 0.11 +
      windGust * 0.18 +
      emotionalField * (0.10 + twilightFactor * 0.12) +
      environmentalMotion * 0.12 -
      fireAnchor * 0.08,
    0,
    1
  );
  const attentionTarget = clamp(
    0.22 +
      fireIntensity * 0.26 +
      fireAnchor * 0.22 +
      playerNear * (playerActive ? 0.30 : 0.10) +
      stimulusTarget * 0.16,
    0,
    1
  );
  const comfortTarget = clamp(
    0.32 +
      fireIntensity * 0.28 +
      fireAnchor * 0.22 +
      nightFactor * 0.10 +
      quietScan * 0.08 -
      stimulusTarget * 0.18 -
      environmentalMotion * 0.06 -
      emotionalField * 0.08,
    0,
    1
  );
  const curiosityTarget = clamp(
    0.18 +
      environmentalMotion * 0.27 +
      dayFactor * 0.12 +
      twilightFactor * 0.12 +
      ambientEnergy * 0.08 +
      (1 - comfortTarget) * 0.18 +
      stimulusTarget * 0.18 +
      quietScan * 0.10 -
      fireAnchor * 0.04,
    0,
    1
  );

  state.attention = smoothValue(state.attention, attentionTarget, deltaSeconds, playerActive ? 5.6 : 1.65);
  state.curiosity = smoothValue(state.curiosity, curiosityTarget, deltaSeconds, 0.78);
  state.comfort = smoothValue(state.comfort, comfortTarget, deltaSeconds, stimulusTarget > 0.68 ? 1.85 : 0.66);
  state.stimulus = smoothValue(state.stimulus, stimulusTarget, deltaSeconds, playerActive ? 8.0 : 2.4);

  return {
    attention: state.attention,
    curiosity: state.curiosity,
    comfort: state.comfort,
    stimulus: state.stimulus
  };
}
