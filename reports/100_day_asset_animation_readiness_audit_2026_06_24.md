# Bubble Boy 100-Day Asset + Animation Readiness Audit

Date: 2026-06-24
Repo: `/Users/sbrooker/repos/Bubble-Boy`
Scope: audit only. No 100-day implementation was added.

## Executive summary

Bubble Boy is not ready for a direct Days 1-100 implementation pass. It is ready for a narrow Days 1-5 scaffold pass if that pass focuses on deterministic `lifeLoop` state, objective gates, sleep/wake advancement, and debug traces while reusing the existing fire, wood, shelter, bed, toy, fishing, and presentation systems.

The repo has broad presentational coverage:

- 93 procedural visual asset source entries in `bubble_ui/static/toybox/presentation/visualRegistry.js`.
- 13 procedural scene asset modules under `bubble_ui/static/toybox/assets/`.
- 1 loaded humanoid GLB, `bubble_ui/static/toybox/assets/characters/RobotExpressive.glb`, with 14 real clips.
- 131 semantic animation fallback mappings in `bubble_ui/static/toybox/presentation/animationRegistry.js`.
- Strong Node regression coverage for simulation, presentation resolver contracts, asset metadata, animation fallbacks, and camera behavior.

The repo does not yet have the real 100-day loop:

- No authored `lifeDay` progression.
- No day objective gating.
- No end-of-day sleep/wake advancement.
- No Day 100 completion state.
- No generalized material/item economy beyond wood, fish, a few placeholder family states, and presentation-only attachments.
- Many later-day actions are fake-ready: asset descriptor plus fallback animation exists, but the actual behavior is not implemented.

Blunt readiness call: the art/presentation layer is ahead of the simulation layer. That is useful, but it can create false confidence. Treat most Days 26-100 content as visual review scaffolding, not gameplay-ready content.

## Asset inventory

### Runtime GLB files

| File path | Apparent purpose | Loadable from current code path | Referenced anywhere | Unused/orphaned | Risks |
| --- | --- | --- | --- | --- | --- |
| `bubble_ui/static/toybox/assets/characters/RobotExpressive.glb` | BB humanoid prototype and animation source | Yes, loaded by `ROBOT_EXPRESSIVE_URL` in `scene.js` | Yes | No | Single point of animation dependency; fallback hides humanoid if load fails; no textures/images, so texture path risk is low. |
| `bubble_ui/static/assets/toybox/generated_lowpoly_pack/camp_stool.glb` | Low-poly stool prop | No current runtime path | No | Yes | Orphaned; no manifest entry; not loaded by `GLTFLoader` or `loadGlb`; scale/origin unverified in-scene. |
| `bubble_ui/static/assets/toybox/generated_lowpoly_pack/grass_cluster.glb` | Grass cluster prop | No | No | Yes | Orphaned; could duplicate procedural grass/terrain clutter. |
| `bubble_ui/static/assets/toybox/generated_lowpoly_pack/lowpoly_rock.glb` | Rock prop | No | No | Yes | Orphaned; overlaps procedural rocks/boundary stones. |
| `bubble_ui/static/assets/toybox/generated_lowpoly_pack/lowpoly_tree.glb` | Tree prop | No | No | Yes | Orphaned; overlaps procedural/instanced resource forest. |
| `bubble_ui/static/assets/toybox/kenney_nature_kit/campfire_logs.glb` | Campfire/log prop | No | No | Yes | Orphaned; overlaps existing procedural campfire/firewood. |
| `bubble_ui/static/assets/toybox/kenney_nature_kit/grass.glb` | Grass prop | No | No | Yes | Orphaned; no loader path. |
| `bubble_ui/static/assets/toybox/kenney_nature_kit/log.glb` | Log/material prop | No | No | Yes | Orphaned; possible future carry/build prop, but no transform/attachment entry. |
| `bubble_ui/static/assets/toybox/kenney_nature_kit/plant_bush.glb` | Bush prop | No | No | Yes | Orphaned; no gameplay use. |
| `bubble_ui/static/assets/toybox/kenney_nature_kit/rock_small_a.glb` | Small rock prop | No | No | Yes | Orphaned; overlaps procedural stones. |
| `bubble_ui/static/assets/toybox/kenney_nature_kit/tree_simple.glb` | Tree prop | No | No | Yes | Orphaned; overlaps resource forest; could be confused with harvestable tree state. |

All 10 non-character GLBs have one mesh, no animations, no textures, and no images. Their file sizes are small, so file-size risk is low. Their main risk is integration ambiguity: they look like imported asset candidates, but the current runtime does not use them.

### Procedural visual asset source registry

Path for all rows below: `bubble_ui/static/toybox/presentation/visualRegistry.js`.
Creation/render path: descriptors are resolved by `resolveVisualDescriptors()` and projected into scene modules or existing scene renderers. These are not external files; their `path` field is `null` and `sourceType` is `procedural`.

| Asset/source id | Family | Apparent purpose | Loadable from current code path | Referenced | Unused/orphaned | Risks |
| --- | --- | --- | --- | --- | --- | --- |
| `procedural_arrival_bundle` | `arrivalShoreBundle` | Washed-up arrival bundle | Yes, descriptor path | Yes | No | Visual-only until day objective state exists. |
| `procedural_arrival_sticks` | `arrivalShoreBundle` | Loose sticks | Yes | Yes via subprop | No | State exists, but not a real material type. |
| `procedural_arrival_leaves` | `arrivalShoreBundle` | Loose leaves | Yes | Yes via subprop | No | State exists, but not a real material type. |
| `procedural_arrival_material_pile` | `arrivalShoreBundle` | Gathered tiny pile | Yes | Yes via subprop | No | Presentation-only material accounting. |
| `procedural_arrival_carry_bundle` | `arrivalShoreBundle` | Carry attachment | Yes | Yes via subprop/attachment | No | Attachment does not imply inventory mechanics. |
| `procedural_hammock` | `hammockBedShelter` | Rest sling/hammock | Yes | Yes | No | Existing builder builds bed, not hammock as a first-life objective. |
| `procedural_bed_upgrade` | `hammockBedShelter` | Cozy bed upgrade | Yes | Yes | No | Bed mechanics exist, but upgrade/comfort progression is placeholder. |
| `procedural_strong_shelter` | `hammockBedShelter` | Reinforced shelter | Yes | Yes | No | Later strong-shelter behavior missing. |
| `procedural_storage_basket` | `storageWorkbenchTools` | Camp storage basket | Yes | Yes | No | Storage visuals exceed actual storage mechanics. |
| `procedural_workbench_upgrade` | `storageWorkbenchTools` | Upgraded workbench | Yes | Yes | No | Workbench exists as complete buildable; tool crafting not real. |
| `procedural_first_tool` | `storageWorkbenchTools` | Stone/wood hand tool | Yes | Yes | No | Tool inventory state exists, but tool effects/recipes are not implemented. |
| `procedural_tool_rack` | `storageWorkbenchTools` | Tool rack | Yes | Yes | No | Display-only for now. |
| `procedural_campfire_firewood_cooking_surface` | `campfireFirewoodCookingSurface` | Existing fire ring, wood, cook cue | Yes | Yes | No | Fire starts lit by default; no first-fire build/light objective. |
| `procedural_footpath_strip` | `campPaths` | Camp path strips | Yes | Yes | No | Path completion/progression behavior is placeholder. |
| `procedural_boundary_stone` | `campPaths` | Boundary stones/carry stone | Yes | Yes | No | Placement action is presentational. |
| `procedural_path_rake` | `campPaths` | Path rake attachment | Yes | Yes | No | No clearing/raking mechanics. |
| `procedural_path_broom` | `campPaths` | Sweep tool attachment | Yes | Yes | No | No cleanup mechanics. |
| `procedural_zone_marker` | `campZones` | Work/rest/cook markers | Yes | Yes | No | Zones are not behavior-authoritative. |
| `procedural_lit_path_anchor` | `campPaths` | Future lit route marker | Yes | Yes | No | No lantern/fuel/night-route mechanics. |
| `procedural_garden_plot` | `gardenPlots` | Tilled garden plot | Yes | Yes | No | Garden growth is placeholder/default state, not a day system. |
| `procedural_garden_seeds` | `gardenPlots` | Seed dots | Yes | Yes | No | No seed inventory. |
| `procedural_garden_seed_pouch` | `gardenPlots` | Seed pouch attachment | Yes | Yes | No | Attachment-only. |
| `procedural_garden_sprout` | `gardenPlots` | Sprout stages | Yes | Yes | No | Growth not tied to life-day transitions. |
| `procedural_garden_crop` | `gardenPlots` | Mature crop | Yes | Yes | No | Harvest loop missing. |
| `procedural_harvested_crop` | `gardenPlots` | Carried crop | Yes | Yes | No | No harvested food inventory. |
| `procedural_watering_can` | `gardenPlots` | Watering can | Yes | Yes | No | No water source or watering state machine. |
| `procedural_food_cook_pot` | `foodRoutine` | Cook pot/surface | Yes | Yes | No | Existing fish cooking works; meal loop missing. |
| `procedural_food_basket` | `foodRoutine` | Food basket | Yes | Yes | No | Stored meals are visual-only. |
| `procedural_food_stored_meals` | `foodRoutine` | Stored meals | Yes | Yes | No | No meal inventory. |
| `procedural_food_drying_rack` | `foodRoutine` | Drying rack | Yes | Yes | No | No drying preservation mechanics. |
| `procedural_food_fish_harvest_display` | `foodRoutine` | Fish/harvest display | Yes | Yes | No | Display-only. |
| `procedural_food_leftovers` | `foodRoutine` | Leftovers prop | Yes | Yes | No | No leftover state. |
| `procedural_fish_trap_crab_pot` | `fishTrapRoutine` | Fish trap/crab pot | Yes | Yes | No | Trap timer/catch economy missing. |
| `procedural_fish_trap_buoy_marker` | `fishTrapRoutine` | Buoy marker | Yes | Yes | No | Visual-only. |
| `procedural_fish_trap_rope_line` | `fishTrapRoutine` | Rope line | Yes | Yes | No | Visual-only. |
| `procedural_fish_trap_state_cues` | `fishTrapRoutine` | Set/check/collect cues | Yes | Yes | No | State cues are not backed by simulation catch logic. |
| `procedural_fish_trap_drying_rack` | `fishTrapRoutine` | Trap drying rack | Yes | Yes | No | Display-only. |
| `procedural_fish_trap_catch_display` | `fishTrapRoutine` | Catch display | Yes | Yes | No | No inventory linkage. |
| `procedural_toy_play_collection_slots` | `toyPlaySet` | Toy collection tray | Yes | Yes | No | Toy set is separate from existing toy-block buildable; duplicate risk. |
| `procedural_toy_play_blocks` | `toyPlaySet` | Loose blocks | Yes | Yes | No | Duplicates existing `toyBlocks` buildable concept. |
| `procedural_toy_play_ball` | `toyPlaySet` | Ball | Yes | Yes | No | No physics/interactions. |
| `procedural_toy_play_kite` | `toyPlaySet` | Kite/string/handle | Yes | Yes | No | No wind-reactive kite physics. |
| `procedural_toy_play_spinning_top` | `toyPlaySet` | Spinning top | Yes | Yes | No | Static visual. |
| `procedural_toy_play_mat` | `toyPlaySet` | Play mat | Yes | Yes | No | Visual-only. |
| `procedural_music_shell_chime` | `musicArtDecor` | Shell chime | Yes | Yes | No | No audio/music mechanics. |
| `procedural_music_painted_stones` | `musicArtDecor` | Painted stones | Yes | Yes | No | Art placement state missing. |
| `procedural_music_drum_flute` | `musicArtDecor` | Drum/flute props | Yes | Yes | No | No sound/rhythm system integration. |
| `procedural_music_hanging_decoration` | `musicArtDecor` | Hanging decoration | Yes | Yes | No | Decoration slots not authoritative. |
| `procedural_music_art_display_slot` | `musicArtDecor` | Art display slot | Yes | Yes | No | Display-only. |
| `procedural_music_dusk_performance_marker` | `musicArtDecor` | Performance marker | Yes | Yes | No | No scheduled performance behavior. |
| `procedural_music_static_note_sparkle` | `musicArtDecor` | Static note/sparkle markers | Yes | Yes | No | Bounded static pool, low perf risk; can read as effect without music state. |
| `procedural_animal_familiar_ground_visitor` | `animalFamiliarVisitor` | Ground animal visitor | Yes | Yes | No | Visual-only; no animal AI. |
| `procedural_animal_familiar_bird_visitor` | `animalFamiliarVisitor` | Bird visitor | Yes | Yes | No | Visual-only. |
| `procedural_animal_familiar_fish_visitor` | `animalFamiliarVisitor` | Shore fish visitor | Yes | Yes | No | Could be confused with catchable fish. |
| `procedural_animal_familiar_food_crumb_marker` | `animalFamiliarVisitor` | Feed marker | Yes | Yes | No | No feeding economy. |
| `procedural_animal_familiar_observe_marker` | `animalFamiliarVisitor` | Observe-distance marker | Yes | Yes | No | Visual training wheel only. |
| `procedural_animal_familiar_approach_marker` | `animalFamiliarVisitor` | Safe approach marker | Yes | Yes | No | Visual-only; no behavior constraint. |
| `procedural_night_lantern_post` | `nightComfortLights` | Lantern post | Yes | Yes | No | Lantern fuel/light behavior missing. |
| `procedural_night_lit_path_anchor` | `nightComfortLights` | Lit path anchor | Yes | Yes | No | Visual-only. |
| `procedural_night_glowing_shell` | `nightComfortLights` | Glowing shell | Yes | Yes | No | Decorative only. |
| `procedural_night_deterministic_fireflies` | `nightComfortLights` | Fireflies | Yes | Yes | No | Bounded visual; no gameplay. |
| `procedural_night_sit_light_anchor` | `nightComfortLights` | Sit-at-night anchor | Yes | Yes | No | No comfort scoring. |
| `procedural_lookout_platform` | `lookoutMapHorizon` | Lookout platform | Yes | Yes | No | No climbing/discovery mechanics. |
| `procedural_lookout_map_board` | `lookoutMapHorizon` | Map board | Yes | Yes | No | No map system. |
| `procedural_lookout_sketch_map` | `lookoutMapHorizon` | Sketch/map prop | Yes | Yes | No | No discovery state. |
| `procedural_lookout_horizon_marker` | `lookoutMapHorizon` | Horizon marker | Yes | Yes | No | Visual-only. |
| `procedural_lookout_keepsake_display` | `lookoutMapHorizon` | Keepsake display | Yes | Yes | No | No collected keepsakes. |
| `procedural_lookout_day100_gathering` | `lookoutMapHorizon` | Day 100 gathering display | Yes | Yes | No | No Day 100 state gate. |
| `procedural_capstone_community_table_supplies` | `majorProjectCapstone` | Capstone supplies | Yes | Yes | No | Chosen capstone visual only. |
| `procedural_capstone_community_table_partial` | `majorProjectCapstone` | Partial community table | Yes | Yes | No | No multi-day capstone construction. |
| `procedural_capstone_community_table_complete` | `majorProjectCapstone` | Complete community table | Yes | Yes | No | No completion milestone. |
| `procedural_capstone_community_table_place_settings` | `majorProjectCapstone` | Place settings | Yes | Yes | No | Display-only. |
| `procedural_capstone_community_table_celebration` | `majorProjectCapstone` | Celebration cues | Yes | Yes | No | No celebration progression. |
| `procedural_beach_shells` | `ambientBeachFinds` | Shell finds | Yes | Yes | No | No collect/use loop. |
| `procedural_beach_driftwood` | `ambientBeachFinds` | Driftwood finds | Yes | Yes | No | Duplicates wood/material concept but not integrated. |
| `procedural_tiny_beach_finds` | `ambientBeachFinds` | Tiny finds | Yes | Yes | No | No inventory. |
| `procedural_food_crumb_marker` | `ambientBeachFinds` | Food crumb marker | Yes | Yes | No | Duplicates animal feed cue. |
| `procedural_recurring_animal_visitor` | `ambientBeachFinds` | Recurring animal visitor cue | Yes | Yes | No | Duplicates `animalFamiliarVisitor`. |
| `procedural_ambient_bird_marker` | `ambientBeachFinds` | Bird marker | Yes | Yes | No | Visual-only. |
| `procedural_ambient_fish_marker` | `ambientBeachFinds` | Fish marker | Yes | Yes | No | Visual-only. |
| `procedural_pier_posts` | `pierShoreWorkSite` | Pier posts | Yes | Yes | No | No pier construction mechanics. |
| `procedural_pier_planks` | `pierShoreWorkSite` | Pier planks | Yes | Yes | No | Visual staging only. |
| `procedural_pier_lashings` | `pierShoreWorkSite` | Rope/vine lashings | Yes | Yes | No | No material recipes. |
| `procedural_shore_work_marker` | `pierShoreWorkSite` | Shore work marker | Yes | Yes | No | Visual-only. |
| `procedural_safe_water_edge_build_site` | `pierShoreWorkSite` | Water-edge build site | Yes | Yes | No | No interaction slot/pathing authority. |
| `procedural_pier_fishing_slot_marker` | `pierShoreWorkSite` | Pier fishing slot | Yes | Yes | No | Existing fishing is ocean spot, not pier slot. |
| `procedural_raft_frame_logs` | `raftBoatRoute` | Raft logs | Yes | Yes | No | No raft construction mechanics. |
| `procedural_raft_tied_platform` | `raftBoatRoute` | Tied raft platform | Yes | Yes | No | No travel state. |
| `procedural_raft_paddle_oar` | `raftBoatRoute` | Paddle/oar | Yes | Yes | No | Attachment only. |
| `procedural_raft_on_water_state` | `raftBoatRoute` | Raft afloat state | Yes | Yes | No | Visual-only travel. |
| `procedural_raft_wake_marker` | `raftBoatRoute` | Wake marker | Yes | Yes | No | No boat physics. |
| `procedural_raft_route_marker` | `raftBoatRoute` | Route marker | Yes | Yes | No | No route/travel progression. |
| `procedural_raft_return_landing_marker` | `raftBoatRoute` | Return landing marker | Yes | Yes | No | No return milestone. |

## Animation inventory

### Real GLB clips loaded for BB

Source file: `bubble_ui/static/toybox/assets/characters/RobotExpressive.glb`.
Loader/binder: `createBubbleBoyHumanoid()`, `configureBubbleBoyHumanoid()`, `setBubbleBoyAnimationState()`, and `playBubbleBoyEmote()` in `bubble_ui/static/toybox/scene.js`.

| Clip name as loaded | Intended action | Code references directly | Mapped into action/state system | Type | Risks |
| --- | --- | --- | --- | --- | --- |
| `Dance` | Performance/dance fallback | Indirectly requested by `performAtDusk` fallback, but not in `HUMANOID_EMOTE_CLIPS` | Partially; fallback registry can name it, emote canonicalization support is uncertain | One-shot/emote | Potential mismatch: `performAtDusk` requests `Dance`, while `HUMANOID_EMOTE_CLIPS` does not list `Dance`. |
| `Death` | Unused source clip | No | No | One-shot | Unused; should not be exposed to BB action state. |
| `Idle` | Idle/standing base | Yes | Yes | Loop/base | Overused as fallback for many actions. |
| `Jump` | Hop/jump emote | Yes | Yes | One-shot/emote | Good for hop, but fake for ball/kite physical play. |
| `No` | Negative/restraint emote | Yes | Yes | One-shot/emote | Used for avoid-chasing; OK. |
| `Punch` | Generic work/reach gesture | Yes | Yes | One-shot/emote | Massive overuse: 72 semantic fallbacks depend on Punch plus procedural overlays. |
| `Running` | Run/short jog | Yes | Yes | Loop/locomotion | No root motion, simulation drives movement. |
| `Sitting` | Sit/rest/garden/toy base | Yes | Yes | Loop/base | Used for sleep/garden/toy poses; prop alignment needs visual checks per action. |
| `Standing` | Standing fallback | Yes | Yes | Loop/base | Secondary fallback. |
| `ThumbsUp` | Celebrate/eat/positive emote | Yes | Yes | One-shot/emote | Acceptable for simple celebration; too generic for Day 100 payoff. |
| `Walking` | Walk/carry/move | Yes | Yes | Loop/locomotion | No root motion; good with simulation-owned movement. |
| `WalkJump` | Walk/jump fallback | Yes | Yes | Locomotion/emote fallback | Used as fallback for Walking/Jump. |
| `Wave` | Respond/point/wave | Yes | Yes | One-shot/emote | Pointing is an overlay approximation, not a true point clip. |
| `Yes` | Nod/inspect/notice | Yes | Yes | One-shot/emote | Generic inspect fallback. |

### Semantic animation fallback registry

Path: `bubble_ui/static/toybox/presentation/animationRegistry.js`.
Count: 131 semantic fallback mappings.
Base clip distribution: `Idle` 94, `Sitting` 37, `Walking` 8, with overlap where moving clips exist.
Emote distribution: `Punch` 72, none 31, `Yes` 11, `ThumbsUp` 9, `Wave` 4, `Jump` 2, `No` 1, `Dance` 1.

These are not imported action-specific animation clips. They are mappings from semantic actions to RobotExpressive clips plus procedural overlays, with `rootMotion: false` throughout the covered tests.

| Semantic group | Source path | Clip names as loaded | Intended actions | Direct references | Mapped into action/state system | Type | Risks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Arrival/attention | `animationRegistry.js` | `Idle`, `Yes`, `Wave`, `ThumbsUp` | arrive, orient, respond, inspect, point, surprise, celebrate | Yes | Presentation only; no life-day arrival behavior | Idle/emote | Good enough visually for Day 1, but no objective system. |
| Gather/carry/deposit | `animationRegistry.js` | `Idle`, `Walking`, `Punch` | gather supplies, pickup, carry bundle/plank/log, deposit/set down | Yes | Partially; wood gathering is real, generic materials are not | Work/carry/locomotion | Carry props are state-driven but material economy is incomplete. |
| Fire/cooking/eating | `animationRegistry.js` | `Idle`, `Sitting`, `Punch`, `ThumbsUp` | light/tend/warm/add/stoke/cook/eat | Yes | Partially; fire tending and fish cook/eat work, first light/build does not | Prop interaction | `lightFire` is presentation-ready but not a first-fire mechanic. |
| Build/craft/repair | `animationRegistry.js` | `Idle`, `Punch`, `Yes` | hammer, tie, plank, post, craft, inspect, repair, reinforce | Yes | Partially; shelter/bed/toy build exists, tools/repair/reinforce mostly placeholder | Work one-shot | Generic Punch overlay must carry too many distinct actions. |
| Storage/sitting/camp | `animationRegistry.js` | `Idle`, `Sitting`, `Punch`, `Yes` | sort/deposit/withdraw/tidy/sit/rest/inspect | Yes | Mostly presentation; bed use is real | Camp interaction | Storage behavior is not authoritative enough. |
| Rest/sleep/wake | `animationRegistry.js` | `Idle`, `Sitting`, `ThumbsUp` | sit, settle, lie down, sleep loop, wake, stand | Yes | Bed sleep/rest exists; day-end sleep does not | Rest/sleep | Sleep loop is visual; no day transition. |
| Path/zone work | `animationRegistry.js` | `Idle`, `Walking`, `Punch` | rake, clear, sweep, stones, mark zones, inspect route | Yes | Presentation only | Work/locomotion | No path completion behavior. |
| Garden | `animationRegistry.js` | `Idle`, `Sitting`, `Punch`, `Yes`, `Walking` | dig, plant, water, inspect, harvest, carry/store/prep | Yes | Presentation/default state only | Prop interaction | No seed/water/growth economy. |
| Fishing/trap/pier | `animationRegistry.js` | `Idle`, `Standing`, `Punch`, `ThumbsUp` | cast/wait/reel/catch/pier/trap/check/hang | Yes | Ocean fishing real; trap/pier mostly visual | Prop interaction | Trap/pier actions not linked to catch inventory. |
| Raft/boat | `animationRegistry.js` | `Idle`, `Sitting`, `Walking`, `Punch`, `Yes`, `ThumbsUp` | carry logs, lash, push, board, paddle, return | Yes | Presentation only | Boat/prop | No raft construction, travel, or water pathing. |
| Toys/play | `animationRegistry.js` | `Idle`, `Sitting`, `Jump`, `Punch` | craft/place/play blocks/hop/kick/toss/kite/top/put away | Yes | Existing toy-block use exists; toy set actions mostly visual | Play/prop | Duplicate toy systems; no ball/kite/top mechanics. |
| Music/art/decor | `animationRegistry.js` | `Idle`, `Sitting`, `Punch`, `Dance`, `Yes` | paint, decorate, chime, drum, flute, rhythm, perform | Yes | Presentation only | Art/performance | `Dance` binding should be verified; no audio. |
| Animal visitor | `animationRegistry.js` | `Idle`, `Sitting`, `Punch`, `Wave`, `ThumbsUp`, `No` | observe, crouch, offer food, wave, happy, avoid chase | Yes | Presentation only | Animal interaction | No animal AI or feeding loop. |
| Lookout/Day 100 | `animationRegistry.js` | `Idle`, `Sitting`, `Walking`, `Punch`, `Wave`, `ThumbsUp` | step, lookout, map, horizon, reflect, celebrate | Yes | Presentation only | Reflection | No Day 100 gate or milestone logic. |

## Action readiness table

Definitions:

- `READY`: asset + animation + actual simulation/code path all exist.
- `PARTIAL`: some pieces exist but not enough to use reliably.
- `MISSING_ASSET`: code/animation exist but asset is missing.
- `MISSING_ANIMATION`: asset/code exist but no animation mapping.
- `MISSING_CODE`: asset and animation may exist, but gameplay behavior/progression is not implemented.
- `BROKEN_OR_UNVERIFIED`: evidence exists but runtime wiring or behavior is unverified or suspicious.
- `DUPLICATE_OR_AMBIGUOUS`: more than one system appears to represent the same thing.

| Intended action | Readiness | Evidence | Blocker/risk |
| --- | --- | --- | --- |
| arrive / wake up / idle | PARTIAL | Arrival visuals and arrival/wake/idle fallbacks exist; idle is real | No `lifeDay` arrival sequence or day-end wake transition. |
| walk / run / explore | READY | Simulation wander/direct movement and Walking/Running clips exist | Exploration is generic wander, not day-objective exploration. |
| gather materials | PARTIAL | Wood gathering is real; gather/carry/deposit fallbacks exist | Sticks/leaves/vines/stone are presentation placeholders, not real inventory. |
| chop tree / clear area | MISSING_CODE | Resource trees and clear-path visuals exist | No chop/clear behavior; wood gathering abstracts the action. |
| build fire | MISSING_CODE | Fire visual exists | Fire pit starts lit by default; no build-fire objective or construction state. |
| light fire / tend fire | PARTIAL | Tending low fire works; light/tend animations exist | Lighting first fire is not actual progression code. |
| build hammock | MISSING_CODE | Hammock visual and `buildHammock` fallback exist | Existing builder sequence builds shelter, bed, toy blocks, not Day 1 hammock. |
| sleep in hammock | MISSING_CODE | Hammock/rest visuals and sleep fallback exist | Bed sleep/rest exists; hammock sleep and day advancement do not. |
| fish | READY | Autonomous ocean fishing, raw fish state, fishing fallback exist | Pier/trap fishing is not ready. |
| catch fish | READY | Fishing attempts can create raw fish; catch fallback exists | Catch is simulation-driven ocean catch only. |
| cook fish | READY | Raw fish cooks at fire; `fishCooked` event exists | Cooking is specific to fish, not general meal prep. |
| eat | READY | Cooked fish reduces hunger; `fishEaten` event exists | Generic food/meal eating missing. |
| construct shelter | READY | Buildable shelter sequence exists with progress/resources | Not day-gated; may conflict with early hammock plan. |
| construct furniture | PARTIAL | Bed and toy blocks are buildables | General furniture construction is not implemented. |
| use bed | READY | Completed bed can be used for `sleep` action | It restores/uses rest, but does not advance authored day. |
| craft toy | PARTIAL | Toy blocks buildable and toy-play fallbacks exist | `craftToy` itself is presentation-only; toy economy missing. |
| place toy | MISSING_CODE | Visual/animation fallback exists | No placement mechanic. |
| play blocks | PARTIAL | Completed toy buildable can trigger `playToy`; play-blocks visual exists | New toy-play-set block action is separate from existing toy buildable. |
| hop / jump | MISSING_CODE | Jump clip and hop overlay exist | No gameplay/action scheduling beyond presentation mapping. |
| kick or toss ball | MISSING_CODE | Ball visual and kick/toss overlays exist | No ball physics or interaction state. |
| launch / fly kite | MISSING_CODE | Kite visual and launch overlay exist | No launch, wind, or flight mechanics. |
| hold wind-reactive kite | MISSING_CODE | Hold-kite overlay exists | Wind exists, but kite reaction is not gameplay-bound. |
| spin top | MISSING_CODE | Top visual and spin overlay exist | Static visual only. |
| put toy away | MISSING_CODE | Put-away overlay and collection slots exist | No cleanup/storage state. |
| garden / plant / water / harvest | MISSING_CODE | Garden visuals and fallbacks exist | No seed inventory, water source, crop growth day loop, or harvest economy. |
| decorate camp | MISSING_CODE | Decoration visuals and fallbacks exist | No decoration slot/progression system. |
| create art | MISSING_CODE | Painted stones/display visuals and fallbacks exist | No art creation state. |
| play music | MISSING_CODE | Drum/flute/chime visuals and fallbacks exist | No audio/rhythm behavior; `Dance` binding needs verification. |
| perform / celebrate | PARTIAL | `celebrate` after build exists; performance visuals/fallbacks exist | Day/performance scheduling and Day 100 celebration missing. |
| boat / improved fishing if present | MISSING_CODE | Raft/boat route and pier/trap visuals exist | No raft travel, pier building, trap timer, or improved fishing economy. |
| clean up / store items | MISSING_CODE | Storage/tidy visuals and fallbacks exist | No authoritative camp cleanup or generalized storage. |
| sort/deposit/withdraw materials | MISSING_CODE | Storage visuals and animation fallbacks exist | Wood/workbench inventory exists, but storage deposit/withdraw is not real. |
| inspect camp layout / walk route | PARTIAL | Path/zone visuals and walk-route fallback exist | Route inspection has presentation support but not objective logic. |
| animal familiarity | MISSING_CODE | Visitor visuals and gentle interaction fallbacks exist | No animal AI, no feeding, no trust progression. |
| lookout/map/reflection | MISSING_CODE | Lookout/map/Day 100 visuals and fallbacks exist | No map discovery or Day 100 milestone. |

Readiness counts for the table above:

- READY: 7
- PARTIAL: 8
- MISSING_ASSET: 0
- MISSING_ANIMATION: 0
- MISSING_CODE: 21
- BROKEN_OR_UNVERIFIED: 0
- DUPLICATE_OR_AMBIGUOUS: 1, counted inside PARTIAL for `play blocks`

## Day 1-100 readiness notes

Formal roadmap found: `docs/BB_100_DAY_LOOP_ROADMAP.md`.

The roadmap explicitly says the 100-day loop is still a roadmap, not a complete gameplay system. It also states that broad procedural visual coverage exists for review without shipping mechanics early.

### Days/actions ready now

- Generic day/night cycle: `worldState.time.day`, `timeOfDay`, `dayLengthSeconds`, and `phase`.
- Generic BB locomotion/exploration: wander, move intent, terrain/fire/water constraints.
- Fire presence/tending/warming: lit fire state, fuel, warmth, lighting, night risk, interaction target.
- Wood gathering and builder loop: resource trees, BB wood inventory, workbench wood mirror, build progress.
- Shelter construction: shelter buildable progresses and completes.
- Bed construction/use: bed buildable completes and can trigger sleep/rest action.
- Toy blocks construction/use: toy buildable completes and can trigger play action.
- Ocean fish loop: fish, catch raw fish, cook raw fish, eat cooked fish.
- Presentation resolver coverage for all major visual families and semantic animation fallbacks.

### Days/actions likely blocked

- Days 1-5 are blocked by missing authored `lifeLoop.lifeDay`, current objective, objective completion flags, and sleep/wake day advancement.
- Day 1 first-fire is blocked because fire starts lit by default and there is no build/light first fire state.
- Day 1 hammock is blocked because the real builder sequence goes shelter -> bed -> toy blocks, not arrival -> fire -> hammock.
- Days 6-10 storage/cleanup are blocked by lack of authoritative storage deposit/withdraw and cleanup state.
- Days 11-15 tools are blocked by lack of recipes and tool effects.
- Days 16-20 paths/zones are blocked by lack of route/path objective mechanics.
- Days 26-35 garden/food routine are blocked by missing seed/water/growth/harvest/meal inventory.
- Days 41-60 pier/raft/trap are blocked by missing construction/travel/trap catch mechanics.
- Days 61-65 toys are blocked by missing physics/action state for ball/kite/top and duplicate toy-block concepts.
- Days 66-70 music/art are blocked by missing audio, art creation, and decoration placement mechanics.
- Days 71-75 animal familiarity is blocked by missing animal AI/trust/feeding behavior.
- Days 81-85 lights are blocked by missing lantern/fuel/night comfort mechanics.
- Days 86-100 lookout/map/reflection/capstone are blocked by missing map discovery, capstone objective state, and Day 100 completion.

### Cut, delay, or simplify for the first 100-day pass

Cut or delay for first version:

- Ball physics.
- Real kite flight.
- Spin-top physics.
- Animal AI/trust.
- Raft travel.
- Pier fishing.
- Fish trap timers.
- Audio/rhythm gameplay.
- Map discovery.
- Multiple capstone options.
- Lantern fuel.
- Full decoration/art placement.

Simplify:

- Use one generic `campSupplies` material bucket for Days 1-5 instead of sticks/leaves/vines/stone as separate economies.
- Use existing fire as a stateful objective: `unlit -> lit -> stable`, even if the visual is the current campfire.
- Treat hammock as the first rest object in `lifeLoop`, but reuse the existing rest shelter descriptor.
- Use one sleep/wake transition to advance from life day 1 to day 2.
- Keep all movement simulation-owned; do not introduce root-motion dependencies.

### Smallest viable Days 1-100 version using what already works

The smallest viable version should be a milestone wrapper around existing systems, not a content explosion:

1. Days 1-5: arrival objective scaffold, gather generic supplies, stabilize fire, build first rest object, sleep/wake.
2. Days 6-20: reuse existing wood/build loop for shelter, bed, toy blocks, plus simple camp storage flags.
3. Days 21-35: use existing bed/rest, fish cook/eat, and placeholder garden visuals with one simplified crop flag.
4. Days 36-60: show ambient, pier, raft, and trap visuals as nonblocking milestone scenes, not full mechanics.
5. Days 61-85: show toy/music/animal/night-light scenes as optional comfort/decor beats, not physics or AI systems.
6. Days 86-100: use lookout/map/community table visuals as reflection/capstone milestones gated by flags from earlier arcs.

## Runtime loading risk notes

| Risk | Audit result |
| --- | --- |
| Loading screen permalock | Low current risk. `bootToybox().catch(...)` records errors in `window.__toyboxLastError`; humanoid load failure falls back to procedural BB. There is no all-assets upfront loading screen. |
| Uncaught GLTF/texture/audio errors | Medium. Robot GLB load has an error callback. Static procedural modules import synchronously; an import error would fail boot. Audio is initialized in scene path and should be watched, but no audio asset inventory was found. |
| Missing Promise settlement | Low for current GLB path; `GLTFLoader.load` uses callbacks. No broad promise-based asset batch loader was found. |
| Case-sensitive path bugs | Low for current checked paths: `/static/toybox/assets/characters/RobotExpressive.glb` matches file case. Orphaned GLBs are not on the runtime path. |
| Huge asset load blocking first render | Low. Only RobotExpressive GLB is 464 KB. The other GLBs are unused and small. Procedural assets are created in-scene, not fetched. |
| All assets loading upfront | Medium. Most procedural families are imported by `scene.js` upfront as modules, even if hidden by review/day state. Mesh creation appears controlled by descriptors, but module parse cost grows with every family. |
| Animation mixer errors | Medium. Base clips are protected by fallback lookup. `performAtDusk` names `Dance`, but `HUMANOID_EMOTE_CLIPS` does not include `Dance`; verify before relying on that clip. |
| Missing clip fallback | Low for core clips. Unknown actions resolve to Idle. |
| Invalid scene references | Medium. Presentation modules are broad and state-driven; missing state usually normalizes safely, but actual browser/WebGL coverage was not run in this audit. |
| Broken imports | Low based on Node tests and `/toybox` static smoke. |
| Circular dependencies | No obvious circular dependency was found in the inspected toybox simulation/presentation path. |
| Frame-rate collapse from too many objects | Medium future risk. Resource forest uses instancing, which is good. Later procedural families add many meshes; broad activation during review or late days should be browser-profiled. |
| Memory leak / duplicate asset instantiation | Medium. Scene uses long-lived prop sync modules; no repeated creation leak was proven, but the number of hidden/active families increases risk if future day switching recreates props instead of syncing. |
| HEAD route smoke | `HEAD /toybox` and static endpoints return 404 because the server routes are GET-oriented. Browser-style GET works. Not a gameplay blocker. |

## Prioritized recommendations

### A. Must fix before 100-day pass

1. Add real `lifeLoop` state: `lifeDay`, `currentObjective`, completed flags, `canSleep`, sleep transition state, and day-start/day-end timestamps.
2. Add Day 1 objective gating before adding more content: arrive, gather supplies, light/stabilize fire, build first rest object, sleep.
3. Decide how the hammock relates to the existing shelter/bed buildables. Right now hammock is presentation-ready but behavior-missing.
4. Split "presentation-ready" from "gameplay-ready" in code or debug output. The current registry can make actions look ready when they are only overlays.
5. Add focused tests for day advancement: cannot advance early, can advance after required flags, resets to morning/dawn deterministically.
6. Resolve duplicate toy concepts before Days 61-65: existing `toyBlocks` buildable vs `toyPlaySet` visual family.
7. Verify or fix `performAtDusk`/`Dance` binding before any music/performance milestone depends on it.

### B. Should fix during Days 1-20

1. Add a minimal `campSupplies` schema instead of separate material systems.
2. Add debug/canvas trace fields for `lifeDay`, `currentObjective`, objective completion, sleep readiness, and blockers.
3. Add one generic material carry/deposit loop that can later back storage, paths, and tools.
4. Keep builder priority from hijacking Day 1. Existing auto-builder will otherwise rush shelter/bed/toy blocks before the authored loop has meaning.
5. Normalize all first-20 actions through one mapping table from objective -> behavior -> presentation action.

### C. Can defer until polish

1. External GLB integration for the unused nature kits.
2. Ball/kite/top physics.
3. Audio/rhythm system.
4. Animal behavior.
5. Lantern fuel and fireflies beyond visual state.
6. Map discovery and keepsake collection.
7. Multiple capstone variants.

### D. Cut/simplify for first version

1. Cut raft travel; use a visual shoreline/raft milestone.
2. Cut trap timers; use existing ocean fishing until the food loop is stable.
3. Cut separate sticks/leaves/vines/stone inventories; use generic supplies first.
4. Cut real kite flight; use a static kite hold/launch moment.
5. Cut animal AI; use a nonblocking visitor scene.
6. Cut full music gameplay; use one celebration/performance flag with visuals.

## Suggested first implementation slice for Days 1-5

1. Add `lifeLoop` defaults and normalization in `worldState.js`.
2. Add Day 1 objective sequence in `simulate.js` without changing render authority:
   - `arrive`
   - `gatherSupplies`
   - `stabilizeFire`
   - `buildRestSpot`
   - `sleepUntilMorning`
3. Reuse existing fire, wood gathering, rest shelter descriptor, and animation fallbacks.
4. Add debug trace fields in `scene.js`/presentation debug.
5. Add Node tests proving deterministic day advancement and no premature sleep.

## Suggested second implementation slice for Days 6-10

1. Add simple camp storage state that receives generic supplies/wood without duplicating counts.
2. Add deposit/withdraw/tidy objectives as deterministic state transitions.
3. Let the existing fire consume/refuel from a reserve only after storage is proven.
4. Add tests for material conservation and objective completion.
5. Keep visuals procedural; do not integrate orphaned GLBs yet.

## Tiny fixes made

None. No audit-enabling code fix was required.

## Verification commands run and results

| Command | Result |
| --- | --- |
| `python3 -m pytest` | Failed: system Python had no `pytest` module. |
| `.venv/bin/python -m pytest` | Passed: 23 tests. |
| `node --test tests/sim/presentationState.test.js` | Passed: 76 tests. |
| `node --test tests/sim/simRegression.test.js` | Passed: 51 tests. |
| `node --test tests/sim/cameraControls.test.js` | Passed: 6 tests. |
| `npm test` | Not run: no `package.json` exists in this repo. |
| `npm run build` | Not run: no `package.json` exists in this repo. |
| `npm run static:check` | Not run: no `package.json` exists in this repo. |
| `.venv/bin/python -m bubble_ui.server` | Could not bind default `127.0.0.1:8765`; port already in use. |
| `.venv/bin/python -c 'from bubble_ui.server import run; run(port=8766)'` | Server started on alternate port for smoke check. |
| `curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://127.0.0.1:8766/toybox` | Passed: `200 text/html; charset=utf-8`. |
| `curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://127.0.0.1:8766/static/toybox/main.js` | Passed: `200 application/javascript`. |
| `curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://127.0.0.1:8766/static/toybox/assets/characters/RobotExpressive.glb` | Passed: `200 model/gltf-binary`. |
| `curl -I ...` for `/toybox`, `main.js`, `RobotExpressive.glb` | Returned 404 for HEAD requests; GET works. |

## Bottom line

Start the next implementation task with Days 1-5 only. Build the day loop spine before adding content. The current asset and animation coverage is useful, but most of it is presentation scaffolding. If the full 100-day pass starts now, it will wire a lot of beautiful placeholders to no real progression and create a brittle fake-ready system.
