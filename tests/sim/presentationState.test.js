import assert from "node:assert/strict";
import test from "node:test";

import {
  DAY_1_5_PRESENTATION_ACTIONS,
  LEGACY_ACTION_PRESENTATION_MAP,
  resolveToyboxPresentationState
} from "../../bubble_ui/static/toybox/presentation/presentationState.js";
import { assetSourceMetadata } from "../../bubble_ui/static/toybox/presentation/assetSource.js";
import {
  ARRIVAL_BUNDLE_ITEM_ID,
  ARRIVAL_SUPPLIES_ID,
  BOUNDARY_STONE_ITEM_ID,
  BUILDABLE_IDS,
  CAMP_LAYOUT_ID,
  CAMP_PATHS_FAMILY,
  CAMP_STORAGE_ID,
  CAMP_ZONES_FAMILY,
  createInitialWorldState,
  FIRE_PIT_ID,
  GARDEN_PLOTS_FAMILY,
  HARVESTED_CROP_ITEM_ID,
  normalizeWorldState,
  STORAGE_WORKBENCH_TOOLS_ID,
  TOOL_RACK_ID,
  WATER_CAN_ITEM_ID
} from "../../bubble_ui/static/toybox/simulation/worldState.js";

const EXPECTED_OVERLAYS = Object.freeze({
  arriveLookAround: "gazeLookAround",
  gatherLooseSupplies: "bendPickup",
  pickupMaterial: "pickup",
  carryBundle: "carryAttachment",
  lightFire: "crouchFire",
  tendFire: "fireCare",
  buildHammock: "tieBuild",
  sleepInHammock: "lieDownAdditive",
  wakeStretch: "stretch",
  rest_sit: "restSit",
  rest_sleep_loop: "lieDownAdditive",
  rest_wake_stretch: "wakeStretch",
  depositMaterials: "depositMaterials",
  craftAtWorkbench: "craftAtWorkbench",
  inspectTool: "inspectTool",
  rakePath: "pathRakeSweep",
  placeBoundaryStone: "kneelPlaceStone",
  walkRoute: "routeWalk",
  planting: "gardenPlant",
  watering: "gardenWatering",
  harvesting: "gardenHarvest",
  inspectingGarden: "gardenInspect"
});

test("presentation resolver returns stable descriptors for Day 1-5 semantic labels", () => {
  for (const action of DAY_1_5_PRESENTATION_ACTIONS) {
    const worldState = createInitialWorldState({ seed: 101 });
    worldState.bubbleBoy.currentAction = action;
    if (action === "carryBundle") {
      worldState.bubbleBoy.velocity = { x: 0.4, y: 0, z: 0 };
    }

    const before = JSON.stringify(worldState);
    const descriptor = resolveToyboxPresentationState(worldState);
    const after = JSON.stringify(worldState);

    assert.equal(after, before, `${action} should not mutate worldState`);
    assert.equal(descriptor.selectedAction, action);
    assert.equal(descriptor.proceduralOverlay, EXPECTED_OVERLAYS[action]);
    assert.equal(typeof descriptor.animation.clip, "string");
    assert.equal(Array.isArray(descriptor.visuals), true);
    assert.equal(descriptor.visuals.length >= 6, true);
    assert.equal(isPlainData(descriptor), true, `${action} descriptor should be plain data`);
    assert.deepEqual(JSON.parse(JSON.stringify(descriptor)), descriptor);
  }
});

test("presentation resolver falls back safely for unknown actions", () => {
  const worldState = createInitialWorldState({ seed: 102 });
  worldState.bubbleBoy.currentAction = "unknownFutureAction";

  const descriptor = resolveToyboxPresentationState(worldState);

  assert.equal(descriptor.selectedAction, "arriveLookAround");
  assert.equal(descriptor.animation.clip, "Idle");
  assert.equal(descriptor.debug.selectedPresentationAction, "arriveLookAround");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver preserves existing action mappings", () => {
  for (const [legacyAction, presentationAction] of Object.entries(LEGACY_ACTION_PRESENTATION_MAP)) {
    const worldState = createInitialWorldState({ seed: 103 });
    worldState.bubbleBoy.currentAction = legacyAction;
    if (legacyAction === "walking") {
      worldState.bubbleBoy.velocity = { x: 0.2, y: 0, z: 0.1 };
    }

    const descriptor = resolveToyboxPresentationState(worldState);

    assert.equal(descriptor.selectedAction, presentationAction, legacyAction);
    assert.equal(typeof descriptor.debug.selectedAnimationFallback, "string");
  }
});

test("presentation resolver reports carry attachment and active visual families", () => {
  const worldState = createInitialWorldState({ seed: 104 });
  worldState.bubbleBoy.currentAction = "carryBundle";

  const descriptor = resolveToyboxPresentationState(worldState);

  assert.equal(descriptor.attachment.id, "carryBundle");
  assert.equal(descriptor.attachment.anchorType, "bbAttachment");
  assert.equal(descriptor.activeVisualFamilies.includes("carryBundle"), true);
  assert.equal(descriptor.debug.selectedCarryAttachment, "carryBundle");
});

test("presentation resolver exposes arrival supplies descriptor contract", () => {
  const worldState = createInitialWorldState({ seed: 1041 });

  const descriptor = resolveToyboxPresentationState(worldState);
  const arrivalSupplies = descriptor.visuals.find((visual) => visual.family === ARRIVAL_SUPPLIES_ID);

  assert.ok(arrivalSupplies);
  assert.equal(arrivalSupplies.id, ARRIVAL_SUPPLIES_ID);
  assert.equal(arrivalSupplies.stage, "supplies");
  assert.equal(arrivalSupplies.variant, "beachBundle");
  assert.equal(arrivalSupplies.source.id, "procedural_arrival_bundle");
  assert.equal(arrivalSupplies.source.sourceType, "procedural");
  assert.equal(arrivalSupplies.source.approvedForUse, true);
  assert.equal(arrivalSupplies.source.approvalStatus, "approved");
  assert.equal(arrivalSupplies.transform.id, "arrivalBundle");
  assert.equal(arrivalSupplies.transform.attachPoint, "none");
  assert.equal(arrivalSupplies.stateHook.state, "worldState.arrivalSupplies");
  assert.equal(arrivalSupplies.subProps.washedBundle.visible, true);
  assert.equal(arrivalSupplies.subProps.scatteredSticks.visible, true);
  assert.equal(arrivalSupplies.subProps.scatteredLeaves.visible, true);
  assert.equal(arrivalSupplies.subProps.materialPile.visible, false);
  assert.equal(arrivalSupplies.subProps.carryBundle.visible, false);
  assert.equal(arrivalSupplies.subProps.washedBundle.source.id, "procedural_arrival_bundle");
  assert.equal(arrivalSupplies.subProps.scatteredSticks.transform.id, "looseSticks");
  assert.equal(arrivalSupplies.debug.duplicateSystemClassification, "new placeholder family");
  assert.equal(descriptor.debug.arrivalSuppliesWashedBundle, true);
  assert.equal(descriptor.debug.arrivalSuppliesAssetSourceId, "procedural_arrival_bundle");
  assert.equal(descriptor.debug.arrivalSuppliesTransformId, "arrivalBundle");
});

test("presentation resolver toggles arrival scattered props and gathered pile from state", () => {
  const worldState = createInitialWorldState({ seed: 1042 });
  worldState.arrivalSupplies.scatteredSticksVisible = false;
  worldState.arrivalSupplies.scatteredLeavesVisible = false;
  worldState.arrivalSupplies.materialPileVisible = true;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const arrivalSupplies = descriptor.visuals.find((visual) => visual.family === ARRIVAL_SUPPLIES_ID);

  assert.equal(arrivalSupplies.stage, "partial");
  assert.equal(arrivalSupplies.subProps.scatteredSticks.visible, false);
  assert.equal(arrivalSupplies.subProps.scatteredLeaves.visible, false);
  assert.equal(arrivalSupplies.subProps.materialPile.visible, true);
  assert.equal(arrivalSupplies.subProps.materialPile.source.id, "procedural_arrival_material_pile");
  assert.equal(arrivalSupplies.subProps.materialPile.transform.id, "arrivalMaterialPile");
  assert.equal(descriptor.debug.arrivalSuppliesMaterialPile, true);
});

test("presentation resolver exposes carry bundle from carried item state", () => {
  const worldState = createInitialWorldState({ seed: 1043 });
  worldState.bubbleBoy.carriedItem = ARRIVAL_BUNDLE_ITEM_ID;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const arrivalSupplies = descriptor.visuals.find((visual) => visual.family === ARRIVAL_SUPPLIES_ID);

  assert.equal(worldState.arrivalSupplies.bundleCarriedByBB, true);
  assert.equal(arrivalSupplies.subProps.washedBundle.visible, false);
  assert.equal(arrivalSupplies.subProps.carryBundle.visible, true);
  assert.equal(arrivalSupplies.subProps.carryBundle.source.id, "procedural_arrival_carry_bundle");
  assert.equal(arrivalSupplies.subProps.carryBundle.transform.attachPoint, "bbBothHands");
  assert.equal(descriptor.attachment.id, "carryBundle");
  assert.equal(descriptor.attachment.stateHook.carriedItem, "worldState.bubbleBoy.carriedItem");
  assert.equal(descriptor.attachment.transform.attachPoint, "bbBothHands");
  assert.equal(descriptor.debug.arrivalSuppliesCarryBundle, true);
  assert.equal(descriptor.debug.bubbleBoyCarriedItem, ARRIVAL_BUNDLE_ITEM_ID);
});

test("presentation resolver hides arrival supplies safely when placeholder state is missing", () => {
  const descriptor = resolveToyboxPresentationState({
    bubbleBoy: { currentAction: "idle", inventory: {}, velocity: { x: 0, y: 0, z: 0 } },
    objects: {},
    buildables: {}
  });
  const arrivalSupplies = descriptor.visuals.find((visual) => visual.family === ARRIVAL_SUPPLIES_ID);

  assert.ok(arrivalSupplies);
  assert.equal(arrivalSupplies.visible, false);
  assert.equal(arrivalSupplies.subProps.washedBundle.visible, false);
  assert.equal(arrivalSupplies.subProps.carryBundle.visible, false);
  assert.equal(arrivalSupplies.debug.fallbackReason, "arrival supplies state hidden or missing");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes existing campfire firewood cooking-surface descriptor contract", () => {
  const worldState = createInitialWorldState({ seed: 1044 });
  worldState.bubbleBoy.inventory.fish = { state: "raw", id: "review-fish" };
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const firstFire = descriptor.visuals.find((visual) => visual.family === "firstFire");

  assert.ok(firstFire);
  assert.equal(firstFire.id, "firstFire");
  assert.equal(firstFire.visible, true);
  assert.equal(firstFire.stage, "lit");
  assert.equal(firstFire.variant, "cookingSurface");
  assert.equal(firstFire.source.id, "procedural_campfire_firewood_cooking_surface");
  assert.equal(firstFire.source.sourceType, "procedural");
  assert.equal(firstFire.source.approvedForUse, true);
  assert.equal(firstFire.source.approvalStatus, "approved");
  assert.equal(firstFire.transform.id, "campfireCookingSurface");
  assert.equal(firstFire.transform.attachPoint, "world");
  assert.equal(firstFire.stateHook.state, `worldState.objects.${FIRE_PIT_ID}`);
  assert.equal(firstFire.debug.duplicateSystemClassification, "extends existing campfire/firewood/fishing cooking system");
  assert.equal(firstFire.debug.cookingSurfaceActive, true);
  assert.equal(descriptor.debug.firstFireAssetSourceId, "procedural_campfire_firewood_cooking_surface");
  assert.equal(descriptor.debug.firstFireTransformId, "campfireCookingSurface");
});

test("presentation resolver exposes rest shelter descriptor contract", () => {
  const worldState = createInitialWorldState({ seed: 105 });

  const descriptor = resolveToyboxPresentationState(worldState);
  const restShelter = descriptor.visuals.find((visual) => visual.family === "restShelter");

  assert.ok(restShelter);
  assert.equal(restShelter.id, "restShelter");
  assert.equal(restShelter.stage, "hammock");
  assert.equal(restShelter.variant, "restSling");
  assert.equal(restShelter.source.id, "procedural_hammock");
  assert.equal(restShelter.source.sourceType, "procedural");
  assert.equal(restShelter.source.approvedForUse, true);
  assert.equal(restShelter.source.approvalStatus, "approved");
  assert.equal(restShelter.transform.id, "restSling");
  assert.equal(restShelter.transform.attachPoint, "world");
  assert.equal(restShelter.stateHook.state, "worldState.restShelter");
  assert.equal(restShelter.debug.duplicateSystemClassification, "extends existing shelter/bed system");
  assert.equal(descriptor.debug.restShelterAssetSourceId, "procedural_hammock");
  assert.equal(descriptor.debug.restShelterTransformId, "restSling");
});

test("presentation resolver maps sleep state to active bed upgrade and safe animation fallback", () => {
  const worldState = createInitialWorldState({ seed: 106 });
  completeBuildableForTest(worldState, BUILDABLE_IDS.shelter);
  completeBuildableForTest(worldState, BUILDABLE_IDS.bed);
  worldState.bubbleBoy.goal = "sleep";
  worldState.bubbleBoy.currentAction = "sleep";
  worldState.bubbleBoy.builder.actionState = "sleep";
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const restShelter = descriptor.visuals.find((visual) => visual.family === "restShelter");

  assert.equal(worldState.lifeLoop.canSleep, true);
  assert.equal(worldState.restShelter.stage, "bedUpgrade");
  assert.equal(descriptor.selectedAction, "rest_sleep_loop");
  assert.equal(descriptor.animation.clip, "Sitting");
  assert.equal(descriptor.animation.proceduralOverlay, "lieDownAdditive");
  assert.equal(descriptor.animation.semanticAction, "sleep");
  assert.equal(descriptor.animation.rootMotion, false);
  assert.match(descriptor.animation.fallbackReason, /no imported sleep clip/);
  assert.equal(restShelter.stage, "bedUpgrade");
  assert.equal(restShelter.variant, "cozyBed");
  assert.equal(restShelter.active, true);
  assert.equal(restShelter.usable, true);
  assert.equal(restShelter.source.id, "procedural_bed_upgrade");
  assert.equal(restShelter.transform.id, "cozyBed");
});

test("presentation resolver falls back safely for invalid rest shelter variant", () => {
  const worldState = createInitialWorldState({ seed: 107 });
  worldState.restShelter.stage = "missing";
  worldState.restShelter.variant = "missingVariant";
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const restShelter = descriptor.visuals.find((visual) => visual.family === "restShelter");

  assert.equal(restShelter.stage, "hammock");
  assert.equal(restShelter.variant, "restSling");
  assert.equal(restShelter.source.id, "procedural_hammock");
  assert.equal(restShelter.transform.id, "restSling");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes reinforced shelter details in the late day range", () => {
  const worldState = createInitialWorldState({ seed: 108 });
  completeBuildableForTest(worldState, BUILDABLE_IDS.shelter);
  worldState.time.day = 76;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const restShelter = descriptor.visuals.find((visual) => visual.family === "restShelter");

  assert.equal(restShelter.stage, "reinforcedShelter");
  assert.equal(restShelter.variant, "strongShelter");
  assert.equal(restShelter.source.id, "procedural_strong_shelter");
  assert.equal(restShelter.transform.id, "strongShelter");
});

test("presentation resolver exposes storage workbench tools descriptor contract", () => {
  const worldState = createInitialWorldState({ seed: 109 });

  const descriptor = resolveToyboxPresentationState(worldState);
  const storageTools = descriptor.visuals.find((visual) => visual.family === STORAGE_WORKBENCH_TOOLS_ID);

  assert.ok(storageTools);
  assert.equal(worldState.campStorage.id, CAMP_STORAGE_ID);
  assert.equal(worldState.toolRack.id, TOOL_RACK_ID);
  assert.equal(worldState.buildables.workbench, worldState.objects.workbench);
  assert.equal(storageTools.id, STORAGE_WORKBENCH_TOOLS_ID);
  assert.equal(storageTools.stage, "empty");
  assert.equal(storageTools.variant, "workbenchStorageRack");
  assert.equal(storageTools.visible, true);
  assert.equal(storageTools.source.id, "procedural_storage_basket");
  assert.equal(storageTools.source.sourceType, "procedural");
  assert.equal(storageTools.source.approvedForUse, true);
  assert.equal(storageTools.source.approvalStatus, "approved");
  assert.equal(storageTools.transform.id, "campStorageBasket");
  assert.equal(storageTools.transform.attachPoint, "world");
  assert.equal(storageTools.stateHook.state, "worldState.campStorage");
  assert.equal(storageTools.stateHook.workbench, "worldState.buildables.workbench");
  assert.equal(storageTools.stateHook.toolInventory, "worldState.bubbleBoy.toolInventory");
  assert.equal(storageTools.subProps.campStorage.visible, true);
  assert.equal(storageTools.subProps.campStorage.source.id, "procedural_storage_basket");
  assert.equal(storageTools.subProps.campStorage.transform.id, "campStorageBasket");
  assert.equal(storageTools.subProps.upgradedWorkbench.visible, true);
  assert.equal(storageTools.subProps.upgradedWorkbench.source.id, "procedural_workbench_upgrade");
  assert.equal(storageTools.subProps.upgradedWorkbench.transform.id, "upgradedWorkbench");
  assert.equal(storageTools.subProps.toolRack.visible, true);
  assert.equal(storageTools.subProps.toolRack.source.id, "procedural_tool_rack");
  assert.equal(storageTools.subProps.toolRack.transform.id, "toolRack");
  assert.equal(storageTools.subProps.firstTool.visible, false);
  assert.equal(storageTools.subProps.firstTool.source.id, "procedural_first_tool");
  assert.equal(storageTools.subProps.firstTool.transform.attachPoint, "bbRightHand");
  assert.equal(storageTools.debug.duplicateSystemClassification, "extends existing workbench/storage; new placeholder tool rack/tool inventory");
  assert.equal(descriptor.debug.storageWorkbenchToolsAssetSourceId, "procedural_storage_basket");
  assert.equal(descriptor.debug.storageWorkbenchToolsTransformId, "campStorageBasket");
  assert.equal(descriptor.debug.campStorageStage, "empty");
  assert.equal(descriptor.debug.toolRackStage, "empty");
});

test("presentation resolver maps storage and crafting actions to safe animation fallbacks", () => {
  const cases = [
    ["depositMaterials", "depositMaterials", "Punch"],
    ["craftAtWorkbench", "craftAtWorkbench", "Punch"],
    ["inspectTool", "inspectTool", "ThumbsUp"]
  ];

  for (const [action, overlay, emote] of cases) {
    const worldState = createInitialWorldState({ seed: 110 });
    worldState.bubbleBoy.currentAction = action;
    normalizeWorldState(worldState);

    const descriptor = resolveToyboxPresentationState(worldState);

    assert.equal(descriptor.selectedAction, action);
    assert.equal(descriptor.animation.proceduralOverlay, overlay);
    assert.equal(descriptor.animation.emote, emote);
    assert.equal(descriptor.animation.rootMotion, false);
    assert.match(descriptor.animation.fallbackReason, /no imported/);
    assert.equal(descriptor.debug.storageWorkbenchToolsState, "active");
  }
});

test("presentation resolver projects storage wood count, crafted tool, and inspection attachment", () => {
  const worldState = createInitialWorldState({ seed: 111 });
  worldState.campStorage.woodCount = 4;
  worldState.bubbleBoy.toolInventory.hasStoneTool = true;
  normalizeWorldState(worldState);

  const stockedDescriptor = resolveToyboxPresentationState(worldState);
  const stockedStorageTools = stockedDescriptor.visuals.find((visual) => visual.family === STORAGE_WORKBENCH_TOOLS_ID);

  assert.equal(worldState.campStorage.stage, "hasWood");
  assert.equal(worldState.toolRack.stage, "hasStoneTool");
  assert.equal(stockedStorageTools.stage, "toolReady");
  assert.equal(stockedStorageTools.subProps.campStorage.woodCount, 4);
  assert.equal(stockedStorageTools.subProps.firstTool.visible, true);
  assert.equal(stockedStorageTools.subProps.firstTool.rackVisible, true);
  assert.equal(stockedDescriptor.attachment, null);

  worldState.bubbleBoy.currentAction = "inspectTool";
  worldState.bubbleBoy.toolInventory.inspectingTool = "stoneTool";
  normalizeWorldState(worldState);

  const inspectDescriptor = resolveToyboxPresentationState(worldState);
  const inspectStorageTools = inspectDescriptor.visuals.find((visual) => visual.family === STORAGE_WORKBENCH_TOOLS_ID);

  assert.equal(inspectDescriptor.selectedAction, "inspectTool");
  assert.equal(inspectDescriptor.attachment.id, "firstTool");
  assert.equal(inspectDescriptor.attachment.anchorType, "bbAttachment");
  assert.equal(inspectDescriptor.attachment.attachmentPoint, "bbRightHand");
  assert.equal(inspectDescriptor.attachment.source.id, "procedural_first_tool");
  assert.equal(inspectDescriptor.attachment.transform.id, "firstTool");
  assert.equal(inspectDescriptor.attachment.stateHook.inspectingTool, "worldState.bubbleBoy.toolInventory.inspectingTool");
  assert.equal(inspectStorageTools.stage, "inspectTool");
  assert.equal(inspectStorageTools.subProps.firstTool.visible, true);
  assert.equal(inspectStorageTools.subProps.firstTool.attachedToBB, true);
  assert.equal(inspectStorageTools.subProps.firstTool.rackVisible, false);
  assert.equal(inspectDescriptor.debug.selectedCarryAttachment, "firstTool");
  assert.equal(inspectDescriptor.debug.selectedCarryAttachmentTransformId, "firstTool");
});

test("presentation resolver falls back safely when storage tool state is missing", () => {
  const descriptor = resolveToyboxPresentationState({
    bubbleBoy: { currentAction: "craftAtWorkbench", inventory: {}, velocity: { x: 0, y: 0, z: 0 } },
    objects: {},
    buildables: {}
  });
  const storageTools = descriptor.visuals.find((visual) => visual.family === STORAGE_WORKBENCH_TOOLS_ID);

  assert.ok(storageTools);
  assert.equal(storageTools.visible, true);
  assert.equal(storageTools.stage, "crafting");
  assert.equal(storageTools.subProps.campStorage.visible, true);
  assert.equal(storageTools.subProps.upgradedWorkbench.visible, true);
  assert.equal(storageTools.subProps.toolRack.visible, true);
  assert.equal(storageTools.source.approvedForUse, true);
  assert.equal(storageTools.transform.id, "campStorageBasket");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes camp paths and zones descriptor contract", () => {
  const worldState = createInitialWorldState({ seed: 112 });
  worldState.campLayout.paths = [{
    id: "testPath",
    stage: "cleared",
    variant: "dirtPath",
    waypoints: [
      { x: -5.55, y: 0.18, z: -1.9 },
      { x: -2.5, y: 0.18, z: -1.0 },
      { x: 0, y: 0.18, z: -0.16 }
    ]
  }];
  worldState.campLayout.zones = [{
    id: "zone_rest",
    type: "rest",
    stage: "marked",
    markerPlaced: true,
    anchorPosition: { x: -5.76, y: 0.18, z: -2.70 },
    boundaryStoneCount: 3
  }];
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const campPaths = descriptor.visuals.find((visual) => visual.family === CAMP_PATHS_FAMILY);
  const campZones = descriptor.visuals.find((visual) => visual.family === CAMP_ZONES_FAMILY);

  assert.equal(worldState.campLayout.id, CAMP_LAYOUT_ID);
  assert.ok(campPaths);
  assert.equal(campPaths.id, CAMP_PATHS_FAMILY);
  assert.equal(campPaths.visible, true);
  assert.equal(campPaths.stage, "cleared");
  assert.equal(campPaths.variant, "dirtPath");
  assert.equal(campPaths.source.id, "procedural_footpath_strip");
  assert.equal(campPaths.source.sourceType, "procedural");
  assert.equal(campPaths.source.approvedForUse, true);
  assert.equal(campPaths.source.approvalStatus, "approved");
  assert.equal(campPaths.transform.id, "footpathStrip");
  assert.equal(campPaths.transform.attachPoint, "world");
  assert.equal(campPaths.stateHook.state, "worldState.campLayout");
  assert.equal(campPaths.subProps.footpaths.visible, true);
  assert.equal(campPaths.subProps.footpaths.count, 1);
  assert.equal(campPaths.subProps.footpaths.transform.id, "footpathStrip");
  assert.equal(campPaths.subProps.boundaryStones.visible, true);
  assert.equal(campPaths.subProps.boundaryStones.count, 3);
  assert.equal(campPaths.subProps.boundaryStones.source.id, "procedural_boundary_stone");
  assert.equal(campPaths.subProps.boundaryStones.transform.id, "boundaryStone");
  assert.equal(campPaths.debug.duplicateSystemClassification, "new placeholder family");
  assert.equal(campPaths.debug.activePathCount, 1);
  assert.deepEqual(campPaths.debug.clearedPaths, ["testPath"]);
  assert.equal(campPaths.debug.boundaryStoneCount, 3);
  assert.ok(campZones);
  assert.equal(campZones.id, CAMP_ZONES_FAMILY);
  assert.equal(campZones.visible, true);
  assert.equal(campZones.stage, "marked");
  assert.equal(campZones.source.id, "procedural_zone_marker");
  assert.equal(campZones.transform.id, "zoneMarker");
  assert.equal(campZones.stateHook.zones, "worldState.campLayout.zones");
  assert.equal(campZones.subProps.zoneMarkers.visible, true);
  assert.equal(campZones.subProps.zoneMarkers.count, 1);
  assert.equal(campZones.subProps.zoneMarkers.items[0].type, "rest");
  assert.equal(campZones.debug.duplicateSystemClassification, "new placeholder family");
  assert.deepEqual(campZones.debug.markedZones, ["zone_rest"]);
  assert.equal(descriptor.debug.campPathsAssetSourceId, "procedural_footpath_strip");
  assert.equal(descriptor.debug.campPathsTransformId, "footpathStrip");
  assert.equal(descriptor.debug.campZonesAssetSourceId, "procedural_zone_marker");
  assert.equal(descriptor.debug.campZonesTransformId, "zoneMarker");
});

test("presentation resolver exposes lit camp path anchors from path stage", () => {
  const worldState = createInitialWorldState({ seed: 113 });
  worldState.campLayout.paths = [{
    id: "litLoop",
    stage: "lit",
    waypoints: [
      { x: -5.55, y: 0.18, z: -1.9 },
      { x: -2.75, y: 0.18, z: -1.05 },
      { x: 0, y: 0.18, z: -0.16 }
    ]
  }];
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const campPaths = descriptor.visuals.find((visual) => visual.family === CAMP_PATHS_FAMILY);

  assert.equal(campPaths.stage, "lit");
  assert.equal(campPaths.variant, "litDirtPath");
  assert.equal(campPaths.subProps.litAnchors.visible, true);
  assert.equal(campPaths.subProps.litAnchors.count, 2);
  assert.equal(campPaths.subProps.litAnchors.source.id, "procedural_lit_path_anchor");
  assert.equal(campPaths.subProps.litAnchors.transform.id, "litPathAnchor");
  assert.deepEqual(campPaths.debug.litPaths, ["litLoop"]);
});

test("presentation resolver maps camp layout actions to safe animation and attachment fallbacks", () => {
  const rakeWorld = createInitialWorldState({ seed: 114 });
  rakeWorld.bubbleBoy.currentAction = "rakePath";
  normalizeWorldState(rakeWorld);
  const rakeDescriptor = resolveToyboxPresentationState(rakeWorld);
  assert.equal(rakeDescriptor.selectedAction, "rakePath");
  assert.equal(rakeDescriptor.animation.proceduralOverlay, "pathRakeSweep");
  assert.equal(rakeDescriptor.animation.emote, "Punch");
  assert.equal(rakeDescriptor.animation.rootMotion, false);
  assert.match(rakeDescriptor.animation.fallbackReason, /no imported rake clip/);
  assert.equal(rakeDescriptor.debug.campPathsState, "active");

  const placeWorld = createInitialWorldState({ seed: 115 });
  placeWorld.bubbleBoy.currentAction = "placeBoundaryStone";
  placeWorld.bubbleBoy.carriedObject = BOUNDARY_STONE_ITEM_ID;
  normalizeWorldState(placeWorld);
  const placeDescriptor = resolveToyboxPresentationState(placeWorld);
  const campPaths = placeDescriptor.visuals.find((visual) => visual.family === CAMP_PATHS_FAMILY);
  assert.equal(placeDescriptor.selectedAction, "placeBoundaryStone");
  assert.equal(placeDescriptor.animation.proceduralOverlay, "kneelPlaceStone");
  assert.equal(placeDescriptor.animation.clip, "Sitting");
  assert.equal(placeDescriptor.animation.rootMotion, false);
  assert.equal(placeDescriptor.attachment.id, "boundaryStoneCarry");
  assert.equal(placeDescriptor.attachment.source.id, "procedural_boundary_stone");
  assert.equal(placeDescriptor.attachment.transform.id, "boundaryStoneCarry");
  assert.equal(placeDescriptor.attachment.stateHook.carriedObject, "worldState.bubbleBoy.carriedObject");
  assert.equal(campPaths.subProps.carriedBoundaryStone.visible, true);
  assert.equal(placeDescriptor.debug.selectedCarryAttachment, "boundaryStoneCarry");
  assert.equal(placeDescriptor.debug.bubbleBoyCarriedObject, BOUNDARY_STONE_ITEM_ID);

  const walkWorld = createInitialWorldState({ seed: 116 });
  walkWorld.bubbleBoy.currentAction = "walkRoute";
  walkWorld.bubbleBoy.velocity = { x: 0.2, y: 0, z: 0.1 };
  normalizeWorldState(walkWorld);
  const walkDescriptor = resolveToyboxPresentationState(walkWorld);
  assert.equal(walkDescriptor.selectedAction, "walkRoute");
  assert.equal(walkDescriptor.animation.clip, "Walking");
  assert.equal(walkDescriptor.animation.proceduralOverlay, "routeWalk");
  assert.equal(walkDescriptor.animation.rootMotion, false);
  assert.equal(walkDescriptor.animation.locomotionAware, true);
});

test("presentation resolver falls back safely when camp layout state is missing", () => {
  const descriptor = resolveToyboxPresentationState({
    bubbleBoy: { currentAction: "idle", inventory: {}, velocity: { x: 0, y: 0, z: 0 } },
    objects: {},
    buildables: {}
  });
  const campPaths = descriptor.visuals.find((visual) => visual.family === CAMP_PATHS_FAMILY);
  const campZones = descriptor.visuals.find((visual) => visual.family === CAMP_ZONES_FAMILY);

  assert.ok(campPaths);
  assert.equal(campPaths.visible, false);
  assert.equal(campPaths.stage, "none");
  assert.equal(campPaths.subProps.footpaths.count, 0);
  assert.equal(campPaths.subProps.boundaryStones.count, 0);
  assert.equal(campPaths.debug.fallbackReason, "no cleared/lit paths or carried boundary stone in campLayout");
  assert.ok(campZones);
  assert.equal(campZones.visible, false);
  assert.equal(campZones.stage, "none");
  assert.equal(campZones.subProps.zoneMarkers.count, 0);
  assert.equal(campZones.debug.fallbackReason, "no marked zones in campLayout");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes garden plot descriptor contract", () => {
  const worldState = createInitialWorldState({ seed: 117 });
  worldState.gardenPlots = [{
    id: "testPlot",
    stage: "sprout1",
    cropType: "carrot",
    watered: true,
    position: [2, 0.18, 2]
  }];
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const gardenPlots = descriptor.visuals.find((visual) => visual.family === GARDEN_PLOTS_FAMILY);

  assert.ok(gardenPlots);
  assert.equal(gardenPlots.id, GARDEN_PLOTS_FAMILY);
  assert.equal(gardenPlots.visible, true);
  assert.equal(gardenPlots.stage, "sprout1");
  assert.equal(gardenPlots.variant, "carrot");
  assert.equal(gardenPlots.source.id, "procedural_garden_plot");
  assert.equal(gardenPlots.source.sourceType, "procedural");
  assert.equal(gardenPlots.source.approvedForUse, true);
  assert.equal(gardenPlots.source.approvalStatus, "approved");
  assert.equal(gardenPlots.transform.id, "gardenPlot");
  assert.equal(gardenPlots.transform.attachPoint, "world");
  assert.equal(gardenPlots.stateHook.state, "worldState.gardenPlots");
  assert.equal(gardenPlots.stateHook.carrying, "worldState.bubbleBoy.carrying");
  assert.equal(gardenPlots.subProps.plots.visible, true);
  assert.equal(gardenPlots.subProps.plots.count, 1);
  assert.equal(gardenPlots.subProps.sprouts.visible, true);
  assert.equal(gardenPlots.subProps.sprouts.count, 1);
  assert.equal(gardenPlots.subProps.sprouts.source.id, "procedural_garden_sprout");
  assert.equal(gardenPlots.subProps.wateredIndicators.visible, true);
  assert.equal(gardenPlots.subProps.wateredIndicators.count, 1);
  assert.equal(gardenPlots.subProps.seeds.visible, false);
  assert.equal(gardenPlots.subProps.matureCrops.visible, false);
  assert.equal(gardenPlots.debug.duplicateSystemClassification, "new placeholder family");
  assert.equal(gardenPlots.debug.activePlotId, "testPlot");
  assert.equal(gardenPlots.debug.cropType, "carrot");
  assert.equal(gardenPlots.debug.watered, true);
  assert.equal(descriptor.debug.gardenPlotsAssetSourceId, "procedural_garden_plot");
  assert.equal(descriptor.debug.gardenPlotsTransformId, "gardenPlot");
  assert.equal(descriptor.debug.gardenPlotCount, 1);
  assert.equal(descriptor.debug.gardenSproutPlotCount, 1);
});

test("presentation resolver maps garden stages and unknown stage fallback safely", () => {
  const worldState = createInitialWorldState({ seed: 118 });
  worldState.gardenPlots = [
    { id: "seededPlot", stage: "seeded", cropType: "berry", position: { x: 2, y: 0.18, z: 2 } },
    { id: "grownPlot", stage: "grown", cropType: "leafy", position: { x: 2.8, y: 0.18, z: 2 } },
    { id: "invalidPlot", stage: "flowering", cropType: "missingCrop", position: { x: 3.6, y: 0.18, z: 2 } },
    { id: "harvestedPlot", stage: "harvested", cropType: "carrot", position: { x: 4.4, y: 0.18, z: 2 } }
  ];
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const gardenPlots = descriptor.visuals.find((visual) => visual.family === GARDEN_PLOTS_FAMILY);

  assert.equal(worldState.gardenPlots[2].stage, "tilled");
  assert.equal(worldState.gardenPlots[2].cropType, "carrot");
  assert.equal(gardenPlots.subProps.plots.count, 4);
  assert.equal(gardenPlots.subProps.seeds.visible, true);
  assert.equal(gardenPlots.subProps.seeds.count, 1);
  assert.equal(gardenPlots.subProps.matureCrops.visible, true);
  assert.equal(gardenPlots.subProps.matureCrops.count, 1);
  assert.equal(gardenPlots.subProps.plots.items.find((plot) => plot.id === "invalidPlot").stage, "tilled");
  assert.equal(gardenPlots.subProps.plots.items.find((plot) => plot.id === "harvestedPlot").stage, "harvested");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps garden actions to safe animation and attachment fallbacks", () => {
  const plantWorld = createInitialWorldState({ seed: 119 });
  plantWorld.bubbleBoy.currentAction = "planting";
  normalizeWorldState(plantWorld);
  const plantDescriptor = resolveToyboxPresentationState(plantWorld);
  assert.equal(plantDescriptor.selectedAction, "planting");
  assert.equal(plantDescriptor.animation.clip, "Sitting");
  assert.equal(plantDescriptor.animation.proceduralOverlay, "gardenPlant");
  assert.equal(plantDescriptor.animation.emote, "Punch");
  assert.equal(plantDescriptor.animation.rootMotion, false);
  assert.equal(plantDescriptor.debug.gardenPlotsState, "active");

  const waterWorld = createInitialWorldState({ seed: 120 });
  waterWorld.bubbleBoy.currentAction = "watering";
  waterWorld.bubbleBoy.carrying = WATER_CAN_ITEM_ID;
  waterWorld.gardenPlots = [{ id: "waterPlot", stage: "tilled", watered: true, position: [2, 0.18, 2] }];
  normalizeWorldState(waterWorld);
  const waterDescriptor = resolveToyboxPresentationState(waterWorld);
  const waterGarden = waterDescriptor.visuals.find((visual) => visual.family === GARDEN_PLOTS_FAMILY);
  assert.equal(waterDescriptor.selectedAction, "watering");
  assert.equal(waterDescriptor.animation.proceduralOverlay, "gardenWatering");
  assert.equal(waterDescriptor.animation.rootMotion, false);
  assert.equal(waterDescriptor.attachment.id, "waterCan");
  assert.equal(waterDescriptor.attachment.source.id, "procedural_watering_can");
  assert.equal(waterDescriptor.attachment.transform.id, "wateringCan");
  assert.equal(waterDescriptor.attachment.stateHook.carrying, "worldState.bubbleBoy.carrying");
  assert.equal(waterGarden.subProps.waterCan.visible, true);
  assert.equal(waterDescriptor.debug.selectedCarryAttachment, "waterCan");
  assert.equal(waterDescriptor.debug.bubbleBoyCarrying, WATER_CAN_ITEM_ID);

  const harvestWorld = createInitialWorldState({ seed: 121 });
  harvestWorld.bubbleBoy.currentAction = "harvesting";
  harvestWorld.bubbleBoy.carrying = HARVESTED_CROP_ITEM_ID;
  harvestWorld.gardenPlots = [{ id: "cropPlot", stage: "grown", cropType: "carrot", position: [2, 0.18, 2] }];
  normalizeWorldState(harvestWorld);
  const harvestDescriptor = resolveToyboxPresentationState(harvestWorld);
  const harvestGarden = harvestDescriptor.visuals.find((visual) => visual.family === GARDEN_PLOTS_FAMILY);
  assert.equal(harvestDescriptor.selectedAction, "harvesting");
  assert.equal(harvestDescriptor.animation.proceduralOverlay, "gardenHarvest");
  assert.equal(harvestDescriptor.attachment.id, "harvestedCropCarry");
  assert.equal(harvestDescriptor.attachment.source.id, "procedural_harvested_crop");
  assert.equal(harvestDescriptor.attachment.transform.id, "harvestedCrop");
  assert.equal(harvestGarden.subProps.harvestedCrop.visible, true);

  const inspectWorld = createInitialWorldState({ seed: 122 });
  inspectWorld.bubbleBoy.currentAction = "inspectingGarden";
  normalizeWorldState(inspectWorld);
  const inspectDescriptor = resolveToyboxPresentationState(inspectWorld);
  assert.equal(inspectDescriptor.selectedAction, "inspectingGarden");
  assert.equal(inspectDescriptor.animation.proceduralOverlay, "gardenInspect");
  assert.equal(inspectDescriptor.animation.rootMotion, false);
});

test("presentation resolver falls back safely when garden plot state is missing", () => {
  const descriptor = resolveToyboxPresentationState({
    bubbleBoy: { currentAction: "idle", inventory: {}, velocity: { x: 0, y: 0, z: 0 } },
    objects: {},
    buildables: {}
  });
  const gardenPlots = descriptor.visuals.find((visual) => visual.family === GARDEN_PLOTS_FAMILY);

  assert.ok(gardenPlots);
  assert.equal(gardenPlots.visible, false);
  assert.equal(gardenPlots.stage, "none");
  assert.equal(gardenPlots.subProps.plots.count, 0);
  assert.equal(gardenPlots.subProps.seeds.count, 0);
  assert.equal(gardenPlots.subProps.sprouts.count, 0);
  assert.equal(gardenPlots.subProps.matureCrops.count, 0);
  assert.equal(gardenPlots.subProps.waterCan.visible, false);
  assert.equal(gardenPlots.debug.fallbackReason, "no visible garden plot stage or garden attachment");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("external asset metadata defaults to unapproved without a confirmed license", () => {
  assert.equal(assetSourceMetadata({ sourceType: "external" }).approvedForUse, false);
  assert.equal(assetSourceMetadata({ sourceType: "external", approvedForUse: true }).approvedForUse, false);
  assert.equal(
    assetSourceMetadata({ sourceType: "external", license: "CC0", approvedForUse: true }).approvedForUse,
    true
  );
});

function completeBuildableForTest(worldState, buildableId) {
  const buildable = worldState.buildables[buildableId];
  buildable.progress = 1;
  buildable.status = "complete";
  buildable.storedWood = buildable.requiredWood;
  buildable.storedResources.wood = buildable.requiredWood;
  buildable.completedStageCount = buildable.stages.length;
  buildable.currentStageIndex = buildable.stages.length;
  buildable.stageProgress = 1;
  buildable.completedAt = worldState.sim.elapsedSeconds;
}

function isPlainData(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.every(isPlainData);
  if (typeof value !== "object") {
    return ["string", "number", "boolean"].includes(typeof value);
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Object.values(value).every(isPlainData);
}
