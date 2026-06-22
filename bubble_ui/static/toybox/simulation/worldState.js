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
export const FOOD_ROUTINE_ID = "foodRoutine";
export const FOOD_ROUTINE_FAMILY = "foodRoutine";
export const FISH_TRAP_ROUTINE_ID = "fishTrapRoutine";
export const FISH_TRAP_ROUTINE_FAMILY = "fishTrapRoutine";
export const TOY_PLAY_SET_ID = "toyPlaySet";
export const TOY_PLAY_SET_FAMILY = "toyPlaySet";
export const MUSIC_ART_DECOR_ID = "musicArtDecor";
export const MUSIC_ART_DECOR_FAMILY = "musicArtDecor";
export const ANIMAL_FAMILIAR_VISITOR_ID = "animalFamiliarVisitor";
export const ANIMAL_FAMILIAR_VISITOR_FAMILY = "animalFamiliarVisitor";
export const NIGHT_COMFORT_LIGHTS_ID = "nightComfortLights";
export const NIGHT_COMFORT_LIGHTS_FAMILY = "nightComfortLights";
export const LOOKOUT_MAP_HORIZON_ID = "lookoutMapHorizon";
export const LOOKOUT_MAP_HORIZON_FAMILY = "lookoutMapHorizon";
export const MAJOR_PROJECT_CAPSTONE_ID = "majorProjectCapstone";
export const MAJOR_PROJECT_CAPSTONE_FAMILY = "majorProjectCapstone";
export const AMBIENT_BEACH_FINDS_ID = "ambientBeachFinds";
export const AMBIENT_BEACH_FINDS_FAMILY = "ambientBeachFinds";
export const PIER_SHORE_WORK_SITE_ID = "pierShoreWorkSite";
export const PIER_SHORE_WORK_SITE_FAMILY = "pierShoreWorkSite";
export const RAFT_BOAT_ROUTE_ID = "raftBoatRoute";
export const RAFT_BOAT_ROUTE_FAMILY = "raftBoatRoute";
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
    foodRoutine: createDefaultFoodRoutineState(),
    fishTrapRoutine: createDefaultFishTrapRoutineState(),
    toyPlaySet: createDefaultToyPlaySetState(),
    musicArtDecor: createDefaultMusicArtDecorState(),
    animalFamiliarVisitor: createDefaultAnimalFamiliarVisitorState(),
    nightComfortLights: createDefaultNightComfortLightsState(),
    lookoutMapHorizon: createDefaultLookoutMapHorizonState(),
    majorProjectCapstone: createDefaultMajorProjectCapstoneState(),
    ambientBeachFinds: createDefaultAmbientBeachFindsState(),
    pierShoreWorkSite: createDefaultPierShoreWorkSiteState(),
    raftBoatRoute: createDefaultRaftBoatRouteState(),
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
  state.foodRoutine = state.foodRoutine && typeof state.foodRoutine === "object" ? state.foodRoutine : {};
  state.fishTrapRoutine =
    state.fishTrapRoutine && typeof state.fishTrapRoutine === "object" ? state.fishTrapRoutine : {};
  state.toyPlaySet = state.toyPlaySet && typeof state.toyPlaySet === "object" ? state.toyPlaySet : {};
  state.musicArtDecor = state.musicArtDecor && typeof state.musicArtDecor === "object" ? state.musicArtDecor : {};
  state.animalFamiliarVisitor =
    state.animalFamiliarVisitor && typeof state.animalFamiliarVisitor === "object"
      ? state.animalFamiliarVisitor
      : {};
  state.nightComfortLights =
    state.nightComfortLights && typeof state.nightComfortLights === "object" ? state.nightComfortLights : {};
  state.lookoutMapHorizon =
    state.lookoutMapHorizon && typeof state.lookoutMapHorizon === "object" ? state.lookoutMapHorizon : {};
  state.majorProjectCapstone =
    state.majorProjectCapstone && typeof state.majorProjectCapstone === "object" ? state.majorProjectCapstone : {};
  state.ambientBeachFinds =
    state.ambientBeachFinds && typeof state.ambientBeachFinds === "object" ? state.ambientBeachFinds : {};
  state.pierShoreWorkSite =
    state.pierShoreWorkSite && typeof state.pierShoreWorkSite === "object" ? state.pierShoreWorkSite : {};
  state.raftBoatRoute = state.raftBoatRoute && typeof state.raftBoatRoute === "object" ? state.raftBoatRoute : {};
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
  state.foodRoutine = normalizeFoodRoutineState(state.foodRoutine, state);
  state.fishTrapRoutine = normalizeFishTrapRoutineState(state.fishTrapRoutine, state);
  state.toyPlaySet = normalizeToyPlaySetState(state.toyPlaySet, state);
  state.musicArtDecor = normalizeMusicArtDecorState(state.musicArtDecor, state);
  state.animalFamiliarVisitor = normalizeAnimalFamiliarVisitorState(state.animalFamiliarVisitor, state);
  state.nightComfortLights = normalizeNightComfortLightsState(state.nightComfortLights, state);
  state.lookoutMapHorizon = normalizeLookoutMapHorizonState(state.lookoutMapHorizon, state);
  state.majorProjectCapstone = normalizeMajorProjectCapstoneState(state.majorProjectCapstone, state);
  state.ambientBeachFinds = normalizeAmbientBeachFindsState(state.ambientBeachFinds, state);
  state.pierShoreWorkSite = normalizePierShoreWorkSiteState(state.pierShoreWorkSite, state);
  state.raftBoatRoute = normalizeRaftBoatRouteState(state.raftBoatRoute, state);
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

function normalizeFoodRoutineState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const routineDay = isFoodRoutineDay(day);
  const active = Boolean(source.active || isFoodRoutineActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const basketStock = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.basketStock, routineDay ? 4 : 0)), 0, 12);
  const mealCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.mealCount, routineDay ? 3 : 0)), 0, 8);
  const driedFishCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.driedFishCount, day >= 56 && day <= 60 ? 4 : routineDay ? 2 : 0)),
    0,
    8
  );
  const harvestCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.harvestCount, routineDay ? 5 : 0)), 0, 12);
  const leftoverCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.leftoverCount, routineDay ? 1 : 0)), 0, 4);
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(source.visible === true || (autoVisible && routineDay) || active || basketStock || mealCount || driedFishCount || harvestCount || leftoverCount);
  const stage = normalizeFoodRoutineStage(derivedFromDay ? null : source.stage, {
    visible,
    day,
    driedFishCount,
    mealCount,
    leftoverCount
  });
  const variant = normalizeFoodRoutineVariant(derivedFromDay ? null : source.variant, day);
  const generatedFalse = (value) => value === false && !autoVisible;

  return {
    id: FOOD_ROUTINE_ID,
    family: FOOD_ROUTINE_FAMILY,
    visible,
    stage,
    variant,
    active,
    autoVisible,
    usable: source.usable === false ? false : true,
    carried: false,
    owner: null,
    anchor: "cook-zone",
    source: normalizeProceduralLocalExternal(source.source),
    cookSurfaceVisible: generatedFalse(source.cookSurfaceVisible) ? false : visible,
    basketVisible: generatedFalse(source.basketVisible) ? false : visible && basketStock > 0,
    storedMealsVisible: generatedFalse(source.storedMealsVisible) ? false : visible && mealCount > 0,
    dryingRackVisible: generatedFalse(source.dryingRackVisible) ? false : visible && driedFishCount > 0,
    fishHarvestVisible: generatedFalse(source.fishHarvestVisible) ? false : visible && harvestCount > 0,
    leftoversVisible: generatedFalse(source.leftoversVisible) ? false : visible && leftoverCount > 0,
    basketStock,
    mealCount,
    driedFishCount,
    harvestCount,
    leftoverCount,
    debugLabel: `food routine: stage=${stage} meals=${mealCount} dried=${driedFishCount} harvest=${harvestCount}`
  };
}

function normalizeFoodRoutineStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "none") return context.visible ? defaultFoodRoutineStage(context.day) : "none";
  if (stage === "prep" || stage === "stored" || stage === "drying" || stage === "leftovers") return stage;
  if (!context.visible) return "none";
  if (context.day >= 56 && context.day <= 60) return "stored";
  if (context.leftoverCount > 0 && context.mealCount === 0) return "leftovers";
  if (context.driedFishCount > 2) return "drying";
  return defaultFoodRoutineStage(context.day);
}

function defaultFoodRoutineStage(day) {
  if (day >= 56 && day <= 60) return "stored";
  if (day >= 31 && day <= 35) return "prep";
  return "none";
}

function normalizeFoodRoutineVariant(value, day) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "cookPrep" || variant === "storageSpread" || variant === "dryingDay") return variant;
  if (day >= 56 && day <= 60) return "storageSpread";
  if (day >= 31 && day <= 35) return "cookPrep";
  return "cookPrep";
}

function isFoodRoutineDay(day) {
  return (day >= 31 && day <= 35) || (day >= 56 && day <= 60);
}

function normalizeFishTrapRoutineState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const trapDay = isFishTrapRoutineDay(day);
  const active = Boolean(source.active || isFishTrapRoutineActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const requestedTrapState = derivedFromDay ? null : source.trapState || source.stage;
  const defaultTrapState = normalizeFishTrapRoutineTrapState(requestedTrapState, {
    day,
    active,
    visibleHint: trapDay || active || source.visible === true
  });
  const defaults = fishTrapRoutineDefaultCounts(defaultTrapState, trapDay || active || source.visible === true);
  const trapCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.trapCount, defaults.trapCount)), 0, 2);
  const buoyCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.buoyCount, defaults.buoyCount)), 0, 2);
  const lineCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.lineCount, defaults.lineCount)), 0, 2);
  const stateCueCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.stateCueCount, defaults.stateCueCount)),
    0,
    3
  );
  const dryingRackCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.dryingRackCount, defaults.dryingRackCount)),
    0,
    2
  );
  const catchDisplayCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.catchDisplayCount, defaults.catchDisplayCount)),
    0,
    2
  );
  const fishCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.fishCount, defaults.fishCount)), 0, 6);
  const crabCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.crabCount, defaults.crabCount)), 0, 4);
  const dryingFishCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.dryingFishCount, defaults.dryingFishCount)),
    0,
    6
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && trapDay) ||
        active ||
        trapCount ||
        buoyCount ||
        lineCount ||
        stateCueCount ||
        dryingRackCount ||
        catchDisplayCount ||
        fishCount ||
        crabCount ||
        dryingFishCount
    );
  const trapState = visible ? defaultTrapState : "unset";
  const generatedFalse = (flag) => flag === false && !autoVisible;

  return {
    id: FISH_TRAP_ROUTINE_ID,
    family: FISH_TRAP_ROUTINE_FAMILY,
    visible,
    stage: normalizeFishTrapRoutineStage(derivedFromDay ? null : source.stage, trapState, visible),
    variant: normalizeFishTrapRoutineVariant(derivedFromDay ? null : source.variant, trapState),
    trapState,
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "shoreline-trap",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-13.7, 0.18, 32.6)),
    buoyPosition: normalizePositionValue(source.buoyPosition, vec3(-15.05, -0.12, 33.8)),
    dryingRackPosition: normalizePositionValue(source.dryingRackPosition, vec3(-11.52, 0.18, 30.28)),
    source: normalizeProceduralLocalExternal(source.source),
    trapVisible: generatedFalse(source.trapVisible) ? false : visible && trapCount > 0,
    buoyVisible: generatedFalse(source.buoyVisible) ? false : visible && buoyCount > 0,
    lineVisible: generatedFalse(source.lineVisible) ? false : visible && lineCount > 0,
    stateCuesVisible: generatedFalse(source.stateCuesVisible) ? false : visible && stateCueCount > 0,
    dryingRackVisible: generatedFalse(source.dryingRackVisible) ? false : visible && dryingRackCount > 0,
    catchDisplayVisible: generatedFalse(source.catchDisplayVisible) ? false : visible && catchDisplayCount > 0,
    trapCount,
    buoyCount,
    lineCount,
    stateCueCount,
    dryingRackCount,
    catchDisplayCount,
    fishCount,
    crabCount,
    dryingFishCount,
    statePlaceholders: ["unset", "set", "readyToCheck", "collected", "drying"],
    integrationNote: "visual-only fish trap routine placeholders; no catch timers, randomness, storage, or food economy",
    debugLabel: `fish trap routine: trapState=${trapState} fish=${fishCount} crab=${crabCount} drying=${dryingFishCount}`
  };
}

function normalizeFishTrapRoutineTrapState(value, context) {
  const trapState = typeof value === "string" ? value : "";
  if (
    trapState === "unset" ||
    trapState === "set" ||
    trapState === "readyToCheck" ||
    trapState === "collected" ||
    trapState === "drying"
  ) {
    return trapState;
  }
  if (!context.visibleHint) return "unset";
  if (context.active && !isFishTrapRoutineDay(context.day)) return "set";
  return defaultFishTrapRoutineTrapState(context.day);
}

function normalizeFishTrapRoutineStage(value, trapState, visible) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "unset" ||
    stage === "set" ||
    stage === "readyToCheck" ||
    stage === "collected" ||
    stage === "drying"
  ) {
    return visible ? stage : "unset";
  }
  return visible ? trapState : "unset";
}

function normalizeFishTrapRoutineVariant(value, trapState) {
  const variant = typeof value === "string" ? value : "";
  if (
    variant === "unsetMarker" ||
    variant === "setLine" ||
    variant === "readyCheck" ||
    variant === "collectDisplay" ||
    variant === "dryingRack"
  ) {
    return variant;
  }
  if (trapState === "readyToCheck") return "readyCheck";
  if (trapState === "collected") return "collectDisplay";
  if (trapState === "drying") return "dryingRack";
  if (trapState === "set") return "setLine";
  return "unsetMarker";
}

function defaultFishTrapRoutineTrapState(day) {
  if (day === 56) return "set";
  if (day === 57 || day === 58) return "readyToCheck";
  if (day === 59) return "collected";
  if (day === 60) return "drying";
  return "unset";
}

function fishTrapRoutineDefaultCounts(trapState, enabled) {
  if (!enabled || trapState === "unset") {
    return {
      trapCount: 0,
      buoyCount: 0,
      lineCount: 0,
      stateCueCount: 0,
      dryingRackCount: 0,
      catchDisplayCount: 0,
      fishCount: 0,
      crabCount: 0,
      dryingFishCount: 0
    };
  }

  if (trapState === "drying") {
    return {
      trapCount: 0,
      buoyCount: 0,
      lineCount: 0,
      stateCueCount: 1,
      dryingRackCount: 1,
      catchDisplayCount: 1,
      fishCount: 2,
      crabCount: 1,
      dryingFishCount: 4
    };
  }

  if (trapState === "collected") {
    return {
      trapCount: 1,
      buoyCount: 1,
      lineCount: 0,
      stateCueCount: 1,
      dryingRackCount: 0,
      catchDisplayCount: 1,
      fishCount: 2,
      crabCount: 1,
      dryingFishCount: 0
    };
  }

  if (trapState === "readyToCheck") {
    return {
      trapCount: 1,
      buoyCount: 1,
      lineCount: 1,
      stateCueCount: 1,
      dryingRackCount: 0,
      catchDisplayCount: 0,
      fishCount: 2,
      crabCount: 1,
      dryingFishCount: 0
    };
  }

  return {
    trapCount: 1,
    buoyCount: 1,
    lineCount: 1,
    stateCueCount: 1,
    dryingRackCount: 0,
    catchDisplayCount: 0,
    fishCount: 0,
    crabCount: 0,
    dryingFishCount: 0
  };
}

function isFishTrapRoutineDay(day) {
  return day >= 56 && day <= 60;
}

function normalizeToyPlaySetState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const toyDay = isToyPlaySetDay(day);
  const active = Boolean(source.active || isToyPlaySetActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const defaultStage = normalizeToyPlaySetStage(derivedFromDay ? null : source.stage, {
    day,
    active,
    visibleHint: toyDay || active || source.visible === true
  });
  const defaults = toyPlaySetDefaultCounts(defaultStage, toyDay || active || source.visible === true);
  const collectionSlotCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.collectionSlotCount, defaults.collectionSlotCount)),
    0,
    6
  );
  const blockCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.blockCount, defaults.blockCount)),
    0,
    8
  );
  const ballCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.ballCount, defaults.ballCount)),
    0,
    1
  );
  const kiteCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.kiteCount, defaults.kiteCount)),
    0,
    1
  );
  const stringCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.stringCount, defaults.stringCount)),
    0,
    1
  );
  const handleCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.handleCount, defaults.handleCount)),
    0,
    1
  );
  const spinningTopCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.spinningTopCount, defaults.spinningTopCount)),
    0,
    1
  );
  const playMatCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.playMatCount, defaults.playMatCount)),
    0,
    1
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && toyDay) ||
        active ||
        collectionSlotCount ||
        blockCount ||
        ballCount ||
        kiteCount ||
        stringCount ||
        handleCount ||
        spinningTopCount ||
        playMatCount
    );
  const stage = visible ? defaultStage : "hidden";
  const generatedFalse = (flag) => flag === false && !autoVisible;

  return {
    id: TOY_PLAY_SET_ID,
    family: TOY_PLAY_SET_FAMILY,
    visible,
    stage,
    variant: normalizeToyPlaySetVariant(derivedFromDay ? null : source.variant, stage),
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "toy-buildable-sidecar",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-4.18, 0.18, -2.22)),
    kiteAnchorPosition: normalizePositionValue(source.kiteAnchorPosition, vec3(-4.72, 0.18, -2.86)),
    source: normalizeProceduralLocalExternal(source.source),
    collectionSlotsVisible: generatedFalse(source.collectionSlotsVisible) ? false : visible && collectionSlotCount > 0,
    toyBlocksVisible: generatedFalse(source.toyBlocksVisible) ? false : visible && blockCount > 0,
    ballVisible: generatedFalse(source.ballVisible) ? false : visible && ballCount > 0,
    kiteVisible: generatedFalse(source.kiteVisible) ? false : visible && kiteCount > 0,
    kiteStringVisible: generatedFalse(source.kiteStringVisible) ? false : visible && stringCount > 0,
    kiteHandleVisible: generatedFalse(source.kiteHandleVisible) ? false : visible && handleCount > 0,
    spinningTopVisible: generatedFalse(source.spinningTopVisible) ? false : visible && spinningTopCount > 0,
    playMatVisible: generatedFalse(source.playMatVisible) ? false : visible && playMatCount > 0,
    collectionSlotCount,
    blockCount,
    ballCount,
    kiteCount,
    stringCount,
    handleCount,
    spinningTopCount,
    playMatCount,
    statePlaceholders: ["hidden", "collection", "active", "matLayout", "kiteDay"],
    duplicateSystemClassification:
      "extension beside existing toy-block buildable; no competing toy crafting/use system",
    integrationNote:
      "visual-only toy play set placeholders; no play cooldowns, mood effects, toy crafting, kite physics, ball physics, or interactions",
    debugLabel:
      `toy play set: stage=${stage} slots=${collectionSlotCount} blocks=${blockCount} kite=${kiteCount} mat=${playMatCount}`
  };
}

function normalizeToyPlaySetStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "hidden" ||
    stage === "collection" ||
    stage === "active" ||
    stage === "matLayout" ||
    stage === "kiteDay"
  ) {
    return context.visibleHint ? stage : "hidden";
  }
  if (!context.visibleHint) return "hidden";
  if (context.active && !isToyPlaySetDay(context.day)) return "active";
  return defaultToyPlaySetStage(context.day);
}

function normalizeToyPlaySetVariant(value, stage) {
  const variant = typeof value === "string" ? value : "";
  if (
    variant === "collectionSlots" ||
    variant === "activeMain" ||
    variant === "playMatLayout" ||
    variant === "kiteBallTop"
  ) {
    return variant;
  }
  if (stage === "collection") return "collectionSlots";
  if (stage === "matLayout") return "playMatLayout";
  if (stage === "kiteDay") return "kiteBallTop";
  return "activeMain";
}

function defaultToyPlaySetStage(day) {
  if (day === 61) return "collection";
  if (day === 63) return "kiteDay";
  if (day === 64) return "matLayout";
  if (day === 62 || day === 65) return "active";
  return "hidden";
}

function toyPlaySetDefaultCounts(stage, enabled) {
  if (!enabled || stage === "hidden") {
    return {
      collectionSlotCount: 0,
      blockCount: 0,
      ballCount: 0,
      kiteCount: 0,
      stringCount: 0,
      handleCount: 0,
      spinningTopCount: 0,
      playMatCount: 0
    };
  }
  if (stage === "collection") {
    return {
      collectionSlotCount: 5,
      blockCount: 4,
      ballCount: 0,
      kiteCount: 0,
      stringCount: 0,
      handleCount: 0,
      spinningTopCount: 1,
      playMatCount: 1
    };
  }
  if (stage === "kiteDay") {
    return {
      collectionSlotCount: 5,
      blockCount: 5,
      ballCount: 1,
      kiteCount: 1,
      stringCount: 1,
      handleCount: 1,
      spinningTopCount: 1,
      playMatCount: 1
    };
  }
  if (stage === "matLayout") {
    return {
      collectionSlotCount: 5,
      blockCount: 8,
      ballCount: 1,
      kiteCount: 1,
      stringCount: 1,
      handleCount: 1,
      spinningTopCount: 1,
      playMatCount: 1
    };
  }
  return {
    collectionSlotCount: 5,
    blockCount: 6,
    ballCount: 1,
    kiteCount: 1,
    stringCount: 1,
    handleCount: 1,
    spinningTopCount: 1,
    playMatCount: 1
  };
}

function isToyPlaySetDay(day) {
  return day >= 61 && day <= 65;
}

function normalizeMusicArtDecorState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const decorDay = isMusicArtDecorDay(day);
  const active = Boolean(source.active || isMusicArtDecorActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const defaultStage = normalizeMusicArtDecorStage(derivedFromDay ? null : source.stage, {
    day,
    active,
    visibleHint: decorDay || active || source.visible === true
  });
  const defaults = musicArtDecorDefaultCounts(defaultStage, decorDay || active || source.visible === true);
  const shellChimeCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.shellChimeCount, defaults.shellChimeCount)),
    0,
    1
  );
  const paintedStoneCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.paintedStoneCount, defaults.paintedStoneCount)),
    0,
    6
  );
  const drumCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.drumCount, defaults.drumCount)), 0, 1);
  const fluteCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.fluteCount, defaults.fluteCount)),
    0,
    1
  );
  const hangingDecorationCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.hangingDecorationCount, defaults.hangingDecorationCount)),
    0,
    2
  );
  const artDisplaySlotCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.artDisplaySlotCount, defaults.artDisplaySlotCount)),
    0,
    2
  );
  const performanceMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.performanceMarkerCount, defaults.performanceMarkerCount)),
    0,
    1
  );
  const noteMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.noteMarkerCount, defaults.noteMarkerCount)),
    0,
    5
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && decorDay) ||
        active ||
        shellChimeCount ||
        paintedStoneCount ||
        drumCount ||
        fluteCount ||
        hangingDecorationCount ||
        artDisplaySlotCount ||
        performanceMarkerCount ||
        noteMarkerCount
    );
  const stage = visible ? defaultStage : "hidden";
  const generatedFalse = (flag) => flag === false && !autoVisible;

  return {
    id: MUSIC_ART_DECOR_ID,
    family: MUSIC_ART_DECOR_FAMILY,
    visible,
    stage,
    variant: normalizeMusicArtDecorVariant(derivedFromDay ? null : source.variant, stage),
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "camp-performance-nook",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-1.42, 0.18, -0.92)),
    hangingAnchorPosition: normalizePositionValue(source.hangingAnchorPosition, vec3(-1.86, 0.18, -1.30)),
    performanceAnchorPosition: normalizePositionValue(source.performanceAnchorPosition, vec3(-1.12, 0.18, -0.54)),
    source: normalizeProceduralLocalExternal(source.source),
    shellChimeVisible: generatedFalse(source.shellChimeVisible) ? false : visible && shellChimeCount > 0,
    paintedStonesVisible: generatedFalse(source.paintedStonesVisible) ? false : visible && paintedStoneCount > 0,
    drumVisible: generatedFalse(source.drumVisible) ? false : visible && drumCount > 0,
    fluteVisible: generatedFalse(source.fluteVisible) ? false : visible && fluteCount > 0,
    hangingDecorationVisible:
      generatedFalse(source.hangingDecorationVisible) ? false : visible && hangingDecorationCount > 0,
    artDisplaySlotVisible: generatedFalse(source.artDisplaySlotVisible) ? false : visible && artDisplaySlotCount > 0,
    performanceMarkerVisible:
      generatedFalse(source.performanceMarkerVisible) ? false : visible && performanceMarkerCount > 0,
    noteMarkersVisible: generatedFalse(source.noteMarkersVisible) ? false : visible && noteMarkerCount > 0,
    shellChimeCount,
    paintedStoneCount,
    drumCount,
    fluteCount,
    hangingDecorationCount,
    artDisplaySlotCount,
    performanceMarkerCount,
    noteMarkerCount,
    statePlaceholders: ["hidden", "chime", "artDisplay", "instruments", "duskPerformance", "decoratedNook"],
    particlePerformanceNote:
      "no live particle emitter; deterministic static note/sparkle marker pool capped at five meshes",
    integrationNote:
      "visual-only music/art decor placeholders; no audio-reactive systems, rhythm gameplay, sound engine, scheduling, mood, or performance mechanics",
    debugLabel:
      `music art decor: stage=${stage} stones=${paintedStoneCount} notes=${noteMarkerCount} marker=${performanceMarkerCount}`
  };
}

function normalizeMusicArtDecorStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "hidden" ||
    stage === "chime" ||
    stage === "artDisplay" ||
    stage === "instruments" ||
    stage === "duskPerformance" ||
    stage === "decoratedNook"
  ) {
    return context.visibleHint ? stage : "hidden";
  }
  if (!context.visibleHint) return "hidden";
  if (context.active && !isMusicArtDecorDay(context.day)) return "decoratedNook";
  return defaultMusicArtDecorStage(context.day);
}

function normalizeMusicArtDecorVariant(value, stage) {
  const variant = typeof value === "string" ? value : "";
  if (
    variant === "decorCluster" ||
    variant === "instrumentDisplay" ||
    variant === "duskPerformance" ||
    variant === "artNook"
  ) {
    return variant;
  }
  if (stage === "instruments") return "instrumentDisplay";
  if (stage === "duskPerformance") return "duskPerformance";
  if (stage === "artDisplay" || stage === "decoratedNook") return "artNook";
  return "decorCluster";
}

function defaultMusicArtDecorStage(day) {
  if (day === 66) return "chime";
  if (day === 67) return "artDisplay";
  if (day === 68) return "instruments";
  if (day === 69) return "duskPerformance";
  if (day === 70) return "decoratedNook";
  return "hidden";
}

function musicArtDecorDefaultCounts(stage, enabled) {
  if (!enabled || stage === "hidden") {
    return {
      shellChimeCount: 0,
      paintedStoneCount: 0,
      drumCount: 0,
      fluteCount: 0,
      hangingDecorationCount: 0,
      artDisplaySlotCount: 0,
      performanceMarkerCount: 0,
      noteMarkerCount: 0
    };
  }
  if (stage === "chime") {
    return {
      shellChimeCount: 1,
      paintedStoneCount: 2,
      drumCount: 0,
      fluteCount: 0,
      hangingDecorationCount: 1,
      artDisplaySlotCount: 0,
      performanceMarkerCount: 0,
      noteMarkerCount: 0
    };
  }
  if (stage === "artDisplay") {
    return {
      shellChimeCount: 1,
      paintedStoneCount: 4,
      drumCount: 0,
      fluteCount: 1,
      hangingDecorationCount: 1,
      artDisplaySlotCount: 1,
      performanceMarkerCount: 0,
      noteMarkerCount: 0
    };
  }
  if (stage === "instruments") {
    return {
      shellChimeCount: 1,
      paintedStoneCount: 4,
      drumCount: 1,
      fluteCount: 1,
      hangingDecorationCount: 1,
      artDisplaySlotCount: 1,
      performanceMarkerCount: 0,
      noteMarkerCount: 2
    };
  }
  if (stage === "duskPerformance") {
    return {
      shellChimeCount: 1,
      paintedStoneCount: 5,
      drumCount: 1,
      fluteCount: 1,
      hangingDecorationCount: 2,
      artDisplaySlotCount: 1,
      performanceMarkerCount: 1,
      noteMarkerCount: 5
    };
  }
  return {
    shellChimeCount: 1,
    paintedStoneCount: 5,
    drumCount: 1,
    fluteCount: 1,
    hangingDecorationCount: 2,
    artDisplaySlotCount: 1,
    performanceMarkerCount: 1,
    noteMarkerCount: 3
  };
}

function isMusicArtDecorDay(day) {
  return day >= 66 && day <= 70;
}

function normalizeAnimalFamiliarVisitorState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const visitorDay = isAnimalFamiliarVisitorDay(day);
  const active = Boolean(source.active || isAnimalFamiliarVisitorActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const defaultStage = normalizeAnimalFamiliarVisitorStage(derivedFromDay ? null : source.stage, {
    day,
    active,
    visibleHint: visitorDay || active || source.visible === true
  });
  const defaults = animalFamiliarVisitorDefaultCounts(defaultStage, visitorDay || active || source.visible === true);
  const animalCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.animalCount, defaults.animalCount)),
    0,
    1
  );
  const birdVisitorCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.birdVisitorCount, defaults.birdVisitorCount)),
    0,
    2
  );
  const fishVisitorCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.fishVisitorCount, defaults.fishVisitorCount)),
    0,
    2
  );
  const foodCrumbCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.foodCrumbCount, defaults.foodCrumbCount)),
    0,
    5
  );
  const observeRingCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.observeRingCount, defaults.observeRingCount)),
    0,
    1
  );
  const approachMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.approachMarkerCount, defaults.approachMarkerCount)),
    0,
    4
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && visitorDay) ||
        active ||
        animalCount ||
        birdVisitorCount ||
        fishVisitorCount ||
        foodCrumbCount ||
        observeRingCount ||
        approachMarkerCount
    );
  const stage = visible ? defaultStage : "hidden";
  const generatedFalse = (flag) => flag === false && !autoVisible;

  return {
    id: ANIMAL_FAMILIAR_VISITOR_ID,
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    visible,
    stage,
    variant: normalizeAnimalFamiliarVisitorVariant(derivedFromDay ? null : source.variant, stage),
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "shore-visitor-safe-margin",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-10.95, 0.18, 30.86)),
    airAnchorPosition: normalizePositionValue(source.airAnchorPosition, vec3(-10.36, 0.58, 30.38)),
    waterAnchorPosition: normalizePositionValue(source.waterAnchorPosition, vec3(-13.18, -0.08, 32.12)),
    approachAnchorPosition: normalizePositionValue(source.approachAnchorPosition, vec3(-10.18, 0.18, 29.92)),
    source: normalizeProceduralLocalExternal(source.source),
    animalVisible: generatedFalse(source.animalVisible) ? false : visible && animalCount > 0,
    birdVisitorVisible: generatedFalse(source.birdVisitorVisible) ? false : visible && birdVisitorCount > 0,
    fishVisitorVisible: generatedFalse(source.fishVisitorVisible) ? false : visible && fishVisitorCount > 0,
    foodCrumbsVisible: generatedFalse(source.foodCrumbsVisible) ? false : visible && foodCrumbCount > 0,
    observeRingVisible: generatedFalse(source.observeRingVisible) ? false : visible && observeRingCount > 0,
    approachMarkersVisible: generatedFalse(source.approachMarkersVisible)
      ? false
      : visible && approachMarkerCount > 0,
    animalCount,
    birdVisitorCount,
    fishVisitorCount,
    foodCrumbCount,
    observeRingCount,
    approachMarkerCount,
    observeRadius: Math.max(0, Math.min(5, finiteNumber(source.observeRadius, 2.55))),
    approachDistance: Math.max(0, Math.min(5, finiteNumber(source.approachDistance, 1.65))),
    collisionEnabled: false,
    blocksMovement: false,
    affectsCameraFollow: false,
    statePlaceholders: ["hidden", "observe", "approach", "feedReady", "birdVisit", "fishVisit"],
    nonblockingNote:
      "visual-only animal visitor placeholders; nonblocking meshes, no colliders, no pathing claims, and no camera-follow changes",
    integrationNote:
      "no animal AI, feeding mechanics, familiarity scoring, flocking, chasing, collision behavior, or social interaction logic",
    debugLabel:
      `animal familiar visitor: stage=${stage} animal=${animalCount} bird=${birdVisitorCount} fish=${fishVisitorCount}`
  };
}

function normalizeAnimalFamiliarVisitorStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "hidden" ||
    stage === "observe" ||
    stage === "approach" ||
    stage === "feedReady" ||
    stage === "birdVisit" ||
    stage === "fishVisit"
  ) {
    return context.visibleHint ? stage : "hidden";
  }
  if (!context.visibleHint) return "hidden";
  if (context.active && !isAnimalFamiliarVisitorDay(context.day)) return "approach";
  return defaultAnimalFamiliarVisitorStage(context.day);
}

function normalizeAnimalFamiliarVisitorVariant(value, stage) {
  const variant = typeof value === "string" ? value : "";
  if (
    variant === "groundVisitor" ||
    variant === "birdVisitor" ||
    variant === "fishVisitor" ||
    variant === "feedStaging"
  ) {
    return variant;
  }
  if (stage === "birdVisit") return "birdVisitor";
  if (stage === "fishVisit") return "fishVisitor";
  if (stage === "feedReady") return "feedStaging";
  return "groundVisitor";
}

function defaultAnimalFamiliarVisitorStage(day) {
  if (day === 71) return "observe";
  if (day === 72) return "approach";
  if (day === 73) return "feedReady";
  if (day === 74) return "birdVisit";
  if (day === 75) return "fishVisit";
  return "hidden";
}

function animalFamiliarVisitorDefaultCounts(stage, enabled) {
  if (!enabled || stage === "hidden") {
    return {
      animalCount: 0,
      birdVisitorCount: 0,
      fishVisitorCount: 0,
      foodCrumbCount: 0,
      observeRingCount: 0,
      approachMarkerCount: 0
    };
  }
  if (stage === "observe") {
    return {
      animalCount: 1,
      birdVisitorCount: 0,
      fishVisitorCount: 0,
      foodCrumbCount: 0,
      observeRingCount: 1,
      approachMarkerCount: 2
    };
  }
  if (stage === "approach") {
    return {
      animalCount: 1,
      birdVisitorCount: 0,
      fishVisitorCount: 0,
      foodCrumbCount: 1,
      observeRingCount: 1,
      approachMarkerCount: 3
    };
  }
  if (stage === "feedReady") {
    return {
      animalCount: 1,
      birdVisitorCount: 0,
      fishVisitorCount: 0,
      foodCrumbCount: 4,
      observeRingCount: 1,
      approachMarkerCount: 4
    };
  }
  if (stage === "birdVisit") {
    return {
      animalCount: 1,
      birdVisitorCount: 2,
      fishVisitorCount: 0,
      foodCrumbCount: 3,
      observeRingCount: 1,
      approachMarkerCount: 3
    };
  }
  return {
    animalCount: 1,
    birdVisitorCount: 0,
    fishVisitorCount: 2,
    foodCrumbCount: 3,
    observeRingCount: 1,
    approachMarkerCount: 3
  };
}

function isAnimalFamiliarVisitorDay(day) {
  return day >= 71 && day <= 75;
}

function normalizeNightComfortLightsState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const lightDay = isNightComfortLightsDay(day);
  const active = Boolean(source.active || isNightComfortLightsActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const defaultStage = normalizeNightComfortLightsStage(derivedFromDay ? null : source.stage, {
    day,
    active,
    visibleHint: lightDay || active || source.visible === true
  });
  const defaults = nightComfortLightsDefaultCounts(defaultStage, lightDay || active || source.visible === true);
  const lanternPostCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.lanternPostCount, defaults.lanternPostCount)),
    0,
    4
  );
  const litPathAnchorCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.litPathAnchorCount, defaults.litPathAnchorCount)),
    0,
    6
  );
  const glowingShellCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.glowingShellCount, defaults.glowingShellCount)),
    0,
    8
  );
  const fireflyCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.fireflyCount, defaults.fireflyCount)),
    0,
    12
  );
  const sitAnchorCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.sitAnchorCount, defaults.sitAnchorCount)),
    0,
    2
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && lightDay) ||
        active ||
        lanternPostCount ||
        litPathAnchorCount ||
        glowingShellCount ||
        fireflyCount ||
        sitAnchorCount
    );
  const stage = visible ? defaultStage : "hidden";
  const generatedFalse = (flag) => flag === false && !autoVisible;

  return {
    id: NIGHT_COMFORT_LIGHTS_ID,
    family: NIGHT_COMFORT_LIGHTS_FAMILY,
    visible,
    stage,
    variant: normalizeNightComfortLightsVariant(derivedFromDay ? null : source.variant, stage),
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "camp-night-path",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-2.80, 0.18, -1.74)),
    pathAnchorPosition: normalizePositionValue(source.pathAnchorPosition, vec3(-3.56, 0.18, -1.98)),
    shellAnchorPosition: normalizePositionValue(source.shellAnchorPosition, vec3(-2.02, 0.18, -1.28)),
    fireflyAnchorPosition: normalizePositionValue(source.fireflyAnchorPosition, vec3(-2.38, 0.18, -2.44)),
    sitAnchorPosition: normalizePositionValue(source.sitAnchorPosition, vec3(-1.18, 0.18, -0.64)),
    source: normalizeProceduralLocalExternal(source.source),
    lanternPostsVisible: generatedFalse(source.lanternPostsVisible) ? false : visible && lanternPostCount > 0,
    litPathAnchorsVisible:
      generatedFalse(source.litPathAnchorsVisible) ? false : visible && litPathAnchorCount > 0,
    glowingShellsVisible: generatedFalse(source.glowingShellsVisible) ? false : visible && glowingShellCount > 0,
    firefliesVisible: generatedFalse(source.firefliesVisible) ? false : visible && fireflyCount > 0,
    sitAnchorVisible: generatedFalse(source.sitAnchorVisible) ? false : visible && sitAnchorCount > 0,
    lanternPostCount,
    litPathAnchorCount,
    glowingShellCount,
    fireflyCount,
    sitAnchorCount,
    dynamicLightCount: 0,
    usesDynamicLights: false,
    maxFireflySprites: 12,
    statePlaceholders: ["hidden", "inactive", "duskLit", "nightLit", "fireflyGlow", "sitAtNight"],
    lightPerformanceNote:
      "uses emissive materials and bounded deterministic sprite/mesh markers; no dynamic lights or unbounded emitters",
    integrationNote:
      "visual-only night comfort placeholders; no lantern fuel, lighting schedules, comfort mechanics, or firefly AI",
    debugLabel:
      `night comfort lights: stage=${stage} lanterns=${lanternPostCount} shells=${glowingShellCount} fireflies=${fireflyCount}`
  };
}

function normalizeNightComfortLightsStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "hidden" ||
    stage === "inactive" ||
    stage === "duskLit" ||
    stage === "nightLit" ||
    stage === "fireflyGlow" ||
    stage === "sitAtNight"
  ) {
    return context.visibleHint ? stage : "hidden";
  }
  if (!context.visibleHint) return "hidden";
  if (context.active && !isNightComfortLightsDay(context.day)) return "nightLit";
  return defaultNightComfortLightsStage(context.day);
}

function normalizeNightComfortLightsVariant(value, stage) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "inactive" || variant === "duskLit" || variant === "nightLit" || variant === "fireflyGlow" || variant === "sitAnchor") {
    return variant;
  }
  if (stage === "inactive") return "inactive";
  if (stage === "duskLit") return "duskLit";
  if (stage === "fireflyGlow") return "fireflyGlow";
  if (stage === "sitAtNight") return "sitAnchor";
  return "nightLit";
}

function defaultNightComfortLightsStage(day) {
  if (day === 81) return "inactive";
  if (day === 82) return "duskLit";
  if (day === 83) return "nightLit";
  if (day === 84) return "fireflyGlow";
  if (day === 85) return "sitAtNight";
  return "hidden";
}

function nightComfortLightsDefaultCounts(stage, enabled) {
  if (!enabled || stage === "hidden") {
    return {
      lanternPostCount: 0,
      litPathAnchorCount: 0,
      glowingShellCount: 0,
      fireflyCount: 0,
      sitAnchorCount: 0
    };
  }
  if (stage === "inactive") {
    return {
      lanternPostCount: 2,
      litPathAnchorCount: 2,
      glowingShellCount: 0,
      fireflyCount: 0,
      sitAnchorCount: 0
    };
  }
  if (stage === "duskLit") {
    return {
      lanternPostCount: 3,
      litPathAnchorCount: 4,
      glowingShellCount: 3,
      fireflyCount: 0,
      sitAnchorCount: 1
    };
  }
  if (stage === "nightLit") {
    return {
      lanternPostCount: 4,
      litPathAnchorCount: 5,
      glowingShellCount: 6,
      fireflyCount: 4,
      sitAnchorCount: 1
    };
  }
  if (stage === "fireflyGlow") {
    return {
      lanternPostCount: 4,
      litPathAnchorCount: 5,
      glowingShellCount: 8,
      fireflyCount: 12,
      sitAnchorCount: 1
    };
  }
  return {
    lanternPostCount: 4,
    litPathAnchorCount: 6,
    glowingShellCount: 8,
    fireflyCount: 8,
    sitAnchorCount: 2
  };
}

function isNightComfortLightsDay(day) {
  return day >= 81 && day <= 85;
}

function normalizeLookoutMapHorizonState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const lookoutDay = isLookoutMapHorizonDay(day);
  const active = Boolean(source.active || isLookoutMapHorizonActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const defaultStage = normalizeLookoutMapHorizonStage(derivedFromDay ? null : source.stage, {
    day,
    active,
    visibleHint: lookoutDay || active || source.visible === true
  });
  const defaults = lookoutMapHorizonDefaultCounts(defaultStage, lookoutDay || active || source.visible === true);
  const lookoutPlatformCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.lookoutPlatformCount, defaults.lookoutPlatformCount)),
    0,
    1
  );
  const stepCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.stepCount, defaults.stepCount)),
    0,
    5
  );
  const mapBoardCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.mapBoardCount, defaults.mapBoardCount)),
    0,
    1
  );
  const sketchMapCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.sketchMapCount, defaults.sketchMapCount)),
    0,
    3
  );
  const horizonMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.horizonMarkerCount, defaults.horizonMarkerCount)),
    0,
    4
  );
  const horizonHighlightCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.horizonHighlightCount, defaults.horizonHighlightCount)),
    0,
    1
  );
  const keepsakeCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.keepsakeCount, defaults.keepsakeCount)),
    0,
    4
  );
  const gatheringDetailCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.gatheringDetailCount, defaults.gatheringDetailCount)),
    0,
    6
  );
  const useSlotCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.useSlotCount, defaults.useSlotCount)),
    0,
    1
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && lookoutDay) ||
        active ||
        lookoutPlatformCount ||
        stepCount ||
        mapBoardCount ||
        sketchMapCount ||
        horizonMarkerCount ||
        horizonHighlightCount ||
        keepsakeCount ||
        gatheringDetailCount
    );
  const stage = visible ? defaultStage : "hidden";
  const generatedFalse = (flag) => flag === false && !autoVisible;

  return {
    id: LOOKOUT_MAP_HORIZON_ID,
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    visible,
    stage,
    variant: normalizeLookoutMapHorizonVariant(derivedFromDay ? null : source.variant, stage),
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "north-lookout-rise",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(5.80, 0.22, 6.40)),
    mapBoardPosition: normalizePositionValue(source.mapBoardPosition, vec3(5.22, 0.22, 5.50)),
    horizonMarkerPosition: normalizePositionValue(source.horizonMarkerPosition, vec3(7.40, 0.22, 8.20)),
    keepsakePosition: normalizePositionValue(source.keepsakePosition, vec3(6.28, 0.22, 5.62)),
    gatheringPosition: normalizePositionValue(source.gatheringPosition, vec3(5.82, 0.22, 6.98)),
    source: normalizeProceduralLocalExternal(source.source),
    lookoutPlatformVisible:
      generatedFalse(source.lookoutPlatformVisible) ? false : visible && lookoutPlatformCount > 0,
    stepsVisible: generatedFalse(source.stepsVisible) ? false : visible && stepCount > 0,
    mapBoardVisible: generatedFalse(source.mapBoardVisible) ? false : visible && mapBoardCount > 0,
    sketchMapVisible: generatedFalse(source.sketchMapVisible) ? false : visible && sketchMapCount > 0,
    horizonMarkerVisible:
      generatedFalse(source.horizonMarkerVisible) ? false : visible && horizonMarkerCount > 0,
    horizonHighlightVisible:
      generatedFalse(source.horizonHighlightVisible) ? false : visible && horizonHighlightCount > 0,
    keepsakeDisplayVisible:
      generatedFalse(source.keepsakeDisplayVisible) ? false : visible && keepsakeCount > 0,
    day100GatheringVisible:
      generatedFalse(source.day100GatheringVisible) ? false : visible && gatheringDetailCount > 0,
    useSlotVisible: generatedFalse(source.useSlotVisible) ? false : visible && useSlotCount > 0,
    lookoutPlatformCount,
    stepCount,
    mapBoardCount,
    sketchMapCount,
    horizonMarkerCount,
    horizonHighlightCount,
    keepsakeCount,
    gatheringDetailCount,
    useSlotCount,
    climbingEnabled: false,
    verticalMovementEnabled: false,
    mapDiscoveryEnabled: false,
    day100CompletionEnabled: false,
    statePlaceholders: ["hidden", "inactive", "lookoutActive", "mapBoard", "horizonHighlight", "day100Gathering"],
    movementDiscoveryNote:
      "visual-only lookout/map placeholders; steps and use-slot do not enable climbing, vertical movement, map discovery, or Day 100 completion",
    integrationNote:
      "no climbing, map discovery, Day 100 progression, ending logic, off-island world mechanics, camera, terrain, day-loop, milestone, or movement hooks",
    debugLabel:
      `lookout map horizon: stage=${stage} platform=${lookoutPlatformCount} map=${mapBoardCount} horizon=${horizonMarkerCount}`
  };
}

function normalizeLookoutMapHorizonStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "hidden" ||
    stage === "inactive" ||
    stage === "lookoutActive" ||
    stage === "mapBoard" ||
    stage === "horizonHighlight" ||
    stage === "day100Gathering"
  ) {
    return context.visibleHint ? stage : "hidden";
  }
  if (!context.visibleHint) return "hidden";
  if (context.active && !isLookoutMapHorizonDay(context.day)) return "lookoutActive";
  return defaultLookoutMapHorizonStage(context.day);
}

function normalizeLookoutMapHorizonVariant(value, stage) {
  const variant = typeof value === "string" ? value : "";
  if (
    variant === "inactive" ||
    variant === "lookoutActive" ||
    variant === "mapBoard" ||
    variant === "horizonHighlight" ||
    variant === "day100Gathering"
  ) {
    return variant;
  }
  if (stage === "inactive") return "inactive";
  if (stage === "mapBoard") return "mapBoard";
  if (stage === "horizonHighlight") return "horizonHighlight";
  if (stage === "day100Gathering") return "day100Gathering";
  return "lookoutActive";
}

function defaultLookoutMapHorizonStage(day) {
  if (day === 86) return "inactive";
  if (day >= 87 && day <= 90) return "lookoutActive";
  if (day >= 91 && day <= 94) return "mapBoard";
  if (day >= 95 && day <= 99) return "horizonHighlight";
  if (day === 100) return "day100Gathering";
  return "hidden";
}

function lookoutMapHorizonDefaultCounts(stage, enabled) {
  if (!enabled || stage === "hidden") {
    return {
      lookoutPlatformCount: 0,
      stepCount: 0,
      mapBoardCount: 0,
      sketchMapCount: 0,
      horizonMarkerCount: 0,
      horizonHighlightCount: 0,
      keepsakeCount: 0,
      gatheringDetailCount: 0,
      useSlotCount: 0
    };
  }
  if (stage === "inactive") {
    return {
      lookoutPlatformCount: 1,
      stepCount: 2,
      mapBoardCount: 0,
      sketchMapCount: 0,
      horizonMarkerCount: 0,
      horizonHighlightCount: 0,
      keepsakeCount: 0,
      gatheringDetailCount: 0,
      useSlotCount: 1
    };
  }
  if (stage === "lookoutActive") {
    return {
      lookoutPlatformCount: 1,
      stepCount: 3,
      mapBoardCount: 0,
      sketchMapCount: 0,
      horizonMarkerCount: 2,
      horizonHighlightCount: 0,
      keepsakeCount: 1,
      gatheringDetailCount: 0,
      useSlotCount: 1
    };
  }
  if (stage === "mapBoard") {
    return {
      lookoutPlatformCount: 1,
      stepCount: 3,
      mapBoardCount: 1,
      sketchMapCount: 2,
      horizonMarkerCount: 2,
      horizonHighlightCount: 0,
      keepsakeCount: 2,
      gatheringDetailCount: 0,
      useSlotCount: 1
    };
  }
  if (stage === "horizonHighlight") {
    return {
      lookoutPlatformCount: 1,
      stepCount: 4,
      mapBoardCount: 1,
      sketchMapCount: 2,
      horizonMarkerCount: 4,
      horizonHighlightCount: 1,
      keepsakeCount: 3,
      gatheringDetailCount: 0,
      useSlotCount: 1
    };
  }
  return {
    lookoutPlatformCount: 1,
    stepCount: 4,
    mapBoardCount: 1,
    sketchMapCount: 3,
    horizonMarkerCount: 4,
    horizonHighlightCount: 1,
    keepsakeCount: 4,
    gatheringDetailCount: 6,
    useSlotCount: 1
  };
}

function isLookoutMapHorizonDay(day) {
  return day >= 86 && day <= 100;
}

function normalizeMajorProjectCapstoneState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const capstoneDay = isMajorProjectCapstoneDay(day);
  const active = Boolean(source.active || isMajorProjectCapstoneActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const defaultStage = normalizeMajorProjectCapstoneStage(derivedFromDay ? null : source.stage, {
    day,
    active,
    visibleHint: capstoneDay || active || source.visible === true
  });
  const defaults = majorProjectCapstoneDefaultCounts(defaultStage, capstoneDay || active || source.visible === true);
  const supplyMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.supplyMarkerCount, defaults.supplyMarkerCount)),
    0,
    6
  );
  const tableLegCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.tableLegCount, defaults.tableLegCount)),
    0,
    4
  );
  const tabletopPieceCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.tabletopPieceCount, defaults.tabletopPieceCount)),
    0,
    3
  );
  const benchCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.benchCount, defaults.benchCount)),
    0,
    2
  );
  const placeSettingCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.placeSettingCount, defaults.placeSettingCount)),
    0,
    6
  );
  const celebrationDetailCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.celebrationDetailCount, defaults.celebrationDetailCount)),
    0,
    5
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && capstoneDay) ||
        active ||
        supplyMarkerCount ||
        tableLegCount ||
        tabletopPieceCount ||
        benchCount ||
        placeSettingCount ||
        celebrationDetailCount
    );
  const stage = visible ? defaultStage : "hidden";
  const generatedFalse = (flag) => flag === false && !autoVisible;

  return {
    id: MAJOR_PROJECT_CAPSTONE_ID,
    family: MAJOR_PROJECT_CAPSTONE_FAMILY,
    selectedOption: "communityTable",
    visible,
    stage,
    variant: normalizeMajorProjectCapstoneVariant(derivedFromDay ? null : source.variant, stage),
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "camp-community-table",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(1.82, 0.20, -2.20)),
    celebrationPosition: normalizePositionValue(source.celebrationPosition, vec3(1.82, 0.20, -1.52)),
    source: normalizeProceduralLocalExternal(source.source),
    stage0SuppliesVisible:
      generatedFalse(source.stage0SuppliesVisible) ? false : visible && supplyMarkerCount > 0,
    partialBuildVisible:
      generatedFalse(source.partialBuildVisible)
        ? false
        : visible && (tableLegCount > 0 || tabletopPieceCount > 0) && stage !== "stage3",
    mostlyBuiltVisible:
      generatedFalse(source.mostlyBuiltVisible)
        ? false
        : visible && (stage === "stage2" || stage === "stage3") && tabletopPieceCount > 0,
    completeBuildVisible:
      generatedFalse(source.completeBuildVisible) ? false : visible && stage === "stage3",
    celebrationDetailVisible:
      generatedFalse(source.celebrationDetailVisible) ? false : visible && celebrationDetailCount > 0,
    supplyMarkerCount,
    tableLegCount,
    tabletopPieceCount,
    benchCount,
    placeSettingCount,
    celebrationDetailCount,
    resourcePlanningEnabled: false,
    constructionMechanicsEnabled: false,
    milestoneLogicEnabled: false,
    travelDiscoveryEnabled: false,
    day100CompletionEnabled: false,
    statePlaceholders: ["hidden", "stage0", "stage1", "stage2", "stage3"],
    capstoneOptionNote:
      "chosen capstone option: community table; staged visual progression only",
    integrationNote:
      "visual-only capstone placeholders; no resource planning, construction mechanics, milestone logic, travel, discovery, or Day 100 completion",
    debugLabel:
      `major project capstone community table: stage=${stage} planks=${tabletopPieceCount} benches=${benchCount}`
  };
}

function normalizeMajorProjectCapstoneStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "hidden" || stage === "stage0" || stage === "stage1" || stage === "stage2" || stage === "stage3") {
    return context.visibleHint ? stage : "hidden";
  }
  if (!context.visibleHint) return "hidden";
  if (context.active && !isMajorProjectCapstoneDay(context.day)) return "stage1";
  return defaultMajorProjectCapstoneStage(context.day);
}

function normalizeMajorProjectCapstoneVariant(value, stage) {
  const variant = typeof value === "string" ? value : "";
  if (
    variant === "communityTableStage0" ||
    variant === "communityTableStage1" ||
    variant === "communityTableStage2" ||
    variant === "communityTableComplete"
  ) {
    return variant;
  }
  if (stage === "stage0") return "communityTableStage0";
  if (stage === "stage1") return "communityTableStage1";
  if (stage === "stage2") return "communityTableStage2";
  if (stage === "stage3") return "communityTableComplete";
  return "communityTableStage0";
}

function defaultMajorProjectCapstoneStage(day) {
  if (day === 91) return "stage0";
  if (day === 92) return "stage1";
  if (day === 93) return "stage2";
  if (day >= 94 && day <= 95) return "stage3";
  return "hidden";
}

function majorProjectCapstoneDefaultCounts(stage, enabled) {
  if (!enabled || stage === "hidden") {
    return {
      supplyMarkerCount: 0,
      tableLegCount: 0,
      tabletopPieceCount: 0,
      benchCount: 0,
      placeSettingCount: 0,
      celebrationDetailCount: 0
    };
  }
  if (stage === "stage0") {
    return {
      supplyMarkerCount: 5,
      tableLegCount: 0,
      tabletopPieceCount: 0,
      benchCount: 0,
      placeSettingCount: 0,
      celebrationDetailCount: 0
    };
  }
  if (stage === "stage1") {
    return {
      supplyMarkerCount: 3,
      tableLegCount: 2,
      tabletopPieceCount: 1,
      benchCount: 0,
      placeSettingCount: 0,
      celebrationDetailCount: 0
    };
  }
  if (stage === "stage2") {
    return {
      supplyMarkerCount: 1,
      tableLegCount: 4,
      tabletopPieceCount: 2,
      benchCount: 1,
      placeSettingCount: 2,
      celebrationDetailCount: 0
    };
  }
  return {
    supplyMarkerCount: 0,
    tableLegCount: 4,
    tabletopPieceCount: 3,
    benchCount: 2,
    placeSettingCount: 6,
    celebrationDetailCount: 5
  };
}

function isMajorProjectCapstoneDay(day) {
  return day >= 91 && day <= 95;
}

function normalizeAmbientBeachFindsState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const ambientDay = isAmbientBeachFindsDay(day);
  const returnVisitorDay = day >= 71 && day <= 75;
  const active = Boolean(source.active || isAmbientBeachFindsActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const shellCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.shellCount, returnVisitorDay ? 12 : ambientDay ? 10 : 0)),
    0,
    24
  );
  const driftwoodCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.driftwoodCount, returnVisitorDay ? 5 : ambientDay ? 4 : 0)),
    0,
    10
  );
  const tinyFindCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.tinyFindCount, returnVisitorDay ? 7 : ambientDay ? 5 : 0)),
    0,
    18
  );
  const foodCrumbCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.foodCrumbCount, returnVisitorDay ? 2 : ambientDay ? 1 : 0)),
    0,
    6
  );
  const birdMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.birdMarkerCount, returnVisitorDay ? 3 : ambientDay ? 2 : 0)),
    0,
    6
  );
  const fishMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.fishMarkerCount, returnVisitorDay ? 4 : ambientDay ? 3 : 0)),
    0,
    8
  );
  const generatedFalse = (flag) => flag === false && !autoVisible;
  const visitorDefaultVisible = ambientDay || active;
  const animalVisitorVisible = generatedFalse(source.animalVisitorVisible)
    ? false
    : Boolean(source.animalVisitorVisible === true || visitorDefaultVisible);
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && ambientDay) ||
        active ||
        shellCount ||
        driftwoodCount ||
        tinyFindCount ||
        foodCrumbCount ||
        birdMarkerCount ||
        fishMarkerCount ||
        animalVisitorVisible
    );
  const stage = normalizeAmbientBeachFindsStage(derivedFromDay ? null : source.stage, {
    visible,
    active,
    day,
    animalVisitorVisible
  });
  const variant = normalizeAmbientBeachFindsVariant(derivedFromDay ? null : source.variant, day);

  return {
    id: AMBIENT_BEACH_FINDS_ID,
    family: AMBIENT_BEACH_FINDS_FAMILY,
    visible,
    stage,
    variant,
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "shoreline",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-12.4, 0.18, 31.5)),
    source: normalizeProceduralLocalExternal(source.source),
    shellsVisible: generatedFalse(source.shellsVisible) ? false : visible && shellCount > 0,
    driftwoodVisible: generatedFalse(source.driftwoodVisible) ? false : visible && driftwoodCount > 0,
    tinyFindsVisible: generatedFalse(source.tinyFindsVisible) ? false : visible && tinyFindCount > 0,
    foodCrumbsVisible: generatedFalse(source.foodCrumbsVisible) ? false : visible && foodCrumbCount > 0,
    animalVisitorVisible: visible && animalVisitorVisible,
    birdMarkersVisible: generatedFalse(source.birdMarkersVisible) ? false : visible && birdMarkerCount > 0,
    fishMarkersVisible: generatedFalse(source.fishMarkersVisible) ? false : visible && fishMarkerCount > 0,
    shellCount,
    driftwoodCount,
    tinyFindCount,
    foodCrumbCount,
    birdMarkerCount,
    fishMarkerCount,
    debugLabel: `ambient beach finds: stage=${stage} shells=${shellCount} driftwood=${driftwoodCount} visitor=${animalVisitorVisible ? "on" : "off"}`
  };
}

function normalizeAmbientBeachFindsStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "none") return context.visible ? defaultAmbientBeachFindsStage(context.day) : "none";
  if (stage === "finds" || stage === "visitor" || stage === "active") return stage;
  if (!context.visible) return "none";
  if (context.active && !isAmbientBeachFindsDay(context.day)) return "active";
  return defaultAmbientBeachFindsStage(context.day);
}

function defaultAmbientBeachFindsStage(day) {
  if (day >= 71 && day <= 75) return "visitor";
  if (day >= 36 && day <= 40) return "finds";
  return "none";
}

function normalizeAmbientBeachFindsVariant(value, day) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "shorelineFinds" || variant === "visitorReturn" || variant === "crumbTrail") return variant;
  if (day >= 71 && day <= 75) return "visitorReturn";
  return "shorelineFinds";
}

function isAmbientBeachFindsDay(day) {
  return (day >= 36 && day <= 40) || (day >= 71 && day <= 75);
}

function normalizePierShoreWorkSiteState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const pierDay = isPierShoreWorkSiteDay(day);
  const active = Boolean(source.active || isPierShoreWorkSiteActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const latePierDay = day >= 44 && day <= 45;
  const pierPostCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.pierPostCount, latePierDay ? 8 : pierDay ? 6 : 0)),
    0,
    10
  );
  const plankCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.plankCount, latePierDay ? 7 : pierDay ? 5 : 0)),
    0,
    10
  );
  const lashingCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.lashingCount, latePierDay ? 10 : pierDay ? 8 : 0)),
    0,
    16
  );
  const workMarkerCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.workMarkerCount, pierDay ? 1 : 0)), 0, 2);
  const safeBuildSiteCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.safeBuildSiteCount, pierDay ? 1 : 0)),
    0,
    2
  );
  const fishingSlotCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.fishingSlotCount, pierDay ? 1 : 0)),
    0,
    2
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && pierDay) ||
        active ||
        pierPostCount ||
        plankCount ||
        lashingCount ||
        workMarkerCount ||
        safeBuildSiteCount ||
        fishingSlotCount
    );
  const generatedFalse = (flag) => flag === false && !autoVisible;
  const stage = normalizePierShoreWorkSiteStage(derivedFromDay ? null : source.stage, {
    visible,
    active,
    day
  });
  const variant = normalizePierShoreWorkSiteVariant(derivedFromDay ? null : source.variant, day);

  return {
    id: PIER_SHORE_WORK_SITE_ID,
    family: PIER_SHORE_WORK_SITE_FAMILY,
    visible,
    stage,
    variant,
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "shoreline",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-11.9, 0.18, 31.1)),
    safeBuildAnchorPosition: normalizePositionValue(source.safeBuildAnchorPosition, vec3(-10.6, 0.18, 29.5)),
    fishingSlotPosition: normalizePositionValue(source.fishingSlotPosition, vec3(-13.4, 0.18, 31.9)),
    source: normalizeProceduralLocalExternal(source.source),
    pierPostsVisible: generatedFalse(source.pierPostsVisible) ? false : visible && pierPostCount > 0,
    planksVisible: generatedFalse(source.planksVisible) ? false : visible && plankCount > 0,
    lashingsVisible: generatedFalse(source.lashingsVisible) ? false : visible && lashingCount > 0,
    shoreWorkMarkerVisible: generatedFalse(source.shoreWorkMarkerVisible) ? false : visible && workMarkerCount > 0,
    safeBuildSiteVisible: generatedFalse(source.safeBuildSiteVisible) ? false : visible && safeBuildSiteCount > 0,
    fishingSlotVisible: generatedFalse(source.fishingSlotVisible) ? false : visible && fishingSlotCount > 0,
    pierPostCount,
    plankCount,
    lashingCount,
    workMarkerCount,
    safeBuildSiteCount,
    fishingSlotCount,
    safetyNote: "visual-only shoreline work site; BB and build marker remain on land",
    debugLabel: `pier shore work site: stage=${stage} posts=${pierPostCount} planks=${plankCount} safeBuild=${safeBuildSiteCount}`
  };
}

function normalizePierShoreWorkSiteStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "none") return context.visible ? defaultPierShoreWorkSiteStage(context.day) : "none";
  if (stage === "survey" || stage === "posts" || stage === "planking" || stage === "active") return stage;
  if (!context.visible) return "none";
  if (context.active && !isPierShoreWorkSiteDay(context.day)) return "active";
  return defaultPierShoreWorkSiteStage(context.day);
}

function defaultPierShoreWorkSiteStage(day) {
  if (day >= 44 && day <= 45) return "planking";
  if (day >= 41 && day <= 43) return "posts";
  return "none";
}

function normalizePierShoreWorkSiteVariant(value, day) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "partialPier" || variant === "shoreSurvey" || variant === "fishingSlot") return variant;
  if (day >= 41 && day <= 45) return "partialPier";
  return "shoreSurvey";
}

function isPierShoreWorkSiteDay(day) {
  return day >= 41 && day <= 45;
}

function normalizeRaftBoatRouteState(value, state) {
  const source = value && typeof value === "object" ? value : {};
  const day = state && state.time ? Math.max(1, Math.floor(finiteNumber(state.time.day, 1))) : 1;
  const raftDay = isRaftBoatRouteDay(day);
  const capstoneDay = isRaftBoatRouteCapstoneDay(day);
  const active = Boolean(source.active || isRaftBoatRouteActionActive(state));
  const autoVisible = source.autoVisible === false ? false : true;
  const derivedFromDay = autoVisible && source.visible !== true;
  const defaultWaterState = defaultRaftBoatRouteWaterState(day);
  const defaultRoute = defaultWaterState === "route" || defaultWaterState === "return";
  const logCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.logCount, raftDay ? (capstoneDay ? 6 : 5) : 0)),
    0,
    8
  );
  const platformPlankCount = clamp(
    Math.floor(
      finiteNumber(
        derivedFromDay ? null : source.platformPlankCount,
        raftDay ? (day >= 49 || capstoneDay ? 6 : 3) : 0
      )
    ),
    0,
    8
  );
  const lashingCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.lashingCount, raftDay ? (day >= 49 ? 8 : 6) : 0)),
    0,
    12
  );
  const paddleCount = clamp(Math.floor(finiteNumber(derivedFromDay ? null : source.paddleCount, raftDay ? 1 : 0)), 0, 2);
  const wakeMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.wakeMarkerCount, defaultRoute || defaultWaterState === "water" ? 3 : 0)),
    0,
    5
  );
  const routeMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.routeMarkerCount, defaultRoute ? 4 : 0)),
    0,
    6
  );
  const landingMarkerCount = clamp(
    Math.floor(finiteNumber(derivedFromDay ? null : source.landingMarkerCount, raftDay ? 1 : 0)),
    0,
    2
  );
  const visible = source.visible === false && !autoVisible
    ? false
    : Boolean(
      source.visible === true ||
        (autoVisible && raftDay) ||
        active ||
        logCount ||
        platformPlankCount ||
        lashingCount ||
        paddleCount ||
        wakeMarkerCount ||
        routeMarkerCount ||
        landingMarkerCount
    );
  const generatedFalse = (flag) => flag === false && !autoVisible;
  const buildStage = normalizeRaftBoatRouteBuildStage(derivedFromDay ? null : source.buildStage || source.stage, {
    visible,
    active,
    day
  });
  const stage = buildStage;
  const waterState = normalizeRaftBoatRouteWaterState(derivedFromDay ? null : source.waterState, day);
  const routeMarker = source.routeMarker === false && !autoVisible ? false : Boolean(visible && (source.routeMarker === true || defaultRoute || routeMarkerCount > 0));
  const variant = normalizeRaftBoatRouteVariant(derivedFromDay ? null : source.variant, waterState, day);

  return {
    id: RAFT_BOAT_ROUTE_ID,
    family: RAFT_BOAT_ROUTE_FAMILY,
    visible,
    stage,
    buildStage,
    waterState,
    routeMarker,
    landingAnchor: normalizePositionValue(source.landingAnchor || source.landingAnchorPosition, vec3(-10.9, 0.18, 29.7)),
    variant,
    active,
    autoVisible,
    usable: false,
    carried: false,
    owner: null,
    anchor: "shoreline",
    anchorPosition: normalizePositionValue(source.anchorPosition, vec3(-12.7, 0.18, 31.7)),
    waterAnchorPosition: normalizePositionValue(source.waterAnchorPosition, vec3(-15.1, -0.12, 33.6)),
    routeMarkerAnchorPosition: normalizePositionValue(source.routeMarkerAnchorPosition, vec3(-16.2, -0.12, 34.8)),
    landingAnchorPosition: normalizePositionValue(source.landingAnchorPosition || source.landingAnchor, vec3(-10.9, 0.18, 29.7)),
    source: normalizeProceduralLocalExternal(source.source),
    raftFrameVisible: generatedFalse(source.raftFrameVisible) ? false : visible && logCount > 0,
    tiedPlatformVisible: generatedFalse(source.tiedPlatformVisible) ? false : visible && platformPlankCount > 0,
    paddleVisible: generatedFalse(source.paddleVisible) ? false : visible && paddleCount > 0,
    raftOnWaterVisible: generatedFalse(source.raftOnWaterVisible)
      ? false
      : visible && (waterState === "water" || waterState === "route" || waterState === "return"),
    wakeMarkerVisible: generatedFalse(source.wakeMarkerVisible) ? false : visible && wakeMarkerCount > 0,
    routeMarkerVisible: generatedFalse(source.routeMarkerVisible) ? false : visible && routeMarker && routeMarkerCount > 0,
    returnLandingVisible: generatedFalse(source.returnLandingVisible) ? false : visible && landingMarkerCount > 0,
    logCount,
    platformPlankCount,
    lashingCount,
    paddleCount,
    wakeMarkerCount,
    routeMarkerCount,
    landingMarkerCount,
    integrationNote: "visual-only raft route placeholders; future buildable/vehicle hooks are metadata only",
    debugLabel:
      `raft boat route: buildStage=${buildStage} waterState=${waterState} logs=${logCount} route=${routeMarkerCount}`
  };
}

function normalizeRaftBoatRouteBuildStage(value, context) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "none") return context.visible ? defaultRaftBoatRouteBuildStage(context.day) : "none";
  if (
    stage === "frame" ||
    stage === "platform" ||
    stage === "waterReady" ||
    stage === "route" ||
    stage === "capstone" ||
    stage === "active"
  ) {
    return stage;
  }
  if (!context.visible) return "none";
  if (context.active && !isRaftBoatRouteDay(context.day)) return "active";
  return defaultRaftBoatRouteBuildStage(context.day);
}

function defaultRaftBoatRouteBuildStage(day) {
  if (day >= 91 && day <= 95) return "capstone";
  if (day >= 53 && day <= 55) return "route";
  if (day >= 50 && day <= 52) return "waterReady";
  if (day >= 49 && day <= 49) return "platform";
  if (day >= 46 && day <= 48) return "frame";
  return "none";
}

function normalizeRaftBoatRouteWaterState(value, day) {
  const waterState = typeof value === "string" ? value : "";
  if (waterState === "shore" || waterState === "water" || waterState === "route" || waterState === "return") {
    return waterState;
  }
  return defaultRaftBoatRouteWaterState(day);
}

function defaultRaftBoatRouteWaterState(day) {
  if (day >= 91 && day <= 95) return "return";
  if (day >= 53 && day <= 55) return "route";
  if (day >= 50 && day <= 52) return "water";
  return "shore";
}

function normalizeRaftBoatRouteVariant(value, waterState, day) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "shoreBuild" || variant === "waterFloat" || variant === "routePreview" || variant === "returnLanding") {
    return variant;
  }
  if (waterState === "return" || (day >= 91 && day <= 95)) return "returnLanding";
  if (waterState === "route") return "routePreview";
  if (waterState === "water") return "waterFloat";
  return "shoreBuild";
}

function isRaftBoatRouteDay(day) {
  return (day >= 46 && day <= 55) || isRaftBoatRouteCapstoneDay(day);
}

function isRaftBoatRouteCapstoneDay(day) {
  return day >= 91 && day <= 95;
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

function isFoodRoutineActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "cookingfish" ||
    action === "eatingfish" ||
    action === "harvesting" ||
    action === "inspectingGarden" ||
    goal === "foodRoutine" ||
    goal === "cooking" ||
    goal === "harvesting"
  );
}

function isFishTrapRoutineActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "setFishTrap" ||
    action === "checkFishTrap" ||
    action === "collectFishTrap" ||
    action === "dryTrapCatch" ||
    action === "inspectFishTrap" ||
    goal === "fishTrapRoutine" ||
    goal === "trapRoutine" ||
    goal === "shoreTrap"
  );
}

function isToyPlaySetActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "playToy" ||
    action === "inspectToySet" ||
    action === "arrangeToySet" ||
    action === "inspectKite" ||
    goal === "toyPlaySet" ||
    goal === "toyPlay" ||
    goal === "playToy"
  );
}

function isMusicArtDecorActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectMusicArt" ||
    action === "arrangeDecor" ||
    action === "inspectShellChime" ||
    action === "duskPerformance" ||
    goal === "musicArtDecor" ||
    goal === "decorNook" ||
    goal === "duskPerformance"
  );
}

function isAnimalFamiliarVisitorActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "observeAnimalVisitor" ||
    action === "feedAnimalVisitor" ||
    action === "inspectAnimalVisitor" ||
    action === "watchBirdVisitor" ||
    action === "watchFishVisitor" ||
    goal === "animalFamiliarVisitor" ||
    goal === "animalVisitor" ||
    goal === "visitorObserve"
  );
}

function isNightComfortLightsActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectNightLights" ||
    action === "sitAtNightLight" ||
    action === "inspectGlowingShells" ||
    action === "watchFireflies" ||
    goal === "nightComfortLights" ||
    goal === "nightPath" ||
    goal === "sitAtNight"
  );
}

function isLookoutMapHorizonActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectLookout" ||
    action === "inspectMapBoard" ||
    action === "watchHorizon" ||
    action === "reviewKeepsakes" ||
    action === "gatherAtLookout" ||
    goal === "lookoutMapHorizon" ||
    goal === "lookout" ||
    goal === "mapBoard" ||
    goal === "horizon"
  );
}

function isMajorProjectCapstoneActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectCapstoneProject" ||
    action === "inspectCommunityTable" ||
    action === "reviewCapstoneStage" ||
    goal === "majorProjectCapstone" ||
    goal === "communityTable" ||
    goal === "capstoneProject"
  );
}

function isAmbientBeachFindsActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectBeachFinds" ||
    goal === "ambientBeachFinds" ||
    goal === "beachFinds"
  );
}

function isPierShoreWorkSiteActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectPierSite" ||
    goal === "pierShoreWorkSite" ||
    goal === "shoreWork"
  );
}

function isRaftBoatRouteActionActive(state) {
  const boy = state && state.bubbleBoy ? state.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectRaftRoute" ||
    goal === "raftBoatRoute" ||
    goal === "raft" ||
    goal === "boatRoute"
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

function createDefaultFoodRoutineState() {
  return {
    id: FOOD_ROUTINE_ID,
    family: FOOD_ROUTINE_FAMILY,
    anchor: "cook-zone",
    autoVisible: true,
    source: "procedural",
    debugLabel: "food routine hidden until Days 31-35 or 56-60"
  };
}

function createDefaultFishTrapRoutineState() {
  return {
    id: FISH_TRAP_ROUTINE_ID,
    family: FISH_TRAP_ROUTINE_FAMILY,
    anchor: "shoreline-trap",
    anchorPosition: vec3(-13.7, 0.18, 32.6),
    buoyPosition: vec3(-15.05, -0.12, 33.8),
    dryingRackPosition: vec3(-11.52, 0.18, 30.28),
    trapState: "unset",
    stage: "unset",
    variant: "unsetMarker",
    autoVisible: true,
    source: "procedural",
    statePlaceholders: ["unset", "set", "readyToCheck", "collected", "drying"],
    integrationNote: "visual-only fish trap routine placeholders; no catch timers, randomness, storage, or food economy",
    debugLabel: "fish trap routine hidden until Days 56-60"
  };
}

function createDefaultToyPlaySetState() {
  return {
    id: TOY_PLAY_SET_ID,
    family: TOY_PLAY_SET_FAMILY,
    anchor: "toy-buildable-sidecar",
    anchorPosition: vec3(-4.18, 0.18, -2.22),
    kiteAnchorPosition: vec3(-4.72, 0.18, -2.86),
    stage: "hidden",
    variant: "activeMain",
    autoVisible: true,
    source: "procedural",
    statePlaceholders: ["hidden", "collection", "active", "matLayout", "kiteDay"],
    duplicateSystemClassification:
      "extension beside existing toy-block buildable; no competing toy crafting/use system",
    integrationNote:
      "visual-only toy play set placeholders; no play cooldowns, mood effects, toy crafting, kite physics, ball physics, or interactions",
    debugLabel: "toy play set hidden until Days 61-65"
  };
}

function createDefaultMusicArtDecorState() {
  return {
    id: MUSIC_ART_DECOR_ID,
    family: MUSIC_ART_DECOR_FAMILY,
    anchor: "camp-performance-nook",
    anchorPosition: vec3(-1.42, 0.18, -0.92),
    hangingAnchorPosition: vec3(-1.86, 0.18, -1.30),
    performanceAnchorPosition: vec3(-1.12, 0.18, -0.54),
    stage: "hidden",
    variant: "decorCluster",
    autoVisible: true,
    source: "procedural",
    statePlaceholders: ["hidden", "chime", "artDisplay", "instruments", "duskPerformance", "decoratedNook"],
    particlePerformanceNote:
      "no live particle emitter; deterministic static note/sparkle marker pool capped at five meshes",
    integrationNote:
      "visual-only music/art decor placeholders; no audio-reactive systems, rhythm gameplay, sound engine, scheduling, mood, or performance mechanics",
    debugLabel: "music art decor hidden until Days 66-70"
  };
}

function createDefaultAnimalFamiliarVisitorState() {
  return {
    id: ANIMAL_FAMILIAR_VISITOR_ID,
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    anchor: "shore-visitor-safe-margin",
    anchorPosition: vec3(-10.95, 0.18, 30.86),
    airAnchorPosition: vec3(-10.36, 0.58, 30.38),
    waterAnchorPosition: vec3(-13.18, -0.08, 32.12),
    approachAnchorPosition: vec3(-10.18, 0.18, 29.92),
    stage: "hidden",
    variant: "groundVisitor",
    autoVisible: true,
    source: "procedural",
    collisionEnabled: false,
    blocksMovement: false,
    affectsCameraFollow: false,
    statePlaceholders: ["hidden", "observe", "approach", "feedReady", "birdVisit", "fishVisit"],
    nonblockingNote:
      "visual-only animal visitor placeholders; nonblocking meshes, no colliders, no pathing claims, and no camera-follow changes",
    integrationNote:
      "no animal AI, feeding mechanics, familiarity scoring, flocking, chasing, collision behavior, or social interaction logic",
    debugLabel: "animal familiar visitor hidden until Days 71-75"
  };
}

function createDefaultNightComfortLightsState() {
  return {
    id: NIGHT_COMFORT_LIGHTS_ID,
    family: NIGHT_COMFORT_LIGHTS_FAMILY,
    anchor: "camp-night-path",
    anchorPosition: vec3(-2.80, 0.18, -1.74),
    pathAnchorPosition: vec3(-3.56, 0.18, -1.98),
    shellAnchorPosition: vec3(-2.02, 0.18, -1.28),
    fireflyAnchorPosition: vec3(-2.38, 0.18, -2.44),
    sitAnchorPosition: vec3(-1.18, 0.18, -0.64),
    stage: "hidden",
    variant: "nightLit",
    autoVisible: true,
    source: "procedural",
    dynamicLightCount: 0,
    usesDynamicLights: false,
    maxFireflySprites: 12,
    statePlaceholders: ["hidden", "inactive", "duskLit", "nightLit", "fireflyGlow", "sitAtNight"],
    lightPerformanceNote:
      "uses emissive materials and bounded deterministic sprite/mesh markers; no dynamic lights or unbounded emitters",
    integrationNote:
      "visual-only night comfort placeholders; no lantern fuel, lighting schedules, comfort mechanics, or firefly AI",
    debugLabel: "night comfort lights hidden until Days 81-85"
  };
}

function createDefaultLookoutMapHorizonState() {
  return {
    id: LOOKOUT_MAP_HORIZON_ID,
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    anchor: "north-lookout-rise",
    anchorPosition: vec3(5.80, 0.22, 6.40),
    mapBoardPosition: vec3(5.22, 0.22, 5.50),
    horizonMarkerPosition: vec3(7.40, 0.22, 8.20),
    keepsakePosition: vec3(6.28, 0.22, 5.62),
    gatheringPosition: vec3(5.82, 0.22, 6.98),
    stage: "hidden",
    variant: "lookoutActive",
    autoVisible: true,
    source: "procedural",
    climbingEnabled: false,
    verticalMovementEnabled: false,
    mapDiscoveryEnabled: false,
    day100CompletionEnabled: false,
    statePlaceholders: ["hidden", "inactive", "lookoutActive", "mapBoard", "horizonHighlight", "day100Gathering"],
    movementDiscoveryNote:
      "visual-only lookout/map placeholders; steps and use-slot do not enable climbing, vertical movement, map discovery, or Day 100 completion",
    integrationNote:
      "no climbing, map discovery, Day 100 progression, ending logic, off-island world mechanics, camera, terrain, day-loop, milestone, or movement hooks",
    debugLabel: "lookout map horizon hidden until Days 86-100"
  };
}

function createDefaultMajorProjectCapstoneState() {
  return {
    id: MAJOR_PROJECT_CAPSTONE_ID,
    family: MAJOR_PROJECT_CAPSTONE_FAMILY,
    selectedOption: "communityTable",
    anchor: "camp-community-table",
    anchorPosition: vec3(1.82, 0.20, -2.20),
    celebrationPosition: vec3(1.82, 0.20, -1.52),
    stage: "hidden",
    variant: "communityTableStage0",
    autoVisible: true,
    source: "procedural",
    resourcePlanningEnabled: false,
    constructionMechanicsEnabled: false,
    milestoneLogicEnabled: false,
    travelDiscoveryEnabled: false,
    day100CompletionEnabled: false,
    statePlaceholders: ["hidden", "stage0", "stage1", "stage2", "stage3"],
    capstoneOptionNote:
      "chosen capstone option: community table; staged visual progression only",
    integrationNote:
      "visual-only capstone placeholders; no resource planning, construction mechanics, milestone logic, travel, discovery, or Day 100 completion",
    debugLabel: "major project capstone community table hidden until Days 91-95"
  };
}

function createDefaultAmbientBeachFindsState() {
  return {
    id: AMBIENT_BEACH_FINDS_ID,
    family: AMBIENT_BEACH_FINDS_FAMILY,
    anchor: "shoreline",
    anchorPosition: vec3(-12.4, 0.18, 31.5),
    autoVisible: true,
    source: "procedural",
    debugLabel: "ambient beach finds hidden until Days 36-40 or 71-75"
  };
}

function createDefaultPierShoreWorkSiteState() {
  return {
    id: PIER_SHORE_WORK_SITE_ID,
    family: PIER_SHORE_WORK_SITE_FAMILY,
    anchor: "shoreline",
    anchorPosition: vec3(-11.9, 0.18, 31.1),
    safeBuildAnchorPosition: vec3(-10.6, 0.18, 29.5),
    fishingSlotPosition: vec3(-13.4, 0.18, 31.9),
    autoVisible: true,
    source: "procedural",
    safetyNote: "visual-only shoreline work site; BB and build marker remain on land",
    debugLabel: "pier shore work site hidden until Days 41-45"
  };
}

function createDefaultRaftBoatRouteState() {
  return {
    id: RAFT_BOAT_ROUTE_ID,
    family: RAFT_BOAT_ROUTE_FAMILY,
    anchor: "shoreline",
    anchorPosition: vec3(-12.7, 0.18, 31.7),
    waterAnchorPosition: vec3(-15.1, -0.12, 33.6),
    routeMarkerAnchorPosition: vec3(-16.2, -0.12, 34.8),
    landingAnchorPosition: vec3(-10.9, 0.18, 29.7),
    landingAnchor: vec3(-10.9, 0.18, 29.7),
    buildStage: "none",
    waterState: "shore",
    routeMarker: false,
    autoVisible: true,
    source: "procedural",
    integrationNote: "visual-only raft route placeholders; future buildable/vehicle hooks are metadata only",
    debugLabel: "raft boat route hidden until Days 46-55 or 91-95"
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
