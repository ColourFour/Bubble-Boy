const FIRE_PIT_ID = "fire-pit";
const PARAM_RAMP_SECONDS = 0.18;

function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function setGain(gainNode, value, now) {
  if (!gainNode || !gainNode.gain) return;
  gainNode.gain.setTargetAtTime(clamp01(value), now, PARAM_RAMP_SECONDS);
}

function connectSource(source, audioNodes, key) {
  if (key === "fire" && audioNodes.fireFilter) {
    source.connect(audioNodes.fireFilter);
    return;
  }
  source.connect(audioNodes[`${key}Gain`]);
}

function startLoop(audioCtx, audioNodes, key) {
  if (!audioCtx || !audioNodes || audioNodes.sources[key] || !audioNodes.buffers[key]) {
    return null;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = audioNodes.buffers[key];
  source.loop = true;
  connectSource(source, audioNodes, key);
  source.start();
  audioNodes.sources[key] = source;
  return source;
}

function stopLoop(audioNodes, key, now) {
  const source = audioNodes && audioNodes.sources[key];
  if (!source) return;
  source.stop(now + PARAM_RAMP_SECONDS);
  audioNodes.sources[key] = null;
}

function oceanGainFromTimeOfDay(timeOfDay) {
  const t = clamp01(timeOfDay);
  const nightCalm = Math.max(0, Math.cos((t - 0.5) * Math.PI * 2));
  return 0.22 + nightCalm * 0.05;
}

export function updateAudio(worldState, audioCtx, audioNodes) {
  if (!worldState || !audioCtx || !audioNodes) return;
  if (!audioNodes.enabled || audioCtx.state === "closed") return;

  const now = audioCtx.currentTime;
  startLoop(audioCtx, audioNodes, "wind");
  startLoop(audioCtx, audioNodes, "ocean");

  const windStrength = clamp01(worldState.environment && worldState.environment.wind
    ? worldState.environment.wind.strength
    : 0);
  const timeOfDay = worldState.time ? worldState.time.timeOfDay : 0;
  const firePit = worldState.objects ? worldState.objects[FIRE_PIT_ID] : null;
  const fireLit = Boolean(firePit && firePit.lit);
  const fireWarmth = clamp01(firePit ? firePit.warmth : 0);
  const fireIntensity = clamp01(
    worldState.environment && worldState.environment.light
      ? worldState.environment.light.fireIntensity
      : fireWarmth
  );

  setGain(audioNodes.windGain, windStrength, now);
  setGain(audioNodes.oceanGain, oceanGainFromTimeOfDay(timeOfDay), now);
  setGain(audioNodes.fireGain, fireLit ? fireWarmth * fireIntensity : 0, now);

  if (audioNodes.fireFilter && audioNodes.fireFilter.frequency) {
    audioNodes.fireFilter.frequency.setTargetAtTime(
      650 + fireIntensity * 1350,
      now,
      PARAM_RAMP_SECONDS
    );
  }

  if (fireLit) {
    startLoop(audioCtx, audioNodes, "fire");
  } else {
    stopLoop(audioNodes, "fire", now);
  }
}
