import {
  AMBIENT_BEACH_FINDS_ID,
  BOUNDARY_STONE_ITEM_ID,
  FIRE_PIT_ID,
  FOOD_ROUTINE_ID,
  PIER_SHORE_WORK_SITE_ID,
  STONE_TOOL_ITEM_ID,
  WATER_CAN_ITEM_ID,
  WORKBENCH_ID,
  normalizeWorldState
} from "/static/toybox/simulation/worldState.js";

export const TOYBOX_REVIEW_DEFAULT_FAMILY = "earlyIslandAssets";
export const TOYBOX_REVIEW_DEFAULT_STATE = "default";

const TOYBOX_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-3.0, 0.88, -1.35], theta: 0.68, phi: 1.08, distance: 10.8 }),
  hidden: Object.freeze({ target: [-3.0, 0.88, -1.35], theta: 0.68, phi: 1.08, distance: 10.8 }),
  active: Object.freeze({ target: [-3.0, 0.86, -1.35], theta: 0.70, phi: 1.08, distance: 9.6 }),
  variant: Object.freeze({ target: [-1.80, 0.88, -0.52], theta: 0.92, phi: 1.04, distance: 8.4 }),
  closeup: Object.freeze({ target: [-5.30, 0.92, -1.58], theta: 0.52, phi: 1.08, distance: 5.8 }),
  debug: Object.freeze({ target: [-3.0, 0.86, -1.35], theta: 0.70, phi: 1.08, distance: 9.6 }),
  watering: Object.freeze({ target: [-4.18, 0.82, -3.44], theta: 0.48, phi: 1.06, distance: 6.3 })
});

const FOOD_ROUTINE_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [0.08, 0.82, 0.72], theta: 0.72, phi: 1.05, distance: 6.2 }),
  hidden: Object.freeze({ target: [0.08, 0.82, 0.72], theta: 0.72, phi: 1.05, distance: 6.8 }),
  active: Object.freeze({ target: [0.08, 0.82, 0.72], theta: 0.70, phi: 1.04, distance: 5.6 }),
  variant: Object.freeze({ target: [0.36, 0.80, 1.00], theta: 0.96, phi: 1.02, distance: 5.4 }),
  closeup: Object.freeze({ target: [0.30, 0.78, 1.08], theta: 0.56, phi: 1.03, distance: 3.8 }),
  debug: Object.freeze({ target: [0.08, 0.82, 0.72], theta: 0.70, phi: 1.04, distance: 5.6 }),
  watering: Object.freeze({ target: [0.36, 0.80, 1.00], theta: 0.96, phi: 1.02, distance: 5.4 })
});

const AMBIENT_BEACH_FINDS_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-12.4, 0.82, 31.5], theta: 0.24, phi: 1.04, distance: 9.0 }),
  hidden: Object.freeze({ target: [-12.4, 0.82, 31.5], theta: 0.24, phi: 1.04, distance: 9.6 }),
  active: Object.freeze({ target: [-12.4, 0.80, 31.5], theta: 0.28, phi: 1.03, distance: 7.6 }),
  variant: Object.freeze({ target: [-12.0, 0.76, 31.2], theta: 0.52, phi: 1.02, distance: 6.6 }),
  closeup: Object.freeze({ target: [-11.6, 0.62, 31.4], theta: 0.44, phi: 1.03, distance: 4.4 }),
  debug: Object.freeze({ target: [-12.4, 0.80, 31.5], theta: 0.28, phi: 1.03, distance: 7.6 }),
  watering: Object.freeze({ target: [-12.0, 0.76, 31.2], theta: 0.52, phi: 1.02, distance: 6.6 })
});

const PIER_SHORE_WORK_SITE_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-11.9, 0.82, 31.1], theta: 0.30, phi: 1.04, distance: 8.8 }),
  hidden: Object.freeze({ target: [-11.9, 0.82, 31.1], theta: 0.30, phi: 1.04, distance: 9.4 }),
  active: Object.freeze({ target: [-11.9, 0.80, 31.1], theta: 0.34, phi: 1.03, distance: 7.2 }),
  variant: Object.freeze({ target: [-12.1, 0.78, 31.0], theta: 0.50, phi: 1.02, distance: 6.2 }),
  closeup: Object.freeze({ target: [-12.2, 0.70, 31.0], theta: 0.46, phi: 1.03, distance: 4.6 }),
  debug: Object.freeze({ target: [-11.9, 0.80, 31.1], theta: 0.34, phi: 1.03, distance: 7.2 }),
  watering: Object.freeze({ target: [-12.1, 0.78, 31.0], theta: 0.50, phi: 1.02, distance: 6.2 })
});

export function readToyboxReviewConfig() {
  if (!isToyboxReviewHost()) {
    return {
      enabled: false,
      family: TOYBOX_REVIEW_DEFAULT_FAMILY,
      state: TOYBOX_REVIEW_DEFAULT_STATE
    };
  }

  const params = new URLSearchParams(window.location.search || "");
  const family = params.get("reviewFamily");
  const state = params.get("reviewState");
  return {
    enabled: Boolean(family || state),
    family: normalizeReviewFamily(family),
    state: normalizeReviewState(state)
  };
}

export function normalizeReviewFamily(value) {
  const text = String(value || TOYBOX_REVIEW_DEFAULT_FAMILY).toLowerCase();
  const compact = text.replace(/[^a-z0-9]/g, "");
  if (
    compact.includes("foodroutine") ||
    compact.includes("foodprop") ||
    compact.includes("cookpot") ||
    compact.includes("foodbasket") ||
    compact.includes("storedmeal") ||
    compact.includes("dryingrack") ||
    compact.includes("fishharvest") ||
    compact.includes("leftover")
  ) {
    return FOOD_ROUTINE_ID;
  }
  if (
    compact.includes("ambientbeachfind") ||
    compact.includes("beachfind") ||
    compact.includes("shell") ||
    compact.includes("driftwood") ||
    compact.includes("crumb") ||
    compact.includes("visitor") ||
    compact.includes("birdmarker") ||
    compact.includes("fishmarker")
  ) {
    return AMBIENT_BEACH_FINDS_ID;
  }
  if (
    compact.includes("piershoreworksite") ||
    compact.includes("shoreworksite") ||
    compact.includes("pierwork") ||
    compact.includes("pier") ||
    compact.includes("shorework") ||
    compact.includes("buildsite") ||
    compact.includes("fishingslot") ||
    compact.includes("plank") ||
    compact.includes("lashing")
  ) {
    return PIER_SHORE_WORK_SITE_ID;
  }
  if (
    compact.includes("storage") ||
    compact.includes("workbench") ||
    compact.includes("camppath") ||
    compact.includes("campzone") ||
    compact.includes("boundarystone") ||
    compact.includes("clearedground") ||
    compact.includes("campfire") ||
    compact.includes("firewood") ||
    compact.includes("cookingsurface") ||
    compact.includes("island") ||
    compact.includes("day")
  ) {
    return TOYBOX_REVIEW_DEFAULT_FAMILY;
  }
  return compact || TOYBOX_REVIEW_DEFAULT_FAMILY;
}

export function normalizeReviewState(value) {
  const text = String(value || TOYBOX_REVIEW_DEFAULT_STATE).toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (text === "inactive" || text === "hide" || text === "hidden") return "hidden";
  if (text === "main" || text === "active-main" || text === "active") return "active";
  if (text === "variant" || text === "lit" || text === "boundary") return "variant";
  if (text === "close" || text === "closeup" || text === "inspecttool") return "closeup";
  if (text === "debug" || text === "trace") return "debug";
  if (text === "water" || text === "watering") return "watering";
  return TOYBOX_REVIEW_DEFAULT_STATE;
}

export function applyToyboxReviewState(sourceState, family, stateName) {
  const state = normalizeWorldState(sourceState);
  const normalizedFamily = normalizeReviewFamily(family);
  const normalizedState = normalizeReviewState(stateName);
  if (
    normalizedFamily !== TOYBOX_REVIEW_DEFAULT_FAMILY &&
    normalizedFamily !== FOOD_ROUTINE_ID &&
    normalizedFamily !== AMBIENT_BEACH_FINDS_ID &&
    normalizedFamily !== PIER_SHORE_WORK_SITE_ID
  ) {
    return state;
  }

  seedToyboxReviewBaseState(state);
  if (normalizedFamily === PIER_SHORE_WORK_SITE_ID) {
    applyPierShoreWorkSiteReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyPierShoreWorkSiteReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyPierShoreWorkSiteReviewVariantState(state);
    } else if (normalizedState === "closeup") {
      applyPierShoreWorkSiteReviewCloseupState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyPierShoreWorkSiteReviewActiveState(state);
    }
  } else if (normalizedFamily === AMBIENT_BEACH_FINDS_ID) {
    applyAmbientBeachFindsReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyAmbientBeachFindsReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyAmbientBeachFindsReviewVariantState(state);
    } else if (normalizedState === "closeup") {
      applyAmbientBeachFindsReviewCloseupState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyAmbientBeachFindsReviewActiveState(state);
    }
  } else if (normalizedFamily === FOOD_ROUTINE_ID) {
    applyFoodRoutineReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyFoodRoutineReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyFoodRoutineReviewVariantState(state);
    } else if (normalizedState === "closeup") {
      applyFoodRoutineReviewCloseupState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyFoodRoutineReviewActiveState(state);
    }
  } else {
    if (normalizedState === "hidden") {
      applyToyboxReviewHiddenState(state);
    } else if (normalizedState === "variant") {
      applyToyboxReviewActiveState(state);
      applyToyboxReviewVariantState(state);
    } else if (normalizedState === "closeup") {
      applyToyboxReviewActiveState(state);
      applyToyboxReviewCloseupState(state);
    } else if (normalizedState === "debug") {
      applyToyboxReviewActiveState(state);
    } else if (normalizedState === "watering") {
      applyToyboxReviewActiveState(state);
      applyToyboxReviewWateringState(state);
    } else if (normalizedState === "active") {
      applyToyboxReviewActiveState(state);
    }
  }

  state.review = {
    family: normalizedFamily,
    state: normalizedState,
    devOnly: true
  };
  return normalizeWorldState(state);
}

export function applyToyboxReviewCameraPreset(cameraState, stateName, family = TOYBOX_REVIEW_DEFAULT_FAMILY) {
  if (!cameraState) return;
  const normalizedFamily = normalizeReviewFamily(family);
  const presets = normalizedFamily === AMBIENT_BEACH_FINDS_ID
    ? AMBIENT_BEACH_FINDS_REVIEW_CAMERA_PRESETS
    : normalizedFamily === PIER_SHORE_WORK_SITE_ID
      ? PIER_SHORE_WORK_SITE_REVIEW_CAMERA_PRESETS
      : normalizedFamily === FOOD_ROUTINE_ID
      ? FOOD_ROUTINE_REVIEW_CAMERA_PRESETS
      : TOYBOX_REVIEW_CAMERA_PRESETS;
  const preset = presets[normalizeReviewState(stateName)] || presets.default;
  cameraState.cameraMode = "manual";
  cameraState.target = preset.target.slice();
  cameraState.desiredTarget = preset.target.slice();
  cameraState.theta = preset.theta;
  cameraState.phi = preset.phi;
  cameraState.distance = preset.distance;
  cameraState.dragging = false;
}

export function isToyboxReviewHost() {
  if (typeof window === "undefined" || !window.location) return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "";
}

function seedToyboxReviewBaseState(state) {
  state.sim.seed = 20260621;
  state.sim.elapsedSeconds = 118;
  state.time.day = 8;
  state.time.timeOfDay = 0.50;
  state.time.phase = "day";
  state.bubbleBoy.goal = "review";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -4.82, y: 0.20, z: -1.20 };
  state.bubbleBoy.velocity = { x: 0, y: 0, z: 0 };
  state.bubbleBoy.facing = -0.62;
  state.bubbleBoy.carriedItem = null;
  state.bubbleBoy.carriedObject = null;
  state.bubbleBoy.carrying = null;
  state.bubbleBoy.toolInventory = {
    hasStoneTool: false,
    hasWoodTool: false,
    inspectingTool: null,
    heldTool: null
  };
  state.environment.weather = "clear";
  state.environment.weatherIntensity = 0;
  state.environment.dayFactor = 1;
  state.environment.nightFactor = 0;
  state.environment.light.timeOfDay = 0.50;
  state.environment.light.sourceLevel = 0.92;
  state.environment.light.sunIntensity = 0.96;
  state.environment.light.moonIntensity = 0;
  state.environment.light.fireIntensity = 0.72;
  state.environment.light.dominantSource = "sun";
  state.environment.light.sky = [0.42, 0.66, 0.92];
  state.environment.light.fogColor = [0.50, 0.68, 0.86];
  state.environment.light.fogDensity = 0.015;

  const firePit = state.objects[FIRE_PIT_ID] || {};
  firePit.lit = true;
  firePit.fuel = 84;
  firePit.warmth = 1;
  state.objects[FIRE_PIT_ID] = firePit;

  const workbench = state.objects[WORKBENCH_ID] || {};
  workbench.visible = true;
  workbench.stage = "complete";
  workbench.variant = "upgraded";
  workbench.usable = true;
  state.objects[WORKBENCH_ID] = workbench;
  state.campStorage.visible = true;
  state.campStorage.woodCount = 0;
  state.campStorage.storedWood = 0;
  state.toolRack.visible = true;
  state.toolRack.slots = [];
  setReviewCampLayoutHidden(state);
  setReviewGardenHidden(state);
  setReviewAmbientBeachFindsHidden(state);
  setReviewPierShoreWorkSiteHidden(state);
}

function applyToyboxReviewHiddenState(state) {
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.campStorage.visible = false;
  state.toolRack.visible = false;
  if (state.objects[WORKBENCH_ID]) state.objects[WORKBENCH_ID].visible = false;
  const firePit = state.objects[FIRE_PIT_ID] || {};
  firePit.lit = false;
  firePit.fuel = 0;
  firePit.warmth = 0;
  state.objects[FIRE_PIT_ID] = firePit;
  state.environment.light.fireIntensity = 0;
  setReviewCampLayoutHidden(state);
  setReviewGardenHidden(state);
}

function applyToyboxReviewActiveState(state) {
  state.bubbleBoy.goal = "craft";
  state.bubbleBoy.currentAction = "craftAtWorkbench";
  state.bubbleBoy.position = { x: -4.74, y: 0.20, z: -1.54 };
  state.bubbleBoy.facing = -2.52;
  state.campStorage.visible = true;
  state.campStorage.woodCount = 5;
  state.campStorage.storedWood = 5;
  state.campStorage.stage = "hasWood";
  state.toolRack.visible = true;
  state.toolRack.slots = [{ id: "stone-tool-slot", item: STONE_TOOL_ITEM_ID, occupied: true, index: 0 }];
  state.bubbleBoy.toolInventory.hasStoneTool = true;
  setReviewCampLayoutMarked(state, "cleared");
  setReviewGardenPlots(state, [
    {
      id: "review_seeded_plot",
      stage: "seeded",
      cropType: "berry",
      watered: false,
      position: { x: -4.84, y: 0.18, z: -3.72 }
    },
    {
      id: "review_sprout_plot",
      stage: "sprout2",
      cropType: "carrot",
      watered: true,
      active: true,
      position: { x: -4.02, y: 0.18, z: -3.54 }
    },
    {
      id: "review_crop_plot",
      stage: "grown",
      cropType: "leafy",
      watered: false,
      position: { x: -3.20, y: 0.18, z: -3.36 }
    }
  ]);
}

function applyToyboxReviewVariantState(state) {
  state.bubbleBoy.goal = "campLayout";
  state.bubbleBoy.currentAction = "placeBoundaryStone";
  state.bubbleBoy.carriedObject = BOUNDARY_STONE_ITEM_ID;
  state.bubbleBoy.position = { x: 0.90, y: 0.20, z: 0.98 };
  state.bubbleBoy.facing = 2.56;
  setReviewCampLayoutMarked(state, "lit");
  state.campLayout.zones = state.campLayout.zones.map((zone) => ({
    ...zone,
    stage: "marked",
    markerPlaced: true,
    boundaryStoneCount: zone.type === "cook" ? 6 : 3
  }));
  setReviewGardenPlots(state, [
    {
      id: "review_variant_crop",
      stage: "grown",
      cropType: "berry",
      watered: true,
      active: true,
      position: { x: -4.16, y: 0.18, z: -3.52 }
    }
  ]);
}

function applyToyboxReviewCloseupState(state) {
  state.bubbleBoy.goal = "inspectTool";
  state.bubbleBoy.currentAction = "inspectTool";
  state.bubbleBoy.position = { x: -5.02, y: 0.20, z: -1.34 };
  state.bubbleBoy.facing = -2.76;
  state.bubbleBoy.toolInventory.hasStoneTool = true;
  state.bubbleBoy.toolInventory.inspectingTool = STONE_TOOL_ITEM_ID;
  state.toolRack.slots = [{ id: "stone-tool-slot", item: STONE_TOOL_ITEM_ID, occupied: true, index: 0 }];
}

function applyToyboxReviewWateringState(state) {
  state.bubbleBoy.goal = "watering";
  state.bubbleBoy.currentAction = "watering";
  state.bubbleBoy.carrying = WATER_CAN_ITEM_ID;
  state.bubbleBoy.position = { x: -4.44, y: 0.20, z: -3.02 };
  state.bubbleBoy.facing = -2.30;
  setReviewGardenPlots(state, [
    {
      id: "review_watered_plot",
      stage: "tilled",
      cropType: "carrot",
      watered: true,
      active: true,
      position: { x: -4.38, y: 0.18, z: -3.72 }
    },
    {
      id: "review_harvest_plot",
      stage: "grown",
      cropType: "carrot",
      watered: false,
      position: { x: -3.56, y: 0.18, z: -3.52 }
    }
  ]);
  state.bubbleBoy.carrying = WATER_CAN_ITEM_ID;
}

function applyFoodRoutineReviewBaseState(state) {
  state.time.day = 32;
  state.bubbleBoy.goal = "foodRoutine";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -0.72, y: 0.20, z: 1.34 };
  state.bubbleBoy.facing = -2.42;
  state.bubbleBoy.inventory.fish = { state: "raw", id: "review-food-fish" };
  const firePit = state.objects[FIRE_PIT_ID] || {};
  firePit.visible = true;
  firePit.lit = true;
  firePit.fuel = 86;
  firePit.warmth = 1;
  state.objects[FIRE_PIT_ID] = firePit;
  state.foodRoutine = foodRoutineReviewState({
    stage: "prep",
    variant: "cookPrep",
    basketStock: 5,
    mealCount: 3,
    driedFishCount: 2,
    harvestCount: 5,
    leftoverCount: 1,
    active: false
  });
}

function applyFoodRoutineReviewHiddenState(state) {
  state.time.day = 30;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.inventory.fish = { state: "none", id: null };
  state.foodRoutine = foodRoutineReviewState({
    visible: false,
    stage: "none",
    basketStock: 0,
    mealCount: 0,
    driedFishCount: 0,
    harvestCount: 0,
    leftoverCount: 0,
    active: false
  });
}

function applyFoodRoutineReviewActiveState(state) {
  state.time.day = 32;
  state.bubbleBoy.goal = "foodRoutine";
  state.bubbleBoy.currentAction = "cookingfish";
  state.bubbleBoy.position = { x: -0.64, y: 0.20, z: 1.28 };
  state.bubbleBoy.facing = -2.48;
  state.foodRoutine = foodRoutineReviewState({
    stage: "prep",
    variant: "cookPrep",
    basketStock: 5,
    mealCount: 3,
    driedFishCount: 2,
    harvestCount: 5,
    leftoverCount: 1,
    active: true
  });
}

function applyFoodRoutineReviewVariantState(state) {
  state.time.day = 58;
  state.bubbleBoy.goal = "foodRoutine";
  state.bubbleBoy.currentAction = "inspectingGarden";
  state.bubbleBoy.position = { x: -0.24, y: 0.20, z: 1.52 };
  state.bubbleBoy.facing = -2.82;
  state.foodRoutine = foodRoutineReviewState({
    stage: "drying",
    variant: "dryingDay",
    basketStock: 3,
    mealCount: 4,
    driedFishCount: 4,
    harvestCount: 4,
    leftoverCount: 2,
    active: true
  });
}

function applyFoodRoutineReviewCloseupState(state) {
  state.time.day = 58;
  state.bubbleBoy.goal = "foodRoutine";
  state.bubbleBoy.currentAction = "eatingfish";
  state.bubbleBoy.position = { x: -0.18, y: 0.20, z: 1.26 };
  state.bubbleBoy.facing = -2.65;
  state.foodRoutine = foodRoutineReviewState({
    stage: "stored",
    variant: "storageSpread",
    basketStock: 5,
    mealCount: 4,
    driedFishCount: 4,
    harvestCount: 5,
    leftoverCount: 2,
    active: true
  });
}

function foodRoutineReviewState({
  visible = true,
  stage = "prep",
  variant = "cookPrep",
  basketStock = 5,
  mealCount = 3,
  driedFishCount = 2,
  harvestCount = 5,
  leftoverCount = 1,
  active = false
} = {}) {
  return {
    id: FOOD_ROUTINE_ID,
    family: FOOD_ROUTINE_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: true,
    cookSurfaceVisible: visible,
    basketVisible: visible && basketStock > 0,
    storedMealsVisible: visible && mealCount > 0,
    dryingRackVisible: visible && driedFishCount > 0,
    fishHarvestVisible: visible && harvestCount > 0,
    leftoversVisible: visible && leftoverCount > 0,
    basketStock,
    mealCount,
    driedFishCount,
    harvestCount,
    leftoverCount,
    source: "procedural"
  };
}

function applyAmbientBeachFindsReviewBaseState(state) {
  state.time.day = 37;
  state.bubbleBoy.goal = "ambientBeachFinds";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -10.8, y: 0.20, z: 29.9 };
  state.bubbleBoy.facing = 0.82;
  state.ambientBeachFinds = ambientBeachFindsReviewState({
    stage: "finds",
    variant: "shorelineFinds",
    shellCount: 12,
    driftwoodCount: 4,
    tinyFindCount: 6,
    foodCrumbCount: 1,
    birdMarkerCount: 2,
    fishMarkerCount: 3,
    animalVisitorVisible: true,
    active: false
  });
}

function applyAmbientBeachFindsReviewHiddenState(state) {
  state.time.day = 41;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -10.8, y: 0.20, z: 29.9 };
  state.bubbleBoy.facing = 0.82;
  state.ambientBeachFinds = ambientBeachFindsReviewState({
    visible: false,
    stage: "none",
    shellCount: 0,
    driftwoodCount: 0,
    tinyFindCount: 0,
    foodCrumbCount: 0,
    birdMarkerCount: 0,
    fishMarkerCount: 0,
    animalVisitorVisible: false,
    active: false
  });
}

function applyAmbientBeachFindsReviewActiveState(state) {
  state.time.day = 37;
  state.bubbleBoy.goal = "ambientBeachFinds";
  state.bubbleBoy.currentAction = "inspectBeachFinds";
  state.bubbleBoy.position = { x: -10.5, y: 0.20, z: 29.6 };
  state.bubbleBoy.facing = 0.92;
  state.ambientBeachFinds = ambientBeachFindsReviewState({
    stage: "finds",
    variant: "shorelineFinds",
    shellCount: 12,
    driftwoodCount: 4,
    tinyFindCount: 6,
    foodCrumbCount: 1,
    birdMarkerCount: 2,
    fishMarkerCount: 3,
    animalVisitorVisible: true,
    active: true
  });
}

function applyAmbientBeachFindsReviewVariantState(state) {
  state.time.day = 72;
  state.bubbleBoy.goal = "ambientBeachFinds";
  state.bubbleBoy.currentAction = "inspectBeachFinds";
  state.bubbleBoy.position = { x: -10.3, y: 0.20, z: 29.8 };
  state.bubbleBoy.facing = 0.88;
  state.ambientBeachFinds = ambientBeachFindsReviewState({
    stage: "visitor",
    variant: "visitorReturn",
    shellCount: 12,
    driftwoodCount: 5,
    tinyFindCount: 7,
    foodCrumbCount: 2,
    birdMarkerCount: 3,
    fishMarkerCount: 4,
    animalVisitorVisible: true,
    active: true
  });
}

function applyAmbientBeachFindsReviewCloseupState(state) {
  applyAmbientBeachFindsReviewVariantState(state);
  state.bubbleBoy.position = { x: -10.0, y: 0.20, z: 30.3 };
  state.bubbleBoy.facing = 1.10;
}

function ambientBeachFindsReviewState({
  visible = true,
  stage = "finds",
  variant = "shorelineFinds",
  shellCount = 12,
  driftwoodCount = 4,
  tinyFindCount = 6,
  foodCrumbCount = 1,
  birdMarkerCount = 2,
  fishMarkerCount = 3,
  animalVisitorVisible = true,
  active = false
} = {}) {
  return {
    id: AMBIENT_BEACH_FINDS_ID,
    family: AMBIENT_BEACH_FINDS_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "shoreline",
    anchorPosition: { x: -12.4, y: 0.18, z: 31.5 },
    shellsVisible: visible && shellCount > 0,
    driftwoodVisible: visible && driftwoodCount > 0,
    tinyFindsVisible: visible && tinyFindCount > 0,
    foodCrumbsVisible: visible && foodCrumbCount > 0,
    animalVisitorVisible: visible && animalVisitorVisible,
    birdMarkersVisible: visible && birdMarkerCount > 0,
    fishMarkersVisible: visible && fishMarkerCount > 0,
    shellCount,
    driftwoodCount,
    tinyFindCount,
    foodCrumbCount,
    birdMarkerCount,
    fishMarkerCount,
    source: "procedural"
  };
}

function applyPierShoreWorkSiteReviewBaseState(state) {
  state.time.day = 42;
  state.bubbleBoy.goal = "pierShoreWorkSite";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -10.6, y: 0.20, z: 29.5 };
  state.bubbleBoy.facing = 0.95;
  state.pierShoreWorkSite = pierShoreWorkSiteReviewState({
    stage: "posts",
    variant: "partialPier",
    pierPostCount: 6,
    plankCount: 5,
    lashingCount: 8,
    workMarkerCount: 1,
    safeBuildSiteCount: 1,
    fishingSlotCount: 1,
    active: false
  });
}

function applyPierShoreWorkSiteReviewHiddenState(state) {
  state.time.day = 46;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -10.6, y: 0.20, z: 29.5 };
  state.bubbleBoy.facing = 0.95;
  state.pierShoreWorkSite = pierShoreWorkSiteReviewState({
    visible: false,
    stage: "none",
    pierPostCount: 0,
    plankCount: 0,
    lashingCount: 0,
    workMarkerCount: 0,
    safeBuildSiteCount: 0,
    fishingSlotCount: 0,
    active: false
  });
}

function applyPierShoreWorkSiteReviewActiveState(state) {
  state.time.day = 42;
  state.bubbleBoy.goal = "pierShoreWorkSite";
  state.bubbleBoy.currentAction = "inspectPierSite";
  state.bubbleBoy.position = { x: -10.55, y: 0.20, z: 29.45 };
  state.bubbleBoy.facing = 0.98;
  state.pierShoreWorkSite = pierShoreWorkSiteReviewState({
    stage: "posts",
    variant: "partialPier",
    pierPostCount: 6,
    plankCount: 5,
    lashingCount: 8,
    workMarkerCount: 1,
    safeBuildSiteCount: 1,
    fishingSlotCount: 1,
    active: true
  });
}

function applyPierShoreWorkSiteReviewVariantState(state) {
  state.time.day = 45;
  state.bubbleBoy.goal = "pierShoreWorkSite";
  state.bubbleBoy.currentAction = "inspectPierSite";
  state.bubbleBoy.position = { x: -10.5, y: 0.20, z: 29.42 };
  state.bubbleBoy.facing = 1.02;
  state.pierShoreWorkSite = pierShoreWorkSiteReviewState({
    stage: "planking",
    variant: "fishingSlot",
    pierPostCount: 8,
    plankCount: 7,
    lashingCount: 10,
    workMarkerCount: 1,
    safeBuildSiteCount: 1,
    fishingSlotCount: 1,
    active: true
  });
}

function applyPierShoreWorkSiteReviewCloseupState(state) {
  applyPierShoreWorkSiteReviewVariantState(state);
  state.bubbleBoy.position = { x: -10.35, y: 0.20, z: 29.62 };
  state.bubbleBoy.facing = 1.14;
}

function pierShoreWorkSiteReviewState({
  visible = true,
  stage = "posts",
  variant = "partialPier",
  pierPostCount = 6,
  plankCount = 5,
  lashingCount = 8,
  workMarkerCount = 1,
  safeBuildSiteCount = 1,
  fishingSlotCount = 1,
  active = false
} = {}) {
  return {
    id: PIER_SHORE_WORK_SITE_ID,
    family: PIER_SHORE_WORK_SITE_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "shoreline",
    anchorPosition: { x: -11.9, y: 0.18, z: 31.1 },
    safeBuildAnchorPosition: { x: -10.6, y: 0.18, z: 29.5 },
    fishingSlotPosition: { x: -13.4, y: 0.18, z: 31.9 },
    pierPostsVisible: visible && pierPostCount > 0,
    planksVisible: visible && plankCount > 0,
    lashingsVisible: visible && lashingCount > 0,
    shoreWorkMarkerVisible: visible && workMarkerCount > 0,
    safeBuildSiteVisible: visible && safeBuildSiteCount > 0,
    fishingSlotVisible: visible && fishingSlotCount > 0,
    pierPostCount,
    plankCount,
    lashingCount,
    workMarkerCount,
    safeBuildSiteCount,
    fishingSlotCount,
    source: "procedural",
    safetyNote: "visual-only shoreline work site; BB and build marker remain on land"
  };
}

function setReviewCampLayoutHidden(state) {
  state.campLayout.visible = false;
  state.campLayout.active = false;
  state.campLayout.paths = (state.campLayout.paths || []).map((path) => ({
    ...path,
    visible: false,
    stage: "none",
    lit: false
  }));
  state.campLayout.zones = (state.campLayout.zones || []).map((zone) => ({
    ...zone,
    visible: false,
    stage: "none",
    markerPlaced: false,
    boundaryStoneCount: 0,
    boundaryStones: []
  }));
}

function setReviewCampLayoutMarked(state, pathStage) {
  state.campLayout.visible = true;
  state.campLayout.active = true;
  state.campLayout.paths = [
    {
      id: "review_path_workbench_fire",
      stage: pathStage,
      variant: pathStage === "lit" ? "litDirtPath" : "dirtPath",
      visible: true,
      waypoints: [
        { x: -5.55, y: 0.18, z: -1.9 },
        { x: -2.75, y: 0.18, z: -1.05 },
        { x: 0, y: 0.18, z: -0.16 }
      ]
    },
    {
      id: "review_path_fire_rest",
      stage: pathStage,
      variant: pathStage === "lit" ? "litDirtPath" : "dirtPath",
      visible: true,
      waypoints: [
        { x: 0, y: 0.18, z: -0.16 },
        { x: -3.05, y: 0.18, z: -1.58 },
        { x: -5.76, y: 0.18, z: -2.70 }
      ]
    }
  ];
  state.campLayout.zones = [
    reviewZone("zone_work", "work", { x: -5.18, y: 0.18, z: -1.42 }, 4),
    reviewZone("zone_cook", "cook", { x: 0.62, y: 0.18, z: 0.28 }, 5),
    reviewZone("zone_rest", "rest", { x: -5.76, y: 0.18, z: -2.70 }, 4)
  ];
}

function reviewZone(id, type, anchorPosition, boundaryStoneCount) {
  return {
    id,
    type,
    stage: "marked",
    markerPlaced: true,
    visible: true,
    anchorPosition,
    boundaryStoneCount
  };
}

function setReviewGardenHidden(state) {
  state.gardenPlots = (state.gardenPlots || []).map((plot) => ({
    ...plot,
    visible: false,
    stage: "none",
    watered: false,
    active: false
  }));
}

function setReviewAmbientBeachFindsHidden(state) {
  state.ambientBeachFinds = ambientBeachFindsReviewState({
    visible: false,
    stage: "none",
    shellCount: 0,
    driftwoodCount: 0,
    tinyFindCount: 0,
    foodCrumbCount: 0,
    birdMarkerCount: 0,
    fishMarkerCount: 0,
    animalVisitorVisible: false,
    active: false
  });
}

function setReviewPierShoreWorkSiteHidden(state) {
  state.pierShoreWorkSite = pierShoreWorkSiteReviewState({
    visible: false,
    stage: "none",
    pierPostCount: 0,
    plankCount: 0,
    lashingCount: 0,
    workMarkerCount: 0,
    safeBuildSiteCount: 0,
    fishingSlotCount: 0,
    active: false
  });
}

function setReviewGardenPlots(state, plots) {
  state.gardenPlots = plots.map((plot, index) => ({
    id: plot.id || `review_garden_plot_${index + 1}`,
    stage: plot.stage || "tilled",
    cropType: plot.cropType || "carrot",
    variant: plot.cropType || "carrot",
    watered: Boolean(plot.watered),
    active: Boolean(plot.active),
    visible: true,
    position: plot.position || { x: -4.4 + index * 0.82, y: 0.18, z: -3.62 }
  }));
}
