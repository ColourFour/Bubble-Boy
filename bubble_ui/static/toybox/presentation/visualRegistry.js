import {
  ARRIVAL_BUNDLE_ITEM_ID,
  ARRIVAL_SUPPLIES_FAMILY,
  ARRIVAL_SUPPLIES_ID,
  ARRIVAL_SUPPLIES_VARIANT,
  BED_BUILD_SITE_ID,
  BUILD_SITE_ID,
  BUILDABLE_IDS,
  CAMP_LAYOUT_ID,
  CAMP_PATHS_FAMILY,
  CAMP_STORAGE_ID,
  CAMP_ZONES_FAMILY,
  FIRE_PIT_ID,
  GARDEN_PLOT_FAMILY,
  GARDEN_PLOTS_FAMILY,
  REST_SHELTER_FAMILY,
  REST_SHELTER_ID,
  REST_SHELTER_VARIANTS,
  STONE_TOOL_ITEM_ID,
  STORAGE_WORKBENCH_TOOLS_FAMILY,
  STORAGE_WORKBENCH_TOOLS_ID,
  TOOL_RACK_ID,
  WORKBENCH_ID
} from "../simulation/worldState.js";
import { ASSET_SOURCE_TYPES, assetSourceMetadata } from "./assetSource.js";

export { ASSET_SOURCE_TYPES, assetSourceMetadata };

export const VISUAL_ASSET_SOURCE_REGISTRY = freezeAssetSourceRegistry({
  procedural_arrival_bundle: assetSourceMetadata({
    id: "procedural_arrival_bundle",
    family: ARRIVAL_SUPPLIES_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Washed-up low-poly shore bundle built from box primitives and rope-like cylinder ties."
  }),
  procedural_arrival_sticks: assetSourceMetadata({
    id: "procedural_arrival_sticks",
    family: ARRIVAL_SUPPLIES_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Small deterministic cluster of cylinder sticks staged near the arrival point."
  }),
  procedural_arrival_leaves: assetSourceMetadata({
    id: "procedural_arrival_leaves",
    family: ARRIVAL_SUPPLIES_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Small deterministic cluster of low-poly leaf shapes staged near the arrival point."
  }),
  procedural_arrival_material_pile: assetSourceMetadata({
    id: "procedural_arrival_material_pile",
    family: ARRIVAL_SUPPLIES_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Tiny gathered material pile combining sticks and leaves into one readable carry-ready prop."
  }),
  procedural_arrival_carry_bundle: assetSourceMetadata({
    id: "procedural_arrival_carry_bundle",
    family: ARRIVAL_SUPPLIES_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Attachable compact supply bundle for BB's hands while carriedItem is arrivalBundle."
  }),
  procedural_hammock: assetSourceMetadata({
    id: "procedural_hammock",
    family: REST_SHELTER_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly cloth rest sling, rope ties, and simple posts created from shared Three.js primitives."
  }),
  procedural_bed_upgrade: assetSourceMetadata({
    id: "procedural_bed_upgrade",
    family: REST_SHELTER_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Raised cozy bed platform, bedding, pillow, and shelf nook created from shared Three.js primitives."
  }),
  procedural_strong_shelter: assetSourceMetadata({
    id: "procedural_strong_shelter",
    family: REST_SHELTER_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Reinforced rest shelter details with thicker roof, windbreak, tied edges, and soft floor indicator."
  }),
  procedural_storage_basket: assetSourceMetadata({
    id: "procedural_storage_basket",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly camp storage basket/crate and visible stored-wood pile made from shared primitives."
  }),
  procedural_workbench_upgrade: assetSourceMetadata({
    id: "procedural_workbench_upgrade",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Tool-ready workbench overlay with shelf lip, small vise block, and crafting surface details."
  }),
  procedural_first_tool: assetSourceMetadata({
    id: "procedural_first_tool",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Simple stone-and-wood hand tool used for inspectTool attachment and rack display."
  }),
  procedural_tool_rack: assetSourceMetadata({
    id: "procedural_tool_rack",
    family: STORAGE_WORKBENCH_TOOLS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small 1-3 slot tool rack with pegs sized for first tool progression."
  }),
  procedural_campfire_firewood_cooking_surface: assetSourceMetadata({
    id: "procedural_campfire_firewood_cooking_surface",
    family: "campfireFirewoodCookingSurface",
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Existing campfire renderer: stone ring, firewood logs, flame/ember layers, and fish-cooking surface cue."
  }),
  procedural_footpath_strip: assetSourceMetadata({
    id: "procedural_footpath_strip",
    family: CAMP_PATHS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Thin low-poly dirt path strips generated from campLayout path waypoints."
  }),
  procedural_boundary_stone: assetSourceMetadata({
    id: "procedural_boundary_stone",
    family: CAMP_PATHS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Instanced low-poly stones for camp boundaries and BB's carried placement stone."
  }),
  procedural_zone_marker: assetSourceMetadata({
    id: "procedural_zone_marker",
    family: CAMP_ZONES_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Simple zone marker posts/stones with minimal color bands for work, rest, and cook zones."
  }),
  procedural_lit_path_anchor: assetSourceMetadata({
    id: "procedural_lit_path_anchor",
    family: CAMP_PATHS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Small emissive path-anchor pebbles for future night comfort/lit route states; no dynamic lights."
  }),
  procedural_garden_plot: assetSourceMetadata({
    id: "procedural_garden_plot",
    family: GARDEN_PLOTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Low-poly tilled garden soil patch built from shared primitives; Kenney Food Kit may be evaluated later."
  }),
  procedural_garden_seeds: assetSourceMetadata({
    id: "procedural_garden_seeds",
    family: GARDEN_PLOTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Tiny seed dots and optional seed pouch placeholder for planting state."
  }),
  procedural_garden_sprout: assetSourceMetadata({
    id: "procedural_garden_sprout",
    family: GARDEN_PLOTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Small and medium low-poly sprout stages built from cylinders, cones, and simple leaves."
  }),
  procedural_garden_crop: assetSourceMetadata({
    id: "procedural_garden_crop",
    family: GARDEN_PLOTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Mature low-poly crop with simple carrot/berry/leafy variants; placeholder until food kit review."
  }),
  procedural_harvested_crop: assetSourceMetadata({
    id: "procedural_harvested_crop",
    family: GARDEN_PLOTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Detached harvested crop prop matching mature crop style for hand-carry presentation."
  }),
  procedural_watering_can: assetSourceMetadata({
    id: "procedural_watering_can",
    family: GARDEN_PLOTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "primitive",
    notes: "Simple low-poly water container used as BB right-hand attachment while watering."
  })
});

export const VISUAL_TRANSFORM_REGISTRY = freezeTransformRegistry({
  arrivalBundle: {
    id: "arrivalBundle",
    scale: [1, 1, 1],
    rotation: [0, 0.16, 0],
    groundOffset: 0.08,
    centerOrigin: "base",
    anchorPoint: "arrival-shore",
    attachPoint: "none",
    bounds: { radius: 0.62, height: 0.34 },
    cameraReadabilityDistance: 11
  },
  looseSticks: {
    id: "looseSticks",
    scale: [1, 1, 1],
    rotation: [0, -0.26, 0],
    groundOffset: 0.05,
    centerOrigin: "cluster-base",
    anchorPoint: "arrival-shore",
    attachPoint: "none",
    bounds: { radius: 0.58, height: 0.18 },
    cameraReadabilityDistance: 10
  },
  looseLeaves: {
    id: "looseLeaves",
    scale: [1, 1, 1],
    rotation: [0, 0.34, 0],
    groundOffset: 0.035,
    centerOrigin: "cluster-base",
    anchorPoint: "arrival-shore",
    attachPoint: "none",
    bounds: { radius: 0.52, height: 0.10 },
    cameraReadabilityDistance: 9
  },
  arrivalMaterialPile: {
    id: "arrivalMaterialPile",
    scale: [1, 1, 1],
    rotation: [0, -0.12, 0],
    groundOffset: 0.06,
    centerOrigin: "pile-base",
    anchorPoint: "arrival-shore",
    attachPoint: "none",
    bounds: { radius: 0.58, height: 0.28 },
    cameraReadabilityDistance: 10
  },
  carryBundle: {
    id: "carryBundle",
    scale: [0.6, 0.6, 0.6],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "center",
    anchorPoint: "center",
    attachPoint: "bbBothHands",
    bounds: { radius: 0.40, height: 0.40 },
    cameraReadabilityDistance: 8
  },
  restSling: {
    id: "restSling",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "buildable-center",
    anchorPoint: "sleep-rest",
    attachPoint: "world",
    bounds: { radius: 1.18, height: 1.12 },
    cameraReadabilityDistance: 11
  },
  cozyBed: {
    id: "cozyBed",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "buildable-center",
    anchorPoint: "sleep-rest",
    attachPoint: "world",
    bounds: { radius: 1.05, height: 0.82 },
    cameraReadabilityDistance: 10
  },
  strongShelter: {
    id: "strongShelter",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "buildable-center",
    anchorPoint: "camp-rest-nook",
    attachPoint: "world",
    bounds: { radius: 1.48, height: 1.42 },
    cameraReadabilityDistance: 12
  },
  campStorageBasket: {
    id: "campStorageBasket",
    scale: [1, 1, 1],
    rotation: [0, 0.08, 0],
    groundOffset: 0,
    centerOrigin: "base",
    anchorPoint: "camp-storage",
    attachPoint: "world",
    bounds: { radius: 0.58, height: 0.44 },
    cameraReadabilityDistance: 10
  },
  upgradedWorkbench: {
    id: "upgradedWorkbench",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "workbench-center",
    anchorPoint: "workbench",
    attachPoint: "world",
    bounds: { radius: 1.00, height: 0.92 },
    cameraReadabilityDistance: 10
  },
  firstTool: {
    id: "firstTool",
    scale: [0.52, 0.52, 0.52],
    rotation: [0.12, 0.28, -0.18],
    groundOffset: 0,
    centerOrigin: "handle",
    anchorPoint: "handle",
    attachPoint: "bbRightHand",
    bounds: { radius: 0.22, height: 0.36 },
    cameraReadabilityDistance: 7
  },
  toolRack: {
    id: "toolRack",
    scale: [1, 1, 1],
    rotation: [0, -0.08, 0],
    groundOffset: 0,
    centerOrigin: "base",
    anchorPoint: "tool-rack",
    attachPoint: "world",
    bounds: { radius: 0.52, height: 0.72 },
    cameraReadabilityDistance: 10
  },
  campfireCookingSurface: {
    id: "campfireCookingSurface",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.01,
    centerOrigin: "fire-ring-center",
    anchorPoint: "fire-pit",
    attachPoint: "world",
    bounds: { radius: 0.86, height: 0.92 },
    cameraReadabilityDistance: 10
  },
  footpathStrip: {
    id: "footpathStrip",
    scale: [1, 1, 1],
    rotation: [-Math.PI / 2, 0, 0],
    groundOffset: 0.018,
    centerOrigin: "segment-center",
    anchorPoint: "ground-waypoints",
    attachPoint: "world",
    bounds: { radius: 1.2, height: 0.02 },
    cameraReadabilityDistance: 14
  },
  boundaryStone: {
    id: "boundaryStone",
    scale: [0.22, 0.16, 0.22],
    rotation: [0, 0, 0],
    groundOffset: 0.055,
    centerOrigin: "base",
    anchorPoint: "zone-boundary",
    attachPoint: "world",
    bounds: { radius: 0.18, height: 0.18 },
    cameraReadabilityDistance: 11
  },
  boundaryStoneCarry: {
    id: "boundaryStoneCarry",
    scale: [0.42, 0.34, 0.42],
    rotation: [0.10, -0.18, 0.22],
    groundOffset: 0,
    centerOrigin: "center",
    anchorPoint: "base",
    attachPoint: "bbRightHand",
    bounds: { radius: 0.18, height: 0.18 },
    cameraReadabilityDistance: 7
  },
  zoneMarker: {
    id: "zoneMarker",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.035,
    centerOrigin: "base",
    anchorPoint: "zone-anchor",
    attachPoint: "world",
    bounds: { radius: 0.32, height: 0.48 },
    cameraReadabilityDistance: 12
  },
  litPathAnchor: {
    id: "litPathAnchor",
    scale: [0.16, 0.12, 0.16],
    rotation: [0, 0, 0],
    groundOffset: 0.045,
    centerOrigin: "base",
    anchorPoint: "path-waypoint",
    attachPoint: "world",
    bounds: { radius: 0.16, height: 0.12 },
    cameraReadabilityDistance: 11
  },
  gardenPlot: {
    id: "gardenPlot",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.035,
    centerOrigin: "center",
    anchorPoint: "camp-garden",
    attachPoint: "world",
    bounds: { radius: 0.78, height: 0.16 },
    cameraReadabilityDistance: 12
  },
  gardenSeeds: {
    id: "gardenSeeds",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.095,
    centerOrigin: "seed-cluster",
    anchorPoint: "garden-plot",
    attachPoint: "world",
    bounds: { radius: 0.28, height: 0.08 },
    cameraReadabilityDistance: 9
  },
  gardenSprout: {
    id: "gardenSprout",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.10,
    centerOrigin: "stem-base",
    anchorPoint: "garden-plot",
    attachPoint: "world",
    bounds: { radius: 0.34, height: 0.46 },
    cameraReadabilityDistance: 10
  },
  gardenCrop: {
    id: "gardenCrop",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.11,
    centerOrigin: "crop-base",
    anchorPoint: "garden-plot",
    attachPoint: "world",
    bounds: { radius: 0.42, height: 0.64 },
    cameraReadabilityDistance: 11
  },
  wateringCan: {
    id: "wateringCan",
    scale: [0.34, 0.34, 0.34],
    rotation: [0.08, -0.24, -0.18],
    groundOffset: 0,
    centerOrigin: "handle",
    anchorPoint: "handle",
    attachPoint: "bbRightHand",
    bounds: { radius: 0.24, height: 0.34 },
    cameraReadabilityDistance: 8
  },
  harvestedCrop: {
    id: "harvestedCrop",
    scale: [0.44, 0.44, 0.44],
    rotation: [0.02, -0.12, 0.10],
    groundOffset: 0,
    centerOrigin: "stem",
    anchorPoint: "stem",
    attachPoint: "bbRightHand",
    bounds: { radius: 0.20, height: 0.32 },
    cameraReadabilityDistance: 8
  }
});

export const VISUAL_FAMILY_REGISTRY = freezeRegistry({
  arrivalSupplies: visualFamily({
    id: ARRIVAL_SUPPLIES_ID,
    propFamily: ARRIVAL_SUPPLIES_FAMILY,
    anchorType: "shore",
    defaultVisible: true,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_arrival_bundle,
    transform: VISUAL_TRANSFORM_REGISTRY.arrivalBundle,
    notes: "Procedural arrival shore bundle and loose supplies placeholder family."
  }),
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
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_campfire_firewood_cooking_surface,
    transform: VISUAL_TRANSFORM_REGISTRY.campfireCookingSurface,
    notes: "Presentation handle for the existing campfire, firewood, and cooking-surface system."
  }),
  restShelter: visualFamily({
    id: REST_SHELTER_ID,
    propFamily: "rest",
    anchorType: "buildableSlot",
    anchorId: BED_BUILD_SITE_ID,
    defaultVisible: true,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_hammock,
    transform: VISUAL_TRANSFORM_REGISTRY.restSling,
    notes: "Procedural hammock, bed upgrade, and strong rest shelter family tied to existing bed/shelter buildables."
  }),
  storageWorkbenchTools: visualFamily({
    id: STORAGE_WORKBENCH_TOOLS_ID,
    propFamily: STORAGE_WORKBENCH_TOOLS_FAMILY,
    anchorType: "campArea",
    anchorId: WORKBENCH_ID,
    defaultVisible: true,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_storage_basket,
    transform: VISUAL_TRANSFORM_REGISTRY.campStorageBasket,
    notes: "Procedural storage basket, upgraded workbench overlay, first tool, and small tool rack family."
  }),
  campPaths: visualFamily({
    id: CAMP_PATHS_FAMILY,
    propFamily: CAMP_PATHS_FAMILY,
    anchorType: "ground",
    anchorId: CAMP_LAYOUT_ID,
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_footpath_strip,
    transform: VISUAL_TRANSFORM_REGISTRY.footpathStrip,
    notes: "Procedural cleared/lit camp paths and boundary stone presentation family."
  }),
  campZones: visualFamily({
    id: CAMP_ZONES_FAMILY,
    propFamily: CAMP_ZONES_FAMILY,
    anchorType: "ground",
    anchorId: CAMP_LAYOUT_ID,
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_zone_marker,
    transform: VISUAL_TRANSFORM_REGISTRY.zoneMarker,
    notes: "Procedural work/rest/cook camp zone marker presentation family."
  }),
  gardenPlots: visualFamily({
    id: GARDEN_PLOTS_FAMILY,
    propFamily: GARDEN_PLOT_FAMILY,
    anchorType: "campArea",
    anchorId: "camp-garden",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_garden_plot,
    transform: VISUAL_TRANSFORM_REGISTRY.gardenPlot,
    notes: "Procedural garden plots, seeds, sprouts, watering container, and crop-stage placeholder family."
  })
});

export function resolveVisualDescriptors(worldState, selectedAction, attachment) {
  const arrivalSupplies = resolveArrivalSuppliesVisualState(worldState);
  const firstFire = resolveFirstFireVisualState(worldState, selectedAction);
  const restShelter = resolveRestShelterVisualState(worldState, selectedAction);
  const storageWorkbenchTools = resolveStorageWorkbenchToolsVisualState(worldState, selectedAction, attachment);
  const campPaths = resolveCampPathsVisualState(worldState, selectedAction, attachment);
  const campZones = resolveCampZonesVisualState(worldState, selectedAction);
  const gardenPlots = resolveGardenPlotsVisualState(worldState, selectedAction, attachment);
  const descriptors = [
    descriptorForFamily("arrivalSupplies", {
      variant: arrivalSupplies.variant,
      stage: arrivalSupplies.stage,
      visible: arrivalSupplies.visible,
      active: arrivalSupplies.active,
      usable: arrivalSupplies.usable,
      source: arrivalSupplies.source,
      transform: arrivalSupplies.transform,
      stateHook: arrivalSupplies.stateHook,
      subProps: arrivalSupplies.subProps,
      debug: arrivalSupplies.debug
    }),
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
      variant: firstFire.variant,
      stage: firstFire.stage,
      visible: firstFire.visible,
      active: firstFire.active,
      usable: firstFire.usable,
      source: firstFire.source,
      transform: firstFire.transform,
      stateHook: firstFire.stateHook,
      debug: firstFire.debug
    }),
    descriptorForFamily("restShelter", {
      variant: restShelter.variant,
      stage: restShelter.stage,
      visible: restShelter.visible,
      active: restShelter.active,
      usable: restShelter.usable,
      source: restShelter.source,
      transform: restShelter.transform,
      stateHook: restShelter.stateHook,
      debug: restShelter.debug
    }),
    descriptorForFamily("storageWorkbenchTools", {
      variant: storageWorkbenchTools.variant,
      stage: storageWorkbenchTools.stage,
      visible: storageWorkbenchTools.visible,
      active: storageWorkbenchTools.active,
      usable: storageWorkbenchTools.usable,
      source: storageWorkbenchTools.source,
      transform: storageWorkbenchTools.transform,
      stateHook: storageWorkbenchTools.stateHook,
      subProps: storageWorkbenchTools.subProps,
      debug: storageWorkbenchTools.debug
    }),
    descriptorForFamily("campPaths", {
      variant: campPaths.variant,
      stage: campPaths.stage,
      visible: campPaths.visible,
      active: campPaths.active,
      usable: campPaths.usable,
      source: campPaths.source,
      transform: campPaths.transform,
      stateHook: campPaths.stateHook,
      subProps: campPaths.subProps,
      debug: campPaths.debug
    }),
    descriptorForFamily("campZones", {
      variant: campZones.variant,
      stage: campZones.stage,
      visible: campZones.visible,
      active: campZones.active,
      usable: campZones.usable,
      source: campZones.source,
      transform: campZones.transform,
      stateHook: campZones.stateHook,
      subProps: campZones.subProps,
      debug: campZones.debug
    }),
    descriptorForFamily("gardenPlots", {
      variant: gardenPlots.variant,
      stage: gardenPlots.stage,
      visible: gardenPlots.visible,
      active: gardenPlots.active,
      usable: gardenPlots.usable,
      source: gardenPlots.source,
      transform: gardenPlots.transform,
      stateHook: gardenPlots.stateHook,
      subProps: gardenPlots.subProps,
      debug: gardenPlots.debug
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
    const subProps = descriptor && descriptor.subProps && typeof descriptor.subProps === "object" ? descriptor.subProps : {};
    for (const subProp of Object.values(subProps)) {
      const subSource = subProp && subProp.source;
      if (subSource && subSource.sourceType === "external" && subSource.approvedForUse !== true) count += 1;
    }
  }
  return count;
}

function descriptorForFamily(familyId, overrides = {}) {
  const family = VISUAL_FAMILY_REGISTRY[familyId];
  const transform = cloneTransform(overrides.transform || family.transform || null);
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
    active: Boolean(overrides.active),
    usable: Boolean(overrides.usable),
    source: { ...(overrides.source || family.source) },
    transform,
    stateHook: overrides.stateHook ? clonePlainObject(overrides.stateHook) : null,
    subProps: overrides.subProps ? clonePlainObject(overrides.subProps) : {},
    debug: overrides.debug ? clonePlainObject(overrides.debug) : {}
  };
}

function visualFamily({
  id,
  propFamily,
  anchorType,
  anchorId = null,
  defaultVisible,
  notes,
  source = null,
  transform = null
}) {
  return {
    id,
    propFamily,
    anchorType,
    anchorId,
    defaultVisible,
    transform: cloneTransform(transform),
    source: source ? assetSourceMetadata(source) : assetSourceMetadata({
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

function resolveArrivalSuppliesVisualState(worldState) {
  const state = worldState && worldState.arrivalSupplies ? worldState.arrivalSupplies : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const carriedByBB = Boolean(state.bundleCarriedByBB === true || boy.carriedItem === ARRIVAL_BUNDLE_ITEM_ID);
  const washedBundleVisible = Boolean(state.washedBundleVisible) && !carriedByBB;
  const scatteredSticksVisible = Boolean(state.scatteredSticksVisible);
  const scatteredLeavesVisible = Boolean(state.scatteredLeavesVisible);
  const materialPileVisible = Boolean(state.materialPileVisible);
  const visible = state.visible !== false && (
    washedBundleVisible ||
    scatteredSticksVisible ||
    scatteredLeavesVisible ||
    materialPileVisible ||
    carriedByBB
  );
  const stage = normalizeArrivalSuppliesStage(state.stage, {
    visible,
    scatteredVisible: scatteredSticksVisible || scatteredLeavesVisible,
    materialPileVisible
  });
  const subProps = {
    washedBundle: arrivalSuppliesSubProp(
      "washedBundle",
      washedBundleVisible,
      VISUAL_ASSET_SOURCE_REGISTRY.procedural_arrival_bundle,
      VISUAL_TRANSFORM_REGISTRY.arrivalBundle,
      "worldState.arrivalSupplies.washedBundleVisible"
    ),
    scatteredSticks: arrivalSuppliesSubProp(
      "scatteredSticks",
      scatteredSticksVisible,
      VISUAL_ASSET_SOURCE_REGISTRY.procedural_arrival_sticks,
      VISUAL_TRANSFORM_REGISTRY.looseSticks,
      "worldState.arrivalSupplies.scatteredSticksVisible"
    ),
    scatteredLeaves: arrivalSuppliesSubProp(
      "scatteredLeaves",
      scatteredLeavesVisible,
      VISUAL_ASSET_SOURCE_REGISTRY.procedural_arrival_leaves,
      VISUAL_TRANSFORM_REGISTRY.looseLeaves,
      "worldState.arrivalSupplies.scatteredLeavesVisible"
    ),
    materialPile: arrivalSuppliesSubProp(
      "materialPile",
      materialPileVisible,
      VISUAL_ASSET_SOURCE_REGISTRY.procedural_arrival_material_pile,
      VISUAL_TRANSFORM_REGISTRY.arrivalMaterialPile,
      "worldState.arrivalSupplies.materialPileVisible"
    ),
    carryBundle: arrivalSuppliesSubProp(
      "carryBundle",
      carriedByBB,
      VISUAL_ASSET_SOURCE_REGISTRY.procedural_arrival_carry_bundle,
      VISUAL_TRANSFORM_REGISTRY.carryBundle,
      "worldState.bubbleBoy.carriedItem"
    )
  };
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_arrival_bundle;

  return {
    stage,
    variant: ARRIVAL_SUPPLIES_VARIANT,
    visible,
    active: Boolean(state.active || carriedByBB),
    usable: Boolean(state.usable),
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.arrivalBundle,
    subProps,
    stateHook: {
      state: "worldState.arrivalSupplies",
      washedBundle: "worldState.arrivalSupplies.washedBundleVisible",
      scatteredSticks: "worldState.arrivalSupplies.scatteredSticksVisible",
      scatteredLeaves: "worldState.arrivalSupplies.scatteredLeavesVisible",
      materialPile: "worldState.arrivalSupplies.materialPileVisible",
      carryBundle: "worldState.arrivalSupplies.bundleCarriedByBB",
      carriedItem: "worldState.bubbleBoy.carriedItem"
    },
    debug: {
      visualFamily: ARRIVAL_SUPPLIES_ID,
      visualVariant: ARRIVAL_SUPPLIES_VARIANT,
      currentFamilyState: carriedByBB ? "carried" : visible ? "available" : "hidden",
      washedBundle: washedBundleVisible,
      scatteredSticks: scatteredSticksVisible,
      scatteredLeaves: scatteredLeavesVisible,
      materialPile: materialPileVisible,
      carryBundle: carriedByBB,
      bbCarriedItem: boy.carriedItem || "",
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      duplicateSystemClassification: "new placeholder family",
      fallbackReason: visible ? "" : "arrival supplies state hidden or missing"
    }
  };
}

function arrivalSuppliesSubProp(id, visible, source, transform, stateHook) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when state field false/missing"
  };
}

function normalizeArrivalSuppliesStage(value, state) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "none" || stage === "complete") return stage;
  if (!state.visible) return "none";
  if (state.materialPileVisible && !state.scatteredVisible) return "partial";
  if (stage === "partial") return "partial";
  return "supplies";
}

function resolveFirstFireVisualState(worldState, selectedAction) {
  const objects = worldState && worldState.objects ? worldState.objects : {};
  const firePit = objects[FIRE_PIT_ID] || {};
  const fish = worldState && worldState.bubbleBoy && worldState.bubbleBoy.inventory
    ? worldState.bubbleBoy.inventory.fish || {}
    : {};
  const lit = firePit.lit !== false && Number(firePit.fuel || 0) > 0;
  const cooking = selectedAction === "pickupMaterial" || fish.state === "raw" || fish.state === "cooked";
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_campfire_firewood_cooking_surface;

  return {
    stage: lit ? "lit" : "unlit",
    variant: cooking ? "cookingSurface" : fireVariant(worldState),
    visible: firePit.visible === false ? false : true,
    active: selectedAction === "lightFire" || selectedAction === "tendFire" || cooking,
    usable: firePit.lit !== false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.campfireCookingSurface,
    stateHook: {
      state: `worldState.objects.${FIRE_PIT_ID}`,
      lit: `worldState.objects.${FIRE_PIT_ID}.lit`,
      fuel: `worldState.objects.${FIRE_PIT_ID}.fuel`,
      cooking: "worldState.bubbleBoy.inventory.fish.state",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: "firstFire",
      visualVariant: cooking ? "cookingSurface" : fireVariant(worldState),
      currentFamilyState: lit ? "lit" : "unlit",
      lit,
      fuel: Number.isFinite(firePit.fuel) ? firePit.fuel : 0,
      warmth: Number.isFinite(firePit.warmth) ? firePit.warmth : 0,
      cookingSurfaceActive: cooking,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.campfireCookingSurface.id,
      duplicateSystemClassification: "extends existing campfire/firewood/fishing cooking system",
      fallbackReason: firePit && firePit.id ? "" : "fire-pit object missing; descriptor keeps safe unlit placeholder"
    }
  };
}

function resolveRestShelterVisualState(worldState, selectedAction) {
  const restState = worldState && worldState.restShelter ? worldState.restShelter : {};
  const lifeLoop = worldState && worldState.lifeLoop ? worldState.lifeLoop : {};
  const sourceStage = normalizeRestShelterStage(restState.stage);
  const stage = sourceStage === "none" ? "none" : restShelterStageFromWorldState(worldState);
  const variant = REST_SHELTER_VARIANTS[stage] || "restSling";
  const transform = VISUAL_TRANSFORM_REGISTRY[variant] || VISUAL_TRANSFORM_REGISTRY.restSling;
  const source = sourceForRestShelterVariant(variant);
  const actionActive = isRestPresentationAction(selectedAction) || isRestWorldStateActive(worldState);
  const visible = restState.visible === false ? false : stage !== "none";
  const usable = Boolean(restState.usable || lifeLoop.canSleep || lifeLoop.sleepAvailable);

  return {
    stage,
    variant,
    visible,
    active: Boolean(restState.active || actionActive),
    usable,
    source,
    transform,
    stateHook: {
      state: "worldState.restShelter",
      lifeLoop: "worldState.lifeLoop.canSleep",
      goal: "worldState.bubbleBoy.goal",
      action: "worldState.bubbleBoy.currentAction",
      buildable: `worldState.buildables.${BUILDABLE_IDS.bed}`
    },
    debug: {
      visualFamily: REST_SHELTER_ID,
      visualVariant: variant,
      currentFamilyState: actionActive ? "active" : "available",
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      duplicateSystemClassification: "extends existing shelter/bed system",
      buildableStage: buildableStage(worldState, "bed")
    }
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

function sourceForRestShelterVariant(variant) {
  if (variant === "strongShelter") return VISUAL_ASSET_SOURCE_REGISTRY.procedural_strong_shelter;
  if (variant === "cozyBed") return VISUAL_ASSET_SOURCE_REGISTRY.procedural_bed_upgrade;
  return VISUAL_ASSET_SOURCE_REGISTRY.procedural_hammock;
}

function restShelterStageFromWorldState(worldState) {
  const restState = worldState && worldState.restShelter ? worldState.restShelter : {};
  if (normalizeRestShelterStage(restState.stage)) return restState.stage;
  const time = worldState && worldState.time ? worldState.time : {};
  const day = Math.max(1, Math.floor(Number.isFinite(time.day) ? time.day : 1));
  const shelter = buildableState(worldState, BUILDABLE_IDS.shelter);
  const bed = buildableState(worldState, BUILDABLE_IDS.bed);
  if (day >= 76 && Number(shelter.progress || 0) >= 1) return "reinforcedShelter";
  if (day >= 21 || Number(bed.progress || 0) >= 1) return "bedUpgrade";
  return "hammock";
}

function normalizeRestShelterStage(value) {
  const stage = typeof value === "string" ? value : "";
  if (stage === "hammock" || stage === "bedUpgrade" || stage === "reinforcedShelter" || stage === "none") {
    return stage;
  }
  return null;
}

function normalizeRestShelterVariant(value) {
  const variant = typeof value === "string" ? value : "";
  if (variant === "restSling" || variant === "cozyBed" || variant === "strongShelter" || variant === "none") {
    return variant;
  }
  return null;
}

function isRestPresentationAction(action) {
  return (
    action === "rest_sit" ||
    action === "rest_sleep_loop" ||
    action === "rest_wake_stretch" ||
    action === "sleepInHammock" ||
    action === "wakeStretch"
  );
}

function isRestWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  return (
    goal === "sleep" ||
    goal === "rest" ||
    goal === "useBed" ||
    action === "sleep" ||
    action === "wake" ||
    action === "rest" ||
    action === "resting"
  );
}

function resolveStorageWorkbenchToolsVisualState(worldState, selectedAction, attachment) {
  const campStorage = worldState && worldState.campStorage ? worldState.campStorage : {};
  const objects = worldState && worldState.objects ? worldState.objects : {};
  const buildables = worldState && worldState.buildables ? worldState.buildables : {};
  const workbench = buildables[WORKBENCH_ID] || objects[WORKBENCH_ID] || {};
  const toolRack = worldState && worldState.toolRack ? worldState.toolRack : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const toolInventory = boy.toolInventory && typeof boy.toolInventory === "object" ? boy.toolInventory : {};
  const actionActive = isStorageWorkbenchToolsAction(selectedAction) || isStorageWorkbenchToolsWorldStateActive(worldState);
  const storageVisible = campStorage.visible !== false;
  const workbenchVisible = workbench.visible !== false;
  const rackVisible = toolRack.visible !== false;
  const woodCount = Number.isFinite(campStorage.woodCount)
    ? campStorage.woodCount
    : Number.isFinite(campStorage.storedWood)
      ? campStorage.storedWood
      : 0;
  const slots = Array.isArray(toolRack.slots) ? toolRack.slots : [];
  const inspectingTool = Boolean(
    selectedAction === "inspectTool" ||
      toolInventory.inspectingTool === STONE_TOOL_ITEM_ID ||
      toolInventory.heldTool === STONE_TOOL_ITEM_ID ||
      (attachment && attachment.id === "firstTool")
  );
  const hasStoneTool = Boolean(
    toolInventory.hasStoneTool ||
      toolInventory.inspectingTool === STONE_TOOL_ITEM_ID ||
      toolInventory.heldTool === STONE_TOOL_ITEM_ID ||
      slots.some((slot) => slot && slot.item === STONE_TOOL_ITEM_ID)
  );
  const rackStoneVisible = rackVisible && hasStoneTool && !inspectingTool;
  const stage = storageWorkbenchToolsStage({
    woodCount,
    hasStoneTool,
    selectedAction,
    workbenchVariant: workbench.variant,
    rackStage: toolRack.stage
  });
  const variant = selectedAction === "craftAtWorkbench"
    ? "craftingWorkbench"
    : selectedAction === "inspectTool"
      ? "toolInspection"
      : "workbenchStorageRack";
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_storage_basket;

  return {
    stage,
    variant,
    visible: storageVisible || workbenchVisible || rackVisible,
    active: actionActive,
    usable: Boolean(campStorage.usable !== false || workbench.usable !== false || toolRack.usable !== false),
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.campStorageBasket,
    subProps: {
      campStorage: storageWorkbenchToolsSubProp(
        "campStorage",
        storageVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_storage_basket,
        VISUAL_TRANSFORM_REGISTRY.campStorageBasket,
        "worldState.campStorage",
        { stage: campStorage.stage || (woodCount > 0 ? "hasWood" : "empty"), woodCount }
      ),
      upgradedWorkbench: storageWorkbenchToolsSubProp(
        "upgradedWorkbench",
        workbenchVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_workbench_upgrade,
        VISUAL_TRANSFORM_REGISTRY.upgradedWorkbench,
        "worldState.buildables.workbench",
        { stage: workbench.stage || "complete", variant: workbench.variant || "upgraded" }
      ),
      toolRack: storageWorkbenchToolsSubProp(
        "toolRack",
        rackVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_tool_rack,
        VISUAL_TRANSFORM_REGISTRY.toolRack,
        "worldState.toolRack",
        { stage: toolRack.stage || "empty", slotCount: slots.length }
      ),
      firstTool: storageWorkbenchToolsSubProp(
        "firstTool",
        rackStoneVisible || inspectingTool,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_first_tool,
        VISUAL_TRANSFORM_REGISTRY.firstTool,
        "worldState.bubbleBoy.toolInventory",
        {
          stage: inspectingTool ? "held" : rackStoneVisible ? "racked" : "hidden",
          attachedToBB: inspectingTool,
          rackVisible: rackStoneVisible
        }
      )
    },
    stateHook: {
      state: "worldState.campStorage",
      storage: "worldState.campStorage",
      workbench: "worldState.buildables.workbench",
      workbenchObject: "worldState.objects.workbench",
      toolInventory: "worldState.bubbleBoy.toolInventory",
      toolRack: "worldState.toolRack",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: STORAGE_WORKBENCH_TOOLS_ID,
      visualVariant: variant,
      currentFamilyState: actionActive ? "active" : "available",
      activeAnimationAction: selectedAction || "",
      activeAttachedProp: attachment ? attachment.id || "" : "",
      storageStage: campStorage.stage || (woodCount > 0 ? "hasWood" : "empty"),
      storageWoodCount: woodCount,
      workbenchStage: workbench.stage || "complete",
      workbenchVariant: workbench.variant || "upgraded",
      toolRackStage: toolRack.stage || "empty",
      toolRackSlotCount: slots.length,
      toolInventoryHasStoneTool: hasStoneTool,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.campStorageBasket.id,
      duplicateSystemClassification: "extends existing workbench/storage; new placeholder tool rack/tool inventory",
      fallbackReason: ""
    }
  };
}

function storageWorkbenchToolsStage({ woodCount, hasStoneTool, selectedAction, workbenchVariant, rackStage }) {
  if (selectedAction === "inspectTool") return "inspectTool";
  if (selectedAction === "craftAtWorkbench") return "crafting";
  if (hasStoneTool || rackStage === "hasStoneTool") return "toolReady";
  if (workbenchVariant === "upgraded") return woodCount > 0 ? "hasWood" : "empty";
  return woodCount > 0 ? "hasWood" : "empty";
}

function storageWorkbenchToolsSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when state field false/missing",
    ...extra
  };
}

function isStorageWorkbenchToolsAction(action) {
  return action === "depositMaterials" || action === "craftAtWorkbench" || action === "inspectTool";
}

function isStorageWorkbenchToolsWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "depositMaterials" ||
    action === "craftAtWorkbench" ||
    action === "inspectTool" ||
    goal === "storage" ||
    goal === "craft" ||
    goal === "inspectTool"
  );
}

function resolveCampPathsVisualState(worldState, selectedAction, attachment) {
  const campLayout = worldState && worldState.campLayout ? worldState.campLayout : {};
  const paths = Array.isArray(campLayout.paths) ? campLayout.paths : [];
  const zones = Array.isArray(campLayout.zones) ? campLayout.zones : [];
  const visiblePaths = paths.filter((path) => path && path.visible !== false && (path.stage === "cleared" || path.stage === "lit"));
  const litPaths = visiblePaths.filter((path) => path.stage === "lit" || path.lit === true);
  const boundaryStones = zones.flatMap((zone) => {
    return Array.isArray(zone.boundaryStones)
      ? zone.boundaryStones.filter((stone) => stone && stone.visible !== false)
      : [];
  });
  const actionActive = isCampPathPresentationAction(selectedAction) || isCampPathWorldStateActive(worldState);
  const carriedBoundaryStone = Boolean(attachment && attachment.id === "boundaryStoneCarry");
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_footpath_strip;
  const stage = litPaths.length > 0
    ? "lit"
    : visiblePaths.length > 0
      ? "cleared"
      : carriedBoundaryStone || actionActive
        ? "active"
        : "none";
  const visible = visiblePaths.length > 0 || boundaryStones.length > 0 || litPaths.length > 0 || carriedBoundaryStone;

  return {
    stage,
    variant: litPaths.length > 0 ? "litDirtPath" : "dirtPath",
    visible,
    active: actionActive,
    usable: campLayout.usable === false ? false : true,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.footpathStrip,
    subProps: {
      footpaths: campLayoutListSubProp(
        "footpaths",
        visiblePaths.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_footpath_strip,
        VISUAL_TRANSFORM_REGISTRY.footpathStrip,
        "worldState.campLayout.paths",
        visiblePaths.map(compactPathDescriptor)
      ),
      boundaryStones: campLayoutListSubProp(
        "boundaryStones",
        boundaryStones.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_boundary_stone,
        VISUAL_TRANSFORM_REGISTRY.boundaryStone,
        "worldState.campLayout.zones[].boundaryStones",
        boundaryStones.map(compactBoundaryStoneDescriptor)
      ),
      litAnchors: campLayoutListSubProp(
        "litAnchors",
        litPaths.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lit_path_anchor,
        VISUAL_TRANSFORM_REGISTRY.litPathAnchor,
        "worldState.campLayout.paths[].stage",
        litPaths.flatMap(compactLitAnchorDescriptors)
      ),
      carriedBoundaryStone: {
        id: "carriedBoundaryStone",
        visible: carriedBoundaryStone,
        source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_boundary_stone,
        transform: VISUAL_TRANSFORM_REGISTRY.boundaryStoneCarry,
        stateHook: "worldState.bubbleBoy.carriedObject",
        fallbackBehavior: "hidden unless boundaryStoneCarry attachment is active"
      }
    },
    stateHook: {
      state: "worldState.campLayout",
      paths: "worldState.campLayout.paths",
      zones: "worldState.campLayout.zones",
      carriedObject: "worldState.bubbleBoy.carriedObject",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: CAMP_PATHS_FAMILY,
      visualVariant: litPaths.length > 0 ? "litDirtPath" : "dirtPath",
      currentFamilyState: actionActive ? "active" : visible ? "available" : "hidden",
      activePathCount: visiblePaths.length,
      clearedPaths: visiblePaths.map((path) => path.id),
      litPaths: litPaths.map((path) => path.id),
      boundaryStoneCount: boundaryStones.length,
      carriedObject: worldState && worldState.bubbleBoy ? worldState.bubbleBoy.carriedObject || "" : "",
      activeAttachedProp: attachment ? attachment.id || "" : "",
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.footpathStrip.id,
      duplicateSystemClassification: "new placeholder family",
      fallbackReason: visible ? "" : "no cleared/lit paths or carried boundary stone in campLayout"
    }
  };
}

function resolveCampZonesVisualState(worldState, selectedAction) {
  const campLayout = worldState && worldState.campLayout ? worldState.campLayout : {};
  const zones = Array.isArray(campLayout.zones) ? campLayout.zones : [];
  const markedZones = zones.filter((zone) => {
    return zone && zone.visible !== false && (zone.stage === "marked" || zone.markerPlaced === true);
  });
  const actionActive = isCampPathPresentationAction(selectedAction) || isCampPathWorldStateActive(worldState);
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_zone_marker;

  return {
    stage: markedZones.length > 0 ? "marked" : actionActive ? "active" : "none",
    variant: "zoneMarkers",
    visible: markedZones.length > 0,
    active: actionActive,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.zoneMarker,
    subProps: {
      zoneMarkers: campLayoutListSubProp(
        "zoneMarkers",
        markedZones.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_zone_marker,
        VISUAL_TRANSFORM_REGISTRY.zoneMarker,
        "worldState.campLayout.zones",
        markedZones.map(compactZoneDescriptor)
      )
    },
    stateHook: {
      state: "worldState.campLayout",
      zones: "worldState.campLayout.zones",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: CAMP_ZONES_FAMILY,
      visualVariant: "zoneMarkers",
      currentFamilyState: actionActive ? "active" : markedZones.length > 0 ? "available" : "hidden",
      markedZones: markedZones.map((zone) => zone.id),
      markedZoneCount: markedZones.length,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.zoneMarker.id,
      duplicateSystemClassification: "new placeholder family",
      fallbackReason: markedZones.length > 0 ? "" : "no marked zones in campLayout"
    }
  };
}

function campLayoutListSubProp(id, visible, source, transform, stateHook, items) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    items,
    count: Array.isArray(items) ? items.length : 0,
    fallbackBehavior: "hidden when campLayout state is missing or stage is none"
  };
}

function compactPathDescriptor(path) {
  return {
    id: path.id || "",
    stage: path.stage || "none",
    variant: path.variant || "dirtPath",
    waypoints: Array.isArray(path.waypoints) ? path.waypoints.map(cloneVectorObject) : []
  };
}

function compactBoundaryStoneDescriptor(stone) {
  return {
    id: stone.id || "",
    stage: stone.stage || "placed",
    variant: stone.variant || "boundaryStone",
    position: cloneVectorObject(stone.position)
  };
}

function compactLitAnchorDescriptors(path) {
  const waypoints = Array.isArray(path.waypoints) ? path.waypoints : [];
  if (waypoints.length === 0) return [];
  return [waypoints[0], waypoints[waypoints.length - 1]].map((position, index) => ({
    id: `${path.id || "path"}-lit-anchor-${index + 1}`,
    pathId: path.id || "",
    position: cloneVectorObject(position)
  }));
}

function compactZoneDescriptor(zone) {
  return {
    id: zone.id || "",
    type: zone.type || "rest",
    stage: zone.stage || "none",
    variant: zone.variant || "restZoneStone",
    anchorPosition: cloneVectorObject(zone.anchorPosition)
  };
}

function cloneVectorObject(vector) {
  const source = vector && typeof vector === "object" ? vector : {};
  return {
    x: Number.isFinite(source.x) ? source.x : 0,
    y: Number.isFinite(source.y) ? source.y : 0,
    z: Number.isFinite(source.z) ? source.z : 0
  };
}

function isCampPathPresentationAction(action) {
  return action === "rakePath" || action === "placeBoundaryStone" || action === "walkRoute";
}

function isCampPathWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "rakePath" ||
    action === "placeBoundaryStone" ||
    action === "walkRoute" ||
    goal === "campLayout" ||
    goal === "rakePath" ||
    goal === "walkRoute"
  );
}

function resolveGardenPlotsVisualState(worldState, selectedAction, attachment) {
  const plots = Array.isArray(worldState && worldState.gardenPlots) ? worldState.gardenPlots : [];
  const plotItems = plots
    .map(compactGardenPlotDescriptor)
    .filter((plot) => plot.visible);
  const seededPlots = plotItems.filter((plot) => plot.stage === "seeded");
  const sproutPlots = plotItems.filter((plot) => plot.stage === "sprout1" || plot.stage === "sprout2");
  const maturePlots = plotItems.filter((plot) => plot.stage === "grown");
  const wateredPlots = plotItems.filter((plot) => plot.watered);
  const actionActive = isGardenPresentationAction(selectedAction) || isGardenWorldStateActive(worldState);
  const attachedWaterCan = Boolean(attachment && attachment.id === "waterCan");
  const attachedHarvestedCrop = Boolean(attachment && attachment.id === "harvestedCropCarry");
  const activePlot = plotItems.find((plot) => plot.active) || plotItems[0] || null;
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_garden_plot;
  const visible = plotItems.length > 0 || attachedWaterCan || attachedHarvestedCrop;

  return {
    stage: activePlot ? activePlot.stage : actionActive ? "active" : "none",
    variant: activePlot ? activePlot.cropType : "carrot",
    visible,
    active: actionActive,
    usable: activePlot ? Boolean(activePlot.usable) : false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.gardenPlot,
    subProps: {
      plots: gardenListSubProp(
        "plots",
        plotItems.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_garden_plot,
        VISUAL_TRANSFORM_REGISTRY.gardenPlot,
        "worldState.gardenPlots",
        plotItems
      ),
      seeds: gardenListSubProp(
        "seeds",
        seededPlots.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_garden_seeds,
        VISUAL_TRANSFORM_REGISTRY.gardenSeeds,
        "worldState.gardenPlots[].stage",
        seededPlots
      ),
      sprouts: gardenListSubProp(
        "sprouts",
        sproutPlots.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_garden_sprout,
        VISUAL_TRANSFORM_REGISTRY.gardenSprout,
        "worldState.gardenPlots[].stage",
        sproutPlots
      ),
      matureCrops: gardenListSubProp(
        "matureCrops",
        maturePlots.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_garden_crop,
        VISUAL_TRANSFORM_REGISTRY.gardenCrop,
        "worldState.gardenPlots[].stage",
        maturePlots
      ),
      wateredIndicators: gardenListSubProp(
        "wateredIndicators",
        wateredPlots.length > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_watering_can,
        VISUAL_TRANSFORM_REGISTRY.gardenPlot,
        "worldState.gardenPlots[].watered",
        wateredPlots
      ),
      waterCan: {
        id: "waterCan",
        visible: attachedWaterCan,
        source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_watering_can,
        transform: VISUAL_TRANSFORM_REGISTRY.wateringCan,
        stateHook: "worldState.bubbleBoy.carrying",
        fallbackBehavior: "hidden unless waterCan attachment is active"
      },
      harvestedCrop: {
        id: "harvestedCrop",
        visible: attachedHarvestedCrop,
        source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_harvested_crop,
        transform: VISUAL_TRANSFORM_REGISTRY.harvestedCrop,
        stateHook: "worldState.bubbleBoy.carrying",
        fallbackBehavior: "hidden unless harvestedCropCarry attachment is active"
      }
    },
    stateHook: {
      state: "worldState.gardenPlots",
      plots: "worldState.gardenPlots[]",
      stage: "worldState.gardenPlots[].stage",
      watered: "worldState.gardenPlots[].watered",
      cropType: "worldState.gardenPlots[].cropType",
      carrying: "worldState.bubbleBoy.carrying",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: GARDEN_PLOTS_FAMILY,
      visualVariant: activePlot ? activePlot.cropType : "carrot",
      currentFamilyState: actionActive ? "active" : visible ? "available" : "hidden",
      activePlotId: activePlot ? activePlot.id : "",
      plotStage: activePlot ? activePlot.stage : "",
      cropType: activePlot ? activePlot.cropType : "",
      watered: activePlot ? Boolean(activePlot.watered) : false,
      plotCount: plotItems.length,
      seededPlotCount: seededPlots.length,
      sproutPlotCount: sproutPlots.length,
      maturePlotCount: maturePlots.length,
      wateredPlotCount: wateredPlots.length,
      activeAnimationAction: selectedAction || "",
      activeAttachedProp: attachment ? attachment.id || "" : "",
      carrying: worldState && worldState.bubbleBoy ? worldState.bubbleBoy.carrying || "" : "",
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.gardenPlot.id,
      duplicateSystemClassification: "new placeholder family",
      fallbackReason: visible ? "" : "no visible garden plot stage or garden attachment"
    }
  };
}

function gardenListSubProp(id, visible, source, transform, stateHook, items) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    items,
    count: Array.isArray(items) ? items.length : 0,
    fallbackBehavior: "hidden when garden plot state is missing or stage is none"
  };
}

function compactGardenPlotDescriptor(plot) {
  const source = plot && typeof plot === "object" ? plot : {};
  const stage = normalizeGardenPlotVisualStage(source.stage, source);
  return {
    id: source.id || "",
    family: GARDEN_PLOT_FAMILY,
    visible: source.visible === false ? false : stage !== "none",
    stage,
    variant: normalizeGardenCropVisualType(source.variant || source.cropType),
    cropType: normalizeGardenCropVisualType(source.cropType || source.variant),
    watered: Boolean(source.watered),
    active: Boolean(source.active),
    usable: source.usable === false ? false : true,
    position: cloneVectorObject(source.position || source.anchorPosition),
    debugLabel: source.debugLabel || `garden plot stage: ${stage}`
  };
}

function normalizeGardenPlotVisualStage(value, source = {}) {
  const stage = typeof value === "string" ? value : "";
  if (
    stage === "none" ||
    stage === "tilled" ||
    stage === "seeded" ||
    stage === "sprout1" ||
    stage === "sprout2" ||
    stage === "grown" ||
    stage === "harvested"
  ) {
    return stage;
  }
  if (stage || source.visible === true || source.watered === true) return "tilled";
  return "none";
}

function normalizeGardenCropVisualType(value) {
  const cropType = typeof value === "string" ? value : "";
  if (cropType === "berry" || cropType === "leafy" || cropType === "carrot") return cropType;
  return "carrot";
}

function isGardenPresentationAction(action) {
  return action === "planting" || action === "watering" || action === "harvesting" || action === "inspectingGarden";
}

function isGardenWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "planting" ||
    action === "watering" ||
    action === "harvesting" ||
    action === "inspectingGarden" ||
    goal === "garden" ||
    goal === "planting" ||
    goal === "watering" ||
    goal === "harvesting" ||
    goal === "inspectingGarden"
  );
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
  if (buildableId === WORKBENCH_ID) return objects[WORKBENCH_ID] || {};
  return {};
}

function cloneTransform(transform) {
  if (!transform || typeof transform !== "object") return null;
  return {
    id: typeof transform.id === "string" ? transform.id : "",
    scale: cloneArray(transform.scale || [1, 1, 1]),
    rotation: cloneArray(transform.rotation || [0, 0, 0]),
    groundOffset: Number.isFinite(transform.groundOffset) ? transform.groundOffset : 0,
    centerOrigin: typeof transform.centerOrigin === "string" ? transform.centerOrigin : "center",
    anchorPoint: typeof transform.anchorPoint === "string" ? transform.anchorPoint : "base",
    attachPoint: typeof transform.attachPoint === "string" ? transform.attachPoint : "world",
    bounds: transform.bounds && typeof transform.bounds === "object"
      ? {
          radius: Number.isFinite(transform.bounds.radius) ? transform.bounds.radius : 0,
          height: Number.isFinite(transform.bounds.height) ? transform.bounds.height : 0
        }
      : { radius: 0, height: 0 },
    cameraReadabilityDistance: Number.isFinite(transform.cameraReadabilityDistance)
      ? transform.cameraReadabilityDistance
      : 0
  };
}

function cloneArray(value) {
  return Array.isArray(value) ? value.slice() : [];
}

function clonePlainObject(value) {
  return JSON.parse(JSON.stringify(value));
}

function freezeAssetSourceRegistry(registry) {
  const frozen = {};
  for (const [key, value] of Object.entries(registry)) {
    frozen[key] = Object.freeze({ ...value });
  }
  return Object.freeze(frozen);
}

function freezeTransformRegistry(registry) {
  const frozen = {};
  for (const [key, value] of Object.entries(registry)) {
    frozen[key] = Object.freeze(cloneTransform(value));
  }
  return Object.freeze(frozen);
}

function freezeRegistry(registry) {
  const frozen = {};
  for (const [key, value] of Object.entries(registry)) {
    frozen[key] = Object.freeze({
      ...value,
      source: Object.freeze({ ...value.source }),
      transform: value.transform ? Object.freeze(cloneTransform(value.transform)) : null
    });
  }
  return Object.freeze(frozen);
}
