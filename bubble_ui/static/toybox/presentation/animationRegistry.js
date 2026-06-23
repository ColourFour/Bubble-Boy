export const DAY_1_5_PRESENTATION_ACTIONS = Object.freeze([
  "arriveLookAround",
  "orientToIsland",
  "respondToPlayer",
  "inspectObject",
  "pointNotice",
  "smallSurprise",
  "quietCelebrate",
  "gatherLooseSupplies",
  "bendPickup",
  "pickupMaterial",
  "carryBundle",
  "carryPlank",
  "carryLog",
  "lightFire",
  "tendFire",
  "kneelAtFire",
  "warmHands",
  "addFuel",
  "fanFire",
  "stokeFire",
  "cookFish",
  "cookMeal",
  "stirPot",
  "holdFood",
  "eatFood",
  "buildHammock",
  "sitRestSpot",
  "settleIntoHammock",
  "settleIntoBed",
  "lieDown",
  "sleepLoop",
  "wake",
  "sleepInHammock",
  "wakeStretch",
  "standUpFromRest",
  "rest_sit",
  "rest_sleep_loop",
  "rest_wake_stretch",
  "depositMaterial",
  "setItemDown",
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

const LOCOMOTION_SPEEDS = Object.freeze({
  idle: 0.035,
  slowWalk: 0.42,
  normalWalk: 0.82,
  approachDistance: 1.85,
  turnAngle: 0.34,
  startWindowSeconds: 0.55,
  stopWindowSeconds: 0.62
});

const LOCOMOTION_CLIPS = Object.freeze({
  idle: Object.freeze(["Idle", "Standing"]),
  turnInPlace: Object.freeze(["Idle", "Standing"]),
  stop: Object.freeze(["Idle", "Standing"]),
  start: Object.freeze(["Walking", "Idle"]),
  slowWalk: Object.freeze(["Walking", "Idle"]),
  approachTarget: Object.freeze(["Walking", "Idle"]),
  normalWalk: Object.freeze(["Walking", "Idle"]),
  shortJog: Object.freeze(["Running", "Walking"])
});

const MOVEMENT_ACTIONS = Object.freeze([
  "walk",
  "walking",
  "walkroute",
  "walkingroute",
  "carrybundle",
  "carryplank",
  "carrylog"
]);

const MOVEMENT_GOALS = Object.freeze([
  "approachfire",
  "followintent",
  "walkroute",
  "camplayout",
  "gofish",
  "cookfish",
  "gatherwood",
  "buildproject",
  "usebed",
  "playtoy",
  "wander"
]);

const STOP_ACTIONS = Object.freeze([
  "building",
  "gatheringwood",
  "foraging",
  "fishing",
  "cookingfish",
  "lightfire",
  "kneelatfire",
  "warmhands",
  "addfuel",
  "fanfire",
  "stokefire",
  "cookfish",
  "cookmeal",
  "stirpot",
  "holdfood",
  "eatfood",
  "inspect",
  "playtoy",
  "bendpickup",
  "pickupmaterial",
  "craftatworkbench",
  "depositmaterial",
  "depositmaterials",
  "setitemdown",
  "rakepath",
  "placeboundarystone",
  "planting",
  "watering",
  "harvesting"
]);

export const ANIMATION_FALLBACK_REGISTRY = freezeRegistry({
  arriveLookAround: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "gazeLookAround",
    locomotionAware: false,
    semanticAction: "arriveLookAround",
    fallbackReason: "arrival look-around uses RobotExpressive Idle with procedural gaze/head-turn overlay"
  },
  orientToIsland: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "orientIsland",
    locomotionAware: false,
    semanticAction: "orientToIsland",
    fallbackReason: "no imported orient clip; using RobotExpressive Yes with procedural island-scan overlay"
  },
  respondToPlayer: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Wave",
    proceduralOverlay: "playerWave",
    locomotionAware: false,
    semanticAction: "respondToPlayer",
    fallbackReason: "player response uses RobotExpressive Wave with procedural head/upper-body attention overlay"
  },
  inspectObject: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "inspectObject",
    locomotionAware: false,
    semanticAction: "inspectObject",
    fallbackReason: "object inspection uses RobotExpressive Yes with procedural lean-in and gaze overlay"
  },
  pointNotice: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Wave",
    proceduralOverlay: "pointNotice",
    locomotionAware: false,
    semanticAction: "pointNotice",
    fallbackReason: "point/notice uses RobotExpressive Wave as a licensed in-rig gesture with procedural pointing overlay"
  },
  smallSurprise: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "smallSurprise",
    locomotionAware: false,
    semanticAction: "smallSurprise",
    fallbackReason: "small surprise uses RobotExpressive Yes with a restrained procedural recoil overlay"
  },
  quietCelebrate: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "quietCelebrate",
    locomotionAware: false,
    semanticAction: "quietCelebrate",
    fallbackReason: "quiet celebration uses RobotExpressive ThumbsUp with small procedural upper-body lift"
  },
  gatherLooseSupplies: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "bendPickup",
    locomotionAware: false,
    semanticAction: "gatherLooseSupplies",
    fallbackReason: "no imported gather clip; using RobotExpressive Punch with procedural bend/reach overlay"
  },
  bendPickup: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "bendPickup",
    locomotionAware: false,
    semanticAction: "bendPickup",
    fallbackReason: "bend/pickup is procedural only so simulation position remains authoritative"
  },
  pickupMaterial: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "pickup",
    locomotionAware: false,
    semanticAction: "pickupMaterial",
    fallbackReason: "no imported pickup clip; using RobotExpressive Punch with procedural reach/grab overlay"
  },
  carryBundle: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "carryAttachment",
    locomotionAware: true,
    semanticAction: "carryBundle",
    fallbackReason: "carry uses existing Idle/Walking clips with a two-hand procedural overlay; no root motion"
  },
  carryPlank: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "carryPlank",
    locomotionAware: true,
    semanticAction: "carryPlank",
    fallbackReason: "plank carry reuses the two-hand carry overlay and simulation-owned movement"
  },
  carryLog: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "carryLog",
    locomotionAware: true,
    semanticAction: "carryLog",
    fallbackReason: "log carry reuses the two-hand carry overlay and simulation-owned movement"
  },
  lightFire: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "crouchFire",
    locomotionAware: false,
    semanticAction: "lightFire",
    fallbackReason: "fire lighting uses RobotExpressive Punch with procedural crouch/reach overlay; no root motion"
  },
  tendFire: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "fireCare",
    locomotionAware: false,
    semanticAction: "tendFire",
    fallbackReason: "legacy fire tending uses RobotExpressive Punch with procedural hand/fire-care overlay"
  },
  kneelAtFire: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "fireKneel",
    locomotionAware: false,
    semanticAction: "kneelAtFire",
    fallbackReason: "kneel at fire reuses Sitting with a procedural crouch overlay so position stays simulation-owned"
  },
  warmHands: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: null,
    proceduralOverlay: "fireWarmHands",
    locomotionAware: false,
    semanticAction: "warmHands",
    fallbackReason: "warm hands is a procedural upper-body overlay layered on RobotExpressive Idle"
  },
  addFuel: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "fireAddFuel",
    locomotionAware: false,
    semanticAction: "addFuel",
    fallbackReason: "add fuel uses RobotExpressive Punch with a procedural reach/drop overlay; no root motion"
  },
  fanFire: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "fireFan",
    locomotionAware: false,
    semanticAction: "fanFire",
    fallbackReason: "fan fire uses RobotExpressive Punch with procedural one-hand fanning overlay"
  },
  stokeFire: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "fireStoke",
    locomotionAware: false,
    semanticAction: "stokeFire",
    fallbackReason: "stoke fire uses RobotExpressive Punch with procedural poke/stir overlay; no root motion"
  },
  cookFish: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "cookFish",
    locomotionAware: false,
    semanticAction: "cookFish",
    fallbackReason: "cook fish uses RobotExpressive Punch with procedural fire-side cooking overlay"
  },
  cookMeal: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "cookMeal",
    locomotionAware: false,
    semanticAction: "cookMeal",
    fallbackReason: "cook meal uses RobotExpressive Punch with procedural prep/cooking overlay"
  },
  stirPot: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "stirPot",
    locomotionAware: false,
    semanticAction: "stirPot",
    fallbackReason: "stir pot uses RobotExpressive Punch with procedural circular stirring overlay"
  },
  holdFood: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "holdFood",
    locomotionAware: false,
    semanticAction: "holdFood",
    fallbackReason: "held food is an action-gated procedural attachment with an Idle hand pose"
  },
  eatFood: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "eatFood",
    locomotionAware: false,
    semanticAction: "eatFood",
    fallbackReason: "eat food uses a procedural hand-to-mouth overlay with RobotExpressive Idle/ThumbsUp fallback"
  },
  buildHammock: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "tieBuild",
    locomotionAware: false
  },
  sitRestSpot: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "restSit",
    locomotionAware: false,
    semanticAction: "sitRestSpot",
    fallbackReason: "rest-spot sitting uses RobotExpressive Sitting with a procedural relaxed seated overlay"
  },
  settleIntoHammock: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "settleHammock",
    locomotionAware: false,
    semanticAction: "settleIntoHammock",
    fallbackReason: "no imported hammock settle clip; using RobotExpressive Sitting with procedural settle-in overlay"
  },
  settleIntoBed: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "settleBed",
    locomotionAware: false,
    semanticAction: "settleIntoBed",
    fallbackReason: "no imported bed settle clip; using RobotExpressive Sitting with procedural settle-in overlay"
  },
  lieDown: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "lieDownAdditive",
    locomotionAware: false,
    semanticAction: "lieDown",
    fallbackReason: "lie-down is a procedural pose layered on RobotExpressive Sitting; simulation position remains authoritative"
  },
  sleepLoop: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "sleepLoop",
    locomotionAware: false,
    semanticAction: "sleepLoop",
    fallbackReason: "sleep loop uses RobotExpressive Sitting held in a procedural no-drift sleep pose"
  },
  wake: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "wakeRest",
    locomotionAware: false,
    semanticAction: "wake",
    fallbackReason: "wake uses RobotExpressive Idle with procedural sit-up recovery; no root motion"
  },
  sleepInHammock: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "lieDownAdditive",
    locomotionAware: false,
    semanticAction: "sleepLoop",
    fallbackReason: "no imported sleep clip; using RobotExpressive Sitting with procedural lie-down overlay"
  },
  wakeStretch: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "wakeStretch",
    locomotionAware: false,
    semanticAction: "wakeStretch",
    fallbackReason: "no imported wake clip; using RobotExpressive ThumbsUp stretch fallback"
  },
  standUpFromRest: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "standUpFromRest",
    locomotionAware: false,
    semanticAction: "standUpFromRest",
    fallbackReason: "stand-up from rest returns to RobotExpressive Idle with a procedural recovery pose"
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
    semanticAction: "wakeStretch",
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
  depositMaterial: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "depositMaterial",
    locomotionAware: false,
    semanticAction: "depositMaterial",
    fallbackReason: "no imported deposit clip; using RobotExpressive Punch with procedural bend/place overlay"
  },
  setItemDown: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "setItemDown",
    locomotionAware: false,
    semanticAction: "setItemDown",
    fallbackReason: "no imported set-down clip; using RobotExpressive Punch with procedural hands-to-ground overlay and no root motion"
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
  orienting: "orientToIsland",
  responding: "respondToPlayer",
  respondToPlayer: "respondToPlayer",
  waving: "respondToPlayer",
  wave: "respondToPlayer",
  walking: "carryBundle",
  resting: "sitRestSpot",
  warmingHands: "warmHands",
  warmHands: "warmHands",
  tendingFire: "warmHands",
  lightingFire: "lightFire",
  kneelingAtFire: "kneelAtFire",
  addingFuel: "addFuel",
  fanningFire: "fanFire",
  stokingFire: "stokeFire",
  sitting: "sitRestSpot",
  interacting: "respondToPlayer",
  foraging: "gatherLooseSupplies",
  pickup: "pickupMaterial",
  fishing: "pickupMaterial",
  cookingFish: "cookFish",
  cookingMeal: "cookMeal",
  stirringPot: "stirPot",
  eatingFish: "eatFood",
  eatingFood: "eatFood",
  holdingFood: "holdFood",
  gatheringWood: "gatherLooseSupplies",
  carryingPlank: "carryPlank",
  carryingLog: "carryLog",
  building: "buildHammock",
  depositingMaterial: "depositMaterial",
  depositingMaterials: "depositMaterials",
  setDownMaterial: "setItemDown",
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
  inspect: "inspectObject",
  inspectObject: "inspectObject",
  pointNotice: "pointNotice",
  notice: "pointNotice",
  smallSurprise: "smallSurprise",
  rest: "sitRestSpot",
  sitRestSpot: "sitRestSpot",
  settleIntoHammock: "settleIntoHammock",
  settleIntoBed: "settleIntoBed",
  lieDown: "lieDown",
  sleep: "sleepLoop",
  sleepLoop: "sleepLoop",
  wake: "wake",
  wakeStretch: "wakeStretch",
  standUpFromRest: "standUpFromRest",
  playToy: "arriveLookAround",
  celebrate: "quietCelebrate",
  quietCelebrate: "quietCelebrate"
});

export function resolvePresentationAction(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const currentAction = typeof boy.currentAction === "string" ? boy.currentAction : "idle";
  if (Object.prototype.hasOwnProperty.call(ANIMATION_FALLBACK_REGISTRY, currentAction)) {
    return currentAction;
  }

  const goal = typeof boy.goal === "string" ? boy.goal : "";
  const attentionAction = resolveAttentionPresentationAction(boy, currentAction, goal, worldState);
  if (attentionAction) return attentionAction;

  if (currentAction === "sleep" || goal === "sleep") return "sleepLoop";
  if (goal === "useBed" && currentAction !== "walking") return restShelterSettleAction(worldState);
  if (currentAction === "wake" || goal === "wake") return "wake";
  if (currentAction === "stretch" || goal === "wakeStretch") return "wakeStretch";
  if (currentAction === "rest" || currentAction === "resting" || currentAction === "sitting" || goal === "rest") {
    return "sitRestSpot";
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
  if (goal === "tendFire" || goal === "fireCare" || goal === "warmth") return "warmHands";
  if (goal === "cooking" || goal === "foodRoutine") {
    if (currentAction === "idle" || currentAction === "lookingAround") return "cookMeal";
  }
  if (goal === "cookFish") return "cookFish";

  const builderAction = boy.builder && typeof boy.builder.actionState === "string" ? boy.builder.actionState : "";
  if (builderAction === "sleep") return "sleepLoop";
  if (builderAction === "gather") return "gatherLooseSupplies";
  if (builderAction === "construct") return "buildHammock";

  const targetId = typeof boy.targetId === "string" ? boy.targetId : "";
  if (targetId === "fire-pit" && currentAction === "walking") return "carryBundle";
  if (targetId === "fire-pit" && currentAction !== "walking") return "warmHands";

  return LEGACY_ACTION_PRESENTATION_MAP[currentAction] || "arriveLookAround";
}

export function resolveAnimationFallback(action, worldState) {
  const registered = ANIMATION_FALLBACK_REGISTRY[action] || DEFAULT_ANIMATION_FALLBACK;
  const locomotion = resolveBubbleBoyLocomotion(action, worldState, registered);
  const attentionEmote = resolveBubbleBoyAttentionEmote(action, worldState, registered);

  return {
    action: ANIMATION_FALLBACK_REGISTRY[action] ? action : "arriveLookAround",
    clip: locomotion.clip,
    clipCandidates: cloneArray(locomotion.clipCandidates || registered.clipCandidates || [locomotion.clip]),
    emote: registered.emote || null,
    proceduralOverlay: registered.proceduralOverlay || "observe",
    emoteOverlay: attentionEmote.overlay,
    attentionEmote,
    locomotionOverlay: locomotion.overlay,
    locomotion,
    timeScale: locomotion.timeScale,
    fadeSeconds: locomotion.fadeSeconds,
    locomotionAware: Boolean(registered.locomotionAware),
    semanticAction: registered.semanticAction || action,
    fallbackReason: locomotion.fallbackReason || registered.fallbackReason || "",
    rootMotion: false
  };
}

export function resolveBubbleBoyAttentionEmote(action, worldState, registered = DEFAULT_ANIMATION_FALLBACK) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const affect = boy.affect && typeof boy.affect === "object" ? boy.affect : {};
  const focus = boy.focus && typeof boy.focus === "object" ? boy.focus : {};
  const semanticAction = registered.semanticAction || action;
  const overlay = registered.proceduralOverlay || "observe";
  const emote = registered.emote || null;
  const focusStrength = finiteNumber(focus.strength, 0);
  const intensity = clamp(
    finiteNumber(affect.attention, 0) * 0.40 +
      finiteNumber(affect.curiosity, 0) * 0.24 +
      finiteNumber(affect.stimulus, 0) * 0.24 +
      focusStrength * 0.12,
    0,
    1
  );

  return {
    state: semanticAction || "observe",
    overlay,
    clip: registered.clip || "Idle",
    emote,
    focusKind: typeof focus.kind === "string" ? focus.kind : "",
    attention: typeof boy.attention === "string" ? boy.attention : "",
    mood: typeof boy.mood === "string" ? boy.mood : "",
    intensity: roundMetric(intensity),
    rootMotion: false
  };
}

function resolveAttentionPresentationAction(boy, currentAction, goal, worldState) {
  const currentKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const attentionKey = normalizeLocomotionKey(boy.attention);
  const moodKey = normalizeLocomotionKey(boy.mood);
  const focus = boy.focus && typeof boy.focus === "object" ? boy.focus : {};
  const focusKey = normalizeLocomotionKey(focus.kind);
  const focusStrength = finiteNumber(focus.strength, 0);
  const affect = boy.affect && typeof boy.affect === "object" ? boy.affect : {};
  const attentionValue = finiteNumber(affect.attention, 0);
  const curiosity = finiteNumber(affect.curiosity, 0);
  const stimulus = finiteNumber(affect.stimulus, 0);
  const idleLike =
    currentKey === "idle" ||
    currentKey === "lookingaround" ||
    currentKey === "interacting" ||
    currentKey === "observe" ||
    currentKey === "responding";
  if (!idleLike) return "";

  if (focusKey === "player" || attentionKey === "userintent" || goalKey === "attenduser") {
    return "respondToPlayer";
  }
  if (moodKey === "alert" || focusKey === "weather" || stimulus >= 0.72) {
    return "smallSurprise";
  }
  if (focusStrength >= 0.62 && (focusKey === "builder" || focusKey === "workbench" || focusKey === "object")) {
    return "inspectObject";
  }
  if (focusStrength >= 0.58 && (focusKey === "island" || focusKey === "default" || focusKey === "target")) {
    return "pointNotice";
  }
  if (currentKey === "lookingaround" && isEarlyDay(worldState) && finiteNumber(boy.actionTimer, 0) >= 1.2) {
    return "orientToIsland";
  }
  if (currentKey === "lookingaround") return "arriveLookAround";
  if (attentionValue >= 0.52 && curiosity >= 0.40) return "pointNotice";
  return "";
}

export function resolveBubbleBoyLocomotion(action, worldState, registered = DEFAULT_ANIMATION_FALLBACK) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const speed = bubbleBoySpeed(worldState);
  const currentAction = normalizeLocomotionKey(boy.currentAction);
  const goal = normalizeLocomotionKey(boy.goal);
  const actionKey = normalizeLocomotionKey(action);
  const routeAware = isRouteAware(actionKey, currentAction, goal);
  const target = resolveBubbleBoyTarget(worldState, boy);
  const targetDistance = target ? distance2d(boy.position, target.position) : null;
  const facingError = target ? signedFacingError(boy, target.position) : 0;
  const movingAction =
    Boolean(registered.locomotionAware) ||
    MOVEMENT_ACTIONS.includes(actionKey) ||
    MOVEMENT_ACTIONS.includes(currentAction) ||
    MOVEMENT_GOALS.includes(goal) ||
    (speed > LOCOMOTION_SPEEDS.idle && (routeAware || target));
  const justStarted =
    speed > LOCOMOTION_SPEEDS.idle &&
    (MOVEMENT_ACTIONS.includes(currentAction) || Boolean(registered.locomotionAware)) &&
    finiteNumber(boy.actionTimer, 999) <= LOCOMOTION_SPEEDS.startWindowSeconds;
  const justStopped =
    speed <= LOCOMOTION_SPEEDS.idle &&
    targetDistance != null &&
    targetDistance <= LOCOMOTION_SPEEDS.approachDistance + 0.85 &&
    !isRestingLocomotion(actionKey, currentAction, goal) &&
    STOP_ACTIONS.includes(currentAction) &&
    finiteNumber(boy.actionTimer, 999) <= LOCOMOTION_SPEEDS.stopWindowSeconds;
  const turnInPlace =
    speed <= LOCOMOTION_SPEEDS.idle &&
    !justStopped &&
    !isRestingLocomotion(actionKey, currentAction, goal) &&
    Math.abs(facingError) >= LOCOMOTION_SPEEDS.turnAngle &&
    (target || actionKey === "arrivelookaround" || currentAction === "lookingaround" || currentAction === "idle");

  if (justStopped) {
    return locomotionDescriptor({
      state: "stop",
      clip: "Idle",
      overlay: "stopSettle",
      speed,
      routeAware,
      target,
      targetDistance,
      facingError,
      fadeSeconds: 0.2,
      timeScale: 0.9,
      fallbackReason:
        "stop/start uses RobotExpressive Idle with procedural settle; simulation position remains authoritative"
    });
  }

  if (turnInPlace) {
    return locomotionDescriptor({
      state: "turnInPlace",
      clip: "Idle",
      overlay: "turnInPlace",
      speed,
      routeAware,
      target,
      targetDistance,
      facingError,
      fadeSeconds: 0.16,
      timeScale: 1,
      fallbackReason:
        "turn-in-place uses RobotExpressive Idle with procedural torso/foot overlay and no root-motion translation"
    });
  }

  if (!movingAction || speed <= LOCOMOTION_SPEEDS.idle) {
    return locomotionDescriptor({
      state: "idle",
      clip: registered.clip || "Idle",
      clipCandidates: registered.clipCandidates || LOCOMOTION_CLIPS.idle,
      overlay: "",
      speed,
      routeAware,
      target,
      targetDistance,
      facingError,
      fadeSeconds: 0.22,
      timeScale: 1
    });
  }

  if (justStarted) {
    return locomotionDescriptor({
      state: "start",
      clip: "Walking",
      overlay: routeAware ? "routeStartStep" : "startStep",
      speed,
      routeAware,
      target,
      targetDistance,
      facingError,
      fadeSeconds: 0.12,
      timeScale: clamp(0.58 + speed * 0.58, 0.58, 1.02),
      fallbackReason:
        "start transition uses RobotExpressive Walking with procedural acceleration overlay; simulation drives displacement"
    });
  }

  if (speed >= LOCOMOTION_SPEEDS.normalWalk) {
    return locomotionDescriptor({
      state: "shortJog",
      clip: "Running",
      overlay: routeAware ? "routeJog" : "shortJog",
      speed,
      routeAware,
      target,
      targetDistance,
      facingError,
      fadeSeconds: 0.14,
      timeScale: clamp(0.82 + (speed - LOCOMOTION_SPEEDS.normalWalk) * 0.32, 0.82, 1.18),
      fallbackReason:
        "short jog uses RobotExpressive Running only when simulation velocity is in the jog band"
    });
  }

  if (targetDistance != null && targetDistance <= LOCOMOTION_SPEEDS.approachDistance) {
    return locomotionDescriptor({
      state: "approachTarget",
      clip: "Walking",
      overlay: routeAware ? "routeApproach" : "approachTarget",
      speed,
      routeAware,
      target,
      targetDistance,
      facingError,
      fadeSeconds: 0.18,
      timeScale: clamp(0.58 + speed * 0.48, 0.58, 0.86),
      fallbackReason:
        "approach uses RobotExpressive Walking slowed procedurally near the target; no imported approach clip"
    });
  }

  if (speed < LOCOMOTION_SPEEDS.slowWalk) {
    return locomotionDescriptor({
      state: "slowWalk",
      clip: "Walking",
      overlay: routeAware ? "routeSlowWalk" : "slowWalk",
      speed,
      routeAware,
      target,
      targetDistance,
      facingError,
      fadeSeconds: 0.18,
      timeScale: clamp(0.54 + speed * 0.68, 0.54, 0.84),
      fallbackReason:
        "slow walk uses RobotExpressive Walking with reduced time scale and procedural low-speed overlay"
    });
  }

  return locomotionDescriptor({
    state: "normalWalk",
    clip: registered.movingClip || "Walking",
    overlay: routeAware ? "routeWalk" : "normalWalk",
    speed,
    routeAware,
    target,
    targetDistance,
    facingError,
    fadeSeconds: 0.16,
    timeScale: clamp(0.88 + (speed - LOCOMOTION_SPEEDS.slowWalk) * 0.28, 0.88, 1.08)
  });
}

function locomotionDescriptor({
  state,
  clip,
  clipCandidates,
  overlay,
  speed,
  routeAware,
  target,
  targetDistance,
  facingError,
  fadeSeconds,
  timeScale,
  fallbackReason = ""
}) {
  const candidates = clipCandidates || LOCOMOTION_CLIPS[state] || [clip];
  return {
    state,
    clip,
    clipCandidates: cloneArray(candidates),
    overlay: overlay || "",
    speed: roundMetric(speed),
    routeAware: Boolean(routeAware),
    targetId: target ? target.id : "",
    targetDistance: targetDistance == null ? null : roundMetric(targetDistance),
    facingError: roundMetric(facingError || 0),
    turnAmount: roundMetric(clamp(facingError || 0, -0.92, 0.92)),
    timeScale: roundMetric(timeScale == null ? 1 : timeScale),
    fadeSeconds: roundMetric(fadeSeconds == null ? 0.18 : fadeSeconds),
    rootMotion: false,
    fallbackReason
  };
}

function bubbleBoySpeed(worldState) {
  const velocity = worldState && worldState.bubbleBoy ? worldState.bubbleBoy.velocity : null;
  if (!velocity || typeof velocity !== "object") return 0;
  const x = Number.isFinite(velocity.x) ? velocity.x : 0;
  const z = Number.isFinite(velocity.z) ? velocity.z : 0;
  return Math.hypot(x, z);
}

function resolveBubbleBoyTarget(worldState, boy) {
  const targetId = typeof boy.targetId === "string" ? boy.targetId : "";
  const directTarget = targetId ? findTargetById(worldState, targetId) : null;
  if (directTarget) return directTarget;

  const focus = boy.focus && typeof boy.focus === "object" ? boy.focus : null;
  if (focus && focus.position && finiteNumber(focus.strength, 0) >= 0.34) {
    return {
      id: focus.kind || "focus",
      position: focus.position
    };
  }

  const fishing = boy.fishing && typeof boy.fishing === "object" ? boy.fishing : null;
  if (targetId && fishing && fishing.targetPosition) {
    return {
      id: targetId,
      position: fishing.targetPosition
    };
  }

  return null;
}

function findTargetById(worldState, targetId) {
  if (!worldState || !targetId) return null;
  const stores = [worldState.objects, worldState.buildables];
  for (const store of stores) {
    if (!store || typeof store !== "object") continue;
    const candidate = store[targetId];
    if (candidate && candidate.position) {
      return {
        id: targetId,
        position: candidate.position
      };
    }
  }
  return null;
}

function distance2d(a, b) {
  if (!a || !b) return Infinity;
  const ax = finiteNumber(a.x, 0);
  const az = finiteNumber(a.z, 0);
  const bx = finiteNumber(b.x, ax);
  const bz = finiteNumber(b.z, az);
  return Math.hypot(bx - ax, bz - az);
}

function signedFacingError(boy, targetPosition) {
  const position = boy && boy.position ? boy.position : null;
  if (!position || !targetPosition) return 0;
  const dx = finiteNumber(targetPosition.x, 0) - finiteNumber(position.x, 0);
  const dz = finiteNumber(targetPosition.z, 0) - finiteNumber(position.z, 0);
  if (Math.hypot(dx, dz) <= 0.001) return 0;
  const desiredFacing = Math.atan2(-dx, -dz);
  return angleDistance(desiredFacing, finiteNumber(boy.facing, 0));
}

function angleDistance(target, current) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

function isRouteAware(actionKey, currentAction, goal) {
  return (
    actionKey.includes("route") ||
    currentAction.includes("route") ||
    goal.includes("route") ||
    goal === "camplayout" ||
    goal === "boatroute" ||
    goal === "raft"
  );
}

function isRestingLocomotion(actionKey, currentAction, goal) {
  return (
    actionKey.includes("sleep") ||
    actionKey.includes("rest") ||
    actionKey.includes("sit") ||
    actionKey.includes("lie") ||
    actionKey.includes("wake") ||
    actionKey.includes("settle") ||
    actionKey === "standupfromrest" ||
    currentAction.includes("sleep") ||
    currentAction.includes("rest") ||
    currentAction.includes("sit") ||
    currentAction.includes("lie") ||
    currentAction.includes("wake") ||
    currentAction.includes("settle") ||
    currentAction === "standupfromrest" ||
    goal.includes("sleep") ||
    goal.includes("rest") ||
    goal === "usebed"
  );
}

function restShelterSettleAction(worldState) {
  const rest = worldState && worldState.restShelter ? worldState.restShelter : {};
  const stage = typeof rest.stage === "string" ? rest.stage : "";
  const variant = typeof rest.variant === "string" ? rest.variant : "";
  const time = worldState && worldState.time ? worldState.time : {};
  const day = finiteNumber(time.day, 1);
  const buildables = worldState && worldState.buildables ? worldState.buildables : {};
  const bed = buildables.bed || {};
  const bedReady = Number(bed.progress || 0) >= 1 || Boolean(bed.completedAt);
  return stage === "bedUpgrade" || variant === "cozyBed" || day >= 21 || bedReady
    ? "settleIntoBed"
    : "settleIntoHammock";
}

function isEarlyDay(worldState) {
  const day = worldState && worldState.time ? finiteNumber(worldState.time.day, 1) : 1;
  return day >= 1 && day <= 5;
}

function normalizeLocomotionKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function finiteNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundMetric(value) {
  const number = finiteNumber(value, 0);
  return Math.round(number * 1000) / 1000;
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
