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
  "hammerStrike",
  "tieRopeVines",
  "placePlank",
  "pushPostUpright",
  "carveTool",
  "craftAtWorkbench",
  "inspectProgress",
  "repairShelter",
  "reinforceShelter",
  "sortMaterials",
  "depositStorage",
  "withdrawStorage",
  "tidyCamp",
  "sitNearFire",
  "restInsideShelter",
  "inspectCampLayout",
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
  "inspectTool",
  "rakePath",
  "clearPath",
  "sweepLeaves",
  "placeBoundaryStone",
  "kneelMarkZone",
  "walkRoute",
  "walkInspectRoute",
  "digGardenPlot",
  "plantSeed",
  "patSoil",
  "waterPlot",
  "inspectSprout",
  "harvestCrop",
  "carryHarvest",
  "storeHarvest",
  "prepMeal",
  "castFishingLine",
  "waitFishing",
  "reelFishingLine",
  "catchReaction",
  "fishFromPier",
  "setFishTrap",
  "checkFishTrap",
  "collectCatch",
  "hangCatchDryingRack",
  "carryRaftLog",
  "lashRaft",
  "pushRaft",
  "boardRaft",
  "sitAboardRaft",
  "standAboardRaft",
  "paddleRaft",
  "lookOutFromRaft",
  "disembarkRaft",
  "returnCelebrate",
  "craftToy",
  "placeToy",
  "playBlocks",
  "hopPlay",
  "kickBall",
  "tossBall",
  "launchKite",
  "holdKite",
  "spinTop",
  "putToyAway",
  "paintStone",
  "placeDecoration",
  "hangShellChime",
  "playDrum",
  "playFlute",
  "tapRhythm",
  "performAtDusk",
  "admireDisplay",
  "observeAnimal",
  "crouchNearAnimal",
  "offerFood",
  "slowWaveAnimal",
  "respondHappyAnimal",
  "avoidChasing",
  "returnToRoutine",
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
  "walkinspectroute",
  "walkinginspectroute",
  "carrybundle",
  "carryplank",
  "carrylog",
  "carryharvest",
  "carryraftlog"
]);

const MOVEMENT_GOALS = Object.freeze([
  "approachfire",
  "followintent",
  "walkroute",
  "walkinspectroute",
  "camplayout",
  "pathclearing",
  "pathwork",
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
  "clearpath",
  "sweepleaves",
  "placeboundarystone",
  "kneelmarkzone",
  "diggardenplot",
  "plantseed",
  "patsoil",
  "waterplot",
  "inspectsprout",
  "harvestcrop",
  "storeharvest",
  "prepmeal",
  "castfishingline",
  "waitfishing",
  "reelfishingline",
  "catchreaction",
  "fishfrompier",
  "setfishtrap",
  "checkfishtrap",
  "collectcatch",
  "hangcatchdryingrack",
  "lashraft",
  "pushraft",
  "boardraft",
  "sitaboardraft",
  "standaboardraft",
  "paddleraft",
  "lookoutfromraft",
  "disembarkraft",
  "returncelebrate",
  "crafttoy",
  "placetoy",
  "playblocks",
  "hopplay",
  "kickball",
  "tossball",
  "launchkite",
  "holdkite",
  "spintop",
  "puttoyaway",
  "paintstone",
  "placedecoration",
  "hangshellchime",
  "playdrum",
  "playflute",
  "taprhythm",
  "performatdusk",
  "admiredisplay",
  "observeanimal",
  "crouchnearanimal",
  "offerfood",
  "slowwaveanimal",
  "respondhappyanimal",
  "avoidchasing",
  "returntoroutine",
  "hammerstrike",
  "tieropevines",
  "placeplank",
  "pushpostupright",
  "carvetool",
  "inspectprogress",
  "repairshelter",
  "reinforceshelter",
  "sortmaterials",
  "depositstorage",
  "withdrawstorage",
  "tidycamp",
  "sitnearfire",
  "restinsideshelter",
  "inspectcamplayout",
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
    locomotionAware: false,
    semanticAction: "tieRopeVines",
    fallbackReason: "legacy hammock build maps to RobotExpressive Punch with procedural tie/build overlay"
  },
  hammerStrike: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "hammerStrike",
    locomotionAware: false,
    semanticAction: "hammerStrike",
    fallbackReason: "hammer/strike uses RobotExpressive Punch with a planted-feet upper-body work overlay"
  },
  tieRopeVines: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "tieRopeVines",
    locomotionAware: false,
    semanticAction: "tieRopeVines",
    fallbackReason: "tying rope/vines uses RobotExpressive Punch with procedural two-hand lashing overlay"
  },
  placePlank: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "placePlank",
    locomotionAware: false,
    semanticAction: "placePlank",
    fallbackReason: "place plank uses RobotExpressive Punch with procedural reach/place overlay; no root motion"
  },
  pushPostUpright: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "pushPostUpright",
    locomotionAware: false,
    semanticAction: "pushPostUpright",
    fallbackReason: "push post upright uses a planted-feet procedural push overlay layered on RobotExpressive Idle/Punch"
  },
  carveTool: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "carveTool",
    locomotionAware: false,
    semanticAction: "carveTool",
    fallbackReason: "carve/craft tool uses RobotExpressive Punch with a small repeated hand-tool overlay"
  },
  inspectProgress: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "inspectProgress",
    locomotionAware: false,
    semanticAction: "inspectProgress",
    fallbackReason: "inspect progress uses RobotExpressive Yes with procedural lean/gaze toward the buildable"
  },
  repairShelter: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "repairShelter",
    locomotionAware: false,
    semanticAction: "repairShelter",
    fallbackReason: "repair shelter uses RobotExpressive Punch with procedural patching overlay; position remains simulation-owned"
  },
  reinforceShelter: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "reinforceShelter",
    locomotionAware: false,
    semanticAction: "reinforceShelter",
    fallbackReason: "reinforce shelter uses RobotExpressive Punch with procedural bracing/tying overlay and no root motion"
  },
  sortMaterials: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "sortMaterials",
    locomotionAware: false,
    semanticAction: "sortMaterials",
    fallbackReason: "sort materials uses RobotExpressive Sitting/Punch with procedural reach-and-sort overlay"
  },
  depositStorage: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "depositStorage",
    locomotionAware: false,
    semanticAction: "depositStorage",
    fallbackReason: "deposit storage uses RobotExpressive Punch with a procedural hand-to-basket overlay; no root motion"
  },
  withdrawStorage: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "withdrawStorage",
    locomotionAware: false,
    semanticAction: "withdrawStorage",
    fallbackReason: "withdraw storage uses RobotExpressive Punch with a procedural reach-and-lift overlay"
  },
  tidyCamp: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "tidyCamp",
    locomotionAware: false,
    semanticAction: "tidyCamp",
    fallbackReason: "tidy camp uses RobotExpressive Punch with a small planted upper-body arranging overlay"
  },
  sitNearFire: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "sitNearFire",
    locomotionAware: false,
    semanticAction: "sitNearFire",
    fallbackReason: "sit near fire uses RobotExpressive Sitting with a quiet procedural seated/fire-facing overlay"
  },
  restInsideShelter: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "restInsideShelter",
    locomotionAware: false,
    semanticAction: "restInsideShelter",
    fallbackReason: "rest inside shelter uses RobotExpressive Sitting with a sheltered rest overlay and no root motion"
  },
  inspectCampLayout: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "inspectCampLayout",
    locomotionAware: false,
    semanticAction: "inspectCampLayout",
    fallbackReason: "inspect camp layout uses RobotExpressive Yes with procedural scan/plan overlay"
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
  clearPath: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "pathClear",
    locomotionAware: false,
    semanticAction: "clearPath",
    fallbackReason: "no imported clearing clip; using RobotExpressive Punch with procedural tool-ground overlay"
  },
  sweepLeaves: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "pathSweep",
    locomotionAware: false,
    semanticAction: "sweepLeaves",
    fallbackReason: "no imported sweeping clip; using RobotExpressive Punch with procedural sweep overlay"
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
  kneelMarkZone: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "kneelMarkZone",
    locomotionAware: false,
    semanticAction: "kneelMarkZone",
    fallbackReason: "no imported zone marking clip; using Sitting with a procedural kneel/marker overlay"
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
  walkInspectRoute: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "routeInspect",
    locomotionAware: true,
    semanticAction: "walkInspectRoute",
    fallbackReason: "route inspection is simulation-owned; using existing Walking clip only when velocity is present"
  },
  digGardenPlot: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "gardenDig",
    locomotionAware: false,
    semanticAction: "digGardenPlot",
    fallbackReason: "no imported garden digging clip; using RobotExpressive Sitting with procedural crouch/dig overlay"
  },
  plantSeed: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "gardenPlantSeed",
    locomotionAware: false,
    semanticAction: "plantSeed",
    fallbackReason: "no imported seed planting clip; using RobotExpressive Sitting with procedural seed/drop overlay"
  },
  patSoil: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "gardenPatSoil",
    locomotionAware: false,
    semanticAction: "patSoil",
    fallbackReason: "no imported soil pat clip; using RobotExpressive Sitting with procedural soil-pat overlay"
  },
  waterPlot: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "gardenWatering",
    locomotionAware: false,
    semanticAction: "waterPlot",
    fallbackReason: "no imported watering clip; using Idle with procedural one-handed pour overlay"
  },
  inspectSprout: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Yes",
    proceduralOverlay: "gardenInspect",
    locomotionAware: false,
    semanticAction: "inspectSprout",
    fallbackReason: "no imported sprout inspect clip; using Idle with procedural look-down overlay"
  },
  harvestCrop: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "gardenHarvest",
    locomotionAware: false,
    semanticAction: "harvestCrop",
    fallbackReason: "no imported harvest clip; using Sitting with procedural reach-and-pluck overlay"
  },
  carryHarvest: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "carryHarvest",
    locomotionAware: true,
    semanticAction: "carryHarvest",
    fallbackReason: "harvest carry uses existing Idle/Walking clips; simulation position remains authoritative"
  },
  storeHarvest: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "storeHarvest",
    locomotionAware: false,
    semanticAction: "storeHarvest",
    fallbackReason: "no imported store-harvest clip; using Idle with procedural hand-to-basket overlay"
  },
  prepMeal: {
    clip: "Idle",
    clipCandidates: ["Idle", "Sitting"],
    emote: "Punch",
    proceduralOverlay: "prepMeal",
    locomotionAware: false,
    semanticAction: "prepMeal",
    fallbackReason: "no imported meal-prep clip; using Idle with procedural food-prep/cook overlay"
  },
  castFishingLine: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "fishCast",
    locomotionAware: false,
    semanticAction: "castFishingLine",
    fallbackReason: "fishing cast uses RobotExpressive Punch with a planted rod-cast overlay; no root motion"
  },
  waitFishing: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "fishWait",
    locomotionAware: false,
    semanticAction: "waitFishing",
    fallbackReason: "fishing wait uses RobotExpressive Idle with a still rod-watch overlay"
  },
  reelFishingLine: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "fishReel",
    locomotionAware: false,
    semanticAction: "reelFishingLine",
    fallbackReason: "fishing reel uses RobotExpressive Punch with a two-hand reel overlay; no root motion"
  },
  catchReaction: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "fishCatchReaction",
    locomotionAware: false,
    semanticAction: "catchReaction",
    fallbackReason: "catch reaction uses RobotExpressive ThumbsUp with a small catch-present overlay"
  },
  fishFromPier: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "pierFish",
    locomotionAware: false,
    semanticAction: "fishFromPier",
    fallbackReason: "pier fishing uses existing Idle/Punch clips with a staged rod overlay; pier placement stays visual-only"
  },
  setFishTrap: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "setFishTrap",
    locomotionAware: false,
    semanticAction: "setFishTrap",
    fallbackReason: "set trap uses RobotExpressive Sitting/Punch with a crouched trap-placement overlay"
  },
  checkFishTrap: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "checkFishTrap",
    locomotionAware: false,
    semanticAction: "checkFishTrap",
    fallbackReason: "check trap uses RobotExpressive Sitting/Punch with a crouched inspection overlay"
  },
  collectCatch: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "collectCatch",
    locomotionAware: false,
    semanticAction: "collectCatch",
    fallbackReason: "collect catch uses RobotExpressive Sitting/Punch with a hand-to-catch overlay"
  },
  hangCatchDryingRack: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "hangCatchDryingRack",
    locomotionAware: false,
    semanticAction: "hangCatchDryingRack",
    fallbackReason: "hang catch uses RobotExpressive Punch with a reach-to-rack overlay; drying rack remains visual-only"
  },
  carryRaftLog: {
    clip: "Idle",
    movingClip: "Walking",
    clipCandidates: ["Walking", "Idle"],
    emote: null,
    proceduralOverlay: "carryRaftLog",
    locomotionAware: true,
    semanticAction: "carryRaftLog",
    fallbackReason: "raft log carry uses existing Idle/Walking clips with a two-hand procedural overlay; simulation owns movement"
  },
  lashRaft: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "raftLash",
    locomotionAware: false,
    semanticAction: "lashRaft",
    fallbackReason: "raft lashing uses RobotExpressive Punch with a planted two-hand rope overlay; no root motion"
  },
  pushRaft: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "raftPush",
    locomotionAware: false,
    semanticAction: "pushRaft",
    fallbackReason: "push raft uses RobotExpressive Punch with a procedural forward-press overlay; raft placement stays visual-only"
  },
  boardRaft: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "raftBoard",
    locomotionAware: false,
    semanticAction: "boardRaft",
    fallbackReason: "boarding is a no-translation procedural step/brace pose; simulation position remains authoritative"
  },
  sitAboardRaft: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: null,
    proceduralOverlay: "raftSitAboard",
    locomotionAware: false,
    semanticAction: "sitAboardRaft",
    fallbackReason: "sit aboard reuses RobotExpressive Sitting with a restrained raft-seat overlay"
  },
  standAboardRaft: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "raftStandAboard",
    locomotionAware: false,
    semanticAction: "standAboardRaft",
    fallbackReason: "stand aboard returns to Idle/Standing with a small balance overlay and no root motion"
  },
  paddleRaft: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "raftPaddle",
    locomotionAware: false,
    semanticAction: "paddleRaft",
    fallbackReason: "paddling uses RobotExpressive Sitting/Punch with a procedural oar stroke; raft travel remains visual-only"
  },
  lookOutFromRaft: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "raftLookOut",
    locomotionAware: false,
    semanticAction: "lookOutFromRaft",
    fallbackReason: "look-out uses RobotExpressive Yes with a procedural horizon scan overlay"
  },
  disembarkRaft: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "raftDisembark",
    locomotionAware: false,
    semanticAction: "disembarkRaft",
    fallbackReason: "disembark is a planted brace/step pose; no animation root-motion translation"
  },
  returnCelebrate: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "returnCelebrate",
    locomotionAware: false,
    semanticAction: "returnCelebrate",
    fallbackReason: "return celebration uses RobotExpressive ThumbsUp with a quiet procedural lift"
  },
  craftToy: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "toyCraft",
    locomotionAware: false,
    semanticAction: "craftToy",
    fallbackReason: "toy crafting is a visual-only seated hand-work overlay using RobotExpressive Sitting/Punch; no root motion"
  },
  placeToy: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "toyPlace",
    locomotionAware: false,
    semanticAction: "placeToy",
    fallbackReason: "place toy uses a procedural hands-to-mat overlay; simulation position remains authoritative"
  },
  playBlocks: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "playBlocks",
    locomotionAware: false,
    semanticAction: "playBlocks",
    fallbackReason: "block play reuses RobotExpressive Sitting with a small procedural reaching/sorting overlay"
  },
  hopPlay: {
    clip: "Idle",
    clipCandidates: ["Jump", "WalkJump", "Idle"],
    emote: "Jump",
    proceduralOverlay: "hopPlay",
    locomotionAware: false,
    semanticAction: "hopPlay",
    fallbackReason: "short playful hop uses RobotExpressive Jump when available plus a visual-only bounce overlay; no root translation"
  },
  kickBall: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Jump",
    proceduralOverlay: "kickBall",
    locomotionAware: false,
    semanticAction: "kickBall",
    fallbackReason: "kick ball is a planted procedural leg/upper-body cue with a hand-held ball fallback; no physics or root motion"
  },
  tossBall: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "tossBall",
    locomotionAware: false,
    semanticAction: "tossBall",
    fallbackReason: "toss ball uses RobotExpressive Punch with a small throw overlay; ball motion stays presentation-only"
  },
  launchKite: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "launchKite",
    locomotionAware: false,
    semanticAction: "launchKite",
    fallbackReason: "kite launch uses RobotExpressive Punch with raised-hand string overlay; no kite physics or root motion"
  },
  holdKite: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "holdKite",
    locomotionAware: false,
    semanticAction: "holdKite",
    fallbackReason: "wind-reactive kite holding is a procedural upper-body sway layered on RobotExpressive Idle"
  },
  spinTop: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "spinTop",
    locomotionAware: false,
    semanticAction: "spinTop",
    fallbackReason: "spinning top uses RobotExpressive Sitting/Punch with a small hand-to-ground spin overlay"
  },
  putToyAway: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "putToyAway",
    locomotionAware: false,
    semanticAction: "putToyAway",
    fallbackReason: "put toy away uses a procedural hands-to-slot overlay with action-gated attachments"
  },
  paintStone: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "paintStone",
    locomotionAware: false,
    semanticAction: "paintStone",
    fallbackReason: "paint stone reuses RobotExpressive Sitting/Punch with a close hand-detail overlay; no root motion"
  },
  placeDecoration: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "placeDecoration",
    locomotionAware: false,
    semanticAction: "placeDecoration",
    fallbackReason: "place decoration uses a procedural hands-to-display overlay; decoration state remains visual-only"
  },
  hangShellChime: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "hangShellChime",
    locomotionAware: false,
    semanticAction: "hangShellChime",
    fallbackReason: "hang shell chime uses raised-hand Punch/Idle layering against the existing chime prop; no translation"
  },
  playDrum: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "playDrum",
    locomotionAware: false,
    semanticAction: "playDrum",
    fallbackReason: "drum play uses RobotExpressive Sitting/Punch with rhythmic upper-body taps; no audio or root motion"
  },
  playFlute: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "playFlute",
    locomotionAware: false,
    semanticAction: "playFlute",
    fallbackReason: "flute play is a two-hand upper-body pose layered on Idle/Standing; no sound engine changes"
  },
  tapRhythm: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Punch",
    proceduralOverlay: "tapRhythm",
    locomotionAware: false,
    semanticAction: "tapRhythm",
    fallbackReason: "tap rhythm uses a bounded procedural hand pulse; no rhythm gameplay or root motion"
  },
  performAtDusk: {
    clip: "Idle",
    clipCandidates: ["Dance", "Idle", "Standing"],
    emote: "Dance",
    proceduralOverlay: "performAtDusk",
    locomotionAware: false,
    semanticAction: "performAtDusk",
    fallbackReason: "dusk performance prefers RobotExpressive Dance when available with a restrained no-translation overlay"
  },
  admireDisplay: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "admireDisplay",
    locomotionAware: false,
    semanticAction: "admireDisplay",
    fallbackReason: "admire display uses RobotExpressive Yes with a small look-and-nod overlay"
  },
  observeAnimal: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Yes",
    proceduralOverlay: "animalObserve",
    locomotionAware: false,
    semanticAction: "observeAnimal",
    fallbackReason: "observe animal uses RobotExpressive Idle/Yes with a quiet gaze overlay; animal visitor remains visual-only"
  },
  crouchNearAnimal: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "animalCrouch",
    locomotionAware: false,
    semanticAction: "crouchNearAnimal",
    fallbackReason: "crouch near animal reuses Sitting with a gentle procedural crouch/reach pose and no translation"
  },
  offerFood: {
    clip: "Sitting",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Punch",
    proceduralOverlay: "animalOfferFood",
    locomotionAware: false,
    semanticAction: "offerFood",
    fallbackReason: "offer food uses RobotExpressive Sitting/Punch plus an action-gated food attachment; no feeding mechanics"
  },
  slowWaveAnimal: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "Wave",
    proceduralOverlay: "animalSlowWave",
    locomotionAware: false,
    semanticAction: "slowWaveAnimal",
    fallbackReason: "slow animal wave reuses RobotExpressive Wave with reduced procedural amplitude"
  },
  respondHappyAnimal: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "animalHappy",
    locomotionAware: false,
    semanticAction: "respondHappyAnimal",
    fallbackReason: "happy response uses RobotExpressive ThumbsUp with a small upper-body lift and no root motion"
  },
  avoidChasing: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "No",
    proceduralOverlay: "animalAvoidChasing",
    locomotionAware: false,
    semanticAction: "avoidChasing",
    fallbackReason: "avoid chasing is a planted No/Idle restraint cue; it does not add chase, collision, or pathing behavior"
  },
  returnToRoutine: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: null,
    proceduralOverlay: "animalReturnRoutine",
    locomotionAware: false,
    semanticAction: "returnToRoutine",
    fallbackReason: "return to routine fades back to RobotExpressive Idle with a settling overlay and no simulation changes"
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
  building: "hammerStrike",
  hammering: "hammerStrike",
  hammerStrike: "hammerStrike",
  tyingRope: "tieRopeVines",
  tyingVines: "tieRopeVines",
  tieRope: "tieRopeVines",
  tieVines: "tieRopeVines",
  tieRopeVines: "tieRopeVines",
  placingPlank: "placePlank",
  placePlank: "placePlank",
  pushingPost: "pushPostUpright",
  pushPost: "pushPostUpright",
  pushPostUpright: "pushPostUpright",
  carvingTool: "carveTool",
  carveTool: "carveTool",
  inspectingProgress: "inspectProgress",
  inspectProgress: "inspectProgress",
  repairingShelter: "repairShelter",
  repairShelter: "repairShelter",
  reinforcingShelter: "reinforceShelter",
  reinforceShelter: "reinforceShelter",
  sortMaterials: "sortMaterials",
  sortingMaterials: "sortMaterials",
  sortingStorage: "sortMaterials",
  depositStorage: "depositStorage",
  depositingStorage: "depositStorage",
  withdrawStorage: "withdrawStorage",
  withdrawingStorage: "withdrawStorage",
  tidyCamp: "tidyCamp",
  tidyingCamp: "tidyCamp",
  sitNearFire: "sitNearFire",
  sittingNearFire: "sitNearFire",
  restInsideShelter: "restInsideShelter",
  restingInsideShelter: "restInsideShelter",
  inspectCampLayout: "inspectCampLayout",
  inspectingCampLayout: "inspectCampLayout",
  depositingMaterial: "depositMaterial",
  depositingMaterials: "depositMaterials",
  setDownMaterial: "setItemDown",
  craftingTool: "craftAtWorkbench",
  craftingAtWorkbench: "craftAtWorkbench",
  inspectingTool: "inspectTool",
  rakingPath: "rakePath",
  clearPath: "clearPath",
  clearingPath: "clearPath",
  pathClearing: "clearPath",
  sweepLeaves: "sweepLeaves",
  sweepingLeaves: "sweepLeaves",
  sweepPath: "sweepLeaves",
  placingBoundaryStone: "placeBoundaryStone",
  kneelMarkZone: "kneelMarkZone",
  kneelingMarkZone: "kneelMarkZone",
  markZone: "kneelMarkZone",
  walkingRoute: "walkRoute",
  walkInspectRoute: "walkInspectRoute",
  walkingInspectRoute: "walkInspectRoute",
  inspectRoute: "walkInspectRoute",
  digGardenPlot: "digGardenPlot",
  diggingGardenPlot: "digGardenPlot",
  diggingPlot: "digGardenPlot",
  plantingSeeds: "plantSeed",
  plantSeeds: "plantSeed",
  plantSeed: "plantSeed",
  patSoil: "patSoil",
  pattingSoil: "patSoil",
  wateringGarden: "waterPlot",
  waterGarden: "waterPlot",
  waterPlot: "waterPlot",
  harvestingCrop: "harvestCrop",
  harvestCrop: "harvestCrop",
  carryHarvest: "carryHarvest",
  carryingHarvest: "carryHarvest",
  storeHarvest: "storeHarvest",
  storingHarvest: "storeHarvest",
  prepMeal: "prepMeal",
  preparingMeal: "prepMeal",
  foodPrep: "prepMeal",
  castFishingLine: "castFishingLine",
  castingFishingLine: "castFishingLine",
  castLine: "castFishingLine",
  fishingCast: "castFishingLine",
  waitFishing: "waitFishing",
  waitingFishing: "waitFishing",
  fishingWait: "waitFishing",
  fishing: "waitFishing",
  reelFishingLine: "reelFishingLine",
  reelingFishingLine: "reelFishingLine",
  reelLine: "reelFishingLine",
  catchReaction: "catchReaction",
  fishCatchReaction: "catchReaction",
  caughtFish: "catchReaction",
  fishFromPier: "fishFromPier",
  pierFishing: "fishFromPier",
  fishingFromPier: "fishFromPier",
  setFishTrap: "setFishTrap",
  settingFishTrap: "setFishTrap",
  checkFishTrap: "checkFishTrap",
  checkingFishTrap: "checkFishTrap",
  collectCatch: "collectCatch",
  collectFishTrap: "collectCatch",
  collectingCatch: "collectCatch",
  hangCatchDryingRack: "hangCatchDryingRack",
  dryTrapCatch: "hangCatchDryingRack",
  hangCatch: "hangCatchDryingRack",
  carryRaftLog: "carryRaftLog",
  carryingRaftLog: "carryRaftLog",
  carryLogs: "carryRaftLog",
  carryingLogs: "carryRaftLog",
  raftLogCarry: "carryRaftLog",
  lashRaft: "lashRaft",
  lashingRaft: "lashRaft",
  tieRaft: "lashRaft",
  tyingRaft: "lashRaft",
  raftLash: "lashRaft",
  pushRaft: "pushRaft",
  pushingRaft: "pushRaft",
  launchRaft: "pushRaft",
  launchingRaft: "pushRaft",
  boardRaft: "boardRaft",
  boardingRaft: "boardRaft",
  sitAboardRaft: "sitAboardRaft",
  sittingAboardRaft: "sitAboardRaft",
  standAboardRaft: "standAboardRaft",
  standingAboardRaft: "standAboardRaft",
  paddleRaft: "paddleRaft",
  paddlingRaft: "paddleRaft",
  rowRaft: "paddleRaft",
  rowingRaft: "paddleRaft",
  lookOutFromRaft: "lookOutFromRaft",
  lookoutFromRaft: "lookOutFromRaft",
  raftLookout: "lookOutFromRaft",
  disembarkRaft: "disembarkRaft",
  disembarkingRaft: "disembarkRaft",
  returnRaft: "disembarkRaft",
  returnCelebrate: "returnCelebrate",
  returningCelebrate: "returnCelebrate",
  raftCelebrate: "returnCelebrate",
  craftToy: "craftToy",
  craftingToy: "craftToy",
  toyCraft: "craftToy",
  placeToy: "placeToy",
  placingToy: "placeToy",
  toyPlace: "placeToy",
  playBlocks: "playBlocks",
  playingBlocks: "playBlocks",
  blockPlay: "playBlocks",
  hopPlay: "hopPlay",
  playfulHop: "hopPlay",
  kickBall: "kickBall",
  kickingBall: "kickBall",
  tossBall: "tossBall",
  throwingBall: "tossBall",
  launchKite: "launchKite",
  flyingKite: "launchKite",
  holdKite: "holdKite",
  kiteHold: "holdKite",
  spinTop: "spinTop",
  spinningTop: "spinTop",
  putToyAway: "putToyAway",
  puttingToyAway: "putToyAway",
  paintStone: "paintStone",
  paintingStone: "paintStone",
  stonePainting: "paintStone",
  placeDecoration: "placeDecoration",
  placingDecoration: "placeDecoration",
  arrangeDecor: "placeDecoration",
  hangShellChime: "hangShellChime",
  hangingShellChime: "hangShellChime",
  inspectShellChime: "hangShellChime",
  playDrum: "playDrum",
  drumming: "playDrum",
  playFlute: "playFlute",
  playingFlute: "playFlute",
  tapRhythm: "tapRhythm",
  tappingRhythm: "tapRhythm",
  performAtDusk: "performAtDusk",
  duskPerformance: "performAtDusk",
  admireDisplay: "admireDisplay",
  inspectMusicArt: "admireDisplay",
  observeAnimal: "observeAnimal",
  observingAnimal: "observeAnimal",
  observeAnimalVisitor: "observeAnimal",
  watchBirdVisitor: "observeAnimal",
  watchFishVisitor: "observeAnimal",
  inspectAnimalVisitor: "observeAnimal",
  crouchNearAnimal: "crouchNearAnimal",
  crouchingNearAnimal: "crouchNearAnimal",
  animalCrouch: "crouchNearAnimal",
  offerFood: "offerFood",
  offeringFood: "offerFood",
  feedAnimalVisitor: "offerFood",
  slowWaveAnimal: "slowWaveAnimal",
  slowAnimalWave: "slowWaveAnimal",
  animalWave: "slowWaveAnimal",
  respondHappyAnimal: "respondHappyAnimal",
  animalHappy: "respondHappyAnimal",
  happyAnimalResponse: "respondHappyAnimal",
  avoidChasing: "avoidChasing",
  avoidChase: "avoidChasing",
  noChase: "avoidChasing",
  returnToRoutine: "returnToRoutine",
  returningToRoutine: "returnToRoutine",
  animalReturnRoutine: "returnToRoutine",
  inspectSprout: "inspectSprout",
  inspectingSprout: "inspectSprout",
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
  playToy: "playBlocks",
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
  const toyPlayAction = resolveToyPlayPresentationAction(boy, currentAction, goal, worldState);
  if (toyPlayAction) return toyPlayAction;

  const musicArtAction = resolveMusicArtDecorPresentationAction(boy, currentAction, goal, worldState);
  if (musicArtAction) return musicArtAction;

  const animalFamiliarAction = resolveAnimalFamiliarVisitorPresentationAction(boy, currentAction, goal, worldState);
  if (animalFamiliarAction) return animalFamiliarAction;

  const buildAction = resolveBuildPresentationAction(boy, currentAction, goal, worldState);
  if (buildAction) return buildAction;

  const attentionAction = resolveAttentionPresentationAction(boy, currentAction, goal, worldState);
  if (attentionAction) return attentionAction;

  const storageSittingAction = resolveCampStorageSittingPresentationAction(boy, currentAction, goal);
  if (storageSittingAction) return storageSittingAction;

  const pathGroundWorkAction = resolvePathGroundWorkPresentationAction(boy, currentAction, goal, worldState);
  if (pathGroundWorkAction) return pathGroundWorkAction;

  const gardenFoodPrepAction = resolveGardenFoodPrepPresentationAction(boy, currentAction, goal, worldState);
  if (gardenFoodPrepAction) return gardenFoodPrepAction;

  const fishingTrapPierAction = resolveFishingTrapPierPresentationAction(boy, currentAction, goal, worldState);
  if (fishingTrapPierAction) return fishingTrapPierAction;

  const raftBoatRouteAction = resolveRaftBoatRoutePresentationAction(boy, currentAction, goal, worldState);
  if (raftBoatRouteAction) return raftBoatRouteAction;

  if (currentAction === "sleep" || goal === "sleep") return "sleepLoop";
  if (goal === "useBed" && currentAction !== "walking") return restShelterSettleAction(worldState);
  if (currentAction === "wake" || goal === "wake") return "wake";
  if (currentAction === "stretch" || goal === "wakeStretch") return "wakeStretch";
  if (currentAction === "rest" || currentAction === "resting" || currentAction === "sitting" || goal === "rest") {
    return "sitRestSpot";
  }
  if (goal === "storage") return resolveStorageWorkAction(boy, currentAction);
  if (goal === "craft") return "craftAtWorkbench";
  if (goal === "repairShelter") return "repairShelter";
  if (goal === "reinforceShelter") return "reinforceShelter";
  if (goal === "inspectProgress") return "inspectProgress";
  if (goal === "inspectTool") return "inspectTool";
  if (goal === "campLayout" || goal === "rakePath") return "rakePath";
  if (goal === "walkRoute") return "walkRoute";
  if (goal === "garden" || goal === "planting") return "plantSeed";
  if (goal === "watering") return "waterPlot";
  if (goal === "harvesting") return "harvestCrop";
  if (goal === "inspectingGarden") return "inspectSprout";
  if (goal === "tendFire" || goal === "fireCare" || goal === "warmth") return "warmHands";
  if (goal === "cooking" || goal === "foodRoutine") {
    if (currentAction === "idle" || currentAction === "lookingAround") return "cookMeal";
  }
  if (goal === "cookFish") return "cookFish";

  const builderAction = boy.builder && typeof boy.builder.actionState === "string" ? boy.builder.actionState : "";
  if (builderAction === "sleep") return "sleepLoop";
  if (builderAction === "gather") return "gatherLooseSupplies";
  if (builderAction === "construct") return resolveBuildWorkAction(worldState);

  const targetId = typeof boy.targetId === "string" ? boy.targetId : "";
  if (targetId === "fire-pit" && currentAction === "walking") return "carryBundle";
  if (targetId === "fire-pit" && currentAction !== "walking") return "warmHands";

  return LEGACY_ACTION_PRESENTATION_MAP[currentAction] || "arriveLookAround";
}

function resolveToyPlayPresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const directAction = resolveToyPlayKey(actionKey);
  if (directAction) return directAction;

  if (
    goalKey === "toyplayset" ||
    goalKey === "toyplay" ||
    goalKey === "playtoy" ||
    goalKey === "toys" ||
    goalKey === "toy"
  ) {
    return resolveToyPlayAction(boy, currentAction, worldState);
  }
  return "";
}

function resolveToyPlayAction(boy, currentAction, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  if (
    actionKey === "walking" ||
    actionKey === "walk" ||
    actionKey === "running" ||
    actionKey === "run" ||
    actionKey === "jogging" ||
    actionKey === "jog" ||
    actionKey === "idle" ||
    actionKey === "lookingaround"
  ) {
    return "";
  }

  const toy = boy && boy.toy && typeof boy.toy === "object" ? boy.toy : {};
  const play = boy && boy.play && typeof boy.play === "object" ? boy.play : {};
  const toyPlaySet = worldState && worldState.toyPlaySet && typeof worldState.toyPlaySet === "object"
    ? worldState.toyPlaySet
    : {};
  const hint = normalizeLocomotionKey(
    toy.action ||
      toy.actionState ||
      toy.intent ||
      toy.phase ||
      play.action ||
      play.actionState ||
      play.intent ||
      play.phase ||
      toyPlaySet.action ||
      toyPlaySet.actionState ||
      toyPlaySet.intent ||
      toyPlaySet.phase
  );
  const hintedAction = resolveToyPlayKey(hint || actionKey);
  if (hintedAction) return hintedAction;

  const carriedObject = normalizeLocomotionKey(boy && boy.carriedObject);
  const carrying = normalizeLocomotionKey(boy && boy.carrying);
  const heldTool = boy && boy.toolInventory && typeof boy.toolInventory === "object"
    ? normalizeLocomotionKey(boy.toolInventory.heldTool)
    : "";
  if (carriedObject === "toyball" || carrying === "toyball" || carriedObject === "ball" || carrying === "ball") {
    return "tossBall";
  }
  if (
    carriedObject === "toykite" ||
    carrying === "toykite" ||
    carriedObject === "kite" ||
    carrying === "kite" ||
    heldTool === "kite" ||
    heldTool === "kitehandle"
  ) {
    return "holdKite";
  }
  if (
    carriedObject === "spinningtop" ||
    carrying === "spinningtop" ||
    carriedObject === "top" ||
    carrying === "top"
  ) {
    return "spinTop";
  }
  if (
    carriedObject === "toyblock" ||
    carrying === "toyblock" ||
    carriedObject === "toyblocks" ||
    carrying === "toyblocks" ||
    carriedObject === "block" ||
    carrying === "block"
  ) {
    return "playBlocks";
  }

  const stage = normalizeLocomotionKey(toyPlaySet.stage || toyPlaySet.variant);
  if (stage === "kiteday" || stage === "kiteballtop") return "launchKite";
  if (stage === "collection" || stage === "collectionslots") return "craftToy";
  if (stage === "matlayout" || stage === "playmatlayout") return "placeToy";
  return "playBlocks";
}

function resolveToyPlayKey(key) {
  if (
    key === "crafttoy" ||
    key === "craftingtoy" ||
    key === "toycraft" ||
    key === "crafttoys" ||
    key === "maketoy"
  ) return "craftToy";
  if (
    key === "placetoy" ||
    key === "placingtoy" ||
    key === "toyplace" ||
    key === "settoy" ||
    key === "toysetdown"
  ) return "placeToy";
  if (
    key === "playtoy" ||
    key === "playblocks" ||
    key === "playingblocks" ||
    key === "blockplay" ||
    key === "blocks"
  ) return "playBlocks";
  if (
    key === "hopplay" ||
    key === "playfulhop" ||
    key === "hop" ||
    key === "jump" ||
    key === "jumphop"
  ) return "hopPlay";
  if (key === "kickball" || key === "kickingball" || key === "kick") return "kickBall";
  if (
    key === "tossball" ||
    key === "throwball" ||
    key === "throwingball" ||
    key === "balltoss" ||
    key === "toss"
  ) return "tossBall";
  if (
    key === "launchkite" ||
    key === "flykite" ||
    key === "flyingkite" ||
    key === "kitefly" ||
    key === "kite"
  ) return "launchKite";
  if (
    key === "holdkite" ||
    key === "holdingkite" ||
    key === "kitehold" ||
    key === "kitehandle" ||
    key === "windkite"
  ) return "holdKite";
  if (
    key === "spintop" ||
    key === "spinningtop" ||
    key === "spinspinningtop" ||
    key === "topspin" ||
    key === "top"
  ) return "spinTop";
  if (
    key === "puttoyaway" ||
    key === "putawaytoy" ||
    key === "putaway" ||
    key === "storetoy" ||
    key === "tidytoys"
  ) return "putToyAway";
  return "";
}

function resolveMusicArtDecorPresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const directAction = resolveMusicArtDecorKey(actionKey);
  if (directAction) return directAction;

  if (
    goalKey === "musicartdecor" ||
    goalKey === "decornook" ||
    goalKey === "duskperformance" ||
    goalKey === "performance" ||
    goalKey === "music" ||
    goalKey === "art" ||
    goalKey === "decoration" ||
    goalKey === "decor"
  ) {
    return resolveMusicArtDecorAction(boy, currentAction, worldState);
  }
  return "";
}

function resolveMusicArtDecorAction(boy, currentAction, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  if (
    actionKey === "walking" ||
    actionKey === "walk" ||
    actionKey === "running" ||
    actionKey === "run" ||
    actionKey === "jogging" ||
    actionKey === "jog" ||
    actionKey === "idle" ||
    actionKey === "lookingaround"
  ) {
    return "";
  }

  const music = boy && boy.music && typeof boy.music === "object" ? boy.music : {};
  const art = boy && boy.art && typeof boy.art === "object" ? boy.art : {};
  const decor = boy && boy.decor && typeof boy.decor === "object" ? boy.decor : {};
  const performance = boy && boy.performance && typeof boy.performance === "object" ? boy.performance : {};
  const musicArtDecor = worldState && worldState.musicArtDecor && typeof worldState.musicArtDecor === "object"
    ? worldState.musicArtDecor
    : {};
  const hint = normalizeLocomotionKey(
    music.action ||
      music.actionState ||
      music.intent ||
      music.phase ||
      art.action ||
      art.actionState ||
      art.intent ||
      art.phase ||
      decor.action ||
      decor.actionState ||
      decor.intent ||
      decor.phase ||
      performance.action ||
      performance.actionState ||
      performance.intent ||
      performance.phase ||
      musicArtDecor.action ||
      musicArtDecor.actionState ||
      musicArtDecor.intent ||
      musicArtDecor.phase
  );
  const hintedAction = resolveMusicArtDecorKey(hint || actionKey);
  if (hintedAction) return hintedAction;

  const carriedObject = normalizeLocomotionKey(boy && boy.carriedObject);
  const carrying = normalizeLocomotionKey(boy && boy.carrying);
  const heldTool = boy && boy.toolInventory && typeof boy.toolInventory === "object"
    ? normalizeLocomotionKey(boy.toolInventory.heldTool)
    : "";
  if (carriedObject === "paintedstone" || carrying === "paintedstone" || carriedObject === "stone" || carrying === "stone") {
    return "paintStone";
  }
  if (
    carriedObject === "shellchime" ||
    carrying === "shellchime" ||
    carriedObject === "chime" ||
    carrying === "chime"
  ) {
    return "hangShellChime";
  }
  if (
    carriedObject === "decoration" ||
    carrying === "decoration" ||
    carriedObject === "hangingdecoration" ||
    carrying === "hangingdecoration" ||
    carriedObject === "decor" ||
    carrying === "decor"
  ) {
    return "placeDecoration";
  }
  if (
    heldTool === "drum" ||
    heldTool === "drumstick" ||
    carriedObject === "drum" ||
    carrying === "drum" ||
    carriedObject === "drumstick" ||
    carrying === "drumstick"
  ) return "playDrum";
  if (heldTool === "flute" || carriedObject === "flute" || carrying === "flute") return "playFlute";

  const stage = normalizeLocomotionKey(musicArtDecor.stage || musicArtDecor.variant);
  if (stage === "duskperformance" || stage === "performance") return "performAtDusk";
  if (stage === "instruments" || stage === "instrumentdisplay") return "playDrum";
  if (stage === "chime") return "hangShellChime";
  if (stage === "artdisplay" || stage === "artnook") return "paintStone";
  if (stage === "decoratednook" || stage === "decorcluster") return "admireDisplay";
  return "admireDisplay";
}

function resolveMusicArtDecorKey(key) {
  if (
    key === "paintstone" ||
    key === "paintingstone" ||
    key === "stonepainting" ||
    key === "paintedstone" ||
    key === "paint"
  ) return "paintStone";
  if (
    key === "placedecoration" ||
    key === "placingdecoration" ||
    key === "arrangedecor" ||
    key === "arrangedecoration" ||
    key === "decorplace" ||
    key === "decoration"
  ) return "placeDecoration";
  if (
    key === "hangshellchime" ||
    key === "hangchime" ||
    key === "chimehang" ||
    key === "shellchime" ||
    key === "inspectshellchime"
  ) return "hangShellChime";
  if (key === "playdrum" || key === "drumming" || key === "drum" || key === "thedrum") return "playDrum";
  if (key === "playflute" || key === "playingflute" || key === "flute" || key === "fluteplay") return "playFlute";
  if (
    key === "taprhythm" ||
    key === "tappingrhythm" ||
    key === "rhythmtap" ||
    key === "tapbeat" ||
    key === "tapping"
  ) return "tapRhythm";
  if (
    key === "performatdusk" ||
    key === "duskperformance" ||
    key === "performdusk" ||
    key === "performnight" ||
    key === "perform" ||
    key === "performance"
  ) return "performAtDusk";
  if (
    key === "admiredisplay" ||
    key === "admireart" ||
    key === "inspectmusicart" ||
    key === "inspectdisplay" ||
    key === "admire"
  ) return "admireDisplay";
  return "";
}

function resolveAnimalFamiliarVisitorPresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const directAction = resolveAnimalFamiliarVisitorKey(actionKey);
  if (directAction) return directAction;

  if (
    goalKey === "animalfamiliarvisitor" ||
    goalKey === "animalvisitor" ||
    goalKey === "visitorobserve" ||
    goalKey === "animalfamiliar" ||
    goalKey === "gentleanimal" ||
    goalKey === "animalinteraction"
  ) {
    return resolveAnimalFamiliarVisitorAction(boy, currentAction, worldState);
  }
  return "";
}

function resolveAnimalFamiliarVisitorAction(boy, currentAction, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  if (
    actionKey === "walking" ||
    actionKey === "walk" ||
    actionKey === "running" ||
    actionKey === "run" ||
    actionKey === "jogging" ||
    actionKey === "jog"
  ) {
    return "";
  }

  const animal = boy && boy.animal && typeof boy.animal === "object" ? boy.animal : {};
  const attention = boy && boy.attentionState && typeof boy.attentionState === "object" ? boy.attentionState : {};
  const animalFamiliarVisitor = worldState && worldState.animalFamiliarVisitor && typeof worldState.animalFamiliarVisitor === "object"
    ? worldState.animalFamiliarVisitor
    : {};
  const hint = normalizeLocomotionKey(
    animal.action ||
      animal.actionState ||
      animal.intent ||
      animal.phase ||
      attention.action ||
      attention.actionState ||
      attention.intent ||
      attention.phase ||
      animalFamiliarVisitor.action ||
      animalFamiliarVisitor.actionState ||
      animalFamiliarVisitor.intent ||
      animalFamiliarVisitor.phase
  );
  const hintedAction = resolveAnimalFamiliarVisitorKey(hint || actionKey);
  if (hintedAction) return hintedAction;

  const carriedObject = normalizeLocomotionKey(boy && boy.carriedObject);
  const carrying = normalizeLocomotionKey(boy && boy.carrying);
  if (
    carriedObject === "animalfood" ||
    carrying === "animalfood" ||
    carriedObject === "foodcrumbs" ||
    carrying === "foodcrumbs" ||
    carriedObject === "crumbs" ||
    carrying === "crumbs" ||
    carriedObject === "berries" ||
    carrying === "berries"
  ) {
    return "offerFood";
  }

  const affect = boy && boy.affect && typeof boy.affect === "object" ? boy.affect : {};
  if (finiteNumber(affect.happiness, 0) >= 0.60 || finiteNumber(affect.joy, 0) >= 0.60) {
    return "respondHappyAnimal";
  }

  const stage = normalizeLocomotionKey(animalFamiliarVisitor.stage || animalFamiliarVisitor.variant);
  if (stage === "feedready" || stage === "feedstaging") return "offerFood";
  if (stage === "approach") return "crouchNearAnimal";
  if (stage === "birdvisit" || stage === "fishvisit") return "slowWaveAnimal";
  if (stage === "observe" || stage === "groundvisitor") return "observeAnimal";
  if (actionKey === "idle" || actionKey === "lookingaround") return "observeAnimal";
  return "returnToRoutine";
}

function resolveAnimalFamiliarVisitorKey(key) {
  if (
    key === "observeanimal" ||
    key === "observinganimal" ||
    key === "observeanimalvisitor" ||
    key === "inspectanimalvisitor" ||
    key === "watchbirdvisitor" ||
    key === "watchfishvisitor" ||
    key === "watchanimal" ||
    key === "observedistance"
  ) return "observeAnimal";
  if (
    key === "crouchnearanimal" ||
    key === "crouchanimal" ||
    key === "animalcrouch" ||
    key === "crouchingnearanimal" ||
    key === "kneelnearanimal" ||
    key === "approachanimal"
  ) return "crouchNearAnimal";
  if (
    key === "offerfood" ||
    key === "offeringfood" ||
    key === "feedanimalvisitor" ||
    key === "feedanimal" ||
    key === "animalfeed" ||
    key === "foodoffer"
  ) return "offerFood";
  if (
    key === "slowwaveanimal" ||
    key === "slowanimalwave" ||
    key === "animalwave" ||
    key === "waveanimal" ||
    key === "wavevisitor"
  ) return "slowWaveAnimal";
  if (
    key === "respondhappyanimal" ||
    key === "animalhappy" ||
    key === "happyanimalresponse" ||
    key === "respondhappy" ||
    key === "gentlecelebrate"
  ) return "respondHappyAnimal";
  if (
    key === "avoidchasing" ||
    key === "avoidchase" ||
    key === "nochase" ||
    key === "donotchase" ||
    key === "staycalm"
  ) return "avoidChasing";
  if (
    key === "returntoroutine" ||
    key === "returnroutine" ||
    key === "returningtoroutine" ||
    key === "animalreturnroutine" ||
    key === "routine"
  ) return "returnToRoutine";
  return "";
}

function resolveCampStorageSittingPresentationAction(boy, currentAction, goal) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  if (actionKey === "sortmaterials" || actionKey === "sortingmaterials" || actionKey === "sortingstorage") {
    return "sortMaterials";
  }
  if (actionKey === "depositstorage" || actionKey === "depositingstorage") return "depositStorage";
  if (actionKey === "withdrawstorage" || actionKey === "withdrawingstorage") return "withdrawStorage";
  if (actionKey === "tidycamp" || actionKey === "tidyingcamp") return "tidyCamp";
  if (actionKey === "sitnearfire" || actionKey === "sittingnearfire") return "sitNearFire";
  if (actionKey === "restinsideshelter" || actionKey === "restinginsideshelter") return "restInsideShelter";
  if (actionKey === "inspectcamplayout" || actionKey === "inspectingcamplayout") return "inspectCampLayout";
  if (goalKey === "storage") return resolveStorageWorkAction(boy, currentAction);
  if (goalKey === "reflection" && (actionKey === "sitting" || actionKey === "resting")) return "sitNearFire";
  return "";
}

function resolveGardenFoodPrepPresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const directAction = resolveGardenFoodPrepKey(actionKey);
  if (directAction) return directAction;

  if (
    goalKey === "garden" ||
    goalKey === "gardenplot" ||
    goalKey === "planting" ||
    goalKey === "watering" ||
    goalKey === "harvesting" ||
    goalKey === "inspectinggarden" ||
    goalKey === "foodroutine" ||
    goalKey === "foodprep" ||
    goalKey === "prepmeal" ||
    goalKey === "storeharvest" ||
    goalKey === "carryharvest"
  ) {
    return resolveGardenFoodPrepAction(boy, currentAction, worldState);
  }
  return "";
}

function resolveGardenFoodPrepAction(boy, currentAction, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const garden = boy && boy.garden && typeof boy.garden === "object" ? boy.garden : {};
  const harvest = boy && boy.harvest && typeof boy.harvest === "object" ? boy.harvest : {};
  const food = boy && boy.food && typeof boy.food === "object" ? boy.food : {};
  const gardenHint = normalizeLocomotionKey(
    garden.action ||
      garden.actionState ||
      garden.intent ||
      harvest.action ||
      harvest.actionState ||
      harvest.intent ||
      food.action ||
      food.actionState ||
      food.intent
  );
  const carriedObject = normalizeLocomotionKey(boy && boy.carriedObject);
  const carrying = normalizeLocomotionKey(boy && boy.carrying);
  const key = gardenHint || actionKey;
  const resolved = resolveGardenFoodPrepKey(key);
  if (resolved) return resolved;
  if (carrying === "watercan") return "waterPlot";
  if (carrying === "harvestedcrop" || carrying === "harvest" || carriedObject === "harvestedcrop") {
    return "carryHarvest";
  }

  const plots = Array.isArray(worldState && worldState.gardenPlots) ? worldState.gardenPlots : [];
  const activePlot = plots.find((plot) => plot && (plot.active || plot.usable)) || plots[0] || null;
  const stage = normalizeLocomotionKey(activePlot && activePlot.stage);
  if (stage === "none" || stage === "tilled") return "digGardenPlot";
  if (stage === "seeded") return "waterPlot";
  if (stage === "sprout1" || stage === "sprout2") return "inspectSprout";
  if (stage === "grown") return "harvestCrop";
  return "plantSeed";
}

function resolveGardenFoodPrepKey(key) {
  if (
    key === "dig" ||
    key === "diggardenplot" ||
    key === "digginggardenplot" ||
    key === "diggingplot" ||
    key === "tilledig"
  ) return "digGardenPlot";
  if (
    key === "plant" ||
    key === "plantseed" ||
    key === "plantseeds" ||
    key === "plantingseed" ||
    key === "plantingseeds"
  ) return "plantSeed";
  if (
    key === "pat" ||
    key === "patsoil" ||
    key === "pattingsoil" ||
    key === "coverseed" ||
    key === "coversoil"
  ) return "patSoil";
  if (
    key === "water" ||
    key === "watering" ||
    key === "waterplot" ||
    key === "wateringgarden" ||
    key === "watergarden"
  ) return "waterPlot";
  if (
    key === "inspectsprout" ||
    key === "inspectingsprout" ||
    key === "inspectgarden" ||
    key === "inspectinggarden" ||
    key === "sproutinspect"
  ) return "inspectSprout";
  if (
    key === "harvest" ||
    key === "harvestcrop" ||
    key === "harvestingcrop" ||
    key === "cropharvest" ||
    key === "harvesting"
  ) return "harvestCrop";
  if (
    key === "carryharvest" ||
    key === "carryingharvest" ||
    key === "harvestcarry"
  ) return "carryHarvest";
  if (
    key === "storeharvest" ||
    key === "storingharvest" ||
    key === "depositharvest" ||
    key === "depositcrop"
  ) return "storeHarvest";
  if (
    key === "prepmeal" ||
    key === "preparingmeal" ||
    key === "foodprep" ||
    key === "mealprep" ||
    key === "cookmeal"
  ) return "prepMeal";
  return "";
}

function resolveFishingTrapPierPresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const directAction = resolveFishingTrapPierKey(actionKey);
  if (directAction) return directAction;

  if (
    goalKey === "gofish" ||
    goalKey === "fishing" ||
    goalKey === "shorefishing" ||
    goalKey === "pierfishing" ||
    goalKey === "fishtraproutine" ||
    goalKey === "traproutine" ||
    goalKey === "shoretrap" ||
    goalKey === "piershoreworksite" ||
    goalKey === "pier" ||
    goalKey === "shorepier"
  ) {
    return resolveFishingTrapPierAction(boy, currentAction, worldState);
  }
  return "";
}

function resolveFishingTrapPierAction(boy, currentAction, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  if (
    actionKey === "walking" ||
    actionKey === "walk" ||
    actionKey === "running" ||
    actionKey === "run" ||
    actionKey === "jogging" ||
    actionKey === "jog"
  ) {
    return "";
  }
  const fishing = boy && boy.fishing && typeof boy.fishing === "object" ? boy.fishing : {};
  const trap = boy && boy.trap && typeof boy.trap === "object" ? boy.trap : {};
  const pier = boy && boy.pier && typeof boy.pier === "object" ? boy.pier : {};
  const fishTrapState = worldState && worldState.fishTrapRoutine && typeof worldState.fishTrapRoutine === "object"
    ? worldState.fishTrapRoutine
    : {};
  const pierState = worldState && worldState.pierShoreWorkSite && typeof worldState.pierShoreWorkSite === "object"
    ? worldState.pierShoreWorkSite
    : {};
  const hint = normalizeLocomotionKey(
    fishing.action ||
      fishing.actionState ||
      fishing.intent ||
      fishing.phase ||
      fishing.lastResult ||
      trap.action ||
      trap.actionState ||
      trap.intent ||
      pier.action ||
      pier.actionState ||
      pier.intent ||
      fishTrapState.action ||
      fishTrapState.actionState ||
      fishTrapState.intent ||
      pierState.action ||
      pierState.actionState ||
      pierState.intent
  );
  const key = hint || actionKey;
  const resolved = resolveFishingTrapPierKey(key);
  if (resolved) return resolved;

  const carriedObject = normalizeLocomotionKey(boy && boy.carriedObject);
  const carrying = normalizeLocomotionKey(boy && boy.carrying);
  const heldTool = boy && boy.toolInventory && typeof boy.toolInventory === "object"
    ? normalizeLocomotionKey(boy.toolInventory.heldTool)
    : "";
  if (carriedObject === "fishingrod" || carrying === "fishingrod" || heldTool === "fishingrod" || heldTool === "rod") {
    return pierState && pierState.fishingSlotVisible ? "fishFromPier" : "castFishingLine";
  }
  if (carriedObject === "fishtrap" || carrying === "fishtrap" || carriedObject === "trap" || carrying === "trap") {
    return "setFishTrap";
  }
  if (carriedObject === "catch" || carrying === "catch" || carriedObject === "fishcatch" || carrying === "fishcatch") {
    return "collectCatch";
  }

  const trapState = normalizeLocomotionKey(fishTrapState.trapState || fishTrapState.stage);
  if (trapState === "drying") return "hangCatchDryingRack";
  if (trapState === "readytocheck") return "checkFishTrap";
  if (trapState === "collected") return "collectCatch";
  if (trapState === "set") return "checkFishTrap";
  if (pierState && (pierState.fishingSlotVisible || pierState.variant === "fishingSlot")) return "fishFromPier";
  return actionKey === "fishing" ? "waitFishing" : "castFishingLine";
}

function resolveFishingTrapPierKey(key) {
  if (
    key === "castfishingline" ||
    key === "castingfishingline" ||
    key === "castline" ||
    key === "cast" ||
    key === "fishingcast"
  ) return "castFishingLine";
  if (
    key === "waitfishing" ||
    key === "waitingfishing" ||
    key === "fishingwait" ||
    key === "wait" ||
    key === "waiting" ||
    key === "none"
  ) return "waitFishing";
  if (
    key === "reelfishingline" ||
    key === "reelingfishingline" ||
    key === "reelline" ||
    key === "reel" ||
    key === "miss"
  ) return "reelFishingLine";
  if (
    key === "catchreaction" ||
    key === "fishcatchreaction" ||
    key === "caughtfish" ||
    key === "caught"
  ) return "catchReaction";
  if (
    key === "fishfrompier" ||
    key === "pierfishing" ||
    key === "fishingfrompier" ||
    key === "pierfish" ||
    key === "fishpier"
  ) return "fishFromPier";
  if (
    key === "setfishtrap" ||
    key === "settingfishtrap" ||
    key === "settrap" ||
    key === "trapset"
  ) return "setFishTrap";
  if (
    key === "checkfishtrap" ||
    key === "checkingfishtrap" ||
    key === "checktrap" ||
    key === "readytocheck" ||
    key === "readycheck" ||
    key === "inspectfishtrap"
  ) return "checkFishTrap";
  if (
    key === "collectcatch" ||
    key === "collectfishtrap" ||
    key === "collectingcatch" ||
    key === "collecttrapcatch" ||
    key === "collected"
  ) return "collectCatch";
  if (
    key === "hangcatchdryingrack" ||
    key === "drytrapcatch" ||
    key === "hangcatch" ||
    key === "drying" ||
    key === "dryingrack"
  ) return "hangCatchDryingRack";
  if (key === "fishing") return "waitFishing";
  return "";
}

function resolveRaftBoatRoutePresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const directAction = resolveRaftBoatRouteKey(actionKey);
  if (directAction) return directAction;

  if (
    goalKey === "raft" ||
    goalKey === "raftboatroute" ||
    goalKey === "boatroute" ||
    goalKey === "boat" ||
    goalKey === "watercraft" ||
    goalKey === "capstoneboat" ||
    goalKey === "return"
  ) {
    return resolveRaftBoatRouteAction(boy, currentAction, worldState);
  }
  return "";
}

function resolveRaftBoatRouteAction(boy, currentAction, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const raft = boy && boy.raft && typeof boy.raft === "object" ? boy.raft : {};
  const boat = boy && boy.boat && typeof boy.boat === "object" ? boy.boat : {};
  const route = boy && boy.route && typeof boy.route === "object" ? boy.route : {};
  const raftState = worldState && worldState.raftBoatRoute && typeof worldState.raftBoatRoute === "object"
    ? worldState.raftBoatRoute
    : {};
  const hint = normalizeLocomotionKey(
    raft.action ||
      raft.actionState ||
      raft.intent ||
      boat.action ||
      boat.actionState ||
      boat.intent ||
      route.action ||
      route.actionState ||
      route.intent ||
      raftState.action ||
      raftState.actionState ||
      raftState.intent
  );
  const key = hint || actionKey;
  const resolved = resolveRaftBoatRouteKey(key);
  if (resolved) return resolved;

  const carriedObject = normalizeLocomotionKey(boy && boy.carriedObject);
  const carrying = normalizeLocomotionKey(boy && boy.carrying);
  const heldTool = boy && boy.toolInventory && typeof boy.toolInventory === "object"
    ? normalizeLocomotionKey(boy.toolInventory.heldTool)
    : "";
  if (carriedObject === "raftlog" || carrying === "raftlog" || carriedObject === "log" || carrying === "log") {
    return "carryRaftLog";
  }
  if (carriedObject === "raftrope" || carrying === "raftrope" || carrying === "rope" || heldTool === "rope") {
    return "lashRaft";
  }
  if (carriedObject === "raftpaddle" || carrying === "raftpaddle" || carrying === "paddle" || heldTool === "paddle") {
    return "paddleRaft";
  }

  const buildStage = normalizeLocomotionKey(raftState.buildStage || raftState.stage);
  const waterState = normalizeLocomotionKey(raftState.waterState);
  if (waterState === "return") return "returnCelebrate";
  if (waterState === "route") return "paddleRaft";
  if (waterState === "water") return "boardRaft";
  if (buildStage === "waterready") return "pushRaft";
  if (buildStage === "platform") return "lashRaft";
  if (buildStage === "route") return "lookOutFromRaft";
  if (buildStage === "capstone") return "returnCelebrate";
  return "carryRaftLog";
}

function resolveRaftBoatRouteKey(key) {
  if (
    key === "carryraftlog" ||
    key === "carryingraftlog" ||
    key === "carrylogs" ||
    key === "carryinglogs" ||
    key === "raftlogcarry" ||
    key === "logcarry"
  ) return "carryRaftLog";
  if (
    key === "lashraft" ||
    key === "lashingraft" ||
    key === "raftlash" ||
    key === "tieraft" ||
    key === "tyingraft" ||
    key === "rope"
  ) return "lashRaft";
  if (
    key === "pushraft" ||
    key === "pushingraft" ||
    key === "launchraft" ||
    key === "launchingraft"
  ) return "pushRaft";
  if (
    key === "boardraft" ||
    key === "boardingraft" ||
    key === "board"
  ) return "boardRaft";
  if (
    key === "sitaboardraft" ||
    key === "sittingaboardraft" ||
    key === "sitaboard"
  ) return "sitAboardRaft";
  if (
    key === "standaboardraft" ||
    key === "standingaboardraft" ||
    key === "standaboard"
  ) return "standAboardRaft";
  if (
    key === "paddleraft" ||
    key === "paddlingraft" ||
    key === "rowraft" ||
    key === "rowingraft" ||
    key === "paddle" ||
    key === "row"
  ) return "paddleRaft";
  if (
    key === "lookoutfromraft" ||
    key === "lookout" ||
    key === "lookoutfromboat" ||
    key === "raftlookout" ||
    key === "horizonscan"
  ) return "lookOutFromRaft";
  if (
    key === "disembarkraft" ||
    key === "disembarkingraft" ||
    key === "leaveboat" ||
    key === "returnraft"
  ) return "disembarkRaft";
  if (
    key === "returncelebrate" ||
    key === "returningcelebrate" ||
    key === "raftcelebrate" ||
    key === "celebratereturn"
  ) return "returnCelebrate";
  return "";
}

function resolvePathGroundWorkPresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const directAction = resolvePathGroundWorkKey(actionKey);
  if (directAction) return directAction;

  if (
    goalKey === "camplayout" ||
    goalKey === "rakepath" ||
    goalKey === "pathclearing" ||
    goalKey === "pathwork" ||
    goalKey === "clearpath" ||
    goalKey === "sweepleaves" ||
    goalKey === "kneelmarkzone" ||
    goalKey === "walkinspectroute"
  ) {
    return resolvePathGroundWorkAction(boy, currentAction, worldState);
  }
  return "";
}

function resolvePathGroundWorkAction(boy, currentAction, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const boyPath = boy && boy.path && typeof boy.path === "object" ? boy.path : {};
  const boyCampLayout = boy && boy.campLayout && typeof boy.campLayout === "object" ? boy.campLayout : {};
  const boyZone = boy && boy.zone && typeof boy.zone === "object" ? boy.zone : {};
  const campLayout = worldState && worldState.campLayout && typeof worldState.campLayout === "object"
    ? worldState.campLayout
    : {};
  const pathHint = normalizeLocomotionKey(
    boyPath.action ||
      boyPath.actionState ||
      boyPath.intent ||
      boyCampLayout.action ||
      boyCampLayout.actionState ||
      boyCampLayout.intent ||
      boyZone.action ||
      boyZone.actionState ||
      boyZone.intent ||
      campLayout.action ||
      campLayout.actionState ||
      campLayout.intent
  );
  const carriedObject = normalizeLocomotionKey(boy && boy.carriedObject);
  const carrying = normalizeLocomotionKey(boy && boy.carrying);
  const tool = boy && boy.toolInventory && typeof boy.toolInventory === "object"
    ? normalizeLocomotionKey(boy.toolInventory.heldTool)
    : "";
  const key = pathHint || actionKey;
  const resolved = resolvePathGroundWorkKey(key);
  if (resolved) return resolved;
  if (carriedObject === "boundarystone") return "placeBoundaryStone";
  if (carrying === "pathbroom" || carrying === "broom" || tool === "pathbroom" || tool === "broom") return "sweepLeaves";
  if (carrying === "pathrake" || carrying === "rake" || tool === "pathrake" || tool === "rake") return "rakePath";
  return "rakePath";
}

function resolvePathGroundWorkKey(key) {
  if (
    key === "rake" ||
    key === "rakepath" ||
    key === "raking" ||
    key === "rakingpath"
  ) return "rakePath";
  if (
    key === "clear" ||
    key === "clearpath" ||
    key === "clearing" ||
    key === "clearingpath" ||
    key === "pathclearing"
  ) return "clearPath";
  if (
    key === "sweep" ||
    key === "sweepleaves" ||
    key === "sweeping" ||
    key === "sweepingleaves" ||
    key === "sweeppath"
  ) return "sweepLeaves";
  if (
    key === "placeboundarystone" ||
    key === "placingboundarystone" ||
    key === "boundarystone" ||
    key === "stoneplacement"
  ) return "placeBoundaryStone";
  if (
    key === "kneelmarkzone" ||
    key === "markzone" ||
    key === "markingzone" ||
    key === "zonemarking"
  ) return "kneelMarkZone";
  if (
    key === "walkinspectroute" ||
    key === "walkinginspectroute" ||
    key === "inspectroute" ||
    key === "routeinspect" ||
    key === "routeinspection"
  ) return "walkInspectRoute";
  return "";
}

function resolveStorageWorkAction(boy, currentAction) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const storage = boy && boy.storage && typeof boy.storage === "object" ? boy.storage : {};
  const storageAction = normalizeLocomotionKey(storage.action || storage.actionState || storage.intent);
  const key = storageAction || actionKey;
  if (key === "sort" || key === "sortmaterials" || key === "sorting") return "sortMaterials";
  if (key === "withdraw" || key === "withdrawstorage" || key === "take") return "withdrawStorage";
  if (key === "tidy" || key === "tidycamp") return "tidyCamp";
  if (key === "inspect" || key === "inspectcamplayout") return "inspectCampLayout";
  return "depositStorage";
}

function resolveBuildPresentationAction(boy, currentAction, goal, worldState) {
  const actionKey = normalizeLocomotionKey(currentAction);
  const goalKey = normalizeLocomotionKey(goal);
  const builder = boy && boy.builder && typeof boy.builder === "object" ? boy.builder : {};
  const builderAction = normalizeLocomotionKey(builder.actionState);
  if (goalKey === "repair" || goalKey === "repairshelter" || actionKey === "repairing") return "repairShelter";
  if (goalKey === "reinforce" || goalKey === "reinforceshelter" || actionKey === "reinforcing") return "reinforceShelter";
  if (
    goalKey === "inspectprogress" ||
    builderAction === "inspectprogress" ||
    (goalKey === "buildproject" && builderAction === "inspect")
  ) return "inspectProgress";
  if (goalKey === "buildproject" || builderAction === "construct" || actionKey === "building") {
    return resolveBuildWorkAction(worldState);
  }
  return "";
}

function resolveBuildWorkAction(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const builder = boy.builder && typeof boy.builder === "object" ? boy.builder : {};
  const project = typeof builder.project === "string" ? builder.project : "";
  const buildables = worldState && worldState.buildables ? worldState.buildables : {};
  const buildable = buildables[project] || null;
  const progress = clamp(
    Number.isFinite(builder.progress)
      ? builder.progress
      : buildable && Number.isFinite(buildable.progress)
        ? buildable.progress
        : 0,
    0,
    1
  );
  const day = worldState && worldState.time && Number.isFinite(worldState.time.day) ? worldState.time.day : 1;
  if (project === "workbench" || project === "toy-blocks") return progress < 0.45 ? "carveTool" : "craftAtWorkbench";
  if (day >= 76 || progress >= 0.94) return "reinforceShelter";
  if (progress >= 0.62) return "repairShelter";
  if (progress >= 0.44) return "tieRopeVines";
  if (progress >= 0.24) return "pushPostUpright";
  if (progress >= 0.10) return "placePlank";
  return "hammerStrike";
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
