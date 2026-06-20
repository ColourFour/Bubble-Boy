import {
  BUILD_SITE_ID,
  BUILDER_TREE_IDS,
  FIRE_PIT_ID,
  WORKBENCH_ID,
  angleDistance,
  clamp,
  distance2d,
  finiteNumber,
  normalizeWorldState,
  smoothValue,
  smoothstep,
  vec3,
  wrap01
} from "./worldState.js";

const TAU = Math.PI * 2;
const CELESTIAL_RADIUS = 128;
const CELESTIAL_HORIZON_Y = 1.8;
const WORLD_RADIUS_SCALE = 14.0;
const BUBBLE_BOY_RADIUS = 0.62;
const BUBBLE_BOY_SIZE = BUBBLE_BOY_RADIUS * 2;
const BUBBLE_BOY_CLEARANCE = BUBBLE_BOY_SIZE * 3;
const WATER_CLEAR_INSET = BUBBLE_BOY_RADIUS + BUBBLE_BOY_CLEARANCE;
const FIRE_VISUAL_RADIUS = 0.86;
const FIRE_CLEAR_RADIUS = FIRE_VISUAL_RADIUS + BUBBLE_BOY_RADIUS + BUBBLE_BOY_CLEARANCE;
const FIRE_WORK_RADIUS = FIRE_CLEAR_RADIUS + 0.35;
const WANDER_SEGMENT_SECONDS = 4.6;
const BUILDER_WORK_RADIUS = 1.18;
const BUILDER_MIN_WOOD_TO_BUILD = 0.35;
const BUILDER_GATHER_RATE = 0.58;
const BUILDER_BUILD_RATE = 0.5;
const BUILDER_TREE_REGROW_RATE = 0.016;
const FISHING_TARGET_ID = "ocean-fishing-spot";
const FISHING_WORK_RADIUS = 1.65;
const AUTONOMOUS_FISHING_HUNGER = 1.0;
const URGENT_FORAGE_HUNGER = 80;
const COOKED_FISH_NUTRITION = 36;

const ACTION_MIN_SECONDS = {
  idle: 0.8,
  lookingAround: 0.55,
  walking: 1.55,
  resting: 2.5,
  warmingHands: 2.0,
  tendingFire: 1.8,
  sitting: 2.0,
  interacting: 1.2,
  foraging: 2.2,
  fishing: 2.6,
  cookingFish: 1.8,
  eatingFish: 1.4,
  gatheringWood: 1.4,
  building: 1.6
};

export function simulate(dt, worldState, intents = []) {
  const state = normalizeWorldState(worldState);
  const safeDt = clamp(finiteNumber(dt, state.sim.fixedDt), 0, 0.25);
  const normalizedIntents = normalizeIntents(intents);
  state.events = [];
  state.intents = normalizedIntents;

  applyControlIntents(state, normalizedIntents);
  if (state.sim.paused || safeDt <= 0) {
    return state;
  }

  const previousPhase = state.time.phase;
  const previousGoal = state.bubbleBoy.goal;
  const previousAction = state.bubbleBoy.currentAction;
  const previousAttention = state.bubbleBoy.attention;

  state.sim.tick += 1;
  state.sim.elapsedSeconds += safeDt;

  updateTime(state);
  updateEnvironment(state, safeDt);
  updateObjects(state, safeDt);
  updateBubbleBoy(state, safeDt, normalizedIntents);
  clampInvariants(state);

  if (previousPhase !== state.time.phase) {
    state.events.push({
      tick: state.sim.tick,
      type: "environmentChanged",
      key: "time.phase",
      value: state.time.phase
    });
  }
  if (previousGoal !== state.bubbleBoy.goal) {
    state.events.push({
      tick: state.sim.tick,
      type: "goalChanged",
      entityId: state.bubbleBoy.id,
      from: previousGoal,
      to: state.bubbleBoy.goal
    });
  }
  if (previousAction !== state.bubbleBoy.currentAction) {
    state.events.push({
      tick: state.sim.tick,
      type: "actionChanged",
      entityId: state.bubbleBoy.id,
      from: previousAction,
      to: state.bubbleBoy.currentAction
    });
  }
  if (previousAttention !== state.bubbleBoy.attention) {
    state.events.push({
      tick: state.sim.tick,
      type: "attentionChanged",
      entityId: state.bubbleBoy.id,
      from: previousAttention,
      to: state.bubbleBoy.attention
    });
  }

  return state;
}

export function activeCelestialSourceFromIntensities(sunIntensity, moonIntensity) {
  const sun = clamp(finiteNumber(sunIntensity, 0), 0, 1.4);
  const moon = clamp(finiteNumber(moonIntensity, 0), 0, 1.0);
  return sun >= moon * 1.15 || sun > 0.06 ? "sun" : "moon";
}

export function normalizeIntents(intents) {
  if (!Array.isArray(intents)) return [];
  const normalized = [];
  for (const intent of intents) {
    if (!intent || typeof intent.type !== "string") continue;
    if (intent.type === "pause") {
      normalized.push({ type: "pause", value: Boolean(intent.value) });
    } else if (intent.type === "userPresence") {
      normalized.push({
        type: "userPresence",
        active: Boolean(intent.active),
        position: normalizePosition(intent.position, vec3(0, 0.96, 0)),
        ageSeconds: Math.max(0, finiteNumber(intent.ageSeconds, 999))
      });
    } else if (intent.type === "interact") {
      normalized.push({
        type: "interact",
        targetId: typeof intent.targetId === "string" ? intent.targetId : null
      });
    } else if (intent.type === "move") {
      normalized.push({
        type: "move",
        direction: {
          x: clamp(finiteNumber(intent.direction && intent.direction.x, 0), -1, 1),
          z: clamp(finiteNumber(intent.direction && intent.direction.z, 0), -1, 1)
        }
      });
    }
  }
  return normalized;
}

function applyControlIntents(state, intents) {
  for (const intent of intents) {
    if (intent.type === "pause") {
      state.sim.paused = intent.value;
    }
  }
}

function updateTime(state) {
  const dayLength = Math.max(1, state.time.dayLengthSeconds);
  const absoluteDay = state.sim.elapsedSeconds / dayLength;
  state.time.day = Math.floor(absoluteDay) + 1;
  state.time.timeOfDay = wrap01(absoluteDay);
  state.time.phase = phaseNameFromTime(state.time.timeOfDay);
}

function updateEnvironment(state, dt) {
  const timeOfDay = state.time.timeOfDay;
  const absoluteSeconds = state.sim.elapsedSeconds;
  const env = state.environment;
  const firePit = state.objects[FIRE_PIT_ID];
  const dayFactor = dayFactorFromTime(timeOfDay);
  const nightFactor = 1 - dayFactor;
  const dawn = cyclePulse(timeOfDay, 0.25, 0.085);
  const sunset = cyclePulse(timeOfDay, 0.75, 0.095);
  const warmFactor = clamp(Math.max(dawn, sunset), 0, 1);
  const twilightFactor = clamp(sunset, 0, 1);
  const noonFactor = cyclePulse(timeOfDay, 0.5, 0.22);
  const emotionalField = clamp(env.emotionalField, 0, 1);
  const light = env.light;
  const stormTarget = env.weather === "storm" ? 1 : env.weather === "rain" ? 0.55 : 0;
  env.weatherIntensity = smoothValue(env.weatherIntensity, stormTarget, dt, stormTarget > env.weatherIntensity ? 1.8 : 0.8);
  const weatherIntensity = clamp(env.weatherIntensity, 0, 1);

  const sunPosition = celestialPositionFromCycle(timeOfDay);
  const moonPosition = celestialPositionFromCycle(timeOfDay + 0.5);
  const sunAltitude = (sunPosition.y - CELESTIAL_HORIZON_Y) / CELESTIAL_RADIUS;
  const moonAltitude = (moonPosition.y - CELESTIAL_HORIZON_Y) / CELESTIAL_RADIUS;
  const sunPresence = smoothstep(-0.14, 0.18, sunAltitude);
  const moonPresence = smoothstep(-0.12, 0.20, moonAltitude);
  const sunPeak = Math.pow(clamp(sunAltitude, 0, 1), 0.55);
  const moonPeak = Math.pow(clamp(moonAltitude, 0, 1), 0.62);
  const sunExposure = 0.52 + sunPeak * 0.46;
  const moonExposure = 0.11 + moonPeak * 0.16;
  const rawSunIntensity = clamp(sunExposure * sunPresence * (1 - weatherIntensity * 0.18), 0, 0.98);
  const rawMoonIntensity = clamp(moonExposure * moonPresence * (1 - weatherIntensity * 0.10), 0, 0.28);
  const activeCelestialSource = activeCelestialSourceFromIntensities(rawSunIntensity, rawMoonIntensity);
  const celestialExposure =
    activeCelestialSource === "sun" ? sunExposure * sunPresence : moonExposure * moonPresence;

  light.timeOfDay = timeOfDay;
  light.sunPosition = sunPosition;
  light.moonPosition = moonPosition;
  light.sunDirection = normalizeVector3(sunPosition);
  light.moonDirection = normalizeVector3(moonPosition);
  light.sunIntensity = activeCelestialSource === "sun" ? rawSunIntensity : 0;
  light.moonIntensity = activeCelestialSource === "moon" ? rawMoonIntensity : 0;
  light.sourceLevel = clamp(celestialExposure, 0, 0.98);
  light.sunColor = blendColor(
    sunset > dawn ? [1.0, 0.62, 0.38] : [1.0, 0.76, 0.46],
    [1.0, 0.94, 0.82],
    clamp(noonFactor + dayFactor * 0.26, 0, 1)
  );
  light.moonColor = blendColor([0.34, 0.48, 0.84], [0.50, 0.62, 0.92], moonPeak * 0.42);

  const fuelFactor = firePit.lit ? clamp(firePit.fuel / 100, 0, 1) : 0;
  const firePulse =
    0.96 +
    Math.sin(absoluteSeconds * 3.1) * 0.025 +
    Math.sin(absoluteSeconds * 1.47 + 1.2) * 0.018;
  light.fireIntensity = clamp(
    (0.56 + nightFactor * 0.2 + warmFactor * 0.035) * firePulse * fuelFactor,
    firePit.lit ? 0.42 : 0,
    firePit.lit ? 0.84 : 0
  );
  light.fireColor = [1.0, 0.38, 0.1];
  light.dominantSource = dominantLightSource(light);

  const fireStability = clamp((light.fireIntensity - 0.5) / 0.34, 0, 1);
  const fireDamping = clamp(fireStability * (0.24 + (1 - emotionalField) * 0.28), 0, 0.54);
  const emotionalVariance = clamp(emotionalField * (0.1 + twilightFactor * 0.18) + light.sourceLevel * 0.08, 0, 0.3);

  env.dayFactor = dayFactor;
  env.nightFactor = nightFactor;
  env.ambientEnergy = smoothValue(env.ambientEnergy, light.sourceLevel, dt, 3.0);
  env.temperature = 10 + dayFactor * 12 + warmFactor * 2 + light.fireIntensity * 1.2;
  env.safety.nightRisk = clamp(nightFactor * (firePit.lit ? 0.52 : 0.82) - firePit.warmth * 0.18, 0, 1);

  const daySky = [0.066, 0.186, 0.315];
  const nightSky = [0.006, 0.016, 0.046];
  const warmSky = sunset > dawn ? [0.155, 0.074, 0.062] : [0.250, 0.160, 0.100];
  const dawnBlue = [0.060, 0.120, 0.255];
  const clearSky = addColor(
    addColor(blendColor(nightSky, daySky, dayFactor), scaleColor(dawnBlue, dawn * 0.90)),
    scaleColor(warmSky, warmFactor * 0.48)
  );
  light.sky = blendColor(clearSky, [0.025, 0.036, 0.058], weatherIntensity * 0.38);

  const clearFog = addColor(
    blendColor([0.026, 0.052, 0.102], [0.13, 0.176, 0.192], dayFactor),
    scaleColor(sunset > dawn ? [0.30, 0.105, 0.044] : [0.42, 0.235, 0.105], warmFactor * 0.58)
  );
  light.fogColor = blendColor(clearFog, [0.048, 0.062, 0.080], weatherIntensity * 0.34);
  light.fogDensity = clamp(
    0.030 + nightFactor * 0.128 + warmFactor * 0.150 - noonFactor * 0.030 + weatherIntensity * 0.088,
    0.03,
    0.42
  );

  const windAngle =
    0.64 +
    Math.sin(absoluteSeconds * 0.018) * (0.62 + emotionalField * 0.2) +
    Math.sin(absoluteSeconds * 0.006 + 1.9) * (0.4 + twilightFactor * 0.16);
  const baseStrength =
    0.18 +
    (Math.sin(absoluteSeconds * 0.027 + 0.4) * 0.5 + 0.5) * 0.18 +
    (Math.sin(absoluteSeconds * 0.011 + 2.4) * 0.5 + 0.5) * 0.1;
  const gustRaw =
    Math.sin(absoluteSeconds * 0.083 + Math.sin(absoluteSeconds * 0.019) * 2.1) * 0.5 + 0.5;
  const targetGust = clamp(
    Math.pow(smoothstep(0.72, 1.0, gustRaw), 2.4) * (1 - fireDamping) + emotionalVariance + weatherIntensity * 0.25,
    0,
    1
  );
  const gustSpeed = targetGust > env.wind.gust ? 1.3 + emotionalField * 0.7 : 0.38 + fireStability * 0.34;
  env.wind.gust = smoothValue(env.wind.gust, targetGust, dt, gustSpeed);
  const targetStrength = clamp(
    baseStrength + env.wind.gust * 0.3 + emotionalField * 0.06 + weatherIntensity * 0.22 - fireStability * 0.055,
    0.08,
    0.94
  );
  env.wind.strength = smoothValue(env.wind.strength, targetStrength, dt, 0.58 + fireStability * 0.2);
  env.wind.direction = windAngle;
  const windStrength = env.wind.strength * (0.72 + env.wind.gust * 0.68);
  env.wind.vector = vec3(Math.cos(windAngle) * windStrength, 0, Math.sin(windAngle) * windStrength);
  env.emotionalField = smoothValue(
    env.emotionalField,
    clamp(env.emotionalField + weatherIntensity * 0.18 - fireStability * 0.035, 0.04, 0.9),
    dt,
    0.9
  );
}

function updateObjects(state, dt) {
  const firePit = state.objects[FIRE_PIT_ID];
  if (firePit.lit) {
    firePit.fuel = Math.max(0, firePit.fuel - dt * 0.002);
    firePit.lit = firePit.fuel > 0;
  }
  firePit.warmth = smoothValue(firePit.warmth, firePit.lit ? 1 : 0, dt, firePit.lit ? 2.0 : 0.5);
  updateResourceTrees(state, dt);
}

function updateResourceTrees(state, dt) {
  const dayGrowth = 0.45 + state.environment.dayFactor * 0.55;
  const weatherGrowth = state.environment.weatherIntensity > 0.7 ? 0.62 : 1;
  const growth = dt * BUILDER_TREE_REGROW_RATE * dayGrowth * weatherGrowth;
  for (const treeId of BUILDER_TREE_IDS) {
    const tree = state.objects[treeId];
    if (!tree || tree.maxWood <= 0) continue;
    if (tree.wood < tree.maxWood) {
      tree.wood = clamp(tree.wood + growth, 0, tree.maxWood);
    }
    tree.regrowth = clamp(tree.wood / tree.maxWood, 0, 1);
  }
}

function updateBubbleBoy(state, dt, intents) {
  const boy = state.bubbleBoy;
  const firePit = state.objects[FIRE_PIT_ID];
  const env = state.environment;
  const userPresence = latestIntent(intents, "userPresence") || {
    active: false,
    position: vec3(0, 0.96, 0),
    ageSeconds: 999
  };
  const interact = latestIntent(intents, "interact");
  const moveIntent = latestIntent(intents, "move");
  const distanceToFire = distance2d(boy.position, firePit.position);
  const fireNear = 1 - smoothstep(FIRE_CLEAR_RADIUS + 0.25, FIRE_WORK_RADIUS + 0.95, distanceToFire);
  const fireCoherence = clamp(fireNear * 0.58 + ((env.light.fireIntensity - 0.42) / 0.42) * 0.42, 0, 1);
  const playerDistance = distance2d(boy.position, userPresence.position);
  const playerActive = Boolean(userPresence.active && userPresence.ageSeconds < 1.5);
  const playerNear = 1 - smoothstep(1.4, 8.4, playerDistance);

  boy.actionTimer += dt;
  boy.minActionTime = Math.max(0, boy.minActionTime - dt);
  boy.hunger = clamp(boy.hunger + dt * 0.012, 0, 100);

  updateAffect(boy, state, dt, {
    fireCoherence,
    fireIntensity: clamp(fireNear * env.light.fireIntensity * (0.88 + fireCoherence * 0.12), 0, 1),
    playerActive,
    playerDistance,
    windStrength: clamp(env.wind.strength * (0.72 + env.wind.gust * 0.68), 0, 1)
  });

  const nextFocus = computeFocus(boy, state, {
    fireCoherence,
    fireNear,
    interact,
    playerActive,
    playerDistance,
    playerPosition: userPresence.position
  });
  boy.focus = nextFocus;

  const nextGoal = selectGoal(state, {
    fireNear,
    interact,
    moveIntent,
    nightRisk: env.safety.nightRisk,
    playerActive,
    playerNear
  });
  const userAttentionInterrupt = nextGoal === "attendUser" && boy.goal === "wander";
  const urgentInterrupt =
    boy.energy <= 12 ||
    boy.hunger >= 92 ||
    (env.safety.nightRisk > 0.75 && firePit.lit) ||
    userAttentionInterrupt;
  if (nextGoal !== boy.goal && (boy.minActionTime <= 0 || urgentInterrupt)) {
    boy.goal = nextGoal;
    boy.currentAction = actionForGoal(nextGoal, state, { fireNear, moveIntent });
    boy.actionTimer = 0;
    boy.minActionTime = ACTION_MIN_SECONDS[boy.currentAction] || 1.0;
  } else if (
    boy.minActionTime <= 0 &&
    (boy.currentAction === "idle" ||
      boy.goal === "wander" ||
      boy.goal === "interact" ||
      boy.goal === "goFish" ||
      boy.goal === "cookFish" ||
      boy.goal === "eatFish" ||
      boy.goal === "gatherWood" ||
      boy.goal === "buildProject")
  ) {
    const nextAction = actionForGoal(boy.goal, state, { fireNear, moveIntent });
    boy.currentAction = nextAction;
    boy.actionTimer = 0;
    boy.minActionTime = ACTION_MIN_SECONDS[boy.currentAction] || 1.0;
  }
  if (nextGoal === "interact") {
    boy.targetId = interact && interact.targetId === FIRE_PIT_ID ? FIRE_PIT_ID : null;
  } else if (nextGoal === "goFish") {
    boy.targetId = FISHING_TARGET_ID;
  } else if (nextGoal === "cookFish") {
    boy.targetId = FIRE_PIT_ID;
  } else if (nextGoal === "eatFish") {
    boy.targetId = null;
  } else if (nextGoal === "gatherWood") {
    const tree = selectedBuilderTree(state);
    boy.targetId = tree ? tree.id : null;
  } else if (nextGoal === "buildProject") {
    boy.targetId = BUILD_SITE_ID;
  }

  integrateBubbleBoyNeeds(boy, state, dt, { fireNear, playerNear });
  integrateBubbleBoyMovement(boy, state, dt, { moveIntent });
  updateMoodAndAttention(boy, state, { fireNear });
  updatePose(boy, state, dt, {
    fireCoherence,
    fireIntensity: clamp(fireNear * env.light.fireIntensity, 0, 1),
    playerDistance,
    playerActive
  });
}

function updateAffect(boy, state, dt, envState) {
  const env = state.environment;
  const affect = boy.affect;
  const fireIntensity = clamp(envState.fireIntensity || 0, 0, 1);
  const windGust = clamp(env.wind.gust, 0, 1);
  const ambientEnergy = clamp(env.ambientEnergy, 0, 1);
  const emotionalField = clamp(env.emotionalField, 0, 1);
  const fireCoherence = clamp(envState.fireCoherence == null ? fireIntensity : envState.fireCoherence, 0, 1);
  const playerNear = 1 - smoothstep(1.4, 8.4, envState.playerDistance == null ? 8 : envState.playerDistance);
  const twilightFactor = state.time.phase === "twilight" ? 1 : state.time.phase === "dawn" ? 0.45 : 0;
  const environmentalMotion = clamp(envState.windStrength * 1.12 + windGust * 0.42 + emotionalField * 0.18, 0, 1);
  const flamePulse = (0.5 + Math.sin(state.sim.elapsedSeconds * 4.2) * 0.5) * fireIntensity;
  const quietScan = 0.5 + Math.sin(state.sim.elapsedSeconds * 0.09 + 1.4) * 0.5;
  const fireAnchor = clamp(fireIntensity * 0.62 + fireCoherence * 0.38, 0, 1);

  const stimulusTarget = clamp(
    (envState.playerActive ? 0.92 : 0) +
      playerNear * (envState.playerActive ? 0.24 : 0.08) +
      fireIntensity * 0.13 +
      flamePulse * 0.11 +
      windGust * 0.18 +
      emotionalField * (0.1 + twilightFactor * 0.12) +
      environmentalMotion * 0.12 -
      fireAnchor * 0.08,
    0,
    1
  );
  const attentionTarget = clamp(
    0.22 +
      fireIntensity * 0.26 +
      fireAnchor * 0.22 +
      playerNear * (envState.playerActive ? 0.3 : 0.1) +
      stimulusTarget * 0.16,
    0,
    1
  );
  const comfortTarget = clamp(
    0.32 +
      fireIntensity * 0.28 +
      fireAnchor * 0.22 +
      env.nightFactor * 0.1 +
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
      env.dayFactor * 0.12 +
      twilightFactor * 0.12 +
      ambientEnergy * 0.08 +
      (1 - comfortTarget) * 0.18 +
      stimulusTarget * 0.18 +
      quietScan * 0.1 -
      fireAnchor * 0.04,
    0,
    1
  );

  affect.attention = smoothValue(affect.attention, attentionTarget, dt, envState.playerActive ? 5.6 : 1.65);
  affect.curiosity = smoothValue(affect.curiosity, curiosityTarget, dt, 0.78);
  affect.comfort = smoothValue(affect.comfort, comfortTarget, dt, stimulusTarget > 0.68 ? 1.85 : 0.66);
  affect.stimulus = smoothValue(affect.stimulus, stimulusTarget, dt, envState.playerActive ? 8.0 : 2.4);
}

function computeFocus(boy, state, envState) {
  const firePit = state.objects[FIRE_PIT_ID];
  const affect = boy.affect;
  const firePulse = 0.5 + Math.sin(state.sim.elapsedSeconds * 4.2) * 0.5;
  const firePull = clamp(
    0.32 +
      envState.fireNear * 0.22 +
      envState.fireCoherence * 0.24 +
      firePulse * state.environment.light.fireIntensity * 0.1 -
      state.environment.emotionalField * 0.035,
    0,
    1
  );
  const playerNear = 1 - smoothstep(1.4, 8.4, envState.playerDistance == null ? 8 : envState.playerDistance);
  const playerPull = clamp((envState.playerActive ? 0.74 : 0.06) + playerNear * 0.22 + affect.stimulus * 0.12, 0, 1);
  const defaultFocus = {
    kind: "default",
    position: vec3(
      boy.position.x + Math.sin(boy.facing) * -1.2,
      boy.position.y + 0.72,
      boy.position.z + Math.cos(boy.facing) * -1.2
    ),
    strength: 0.18
  };

  if (envState.interact && envState.interact.targetId === FIRE_PIT_ID) {
    return {
      kind: "fire",
      position: vec3(firePit.position.x, firePit.position.y, firePit.position.z),
      strength: Math.max(0.68, firePull)
    };
  }
  if (boy.goal === "goFish" || boy.currentAction === "fishing") {
    const spot = autonomousFishingSpot(state);
    const radius = Math.hypot(spot.x, spot.z);
    const oceanLook = radius > 0.001
      ? vec3((spot.x / radius) * (radius + 7.5), spot.y + 0.22, (spot.z / radius) * (radius + 7.5))
      : vec3(spot.x + 7.5, spot.y + 0.22, spot.z);
    return {
      kind: "ocean",
      position: oceanLook,
      strength: 0.72
    };
  }
  if (boy.goal === "eatFish" || boy.currentAction === "eatingFish") {
    return {
      kind: "food",
      position: vec3(boy.position.x, boy.position.y + 0.72, boy.position.z),
      strength: 0.62
    };
  }
  if (envState.playerActive && playerPull > 0.5) {
    return {
      kind: "player",
      position: vec3(envState.playerPosition.x, envState.playerPosition.y, envState.playerPosition.z),
      strength: playerPull
    };
  }
  if (state.environment.weatherIntensity > 0.72 && state.environment.wind.strength > 0.52) {
    const wind = state.environment.wind.vector;
    return {
      kind: "weather",
      position: vec3(boy.position.x + wind.x * 1.4, boy.position.y + 0.9, boy.position.z + wind.z * 1.4),
      strength: clamp(state.environment.weatherIntensity * 0.62 + state.environment.wind.strength * 0.2, 0, 1)
    };
  }
  if (firePull > 0.38 && !(envState.playerActive && playerPull > firePull + 0.08)) {
    return {
      kind: "fire",
      position: vec3(firePit.position.x, firePit.position.y, firePit.position.z),
      strength: firePull
    };
  }
  if (playerPull > 0.34) {
    return {
      kind: "player",
      position: vec3(envState.playerPosition.x, envState.playerPosition.y, envState.playerPosition.z),
      strength: playerPull
    };
  }
  return defaultFocus;
}

function selectGoal(state, context) {
  const boy = state.bubbleBoy;
  const firePit = state.objects[FIRE_PIT_ID];
  const fish = boy.inventory && boy.inventory.fish ? boy.inventory.fish : { state: "none" };
  if (boy.energy <= 20) return "rest";
  if (fish.state === "raw") return "cookFish";
  if (fish.state === "cooked" && boy.hunger >= AUTONOMOUS_FISHING_HUNGER) return "eatFish";
  if (boy.hunger >= URGENT_FORAGE_HUNGER) return "seekFood";
  if (shouldAutonomouslyFish(state, context)) return "goFish";
  if (context.interact && context.interact.targetId === FIRE_PIT_ID) return "interact";
  if (context.moveIntent && Math.hypot(context.moveIntent.direction.x, context.moveIntent.direction.z) > 0.1) return "followIntent";
  if (context.nightRisk > 0.52 && firePit.lit && !context.fireNear) return "approachFire";
  if (context.fireNear && firePit.lit && (firePit.fuel <= 20 || (boy.goal === "tendFire" && firePit.fuel < 35)) && boy.energy > 30) {
    return "tendFire";
  }
  if (context.fireNear && (state.environment.temperature < 14 || context.nightRisk > 0.35)) return "warmUp";
  if (context.playerActive && context.playerNear > 0.58) return "attendUser";
  const builderGoal = selectBuilderGoal(state);
  if (builderGoal) return builderGoal;
  return "wander";
}

function actionForGoal(goal, state, context) {
  if (goal === "rest") return "resting";
  if (goal === "warmUp") return "warmingHands";
  if (goal === "tendFire") return "tendingFire";
  if (goal === "approachFire" || goal === "followIntent") return "walking";
  if (goal === "interact") return context.fireNear ? "warmingHands" : "walking";
  if (goal === "attendUser") return "lookingAround";
  if (goal === "seekFood") return "foraging";
  if (goal === "goFish") {
    const spot = autonomousFishingSpot(state);
    return distance2d(state.bubbleBoy.position, spot) <= FISHING_WORK_RADIUS ? "fishing" : "walking";
  }
  if (goal === "cookFish") {
    const firePit = state.objects[FIRE_PIT_ID];
    return firePit && distance2d(state.bubbleBoy.position, firePit.position) <= FIRE_WORK_RADIUS + 0.95 ? "cookingFish" : "walking";
  }
  if (goal === "eatFish") return "eatingFish";
  if (goal === "gatherWood") {
    const tree = selectedBuilderTree(state);
    return tree && distance2d(state.bubbleBoy.position, tree.position) <= BUILDER_WORK_RADIUS ? "gatheringWood" : "walking";
  }
  if (goal === "buildProject") {
    const buildSite = state.objects[BUILD_SITE_ID];
    return buildSite && distance2d(state.bubbleBoy.position, buildSite.position) <= BUILDER_WORK_RADIUS ? "building" : "walking";
  }
  const walkingPulse =
    Math.sin(state.sim.elapsedSeconds * 0.31 + state.sim.seed) +
      Math.sin(state.sim.elapsedSeconds * 0.083 + state.sim.seed * 2.1) * 0.42 >
    -0.72;
  return walkingPulse ? "walking" : "lookingAround";
}

function integrateBubbleBoyNeeds(boy, state, dt, context) {
  const firePit = state.objects[FIRE_PIT_ID];
  const activeCost = boy.currentAction === "walking" ? 0.85 : boy.currentAction === "lookingAround" ? 0.28 : 0.14;
  if (boy.currentAction === "resting" || boy.currentAction === "sitting") {
    boy.energy += dt * (context.fireNear ? 1.8 : 1.25);
  } else if (boy.currentAction === "warmingHands") {
    boy.energy += dt * 0.18;
  } else if (boy.currentAction === "foraging") {
    boy.hunger -= dt * 0.62;
    boy.energy -= dt * 0.18;
  } else if (boy.currentAction === "fishing") {
    boy.energy -= dt * 0.16;
    if (boy.fishing.lastResult === "none") boy.fishing.lastResult = "waiting";
  } else if (boy.currentAction === "cookingFish") {
    const fish = boy.inventory && boy.inventory.fish ? boy.inventory.fish : null;
    if (fish && fish.state === "raw" && distance2d(boy.position, firePit.position) <= FIRE_WORK_RADIUS + 0.95 && boy.actionTimer >= 1.0) {
      fish.state = "cooked";
      fish.cookedAt = state.sim.elapsedSeconds;
      boy.fishing.lastCookAt = state.sim.elapsedSeconds;
      boy.fishing.lastResult = "cooked";
      state.events.push({
        tick: state.sim.tick,
        type: "fishCooked",
        entityId: boy.id,
        objectId: FIRE_PIT_ID,
        fishId: fish.id || null
      });
    }
    boy.energy -= dt * 0.10;
  } else if (boy.currentAction === "eatingFish") {
    const fish = boy.inventory && boy.inventory.fish ? boy.inventory.fish : null;
    if (fish && fish.state === "cooked" && boy.actionTimer >= 1.0) {
      const hungerBefore = boy.hunger;
      boy.hunger = clamp(boy.hunger - COOKED_FISH_NUTRITION, 0, 100);
      boy.inventory.fish = {
        state: "none",
        id: null,
        caughtAt: null,
        cookedAt: null
      };
      boy.fishing.lastMealAt = state.sim.elapsedSeconds;
      boy.fishing.lastResult = "eaten";
      state.events.push({
        tick: state.sim.tick,
        type: "fishEaten",
        entityId: boy.id,
        hungerBefore,
        hungerAfter: boy.hunger
      });
      boy.goal = "wander";
      boy.currentAction = "lookingAround";
      boy.actionTimer = 0;
      boy.minActionTime = ACTION_MIN_SECONDS[boy.currentAction] || 1.0;
    }
    boy.energy -= dt * 0.06;
  } else if (boy.currentAction === "gatheringWood") {
    const tree = selectedBuilderTree(state);
    const workbench = state.objects[WORKBENCH_ID];
    if (tree && distance2d(boy.position, tree.position) <= BUILDER_WORK_RADIUS && tree.wood > 0) {
      const remainingCapacity = Math.max(0, workbench.capacity - boy.inventory.wood);
      const gathered = Math.min(tree.wood, remainingCapacity, dt * BUILDER_GATHER_RATE);
      tree.wood = clamp(tree.wood - gathered, 0, tree.maxWood);
      boy.inventory.wood = clamp(boy.inventory.wood + gathered, 0, workbench.capacity);
      workbench.wood = boy.inventory.wood;
      if (gathered > 0) {
        state.events.push({
          tick: state.sim.tick,
          type: "woodGathered",
          entityId: boy.id,
          objectId: tree.id,
          amount: gathered,
          inventoryWood: boy.inventory.wood
        });
      }
    }
    boy.energy -= dt * 0.22;
  } else if (boy.currentAction === "building") {
    const buildSite = state.objects[BUILD_SITE_ID];
    if (buildSite && distance2d(boy.position, buildSite.position) <= BUILDER_WORK_RADIUS && buildSite.progress < 1) {
      const wasComplete = buildSite.progress >= 1;
      const neededWood = Math.max(0, buildSite.requiredWood - buildSite.storedWood);
      const spent = Math.min(neededWood, boy.inventory.wood, dt * BUILDER_BUILD_RATE);
      buildSite.storedWood = clamp(buildSite.storedWood + spent, 0, buildSite.requiredWood);
      buildSite.progress = clamp(buildSite.storedWood / buildSite.requiredWood, 0, 1);
      boy.inventory.wood = clamp(boy.inventory.wood - spent, 0, 100);
      state.objects[WORKBENCH_ID].wood = boy.inventory.wood;
      boy.builder.progress = buildSite.progress;
      const completedNow = !wasComplete && buildSite.progress >= 1;
      if (completedNow) {
        state.environment.safety.shelterAvailable = true;
        boy.builder.active = false;
        boy.goal = "wander";
        boy.currentAction = "lookingAround";
        boy.targetId = null;
        boy.actionTimer = 0;
        boy.minActionTime = ACTION_MIN_SECONDS[boy.currentAction] || 1.0;
      }
      if (spent > 0) {
        state.events.push({
          tick: state.sim.tick,
          type: "projectBuilt",
          entityId: boy.id,
          objectId: BUILD_SITE_ID,
          amount: spent,
          progress: buildSite.progress
        });
      }
      if (completedNow) {
        state.events.push({
          tick: state.sim.tick,
          type: "projectCompleted",
          entityId: boy.id,
          objectId: BUILD_SITE_ID,
          project: buildSite.project,
          progress: buildSite.progress
        });
      }
    }
    boy.energy -= dt * 0.28;
  } else if (boy.currentAction === "tendingFire") {
    firePit.lit = true;
    firePit.fuel = clamp(firePit.fuel + dt * 2.8, 0, 100);
    firePit.warmth = clamp(firePit.warmth + dt * 0.24, 0, 1);
    state.events.push({
      tick: state.sim.tick,
      type: "fireTended",
      objectId: FIRE_PIT_ID,
      fuel: firePit.fuel
    });
  } else {
    boy.energy -= dt * activeCost;
  }
  boy.energy = clamp(boy.energy, 0, 100);

  const warmthPressure = context.fireNear ? 0.004 : 0;
  const curiosityPressure = boy.affect.curiosity * 0.002;
  const stimulusPressure = boy.affect.stimulus * 0.0015;
  const calmStabilizer = boy.affect.comfort * warmthPressure;
  state.environment.emotionalField = smoothValue(
    state.environment.emotionalField,
    clamp(state.environment.emotionalField + curiosityPressure + stimulusPressure - calmStabilizer, 0.04, 0.82),
    dt,
    3.0
  );
}

function integrateBubbleBoyMovement(boy, state, dt, context) {
  let target = null;
  const firePit = state.objects[FIRE_PIT_ID];
  if (
    boy.goal === "approachFire" ||
    boy.goal === "warmUp" ||
    boy.goal === "tendFire" ||
    (boy.goal === "interact" && boy.targetId === FIRE_PIT_ID)
  ) {
    target = safeFireWorkPosition(firePit, state);
    boy.targetId = FIRE_PIT_ID;
  } else if (boy.goal === "followIntent" && context.moveIntent) {
    const direction = context.moveIntent.direction;
    target = constrainBubbleBoyPosition(
      vec3(boy.position.x + direction.x * 1.35, boy.position.y, boy.position.z + direction.z * 1.35),
      firePit
    );
    boy.targetId = null;
  } else if (boy.goal === "goFish") {
    target = autonomousFishingSpot(state);
    boy.targetId = FISHING_TARGET_ID;
  } else if (boy.goal === "cookFish") {
    target = safeFireWorkPosition(firePit, state);
    boy.targetId = FIRE_PIT_ID;
  } else if (boy.goal === "gatherWood") {
    const tree = selectedBuilderTree(state);
    if (tree) {
      target = constrainBubbleBoyPosition(vec3(tree.position.x, boy.position.y, tree.position.z), firePit);
      boy.targetId = tree.id;
    }
  } else if (boy.goal === "buildProject") {
    const buildSite = state.objects[BUILD_SITE_ID];
    if (buildSite) {
      target = constrainBubbleBoyPosition(vec3(buildSite.position.x, boy.position.y, buildSite.position.z), firePit);
      boy.targetId = BUILD_SITE_ID;
    }
  } else if (boy.goal === "wander" && boy.currentAction === "walking") {
    target = randomWanderTarget(state, boy);
    boy.targetId = null;
  }

  if (!target || boy.currentAction !== "walking") {
    const constrained = constrainBubbleBoyPosition(boy.position, firePit);
    boy.position.x = constrained.x;
    boy.position.z = constrained.z;
    boy.velocity = vec3(0, 0, 0);
    return;
  }

  const dx = target.x - boy.position.x;
  const dz = target.z - boy.position.z;
  const distance = Math.hypot(dx, dz);
  if (distance < 0.04) {
    const constrained = constrainBubbleBoyPosition(boy.position, firePit);
    boy.position.x = constrained.x;
    boy.position.z = constrained.z;
    boy.velocity = vec3(0, 0, 0);
    return;
  }

  const speed = boy.goal === "followIntent" ? 0.92 : boy.goal === "wander" ? 0.54 : 0.46;
  const step = Math.min(distance, speed * dt);
  const nx = dx / distance;
  const nz = dz / distance;
  const previousX = boy.position.x;
  const previousZ = boy.position.z;
  boy.position.x += nx * step;
  boy.position.z += nz * step;
  const constrained = constrainBubbleBoyPosition(boy.position, firePit);
  boy.position.x = constrained.x;
  boy.position.z = constrained.z;
  boy.velocity = vec3((boy.position.x - previousX) / Math.max(dt, 0.0001), 0, (boy.position.z - previousZ) / Math.max(dt, 0.0001));
  boy.facing = smoothValue(boy.facing, Math.atan2(-nx, -nz), dt, 3.0);
}

function randomWanderTarget(state, boy) {
  const segment = Math.floor(state.sim.elapsedSeconds / WANDER_SEGMENT_SECONDS);
  const segmentT = (state.sim.elapsedSeconds / WANDER_SEGMENT_SECONDS) - segment;
  const seed = state.sim.seed * 97.0 + segment * 31.0;
  const nextSeed = state.sim.seed * 97.0 + (segment + 1) * 31.0;
  const angleA = seededUnit(seed + 1.0) * TAU;
  const angleB = seededUnit(nextSeed + 1.0) * TAU;
  const safeRadiusA = safeIslandCenterRadius(angleA);
  const safeRadiusB = safeIslandCenterRadius(angleB);
  const minRadius = FIRE_CLEAR_RADIUS + 1.2;
  const radiusA = minRadius + seededUnit(seed + 2.0) * Math.max(0.1, safeRadiusA - minRadius);
  const radiusB = minRadius + seededUnit(nextSeed + 2.0) * Math.max(0.1, safeRadiusB - minRadius);
  const blend = smoothstep(0.72, 1.0, segmentT) * 0.32;
  const x = lerp(Math.cos(angleA) * radiusA, Math.cos(angleB) * radiusB, blend);
  const z = lerp(Math.sin(angleA) * radiusA, Math.sin(angleB) * radiusB, blend);
  return constrainBubbleBoyPosition(vec3(x, boy.position.y, z), state.objects[FIRE_PIT_ID]);
}

function safeFireWorkPosition(firePit, state) {
  const angle = state.sim.seed * 1.71 + state.sim.elapsedSeconds * 0.015;
  const candidate = vec3(
    firePit.position.x + Math.cos(angle) * FIRE_WORK_RADIUS,
    firePit.position.y,
    firePit.position.z + Math.sin(angle) * FIRE_WORK_RADIUS
  );
  return constrainBubbleBoyPosition(candidate, firePit);
}

function shouldAutonomouslyFish(state, context) {
  const boy = state.bubbleBoy;
  const fish = boy.inventory && boy.inventory.fish ? boy.inventory.fish : { state: "none" };
  if (fish.state !== "none") return false;
  if (boy.hunger < AUTONOMOUS_FISHING_HUNGER && boy.goal !== "goFish") return false;
  if (boy.energy < 38) return false;
  if (state.environment.weatherIntensity > 0.68 || context.nightRisk > 0.58) return false;
  if (context.playerActive && context.playerNear > 0.58) return false;
  return true;
}

function autonomousFishingSpot(state) {
  const boy = state.bubbleBoy;
  const segment = Math.floor((state.sim.elapsedSeconds + state.sim.seed * 13.0) / 75);
  const angle = seededUnit(state.sim.seed * 41.0 + segment * 17.0 + boy.fishing.attempts * 3.0) * TAU;
  const shoreRadius = islandShoreRadius(angle);
  const radius = Math.max(FIRE_CLEAR_RADIUS + 1.4, shoreRadius - WATER_CLEAR_INSET - 1.15);
  const target = vec3(Math.cos(angle) * radius, boy.position.y, Math.sin(angle) * radius);
  const constrained = constrainBubbleBoyPosition(target, state.objects[FIRE_PIT_ID]);
  boy.fishing.targetPosition = vec3(constrained.x, constrained.y, constrained.z);
  return boy.fishing.targetPosition;
}

function selectBuilderGoal(state) {
  const boy = state.bubbleBoy;
  const buildSite = state.objects[BUILD_SITE_ID];
  if (!boy.builder.active || !buildSite || buildSite.progress >= 1) return null;
  if (state.environment.weatherIntensity > 0.7 || state.environment.safety.nightRisk > 0.6) return null;
  const neededWood = Math.max(0, buildSite.requiredWood - buildSite.storedWood);
  if (boy.inventory.wood > 0 && (buildSite.storedWood > 0 || neededWood <= boy.inventory.wood)) {
    return "buildProject";
  }
  if (boy.inventory.wood < BUILDER_MIN_WOOD_TO_BUILD) {
    return selectedBuilderTree(state) ? "gatherWood" : null;
  }
  return "buildProject";
}

function selectedBuilderTree(state) {
  const boy = state.bubbleBoy;
  if (boy.targetId && BUILDER_TREE_IDS.includes(boy.targetId)) {
    const targeted = state.objects[boy.targetId];
    if (targeted && targeted.wood > 0.01) return targeted;
  }

  let nearest = null;
  let nearestDistance = Infinity;
  for (const treeId of BUILDER_TREE_IDS) {
    const tree = state.objects[treeId];
    if (!tree || tree.wood <= 0.01) continue;
    const distance = distance2d(boy.position, tree.position);
    if (distance < nearestDistance) {
      nearest = tree;
      nearestDistance = distance;
    }
  }
  return nearest;
}

function constrainBubbleBoyPosition(position, firePit) {
  const constrained = vec3(position.x, position.y, position.z);
  const waterDistance = Math.hypot(constrained.x, constrained.z);
  const waterAngle = Math.atan2(constrained.z, constrained.x);
  const safeWaterRadius = safeIslandCenterRadius(waterAngle);
  if (waterDistance > safeWaterRadius) {
    const scale = safeWaterRadius / Math.max(0.001, waterDistance);
    constrained.x *= scale;
    constrained.z *= scale;
  }

  const fromFireX = constrained.x - firePit.position.x;
  const fromFireZ = constrained.z - firePit.position.z;
  const fireDistance = Math.hypot(fromFireX, fromFireZ);
  if (fireDistance < FIRE_CLEAR_RADIUS) {
    const fallbackAngle = fireDistance > 0.001 ? Math.atan2(fromFireZ, fromFireX) : 0.65;
    constrained.x = firePit.position.x + Math.cos(fallbackAngle) * FIRE_CLEAR_RADIUS;
    constrained.z = firePit.position.z + Math.sin(fallbackAngle) * FIRE_CLEAR_RADIUS;
  }

  const recheckedWaterDistance = Math.hypot(constrained.x, constrained.z);
  const recheckedWaterAngle = Math.atan2(constrained.z, constrained.x);
  const recheckedSafeWaterRadius = safeIslandCenterRadius(recheckedWaterAngle);
  if (recheckedWaterDistance > recheckedSafeWaterRadius) {
    const scale = recheckedSafeWaterRadius / Math.max(0.001, recheckedWaterDistance);
    constrained.x *= scale;
    constrained.z *= scale;
  }
  return constrained;
}

function safeIslandCenterRadius(angle) {
  return Math.max(0, islandShoreRadius(angle) - WATER_CLEAR_INSET);
}

function islandShoreRadius(angle) {
  let radius = 3.02;
  radius += Math.sin(angle * 2.0 + 0.35) * 0.15;
  radius += Math.sin(angle * 3.0 - 1.20) * 0.10;
  radius += Math.sin(angle * 5.0 + 1.65) * 0.055;
  radius -= islandCove(angle, 2.42, 0.34, 0.20);
  radius -= islandCove(angle, -1.82, 0.28, 0.16);
  radius += islandCove(angle, -0.55, 0.40, 0.12);
  return radius * WORLD_RADIUS_SCALE;
}

function islandCove(angle, center, width, depth) {
  const distance = Math.atan2(Math.sin(angle - center), Math.cos(angle - center));
  return depth * Math.exp(-(distance * distance) / (width * width));
}

function seededUnit(value) {
  const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function updateMoodAndAttention(boy, state, context) {
  if (boy.energy <= 25) {
    boy.mood = "tired";
  } else if (boy.hunger >= 80) {
    boy.mood = "hungry";
  } else if (boy.currentAction === "fishing") {
    boy.mood = "patient";
  } else if (boy.currentAction === "cookingFish") {
    boy.mood = "focused";
  } else if (boy.currentAction === "eatingFish") {
    boy.mood = "cozy";
  } else if (boy.currentAction === "tendingFire" || boy.currentAction === "gatheringWood" || boy.currentAction === "building") {
    boy.mood = "focused";
  } else if (boy.currentAction === "warmingHands" || (context.fireNear && state.environment.nightFactor > 0.55)) {
    boy.mood = "cozy";
  } else if (boy.focus.kind === "weather" && state.environment.weatherIntensity > 0.72) {
    boy.mood = "alert";
  } else if (boy.goal === "attendUser") {
    boy.mood = "curious";
  } else if (boy.affect.curiosity > 0.48) {
    boy.mood = "curious";
  } else {
    boy.mood = "calm";
  }

  if (boy.focus.kind === "fire") {
    boy.attention = "fire";
  } else if (boy.focus.kind === "player") {
    boy.attention = "userIntent";
  } else if (boy.focus.kind === "weather") {
    boy.attention = "weather";
  } else if (boy.currentAction === "fishing") {
    boy.attention = "ocean";
  } else if (boy.currentAction === "cookingFish") {
    boy.attention = "fire";
  } else if (boy.currentAction === "eatingFish") {
    boy.attention = "food";
  } else if (boy.currentAction === "gatheringWood" || boy.currentAction === "building") {
    boy.attention = "builder";
  } else if (boy.currentAction === "resting") {
    boy.attention = "shelter";
  } else {
    boy.attention = "idle";
  }
}

function updatePose(boy, state, dt, envState) {
  const affect = boy.affect;
  const pose = boy.pose;
  const focus = boy.focus;
  const env = state.environment;
  const focusEnergy = clamp(affect.attention * 0.78 + focus.strength * 0.22, 0, 1);
  const quietPresence = clamp(affect.comfort * (1 - affect.stimulus * 0.36), 0, 1);
  const twilightBias = state.time.phase === "twilight" ? 1 : state.time.phase === "dawn" ? 0.38 : 0;
  const windStrength = clamp(env.wind.strength * (0.72 + env.wind.gust * 0.68), 0, 1);
  const scores = {
    gaze_follow:
      0.2 +
      focusEnergy * 0.44 +
      envState.fireCoherence * 0.1 +
      affect.curiosity * 0.14 +
      (focus.kind === "player" ? 0.16 : 0) +
      (focus.kind === "fire" ? 0.08 : 0),
    slow_turn:
      0.05 +
      affect.curiosity * (1 - affect.stimulus * 0.58) * (0.2 + env.dayFactor * 0.08) +
      twilightBias * env.emotionalField * 0.07 +
      (focus.kind === "default" ? 0.08 : 0),
    sway_alignment:
      0.1 +
      affect.comfort * 0.3 +
      windStrength * (0.12 + env.emotionalField * 0.06) +
      envState.fireIntensity * 0.08,
    settle:
      0.08 +
      quietPresence * 0.24 +
      envState.fireCoherence * 0.13 +
      env.nightFactor * 0.06,
    micro_bounce:
      0.025 +
      affect.curiosity * 0.16 +
      affect.stimulus * 0.24 +
      env.wind.gust * 0.08 +
      env.emotionalField * 0.05,
    wind_brace:
      env.weatherIntensity * (0.12 + windStrength * 0.22) +
      (focus.kind === "weather" ? 0.16 : 0) +
      Math.max(0, 0.42 - affect.comfort) * 0.12,
    observe:
      0.12 +
      focusEnergy * 0.22 +
      quietPresence * 0.22 +
      envState.fireCoherence * 0.08 +
      env.ambientEnergy * 0.04 +
      (0.5 + Math.sin(state.sim.elapsedSeconds * 0.12 + 0.7) * 0.5) * 0.04
  };
  const behavior = normalizeBehaviorWeights(scores);
  const focusYaw = yawToPoint(boy.position, focus.position);
  const focusDelta = angleDistance(focusYaw, boy.facing);
  const slowTurn =
    Math.sin(state.sim.elapsedSeconds * (0.09 + affect.curiosity * 0.04) + affect.curiosity * 1.7) *
    0.09 *
    behavior.weights.slow_turn *
    (1 - affect.stimulus * 0.42) *
    (1 - envState.fireCoherence * 0.24);
  const targetFacing = boy.facing + clamp(focusDelta, -0.58, 0.58) * (0.08 + affect.attention * 0.16) + slowTurn;
  boy.facing = smoothValue(boy.facing, targetFacing, dt, 0.72 + affect.attention * 1.5 + affect.stimulus * 1.35);

  const gazeError = clamp(angleDistance(focusYaw, boy.facing), -0.62, 0.62);
  const faceY = boy.position.y + 0.72;
  const verticalError = clamp((focus.position.y - faceY) * 0.55, -0.34, 0.34);
  const scan =
    Math.sin(state.sim.elapsedSeconds * (0.18 + affect.stimulus * 0.08) + affect.curiosity * 2.0) *
    0.012 *
    (behavior.weights.observe + behavior.weights.slow_turn * 0.72);
  const targetGazeX =
    gazeError *
      (0.046 + affect.attention * 0.026 + affect.curiosity * 0.01) *
      (0.72 + behavior.weights.gaze_follow * 0.85) +
    scan;
  const targetGazeY = verticalError * (0.02 + affect.attention * 0.018);
  const bounceWave = Math.max(0, Math.sin(state.sim.elapsedSeconds * (3.2 + affect.stimulus * 2.6) + affect.curiosity * 2.8));
  const targetBounce =
    bounceWave *
    (0.006 + affect.curiosity * 0.01 + affect.stimulus * 0.012 + env.emotionalField * 0.005) *
    behavior.weights.micro_bounce *
    (1 - envState.fireCoherence * 0.18);
  const targetBreathEnergy = clamp(
    0.18 +
      envState.fireIntensity * 0.16 +
      envState.fireCoherence * 0.06 +
      affect.curiosity * (0.11 + env.dayFactor * 0.09 + env.ambientEnergy * 0.04) +
      affect.stimulus * (0.14 + env.emotionalField * 0.05) +
      affect.comfort * 0.06 -
      env.nightFactor * (0.1 + envState.fireCoherence * 0.03),
    0.12,
    0.86
  );

  pose.dominant = behavior.dominant;
  pose.weights = behavior.weights;
  pose.gazeX = smoothValue(pose.gazeX, targetGazeX, dt, 5.6 + affect.stimulus * 6.5);
  pose.gazeY = smoothValue(pose.gazeY, targetGazeY, dt, 4.8 + affect.attention * 5.0);
  pose.bounce = smoothValue(pose.bounce, targetBounce, dt, 6.0 + affect.stimulus * 7.0);
  pose.scan = scan;
  pose.settle = behavior.weights.settle;
  pose.breathEnergy = smoothValue(pose.breathEnergy, targetBreathEnergy, dt, envState.playerActive ? 8.0 : 1.35);
}

function normalizeBehaviorWeights(scores) {
  const names = Object.keys(scores);
  let total = 0;
  let dominant = "observe";
  let dominantScore = -Infinity;
  for (const name of names) {
    const score = Math.max(0, scores[name]);
    scores[name] = score;
    total += score;
    if (score > dominantScore) {
      dominant = name;
      dominantScore = score;
    }
  }
  if (total <= 0.0001) {
    return {
      dominant: "observe",
      weights: {
        gaze_follow: 0,
        slow_turn: 0,
        sway_alignment: 0,
        settle: 0,
        micro_bounce: 0,
        wind_brace: 0,
        observe: 1
      }
    };
  }
  const weights = {};
  for (const name of names) {
    weights[name] = scores[name] / total;
  }
  return { dominant, weights };
}

function clampInvariants(state) {
  normalizeWorldState(state);
  const firePit = state.objects[FIRE_PIT_ID];
  const constrained = constrainBubbleBoyPosition(state.bubbleBoy.position, firePit);
  state.bubbleBoy.position.x = constrained.x;
  state.bubbleBoy.position.z = constrained.z;
  const validTargetIds = new Set([firePit.id, WORKBENCH_ID, BUILD_SITE_ID, FISHING_TARGET_ID, ...BUILDER_TREE_IDS]);
  if (state.bubbleBoy.targetId && !validTargetIds.has(state.bubbleBoy.targetId)) {
    state.bubbleBoy.targetId = null;
  }
}

function latestIntent(intents, type) {
  for (let index = intents.length - 1; index >= 0; index -= 1) {
    if (intents[index].type === type) return intents[index];
  }
  return null;
}

function normalizePosition(position, fallback) {
  if (!position || typeof position !== "object") return fallback;
  return vec3(
    finiteNumber(position.x, fallback.x),
    finiteNumber(position.y, fallback.y),
    finiteNumber(position.z, fallback.z)
  );
}

function yawToPoint(origin, point) {
  const dx = point.x - origin.x;
  const dz = point.z - origin.z;
  return Math.atan2(-dx, -dz);
}

function dayFactorFromTime(timeOfDay) {
  const sunHeight = Math.sin(timeOfDay * TAU - Math.PI / 2);
  return smoothstep(-0.12, 0.34, sunHeight);
}

function phaseNameFromTime(timeOfDay) {
  const dayFactor = dayFactorFromTime(timeOfDay);
  if (cyclePulse(timeOfDay, 0.25, 0.1) > 0.42) return "dawn";
  if (cyclePulse(timeOfDay, 0.75, 0.1) > 0.42) return "twilight";
  if (dayFactor < 0.18) return "night";
  return "day";
}

function cyclePulse(value, center, width) {
  const distance = Math.abs(angleDistance(value * TAU, center * TAU)) / TAU;
  return Math.exp(-Math.pow(distance / width, 2));
}

function celestialPositionFromCycle(timeOfDay) {
  const angle = (wrap01(timeOfDay) - 0.25) * TAU;
  return vec3(
    Math.cos(angle) * CELESTIAL_RADIUS,
    CELESTIAL_HORIZON_Y + Math.sin(angle) * CELESTIAL_RADIUS,
    0
  );
}

function dominantLightSource(light) {
  if (light.sunIntensity > 0.08 && light.sunIntensity >= light.moonIntensity) return "sun";
  if (light.moonIntensity > 0.04) return "moon";
  if (light.fireIntensity > 0.05) return "fire";
  return "ambient";
}

function blendNumber(a, b, t) {
  return a + (b - a) * t;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function blendColor(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ];
}

function scaleColor(color, amount) {
  return [
    clamp(color[0] * amount, 0, 1),
    clamp(color[1] * amount, 0, 1),
    clamp(color[2] * amount, 0, 1)
  ];
}

function addColor(a, b) {
  return [
    clamp(a[0] + b[0], 0, 1),
    clamp(a[1] + b[1], 0, 1),
    clamp(a[2] + b[2], 0, 1)
  ];
}

function normalizeVector3(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return vec3(vector.x / length, vector.y / length, vector.z / length);
}
