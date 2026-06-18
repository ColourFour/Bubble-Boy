const SAMPLE_RATE_FALLBACK = 44100;
const MASTER_GAIN = 0.42;

function createSeededNoise(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return (state / 0xffffffff) * 2 - 1;
  };
}

function createAmbientBuffer(audioCtx, seconds, seed, shapeSample) {
  const sampleRate = audioCtx.sampleRate || SAMPLE_RATE_FALLBACK;
  const frameCount = Math.max(1, Math.floor(sampleRate * seconds));
  const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
  const samples = buffer.getChannelData(0);
  const noise = createSeededNoise(seed);
  let previous = 0;

  for (let index = 0; index < frameCount; index += 1) {
    const phase = index / frameCount;
    previous = previous * 0.82 + noise() * 0.18;
    samples[index] = shapeSample(previous, phase, index / sampleRate);
  }

  return buffer;
}

function createWindBuffer(audioCtx) {
  return createAmbientBuffer(audioCtx, 3.0, 0x57494e44, (noise, phase) => {
    const loopFade = Math.sin(phase * Math.PI);
    return noise * loopFade * 0.34;
  });
}

function createOceanBuffer(audioCtx) {
  return createAmbientBuffer(audioCtx, 4.0, 0x4f434541, (noise, phase, seconds) => {
    const loopFade = Math.sin(phase * Math.PI);
    const swell =
      Math.sin(seconds * Math.PI * 2 * 0.32) * 0.18 +
      Math.sin(seconds * Math.PI * 2 * 0.57 + 1.1) * 0.12;
    return (swell + noise * 0.08) * loopFade;
  });
}

function createFireBuffer(audioCtx) {
  return createAmbientBuffer(audioCtx, 1.6, 0x46495245, (noise, phase, seconds) => {
    const loopFade = Math.sin(phase * Math.PI);
    const crackle = Math.max(0, noise - 0.52) * 0.8;
    const bed = Math.sin(seconds * Math.PI * 2 * 7.2) * 0.035;
    return (noise * 0.18 + crackle + bed) * loopFade;
  });
}

function connectGain(audioCtx, destination, initialGain = 0) {
  const gain = audioCtx.createGain();
  gain.gain.value = initialGain;
  gain.connect(destination);
  return gain;
}

function createContext() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  return AudioContextCtor ? new AudioContextCtor() : null;
}

function installAudioResumeHandlers(audioCtx) {
  const resume = () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  };
  window.addEventListener("pointerdown", resume, { passive: true });
  window.addEventListener("keydown", resume, { passive: true });
}

export async function initializeAudio() {
  const ctx = createContext();
  if (!ctx) return null;

  const masterGain = connectGain(ctx, ctx.destination, MASTER_GAIN);
  const windGain = connectGain(ctx, masterGain, 0);
  const oceanGain = connectGain(ctx, masterGain, 0);
  const fireGain = connectGain(ctx, masterGain, 0);
  const fireFilter = ctx.createBiquadFilter();
  fireFilter.type = "lowpass";
  fireFilter.frequency.value = 1200;
  fireFilter.Q.value = 0.5;
  fireFilter.connect(fireGain);

  const audioNodes = {
    ctx,
    windGain,
    oceanGain,
    fireGain,
    fireFilter,
    masterGain,
    buffers: {
      wind: createWindBuffer(ctx),
      ocean: createOceanBuffer(ctx),
      fire: createFireBuffer(ctx)
    },
    sources: {
      wind: null,
      ocean: null,
      fire: null
    },
    enabled: true
  };

  installAudioResumeHandlers(ctx);
  return audioNodes;
}
