import { assetSourceMetadata } from "./assetSource.js";
import {
  ARRIVAL_BUNDLE_ITEM_ID,
  ARRIVAL_SUPPLIES_FAMILY,
  BOUNDARY_STONE_ITEM_ID,
  CAMP_PATHS_FAMILY,
  FISH_TRAP_ROUTINE_FAMILY,
  FOOD_ROUTINE_FAMILY,
  GARDEN_PLOTS_FAMILY,
  HARVESTED_CROP_ITEM_ID,
  MUSIC_ART_DECOR_FAMILY,
  RAFT_BOAT_ROUTE_FAMILY,
  STONE_TOOL_ITEM_ID,
  STORAGE_WORKBENCH_TOOLS_FAMILY,
  TOY_PLAY_SET_FAMILY,
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
    visibleActions: Object.freeze(["waterPlot", "watering"]),
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
  seedPouch: Object.freeze({
    id: "seedPouch",
    family: GARDEN_PLOTS_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbLeftHand",
    transform: Object.freeze({
      id: "seedPouch",
      scale: Object.freeze([0.42, 0.42, 0.42]),
      rotation: Object.freeze([0.06, 0.18, -0.10]),
      groundOffset: 0,
      centerOrigin: "pouch",
      anchorPoint: "pouch",
      attachPoint: "bbLeftHand",
      bounds: Object.freeze({ radius: 0.18, height: 0.20 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["plantSeed", "planting"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_garden_seed_pouch",
      family: GARDEN_PLOTS_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small seed pouch and loose seed dots attached only during seed planting actions.",
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
    visibleActions: Object.freeze(["harvestCrop", "harvesting", "carryHarvest", "storeHarvest"]),
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
  raftLogCarry: Object.freeze({
    id: "raftLogCarry",
    family: RAFT_BOAT_ROUTE_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "raftLogCarry",
      scale: Object.freeze([0.86, 0.86, 0.86]),
      rotation: Object.freeze([0.05, 0.02, -0.02]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.62, height: 0.18 }),
      cameraReadabilityDistance: 9
    }),
    visibleActions: Object.freeze(["carryRaftLog"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_raft_log_attachment",
      family: RAFT_BOAT_ROUTE_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Single raft log carried between BB's hands during carryRaftLog only; no inventory or raft build mechanics.",
      approvedForUse: true
    }))
  }),
  raftRopeCarry: Object.freeze({
    id: "raftRopeCarry",
    family: RAFT_BOAT_ROUTE_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "raftRopeCarry",
      scale: Object.freeze([0.64, 0.64, 0.64]),
      rotation: Object.freeze([0.08, -0.08, -0.06]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.34, height: 0.18 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["lashRaft"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_raft_rope_attachment",
      family: RAFT_BOAT_ROUTE_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small rope coil attached only during lashRaft presentation; visual-only lashing cue.",
      approvedForUse: true
    }))
  }),
  raftPaddleCarry: Object.freeze({
    id: "raftPaddleCarry",
    family: RAFT_BOAT_ROUTE_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "raftPaddleCarry",
      scale: Object.freeze([0.78, 0.78, 0.78]),
      rotation: Object.freeze([0.10, -0.20, 0.08]),
      groundOffset: 0,
      centerOrigin: "shaft",
      anchorPoint: "shaft",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.28, height: 0.92 }),
      cameraReadabilityDistance: 9
    }),
    visibleActions: Object.freeze(["paddleRaft"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_raft_paddle_attachment",
      family: RAFT_BOAT_ROUTE_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Two-hand paddle attachment for paddleRaft presentation; raft movement remains visual-only.",
      approvedForUse: true
    }))
  }),
  fishingRodCarry: Object.freeze({
    id: "fishingRodCarry",
    family: FISH_TRAP_ROUTINE_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "fishingRodCarry",
      scale: Object.freeze([0.76, 0.76, 0.76]),
      rotation: Object.freeze([0.18, -0.16, -0.10]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.30, height: 1.10 }),
      cameraReadabilityDistance: 9
    }),
    visibleActions: Object.freeze(["castFishingLine", "waitFishing", "reelFishingLine", "fishFromPier"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_fishing_rod_attachment",
      family: FISH_TRAP_ROUTINE_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Two-hand fishing rod attachment for cast, wait, reel, and pier-fishing presentation states.",
      approvedForUse: true
    }))
  }),
  fishTrapCarry: Object.freeze({
    id: "fishTrapCarry",
    family: FISH_TRAP_ROUTINE_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "fishTrapCarry",
      scale: Object.freeze([0.58, 0.58, 0.58]),
      rotation: Object.freeze([0.08, -0.06, -0.04]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.42, height: 0.32 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["setFishTrap", "checkFishTrap"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_fish_trap_attachment",
      family: FISH_TRAP_ROUTINE_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small trap/crab-pot attachment for BB's hands only during set/check trap actions.",
      approvedForUse: true
    }))
  }),
  trapCatchCarry: Object.freeze({
    id: "trapCatchCarry",
    family: FISH_TRAP_ROUTINE_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "trapCatchCarry",
      scale: Object.freeze([0.50, 0.50, 0.50]),
      rotation: Object.freeze([0.08, -0.18, 0.08]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.20, height: 0.14 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["catchReaction", "collectCatch", "hangCatchDryingRack"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_trap_catch_attachment",
      family: FISH_TRAP_ROUTINE_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small fish/catch hand prop visible only during catch reaction, collect, and hang-on-rack actions.",
      approvedForUse: true
    }))
  }),
  toyBlockCarry: Object.freeze({
    id: "toyBlockCarry",
    family: TOY_PLAY_SET_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "toyBlockCarry",
      scale: Object.freeze([0.46, 0.46, 0.46]),
      rotation: Object.freeze([0.04, 0.02, -0.04]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.22, height: 0.22 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["craftToy", "placeToy", "playBlocks", "putToyAway"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_toy_block_attachment",
      family: TOY_PLAY_SET_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small colorful toy block attached only during craft/place/play/put-away toy presentation actions.",
      approvedForUse: true
    }))
  }),
  toyBallCarry: Object.freeze({
    id: "toyBallCarry",
    family: TOY_PLAY_SET_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "toyBallCarry",
      scale: Object.freeze([0.44, 0.44, 0.44]),
      rotation: Object.freeze([0.02, -0.10, 0.08]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.20, height: 0.20 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["kickBall", "tossBall"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_toy_ball_attachment",
      family: TOY_PLAY_SET_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small toy ball cue attached only while BB kicks or tosses the ball; no ball physics are introduced.",
      approvedForUse: true
    }))
  }),
  toyKiteCarry: Object.freeze({
    id: "toyKiteCarry",
    family: TOY_PLAY_SET_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "toyKiteHandleCarry",
      scale: Object.freeze([0.54, 0.54, 0.54]),
      rotation: Object.freeze([0.10, -0.20, 0.06]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.28, height: 0.46 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["launchKite", "holdKite"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_toy_kite_handle_attachment",
      family: TOY_PLAY_SET_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small kite handle and string cue attached only for launch/hold kite actions; kite physics remain absent.",
      approvedForUse: true
    }))
  }),
  spinningTopCarry: Object.freeze({
    id: "spinningTopCarry",
    family: TOY_PLAY_SET_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "spinningTopCarry",
      scale: Object.freeze([0.46, 0.46, 0.46]),
      rotation: Object.freeze([0.02, -0.16, 0.10]),
      groundOffset: 0,
      centerOrigin: "peg",
      anchorPoint: "peg",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.18, height: 0.30 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["spinTop"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_spinning_top_attachment",
      family: TOY_PLAY_SET_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small spinning top hand prop shown only while BB spins the top.",
      approvedForUse: true
    }))
  }),
  paintedStoneCarry: Object.freeze({
    id: "paintedStoneCarry",
    family: MUSIC_ART_DECOR_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "paintedStoneCarry",
      scale: Object.freeze([0.46, 0.46, 0.46]),
      rotation: Object.freeze([0.06, -0.10, 0.08]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.18, height: 0.12 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["paintStone"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_music_painted_stone_attachment",
      family: MUSIC_ART_DECOR_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small painted stone cue attached only during paintStone presentation.",
      approvedForUse: true
    }))
  }),
  musicDecorationCarry: Object.freeze({
    id: "musicDecorationCarry",
    family: MUSIC_ART_DECOR_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "musicDecorationCarry",
      scale: Object.freeze([0.50, 0.50, 0.50]),
      rotation: Object.freeze([0.06, -0.04, -0.06]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.24, height: 0.28 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["placeDecoration"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_music_decoration_attachment",
      family: MUSIC_ART_DECOR_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small hanging decoration cue attached only while BB places music/art decoration.",
      approvedForUse: true
    }))
  }),
  shellChimeCarry: Object.freeze({
    id: "shellChimeCarry",
    family: MUSIC_ART_DECOR_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "shellChimeCarry",
      scale: Object.freeze([0.48, 0.48, 0.48]),
      rotation: Object.freeze([0.08, -0.12, 0.04]),
      groundOffset: 0,
      centerOrigin: "crossbar",
      anchorPoint: "crossbar",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.24, height: 0.40 }),
      cameraReadabilityDistance: 8
    }),
    visibleActions: Object.freeze(["hangShellChime"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_music_shell_chime_attachment",
      family: MUSIC_ART_DECOR_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small shell chime hand cue attached only during hangShellChime presentation.",
      approvedForUse: true
    }))
  }),
  drumStickCarry: Object.freeze({
    id: "drumStickCarry",
    family: MUSIC_ART_DECOR_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbRightHand",
    transform: Object.freeze({
      id: "drumStickCarry",
      scale: Object.freeze([0.58, 0.58, 0.58]),
      rotation: Object.freeze([0.16, -0.22, 0.08]),
      groundOffset: 0,
      centerOrigin: "handle",
      anchorPoint: "handle",
      attachPoint: "bbRightHand",
      bounds: Object.freeze({ radius: 0.16, height: 0.54 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["playDrum", "tapRhythm", "performAtDusk"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_music_drum_stick_attachment",
      family: MUSIC_ART_DECOR_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Tiny rhythm stick attached for drum, rhythm, and dusk performance cues; no sound engine changes.",
      approvedForUse: true
    }))
  }),
  fluteCarry: Object.freeze({
    id: "fluteCarry",
    family: MUSIC_ART_DECOR_FAMILY,
    anchorType: "bbAttachment",
    attachmentPoint: "bbBothHands",
    transform: Object.freeze({
      id: "fluteCarry",
      scale: Object.freeze([0.54, 0.54, 0.54]),
      rotation: Object.freeze([0.04, -0.26, 0.10]),
      groundOffset: 0,
      centerOrigin: "center",
      anchorPoint: "center",
      attachPoint: "bbBothHands",
      bounds: Object.freeze({ radius: 0.28, height: 0.08 }),
      cameraReadabilityDistance: 7
    }),
    visibleActions: Object.freeze(["playFlute"]),
    source: Object.freeze(assetSourceMetadata({
      id: "procedural_music_flute_attachment",
      family: MUSIC_ART_DECOR_FAMILY,
      sourceType: "procedural",
      path: null,
      license: "not needed; procedural primitives generated in Bubble Boy",
      author: "Bubble Boy",
      sourceUrl: null,
      attributionRequired: false,
      commercialUseAllowed: true,
      fileFormat: "primitive",
      notes: "Small flute hand cue attached only during playFlute presentation.",
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
    visibleActions: Object.freeze(["prepMeal", "holdFood", "eatFood"]),
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
  const waterCanVisibleFromAction = waterCanEntry.visibleActions.includes(action);
  if (waterCanVisibleFromAction) {
    const waterCanVisibleFromState = carrying === WATER_CAN_ITEM_ID;
    return attachmentDescriptor(waterCanEntry, {
      stateHook: {
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: GARDEN_PLOTS_FAMILY,
        source: waterCanVisibleFromState ? "worldState.bubbleBoy.carrying" : "presentationActionFallback",
        fallbackReason: waterCanVisibleFromState ? "" : "carrying not set; visible only due to waterPlot/watering action"
      }
    });
  }

  const seedPouchEntry = ATTACHMENT_REGISTRY.seedPouch;
  const seedPouchVisibleFromAction = seedPouchEntry.visibleActions.includes(action);
  if (seedPouchVisibleFromAction) {
    const seedVisibleFromState =
      carrying === "seedPouch" ||
      carrying === "gardenSeeds" ||
      carrying === "seeds" ||
      boy.carriedObject === "seedPouch" ||
      boy.carriedObject === "gardenSeeds" ||
      boy.carriedObject === "seeds";
    return attachmentDescriptor(seedPouchEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: GARDEN_PLOTS_FAMILY,
        source: seedVisibleFromState ? "worldState.bubbleBoy.seedCarryState" : "presentationActionFallback",
        fallbackReason: seedVisibleFromState ? "" : "seed pouch not held in state; visible only due to plantSeed action"
      }
    });
  }

  const cropEntry = ATTACHMENT_REGISTRY.harvestedCropCarry;
  const cropVisibleFromAction = cropEntry.visibleActions.includes(action);
  if (cropVisibleFromAction) {
    const cropVisibleFromState = carrying === HARVESTED_CROP_ITEM_ID || boy.carriedObject === HARVESTED_CROP_ITEM_ID;
    return attachmentDescriptor(cropEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction"
      },
      debug: {
        visualFamily: GARDEN_PLOTS_FAMILY,
        source: cropVisibleFromState ? "worldState.bubbleBoy.harvestCarryState" : "presentationActionFallback",
        fallbackReason: cropVisibleFromState ? "" : "harvest not carried in state; visible only due to harvest/carry/store action"
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

  const raftLogEntry = ATTACHMENT_REGISTRY.raftLogCarry;
  const raftLogVisibleFromAction = raftLogEntry.visibleActions.includes(action);
  if (raftLogVisibleFromAction) {
    const raftLogVisibleFromState = carriedObject === "raftLog" || carrying === "raftLog" || carriedObject === "log" || carrying === "log";
    return attachmentDescriptor(raftLogEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        raftBoatRoute: "worldState.raftBoatRoute"
      },
      debug: {
        visualFamily: RAFT_BOAT_ROUTE_FAMILY,
        source: raftLogVisibleFromState ? "worldState.bubbleBoy.raftCarryState" : "presentationActionFallback",
        fallbackReason: raftLogVisibleFromState ? "" : "raft log not held in state; visible only due to carryRaftLog action"
      }
    });
  }

  const raftRopeEntry = ATTACHMENT_REGISTRY.raftRopeCarry;
  const raftRopeVisibleFromAction = raftRopeEntry.visibleActions.includes(action);
  if (raftRopeVisibleFromAction) {
    const toolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const heldTool = typeof toolInventory.heldTool === "string" ? toolInventory.heldTool : "";
    const raftRopeVisibleFromState =
      carriedObject === "raftRope" ||
      carrying === "raftRope" ||
      carriedObject === "rope" ||
      carrying === "rope" ||
      heldTool === "raftRope" ||
      heldTool === "rope";
    return attachmentDescriptor(raftRopeEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction",
        raftBoatRoute: "worldState.raftBoatRoute"
      },
      debug: {
        visualFamily: RAFT_BOAT_ROUTE_FAMILY,
        source: raftRopeVisibleFromState ? "worldState.bubbleBoy.raftToolState" : "presentationActionFallback",
        fallbackReason: raftRopeVisibleFromState ? "" : "raft rope not held in state; visible only due to lashRaft action"
      }
    });
  }

  const raftPaddleEntry = ATTACHMENT_REGISTRY.raftPaddleCarry;
  const raftPaddleVisibleFromAction = raftPaddleEntry.visibleActions.includes(action);
  if (raftPaddleVisibleFromAction) {
    const toolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const heldTool = typeof toolInventory.heldTool === "string" ? toolInventory.heldTool : "";
    const raftPaddleVisibleFromState =
      carriedObject === "raftPaddle" ||
      carrying === "raftPaddle" ||
      carriedObject === "paddle" ||
      carrying === "paddle" ||
      heldTool === "raftPaddle" ||
      heldTool === "paddle";
    return attachmentDescriptor(raftPaddleEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction",
        raftBoatRoute: "worldState.raftBoatRoute"
      },
      debug: {
        visualFamily: RAFT_BOAT_ROUTE_FAMILY,
        source: raftPaddleVisibleFromState ? "worldState.bubbleBoy.raftPaddleState" : "presentationActionFallback",
        fallbackReason: raftPaddleVisibleFromState ? "" : "raft paddle not held in state; visible only due to paddleRaft action"
      }
    });
  }

  const fishingRodEntry = ATTACHMENT_REGISTRY.fishingRodCarry;
  const fishingRodVisibleFromAction = fishingRodEntry.visibleActions.includes(action);
  if (fishingRodVisibleFromAction) {
    const toolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const heldTool = typeof toolInventory.heldTool === "string" ? toolInventory.heldTool : "";
    const fishingRodVisibleFromState =
      carriedObject === "fishingRod" ||
      carrying === "fishingRod" ||
      carriedObject === "rod" ||
      carrying === "rod" ||
      heldTool === "fishingRod" ||
      heldTool === "rod";
    return attachmentDescriptor(fishingRodEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction",
        fishing: "worldState.bubbleBoy.fishing"
      },
      debug: {
        visualFamily: FISH_TRAP_ROUTINE_FAMILY,
        source: fishingRodVisibleFromState ? "worldState.bubbleBoy.fishingToolState" : "presentationActionFallback",
        fallbackReason: fishingRodVisibleFromState ? "" : "fishing rod not held in state; visible only due to fishing presentation action"
      }
    });
  }

  const fishTrapEntry = ATTACHMENT_REGISTRY.fishTrapCarry;
  const fishTrapVisibleFromAction = fishTrapEntry.visibleActions.includes(action);
  if (fishTrapVisibleFromAction) {
    const fishTrapVisibleFromState =
      carriedObject === "fishTrap" ||
      carrying === "fishTrap" ||
      carriedObject === "trap" ||
      carrying === "trap" ||
      carriedObject === "crabPot" ||
      carrying === "crabPot";
    return attachmentDescriptor(fishTrapEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        fishTrapRoutine: "worldState.fishTrapRoutine"
      },
      debug: {
        visualFamily: FISH_TRAP_ROUTINE_FAMILY,
        source: fishTrapVisibleFromState ? "worldState.bubbleBoy.trapCarryState" : "presentationActionFallback",
        fallbackReason: fishTrapVisibleFromState ? "" : "fish trap not carried in state; visible only due to set/check trap action"
      }
    });
  }

  const trapCatchEntry = ATTACHMENT_REGISTRY.trapCatchCarry;
  const trapCatchVisibleFromAction = trapCatchEntry.visibleActions.includes(action);
  if (trapCatchVisibleFromAction) {
    const trapCatchVisibleFromState =
      carriedObject === "trapCatch" ||
      carrying === "trapCatch" ||
      carriedObject === "fishCatch" ||
      carrying === "fishCatch" ||
      carriedObject === "catch" ||
      carrying === "catch";
    return attachmentDescriptor(trapCatchEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        fishTrapRoutine: "worldState.fishTrapRoutine"
      },
      debug: {
        visualFamily: FISH_TRAP_ROUTINE_FAMILY,
        source: trapCatchVisibleFromState ? "worldState.bubbleBoy.catchCarryState" : "presentationActionFallback",
        fallbackReason: trapCatchVisibleFromState ? "" : "catch not held in state; visible only due to catch/collect/hang action"
      }
    });
  }

  const toyBlockEntry = ATTACHMENT_REGISTRY.toyBlockCarry;
  const toyBlockVisibleFromAction = toyBlockEntry.visibleActions.includes(action);
  if (toyBlockVisibleFromAction) {
    const toyBlockVisibleFromState =
      carriedObject === "toyBlock" ||
      carrying === "toyBlock" ||
      carriedObject === "toyBlocks" ||
      carrying === "toyBlocks" ||
      carriedObject === "block" ||
      carrying === "block";
    return attachmentDescriptor(toyBlockEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        toyPlaySet: "worldState.toyPlaySet"
      },
      debug: {
        visualFamily: TOY_PLAY_SET_FAMILY,
        source: toyBlockVisibleFromState ? "worldState.bubbleBoy.toyCarryState" : "presentationActionFallback",
        fallbackReason: toyBlockVisibleFromState ? "" : "toy block not carried in state; visible only due to toy play action"
      }
    });
  }

  const toyBallEntry = ATTACHMENT_REGISTRY.toyBallCarry;
  const toyBallVisibleFromAction = toyBallEntry.visibleActions.includes(action);
  if (toyBallVisibleFromAction) {
    const toyBallVisibleFromState =
      carriedObject === "toyBall" ||
      carrying === "toyBall" ||
      carriedObject === "ball" ||
      carrying === "ball";
    return attachmentDescriptor(toyBallEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        toyPlaySet: "worldState.toyPlaySet"
      },
      debug: {
        visualFamily: TOY_PLAY_SET_FAMILY,
        source: toyBallVisibleFromState ? "worldState.bubbleBoy.toyCarryState" : "presentationActionFallback",
        fallbackReason: toyBallVisibleFromState ? "" : "toy ball not carried in state; visible only due to kick/toss action"
      }
    });
  }

  const toyKiteEntry = ATTACHMENT_REGISTRY.toyKiteCarry;
  const toyKiteVisibleFromAction = toyKiteEntry.visibleActions.includes(action);
  if (toyKiteVisibleFromAction) {
    const toyToolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const toyHeldTool = typeof toyToolInventory.heldTool === "string" ? toyToolInventory.heldTool : "";
    const toyKiteVisibleFromState =
      carriedObject === "toyKite" ||
      carrying === "toyKite" ||
      carriedObject === "kite" ||
      carrying === "kite" ||
      toyHeldTool === "kite" ||
      toyHeldTool === "kiteHandle";
    return attachmentDescriptor(toyKiteEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction",
        toyPlaySet: "worldState.toyPlaySet"
      },
      debug: {
        visualFamily: TOY_PLAY_SET_FAMILY,
        source: toyKiteVisibleFromState ? "worldState.bubbleBoy.toyToolState" : "presentationActionFallback",
        fallbackReason: toyKiteVisibleFromState ? "" : "kite handle not held in state; visible only due to launch/hold kite action"
      }
    });
  }

  const spinningTopEntry = ATTACHMENT_REGISTRY.spinningTopCarry;
  const spinningTopVisibleFromAction = spinningTopEntry.visibleActions.includes(action);
  if (spinningTopVisibleFromAction) {
    const topVisibleFromState =
      carriedObject === "spinningTop" ||
      carrying === "spinningTop" ||
      carriedObject === "top" ||
      carrying === "top";
    return attachmentDescriptor(spinningTopEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        toyPlaySet: "worldState.toyPlaySet"
      },
      debug: {
        visualFamily: TOY_PLAY_SET_FAMILY,
        source: topVisibleFromState ? "worldState.bubbleBoy.toyCarryState" : "presentationActionFallback",
        fallbackReason: topVisibleFromState ? "" : "spinning top not carried in state; visible only due to spinTop action"
      }
    });
  }

  const paintedStoneEntry = ATTACHMENT_REGISTRY.paintedStoneCarry;
  if (paintedStoneEntry.visibleActions.includes(action)) {
    const paintedStoneVisibleFromState =
      carriedObject === "paintedStone" ||
      carrying === "paintedStone" ||
      carriedObject === "stone" ||
      carrying === "stone";
    return attachmentDescriptor(paintedStoneEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        musicArtDecor: "worldState.musicArtDecor"
      },
      debug: {
        visualFamily: MUSIC_ART_DECOR_FAMILY,
        source: paintedStoneVisibleFromState ? "worldState.bubbleBoy.musicArtCarryState" : "presentationActionFallback",
        fallbackReason: paintedStoneVisibleFromState ? "" : "painted stone not carried in state; visible only due to paintStone action"
      }
    });
  }

  const decorationEntry = ATTACHMENT_REGISTRY.musicDecorationCarry;
  if (decorationEntry.visibleActions.includes(action)) {
    const decorationVisibleFromState =
      carriedObject === "decoration" ||
      carrying === "decoration" ||
      carriedObject === "hangingDecoration" ||
      carrying === "hangingDecoration" ||
      carriedObject === "decor" ||
      carrying === "decor";
    return attachmentDescriptor(decorationEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        musicArtDecor: "worldState.musicArtDecor"
      },
      debug: {
        visualFamily: MUSIC_ART_DECOR_FAMILY,
        source: decorationVisibleFromState ? "worldState.bubbleBoy.musicArtCarryState" : "presentationActionFallback",
        fallbackReason: decorationVisibleFromState ? "" : "decoration not carried in state; visible only due to placeDecoration action"
      }
    });
  }

  const shellChimeEntry = ATTACHMENT_REGISTRY.shellChimeCarry;
  if (shellChimeEntry.visibleActions.includes(action)) {
    const shellChimeVisibleFromState =
      carriedObject === "shellChime" ||
      carrying === "shellChime" ||
      carriedObject === "chime" ||
      carrying === "chime";
    return attachmentDescriptor(shellChimeEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        action: "worldState.bubbleBoy.currentAction",
        musicArtDecor: "worldState.musicArtDecor"
      },
      debug: {
        visualFamily: MUSIC_ART_DECOR_FAMILY,
        source: shellChimeVisibleFromState ? "worldState.bubbleBoy.musicArtCarryState" : "presentationActionFallback",
        fallbackReason: shellChimeVisibleFromState ? "" : "shell chime not carried in state; visible only due to hangShellChime action"
      }
    });
  }

  const drumStickEntry = ATTACHMENT_REGISTRY.drumStickCarry;
  if (drumStickEntry.visibleActions.includes(action)) {
    const musicToolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const musicHeldTool = typeof musicToolInventory.heldTool === "string" ? musicToolInventory.heldTool : "";
    const drumStickVisibleFromState =
      carriedObject === "drumStick" ||
      carrying === "drumStick" ||
      carriedObject === "drum" ||
      carrying === "drum" ||
      musicHeldTool === "drumStick" ||
      musicHeldTool === "drum";
    return attachmentDescriptor(drumStickEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction",
        musicArtDecor: "worldState.musicArtDecor"
      },
      debug: {
        visualFamily: MUSIC_ART_DECOR_FAMILY,
        source: drumStickVisibleFromState ? "worldState.bubbleBoy.musicArtToolState" : "presentationActionFallback",
        fallbackReason: drumStickVisibleFromState ? "" : "drum stick not held in state; visible only due to rhythm/performance action"
      }
    });
  }

  const fluteEntry = ATTACHMENT_REGISTRY.fluteCarry;
  if (fluteEntry.visibleActions.includes(action)) {
    const musicToolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
    const musicHeldTool = typeof musicToolInventory.heldTool === "string" ? musicToolInventory.heldTool : "";
    const fluteVisibleFromState =
      carriedObject === "flute" ||
      carrying === "flute" ||
      musicHeldTool === "flute";
    return attachmentDescriptor(fluteEntry, {
      stateHook: {
        carriedObject: "worldState.bubbleBoy.carriedObject",
        carrying: "worldState.bubbleBoy.carrying",
        heldTool: "worldState.bubbleBoy.toolInventory.heldTool",
        action: "worldState.bubbleBoy.currentAction",
        musicArtDecor: "worldState.musicArtDecor"
      },
      debug: {
        visualFamily: MUSIC_ART_DECOR_FAMILY,
        source: fluteVisibleFromState ? "worldState.bubbleBoy.musicArtToolState" : "presentationActionFallback",
        fallbackReason: fluteVisibleFromState ? "" : "flute not held in state; visible only due to playFlute action"
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
