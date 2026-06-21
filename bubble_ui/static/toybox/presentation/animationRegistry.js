export const DAY_1_5_PRESENTATION_ACTIONS = Object.freeze([
  "arriveLookAround",
  "gatherLooseSupplies",
  "pickupMaterial",
  "carryBundle",
  "lightFire",
  "tendFire",
  "buildHammock",
  "sleepInHammock",
  "wakeStretch"
]);

const DEFAULT_ANIMATION_FALLBACK = Object.freeze({
  clip: "Idle",
  clipCandidates: Object.freeze(["Idle", "Standing"]),
  emote: null,
  proceduralOverlay: "observe",
  locomotionAware: false
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
    clip: "Idle",
    clipCandidates: ["Sitting", "Idle"],
    emote: "Sitting",
    proceduralOverlay: "sleepPose",
    locomotionAware: false
  },
  wakeStretch: {
    clip: "Idle",
    clipCandidates: ["Idle", "Standing"],
    emote: "ThumbsUp",
    proceduralOverlay: "stretch",
    locomotionAware: false
  }
});

export const LEGACY_ACTION_PRESENTATION_MAP = Object.freeze({
  idle: "arriveLookAround",
  lookingAround: "arriveLookAround",
  walking: "carryBundle",
  resting: "sleepInHammock",
  warmingHands: "tendFire",
  tendingFire: "tendFire",
  sitting: "sleepInHammock",
  interacting: "arriveLookAround",
  foraging: "gatherLooseSupplies",
  fishing: "pickupMaterial",
  cookingFish: "lightFire",
  eatingFish: "pickupMaterial",
  gatheringWood: "gatherLooseSupplies",
  building: "buildHammock",
  inspect: "arriveLookAround",
  sleep: "sleepInHammock",
  playToy: "arriveLookAround",
  celebrate: "wakeStretch"
});

export function resolvePresentationAction(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const currentAction = typeof boy.currentAction === "string" ? boy.currentAction : "idle";
  if (Object.prototype.hasOwnProperty.call(ANIMATION_FALLBACK_REGISTRY, currentAction)) {
    return currentAction;
  }

  const builderAction = boy.builder && typeof boy.builder.actionState === "string" ? boy.builder.actionState : "";
  if (builderAction === "gather") return "gatherLooseSupplies";
  if (builderAction === "construct") return "buildHammock";
  if (builderAction === "sleep") return "sleepInHammock";

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
    locomotionAware: Boolean(registered.locomotionAware)
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
