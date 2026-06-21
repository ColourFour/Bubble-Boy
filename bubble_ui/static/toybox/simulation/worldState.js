export const FIXED_DT = 1 / 60;
export const DAY_SECONDS = 180;
export const NIGHT_SECONDS = 60;
export const CYCLE_SECONDS = DAY_SECONDS + NIGHT_SECONDS;

export const BUBBLE_BOY_ID = "bubble-boy";
export const FIRE_PIT_ID = "fire-pit";
export const WORKBENCH_ID = "workbench";
export const BUILD_SITE_ID = "build-site";
export const BED_BUILD_SITE_ID = "bed-build-site";
export const TOY_BUILD_SITE_ID = "toy-build-site";
export const BUILDABLE_IDS = Object.freeze({
  shelter: "shelter",
  bed: "bed",
  toyBlocks: "toy-blocks",
  workbench: WORKBENCH_ID
});
export const BUILDABLE_OBJECT_IDS = Object.freeze({
  [BUILDABLE_IDS.shelter]: BUILD_SITE_ID,
  [BUILDABLE_IDS.bed]: BED_BUILD_SITE_ID,
  [BUILDABLE_IDS.toyBlocks]: TOY_BUILD_SITE_ID,
  [BUILDABLE_IDS.workbench]: WORKBENCH_ID
});
export const BUILDABLE_SEQUENCE = Object.freeze([
  BUILDABLE_IDS.shelter,
  BUILDABLE_IDS.bed,
  BUILDABLE_IDS.toyBlocks
]);
export const REST_SHELTER_ID = "restShelter";
export const REST_SHELTER_FAMILY = "hammockBedShelter";
export const REST_SHELTER_STAGES = Object.freeze([
  "none",
  "hammock",
  "bedUpgrade",
  "reinforcedShelter"
]);
export const REST_SHELTER_VARIANTS = Object.freeze({
  none: "none",
  hammock: "restSling",
  bedUpgrade: "cozyBed",
  reinforcedShelter: "strongShelter"
});
export const ARRIVAL_SUPPLIES_ID = "arrivalSupplies";
export const ARRIVAL_SUPPLIES_FAMILY = "arrivalShoreBundle";
export const ARRIVAL_SUPPLIES_VARIANT = "beachBundle";
export const ARRIVAL_BUNDLE_ITEM_ID = "arrivalBundle";
export const STORAGE_WORKBENCH_TOOLS_ID = "storageWorkbenchTools";
export const STORAGE_WORKBENCH_TOOLS_FAMILY = "storageWorkbenchTools";
export const CAMP_STORAGE_ID = "campStorage";
export const TOOL_RACK_ID = "toolRack";
export const STONE_TOOL_ITEM_ID = "stoneTool";
export const WOOD_TOOL_ITEM_ID = "woodTool";
export const CAMP_LAYOUT_ID = "campLayout";
export const CAMP_PATHS_FAMILY = "campPaths";
export const CAMP_ZONES_FAMILY = "campZones";
export const BOUNDARY_STONE_ITEM_ID = "boundaryStone";
export const GARDEN_PLOTS_FAMILY = "gardenPlots";
export const GARDEN_PLOT_FAMILY = "gardenPlot";
export const WATER_CAN_ITEM_ID = "waterCan";
export const HARVESTED_CROP_ITEM_ID = "harvestedCrop";
export const BUILDABLE_REGISTRY = Object.freeze({
  [BUILDABLE_IDS.workbench]: buildable(BUILDABLE_IDS.workbench, "Workbench", 5, [-5.55, 0.24, -1.9], -0.18, 0, [
    stage("complete", "upgraded tool-ready workbench", 1)
  ], [
    slot("craft-workbench", "craft at workbench", "craftAtWorkbench", [-5.18, 0.24, -1.42], -2.82, 0.82)
  ]),
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
  const dayLengthSeconds = finiteNumber(options.dayLengthSeconds, CYCLE_SECONDS);
  const mood = typeof toyboxState.mood === "string" ? toyboxState.mood : "calm";
  const weather = typeof toyboxState.weather === "string" ? toyboxState.weather : "clear";

  return normalizeWorldState({
    version: 1,
    sim: {
      tick: 0,
      elapsedSeconds: elapsedSecondsFromTimeOfDay(timeOfDay, dayLengthSeconds),
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
      carriedItem: null,
      carriedObject: null,
      carrying: null,
      actionTimer: 0,
      minActionTime: 0,
      inventory: {
        wood: 0,
        fish: {
          state: "none",
          id: null
        }
      },
      toolInventory: createDefaultToolInventoryState(),
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
    arrivalSupplies: createDefaultArrivalSuppliesState(),
    campLayout: createDefaultCampLayoutState(),
    gardenPlots: createDefaultGardenPlotsState(),
    campStorage: createDefaultCampStorageState(),
    lifeLoop: {
      canSleep: false,
      sleepAvailable: false,
      restAvailable: true,
      activeRestId: null
    },
    restShelter: createDefaultRestShelterState(),
    toolRack: createDefaultToolRackState(),
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
  state.arrivalSupplies = state.arrivalSupplies && typeof state.arrivalSupplies === "object" ? state.arrivalSupplies : {};
  state.campLayout = state.campLayout && typeof state.campLayout === "object" ? state.campLayout : {};
  state.gardenPlots = normalizeGardenPlotsInput(state.gardenPlots);
  state.campStorage = state.campStorage && typeof state.campStorage === "object" ? state.campStorage : {};
  state.lifeLoop = state.lifeLoop && typeof state.lifeLoop === "object" ? state.lifeLoop : {};
  state.restShelter = state.restShelter && typeof state.restShelter === "object" ? state.restShelter : {};
  state.toolRack = state.toolRack && typeof state.toolRack === "object" ? state.toolRack : {};
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
  state.time.dayLengthSeconds = Math.max(1, finiteNumber(state.time.dayLengthSeconds, CYCLE_SECONDS));
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
  boy.carriedItem = normalizeCarriedItem(boy.carriedItem);
  boy.carriedObject = normalizeCarriedObject(boy.carriedObject);
  boy.carrying = normalizeCarrying(boy.carrying);
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
  boy.toolInventory = normalizeToolInventoryState(boy.toolInventory);
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
  workbench.yaw = finiteNumber(workbench.yaw, BUILDABLE_REGISTRY[BUILDABLE_IDS.workbench].buildSite.yaw || 0);
  workbench.kind = "buildable";
  workbench.buildableId = BUILDABLE_IDS.workbench;
  workbench.label = "Workbench";
  workbench.family = "workbench";
  workbench.visible = workbench.visible === false ? false : true;
  workbench.stage = normalizeWorkbenchStage(workbench.stage);
  workbench.variant = normalizeWorkbenchVariant(workbench.variant);
  workbench.usable = workbench.usable === false ? false : true;
  workbench.anchor = "camp";
  workbench.source = normalizeProceduralLocalExternal(workbench.source);
  workbench.debugLabel = "upgraded workbench";
  workbench.status = "complete";
  workbench.progress = 1;
  workbench.capacity = Math.max(0, finiteNumber(workbench.capacity, 8));
  workbench.requiredWood = 0;
  workbench.requiredResources = { wood: 0 };
  workbench.useSlots = BUILDABLE_REGISTRY[BUILDABLE_IDS.workbench].useSlots.map(cloneUseSlot);
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
  state.buildables[BUILDABLE_IDS.workbench] = workbench;
  state.arrivalSupplies = normalizeArrivalSuppliesState(state.arrivalSupplies, state);
  state.campLayout = normalizeCampLayoutState(state.campLayout, state);
  state.gardenPlots = normalizeGardenPlotsState(state.gardenPlots, state);
  state.campStorage = normalizeCampStorageState(state.campStorage, state);
  state.toolRack = normalizeToolRackState(state.toolRack, state);
  syncRestShelterState(state);

  return state;
}

export function syncRestShelterState(state) {
  const target = state && typeof state === "object" ? state : {};
  target.lifeLoop = normalizeLifeLoopState(target.lifeLoop, target);
  target.restShelter = normalizeRestShelterState(target.restShelter, target);
  return target.restShelter;
}

export function wrap01(value) {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
}

function elapsedSecondsFromTimeOfDay(timeOfDay, dayLengthSeconds) {
  const normalizedTime = wrap01(timeOfDay);
  const daySeconds = dayLengthSeconds * (DAY_SECONDS / CYCLE_SECONDS);
  const nightSeconds = dayLengthSeconds - daySeconds;
  if (normalizedTime >= 0.25 && normalizedTime < 0.75) {
    return ((normalizedTime - 0.25) / 0.5) * daySeconds;
  }
  return daySeconds + (wrap01(normalizedTime - 0.75) / 0.5) * nightSeconds;
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

function normalizeToolInventoryState(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    hasStoneTool: Boolean(source.hasStoneTool),
    hasWoodTool: Boolean(source.hasWoodTool),
    inspectingTool: normalizeToolItemId(source.inspectingTool),
    heldTool: normalizeToolItemId(source.heldTool)
  };
}

function normalizeCarriedItem(value) {
  return value === ARRIVAL_BUNDLE_ITEM_ID ? ARRIVAL_BUNDLE_ITEM_ID : null;
}

function normalizeCarriedObject(value) {
  return value === BOUNDARY_STONE_ITEM_ID ? BOUNDARY_STONE_ITEM_ID : null;
}

function normalizeCarrying(value) {
  if (value === WATER_CAN_ITEM_ID) return WATER_CAN_ITEM_ID;
  if (value === HARVESTED_CROP_ITEM_ID) return HARVESTED_CROP_ITEM_ID;
  return null;
}

function normalizeGardenPlotsInput(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return value;
  return createDefaultGardenPlotsState();
}

function normalizeGardenPlotsState(value, state) {
  const entries = normalizeCollectionEntries(value, createDefaultGardenPlotsState());
  return entries.slice(0, 8).map((entry, index) => normalizeGardenPlotState(entry, index, state));
}

function normalizeGardenPlotState(value, index, state) {
  const source = value && typeof value === "object" ? value : {};
  const fallback = createDefaultGardenPlotsState()[index] || createDefaultGardenPlot(index);
  const stage = normalizeGardenPlotStage(source.stage, source);
  const cropType = normalizeGardenCropType(source.cropType || source.variant || fallback.cropType);
  const active = Boolean(source.active || isGardenActionActive(state));
  const visible = source.visible === false ? false : stage !== "none";

  return {
    id: typeof source.id === "string" ? source.id : fallback.id,
    family: GARDEN_PLOT_FAMILY,
    visible,
    stage,
    variant: cropType,
    cropType,
    watered: Boolean(source.watered),
    active,
    usable: source.usable === false ? false : true,
    carried: false,
    owner: null,
    anchor: "camp",
    source: normalizeProceduralLocalExternal(source.source),
    position: normalizePositionValue(source.position || source.anchorPosition, fallback.position),
    debugLabel: typeof source.debugLabel === "string"
      ? source.debugLabel
      : `garden plot stage: ${stage}`
  };
}

function normalizeGardenPlotStage(value, source = {}) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "none" ||
    stage === "tilled" ||
    stage === "seeded" ||
    stage === "sprout1" ||
    stage === "sprout2" ||
    stage === "grown" ||
    stage === "harvested"
  ) {
    return stage;
  }
  if (stage || source.visible === true || source.watered === true) return "tilled";
  return "none";
}

function normalizeGardenCropType(value) {
  const cropType = typeof value === "string" ? value : "";
  if (cropType === "carrot" || cropType === "berry" || cropType === "leafy") return cropType;
  return "carrot";
}

function normalizePositionValue(value, fallback) {
  if (Array.isArray(value)) {
    return normalizeVector({ x: value[0], y: value[1], z: value[2] }, fallback);
  }
  return normalizeVector(value, fallback);
}

function normalizeCampLayoutState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const paths = normalizeCampLayoutPaths(source.paths);
  const zones = normalizeCampLayoutZones(source.zones);
  const active = Boolean(source.active || isCampLayoutActionActive(state));
  const clearedPathCount = paths.filter((path) => path.stage === "cleared" || path.stage === "lit").length;
  const litPathCount = paths.filter((path) => path.stage === "lit").length;
  const markedZoneCount = zones.filter((zone) => zone.stage === "marked").length;
  const boundaryStoneCount = zones.reduce((total, zone) => total + zone.boundaryStones.length, 0);
  const visible = source.visible === false ? false : clearedPathCount > 0 || markedZoneCount > 0 || active;
  const stage = litPathCount > 0
    ? "lit"
    : clearedPathCount > 0 || markedZoneCount > 0
      ? "marked"
      : "none";

  return {
    id: CAMP_LAYOUT_ID,
    family: "campLayout",
    visible,
    stage,
    variant: normalizeCampLayoutVariant(source.variant),
    active,
    usable: source.usable === false ? false : true,
    carried: state.bubbleBoy.carriedObject === BOUNDARY_STONE_ITEM_ID,
    owner: state.bubbleBoy.carriedObject === BOUNDARY_STONE_ITEM_ID ? BUBBLE_BOY_ID : null,
    anchor: "ground",
    source: normalizeProceduralLocalExternal(source.source),
    paths,
    zones,
    debugLabel: `camp layout: paths=${clearedPathCount} lit=${litPathCount} zones=${markedZoneCount} stones=${boundaryStoneCount}`
  };
}

function normalizeCampLayoutPaths(value) {
  const entries = normalizeCollectionEntries(value, createDefaultCampLayoutPaths());
  return entries.map((entry, index) => normalizeCampLayoutPath(entry, index));
}

function normalizeCampLayoutPath(value, index) {
  const source = value && typeof value === "object" ? value : {};
  const fallback = createDefaultCampLayoutPaths()[index] || createDefaultCampPath(index);
  const id = typeof source.id === "string" ? source.id : fallback.id;
  const stage = normalizeCampPathStage(source.stage, source);
  const waypoints = normalizeCampWaypoints(source.waypoints, fallback.waypoints);
  const active = Boolean(source.active);
  const visible = source.visible === false ? false : stage !== "none";

  return {
    id,
    family: CAMP_PATHS_FAMILY,
    visible,
    stage,
    variant: normalizeCampPathVariant(source.variant),
    active,
    usable: source.usable === false ? false : true,
    carried: false,
    owner: null,
    anchor: "ground",
    source: normalizeProceduralLocalExternal(source.source),
    waypoints,
    cleared: stage === "cleared" || stage === "lit",
    lit: stage === "lit",
    debugLabel: typeof source.debugLabel === "string"
      ? source.debugLabel
      : `${id}: ${stage}`
  };
}

function normalizeCampLayoutZones(value) {
  const entries = normalizeCollectionEntries(value, createDefaultCampLayoutZones());
  return entries.map((entry, index) => normalizeCampLayoutZone(entry, index));
}

function normalizeCampLayoutZone(value, index) {
  const source = value && typeof value === "object" ? value : {};
  const fallback = createDefaultCampLayoutZones()[index] || createDefaultCampZone(index);
  const id = typeof source.id === "string" ? source.id : fallback.id;
  const type = normalizeCampZoneType(source.type || fallback.type);
  const stage = normalizeCampZoneStage(source.stage, source);
  const markerPlaced = Boolean(source.markerPlaced || stage === "marked");
  const anchorPosition = normalizeVector(source.anchorPosition || source.position, fallback.anchorPosition);
  const boundaryStones = normalizeBoundaryStones(source.boundaryStones, source.boundaryStoneCount, anchorPosition);
  const visible = source.visible === false ? false : markerPlaced || boundaryStones.length > 0;

  return {
    id,
    family: CAMP_ZONES_FAMILY,
    visible,
    stage,
    variant: normalizeCampZoneVariant(source.variant, type),
    type,
    active: Boolean(source.active),
    usable: Boolean(source.usable),
    carried: false,
    owner: null,
    anchor: "ground",
    source: normalizeProceduralLocalExternal(source.source),
    markerPlaced,
    anchorPosition,
    boundaryStones,
    debugLabel: typeof source.debugLabel === "string" ? source.debugLabel : `${type} zone marker`
  };
}

function normalizeCollectionEntries(value, fallback) {
  if (Array.isArray(value)) return value.length > 0 ? value : fallback;
  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(([id, entry]) => {
      return entry && typeof entry === "object" ? { id, ...entry } : { id };
    });
    return entries.length > 0 ? entries : fallback;
  }
  return fallback;
}

function normalizeCampPathStage(value, source) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "cleared" || stage === "lit" || stage === "none") return stage;
  if (source && source.lit === true) return "lit";
  if (source && source.cleared === true) return "cleared";
  return "none";
}

function normalizeCampPathVariant(value) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "stoneEdge" || variant === "litDirtPath") return variant;
  return "dirtPath";
}

function normalizeCampZoneStage(value, source) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "marked" || stage === "none") return stage;
  return source && source.markerPlaced === true ? "marked" : "none";
}

function normalizeCampZoneVariant(value, type) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "workZoneStone" || variant === "restZoneStone" || variant === "cookZoneStone") return variant;
  if (type === "work") return "workZoneStone";
  if (type === "cook") return "cookZoneStone";
  return "restZoneStone";
}

function normalizeCampZoneType(value) {
  const type = typeof value === "string" ? value : "";
  if (type === "work" || type === "rest" || type === "cook") return type;
  return "rest";
}

function normalizeCampLayoutVariant(value) {
  return value === "litCampRing" ? "litCampRing" : "pathsZones";
}

function normalizeCampWaypoints(value, fallback) {
  const source = Array.isArray(value) && value.length >= 2 ? value : fallback;
  return source.slice(0, 8).map((point, index) => {
    const fallbackPoint = fallback[index] || fallback[fallback.length - 1] || vec3(0, 0, 0);
    return normalizeVector(point, fallbackPoint);
  });
}

function normalizeBoundaryStones(value, countValue, anchorPosition) {
  if (Array.isArray(value)) {
    return value.slice(0, 24).map((stone, index) => normalizeBoundaryStone(stone, index, anchorPosition));
  }
  const count = clamp(Math.floor(finiteNumber(countValue, 0)), 0, 12);
  return Array.from({ length: count }, (_unused, index) => normalizeBoundaryStone({}, index, anchorPosition));
}

function normalizeBoundaryStone(value, index, anchorPosition) {
  const source = value && typeof value === "object" ? value : {};
  const ring = boundaryStoneRingPosition(anchorPosition, index);
  return {
    id: typeof source.id === "string" ? source.id : `boundary-stone-${index + 1}`,
    family: CAMP_PATHS_FAMILY,
    visible: source.visible === false ? false : true,
    stage: "placed",
    variant: "boundaryStone",
    position: normalizeVector(source.position, ring),
    source: normalizeProceduralLocalExternal(source.source),
    debugLabel: "camp boundary stone"
  };
}

function boundaryStoneRingPosition(anchorPosition, index) {
  const radius = 0.62 + (index % 2) * 0.10;
  const angle = (index / 6) * Math.PI * 2 + 0.24;
  return vec3(
    anchorPosition.x + Math.cos(angle) * radius,
    anchorPosition.y,
    anchorPosition.z + Math.sin(angle) * radius
  );
}

function normalizeCampStorageState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const woodCount = clamp(finiteNumber(source.woodCount, finiteNumber(source.storedWood, 0)), 0, 24);
  const stage = normalizeCampStorageStage(source.stage, woodCount);
  const variant = normalizeCampStorageVariant(source.variant);
  return {
    id: CAMP_STORAGE_ID,
    family: "storage",
    visible: source.visible === false ? false : true,
    stage,
    variant,
    active: Boolean(source.active || isStorageWorkbenchToolsActionActive(state)),
    usable: source.usable === false ? false : true,
    carried: false,
    owner: null,
    anchor: "camp",
    woodCount,
    storedWood: woodCount,
    source: normalizeProceduralLocalExternal(source.source),
    debugLabel: "camp storage"
  };
}

function normalizeToolRackState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const toolInventory = state && state.bubbleBoy ? state.bubbleBoy.toolInventory || {} : {};
  const inspectingTool = isInspectToolActionActive(state)
    ? toolInventory.inspectingTool || toolInventory.heldTool || STONE_TOOL_ITEM_ID
    : null;
  const slots = normalizeToolRackSlots(source.slots);
  if (toolInventory.hasStoneTool && inspectingTool !== STONE_TOOL_ITEM_ID && !slots.some((slot) => slot.item === STONE_TOOL_ITEM_ID)) {
    slots.push(toolRackSlot("stone-tool-slot", STONE_TOOL_ITEM_ID));
  }
  if (toolInventory.hasWoodTool && inspectingTool !== WOOD_TOOL_ITEM_ID && !slots.some((slot) => slot.item === WOOD_TOOL_ITEM_ID)) {
    slots.push(toolRackSlot("wood-tool-slot", WOOD_TOOL_ITEM_ID));
  }

  const stage = normalizeToolRackStage(source.stage, slots, toolInventory);
  return {
    id: TOOL_RACK_ID,
    family: "toolRack",
    visible: source.visible === false ? false : true,
    stage,
    variant: normalizeToolRackVariant(source.variant),
    active: Boolean(source.active || isStorageWorkbenchToolsActionActive(state)),
    usable: source.usable === false ? false : true,
    carried: false,
    owner: null,
    anchor: "camp",
    slots,
    source: normalizeProceduralLocalExternal(source.source),
    debugLabel: "tool rack"
  };
}

function normalizeCampStorageStage(value, woodCount) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "empty" || stage === "hasWood") return woodCount > 0 ? "hasWood" : stage;
  return woodCount > 0 ? "hasWood" : "empty";
}

function normalizeCampStorageVariant(value) {
  return value === "crate" ? "crate" : "basket";
}

function normalizeWorkbenchStage(value) {
  return value === "complete" || value === "basic" ? value : "complete";
}

function normalizeWorkbenchVariant(value) {
  return value === "basic" ? "basic" : "upgraded";
}

function normalizeToolRackStage(value, slots, toolInventory) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "hasStoneTool" || stage === "hasWoodTool" || stage === "empty") {
    if (stage !== "empty") return stage;
  }
  if (slots.some((slot) => slot.item === STONE_TOOL_ITEM_ID) || toolInventory.hasStoneTool) return "hasStoneTool";
  if (slots.some((slot) => slot.item === WOOD_TOOL_ITEM_ID) || toolInventory.hasWoodTool) return "hasWoodTool";
  return "empty";
}

function normalizeToolRackVariant(value) {
  return value === "pegRail" ? "pegRail" : "simpleRack";
}

function normalizeToolRackSlots(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 3).map((slotValue, index) => {
    const slot = slotValue && typeof slotValue === "object" ? slotValue : {};
    const item = normalizeToolItemId(slot.item || slot.toolId || slot.id);
    return {
      id: typeof slot.id === "string" ? slot.id : `tool-slot-${index + 1}`,
      item,
      occupied: Boolean(slot.occupied || item),
      index
    };
  }).filter((slot) => slot.item);
}

function toolRackSlot(id, item) {
  return {
    id,
    item,
    occupied: true,
    index: item === STONE_TOOL_ITEM_ID ? 0 : 1
  };
}

function normalizeToolItemId(value) {
  const item = typeof value === "string" ? value : "";
  if (item === STONE_TOOL_ITEM_ID || item === "firstTool") return STONE_TOOL_ITEM_ID;
  if (item === WOOD_TOOL_ITEM_ID) return WOOD_TOOL_ITEM_ID;
  return null;
}

function normalizeProceduralLocalExternal(value) {
  const source = typeof value === "string" ? value : "";
  return source === "local" || source === "external" ? source : "procedural";
}

function isStorageWorkbenchToolsActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "depositMaterials" ||
    action === "craftAtWorkbench" ||
    action === "inspectTool" ||
    goal === "craft" ||
    goal === "storage" ||
    goal === "inspectTool"
  );
}

function isCampLayoutActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "rakePath" ||
    action === "placeBoundaryStone" ||
    action === "walkRoute" ||
    goal === "campLayout" ||
    goal === "rakePath" ||
    goal === "walkRoute"
  );
}

function isGardenActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "planting" ||
    action === "watering" ||
    action === "harvesting" ||
    action === "inspectingGarden" ||
    goal === "garden" ||
    goal === "planting" ||
    goal === "watering" ||
    goal === "harvesting" ||
    goal === "inspectingGarden"
  );
}

function isInspectToolActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  return boy.currentAction === "inspectTool" || boy.goal === "inspectTool";
}

function normalizeArrivalSuppliesState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const carriedByBB = Boolean(source.bundleCarriedByBB === true || state.bubbleBoy.carriedItem === ARRIVAL_BUNDLE_ITEM_ID);
  if (carriedByBB && state.bubbleBoy.carriedItem !== ARRIVAL_BUNDLE_ITEM_ID) {
    state.bubbleBoy.carriedItem = ARRIVAL_BUNDLE_ITEM_ID;
  }
  const scatteredSticksVisible = source.scatteredSticksVisible === false ? false : true;
  const scatteredLeavesVisible = source.scatteredLeavesVisible === false ? false : true;
  const materialPileVisible = Boolean(source.materialPileVisible);
  const washedBundleVisible = source.washedBundleVisible === false ? false : !carriedByBB;
  const hasGroundSupplies = washedBundleVisible || scatteredSticksVisible || scatteredLeavesVisible || materialPileVisible;
  const stage = normalizeArrivalSuppliesStage(source.stage, {
    hasGroundSupplies,
    scatteredVisible: scatteredSticksVisible || scatteredLeavesVisible,
    materialPileVisible
  });
  const visible = source.visible === false ? false : hasGroundSupplies || carriedByBB;

  return {
    id: ARRIVAL_SUPPLIES_ID,
    family: ARRIVAL_SUPPLIES_FAMILY,
    visible,
    stage,
    variant: ARRIVAL_SUPPLIES_VARIANT,
    active: Boolean(source.active),
    usable: Boolean(source.usable),
    carried: carriedByBB,
    owner: carriedByBB ? BUBBLE_BOY_ID : typeof source.owner === "string" ? source.owner : null,
    anchor: "shore",
    source: normalizeArrivalSuppliesSource(source.source),
    washedBundleVisible,
    scatteredSticksVisible,
    scatteredLeavesVisible,
    materialPileVisible,
    bundleCarriedByBB: carriedByBB,
    debugLabel: `arrivalSupplies: washedBundle=${washedBundleVisible ? 1 : 0} scattered=${scatteredSticksVisible || scatteredLeavesVisible ? 1 : 0} pile=${materialPileVisible ? 1 : 0} carried=${carriedByBB ? 1 : 0}`
  };
}

function normalizeArrivalSuppliesStage(value, state) {
  if (value === "none") return "none";
  if (value === "complete") return "complete";
  if (!state.hasGroundSupplies) return "none";
  if (state.materialPileVisible && !state.scatteredVisible) return "partial";
  if (value === "partial") return "partial";
  return "supplies";
}

function normalizeArrivalSuppliesSource(value) {
  const source = typeof value === "string" ? value : "";
  return source === "local" || source === "external" ? source : "procedural";
}

function normalizeLifeLoopState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const bed = state.buildables && state.buildables[BUILDABLE_IDS.bed];
  const bedReady = Boolean(bed && bed.progress >= 1);
  const canSleep = Boolean(source.canSleep === true || source.sleepAvailable === true || bedReady);
  return {
    canSleep,
    sleepAvailable: canSleep,
    restAvailable: source.restAvailable === false ? false : true,
    activeRestId: canSleep || isRestShelterActionActive(state)
      ? REST_SHELTER_ID
      : typeof source.activeRestId === "string"
        ? source.activeRestId
        : null
  };
}

function normalizeRestShelterState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const sourceStage = normalizeRestShelterStage(source.stage);
  const stage = sourceStage === "none" ? "none" : deriveRestShelterStage(state);
  const variant = REST_SHELTER_VARIANTS[stage] || "restSling";
  const visible = source.visible === false ? false : stage !== "none";
  const lifeLoop = state.lifeLoop && typeof state.lifeLoop === "object" ? state.lifeLoop : {};
  const active = Boolean(source.active === true || isRestShelterActionActive(state));
  const usable = Boolean(source.usable === true || lifeLoop.canSleep === true || lifeLoop.sleepAvailable === true);

  return {
    id: REST_SHELTER_ID,
    family: REST_SHELTER_FAMILY,
    visible,
    stage,
    variant,
    active,
    usable,
    carried: false,
    owner: typeof source.owner === "string" ? source.owner : null,
    anchor: "camp",
    source: normalizeRestShelterSource(source.source),
    debugLabel: "rest object state"
  };
}

function deriveRestShelterStage(state) {
  const buildables = state && state.buildables ? state.buildables : {};
  const shelter = buildables[BUILDABLE_IDS.shelter] || {};
  const bed = buildables[BUILDABLE_IDS.bed] || {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const shelterComplete = Number(shelter.progress || 0) >= 1;
  const bedComplete = Number(bed.progress || 0) >= 1;
  if (day >= 76 && shelterComplete) return "reinforcedShelter";
  if (day >= 21 || bedComplete) return "bedUpgrade";
  return "hammock";
}

function normalizeRestShelterStage(value) {
  const stage = typeof value === "string" ? value : "";
  return REST_SHELTER_STAGES.includes(stage) ? stage : null;
}

function normalizeRestShelterVariant(value) {
  const variant = typeof value === "string" ? value : "";
  return Object.values(REST_SHELTER_VARIANTS).includes(variant) ? variant : null;
}

function normalizeRestShelterSource(value) {
  const source = typeof value === "string" ? value : "";
  return source === "local" || source === "external" ? source : "procedural";
}

function isRestShelterActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const builderAction = boy.builder && typeof boy.builder.actionState === "string" ? boy.builder.actionState : "";
  return (
    goal === "sleep" ||
    goal === "rest" ||
    goal === "useBed" ||
    action === "sleep" ||
    action === "wake" ||
    action === "rest" ||
    action === "resting" ||
    builderAction === "sleep"
  );
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
    kind: "buildable",
    buildableId: BUILDABLE_IDS.workbench,
    label: "Workbench",
    family: "workbench",
    visible: true,
    stage: "complete",
    variant: "upgraded",
    usable: true,
    anchor: "camp",
    source: "procedural",
    status: "complete",
    progress: 1,
    position: vec3(-5.55, 0.24, -1.9),
    yaw: BUILDABLE_REGISTRY[BUILDABLE_IDS.workbench].buildSite.yaw || 0,
    wood: 0,
    capacity: 8,
    requiredWood: 0,
    requiredResources: {
      wood: 0
    },
    useSlots: BUILDABLE_REGISTRY[BUILDABLE_IDS.workbench].useSlots.map(cloneUseSlot),
    debugLabel: "upgraded workbench"
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

function createDefaultRestShelterState() {
  return {
    id: REST_SHELTER_ID,
    family: REST_SHELTER_FAMILY,
    visible: true,
    stage: "hammock",
    variant: "restSling",
    active: false,
    usable: false,
    carried: false,
    owner: null,
    anchor: "camp",
    source: "procedural",
    debugLabel: "rest object state"
  };
}

function createDefaultToolInventoryState() {
  return {
    hasStoneTool: false,
    hasWoodTool: false,
    inspectingTool: null,
    heldTool: null
  };
}

function createDefaultCampLayoutState() {
  return {
    id: CAMP_LAYOUT_ID,
    family: "campLayout",
    visible: false,
    stage: "none",
    variant: "pathsZones",
    active: false,
    usable: true,
    carried: false,
    owner: null,
    anchor: "ground",
    source: "procedural",
    paths: createDefaultCampLayoutPaths(),
    zones: createDefaultCampLayoutZones(),
    debugLabel: "camp layout: paths=0 lit=0 zones=0 stones=0"
  };
}

function createDefaultCampLayoutPaths() {
  return [
    {
      id: "path_workbench_to_fire",
      family: CAMP_PATHS_FAMILY,
      visible: false,
      stage: "none",
      variant: "dirtPath",
      active: false,
      usable: true,
      carried: false,
      owner: null,
      anchor: "ground",
      source: "procedural",
      waypoints: [vec3(-5.55, 0.18, -1.9), vec3(-2.75, 0.18, -1.05), vec3(0, 0.18, -0.16)],
      debugLabel: "Path from workbench to fire"
    },
    {
      id: "path_fire_to_rest",
      family: CAMP_PATHS_FAMILY,
      visible: false,
      stage: "none",
      variant: "dirtPath",
      active: false,
      usable: true,
      carried: false,
      owner: null,
      anchor: "ground",
      source: "procedural",
      waypoints: [vec3(0, 0.18, -0.16), vec3(-3.05, 0.18, -1.58), vec3(-5.76, 0.18, -2.70)],
      debugLabel: "Path from fire to rest zone"
    }
  ];
}

function createDefaultCampPath(index) {
  const startX = -4.0 + index * 0.45;
  return {
    id: `camp_path_${index + 1}`,
    family: CAMP_PATHS_FAMILY,
    visible: false,
    stage: "none",
    variant: "dirtPath",
    active: false,
    usable: true,
    carried: false,
    owner: null,
    anchor: "ground",
    source: "procedural",
    waypoints: [vec3(startX, 0.18, -1.0), vec3(startX + 1.0, 0.18, -0.5)],
    debugLabel: `Camp path ${index + 1}`
  };
}

function createDefaultCampLayoutZones() {
  return [
    {
      id: "zone_work",
      family: CAMP_ZONES_FAMILY,
      visible: false,
      stage: "none",
      variant: "workZoneStone",
      type: "work",
      active: false,
      usable: false,
      carried: false,
      owner: null,
      anchor: "ground",
      source: "procedural",
      markerPlaced: false,
      anchorPosition: vec3(-5.18, 0.18, -1.42),
      boundaryStones: [],
      debugLabel: "Work zone marker"
    },
    {
      id: "zone_cook",
      family: CAMP_ZONES_FAMILY,
      visible: false,
      stage: "none",
      variant: "cookZoneStone",
      type: "cook",
      active: false,
      usable: false,
      carried: false,
      owner: null,
      anchor: "ground",
      source: "procedural",
      markerPlaced: false,
      anchorPosition: vec3(0.62, 0.18, 0.28),
      boundaryStones: [],
      debugLabel: "Cook zone marker"
    },
    {
      id: "zone_rest",
      family: CAMP_ZONES_FAMILY,
      visible: false,
      stage: "none",
      variant: "restZoneStone",
      type: "rest",
      active: false,
      usable: false,
      carried: false,
      owner: null,
      anchor: "ground",
      source: "procedural",
      markerPlaced: false,
      anchorPosition: vec3(-5.76, 0.18, -2.70),
      boundaryStones: [],
      debugLabel: "Rest zone marker"
    }
  ];
}

function createDefaultCampZone(index) {
  const type = index % 3 === 0 ? "work" : index % 3 === 1 ? "cook" : "rest";
  return {
    id: `camp_zone_${index + 1}`,
    family: CAMP_ZONES_FAMILY,
    visible: false,
    stage: "none",
    variant: normalizeCampZoneVariant(null, type),
    type,
    active: false,
    usable: false,
    carried: false,
    owner: null,
    anchor: "ground",
    source: "procedural",
    markerPlaced: false,
    anchorPosition: vec3(-3 + index * 0.5, 0.18, -2),
    boundaryStones: [],
    debugLabel: `Camp zone ${index + 1}`
  };
}

function createDefaultGardenPlotsState() {
  return [createDefaultGardenPlot(0)];
}

function createDefaultGardenPlot(index) {
  return {
    id: index === 0 ? "gardenPlot_01" : `gardenPlot_${String(index + 1).padStart(2, "0")}`,
    family: GARDEN_PLOT_FAMILY,
    visible: false,
    stage: "none",
    variant: "carrot",
    cropType: "carrot",
    watered: false,
    active: false,
    usable: true,
    carried: false,
    owner: null,
    anchor: "camp",
    source: "procedural",
    position: vec3(-4.40 + index * 0.82, 0.18, -3.62),
    debugLabel: "garden plot stage: none"
  };
}

function createDefaultCampStorageState() {
  return {
    id: CAMP_STORAGE_ID,
    family: "storage",
    visible: true,
    stage: "empty",
    variant: "basket",
    active: false,
    usable: true,
    carried: false,
    owner: null,
    anchor: "camp",
    woodCount: 0,
    storedWood: 0,
    source: "procedural",
    debugLabel: "camp storage"
  };
}

function createDefaultToolRackState() {
  return {
    id: TOOL_RACK_ID,
    family: "toolRack",
    visible: true,
    stage: "empty",
    variant: "simpleRack",
    active: false,
    usable: true,
    carried: false,
    owner: null,
    anchor: "camp",
    slots: [],
    source: "procedural",
    debugLabel: "tool rack"
  };
}

function createDefaultArrivalSuppliesState() {
  return {
    id: ARRIVAL_SUPPLIES_ID,
    family: ARRIVAL_SUPPLIES_FAMILY,
    visible: true,
    stage: "supplies",
    variant: ARRIVAL_SUPPLIES_VARIANT,
    active: false,
    usable: false,
    carried: false,
    owner: null,
    anchor: "shore",
    source: "procedural",
    washedBundleVisible: true,
    scatteredSticksVisible: true,
    scatteredLeavesVisible: true,
    materialPileVisible: false,
    bundleCarriedByBB: false,
    debugLabel: "arrivalSupplies: washedBundle=1 scattered=1 pile=0 carried=0"
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
