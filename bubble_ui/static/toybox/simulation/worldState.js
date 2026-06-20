export const FIXED_DT = 1 / 60;

export const BUBBLE_BOY_ID = "bubble-boy";
export const FIRE_PIT_ID = "fire-pit";
export const WORKBENCH_ID = "workbench";
export const BUILD_SITE_ID = "build-site";
export const BED_BUILD_SITE_ID = "bed-build-site";
export const TOY_BUILD_SITE_ID = "toy-build-site";
export const BUILDABLE_IDS = Object.freeze({
  shelter: "shelter",
  bed: "bed",
  toyBlocks: "toy-blocks"
});
export const BUILDABLE_OBJECT_IDS = Object.freeze({
  [BUILDABLE_IDS.shelter]: BUILD_SITE_ID,
  [BUILDABLE_IDS.bed]: BED_BUILD_SITE_ID,
  [BUILDABLE_IDS.toyBlocks]: TOY_BUILD_SITE_ID
});
export const BUILDABLE_SEQUENCE = Object.freeze([
  BUILDABLE_IDS.shelter,
  BUILDABLE_IDS.bed,
  BUILDABLE_IDS.toyBlocks
]);
export const BUILDABLE_REGISTRY = Object.freeze({
  [BUILDABLE_IDS.shelter]: buildable(BUILDABLE_IDS.shelter, "Leaf shelter", 10, [-6.55, 0.18, -3.35], -0.34, 6, [
    stage("footprint", "mark shelter footprint", 0.02),
    stage("foundation", "lay log foundation", 0.16),
    stage("posts", "raise shelter posts", 0.34),
    stage("frame", "tie roof frame", 0.54),
    stage("roof", "weave roof cover", 0.74),
    stage("entry", "clear entry rest nook", 0.92)
  ], [
    slot("entry-rest", "inside shelter rest", "rest", [-6.18, 0.18, -2.68], 2.72, 0.86)
  ]),
  [BUILDABLE_IDS.bed]: buildable(BUILDABLE_IDS.bed, "Leaf bed", 20, [-6.20, 0.18, -3.05], -0.34, 3.5, [
    stage("supports", "place bed supports", 0.04),
    stage("frame", "tie bed frame", 0.28),
    stage("mat", "layer leaf mattress", 0.56),
    stage("blanket", "fold soft blanket", 0.84)
  ], [
    slot("sleep-rest", "sleep on bed", "sleep", [-5.76, 0.18, -2.70], 2.84, 0.78)
  ]),
  [BUILDABLE_IDS.toyBlocks]: buildable(BUILDABLE_IDS.toyBlocks, "Toy blocks", 30, [-4.45, 0.18, -2.62], 0.22, 2.2, [
    stage("tray", "set play tray", 0.06),
    stage("blocks", "carve toy blocks", 0.38),
    stage("stack", "stack bright blocks", 0.70)
  ], [
    slot("play-blocks", "play with blocks", "playToy", [-4.00, 0.18, -2.04], -2.58, 0.82)
  ])
});

function buildable(id, label, priority, position, yaw, wood, stages, useSlots) {
  return Object.freeze({
    id,
    label,
    priority,
    buildSite: Object.freeze({ position: vectorObject(position), yaw }),
    stages: Object.freeze(stages.map(Object.freeze)),
    useSlots: Object.freeze(useSlots.map((useSlot) => Object.freeze(useSlot))),
    requiredResources: Object.freeze({ wood })
  });
}

function stage(id, label, threshold) {
  return { id, label, threshold };
}

function slot(id, label, action, position, facing, radius) {
  return { id, label, action, position: vectorObject(position), facing, radius };
}

function vectorObject(vector) {
  return Object.freeze({ x: vector[0], y: vector[1], z: vector[2] });
}
export const BUILDER_GROVE_TREE_IDS = Object.freeze(["builder-tree-west", "builder-tree-north", "builder-tree-east"]);
export const BUILDER_FOREST_ADDITIONAL_TREE_COUNT = 93;
export const BUILDER_FOREST_SECTOR = Object.freeze({
  startAngle: -Math.PI,
  endAngle: Math.PI,
  minRadius: 5.8,
  maxRadius: 32.4,
  targetIslandCoverage: 0.82
});
export const BUILDER_TREE_MIN_DISTANCE = 2.75;
export const BUILDER_TREE_WATER_CLEARANCE = 5.0;
export const BUILDER_TREE_IDS = Object.freeze([
  ...BUILDER_GROVE_TREE_IDS,
  ...Array.from({ length: BUILDER_FOREST_ADDITIONAL_TREE_COUNT }, (_value, index) => {
    return `builder-forest-tree-${String(index + 1).padStart(2, "0")}`;
  })
]);

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
      role: "builder",
      mood,
      attention: "idle",
      goal: "wander",
      currentAction: "idle",
      position: vec3(-5.8, 0.2, 3.2),
      velocity: vec3(0, 0, 0),
      facing: 1.78,
      targetId: null,
      actionTimer: 0,
      minActionTime: 0,
      inventory: {
        wood: 0,
        fish: {
          state: "none",
          id: null
        }
      },
      builder: {
        project: BUILDABLE_IDS.shelter,
        actionState: "inspect",
        progress: 0,
        requiredWood: 6,
        active: true,
        restedAfterBed: false,
        lastBedUseAt: -999,
        lastToyPlayAt: -999,
        lastCompletionAt: -999,
        lastCompletedBuildableId: null
      },
      fishing: {
        targetPosition: vec3(0, 0.2, 0),
        lastCastAt: -999,
        lastCookAt: -999,
        lastMealAt: -999,
        attempts: 0,
        lastResult: "none"
      },
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
      [FIRE_PIT_ID]: createDefaultFirePit(),
      ...createDefaultBuilderObjects()
    },
    buildables: createDefaultBuildableStates(),
    entities: {},
    intents: [],
    events: []
  });
}

export function normalizeWorldState(worldState) {
  const state = worldState && typeof worldState === "object" ? worldState : {};
  state.objects = state.objects || {};
  state.version = 1;
  state.sim = state.sim && typeof state.sim === "object" ? state.sim : {};
  state.time = state.time && typeof state.time === "object" ? state.time : {};
  state.bubbleBoy = state.bubbleBoy && typeof state.bubbleBoy === "object" ? state.bubbleBoy : {};
  state.environment = state.environment && typeof state.environment === "object" ? state.environment : {};
  state.entities = state.entities && typeof state.entities === "object" ? state.entities : {};
  state.intents = Array.isArray(state.intents) ? state.intents : [];
  state.events = Array.isArray(state.events) ? state.events : [];
  state.buildables = state.buildables && typeof state.buildables === "object" ? state.buildables : {};

  state.sim.tick = Math.max(0, Math.floor(finiteNumber(state.sim.tick, 0)));
  state.sim.elapsedSeconds = Math.max(0, finiteNumber(state.sim.elapsedSeconds, 0));
  state.sim.fixedDt = finiteNumber(state.sim.fixedDt, FIXED_DT);
  state.sim.seed = finiteNumber(state.sim.seed, 1);

  state.time.day = Math.max(1, Math.floor(finiteNumber(state.time.day, 1)));
  state.time.timeOfDay = wrap01(finiteNumber(state.time.timeOfDay, 0));
  state.time.dayLengthSeconds = Math.max(1, finiteNumber(state.time.dayLengthSeconds, 600));
  state.time.phase = normalizePhase(state.time.phase);

  const boy = state.bubbleBoy;
  boy.id = typeof boy.id === "string" ? boy.id : BUBBLE_BOY_ID;
  boy.role = "builder";
  boy.energy = clamp(finiteNumber(boy.energy, 100), 0, 100);
  boy.hunger = clamp(finiteNumber(boy.hunger, 0), 0, 100);
  boy.mood = typeof boy.mood === "string" ? boy.mood : "calm";
  boy.attention = typeof boy.attention === "string" ? boy.attention : "idle";
  boy.goal = typeof boy.goal === "string" ? boy.goal : "wander";
  boy.currentAction = typeof boy.currentAction === "string" ? boy.currentAction : "idle";
  boy.facing = finiteNumber(boy.facing, 0);
  boy.targetId = typeof boy.targetId === "string" ? boy.targetId : null;
  boy.actionTimer = Math.max(0, finiteNumber(boy.actionTimer, 0));
  boy.minActionTime = Math.max(0, finiteNumber(boy.minActionTime, 0));
  boy.position = normalizeVector(boy.position, vec3(-5.8, 0.2, 3.2));
  boy.velocity = normalizeVector(boy.velocity, vec3(0, 0, 0));
  boy.focus = boy.focus && typeof boy.focus === "object" ? boy.focus : {};
  boy.focus.kind = typeof boy.focus.kind === "string" ? boy.focus.kind : "default";
  boy.focus.position = normalizeVector(boy.focus.position, vec3(-0.25, 0.92, 0.33));
  boy.focus.strength = clamp(finiteNumber(boy.focus.strength, 0.18), 0, 1);
  boy.inventory = boy.inventory && typeof boy.inventory === "object" ? boy.inventory : {};
  const rawInventoryWood = Number.isFinite(boy.inventory.wood) ? boy.inventory.wood : null;
  boy.inventory.wood = clamp(rawInventoryWood == null ? 0 : rawInventoryWood, 0, 100);
  boy.inventory.fish = normalizeFishInventory(boy.inventory.fish);
  boy.builder = boy.builder && typeof boy.builder === "object" ? boy.builder : {};
  const builderExplicitlyDisabled = boy.builder.disabled === true || boy.builder.active === false;
  boy.builder.project = normalizeBuildableId(boy.builder.project) || BUILDABLE_IDS.shelter;
  boy.builder.actionState = typeof boy.builder.actionState === "string" ? boy.builder.actionState : "inspect";
  boy.builder.progress = clamp(finiteNumber(boy.builder.progress, 0), 0, 1);
  boy.builder.requiredWood = Math.max(0.1, finiteNumber(boy.builder.requiredWood, 6));
  boy.builder.disabled = builderExplicitlyDisabled;
  boy.builder.active = !builderExplicitlyDisabled;
  boy.builder.restedAfterBed = Boolean(boy.builder.restedAfterBed);
  boy.builder.lastBedUseAt = finiteNumber(boy.builder.lastBedUseAt, -999);
  boy.builder.lastToyPlayAt = finiteNumber(boy.builder.lastToyPlayAt, -999);
  boy.builder.lastCompletionAt = finiteNumber(boy.builder.lastCompletionAt, -999);
  boy.builder.lastCompletedBuildableId = normalizeBuildableId(boy.builder.lastCompletedBuildableId);
  boy.fishing = normalizeFishingState(boy.fishing);

  const affect = (boy.affect = boy.affect && typeof boy.affect === "object" ? boy.affect : {});
  affect.attention = clamp(finiteNumber(affect.attention, 0), 0, 1);
  affect.curiosity = clamp(finiteNumber(affect.curiosity, 0), 0, 1);
  affect.comfort = clamp(finiteNumber(affect.comfort, 0), 0, 1);
  affect.stimulus = clamp(finiteNumber(affect.stimulus, 0), 0, 1);

  const pose = (boy.pose = boy.pose && typeof boy.pose === "object" ? boy.pose : {});
  pose.dominant = typeof pose.dominant === "string" ? pose.dominant : "observe";
  pose.weights = pose.weights && typeof pose.weights === "object" ? pose.weights : {};
  pose.weights.gaze_follow = clamp(finiteNumber(pose.weights.gaze_follow, 0), 0, 1);
  pose.weights.slow_turn = clamp(finiteNumber(pose.weights.slow_turn, 0), 0, 1);
  pose.weights.sway_alignment = clamp(finiteNumber(pose.weights.sway_alignment, 0), 0, 1);
  pose.weights.settle = clamp(finiteNumber(pose.weights.settle, 0), 0, 1);
  pose.weights.micro_bounce = clamp(finiteNumber(pose.weights.micro_bounce, 0), 0, 1);
  pose.weights.observe = clamp(finiteNumber(pose.weights.observe, 1), 0, 1);
  pose.gazeX = finiteNumber(pose.gazeX, 0);
  pose.gazeY = finiteNumber(pose.gazeY, 0);
  pose.bounce = finiteNumber(pose.bounce, 0);
  pose.scan = finiteNumber(pose.scan, 0);
  pose.settle = clamp(finiteNumber(pose.settle, 0), 0, 1);
  pose.breathEnergy = clamp(finiteNumber(pose.breathEnergy, 0.42), 0, 1);
  pose.weights.wind_brace = clamp(finiteNumber(pose.weights.wind_brace, 0), 0, 1);

  const env = state.environment;
  env.weather = typeof env.weather === "string" ? env.weather : "clear";
  env.wind = env.wind && typeof env.wind === "object" ? env.wind : {};
  env.light = env.light && typeof env.light === "object" ? env.light : {};
  env.safety = env.safety && typeof env.safety === "object" ? env.safety : {};
  env.weatherIntensity = clamp(finiteNumber(env.weatherIntensity, env.weather === "storm" ? 0.62 : 0), 0, 1);
  env.temperature = finiteNumber(env.temperature, 20);
  env.ambientEnergy = clamp(finiteNumber(env.ambientEnergy, 0.34), 0, 1);
  env.emotionalField = clamp(finiteNumber(env.emotionalField, 0.12), 0, 1);
  env.dayFactor = clamp(finiteNumber(env.dayFactor, 0), 0, 1);
  env.nightFactor = clamp(finiteNumber(env.nightFactor, 1), 0, 1);
  env.wind.direction = finiteNumber(env.wind.direction, 0);
  env.wind.strength = clamp(finiteNumber(env.wind.strength, 0), 0, 1);
  env.wind.gust = clamp(finiteNumber(env.wind.gust, 0), 0, 1);
  env.wind.vector = normalizeVector(env.wind.vector, vec3(1, 0, 0));
  env.light.timeOfDay = finiteNumber(env.light.timeOfDay, state.time.timeOfDay);
  env.light.sourceLevel = clamp(finiteNumber(env.light.sourceLevel, 0), 0, 1);
  env.light.sunIntensity = clamp(finiteNumber(env.light.sunIntensity, 0), 0, 1.4);
  env.light.moonIntensity = clamp(finiteNumber(env.light.moonIntensity, 0), 0, 1.0);
  env.light.fireIntensity = clamp(finiteNumber(env.light.fireIntensity, 0.7), 0, 1);
  env.light.sunPosition = normalizeVector(env.light.sunPosition, vec3(0, -128, 0));
  env.light.moonPosition = normalizeVector(env.light.moonPosition, vec3(0, 128, 0));
  env.light.sunDirection = normalizeVector(env.light.sunDirection, vec3(0, 1, 0));
  env.light.moonDirection = normalizeVector(env.light.moonDirection, vec3(0, 1, 0));
  env.light.sunColor = normalizeColorArray(env.light.sunColor, [1.0, 0.92, 0.78]);
  env.light.moonColor = normalizeColorArray(env.light.moonColor, [0.42, 0.55, 0.86]);
  env.light.fireColor = normalizeColorArray(env.light.fireColor, [1.0, 0.38, 0.1]);
  env.light.dominantSource = typeof env.light.dominantSource === "string" ? env.light.dominantSource : "moon";
  env.light.sky = normalizeColorArray(env.light.sky, [0.008, 0.02, 0.052]);
  env.light.fogColor = normalizeColorArray(env.light.fogColor, [0.035, 0.06, 0.11]);
  env.light.fogDensity = clamp(finiteNumber(env.light.fogDensity, 0.18), 0, 1);
  env.safety.nightRisk = clamp(finiteNumber(env.safety.nightRisk, 0), 0, 1);

  const firePit = ensureObject(state.objects, FIRE_PIT_ID, createDefaultFirePit());
  firePit.id = FIRE_PIT_ID;
  firePit.position = normalizeVector(firePit.position, vec3(0, 0.62, -0.16));
  firePit.type = "firePit";
  firePit.lit = firePit.lit !== false;
  firePit.warmth = clamp(finiteNumber(firePit.warmth, 0), 0, 1);
  firePit.fuel = clamp(finiteNumber(firePit.fuel, 0), 0, 100);
  firePit.warmthRadius = Math.max(0, finiteNumber(firePit.warmthRadius, 0));

  const workbench = ensureObject(state.objects, WORKBENCH_ID, createDefaultWorkbench());
  workbench.id = WORKBENCH_ID;
  workbench.position = normalizeVector(workbench.position, vec3(-5.55, 0.24, -1.9));
  workbench.type = "workbench";
  workbench.capacity = Math.max(0, finiteNumber(workbench.capacity, 8));
  const rawWorkbenchWood = Number.isFinite(workbench.wood) ? workbench.wood : null;
  boy.inventory.wood = clamp(rawInventoryWood ?? rawWorkbenchWood ?? 0, 0, workbench.capacity);
  workbench.wood = boy.inventory.wood;

  normalizeBuildableStates(state);
  const activeBuildable = selectActiveBuildableState(state);
  if (activeBuildable && !boy.builder.disabled) {
    boy.builder.project = activeBuildable.buildableId;
    boy.builder.progress = activeBuildable.progress;
    boy.builder.requiredWood = activeBuildable.requiredWood;
    boy.builder.active = activeBuildable.progress < 1;
  } else {
    const shelter = state.buildables[BUILDABLE_IDS.shelter];
    boy.builder.progress = shelter ? shelter.progress : 1;
    boy.builder.requiredWood = shelter ? shelter.requiredWood : boy.builder.requiredWood;
    boy.builder.active = false;
  }

  const defaultObjects = createDefaultBuilderObjects();
  for (const treeId of BUILDER_TREE_IDS) {
    const tree = ensureObject(state.objects, treeId, defaultObjects[treeId]);
    const defaultTree = defaultObjects[treeId];
    tree.id = treeId;
    tree.position = normalizeVector(tree.position, defaultTree.position);
    tree.type = "resourceTree";
    tree.height = Math.max(2, finiteNumber(tree.height, defaultTree.height));
    tree.trunkRadius = clamp(finiteNumber(tree.trunkRadius, defaultTree.trunkRadius), 0.18, 1.2);
    tree.canopyRadius = clamp(finiteNumber(tree.canopyRadius, defaultTree.canopyRadius), 0.8, 3.6);
    tree.harvestRadius = clamp(finiteNumber(tree.harvestRadius, defaultTree.harvestRadius), 0.8, 3.4);
    tree.maxWood = Math.max(0, finiteNumber(tree.maxWood, defaultTree.maxWood));
    tree.wood = clamp(finiteNumber(tree.wood, tree.maxWood), 0, tree.maxWood);
    tree.regrowth = Math.max(0, finiteNumber(tree.regrowth, 0));
  }
  env.safety.shelterAvailable = Boolean(
    state.buildables[BUILDABLE_IDS.shelter] && state.buildables[BUILDABLE_IDS.shelter].progress >= 1
  );

  return state;
}

export function wrap01(value) {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
}

function normalizeVector(vector, fallback = vec3(0, 0, 0)) {
  const target = vector && typeof vector === "object" ? vector : vec3(fallback.x, fallback.y, fallback.z);
  target.x = finiteNumber(target.x, fallback.x);
  target.y = finiteNumber(target.y, fallback.y);
  target.z = finiteNumber(target.z, fallback.z);
  return target;
}

function normalizeColorArray(value, fallback) {
  if (!Array.isArray(value)) return fallback.slice();
  return fallback.map((fallbackValue, index) => {
    return clamp(finiteNumber(value[index], fallbackValue), 0, 1);
  });
}

function normalizeFishInventory(value) {
  const fish = value && typeof value === "object" ? value : {};
  const state = fish.state === "raw" || fish.state === "cooked" ? fish.state : "none";
  return {
    state,
    id: state === "none" ? null : typeof fish.id === "string" ? fish.id : null,
    caughtAt: Number.isFinite(fish.caughtAt) ? fish.caughtAt : null,
    cookedAt: Number.isFinite(fish.cookedAt) ? fish.cookedAt : null
  };
}

function normalizeFishingState(value) {
  const fishing = value && typeof value === "object" ? value : {};
  return {
    targetPosition: normalizeVector(fishing.targetPosition, vec3(0, 0.2, 0)),
    lastCastAt: finiteNumber(fishing.lastCastAt, -999),
    lastCookAt: finiteNumber(fishing.lastCookAt, -999),
    lastMealAt: finiteNumber(fishing.lastMealAt, -999),
    attempts: Math.max(0, Math.floor(finiteNumber(fishing.attempts, 0))),
    lastResult: typeof fishing.lastResult === "string" ? fishing.lastResult : "none"
  };
}

export function normalizeBuildableId(value) {
  if (value === "shelterFrame") return BUILDABLE_IDS.shelter;
  const id = typeof value === "string" ? value : "";
  return Object.prototype.hasOwnProperty.call(BUILDABLE_REGISTRY, id) ? id : null;
}

export function buildableObjectId(buildableId) {
  const id = normalizeBuildableId(buildableId);
  return id ? BUILDABLE_OBJECT_IDS[id] : null;
}

export function buildableDefinition(buildableId) {
  const id = normalizeBuildableId(buildableId);
  return id ? BUILDABLE_REGISTRY[id] : null;
}

export function buildableIdsByPriority() {
  return BUILDABLE_SEQUENCE.slice();
}

function normalizeBuildableStates(state) {
  const nextBuildables = {};
  const sourceBuildables = state.buildables && typeof state.buildables === "object" ? state.buildables : {};
  for (const buildableId of BUILDABLE_SEQUENCE) {
    const objectId = buildableObjectId(buildableId);
    const fallback = createDefaultBuildableState(buildableId);
    const source = sourceBuildables[buildableId] || state.objects[objectId] || fallback;
    const buildable = normalizeBuildableState(source, fallback);
    nextBuildables[buildableId] = buildable;
    state.objects[objectId] = buildable;
  }
  state.buildables = nextBuildables;
  return nextBuildables;
}

function normalizeBuildableState(value, fallback) {
  const source = value && typeof value === "object" ? value : fallback;
  const buildableId = normalizeBuildableId(source.buildableId || source.project || fallback.buildableId) || fallback.buildableId;
  const definition = BUILDABLE_REGISTRY[buildableId];
  const objectId = buildableObjectId(buildableId);
  const requiredWood = Math.max(0.1, finiteNumber(
    source.requiredWood,
    source.requiredResources && source.requiredResources.wood
  ) || definition.requiredResources.wood);
  const storedWood = clamp(finiteNumber(
    source.storedWood,
    source.storedResources && source.storedResources.wood
  ), 0, requiredWood);
  const progress = clamp(finiteNumber(source.progress, storedWood / requiredWood), 0, 1);
  const syncedStoredWood = Math.max(storedWood, progress * requiredWood);
  const stageCount = definition.stages.length;
  const completedStageCount = Math.min(stageCount, Math.floor(progress * stageCount + 0.0001));
  const currentStageIndex = progress >= 1 ? stageCount : clamp(
    Math.floor(progress * stageCount),
    0,
    Math.max(0, stageCount - 1)
  );
  const status = progress >= 1
    ? "complete"
    : source.status === "building" || progress > 0
      ? "building"
      : "planned";

  return {
    id: objectId,
    type: "buildSite",
    kind: "buildable",
    buildableId,
    label: definition.label,
    priority: definition.priority,
    position: normalizeVector(source.position, cloneVector(definition.buildSite.position)),
    yaw: finiteNumber(source.yaw, definition.buildSite.yaw || 0),
    project: buildableId,
    status,
    stages: definition.stages.map((stage) => ({ ...stage })),
    currentStageIndex,
    completedStageCount,
    stageProgress: stageCount > 0 ? clamp(progress * stageCount - currentStageIndex, 0, 1) : 1,
    progress,
    storedWood: clamp(syncedStoredWood, 0, requiredWood),
    requiredWood,
    storedResources: {
      wood: clamp(syncedStoredWood, 0, requiredWood)
    },
    requiredResources: {
      wood: requiredWood
    },
    useSlots: definition.useSlots.map(cloneUseSlot),
    completedAt: progress >= 1 ? finiteNumber(source.completedAt, fallback.completedAt) : null
  };
}

function selectActiveBuildableState(state) {
  for (const buildableId of BUILDABLE_SEQUENCE) {
    const buildable = state.buildables[buildableId];
    if (buildable && buildable.progress < 1) return buildable;
  }
  return null;
}

function ensureObject(objects, id, fallback) {
  if (!objects[id] || typeof objects[id] !== "object") {
    objects[id] = fallback;
  }
  return objects[id];
}

function createDefaultFirePit() {
  return {
    id: FIRE_PIT_ID,
    type: "firePit",
    position: vec3(0, 0.62, -0.16),
    lit: true,
    warmth: 1,
    fuel: 100,
    warmthRadius: 4.4
  };
}

function createDefaultWorkbench() {
  return {
    id: WORKBENCH_ID,
    type: "workbench",
    position: vec3(-5.55, 0.24, -1.9),
    wood: 0,
    capacity: 8
  };
}

function createDefaultBuildSite() {
  return createDefaultBuildableState(BUILDABLE_IDS.shelter);
}

function createDefaultBuildableStates() {
  return BUILDABLE_SEQUENCE.reduce((buildables, buildableId) => {
    buildables[buildableId] = createDefaultBuildableState(buildableId);
    return buildables;
  }, {});
}

function createDefaultBuildableState(buildableId) {
  const definition = BUILDABLE_REGISTRY[buildableId];
  const objectId = buildableObjectId(buildableId);
  return {
    id: objectId,
    type: "buildSite",
    kind: "buildable",
    buildableId,
    label: definition.label,
    priority: definition.priority,
    position: cloneVector(definition.buildSite.position),
    yaw: definition.buildSite.yaw || 0,
    project: buildableId,
    status: buildableId === BUILDABLE_IDS.shelter ? "building" : "planned",
    stages: definition.stages.map((stage) => ({ ...stage })),
    currentStageIndex: 0,
    completedStageCount: 0,
    stageProgress: 0,
    progress: 0,
    storedWood: 0,
    requiredWood: definition.requiredResources.wood,
    storedResources: {
      wood: 0
    },
    requiredResources: {
      wood: definition.requiredResources.wood
    },
    useSlots: definition.useSlots.map(cloneUseSlot),
    completedAt: null
  };
}

function cloneVector(value) {
  return vec3(value.x, value.y, value.z);
}

function cloneUseSlot(slot) {
  return {
    id: slot.id,
    label: slot.label,
    action: slot.action,
    position: cloneVector(slot.position),
    facing: finiteNumber(slot.facing, 0),
    radius: Math.max(0.1, finiteNumber(slot.radius, 0.75))
  };
}

function createDefaultBuilderObjects() {
  const buildables = createDefaultBuildableStates();
  const resourceTrees = createDefaultResourceTrees();
  return {
    [WORKBENCH_ID]: createDefaultWorkbench(),
    [BUILD_SITE_ID]: buildables[BUILDABLE_IDS.shelter],
    [BED_BUILD_SITE_ID]: buildables[BUILDABLE_IDS.bed],
    [TOY_BUILD_SITE_ID]: buildables[BUILDABLE_IDS.toyBlocks],
    ...resourceTrees
  };
}

function createDefaultResourceTrees() {
  const trees = {};
  const groveSpecs = [
    {
      id: BUILDER_GROVE_TREE_IDS[0],
      type: "resourceTree",
      position: vec3(-8.25, 0.32, -3.65),
      height: 5.35,
      trunkRadius: 0.40,
      canopyRadius: 1.85,
      harvestRadius: 1.45,
      wood: 6,
      maxWood: 6,
      regrowth: 0
    },
    {
      id: BUILDER_GROVE_TREE_IDS[1],
      type: "resourceTree",
      position: vec3(-5.85, 0.32, -5.95),
      height: 4.85,
      trunkRadius: 0.35,
      canopyRadius: 1.62,
      harvestRadius: 1.35,
      wood: 5.4,
      maxWood: 5.4,
      regrowth: 0
    },
    {
      id: BUILDER_GROVE_TREE_IDS[2],
      type: "resourceTree",
      position: vec3(-2.65, 0.32, -5.55),
      height: 4.95,
      trunkRadius: 0.36,
      canopyRadius: 1.58,
      harvestRadius: 1.32,
      wood: 5.2,
      maxWood: 5.2,
      regrowth: 0
    }
  ];

  for (const spec of groveSpecs) {
    trees[spec.id] = spec;
  }

  const generatedCount = BUILDER_TREE_IDS.length - BUILDER_GROVE_TREE_IDS.length;
  const placedPositions = groveSpecs.map((spec) => spec.position);
  for (let index = 0; index < generatedCount; index += 1) {
    const id = BUILDER_TREE_IDS[BUILDER_GROVE_TREE_IDS.length + index];
    const position = randomForestTreePosition(index, placedPositions);
    placedPositions.push(position);
    const height = 4.75 + forestNoise(index, 11) * 0.95;
    const canopyRadius = 1.45 + forestNoise(index, 17) * 0.48;
    const trunkRadius = 0.32 + forestNoise(index, 23) * 0.14;
    const maxWood = 5.0 + forestNoise(index, 31) * 1.9;

    trees[id] = {
      id,
      type: "resourceTree",
      position: vec3(position.x, 0.32, position.z),
      height,
      trunkRadius,
      canopyRadius,
      harvestRadius: 1.22 + canopyRadius * 0.14,
      wood: maxWood,
      maxWood,
      regrowth: 0
    };
  }

  return trees;
}

function randomForestTreePosition(index, placedPositions) {
  const maxAttempts = 720;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const x = (forestNoise(index, attempt * 4 + 101) * 2 - 1) * BUILDER_FOREST_SECTOR.maxRadius;
    const z = (forestNoise(index, attempt * 4 + 103) * 2 - 1) * BUILDER_FOREST_SECTOR.maxRadius;
    const position = { x, z };
    if (isValidForestTreePosition(position, placedPositions)) {
      return position;
    }
  }

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const angle = forestNoise(index, attempt * 4 + 211) * Math.PI * 2 - Math.PI;
    const radius = Math.sqrt(forestNoise(index, attempt * 4 + 223)) * BUILDER_FOREST_SECTOR.maxRadius;
    const position = { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
    if (isValidForestTreePosition(position, placedPositions)) {
      return position;
    }
  }

  throw new Error(`Unable to place builder forest tree ${index} with current spacing constraints`);
}

function isValidForestTreePosition(position, placedPositions) {
  const radius = Math.hypot(position.x, position.z);
  if (radius < BUILDER_FOREST_SECTOR.minRadius) return false;
  const shoreClearance = forestIslandShoreRadius(Math.atan2(position.z, position.x)) - radius;
  if (shoreClearance < BUILDER_TREE_WATER_CLEARANCE) return false;

  for (const clearing of forestClearings()) {
    if (Math.hypot(position.x - clearing.x, position.z - clearing.z) < clearing.radius) {
      return false;
    }
  }

  for (const placedPosition of placedPositions) {
    if (Math.hypot(position.x - placedPosition.x, position.z - placedPosition.z) < BUILDER_TREE_MIN_DISTANCE) {
      return false;
    }
  }

  return true;
}

function forestClearings() {
  return [
    { x: 0, z: -0.16, radius: 6.35 },
    { x: -5.55, z: -1.9, radius: 2.55 },
    { x: -6.55, z: -3.35, radius: 3.05 },
    { x: -5.8, z: 3.2, radius: 2.85 }
  ];
}

function forestIslandShoreRadius(angle) {
  let radius = 3.02;
  radius += Math.sin(angle * 2.0 + 0.35) * 0.15;
  radius += Math.sin(angle * 3.0 - 1.20) * 0.10;
  radius += Math.sin(angle * 5.0 + 1.65) * 0.055;
  radius -= forestIslandCove(angle, 2.42, 0.34, 0.20);
  radius -= forestIslandCove(angle, -1.82, 0.28, 0.16);
  radius += forestIslandCove(angle, -0.55, 0.40, 0.12);
  return radius * 14.0;
}

function forestIslandCove(angle, center, width, depth) {
  const distance = Math.atan2(Math.sin(angle - center), Math.cos(angle - center));
  return depth * Math.exp(-(distance * distance) / (width * width));
}

function forestNoise(index, salt) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}
