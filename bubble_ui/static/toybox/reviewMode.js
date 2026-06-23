import {
  ANIMAL_FAMILIAR_VISITOR_ID,
  AMBIENT_BEACH_FINDS_ID,
  ARRIVAL_BUNDLE_ITEM_ID,
  BED_BUILD_SITE_ID,
  BOUNDARY_STONE_ITEM_ID,
  BUILDABLE_IDS,
  BUILD_SITE_ID,
  FIRE_PIT_ID,
  FISH_TRAP_ROUTINE_ID,
  FOOD_ROUTINE_ID,
  MUSIC_ART_DECOR_ID,
  NIGHT_COMFORT_LIGHTS_ID,
  LOOKOUT_MAP_HORIZON_ID,
  MAJOR_PROJECT_CAPSTONE_ID,
  PIER_SHORE_WORK_SITE_ID,
  RAFT_BOAT_ROUTE_ID,
  STONE_TOOL_ITEM_ID,
  TOY_BUILD_SITE_ID,
  TOY_PLAY_SET_ID,
  WATER_CAN_ITEM_ID,
  WORKBENCH_ID,
  normalizeWorldState
} from "/static/toybox/simulation/worldState.js";

export const TOYBOX_REVIEW_DEFAULT_FAMILY = "earlyIslandAssets";
export const TOYBOX_REVIEW_DEFAULT_STATE = "default";
const LOCOMOTION_ANIMATION_REVIEW_FAMILY = "locomotionAnimation";
const ATTENTION_ARRIVAL_EMOTE_REVIEW_FAMILY = "attentionArrivalEmotes";
const GATHER_CARRY_DEPOSIT_REVIEW_FAMILY = "gatherCarryDeposit";
const FIRE_CARE_COOKING_REVIEW_FAMILY = "fireCareCooking";
const REST_SLEEP_WAKE_REVIEW_FAMILY = "restSleepWake";
const BUILD_TIE_CRAFT_REPAIR_REVIEW_FAMILY = "buildTieCraftRepair";
const CAMP_STORAGE_SITTING_REVIEW_FAMILY = "campStorageSitting";
const PATH_CLEARING_GROUND_WORK_REVIEW_FAMILY = "pathClearingGroundWork";

const TOYBOX_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-3.0, 0.88, -1.35], theta: 0.68, phi: 1.08, distance: 10.8 }),
  hidden: Object.freeze({ target: [-3.0, 0.88, -1.35], theta: 0.68, phi: 1.08, distance: 10.8 }),
  active: Object.freeze({ target: [-3.0, 0.86, -1.35], theta: 0.70, phi: 1.08, distance: 9.6 }),
  variant: Object.freeze({ target: [-1.80, 0.88, -0.52], theta: 0.92, phi: 1.04, distance: 8.4 }),
  closeup: Object.freeze({ target: [-5.30, 0.92, -1.58], theta: 0.52, phi: 1.08, distance: 5.8 }),
  debug: Object.freeze({ target: [-3.0, 0.86, -1.35], theta: 0.70, phi: 1.08, distance: 9.6 }),
  watering: Object.freeze({ target: [-4.18, 0.82, -3.44], theta: 0.48, phi: 1.06, distance: 6.3 })
});

const LOCOMOTION_ANIMATION_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.64, phi: 1.04, distance: 5.7 }),
  hidden: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.64, phi: 1.04, distance: 5.7 }),
  active: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.64, phi: 1.04, distance: 5.7 }),
  variant: Object.freeze({ target: [-3.05, 0.80, -1.35], theta: 0.68, phi: 1.03, distance: 5.2 }),
  closeup: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.56, phi: 1.03, distance: 4.7 }),
  debug: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.64, phi: 1.04, distance: 5.7 }),
  watering: Object.freeze({ target: [-3.05, 0.80, -1.35], theta: 0.68, phi: 1.03, distance: 5.2 }),
  complete: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.64, phi: 1.04, distance: 5.9 })
});

const ATTENTION_ARRIVAL_EMOTE_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.62, phi: 1.03, distance: 5.2 }),
  hidden: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.62, phi: 1.03, distance: 5.2 }),
  active: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.58, phi: 1.02, distance: 4.9 }),
  variant: Object.freeze({ target: [-4.76, 0.78, -1.50], theta: 0.66, phi: 1.02, distance: 4.8 }),
  closeup: Object.freeze({ target: [-3.45, 0.84, -1.35], theta: 0.50, phi: 1.01, distance: 4.2 }),
  debug: Object.freeze({ target: [-3.45, 0.84, -1.35], theta: 0.54, phi: 1.02, distance: 4.7 }),
  watering: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.62, phi: 1.03, distance: 5.0 }),
  complete: Object.freeze({ target: [-3.45, 0.82, -1.35], theta: 0.62, phi: 1.03, distance: 5.2 })
});

const GATHER_CARRY_DEPOSIT_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-3.86, 0.76, -1.30], theta: 0.64, phi: 1.04, distance: 5.2 }),
  hidden: Object.freeze({ target: [-3.86, 0.76, -1.30], theta: 0.64, phi: 1.04, distance: 5.2 }),
  active: Object.freeze({ target: [-3.86, 0.76, -1.30], theta: 0.62, phi: 1.03, distance: 4.8 }),
  variant: Object.freeze({ target: [-3.86, 0.80, -1.30], theta: 0.58, phi: 1.03, distance: 4.7 }),
  closeup: Object.freeze({ target: [-3.54, 0.80, -1.30], theta: 0.54, phi: 1.02, distance: 4.3 }),
  debug: Object.freeze({ target: [-3.86, 0.80, -1.30], theta: 0.58, phi: 1.03, distance: 4.7 }),
  watering: Object.freeze({ target: [-4.54, 0.76, -1.58], theta: 0.66, phi: 1.03, distance: 5.0 }),
  complete: Object.freeze({ target: [-4.54, 0.76, -1.58], theta: 0.66, phi: 1.03, distance: 5.0 })
});

const FIRE_CARE_COOKING_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [0.08, 0.78, 0.70], theta: 0.66, phi: 1.04, distance: 4.9 }),
  hidden: Object.freeze({ target: [0.08, 0.78, 0.70], theta: 0.66, phi: 1.04, distance: 4.9 }),
  active: Object.freeze({ target: [0.08, 0.78, 0.70], theta: 0.66, phi: 1.04, distance: 4.7 }),
  variant: Object.freeze({ target: [0.06, 0.76, 0.70], theta: 0.72, phi: 1.03, distance: 4.6 }),
  closeup: Object.freeze({ target: [0.12, 0.78, 0.84], theta: 0.54, phi: 1.02, distance: 3.7 }),
  debug: Object.freeze({ target: [0.08, 0.78, 0.70], theta: 0.68, phi: 1.03, distance: 4.5 }),
  watering: Object.freeze({ target: [0.12, 0.78, 0.84], theta: 0.54, phi: 1.02, distance: 3.9 }),
  complete: Object.freeze({ target: [0.12, 0.78, 0.84], theta: 0.54, phi: 1.02, distance: 3.8 })
});

const REST_SLEEP_WAKE_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-5.76, 0.72, -2.70], theta: 0.58, phi: 1.03, distance: 4.8 }),
  hidden: Object.freeze({ target: [-5.76, 0.72, -2.70], theta: 0.58, phi: 1.03, distance: 4.8 }),
  active: Object.freeze({ target: [-5.76, 0.68, -2.70], theta: 0.56, phi: 1.02, distance: 4.5 }),
  variant: Object.freeze({ target: [-5.76, 0.62, -2.70], theta: 0.52, phi: 1.02, distance: 4.2 }),
  closeup: Object.freeze({ target: [-5.76, 0.62, -2.70], theta: 0.50, phi: 1.01, distance: 3.8 }),
  debug: Object.freeze({ target: [-5.76, 0.66, -2.70], theta: 0.54, phi: 1.02, distance: 4.1 }),
  watering: Object.freeze({ target: [-5.76, 0.70, -2.70], theta: 0.54, phi: 1.02, distance: 4.2 }),
  complete: Object.freeze({ target: [-5.76, 0.76, -2.70], theta: 0.58, phi: 1.03, distance: 4.6 })
});

const BUILD_TIE_CRAFT_REPAIR_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-2.42, 0.82, -1.34], theta: 0.64, phi: 1.04, distance: 5.3 }),
  hidden: Object.freeze({ target: [-2.42, 0.82, -1.34], theta: 0.64, phi: 1.04, distance: 5.7 }),
  active: Object.freeze({ target: [-2.42, 0.78, -1.34], theta: 0.60, phi: 1.03, distance: 4.9 }),
  variant: Object.freeze({ target: [-2.42, 0.76, -1.34], theta: 0.58, phi: 1.03, distance: 4.7 }),
  debug: Object.freeze({ target: [-2.42, 0.80, -1.34], theta: 0.66, phi: 1.03, distance: 5.0 }),
  closeup: Object.freeze({ target: [-4.96, 0.78, -1.48], theta: 0.56, phi: 1.02, distance: 4.1 }),
  inspection: Object.freeze({ target: [-2.42, 0.78, -1.34], theta: 0.60, phi: 1.03, distance: 4.8 }),
  repair: Object.freeze({ target: [-2.42, 0.78, -1.34], theta: 0.62, phi: 1.03, distance: 4.9 }),
  watering: Object.freeze({ target: [-2.42, 0.78, -1.34], theta: 0.62, phi: 1.03, distance: 4.9 }),
  complete: Object.freeze({ target: [-2.42, 0.80, -1.34], theta: 0.62, phi: 1.03, distance: 5.0 })
});

const CAMP_STORAGE_SITTING_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-4.74, 0.76, -1.54], theta: 0.60, phi: 1.03, distance: 4.9 }),
  hidden: Object.freeze({ target: [-4.74, 0.76, -1.54], theta: 0.60, phi: 1.03, distance: 5.4 }),
  active: Object.freeze({ target: [-4.74, 0.76, -1.54], theta: 0.58, phi: 1.03, distance: 4.7 }),
  watering: Object.freeze({ target: [-4.74, 0.76, -1.54], theta: 0.58, phi: 1.03, distance: 4.7 }),
  variant: Object.freeze({ target: [-4.74, 0.76, -1.54], theta: 0.62, phi: 1.03, distance: 4.8 }),
  debug: Object.freeze({ target: [-3.50, 0.78, -1.32], theta: 0.68, phi: 1.03, distance: 5.2 }),
  closeup: Object.freeze({ target: [0.06, 0.72, 0.76], theta: 0.72, phi: 1.02, distance: 4.6 }),
  inspection: Object.freeze({ target: [-2.90, 0.86, -1.08], theta: 0.76, phi: 1.04, distance: 6.0 }),
  complete: Object.freeze({ target: [-5.76, 0.72, -2.70], theta: 0.58, phi: 1.03, distance: 4.8 })
});

const PATH_CLEARING_GROUND_WORK_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-2.74, 0.72, -1.08], theta: 0.66, phi: 1.04, distance: 5.0 }),
  hidden: Object.freeze({ target: [-2.74, 0.72, -1.08], theta: 0.66, phi: 1.04, distance: 5.4 }),
  active: Object.freeze({ target: [-2.74, 0.72, -1.08], theta: 0.60, phi: 1.03, distance: 4.7 }),
  debug: Object.freeze({ target: [-2.36, 0.72, -0.96], theta: 0.62, phi: 1.03, distance: 4.8 }),
  variant: Object.freeze({ target: [-2.60, 0.72, -1.02], theta: 0.72, phi: 1.03, distance: 4.8 }),
  watering: Object.freeze({ target: [0.72, 0.68, 0.30], theta: 0.76, phi: 1.02, distance: 4.4 }),
  closeup: Object.freeze({ target: [-2.74, 0.72, -1.08], theta: 0.58, phi: 1.03, distance: 4.5 }),
  inspection: Object.freeze({ target: [-2.12, 0.80, -0.90], theta: 0.78, phi: 1.04, distance: 5.8 }),
  complete: Object.freeze({ target: [-2.74, 0.72, -1.08], theta: 0.66, phi: 1.04, distance: 5.0 })
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

const FISH_TRAP_ROUTINE_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-13.7, 0.70, 32.6], theta: 0.36, phi: 1.04, distance: 8.3 }),
  hidden: Object.freeze({ target: [-13.7, 0.70, 32.6], theta: 0.36, phi: 1.04, distance: 8.9 }),
  active: Object.freeze({ target: [-13.9, 0.58, 32.8], theta: 0.42, phi: 1.03, distance: 6.1 }),
  variant: Object.freeze({ target: [-14.4, 0.58, 33.2], theta: 0.48, phi: 1.02, distance: 5.8 }),
  closeup: Object.freeze({ target: [-11.55, 0.72, 30.30], theta: 0.44, phi: 1.03, distance: 4.2 }),
  debug: Object.freeze({ target: [-13.7, 0.66, 32.7], theta: 0.42, phi: 1.03, distance: 6.7 }),
  watering: Object.freeze({ target: [-14.4, 0.58, 33.2], theta: 0.48, phi: 1.02, distance: 5.8 })
});

const TOY_PLAY_SET_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-4.18, 0.72, -2.22], theta: 0.58, phi: 1.05, distance: 6.3 }),
  hidden: Object.freeze({ target: [-4.18, 0.72, -2.22], theta: 0.58, phi: 1.05, distance: 6.8 }),
  active: Object.freeze({ target: [-4.20, 0.64, -2.26], theta: 0.66, phi: 1.03, distance: 4.9 }),
  variant: Object.freeze({ target: [-4.10, 0.58, -2.18], theta: 0.86, phi: 1.01, distance: 4.5 }),
  closeup: Object.freeze({ target: [-4.60, 0.72, -2.62], theta: 0.52, phi: 1.02, distance: 3.6 }),
  debug: Object.freeze({ target: [-4.18, 0.66, -2.22], theta: 0.66, phi: 1.03, distance: 5.4 }),
  watering: Object.freeze({ target: [-4.10, 0.58, -2.18], theta: 0.86, phi: 1.01, distance: 4.5 })
});

const MUSIC_ART_DECOR_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-1.42, 0.72, -0.92], theta: 0.68, phi: 1.05, distance: 5.9 }),
  hidden: Object.freeze({ target: [-1.42, 0.72, -0.92], theta: 0.68, phi: 1.05, distance: 6.5 }),
  active: Object.freeze({ target: [-1.40, 0.68, -0.90], theta: 0.72, phi: 1.03, distance: 4.7 }),
  variant: Object.freeze({ target: [-1.16, 0.66, -0.58], theta: 0.82, phi: 1.03, distance: 4.5 }),
  closeup: Object.freeze({ target: [-1.78, 0.86, -1.22], theta: 0.54, phi: 1.02, distance: 3.5 }),
  debug: Object.freeze({ target: [-1.36, 0.68, -0.82], theta: 0.72, phi: 1.03, distance: 5.2 }),
  watering: Object.freeze({ target: [-1.16, 0.66, -0.58], theta: 0.82, phi: 1.03, distance: 4.5 })
});

const ANIMAL_FAMILIAR_VISITOR_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-10.95, 0.70, 30.86], theta: 0.34, phi: 1.04, distance: 7.2 }),
  hidden: Object.freeze({ target: [-10.95, 0.70, 30.86], theta: 0.34, phi: 1.04, distance: 7.8 }),
  active: Object.freeze({ target: [-10.90, 0.64, 30.82], theta: 0.40, phi: 1.03, distance: 5.8 }),
  variant: Object.freeze({ target: [-10.95, 0.60, 30.86], theta: 0.50, phi: 1.02, distance: 6.8 }),
  closeup: Object.freeze({ target: [-10.68, 0.42, 31.02], theta: 0.42, phi: 1.02, distance: 3.8 }),
  debug: Object.freeze({ target: [-10.95, 0.64, 30.86], theta: 0.40, phi: 1.03, distance: 6.2 }),
  watering: Object.freeze({ target: [-10.95, 0.60, 30.86], theta: 0.50, phi: 1.02, distance: 6.8 })
});

const NIGHT_COMFORT_LIGHTS_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-2.55, 0.76, -1.62], theta: 0.66, phi: 1.04, distance: 6.0 }),
  hidden: Object.freeze({ target: [-2.55, 0.76, -1.62], theta: 0.66, phi: 1.04, distance: 6.6 }),
  active: Object.freeze({ target: [-2.44, 0.70, -1.58], theta: 0.74, phi: 1.02, distance: 5.0 }),
  variant: Object.freeze({ target: [-2.28, 0.74, -1.92], theta: 0.86, phi: 1.02, distance: 4.7 }),
  closeup: Object.freeze({ target: [-2.02, 0.54, -1.26], theta: 0.58, phi: 1.02, distance: 3.5 }),
  debug: Object.freeze({ target: [-2.44, 0.70, -1.58], theta: 0.74, phi: 1.02, distance: 5.5 }),
  watering: Object.freeze({ target: [-2.28, 0.74, -1.92], theta: 0.86, phi: 1.02, distance: 4.7 })
});

const LOOKOUT_MAP_HORIZON_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [5.85, 0.92, 6.35], theta: -0.50, phi: 1.04, distance: 8.4 }),
  hidden: Object.freeze({ target: [5.85, 0.92, 6.35], theta: -0.50, phi: 1.04, distance: 9.0 }),
  active: Object.freeze({ target: [5.84, 0.82, 6.28], theta: -0.42, phi: 1.03, distance: 6.6 }),
  variant: Object.freeze({ target: [6.08, 0.78, 6.58], theta: -0.58, phi: 1.02, distance: 6.2 }),
  closeup: Object.freeze({ target: [5.22, 0.82, 5.50], theta: -2.10, phi: 1.02, distance: 4.0 }),
  debug: Object.freeze({ target: [5.84, 0.82, 6.28], theta: -0.42, phi: 1.03, distance: 7.0 }),
  watering: Object.freeze({ target: [6.08, 0.78, 6.58], theta: -0.58, phi: 1.02, distance: 6.2 })
});

const MAJOR_PROJECT_CAPSTONE_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [1.82, 0.72, -2.20], theta: 0.72, phi: 1.04, distance: 6.4 }),
  hidden: Object.freeze({ target: [1.82, 0.72, -2.20], theta: 0.72, phi: 1.04, distance: 6.9 }),
  active: Object.freeze({ target: [1.82, 0.66, -2.20], theta: 0.78, phi: 1.02, distance: 4.9 }),
  variant: Object.freeze({ target: [1.82, 0.68, -2.10], theta: 0.84, phi: 1.02, distance: 4.6 }),
  complete: Object.freeze({ target: [1.82, 0.66, -2.08], theta: 0.78, phi: 1.02, distance: 4.8 }),
  closeup: Object.freeze({ target: [1.82, 0.58, -2.02], theta: 0.58, phi: 1.01, distance: 3.4 }),
  debug: Object.freeze({ target: [1.82, 0.66, -2.20], theta: 0.78, phi: 1.02, distance: 5.2 }),
  watering: Object.freeze({ target: [1.82, 0.68, -2.10], theta: 0.84, phi: 1.02, distance: 4.6 })
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

const RAFT_BOAT_ROUTE_REVIEW_CAMERA_PRESETS = Object.freeze({
  default: Object.freeze({ target: [-13.4, 0.76, 32.3], theta: 0.28, phi: 1.04, distance: 9.2 }),
  hidden: Object.freeze({ target: [-13.4, 0.76, 32.3], theta: 0.28, phi: 1.04, distance: 9.8 }),
  active: Object.freeze({ target: [-12.9, 0.72, 31.9], theta: 0.34, phi: 1.03, distance: 7.4 }),
  variant: Object.freeze({ target: [-15.8, 0.58, 34.3], theta: 0.46, phi: 1.02, distance: 7.0 }),
  closeup: Object.freeze({ target: [-15.1, 0.46, 33.6], theta: 0.42, phi: 1.03, distance: 4.9 }),
  debug: Object.freeze({ target: [-13.4, 0.72, 32.3], theta: 0.34, phi: 1.03, distance: 7.8 }),
  watering: Object.freeze({ target: [-16.0, 0.58, 34.5], theta: 0.48, phi: 1.02, distance: 7.2 })
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
    compact.includes("locomotionanimation") ||
    compact.includes("locomotion") ||
    compact.includes("bubbleboymotion") ||
    compact.includes("bbmotion") ||
    compact.includes("walkcycle") ||
    compact.includes("turninplace")
  ) {
    return LOCOMOTION_ANIMATION_REVIEW_FAMILY;
  }
  if (
    compact.includes("attentionarrivalemotes") ||
    compact.includes("attentionarrival") ||
    compact.includes("arrivalemotes") ||
    compact.includes("playeremotes") ||
    compact.includes("bubbleboyemotes") ||
    compact.includes("bbemotes") ||
    compact.includes("respondtoplayer") ||
    compact.includes("pointnotice") ||
    compact.includes("quietcelebrate")
  ) {
    return ATTENTION_ARRIVAL_EMOTE_REVIEW_FAMILY;
  }
  if (
    compact.includes("gathercarrydeposit") ||
    compact.includes("gathercarry") ||
    compact.includes("carrydeposit") ||
    compact.includes("bendpickup") ||
    compact.includes("pickupcarry") ||
    compact.includes("carrybundle") ||
    compact.includes("depositmaterial")
  ) {
    return GATHER_CARRY_DEPOSIT_REVIEW_FAMILY;
  }
  if (
    compact.includes("firecarecooking") ||
    compact.includes("firecare") ||
    compact.includes("warmthcooking") ||
    compact.includes("warmhands") ||
    compact.includes("lightfire") ||
    compact.includes("addfuel") ||
    compact.includes("stokefire") ||
    compact.includes("stirpot") ||
    compact.includes("holdfood") ||
    compact.includes("eatfood")
  ) {
    return FIRE_CARE_COOKING_REVIEW_FAMILY;
  }
  if (
    compact.includes("hammockbedrestsleepwake") ||
    compact.includes("restsleepwake") ||
    compact.includes("sleepwake") ||
    compact.includes("hammockbed") ||
    compact.includes("sitrestspot") ||
    compact.includes("settleintohammock") ||
    compact.includes("settleintobed") ||
    compact.includes("sleeploop") ||
    compact.includes("standupfromrest")
  ) {
    return REST_SLEEP_WAKE_REVIEW_FAMILY;
  }
  if (
    compact.includes("buildtiecraftrepair") ||
    compact.includes("buildcraftrepair") ||
    compact.includes("buildrepair") ||
    compact.includes("hammerstrike") ||
    compact.includes("tieropevines") ||
    compact.includes("placeplank") ||
    compact.includes("pushpostupright") ||
    compact.includes("carvetool") ||
    compact.includes("inspectprogress") ||
    compact.includes("repairshelter") ||
    compact.includes("reinforceshelter")
  ) {
    return BUILD_TIE_CRAFT_REPAIR_REVIEW_FAMILY;
  }
  if (
    compact.includes("campstoragesitting") ||
    compact.includes("campstorage") ||
    compact.includes("storagesitting") ||
    compact.includes("sortmaterials") ||
    compact.includes("depositstorage") ||
    compact.includes("withdrawstorage") ||
    compact.includes("tidycamp") ||
    compact.includes("sitnearfire") ||
    compact.includes("restinsideshelter") ||
    compact.includes("inspectcamplayout")
  ) {
    return CAMP_STORAGE_SITTING_REVIEW_FAMILY;
  }
  if (
    compact.includes("pathclearinggroundwork") ||
    compact.includes("pathclearing") ||
    compact.includes("groundwork") ||
    compact.includes("pathwork") ||
    compact.includes("rakepath") ||
    compact.includes("clearpath") ||
    compact.includes("sweepleaves") ||
    compact.includes("placeboundarystone") ||
    compact.includes("kneelmarkzone") ||
    compact.includes("walkinspectroute")
  ) {
    return PATH_CLEARING_GROUND_WORK_REVIEW_FAMILY;
  }
  if (
    compact.includes("fishtraproutine") ||
    compact.includes("fishtrap") ||
    compact.includes("crabpot") ||
    compact.includes("trapbuoy") ||
    compact.includes("buoymarker") ||
    compact.includes("catchdisplay") ||
    compact.includes("trapdrying") ||
    compact.includes("shoretrap")
  ) {
    return FISH_TRAP_ROUTINE_ID;
  }
  if (
    compact.includes("toyplayset") ||
    compact.includes("playmat") ||
    compact.includes("toycollection") ||
    compact.includes("toyblock") ||
    compact.includes("toyblocks") ||
    compact.includes("spinningtop") ||
    compact.includes("kite") ||
    compact.includes("toyball")
  ) {
    return TOY_PLAY_SET_ID;
  }
  if (
    compact.includes("musicartdecor") ||
    compact.includes("musicdecor") ||
    compact.includes("artdecor") ||
    compact.includes("shellchime") ||
    compact.includes("paintedstone") ||
    compact.includes("smalldrum") ||
    compact.includes("drum") ||
    compact.includes("flute") ||
    compact.includes("hangingdecoration") ||
    compact.includes("artdisplay") ||
    compact.includes("duskperformance") ||
    compact.includes("notemarker")
  ) {
    return MUSIC_ART_DECOR_ID;
  }
  if (
    compact.includes("animalfamiliarvisitor") ||
    compact.includes("animalfamiliar") ||
    compact.includes("familiarvisitor") ||
    compact.includes("groundvisitor") ||
    compact.includes("birdvisitor") ||
    compact.includes("fishvisitor") ||
    compact.includes("feedmarker") ||
    compact.includes("foodcrumbmarker") ||
    compact.includes("observedistance") ||
    compact.includes("approachmarker")
  ) {
    return ANIMAL_FAMILIAR_VISITOR_ID;
  }
  if (
    compact.includes("nightcomfortlights") ||
    compact.includes("nightcomfort") ||
    compact.includes("lanternpost") ||
    compact.includes("litpathanchor") ||
    compact.includes("glowingshell") ||
    compact.includes("firefly") ||
    compact.includes("fireflies") ||
    compact.includes("sitnight") ||
    compact.includes("sitanchor")
  ) {
    return NIGHT_COMFORT_LIGHTS_ID;
  }
  if (
    compact.includes("lookoutmaphorizon") ||
    compact.includes("lookout") ||
    compact.includes("mapboard") ||
    compact.includes("sketchmap") ||
    compact.includes("horizonmarker") ||
    compact.includes("horizonhighlight") ||
    compact.includes("keepsake") ||
    compact.includes("day100") ||
    compact.includes("dayonehundred")
  ) {
    return LOOKOUT_MAP_HORIZON_ID;
  }
  if (
    compact.includes("majorprojectcapstone") ||
    compact.includes("capstoneproject") ||
    compact.includes("capstone") ||
    compact.includes("communitytable") ||
    compact.includes("stage0") ||
    compact.includes("stage1") ||
    compact.includes("stage2") ||
    compact.includes("stage3")
  ) {
    return MAJOR_PROJECT_CAPSTONE_ID;
  }
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
    compact.includes("raftboatroute") ||
    compact.includes("raftroute") ||
    compact.includes("boatrout") ||
    compact.includes("watercraft") ||
    compact.includes("raft") ||
    compact.includes("boat") ||
    compact.includes("paddle") ||
    compact.includes("oar") ||
    compact.includes("wakemarker") ||
    compact.includes("routemarker") ||
    compact.includes("landing")
  ) {
    return RAFT_BOAT_ROUTE_ID;
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
  if (
    text === "complete" ||
    text === "completed" ||
    text === "cleared" ||
    text === "clearattachment" ||
    text === "clearedattachment" ||
    text === "setdown" ||
    text === "setitemdown" ||
    text === "stand" ||
    text === "standup" ||
    text === "standupfromrest" ||
    text === "restinsideshelter" ||
    text === "rest-inside-shelter" ||
    text === "reinforce" ||
    text === "reinforceshelter" ||
    text === "reinforce-shelter" ||
    text === "stage3" ||
    text === "stage-3"
  ) return "complete";
  if (
    text === "inspectprogress" ||
    text === "inspect-progress" ||
    text === "inspectcamplayout" ||
    text === "inspect-camp-layout" ||
    text === "inspection" ||
    text === "buildinspect" ||
    text === "progressinspect"
  ) return "inspection";
  if (
    text === "repair" ||
    text === "repairshelter" ||
    text === "repair-shelter"
  ) return "repair";
  if (text === "stage1" || text === "stage-1") return "active";
  if (
    text === "main" ||
    text === "active-main" ||
    text === "active" ||
    text === "pickup" ||
    text === "pickupmaterial" ||
    text === "settle" ||
    text === "settleintohammock" ||
    text === "settleinto-hammock" ||
    text === "settleintobed" ||
    text === "settleinto-bed" ||
    text === "bedsettle" ||
    text === "hammocksettle" ||
    text === "tierope" ||
    text === "tievines" ||
    text === "tieropevines" ||
    text === "tie-rope-vines" ||
    text === "sortmaterials" ||
    text === "sort-materials" ||
    text === "rakepath" ||
    text === "rake-path" ||
    text === "set" ||
    text === "setstate" ||
    text === "set-state"
  ) return "active";
  if (
    text === "variant" ||
    text === "lit" ||
    text === "boundary" ||
    text === "ready" ||
    text === "readycheck" ||
    text === "readycheck-state" ||
    text === "checkstate" ||
    text === "playmat" ||
    text === "playmatlayout" ||
    text === "matlayout" ||
    text === "dusk" ||
    text === "night" ||
    text === "dusknight" ||
    text === "duskvariant" ||
    text === "performance" ||
    text === "observe" ||
    text === "observedistance" ||
    text === "observe-distance" ||
    text === "approach" ||
    text === "carryidle" ||
    text === "carrybundle" ||
    text === "lie" ||
    text === "liedown" ||
    text === "lie-down" ||
    text === "placeplank" ||
    text === "place-plank" ||
    text === "withdrawstorage" ||
    text === "withdraw-storage" ||
    text === "sweepleaves" ||
    text === "sweep-leaves" ||
    text === "dusklit" ||
    text === "dusk-lit" ||
    text === "nightlit" ||
    text === "night-lit" ||
    text === "firefly" ||
    text === "fireflies" ||
    text === "glow" ||
    text === "fireflyglow" ||
    text === "horizon" ||
    text === "horizonmarker" ||
    text === "horizon-marker" ||
    text === "horizonhighlight" ||
    text === "horizon-highlight" ||
    text === "day100" ||
    text === "day-100" ||
    text === "dayonehundred" ||
    text === "stage2" ||
    text === "stage-2"
  ) return "variant";
  if (
    text === "close" ||
    text === "closeup" ||
    text === "inspecttool" ||
    text === "drying" ||
    text === "dryingrack" ||
    text === "drying-rack" ||
    text === "toycloseup" ||
    text === "kite" ||
    text === "spinningtop" ||
    text === "decoration" ||
    text === "decorcloseup" ||
    text === "chimecloseup" ||
    text === "feed" ||
    text === "feedmarker" ||
    text === "feed-marker" ||
    text === "crumb" ||
    text === "crumbmarker" ||
    text === "nightcloseup" ||
    text === "glowingshell" ||
    text === "glowingshells" ||
    text === "mapboard" ||
    text === "map-board" ||
    text === "sketchmap" ||
    text === "sketch-map" ||
    text === "lookoutcloseup" ||
    text === "sleep" ||
    text === "sleeploop" ||
    text === "sleep-loop" ||
    text === "carrywalk" ||
    text === "walkingcarry" ||
    text === "craft" ||
    text === "craftatworkbench" ||
    text === "craft-at-workbench" ||
    text === "carvetool" ||
    text === "carve-tool" ||
    text === "sitnearfire" ||
    text === "sit-near-fire" ||
    text === "kneelmarkzone" ||
    text === "kneel-mark-zone" ||
    text === "markzone" ||
    text === "mark-zone"
  ) return "closeup";
  if (text === "debug" || text === "trace") return "debug";
  if (text === "tidycamp" || text === "tidy-camp") return "debug";
  if (text === "clearpath" || text === "clear-path" || text === "pathclear" || text === "path-clear") return "debug";
  if (text === "walkinspectroute" || text === "walk-inspect-route" || text === "inspectroute" || text === "inspect-route") {
    return "inspection";
  }
  if (text === "pushpost" || text === "pushpostupright" || text === "push-post-upright") return "debug";
  if (
    text === "water" ||
    text === "watering" ||
    text === "deposit" ||
    text === "depositstorage" ||
    text === "deposit-storage" ||
    text === "depositmaterial" ||
    text === "placeboundarystone" ||
    text === "place-boundary-stone" ||
    text === "placestone" ||
    text === "place-stone" ||
    text === "wake" ||
    text === "stretch" ||
    text === "wakestretch" ||
    text === "wake-stretch"
  ) return "watering";
  return TOYBOX_REVIEW_DEFAULT_STATE;
}

export function applyToyboxReviewState(sourceState, family, stateName) {
  const state = normalizeWorldState(sourceState);
  const normalizedFamily = normalizeReviewFamily(family);
  const normalizedState = normalizeReviewState(stateName);
  if (
    normalizedFamily !== TOYBOX_REVIEW_DEFAULT_FAMILY &&
    normalizedFamily !== FISH_TRAP_ROUTINE_ID &&
    normalizedFamily !== TOY_PLAY_SET_ID &&
    normalizedFamily !== MUSIC_ART_DECOR_ID &&
    normalizedFamily !== ANIMAL_FAMILIAR_VISITOR_ID &&
    normalizedFamily !== NIGHT_COMFORT_LIGHTS_ID &&
    normalizedFamily !== LOOKOUT_MAP_HORIZON_ID &&
    normalizedFamily !== MAJOR_PROJECT_CAPSTONE_ID &&
    normalizedFamily !== FOOD_ROUTINE_ID &&
    normalizedFamily !== AMBIENT_BEACH_FINDS_ID &&
    normalizedFamily !== PIER_SHORE_WORK_SITE_ID &&
    normalizedFamily !== RAFT_BOAT_ROUTE_ID &&
    normalizedFamily !== LOCOMOTION_ANIMATION_REVIEW_FAMILY &&
    normalizedFamily !== ATTENTION_ARRIVAL_EMOTE_REVIEW_FAMILY &&
    normalizedFamily !== GATHER_CARRY_DEPOSIT_REVIEW_FAMILY &&
    normalizedFamily !== FIRE_CARE_COOKING_REVIEW_FAMILY &&
    normalizedFamily !== REST_SLEEP_WAKE_REVIEW_FAMILY &&
    normalizedFamily !== BUILD_TIE_CRAFT_REPAIR_REVIEW_FAMILY &&
    normalizedFamily !== CAMP_STORAGE_SITTING_REVIEW_FAMILY &&
    normalizedFamily !== PATH_CLEARING_GROUND_WORK_REVIEW_FAMILY
  ) {
    return state;
  }

  seedToyboxReviewBaseState(state);
  if (normalizedFamily === LOCOMOTION_ANIMATION_REVIEW_FAMILY) {
    applyLocomotionAnimationReviewState(state, normalizedState);
  } else if (normalizedFamily === ATTENTION_ARRIVAL_EMOTE_REVIEW_FAMILY) {
    applyAttentionArrivalEmoteReviewState(state, normalizedState);
  } else if (normalizedFamily === GATHER_CARRY_DEPOSIT_REVIEW_FAMILY) {
    applyGatherCarryDepositReviewState(state, normalizedState);
  } else if (normalizedFamily === FIRE_CARE_COOKING_REVIEW_FAMILY) {
    applyFireCareCookingReviewState(state, normalizedState);
  } else if (normalizedFamily === REST_SLEEP_WAKE_REVIEW_FAMILY) {
    applyRestSleepWakeReviewState(state, normalizedState);
  } else if (normalizedFamily === BUILD_TIE_CRAFT_REPAIR_REVIEW_FAMILY) {
    applyBuildTieCraftRepairReviewState(state, normalizedState);
  } else if (normalizedFamily === CAMP_STORAGE_SITTING_REVIEW_FAMILY) {
    applyCampStorageSittingReviewState(state, normalizedState);
  } else if (normalizedFamily === PATH_CLEARING_GROUND_WORK_REVIEW_FAMILY) {
    applyPathClearingGroundWorkReviewState(state, normalizedState);
  } else if (normalizedFamily === RAFT_BOAT_ROUTE_ID) {
    applyRaftBoatRouteReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyRaftBoatRouteReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyRaftBoatRouteReviewRouteState(state);
    } else if (normalizedState === "closeup") {
      applyRaftBoatRouteReviewCloseupState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyRaftBoatRouteReviewActiveState(state);
    }
  } else if (normalizedFamily === FISH_TRAP_ROUTINE_ID) {
    applyFishTrapRoutineReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyFishTrapRoutineReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyFishTrapRoutineReviewReadyState(state);
    } else if (normalizedState === "closeup") {
      applyFishTrapRoutineReviewDryingState(state);
    } else if (normalizedState === "debug") {
      applyFishTrapRoutineReviewReadyState(state);
    } else if (normalizedState === "active") {
      applyFishTrapRoutineReviewSetState(state);
    }
  } else if (normalizedFamily === TOY_PLAY_SET_ID) {
    applyToyPlaySetReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyToyPlaySetReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyToyPlaySetReviewMatLayoutState(state);
    } else if (normalizedState === "closeup") {
      applyToyPlaySetReviewCloseupState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyToyPlaySetReviewActiveState(state);
    }
  } else if (normalizedFamily === MUSIC_ART_DECOR_ID) {
    applyMusicArtDecorReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyMusicArtDecorReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyMusicArtDecorReviewDuskState(state);
    } else if (normalizedState === "closeup") {
      applyMusicArtDecorReviewCloseupState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyMusicArtDecorReviewActiveState(state);
    }
  } else if (normalizedFamily === ANIMAL_FAMILIAR_VISITOR_ID) {
    applyAnimalFamiliarVisitorReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyAnimalFamiliarVisitorReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyAnimalFamiliarVisitorReviewObserveState(state);
    } else if (normalizedState === "closeup") {
      applyAnimalFamiliarVisitorReviewFeedState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyAnimalFamiliarVisitorReviewActiveState(state);
    }
  } else if (normalizedFamily === NIGHT_COMFORT_LIGHTS_ID) {
    applyNightComfortLightsReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyNightComfortLightsReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyNightComfortLightsReviewFireflyState(state);
    } else if (normalizedState === "closeup") {
      applyNightComfortLightsReviewCloseupState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyNightComfortLightsReviewDuskState(state);
    }
  } else if (normalizedFamily === LOOKOUT_MAP_HORIZON_ID) {
    applyLookoutMapHorizonReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyLookoutMapHorizonReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyLookoutMapHorizonReviewDay100State(state);
    } else if (normalizedState === "closeup") {
      applyLookoutMapHorizonReviewMapBoardState(state);
    } else if (normalizedState === "debug" || normalizedState === "active") {
      applyLookoutMapHorizonReviewActiveState(state);
    }
  } else if (normalizedFamily === MAJOR_PROJECT_CAPSTONE_ID) {
    applyMajorProjectCapstoneReviewBaseState(state);
    if (normalizedState === "hidden") {
      applyMajorProjectCapstoneReviewHiddenState(state);
    } else if (normalizedState === "variant" || normalizedState === "watering") {
      applyMajorProjectCapstoneReviewStage2State(state);
    } else if (normalizedState === "complete") {
      applyMajorProjectCapstoneReviewCompleteState(state);
    } else if (normalizedState === "closeup") {
      applyMajorProjectCapstoneReviewCloseupState(state);
    } else if (normalizedState === "debug") {
      applyMajorProjectCapstoneReviewCompleteState(state);
    } else if (normalizedState === "active") {
      applyMajorProjectCapstoneReviewStage1State(state);
    }
  } else if (normalizedFamily === PIER_SHORE_WORK_SITE_ID) {
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
  const presets = normalizedFamily === LOCOMOTION_ANIMATION_REVIEW_FAMILY
    ? LOCOMOTION_ANIMATION_REVIEW_CAMERA_PRESETS
    : normalizedFamily === ATTENTION_ARRIVAL_EMOTE_REVIEW_FAMILY
    ? ATTENTION_ARRIVAL_EMOTE_REVIEW_CAMERA_PRESETS
    : normalizedFamily === GATHER_CARRY_DEPOSIT_REVIEW_FAMILY
    ? GATHER_CARRY_DEPOSIT_REVIEW_CAMERA_PRESETS
    : normalizedFamily === FIRE_CARE_COOKING_REVIEW_FAMILY
    ? FIRE_CARE_COOKING_REVIEW_CAMERA_PRESETS
    : normalizedFamily === REST_SLEEP_WAKE_REVIEW_FAMILY
    ? REST_SLEEP_WAKE_REVIEW_CAMERA_PRESETS
    : normalizedFamily === BUILD_TIE_CRAFT_REPAIR_REVIEW_FAMILY
    ? BUILD_TIE_CRAFT_REPAIR_REVIEW_CAMERA_PRESETS
    : normalizedFamily === CAMP_STORAGE_SITTING_REVIEW_FAMILY
    ? CAMP_STORAGE_SITTING_REVIEW_CAMERA_PRESETS
    : normalizedFamily === PATH_CLEARING_GROUND_WORK_REVIEW_FAMILY
    ? PATH_CLEARING_GROUND_WORK_REVIEW_CAMERA_PRESETS
    : normalizedFamily === AMBIENT_BEACH_FINDS_ID
    ? AMBIENT_BEACH_FINDS_REVIEW_CAMERA_PRESETS
    : normalizedFamily === FISH_TRAP_ROUTINE_ID
      ? FISH_TRAP_ROUTINE_REVIEW_CAMERA_PRESETS
    : normalizedFamily === TOY_PLAY_SET_ID
      ? TOY_PLAY_SET_REVIEW_CAMERA_PRESETS
    : normalizedFamily === MUSIC_ART_DECOR_ID
      ? MUSIC_ART_DECOR_REVIEW_CAMERA_PRESETS
    : normalizedFamily === ANIMAL_FAMILIAR_VISITOR_ID
      ? ANIMAL_FAMILIAR_VISITOR_REVIEW_CAMERA_PRESETS
    : normalizedFamily === NIGHT_COMFORT_LIGHTS_ID
      ? NIGHT_COMFORT_LIGHTS_REVIEW_CAMERA_PRESETS
    : normalizedFamily === LOOKOUT_MAP_HORIZON_ID
      ? LOOKOUT_MAP_HORIZON_REVIEW_CAMERA_PRESETS
    : normalizedFamily === MAJOR_PROJECT_CAPSTONE_ID
      ? MAJOR_PROJECT_CAPSTONE_REVIEW_CAMERA_PRESETS
    : normalizedFamily === RAFT_BOAT_ROUTE_ID
      ? RAFT_BOAT_ROUTE_REVIEW_CAMERA_PRESETS
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
  setReviewFoodRoutineHidden(state);
  setReviewFishTrapRoutineHidden(state);
  setReviewToyPlaySetHidden(state);
  setReviewMusicArtDecorHidden(state);
  setReviewAnimalFamiliarVisitorHidden(state);
  setReviewNightComfortLightsHidden(state);
  setReviewLookoutMapHorizonHidden(state);
  setReviewMajorProjectCapstoneHidden(state);
  setReviewAmbientBeachFindsHidden(state);
  setReviewPierShoreWorkSiteHidden(state);
  setReviewRaftBoatRouteHidden(state);
}

function applyLocomotionAnimationReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  const buildSite = state.objects[BUILD_SITE_ID] || {};
  buildSite.visible = true;
  buildSite.position = { x: -2.25, y: 0.20, z: -1.35 };
  buildSite.radius = 1.1;
  buildSite.progress = Math.max(0.2, Number(buildSite.progress || 0.2));
  state.objects[BUILD_SITE_ID] = buildSite;

  boy.goal = "review";
  boy.currentAction = "idle";
  boy.actionTimer = 1.2;
  boy.minActionTime = 0;
  boy.position = { x: -3.45, y: 0.20, z: -1.35 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = -1.48;
  boy.targetId = null;
  boy.focus = {
    kind: "default",
    position: { x: -4.0, y: 0.92, z: -1.88 },
    strength: 0.18
  };
  boy.builder.actionState = "inspect";
  boy.builder.project = BUILDABLE_IDS.shelter;
  boy.builder.progress = 0.2;

  if (normalizedState === "active") {
    boy.goal = "wander";
    boy.currentAction = "walking";
    boy.actionTimer = 1.1;
    boy.velocity = { x: 0.52, y: 0, z: 0 };
    boy.facing = -1.58;
    boy.builder.actionState = "walkTo";
  } else if (normalizedState === "variant") {
    boy.goal = "wander";
    boy.currentAction = "walking";
    boy.actionTimer = 1.1;
    boy.velocity = { x: 0.24, y: 0, z: 0 };
    boy.facing = -1.58;
    boy.builder.actionState = "walkTo";
  } else if (normalizedState === "closeup") {
    boy.currentAction = "lookingAround";
    boy.facing = 0;
    boy.focus = {
      kind: "turn-review-target",
      position: { x: -1.80, y: 0.72, z: -1.35 },
      strength: 0.82
    };
  } else if (normalizedState === "debug") {
    boy.goal = "wander";
    boy.currentAction = "walking";
    boy.actionTimer = 0.18;
    boy.velocity = { x: 0.48, y: 0, z: 0 };
    boy.facing = -1.58;
    boy.builder.actionState = "walkTo";
  } else if (normalizedState === "watering") {
    boy.goal = "buildProject";
    boy.currentAction = "building";
    boy.actionTimer = 0.22;
    boy.position = { x: -2.80, y: 0.20, z: -1.35 };
    boy.velocity = { x: 0, y: 0, z: 0 };
    boy.facing = -1.58;
    boy.targetId = BUILD_SITE_ID;
    boy.focus = {
      kind: "builder",
      position: { x: buildSite.position.x, y: 0.82, z: buildSite.position.z },
      strength: 0.76
    };
    boy.builder.actionState = "construct";
  } else if (normalizedState === "complete") {
    boy.goal = "followIntent";
    boy.currentAction = "walking";
    boy.actionTimer = 1.1;
    boy.velocity = { x: 0.92, y: 0, z: 0 };
    boy.facing = -1.58;
    boy.builder.actionState = "walkTo";
  }
}

function applyAttentionArrivalEmoteReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  const buildSite = state.objects[BUILD_SITE_ID] || {};
  buildSite.visible = true;
  buildSite.position = { x: -2.35, y: 0.20, z: -1.32 };
  buildSite.radius = 1.1;
  buildSite.progress = Math.max(0.2, Number(buildSite.progress || 0.2));
  state.objects[BUILD_SITE_ID] = buildSite;

  const workbench = state.objects[WORKBENCH_ID] || {};
  workbench.visible = true;
  workbench.position = { x: -5.05, y: 0.24, z: -1.66 };
  state.objects[WORKBENCH_ID] = workbench;

  boy.goal = "review";
  boy.currentAction = "arriveLookAround";
  boy.actionTimer = 0.8;
  boy.minActionTime = 0;
  boy.position = { x: -3.45, y: 0.20, z: -1.35 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = -1.48;
  boy.targetId = null;
  boy.mood = "curious";
  boy.attention = "idle";
  boy.focus = {
    kind: "default",
    position: { x: -4.20, y: 0.92, z: -1.90 },
    strength: 0.36
  };
  boy.affect.attention = 0.44;
  boy.affect.curiosity = 0.66;
  boy.affect.comfort = 0.48;
  boy.affect.stimulus = 0.32;
  boy.builder.actionState = "inspect";
  boy.builder.project = BUILDABLE_IDS.shelter;
  boy.builder.progress = 0.2;

  if (normalizedState === "active") {
    boy.currentAction = "respondToPlayer";
    boy.goal = "attendUser";
    boy.attention = "userIntent";
    boy.mood = "curious";
    boy.focus = {
      kind: "player",
      position: { x: -2.60, y: 1.05, z: -2.40 },
      strength: 0.92
    };
    boy.affect.attention = 0.86;
    boy.affect.curiosity = 0.52;
    boy.affect.comfort = 0.62;
    boy.affect.stimulus = 0.58;
  } else if (normalizedState === "variant") {
    boy.currentAction = "inspectObject";
    boy.goal = "inspect";
    boy.attention = "builder";
    boy.targetId = WORKBENCH_ID;
    boy.focus = {
      kind: "workbench",
      position: { x: workbench.position.x, y: 0.82, z: workbench.position.z },
      strength: 0.88
    };
    boy.affect.attention = 0.74;
    boy.affect.curiosity = 0.70;
    boy.affect.comfort = 0.44;
    boy.affect.stimulus = 0.34;
  } else if (normalizedState === "closeup") {
    boy.currentAction = "pointNotice";
    boy.goal = "notice";
    boy.attention = "island";
    boy.focus = {
      kind: "island",
      position: { x: -1.80, y: 0.86, z: -1.42 },
      strength: 0.84
    };
    boy.affect.attention = 0.76;
    boy.affect.curiosity = 0.72;
    boy.affect.comfort = 0.50;
    boy.affect.stimulus = 0.46;
  } else if (normalizedState === "debug" || normalizedState === "watering") {
    boy.currentAction = "smallSurprise";
    boy.goal = "notice";
    boy.attention = "weather";
    boy.mood = "alert";
    boy.focus = {
      kind: "weather",
      position: { x: -4.05, y: 1.12, z: -2.22 },
      strength: 0.86
    };
    boy.affect.attention = 0.80;
    boy.affect.curiosity = 0.58;
    boy.affect.comfort = 0.28;
    boy.affect.stimulus = 0.78;
  } else if (normalizedState === "complete") {
    boy.currentAction = "quietCelebrate";
    boy.goal = "milestone";
    boy.attention = "builder";
    boy.mood = "curious";
    boy.focus = {
      kind: "builder",
      position: { x: buildSite.position.x, y: 0.82, z: buildSite.position.z },
      strength: 0.74
    };
    boy.affect.attention = 0.62;
    boy.affect.curiosity = 0.46;
    boy.affect.comfort = 0.78;
    boy.affect.stimulus = 0.42;
  } else if (normalizedState === "hidden") {
    boy.currentAction = "orientToIsland";
    boy.goal = "review";
    boy.focus = {
      kind: "island",
      position: { x: -2.30, y: 0.90, z: -0.65 },
      strength: 0.68
    };
  }
}

function applyGatherCarryDepositReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  const buildSite = state.objects[BUILD_SITE_ID] || {};
  buildSite.visible = true;
  buildSite.position = { x: -2.40, y: 0.20, z: -1.32 };
  buildSite.radius = 1.1;
  buildSite.progress = Math.max(0.2, Number(buildSite.progress || 0.2));
  state.objects[BUILD_SITE_ID] = buildSite;

  state.campStorage.visible = true;
  state.campStorage.woodCount = 2;
  state.campStorage.storedWood = 2;
  state.campStorage.stage = "hasWood";
  state.toolRack.visible = true;

  state.arrivalSupplies.visible = true;
  state.arrivalSupplies.active = true;
  state.arrivalSupplies.washedBundleVisible = false;
  state.arrivalSupplies.scatteredSticksVisible = true;
  state.arrivalSupplies.scatteredLeavesVisible = true;
  state.arrivalSupplies.materialPileVisible = false;
  state.arrivalSupplies.bundleCarriedByBB = false;

  boy.goal = "review";
  boy.currentAction = "bendPickup";
  boy.actionTimer = 0.6;
  boy.minActionTime = 0;
  boy.position = { x: -3.86, y: 0.20, z: -1.30 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = -1.52;
  boy.targetId = null;
  boy.carriedItem = null;
  boy.carriedObject = null;
  boy.carrying = null;
  boy.focus = {
    kind: "looseSupplies",
    position: { x: -3.62, y: 0.36, z: -1.72 },
    strength: 0.70
  };
  boy.builder.actionState = "gather";
  boy.builder.project = BUILDABLE_IDS.shelter;
  boy.builder.progress = 0.2;

  if (normalizedState === "active") {
    boy.currentAction = "pickupMaterial";
    boy.actionTimer = 0.42;
    boy.focus = {
      kind: "looseSupplies",
      position: { x: -3.60, y: 0.34, z: -1.72 },
      strength: 0.78
    };
  } else if (normalizedState === "variant") {
    boy.currentAction = "carryBundle";
    boy.actionTimer = 1.1;
    boy.carriedItem = ARRIVAL_BUNDLE_ITEM_ID;
    boy.focus = {
      kind: "storage",
      position: { x: -4.62, y: 0.62, z: -1.58 },
      strength: 0.46
    };
    state.arrivalSupplies.scatteredSticksVisible = false;
    state.arrivalSupplies.scatteredLeavesVisible = false;
  } else if (normalizedState === "closeup" || normalizedState === "debug") {
    boy.goal = "wander";
    boy.currentAction = "carryBundle";
    boy.actionTimer = 1.1;
    boy.carriedItem = ARRIVAL_BUNDLE_ITEM_ID;
    boy.velocity = { x: 0.48, y: 0, z: 0 };
    boy.facing = -1.58;
    boy.builder.actionState = "walkTo";
    boy.focus = {
      kind: "storage",
      position: { x: -4.62, y: 0.62, z: -1.58 },
      strength: 0.46
    };
    state.arrivalSupplies.scatteredSticksVisible = false;
    state.arrivalSupplies.scatteredLeavesVisible = false;
  } else if (normalizedState === "watering") {
    boy.goal = "storage";
    boy.currentAction = "depositMaterial";
    boy.actionTimer = 0.46;
    boy.position = { x: -4.54, y: 0.20, z: -1.58 };
    boy.facing = -2.38;
    boy.focus = {
      kind: "storage",
      position: { x: -4.82, y: 0.52, z: -1.74 },
      strength: 0.76
    };
    boy.builder.actionState = "deposit";
    state.arrivalSupplies.scatteredSticksVisible = false;
    state.arrivalSupplies.scatteredLeavesVisible = false;
    state.arrivalSupplies.materialPileVisible = true;
    state.campStorage.woodCount = 4;
    state.campStorage.storedWood = 4;
  } else if (normalizedState === "complete") {
    boy.goal = "storage";
    boy.currentAction = "setItemDown";
    boy.actionTimer = 0.84;
    boy.position = { x: -4.54, y: 0.20, z: -1.58 };
    boy.facing = -2.38;
    boy.focus = {
      kind: "storage",
      position: { x: -4.82, y: 0.52, z: -1.74 },
      strength: 0.64
    };
    boy.builder.actionState = "deposit";
    state.arrivalSupplies.scatteredSticksVisible = false;
    state.arrivalSupplies.scatteredLeavesVisible = false;
    state.arrivalSupplies.materialPileVisible = true;
    state.campStorage.woodCount = 4;
    state.campStorage.storedWood = 4;
  } else if (normalizedState === "hidden") {
    boy.currentAction = "gatherLooseSupplies";
    state.arrivalSupplies.visible = false;
    state.arrivalSupplies.scatteredSticksVisible = false;
    state.arrivalSupplies.scatteredLeavesVisible = false;
  }
}

function applyFireCareCookingReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  const firePit = state.objects[FIRE_PIT_ID] || {};
  firePit.visible = true;
  firePit.lit = true;
  firePit.fuel = Math.max(72, Number(firePit.fuel || 0));
  firePit.warmth = 1;
  state.objects[FIRE_PIT_ID] = firePit;
  if (state.environment && state.environment.light) state.environment.light.fireIntensity = 0.88;

  state.time.day = 8;
  state.foodRoutine = foodRoutineReviewState({
    stage: "prep",
    variant: "cookPrep",
    basketStock: 4,
    mealCount: 2,
    driedFishCount: 1,
    harvestCount: 3,
    leftoverCount: 1,
    active: true
  });

  boy.goal = "fireCare";
  boy.currentAction = "lightFire";
  boy.actionTimer = 0.72;
  boy.minActionTime = 0;
  boy.position = { x: -0.72, y: 0.20, z: 1.30 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = -2.46;
  boy.targetId = FIRE_PIT_ID;
  boy.carrying = null;
  boy.carriedItem = null;
  boy.carriedObject = null;
  boy.inventory.fish = { state: "raw", id: "review-fire-food" };
  boy.focus = {
    kind: "fire",
    position: { x: firePit.position.x || 0, y: 0.62, z: firePit.position.z || 0 },
    strength: 0.82
  };

  if (normalizedState === "active") {
    boy.currentAction = "warmHands";
    boy.goal = "warmth";
    boy.actionTimer = 1.1;
    boy.position = { x: -0.76, y: 0.20, z: 1.36 };
    boy.facing = -2.44;
  } else if (normalizedState === "variant") {
    boy.currentAction = "stokeFire";
    boy.goal = "fireCare";
    boy.actionTimer = 0.62;
    boy.position = { x: -0.66, y: 0.20, z: 1.28 };
    boy.facing = -2.48;
    state.foodRoutine.cookSurfaceVisible = true;
  } else if (normalizedState === "closeup" || normalizedState === "debug") {
    boy.currentAction = "stirPot";
    boy.goal = "foodRoutine";
    boy.actionTimer = 0.78;
    boy.position = { x: -0.54, y: 0.20, z: 1.20 };
    boy.facing = -2.54;
    boy.inventory.fish = { state: "cooked", id: "review-fire-food" };
    state.foodRoutine.stage = "prep";
    state.foodRoutine.variant = "cookPrep";
    state.foodRoutine.cookSurfaceVisible = true;
  } else if (normalizedState === "watering") {
    boy.currentAction = "holdFood";
    boy.goal = "foodRoutine";
    boy.actionTimer = 0.8;
    boy.position = { x: -0.30, y: 0.20, z: 1.22 };
    boy.facing = -2.66;
    boy.inventory.fish = { state: "cooked", id: "review-fire-food" };
    state.foodRoutine.stage = "stored";
    state.foodRoutine.variant = "storageSpread";
  } else if (normalizedState === "complete") {
    boy.currentAction = "eatFood";
    boy.goal = "foodRoutine";
    boy.actionTimer = 0.92;
    boy.position = { x: -0.30, y: 0.20, z: 1.22 };
    boy.facing = -2.66;
    boy.inventory.fish = { state: "cooked", id: "review-fire-food" };
    state.foodRoutine.stage = "stored";
    state.foodRoutine.variant = "storageSpread";
  } else if (normalizedState === "hidden") {
    boy.currentAction = "kneelAtFire";
    firePit.lit = false;
    firePit.fuel = 0;
    firePit.warmth = 0;
    state.foodRoutine.visible = false;
    state.foodRoutine.active = false;
  }
}

function applyRestSleepWakeReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  const bedState =
    normalizedState === "closeup" ||
    normalizedState === "debug" ||
    normalizedState === "watering" ||
    normalizedState === "complete";
  const anchor = configureRestSleepWakeReviewAnchor(state, { bedState });

  boy.goal = "rest";
  boy.currentAction = "sitRestSpot";
  boy.actionTimer = 0.9;
  boy.minActionTime = 0;
  boy.position = { x: anchor.x - 0.04, y: 0.20, z: anchor.z + 0.04 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = anchor.yaw;
  boy.targetId = BED_BUILD_SITE_ID;
  boy.carrying = null;
  boy.carriedItem = null;
  boy.carriedObject = null;
  boy.focus = {
    kind: "rest",
    position: { x: anchor.x, y: 0.58, z: anchor.z },
    strength: 0.62
  };
  boy.builder.actionState = "rest";
  boy.builder.project = BUILDABLE_IDS.bed;
  boy.builder.progress = bedState ? 1 : 0.36;

  if (normalizedState === "active") {
    boy.goal = "useBed";
    boy.currentAction = "settleIntoHammock";
    boy.actionTimer = 0.54;
  } else if (normalizedState === "variant") {
    boy.goal = "sleep";
    boy.currentAction = "lieDown";
    boy.actionTimer = 0.74;
    boy.position = { x: anchor.x, y: 0.20, z: anchor.z };
  } else if (normalizedState === "closeup") {
    boy.goal = "sleep";
    boy.currentAction = "sleepLoop";
    boy.actionTimer = 2.4;
    boy.position = { x: anchor.x, y: 0.20, z: anchor.z };
  } else if (normalizedState === "debug") {
    boy.goal = "useBed";
    boy.currentAction = "settleIntoBed";
    boy.actionTimer = 0.58;
  } else if (normalizedState === "watering") {
    boy.goal = "wake";
    boy.currentAction = "wakeStretch";
    boy.actionTimer = 0.86;
  } else if (normalizedState === "complete") {
    boy.goal = "rest";
    boy.currentAction = "standUpFromRest";
    boy.actionTimer = 0.78;
    boy.position = { x: anchor.x - 0.10, y: 0.20, z: anchor.z + 0.12 };
  } else if (normalizedState === "hidden") {
    boy.currentAction = "sitRestSpot";
    state.restShelter.visible = false;
    state.restShelter.active = false;
    state.restShelter.usable = false;
    state.lifeLoop.canSleep = false;
    state.lifeLoop.sleepAvailable = false;
  }
}

function configureRestSleepWakeReviewAnchor(state, { bedState }) {
  const anchor = { x: -5.76, y: 0.18, z: -2.70, yaw: 2.84 };
  state.time.day = bedState ? 22 : 5;
  state.time.timeOfDay = 0.54;
  state.time.phase = "day";

  const bed = state.buildables[BUILDABLE_IDS.bed] || {};
  bed.visible = true;
  bed.position = { x: anchor.x, y: anchor.y, z: anchor.z };
  bed.yaw = anchor.yaw;
  bed.progress = bedState ? 1 : 0.08;
  bed.stageProgress = bedState ? 1 : 0.08;
  bed.completedStageCount = bedState ? Math.max(1, (bed.stages || []).length) : 0;
  bed.currentStageIndex = bedState ? Math.max(0, (bed.stages || []).length - 1) : 0;
  bed.status = bedState ? "complete" : "planned";
  bed.completedAt = bedState ? "review-rest-sleep-wake" : null;
  state.buildables[BUILDABLE_IDS.bed] = bed;
  state.objects[BED_BUILD_SITE_ID] = { ...bed };

  const shelter = state.buildables[BUILDABLE_IDS.shelter] || {};
  shelter.visible = true;
  shelter.position = { x: anchor.x - 0.28, y: anchor.y, z: anchor.z - 0.12 };
  shelter.yaw = anchor.yaw;
  shelter.progress = Math.max(0.42, Number(shelter.progress || 0));
  shelter.stageProgress = Math.max(0.42, Number(shelter.stageProgress || 0));
  shelter.status = "building";
  state.buildables[BUILDABLE_IDS.shelter] = shelter;
  state.objects[BUILD_SITE_ID] = { ...shelter };

  state.restShelter.visible = true;
  state.restShelter.active = true;
  state.restShelter.usable = true;
  state.restShelter.stage = bedState ? "bedUpgrade" : "hammock";
  state.restShelter.variant = bedState ? "cozyBed" : "restSling";
  state.lifeLoop.canSleep = true;
  state.lifeLoop.sleepAvailable = true;
  state.lifeLoop.restAvailable = true;
  state.lifeLoop.activeRestId = "restShelter";
  return anchor;
}

function applyBuildTieCraftRepairReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  const buildSite = configureBuildTieCraftRepairReviewBuildSite(state, {
    progress: normalizedState === "complete"
      ? 1
      : normalizedState === "repair"
        ? 0.86
        : normalizedState === "inspection"
          ? 0.68
          : normalizedState === "active"
            ? 0.52
            : normalizedState === "debug"
              ? 0.34
              : normalizedState === "variant"
                ? 0.24
                : 0.18
  });
  const workbench = configureBuildTieCraftRepairReviewWorkbench(state);

  boy.goal = "buildProject";
  boy.currentAction = "hammerStrike";
  boy.actionTimer = 0.68;
  boy.minActionTime = 0;
  boy.position = { x: -2.92, y: 0.20, z: -1.34 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = -1.58;
  boy.targetId = BUILD_SITE_ID;
  boy.carriedItem = null;
  boy.carriedObject = null;
  boy.carrying = null;
  boy.toolInventory.hasStoneTool = true;
  boy.toolInventory.heldTool = STONE_TOOL_ITEM_ID;
  boy.toolInventory.inspectingTool = null;
  boy.builder.actionState = "construct";
  boy.builder.project = BUILDABLE_IDS.shelter;
  boy.builder.progress = buildSite.progress;
  boy.focus = {
    kind: "builder",
    position: { x: buildSite.position.x, y: 0.84, z: buildSite.position.z },
    strength: 0.84
  };

  if (normalizedState === "active") {
    boy.currentAction = "tieRopeVines";
    boy.actionTimer = 0.74;
    boy.carriedObject = "ropeVines";
    boy.toolInventory.heldTool = null;
  } else if (normalizedState === "variant") {
    boy.currentAction = "placePlank";
    boy.actionTimer = 0.64;
    boy.carriedObject = "buildPlank";
    boy.toolInventory.heldTool = null;
  } else if (normalizedState === "debug") {
    boy.currentAction = "pushPostUpright";
    boy.actionTimer = 0.58;
    boy.toolInventory.heldTool = null;
  } else if (normalizedState === "closeup") {
    boy.goal = "craft";
    boy.currentAction = "craftAtWorkbench";
    boy.actionTimer = 0.82;
    boy.position = { x: -4.78, y: 0.20, z: -1.48 };
    boy.facing = -2.58;
    boy.targetId = WORKBENCH_ID;
    boy.toolInventory.heldTool = STONE_TOOL_ITEM_ID;
    boy.builder.project = BUILDABLE_IDS.workbench;
    boy.focus = {
      kind: "workbench",
      position: { x: workbench.position.x, y: 0.86, z: workbench.position.z },
      strength: 0.88
    };
  } else if (normalizedState === "inspection") {
    boy.goal = "inspectProgress";
    boy.currentAction = "inspectProgress";
    boy.actionTimer = 1.1;
    boy.toolInventory.heldTool = null;
  } else if (normalizedState === "repair") {
    boy.goal = "repairShelter";
    boy.currentAction = "repairShelter";
    boy.actionTimer = 0.78;
    boy.toolInventory.heldTool = STONE_TOOL_ITEM_ID;
  } else if (normalizedState === "complete") {
    state.time.day = 76;
    boy.goal = "reinforceShelter";
    boy.currentAction = "reinforceShelter";
    boy.actionTimer = 0.84;
    boy.toolInventory.heldTool = STONE_TOOL_ITEM_ID;
    state.restShelter.stage = "reinforcedShelter";
    state.restShelter.variant = "strongShelter";
    state.restShelter.visible = true;
    state.restShelter.active = true;
    state.restShelter.usable = true;
  } else if (normalizedState === "hidden") {
    boy.currentAction = "inspectProgress";
    boy.goal = "reviewHidden";
    boy.toolInventory.heldTool = null;
    boy.toolInventory.hasStoneTool = false;
    boy.carriedObject = null;
    if (state.objects[BUILD_SITE_ID]) state.objects[BUILD_SITE_ID].visible = false;
    if (state.objects[WORKBENCH_ID]) state.objects[WORKBENCH_ID].visible = false;
    state.campStorage.visible = false;
    state.toolRack.visible = false;
  }
}

function configureBuildTieCraftRepairReviewBuildSite(state, { progress }) {
  state.time.day = 18;
  state.time.timeOfDay = 0.52;
  state.time.phase = "day";

  const buildSite = {
    ...(state.buildables[BUILDABLE_IDS.shelter] || {}),
    ...(state.objects[BUILD_SITE_ID] || {})
  };
  buildSite.visible = true;
  buildSite.position = { x: -2.42, y: 0.20, z: -1.34 };
  buildSite.yaw = -0.34;
  buildSite.radius = 1.1;
  buildSite.progress = progress;
  buildSite.stageProgress = progress;
  buildSite.status = progress >= 0.999 ? "complete" : "building";
  buildSite.storedWood = Math.max(1, progress * 6);
  buildSite.requiredWood = 6;
  buildSite.requiredResources = { wood: 6 };
  state.buildables[BUILDABLE_IDS.shelter] = buildSite;
  state.objects[BUILD_SITE_ID] = { ...buildSite };
  return buildSite;
}

function configureBuildTieCraftRepairReviewWorkbench(state) {
  const workbench = {
    ...(state.buildables[BUILDABLE_IDS.workbench] || {}),
    ...(state.objects[WORKBENCH_ID] || {})
  };
  workbench.visible = true;
  workbench.position = { x: -5.05, y: 0.24, z: -1.66 };
  workbench.yaw = -0.18;
  workbench.stage = "complete";
  workbench.variant = "upgraded";
  workbench.usable = true;
  workbench.progress = 1;
  state.objects[WORKBENCH_ID] = workbench;
  state.buildables[BUILDABLE_IDS.workbench] = workbench;

  state.campStorage.visible = true;
  state.campStorage.woodCount = 5;
  state.campStorage.storedWood = 5;
  state.campStorage.stage = "hasWood";
  state.toolRack.visible = true;
  state.toolRack.stage = "hasStoneTool";
  state.toolRack.slots = [{ id: "stone-tool-slot", item: STONE_TOOL_ITEM_ID, occupied: true, index: 0 }];
  return workbench;
}

function applyCampStorageSittingReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  const workbench = configureCampStorageSittingReviewCamp(state);
  const storageFocus = { x: workbench.position.x - 0.72, y: 0.54, z: workbench.position.z - 0.05 };

  boy.goal = "storage";
  boy.currentAction = "sortMaterials";
  boy.actionTimer = 0.84;
  boy.minActionTime = 0;
  boy.position = { x: -4.72, y: 0.20, z: -1.54 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = -2.50;
  boy.targetId = null;
  boy.carriedItem = null;
  boy.carriedObject = "storageMaterial";
  boy.carrying = null;
  boy.toolInventory.heldTool = null;
  boy.toolInventory.inspectingTool = null;
  boy.focus = {
    kind: "storage",
    position: storageFocus,
    strength: 0.30
  };

  if (normalizedState === "watering") {
    boy.currentAction = "depositStorage";
    boy.actionTimer = 0.62;
    state.campStorage.woodCount = 6;
    state.campStorage.storedWood = 6;
    state.campStorage.stage = "hasWood";
  } else if (normalizedState === "variant") {
    boy.currentAction = "withdrawStorage";
    boy.actionTimer = 0.68;
    state.campStorage.woodCount = 5;
    state.campStorage.storedWood = 5;
    state.campStorage.stage = "hasWood";
  } else if (normalizedState === "debug") {
    boy.goal = "tidyCamp";
    boy.currentAction = "tidyCamp";
    boy.actionTimer = 1.05;
    boy.position = { x: -3.48, y: 0.20, z: -1.34 };
    boy.facing = -1.34;
    boy.carriedObject = null;
    boy.focus = {
      kind: "camp",
      position: { x: -2.80, y: 0.60, z: -1.12 },
      strength: 0.30
    };
  } else if (normalizedState === "closeup") {
    configureCampStorageSittingReviewFire(state);
    boy.goal = "reflection";
    boy.currentAction = "sitNearFire";
    boy.actionTimer = 1.4;
    boy.position = { x: -0.38, y: 0.20, z: 0.82 };
    boy.facing = 2.68;
    boy.targetId = FIRE_PIT_ID;
    boy.carriedObject = null;
    boy.focus = {
      kind: "fire",
      position: { x: 0.06, y: 0.58, z: 0.36 },
      strength: 0.74
    };
  } else if (normalizedState === "inspection") {
    boy.goal = "campLayout";
    boy.currentAction = "inspectCampLayout";
    boy.actionTimer = 1.0;
    boy.position = { x: -3.05, y: 0.20, z: -1.20 };
    boy.facing = -0.84;
    boy.carriedObject = null;
    boy.focus = {
      kind: "campLayout",
      position: { x: -2.30, y: 0.58, z: -1.00 },
      strength: 0.78
    };
  } else if (normalizedState === "complete") {
    const anchor = configureRestSleepWakeReviewAnchor(state, { bedState: true });
    boy.goal = "rest";
    boy.currentAction = "restInsideShelter";
    boy.actionTimer = 1.1;
    boy.position = { x: anchor.x - 0.08, y: 0.20, z: anchor.z + 0.10 };
    boy.facing = anchor.yaw;
    boy.targetId = BED_BUILD_SITE_ID;
    boy.carriedObject = null;
    boy.focus = {
      kind: "rest",
      position: { x: anchor.x, y: 0.58, z: anchor.z },
      strength: 0.62
    };
  } else if (normalizedState === "hidden") {
    boy.goal = "storage";
    boy.currentAction = "inspectCampLayout";
    boy.carriedObject = null;
    state.campStorage.visible = false;
    state.toolRack.visible = false;
    if (state.objects[WORKBENCH_ID]) state.objects[WORKBENCH_ID].visible = false;
    if (state.buildables[BUILDABLE_IDS.workbench]) state.buildables[BUILDABLE_IDS.workbench].visible = false;
    state.restShelter.visible = false;
    state.restShelter.active = false;
  }
}

function configureCampStorageSittingReviewCamp(state) {
  state.time.day = 8;
  state.time.timeOfDay = 0.56;
  state.time.phase = "day";
  const workbench = configureBuildTieCraftRepairReviewWorkbench(state);
  workbench.position = { x: -5.05, y: 0.24, z: -1.66 };
  workbench.yaw = -0.18;
  state.objects[WORKBENCH_ID] = workbench;
  state.buildables[BUILDABLE_IDS.workbench] = workbench;
  state.campStorage.visible = true;
  state.campStorage.active = true;
  state.campStorage.woodCount = 5;
  state.campStorage.storedWood = 5;
  state.campStorage.stage = "hasWood";
  state.toolRack.visible = true;
  state.toolRack.stage = "hasStoneTool";
  state.toolRack.slots = [{ id: "stone-tool-slot", item: STONE_TOOL_ITEM_ID, occupied: true, index: 0 }];
  setReviewCampLayoutMarked(state, "cleared");
  state.restShelter.visible = true;
  state.restShelter.active = false;
  state.restShelter.usable = true;
  state.restShelter.stage = "hammock";
  state.restShelter.variant = "restSling";
  return workbench;
}

function configureCampStorageSittingReviewFire(state) {
  const firePit = state.objects[FIRE_PIT_ID] || {};
  firePit.visible = true;
  firePit.lit = true;
  firePit.fuel = Math.max(70, Number(firePit.fuel || 0));
  firePit.warmth = 1;
  state.objects[FIRE_PIT_ID] = firePit;
  if (state.environment && state.environment.light) state.environment.light.fireIntensity = 0.78;
}

function applyPathClearingGroundWorkReviewState(state, normalizedState) {
  const boy = state.bubbleBoy;
  configurePathClearingGroundWorkReviewLayout(state, normalizedState === "watering" ? "lit" : "cleared");
  const pathFocus = { x: -2.75, y: 0.52, z: -1.05 };

  boy.goal = "campLayout";
  boy.currentAction = "rakePath";
  boy.actionTimer = 0.82;
  boy.minActionTime = 0;
  boy.position = { x: -2.74, y: 0.20, z: -1.04 };
  boy.velocity = { x: 0, y: 0, z: 0 };
  boy.facing = -1.08;
  boy.targetId = null;
  boy.carriedItem = null;
  boy.carriedObject = "pathRake";
  boy.carrying = null;
  boy.toolInventory.heldTool = "pathRake";
  boy.toolInventory.inspectingTool = null;
  boy.focus = {
    kind: "campLayout",
    position: pathFocus,
    strength: 0.30
  };

  if (normalizedState === "debug") {
    boy.currentAction = "clearPath";
    boy.actionTimer = 0.76;
    boy.position = { x: -2.36, y: 0.20, z: -0.96 };
    boy.facing = -1.22;
    boy.focus.position = { x: -2.10, y: 0.46, z: -0.82 };
  } else if (normalizedState === "variant") {
    boy.currentAction = "sweepLeaves";
    boy.actionTimer = 0.88;
    boy.position = { x: -2.60, y: 0.20, z: -1.02 };
    boy.facing = -0.92;
    boy.carriedObject = "pathBroom";
    boy.toolInventory.heldTool = "pathBroom";
    boy.focus.position = { x: -2.20, y: 0.48, z: -0.82 };
  } else if (normalizedState === "watering") {
    boy.currentAction = "placeBoundaryStone";
    boy.actionTimer = 0.72;
    boy.position = { x: 0.72, y: 0.20, z: 0.30 };
    boy.facing = 2.54;
    boy.carriedObject = BOUNDARY_STONE_ITEM_ID;
    boy.toolInventory.heldTool = null;
    boy.focus.position = { x: 0.62, y: 0.44, z: 0.28 };
    boy.focus.strength = 0.30;
  } else if (normalizedState === "closeup") {
    boy.currentAction = "kneelMarkZone";
    boy.actionTimer = 0.96;
    boy.position = { x: -2.82, y: 0.20, z: -1.10 };
    boy.facing = -1.28;
    boy.carriedObject = null;
    boy.toolInventory.heldTool = null;
    boy.focus.position = { x: -2.75, y: 0.48, z: -1.05 };
    boy.focus.strength = 0.30;
  } else if (normalizedState === "inspection") {
    boy.goal = "walkInspectRoute";
    boy.currentAction = "walkInspectRoute";
    boy.actionTimer = 0.64;
    boy.position = { x: -2.20, y: 0.20, z: -0.88 };
    boy.velocity = { x: 0.18, y: 0, z: -0.08 };
    boy.facing = -1.14;
    boy.carriedObject = null;
    boy.toolInventory.heldTool = null;
    boy.focus.position = { x: -1.48, y: 0.55, z: -0.58 };
    boy.focus.strength = 0.70;
  } else if (normalizedState === "hidden") {
    boy.goal = "reviewHidden";
    boy.currentAction = "idle";
    boy.carriedObject = null;
    boy.toolInventory.heldTool = null;
    setReviewCampLayoutHidden(state);
  }
}

function configurePathClearingGroundWorkReviewLayout(state, pathStage) {
  state.time.day = 18;
  state.time.timeOfDay = 0.54;
  state.time.phase = "day";
  setReviewCampLayoutMarked(state, pathStage);
  state.campLayout.action = "rakePath";
  state.campLayout.intent = "pathClearing";
  state.campLayout.usable = true;
  state.campLayout.paths = state.campLayout.paths.map((path, index) => ({
    ...path,
    active: index === 0,
    stage: pathStage,
    visible: true
  }));
  state.campLayout.zones = state.campLayout.zones.map((zone) => ({
    ...zone,
    stage: "marked",
    markerPlaced: true,
    visible: true,
    boundaryStoneCount: zone.boundaryStoneCount || 3
  }));
  state.campStorage.visible = true;
  state.campStorage.active = false;
  state.toolRack.visible = true;
  state.toolRack.stage = "hasStoneTool";
  state.toolRack.slots = [{ id: "stone-tool-slot", item: STONE_TOOL_ITEM_ID, occupied: true, index: 0 }];
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

function applyFishTrapRoutineReviewBaseState(state) {
  state.time.day = 56;
  state.bubbleBoy.goal = "fishTrapRoutine";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -12.22, y: 0.20, z: 30.92 };
  state.bubbleBoy.facing = 1.08;
  state.fishTrapRoutine = fishTrapRoutineReviewState({
    trapState: "set",
    stage: "set",
    variant: "setLine",
    trapCount: 1,
    buoyCount: 1,
    lineCount: 1,
    stateCueCount: 1,
    active: false
  });
}

function applyFishTrapRoutineReviewHiddenState(state) {
  state.time.day = 55;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -12.22, y: 0.20, z: 30.92 };
  state.bubbleBoy.facing = 1.08;
  state.fishTrapRoutine = fishTrapRoutineReviewState({
    visible: false,
    trapState: "unset",
    stage: "unset",
    variant: "unsetMarker",
    trapCount: 0,
    buoyCount: 0,
    lineCount: 0,
    stateCueCount: 0,
    dryingRackCount: 0,
    catchDisplayCount: 0,
    fishCount: 0,
    crabCount: 0,
    dryingFishCount: 0,
    active: false
  });
}

function applyFishTrapRoutineReviewSetState(state) {
  state.time.day = 56;
  state.bubbleBoy.goal = "fishTrapRoutine";
  state.bubbleBoy.currentAction = "setFishTrap";
  state.bubbleBoy.position = { x: -12.14, y: 0.20, z: 30.86 };
  state.bubbleBoy.facing = 1.12;
  state.fishTrapRoutine = fishTrapRoutineReviewState({
    trapState: "set",
    stage: "set",
    variant: "setLine",
    trapCount: 1,
    buoyCount: 1,
    lineCount: 1,
    stateCueCount: 1,
    active: true
  });
}

function applyFishTrapRoutineReviewReadyState(state) {
  state.time.day = 58;
  state.bubbleBoy.goal = "fishTrapRoutine";
  state.bubbleBoy.currentAction = "checkFishTrap";
  state.bubbleBoy.position = { x: -12.08, y: 0.20, z: 30.92 };
  state.bubbleBoy.facing = 1.16;
  state.fishTrapRoutine = fishTrapRoutineReviewState({
    trapState: "readyToCheck",
    stage: "readyToCheck",
    variant: "readyCheck",
    trapCount: 1,
    buoyCount: 1,
    lineCount: 1,
    stateCueCount: 1,
    fishCount: 2,
    crabCount: 1,
    active: true
  });
}

function applyFishTrapRoutineReviewDryingState(state) {
  state.time.day = 60;
  state.bubbleBoy.goal = "fishTrapRoutine";
  state.bubbleBoy.currentAction = "dryTrapCatch";
  state.bubbleBoy.position = { x: -10.66, y: 0.20, z: 29.48 };
  state.bubbleBoy.facing = 1.22;
  state.fishTrapRoutine = fishTrapRoutineReviewState({
    trapState: "drying",
    stage: "drying",
    variant: "dryingRack",
    trapCount: 0,
    buoyCount: 0,
    lineCount: 0,
    stateCueCount: 1,
    dryingRackCount: 1,
    catchDisplayCount: 1,
    fishCount: 2,
    crabCount: 1,
    dryingFishCount: 4,
    active: true
  });
}

function fishTrapRoutineReviewState({
  visible = true,
  trapState = "set",
  stage = trapState,
  variant = "setLine",
  trapCount = 1,
  buoyCount = 1,
  lineCount = 1,
  stateCueCount = 1,
  dryingRackCount = 0,
  catchDisplayCount = 0,
  fishCount = 0,
  crabCount = 0,
  dryingFishCount = 0,
  active = false
} = {}) {
  return {
    id: FISH_TRAP_ROUTINE_ID,
    family: FISH_TRAP_ROUTINE_ID,
    visible,
    autoVisible: false,
    trapState,
    stage,
    variant,
    active,
    usable: false,
    anchor: "shoreline-trap",
    anchorPosition: { x: -13.7, y: 0.18, z: 32.6 },
    buoyPosition: { x: -15.05, y: -0.12, z: 33.8 },
    dryingRackPosition: { x: -11.52, y: 0.18, z: 30.28 },
    trapVisible: visible && trapCount > 0,
    buoyVisible: visible && buoyCount > 0,
    lineVisible: visible && lineCount > 0,
    stateCuesVisible: visible && stateCueCount > 0,
    dryingRackVisible: visible && dryingRackCount > 0,
    catchDisplayVisible: visible && catchDisplayCount > 0,
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
    source: "procedural",
    integrationNote: "visual-only fish trap routine placeholders; no catch timers, randomness, storage, or food economy"
  };
}

function applyToyPlaySetReviewBaseState(state) {
  state.time.day = 61;
  state.bubbleBoy.goal = "toyPlaySet";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -2.72, y: 0.20, z: -0.96 };
  state.bubbleBoy.facing = -2.62;
  state.bubbleBoy.builder.disabled = true;
  state.bubbleBoy.builder.active = false;
  completeToyBlocksBuildableForReview(state);
  state.toyPlaySet = toyPlaySetReviewState({
    stage: "collection",
    variant: "collectionSlots",
    collectionSlotCount: 5,
    blockCount: 4,
    spinningTopCount: 1,
    playMatCount: 1,
    active: false
  });
}

function applyToyPlaySetReviewHiddenState(state) {
  state.time.day = 60;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -2.72, y: 0.20, z: -0.96 };
  state.bubbleBoy.facing = -2.62;
  state.bubbleBoy.builder.disabled = true;
  state.bubbleBoy.builder.active = false;
  const toyBuildable = state.buildables[BUILDABLE_IDS.toyBlocks] || state.objects[TOY_BUILD_SITE_ID] || {};
  toyBuildable.progress = 0;
  toyBuildable.status = "planned";
  state.buildables[BUILDABLE_IDS.toyBlocks] = toyBuildable;
  state.objects[TOY_BUILD_SITE_ID] = toyBuildable;
  state.toyPlaySet = toyPlaySetReviewState({
    visible: false,
    stage: "hidden",
    variant: "activeMain",
    collectionSlotCount: 0,
    blockCount: 0,
    ballCount: 0,
    kiteCount: 0,
    stringCount: 0,
    handleCount: 0,
    spinningTopCount: 0,
    playMatCount: 0,
    active: false
  });
}

function applyToyPlaySetReviewActiveState(state) {
  state.time.day = 62;
  state.bubbleBoy.goal = "toyPlaySet";
  state.bubbleBoy.currentAction = "playToy";
  state.bubbleBoy.position = { x: -2.70, y: 0.20, z: -0.98 };
  state.bubbleBoy.facing = -2.72;
  completeToyBlocksBuildableForReview(state);
  state.toyPlaySet = toyPlaySetReviewState({
    stage: "active",
    variant: "activeMain",
    collectionSlotCount: 5,
    blockCount: 6,
    ballCount: 1,
    kiteCount: 1,
    stringCount: 1,
    handleCount: 1,
    spinningTopCount: 1,
    playMatCount: 1,
    active: true
  });
}

function applyToyPlaySetReviewMatLayoutState(state) {
  state.time.day = 64;
  state.bubbleBoy.goal = "toyPlaySet";
  state.bubbleBoy.currentAction = "arrangeToySet";
  state.bubbleBoy.position = { x: -2.68, y: 0.20, z: -1.02 };
  state.bubbleBoy.facing = -2.72;
  completeToyBlocksBuildableForReview(state);
  state.toyPlaySet = toyPlaySetReviewState({
    stage: "matLayout",
    variant: "playMatLayout",
    collectionSlotCount: 5,
    blockCount: 8,
    ballCount: 1,
    kiteCount: 1,
    stringCount: 1,
    handleCount: 1,
    spinningTopCount: 1,
    playMatCount: 1,
    active: true
  });
}

function applyToyPlaySetReviewCloseupState(state) {
  state.time.day = 63;
  state.bubbleBoy.goal = "toyPlaySet";
  state.bubbleBoy.currentAction = "inspectKite";
  state.bubbleBoy.position = { x: -2.72, y: 0.20, z: -1.00 };
  state.bubbleBoy.facing = -2.72;
  completeToyBlocksBuildableForReview(state);
  state.toyPlaySet = toyPlaySetReviewState({
    stage: "kiteDay",
    variant: "kiteBallTop",
    collectionSlotCount: 5,
    blockCount: 5,
    ballCount: 1,
    kiteCount: 1,
    stringCount: 1,
    handleCount: 1,
    spinningTopCount: 1,
    playMatCount: 1,
    active: true
  });
}

function toyPlaySetReviewState({
  visible = true,
  stage = "active",
  variant = "activeMain",
  collectionSlotCount = 5,
  blockCount = 6,
  ballCount = 1,
  kiteCount = 1,
  stringCount = 1,
  handleCount = 1,
  spinningTopCount = 1,
  playMatCount = 1,
  active = false
} = {}) {
  return {
    id: TOY_PLAY_SET_ID,
    family: TOY_PLAY_SET_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "toy-buildable-sidecar",
    anchorPosition: { x: -4.18, y: 0.18, z: -2.22 },
    kiteAnchorPosition: { x: -4.72, y: 0.18, z: -2.86 },
    collectionSlotsVisible: visible && collectionSlotCount > 0,
    toyBlocksVisible: visible && blockCount > 0,
    ballVisible: visible && ballCount > 0,
    kiteVisible: visible && kiteCount > 0,
    kiteStringVisible: visible && stringCount > 0,
    kiteHandleVisible: visible && handleCount > 0,
    spinningTopVisible: visible && spinningTopCount > 0,
    playMatVisible: visible && playMatCount > 0,
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
    source: "procedural",
    integrationNote:
      "visual-only toy play set placeholders; no play cooldowns, mood effects, toy crafting, kite physics, ball physics, or interactions"
  };
}

function completeToyBlocksBuildableForReview(state) {
  const toyBuildable = state.buildables[BUILDABLE_IDS.toyBlocks] || state.objects[TOY_BUILD_SITE_ID] || {};
  const stageCount = Array.isArray(toyBuildable.stages) ? toyBuildable.stages.length : 3;
  toyBuildable.progress = 1;
  toyBuildable.status = "complete";
  toyBuildable.visible = true;
  toyBuildable.completedStageCount = stageCount;
  toyBuildable.currentStageIndex = Math.max(0, stageCount - 1);
  toyBuildable.storedWood = Number(toyBuildable.requiredWood || 2.2);
  state.buildables[BUILDABLE_IDS.toyBlocks] = toyBuildable;
  state.objects[TOY_BUILD_SITE_ID] = toyBuildable;
}

function applyMusicArtDecorReviewBaseState(state) {
  state.time.day = 66;
  state.bubbleBoy.goal = "musicArtDecor";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: 0.92, y: 0.20, z: 0.62 };
  state.bubbleBoy.facing = -2.86;
  state.musicArtDecor = musicArtDecorReviewState({
    stage: "chime",
    variant: "decorCluster",
    shellChimeCount: 1,
    paintedStoneCount: 2,
    hangingDecorationCount: 1,
    active: false
  });
}

function applyMusicArtDecorReviewHiddenState(state) {
  state.time.day = 65;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: 0.92, y: 0.20, z: 0.62 };
  state.bubbleBoy.facing = -2.86;
  state.musicArtDecor = musicArtDecorReviewState({
    visible: false,
    stage: "hidden",
    variant: "decorCluster",
    shellChimeCount: 0,
    paintedStoneCount: 0,
    drumCount: 0,
    fluteCount: 0,
    hangingDecorationCount: 0,
    artDisplaySlotCount: 0,
    performanceMarkerCount: 0,
    noteMarkerCount: 0,
    active: false
  });
}

function applyMusicArtDecorReviewActiveState(state) {
  state.time.day = 68;
  state.bubbleBoy.goal = "musicArtDecor";
  state.bubbleBoy.currentAction = "arrangeDecor";
  state.bubbleBoy.position = { x: 0.92, y: 0.20, z: 0.62 };
  state.bubbleBoy.facing = -2.86;
  state.musicArtDecor = musicArtDecorReviewState({
    stage: "instruments",
    variant: "instrumentDisplay",
    shellChimeCount: 1,
    paintedStoneCount: 4,
    drumCount: 1,
    fluteCount: 1,
    hangingDecorationCount: 1,
    artDisplaySlotCount: 1,
    performanceMarkerCount: 0,
    noteMarkerCount: 2,
    active: true
  });
}

function applyMusicArtDecorReviewCloseupState(state) {
  state.time.day = 67;
  state.bubbleBoy.goal = "musicArtDecor";
  state.bubbleBoy.currentAction = "inspectShellChime";
  state.bubbleBoy.position = { x: 0.92, y: 0.20, z: 0.62 };
  state.bubbleBoy.facing = -2.86;
  state.musicArtDecor = musicArtDecorReviewState({
    stage: "artDisplay",
    variant: "artNook",
    shellChimeCount: 1,
    paintedStoneCount: 5,
    drumCount: 0,
    fluteCount: 1,
    hangingDecorationCount: 2,
    artDisplaySlotCount: 1,
    performanceMarkerCount: 0,
    noteMarkerCount: 0,
    active: true
  });
}

function applyMusicArtDecorReviewDuskState(state) {
  state.time.day = 69;
  state.time.timeOfDay = 0.75;
  state.time.phase = "twilight";
  state.environment.dayFactor = 0.18;
  state.environment.nightFactor = 0.50;
  state.environment.light.timeOfDay = 0.75;
  state.environment.light.sourceLevel = 0.42;
  state.environment.light.sunIntensity = 0.24;
  state.environment.light.moonIntensity = 0.18;
  state.environment.light.fireIntensity = 0.62;
  state.environment.light.dominantSource = "sun";
  state.environment.light.sky = [0.16, 0.22, 0.38];
  state.environment.light.fogColor = [0.20, 0.23, 0.34];
  state.environment.light.fogDensity = 0.035;
  state.bubbleBoy.goal = "musicArtDecor";
  state.bubbleBoy.currentAction = "duskPerformance";
  state.bubbleBoy.position = { x: 0.92, y: 0.20, z: 0.62 };
  state.bubbleBoy.facing = -2.86;
  state.musicArtDecor = musicArtDecorReviewState({
    stage: "duskPerformance",
    variant: "duskPerformance",
    shellChimeCount: 1,
    paintedStoneCount: 5,
    drumCount: 1,
    fluteCount: 1,
    hangingDecorationCount: 2,
    artDisplaySlotCount: 1,
    performanceMarkerCount: 1,
    noteMarkerCount: 5,
    active: true
  });
}

function musicArtDecorReviewState({
  visible = true,
  stage = "decoratedNook",
  variant = "decorCluster",
  shellChimeCount = 1,
  paintedStoneCount = 5,
  drumCount = 1,
  fluteCount = 1,
  hangingDecorationCount = 2,
  artDisplaySlotCount = 1,
  performanceMarkerCount = 1,
  noteMarkerCount = 3,
  active = false
} = {}) {
  return {
    id: MUSIC_ART_DECOR_ID,
    family: MUSIC_ART_DECOR_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "camp-performance-nook",
    anchorPosition: { x: -1.42, y: 0.18, z: -0.92 },
    hangingAnchorPosition: { x: -1.86, y: 0.18, z: -1.30 },
    performanceAnchorPosition: { x: -1.12, y: 0.18, z: -0.54 },
    shellChimeVisible: visible && shellChimeCount > 0,
    paintedStonesVisible: visible && paintedStoneCount > 0,
    drumVisible: visible && drumCount > 0,
    fluteVisible: visible && fluteCount > 0,
    hangingDecorationVisible: visible && hangingDecorationCount > 0,
    artDisplaySlotVisible: visible && artDisplaySlotCount > 0,
    performanceMarkerVisible: visible && performanceMarkerCount > 0,
    noteMarkersVisible: visible && noteMarkerCount > 0,
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
    source: "procedural",
    integrationNote:
      "visual-only music/art decor placeholders; no audio-reactive systems, rhythm gameplay, sound engine, scheduling, mood, or performance mechanics"
  };
}

function applyAnimalFamiliarVisitorReviewBaseState(state) {
  state.time.day = 71;
  state.bubbleBoy.goal = "animalFamiliarVisitor";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -9.58, y: 0.20, z: 29.76 };
  state.bubbleBoy.facing = 0.72;
  state.animalFamiliarVisitor = animalFamiliarVisitorReviewState({
    stage: "observe",
    variant: "groundVisitor",
    animalCount: 1,
    observeRingCount: 1,
    approachMarkerCount: 2,
    active: false
  });
}

function applyAnimalFamiliarVisitorReviewHiddenState(state) {
  state.time.day = 70;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -9.58, y: 0.20, z: 29.76 };
  state.bubbleBoy.facing = 0.72;
  state.animalFamiliarVisitor = animalFamiliarVisitorReviewState({
    visible: false,
    stage: "hidden",
    variant: "groundVisitor",
    animalCount: 0,
    birdVisitorCount: 0,
    fishVisitorCount: 0,
    foodCrumbCount: 0,
    observeRingCount: 0,
    approachMarkerCount: 0,
    active: false
  });
}

function applyAnimalFamiliarVisitorReviewActiveState(state) {
  state.time.day = 72;
  state.bubbleBoy.goal = "animalFamiliarVisitor";
  state.bubbleBoy.currentAction = "observeAnimalVisitor";
  state.bubbleBoy.position = { x: -9.64, y: 0.20, z: 29.84 };
  state.bubbleBoy.facing = 0.76;
  state.animalFamiliarVisitor = animalFamiliarVisitorReviewState({
    stage: "approach",
    variant: "groundVisitor",
    animalCount: 1,
    foodCrumbCount: 1,
    observeRingCount: 1,
    approachMarkerCount: 3,
    active: true
  });
}

function applyAnimalFamiliarVisitorReviewObserveState(state) {
  state.time.day = 74;
  state.bubbleBoy.goal = "animalFamiliarVisitor";
  state.bubbleBoy.currentAction = "watchBirdVisitor";
  state.bubbleBoy.position = { x: -9.72, y: 0.20, z: 29.72 };
  state.bubbleBoy.facing = 0.72;
  state.animalFamiliarVisitor = animalFamiliarVisitorReviewState({
    stage: "birdVisit",
    variant: "birdVisitor",
    animalCount: 1,
    birdVisitorCount: 2,
    foodCrumbCount: 2,
    observeRingCount: 1,
    approachMarkerCount: 3,
    active: true
  });
}

function applyAnimalFamiliarVisitorReviewFeedState(state) {
  state.time.day = 73;
  state.bubbleBoy.goal = "animalFamiliarVisitor";
  state.bubbleBoy.currentAction = "feedAnimalVisitor";
  state.bubbleBoy.position = { x: -9.60, y: 0.20, z: 29.82 };
  state.bubbleBoy.facing = 0.78;
  state.animalFamiliarVisitor = animalFamiliarVisitorReviewState({
    stage: "feedReady",
    variant: "feedStaging",
    animalCount: 1,
    foodCrumbCount: 5,
    observeRingCount: 1,
    approachMarkerCount: 4,
    active: true
  });
}

function animalFamiliarVisitorReviewState({
  visible = true,
  stage = "observe",
  variant = "groundVisitor",
  animalCount = 1,
  birdVisitorCount = 0,
  fishVisitorCount = 0,
  foodCrumbCount = 0,
  observeRingCount = 1,
  approachMarkerCount = 2,
  active = false
} = {}) {
  return {
    id: ANIMAL_FAMILIAR_VISITOR_ID,
    family: ANIMAL_FAMILIAR_VISITOR_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "shore-visitor-safe-margin",
    anchorPosition: { x: -10.95, y: 0.18, z: 30.86 },
    airAnchorPosition: { x: -10.36, y: 0.58, z: 30.38 },
    waterAnchorPosition: { x: -13.18, y: -0.08, z: 32.12 },
    approachAnchorPosition: { x: -10.18, y: 0.18, z: 29.92 },
    animalVisible: visible && animalCount > 0,
    birdVisitorVisible: visible && birdVisitorCount > 0,
    fishVisitorVisible: visible && fishVisitorCount > 0,
    foodCrumbsVisible: visible && foodCrumbCount > 0,
    observeRingVisible: visible && observeRingCount > 0,
    approachMarkersVisible: visible && approachMarkerCount > 0,
    animalCount,
    birdVisitorCount,
    fishVisitorCount,
    foodCrumbCount,
    observeRingCount,
    approachMarkerCount,
    observeRadius: 2.55,
    approachDistance: 1.65,
    collisionEnabled: false,
    blocksMovement: false,
    affectsCameraFollow: false,
    statePlaceholders: ["hidden", "observe", "approach", "feedReady", "birdVisit", "fishVisit"],
    source: "procedural",
    nonblockingNote:
      "visual-only animal visitor placeholders; nonblocking meshes, no colliders, no pathing claims, and no camera-follow changes",
    integrationNote:
      "no animal AI, feeding mechanics, familiarity scoring, flocking, chasing, collision behavior, or social interaction logic"
  };
}

function applyNightComfortLightsReviewBaseState(state) {
  state.time.day = 81;
  state.time.timeOfDay = 0.62;
  state.time.phase = "dusk";
  state.bubbleBoy.goal = "nightComfortLights";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -1.04, y: 0.20, z: -0.18 };
  state.bubbleBoy.facing = -2.72;
  state.nightComfortLights = nightComfortLightsReviewState({
    stage: "inactive",
    variant: "inactive",
    lanternPostCount: 2,
    litPathAnchorCount: 2,
    active: false
  });
}

function applyNightComfortLightsReviewHiddenState(state) {
  state.time.day = 80;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -1.04, y: 0.20, z: -0.18 };
  state.bubbleBoy.facing = -2.72;
  state.nightComfortLights = nightComfortLightsReviewState({
    visible: false,
    stage: "hidden",
    variant: "inactive",
    lanternPostCount: 0,
    litPathAnchorCount: 0,
    glowingShellCount: 0,
    fireflyCount: 0,
    sitAnchorCount: 0,
    active: false
  });
}

function applyNightComfortLightsReviewDuskState(state) {
  state.time.day = 82;
  state.time.timeOfDay = 0.74;
  state.time.phase = "twilight";
  state.environment.dayFactor = 0.20;
  state.environment.nightFactor = 0.44;
  state.environment.light.timeOfDay = 0.74;
  state.environment.light.sourceLevel = 0.46;
  state.environment.light.sunIntensity = 0.28;
  state.environment.light.moonIntensity = 0.18;
  state.environment.light.fireIntensity = 0.54;
  state.environment.light.sky = [0.16, 0.22, 0.38];
  state.environment.light.fogColor = [0.20, 0.24, 0.34];
  state.environment.light.fogDensity = 0.034;
  state.bubbleBoy.goal = "nightComfortLights";
  state.bubbleBoy.currentAction = "inspectNightLights";
  state.bubbleBoy.position = { x: -1.04, y: 0.20, z: -0.18 };
  state.bubbleBoy.facing = -2.72;
  state.nightComfortLights = nightComfortLightsReviewState({
    stage: "duskLit",
    variant: "duskLit",
    lanternPostCount: 3,
    litPathAnchorCount: 4,
    glowingShellCount: 3,
    fireflyCount: 0,
    sitAnchorCount: 1,
    active: true
  });
}

function applyNightComfortLightsReviewCloseupState(state) {
  state.time.day = 83;
  state.time.timeOfDay = 0.82;
  state.time.phase = "night";
  state.environment.dayFactor = 0.04;
  state.environment.nightFactor = 0.82;
  state.environment.light.timeOfDay = 0.82;
  state.environment.light.sourceLevel = 0.30;
  state.environment.light.sunIntensity = 0.02;
  state.environment.light.moonIntensity = 0.36;
  state.environment.light.fireIntensity = 0.64;
  state.environment.light.sky = [0.035, 0.055, 0.14];
  state.environment.light.fogColor = [0.06, 0.08, 0.15];
  state.environment.light.fogDensity = 0.060;
  state.bubbleBoy.goal = "nightComfortLights";
  state.bubbleBoy.currentAction = "inspectGlowingShells";
  state.bubbleBoy.position = { x: -1.00, y: 0.20, z: -0.12 };
  state.bubbleBoy.facing = -2.72;
  state.nightComfortLights = nightComfortLightsReviewState({
    stage: "nightLit",
    variant: "nightLit",
    lanternPostCount: 4,
    litPathAnchorCount: 5,
    glowingShellCount: 8,
    fireflyCount: 4,
    sitAnchorCount: 1,
    active: true
  });
}

function applyNightComfortLightsReviewFireflyState(state) {
  state.time.day = 84;
  state.time.timeOfDay = 0.86;
  state.time.phase = "night";
  state.environment.dayFactor = 0.02;
  state.environment.nightFactor = 0.88;
  state.environment.light.timeOfDay = 0.86;
  state.environment.light.sourceLevel = 0.28;
  state.environment.light.sunIntensity = 0.00;
  state.environment.light.moonIntensity = 0.42;
  state.environment.light.fireIntensity = 0.52;
  state.environment.light.sky = [0.025, 0.045, 0.12];
  state.environment.light.fogColor = [0.045, 0.065, 0.13];
  state.environment.light.fogDensity = 0.058;
  state.bubbleBoy.goal = "nightComfortLights";
  state.bubbleBoy.currentAction = "watchFireflies";
  state.bubbleBoy.position = { x: -1.04, y: 0.20, z: -0.18 };
  state.bubbleBoy.facing = -2.72;
  state.nightComfortLights = nightComfortLightsReviewState({
    stage: "fireflyGlow",
    variant: "fireflyGlow",
    lanternPostCount: 4,
    litPathAnchorCount: 5,
    glowingShellCount: 8,
    fireflyCount: 12,
    sitAnchorCount: 1,
    active: true
  });
}

function nightComfortLightsReviewState({
  visible = true,
  stage = "nightLit",
  variant = "nightLit",
  lanternPostCount = 4,
  litPathAnchorCount = 5,
  glowingShellCount = 6,
  fireflyCount = 4,
  sitAnchorCount = 1,
  active = false
} = {}) {
  return {
    id: NIGHT_COMFORT_LIGHTS_ID,
    family: NIGHT_COMFORT_LIGHTS_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "camp-night-path",
    anchorPosition: { x: -2.80, y: 0.18, z: -1.74 },
    pathAnchorPosition: { x: -3.56, y: 0.18, z: -1.98 },
    shellAnchorPosition: { x: -2.02, y: 0.18, z: -1.28 },
    fireflyAnchorPosition: { x: -2.38, y: 0.18, z: -2.44 },
    sitAnchorPosition: { x: -1.18, y: 0.18, z: -0.64 },
    lanternPostsVisible: visible && lanternPostCount > 0,
    litPathAnchorsVisible: visible && litPathAnchorCount > 0,
    glowingShellsVisible: visible && glowingShellCount > 0,
    firefliesVisible: visible && fireflyCount > 0,
    sitAnchorVisible: visible && sitAnchorCount > 0,
    lanternPostCount,
    litPathAnchorCount,
    glowingShellCount,
    fireflyCount,
    sitAnchorCount,
    dynamicLightCount: 0,
    usesDynamicLights: false,
    maxFireflySprites: 12,
    statePlaceholders: ["hidden", "inactive", "duskLit", "nightLit", "fireflyGlow", "sitAtNight"],
    source: "procedural",
    lightPerformanceNote:
      "uses emissive materials and bounded deterministic sprite/mesh markers; no dynamic lights or unbounded emitters",
    integrationNote:
      "visual-only night comfort placeholders; no lantern fuel, lighting schedules, comfort mechanics, or firefly AI"
  };
}

function applyLookoutMapHorizonReviewBaseState(state) {
  state.time.day = 86;
  state.time.timeOfDay = 0.48;
  state.time.phase = "day";
  state.bubbleBoy.goal = "lookoutMapHorizon";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: 4.66, y: 0.20, z: 5.48 };
  state.bubbleBoy.facing = 0.58;
  state.lookoutMapHorizon = lookoutMapHorizonReviewState({
    stage: "inactive",
    variant: "inactive",
    lookoutPlatformCount: 1,
    stepCount: 2,
    useSlotCount: 1,
    active: false
  });
}

function applyLookoutMapHorizonReviewHiddenState(state) {
  state.time.day = 85;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: 4.66, y: 0.20, z: 5.48 };
  state.bubbleBoy.facing = 0.58;
  state.lookoutMapHorizon = lookoutMapHorizonReviewState({
    visible: false,
    stage: "hidden",
    variant: "inactive",
    lookoutPlatformCount: 0,
    stepCount: 0,
    mapBoardCount: 0,
    sketchMapCount: 0,
    horizonMarkerCount: 0,
    horizonHighlightCount: 0,
    keepsakeCount: 0,
    gatheringDetailCount: 0,
    useSlotCount: 0,
    active: false
  });
}

function applyLookoutMapHorizonReviewActiveState(state) {
  state.time.day = 88;
  state.time.timeOfDay = 0.54;
  state.time.phase = "day";
  state.bubbleBoy.goal = "lookoutMapHorizon";
  state.bubbleBoy.currentAction = "inspectLookout";
  state.bubbleBoy.position = { x: 4.66, y: 0.20, z: 5.48 };
  state.bubbleBoy.facing = 0.58;
  state.lookoutMapHorizon = lookoutMapHorizonReviewState({
    stage: "lookoutActive",
    variant: "lookoutActive",
    lookoutPlatformCount: 1,
    stepCount: 3,
    horizonMarkerCount: 2,
    keepsakeCount: 1,
    useSlotCount: 1,
    active: true
  });
}

function applyLookoutMapHorizonReviewMapBoardState(state) {
  state.time.day = 92;
  state.time.timeOfDay = 0.56;
  state.time.phase = "day";
  state.bubbleBoy.goal = "lookoutMapHorizon";
  state.bubbleBoy.currentAction = "inspectMapBoard";
  state.bubbleBoy.position = { x: 6.42, y: 0.20, z: 6.44 };
  state.bubbleBoy.facing = -2.24;
  state.lookoutMapHorizon = lookoutMapHorizonReviewState({
    stage: "mapBoard",
    variant: "mapBoard",
    lookoutPlatformCount: 1,
    stepCount: 3,
    mapBoardCount: 1,
    sketchMapCount: 3,
    horizonMarkerCount: 2,
    keepsakeCount: 2,
    useSlotCount: 1,
    active: true
  });
}

function applyLookoutMapHorizonReviewDay100State(state) {
  state.time.day = 100;
  state.time.timeOfDay = 0.58;
  state.time.phase = "day";
  state.environment.dayFactor = 0.84;
  state.environment.nightFactor = 0.04;
  state.environment.light.timeOfDay = 0.58;
  state.environment.light.sourceLevel = 0.86;
  state.environment.light.sunIntensity = 0.76;
  state.environment.light.moonIntensity = 0.02;
  state.environment.light.fireIntensity = 0.52;
  state.environment.light.sky = [0.42, 0.60, 0.82];
  state.environment.light.fogColor = [0.48, 0.60, 0.74];
  state.environment.light.fogDensity = 0.018;
  state.bubbleBoy.goal = "lookoutMapHorizon";
  state.bubbleBoy.currentAction = "watchHorizon";
  state.bubbleBoy.position = { x: 4.72, y: 0.20, z: 5.54 };
  state.bubbleBoy.facing = 0.68;
  state.lookoutMapHorizon = lookoutMapHorizonReviewState({
    stage: "day100Gathering",
    variant: "day100Gathering",
    lookoutPlatformCount: 1,
    stepCount: 4,
    mapBoardCount: 1,
    sketchMapCount: 3,
    horizonMarkerCount: 4,
    horizonHighlightCount: 1,
    keepsakeCount: 4,
    gatheringDetailCount: 6,
    useSlotCount: 1,
    active: true
  });
}

function lookoutMapHorizonReviewState({
  visible = true,
  stage = "lookoutActive",
  variant = "lookoutActive",
  lookoutPlatformCount = 1,
  stepCount = 3,
  mapBoardCount = 0,
  sketchMapCount = 0,
  horizonMarkerCount = 2,
  horizonHighlightCount = 0,
  keepsakeCount = 1,
  gatheringDetailCount = 0,
  useSlotCount = 1,
  active = false
} = {}) {
  return {
    id: LOOKOUT_MAP_HORIZON_ID,
    family: LOOKOUT_MAP_HORIZON_ID,
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "north-lookout-rise",
    anchorPosition: { x: 5.80, y: 0.22, z: 6.40 },
    mapBoardPosition: { x: 5.22, y: 0.22, z: 5.50 },
    horizonMarkerPosition: { x: 7.40, y: 0.22, z: 8.20 },
    keepsakePosition: { x: 6.28, y: 0.22, z: 5.62 },
    gatheringPosition: { x: 5.82, y: 0.22, z: 6.98 },
    lookoutPlatformVisible: visible && lookoutPlatformCount > 0,
    stepsVisible: visible && stepCount > 0,
    mapBoardVisible: visible && mapBoardCount > 0,
    sketchMapVisible: visible && sketchMapCount > 0,
    horizonMarkerVisible: visible && horizonMarkerCount > 0,
    horizonHighlightVisible: visible && horizonHighlightCount > 0,
    keepsakeDisplayVisible: visible && keepsakeCount > 0,
    day100GatheringVisible: visible && gatheringDetailCount > 0,
    useSlotVisible: visible && useSlotCount > 0,
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
    source: "procedural",
    movementDiscoveryNote:
      "visual-only lookout/map placeholders; steps and use-slot do not enable climbing, vertical movement, map discovery, or Day 100 completion",
    integrationNote:
      "no climbing, map discovery, Day 100 progression, ending logic, off-island world mechanics, camera, terrain, day-loop, milestone, or movement hooks"
  };
}

function applyMajorProjectCapstoneReviewBaseState(state) {
  state.time.day = 91;
  state.time.timeOfDay = 0.54;
  state.time.phase = "day";
  state.bubbleBoy.goal = "majorProjectCapstone";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: 0.76, y: 0.20, z: -1.28 };
  state.bubbleBoy.facing = -0.90;
  state.majorProjectCapstone = majorProjectCapstoneReviewState({
    stage: "stage0",
    variant: "communityTableStage0",
    supplyMarkerCount: 5,
    active: false
  });
}

function applyMajorProjectCapstoneReviewHiddenState(state) {
  state.time.day = 90;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: 0.76, y: 0.20, z: -1.28 };
  state.bubbleBoy.facing = -0.90;
  state.majorProjectCapstone = majorProjectCapstoneReviewState({
    visible: false,
    stage: "hidden",
    variant: "communityTableStage0",
    supplyMarkerCount: 0,
    tableLegCount: 0,
    tabletopPieceCount: 0,
    benchCount: 0,
    placeSettingCount: 0,
    celebrationDetailCount: 0,
    active: false
  });
}

function applyMajorProjectCapstoneReviewStage1State(state) {
  state.time.day = 92;
  state.bubbleBoy.goal = "majorProjectCapstone";
  state.bubbleBoy.currentAction = "inspectCapstoneProject";
  state.bubbleBoy.position = { x: 0.76, y: 0.20, z: -1.28 };
  state.bubbleBoy.facing = -0.90;
  state.majorProjectCapstone = majorProjectCapstoneReviewState({
    stage: "stage1",
    variant: "communityTableStage1",
    supplyMarkerCount: 3,
    tableLegCount: 2,
    tabletopPieceCount: 1,
    active: true
  });
}

function applyMajorProjectCapstoneReviewStage2State(state) {
  state.time.day = 93;
  state.bubbleBoy.goal = "majorProjectCapstone";
  state.bubbleBoy.currentAction = "reviewCapstoneStage";
  state.bubbleBoy.position = { x: 0.76, y: 0.20, z: -1.28 };
  state.bubbleBoy.facing = -0.90;
  state.majorProjectCapstone = majorProjectCapstoneReviewState({
    stage: "stage2",
    variant: "communityTableStage2",
    supplyMarkerCount: 1,
    tableLegCount: 4,
    tabletopPieceCount: 2,
    benchCount: 1,
    placeSettingCount: 2,
    active: true
  });
}

function applyMajorProjectCapstoneReviewCompleteState(state) {
  state.time.day = 95;
  state.bubbleBoy.goal = "majorProjectCapstone";
  state.bubbleBoy.currentAction = "inspectCommunityTable";
  state.bubbleBoy.position = { x: 0.76, y: 0.20, z: -1.28 };
  state.bubbleBoy.facing = -0.90;
  state.majorProjectCapstone = majorProjectCapstoneReviewState({
    stage: "stage3",
    variant: "communityTableComplete",
    supplyMarkerCount: 0,
    tableLegCount: 4,
    tabletopPieceCount: 3,
    benchCount: 2,
    placeSettingCount: 6,
    celebrationDetailCount: 5,
    active: true
  });
}

function applyMajorProjectCapstoneReviewCloseupState(state) {
  applyMajorProjectCapstoneReviewCompleteState(state);
  state.bubbleBoy.position = { x: 0.66, y: 0.20, z: -1.10 };
  state.bubbleBoy.facing = -0.96;
}

function majorProjectCapstoneReviewState({
  visible = true,
  stage = "stage0",
  variant = "communityTableStage0",
  supplyMarkerCount = 5,
  tableLegCount = 0,
  tabletopPieceCount = 0,
  benchCount = 0,
  placeSettingCount = 0,
  celebrationDetailCount = 0,
  active = false
} = {}) {
  return {
    id: MAJOR_PROJECT_CAPSTONE_ID,
    family: MAJOR_PROJECT_CAPSTONE_ID,
    selectedOption: "communityTable",
    visible,
    autoVisible: false,
    stage,
    variant,
    active,
    usable: false,
    anchor: "camp-community-table",
    anchorPosition: { x: 1.82, y: 0.20, z: -2.20 },
    celebrationPosition: { x: 1.82, y: 0.20, z: -1.52 },
    stage0SuppliesVisible: visible && supplyMarkerCount > 0,
    partialBuildVisible: visible && stage === "stage1",
    mostlyBuiltVisible: visible && stage === "stage2",
    completeBuildVisible: visible && stage === "stage3",
    celebrationDetailVisible: visible && celebrationDetailCount > 0,
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
    source: "procedural",
    capstoneOptionNote:
      "chosen capstone option: community table; staged visual progression only",
    integrationNote:
      "visual-only capstone placeholders; no resource planning, construction mechanics, milestone logic, travel, discovery, or Day 100 completion"
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

function applyRaftBoatRouteReviewBaseState(state) {
  state.time.day = 47;
  state.bubbleBoy.goal = "raftBoatRoute";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -10.7, y: 0.20, z: 29.7 };
  state.bubbleBoy.facing = 1.02;
  state.raftBoatRoute = raftBoatRouteReviewState({
    stage: "frame",
    buildStage: "frame",
    waterState: "shore",
    variant: "shoreBuild",
    logCount: 5,
    platformPlankCount: 3,
    lashingCount: 6,
    paddleCount: 1,
    wakeMarkerCount: 0,
    routeMarkerCount: 0,
    landingMarkerCount: 1,
    routeMarker: false,
    active: false
  });
}

function applyRaftBoatRouteReviewHiddenState(state) {
  state.time.day = 45;
  state.bubbleBoy.goal = "reviewHidden";
  state.bubbleBoy.currentAction = "idle";
  state.bubbleBoy.position = { x: -10.7, y: 0.20, z: 29.7 };
  state.bubbleBoy.facing = 1.02;
  state.raftBoatRoute = raftBoatRouteReviewState({
    visible: false,
    stage: "none",
    buildStage: "none",
    waterState: "shore",
    variant: "shoreBuild",
    logCount: 0,
    platformPlankCount: 0,
    lashingCount: 0,
    paddleCount: 0,
    wakeMarkerCount: 0,
    routeMarkerCount: 0,
    landingMarkerCount: 0,
    routeMarker: false,
    active: false
  });
}

function applyRaftBoatRouteReviewActiveState(state) {
  state.time.day = 47;
  state.bubbleBoy.goal = "raftBoatRoute";
  state.bubbleBoy.currentAction = "inspectRaftRoute";
  state.bubbleBoy.position = { x: -10.55, y: 0.20, z: 29.52 };
  state.bubbleBoy.facing = 1.08;
  state.raftBoatRoute = raftBoatRouteReviewState({
    stage: "frame",
    buildStage: "frame",
    waterState: "shore",
    variant: "shoreBuild",
    logCount: 5,
    platformPlankCount: 3,
    lashingCount: 6,
    paddleCount: 1,
    wakeMarkerCount: 0,
    routeMarkerCount: 0,
    landingMarkerCount: 1,
    routeMarker: false,
    active: true
  });
}

function applyRaftBoatRouteReviewCloseupState(state) {
  state.time.day = 52;
  state.bubbleBoy.goal = "raftBoatRoute";
  state.bubbleBoy.currentAction = "inspectRaftRoute";
  state.bubbleBoy.position = { x: -10.52, y: 0.20, z: 29.56 };
  state.bubbleBoy.facing = 1.10;
  state.raftBoatRoute = raftBoatRouteReviewState({
    stage: "waterReady",
    buildStage: "waterReady",
    waterState: "water",
    variant: "waterFloat",
    logCount: 6,
    platformPlankCount: 6,
    lashingCount: 8,
    paddleCount: 1,
    wakeMarkerCount: 3,
    routeMarkerCount: 0,
    landingMarkerCount: 1,
    routeMarker: false,
    active: true
  });
}

function applyRaftBoatRouteReviewRouteState(state) {
  state.time.day = 55;
  state.bubbleBoy.goal = "raftBoatRoute";
  state.bubbleBoy.currentAction = "inspectRaftRoute";
  state.bubbleBoy.position = { x: -10.46, y: 0.20, z: 29.62 };
  state.bubbleBoy.facing = 1.12;
  state.raftBoatRoute = raftBoatRouteReviewState({
    stage: "route",
    buildStage: "route",
    waterState: "route",
    variant: "routePreview",
    logCount: 6,
    platformPlankCount: 6,
    lashingCount: 8,
    paddleCount: 1,
    wakeMarkerCount: 4,
    routeMarkerCount: 4,
    landingMarkerCount: 1,
    routeMarker: true,
    active: true
  });
}

function raftBoatRouteReviewState({
  visible = true,
  stage = "frame",
  buildStage = "frame",
  waterState = "shore",
  variant = "shoreBuild",
  logCount = 5,
  platformPlankCount = 3,
  lashingCount = 6,
  paddleCount = 1,
  wakeMarkerCount = 0,
  routeMarkerCount = 0,
  landingMarkerCount = 1,
  routeMarker = false,
  active = false
} = {}) {
  return {
    id: RAFT_BOAT_ROUTE_ID,
    family: RAFT_BOAT_ROUTE_ID,
    visible,
    autoVisible: false,
    stage,
    buildStage,
    waterState,
    variant,
    routeMarker,
    active,
    usable: false,
    anchor: "shoreline",
    anchorPosition: { x: -12.7, y: 0.18, z: 31.7 },
    waterAnchorPosition: { x: -15.1, y: -0.16, z: 33.6 },
    routeMarkerAnchorPosition: { x: -16.2, y: -0.16, z: 34.8 },
    landingAnchorPosition: { x: -10.9, y: 0.18, z: 29.7 },
    landingAnchor: { x: -10.9, y: 0.18, z: 29.7 },
    raftFrameVisible: visible && logCount > 0,
    tiedPlatformVisible: visible && platformPlankCount > 0,
    paddleVisible: visible && paddleCount > 0,
    raftOnWaterVisible: visible && (waterState === "water" || waterState === "route" || waterState === "return"),
    wakeMarkerVisible: visible && wakeMarkerCount > 0,
    routeMarkerVisible: visible && routeMarker && routeMarkerCount > 0,
    returnLandingVisible: visible && landingMarkerCount > 0,
    logCount,
    platformPlankCount,
    lashingCount,
    paddleCount,
    wakeMarkerCount,
    routeMarkerCount,
    landingMarkerCount,
    source: "procedural",
    integrationNote: "visual-only raft route placeholders; future buildable/vehicle hooks are metadata only"
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

function setReviewFoodRoutineHidden(state) {
  state.foodRoutine = foodRoutineReviewState({
    visible: false,
    stage: "none",
    variant: "cookPrep",
    basketStock: 0,
    mealCount: 0,
    driedFishCount: 0,
    harvestCount: 0,
    leftoverCount: 0,
    active: false
  });
}

function setReviewFishTrapRoutineHidden(state) {
  state.fishTrapRoutine = fishTrapRoutineReviewState({
    visible: false,
    trapState: "unset",
    stage: "unset",
    variant: "unsetMarker",
    trapCount: 0,
    buoyCount: 0,
    lineCount: 0,
    stateCueCount: 0,
    dryingRackCount: 0,
    catchDisplayCount: 0,
    fishCount: 0,
    crabCount: 0,
    dryingFishCount: 0,
    active: false
  });
}

function setReviewToyPlaySetHidden(state) {
  state.toyPlaySet = toyPlaySetReviewState({
    visible: false,
    stage: "hidden",
    variant: "activeMain",
    collectionSlotCount: 0,
    blockCount: 0,
    ballCount: 0,
    kiteCount: 0,
    stringCount: 0,
    handleCount: 0,
    spinningTopCount: 0,
    playMatCount: 0,
    active: false
  });
}

function setReviewMusicArtDecorHidden(state) {
  state.musicArtDecor = musicArtDecorReviewState({
    visible: false,
    stage: "hidden",
    variant: "decorCluster",
    shellChimeCount: 0,
    paintedStoneCount: 0,
    drumCount: 0,
    fluteCount: 0,
    hangingDecorationCount: 0,
    artDisplaySlotCount: 0,
    performanceMarkerCount: 0,
    noteMarkerCount: 0,
    active: false
  });
}

function setReviewAnimalFamiliarVisitorHidden(state) {
  state.animalFamiliarVisitor = animalFamiliarVisitorReviewState({
    visible: false,
    stage: "hidden",
    variant: "groundVisitor",
    animalCount: 0,
    birdVisitorCount: 0,
    fishVisitorCount: 0,
    foodCrumbCount: 0,
    observeRingCount: 0,
    approachMarkerCount: 0,
    active: false
  });
}

function setReviewNightComfortLightsHidden(state) {
  state.nightComfortLights = nightComfortLightsReviewState({
    visible: false,
    stage: "hidden",
    variant: "nightLit",
    lanternPostCount: 0,
    litPathAnchorCount: 0,
    glowingShellCount: 0,
    fireflyCount: 0,
    sitAnchorCount: 0,
    active: false
  });
}

function setReviewLookoutMapHorizonHidden(state) {
  state.lookoutMapHorizon = lookoutMapHorizonReviewState({
    visible: false,
    stage: "hidden",
    variant: "lookoutActive",
    lookoutPlatformCount: 0,
    stepCount: 0,
    mapBoardCount: 0,
    sketchMapCount: 0,
    horizonMarkerCount: 0,
    horizonHighlightCount: 0,
    keepsakeCount: 0,
    gatheringDetailCount: 0,
    useSlotCount: 0,
    active: false
  });
}

function setReviewMajorProjectCapstoneHidden(state) {
  state.majorProjectCapstone = majorProjectCapstoneReviewState({
    visible: false,
    stage: "hidden",
    variant: "communityTableStage0",
    supplyMarkerCount: 0,
    tableLegCount: 0,
    tabletopPieceCount: 0,
    benchCount: 0,
    placeSettingCount: 0,
    celebrationDetailCount: 0,
    active: false
  });
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

function setReviewRaftBoatRouteHidden(state) {
  state.raftBoatRoute = raftBoatRouteReviewState({
    visible: false,
    stage: "none",
    buildStage: "none",
    waterState: "shore",
    logCount: 0,
    platformPlankCount: 0,
    lashingCount: 0,
    paddleCount: 0,
    wakeMarkerCount: 0,
    routeMarkerCount: 0,
    landingMarkerCount: 0,
    routeMarker: false,
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
