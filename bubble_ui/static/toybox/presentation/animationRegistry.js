export const DAY_1_5_PRESENTATION_ACTIONS = Object.freeze([
  "arriveLookAround",
  "gatherLooseSupplies",
  "pickupMaterial",
  "carryBundle",
  "lightFire",
  "tendFire",
  "buildHammock",
  "sleepInHammock",
  "wakeStretch",
  "rest_sit",
  "rest_sleep_loop",
  "rest_wake_stretch",
  "depositMaterials",
  "craftAtWorkbench",
  "inspectTool",
  "rakePath",
  "placeBoundaryStone",
  "walkRoute",
  "planting",
  "watering",
  "harvesting",
  "inspectingGarden"
]);

const DEFAULT_ANIMATION_FALLBACK = Object.freeze({
  clip: "Idle",
  clipCandidates: Object.freeze(["Idle", "Standing"]),
  emote: null,
  proceduralOverlay: "observe",
  locomotionAware: false,
  semanticAction: "observe",
  fallbackReason: "unknown action; safe Idle fallback"
});

export const ANIMATION_FALLBACK_REGISTRY = freezeRegistry({
  arriveLookAround: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "gazeLookAround",
    locomotionAware: false
  },
  gatherLooseSupplies: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "bendPickup",
    locomotionAware: false
  },
  pickupMaterial: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "pickup",
    locomotionAware: false
  },
  carryBundle: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "carryAttachment",
    locomotionAware: true
  },
  lightFire: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "crouchFire",
    locomotionAware: false
  },
  tendFire: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "fireCare",
    locomotionAware: false
  },
  buildHammock: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "tieBuild",
    locomotionAware: false
  },
  sleepInHammock: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "lieDownAdditive",
    locomotionAware: false,
    semanticAction: "sleep",
    fallbackReason: "no imported sleep clip; using RobotExpressive Sitting with procedural lie-down overlay"
  },
  wakeStretch: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "stretch",
    locomotionAware: false,
    semanticAction: "wake",
    fallbackReason: "no imported wake clip; using RobotExpressive ThumbsUp stretch fallback"
  },
  rest_sit: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "restSit",
    locomotionAware: false,
    semanticAction: "rest",
    fallbackReason: "no imported rest_sit clip; using RobotExpressive Sitting fallback"
  },
  rest_sleep_loop: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "lieDownAdditive",
    locomotionAware: false,
    semanticAction: "sleep",
    fallbackReason: "no imported sleep clip; using RobotExpressive Sitting with procedural lie-down overlay"
  },
  rest_wake_stretch: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "wakeStretch",
    locomotionAware: false,
    semanticAction: "wake",
    fallbackReason: "no imported wake/stretch clip; using RobotExpressive ThumbsUp stretch fallback"
  },
  depositMaterials: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "depositMaterials",
    locomotionAware: false,
    semanticAction: "depositMaterials",
    fallbackReason: "no imported deposit clip; using RobotExpressive Punch with procedural bend/place overlay"
  },
  craftAtWorkbench: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "craftAtWorkbench",
    locomotionAware: false,
    semanticAction: "craftAtWorkbench",
    fallbackReason: "no imported crafting clip; using RobotExpressive Punch with procedural workbench loop"
  },
  inspectTool: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "inspectTool",
    locomotionAware: false,
    semanticAction: "inspectTool",
    fallbackReason: "no imported inspect clip; using RobotExpressive ThumbsUp with procedural hand-held tool overlay"
  },
  rakePath: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "pathRakeSweep",
    locomotionAware: false,
    semanticAction: "rakePath",
    fallbackReason: "no imported rake clip; using RobotExpressive Punch with procedural arm-sweep overlay"
  },
  placeBoundaryStone: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "kneelPlaceStone",
    locomotionAware: false,
    semanticAction: "placeBoundaryStone",
    fallbackReason: "no imported stone placement clip; using Sitting with procedural kneel/place overlay"
  },
  walkRoute: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "routeWalk",
    locomotionAware: true,
    semanticAction: "walkRoute",
    fallbackReason: "route movement is simulation-owned; using existing Walking clip when velocity is present"
  },
  planting: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "gardenPlant",
    locomotionAware: false,
    semanticAction: "planting",
    fallbackReason: "no imported planting clip; using RobotExpressive Sitting with procedural soil-pat overlay"
  },
  watering: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "gardenWatering",
    locomotionAware: false,
    semanticAction: "watering",
    fallbackReason: "no imported watering clip; using Idle with procedural one-handed pour overlay"
  },
  harvesting: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "gardenHarvest",
    locomotionAware: false,
    semanticAction: "harvesting",
    fallbackReason: "no imported harvest clip; using Sitting with procedural reach-and-pluck overlay"
  },
  inspectingGarden: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Yes",
    proceduralOverlay: "gardenInspect",
    locomotionAware: false,
    semanticAction: "inspectingGarden",
    fallbackReason: "no imported garden inspect clip; using Idle with procedural look-down overlay"
  }
});

export const LEGACY_ACTION_PRESENTATION_MAP = Object.freeze({
  idle: "arriveLookAround",
  lookingAround: "arriveLookAround",
  walking: "carryBundle",
  resting: "rest_sit",
  warmingHands: "tendFire",
  tendingFire: "tendFire",
  sitting: "rest_sit",
  interacting: "arriveLookAround",
  foraging: "gatherLooseSupplies",
  fishing: "pickupMaterial",
  cookingFish: "lightFire",
  eatingFish: "pickupMaterial",
  gatheringWood: "gatherLooseSupplies",
  building: "buildHammock",
  depositingMaterials: "depositMaterials",
  sortingMaterials: "depositMaterials",
  craftingTool: "craftAtWorkbench",
  craftingAtWorkbench: "craftAtWorkbench",
  inspectingTool: "inspectTool",
  rakingPath: "rakePath",
  placingBoundaryStone: "placeBoundaryStone",
  walkingRoute: "walkRoute",
  plantingSeeds: "planting",
  plantSeeds: "planting",
  wateringGarden: "watering",
  waterGarden: "watering",
  harvestingCrop: "harvesting",
  harvestCrop: "harvesting",
  inspectSprout: "inspectingGarden",
  inspectingSprout: "inspectingGarden",
  inspect: "arriveLookAround",
  rest: "rest_sit",
  sleep: "rest_sleep_loop",
  wake: "rest_wake_stretch",
  playToy: "arriveLookAround",
  celebrate: "wakeStretch"
});

export function resolvePresentationAction(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const currentAction = typeof boy.currentAction === "string" ? boy.currentAction : "idle";
  if (Object.prototype.hasOwnProperty.call(ANIMATION_FALLBACK_REGISTRY, currentAction)) {
    return currentAction;
  }

  const goal = typeof boy.goal === "string" ? boy.goal : "";
  if (currentAction === "sleep" || goal === "sleep" || goal === "useBed") return "rest_sleep_loop";
  if (currentAction === "wake" || goal === "wake") return "rest_wake_stretch";
  if (currentAction === "rest" || currentAction === "resting" || currentAction === "sitting" || goal === "rest") {
    return "rest_sit";
  }
  if (goal === "storage") return "depositMaterials";
  if (goal === "craft") return "craftAtWorkbench";
  if (goal === "inspectTool") return "inspectTool";
  if (goal === "campLayout" || goal === "rakePath") return "rakePath";
  if (goal === "walkRoute") return "walkRoute";
  if (goal === "garden" || goal === "planting") return "planting";
  if (goal === "watering") return "watering";
  if (goal === "harvesting") return "harvesting";
  if (goal === "inspectingGarden") return "inspectingGarden";

  const builderAction = boy.builder && typeof boy.builder.actionState === "string" ? boy.builder.actionState : "";
  if (builderAction === "sleep") return "sleepInHammock";
  if (builderAction === "gather") return "gatherLooseSupplies";
  if (builderAction === "construct") return "buildHammock";

  const targetId = typeof boy.targetId === "string" ? boy.targetId : "";
  if (targetId === "fire-pit" && currentAction === "walking") return "carryBundle";

  return LEGACY_ACTION_PRESENTATION_MAP[currentAction] || "arriveLookAround";
}

export function resolveAnimationFallback(action, worldState) {
  const registered = ANIMATION_FALLBACK_REGISTRY[action] || DEFAULT_ANIMATION_FALLBACK;
  const speed = bubbleBoySpeed(worldState);
  const clip = registered.locomotionAware && speed > 0.025
    ? registered.movingClip || "Walking"
    : registered.clip || "Idle";

  return {
    action: ANIMATION_FALLBACK_REGISTRY[action] ? action : "arriveLookAround",
    clip,
    clipCandidates: cloneArray(registered.clipCandidates || [clip]),
    emote: registered.emote || null,
    proceduralOverlay: registered.proceduralOverlay || "observe",
    locomotionAware: Boolean(registered.locomotionAware),
    semanticAction: registered.semanticAction || action,
    fallbackReason: registered.fallbackReason || "",
    rootMotion: false
  };
}

function bubbleBoySpeed(worldState) {
  const velocity = worldState && worldState.bubbleBoy ? worldState.bubbleBoy.velocity : null;
  if (!velocity || typeof velocity !== "object") return 0;
  const x = Number.isFinite(velocity.x) ? velocity.x : 0;
  const z = Number.isFinite(velocity.z) ? velocity.z : 0;
  return Math.hypot(x, z);
}

function cloneArray(value) {
  return Array.isArray(value) ? value.slice() : [];
}

function freezeRegistry(registry) {
  const frozen = {};
  for (const [key, value] of Object.entries(registry)) {
    frozen[key] = Object.freeze({
      ...value,
      clipCandidates: Object.freeze(cloneArray(value.clipCandidates))
    });
  }
  return Object.freeze(frozen);
}
