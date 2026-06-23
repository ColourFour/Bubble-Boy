import {
  ANIMAL_FAMILIAR_VISITOR_FAMILY,
  ANIMAL_FAMILIAR_VISITOR_ID,
  AMBIENT_BEACH_FINDS_FAMILY,
  AMBIENT_BEACH_FINDS_ID,
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
  FISH_TRAP_ROUTINE_FAMILY,
  FISH_TRAP_ROUTINE_ID,
  FOOD_ROUTINE_FAMILY,
  FOOD_ROUTINE_ID,
  GARDEN_PLOT_FAMILY,
  GARDEN_PLOTS_FAMILY,
  MUSIC_ART_DECOR_FAMILY,
  MUSIC_ART_DECOR_ID,
  NIGHT_COMFORT_LIGHTS_FAMILY,
  NIGHT_COMFORT_LIGHTS_ID,
  LOOKOUT_MAP_HORIZON_FAMILY,
  LOOKOUT_MAP_HORIZON_ID,
  MAJOR_PROJECT_CAPSTONE_FAMILY,
  MAJOR_PROJECT_CAPSTONE_ID,
  PIER_SHORE_WORK_SITE_FAMILY,
  PIER_SHORE_WORK_SITE_ID,
  RAFT_BOAT_ROUTE_FAMILY,
  RAFT_BOAT_ROUTE_ID,
  REST_SHELTER_FAMILY,
  REST_SHELTER_ID,
  REST_SHELTER_VARIANTS,
  STONE_TOOL_ITEM_ID,
  STORAGE_WORKBENCH_TOOLS_FAMILY,
  STORAGE_WORKBENCH_TOOLS_ID,
  TOOL_RACK_ID,
  TOY_PLAY_SET_FAMILY,
  TOY_PLAY_SET_ID,
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
  }),
  procedural_food_cook_pot: assetSourceMetadata({
    id: "procedural_food_cook_pot",
    family: FOOD_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly cook pot and small cooking surface cue near the existing campfire."
  }),
  procedural_food_basket: assetSourceMetadata({
    id: "procedural_food_basket",
    family: FOOD_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Simple slatted basket with colorful harvest fillers inspired by reviewed low-poly food kits."
  }),
  procedural_food_stored_meals: assetSourceMetadata({
    id: "procedural_food_stored_meals",
    family: FOOD_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small wrapped meal boxes and bowls staged as stored meals; no inventory mechanics."
  }),
  procedural_food_drying_rack: assetSourceMetadata({
    id: "procedural_food_drying_rack",
    family: FOOD_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Lean wooden drying rack with tiny hanging fish/harvest silhouettes."
  }),
  procedural_food_fish_harvest_display: assetSourceMetadata({
    id: "procedural_food_fish_harvest_display",
    family: FOOD_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Readable fish and harvest display props using only primitive meshes."
  }),
  procedural_food_leftovers: assetSourceMetadata({
    id: "procedural_food_leftovers",
    family: FOOD_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Tiny plate/bowl with leftover bits for post-meal readability."
  }),
  procedural_fish_trap_crab_pot: assetSourceMetadata({
    id: "procedural_fish_trap_crab_pot",
    family: FISH_TRAP_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly fish trap/crab pot cage built from primitive hoops, slats, and a funnel entrance; reference searches used for direction only."
  }),
  procedural_fish_trap_buoy_marker: assetSourceMetadata({
    id: "procedural_fish_trap_buoy_marker",
    family: FISH_TRAP_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Striped buoy marker and small flag made from primitive meshes; no external buoy asset imported."
  }),
  procedural_fish_trap_rope_line: assetSourceMetadata({
    id: "procedural_fish_trap_rope_line",
    family: FISH_TRAP_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Cheap cylinder rope/line connection between the trap and buoy marker."
  }),
  procedural_fish_trap_state_cues: assetSourceMetadata({
    id: "procedural_fish_trap_state_cues",
    family: FISH_TRAP_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small visual-only set/check/collect/drying state markers; no timer, storage, or economy behavior."
  }),
  procedural_fish_trap_drying_rack: assetSourceMetadata({
    id: "procedural_fish_trap_drying_rack",
    family: FISH_TRAP_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Shore drying rack with hanging fish silhouettes for trap routine presentation only."
  }),
  procedural_fish_trap_catch_display: assetSourceMetadata({
    id: "procedural_fish_trap_catch_display",
    family: FISH_TRAP_ROUTINE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small placeholder fish/crab catch display using primitive meshes; not linked to inventory or food economy."
  }),
  procedural_toy_play_collection_slots: assetSourceMetadata({
    id: "procedural_toy_play_collection_slots",
    family: TOY_PLAY_SET_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small toy collection tray/display with readable slot cups; reference searches used for direction only."
  }),
  procedural_toy_play_blocks: assetSourceMetadata({
    id: "procedural_toy_play_blocks",
    family: TOY_PLAY_SET_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Loose low-poly colored toy blocks staged beside the existing toy-block buildable, not a second build system."
  }),
  procedural_toy_play_ball: assetSourceMetadata({
    id: "procedural_toy_play_ball",
    family: TOY_PLAY_SET_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Simple low-poly ball with stripe bands; no ball physics or interaction behavior."
  }),
  procedural_toy_play_kite: assetSourceMetadata({
    id: "procedural_toy_play_kite",
    family: TOY_PLAY_SET_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Diamond kite, short static string, and ground handle made from primitive meshes; no kite physics."
  }),
  procedural_toy_play_spinning_top: assetSourceMetadata({
    id: "procedural_toy_play_spinning_top",
    family: TOY_PLAY_SET_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Tiny spinning-top placeholder built from cone, cylinder, and ring primitives; static visual only."
  }),
  procedural_toy_play_mat: assetSourceMetadata({
    id: "procedural_toy_play_mat",
    family: TOY_PLAY_SET_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Flat low-poly play mat with simple bordered layout markings; visual-only Days 61-65 prop base."
  }),
  procedural_music_shell_chime: assetSourceMetadata({
    id: "procedural_music_shell_chime",
    family: MUSIC_ART_DECOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Shell chime made from primitive shells, short cords, and a branch crossbar; reference searches used for direction only."
  }),
  procedural_music_painted_stones: assetSourceMetadata({
    id: "procedural_music_painted_stones",
    family: MUSIC_ART_DECOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small painted stone cluster using flattened low-poly primitives and simple color markings."
  }),
  procedural_music_drum_flute: assetSourceMetadata({
    id: "procedural_music_drum_flute",
    family: MUSIC_ART_DECOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Static low-poly hand drum and small flute props; no sound engine or rhythm gameplay hooks."
  }),
  procedural_music_hanging_decoration: assetSourceMetadata({
    id: "procedural_music_hanging_decoration",
    family: MUSIC_ART_DECOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small hanging decoration with beads and leaf pennants made from primitive meshes."
  }),
  procedural_music_art_display_slot: assetSourceMetadata({
    id: "procedural_music_art_display_slot",
    family: MUSIC_ART_DECOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Tiny art display slot/easel for painted stones and island marks; visual-only display placeholder."
  }),
  procedural_music_dusk_performance_marker: assetSourceMetadata({
    id: "procedural_music_dusk_performance_marker",
    family: MUSIC_ART_DECOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Dusk/night performance marker ring and tiny lantern-like prop; no lighting, scheduling, or performance mechanics."
  }),
  procedural_music_static_note_sparkle: assetSourceMetadata({
    id: "procedural_music_static_note_sparkle",
    family: MUSIC_ART_DECOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Bounded deterministic static music-note/sparkle marker pool capped at five meshes; no emitter or per-frame allocation."
  }),
  procedural_animal_familiar_ground_visitor: assetSourceMetadata({
    id: "procedural_animal_familiar_ground_visitor",
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Simple harmless low-poly ground animal visitor; visual-only, nonblocking, and collider-free."
  }),
  procedural_animal_familiar_bird_visitor: assetSourceMetadata({
    id: "procedural_animal_familiar_bird_visitor",
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Tiny static bird visitor variant made from primitive body, wing, and beak shapes; no flocking or bird-system hooks."
  }),
  procedural_animal_familiar_fish_visitor: assetSourceMetadata({
    id: "procedural_animal_familiar_fish_visitor",
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small shoreline fish visitor marker built from primitive fish shapes; no ocean, catch, or fish-behavior hooks."
  }),
  procedural_animal_familiar_food_crumb_marker: assetSourceMetadata({
    id: "procedural_animal_familiar_food_crumb_marker",
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small feed/crumb staging marker; visual-only and not connected to hunger, inventory, storage, or food economy."
  }),
  procedural_animal_familiar_observe_marker: assetSourceMetadata({
    id: "procedural_animal_familiar_observe_marker",
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Flat observe-distance ring marker that communicates safe distance without creating collision or pathing constraints."
  }),
  procedural_animal_familiar_approach_marker: assetSourceMetadata({
    id: "procedural_animal_familiar_approach_marker",
    family: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Gentle approach/staging pebbles for a future observe/feed routine; static visual placeholders only."
  }),
  procedural_night_lantern_post: assetSourceMetadata({
    id: "procedural_night_lantern_post",
    family: NIGHT_COMFORT_LIGHTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly lantern post with emissive lantern cap; no fuel, schedule, or real light behavior."
  }),
  procedural_night_lit_path_anchor: assetSourceMetadata({
    id: "procedural_night_lit_path_anchor",
    family: NIGHT_COMFORT_LIGHTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small emissive path-anchor stones; visual-only and separate from camp path mechanics."
  }),
  procedural_night_glowing_shell: assetSourceMetadata({
    id: "procedural_night_glowing_shell",
    family: NIGHT_COMFORT_LIGHTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Tiny glowing shell markers using emissive materials; no lighting system hooks."
  }),
  procedural_night_deterministic_fireflies: assetSourceMetadata({
    id: "procedural_night_deterministic_fireflies",
    family: NIGHT_COMFORT_LIGHTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Bounded deterministic firefly sprite/mesh markers capped at twelve; no emitter, AI, or per-frame allocation."
  }),
  procedural_night_sit_light_anchor: assetSourceMetadata({
    id: "procedural_night_sit_light_anchor",
    family: NIGHT_COMFORT_LIGHTS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Sit-at-night comfort anchor marker using emissive ring and low-poly shell; no comfort mechanic or schedule."
  }),
  procedural_lookout_platform: assetSourceMetadata({
    id: "procedural_lookout_platform",
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly lookout deck, posts, rails, and shallow static steps; no climbing, physics, or vertical movement behavior."
  }),
  procedural_lookout_map_board: assetSourceMetadata({
    id: "procedural_lookout_map_board",
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Simple map board with painted line markers; visual-only and not connected to map discovery."
  }),
  procedural_lookout_sketch_map: assetSourceMetadata({
    id: "procedural_lookout_sketch_map",
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small parchment-like sketch/map props built from primitive planes and line strips; no inventory or discovery hooks."
  }),
  procedural_lookout_horizon_marker: assetSourceMetadata({
    id: "procedural_lookout_horizon_marker",
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Distant horizon pointer/highlight markers; not connected to off-island world or camera systems."
  }),
  procedural_lookout_keepsake_display: assetSourceMetadata({
    id: "procedural_lookout_keepsake_display",
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small shelf of keepsake stones/shell markers for the lookout display; no storage or economy hooks."
  }),
  procedural_lookout_day100_gathering: assetSourceMetadata({
    id: "procedural_lookout_day100_gathering",
    family: LOOKOUT_MAP_HORIZON_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small Day 100 gathering/display detail around the lookout; no milestone, ending, or progression logic."
  }),
  procedural_capstone_community_table_supplies: assetSourceMetadata({
    id: "procedural_capstone_community_table_supplies",
    family: MAJOR_PROJECT_CAPSTONE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Stage 0 community-table supplies and marker pile; visual-only with no resource planning or inventory hooks."
  }),
  procedural_capstone_community_table_partial: assetSourceMetadata({
    id: "procedural_capstone_community_table_partial",
    family: MAJOR_PROJECT_CAPSTONE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Stage 1 partial community table frame; no construction mechanics or resource spending."
  }),
  procedural_capstone_community_table_complete: assetSourceMetadata({
    id: "procedural_capstone_community_table_complete",
    family: MAJOR_PROJECT_CAPSTONE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Stage 2/3 mostly built and complete community table with benches; visual-only and not a buildable system."
  }),
  procedural_capstone_community_table_place_settings: assetSourceMetadata({
    id: "procedural_capstone_community_table_place_settings",
    family: MAJOR_PROJECT_CAPSTONE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small table setting/display props for the complete community table; no food, storage, or economy behavior."
  }),
  procedural_capstone_community_table_celebration: assetSourceMetadata({
    id: "procedural_capstone_community_table_celebration",
    family: MAJOR_PROJECT_CAPSTONE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small celebration/display detail for the complete table; no milestone or Day 100 completion logic."
  }),
  procedural_beach_shells: assetSourceMetadata({
    id: "procedural_beach_shells",
    family: AMBIENT_BEACH_FINDS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Instanced low-poly shell variants inspired by reviewed shell searches; no external meshes imported."
  }),
  procedural_beach_driftwood: assetSourceMetadata({
    id: "procedural_beach_driftwood",
    family: AMBIENT_BEACH_FINDS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small bounded pool of shared-geometry driftwood pieces for passive shoreline dressing."
  }),
  procedural_tiny_beach_finds: assetSourceMetadata({
    id: "procedural_tiny_beach_finds",
    family: AMBIENT_BEACH_FINDS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Instanced pebbles and sea-glass-like colored bits kept passive and decorative."
  }),
  procedural_food_crumb_marker: assetSourceMetadata({
    id: "procedural_food_crumb_marker",
    family: AMBIENT_BEACH_FINDS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Tiny passive crumb marker for beach-find readability; does not add feeding mechanics."
  }),
  procedural_recurring_animal_visitor: assetSourceMetadata({
    id: "procedural_recurring_animal_visitor",
    family: AMBIENT_BEACH_FINDS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Single harmless low-poly visitor placeholder; decorative only with no AI or behavior loop."
  }),
  procedural_ambient_bird_marker: assetSourceMetadata({
    id: "procedural_ambient_bird_marker",
    family: AMBIENT_BEACH_FINDS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small pooled V-shaped bird activity markers; no flocking, particles, or bird system changes."
  }),
  procedural_ambient_fish_marker: assetSourceMetadata({
    id: "procedural_ambient_fish_marker",
    family: AMBIENT_BEACH_FINDS_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small pooled fish activity silhouettes near the shoreline; does not alter fishing or ocean systems."
  }),
  procedural_pier_posts: assetSourceMetadata({
    id: "procedural_pier_posts",
    family: PIER_SHORE_WORK_SITE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly partial pier posts built from shared cylinder primitives; visual-only shore work site."
  }),
  procedural_pier_planks: assetSourceMetadata({
    id: "procedural_pier_planks",
    family: PIER_SHORE_WORK_SITE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small shared box-plank pool for readable partial pier decking."
  }),
  procedural_pier_lashings: assetSourceMetadata({
    id: "procedural_pier_lashings",
    family: PIER_SHORE_WORK_SITE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Rope/vine lashing bands made from simple torus/cylinder primitives."
  }),
  procedural_shore_work_marker: assetSourceMetadata({
    id: "procedural_shore_work_marker",
    family: PIER_SHORE_WORK_SITE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Passive shore work marker stakes/flag for Day 41-45 pier staging."
  }),
  procedural_safe_water_edge_build_site: assetSourceMetadata({
    id: "procedural_safe_water_edge_build_site",
    family: PIER_SHORE_WORK_SITE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Safe land-side water-edge build-site marker; does not create movement or terrain constraints."
  }),
  procedural_pier_fishing_slot_marker: assetSourceMetadata({
    id: "procedural_pier_fishing_slot_marker",
    family: PIER_SHORE_WORK_SITE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Visual pier fishing slot cue only; does not modify fishing target logic."
  }),
  procedural_raft_frame_logs: assetSourceMetadata({
    id: "procedural_raft_frame_logs",
    family: RAFT_BOAT_ROUTE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Low-poly raft frame/log bundle using shared cylinder primitives; visual-only placeholder."
  }),
  procedural_raft_tied_platform: assetSourceMetadata({
    id: "procedural_raft_tied_platform",
    family: RAFT_BOAT_ROUTE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Simple tied raft platform planks and rope bands; no build mechanics."
  }),
  procedural_raft_paddle_oar: assetSourceMetadata({
    id: "procedural_raft_paddle_oar",
    family: RAFT_BOAT_ROUTE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Readable low-poly paddle/oar prop; decorative only."
  }),
  procedural_raft_on_water_state: assetSourceMetadata({
    id: "procedural_raft_on_water_state",
    family: RAFT_BOAT_ROUTE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Raft-on-water visual state marker; does not create vehicle, boarding, rowing, or travel mechanics."
  }),
  procedural_raft_wake_marker: assetSourceMetadata({
    id: "procedural_raft_wake_marker",
    family: RAFT_BOAT_ROUTE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Small translucent wake strokes for route previews; no particle or route simulation."
  }),
  procedural_raft_route_marker: assetSourceMetadata({
    id: "procedural_raft_route_marker",
    family: RAFT_BOAT_ROUTE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Passive route marker buoys/chevrons for future travel affordance; visual-only."
  }),
  procedural_raft_return_landing_marker: assetSourceMetadata({
    id: "procedural_raft_return_landing_marker",
    family: RAFT_BOAT_ROUTE_FAMILY,
    sourceType: "procedural",
    path: null,
    license: "not needed; procedural primitives generated in Bubble Boy",
    author: "Bubble Boy",
    sourceUrl: null,
    attributionRequired: false,
    commercialUseAllowed: true,
    approvedForUse: true,
    fileFormat: "procedural",
    notes: "Return landing spot marker using simple ground ring/flag primitives; no landing mechanics."
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
  },
  foodRoutineCluster: {
    id: "foodRoutineCluster",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "cook-zone-center",
    anchorPoint: "fire-pit",
    attachPoint: "world",
    bounds: { radius: 2.20, height: 1.18 },
    cameraReadabilityDistance: 12
  },
  foodCookPot: {
    id: "foodCookPot",
    scale: [1, 1, 1],
    rotation: [0, 0.12, 0],
    groundOffset: 0.05,
    centerOrigin: "pot-base",
    anchorPoint: "fire-pit",
    attachPoint: "world",
    bounds: { radius: 0.44, height: 0.48 },
    cameraReadabilityDistance: 9
  },
  foodBasket: {
    id: "foodBasket",
    scale: [1, 1, 1],
    rotation: [0, -0.24, 0],
    groundOffset: 0.04,
    centerOrigin: "basket-base",
    anchorPoint: "cook-zone",
    attachPoint: "world",
    bounds: { radius: 0.46, height: 0.34 },
    cameraReadabilityDistance: 10
  },
  storedMeals: {
    id: "storedMeals",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0.05,
    centerOrigin: "meal-stack-base",
    anchorPoint: "cook-zone",
    attachPoint: "world",
    bounds: { radius: 0.52, height: 0.38 },
    cameraReadabilityDistance: 10
  },
  dryingRack: {
    id: "dryingRack",
    scale: [1, 1, 1],
    rotation: [0, -0.34, 0],
    groundOffset: 0.04,
    centerOrigin: "rack-feet",
    anchorPoint: "cook-zone",
    attachPoint: "world",
    bounds: { radius: 0.82, height: 1.12 },
    cameraReadabilityDistance: 12
  },
  fishHarvestDisplay: {
    id: "fishHarvestDisplay",
    scale: [1, 1, 1],
    rotation: [0, 0.28, 0],
    groundOffset: 0.035,
    centerOrigin: "display-mat",
    anchorPoint: "cook-zone",
    attachPoint: "world",
    bounds: { radius: 0.70, height: 0.24 },
    cameraReadabilityDistance: 10
  },
  leftoversBowl: {
    id: "leftoversBowl",
    scale: [1, 1, 1],
    rotation: [0, -0.08, 0],
    groundOffset: 0.045,
    centerOrigin: "bowl-base",
    anchorPoint: "cook-zone",
    attachPoint: "world",
    bounds: { radius: 0.34, height: 0.22 },
    cameraReadabilityDistance: 9
  },
  fishTrapRoutineCluster: {
    id: "fishTrapRoutineCluster",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "shoreline-trap-cluster",
    anchorPoint: "south-shoreline-trap",
    attachPoint: "world",
    bounds: { radius: 3.40, height: 1.34 },
    cameraReadabilityDistance: 14
  },
  fishTrapCrabPot: {
    id: "fishTrapCrabPot",
    scale: [1, 1, 1],
    rotation: [0, -0.18, 0],
    groundOffset: 0.045,
    centerOrigin: "trap-base",
    anchorPoint: "shoreline-trap",
    attachPoint: "world",
    bounds: { radius: 0.62, height: 0.54 },
    cameraReadabilityDistance: 11
  },
  fishTrapBuoyMarker: {
    id: "fishTrapBuoyMarker",
    scale: [1, 1, 1],
    rotation: [0, 0.20, 0],
    groundOffset: 0.10,
    centerOrigin: "buoy-center",
    anchorPoint: "trap-buoy-waterline",
    attachPoint: "world",
    bounds: { radius: 0.36, height: 0.72 },
    cameraReadabilityDistance: 12
  },
  fishTrapRopeLine: {
    id: "fishTrapRopeLine",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.055,
    centerOrigin: "line-midpoint",
    anchorPoint: "trap-to-buoy",
    attachPoint: "world",
    bounds: { radius: 1.55, height: 0.06 },
    cameraReadabilityDistance: 12
  },
  fishTrapStateCue: {
    id: "fishTrapStateCue",
    scale: [1, 1, 1],
    rotation: [0, 0.12, 0],
    groundOffset: 0.065,
    centerOrigin: "cue-base",
    anchorPoint: "shoreline-trap",
    attachPoint: "world",
    bounds: { radius: 0.42, height: 0.62 },
    cameraReadabilityDistance: 11
  },
  fishTrapDryingRack: {
    id: "fishTrapDryingRack",
    scale: [1, 1, 1],
    rotation: [0, -0.28, 0],
    groundOffset: 0.035,
    centerOrigin: "rack-feet",
    anchorPoint: "trap-drying-shore",
    attachPoint: "world",
    bounds: { radius: 0.86, height: 1.24 },
    cameraReadabilityDistance: 12
  },
  fishTrapCatchDisplay: {
    id: "fishTrapCatchDisplay",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0.04,
    centerOrigin: "catch-display-mat",
    anchorPoint: "trap-catch-display",
    attachPoint: "world",
    bounds: { radius: 0.72, height: 0.28 },
    cameraReadabilityDistance: 10
  },
  toyPlaySetCluster: {
    id: "toyPlaySetCluster",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "toy-play-center",
    anchorPoint: "toy-buildable-sidecar",
    attachPoint: "world",
    bounds: { radius: 2.45, height: 1.86 },
    cameraReadabilityDistance: 10
  },
  toyCollectionSlots: {
    id: "toyCollectionSlots",
    scale: [1, 1, 1],
    rotation: [0, -0.18, 0],
    groundOffset: 0.04,
    centerOrigin: "toy-slot-tray-base",
    anchorPoint: "toy-display-tray",
    attachPoint: "world",
    bounds: { radius: 0.76, height: 0.36 },
    cameraReadabilityDistance: 8
  },
  toyBlocksDisplay: {
    id: "toyBlocksDisplay",
    scale: [1, 1, 1],
    rotation: [0, 0.20, 0],
    groundOffset: 0.04,
    centerOrigin: "toy-blocks-scatter",
    anchorPoint: "existing-toy-blocks-sidecar",
    attachPoint: "world",
    bounds: { radius: 0.82, height: 0.58 },
    cameraReadabilityDistance: 8
  },
  toyBall: {
    id: "toyBall",
    scale: [1, 1, 1],
    rotation: [0, -0.10, 0],
    groundOffset: 0.18,
    centerOrigin: "toy-ball-center",
    anchorPoint: "play-mat",
    attachPoint: "world",
    bounds: { radius: 0.24, height: 0.36 },
    cameraReadabilityDistance: 7
  },
  toyKite: {
    id: "toyKite",
    scale: [1, 1, 1],
    rotation: [0, 0.12, 0],
    groundOffset: 0.04,
    centerOrigin: "kite-string-handle",
    anchorPoint: "toy-kite-marker",
    attachPoint: "world",
    bounds: { radius: 1.08, height: 1.70 },
    cameraReadabilityDistance: 11
  },
  toySpinningTop: {
    id: "toySpinningTop",
    scale: [1, 1, 1],
    rotation: [0, 0.32, 0],
    groundOffset: 0.08,
    centerOrigin: "spinning-top-tip",
    anchorPoint: "play-mat",
    attachPoint: "world",
    bounds: { radius: 0.22, height: 0.32 },
    cameraReadabilityDistance: 7
  },
  toyPlayMat: {
    id: "toyPlayMat",
    scale: [1, 1, 1],
    rotation: [0, 0.06, 0],
    groundOffset: 0.018,
    centerOrigin: "mat-center",
    anchorPoint: "toy-play-center",
    attachPoint: "world",
    bounds: { radius: 1.25, height: 0.06 },
    cameraReadabilityDistance: 8
  },
  musicArtDecorCluster: {
    id: "musicArtDecorCluster",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "music-art-decor-center",
    anchorPoint: "camp-performance-nook",
    attachPoint: "world",
    bounds: { radius: 2.30, height: 1.70 },
    cameraReadabilityDistance: 10
  },
  shellChime: {
    id: "shellChime",
    scale: [1, 1, 1],
    rotation: [0, -0.14, 0],
    groundOffset: 0.04,
    centerOrigin: "shell-chime-stand-base",
    anchorPoint: "hanging-decor-branch",
    attachPoint: "world",
    bounds: { radius: 0.70, height: 1.46 },
    cameraReadabilityDistance: 10
  },
  paintedStoneCluster: {
    id: "paintedStoneCluster",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0.025,
    centerOrigin: "painted-stone-cluster",
    anchorPoint: "camp-performance-nook",
    attachPoint: "world",
    bounds: { radius: 0.76, height: 0.16 },
    cameraReadabilityDistance: 7
  },
  drumFluteDisplay: {
    id: "drumFluteDisplay",
    scale: [1, 1, 1],
    rotation: [0, -0.28, 0],
    groundOffset: 0.04,
    centerOrigin: "instrument-display-base",
    anchorPoint: "camp-performance-nook",
    attachPoint: "world",
    bounds: { radius: 0.78, height: 0.42 },
    cameraReadabilityDistance: 8
  },
  hangingDecoration: {
    id: "hangingDecoration",
    scale: [1, 1, 1],
    rotation: [0, 0.16, 0],
    groundOffset: 0.04,
    centerOrigin: "hanging-decoration-base",
    anchorPoint: "hanging-decor-branch",
    attachPoint: "world",
    bounds: { radius: 0.66, height: 1.34 },
    cameraReadabilityDistance: 10
  },
  artDisplaySlot: {
    id: "artDisplaySlot",
    scale: [1, 1, 1],
    rotation: [0, 0.24, 0],
    groundOffset: 0.04,
    centerOrigin: "art-display-feet",
    anchorPoint: "camp-art-display",
    attachPoint: "world",
    bounds: { radius: 0.58, height: 0.82 },
    cameraReadabilityDistance: 8
  },
  duskPerformanceMarker: {
    id: "duskPerformanceMarker",
    scale: [1, 1, 1],
    rotation: [0, -0.08, 0],
    groundOffset: 0.025,
    centerOrigin: "performance-marker-ring",
    anchorPoint: "camp-performance-marker",
    attachPoint: "world",
    bounds: { radius: 0.94, height: 0.42 },
    cameraReadabilityDistance: 9
  },
  staticMusicNoteMarker: {
    id: "staticMusicNoteMarker",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.20,
    centerOrigin: "static-note-marker-center",
    anchorPoint: "camp-performance-marker",
    attachPoint: "world",
    bounds: { radius: 1.20, height: 0.86 },
    cameraReadabilityDistance: 10
  },
  animalFamiliarVisitorCluster: {
    id: "animalFamiliarVisitorCluster",
    scale: [1, 1, 1],
    rotation: [0, -0.10, 0],
    groundOffset: 0,
    centerOrigin: "animal-familiar-visitor-center",
    anchorPoint: "shore-visitor-safe-margin",
    attachPoint: "world",
    bounds: { radius: 3.05, height: 1.24 },
    cameraReadabilityDistance: 11
  },
  animalFamiliarGroundVisitor: {
    id: "animalFamiliarGroundVisitor",
    scale: [1, 1, 1],
    rotation: [0, -0.18, 0],
    groundOffset: 0.04,
    centerOrigin: "animal-familiar-ground-shadow",
    anchorPoint: "shore-visitor-safe-margin",
    attachPoint: "world",
    bounds: { radius: 0.58, height: 0.34 },
    cameraReadabilityDistance: 8
  },
  animalFamiliarBirdVisitor: {
    id: "animalFamiliarBirdVisitor",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0.56,
    centerOrigin: "animal-familiar-bird-center",
    anchorPoint: "shore-visitor-air",
    attachPoint: "world",
    bounds: { radius: 0.76, height: 0.42 },
    cameraReadabilityDistance: 10
  },
  animalFamiliarFishVisitor: {
    id: "animalFamiliarFishVisitor",
    scale: [1, 1, 1],
    rotation: [0, -0.22, 0],
    groundOffset: 0.06,
    centerOrigin: "animal-familiar-fish-center",
    anchorPoint: "shore-visitor-waterline",
    attachPoint: "world",
    bounds: { radius: 0.82, height: 0.22 },
    cameraReadabilityDistance: 10
  },
  animalFamiliarFoodCrumbs: {
    id: "animalFamiliarFoodCrumbs",
    scale: [1, 1, 1],
    rotation: [0, 0.20, 0],
    groundOffset: 0.026,
    centerOrigin: "animal-familiar-crumb-plate",
    anchorPoint: "shore-visitor-feed-marker",
    attachPoint: "world",
    bounds: { radius: 0.52, height: 0.14 },
    cameraReadabilityDistance: 7
  },
  animalFamiliarObserveRing: {
    id: "animalFamiliarObserveRing",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.018,
    centerOrigin: "animal-familiar-observe-ring",
    anchorPoint: "shore-visitor-safe-margin",
    attachPoint: "world",
    bounds: { radius: 2.65, height: 0.04 },
    cameraReadabilityDistance: 12
  },
  animalFamiliarApproachMarkers: {
    id: "animalFamiliarApproachMarkers",
    scale: [1, 1, 1],
    rotation: [0, -0.16, 0],
    groundOffset: 0.025,
    centerOrigin: "animal-familiar-approach-path",
    anchorPoint: "shore-visitor-approach",
    attachPoint: "world",
    bounds: { radius: 1.10, height: 0.10 },
    cameraReadabilityDistance: 9
  },
  nightComfortLightsCluster: {
    id: "nightComfortLightsCluster",
    scale: [1, 1, 1],
    rotation: [0, 0.10, 0],
    groundOffset: 0,
    centerOrigin: "night-comfort-cluster-center",
    anchorPoint: "camp-night-path",
    attachPoint: "world",
    bounds: { radius: 3.45, height: 1.35 },
    cameraReadabilityDistance: 11
  },
  nightLanternPost: {
    id: "nightLanternPost",
    scale: [1, 1, 1],
    rotation: [0, -0.12, 0],
    groundOffset: 0.04,
    centerOrigin: "lantern-post-base",
    anchorPoint: "camp-night-path",
    attachPoint: "world",
    bounds: { radius: 0.46, height: 1.22 },
    cameraReadabilityDistance: 9
  },
  nightLitPathAnchor: {
    id: "nightLitPathAnchor",
    scale: [1, 1, 1],
    rotation: [0, 0.08, 0],
    groundOffset: 0.025,
    centerOrigin: "lit-path-anchor-center",
    anchorPoint: "camp-night-path",
    attachPoint: "world",
    bounds: { radius: 1.60, height: 0.12 },
    cameraReadabilityDistance: 9
  },
  nightGlowingShells: {
    id: "nightGlowingShells",
    scale: [1, 1, 1],
    rotation: [0, -0.16, 0],
    groundOffset: 0.025,
    centerOrigin: "glowing-shell-cluster",
    anchorPoint: "camp-night-shells",
    attachPoint: "world",
    bounds: { radius: 1.18, height: 0.16 },
    cameraReadabilityDistance: 8
  },
  nightDeterministicFireflies: {
    id: "nightDeterministicFireflies",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.34,
    centerOrigin: "firefly-cluster-center",
    anchorPoint: "camp-night-air",
    attachPoint: "world",
    bounds: { radius: 1.36, height: 1.10 },
    cameraReadabilityDistance: 10
  },
  nightSitLightAnchor: {
    id: "nightSitLightAnchor",
    scale: [1, 1, 1],
    rotation: [0, 0.16, 0],
    groundOffset: 0.026,
    centerOrigin: "sit-night-anchor-center",
    anchorPoint: "camp-night-sit-anchor",
    attachPoint: "world",
    bounds: { radius: 0.78, height: 0.24 },
    cameraReadabilityDistance: 8
  },
  lookoutMapHorizonCluster: {
    id: "lookoutMapHorizonCluster",
    scale: [1, 1, 1],
    rotation: [0, -0.18, 0],
    groundOffset: 0,
    centerOrigin: "lookout-map-horizon-center",
    anchorPoint: "north-lookout-rise",
    attachPoint: "world",
    bounds: { radius: 4.30, height: 2.20 },
    cameraReadabilityDistance: 14
  },
  lookoutPlatform: {
    id: "lookoutPlatform",
    scale: [1, 1, 1],
    rotation: [0, -0.12, 0],
    groundOffset: 0.04,
    centerOrigin: "lookout-platform-feet",
    anchorPoint: "north-lookout-rise",
    attachPoint: "world",
    bounds: { radius: 1.40, height: 1.38 },
    cameraReadabilityDistance: 11
  },
  lookoutMapBoard: {
    id: "lookoutMapBoard",
    scale: [1, 1, 1],
    rotation: [0, 0.20, 0],
    groundOffset: 0.04,
    centerOrigin: "lookout-map-board-feet",
    anchorPoint: "north-lookout-map-board",
    attachPoint: "world",
    bounds: { radius: 0.92, height: 1.40 },
    cameraReadabilityDistance: 9
  },
  lookoutSketchMap: {
    id: "lookoutSketchMap",
    scale: [1, 1, 1],
    rotation: [0, 0.08, 0],
    groundOffset: 0.06,
    centerOrigin: "lookout-sketch-map",
    anchorPoint: "north-lookout-map-board",
    attachPoint: "world",
    bounds: { radius: 0.70, height: 0.18 },
    cameraReadabilityDistance: 8
  },
  lookoutHorizonMarker: {
    id: "lookoutHorizonMarker",
    scale: [1, 1, 1],
    rotation: [0, -0.26, 0],
    groundOffset: 0.04,
    centerOrigin: "lookout-horizon-marker-line",
    anchorPoint: "north-lookout-horizon",
    attachPoint: "world",
    bounds: { radius: 2.10, height: 0.90 },
    cameraReadabilityDistance: 14
  },
  lookoutKeepsakeDisplay: {
    id: "lookoutKeepsakeDisplay",
    scale: [1, 1, 1],
    rotation: [0, 0.16, 0],
    groundOffset: 0.04,
    centerOrigin: "lookout-keepsake-shelf",
    anchorPoint: "north-lookout-keepsakes",
    attachPoint: "world",
    bounds: { radius: 0.76, height: 0.38 },
    cameraReadabilityDistance: 8
  },
  lookoutDay100Gathering: {
    id: "lookoutDay100Gathering",
    scale: [1, 1, 1],
    rotation: [0, -0.08, 0],
    groundOffset: 0.04,
    centerOrigin: "lookout-day100-gathering-ring",
    anchorPoint: "north-lookout-gathering",
    attachPoint: "world",
    bounds: { radius: 1.45, height: 0.60 },
    cameraReadabilityDistance: 11
  },
  majorProjectCapstoneCluster: {
    id: "majorProjectCapstoneCluster",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0,
    centerOrigin: "major-capstone-community-table-center",
    anchorPoint: "camp-community-table",
    attachPoint: "world",
    bounds: { radius: 2.85, height: 1.24 },
    cameraReadabilityDistance: 11
  },
  capstoneCommunityTableSupplies: {
    id: "capstoneCommunityTableSupplies",
    scale: [1, 1, 1],
    rotation: [0, -0.12, 0],
    groundOffset: 0.04,
    centerOrigin: "capstone-supply-pile",
    anchorPoint: "camp-community-table",
    attachPoint: "world",
    bounds: { radius: 1.20, height: 0.42 },
    cameraReadabilityDistance: 8
  },
  capstoneCommunityTableBuild: {
    id: "capstoneCommunityTableBuild",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0.04,
    centerOrigin: "capstone-community-table-frame",
    anchorPoint: "camp-community-table",
    attachPoint: "world",
    bounds: { radius: 1.70, height: 0.82 },
    cameraReadabilityDistance: 9
  },
  capstoneCommunityTableSettings: {
    id: "capstoneCommunityTableSettings",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.42,
    centerOrigin: "capstone-table-place-settings",
    anchorPoint: "camp-community-table",
    attachPoint: "world",
    bounds: { radius: 1.22, height: 0.20 },
    cameraReadabilityDistance: 8
  },
  capstoneCommunityTableCelebration: {
    id: "capstoneCommunityTableCelebration",
    scale: [1, 1, 1],
    rotation: [0, -0.10, 0],
    groundOffset: 0.04,
    centerOrigin: "capstone-community-celebration-detail",
    anchorPoint: "camp-community-table-celebration",
    attachPoint: "world",
    bounds: { radius: 1.30, height: 0.72 },
    cameraReadabilityDistance: 9
  },
  ambientBeachFindsCluster: {
    id: "ambientBeachFindsCluster",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "shoreline-cluster-center",
    anchorPoint: "south-shoreline",
    attachPoint: "world",
    bounds: { radius: 3.80, height: 1.20 },
    cameraReadabilityDistance: 13
  },
  beachShells: {
    id: "beachShells",
    scale: [1, 1, 1],
    rotation: [0, -0.12, 0],
    groundOffset: 0.025,
    centerOrigin: "shell-scatter-center",
    anchorPoint: "shoreline",
    attachPoint: "world",
    bounds: { radius: 1.28, height: 0.16 },
    cameraReadabilityDistance: 8
  },
  beachDriftwood: {
    id: "beachDriftwood",
    scale: [1, 1, 1],
    rotation: [0, 0.34, 0],
    groundOffset: 0.045,
    centerOrigin: "wood-base",
    anchorPoint: "shoreline",
    attachPoint: "world",
    bounds: { radius: 1.20, height: 0.22 },
    cameraReadabilityDistance: 10
  },
  tinyBeachFinds: {
    id: "tinyBeachFinds",
    scale: [1, 1, 1],
    rotation: [0, 0.08, 0],
    groundOffset: 0.02,
    centerOrigin: "find-scatter-center",
    anchorPoint: "shoreline",
    attachPoint: "world",
    bounds: { radius: 1.10, height: 0.12 },
    cameraReadabilityDistance: 8
  },
  foodCrumbMarker: {
    id: "foodCrumbMarker",
    scale: [1, 1, 1],
    rotation: [0, -0.26, 0],
    groundOffset: 0.025,
    centerOrigin: "crumb-marker-base",
    anchorPoint: "shoreline",
    attachPoint: "world",
    bounds: { radius: 0.42, height: 0.12 },
    cameraReadabilityDistance: 7
  },
  animalVisitor: {
    id: "animalVisitor",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0.05,
    centerOrigin: "visitor-base",
    anchorPoint: "shoreline",
    attachPoint: "world",
    bounds: { radius: 0.58, height: 0.36 },
    cameraReadabilityDistance: 9
  },
  ambientBirdMarker: {
    id: "ambientBirdMarker",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.95,
    centerOrigin: "bird-v-center",
    anchorPoint: "shoreline-air",
    attachPoint: "world",
    bounds: { radius: 0.48, height: 0.24 },
    cameraReadabilityDistance: 12
  },
  ambientFishMarker: {
    id: "ambientFishMarker",
    scale: [1, 1, 1],
    rotation: [0, -0.20, 0],
    groundOffset: 0.08,
    centerOrigin: "fish-marker-center",
    anchorPoint: "shoreline-waterline",
    attachPoint: "world",
    bounds: { radius: 0.42, height: 0.20 },
    cameraReadabilityDistance: 10
  },
  pierShoreWorkSiteCluster: {
    id: "pierShoreWorkSiteCluster",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "shore-work-center",
    anchorPoint: "south-shoreline-land-side",
    attachPoint: "world",
    bounds: { radius: 3.10, height: 1.28 },
    cameraReadabilityDistance: 13
  },
  pierPosts: {
    id: "pierPosts",
    scale: [1, 1, 1],
    rotation: [0, 0.04, 0],
    groundOffset: 0.04,
    centerOrigin: "post-base",
    anchorPoint: "shoreline",
    attachPoint: "world",
    bounds: { radius: 1.50, height: 1.18 },
    cameraReadabilityDistance: 11
  },
  pierPlanks: {
    id: "pierPlanks",
    scale: [1, 1, 1],
    rotation: [0, -0.04, 0],
    groundOffset: 0.34,
    centerOrigin: "plank-deck-center",
    anchorPoint: "shoreline",
    attachPoint: "world",
    bounds: { radius: 1.65, height: 0.28 },
    cameraReadabilityDistance: 11
  },
  pierLashings: {
    id: "pierLashings",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0.40,
    centerOrigin: "lashing-band",
    anchorPoint: "pier-post",
    attachPoint: "world",
    bounds: { radius: 1.52, height: 0.38 },
    cameraReadabilityDistance: 9
  },
  shoreWorkMarker: {
    id: "shoreWorkMarker",
    scale: [1, 1, 1],
    rotation: [0, 0.18, 0],
    groundOffset: 0.04,
    centerOrigin: "marker-base",
    anchorPoint: "land-side-shore",
    attachPoint: "world",
    bounds: { radius: 0.56, height: 0.70 },
    cameraReadabilityDistance: 9
  },
  safeWaterEdgeBuildSite: {
    id: "safeWaterEdgeBuildSite",
    scale: [1, 1, 1],
    rotation: [0, -0.12, 0],
    groundOffset: 0.035,
    centerOrigin: "safe-build-ring",
    anchorPoint: "land-side-safe-build-site",
    attachPoint: "world",
    bounds: { radius: 0.86, height: 0.18 },
    cameraReadabilityDistance: 10
  },
  pierFishingSlotMarker: {
    id: "pierFishingSlotMarker",
    scale: [1, 1, 1],
    rotation: [0, 0.28, 0],
    groundOffset: 0.14,
    centerOrigin: "slot-marker-center",
    anchorPoint: "visual-water-edge",
    attachPoint: "world",
    bounds: { radius: 0.48, height: 0.44 },
    cameraReadabilityDistance: 10
  },
  raftBoatRouteCluster: {
    id: "raftBoatRouteCluster",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    groundOffset: 0,
    centerOrigin: "raft-route-center",
    anchorPoint: "south-shoreline-water-edge",
    attachPoint: "world",
    bounds: { radius: 4.20, height: 0.82 },
    cameraReadabilityDistance: 14
  },
  raftFrameLogs: {
    id: "raftFrameLogs",
    scale: [1, 1, 1],
    rotation: [0, -0.10, 0],
    groundOffset: 0.12,
    centerOrigin: "raft-log-frame-center",
    anchorPoint: "shoreline-build-side",
    attachPoint: "world",
    bounds: { radius: 1.45, height: 0.32 },
    cameraReadabilityDistance: 12
  },
  raftTiedPlatform: {
    id: "raftTiedPlatform",
    scale: [1, 1, 1],
    rotation: [0, -0.10, 0],
    groundOffset: 0.18,
    centerOrigin: "raft-platform-center",
    anchorPoint: "shoreline-build-side",
    attachPoint: "world",
    bounds: { radius: 1.56, height: 0.26 },
    cameraReadabilityDistance: 12
  },
  raftPaddleOar: {
    id: "raftPaddleOar",
    scale: [1, 1, 1],
    rotation: [0.10, -0.36, -0.06],
    groundOffset: 0.16,
    centerOrigin: "paddle-grip-center",
    anchorPoint: "raft-side",
    attachPoint: "world",
    bounds: { radius: 0.82, height: 0.20 },
    cameraReadabilityDistance: 10
  },
  raftOnWaterState: {
    id: "raftOnWaterState",
    scale: [1, 1, 1],
    rotation: [0, -0.22, 0],
    groundOffset: 0.02,
    centerOrigin: "floating-raft-center",
    anchorPoint: "visual-waterline",
    attachPoint: "world",
    bounds: { radius: 1.78, height: 0.36 },
    cameraReadabilityDistance: 13
  },
  raftWakeMarker: {
    id: "raftWakeMarker",
    scale: [1, 1, 1],
    rotation: [0, -0.22, 0],
    groundOffset: 0.01,
    centerOrigin: "wake-stroke-center",
    anchorPoint: "visual-waterline",
    attachPoint: "world",
    bounds: { radius: 2.10, height: 0.06 },
    cameraReadabilityDistance: 13
  },
  raftRouteMarker: {
    id: "raftRouteMarker",
    scale: [1, 1, 1],
    rotation: [0, -0.34, 0],
    groundOffset: 0.04,
    centerOrigin: "route-marker-center",
    anchorPoint: "route-preview-waterline",
    attachPoint: "world",
    bounds: { radius: 2.60, height: 0.42 },
    cameraReadabilityDistance: 14
  },
  raftReturnLandingMarker: {
    id: "raftReturnLandingMarker",
    scale: [1, 1, 1],
    rotation: [0, 0.16, 0],
    groundOffset: 0.035,
    centerOrigin: "landing-ring-center",
    anchorPoint: "return-landing-land-side",
    attachPoint: "world",
    bounds: { radius: 0.86, height: 0.60 },
    cameraReadabilityDistance: 11
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
  }),
  foodRoutine: visualFamily({
    id: FOOD_ROUTINE_ID,
    propFamily: FOOD_ROUTINE_FAMILY,
    anchorType: "campArea",
    anchorId: "cook-zone",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_cook_pot,
    transform: VISUAL_TRANSFORM_REGISTRY.foodRoutineCluster,
    notes: "Procedural food-routine prop cluster for Days 31-35 and 56-60."
  }),
  fishTrapRoutine: visualFamily({
    id: FISH_TRAP_ROUTINE_ID,
    propFamily: FISH_TRAP_ROUTINE_FAMILY,
    anchorType: "shoreWaterline",
    anchorId: "south-shoreline-trap",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_crab_pot,
    transform: VISUAL_TRANSFORM_REGISTRY.fishTrapRoutineCluster,
    notes: "Procedural fish trap/crab pot, buoy, line, state cues, drying rack, and catch-display placeholders for Days 56-60."
  }),
  toyPlaySet: visualFamily({
    id: TOY_PLAY_SET_ID,
    propFamily: TOY_PLAY_SET_FAMILY,
    anchorType: "buildableSlot",
    anchorId: BUILDABLE_IDS.toyBlocks,
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_collection_slots,
    transform: VISUAL_TRANSFORM_REGISTRY.toyPlaySetCluster,
    notes: "Procedural toy play set sidecar for Days 61-65; extends the existing toy-block buildable presentation without new gameplay systems."
  }),
  musicArtDecor: visualFamily({
    id: MUSIC_ART_DECOR_ID,
    propFamily: MUSIC_ART_DECOR_FAMILY,
    anchorType: "campArea",
    anchorId: "camp-performance-nook",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_shell_chime,
    transform: VISUAL_TRANSFORM_REGISTRY.musicArtDecorCluster,
    notes: "Procedural shell chime, painted stones, instrument, hanging decor, art slot, dusk marker, and static note markers for Days 66-70."
  }),
  animalFamiliarVisitor: visualFamily({
    id: ANIMAL_FAMILIAR_VISITOR_ID,
    propFamily: ANIMAL_FAMILIAR_VISITOR_FAMILY,
    anchorType: "shore",
    anchorId: "shore-visitor-safe-margin",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_ground_visitor,
    transform: VISUAL_TRANSFORM_REGISTRY.animalFamiliarVisitorCluster,
    notes: "Procedural harmless animal familiar visitor, bird/fish variants, crumb marker, observe ring, and approach markers for Days 71-75."
  }),
  nightComfortLights: visualFamily({
    id: NIGHT_COMFORT_LIGHTS_ID,
    propFamily: NIGHT_COMFORT_LIGHTS_FAMILY,
    anchorType: "campPath",
    anchorId: "camp-night-path",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_night_lantern_post,
    transform: VISUAL_TRANSFORM_REGISTRY.nightComfortLightsCluster,
    notes: "Procedural emissive lantern posts, lit path anchors, glowing shells, bounded fireflies, and sit-at-night anchors for Days 81-85."
  }),
  lookoutMapHorizon: visualFamily({
    id: LOOKOUT_MAP_HORIZON_ID,
    propFamily: LOOKOUT_MAP_HORIZON_FAMILY,
    anchorType: "lookout",
    anchorId: "north-lookout-rise",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_platform,
    transform: VISUAL_TRANSFORM_REGISTRY.lookoutMapHorizonCluster,
    notes: "Procedural lookout platform, shallow steps, map board, sketch props, horizon markers, keepsake display, and Day 100 gathering variant for Days 86-100."
  }),
  majorProjectCapstone: visualFamily({
    id: MAJOR_PROJECT_CAPSTONE_ID,
    propFamily: MAJOR_PROJECT_CAPSTONE_FAMILY,
    anchorType: "campProject",
    anchorId: "camp-community-table",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_supplies,
    transform: VISUAL_TRANSFORM_REGISTRY.majorProjectCapstoneCluster,
    notes: "Chosen capstone: procedural community table staged from supplies to complete display for Days 91-95; visual-only and not a buildable/resource system."
  }),
  ambientBeachFinds: visualFamily({
    id: AMBIENT_BEACH_FINDS_ID,
    propFamily: AMBIENT_BEACH_FINDS_FAMILY,
    anchorType: "shore",
    anchorId: "south-shoreline",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_beach_shells,
    transform: VISUAL_TRANSFORM_REGISTRY.ambientBeachFindsCluster,
    notes: "Procedural passive ambient beach/finds prop cluster for Days 36-40 and 71-75."
  }),
  pierShoreWorkSite: visualFamily({
    id: PIER_SHORE_WORK_SITE_ID,
    propFamily: PIER_SHORE_WORK_SITE_FAMILY,
    anchorType: "shore",
    anchorId: "south-shoreline-land-side",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_pier_posts,
    transform: VISUAL_TRANSFORM_REGISTRY.pierShoreWorkSiteCluster,
    notes: "Procedural passive pier shore work-site prop cluster for Days 41-45."
  }),
  raftBoatRoute: visualFamily({
    id: RAFT_BOAT_ROUTE_ID,
    propFamily: RAFT_BOAT_ROUTE_FAMILY,
    anchorType: "shoreWaterline",
    anchorId: "south-shoreline-water-route",
    defaultVisible: false,
    source: VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_frame_logs,
    transform: VISUAL_TRANSFORM_REGISTRY.raftBoatRouteCluster,
    notes: "Procedural passive raft/boat route prop cluster for Days 46-55 and 91-95."
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
  const foodRoutine = resolveFoodRoutineVisualState(worldState, selectedAction);
  const fishTrapRoutine = resolveFishTrapRoutineVisualState(worldState, selectedAction);
  const toyPlaySet = resolveToyPlaySetVisualState(worldState, selectedAction);
  const musicArtDecor = resolveMusicArtDecorVisualState(worldState, selectedAction);
  const animalFamiliarVisitor = resolveAnimalFamiliarVisitorVisualState(worldState, selectedAction);
  const nightComfortLights = resolveNightComfortLightsVisualState(worldState, selectedAction);
  const lookoutMapHorizon = resolveLookoutMapHorizonVisualState(worldState, selectedAction);
  const majorProjectCapstone = resolveMajorProjectCapstoneVisualState(worldState, selectedAction);
  const ambientBeachFinds = resolveAmbientBeachFindsVisualState(worldState, selectedAction);
  const pierShoreWorkSite = resolvePierShoreWorkSiteVisualState(worldState, selectedAction);
  const raftBoatRoute = resolveRaftBoatRouteVisualState(worldState, selectedAction);
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
      visible:
        selectedAction === "gatherLooseSupplies" ||
        selectedAction === "bendPickup" ||
        selectedAction === "pickupMaterial"
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
    }),
    descriptorForFamily("foodRoutine", {
      variant: foodRoutine.variant,
      stage: foodRoutine.stage,
      visible: foodRoutine.visible,
      active: foodRoutine.active,
      usable: foodRoutine.usable,
      source: foodRoutine.source,
      transform: foodRoutine.transform,
      stateHook: foodRoutine.stateHook,
      subProps: foodRoutine.subProps,
      debug: foodRoutine.debug
    }),
    descriptorForFamily("fishTrapRoutine", {
      variant: fishTrapRoutine.variant,
      stage: fishTrapRoutine.stage,
      visible: fishTrapRoutine.visible,
      active: fishTrapRoutine.active,
      usable: fishTrapRoutine.usable,
      source: fishTrapRoutine.source,
      transform: fishTrapRoutine.transform,
      stateHook: fishTrapRoutine.stateHook,
      subProps: fishTrapRoutine.subProps,
      debug: fishTrapRoutine.debug
    }),
    descriptorForFamily("toyPlaySet", {
      variant: toyPlaySet.variant,
      stage: toyPlaySet.stage,
      visible: toyPlaySet.visible,
      active: toyPlaySet.active,
      usable: toyPlaySet.usable,
      source: toyPlaySet.source,
      transform: toyPlaySet.transform,
      stateHook: toyPlaySet.stateHook,
      subProps: toyPlaySet.subProps,
      debug: toyPlaySet.debug
    }),
    descriptorForFamily("musicArtDecor", {
      variant: musicArtDecor.variant,
      stage: musicArtDecor.stage,
      visible: musicArtDecor.visible,
      active: musicArtDecor.active,
      usable: musicArtDecor.usable,
      source: musicArtDecor.source,
      transform: musicArtDecor.transform,
      stateHook: musicArtDecor.stateHook,
      subProps: musicArtDecor.subProps,
      debug: musicArtDecor.debug
    }),
    descriptorForFamily("animalFamiliarVisitor", {
      variant: animalFamiliarVisitor.variant,
      stage: animalFamiliarVisitor.stage,
      visible: animalFamiliarVisitor.visible,
      active: animalFamiliarVisitor.active,
      usable: animalFamiliarVisitor.usable,
      source: animalFamiliarVisitor.source,
      transform: animalFamiliarVisitor.transform,
      stateHook: animalFamiliarVisitor.stateHook,
      subProps: animalFamiliarVisitor.subProps,
      debug: animalFamiliarVisitor.debug
    }),
    descriptorForFamily("nightComfortLights", {
      variant: nightComfortLights.variant,
      stage: nightComfortLights.stage,
      visible: nightComfortLights.visible,
      active: nightComfortLights.active,
      usable: nightComfortLights.usable,
      source: nightComfortLights.source,
      transform: nightComfortLights.transform,
      stateHook: nightComfortLights.stateHook,
      subProps: nightComfortLights.subProps,
      debug: nightComfortLights.debug
    }),
    descriptorForFamily("lookoutMapHorizon", {
      variant: lookoutMapHorizon.variant,
      stage: lookoutMapHorizon.stage,
      visible: lookoutMapHorizon.visible,
      active: lookoutMapHorizon.active,
      usable: lookoutMapHorizon.usable,
      source: lookoutMapHorizon.source,
      transform: lookoutMapHorizon.transform,
      stateHook: lookoutMapHorizon.stateHook,
      subProps: lookoutMapHorizon.subProps,
      debug: lookoutMapHorizon.debug
    }),
    descriptorForFamily("majorProjectCapstone", {
      variant: majorProjectCapstone.variant,
      stage: majorProjectCapstone.stage,
      visible: majorProjectCapstone.visible,
      active: majorProjectCapstone.active,
      usable: majorProjectCapstone.usable,
      source: majorProjectCapstone.source,
      transform: majorProjectCapstone.transform,
      stateHook: majorProjectCapstone.stateHook,
      subProps: majorProjectCapstone.subProps,
      debug: majorProjectCapstone.debug
    }),
    descriptorForFamily("ambientBeachFinds", {
      variant: ambientBeachFinds.variant,
      stage: ambientBeachFinds.stage,
      visible: ambientBeachFinds.visible,
      active: ambientBeachFinds.active,
      usable: ambientBeachFinds.usable,
      source: ambientBeachFinds.source,
      transform: ambientBeachFinds.transform,
      stateHook: ambientBeachFinds.stateHook,
      subProps: ambientBeachFinds.subProps,
      debug: ambientBeachFinds.debug
    }),
    descriptorForFamily("pierShoreWorkSite", {
      variant: pierShoreWorkSite.variant,
      stage: pierShoreWorkSite.stage,
      visible: pierShoreWorkSite.visible,
      active: pierShoreWorkSite.active,
      usable: pierShoreWorkSite.usable,
      source: pierShoreWorkSite.source,
      transform: pierShoreWorkSite.transform,
      stateHook: pierShoreWorkSite.stateHook,
      subProps: pierShoreWorkSite.subProps,
      debug: pierShoreWorkSite.debug
    }),
    descriptorForFamily("raftBoatRoute", {
      variant: raftBoatRoute.variant,
      stage: raftBoatRoute.stage,
      visible: raftBoatRoute.visible,
      active: raftBoatRoute.active,
      usable: raftBoatRoute.usable,
      source: raftBoatRoute.source,
      transform: raftBoatRoute.transform,
      stateHook: raftBoatRoute.stateHook,
      subProps: raftBoatRoute.subProps,
      debug: raftBoatRoute.debug
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
  const cooking =
    isFireCookingPresentationAction(selectedAction) ||
    selectedAction === "pickupMaterial" ||
    fish.state === "raw" ||
    fish.state === "cooked";
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_campfire_firewood_cooking_surface;

  return {
    stage: lit ? "lit" : "unlit",
    variant: cooking ? "cookingSurface" : fireVariant(worldState),
    visible: firePit.visible === false ? false : true,
    active: isFireCarePresentationAction(selectedAction) || cooking,
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
    action === "sitRestSpot" ||
    action === "sitNearFire" ||
    action === "restInsideShelter" ||
    action === "settleIntoHammock" ||
    action === "settleIntoBed" ||
    action === "lieDown" ||
    action === "sleepLoop" ||
    action === "wake" ||
    action === "standUpFromRest" ||
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
    action === "sitRestSpot" ||
    action === "sitNearFire" ||
    action === "restInsideShelter" ||
    action === "settleIntoHammock" ||
    action === "settleIntoBed" ||
    action === "lieDown" ||
    action === "sleepLoop" ||
    action === "sleep" ||
    action === "wake" ||
    action === "wakeStretch" ||
    action === "standUpFromRest" ||
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
  const buildToolAttached = Boolean(attachment && attachment.id === "buildTool");
  const buildPlankAttached = Boolean(attachment && attachment.id === "buildPlank");
  const buildRopeAttached = Boolean(attachment && attachment.id === "buildRopeVines");
  const storageMaterialAttached = Boolean(attachment && attachment.id === "storageMaterial");
  const inspectingTool = Boolean(
    selectedAction === "inspectTool" ||
      toolInventory.inspectingTool === STONE_TOOL_ITEM_ID ||
      toolInventory.heldTool === STONE_TOOL_ITEM_ID ||
      (attachment && (attachment.id === "firstTool" || attachment.id === "buildTool"))
  );
  const hasStoneTool = Boolean(
    toolInventory.hasStoneTool ||
      toolInventory.inspectingTool === STONE_TOOL_ITEM_ID ||
      toolInventory.heldTool === STONE_TOOL_ITEM_ID ||
      buildToolAttached ||
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
    : isBuildTieCraftRepairAction(selectedAction)
      ? "buildRepairWorkbench"
    : isCampStorageSittingStorageAction(selectedAction)
      ? "campStorageSorting"
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
          buildToolAttached,
          buildPlankAttached,
          buildRopeAttached,
          storageMaterialAttached,
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
  if (selectedAction === "hammerStrike") return "hammering";
  if (selectedAction === "tieRopeVines") return "tying";
  if (selectedAction === "placePlank") return "placingPlank";
  if (selectedAction === "pushPostUpright") return "pushingPost";
  if (selectedAction === "carveTool") return "carving";
  if (selectedAction === "inspectProgress") return "inspectProgress";
  if (selectedAction === "repairShelter") return "repairing";
  if (selectedAction === "reinforceShelter") return "reinforcing";
  if (selectedAction === "sortMaterials") return "sorting";
  if (selectedAction === "depositStorage") return "depositStorage";
  if (selectedAction === "withdrawStorage") return "withdrawStorage";
  if (selectedAction === "tidyCamp") return "tidying";
  if (
    selectedAction === "depositMaterial" ||
    selectedAction === "depositMaterials" ||
    selectedAction === "setItemDown"
  ) return "depositing";
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
  return (
    isBuildTieCraftRepairAction(action) ||
    isCampStorageSittingStorageAction(action) ||
    action === "depositMaterial" ||
    action === "depositMaterials" ||
    action === "setItemDown" ||
    action === "craftAtWorkbench" ||
    action === "inspectTool"
  );
}

function isCampStorageSittingStorageAction(action) {
  return (
    action === "sortMaterials" ||
    action === "depositStorage" ||
    action === "withdrawStorage" ||
    action === "tidyCamp"
  );
}

function isBuildTieCraftRepairAction(action) {
  return (
    action === "hammerStrike" ||
    action === "tieRopeVines" ||
    action === "placePlank" ||
    action === "pushPostUpright" ||
    action === "carveTool" ||
    action === "inspectProgress" ||
    action === "repairShelter" ||
    action === "reinforceShelter"
  );
}

function isStorageWorkbenchToolsWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "depositMaterial" ||
    action === "depositMaterials" ||
    action === "setItemDown" ||
    isCampStorageSittingStorageAction(action) ||
    action === "craftAtWorkbench" ||
    action === "inspectTool" ||
    isBuildTieCraftRepairAction(action) ||
    action === "building" ||
    goal === "storage" ||
    goal === "craft" ||
    goal === "buildProject" ||
    goal === "repairShelter" ||
    goal === "reinforceShelter" ||
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
  return action === "rakePath" || action === "placeBoundaryStone" || action === "walkRoute" || action === "inspectCampLayout";
}

function isCampPathWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "rakePath" ||
    action === "placeBoundaryStone" ||
    action === "walkRoute" ||
    action === "inspectCampLayout" ||
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

function resolveFoodRoutineVisualState(worldState, selectedAction) {
  const state = worldState && worldState.foodRoutine ? worldState.foodRoutine : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_cook_pot;
  const visible = Boolean(state.visible);
  const active = Boolean(state.active || isFoodRoutinePresentationAction(selectedAction) || isFoodRoutineWorldStateActive(worldState));
  const basketStock = Math.max(0, Number(state.basketStock || 0));
  const mealCount = Math.max(0, Number(state.mealCount || 0));
  const driedFishCount = Math.max(0, Number(state.driedFishCount || 0));
  const harvestCount = Math.max(0, Number(state.harvestCount || 0));
  const leftoverCount = Math.max(0, Number(state.leftoverCount || 0));

  return {
    stage: visible ? state.stage || "prep" : active ? "active" : "none",
    variant: state.variant || "cookPrep",
    visible,
    active,
    usable: state.usable === false ? false : true,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.foodRoutineCluster,
    subProps: {
      cookSurface: foodRoutineSubProp(
        "cookSurface",
        state.cookSurfaceVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_cook_pot,
        VISUAL_TRANSFORM_REGISTRY.foodCookPot,
        "worldState.foodRoutine.cookSurfaceVisible",
        { count: state.cookSurfaceVisible ? 1 : 0 }
      ),
      foodBasket: foodRoutineSubProp(
        "foodBasket",
        state.basketVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_basket,
        VISUAL_TRANSFORM_REGISTRY.foodBasket,
        "worldState.foodRoutine.basketVisible",
        { count: state.basketVisible ? 1 : 0, itemCount: basketStock }
      ),
      storedMeals: foodRoutineSubProp(
        "storedMeals",
        state.storedMealsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_stored_meals,
        VISUAL_TRANSFORM_REGISTRY.storedMeals,
        "worldState.foodRoutine.storedMealsVisible",
        { count: mealCount }
      ),
      dryingRack: foodRoutineSubProp(
        "dryingRack",
        state.dryingRackVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_drying_rack,
        VISUAL_TRANSFORM_REGISTRY.dryingRack,
        "worldState.foodRoutine.dryingRackVisible",
        { count: driedFishCount }
      ),
      fishHarvestDisplay: foodRoutineSubProp(
        "fishHarvestDisplay",
        state.fishHarvestVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_fish_harvest_display,
        VISUAL_TRANSFORM_REGISTRY.fishHarvestDisplay,
        "worldState.foodRoutine.fishHarvestVisible",
        { count: harvestCount }
      ),
      leftovers: foodRoutineSubProp(
        "leftovers",
        state.leftoversVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_leftovers,
        VISUAL_TRANSFORM_REGISTRY.leftoversBowl,
        "worldState.foodRoutine.leftoversVisible",
        { count: leftoverCount }
      )
    },
    stateHook: {
      state: "worldState.foodRoutine",
      day: "worldState.time.day",
      action: "worldState.bubbleBoy.currentAction",
      inventoryFish: "worldState.bubbleBoy.inventory.fish.state",
      gardenPlots: "worldState.gardenPlots"
    },
    debug: {
      visualFamily: FOOD_ROUTINE_ID,
      visualVariant: state.variant || "cookPrep",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      basketStock,
      mealCount,
      driedFishCount,
      harvestCount,
      leftoverCount,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.foodRoutineCluster.id,
      duplicateSystemClassification: "new presentation-only prop family; does not alter cooking/fishing/garden mechanics",
      fallbackReason: visible ? "" : "outside Days 31-35/56-60 and no explicit foodRoutine state"
    }
  };
}

function foodRoutineSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when foodRoutine prop flag is false/missing",
    ...extra
  };
}

function resolveFishTrapRoutineVisualState(worldState, selectedAction) {
  const state = worldState && worldState.fishTrapRoutine ? worldState.fishTrapRoutine : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_crab_pot;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isFishTrapRoutinePresentationAction(selectedAction) ||
      isFishTrapRoutineWorldStateActive(worldState)
  );
  const trapCount = Math.max(0, Number(state.trapCount || 0));
  const buoyCount = Math.max(0, Number(state.buoyCount || 0));
  const lineCount = Math.max(0, Number(state.lineCount || 0));
  const stateCueCount = Math.max(0, Number(state.stateCueCount || 0));
  const dryingRackCount = Math.max(0, Number(state.dryingRackCount || 0));
  const catchDisplayCount = Math.max(0, Number(state.catchDisplayCount || 0));
  const fishCount = Math.max(0, Number(state.fishCount || 0));
  const crabCount = Math.max(0, Number(state.crabCount || 0));
  const dryingFishCount = Math.max(0, Number(state.dryingFishCount || 0));
  const trapState = state.trapState || state.stage || "unset";

  return {
    stage: visible ? state.stage || trapState : active ? "set" : "unset",
    variant: state.variant || "setLine",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.fishTrapRoutineCluster,
    subProps: {
      trap: fishTrapRoutineSubProp(
        "trap",
        state.trapVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_crab_pot,
        VISUAL_TRANSFORM_REGISTRY.fishTrapCrabPot,
        "worldState.fishTrapRoutine.trapVisible",
        { count: trapCount, fishCount, crabCount, trapState }
      ),
      buoy: fishTrapRoutineSubProp(
        "buoy",
        state.buoyVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_buoy_marker,
        VISUAL_TRANSFORM_REGISTRY.fishTrapBuoyMarker,
        "worldState.fishTrapRoutine.buoyVisible",
        { count: buoyCount, anchorPosition: state.buoyPosition || null }
      ),
      ropeLine: fishTrapRoutineSubProp(
        "ropeLine",
        state.lineVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_rope_line,
        VISUAL_TRANSFORM_REGISTRY.fishTrapRopeLine,
        "worldState.fishTrapRoutine.lineVisible",
        { count: lineCount, connects: ["worldState.fishTrapRoutine.anchorPosition", "worldState.fishTrapRoutine.buoyPosition"] }
      ),
      stateCues: fishTrapRoutineSubProp(
        "stateCues",
        state.stateCuesVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_state_cues,
        VISUAL_TRANSFORM_REGISTRY.fishTrapStateCue,
        "worldState.fishTrapRoutine.trapState",
        { count: stateCueCount, trapState }
      ),
      dryingRack: fishTrapRoutineSubProp(
        "dryingRack",
        state.dryingRackVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_drying_rack,
        VISUAL_TRANSFORM_REGISTRY.fishTrapDryingRack,
        "worldState.fishTrapRoutine.dryingRackVisible",
        { count: dryingRackCount, dryingFishCount, anchorPosition: state.dryingRackPosition || null }
      ),
      catchDisplay: fishTrapRoutineSubProp(
        "catchDisplay",
        state.catchDisplayVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_fish_trap_catch_display,
        VISUAL_TRANSFORM_REGISTRY.fishTrapCatchDisplay,
        "worldState.fishTrapRoutine.catchDisplayVisible",
        { count: catchDisplayCount, fishCount, crabCount, trapState }
      )
    },
    stateHook: {
      state: "worldState.fishTrapRoutine",
      day: "worldState.time.day",
      trapState: "worldState.fishTrapRoutine.trapState",
      anchorPosition: "worldState.fishTrapRoutine.anchorPosition",
      buoyPosition: "worldState.fishTrapRoutine.buoyPosition",
      dryingRackPosition: "worldState.fishTrapRoutine.dryingRackPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: FISH_TRAP_ROUTINE_ID,
      visualVariant: state.variant || "setLine",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      trapState,
      statePlaceholders: Array.isArray(state.statePlaceholders)
        ? state.statePlaceholders.slice()
        : ["unset", "set", "readyToCheck", "collected", "drying"],
      trapCount,
      buoyCount,
      lineCount,
      stateCueCount,
      dryingRackCount,
      catchDisplayCount,
      fishCount,
      crabCount,
      dryingFishCount,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.fishTrapRoutineCluster.id,
      duplicateSystemClassification:
        "new passive trap routine prop family; does not alter fishing, ocean, food, raft, pier, storage, or economy systems",
      placeholderNote:
        state.integrationNote ||
        "visual-only fish trap routine placeholders; no catch timers, randomness, storage, or food economy",
      fallbackReason: visible ? "" : "outside Days 56-60 and no explicit fishTrapRoutine state"
    }
  };
}

function fishTrapRoutineSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when fishTrapRoutine prop flag is false/missing",
    ...extra
  };
}

function resolveToyPlaySetVisualState(worldState, selectedAction) {
  const state = worldState && worldState.toyPlaySet ? worldState.toyPlaySet : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const toyBuildable = buildableState(worldState, BUILDABLE_IDS.toyBlocks);
  const toyBuildableProgress = Number(toyBuildable.progress || 0);
  const toyBuildableUseSlot = Array.isArray(toyBuildable.useSlots) ? toyBuildable.useSlots[0] || null : null;
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_collection_slots;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isToyPlaySetPresentationAction(selectedAction) ||
      isToyPlaySetWorldStateActive(worldState)
  );
  const collectionSlotCount = Math.max(0, Number(state.collectionSlotCount || 0));
  const blockCount = Math.max(0, Number(state.blockCount || 0));
  const ballCount = Math.max(0, Number(state.ballCount || 0));
  const kiteCount = Math.max(0, Number(state.kiteCount || 0));
  const stringCount = Math.max(0, Number(state.stringCount || 0));
  const handleCount = Math.max(0, Number(state.handleCount || 0));
  const spinningTopCount = Math.max(0, Number(state.spinningTopCount || 0));
  const playMatCount = Math.max(0, Number(state.playMatCount || 0));
  const stage = visible ? state.stage || "active" : active ? "active" : "hidden";

  return {
    stage,
    variant: state.variant || "activeMain",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.toyPlaySetCluster,
    subProps: {
      collectionSlots: toyPlaySetSubProp(
        "collectionSlots",
        state.collectionSlotsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_collection_slots,
        VISUAL_TRANSFORM_REGISTRY.toyCollectionSlots,
        "worldState.toyPlaySet.collectionSlotsVisible",
        { count: collectionSlotCount }
      ),
      toyBlocks: toyPlaySetSubProp(
        "toyBlocks",
        state.toyBlocksVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_blocks,
        VISUAL_TRANSFORM_REGISTRY.toyBlocksDisplay,
        "worldState.toyPlaySet.toyBlocksVisible",
        { count: blockCount, extendsBuildable: BUILDABLE_IDS.toyBlocks }
      ),
      ball: toyPlaySetSubProp(
        "ball",
        state.ballVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_ball,
        VISUAL_TRANSFORM_REGISTRY.toyBall,
        "worldState.toyPlaySet.ballVisible",
        { count: ballCount }
      ),
      kite: toyPlaySetSubProp(
        "kite",
        state.kiteVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_kite,
        VISUAL_TRANSFORM_REGISTRY.toyKite,
        "worldState.toyPlaySet.kiteVisible",
        { count: kiteCount, stringCount, handleCount }
      ),
      spinningTop: toyPlaySetSubProp(
        "spinningTop",
        state.spinningTopVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_spinning_top,
        VISUAL_TRANSFORM_REGISTRY.toySpinningTop,
        "worldState.toyPlaySet.spinningTopVisible",
        { count: spinningTopCount }
      ),
      playMat: toyPlaySetSubProp(
        "playMat",
        state.playMatVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_toy_play_mat,
        VISUAL_TRANSFORM_REGISTRY.toyPlayMat,
        "worldState.toyPlaySet.playMatVisible",
        { count: playMatCount }
      )
    },
    stateHook: {
      state: "worldState.toyPlaySet",
      day: "worldState.time.day",
      stage: "worldState.toyPlaySet.stage",
      anchorPosition: "worldState.toyPlaySet.anchorPosition",
      kiteAnchorPosition: "worldState.toyPlaySet.kiteAnchorPosition",
      existingBuildable: `worldState.buildables.${BUILDABLE_IDS.toyBlocks}`,
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: TOY_PLAY_SET_ID,
      visualVariant: state.variant || "activeMain",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      stage,
      statePlaceholders: Array.isArray(state.statePlaceholders)
        ? state.statePlaceholders.slice()
        : ["hidden", "collection", "active", "matLayout", "kiteDay"],
      collectionSlotCount,
      blockCount,
      ballCount,
      kiteCount,
      stringCount,
      handleCount,
      spinningTopCount,
      playMatCount,
      existingToyBuildableId: BUILDABLE_IDS.toyBlocks,
      existingToyBuildableProgress: toyBuildableProgress,
      existingToyBuildableUseSlotAction: toyBuildableUseSlot ? toyBuildableUseSlot.action || "" : "",
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.toyPlaySetCluster.id,
      duplicateSystemClassification:
        state.duplicateSystemClassification ||
        "extension beside existing toy-block buildable; no competing toy crafting/use system",
      placeholderNote:
        state.integrationNote ||
        "visual-only toy play set placeholders; no play cooldowns, mood effects, toy crafting, kite physics, ball physics, or interactions",
      fallbackReason: visible ? "" : "outside Days 61-65 and no explicit toyPlaySet state"
    }
  };
}

function toyPlaySetSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when toyPlaySet prop flag is false/missing",
    ...extra
  };
}

function resolveMusicArtDecorVisualState(worldState, selectedAction) {
  const state = worldState && worldState.musicArtDecor ? worldState.musicArtDecor : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_shell_chime;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isMusicArtDecorPresentationAction(selectedAction) ||
      isMusicArtDecorWorldStateActive(worldState)
  );
  const shellChimeCount = Math.max(0, Number(state.shellChimeCount || 0));
  const paintedStoneCount = Math.max(0, Number(state.paintedStoneCount || 0));
  const drumCount = Math.max(0, Number(state.drumCount || 0));
  const fluteCount = Math.max(0, Number(state.fluteCount || 0));
  const hangingDecorationCount = Math.max(0, Number(state.hangingDecorationCount || 0));
  const artDisplaySlotCount = Math.max(0, Number(state.artDisplaySlotCount || 0));
  const performanceMarkerCount = Math.max(0, Number(state.performanceMarkerCount || 0));
  const noteMarkerCount = Math.max(0, Number(state.noteMarkerCount || 0));
  const stage = visible ? state.stage || "decoratedNook" : active ? "decoratedNook" : "hidden";

  return {
    stage,
    variant: state.variant || "decorCluster",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.musicArtDecorCluster,
    subProps: {
      shellChime: musicArtDecorSubProp(
        "shellChime",
        state.shellChimeVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_shell_chime,
        VISUAL_TRANSFORM_REGISTRY.shellChime,
        "worldState.musicArtDecor.shellChimeVisible",
        { count: shellChimeCount }
      ),
      paintedStones: musicArtDecorSubProp(
        "paintedStones",
        state.paintedStonesVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_painted_stones,
        VISUAL_TRANSFORM_REGISTRY.paintedStoneCluster,
        "worldState.musicArtDecor.paintedStonesVisible",
        { count: paintedStoneCount }
      ),
      drumFlute: musicArtDecorSubProp(
        "drumFlute",
        state.drumVisible || state.fluteVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_drum_flute,
        VISUAL_TRANSFORM_REGISTRY.drumFluteDisplay,
        "worldState.musicArtDecor.drumVisible",
        { drumCount, fluteCount }
      ),
      hangingDecoration: musicArtDecorSubProp(
        "hangingDecoration",
        state.hangingDecorationVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_hanging_decoration,
        VISUAL_TRANSFORM_REGISTRY.hangingDecoration,
        "worldState.musicArtDecor.hangingDecorationVisible",
        { count: hangingDecorationCount }
      ),
      artDisplaySlot: musicArtDecorSubProp(
        "artDisplaySlot",
        state.artDisplaySlotVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_art_display_slot,
        VISUAL_TRANSFORM_REGISTRY.artDisplaySlot,
        "worldState.musicArtDecor.artDisplaySlotVisible",
        { count: artDisplaySlotCount }
      ),
      performanceMarker: musicArtDecorSubProp(
        "performanceMarker",
        state.performanceMarkerVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_dusk_performance_marker,
        VISUAL_TRANSFORM_REGISTRY.duskPerformanceMarker,
        "worldState.musicArtDecor.performanceMarkerVisible",
        { count: performanceMarkerCount }
      ),
      noteMarkers: musicArtDecorSubProp(
        "noteMarkers",
        state.noteMarkersVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_music_static_note_sparkle,
        VISUAL_TRANSFORM_REGISTRY.staticMusicNoteMarker,
        "worldState.musicArtDecor.noteMarkersVisible",
        { count: noteMarkerCount, boundedStaticPool: true, maxCount: 5 }
      )
    },
    stateHook: {
      state: "worldState.musicArtDecor",
      day: "worldState.time.day",
      stage: "worldState.musicArtDecor.stage",
      anchorPosition: "worldState.musicArtDecor.anchorPosition",
      hangingAnchorPosition: "worldState.musicArtDecor.hangingAnchorPosition",
      performanceAnchorPosition: "worldState.musicArtDecor.performanceAnchorPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: MUSIC_ART_DECOR_ID,
      visualVariant: state.variant || "decorCluster",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      stage,
      statePlaceholders: Array.isArray(state.statePlaceholders)
        ? state.statePlaceholders.slice()
        : ["hidden", "chime", "artDisplay", "instruments", "duskPerformance", "decoratedNook"],
      shellChimeCount,
      paintedStoneCount,
      drumCount,
      fluteCount,
      hangingDecorationCount,
      artDisplaySlotCount,
      performanceMarkerCount,
      noteMarkerCount,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.musicArtDecorCluster.id,
      duplicateSystemClassification:
        "new passive music/art decor prop family; does not alter audio, lighting, day/night, shelter, mood, or performance systems",
      placeholderNote:
        state.integrationNote ||
        "visual-only music/art decor placeholders; no audio-reactive systems, rhythm gameplay, sound engine, scheduling, mood, or performance mechanics",
      particlePerformanceNote:
        state.particlePerformanceNote ||
        "no live particle emitter; deterministic static note/sparkle marker pool capped at five meshes",
      fallbackReason: visible ? "" : "outside Days 66-70 and no explicit musicArtDecor state"
    }
  };
}

function musicArtDecorSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when musicArtDecor prop flag is false/missing",
    ...extra
  };
}

function resolveAnimalFamiliarVisitorVisualState(worldState, selectedAction) {
  const state = worldState && worldState.animalFamiliarVisitor ? worldState.animalFamiliarVisitor : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_ground_visitor;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isAnimalFamiliarVisitorPresentationAction(selectedAction) ||
      isAnimalFamiliarVisitorWorldStateActive(worldState)
  );
  const animalCount = Math.max(0, Number(state.animalCount || 0));
  const birdVisitorCount = Math.max(0, Number(state.birdVisitorCount || 0));
  const fishVisitorCount = Math.max(0, Number(state.fishVisitorCount || 0));
  const foodCrumbCount = Math.max(0, Number(state.foodCrumbCount || 0));
  const observeRingCount = Math.max(0, Number(state.observeRingCount || 0));
  const approachMarkerCount = Math.max(0, Number(state.approachMarkerCount || 0));
  const stage = visible ? state.stage || "observe" : active ? "approach" : "hidden";

  return {
    stage,
    variant: state.variant || "groundVisitor",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.animalFamiliarVisitorCluster,
    subProps: {
      groundVisitor: animalFamiliarVisitorSubProp(
        "groundVisitor",
        state.animalVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_ground_visitor,
        VISUAL_TRANSFORM_REGISTRY.animalFamiliarGroundVisitor,
        "worldState.animalFamiliarVisitor.animalVisible",
        { count: animalCount, collisionEnabled: false, blocksMovement: false }
      ),
      birdVisitor: animalFamiliarVisitorSubProp(
        "birdVisitor",
        state.birdVisitorVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_bird_visitor,
        VISUAL_TRANSFORM_REGISTRY.animalFamiliarBirdVisitor,
        "worldState.animalFamiliarVisitor.birdVisitorVisible",
        { count: birdVisitorCount, pooled: true, behavior: "static-visitor-marker" }
      ),
      fishVisitor: animalFamiliarVisitorSubProp(
        "fishVisitor",
        state.fishVisitorVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_fish_visitor,
        VISUAL_TRANSFORM_REGISTRY.animalFamiliarFishVisitor,
        "worldState.animalFamiliarVisitor.fishVisitorVisible",
        { count: fishVisitorCount, pooled: true, behavior: "static-visitor-marker" }
      ),
      foodCrumbs: animalFamiliarVisitorSubProp(
        "foodCrumbs",
        state.foodCrumbsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_food_crumb_marker,
        VISUAL_TRANSFORM_REGISTRY.animalFamiliarFoodCrumbs,
        "worldState.animalFamiliarVisitor.foodCrumbsVisible",
        { count: foodCrumbCount, pooled: true, behavior: "feed-placeholder" }
      ),
      observeRing: animalFamiliarVisitorSubProp(
        "observeRing",
        state.observeRingVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_observe_marker,
        VISUAL_TRANSFORM_REGISTRY.animalFamiliarObserveRing,
        "worldState.animalFamiliarVisitor.observeRingVisible",
        { count: observeRingCount, radius: Number(state.observeRadius || 0), collisionEnabled: false }
      ),
      approachMarkers: animalFamiliarVisitorSubProp(
        "approachMarkers",
        state.approachMarkersVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_animal_familiar_approach_marker,
        VISUAL_TRANSFORM_REGISTRY.animalFamiliarApproachMarkers,
        "worldState.animalFamiliarVisitor.approachMarkersVisible",
        { count: approachMarkerCount, distance: Number(state.approachDistance || 0), pooled: true }
      )
    },
    stateHook: {
      state: "worldState.animalFamiliarVisitor",
      day: "worldState.time.day",
      anchorPosition: "worldState.animalFamiliarVisitor.anchorPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: ANIMAL_FAMILIAR_VISITOR_ID,
      visualVariant: state.variant || "groundVisitor",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      animalCount,
      birdVisitorCount,
      fishVisitorCount,
      foodCrumbCount,
      observeRingCount,
      approachMarkerCount,
      observeRadius: Number(state.observeRadius || 0),
      approachDistance: Number(state.approachDistance || 0),
      collisionEnabled: Boolean(state.collisionEnabled),
      blocksMovement: Boolean(state.blocksMovement),
      affectsCameraFollow: Boolean(state.affectsCameraFollow),
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.animalFamiliarVisitorCluster.id,
      duplicateSystemClassification:
        "new passive animal familiar prop family; does not alter birds, fish, ocean, ambient, camera, or behavior systems",
      nonblockingNote:
        state.nonblockingNote ||
        "visual-only animal visitor placeholders; nonblocking meshes, no colliders, no pathing claims, and no camera-follow changes",
      placeholderNote:
        state.integrationNote ||
        "no animal AI, feeding mechanics, familiarity scoring, flocking, chasing, collision behavior, or social interaction logic",
      fallbackReason: visible ? "" : "outside Days 71-75 and no explicit animalFamiliarVisitor state"
    }
  };
}

function animalFamiliarVisitorSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when animalFamiliarVisitor prop flag is false/missing",
    ...extra
  };
}

function resolveNightComfortLightsVisualState(worldState, selectedAction) {
  const state = worldState && worldState.nightComfortLights ? worldState.nightComfortLights : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_night_lantern_post;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isNightComfortLightsPresentationAction(selectedAction) ||
      isNightComfortLightsWorldStateActive(worldState)
  );
  const lanternPostCount = Math.max(0, Number(state.lanternPostCount || 0));
  const litPathAnchorCount = Math.max(0, Number(state.litPathAnchorCount || 0));
  const glowingShellCount = Math.max(0, Number(state.glowingShellCount || 0));
  const fireflyCount = Math.max(0, Number(state.fireflyCount || 0));
  const sitAnchorCount = Math.max(0, Number(state.sitAnchorCount || 0));
  const stage = visible ? state.stage || "nightLit" : active ? "nightLit" : "hidden";

  return {
    stage,
    variant: state.variant || "nightLit",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.nightComfortLightsCluster,
    subProps: {
      lanternPosts: nightComfortLightsSubProp(
        "lanternPosts",
        state.lanternPostsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_night_lantern_post,
        VISUAL_TRANSFORM_REGISTRY.nightLanternPost,
        "worldState.nightComfortLights.lanternPostsVisible",
        { count: lanternPostCount, lit: stage !== "inactive" }
      ),
      litPathAnchors: nightComfortLightsSubProp(
        "litPathAnchors",
        state.litPathAnchorsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_night_lit_path_anchor,
        VISUAL_TRANSFORM_REGISTRY.nightLitPathAnchor,
        "worldState.nightComfortLights.litPathAnchorsVisible",
        { count: litPathAnchorCount, lit: stage !== "inactive" }
      ),
      glowingShells: nightComfortLightsSubProp(
        "glowingShells",
        state.glowingShellsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_night_glowing_shell,
        VISUAL_TRANSFORM_REGISTRY.nightGlowingShells,
        "worldState.nightComfortLights.glowingShellsVisible",
        { count: glowingShellCount, emissiveOnly: true }
      ),
      fireflies: nightComfortLightsSubProp(
        "fireflies",
        state.firefliesVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_night_deterministic_fireflies,
        VISUAL_TRANSFORM_REGISTRY.nightDeterministicFireflies,
        "worldState.nightComfortLights.firefliesVisible",
        { count: fireflyCount, maxCount: 12, deterministic: true, boundedStaticPool: true }
      ),
      sitAnchor: nightComfortLightsSubProp(
        "sitAnchor",
        state.sitAnchorVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_night_sit_light_anchor,
        VISUAL_TRANSFORM_REGISTRY.nightSitLightAnchor,
        "worldState.nightComfortLights.sitAnchorVisible",
        { count: sitAnchorCount, behavior: "sit-at-night-anchor-placeholder" }
      )
    },
    stateHook: {
      state: "worldState.nightComfortLights",
      day: "worldState.time.day",
      anchorPosition: "worldState.nightComfortLights.anchorPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: NIGHT_COMFORT_LIGHTS_ID,
      visualVariant: state.variant || "nightLit",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      lanternPostCount,
      litPathAnchorCount,
      glowingShellCount,
      fireflyCount,
      sitAnchorCount,
      dynamicLightCount: Number(state.dynamicLightCount || 0),
      usesDynamicLights: Boolean(state.usesDynamicLights),
      maxFireflySprites: Number(state.maxFireflySprites || 12),
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.nightComfortLightsCluster.id,
      duplicateSystemClassification:
        "new passive night comfort prop/effect family; does not alter fire, sun/moon, day/night, lighting, path, or shelter systems",
      lightPerformanceNote:
        state.lightPerformanceNote ||
        "uses emissive materials and bounded deterministic sprite/mesh markers; no dynamic lights or unbounded emitters",
      placeholderNote:
        state.integrationNote ||
        "visual-only night comfort placeholders; no lantern fuel, lighting schedules, comfort mechanics, or firefly AI",
      fallbackReason: visible ? "" : "outside Days 81-85 and no explicit nightComfortLights state"
    }
  };
}

function nightComfortLightsSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when nightComfortLights prop flag is false/missing",
    ...extra
  };
}

function resolveLookoutMapHorizonVisualState(worldState, selectedAction) {
  const state = worldState && worldState.lookoutMapHorizon ? worldState.lookoutMapHorizon : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_platform;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isLookoutMapHorizonPresentationAction(selectedAction) ||
      isLookoutMapHorizonWorldStateActive(worldState)
  );
  const lookoutPlatformCount = Math.max(0, Number(state.lookoutPlatformCount || 0));
  const stepCount = Math.max(0, Number(state.stepCount || 0));
  const mapBoardCount = Math.max(0, Number(state.mapBoardCount || 0));
  const sketchMapCount = Math.max(0, Number(state.sketchMapCount || 0));
  const horizonMarkerCount = Math.max(0, Number(state.horizonMarkerCount || 0));
  const horizonHighlightCount = Math.max(0, Number(state.horizonHighlightCount || 0));
  const keepsakeCount = Math.max(0, Number(state.keepsakeCount || 0));
  const gatheringDetailCount = Math.max(0, Number(state.gatheringDetailCount || 0));
  const useSlotCount = Math.max(0, Number(state.useSlotCount || 0));
  const stage = visible ? state.stage || "lookoutActive" : active ? "lookoutActive" : "hidden";

  return {
    stage,
    variant: state.variant || "lookoutActive",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.lookoutMapHorizonCluster,
    subProps: {
      lookoutPlatform: lookoutMapHorizonSubProp(
        "lookoutPlatform",
        state.lookoutPlatformVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_platform,
        VISUAL_TRANSFORM_REGISTRY.lookoutPlatform,
        "worldState.lookoutMapHorizon.lookoutPlatformVisible",
        { count: lookoutPlatformCount, climbingEnabled: false, verticalMovementEnabled: false }
      ),
      steps: lookoutMapHorizonSubProp(
        "steps",
        state.stepsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_platform,
        VISUAL_TRANSFORM_REGISTRY.lookoutPlatform,
        "worldState.lookoutMapHorizon.stepsVisible",
        { count: stepCount, behavior: "static-shallow-visual-steps" }
      ),
      mapBoard: lookoutMapHorizonSubProp(
        "mapBoard",
        state.mapBoardVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_map_board,
        VISUAL_TRANSFORM_REGISTRY.lookoutMapBoard,
        "worldState.lookoutMapHorizon.mapBoardVisible",
        { count: mapBoardCount, mapDiscoveryEnabled: false }
      ),
      sketchMap: lookoutMapHorizonSubProp(
        "sketchMap",
        state.sketchMapVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_sketch_map,
        VISUAL_TRANSFORM_REGISTRY.lookoutSketchMap,
        "worldState.lookoutMapHorizon.sketchMapVisible",
        { count: sketchMapCount, mapDiscoveryEnabled: false }
      ),
      horizonMarker: lookoutMapHorizonSubProp(
        "horizonMarker",
        state.horizonMarkerVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_horizon_marker,
        VISUAL_TRANSFORM_REGISTRY.lookoutHorizonMarker,
        "worldState.lookoutMapHorizon.horizonMarkerVisible",
        { count: horizonMarkerCount, offIslandWorldEnabled: false }
      ),
      horizonHighlight: lookoutMapHorizonSubProp(
        "horizonHighlight",
        state.horizonHighlightVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_horizon_marker,
        VISUAL_TRANSFORM_REGISTRY.lookoutHorizonMarker,
        "worldState.lookoutMapHorizon.horizonHighlightVisible",
        { count: horizonHighlightCount, behavior: "static-highlight-placeholder" }
      ),
      keepsakeDisplay: lookoutMapHorizonSubProp(
        "keepsakeDisplay",
        state.keepsakeDisplayVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_keepsake_display,
        VISUAL_TRANSFORM_REGISTRY.lookoutKeepsakeDisplay,
        "worldState.lookoutMapHorizon.keepsakeDisplayVisible",
        { count: keepsakeCount }
      ),
      day100Gathering: lookoutMapHorizonSubProp(
        "day100Gathering",
        state.day100GatheringVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_day100_gathering,
        VISUAL_TRANSFORM_REGISTRY.lookoutDay100Gathering,
        "worldState.lookoutMapHorizon.day100GatheringVisible",
        { count: gatheringDetailCount, day100CompletionEnabled: false }
      ),
      useSlot: lookoutMapHorizonSubProp(
        "useSlot",
        state.useSlotVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_lookout_platform,
        VISUAL_TRANSFORM_REGISTRY.lookoutPlatform,
        "worldState.lookoutMapHorizon.useSlotVisible",
        { count: useSlotCount, behavior: "future-use-anchor-placeholder" }
      )
    },
    stateHook: {
      state: "worldState.lookoutMapHorizon",
      day: "worldState.time.day",
      anchorPosition: "worldState.lookoutMapHorizon.anchorPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: LOOKOUT_MAP_HORIZON_ID,
      visualVariant: state.variant || "lookoutActive",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      lookoutPlatformCount,
      stepCount,
      mapBoardCount,
      sketchMapCount,
      horizonMarkerCount,
      horizonHighlightCount,
      keepsakeCount,
      gatheringDetailCount,
      useSlotCount,
      climbingEnabled: Boolean(state.climbingEnabled),
      verticalMovementEnabled: Boolean(state.verticalMovementEnabled),
      mapDiscoveryEnabled: Boolean(state.mapDiscoveryEnabled),
      day100CompletionEnabled: Boolean(state.day100CompletionEnabled),
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.lookoutMapHorizonCluster.id,
      duplicateSystemClassification:
        "new passive lookout/map/horizon prop family; does not alter camera, terrain, day loop, milestone, or movement systems",
      movementDiscoveryNote:
        state.movementDiscoveryNote ||
        "visual-only lookout/map placeholders; steps and use-slot do not enable climbing, vertical movement, map discovery, or Day 100 completion",
      placeholderNote:
        state.integrationNote ||
        "no climbing, map discovery, Day 100 progression, ending logic, off-island world mechanics, camera, terrain, day-loop, milestone, or movement hooks",
      fallbackReason: visible ? "" : "outside Days 86-100 and no explicit lookoutMapHorizon state"
    }
  };
}

function lookoutMapHorizonSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when lookoutMapHorizon prop flag is false/missing",
    ...extra
  };
}

function resolveMajorProjectCapstoneVisualState(worldState, selectedAction) {
  const state = worldState && worldState.majorProjectCapstone ? worldState.majorProjectCapstone : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_supplies;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isMajorProjectCapstonePresentationAction(selectedAction) ||
      isMajorProjectCapstoneWorldStateActive(worldState)
  );
  const supplyMarkerCount = Math.max(0, Number(state.supplyMarkerCount || 0));
  const tableLegCount = Math.max(0, Number(state.tableLegCount || 0));
  const tabletopPieceCount = Math.max(0, Number(state.tabletopPieceCount || 0));
  const benchCount = Math.max(0, Number(state.benchCount || 0));
  const placeSettingCount = Math.max(0, Number(state.placeSettingCount || 0));
  const celebrationDetailCount = Math.max(0, Number(state.celebrationDetailCount || 0));
  const stage = visible ? state.stage || "stage0" : active ? "stage1" : "hidden";

  return {
    stage,
    variant: state.variant || "communityTableStage0",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.majorProjectCapstoneCluster,
    subProps: {
      stage0Supplies: majorProjectCapstoneSubProp(
        "stage0Supplies",
        state.stage0SuppliesVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_supplies,
        VISUAL_TRANSFORM_REGISTRY.capstoneCommunityTableSupplies,
        "worldState.majorProjectCapstone.stage0SuppliesVisible",
        { count: supplyMarkerCount }
      ),
      partialBuild: majorProjectCapstoneSubProp(
        "partialBuild",
        state.partialBuildVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_partial,
        VISUAL_TRANSFORM_REGISTRY.capstoneCommunityTableBuild,
        "worldState.majorProjectCapstone.partialBuildVisible",
        { tableLegCount, tabletopPieceCount, stage: "stage1" }
      ),
      mostlyBuilt: majorProjectCapstoneSubProp(
        "mostlyBuilt",
        state.mostlyBuiltVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_complete,
        VISUAL_TRANSFORM_REGISTRY.capstoneCommunityTableBuild,
        "worldState.majorProjectCapstone.mostlyBuiltVisible",
        { tableLegCount, tabletopPieceCount, benchCount, stage: "stage2" }
      ),
      completeBuild: majorProjectCapstoneSubProp(
        "completeBuild",
        state.completeBuildVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_complete,
        VISUAL_TRANSFORM_REGISTRY.capstoneCommunityTableBuild,
        "worldState.majorProjectCapstone.completeBuildVisible",
        { tableLegCount, tabletopPieceCount, benchCount, placeSettingCount, stage: "stage3" }
      ),
      placeSettings: majorProjectCapstoneSubProp(
        "placeSettings",
        state.completeBuildVisible && placeSettingCount > 0,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_place_settings,
        VISUAL_TRANSFORM_REGISTRY.capstoneCommunityTableSettings,
        "worldState.majorProjectCapstone.placeSettingCount",
        { count: placeSettingCount }
      ),
      celebrationDetail: majorProjectCapstoneSubProp(
        "celebrationDetail",
        state.celebrationDetailVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_capstone_community_table_celebration,
        VISUAL_TRANSFORM_REGISTRY.capstoneCommunityTableCelebration,
        "worldState.majorProjectCapstone.celebrationDetailVisible",
        { count: celebrationDetailCount }
      )
    },
    stateHook: {
      state: "worldState.majorProjectCapstone",
      day: "worldState.time.day",
      anchorPosition: "worldState.majorProjectCapstone.anchorPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: MAJOR_PROJECT_CAPSTONE_ID,
      selectedOption: "communityTable",
      visualVariant: state.variant || "communityTableStage0",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      supplyMarkerCount,
      tableLegCount,
      tabletopPieceCount,
      benchCount,
      placeSettingCount,
      celebrationDetailCount,
      resourcePlanningEnabled: Boolean(state.resourcePlanningEnabled),
      constructionMechanicsEnabled: Boolean(state.constructionMechanicsEnabled),
      milestoneLogicEnabled: Boolean(state.milestoneLogicEnabled),
      travelDiscoveryEnabled: Boolean(state.travelDiscoveryEnabled),
      day100CompletionEnabled: Boolean(state.day100CompletionEnabled),
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.majorProjectCapstoneCluster.id,
      duplicateSystemClassification:
        "single new passive capstone family; selected option is community table and it does not duplicate raft, lookout, buildable, milestone, or discovery systems",
      capstoneOptionNote:
        state.capstoneOptionNote ||
        "chosen capstone option: community table; staged visual progression only",
      placeholderNote:
        state.integrationNote ||
        "visual-only capstone placeholders; no resource planning, construction mechanics, milestone logic, travel, discovery, or Day 100 completion",
      fallbackReason: visible ? "" : "outside Days 91-95 and no explicit majorProjectCapstone state"
    }
  };
}

function majorProjectCapstoneSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when majorProjectCapstone prop flag is false/missing",
    ...extra
  };
}

function resolveAmbientBeachFindsVisualState(worldState, selectedAction) {
  const state = worldState && worldState.ambientBeachFinds ? worldState.ambientBeachFinds : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_beach_shells;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isAmbientBeachFindsPresentationAction(selectedAction) ||
      isAmbientBeachFindsWorldStateActive(worldState)
  );
  const shellCount = Math.max(0, Number(state.shellCount || 0));
  const driftwoodCount = Math.max(0, Number(state.driftwoodCount || 0));
  const tinyFindCount = Math.max(0, Number(state.tinyFindCount || 0));
  const foodCrumbCount = Math.max(0, Number(state.foodCrumbCount || 0));
  const birdMarkerCount = Math.max(0, Number(state.birdMarkerCount || 0));
  const fishMarkerCount = Math.max(0, Number(state.fishMarkerCount || 0));
  const animalVisitorVisible = Boolean(state.animalVisitorVisible);

  return {
    stage: visible ? state.stage || "finds" : active ? "active" : "none",
    variant: state.variant || "shorelineFinds",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.ambientBeachFindsCluster,
    subProps: {
      shells: ambientBeachFindsSubProp(
        "shells",
        state.shellsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_beach_shells,
        VISUAL_TRANSFORM_REGISTRY.beachShells,
        "worldState.ambientBeachFinds.shellsVisible",
        { count: shellCount, instanced: true }
      ),
      driftwood: ambientBeachFindsSubProp(
        "driftwood",
        state.driftwoodVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_beach_driftwood,
        VISUAL_TRANSFORM_REGISTRY.beachDriftwood,
        "worldState.ambientBeachFinds.driftwoodVisible",
        { count: driftwoodCount, pooled: true }
      ),
      tinyFinds: ambientBeachFindsSubProp(
        "tinyFinds",
        state.tinyFindsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_tiny_beach_finds,
        VISUAL_TRANSFORM_REGISTRY.tinyBeachFinds,
        "worldState.ambientBeachFinds.tinyFindsVisible",
        { count: tinyFindCount, instanced: true }
      ),
      foodCrumbs: ambientBeachFindsSubProp(
        "foodCrumbs",
        state.foodCrumbsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_food_crumb_marker,
        VISUAL_TRANSFORM_REGISTRY.foodCrumbMarker,
        "worldState.ambientBeachFinds.foodCrumbsVisible",
        { count: foodCrumbCount, pooled: true }
      ),
      animalVisitor: ambientBeachFindsSubProp(
        "animalVisitor",
        animalVisitorVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_recurring_animal_visitor,
        VISUAL_TRANSFORM_REGISTRY.animalVisitor,
        "worldState.ambientBeachFinds.animalVisitorVisible",
        { count: animalVisitorVisible ? 1 : 0, behavior: "decorative-placeholder" }
      ),
      birdMarkers: ambientBeachFindsSubProp(
        "birdMarkers",
        state.birdMarkersVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_ambient_bird_marker,
        VISUAL_TRANSFORM_REGISTRY.ambientBirdMarker,
        "worldState.ambientBeachFinds.birdMarkersVisible",
        { count: birdMarkerCount, pooled: true }
      ),
      fishMarkers: ambientBeachFindsSubProp(
        "fishMarkers",
        state.fishMarkersVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_ambient_fish_marker,
        VISUAL_TRANSFORM_REGISTRY.ambientFishMarker,
        "worldState.ambientBeachFinds.fishMarkersVisible",
        { count: fishMarkerCount, pooled: true }
      )
    },
    stateHook: {
      state: "worldState.ambientBeachFinds",
      day: "worldState.time.day",
      anchorPosition: "worldState.ambientBeachFinds.anchorPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: AMBIENT_BEACH_FINDS_ID,
      visualVariant: state.variant || "shorelineFinds",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      shellCount,
      driftwoodCount,
      tinyFindCount,
      foodCrumbCount,
      birdMarkerCount,
      fishMarkerCount,
      animalVisitorVisible,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.ambientBeachFindsCluster.id,
      duplicateSystemClassification:
        "new passive decorative shoreline prop family; does not alter ocean/bird/fish/weather/terrain systems",
      performanceNote: "shells and tiny finds use instanced meshes; other repeated markers use small bounded pools",
      fallbackReason: visible ? "" : "outside Days 36-40/71-75 and no explicit ambientBeachFinds state"
    }
  };
}

function ambientBeachFindsSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when ambientBeachFinds prop flag is false/missing",
    ...extra
  };
}

function resolvePierShoreWorkSiteVisualState(worldState, selectedAction) {
  const state = worldState && worldState.pierShoreWorkSite ? worldState.pierShoreWorkSite : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_pier_posts;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isPierShoreWorkSitePresentationAction(selectedAction) ||
      isPierShoreWorkSiteWorldStateActive(worldState)
  );
  const pierPostCount = Math.max(0, Number(state.pierPostCount || 0));
  const plankCount = Math.max(0, Number(state.plankCount || 0));
  const lashingCount = Math.max(0, Number(state.lashingCount || 0));
  const workMarkerCount = Math.max(0, Number(state.workMarkerCount || 0));
  const safeBuildSiteCount = Math.max(0, Number(state.safeBuildSiteCount || 0));
  const fishingSlotCount = Math.max(0, Number(state.fishingSlotCount || 0));

  return {
    stage: visible ? state.stage || "posts" : active ? "active" : "none",
    variant: state.variant || "partialPier",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.pierShoreWorkSiteCluster,
    subProps: {
      pierPosts: pierShoreWorkSiteSubProp(
        "pierPosts",
        state.pierPostsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_pier_posts,
        VISUAL_TRANSFORM_REGISTRY.pierPosts,
        "worldState.pierShoreWorkSite.pierPostsVisible",
        { count: pierPostCount, pooled: true }
      ),
      planks: pierShoreWorkSiteSubProp(
        "planks",
        state.planksVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_pier_planks,
        VISUAL_TRANSFORM_REGISTRY.pierPlanks,
        "worldState.pierShoreWorkSite.planksVisible",
        { count: plankCount, pooled: true }
      ),
      lashings: pierShoreWorkSiteSubProp(
        "lashings",
        state.lashingsVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_pier_lashings,
        VISUAL_TRANSFORM_REGISTRY.pierLashings,
        "worldState.pierShoreWorkSite.lashingsVisible",
        { count: lashingCount, pooled: true }
      ),
      shoreWorkMarker: pierShoreWorkSiteSubProp(
        "shoreWorkMarker",
        state.shoreWorkMarkerVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_shore_work_marker,
        VISUAL_TRANSFORM_REGISTRY.shoreWorkMarker,
        "worldState.pierShoreWorkSite.shoreWorkMarkerVisible",
        { count: workMarkerCount }
      ),
      safeBuildSite: pierShoreWorkSiteSubProp(
        "safeBuildSite",
        state.safeBuildSiteVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_safe_water_edge_build_site,
        VISUAL_TRANSFORM_REGISTRY.safeWaterEdgeBuildSite,
        "worldState.pierShoreWorkSite.safeBuildSiteVisible",
        {
          count: safeBuildSiteCount,
          anchorPosition: state.safeBuildAnchorPosition || null,
          safety: "land-side visual marker"
        }
      ),
      pierFishingSlot: pierShoreWorkSiteSubProp(
        "pierFishingSlot",
        state.fishingSlotVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_pier_fishing_slot_marker,
        VISUAL_TRANSFORM_REGISTRY.pierFishingSlotMarker,
        "worldState.pierShoreWorkSite.fishingSlotVisible",
        {
          count: fishingSlotCount,
          anchorPosition: state.fishingSlotPosition || null,
          behavior: "visual-placeholder"
        }
      )
    },
    stateHook: {
      state: "worldState.pierShoreWorkSite",
      day: "worldState.time.day",
      anchorPosition: "worldState.pierShoreWorkSite.anchorPosition",
      safeBuildAnchorPosition: "worldState.pierShoreWorkSite.safeBuildAnchorPosition",
      fishingSlotPosition: "worldState.pierShoreWorkSite.fishingSlotPosition",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: PIER_SHORE_WORK_SITE_ID,
      visualVariant: state.variant || "partialPier",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      pierPostCount,
      plankCount,
      lashingCount,
      workMarkerCount,
      safeBuildSiteCount,
      fishingSlotCount,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.pierShoreWorkSiteCluster.id,
      duplicateSystemClassification:
        "new passive shore work-site prop family; does not alter ocean, terrain, movement, or fishing target logic",
      shoreSafetyNote: state.safetyNote || "visual-only shoreline work site; BB and build marker remain on land",
      fallbackReason: visible ? "" : "outside Days 41-45 and no explicit pierShoreWorkSite state"
    }
  };
}

function pierShoreWorkSiteSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when pierShoreWorkSite prop flag is false/missing",
    ...extra
  };
}

function resolveRaftBoatRouteVisualState(worldState, selectedAction) {
  const state = worldState && worldState.raftBoatRoute ? worldState.raftBoatRoute : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const source = VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_frame_logs;
  const visible = Boolean(state.visible);
  const active = Boolean(
    state.active ||
      isRaftBoatRoutePresentationAction(selectedAction) ||
      isRaftBoatRouteWorldStateActive(worldState)
  );
  const logCount = Math.max(0, Number(state.logCount || 0));
  const platformPlankCount = Math.max(0, Number(state.platformPlankCount || 0));
  const lashingCount = Math.max(0, Number(state.lashingCount || 0));
  const paddleCount = Math.max(0, Number(state.paddleCount || 0));
  const wakeMarkerCount = Math.max(0, Number(state.wakeMarkerCount || 0));
  const routeMarkerCount = Math.max(0, Number(state.routeMarkerCount || 0));
  const landingMarkerCount = Math.max(0, Number(state.landingMarkerCount || 0));

  return {
    stage: visible ? state.stage || state.buildStage || "frame" : active ? "active" : "none",
    variant: state.variant || "shoreBuild",
    visible,
    active,
    usable: false,
    source,
    transform: VISUAL_TRANSFORM_REGISTRY.raftBoatRouteCluster,
    subProps: {
      raftFrame: raftBoatRouteSubProp(
        "raftFrame",
        state.raftFrameVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_frame_logs,
        VISUAL_TRANSFORM_REGISTRY.raftFrameLogs,
        "worldState.raftBoatRoute.raftFrameVisible",
        { count: logCount, pooled: true }
      ),
      tiedPlatform: raftBoatRouteSubProp(
        "tiedPlatform",
        state.tiedPlatformVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_tied_platform,
        VISUAL_TRANSFORM_REGISTRY.raftTiedPlatform,
        "worldState.raftBoatRoute.tiedPlatformVisible",
        { count: platformPlankCount, lashingCount, pooled: true }
      ),
      paddleOar: raftBoatRouteSubProp(
        "paddleOar",
        state.paddleVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_paddle_oar,
        VISUAL_TRANSFORM_REGISTRY.raftPaddleOar,
        "worldState.raftBoatRoute.paddleVisible",
        { count: paddleCount }
      ),
      raftOnWater: raftBoatRouteSubProp(
        "raftOnWater",
        state.raftOnWaterVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_on_water_state,
        VISUAL_TRANSFORM_REGISTRY.raftOnWaterState,
        "worldState.raftBoatRoute.raftOnWaterVisible",
        {
          count: state.raftOnWaterVisible ? 1 : 0,
          waterState: state.waterState || "shore",
          anchorPosition: state.waterAnchorPosition || null,
          behavior: "visual-placeholder"
        }
      ),
      wakeMarker: raftBoatRouteSubProp(
        "wakeMarker",
        state.wakeMarkerVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_wake_marker,
        VISUAL_TRANSFORM_REGISTRY.raftWakeMarker,
        "worldState.raftBoatRoute.wakeMarkerVisible",
        { count: wakeMarkerCount, pooled: true }
      ),
      routeMarker: raftBoatRouteSubProp(
        "routeMarker",
        state.routeMarkerVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_route_marker,
        VISUAL_TRANSFORM_REGISTRY.raftRouteMarker,
        "worldState.raftBoatRoute.routeMarkerVisible",
        {
          count: routeMarkerCount,
          routeMarker: Boolean(state.routeMarker),
          anchorPosition: state.routeMarkerAnchorPosition || null,
          behavior: "visual-placeholder"
        }
      ),
      returnLanding: raftBoatRouteSubProp(
        "returnLanding",
        state.returnLandingVisible,
        VISUAL_ASSET_SOURCE_REGISTRY.procedural_raft_return_landing_marker,
        VISUAL_TRANSFORM_REGISTRY.raftReturnLandingMarker,
        "worldState.raftBoatRoute.returnLandingVisible",
        {
          count: landingMarkerCount,
          landingAnchor: state.landingAnchor || state.landingAnchorPosition || null,
          behavior: "visual-placeholder"
        }
      )
    },
    stateHook: {
      state: "worldState.raftBoatRoute",
      day: "worldState.time.day",
      buildStage: "worldState.raftBoatRoute.buildStage",
      waterState: "worldState.raftBoatRoute.waterState",
      routeMarker: "worldState.raftBoatRoute.routeMarker",
      landingAnchor: "worldState.raftBoatRoute.landingAnchor",
      action: "worldState.bubbleBoy.currentAction"
    },
    debug: {
      visualFamily: RAFT_BOAT_ROUTE_ID,
      visualVariant: state.variant || "shoreBuild",
      currentFamilyState: active ? "active" : visible ? "available" : "hidden",
      day: worldState && worldState.time ? Number(worldState.time.day || 0) : 0,
      activeAnimationAction: selectedAction || "",
      bubbleBoyAction: boy.currentAction || "",
      buildStage: state.buildStage || state.stage || "none",
      waterState: state.waterState || "shore",
      routeMarker: Boolean(state.routeMarker),
      logCount,
      platformPlankCount,
      lashingCount,
      paddleCount,
      wakeMarkerCount,
      routeMarkerCount,
      landingMarkerCount,
      assetSourceId: source.id || "",
      assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
      transformId: VISUAL_TRANSFORM_REGISTRY.raftBoatRouteCluster.id,
      duplicateSystemClassification:
        "new passive raft/boat route prop family; does not alter water, camera, controls, movement, day loop, or travel mechanics",
      futureIntegrationNote:
        state.integrationNote || "visual-only raft route placeholders; future buildable/vehicle hooks are metadata only",
      fallbackReason: visible ? "" : "outside Days 46-55/91-95 and no explicit raftBoatRoute state"
    }
  };
}

function raftBoatRouteSubProp(id, visible, source, transform, stateHook, extra = {}) {
  return {
    id,
    visible: Boolean(visible),
    source,
    transform,
    stateHook,
    fallbackBehavior: "hidden when raftBoatRoute prop flag is false/missing",
    ...extra
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

function isFoodRoutinePresentationAction(action) {
  return (
    action === "harvesting" ||
    action === "inspectingGarden" ||
    action === "cookFish" ||
    action === "cookMeal" ||
    action === "stirPot" ||
    action === "holdFood" ||
    action === "eatFood"
  );
}

function isFoodRoutineWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "cookingfish" ||
    action === "eatingfish" ||
    action === "cookFish" ||
    action === "cookMeal" ||
    action === "stirPot" ||
    action === "holdFood" ||
    action === "eatFood" ||
    action === "harvesting" ||
    action === "inspectingGarden" ||
    goal === "foodRoutine" ||
    goal === "cooking" ||
    goal === "harvesting"
  );
}

function isFireCarePresentationAction(action) {
  return (
    action === "lightFire" ||
    action === "tendFire" ||
    action === "kneelAtFire" ||
    action === "warmHands" ||
    action === "addFuel" ||
    action === "fanFire" ||
    action === "stokeFire" ||
    action === "sitNearFire" ||
    isFireCookingPresentationAction(action)
  );
}

function isFireCookingPresentationAction(action) {
  return (
    action === "cookFish" ||
    action === "cookMeal" ||
    action === "stirPot" ||
    action === "holdFood" ||
    action === "eatFood"
  );
}

function isFishTrapRoutinePresentationAction(action) {
  return (
    action === "setFishTrap" ||
    action === "checkFishTrap" ||
    action === "collectFishTrap" ||
    action === "dryTrapCatch" ||
    action === "inspectFishTrap"
  );
}

function isFishTrapRoutineWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "setFishTrap" ||
    action === "checkFishTrap" ||
    action === "collectFishTrap" ||
    action === "dryTrapCatch" ||
    action === "inspectFishTrap" ||
    goal === "fishTrapRoutine" ||
    goal === "trapRoutine" ||
    goal === "shoreTrap"
  );
}

function isToyPlaySetPresentationAction(action) {
  return (
    action === "playToy" ||
    action === "inspectToySet" ||
    action === "arrangeToySet" ||
    action === "inspectKite"
  );
}

function isToyPlaySetWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "playToy" ||
    action === "inspectToySet" ||
    action === "arrangeToySet" ||
    action === "inspectKite" ||
    goal === "toyPlaySet" ||
    goal === "toyPlay" ||
    goal === "playToy"
  );
}

function isMusicArtDecorPresentationAction(action) {
  return (
    action === "inspectMusicArt" ||
    action === "arrangeDecor" ||
    action === "inspectShellChime" ||
    action === "duskPerformance"
  );
}

function isMusicArtDecorWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectMusicArt" ||
    action === "arrangeDecor" ||
    action === "inspectShellChime" ||
    action === "duskPerformance" ||
    goal === "musicArtDecor" ||
    goal === "decorNook" ||
    goal === "duskPerformance"
  );
}

function isAnimalFamiliarVisitorPresentationAction(action) {
  return (
    action === "observeAnimalVisitor" ||
    action === "feedAnimalVisitor" ||
    action === "inspectAnimalVisitor" ||
    action === "watchBirdVisitor" ||
    action === "watchFishVisitor"
  );
}

function isAnimalFamiliarVisitorWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "observeAnimalVisitor" ||
    action === "feedAnimalVisitor" ||
    action === "inspectAnimalVisitor" ||
    action === "watchBirdVisitor" ||
    action === "watchFishVisitor" ||
    goal === "animalFamiliarVisitor" ||
    goal === "animalVisitor" ||
    goal === "visitorObserve"
  );
}

function isNightComfortLightsPresentationAction(action) {
  return (
    action === "inspectNightLights" ||
    action === "sitAtNightLight" ||
    action === "inspectGlowingShells" ||
    action === "watchFireflies"
  );
}

function isNightComfortLightsWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectNightLights" ||
    action === "sitAtNightLight" ||
    action === "inspectGlowingShells" ||
    action === "watchFireflies" ||
    goal === "nightComfortLights" ||
    goal === "nightPath" ||
    goal === "sitAtNight"
  );
}

function isLookoutMapHorizonPresentationAction(action) {
  return (
    action === "inspectLookout" ||
    action === "inspectMapBoard" ||
    action === "watchHorizon" ||
    action === "reviewKeepsakes" ||
    action === "gatherAtLookout"
  );
}

function isLookoutMapHorizonWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectLookout" ||
    action === "inspectMapBoard" ||
    action === "watchHorizon" ||
    action === "reviewKeepsakes" ||
    action === "gatherAtLookout" ||
    goal === "lookoutMapHorizon" ||
    goal === "lookout" ||
    goal === "mapBoard" ||
    goal === "horizon"
  );
}

function isMajorProjectCapstonePresentationAction(action) {
  return (
    action === "inspectCapstoneProject" ||
    action === "inspectCommunityTable" ||
    action === "reviewCapstoneStage"
  );
}

function isMajorProjectCapstoneWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectCapstoneProject" ||
    action === "inspectCommunityTable" ||
    action === "reviewCapstoneStage" ||
    goal === "majorProjectCapstone" ||
    goal === "communityTable" ||
    goal === "capstoneProject"
  );
}

function isAmbientBeachFindsPresentationAction(action) {
  return action === "inspectBeachFinds";
}

function isAmbientBeachFindsWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectBeachFinds" ||
    goal === "ambientBeachFinds" ||
    goal === "beachFinds"
  );
}

function isPierShoreWorkSitePresentationAction(action) {
  return action === "inspectPierSite";
}

function isPierShoreWorkSiteWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectPierSite" ||
    goal === "pierShoreWorkSite" ||
    goal === "shoreWork"
  );
}

function isRaftBoatRoutePresentationAction(action) {
  return action === "inspectRaftRoute";
}

function isRaftBoatRouteWorldStateActive(worldState) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const action = typeof boy.currentAction === "string" ? boy.currentAction : "";
  const goal = typeof boy.goal === "string" ? boy.goal : "";
  return (
    action === "inspectRaftRoute" ||
    goal === "raftBoatRoute" ||
    goal === "raft" ||
    goal === "boatRoute"
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
