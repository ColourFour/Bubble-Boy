import {
  BOUNDARY_STONE_ITEM_ID,
  FIRE_PIT_ID,
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
  if (normalizedFamily !== TOYBOX_REVIEW_DEFAULT_FAMILY) return state;

  seedToyboxReviewBaseState(state);
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

  state.review = {
    family: normalizedFamily,
    state: normalizedState,
    devOnly: true
  };
  return normalizeWorldState(state);
}

export function applyToyboxReviewCameraPreset(cameraState, stateName) {
  if (!cameraState) return;
  const preset =
    TOYBOX_REVIEW_CAMERA_PRESETS[normalizeReviewState(stateName)] || TOYBOX_REVIEW_CAMERA_PRESETS.default;
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
