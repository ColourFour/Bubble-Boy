import assert from "node:assert/strict";
import test from "node:test";

import {
  DAY_1_5_PRESENTATION_ACTIONS,
  LEGACY_ACTION_PRESENTATION_MAP,
  resolveToyboxPresentationState
} from "../../bubble_ui/static/toybox/presentation/presentationState.js";
import { assetSourceMetadata } from "../../bubble_ui/static/toybox/presentation/assetSource.js";
import {
  ANIMAL_FAMILIAR_VISITOR_FAMILY,
  ANIMAL_FAMILIAR_VISITOR_ID,
  AMBIENT_BEACH_FINDS_FAMILY,
  AMBIENT_BEACH_FINDS_ID,
  ARRIVAL_BUNDLE_ITEM_ID,
  ARRIVAL_SUPPLIES_ID,
  BOUNDARY_STONE_ITEM_ID,
  BUILDABLE_IDS,
  CAMP_LAYOUT_ID,
  CAMP_PATHS_FAMILY,
  CAMP_STORAGE_ID,
  CAMP_ZONES_FAMILY,
  FISH_TRAP_ROUTINE_FAMILY,
  FISH_TRAP_ROUTINE_ID,
  FOOD_ROUTINE_FAMILY,
  FOOD_ROUTINE_ID,
  createInitialWorldState,
  FIRE_PIT_ID,
  GARDEN_PLOTS_FAMILY,
  HARVESTED_CROP_ITEM_ID,
  MUSIC_ART_DECOR_FAMILY,
  MUSIC_ART_DECOR_ID,
  NIGHT_COMFORT_LIGHTS_FAMILY,
  NIGHT_COMFORT_LIGHTS_ID,
  normalizeWorldState,
  PIER_SHORE_WORK_SITE_FAMILY,
  PIER_SHORE_WORK_SITE_ID,
  RAFT_BOAT_ROUTE_FAMILY,
  RAFT_BOAT_ROUTE_ID,
  STORAGE_WORKBENCH_TOOLS_ID,
  TOOL_RACK_ID,
  TOY_PLAY_SET_FAMILY,
  TOY_PLAY_SET_ID,
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

test("presentation resolver exposes food routine descriptor contract for Day 31-35", () => {
  const worldState = createInitialWorldState({ seed: 123 });
  worldState.time.day = 32;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const foodRoutine = descriptor.visuals.find((visual) => visual.family === FOOD_ROUTINE_ID);

  assert.ok(foodRoutine);
  assert.equal(foodRoutine.id, FOOD_ROUTINE_ID);
  assert.equal(foodRoutine.propFamily, FOOD_ROUTINE_FAMILY);
  assert.equal(foodRoutine.visible, true);
  assert.equal(foodRoutine.stage, "prep");
  assert.equal(foodRoutine.variant, "cookPrep");
  assert.equal(foodRoutine.source.id, "procedural_food_cook_pot");
  assert.equal(foodRoutine.source.sourceType, "procedural");
  assert.equal(foodRoutine.source.approvedForUse, true);
  assert.equal(foodRoutine.source.approvalStatus, "approved");
  assert.equal(foodRoutine.transform.id, "foodRoutineCluster");
  assert.equal(foodRoutine.transform.attachPoint, "world");
  assert.equal(foodRoutine.stateHook.state, "worldState.foodRoutine");
  assert.equal(foodRoutine.stateHook.day, "worldState.time.day");
  assert.equal(foodRoutine.subProps.cookSurface.visible, true);
  assert.equal(foodRoutine.subProps.cookSurface.source.id, "procedural_food_cook_pot");
  assert.equal(foodRoutine.subProps.cookSurface.transform.id, "foodCookPot");
  assert.equal(foodRoutine.subProps.foodBasket.visible, true);
  assert.equal(foodRoutine.subProps.foodBasket.source.id, "procedural_food_basket");
  assert.equal(foodRoutine.subProps.foodBasket.transform.id, "foodBasket");
  assert.equal(foodRoutine.subProps.storedMeals.visible, true);
  assert.equal(foodRoutine.subProps.storedMeals.source.id, "procedural_food_stored_meals");
  assert.equal(foodRoutine.subProps.dryingRack.visible, true);
  assert.equal(foodRoutine.subProps.dryingRack.source.id, "procedural_food_drying_rack");
  assert.equal(foodRoutine.subProps.fishHarvestDisplay.visible, true);
  assert.equal(foodRoutine.subProps.fishHarvestDisplay.source.id, "procedural_food_fish_harvest_display");
  assert.equal(foodRoutine.subProps.leftovers.visible, true);
  assert.equal(foodRoutine.subProps.leftovers.source.id, "procedural_food_leftovers");
  assert.equal(foodRoutine.debug.duplicateSystemClassification, "new presentation-only prop family; does not alter cooking/fishing/garden mechanics");
  assert.equal(foodRoutine.debug.day, 32);
  assert.equal(descriptor.debug.foodRoutineAssetSourceId, "procedural_food_cook_pot");
  assert.equal(descriptor.debug.foodRoutineTransformId, "foodRoutineCluster");
  assert.equal(descriptor.debug.foodRoutineMealCount, 3);
  assert.equal(descriptor.debug.foodRoutineDriedFishCount, 2);
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps Day 56-60 food routine storage variant", () => {
  const worldState = createInitialWorldState({ seed: 124 });
  worldState.time.day = 58;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const foodRoutine = descriptor.visuals.find((visual) => visual.family === FOOD_ROUTINE_ID);

  assert.equal(foodRoutine.visible, true);
  assert.equal(foodRoutine.stage, "stored");
  assert.equal(foodRoutine.variant, "storageSpread");
  assert.equal(foodRoutine.subProps.dryingRack.visible, true);
  assert.equal(foodRoutine.subProps.dryingRack.count, 4);
  assert.equal(descriptor.debug.foodRoutineDay, 58);
  assert.equal(descriptor.debug.foodRoutineDriedFishCount, 4);
});

test("presentation resolver hides food routine safely outside planned routine windows", () => {
  const worldState = createInitialWorldState({ seed: 125 });
  worldState.time.day = 30;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const foodRoutine = descriptor.visuals.find((visual) => visual.family === FOOD_ROUTINE_ID);

  assert.ok(foodRoutine);
  assert.equal(foodRoutine.visible, false);
  assert.equal(foodRoutine.stage, "none");
  assert.equal(foodRoutine.subProps.cookSurface.visible, false);
  assert.equal(foodRoutine.subProps.foodBasket.visible, false);
  assert.equal(foodRoutine.debug.fallbackReason, "outside Days 31-35/56-60 and no explicit foodRoutine state");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes fish trap routine descriptor contract for set state", () => {
  const worldState = createInitialWorldState({ seed: 226 });
  worldState.time.day = 56;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const fishTrapRoutine = descriptor.visuals.find((visual) => visual.family === FISH_TRAP_ROUTINE_ID);

  assert.ok(fishTrapRoutine);
  assert.equal(fishTrapRoutine.id, FISH_TRAP_ROUTINE_ID);
  assert.equal(fishTrapRoutine.propFamily, FISH_TRAP_ROUTINE_FAMILY);
  assert.equal(fishTrapRoutine.visible, true);
  assert.equal(fishTrapRoutine.stage, "set");
  assert.equal(fishTrapRoutine.variant, "setLine");
  assert.equal(fishTrapRoutine.source.id, "procedural_fish_trap_crab_pot");
  assert.equal(fishTrapRoutine.source.sourceType, "procedural");
  assert.equal(fishTrapRoutine.source.approvedForUse, true);
  assert.equal(fishTrapRoutine.transform.id, "fishTrapRoutineCluster");
  assert.equal(fishTrapRoutine.transform.attachPoint, "world");
  assert.equal(fishTrapRoutine.stateHook.state, "worldState.fishTrapRoutine");
  assert.equal(fishTrapRoutine.stateHook.trapState, "worldState.fishTrapRoutine.trapState");
  assert.equal(fishTrapRoutine.subProps.trap.visible, true);
  assert.equal(fishTrapRoutine.subProps.trap.source.id, "procedural_fish_trap_crab_pot");
  assert.equal(fishTrapRoutine.subProps.trap.transform.id, "fishTrapCrabPot");
  assert.equal(fishTrapRoutine.subProps.buoy.visible, true);
  assert.equal(fishTrapRoutine.subProps.buoy.source.id, "procedural_fish_trap_buoy_marker");
  assert.equal(fishTrapRoutine.subProps.ropeLine.visible, true);
  assert.equal(fishTrapRoutine.subProps.ropeLine.source.id, "procedural_fish_trap_rope_line");
  assert.equal(fishTrapRoutine.subProps.stateCues.visible, true);
  assert.equal(fishTrapRoutine.subProps.dryingRack.visible, false);
  assert.equal(fishTrapRoutine.subProps.catchDisplay.visible, false);
  assert.deepEqual(fishTrapRoutine.debug.statePlaceholders, ["unset", "set", "readyToCheck", "collected", "drying"]);
  assert.equal(
    fishTrapRoutine.debug.duplicateSystemClassification,
    "new passive trap routine prop family; does not alter fishing, ocean, food, raft, pier, storage, or economy systems"
  );
  assert.equal(descriptor.debug.fishTrapRoutineTrapState, "set");
  assert.equal(descriptor.debug.fishTrapRoutineAssetSourceId, "procedural_fish_trap_crab_pot");
  assert.equal(descriptor.debug.fishTrapRoutineTransformId, "fishTrapRoutineCluster");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps fish trap routine ready and drying placeholders for Days 56-60", () => {
  const readyWorldState = createInitialWorldState({ seed: 227 });
  readyWorldState.time.day = 58;
  normalizeWorldState(readyWorldState);

  const readyDescriptor = resolveToyboxPresentationState(readyWorldState);
  const readyTrap = readyDescriptor.visuals.find((visual) => visual.family === FISH_TRAP_ROUTINE_ID);

  assert.equal(readyTrap.visible, true);
  assert.equal(readyTrap.stage, "readyToCheck");
  assert.equal(readyTrap.variant, "readyCheck");
  assert.equal(readyTrap.subProps.trap.visible, true);
  assert.equal(readyTrap.subProps.trap.fishCount, 2);
  assert.equal(readyTrap.subProps.trap.crabCount, 1);
  assert.equal(readyTrap.subProps.stateCues.trapState, "readyToCheck");
  assert.equal(readyDescriptor.debug.fishTrapRoutineFishCount, 2);
  assert.equal(readyDescriptor.debug.fishTrapRoutineCrabCount, 1);

  const dryingWorldState = createInitialWorldState({ seed: 228 });
  dryingWorldState.time.day = 60;
  normalizeWorldState(dryingWorldState);

  const dryingDescriptor = resolveToyboxPresentationState(dryingWorldState);
  const dryingTrap = dryingDescriptor.visuals.find((visual) => visual.family === FISH_TRAP_ROUTINE_ID);

  assert.equal(dryingTrap.visible, true);
  assert.equal(dryingTrap.stage, "drying");
  assert.equal(dryingTrap.variant, "dryingRack");
  assert.equal(dryingTrap.subProps.trap.visible, false);
  assert.equal(dryingTrap.subProps.buoy.visible, false);
  assert.equal(dryingTrap.subProps.dryingRack.visible, true);
  assert.equal(dryingTrap.subProps.dryingRack.source.id, "procedural_fish_trap_drying_rack");
  assert.equal(dryingTrap.subProps.dryingRack.dryingFishCount, 4);
  assert.equal(dryingTrap.subProps.catchDisplay.visible, true);
  assert.equal(dryingTrap.subProps.catchDisplay.source.id, "procedural_fish_trap_catch_display");
  assert.equal(dryingDescriptor.debug.fishTrapRoutineDryingFishCount, 4);
  assert.match(dryingTrap.debug.placeholderNote, /no catch timers, randomness, storage, or food economy/);
});

test("presentation resolver hides fish trap routine safely outside planned routine window", () => {
  const worldState = createInitialWorldState({ seed: 229 });
  worldState.time.day = 55;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const fishTrapRoutine = descriptor.visuals.find((visual) => visual.family === FISH_TRAP_ROUTINE_ID);

  assert.ok(fishTrapRoutine);
  assert.equal(fishTrapRoutine.visible, false);
  assert.equal(fishTrapRoutine.stage, "unset");
  assert.equal(fishTrapRoutine.subProps.trap.visible, false);
  assert.equal(fishTrapRoutine.subProps.buoy.visible, false);
  assert.equal(fishTrapRoutine.subProps.ropeLine.visible, false);
  assert.equal(fishTrapRoutine.debug.fallbackReason, "outside Days 56-60 and no explicit fishTrapRoutine state");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes toy play set descriptor contract beside existing toy buildable", () => {
  const worldState = createInitialWorldState({ seed: 230 });
  worldState.time.day = 62;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const toyPlaySet = descriptor.visuals.find((visual) => visual.family === TOY_PLAY_SET_ID);

  assert.ok(toyPlaySet);
  assert.equal(toyPlaySet.id, TOY_PLAY_SET_ID);
  assert.equal(toyPlaySet.propFamily, TOY_PLAY_SET_FAMILY);
  assert.equal(toyPlaySet.visible, true);
  assert.equal(toyPlaySet.stage, "active");
  assert.equal(toyPlaySet.variant, "activeMain");
  assert.equal(toyPlaySet.source.id, "procedural_toy_play_collection_slots");
  assert.equal(toyPlaySet.source.sourceType, "procedural");
  assert.equal(toyPlaySet.source.approvedForUse, true);
  assert.equal(toyPlaySet.source.approvalStatus, "approved");
  assert.equal(toyPlaySet.transform.id, "toyPlaySetCluster");
  assert.equal(toyPlaySet.transform.attachPoint, "world");
  assert.equal(toyPlaySet.stateHook.state, "worldState.toyPlaySet");
  assert.equal(toyPlaySet.stateHook.existingBuildable, "worldState.buildables.toy-blocks");
  assert.equal(toyPlaySet.subProps.collectionSlots.visible, true);
  assert.equal(toyPlaySet.subProps.collectionSlots.source.id, "procedural_toy_play_collection_slots");
  assert.equal(toyPlaySet.subProps.collectionSlots.transform.id, "toyCollectionSlots");
  assert.equal(toyPlaySet.subProps.collectionSlots.count, 5);
  assert.equal(toyPlaySet.subProps.toyBlocks.visible, true);
  assert.equal(toyPlaySet.subProps.toyBlocks.source.id, "procedural_toy_play_blocks");
  assert.equal(toyPlaySet.subProps.toyBlocks.extendsBuildable, BUILDABLE_IDS.toyBlocks);
  assert.equal(toyPlaySet.subProps.ball.visible, true);
  assert.equal(toyPlaySet.subProps.ball.source.id, "procedural_toy_play_ball");
  assert.equal(toyPlaySet.subProps.kite.visible, true);
  assert.equal(toyPlaySet.subProps.kite.source.id, "procedural_toy_play_kite");
  assert.equal(toyPlaySet.subProps.kite.stringCount, 1);
  assert.equal(toyPlaySet.subProps.spinningTop.visible, true);
  assert.equal(toyPlaySet.subProps.spinningTop.source.id, "procedural_toy_play_spinning_top");
  assert.equal(toyPlaySet.subProps.playMat.visible, true);
  assert.equal(toyPlaySet.subProps.playMat.source.id, "procedural_toy_play_mat");
  assert.deepEqual(toyPlaySet.debug.statePlaceholders, ["hidden", "collection", "active", "matLayout", "kiteDay"]);
  assert.equal(toyPlaySet.debug.existingToyBuildableId, BUILDABLE_IDS.toyBlocks);
  assert.equal(toyPlaySet.debug.existingToyBuildableUseSlotAction, "playToy");
  assert.equal(
    toyPlaySet.debug.duplicateSystemClassification,
    "extension beside existing toy-block buildable; no competing toy crafting/use system"
  );
  assert.match(toyPlaySet.debug.placeholderNote, /no play cooldowns, mood effects, toy crafting/);
  assert.equal(descriptor.debug.toyPlaySetAssetSourceId, "procedural_toy_play_collection_slots");
  assert.equal(descriptor.debug.toyPlaySetTransformId, "toyPlaySetCluster");
  assert.equal(descriptor.debug.toyPlaySetExistingBuildableId, BUILDABLE_IDS.toyBlocks);
  assert.equal(descriptor.debug.toyPlaySetExistingUseSlotAction, "playToy");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps toy play set layout placeholders for Days 61-65", () => {
  const worldState = createInitialWorldState({ seed: 231 });
  worldState.time.day = 64;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const toyPlaySet = descriptor.visuals.find((visual) => visual.family === TOY_PLAY_SET_ID);

  assert.equal(toyPlaySet.visible, true);
  assert.equal(toyPlaySet.stage, "matLayout");
  assert.equal(toyPlaySet.variant, "playMatLayout");
  assert.equal(toyPlaySet.subProps.toyBlocks.count, 8);
  assert.equal(toyPlaySet.subProps.ball.visible, true);
  assert.equal(toyPlaySet.subProps.kite.handleCount, 1);
  assert.equal(toyPlaySet.subProps.playMat.count, 1);
  assert.equal(descriptor.debug.toyPlaySetDay, 64);
  assert.equal(descriptor.debug.toyPlaySetBlockCount, 8);
  assert.equal(descriptor.debug.toyPlaySetPlayMatCount, 1);
});

test("presentation resolver hides toy play set safely outside planned routine window", () => {
  const worldState = createInitialWorldState({ seed: 232 });
  worldState.time.day = 60;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const toyPlaySet = descriptor.visuals.find((visual) => visual.family === TOY_PLAY_SET_ID);

  assert.ok(toyPlaySet);
  assert.equal(toyPlaySet.visible, false);
  assert.equal(toyPlaySet.stage, "hidden");
  assert.equal(toyPlaySet.subProps.collectionSlots.visible, false);
  assert.equal(toyPlaySet.subProps.toyBlocks.visible, false);
  assert.equal(toyPlaySet.subProps.kite.visible, false);
  assert.equal(toyPlaySet.debug.fallbackReason, "outside Days 61-65 and no explicit toyPlaySet state");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes music art decor descriptor contract for Days 66-70", () => {
  const worldState = createInitialWorldState({ seed: 233 });
  worldState.time.day = 68;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const musicArtDecor = descriptor.visuals.find((visual) => visual.family === MUSIC_ART_DECOR_ID);

  assert.ok(musicArtDecor);
  assert.equal(musicArtDecor.id, MUSIC_ART_DECOR_ID);
  assert.equal(musicArtDecor.propFamily, MUSIC_ART_DECOR_FAMILY);
  assert.equal(musicArtDecor.visible, true);
  assert.equal(musicArtDecor.stage, "instruments");
  assert.equal(musicArtDecor.variant, "instrumentDisplay");
  assert.equal(musicArtDecor.source.id, "procedural_music_shell_chime");
  assert.equal(musicArtDecor.source.sourceType, "procedural");
  assert.equal(musicArtDecor.source.approvedForUse, true);
  assert.equal(musicArtDecor.source.approvalStatus, "approved");
  assert.equal(musicArtDecor.transform.id, "musicArtDecorCluster");
  assert.equal(musicArtDecor.transform.attachPoint, "world");
  assert.equal(musicArtDecor.stateHook.state, "worldState.musicArtDecor");
  assert.equal(musicArtDecor.stateHook.performanceAnchorPosition, "worldState.musicArtDecor.performanceAnchorPosition");
  assert.equal(musicArtDecor.subProps.shellChime.visible, true);
  assert.equal(musicArtDecor.subProps.shellChime.source.id, "procedural_music_shell_chime");
  assert.equal(musicArtDecor.subProps.shellChime.transform.id, "shellChime");
  assert.equal(musicArtDecor.subProps.paintedStones.visible, true);
  assert.equal(musicArtDecor.subProps.paintedStones.source.id, "procedural_music_painted_stones");
  assert.equal(musicArtDecor.subProps.paintedStones.count, 4);
  assert.equal(musicArtDecor.subProps.drumFlute.visible, true);
  assert.equal(musicArtDecor.subProps.drumFlute.source.id, "procedural_music_drum_flute");
  assert.equal(musicArtDecor.subProps.drumFlute.drumCount, 1);
  assert.equal(musicArtDecor.subProps.drumFlute.fluteCount, 1);
  assert.equal(musicArtDecor.subProps.hangingDecoration.visible, true);
  assert.equal(musicArtDecor.subProps.hangingDecoration.source.id, "procedural_music_hanging_decoration");
  assert.equal(musicArtDecor.subProps.artDisplaySlot.visible, true);
  assert.equal(musicArtDecor.subProps.artDisplaySlot.source.id, "procedural_music_art_display_slot");
  assert.equal(musicArtDecor.subProps.performanceMarker.visible, false);
  assert.equal(musicArtDecor.subProps.noteMarkers.visible, true);
  assert.equal(musicArtDecor.subProps.noteMarkers.source.id, "procedural_music_static_note_sparkle");
  assert.equal(musicArtDecor.subProps.noteMarkers.count, 2);
  assert.equal(musicArtDecor.subProps.noteMarkers.boundedStaticPool, true);
  assert.deepEqual(musicArtDecor.debug.statePlaceholders, [
    "hidden",
    "chime",
    "artDisplay",
    "instruments",
    "duskPerformance",
    "decoratedNook"
  ]);
  assert.equal(
    musicArtDecor.debug.duplicateSystemClassification,
    "new passive music/art decor prop family; does not alter audio, lighting, day/night, shelter, mood, or performance systems"
  );
  assert.match(musicArtDecor.debug.placeholderNote, /no audio-reactive systems, rhythm gameplay, sound engine/);
  assert.match(musicArtDecor.debug.particlePerformanceNote, /no live particle emitter/);
  assert.equal(descriptor.debug.musicArtDecorAssetSourceId, "procedural_music_shell_chime");
  assert.equal(descriptor.debug.musicArtDecorTransformId, "musicArtDecorCluster");
  assert.equal(descriptor.debug.musicArtDecorNoteMarkerCount, 2);
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps music art dusk performance static markers", () => {
  const worldState = createInitialWorldState({ seed: 234 });
  worldState.time.day = 69;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const musicArtDecor = descriptor.visuals.find((visual) => visual.family === MUSIC_ART_DECOR_ID);

  assert.equal(musicArtDecor.visible, true);
  assert.equal(musicArtDecor.stage, "duskPerformance");
  assert.equal(musicArtDecor.variant, "duskPerformance");
  assert.equal(musicArtDecor.subProps.performanceMarker.visible, true);
  assert.equal(musicArtDecor.subProps.performanceMarker.source.id, "procedural_music_dusk_performance_marker");
  assert.equal(musicArtDecor.subProps.noteMarkers.visible, true);
  assert.equal(musicArtDecor.subProps.noteMarkers.count, 5);
  assert.equal(musicArtDecor.subProps.noteMarkers.maxCount, 5);
  assert.equal(descriptor.debug.musicArtDecorDay, 69);
  assert.equal(descriptor.debug.musicArtDecorPerformanceMarkerCount, 1);
  assert.equal(descriptor.debug.musicArtDecorNoteMarkerCount, 5);
  assert.match(descriptor.debug.musicArtDecorParticlePerformanceNote, /static note\/sparkle marker pool capped at five/);
});

test("presentation resolver hides music art decor safely outside planned routine window", () => {
  const worldState = createInitialWorldState({ seed: 235 });
  worldState.time.day = 65;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const musicArtDecor = descriptor.visuals.find((visual) => visual.family === MUSIC_ART_DECOR_ID);

  assert.ok(musicArtDecor);
  assert.equal(musicArtDecor.visible, false);
  assert.equal(musicArtDecor.stage, "hidden");
  assert.equal(musicArtDecor.subProps.shellChime.visible, false);
  assert.equal(musicArtDecor.subProps.paintedStones.visible, false);
  assert.equal(musicArtDecor.subProps.noteMarkers.visible, false);
  assert.equal(musicArtDecor.debug.fallbackReason, "outside Days 66-70 and no explicit musicArtDecor state");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes animal familiar visitor descriptor contract for Days 71-75", () => {
  const worldState = createInitialWorldState({ seed: 236 });
  worldState.time.day = 73;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const animalFamiliarVisitor =
    descriptor.visuals.find((visual) => visual.family === ANIMAL_FAMILIAR_VISITOR_ID);

  assert.ok(animalFamiliarVisitor);
  assert.equal(animalFamiliarVisitor.id, ANIMAL_FAMILIAR_VISITOR_ID);
  assert.equal(animalFamiliarVisitor.propFamily, ANIMAL_FAMILIAR_VISITOR_FAMILY);
  assert.equal(animalFamiliarVisitor.visible, true);
  assert.equal(animalFamiliarVisitor.stage, "feedReady");
  assert.equal(animalFamiliarVisitor.variant, "feedStaging");
  assert.equal(animalFamiliarVisitor.source.id, "procedural_animal_familiar_ground_visitor");
  assert.equal(animalFamiliarVisitor.source.sourceType, "procedural");
  assert.equal(animalFamiliarVisitor.source.approvedForUse, true);
  assert.equal(animalFamiliarVisitor.source.approvalStatus, "approved");
  assert.equal(animalFamiliarVisitor.transform.id, "animalFamiliarVisitorCluster");
  assert.equal(animalFamiliarVisitor.transform.attachPoint, "world");
  assert.equal(animalFamiliarVisitor.stateHook.state, "worldState.animalFamiliarVisitor");
  assert.equal(animalFamiliarVisitor.subProps.groundVisitor.visible, true);
  assert.equal(animalFamiliarVisitor.subProps.groundVisitor.source.id, "procedural_animal_familiar_ground_visitor");
  assert.equal(animalFamiliarVisitor.subProps.groundVisitor.collisionEnabled, false);
  assert.equal(animalFamiliarVisitor.subProps.groundVisitor.blocksMovement, false);
  assert.equal(animalFamiliarVisitor.subProps.foodCrumbs.visible, true);
  assert.equal(animalFamiliarVisitor.subProps.foodCrumbs.source.id, "procedural_animal_familiar_food_crumb_marker");
  assert.equal(animalFamiliarVisitor.subProps.foodCrumbs.count, 4);
  assert.equal(animalFamiliarVisitor.subProps.observeRing.visible, true);
  assert.equal(animalFamiliarVisitor.subProps.observeRing.source.id, "procedural_animal_familiar_observe_marker");
  assert.equal(animalFamiliarVisitor.subProps.approachMarkers.visible, true);
  assert.equal(animalFamiliarVisitor.subProps.approachMarkers.count, 4);
  assert.equal(animalFamiliarVisitor.debug.collisionEnabled, false);
  assert.equal(animalFamiliarVisitor.debug.blocksMovement, false);
  assert.equal(animalFamiliarVisitor.debug.affectsCameraFollow, false);
  assert.match(animalFamiliarVisitor.debug.nonblockingNote, /nonblocking meshes, no colliders/);
  assert.match(animalFamiliarVisitor.debug.placeholderNote, /no animal AI, feeding mechanics/);
  assert.equal(descriptor.debug.animalFamiliarVisitorAssetSourceId, "procedural_animal_familiar_ground_visitor");
  assert.equal(descriptor.debug.animalFamiliarVisitorTransformId, "animalFamiliarVisitorCluster");
  assert.equal(descriptor.debug.animalFamiliarVisitorFoodCrumbCount, 4);
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps animal familiar visitor bird and fish placeholders", () => {
  const birdWorld = createInitialWorldState({ seed: 237 });
  birdWorld.time.day = 74;
  normalizeWorldState(birdWorld);
  const birdDescriptor = resolveToyboxPresentationState(birdWorld);
  const birdVisitor = birdDescriptor.visuals.find((visual) => visual.family === ANIMAL_FAMILIAR_VISITOR_ID);
  assert.equal(birdVisitor.stage, "birdVisit");
  assert.equal(birdVisitor.variant, "birdVisitor");
  assert.equal(birdVisitor.subProps.birdVisitor.visible, true);
  assert.equal(birdVisitor.subProps.birdVisitor.count, 2);
  assert.equal(birdVisitor.subProps.birdVisitor.source.id, "procedural_animal_familiar_bird_visitor");

  const fishWorld = createInitialWorldState({ seed: 238 });
  fishWorld.time.day = 75;
  normalizeWorldState(fishWorld);
  const fishDescriptor = resolveToyboxPresentationState(fishWorld);
  const fishVisitor = fishDescriptor.visuals.find((visual) => visual.family === ANIMAL_FAMILIAR_VISITOR_ID);
  assert.equal(fishVisitor.stage, "fishVisit");
  assert.equal(fishVisitor.variant, "fishVisitor");
  assert.equal(fishVisitor.subProps.fishVisitor.visible, true);
  assert.equal(fishVisitor.subProps.fishVisitor.count, 2);
  assert.equal(fishVisitor.subProps.fishVisitor.source.id, "procedural_animal_familiar_fish_visitor");
  assert.equal(fishDescriptor.debug.animalFamiliarVisitorFishVisitorCount, 2);
});

test("presentation resolver hides animal familiar visitor safely outside planned routine window", () => {
  const worldState = createInitialWorldState({ seed: 239 });
  worldState.time.day = 70;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const animalFamiliarVisitor =
    descriptor.visuals.find((visual) => visual.family === ANIMAL_FAMILIAR_VISITOR_ID);

  assert.ok(animalFamiliarVisitor);
  assert.equal(animalFamiliarVisitor.visible, false);
  assert.equal(animalFamiliarVisitor.stage, "hidden");
  assert.equal(animalFamiliarVisitor.subProps.groundVisitor.visible, false);
  assert.equal(animalFamiliarVisitor.subProps.foodCrumbs.visible, false);
  assert.equal(animalFamiliarVisitor.subProps.observeRing.visible, false);
  assert.equal(
    animalFamiliarVisitor.debug.fallbackReason,
    "outside Days 71-75 and no explicit animalFamiliarVisitor state"
  );
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes night comfort lights descriptor contract for Days 81-85", () => {
  const worldState = createInitialWorldState({ seed: 240 });
  worldState.time.day = 84;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const nightComfortLights = descriptor.visuals.find((visual) => visual.family === NIGHT_COMFORT_LIGHTS_ID);

  assert.ok(nightComfortLights);
  assert.equal(nightComfortLights.id, NIGHT_COMFORT_LIGHTS_ID);
  assert.equal(nightComfortLights.propFamily, NIGHT_COMFORT_LIGHTS_FAMILY);
  assert.equal(nightComfortLights.visible, true);
  assert.equal(nightComfortLights.stage, "fireflyGlow");
  assert.equal(nightComfortLights.variant, "fireflyGlow");
  assert.equal(nightComfortLights.source.id, "procedural_night_lantern_post");
  assert.equal(nightComfortLights.source.sourceType, "procedural");
  assert.equal(nightComfortLights.source.approvedForUse, true);
  assert.equal(nightComfortLights.source.approvalStatus, "approved");
  assert.equal(nightComfortLights.transform.id, "nightComfortLightsCluster");
  assert.equal(nightComfortLights.transform.attachPoint, "world");
  assert.equal(nightComfortLights.stateHook.state, "worldState.nightComfortLights");
  assert.equal(nightComfortLights.subProps.lanternPosts.visible, true);
  assert.equal(nightComfortLights.subProps.lanternPosts.source.id, "procedural_night_lantern_post");
  assert.equal(nightComfortLights.subProps.lanternPosts.count, 4);
  assert.equal(nightComfortLights.subProps.litPathAnchors.visible, true);
  assert.equal(nightComfortLights.subProps.litPathAnchors.source.id, "procedural_night_lit_path_anchor");
  assert.equal(nightComfortLights.subProps.litPathAnchors.count, 5);
  assert.equal(nightComfortLights.subProps.glowingShells.visible, true);
  assert.equal(nightComfortLights.subProps.glowingShells.source.id, "procedural_night_glowing_shell");
  assert.equal(nightComfortLights.subProps.glowingShells.count, 8);
  assert.equal(nightComfortLights.subProps.fireflies.visible, true);
  assert.equal(nightComfortLights.subProps.fireflies.source.id, "procedural_night_deterministic_fireflies");
  assert.equal(nightComfortLights.subProps.fireflies.count, 12);
  assert.equal(nightComfortLights.subProps.fireflies.maxCount, 12);
  assert.equal(nightComfortLights.subProps.fireflies.deterministic, true);
  assert.equal(nightComfortLights.subProps.fireflies.boundedStaticPool, true);
  assert.equal(nightComfortLights.subProps.sitAnchor.visible, true);
  assert.equal(nightComfortLights.subProps.sitAnchor.source.id, "procedural_night_sit_light_anchor");
  assert.equal(nightComfortLights.debug.dynamicLightCount, 0);
  assert.equal(nightComfortLights.debug.usesDynamicLights, false);
  assert.equal(nightComfortLights.debug.maxFireflySprites, 12);
  assert.match(nightComfortLights.debug.lightPerformanceNote, /no dynamic lights or unbounded emitters/);
  assert.match(nightComfortLights.debug.placeholderNote, /no lantern fuel, lighting schedules/);
  assert.equal(descriptor.debug.nightComfortLightsAssetSourceId, "procedural_night_lantern_post");
  assert.equal(descriptor.debug.nightComfortLightsTransformId, "nightComfortLightsCluster");
  assert.equal(descriptor.debug.nightComfortLightsFireflyCount, 12);
  assert.equal(descriptor.debug.nightComfortLightsDynamicLightCount, 0);
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps night comfort inactive and sit-at-night placeholders", () => {
  const inactiveWorld = createInitialWorldState({ seed: 241 });
  inactiveWorld.time.day = 81;
  normalizeWorldState(inactiveWorld);
  const inactiveDescriptor = resolveToyboxPresentationState(inactiveWorld);
  const inactiveLights = inactiveDescriptor.visuals.find((visual) => visual.family === NIGHT_COMFORT_LIGHTS_ID);
  assert.equal(inactiveLights.stage, "inactive");
  assert.equal(inactiveLights.variant, "inactive");
  assert.equal(inactiveLights.subProps.lanternPosts.count, 2);
  assert.equal(inactiveLights.subProps.glowingShells.visible, false);
  assert.equal(inactiveLights.subProps.fireflies.visible, false);

  const sitWorld = createInitialWorldState({ seed: 242 });
  sitWorld.time.day = 85;
  normalizeWorldState(sitWorld);
  const sitDescriptor = resolveToyboxPresentationState(sitWorld);
  const sitLights = sitDescriptor.visuals.find((visual) => visual.family === NIGHT_COMFORT_LIGHTS_ID);
  assert.equal(sitLights.stage, "sitAtNight");
  assert.equal(sitLights.variant, "sitAnchor");
  assert.equal(sitLights.subProps.sitAnchor.visible, true);
  assert.equal(sitLights.subProps.sitAnchor.count, 2);
  assert.equal(sitDescriptor.debug.nightComfortLightsSitAnchorCount, 2);
});

test("presentation resolver hides night comfort lights safely outside planned routine window", () => {
  const worldState = createInitialWorldState({ seed: 243 });
  worldState.time.day = 80;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const nightComfortLights = descriptor.visuals.find((visual) => visual.family === NIGHT_COMFORT_LIGHTS_ID);

  assert.ok(nightComfortLights);
  assert.equal(nightComfortLights.visible, false);
  assert.equal(nightComfortLights.stage, "hidden");
  assert.equal(nightComfortLights.subProps.lanternPosts.visible, false);
  assert.equal(nightComfortLights.subProps.glowingShells.visible, false);
  assert.equal(nightComfortLights.subProps.fireflies.visible, false);
  assert.equal(
    nightComfortLights.debug.fallbackReason,
    "outside Days 81-85 and no explicit nightComfortLights state"
  );
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes ambient beach finds descriptor contract for Day 36-40", () => {
  const worldState = createInitialWorldState({ seed: 126 });
  worldState.time.day = 37;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const ambientBeachFinds = descriptor.visuals.find((visual) => visual.family === AMBIENT_BEACH_FINDS_ID);

  assert.ok(ambientBeachFinds);
  assert.equal(ambientBeachFinds.id, AMBIENT_BEACH_FINDS_ID);
  assert.equal(ambientBeachFinds.propFamily, AMBIENT_BEACH_FINDS_FAMILY);
  assert.equal(ambientBeachFinds.visible, true);
  assert.equal(ambientBeachFinds.stage, "finds");
  assert.equal(ambientBeachFinds.variant, "shorelineFinds");
  assert.equal(ambientBeachFinds.source.id, "procedural_beach_shells");
  assert.equal(ambientBeachFinds.source.sourceType, "procedural");
  assert.equal(ambientBeachFinds.source.approvedForUse, true);
  assert.equal(ambientBeachFinds.source.approvalStatus, "approved");
  assert.equal(ambientBeachFinds.transform.id, "ambientBeachFindsCluster");
  assert.equal(ambientBeachFinds.transform.attachPoint, "world");
  assert.equal(ambientBeachFinds.stateHook.state, "worldState.ambientBeachFinds");
  assert.equal(ambientBeachFinds.stateHook.day, "worldState.time.day");
  assert.equal(ambientBeachFinds.subProps.shells.visible, true);
  assert.equal(ambientBeachFinds.subProps.shells.source.id, "procedural_beach_shells");
  assert.equal(ambientBeachFinds.subProps.shells.transform.id, "beachShells");
  assert.equal(ambientBeachFinds.subProps.shells.count, 10);
  assert.equal(ambientBeachFinds.subProps.shells.instanced, true);
  assert.equal(ambientBeachFinds.subProps.driftwood.visible, true);
  assert.equal(ambientBeachFinds.subProps.driftwood.source.id, "procedural_beach_driftwood");
  assert.equal(ambientBeachFinds.subProps.driftwood.transform.id, "beachDriftwood");
  assert.equal(ambientBeachFinds.subProps.driftwood.count, 4);
  assert.equal(ambientBeachFinds.subProps.tinyFinds.visible, true);
  assert.equal(ambientBeachFinds.subProps.tinyFinds.source.id, "procedural_tiny_beach_finds");
  assert.equal(ambientBeachFinds.subProps.tinyFinds.instanced, true);
  assert.equal(ambientBeachFinds.subProps.tinyFinds.count, 5);
  assert.equal(ambientBeachFinds.subProps.foodCrumbs.visible, true);
  assert.equal(ambientBeachFinds.subProps.foodCrumbs.source.id, "procedural_food_crumb_marker");
  assert.equal(ambientBeachFinds.subProps.foodCrumbs.count, 1);
  assert.equal(ambientBeachFinds.subProps.animalVisitor.visible, true);
  assert.equal(ambientBeachFinds.subProps.animalVisitor.source.id, "procedural_recurring_animal_visitor");
  assert.equal(ambientBeachFinds.subProps.animalVisitor.count, 1);
  assert.equal(ambientBeachFinds.subProps.birdMarkers.visible, true);
  assert.equal(ambientBeachFinds.subProps.birdMarkers.source.id, "procedural_ambient_bird_marker");
  assert.equal(ambientBeachFinds.subProps.birdMarkers.count, 2);
  assert.equal(ambientBeachFinds.subProps.fishMarkers.visible, true);
  assert.equal(ambientBeachFinds.subProps.fishMarkers.source.id, "procedural_ambient_fish_marker");
  assert.equal(ambientBeachFinds.subProps.fishMarkers.count, 3);
  assert.equal(
    ambientBeachFinds.debug.duplicateSystemClassification,
    "new passive decorative shoreline prop family; does not alter ocean/bird/fish/weather/terrain systems"
  );
  assert.equal(ambientBeachFinds.debug.day, 37);
  assert.equal(descriptor.debug.ambientBeachFindsAssetSourceId, "procedural_beach_shells");
  assert.equal(descriptor.debug.ambientBeachFindsTransformId, "ambientBeachFindsCluster");
  assert.equal(descriptor.debug.ambientBeachFindsShellCount, 10);
  assert.equal(descriptor.debug.ambientBeachFindsDriftwoodCount, 4);
  assert.equal(descriptor.debug.ambientBeachFindsAnimalVisitorVisible, true);
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps Day 71-75 ambient beach visitor variant", () => {
  const worldState = createInitialWorldState({ seed: 127 });
  worldState.time.day = 72;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const ambientBeachFinds = descriptor.visuals.find((visual) => visual.family === AMBIENT_BEACH_FINDS_ID);

  assert.equal(ambientBeachFinds.visible, true);
  assert.equal(ambientBeachFinds.stage, "visitor");
  assert.equal(ambientBeachFinds.variant, "visitorReturn");
  assert.equal(ambientBeachFinds.subProps.shells.count, 12);
  assert.equal(ambientBeachFinds.subProps.driftwood.count, 5);
  assert.equal(ambientBeachFinds.subProps.tinyFinds.count, 7);
  assert.equal(ambientBeachFinds.subProps.foodCrumbs.count, 2);
  assert.equal(ambientBeachFinds.subProps.animalVisitor.visible, true);
  assert.equal(ambientBeachFinds.subProps.birdMarkers.count, 3);
  assert.equal(ambientBeachFinds.subProps.fishMarkers.count, 4);
  assert.equal(descriptor.debug.ambientBeachFindsDay, 72);
  assert.equal(descriptor.debug.ambientBeachFindsBirdMarkerCount, 3);
  assert.equal(descriptor.debug.ambientBeachFindsFishMarkerCount, 4);
});

test("presentation resolver hides ambient beach finds safely outside planned windows", () => {
  const worldState = createInitialWorldState({ seed: 128 });
  worldState.time.day = 41;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const ambientBeachFinds = descriptor.visuals.find((visual) => visual.family === AMBIENT_BEACH_FINDS_ID);

  assert.ok(ambientBeachFinds);
  assert.equal(ambientBeachFinds.visible, false);
  assert.equal(ambientBeachFinds.stage, "none");
  assert.equal(ambientBeachFinds.subProps.shells.visible, false);
  assert.equal(ambientBeachFinds.subProps.driftwood.visible, false);
  assert.equal(ambientBeachFinds.subProps.animalVisitor.visible, false);
  assert.equal(
    ambientBeachFinds.debug.fallbackReason,
    "outside Days 36-40/71-75 and no explicit ambientBeachFinds state"
  );
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes pier shore work-site descriptor contract for Day 41-45", () => {
  const worldState = createInitialWorldState({ seed: 129 });
  worldState.time.day = 42;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const pierShoreWorkSite = descriptor.visuals.find((visual) => visual.family === PIER_SHORE_WORK_SITE_ID);

  assert.ok(pierShoreWorkSite);
  assert.equal(pierShoreWorkSite.id, PIER_SHORE_WORK_SITE_ID);
  assert.equal(pierShoreWorkSite.propFamily, PIER_SHORE_WORK_SITE_FAMILY);
  assert.equal(pierShoreWorkSite.visible, true);
  assert.equal(pierShoreWorkSite.usable, false);
  assert.equal(pierShoreWorkSite.stage, "posts");
  assert.equal(pierShoreWorkSite.variant, "partialPier");
  assert.equal(pierShoreWorkSite.source.id, "procedural_pier_posts");
  assert.equal(pierShoreWorkSite.source.sourceType, "procedural");
  assert.equal(pierShoreWorkSite.source.approvedForUse, true);
  assert.equal(pierShoreWorkSite.source.approvalStatus, "approved");
  assert.equal(pierShoreWorkSite.transform.id, "pierShoreWorkSiteCluster");
  assert.equal(pierShoreWorkSite.transform.attachPoint, "world");
  assert.equal(pierShoreWorkSite.stateHook.state, "worldState.pierShoreWorkSite");
  assert.equal(pierShoreWorkSite.stateHook.day, "worldState.time.day");
  assert.equal(pierShoreWorkSite.stateHook.safeBuildAnchorPosition, "worldState.pierShoreWorkSite.safeBuildAnchorPosition");
  assert.equal(pierShoreWorkSite.subProps.pierPosts.visible, true);
  assert.equal(pierShoreWorkSite.subProps.pierPosts.source.id, "procedural_pier_posts");
  assert.equal(pierShoreWorkSite.subProps.pierPosts.transform.id, "pierPosts");
  assert.equal(pierShoreWorkSite.subProps.pierPosts.count, 6);
  assert.equal(pierShoreWorkSite.subProps.pierPosts.pooled, true);
  assert.equal(pierShoreWorkSite.subProps.planks.visible, true);
  assert.equal(pierShoreWorkSite.subProps.planks.source.id, "procedural_pier_planks");
  assert.equal(pierShoreWorkSite.subProps.planks.transform.id, "pierPlanks");
  assert.equal(pierShoreWorkSite.subProps.planks.count, 5);
  assert.equal(pierShoreWorkSite.subProps.lashings.visible, true);
  assert.equal(pierShoreWorkSite.subProps.lashings.source.id, "procedural_pier_lashings");
  assert.equal(pierShoreWorkSite.subProps.lashings.transform.id, "pierLashings");
  assert.equal(pierShoreWorkSite.subProps.lashings.count, 8);
  assert.equal(pierShoreWorkSite.subProps.shoreWorkMarker.visible, true);
  assert.equal(pierShoreWorkSite.subProps.shoreWorkMarker.source.id, "procedural_shore_work_marker");
  assert.equal(pierShoreWorkSite.subProps.shoreWorkMarker.count, 1);
  assert.equal(pierShoreWorkSite.subProps.safeBuildSite.visible, true);
  assert.equal(pierShoreWorkSite.subProps.safeBuildSite.source.id, "procedural_safe_water_edge_build_site");
  assert.equal(pierShoreWorkSite.subProps.safeBuildSite.transform.anchorPoint, "land-side-safe-build-site");
  assert.equal(pierShoreWorkSite.subProps.safeBuildSite.safety, "land-side visual marker");
  assert.equal(pierShoreWorkSite.subProps.pierFishingSlot.visible, true);
  assert.equal(pierShoreWorkSite.subProps.pierFishingSlot.source.id, "procedural_pier_fishing_slot_marker");
  assert.equal(pierShoreWorkSite.subProps.pierFishingSlot.behavior, "visual-placeholder");
  assert.equal(
    pierShoreWorkSite.debug.duplicateSystemClassification,
    "new passive shore work-site prop family; does not alter ocean, terrain, movement, or fishing target logic"
  );
  assert.match(pierShoreWorkSite.debug.shoreSafetyNote, /BB and build marker remain on land/);
  assert.equal(pierShoreWorkSite.debug.day, 42);
  assert.equal(descriptor.debug.pierShoreWorkSiteAssetSourceId, "procedural_pier_posts");
  assert.equal(descriptor.debug.pierShoreWorkSiteTransformId, "pierShoreWorkSiteCluster");
  assert.equal(descriptor.debug.pierShoreWorkSitePostCount, 6);
  assert.equal(descriptor.debug.pierShoreWorkSitePlankCount, 5);
  assert.equal(descriptor.debug.pierShoreWorkSiteSafeBuildSiteCount, 1);
  assert.match(descriptor.debug.pierShoreWorkSiteSafetyNote, /BB and build marker remain on land/);
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps later pier shore work-site planking stage", () => {
  const worldState = createInitialWorldState({ seed: 130 });
  worldState.time.day = 45;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const pierShoreWorkSite = descriptor.visuals.find((visual) => visual.family === PIER_SHORE_WORK_SITE_ID);

  assert.equal(pierShoreWorkSite.visible, true);
  assert.equal(pierShoreWorkSite.stage, "planking");
  assert.equal(pierShoreWorkSite.variant, "partialPier");
  assert.equal(pierShoreWorkSite.subProps.pierPosts.count, 8);
  assert.equal(pierShoreWorkSite.subProps.planks.count, 7);
  assert.equal(pierShoreWorkSite.subProps.lashings.count, 10);
  assert.equal(descriptor.debug.pierShoreWorkSiteDay, 45);
  assert.equal(descriptor.debug.pierShoreWorkSiteLashingCount, 10);
});

test("presentation resolver hides pier shore work site safely outside planned window", () => {
  const worldState = createInitialWorldState({ seed: 131 });
  worldState.time.day = 46;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const pierShoreWorkSite = descriptor.visuals.find((visual) => visual.family === PIER_SHORE_WORK_SITE_ID);

  assert.ok(pierShoreWorkSite);
  assert.equal(pierShoreWorkSite.visible, false);
  assert.equal(pierShoreWorkSite.stage, "none");
  assert.equal(pierShoreWorkSite.subProps.pierPosts.visible, false);
  assert.equal(pierShoreWorkSite.subProps.safeBuildSite.visible, false);
  assert.equal(pierShoreWorkSite.subProps.pierFishingSlot.visible, false);
  assert.equal(
    pierShoreWorkSite.debug.fallbackReason,
    "outside Days 41-45 and no explicit pierShoreWorkSite state"
  );
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver exposes raft boat route descriptor contract for Day 46-55", () => {
  const worldState = createInitialWorldState({ seed: 132 });
  worldState.time.day = 47;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const raftBoatRoute = descriptor.visuals.find((visual) => visual.family === RAFT_BOAT_ROUTE_ID);

  assert.ok(raftBoatRoute);
  assert.equal(raftBoatRoute.id, RAFT_BOAT_ROUTE_ID);
  assert.equal(raftBoatRoute.propFamily, RAFT_BOAT_ROUTE_FAMILY);
  assert.equal(raftBoatRoute.visible, true);
  assert.equal(raftBoatRoute.usable, false);
  assert.equal(raftBoatRoute.stage, "frame");
  assert.equal(raftBoatRoute.variant, "shoreBuild");
  assert.equal(raftBoatRoute.source.id, "procedural_raft_frame_logs");
  assert.equal(raftBoatRoute.source.sourceType, "procedural");
  assert.equal(raftBoatRoute.source.approvedForUse, true);
  assert.equal(raftBoatRoute.source.approvalStatus, "approved");
  assert.equal(raftBoatRoute.transform.id, "raftBoatRouteCluster");
  assert.equal(raftBoatRoute.transform.attachPoint, "world");
  assert.equal(raftBoatRoute.stateHook.state, "worldState.raftBoatRoute");
  assert.equal(raftBoatRoute.stateHook.buildStage, "worldState.raftBoatRoute.buildStage");
  assert.equal(raftBoatRoute.stateHook.waterState, "worldState.raftBoatRoute.waterState");
  assert.equal(raftBoatRoute.stateHook.routeMarker, "worldState.raftBoatRoute.routeMarker");
  assert.equal(raftBoatRoute.stateHook.landingAnchor, "worldState.raftBoatRoute.landingAnchor");
  assert.equal(raftBoatRoute.subProps.raftFrame.visible, true);
  assert.equal(raftBoatRoute.subProps.raftFrame.source.id, "procedural_raft_frame_logs");
  assert.equal(raftBoatRoute.subProps.raftFrame.transform.id, "raftFrameLogs");
  assert.equal(raftBoatRoute.subProps.raftFrame.count, 5);
  assert.equal(raftBoatRoute.subProps.raftFrame.pooled, true);
  assert.equal(raftBoatRoute.subProps.tiedPlatform.visible, true);
  assert.equal(raftBoatRoute.subProps.tiedPlatform.source.id, "procedural_raft_tied_platform");
  assert.equal(raftBoatRoute.subProps.tiedPlatform.count, 3);
  assert.equal(raftBoatRoute.subProps.tiedPlatform.lashingCount, 6);
  assert.equal(raftBoatRoute.subProps.paddleOar.visible, true);
  assert.equal(raftBoatRoute.subProps.paddleOar.source.id, "procedural_raft_paddle_oar");
  assert.equal(raftBoatRoute.subProps.raftOnWater.visible, false);
  assert.equal(raftBoatRoute.subProps.wakeMarker.visible, false);
  assert.equal(raftBoatRoute.subProps.routeMarker.visible, false);
  assert.equal(raftBoatRoute.subProps.returnLanding.visible, true);
  assert.equal(raftBoatRoute.subProps.returnLanding.source.id, "procedural_raft_return_landing_marker");
  assert.equal(raftBoatRoute.subProps.returnLanding.behavior, "visual-placeholder");
  assert.equal(raftBoatRoute.debug.buildStage, "frame");
  assert.equal(raftBoatRoute.debug.waterState, "shore");
  assert.equal(raftBoatRoute.debug.routeMarker, false);
  assert.equal(
    raftBoatRoute.debug.duplicateSystemClassification,
    "new passive raft/boat route prop family; does not alter water, camera, controls, movement, day loop, or travel mechanics"
  );
  assert.match(raftBoatRoute.debug.futureIntegrationNote, /future buildable\/vehicle hooks are metadata only/);
  assert.equal(descriptor.debug.raftBoatRouteAssetSourceId, "procedural_raft_frame_logs");
  assert.equal(descriptor.debug.raftBoatRouteTransformId, "raftBoatRouteCluster");
  assert.equal(descriptor.debug.raftBoatRouteBuildStage, "frame");
  assert.equal(descriptor.debug.raftBoatRouteWaterState, "shore");
  assert.equal(descriptor.debug.raftBoatRouteLogCount, 5);
  assert.equal(descriptor.debug.raftBoatRoutePlatformPlankCount, 3);
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver maps raft boat route water and capstone states", () => {
  const routeState = createInitialWorldState({ seed: 133 });
  routeState.time.day = 55;
  normalizeWorldState(routeState);

  const routeDescriptor = resolveToyboxPresentationState(routeState);
  const routeRaft = routeDescriptor.visuals.find((visual) => visual.family === RAFT_BOAT_ROUTE_ID);

  assert.equal(routeRaft.visible, true);
  assert.equal(routeRaft.stage, "route");
  assert.equal(routeRaft.variant, "routePreview");
  assert.equal(routeRaft.subProps.raftOnWater.visible, true);
  assert.equal(routeRaft.subProps.wakeMarker.count, 3);
  assert.equal(routeRaft.subProps.routeMarker.count, 4);
  assert.equal(routeRaft.debug.waterState, "route");
  assert.equal(routeRaft.debug.routeMarker, true);

  const capstoneState = createInitialWorldState({ seed: 134 });
  capstoneState.time.day = 92;
  normalizeWorldState(capstoneState);

  const capstoneDescriptor = resolveToyboxPresentationState(capstoneState);
  const capstoneRaft = capstoneDescriptor.visuals.find((visual) => visual.family === RAFT_BOAT_ROUTE_ID);

  assert.equal(capstoneRaft.visible, true);
  assert.equal(capstoneRaft.stage, "capstone");
  assert.equal(capstoneRaft.variant, "returnLanding");
  assert.equal(capstoneRaft.debug.waterState, "return");
  assert.equal(capstoneDescriptor.debug.raftBoatRouteLandingMarkerCount, 1);
});

test("presentation resolver hides raft boat route safely outside planned windows", () => {
  const worldState = createInitialWorldState({ seed: 135 });
  worldState.time.day = 56;
  normalizeWorldState(worldState);

  const descriptor = resolveToyboxPresentationState(worldState);
  const raftBoatRoute = descriptor.visuals.find((visual) => visual.family === RAFT_BOAT_ROUTE_ID);

  assert.ok(raftBoatRoute);
  assert.equal(raftBoatRoute.visible, false);
  assert.equal(raftBoatRoute.stage, "none");
  assert.equal(raftBoatRoute.subProps.raftFrame.visible, false);
  assert.equal(raftBoatRoute.subProps.raftOnWater.visible, false);
  assert.equal(raftBoatRoute.subProps.routeMarker.visible, false);
  assert.equal(
    raftBoatRoute.debug.fallbackReason,
    "outside Days 46-55/91-95 and no explicit raftBoatRoute state"
  );
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
