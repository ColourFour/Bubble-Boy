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
  const attachment = resolveCarryAttachment(selectedAction, worldState);
  const visualDescriptors = resolveVisualDescriptors(worldState, selectedAction, attachment);
  const arrivalSuppliesDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "arrivalSupplies") || null;
  const firstFireDescriptor = visualDescriptors.find((descriptor) => descriptor.family === "firstFire") || null;
  const restShelterDescriptor = visualDescriptors.find((descriptor) => descriptor.family === "restShelter") || null;
  const storageWorkbenchToolsDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "storageWorkbenchTools") || null;
  const campPathsDescriptor = visualDescriptors.find((descriptor) => descriptor.family === "campPaths") || null;
  const campZonesDescriptor = visualDescriptors.find((descriptor) => descriptor.family === "campZones") || null;
  const gardenPlotsDescriptor = visualDescriptors.find((descriptor) => descriptor.family === "gardenPlots") || null;
  const foodRoutineDescriptor = visualDescriptors.find((descriptor) => descriptor.family === "foodRoutine") || null;
  const ambientBeachFindsDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "ambientBeachFinds") || null;
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
      selectedAnimationSemanticAction: animation.semanticAction || selectedAction,
      selectedAnimationFallbackReason: animation.fallbackReason || "",
      selectedAnimationRootMotion: Boolean(animation.rootMotion),
      selectedProceduralOverlay: animation.proceduralOverlay,
      selectedCarryAttachment: attachment ? attachment.id : "",
      selectedCarryAttachmentSourceId: attachment && attachment.source ? attachment.source.id || "" : "",
      selectedCarryAttachmentTransformId: attachment && attachment.transform ? attachment.transform.id || "" : "",
      selectedCarryAttachmentStateHook: attachment && attachment.stateHook ? { ...attachment.stateHook } : null,
      arrivalSuppliesStage: arrivalSuppliesDescriptor ? arrivalSuppliesDescriptor.stage : "",
      arrivalSuppliesVariant: arrivalSuppliesDescriptor ? arrivalSuppliesDescriptor.variant : "",
      arrivalSuppliesWashedBundle: Boolean(
        arrivalSuppliesDescriptor &&
          arrivalSuppliesDescriptor.subProps &&
          arrivalSuppliesDescriptor.subProps.washedBundle &&
          arrivalSuppliesDescriptor.subProps.washedBundle.visible
      ),
      arrivalSuppliesScatteredSticks: Boolean(
        arrivalSuppliesDescriptor &&
          arrivalSuppliesDescriptor.subProps &&
          arrivalSuppliesDescriptor.subProps.scatteredSticks &&
          arrivalSuppliesDescriptor.subProps.scatteredSticks.visible
      ),
      arrivalSuppliesScatteredLeaves: Boolean(
        arrivalSuppliesDescriptor &&
          arrivalSuppliesDescriptor.subProps &&
          arrivalSuppliesDescriptor.subProps.scatteredLeaves &&
          arrivalSuppliesDescriptor.subProps.scatteredLeaves.visible
      ),
      arrivalSuppliesMaterialPile: Boolean(
        arrivalSuppliesDescriptor &&
          arrivalSuppliesDescriptor.subProps &&
          arrivalSuppliesDescriptor.subProps.materialPile &&
          arrivalSuppliesDescriptor.subProps.materialPile.visible
      ),
      arrivalSuppliesCarryBundle: Boolean(
        arrivalSuppliesDescriptor &&
          arrivalSuppliesDescriptor.subProps &&
          arrivalSuppliesDescriptor.subProps.carryBundle &&
          arrivalSuppliesDescriptor.subProps.carryBundle.visible
      ),
      arrivalSuppliesAssetSourceId: arrivalSuppliesDescriptor && arrivalSuppliesDescriptor.source
        ? arrivalSuppliesDescriptor.source.id || ""
        : "",
      arrivalSuppliesAssetApprovalStatus: arrivalSuppliesDescriptor && arrivalSuppliesDescriptor.source
        ? arrivalSuppliesDescriptor.source.approvalStatus || (arrivalSuppliesDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      arrivalSuppliesTransformId: arrivalSuppliesDescriptor && arrivalSuppliesDescriptor.transform
        ? arrivalSuppliesDescriptor.transform.id || ""
        : "",
      arrivalSuppliesHook: arrivalSuppliesDescriptor && arrivalSuppliesDescriptor.stateHook
        ? { ...arrivalSuppliesDescriptor.stateHook }
        : null,
      arrivalSuppliesDuplicateSystemClassification: arrivalSuppliesDescriptor && arrivalSuppliesDescriptor.debug
        ? arrivalSuppliesDescriptor.debug.duplicateSystemClassification || ""
        : "",
      bubbleBoyCarriedItem: worldState && worldState.bubbleBoy ? worldState.bubbleBoy.carriedItem || "" : "",
      firstFireStage: firstFireDescriptor ? firstFireDescriptor.stage || "" : "",
      firstFireVariant: firstFireDescriptor ? firstFireDescriptor.variant || "" : "",
      firstFireState: firstFireDescriptor && firstFireDescriptor.debug
        ? firstFireDescriptor.debug.currentFamilyState || ""
        : "",
      firstFireAssetSourceId: firstFireDescriptor && firstFireDescriptor.source ? firstFireDescriptor.source.id || "" : "",
      firstFireAssetApprovalStatus: firstFireDescriptor && firstFireDescriptor.source
        ? firstFireDescriptor.source.approvalStatus || (firstFireDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      firstFireTransformId: firstFireDescriptor && firstFireDescriptor.transform ? firstFireDescriptor.transform.id || "" : "",
      firstFireHook: firstFireDescriptor && firstFireDescriptor.stateHook ? { ...firstFireDescriptor.stateHook } : null,
      firstFireDuplicateSystemClassification: firstFireDescriptor && firstFireDescriptor.debug
        ? firstFireDescriptor.debug.duplicateSystemClassification || ""
        : "",
      firstFireFallbackReason: firstFireDescriptor && firstFireDescriptor.debug
        ? firstFireDescriptor.debug.fallbackReason || ""
        : "",
      restShelterStage: restShelterDescriptor ? restShelterDescriptor.stage : "",
      restShelterVariant: restShelterDescriptor ? restShelterDescriptor.variant : "",
      restShelterState: restShelterDescriptor ? restShelterDescriptor.debug.currentFamilyState || "" : "",
      restShelterAssetSourceId: restShelterDescriptor && restShelterDescriptor.source ? restShelterDescriptor.source.id || "" : "",
      restShelterAssetApprovalStatus: restShelterDescriptor && restShelterDescriptor.source
        ? restShelterDescriptor.source.approvalStatus || (restShelterDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      restShelterTransformId: restShelterDescriptor && restShelterDescriptor.transform ? restShelterDescriptor.transform.id || "" : "",
      restShelterHook: restShelterDescriptor && restShelterDescriptor.stateHook ? { ...restShelterDescriptor.stateHook } : null,
      storageWorkbenchToolsStage: storageWorkbenchToolsDescriptor ? storageWorkbenchToolsDescriptor.stage : "",
      storageWorkbenchToolsVariant: storageWorkbenchToolsDescriptor ? storageWorkbenchToolsDescriptor.variant : "",
      storageWorkbenchToolsState: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.debug
        ? storageWorkbenchToolsDescriptor.debug.currentFamilyState || ""
        : "",
      storageWorkbenchToolsAssetSourceId: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.source
        ? storageWorkbenchToolsDescriptor.source.id || ""
        : "",
      storageWorkbenchToolsAssetApprovalStatus: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.source
        ? storageWorkbenchToolsDescriptor.source.approvalStatus ||
          (storageWorkbenchToolsDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      storageWorkbenchToolsTransformId: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.transform
        ? storageWorkbenchToolsDescriptor.transform.id || ""
        : "",
      storageWorkbenchToolsHook: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.stateHook
        ? { ...storageWorkbenchToolsDescriptor.stateHook }
        : null,
      campStorageStage: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.subProps.campStorage
        ? storageWorkbenchToolsDescriptor.subProps.campStorage.stage || ""
        : "",
      campStorageWoodCount: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.subProps.campStorage
        ? Number(storageWorkbenchToolsDescriptor.subProps.campStorage.woodCount || 0)
        : 0,
      upgradedWorkbenchVisible: Boolean(
        storageWorkbenchToolsDescriptor &&
          storageWorkbenchToolsDescriptor.subProps.upgradedWorkbench &&
          storageWorkbenchToolsDescriptor.subProps.upgradedWorkbench.visible
      ),
      toolRackStage: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.subProps.toolRack
        ? storageWorkbenchToolsDescriptor.subProps.toolRack.stage || ""
        : "",
      toolRackSlotCount: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.subProps.toolRack
        ? Number(storageWorkbenchToolsDescriptor.subProps.toolRack.slotCount || 0)
        : 0,
      toolInventoryHasStoneTool: storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.debug
        ? Boolean(storageWorkbenchToolsDescriptor.debug.toolInventoryHasStoneTool)
        : false,
      storageWorkbenchToolsDuplicateSystemClassification:
        storageWorkbenchToolsDescriptor && storageWorkbenchToolsDescriptor.debug
          ? storageWorkbenchToolsDescriptor.debug.duplicateSystemClassification || ""
          : "",
      campPathsStage: campPathsDescriptor ? campPathsDescriptor.stage : "",
      campPathsVariant: campPathsDescriptor ? campPathsDescriptor.variant : "",
      campPathsState: campPathsDescriptor && campPathsDescriptor.debug
        ? campPathsDescriptor.debug.currentFamilyState || ""
        : "",
      campPathsActivePathCount: campPathsDescriptor && campPathsDescriptor.debug
        ? Number(campPathsDescriptor.debug.activePathCount || 0)
        : 0,
      campPathsClearedPaths: campPathsDescriptor && campPathsDescriptor.debug && Array.isArray(campPathsDescriptor.debug.clearedPaths)
        ? campPathsDescriptor.debug.clearedPaths.slice()
        : [],
      campPathsLitPaths: campPathsDescriptor && campPathsDescriptor.debug && Array.isArray(campPathsDescriptor.debug.litPaths)
        ? campPathsDescriptor.debug.litPaths.slice()
        : [],
      campPathsBoundaryStoneCount: campPathsDescriptor && campPathsDescriptor.debug
        ? Number(campPathsDescriptor.debug.boundaryStoneCount || 0)
        : 0,
      campPathsAssetSourceId: campPathsDescriptor && campPathsDescriptor.source ? campPathsDescriptor.source.id || "" : "",
      campPathsAssetApprovalStatus: campPathsDescriptor && campPathsDescriptor.source
        ? campPathsDescriptor.source.approvalStatus || (campPathsDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      campPathsTransformId: campPathsDescriptor && campPathsDescriptor.transform ? campPathsDescriptor.transform.id || "" : "",
      campPathsHook: campPathsDescriptor && campPathsDescriptor.stateHook ? { ...campPathsDescriptor.stateHook } : null,
      campPathsDuplicateSystemClassification: campPathsDescriptor && campPathsDescriptor.debug
        ? campPathsDescriptor.debug.duplicateSystemClassification || ""
        : "",
      campZonesStage: campZonesDescriptor ? campZonesDescriptor.stage : "",
      campZonesVariant: campZonesDescriptor ? campZonesDescriptor.variant : "",
      campZonesState: campZonesDescriptor && campZonesDescriptor.debug
        ? campZonesDescriptor.debug.currentFamilyState || ""
        : "",
      campZonesMarkedZones: campZonesDescriptor && campZonesDescriptor.debug && Array.isArray(campZonesDescriptor.debug.markedZones)
        ? campZonesDescriptor.debug.markedZones.slice()
        : [],
      campZonesMarkedZoneCount: campZonesDescriptor && campZonesDescriptor.debug
        ? Number(campZonesDescriptor.debug.markedZoneCount || 0)
        : 0,
      campZonesAssetSourceId: campZonesDescriptor && campZonesDescriptor.source ? campZonesDescriptor.source.id || "" : "",
      campZonesAssetApprovalStatus: campZonesDescriptor && campZonesDescriptor.source
        ? campZonesDescriptor.source.approvalStatus || (campZonesDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      campZonesTransformId: campZonesDescriptor && campZonesDescriptor.transform ? campZonesDescriptor.transform.id || "" : "",
      campZonesHook: campZonesDescriptor && campZonesDescriptor.stateHook ? { ...campZonesDescriptor.stateHook } : null,
      campZonesDuplicateSystemClassification: campZonesDescriptor && campZonesDescriptor.debug
        ? campZonesDescriptor.debug.duplicateSystemClassification || ""
        : "",
      gardenPlotsStage: gardenPlotsDescriptor ? gardenPlotsDescriptor.stage : "",
      gardenPlotsVariant: gardenPlotsDescriptor ? gardenPlotsDescriptor.variant : "",
      gardenPlotsState: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? gardenPlotsDescriptor.debug.currentFamilyState || ""
        : "",
      gardenActivePlotId: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? gardenPlotsDescriptor.debug.activePlotId || ""
        : "",
      gardenCropType: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? gardenPlotsDescriptor.debug.cropType || ""
        : "",
      gardenWatered: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? Boolean(gardenPlotsDescriptor.debug.watered)
        : false,
      gardenPlotCount: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? Number(gardenPlotsDescriptor.debug.plotCount || 0)
        : 0,
      gardenSeededPlotCount: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? Number(gardenPlotsDescriptor.debug.seededPlotCount || 0)
        : 0,
      gardenSproutPlotCount: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? Number(gardenPlotsDescriptor.debug.sproutPlotCount || 0)
        : 0,
      gardenMaturePlotCount: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? Number(gardenPlotsDescriptor.debug.maturePlotCount || 0)
        : 0,
      gardenWateredPlotCount: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? Number(gardenPlotsDescriptor.debug.wateredPlotCount || 0)
        : 0,
      gardenPlotsAssetSourceId: gardenPlotsDescriptor && gardenPlotsDescriptor.source
        ? gardenPlotsDescriptor.source.id || ""
        : "",
      gardenPlotsAssetApprovalStatus: gardenPlotsDescriptor && gardenPlotsDescriptor.source
        ? gardenPlotsDescriptor.source.approvalStatus || (gardenPlotsDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      gardenPlotsTransformId: gardenPlotsDescriptor && gardenPlotsDescriptor.transform
        ? gardenPlotsDescriptor.transform.id || ""
        : "",
      gardenPlotsHook: gardenPlotsDescriptor && gardenPlotsDescriptor.stateHook ? { ...gardenPlotsDescriptor.stateHook } : null,
      gardenPlotsDuplicateSystemClassification: gardenPlotsDescriptor && gardenPlotsDescriptor.debug
        ? gardenPlotsDescriptor.debug.duplicateSystemClassification || ""
        : "",
      foodRoutineStage: foodRoutineDescriptor ? foodRoutineDescriptor.stage : "",
      foodRoutineVariant: foodRoutineDescriptor ? foodRoutineDescriptor.variant : "",
      foodRoutineState: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? foodRoutineDescriptor.debug.currentFamilyState || ""
        : "",
      foodRoutineDay: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? Number(foodRoutineDescriptor.debug.day || 0)
        : 0,
      foodRoutineBasketStock: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? Number(foodRoutineDescriptor.debug.basketStock || 0)
        : 0,
      foodRoutineMealCount: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? Number(foodRoutineDescriptor.debug.mealCount || 0)
        : 0,
      foodRoutineDriedFishCount: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? Number(foodRoutineDescriptor.debug.driedFishCount || 0)
        : 0,
      foodRoutineHarvestCount: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? Number(foodRoutineDescriptor.debug.harvestCount || 0)
        : 0,
      foodRoutineLeftoverCount: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? Number(foodRoutineDescriptor.debug.leftoverCount || 0)
        : 0,
      foodRoutineAssetSourceId: foodRoutineDescriptor && foodRoutineDescriptor.source
        ? foodRoutineDescriptor.source.id || ""
        : "",
      foodRoutineAssetApprovalStatus: foodRoutineDescriptor && foodRoutineDescriptor.source
        ? foodRoutineDescriptor.source.approvalStatus || (foodRoutineDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      foodRoutineTransformId: foodRoutineDescriptor && foodRoutineDescriptor.transform
        ? foodRoutineDescriptor.transform.id || ""
        : "",
      foodRoutineHook: foodRoutineDescriptor && foodRoutineDescriptor.stateHook
        ? { ...foodRoutineDescriptor.stateHook }
        : null,
      foodRoutineDuplicateSystemClassification: foodRoutineDescriptor && foodRoutineDescriptor.debug
        ? foodRoutineDescriptor.debug.duplicateSystemClassification || ""
        : "",
      ambientBeachFindsStage: ambientBeachFindsDescriptor ? ambientBeachFindsDescriptor.stage : "",
      ambientBeachFindsVariant: ambientBeachFindsDescriptor ? ambientBeachFindsDescriptor.variant : "",
      ambientBeachFindsState: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? ambientBeachFindsDescriptor.debug.currentFamilyState || ""
        : "",
      ambientBeachFindsDay: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Number(ambientBeachFindsDescriptor.debug.day || 0)
        : 0,
      ambientBeachFindsShellCount: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Number(ambientBeachFindsDescriptor.debug.shellCount || 0)
        : 0,
      ambientBeachFindsDriftwoodCount: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Number(ambientBeachFindsDescriptor.debug.driftwoodCount || 0)
        : 0,
      ambientBeachFindsTinyFindCount: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Number(ambientBeachFindsDescriptor.debug.tinyFindCount || 0)
        : 0,
      ambientBeachFindsFoodCrumbCount: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Number(ambientBeachFindsDescriptor.debug.foodCrumbCount || 0)
        : 0,
      ambientBeachFindsBirdMarkerCount: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Number(ambientBeachFindsDescriptor.debug.birdMarkerCount || 0)
        : 0,
      ambientBeachFindsFishMarkerCount: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Number(ambientBeachFindsDescriptor.debug.fishMarkerCount || 0)
        : 0,
      ambientBeachFindsAnimalVisitorVisible: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? Boolean(ambientBeachFindsDescriptor.debug.animalVisitorVisible)
        : false,
      ambientBeachFindsAssetSourceId: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.source
        ? ambientBeachFindsDescriptor.source.id || ""
        : "",
      ambientBeachFindsAssetApprovalStatus: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.source
        ? ambientBeachFindsDescriptor.source.approvalStatus ||
          (ambientBeachFindsDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      ambientBeachFindsTransformId: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.transform
        ? ambientBeachFindsDescriptor.transform.id || ""
        : "",
      ambientBeachFindsHook: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.stateHook
        ? { ...ambientBeachFindsDescriptor.stateHook }
        : null,
      ambientBeachFindsDuplicateSystemClassification: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? ambientBeachFindsDescriptor.debug.duplicateSystemClassification || ""
        : "",
      ambientBeachFindsPerformanceNote: ambientBeachFindsDescriptor && ambientBeachFindsDescriptor.debug
        ? ambientBeachFindsDescriptor.debug.performanceNote || ""
        : "",
      bubbleBoyCarriedObject: worldState && worldState.bubbleBoy ? worldState.bubbleBoy.carriedObject || "" : "",
      bubbleBoyCarrying: worldState && worldState.bubbleBoy ? worldState.bubbleBoy.carrying || "" : "",
      duplicateSystemClassification: restShelterDescriptor && restShelterDescriptor.debug
        ? restShelterDescriptor.debug.duplicateSystemClassification || ""
        : "",
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
