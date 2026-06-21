import {
  BED_BUILD_SITE_ID,
  BUILD_SITE_ID,
  FIRE_PIT_ID,
  WORKBENCH_ID
} from "../simulation/worldState.js";
import { ASSET_SOURCE_TYPES, assetSourceMetadata } from "./assetSource.js";

export { ASSET_SOURCE_TYPES, assetSourceMetadata };

export const VISUAL_FAMILY_REGISTRY = freezeRegistry({
  arrivalBundle: visualFamily({
    id: "arrivalBundle",
    propFamily: "arrival",
    anchorType: "campArea",
    defaultVisible: true,
    notes: "Small first-day arrival marker; actual model remains procedural in this pass."
  }),
  looseSupplies: visualFamily({
    id: "looseSupplies",
    propFamily: "supplies",
    anchorType: "campArea",
    defaultVisible: true,
    notes: "Loose Day 1 supply grouping placeholder."
  }),
  materialPile: visualFamily({
    id: "materialPile",
    propFamily: "materials",
    anchorType: "buildableSlot",
    anchorId: WORKBENCH_ID,
    defaultVisible: true,
    notes: "Material pile descriptor mirrors current workbench/inventory state."
  }),
  carryBundle: visualFamily({
    id: "carryBundle",
    propFamily: "carry",
    anchorType: "bbAttachment",
    defaultVisible: false,
    notes: "Hand-carried bundle descriptor; no new mesh is created in this pass."
  }),
  firstFire: visualFamily({
    id: "firstFire",
    propFamily: "fire",
    anchorType: "fireArea",
    anchorId: FIRE_PIT_ID,
    defaultVisible: true,
    notes: "Presentation handle for the existing campfire system."
  }),
  hammockRestSling: visualFamily({
    id: "hammockRestSling",
    propFamily: "rest",
    anchorType: "buildableSlot",
    anchorId: BED_BUILD_SITE_ID,
    defaultVisible: false,
    notes: "Day 5 rest sling placeholder, mapped to current bed buildable state for now."
  })
});

export function resolveVisualDescriptors(worldState, selectedAction, attachment) {
  const descriptors = [
    descriptorForFamily("arrivalBundle", { visible: selectedAction === "arriveLookAround" }),
    descriptorForFamily("looseSupplies", {
      visible: selectedAction === "gatherLooseSupplies" || selectedAction === "pickupMaterial"
    }),
    descriptorForFamily("materialPile", {
      variant: materialVariant(worldState),
      stage: buildableStage(worldState, "shelter"),
      visible: true
    }),
    descriptorForFamily("carryBundle", {
      visible: Boolean(attachment),
      anchorType: "bbAttachment"
    }),
    descriptorForFamily("firstFire", {
      variant: fireVariant(worldState),
      visible: true
    }),
    descriptorForFamily("hammockRestSling", {
      variant: buildableVariant(worldState, "bed"),
      stage: buildableStage(worldState, "bed"),
      visible: selectedAction === "buildHammock" || selectedAction === "sleepInHammock"
    })
  ];

  return descriptors;
}

export function countUnapprovedAssets(descriptors) {
  if (!Array.isArray(descriptors)) return 0;
  let count = 0;
  for (const descriptor of descriptors) {
    const source = descriptor && descriptor.source;
    if (source && source.sourceType === "external" && source.approvedForUse !== true) count += 1;
  }
  return count;
}

function descriptorForFamily(familyId, overrides = {}) {
  const family = VISUAL_FAMILY_REGISTRY[familyId];
  return {
    id: family.id,
    family: family.id,
    propFamily: family.propFamily,
    variant: overrides.variant || "placeholder",
    stage: overrides.stage || "registry",
    visible: Object.prototype.hasOwnProperty.call(overrides, "visible")
      ? Boolean(overrides.visible)
      : family.defaultVisible,
    anchor: {
      type: overrides.anchorType || family.anchorType,
      id: overrides.anchorId || family.anchorId || null
    },
    source: { ...family.source }
  };
}

function visualFamily({
  id,
  propFamily,
  anchorType,
  anchorId = null,
  defaultVisible,
  notes
}) {
  return {
    id,
    propFamily,
    anchorType,
    anchorId,
    defaultVisible,
    source: assetSourceMetadata({
      sourceType: "procedural",
      path: null,
      license: "internal procedural placeholder",
      author: "Bubble Boy",
      sourceUrl: null,
      notes,
      approvedForUse: true
    })
  };
}

function materialVariant(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const inventory = boy.inventory || {};
  const wood = Number.isFinite(inventory.wood) ? inventory.wood : 0;
  if (wood >= 4) return "stocked";
  if (wood > 0) return "partial";
  return "empty";
}

function fireVariant(worldState) {
  const objects = worldState && worldState.objects ? worldState.objects : {};
  const fire = objects[FIRE_PIT_ID] || {};
  if (fire.lit === false) return "unlit";
  const fuel = Number.isFinite(fire.fuel) ? fire.fuel : 0;
  return fuel > 20 ? "lit" : "embers";
}

function buildableVariant(worldState, buildableId) {
  const buildable = buildableState(worldState, buildableId);
  const progress = Number.isFinite(buildable.progress) ? buildable.progress : 0;
  if (progress >= 1) return "complete";
  if (progress > 0) return "inProgress";
  return "planned";
}

function buildableStage(worldState, buildableId) {
  const buildable = buildableState(worldState, buildableId);
  if (Array.isArray(buildable.stages) && Number.isInteger(buildable.currentStageIndex)) {
    const stage = buildable.stages[buildable.currentStageIndex];
    if (stage && typeof stage.id === "string") return stage.id;
  }
  return buildableVariant(worldState, buildableId);
}

function buildableState(worldState, buildableId) {
  const buildables = worldState && worldState.buildables ? worldState.buildables : {};
  const objects = worldState && worldState.objects ? worldState.objects : {};
  if (buildables[buildableId]) return buildables[buildableId];
  if (buildableId === "shelter") return objects[BUILD_SITE_ID] || {};
  if (buildableId === "bed") return objects[BED_BUILD_SITE_ID] || {};
  return {};
}

function freezeRegistry(registry) {
  const frozen = {};
  for (const [key, value] of Object.entries(registry)) {
    frozen[key] = Object.freeze({
      ...value,
      source: Object.freeze({ ...value.source })
    });
  }
  return Object.freeze(frozen);
}
