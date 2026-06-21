# Bubble Boy 100-Day Life Loop Roadmap

Date: 2026-06-20

Purpose: plan Bubble Boy's first authored 100 day/night island life loop without implementing it yet.

This roadmap assumes the current simulation-first architecture remains the boundary: `simulate(dt, worldState, intents)` owns authoritative state changes, rendering projects from `worldState`, and UI/input only submit intents.

## Current Code Audit

### Files Inspected

- `README.md`
- `ARCHITECTURE.md`
- `SIMULATION_CORE.md`
- `pyproject.toml`
- `bubble/world/toybox_state.json`
- `bubble/world/toybox.html`
- `bubble_ui/server.py`
- `bubble_ui/templates/index.html`
- `bubble_ui/static/toybox/main.js`
- `bubble_ui/static/toybox/scene.js`
- `bubble_ui/static/toybox/debug.js`
- `bubble_ui/static/toybox/character.js`
- `bubble_ui/static/toybox/input/intent.js`
- `bubble_ui/static/toybox/simulation/worldState.js`
- `bubble_ui/static/toybox/simulation/simulate.js`
- `tests/test_toybox_simulation.py`
- `tests/sim/headlessRunner.js`
- `tests/sim/simRegression.test.js`

### Existing Systems That Support A Life Loop

Day/night cycle:

- `worldState.time.day`, `timeOfDay`, `dayLengthSeconds`, and `phase` already exist in `bubble_ui/static/toybox/simulation/worldState.js`.
- `updateTime` in `bubble_ui/static/toybox/simulation/simulate.js` advances day count from elapsed simulation seconds.
- `updateEnvironment` derives sun/moon, fog, sky, temperature, night risk, and fire contribution from the time cycle.
- `scene.js` renders sky, stars, clouds, birds, sun/moon bodies, water, fog, and lighting from the simulation state.

BB movement:

- `bubbleBoy.position`, `velocity`, `facing`, `targetId`, and deterministic wander targets are in the simulation state.
- `integrateBubbleBoyMovement` handles wandering, approach-fire, fishing, gathering, building, bed use, toy use, and direct move intents.
- Movement is constrained away from water and the fire.
- Camera follow mode tracks BB in `scene.js`.

BB animation/state:

- `bubbleBoy.goal`, `currentAction`, `attention`, `mood`, `affect`, `focus`, and `pose` already exist.
- `selectGoal`, `actionForGoal`, `updateMoodAndAttention`, and `updatePose` drive deterministic state.
- `scene.js` maps actions to humanoid clips/emotes through `HUMANOID_ACTION_EMOTES`.
- Existing actions include `walking`, `resting`, `warmingHands`, `tendingFire`, `foraging`, `fishing`, `cookingFish`, `eatingFish`, `gatheringWood`, `building`, `inspect`, `sleep`, `playToy`, and `celebrate`.

Interaction targets:

- Intents support `userPresence`, `interact`, `move`, and `pause`.
- Fire interaction is implemented through `FIRE_PIT_ID`.
- Buildable use slots exist for bed and toy blocks.
- Ocean fishing uses an internal `ocean-fishing-spot` target.
- General clickable/selectable world interactions do not exist yet.

Construction/building:

- `BUILDABLE_REGISTRY` defines shelter, bed, and toy blocks with staged progress, required wood, positions, use slots, and priority sequence.
- The builder loop gathers wood from resource trees, stores it in BB/workbench inventory, spends it on active buildables, emits build events, and advances to the next project.
- `scene.js` renders workbench, buildable stage props, resource forest, and builder traces.

Fishing/ocean:

- BB has fish inventory state: `none`, `raw`, or `cooked`.
- Autonomous fishing can start when builder work is inactive and hunger is above the low threshold.
- Raw fish cooks at the fire; cooked fish reduces hunger.
- `scene.js` renders ocean fish and fishing interaction traces.

Fire/light:

- `FIRE_PIT_ID` is a default object with `lit`, `fuel`, `warmth`, and `warmthRadius`.
- Fire affects temperature, night risk, lighting, mood, focus, and energy recovery.
- BB can warm up and tend a low fire.
- `scene.js` renders the campfire, fire light, glow, and flicker.

Inventory/materials:

- BB has `inventory.wood` and `inventory.fish`.
- Workbench mirrors wood state for traceability.
- Resource trees have `wood`, `maxWood`, and deterministic regrowth.
- There is no generalized inventory schema yet for food, leaves, vines, stone, crafted items, seeds, decorations, or placed camp assets.

Persistence/world state:

- `bubble/world/toybox_state.json` seeds mood/weather/time/speech for the served toybox.
- Runtime `worldState` is created in-browser from that seed and exposed on `window.__toyboxWorldState`.
- There is no durable save/load of simulation progress back to disk.
- Server route `/toybox` injects toybox seed JSON into `bubble/world/toybox.html`.

Debug overlay/logging:

- `createDebugController` toggles a panel in the toybox.
- `scene.js` exposes extensive canvas dataset trace fields and globals: sim tick, time, fire, BB drives/focus, builder inventory/progress, tree stats, ocean stats, lighting, sky life, and camera state.
- Headless tests provide deterministic simulation verification.
- Debug visibility is strong for current systems but not yet organized around day goals or milestone progression.

## Missing Before Days 1-5

- Day counter semantics: `time.day` exists, but there is no authored `lifeDay`, milestone day, current arc, or "first 100 days" progression state.
- Sleep/wake transition: bed `sleep` restores energy after construction, but there is no end-of-day sleep action that advances to morning, shows a transition, or increments an authored day loop.
- Goal selection: goal rules exist for needs/building/fishing/fire, but not for day-specific objectives such as "arrive", "collect first wood", "light first fire", or "build hammock".
- Inventory/material state: wood and fish exist; Days 1-5 need at minimum generalized materials for sticks/logs/leaves/vines/stone or a deliberately small `campSupplies` schema.
- Gather/carry/build actions: wood gathering and build progress exist, but there is no visible carrying state, no material piles by type, and no generic action model for leaves/vines/stones.
- Visible fire/hammock/camp objects: fire is visible; shelter/bed/toys exist. There is no hammock object or arrival/minimal camp staging separate from the current shelter/bed sequence.
- Basic debug visibility: current debug shows sim/build/fish/light; it does not show `lifeDay`, day goal, objective completion, sleep readiness, material checklist, or why the day cannot advance.

## 100-Day Roadmap

Each pass should be implemented as the smallest deterministic extension to `worldState` and `simulate`, then rendered from that state. Do not let `scene.js` become the authority for day progress.

### Days 1-5: Arrival And Minimal Camp

Narrative goal: BB arrives, orients himself, gathers first materials, keeps a fire alive, and creates the first sleeping hammock/minimal rest spot.

Required mechanics: authored `lifeDay`/day objective state, day completion flags, basic sleep/wake transition, small material inventory, first-fire objective, first rest-object build.

Required visual objects: arrival marker or washed-up bundle, first campfire state, loose sticks/leaves, simple hammock/rest sling, tiny material pile.

Required BB behaviors: arrive/look around, gather sticks/leaves, carry visible bundle, tend/light fire, build hammock, sleep through the night.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `debug.js`, `tests/sim/simRegression.test.js`, possibly `bubble/world/toybox_state.json`.

Implementation risks: conflicting with the current auto-builder shelter sequence; day advancement becoming tied to render time; adding too many material types before the loop is proven.

Simplest verification path: headless run from Day 1 seed reaches Day 2 only after required flags complete; debug trace exposes `lifeDay`, current objective, and sleep readiness; browser still renders fire and first rest object.

### Days 6-10: Functional Camp

Narrative goal: BB turns the arrival spot into a workable camp with storage, a stable fire area, and a clear daily routine.

Required mechanics: camp storage object, deposit/withdraw material actions, camp cleanup objective, fire fuel reserve, daily routine priorities.

Required visual objects: storage basket/crate, cleared camp ring, firewood stack, simple sitting/rest area.

Required BB behaviors: sort materials, deposit gathered items, refuel from storage, sit near fire, inspect camp layout.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: duplicating wood between BB inventory, workbench, and new storage; unclear priority between storage work and existing builder goals.

Simplest verification path: deterministic test shows gathered wood can move into storage and fire can consume/refuel from reserve without losing total material accounting.

### Days 11-15: Workbench/Tools

Narrative goal: BB establishes a proper workbench and crafts first simple tools.

Required mechanics: tool registry, craft action, recipes, tool unlock flags, tool-assisted build/gather modifiers.

Required visual objects: upgraded workbench, stone/wood tool props, small tool rack.

Required BB behaviors: inspect workbench, craft tool, use tool while gathering/building, celebrate first tool.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: premature generic crafting system; modifiers making existing builder tests flaky.

Simplest verification path: one recipe consumes known materials and adds one tool flag; build/gather still deterministic with and without the tool.

### Days 16-20: Paths/Camp Shape

Narrative goal: BB defines the camp footprint with paths, zones, and repeatable routes.

Required mechanics: path/zone objects, repeated walking routes, camp layout progression flags.

Required visual objects: footpaths, boundary stones, cleared work/rest/cook zones.

Required BB behaviors: rake/clear path, walk route between fire/storage/workbench, inspect zones.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `terrain.js`, `tests/sim/simRegression.test.js`.

Implementation risks: path visuals fighting terrain/water constraints; route following overlapping with direct movement intents.

Simplest verification path: trace exposes zone/path completion and BB can traverse route without water/fire clearance violations.

### Days 21-25: Cozy Home

Narrative goal: BB upgrades from camp to a cozy small home base.

Required mechanics: shelter upgrade stages, comfort score, rest quality, decoration slots.

Required visual objects: completed shelter, bed/hammock upgrade, soft floor, small shelf, personal nook.

Required BB behaviors: build shelter stages, rest inside, tidy/decorate, prefer shelter during night/storm.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: overlap with existing shelter/bed buildables; comfort becoming an untested hidden scoring system.

Simplest verification path: completed shelter sets `shelterAvailable`, increases rest effectiveness, and changes storm/night goal priority.

### Days 26-30: Garden Start

Narrative goal: BB starts growing food near camp.

Required mechanics: garden plot objects, seeds, planting, watering, deterministic growth by day/time/weather.

Required visual objects: small tilled plots, sprouts, water container, seed pouch.

Required BB behaviors: dig/plant/water/inspect sprouts.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: growth tied to elapsed seconds instead of day boundaries; too many crop states.

Simplest verification path: planting consumes seed, plot advances growth after a day transition, watering changes a visible/debug state.

### Days 31-35: Food Routine

Narrative goal: BB develops a reliable food loop with cooking and simple meals.

Required mechanics: meal inventory, cooked food storage, garden harvest, hunger routine priority.

Required visual objects: cook surface/pot, food basket, grown crop stage, simple meal prop.

Required BB behaviors: harvest, cook, eat, store leftovers.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: conflicting with current raw/cooked fish state; hunger thresholds causing constant food work.

Simplest verification path: one harvested item can become one meal and reduce hunger; fish cooking remains unchanged.

### Days 36-40: Ambient Island Life

Narrative goal: The island feels alive through small noncritical routines.

Required mechanics: ambient observations, optional daily idle tasks, low-risk wildlife/sky/wind hooks.

Required visual objects: more bird/fish activity, shells, driftwood, tiny ambient finds.

Required BB behaviors: watch birds, collect shell, pause at shore, react to weather.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: ambient logic interrupting core survival priorities; nondeterministic-looking behavior without deterministic seeds.

Simplest verification path: ambient actions happen only when no urgent need/build goal exists and are reproducible in headless runs.

### Days 41-45: Pier/Shore Project

Narrative goal: BB begins shaping the shoreline for fishing and travel.

Required mechanics: shore build site, pier stages, water-edge work safety, material requirements.

Required visual objects: pier posts, planks, rope/vine lashings, shore work marker.

Required BB behaviors: carry planks, build at shore, inspect ocean, fish from pier.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `terrain.js`, `tests/sim/simRegression.test.js`.

Implementation risks: build positions near water violating clearance rules; fishing target selection ignoring pier availability.

Simplest verification path: pier build site stays within safe shore bounds and, when complete, fishing target resolves to pier slot.

### Days 46-50: Raft Construction

Narrative goal: BB builds a small raft as the first major travel object.

Required mechanics: raft buildable, multi-material recipe, staged assembly, launch readiness.

Required visual objects: raft frame, logs, tied platform, paddle/oar.

Required BB behaviors: gather logs/vines, assemble raft, push/inspect at shore.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: raft as both buildable object and future vehicle; staging too large for current buildable registry assumptions.

Simplest verification path: raft progresses through staged build from stored materials and exposes `launchReady` only at completion.

### Days 51-55: First Boat Use

Narrative goal: BB takes the first safe short trip and returns.

Required mechanics: boat/raft use action, short scripted route, embarked state, return-to-shore transition.

Required visual objects: raft on water, paddle, wake/route marker, return landing spot.

Required BB behaviors: board, paddle, look out, return, celebrate.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `controls.js`, `tests/sim/simRegression.test.js`.

Implementation risks: movement constraints assume BB stays on island; camera/follow behavior may need water route support.

Simplest verification path: deterministic trip state moves raft along a bounded route and returns BB to safe land position.

### Days 56-60: Traps/Ocean Routine

Narrative goal: BB creates a repeatable shore/ocean food routine.

Required mechanics: trap objects, set/check/collect states, timed catches, ocean routine priority.

Required visual objects: fish trap/crab pot, buoy, drying rack.

Required BB behaviors: set trap, check trap, collect catch, cook/store food.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: catches feeling random; food abundance trivializing hunger.

Simplest verification path: seeded trap catch resolves after fixed day/time window and never exceeds storage capacity.

### Days 61-65: Toys

Narrative goal: BB makes play part of island life.

Required mechanics: toy collection/slots, play cooldowns, mood/stimulus effects.

Required visual objects: toy blocks, ball/kite/spinning top, play mat.

Required BB behaviors: craft toy, play, place toy back, invite player attention through focus.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: toy system duplicating existing toy-block buildable; play loops interrupting work too often.

Simplest verification path: completed toy object triggers `playToy` only after basic needs are safe and emits a deterministic event.

### Days 66-70: Music/Art

Narrative goal: BB adds expressive culture to the camp.

Required mechanics: art/music objects, create/perform action, display slots, mood/comfort effects.

Required visual objects: shell chime, painted stone, small drum/flute, hanging decoration.

Required BB behaviors: craft art, place decoration, play music at dusk/night.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, audio files only if existing audio system can support it without new dependencies, `tests/sim/simRegression.test.js`.

Implementation risks: audio becoming nondeterministic or too intrusive; art variants multiplying state.

Simplest verification path: one art object can be created and placed; one music action changes debug/event state without affecting core progression.

### Days 71-75: Animal Familiarity

Narrative goal: BB becomes familiar with harmless island animals.

Required mechanics: simple animal entity state, familiarity score, nonblocking approach/observe/feed actions.

Required visual objects: small island animal or recurring bird/fish visitor, food crumb marker.

Required BB behaviors: observe from distance, offer food, wave/respond, avoid chasing.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: animal AI scope creep; entity state becoming render-driven.

Simplest verification path: one deterministic animal entity appears, changes familiarity only through simulation actions, and never blocks survival goals.

### Days 76-80: Strong Shelter

Narrative goal: BB upgrades the shelter for storms and long-term comfort.

Required mechanics: shelter durability, storm protection, stronger roof/walls upgrade.

Required visual objects: reinforced posts, thicker roof, windbreak, tied-down edges.

Required BB behaviors: reinforce shelter, shelter during storm/night, inspect after weather.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: durability becoming punishment-heavy; storm safety overriding cozy routine too often.

Simplest verification path: upgraded shelter reduces `nightRisk`/storm concern and is reflected in BB goal choice during storm.

### Days 81-85: Night Comfort/Lanterns

Narrative goal: Nights become calmer and more beautiful.

Required mechanics: lantern/light objects, fuel or charge state, night comfort bonus.

Required visual objects: lantern posts, glowing shells/fireflies if deterministic, lit paths.

Required BB behaviors: light lanterns at dusk, walk safe path, sit comfortably at night.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: adding parallel light systems outside `environment.light`; too many dynamic lights hurting performance.

Simplest verification path: one lantern object turns on from simulation state at dusk and is visible/debugged without replacing fire logic.

### Days 86-90: Lookout/Map

Narrative goal: BB builds a lookout and starts understanding the horizon.

Required mechanics: lookout buildable, map discovery flags, view/observe action.

Required visual objects: lookout platform, simple map board, horizon marker.

Required BB behaviors: climb/use lookout slot, sketch map, watch horizon.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, camera follow code if viewpoint needs support, `tests/sim/simRegression.test.js`.

Implementation risks: vertical movement/climbing is not currently modeled; map discoveries may imply off-island world scope.

Simplest verification path: use-slot action at lookout emits observation/map progress while BB remains safely placed in simulation.

### Days 91-95: Major Project

Narrative goal: BB completes a capstone build that proves the island life loop is stable.

Required mechanics: major project selection, large multi-stage build, resource planning, milestone event.

Required visual objects: improved boat, signal tower, garden pergola, or community table; choose one.

Required BB behaviors: gather over multiple days, build in stages, pause for needs, celebrate completion.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`.

Implementation risks: scope explosion if the project is several systems at once; long build tests becoming slow.

Simplest verification path: seeded headless run completes the chosen project with deterministic stage events and no hunger/energy deadlock.

### Days 96-100: Reflection/New Horizon

Narrative goal: BB reflects on the island home he built and sees a gentle new possibility beyond Day 100.

Required mechanics: reflection milestone, summary of completed projects, new-horizon state, loop-complete flag.

Required visual objects: Day 100 lookout/fire gathering scene, map/horizon highlight, keepsake display.

Required BB behaviors: visit key objects, idle reflectively, look toward horizon, celebrate quietly.

Files likely to change: `worldState.js`, `simulate.js`, `scene.js`, `tests/sim/simRegression.test.js`, possibly UI copy if the main page should surface completion.

Implementation risks: reflection becoming an LLM/memory feature instead of deterministic toybox state; ending that blocks continued sandbox play.

Simplest verification path: Day 100 flag appears only after required milestones; BB continues simulating afterward with a `newHorizon` state rather than stopping.

## Recommended First Implementation Pass

Build first: a minimal Day 1-5 progression scaffold, not the full 100-day system.

Scope:

- Add deterministic `lifeLoop` state under `worldState`, separate from render state.
- Track `lifeDay`, `currentObjective`, completed objective flags, and `canSleep`.
- Add the smallest day-end sleep/wake transition that advances to next morning.
- Reuse existing fire, wood gathering, and buildable patterns where possible.
- Add debug/canvas trace fields for `lifeDay`, `currentObjective`, `objectiveComplete`, and `canSleep`.
- Add focused headless tests around day advancement and objective gating.

Do not build yet:

- Full generic crafting.
- Full generalized inventory.
- Raft/boat movement.
- Garden/crop growth.
- Animal entities.
- Audio/music/art variants.
- Durable save/load back to `bubble/world/toybox_state.json`.
- New dependencies.

Exact files likely involved:

- `bubble_ui/static/toybox/simulation/worldState.js`
- `bubble_ui/static/toybox/simulation/simulate.js`
- `bubble_ui/static/toybox/scene.js`
- `tests/sim/simRegression.test.js`
- Optionally `bubble/world/toybox_state.json` only to seed a Day 1 scenario.

Smallest possible acceptance criteria:

- New world state has `lifeLoop.lifeDay === 1`, a stable `currentObjective`, and normalized defaults.
- Day 1 cannot advance while required objective flags are incomplete.
- Completing the minimal objective set makes sleep available.
- A sleep/wake transition advances `lifeDay` to 2 and resets time to morning/dawn deterministically.
- Debug/canvas trace exposes the new life-loop fields.
- Existing simulation regression tests still pass.
- Browser `/toybox` still starts and renders the current island scene.

Suggested next implementation prompt:

```text
Implement the smallest deterministic Days 1-5 life-loop scaffold for Bubble Boy. Add lifeLoop state, Day 1 objective gating, sleep/wake advancement to Day 2, and debug trace fields only. Reuse existing fire/wood/build behavior where possible. Do not add the full 100-day content, new dependencies, persistence, or unrelated visual refactors. Add focused headless tests and confirm the toybox still starts.
```

## Asset Backlog And Visual References

Use these as review references and modeling direction, not as pre-approved imports. Before adding any downloaded model, confirm license, file format, polygon weight, and whether it fits the current low-poly/material-color style. Prefer `.glb` assets or simple procedural Three.js primitives that can be staged from `worldState`.

Existing local coverage:

- `bubble_ui/static/assets/toybox/kenney_nature_kit/` already has low-poly tree, grass, rock, bush, log, and campfire-log `.glb` assets from Kenney Nature Kit.
- `bubble_ui/static/assets/toybox/generated_lowpoly_pack/` already has a camp stool, rock, grass cluster, and tree.
- `scene.js` already procedurally renders campfire, workbench, shelter stages, bed stages, toy blocks, resource trees, ocean fish, sky life, and lighting. New assets should extend these staged props rather than replace them wholesale.

Day 1-5 starter subset to review first: arrival shore bundle, loose sticks/leaves, tiny material pile, visible carry bundle, first-fire variants, and a hammock/rest sling.

### 1. Arrival Shore Bundle And Loose Supplies

Needed for Days 1-5: washed-up bundle or marker, driftwood, loose sticks, leaves, tiny material piles, and a visible carry bundle.

References:

- [threejs-floating-island](https://github.com/nextgtrgod/threejs-floating-island) for low-poly island composition and readable prop staging.
- [Island](https://github.com/jjakub542/Island) for a Three.js survival-island scene reference.
- [Breezy](https://github.com/claytercek/Breezy) for beach-scene set dressing.
- [Kenney Survival Kit](https://kenney.nl/assets/survival-kit) for low-poly survival supplies.
- [Poly Pizza driftwood search](https://poly.pizza/search/driftwood) for driftwood and beach debris reference.

### 2. Campfire, Firewood, And Cooking Surface

Needed for Days 1-10 and 31-35: first campfire states, firewood stack, stable fire ring, cook surface or pot, and simple meal prop support.

References:

- [threejs-campfire](https://github.com/AdonousTech/threejs-campfire) for a focused campfire scene.
- [threejs-campfire-scene](https://github.com/TheDevelolper/threejs-campfire-scene) for campfire lighting and staging.
- [ThreeJS_CampFire](https://github.com/AlexOUKS/ThreeJS_CampFire) for another Three.js campfire implementation.
- [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) for source-style logs and campfire parts.
- [Poly Pizza campfire search](https://poly.pizza/search/campfire) for alternate low-poly fire-ring shapes.

### 3. Hammock, Rest Sling, Bed Upgrade, And Cozy Shelter

Needed for Days 1-5, 21-25, and 76-80: simple hammock/rest sling, bed or hammock upgrade, completed shelter, soft floor, shelf, personal nook, reinforced posts, thicker roof, windbreak, and tied-down edges.

References:

- [cabin-in-the-woods](https://github.com/ahujasid/cabin-in-the-woods) for a Blender-to-Three.js shelter scene.
- [Realisitc-House-Three.js](https://github.com/manyatapawagi/Realisitc-House-Three.js) for wooden hut composition in Three.js.
- [threejs-floating-island](https://github.com/nextgtrgod/threejs-floating-island) for small island structure silhouettes.
- [Poly Pizza hammock search](https://poly.pizza/search/hammock) for rest-sling model references.
- [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) for low-poly shelf, bed, and simple furnishing shapes.

### 4. Storage, Workbench, First Tools, And Tool Rack

Needed for Days 6-15: storage basket or crate, upgraded workbench, stone/wood tool props, small tool rack, and material deposit/withdraw staging.

References:

- [threejs-survival-game](https://github.com/dwade30/threejs-survival-game) for resource collection and crafting mechanics.
- [voxel-craft-rt](https://github.com/decemyn/voxel-craft-rt) for inventory/crafting references in Three.js.
- [Island](https://github.com/jjakub542/Island) for survival-game object progression.
- [Poly Pizza workbench search](https://poly.pizza/search/workbench) and [tool search](https://poly.pizza/search/tool) for prop shape review.
- [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) for crates, shelves, and work-surface primitives.

### 5. Camp Paths, Zones, Boundary Stones, And Cleared Ground

Needed for Days 16-20 and 81-85: footpaths, cleared camp ring, boundary stones, work/rest/cook zone markers, and lit path anchors.

References:

- [Three.js Decals example](https://threejs.org/examples/#webgl_decals) for ground markings and path overlays.
- [Three.js Spline Editor example](https://threejs.org/examples/#webgl_geometry_spline_editor) for route/path control points.
- [Three.js Instancing Scatter example](https://threejs.org/examples/#webgl_instancing_scatter) for repeated stones, leaves, and path-edge props.
- [Kenney City Kit Roads](https://kenney.nl/assets/city-kit-roads) for modular path-piece inspiration.
- [Poly Pizza path search](https://poly.pizza/search/path) for simple ground/path prop references.

### 6. Garden Plots, Seeds, Sprouts, Watering, And Crops

Needed for Days 26-35: tilled plots, seeds, seed pouch, sprouts, water container, grown crop stages, harvest props, and food basket.

References:

- [threed-garden](https://github.com/marty-mcgee/threed-garden) for a React/Three.js garden environment.
- [karesansui](https://github.com/vibertthio/karesansui) for garden layout and raked-ground composition.
- [Fish-Garden-Threejs](https://github.com/normal-man-0807/Fish-Garden-Threejs) for compact garden/fish scene ideas.
- [Kenney Food Kit](https://kenney.nl/assets/food-kit) for low-poly food and produce shapes.
- [Poly Pizza garden search](https://poly.pizza/search/garden) and [crop search](https://poly.pizza/search/crop) for plant-stage references.

### 7. Food Routine Props

Needed for Days 31-35 and 56-60: cook pot or surface, food basket, stored meals, drying rack, fish/harvest props, and leftovers.

References:

- [hook-a-fish](https://github.com/dammafra/hook-a-fish) for a polished Three.js fishing-game scene.
- [tideline](https://github.com/bridge-mind/tideline) for browser fishing simulation and procedural fish references.
- [BestFishingSim](https://github.com/FastNEasy/BestFishingSim) for Three.js fishing-loop reference.
- [Kenney Food Kit](https://kenney.nl/assets/food-kit) for food/meal model direction.
- [Poly Pizza fish search](https://poly.pizza/search/fish) and [basket search](https://poly.pizza/search/basket) for food storage props.

### 8. Ambient Beach Finds, Birds, Fish, Shells, And Driftwood

Needed for Days 36-40 and 71-75: shells, driftwood, tiny ambient finds, extra bird/fish activity, food crumb marker, and a harmless recurring animal visitor.

References:

- [Breezy](https://github.com/claytercek/Breezy) for beach-scene prop density.
- [threejs-ocean-scene](https://github.com/Jumballaya/threejs-ocean-scene) for ocean and shoreline atmosphere.
- [Three.js GPGPU Birds example](https://threejs.org/examples/#webgl_gpgpu_birds) for bird flocking reference.
- [Three.js Morph Targets Horse example](https://threejs.org/examples/#webgl_morphtargets_horse) for simple animated animal reference.
- [Poly Pizza shell search](https://poly.pizza/search/shell), [bird search](https://poly.pizza/search/bird), and [animal search](https://poly.pizza/search/animal) for prop/model review.

### 9. Pier, Shore Work Site, Planks, And Lashings

Needed for Days 41-45: pier posts, planks, rope/vine lashings, shore work marker, safe water-edge build site, and pier fishing slot.

References:

- [Three.js Ocean Shader example](https://threejs.org/examples/#webgl_shaders_ocean) for water-edge rendering reference.
- [Three.js Spline Editor example](https://threejs.org/examples/#webgl_geometry_spline_editor) for shoreline build-route markers.
- [ThreeJs-boat-in-water](https://github.com/DionatanStocco/ThreeJs-boat-in-water) for boat/water staging near a shore.
- [Poly Pizza pier search](https://poly.pizza/search/pier) for pier and dock shapes.
- [Kenney Watercraft Kit](https://kenney.nl/assets/watercraft-kit) for compatible wooden water-object style.

### 10. Raft, Boat Use, Paddle, Wake, And Route Markers

Needed for Days 46-55 and 91-95 if the capstone is an improved boat: raft frame, logs, tied platform, paddle/oar, raft-on-water state, wake/route marker, and return landing spot.

References:

- [ThreeJs-boat-in-water](https://github.com/DionatanStocco/ThreeJs-boat-in-water) for boat/water composition.
- [3dc](https://github.com/deshaser/3dc) for a Three.js boat-on-water scene.
- [voyage](https://github.com/Sunil56224972/voyage) for a Three.js floating raft/route-style portfolio scene.
- [Kenney Watercraft Kit](https://kenney.nl/assets/watercraft-kit) for low-poly boat and paddle inspiration.
- [Poly Pizza raft search](https://poly.pizza/search/raft) and [boat search](https://poly.pizza/search/boat) for model references.

### 11. Fish Trap, Crab Pot, Buoy, And Drying Rack

Needed for Days 56-60: fish trap or crab pot, buoy, set/check/collect states, drying rack, and catch display.

References:

- [hook-a-fish](https://github.com/dammafra/hook-a-fish) for fishing interaction staging.
- [vr-fishing](https://github.com/gitfrandu4/vr-fishing) for line/fish/physics references in Three.js.
- [tideline](https://github.com/bridge-mind/tideline) for procedural browser fishing ideas.
- [Poly Pizza trap search](https://poly.pizza/search/trap) and [buoy search](https://poly.pizza/search/buoy) for trap/buoy shapes.
- [Kenney Pirate Kit](https://kenney.nl/assets/pirate-kit) for nautical props that may match trap, rope, and buoy language.

### 12. Toys, Play Mat, Ball, Kite, And Spinning Top

Needed for Days 61-65: toy collection slots, toy blocks, ball, kite, spinning top, and play mat.

References:

- [threejs-game](https://github.com/amilajack/threejs-game) for a small Three.js toy-game baseline.
- [toy-tank-war](https://github.com/Achiaga/toy-tank-war) for toy-like hard-surface Three.js props.
- [toy-threejs-game](https://github.com/ribbon-otter/toy-threejs-game) for simple Three.js game-object staging.
- [Poly Pizza toy search](https://poly.pizza/search/toy), [kite search](https://poly.pizza/search/kite), and [ball search](https://poly.pizza/search/ball) for toy model references.
- [Kenney Brick Kit](https://kenney.nl/assets/brick-kit) for simple toy/block style if a block pack is desired.

### 13. Music, Art, Shell Chime, Painted Stone, Drum, And Hanging Decoration

Needed for Days 66-70: shell chime, painted stone, small drum/flute, hanging decoration, art display slot, and dusk/night performance prop.

References:

- [Music-Visualizer](https://github.com/KanteLabs/Music-Visualizer) for Three.js audio-reactive scene structure.
- [arpeggiator](https://github.com/collidingScopes/arpeggiator) for web-audio/Three.js interaction reference.
- [3d-music-visualizer](https://github.com/l1ve4code/3d-music-visualizer) for simple Three.js music visual treatment.
- [Poly Pizza drum search](https://poly.pizza/search/drum), [shell search](https://poly.pizza/search/shell), and [flute search](https://poly.pizza/search/flute) for small music/art prop models.
- [Three.js Points Sprites example](https://threejs.org/examples/#webgl_points_sprites) for subtle music/art particles if used sparingly.

### 14. Animal Familiar, Bird/Fish Visitor, And Feed Marker

Needed for Days 71-75: one simple animal entity, bird/fish visitor variant, food crumb marker, observe/feed staging, and nonblocking approach distance visuals.

References:

- [solar-critters](https://github.com/JacobFV/solar-critters) for small procedural animal character ideas.
- [r3f-sims-online](https://github.com/Hussain-7/r3f-sims-online) for Animal Crossing-like social/entity presentation in React Three Fiber.
- [Three.js Morph Targets Horse example](https://threejs.org/examples/#webgl_morphtargets_horse) for lightweight animated-animal reference.
- [Three.js GPGPU Birds example](https://threejs.org/examples/#webgl_gpgpu_birds) for recurring bird motion reference.
- [Poly Pizza animal search](https://poly.pizza/search/animal), [bird search](https://poly.pizza/search/bird), and [fish search](https://poly.pizza/search/fish) for model references.

### 15. Lanterns, Lit Paths, Glowing Shells, And Fireflies

Needed for Days 81-85: lantern posts, deterministic glowing shells/fireflies, night path lights, and sit-at-night lighting anchors.

References:

- [Three.js Spotlights example](https://threejs.org/examples/#webgl_lights_spotlights) for local night-light behavior.
- [Three.js RectAreaLight example](https://threejs.org/examples/#webgl_lights_rectarealight) for soft rectangular glow references.
- [Three.js Points Sprites example](https://threejs.org/examples/#webgl_points_sprites) for low-cost deterministic firefly/glow sprites.
- [threejs-fireflies](https://github.com/thebenezer/threejs-fireflies) for firefly shader reference.
- [Poly Pizza lantern search](https://poly.pizza/search/lantern) and [firefly search](https://poly.pizza/search/firefly) for prop/effect review.

### 16. Lookout, Map Board, Horizon Marker, And Day 100 Display

Needed for Days 86-100: lookout platform, simple map board, horizon marker, sketch/map prop, Day 100 fire/lookout gathering scene, map/horizon highlight, and keepsake display.

References:

- [tower-blocks](https://github.com/feldhaus/tower-blocks) for staged tower construction in Three.js.
- [Stack](https://github.com/KonradLinkowski/Stack) for clean stacked/tower object animation reference.
- [Three.js LOD example](https://threejs.org/examples/#webgl_lod) for distant horizon marker handling.
- [Three.js Decals example](https://threejs.org/examples/#webgl_decals) for map-board markings and painted keepsake detail.
- [Poly Pizza lookout search](https://poly.pizza/search/lookout), [map search](https://poly.pizza/search/map), [tower search](https://poly.pizza/search/tower), and [keepsake search](https://poly.pizza/search/keepsake) for model references.

### 17. Major Project Options

Needed for Days 91-95: choose one capstone asset family, then stage it over multiple days. Candidate families are improved boat, signal tower, garden pergola, or community table.

References:

- Improved boat: [ThreeJs-boat-in-water](https://github.com/DionatanStocco/ThreeJs-boat-in-water), [3dc](https://github.com/deshaser/3dc), [voyage](https://github.com/Sunil56224972/voyage), [Kenney Watercraft Kit](https://kenney.nl/assets/watercraft-kit), and [Poly Pizza boat search](https://poly.pizza/search/boat).
- Signal tower: [tower-blocks](https://github.com/feldhaus/tower-blocks), [Stack](https://github.com/KonradLinkowski/Stack), [stack-tower-3d](https://github.com/saadamirpk/stack-tower-3d), [Three.js LOD example](https://threejs.org/examples/#webgl_lod), and [Poly Pizza signal search](https://poly.pizza/search/signal).
- Garden pergola: [threed-garden](https://github.com/marty-mcgee/threed-garden), [karesansui](https://github.com/vibertthio/karesansui), [3D_Garden](https://github.com/moonglitch/3D_Garden), and [Poly Pizza pergola search](https://poly.pizza/search/pergola).
- Community table: [furniture-design-app-react-threejs](https://github.com/neethila-knk/furniture-design-app-react-threejs), [ThreeJS-Furniture-Store](https://github.com/Harkirattttt/ThreeJS-Furniture-Store), [A-Reading-Room-ThreeJS](https://github.com/mdfahimrahman22/A-Reading-Room-ThreeJS), [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit), and [Poly Pizza table search](https://poly.pizza/search/table).

## BB Animation Backlog And Motion References

Use these as animation planning references, not as pre-approved imports. Before adding any downloaded clip, confirm rig compatibility, license, retargeting cost, loopability, root-motion expectations, and whether the clip can be driven by `worldState.bubbleBoy.currentAction` without making rendering authoritative.

Existing local coverage:

- `scene.js` loads `RobotExpressive.glb` and uses `AnimationMixer` with base locomotion states `Idle`, `Walking`, and `Running`.
- Current action coverage is mostly approximate: `foraging` and `sleep` map to `Sitting`; `fishing`, `cookingFish`, `gatheringWood`, and `building` map to `Punch`; `playToy` maps to `Jump`; `celebrate` maps to `ThumbsUp`.
- Current procedural fallback already adds gaze, head tracking, breathing, bounce, simple arm motion, sleep pose, play pose, and celebration pose.
- The 100-day loop will need task-specific clips or additive upper-body overlays so BB can remain readable while carrying, building, fishing, gardening, rowing, and interacting with props.

Day 1-5 starter animation subset to review first: arrival/look-around, gather loose sticks/leaves, bend/pickup, carry visible bundle, light/tend fire, tie/build hammock, lie down, sleep loop, wake/stretch.

General animation-system references:

- [Three.js Animation System manual](https://threejs.org/docs/#manual/en/introduction/Animation-system) for the mixer/action/clip model.
- [Three.js AnimationMixer docs](https://threejs.org/docs/#api/en/animation/AnimationMixer) for authoritative clip playback from render state.
- [Three.js AnimationAction docs](https://threejs.org/docs/#api/en/animation/AnimationAction) for fade, loop, and weight behavior.
- [Three.js GLTF Loader example](https://threejs.org/examples/#webgl_loader_gltf) for animation-bearing GLB review.

### 1. Locomotion, Turning, And Route Following

Needed for all days: idle, slow walk, normal walk, short jog, turn-in-place, stop/start, approach target, and route-follow movement between camp objects.

References:

- [Three.js Walk example](https://threejs.org/examples/#webgl_animation_walk) for a focused walk-cycle reference.
- [Three.js Skinning Blending example](https://threejs.org/examples/#webgl_animation_skinning_blending) for locomotion blend/fade behavior.
- [walk-run-jump-with-threejs](https://github.com/Creolestudios/walk-run-jump-with-threejs) for Mixamo-based walk/run/jump setup.
- [threejs-character-controls](https://github.com/Alex-DG/threejs-character-controls) for third-person character movement with animation states.
- [threejs-character-controller](https://github.com/slopware/threejs-character-controller) for a compact third-person controller reference.

### 2. Attention, Arrival, And Player-Facing Emotes

Needed for Days 1-5 and repeated milestones: arrive, look around, orient to island, wave/respond to player, nod yes/no, inspect object, point/notice, small surprise, and quiet celebration.

References:

- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for layering emotes over base movement.
- [Three.js Skinning Blending example](https://threejs.org/examples/#webgl_animation_skinning_blending) for cross-fading between emotional states.
- [detain/mixamo-animation-threejs](https://github.com/detain/mixamo-animation-threejs) for a simple Mixamo-to-Three.js animation pipeline.
- [emotive-engine](https://github.com/joshtol/emotive-engine) for gesture/emotion animation reference.
- [Mixamo](https://www.mixamo.com/) for candidate gesture clips such as waving, looking, cheering, and idle variants.

### 3. Gather, Bend, Pickup, Carry, And Deposit

Needed for Days 1-15 and major builds: crouch/bend, pick up loose item, gather sticks/leaves/wood, carry bundle, carry plank/log, deposit into pile/storage, and set item down.

References:

- [Three.js Keyframes example](https://threejs.org/examples/#webgl_animation_keyframes) for authored pickup/deposit clip timing.
- [Three.js Skinning IK example](https://threejs.org/examples/#webgl_animation_skinning_ik) for hand-to-prop alignment ideas.
- [threejs-survival-game](https://github.com/dwade30/threejs-survival-game) for resource collection/crafting behavior context.
- [voxel-craft-rt](https://github.com/decemyn/voxel-craft-rt) for gather/crafting loop references.
- [ActorCore](https://actorcore.reallusion.com/) for possible humanoid utility/work motion references.

### 4. Fire Care, Warmth, Refueling, And Cooking

Needed for Days 1-10 and food loops: light fire, kneel or crouch at fire, warm hands, add fuel, fan/stoke fire, cook fish/meal, stir pot, hold/eat food.

References:

- [threejs-campfire](https://github.com/AdonousTech/threejs-campfire) for campfire scene timing and focal distance.
- [threejs-campfire-scene](https://github.com/TheDevelolper/threejs-campfire-scene) for fire-adjacent staging.
- [ThreeJS_CampFire](https://github.com/AlexOUKS/ThreeJS_CampFire) for another campfire implementation.
- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for upper-body warm-hands and stoking overlays.
- [MoCap Online](https://mocaponline.com/) for utility and cooking-like humanoid motion references.

### 5. Hammock, Bed, Rest, Sleep, And Wake

Needed for Days 1-5, 21-25, and every day transition: sit on rest spot, climb/settle into hammock or bed, lie down, sleep loop, wake, stretch, stand up.

References:

- [Three.js Skinning Blending example](https://threejs.org/examples/#webgl_animation_skinning_blending) for sit/lie/wake cross-fades.
- [Three.js Keyframes example](https://threejs.org/examples/#webgl_animation_keyframes) for authored sleep transition timing.
- [detain/mixamo-animation-threejs](https://github.com/detain/mixamo-animation-threejs) for importing single-purpose humanoid clips.
- [Mixamo](https://www.mixamo.com/) for sit, sleep-like idle, getting-up, and stretch candidate clips.
- [ActorCore](https://actorcore.reallusion.com/) for seated/resting motion references.

### 6. Build, Tie, Craft, Repair, And Reinforce

Needed for Days 1-25, 41-50, 76-80, and 91-95: hammer/strike, tie rope/vines, place plank, push post upright, carve/craft tool, use workbench, inspect progress, repair and reinforce shelter.

References:

- [Three.js Skinning IK example](https://threejs.org/examples/#webgl_animation_skinning_ik) for hand-to-tool or hand-to-post alignment.
- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for upper-body work overlays while feet remain planted.
- [tower-blocks](https://github.com/feldhaus/tower-blocks) for staged build timing and tower assembly references.
- [voxel-craft-rt](https://github.com/decemyn/voxel-craft-rt) for crafting/building loop context.
- [MoCap Online](https://mocaponline.com/) for construction, repair, and utility motion references.

### 7. Camp Storage, Sorting, Tidying, And Sitting

Needed for Days 6-10, 21-25, and reflection beats: sort materials, deposit/withdraw from basket or crate, tidy camp, sit near fire, rest inside shelter, and inspect layout.

References:

- [Three.js Animation Multiple example](https://threejs.org/examples/#webgl_animation_multiple) for coordinating repeated idle/task loops.
- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for seated and sorting upper-body overlays.
- [furniture-design-app-react-threejs](https://github.com/neethila-knk/furniture-design-app-react-threejs) for furniture/proximity interaction context.
- [A-Reading-Room-ThreeJS](https://github.com/mdfahimrahman22/A-Reading-Room-ThreeJS) for seated/table scene staging.
- [Mixamo](https://www.mixamo.com/) for seated idle, reaching, and object-handling clip candidates.

### 8. Path, Clearing, Raking, And Ground Work

Needed for Days 16-20 and camp upkeep: rake/clear path, sweep leaves, place boundary stones, kneel to mark zones, and walk inspection routes.

References:

- [Three.js Keyframes example](https://threejs.org/examples/#webgl_animation_keyframes) for authored raking/sweeping cycles.
- [Three.js Skinning IK example](https://threejs.org/examples/#webgl_animation_skinning_ik) for tool-ground contact references.
- [karesansui](https://github.com/vibertthio/karesansui) for raked-garden visual context.
- [threed-garden](https://github.com/marty-mcgee/threed-garden) for ground/garden interaction context.
- [MoCap Online](https://mocaponline.com/) for sweeping, raking, and utility motion references.

### 9. Garden, Watering, Harvest, And Food Prep

Needed for Days 26-35: dig, plant seed, pat soil, water plot, inspect sprout, harvest crop, carry harvest, cook/store/eat meal.

References:

- [threed-garden](https://github.com/marty-mcgee/threed-garden) for a 3D garden environment reference.
- [3D_Garden](https://github.com/moonglitch/3D_Garden) for garden interaction context.
- [Three.js Keyframes example](https://threejs.org/examples/#webgl_animation_keyframes) for planting/watering/harvest timing.
- [Three.js Skinning IK example](https://threejs.org/examples/#webgl_animation_skinning_ik) for hand-to-plot and hand-to-tool alignment.
- [ActorCore](https://actorcore.reallusion.com/) for gardening-like utility motion candidates.

### 10. Fishing, Trap Checking, Pier Use, And Shore Routine

Needed for Days 31-35, 41-45, and 56-60: cast, wait, reel, catch reaction, fish from pier, set trap, check trap, collect catch, and hang catch on drying rack.

References:

- [hook-a-fish](https://github.com/dammafra/hook-a-fish) for Three.js fishing interaction staging.
- [vr-fishing](https://github.com/gitfrandu4/vr-fishing) for fishing-line and body/hand reference.
- [tideline](https://github.com/bridge-mind/tideline) for procedural browser fishing context.
- [Three.js Skinning IK example](https://threejs.org/examples/#webgl_animation_skinning_ik) for rod/hand alignment.
- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for cast/reel overlays.

### 11. Raft Assembly, Launch, Boarding, Paddle, And Return

Needed for Days 46-55 and possible capstone boat work: carry logs, lash raft, push raft, board, sit/stand aboard, paddle/row, look out, disembark, return and celebrate.

References:

- [ThreeJs-boat-in-water](https://github.com/DionatanStocco/ThreeJs-boat-in-water) for boat/water staging.
- [3dc](https://github.com/deshaser/3dc) for a Three.js boat-on-water scene.
- [voyage](https://github.com/Sunil56224972/voyage) for floating raft and route-style presentation.
- [Three.js Keyframes example](https://threejs.org/examples/#webgl_animation_keyframes) for push/board/paddle cycle timing.
- [MoCap Online](https://mocaponline.com/) for rowing/paddling and object-push motion references.

### 12. Toys, Play, Ball, Kite, And Spinning Top

Needed for Days 61-65: craft toy, place toy, play blocks, hop/jump, kick or toss ball, launch/fly kite, wind-reactive kite holding, spin top, put toy away.

References:

- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for playful upper-body overlays.
- [walk-run-jump-with-threejs](https://github.com/Creolestudios/walk-run-jump-with-threejs) for jump and active locomotion references.
- [threejs-game](https://github.com/amilajack/threejs-game) for a simple Three.js game-object baseline.
- [toy-threejs-game](https://github.com/ribbon-otter/toy-threejs-game) for simple toy-like interaction staging.
- [Mixamo](https://www.mixamo.com/) for jump, kick, throw, and playful gesture candidates.

### 13. Music, Art, Decoration, And Performance

Needed for Days 66-70: paint stone, place decoration, hang shell chime, play drum/flute, tap rhythm, perform at dusk/night, and admire display.

References:

- [Music-Visualizer](https://github.com/KanteLabs/Music-Visualizer) for Three.js audio-reactive timing ideas.
- [arpeggiator](https://github.com/collidingScopes/arpeggiator) for interactive music gesture context.
- [3d-music-visualizer](https://github.com/l1ve4code/3d-music-visualizer) for simple audio/visual rhythm reference.
- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for rhythmic upper-body overlays.
- [Mixamo](https://www.mixamo.com/) for dancing, clapping, and performance gesture candidates.

### 14. Animal Familiarity And Gentle Interaction

Needed for Days 71-75: observe from distance, crouch, offer food, slow wave, respond happily, avoid chasing, and return to routine.

References:

- [Three.js Morph Targets Horse example](https://threejs.org/examples/#webgl_morphtargets_horse) for simple creature animation reference.
- [Three.js GPGPU Birds example](https://threejs.org/examples/#webgl_gpgpu_birds) for recurring bird motion.
- [solar-critters](https://github.com/JacobFV/solar-critters) for small procedural animal character ideas.
- [r3f-sims-online](https://github.com/Hussain-7/r3f-sims-online) for Animal Crossing-like entity presentation.
- [Three.js Skinning IK example](https://threejs.org/examples/#webgl_animation_skinning_ik) for hand-to-food offering alignment.

### 15. Weather, Shelter Safety, Lanterns, And Night Comfort

Needed for Days 76-85: brace against wind, hurry to shelter, reinforce during storm, light lantern, carry light, walk lit path, sit comfortably at night.

References:

- [Three.js Skinning Blending example](https://threejs.org/examples/#webgl_animation_skinning_blending) for urgent-to-calm state transitions.
- [Three.js Additive Blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending) for wind-brace and carry-light overlays.
- [threejs-fireflies](https://github.com/thebenezer/threejs-fireflies) for night comfort effect context.
- [threejs-campfire-scene](https://github.com/TheDevelolper/threejs-campfire-scene) for night/fire posture staging.
- [ActorCore](https://actorcore.reallusion.com/) for carry, cautious walk, and weather-reactive motion candidates.

### 16. Lookout, Map, Horizon Watch, And Day 100 Reflection

Needed for Days 86-100: climb/step onto lookout, stand at lookout, shade eyes, sketch map, point to horizon, visit key objects, sit reflectively, quiet celebration, and continue sandbox idle afterward.

References:

- [Three.js Keyframes example](https://threejs.org/examples/#webgl_animation_keyframes) for authored climb/observe/sketch timing.
- [Three.js Skinning IK example](https://threejs.org/examples/#webgl_animation_skinning_ik) for hand-to-map and hand-to-rail alignment.
- [tower-blocks](https://github.com/feldhaus/tower-blocks) for staged tower/lookout context.
- [Stack](https://github.com/KonradLinkowski/Stack) for vertical stacked structure motion reference.
- [Mixamo](https://www.mixamo.com/) for climb, point, look-around, and idle reflection candidate clips.
