export const FIXED_DT = 1 / 60;

export const BUBBLE_BOY_ID = "bubble-boy";
export const FIRE_PIT_ID = "fire-pit";

export const PHASE_TIME = {
  night: 0.0,
  dawn: 0.258,
  day: 0.5,
  twilight: 0.75,
  dusk: 0.75
};

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function finiteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

export function smoothValue(current, target, dt, speed) {
  return current + (target - current) * (1 - Math.exp(-dt * speed));
}

export function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function angleDistance(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

export function distance2d(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function vec3(x = 0, y = 0, z = 0) {
  return { x, y, z };
}

export function vec3ToArray(vector) {
  return [vector.x, vector.y, vector.z];
}

export function normalizePhase(value) {
  const key = String(value || "").toLowerCase();
  return Object.prototype.hasOwnProperty.call(PHASE_TIME, key) ? key : "twilight";
}

export function createInitialWorldState(options = {}) {
  const toyboxState = options.toyboxState || {};
  const phase = normalizePhase(toyboxState.time_of_day || "twilight");
  const timeOfDay = PHASE_TIME[phase];
  const dayLengthSeconds = finiteNumber(options.dayLengthSeconds, 600);
  const mood = typeof toyboxState.mood === "string" ? toyboxState.mood : "calm";
  const weather = typeof toyboxState.weather === "string" ? toyboxState.weather : "clear";

  return normalizeWorldState({
    version: 1,
    sim: {
      tick: 0,
      elapsedSeconds: timeOfDay * dayLengthSeconds,
      fixedDt: FIXED_DT,
      seed: finiteNumber(options.seed, 1),
      paused: false
    },
    time: {
      day: 1,
      timeOfDay,
      dayLengthSeconds,
      phase
    },
    bubbleBoy: {
      id: BUBBLE_BOY_ID,
      energy: 100,
      hunger: 0,
      mood,
      attention: "idle",
      goal: "wander",
      currentAction: "idle",
      position: vec3(0.92, 0.2, 0.08),
      velocity: vec3(0, 0, 0),
      facing: 1.78,
      targetId: null,
      actionTimer: 0,
      minActionTime: 0,
      affect: {
        attention: 0.18,
        curiosity: 0.24,
        comfort: 0.46,
        stimulus: 0.08
      },
      focus: {
        kind: "default",
        position: vec3(-0.25, 0.92, 0.33),
        strength: 0.18
      },
      pose: {
        dominant: "observe",
        weights: {
          gaze_follow: 0,
          slow_turn: 0,
          sway_alignment: 0,
          settle: 0,
          micro_bounce: 0,
          wind_brace: 0,
          observe: 1
        },
        gazeX: 0,
        gazeY: 0,
        bounce: 0,
        scan: 0,
        settle: 0,
        breathEnergy: 0.42
      }
    },
    environment: {
      weather,
      weatherIntensity: weather === "storm" ? 0.62 : 0,
      wind: {
        direction: 0.64,
        vector: vec3(1, 0, 0),
        strength: 0.18,
        gust: 0
      },
      temperature: 20,
      ambientEnergy: 0.34,
      emotionalField: 0.12,
      dayFactor: 0,
      nightFactor: 1,
      light: {
        timeOfDay,
        sourceLevel: 0,
        sunIntensity: 0,
        moonIntensity: 0,
        fireIntensity: 0.7,
        sunPosition: vec3(0, -128, 0),
        moonPosition: vec3(0, 128, 0),
        sunDirection: vec3(0, 1, 0),
        moonDirection: vec3(0, 1, 0),
        sunColor: [1.0, 0.92, 0.78],
        moonColor: [0.42, 0.55, 0.86],
        fireColor: [1.0, 0.38, 0.1],
        dominantSource: "moon",
        sky: [0.008, 0.02, 0.052],
        fogColor: [0.035, 0.06, 0.11],
        fogDensity: 0.18
      },
      safety: {
        nightRisk: 0,
        shelterAvailable: false
      }
    },
    objects: {
      [FIRE_PIT_ID]: {
        id: FIRE_PIT_ID,
        type: "firePit",
        position: vec3(0, 0.62, -0.16),
        lit: true,
        warmth: 1,
        fuel: 100,
        warmthRadius: 4.4
      }
    },
    entities: {},
    intents: [],
    events: []
  });
}

export function normalizeWorldState(worldState) {
  const state = worldState;
  state.version = 1;
  state.sim.tick = Math.max(0, Math.floor(finiteNumber(state.sim.tick, 0)));
  state.sim.elapsedSeconds = Math.max(0, finiteNumber(state.sim.elapsedSeconds, 0));
  state.sim.fixedDt = finiteNumber(state.sim.fixedDt, FIXED_DT);
  state.sim.seed = finiteNumber(state.sim.seed, 1);

  state.time.day = Math.max(1, Math.floor(finiteNumber(state.time.day, 1)));
  state.time.timeOfDay = wrap01(finiteNumber(state.time.timeOfDay, 0));
  state.time.dayLengthSeconds = Math.max(1, finiteNumber(state.time.dayLengthSeconds, 600));
  state.time.phase = normalizePhase(state.time.phase);

  const boy = state.bubbleBoy;
  boy.energy = clamp(finiteNumber(boy.energy, 100), 0, 100);
  boy.hunger = clamp(finiteNumber(boy.hunger, 0), 0, 100);
  boy.facing = finiteNumber(boy.facing, 0);
  boy.actionTimer = Math.max(0, finiteNumber(boy.actionTimer, 0));
  boy.minActionTime = Math.max(0, finiteNumber(boy.minActionTime, 0));
  normalizeVector(boy.position);
  normalizeVector(boy.velocity);
  normalizeVector(boy.focus.position);

  const affect = boy.affect;
  affect.attention = clamp(finiteNumber(affect.attention, 0), 0, 1);
  affect.curiosity = clamp(finiteNumber(affect.curiosity, 0), 0, 1);
  affect.comfort = clamp(finiteNumber(affect.comfort, 0), 0, 1);
  affect.stimulus = clamp(finiteNumber(affect.stimulus, 0), 0, 1);

  const pose = boy.pose;
  pose.gazeX = finiteNumber(pose.gazeX, 0);
  pose.gazeY = finiteNumber(pose.gazeY, 0);
  pose.bounce = finiteNumber(pose.bounce, 0);
  pose.scan = finiteNumber(pose.scan, 0);
  pose.settle = clamp(finiteNumber(pose.settle, 0), 0, 1);
  pose.breathEnergy = clamp(finiteNumber(pose.breathEnergy, 0.42), 0, 1);
  pose.weights.wind_brace = clamp(finiteNumber(pose.weights.wind_brace, 0), 0, 1);

  const env = state.environment;
  env.weatherIntensity = clamp(finiteNumber(env.weatherIntensity, env.weather === "storm" ? 0.62 : 0), 0, 1);
  env.temperature = finiteNumber(env.temperature, 20);
  env.ambientEnergy = clamp(finiteNumber(env.ambientEnergy, 0.34), 0, 1);
  env.emotionalField = clamp(finiteNumber(env.emotionalField, 0.12), 0, 1);
  env.dayFactor = clamp(finiteNumber(env.dayFactor, 0), 0, 1);
  env.nightFactor = clamp(finiteNumber(env.nightFactor, 1), 0, 1);
  env.wind.direction = finiteNumber(env.wind.direction, 0);
  env.wind.strength = clamp(finiteNumber(env.wind.strength, 0), 0, 1);
  env.wind.gust = clamp(finiteNumber(env.wind.gust, 0), 0, 1);
  normalizeVector(env.wind.vector);
  env.safety.nightRisk = clamp(finiteNumber(env.safety.nightRisk, 0), 0, 1);

  const firePit = state.objects[FIRE_PIT_ID];
  normalizeVector(firePit.position);
  firePit.warmth = clamp(finiteNumber(firePit.warmth, 0), 0, 1);
  firePit.fuel = clamp(finiteNumber(firePit.fuel, 0), 0, 100);
  firePit.warmthRadius = Math.max(0, finiteNumber(firePit.warmthRadius, 0));

  return state;
}

export function wrap01(value) {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
}

function normalizeVector(vector) {
  vector.x = finiteNumber(vector.x, 0);
  vector.y = finiteNumber(vector.y, 0);
  vector.z = finiteNumber(vector.z, 0);
}
