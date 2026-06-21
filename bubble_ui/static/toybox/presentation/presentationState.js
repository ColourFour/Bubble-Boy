import {
  DAY_1_5_PRESENTATION_ACTIONS,
  LEGACY_ACTION_PRESENTATION_MAP,
  resolveAnimationFallback,
  resolvePresentationAction
} from "./animationRegistry.js";
import { resolveCarryAttachment } from "./attachmentRegistry.js";
import { countUnapprovedAssets, resolveVisualDescriptors } from "./visualRegistry.js";

export function resolveToyboxPresentationState(worldState) {
  const selectedAction = resolvePresentationAction(worldState);
  const animation = resolveAnimationFallback(selectedAction, worldState);
  const attachment = resolveCarryAttachment(selectedAction);
  const visualDescriptors = resolveVisualDescriptors(worldState, selectedAction, attachment);
  const activeVisualFamilies = visualDescriptors
    .filter((descriptor) => descriptor.visible)
    .map((descriptor) => descriptor.family);
  const unapprovedAssetCount = countUnapprovedAssets(visualDescriptors) + countUnapprovedAttachmentAsset(attachment);

  return {
    version: 1,
    selectedAction,
    sourceAction: sourceAction(worldState),
    animation,
    proceduralOverlay: animation.proceduralOverlay,
    attachment,
    visuals: visualDescriptors,
    activeVisualFamilies,
    unapprovedAssetCount,
    debug: {
      selectedPresentationAction: selectedAction,
      selectedAnimationFallback: animation.clip,
      selectedProceduralOverlay: animation.proceduralOverlay,
      selectedCarryAttachment: attachment ? attachment.id : "",
      activeVisualFamilies: activeVisualFamilies.slice(),
      unapprovedAssetCount
    }
  };
}

export { DAY_1_5_PRESENTATION_ACTIONS, LEGACY_ACTION_PRESENTATION_MAP };

function sourceAction(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  return typeof boy.currentAction === "string" ? boy.currentAction : "";
}

function countUnapprovedAttachmentAsset(attachment) {
  if (!attachment || !attachment.source) return 0;
  return attachment.source.sourceType === "external" && attachment.source.approvedForUse !== true ? 1 : 0;
}
