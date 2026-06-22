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
  const fishTrapRoutineDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "fishTrapRoutine") || null;
  const toyPlaySetDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "toyPlaySet") || null;
  const musicArtDecorDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "musicArtDecor") || null;
  const animalFamiliarVisitorDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "animalFamiliarVisitor") || null;
  const nightComfortLightsDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "nightComfortLights") || null;
  const ambientBeachFindsDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "ambientBeachFinds") || null;
  const pierShoreWorkSiteDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "pierShoreWorkSite") || null;
  const raftBoatRouteDescriptor =
    visualDescriptors.find((descriptor) => descriptor.family === "raftBoatRoute") || null;
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
      fishTrapRoutineStage: fishTrapRoutineDescriptor ? fishTrapRoutineDescriptor.stage : "",
      fishTrapRoutineVariant: fishTrapRoutineDescriptor ? fishTrapRoutineDescriptor.variant : "",
      fishTrapRoutineState: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? fishTrapRoutineDescriptor.debug.currentFamilyState || ""
        : "",
      fishTrapRoutineTrapState: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? fishTrapRoutineDescriptor.debug.trapState || ""
        : "",
      fishTrapRoutineDay: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.day || 0)
        : 0,
      fishTrapRoutineTrapCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.trapCount || 0)
        : 0,
      fishTrapRoutineBuoyCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.buoyCount || 0)
        : 0,
      fishTrapRoutineLineCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.lineCount || 0)
        : 0,
      fishTrapRoutineDryingRackCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.dryingRackCount || 0)
        : 0,
      fishTrapRoutineCatchDisplayCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.catchDisplayCount || 0)
        : 0,
      fishTrapRoutineFishCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.fishCount || 0)
        : 0,
      fishTrapRoutineCrabCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.crabCount || 0)
        : 0,
      fishTrapRoutineDryingFishCount: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? Number(fishTrapRoutineDescriptor.debug.dryingFishCount || 0)
        : 0,
      fishTrapRoutineAssetSourceId: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.source
        ? fishTrapRoutineDescriptor.source.id || ""
        : "",
      fishTrapRoutineAssetApprovalStatus: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.source
        ? fishTrapRoutineDescriptor.source.approvalStatus ||
          (fishTrapRoutineDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      fishTrapRoutineTransformId: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.transform
        ? fishTrapRoutineDescriptor.transform.id || ""
        : "",
      fishTrapRoutineHook: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.stateHook
        ? { ...fishTrapRoutineDescriptor.stateHook }
        : null,
      fishTrapRoutineDuplicateSystemClassification: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? fishTrapRoutineDescriptor.debug.duplicateSystemClassification || ""
        : "",
      fishTrapRoutinePlaceholderNote: fishTrapRoutineDescriptor && fishTrapRoutineDescriptor.debug
        ? fishTrapRoutineDescriptor.debug.placeholderNote || ""
        : "",
      toyPlaySetStage: toyPlaySetDescriptor ? toyPlaySetDescriptor.stage : "",
      toyPlaySetVariant: toyPlaySetDescriptor ? toyPlaySetDescriptor.variant : "",
      toyPlaySetState: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? toyPlaySetDescriptor.debug.currentFamilyState || ""
        : "",
      toyPlaySetDay: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.day || 0)
        : 0,
      toyPlaySetCollectionSlotCount: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.collectionSlotCount || 0)
        : 0,
      toyPlaySetBlockCount: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.blockCount || 0)
        : 0,
      toyPlaySetBallCount: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.ballCount || 0)
        : 0,
      toyPlaySetKiteCount: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.kiteCount || 0)
        : 0,
      toyPlaySetStringCount: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.stringCount || 0)
        : 0,
      toyPlaySetSpinningTopCount: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.spinningTopCount || 0)
        : 0,
      toyPlaySetPlayMatCount: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? Number(toyPlaySetDescriptor.debug.playMatCount || 0)
        : 0,
      toyPlaySetExistingBuildableId: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? toyPlaySetDescriptor.debug.existingToyBuildableId || ""
        : "",
      toyPlaySetExistingUseSlotAction: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? toyPlaySetDescriptor.debug.existingToyBuildableUseSlotAction || ""
        : "",
      toyPlaySetAssetSourceId: toyPlaySetDescriptor && toyPlaySetDescriptor.source
        ? toyPlaySetDescriptor.source.id || ""
        : "",
      toyPlaySetAssetApprovalStatus: toyPlaySetDescriptor && toyPlaySetDescriptor.source
        ? toyPlaySetDescriptor.source.approvalStatus ||
          (toyPlaySetDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      toyPlaySetTransformId: toyPlaySetDescriptor && toyPlaySetDescriptor.transform
        ? toyPlaySetDescriptor.transform.id || ""
        : "",
      toyPlaySetHook: toyPlaySetDescriptor && toyPlaySetDescriptor.stateHook
        ? { ...toyPlaySetDescriptor.stateHook }
        : null,
      toyPlaySetDuplicateSystemClassification: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? toyPlaySetDescriptor.debug.duplicateSystemClassification || ""
        : "",
      toyPlaySetPlaceholderNote: toyPlaySetDescriptor && toyPlaySetDescriptor.debug
        ? toyPlaySetDescriptor.debug.placeholderNote || ""
        : "",
      musicArtDecorStage: musicArtDecorDescriptor ? musicArtDecorDescriptor.stage : "",
      musicArtDecorVariant: musicArtDecorDescriptor ? musicArtDecorDescriptor.variant : "",
      musicArtDecorState: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? musicArtDecorDescriptor.debug.currentFamilyState || ""
        : "",
      musicArtDecorDay: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.day || 0)
        : 0,
      musicArtDecorShellChimeCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.shellChimeCount || 0)
        : 0,
      musicArtDecorPaintedStoneCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.paintedStoneCount || 0)
        : 0,
      musicArtDecorDrumCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.drumCount || 0)
        : 0,
      musicArtDecorFluteCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.fluteCount || 0)
        : 0,
      musicArtDecorHangingDecorationCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.hangingDecorationCount || 0)
        : 0,
      musicArtDecorArtDisplaySlotCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.artDisplaySlotCount || 0)
        : 0,
      musicArtDecorPerformanceMarkerCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.performanceMarkerCount || 0)
        : 0,
      musicArtDecorNoteMarkerCount: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? Number(musicArtDecorDescriptor.debug.noteMarkerCount || 0)
        : 0,
      musicArtDecorAssetSourceId: musicArtDecorDescriptor && musicArtDecorDescriptor.source
        ? musicArtDecorDescriptor.source.id || ""
        : "",
      musicArtDecorAssetApprovalStatus: musicArtDecorDescriptor && musicArtDecorDescriptor.source
        ? musicArtDecorDescriptor.source.approvalStatus ||
          (musicArtDecorDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      musicArtDecorTransformId: musicArtDecorDescriptor && musicArtDecorDescriptor.transform
        ? musicArtDecorDescriptor.transform.id || ""
        : "",
      musicArtDecorHook: musicArtDecorDescriptor && musicArtDecorDescriptor.stateHook
        ? { ...musicArtDecorDescriptor.stateHook }
        : null,
      musicArtDecorDuplicateSystemClassification: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? musicArtDecorDescriptor.debug.duplicateSystemClassification || ""
        : "",
      musicArtDecorPlaceholderNote: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? musicArtDecorDescriptor.debug.placeholderNote || ""
        : "",
      musicArtDecorParticlePerformanceNote: musicArtDecorDescriptor && musicArtDecorDescriptor.debug
        ? musicArtDecorDescriptor.debug.particlePerformanceNote || ""
        : "",
      animalFamiliarVisitorStage: animalFamiliarVisitorDescriptor ? animalFamiliarVisitorDescriptor.stage : "",
      animalFamiliarVisitorVariant: animalFamiliarVisitorDescriptor ? animalFamiliarVisitorDescriptor.variant : "",
      animalFamiliarVisitorState: animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
        ? animalFamiliarVisitorDescriptor.debug.currentFamilyState || ""
        : "",
      animalFamiliarVisitorDay: animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
        ? Number(animalFamiliarVisitorDescriptor.debug.day || 0)
        : 0,
      animalFamiliarVisitorAnimalCount: animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
        ? Number(animalFamiliarVisitorDescriptor.debug.animalCount || 0)
        : 0,
      animalFamiliarVisitorBirdVisitorCount:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
          ? Number(animalFamiliarVisitorDescriptor.debug.birdVisitorCount || 0)
          : 0,
      animalFamiliarVisitorFishVisitorCount:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
          ? Number(animalFamiliarVisitorDescriptor.debug.fishVisitorCount || 0)
          : 0,
      animalFamiliarVisitorFoodCrumbCount:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
          ? Number(animalFamiliarVisitorDescriptor.debug.foodCrumbCount || 0)
          : 0,
      animalFamiliarVisitorObserveRingCount:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
          ? Number(animalFamiliarVisitorDescriptor.debug.observeRingCount || 0)
          : 0,
      animalFamiliarVisitorApproachMarkerCount:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
          ? Number(animalFamiliarVisitorDescriptor.debug.approachMarkerCount || 0)
          : 0,
      animalFamiliarVisitorAssetSourceId: animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.source
        ? animalFamiliarVisitorDescriptor.source.id || ""
        : "",
      animalFamiliarVisitorAssetApprovalStatus:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.source
          ? animalFamiliarVisitorDescriptor.source.approvalStatus ||
            (animalFamiliarVisitorDescriptor.source.approvedForUse ? "approved" : "unapproved")
          : "",
      animalFamiliarVisitorTransformId:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.transform
          ? animalFamiliarVisitorDescriptor.transform.id || ""
          : "",
      animalFamiliarVisitorHook: animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.stateHook
        ? { ...animalFamiliarVisitorDescriptor.stateHook }
        : null,
      animalFamiliarVisitorDuplicateSystemClassification:
        animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
          ? animalFamiliarVisitorDescriptor.debug.duplicateSystemClassification || ""
          : "",
      animalFamiliarVisitorNonblockingNote: animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
        ? animalFamiliarVisitorDescriptor.debug.nonblockingNote || ""
        : "",
      animalFamiliarVisitorPlaceholderNote: animalFamiliarVisitorDescriptor && animalFamiliarVisitorDescriptor.debug
        ? animalFamiliarVisitorDescriptor.debug.placeholderNote || ""
        : "",
      nightComfortLightsStage: nightComfortLightsDescriptor ? nightComfortLightsDescriptor.stage : "",
      nightComfortLightsVariant: nightComfortLightsDescriptor ? nightComfortLightsDescriptor.variant : "",
      nightComfortLightsState: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? nightComfortLightsDescriptor.debug.currentFamilyState || ""
        : "",
      nightComfortLightsDay: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? Number(nightComfortLightsDescriptor.debug.day || 0)
        : 0,
      nightComfortLightsLanternPostCount: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? Number(nightComfortLightsDescriptor.debug.lanternPostCount || 0)
        : 0,
      nightComfortLightsLitPathAnchorCount: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? Number(nightComfortLightsDescriptor.debug.litPathAnchorCount || 0)
        : 0,
      nightComfortLightsGlowingShellCount: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? Number(nightComfortLightsDescriptor.debug.glowingShellCount || 0)
        : 0,
      nightComfortLightsFireflyCount: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? Number(nightComfortLightsDescriptor.debug.fireflyCount || 0)
        : 0,
      nightComfortLightsSitAnchorCount: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? Number(nightComfortLightsDescriptor.debug.sitAnchorCount || 0)
        : 0,
      nightComfortLightsDynamicLightCount: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? Number(nightComfortLightsDescriptor.debug.dynamicLightCount || 0)
        : 0,
      nightComfortLightsAssetSourceId: nightComfortLightsDescriptor && nightComfortLightsDescriptor.source
        ? nightComfortLightsDescriptor.source.id || ""
        : "",
      nightComfortLightsAssetApprovalStatus: nightComfortLightsDescriptor && nightComfortLightsDescriptor.source
        ? nightComfortLightsDescriptor.source.approvalStatus ||
          (nightComfortLightsDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      nightComfortLightsTransformId: nightComfortLightsDescriptor && nightComfortLightsDescriptor.transform
        ? nightComfortLightsDescriptor.transform.id || ""
        : "",
      nightComfortLightsHook: nightComfortLightsDescriptor && nightComfortLightsDescriptor.stateHook
        ? { ...nightComfortLightsDescriptor.stateHook }
        : null,
      nightComfortLightsDuplicateSystemClassification:
        nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
          ? nightComfortLightsDescriptor.debug.duplicateSystemClassification || ""
          : "",
      nightComfortLightsLightPerformanceNote: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? nightComfortLightsDescriptor.debug.lightPerformanceNote || ""
        : "",
      nightComfortLightsPlaceholderNote: nightComfortLightsDescriptor && nightComfortLightsDescriptor.debug
        ? nightComfortLightsDescriptor.debug.placeholderNote || ""
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
      pierShoreWorkSiteStage: pierShoreWorkSiteDescriptor ? pierShoreWorkSiteDescriptor.stage : "",
      pierShoreWorkSiteVariant: pierShoreWorkSiteDescriptor ? pierShoreWorkSiteDescriptor.variant : "",
      pierShoreWorkSiteState: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? pierShoreWorkSiteDescriptor.debug.currentFamilyState || ""
        : "",
      pierShoreWorkSiteDay: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? Number(pierShoreWorkSiteDescriptor.debug.day || 0)
        : 0,
      pierShoreWorkSitePostCount: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? Number(pierShoreWorkSiteDescriptor.debug.pierPostCount || 0)
        : 0,
      pierShoreWorkSitePlankCount: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? Number(pierShoreWorkSiteDescriptor.debug.plankCount || 0)
        : 0,
      pierShoreWorkSiteLashingCount: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? Number(pierShoreWorkSiteDescriptor.debug.lashingCount || 0)
        : 0,
      pierShoreWorkSiteWorkMarkerCount: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? Number(pierShoreWorkSiteDescriptor.debug.workMarkerCount || 0)
        : 0,
      pierShoreWorkSiteSafeBuildSiteCount: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? Number(pierShoreWorkSiteDescriptor.debug.safeBuildSiteCount || 0)
        : 0,
      pierShoreWorkSiteFishingSlotCount: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? Number(pierShoreWorkSiteDescriptor.debug.fishingSlotCount || 0)
        : 0,
      pierShoreWorkSiteAssetSourceId: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.source
        ? pierShoreWorkSiteDescriptor.source.id || ""
        : "",
      pierShoreWorkSiteAssetApprovalStatus: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.source
        ? pierShoreWorkSiteDescriptor.source.approvalStatus ||
          (pierShoreWorkSiteDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      pierShoreWorkSiteTransformId: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.transform
        ? pierShoreWorkSiteDescriptor.transform.id || ""
        : "",
      pierShoreWorkSiteHook: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.stateHook
        ? { ...pierShoreWorkSiteDescriptor.stateHook }
        : null,
      pierShoreWorkSiteDuplicateSystemClassification: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? pierShoreWorkSiteDescriptor.debug.duplicateSystemClassification || ""
        : "",
      pierShoreWorkSiteSafetyNote: pierShoreWorkSiteDescriptor && pierShoreWorkSiteDescriptor.debug
        ? pierShoreWorkSiteDescriptor.debug.shoreSafetyNote || ""
        : "",
      raftBoatRouteStage: raftBoatRouteDescriptor ? raftBoatRouteDescriptor.stage : "",
      raftBoatRouteVariant: raftBoatRouteDescriptor ? raftBoatRouteDescriptor.variant : "",
      raftBoatRouteState: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? raftBoatRouteDescriptor.debug.currentFamilyState || ""
        : "",
      raftBoatRouteDay: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.day || 0)
        : 0,
      raftBoatRouteBuildStage: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? raftBoatRouteDescriptor.debug.buildStage || ""
        : "",
      raftBoatRouteWaterState: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? raftBoatRouteDescriptor.debug.waterState || ""
        : "",
      raftBoatRouteRouteMarker: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Boolean(raftBoatRouteDescriptor.debug.routeMarker)
        : false,
      raftBoatRouteLogCount: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.logCount || 0)
        : 0,
      raftBoatRoutePlatformPlankCount: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.platformPlankCount || 0)
        : 0,
      raftBoatRouteLashingCount: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.lashingCount || 0)
        : 0,
      raftBoatRoutePaddleCount: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.paddleCount || 0)
        : 0,
      raftBoatRouteWakeMarkerCount: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.wakeMarkerCount || 0)
        : 0,
      raftBoatRouteRouteMarkerCount: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.routeMarkerCount || 0)
        : 0,
      raftBoatRouteLandingMarkerCount: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? Number(raftBoatRouteDescriptor.debug.landingMarkerCount || 0)
        : 0,
      raftBoatRouteAssetSourceId: raftBoatRouteDescriptor && raftBoatRouteDescriptor.source
        ? raftBoatRouteDescriptor.source.id || ""
        : "",
      raftBoatRouteAssetApprovalStatus: raftBoatRouteDescriptor && raftBoatRouteDescriptor.source
        ? raftBoatRouteDescriptor.source.approvalStatus ||
          (raftBoatRouteDescriptor.source.approvedForUse ? "approved" : "unapproved")
        : "",
      raftBoatRouteTransformId: raftBoatRouteDescriptor && raftBoatRouteDescriptor.transform
        ? raftBoatRouteDescriptor.transform.id || ""
        : "",
      raftBoatRouteHook: raftBoatRouteDescriptor && raftBoatRouteDescriptor.stateHook
        ? { ...raftBoatRouteDescriptor.stateHook }
        : null,
      raftBoatRouteDuplicateSystemClassification: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? raftBoatRouteDescriptor.debug.duplicateSystemClassification || ""
        : "",
      raftBoatRouteFutureIntegrationNote: raftBoatRouteDescriptor && raftBoatRouteDescriptor.debug
        ? raftBoatRouteDescriptor.debug.futureIntegrationNote || ""
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
