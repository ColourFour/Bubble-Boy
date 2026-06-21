import { assetSourceMetadata } from "./assetSource.js";

export const ATTACHMENT_REGISTRY = Object.freeze({
  carryBundle: Object.freeze({
    id: "carryBundle",
    family: "carryBundle",
    anchorType: "bbAttachment",
    attachmentPoint: "hands",
    visibleActions: Object.freeze(["carryBundle", "pickupMaterial", "gatherLooseSupplies"]),
    source: Object.freeze(assetSourceMetadata({
      sourceType: "procedural",
      path: null,
      license: "internal procedural placeholder",
      author: "Bubble Boy",
      sourceUrl: null,
      notes: "Registry-only placeholder for future hand-carried supply bundle.",
      approvedForUse: true
    }))
  })
});

export function resolveCarryAttachment(action) {
  const entry = ATTACHMENT_REGISTRY.carryBundle;
  if (!entry.visibleActions.includes(action)) return null;
  return {
    id: entry.id,
    family: entry.family,
    anchorType: entry.anchorType,
    attachmentPoint: entry.attachmentPoint,
    visible: true,
    source: { ...entry.source }
  };
}
