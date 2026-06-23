import { assetSourceMetadata } from "./assetSource.js";
import {
  ARRIVAL_BUNDLE_ITEM_ID,
  ARRIVAL_SUPPLIES_FAMILY,
  BOUNDARY_STONE_ITEM_ID,
  CAMP_PATHS_FAMILY,
  FOOD_ROUTINE_FAMILY,
  GARDEN_PLOTS_FAMILY,
  HARVESTED_CROP_ITEM_ID,
  STONE_TOOL_ITEM_ID,
  STORAGE_WORKBENCH_TOOLS_FAMILY,
  WATER_CAN_ITEM_ID
} from "../simulation/worldState.js";

export const ATTACHMENT_REGISTRY = Object.freeze({
  waterCan: Object.freeze({
    id: "waterCan",
    family: GARDEN_PLOTS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "wateringCan",
      scale: Object.freeze([0.34, 0.34, 0.34]),
      rotation: Object.freeze([0.08, -0.24, -0.18]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.24, height: 0.34 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["watering"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_watering_can",
      family: GARDEN_PLOTS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Simple low-poly watering container attached to BB's right hand while watering garden plots.",
      approvedForUse: true
    }))
  }),
  harvestedCropCarry: Object.freeze({
    id: "harvestedCropCarry",
    family: GARDEN_PLOTS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "harvestedCrop",
      scale: Object.freeze([0.44, 0.44, 0.44]),
      rotation: Object.freeze([0.02, -0.12, 0.10]),
      groundOffset: 0,
      centerOrigin: "stem",
      anchorPoint: "stem",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.20, height: 0.32 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["harvesting"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_harvested_crop",
      family: GARDEN_PLOTS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Detached low-poly crop prop for harvest presentation; inventory/storage mechanics remain future work.",
      approvedForUse: true
    }))
  }),
  boundaryStoneCarry: Object.freeze({
    id: "boundaryStoneCarry",
    family: CAMP_PATHS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "boundaryStoneCarry",
      scale: Object.freeze([0.42, 0.34, 0.42]),
      rotation: Object.freeze([0.10, -0.18, 0.22]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "base",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.18, height: 0.18 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["placeBoundaryStone"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_boundary_stone",
      family: CAMP_PATHS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Attachable low-poly boundary stone for BB's right hand during placeBoundaryStone.",
      approvedForUse: true
    }))
  }),
  pathRakeCarry: Object.freeze({
    id: "pathRakeCarry",
    family: CAMP_PATHS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "pathRakeCarry",
      scale: Object.freeze([0.78, 0.78, 0.78]),
      rotation: Object.freeze([0.08, -0.18, -0.06]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.22, height: 0.82 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["rakePath", "clearPath"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_path_rake",
      family: CAMP_PATHS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Simple two-hand rake/clearing tool attached only during rakePath and clearPath presentation actions.",
      approvedForUse: true
    }))
  }),
  pathBroomCarry: Object.freeze({
    id: "pathBroomCarry",
    family: CAMP_PATHS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "pathBroomCarry",
      scale: Object.freeze([0.78, 0.78, 0.78]),
      rotation: Object.freeze([0.10, -0.14, 0.04]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.26, height: 0.78 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["sweepLeaves"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_path_broom",
      family: CAMP_PATHS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Simple brush/sweeping tool attached only during sweepLeaves presentation action.",
      approvedForUse: true
    }))
  }),
  firstTool: Object.freeze({
    id: "firstTool",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "firstTool",
      scale: Object.freeze([0.52, 0.52, 0.52]),
      rotation: Object.freeze([0.12, 0.28, -0.18]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.22, height: 0.36 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["inspectTool"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_first_tool",
      family: STORAGE_WORKBENCH_TOOLS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small low-poly stone/wood hand tool for the inspectTool presentation action.",
      approvedForUse: true
    }))
  }),
  buildTool: Object.freeze({
    id: "buildTool",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "buildTool",
      scale: Object.freeze([0.56, 0.56, 0.56]),
      rotation: Object.freeze([0.18, 0.18, -0.24]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.24, height: 0.38 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["hammerStrike", "carveTool", "craftAtWorkbench", "repairShelter", "reinforceShelter"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_build_tool_attachment",
      family: STORAGE_WORKBENCH_TOOLS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small hand tool attachment for hammering, carving, crafting, repair, and reinforcement poses.",
      approvedForUse: true
    }))
  }),
  buildPlank: Object.freeze({
    id: "buildPlank",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "buildPlank",
      scale: Object.freeze([0.78, 0.78, 0.78]),
      rotation: Object.freeze([0.06, 0.02, 0.04]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.56, height: 0.14 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["placePlank"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_build_plank_attachment",
      family: STORAGE_WORKBENCH_TOOLS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Short plank carried between BB's hands only during the placePlank presentation action.",
      approvedForUse: true
    }))
  }),
  buildRopeVines: Object.freeze({
    id: "buildRopeVines",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "buildRopeVines",
      scale: Object.freeze([0.62, 0.62, 0.62]),
      rotation: Object.freeze([0.08, -0.08, -0.06]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.34, height: 0.18 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["tieRopeVines"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_rope_vine_attachment",
      family: STORAGE_WORKBENCH_TOOLS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small rope/vine coil attachment for two-hand lashing and tying poses.",
      approvedForUse: true
    }))
  }),
  storageMaterial: Object.freeze({
    id: "storageMaterial",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "storageMaterial",
      scale: Object.freeze([0.54, 0.54, 0.54]),
      rotation: Object.freeze([0.04, 0.02, -0.04]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.28, height: 0.20 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["sortMaterials", "depositStorage", "withdrawStorage"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_storage_material_attachment",
      family: STORAGE_WORKBENCH_TOOLS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small sorted-material bundle attached to BB's hands only for sort/deposit/withdraw storage poses.",
      approvedForUse: true
    }))
  }),
  heldFood: Object.freeze({
    id: "heldFood",
    family: FOOD_ROUTINE_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "heldFood",
      scale: Object.freeze([0.48, 0.48, 0.48]),
      rotation: Object.freeze([0.10, -0.16, 0.08]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.18, height: 0.14 }),
      cameraReadabilityDistance: 6
    }),
    visibleActions: Object.freeze(["holdFood", "eatFood"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_held_food",
      family: FOOD_ROUTINE_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small hand-held food/fish presentation prop, visible only for holdFood and eatFood actions.",
      approvedForUse: true
    }))
  }),
  carryBundle: Object.freeze({
    id: "carryBundle",
    family: ARRIVAL_SUPPLIES_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "carryBundle",
      scale: Object.freeze([0.6, 0.6, 0.6]),
      rotation: Object.freeze([0, 0, 0]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.4, height: 0.4 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze([]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_arrival_carry_bundle",
      family: ARRIVAL_SUPPLIES_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Attachable compact arrival supply bundle for BB's hands while carriedItem is arrivalBundle.",
      approvedForUse: true
    }))
  })
});

export function resolveCarryAttachment(action, worldState = null) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const carrying = typeof boy.carrying === "string" ? boy.carrying : null;
  const waterCanEntry = ATTACHMENT_REGISTRY.waterCan;
  const waterCanVisibleFromState = carrying === WATER_CAN_ITEM_ID;
  const waterCanVisibleFromAction = waterCanEntry.visibleActions.includes(action);
  if (waterCanVisibleFromState || waterCanVisibleFromAction) {
    return attachmentDescriptor(waterCanEntry, {
      stateHook: {
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: GARDEN_PLOTS_FAMILY,
        source: waterCanVisibleFromState ? "worldState.bubbleBoy.carrying" : "presentationActionFallback",
        fallbackReason: waterCanVisibleFromState ? "" : "carrying not set; visible due to watering action"
      }
    });
  }

  const cropEntry = ATTACHMENT_REGISTRY.harvestedCropCarry;
  const cropVisibleFromState = carrying === HARVESTED_CROP_ITEM_ID;
  const cropVisibleFromAction = cropEntry.visibleActions.includes(action);
  if (cropVisibleFromState || cropVisibleFromAction) {
    return attachmentDescriptor(cropEntry, {
      stateHook: {
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: GARDEN_PLOTS_FAMILY,
        source: cropVisibleFromState ? "worldState.bubbleBoy.carrying" : "presentationActionFallback",
        fallbackReason: cropVisibleFromState ? "" : "carrying not set; visible due to harvesting action"
      }
    });
  }

  const carriedObject = typeof boy.carriedObject === "string" ? boy.carriedObject : null;
  const stoneEntry = ATTACHMENT_REGISTRY.boundaryStoneCarry;
  const stoneVisibleFromState = carriedObject === BOUNDARY_STONE_ITEM_ID;
  const stoneVisibleFromAction = stoneEntry.visibleActions.includes(action);
  if (stoneVisibleFromAction) {
    return attachmentDescriptor(stoneEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: CAMP_PATHS_FAMILY,
        source: stoneVisibleFromState ? "worldState.bubbleBoy.carriedObject" : "presentationActionFallback",
        fallbackReason: stoneVisibleFromState ? "" : "carriedObject not set; visible due to placeBoundaryStone action"
      }
    });
  }

  const pathRakeEntry = ATTACHMENT_REGISTRY.pathRakeCarry;
  const pathRakeVisibleFromAction = pathRakeEntry.visibleActions.includes(action);
  if (pathRakeVisibleFromAction) {
    const toolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const heldTool = typeof toolInventory.heldTool === "string" ? toolInventory.heldTool : "";
    const rakeVisibleFromState = carriedObject === "pathRake" || carrying === "pathRake" || heldTool === "pathRake";
    return attachmentDescriptor(pathRakeEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: CAMP_PATHS_FAMILY,
        source: rakeVisibleFromState ? "worldState.bubbleBoy.toolState" : "presentationActionFallback",
        fallbackReason: rakeVisibleFromState ? "" : "path rake not held in state; visible only due to rake/clear action"
      }
    });
  }

  const pathBroomEntry = ATTACHMENT_REGISTRY.pathBroomCarry;
  const pathBroomVisibleFromAction = pathBroomEntry.visibleActions.includes(action);
  if (pathBroomVisibleFromAction) {
    const toolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const heldTool = typeof toolInventory.heldTool === "string" ? toolInventory.heldTool : "";
    const broomVisibleFromState = carriedObject === "pathBroom" || carrying === "pathBroom" || heldTool === "pathBroom";
    return attachmentDescriptor(pathBroomEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: CAMP_PATHS_FAMILY,
        source: broomVisibleFromState ? "worldState.bubbleBoy.toolState" : "presentationActionFallback",
        fallbackReason: broomVisibleFromState ? "" : "path broom not held in state; visible only due to sweepLeaves action"
      }
    });
  }

  const buildToolEntry = ATTACHMENT_REGISTRY.buildTool;
  const buildToolVisibleFromAction = buildToolEntry.visibleActions.includes(action);
  if (buildToolVisibleFromAction) {
    return attachmentDescriptor(buildToolEntry, {
      stateHook: {
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: STORAGE_WORKBENCH_TOOLS_FAMILY,
        source: "presentationActionFallback",
        fallbackReason: "build tool not held in state; visible due to build/craft/repair action"
      }
    });
  }

  const buildPlankEntry = ATTACHMENT_REGISTRY.buildPlank;
  const buildPlankVisibleFromState = carriedObject === "buildPlank" || carrying === "buildPlank";
  const buildPlankVisibleFromAction = buildPlankEntry.visibleActions.includes(action);
  if (buildPlankVisibleFromState || buildPlankVisibleFromAction) {
    return attachmentDescriptor(buildPlankEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: STORAGE_WORKBENCH_TOOLS_FAMILY,
        source: buildPlankVisibleFromState ? "worldState.bubbleBoy.carriedObject" : "presentationActionFallback",
        fallbackReason: buildPlankVisibleFromState ? "" : "plank not carried in state; visible due to placePlank action"
      }
    });
  }

  const buildRopeEntry = ATTACHMENT_REGISTRY.buildRopeVines;
  const buildRopeVisibleFromState = carriedObject === "ropeVines" || carrying === "ropeVines";
  const buildRopeVisibleFromAction = buildRopeEntry.visibleActions.includes(action);
  if (buildRopeVisibleFromState || buildRopeVisibleFromAction) {
    return attachmentDescriptor(buildRopeEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: STORAGE_WORKBENCH_TOOLS_FAMILY,
        source: buildRopeVisibleFromState ? "worldState.bubbleBoy.carriedObject" : "presentationActionFallback",
        fallbackReason: buildRopeVisibleFromState ? "" : "rope/vines not carried in state; visible due to tieRopeVines action"
      }
    });
  }

  const storageMaterialEntry = ATTACHMENT_REGISTRY.storageMaterial;
  const storageMaterialVisibleFromAction = storageMaterialEntry.visibleActions.includes(action);
  if (storageMaterialVisibleFromAction) {
    const storageItemFromState = carriedObject === "storageMaterial" || carrying === "storageMaterial";
    return attachmentDescriptor(storageMaterialEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        storage: "worldState.campStorage"
      },
      debug: {
        visualFamily: STORAGE_WORKBENCH_TOOLS_FAMILY,
        source: storageItemFromState ? "worldState.bubbleBoy.carriedObject" : "presentationActionFallback",
        fallbackReason: storageItemFromState
          ? ""
          : "storage item not carried in state; visible only due to sort/deposit/withdraw action"
      }
    });
  }

  const toolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
  const heldTool = typeof toolInventory.heldTool === "string" ? toolInventory.heldTool : null;
  const inspectingTool = typeof toolInventory.inspectingTool === "string" ? toolInventory.inspectingTool : null;
  const toolEntry = ATTACHMENT_REGISTRY.firstTool;
  const toolVisibleFromState =
    heldTool === STONE_TOOL_ITEM_ID ||
    heldTool === "firstTool" ||
    inspectingTool === STONE_TOOL_ITEM_ID ||
    inspectingTool === "firstTool";
  const toolVisibleFromAction = toolEntry.visibleActions.includes(action);
  if (toolVisibleFromState || toolVisibleFromAction) {
    return attachmentDescriptor(toolEntry, {
      stateHook: {
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        inspectingTool: "worldState.bubbleBoy.toolInventory.inspectingTool",
        hasStoneTool: "worldState.bubbleBoy.toolInventory.hasStoneTool"
      },
      debug: {
        visualFamily: STORAGE_WORKBENCH_TOOLS_FAMILY,
        source: toolVisibleFromState ? "worldState.bubbleBoy.toolInventory" : "presentationActionFallback",
        fallbackReason: toolVisibleFromState ? "" : "toolInventory held/inspecting tool not set; visible due to inspectTool action"
      }
    });
  }

  const heldFoodEntry = ATTACHMENT_REGISTRY.heldFood;
  const heldFoodVisibleFromAction = heldFoodEntry.visibleActions.includes(action);
  if (heldFoodVisibleFromAction) {
    const fishInventory = boy.inventory && typeof boy.inventory === "object" ? boy.inventory.fish || {} : {};
    const fishState = typeof fishInventory.state === "string" ? fishInventory.state : "";
    return attachmentDescriptor(heldFoodEntry, {
      stateHook: {
        fishState: "worldState.bubbleBoy.inventory.fish.state",
        foodRoutine: "worldState.foodRoutine",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: FOOD_ROUTINE_FAMILY,
        source: fishState === "raw" || fishState === "cooked"
          ? "worldState.bubbleBoy.inventory.fish"
          : "presentationActionFallback",
        fallbackReason: fishState === "raw" || fishState === "cooked"
          ? ""
          : "fish/food inventory not set; showing procedural held-food fallback for hold/eat action"
      }
    });
  }

  const entry = ATTACHMENT_REGISTRY.carryBundle;
  const carriedItem = typeof boy.carriedItem === "string" ? boy.carriedItem : null;
  const visibleFromState = carriedItem === ARRIVAL_BUNDLE_ITEM_ID;
  if (!visibleFromState) return null;
  return attachmentDescriptor(entry, {
    stateHook: {
      carriedItem: "worldState.bubbleBoy.carriedItem",
      arrivalSupplies: "worldState.arrivalSupplies.bundleCarriedByBB"
    },
    debug: {
      visualFamily: "arrivalSupplies",
      source: "worldState.bubbleBoy.carriedItem",
      fallbackReason: ""
    }
  });
}

function attachmentDescriptor(entry, { stateHook, debug }) {
  return {
    id: entry.id,
    family: entry.family,
    anchorType: entry.anchorType,
    attachmentPoint: entry.attachmentPoint,
    transform: {
      ...entry.transform,
      scale: Array.from(entry.transform.scale),
      rotation: Array.from(entry.transform.rotation),
      bounds: { ...entry.transform.bounds }
    },
    visible: true,
    source: { ...entry.source },
    stateHook,
    debug
  };
}
