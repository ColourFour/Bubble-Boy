# First Five Days Visual State Report

Date: 2026-06-27
Scope: current project state for making Days 1-5 feel coherent, cozy, and immersive.

## Executive Summary

The first-five-days idea is now present in code as an authored `lifeLoop`: Day 1 arrival/rest spot, Day 2 exploration/camp marking, Day 3 clearing/starting shelter, Day 4 shelter/fish/cook, and Day 5 finish/rest/tend/celebrate. The focused Day 1-5 tests pass, and the live toybox boots without a WebGL error.

The main blocker is no longer "does the sequence exist?" It is "does the sequence read correctly on screen?" Right now it often does not. The visual scene still feels like broad procedural coverage and debug scaffolding: oversized tree canopies dominate the camera, the camp reads as a workbench/storage/tool layout too early, the arrival supplies are visually tiny, and the animation/action state can lag behind the HUD objective. These issues kill the stranded-cozy fantasy because the viewer cannot immediately understand the current beat.

The second blocker is regression risk: the new life-loop goal selection is overriding older autonomous behaviors in broad tests. That may be intended during authored Days 1-5, but the current implementation makes `lifeArrive` win in contexts that expected warm-up, wander, user attention, fire interaction, fishing, and builder work. This needs an explicit priority model, not accidental override.

## Verified Current State

Evidence gathered:

- Live `/toybox` loaded successfully at `http://127.0.0.1:8765/toybox`.
- Browser runtime reported `window.__toyboxBoot = "started"` and no `window.__toyboxLastError`.
- Screenshot captured at `/Users/sbrooker/.agent-browser/tmp/screenshots/screenshot-1782566133766.png`.
- Focused JS Day 1-5 coverage passed in `tests/sim/lifeLoopAndPlacement.test.js`.
- Full JS regression run failed: `135 passed, 15 failed`.
- Python suite failed only through the JS regression wrapper: `24 passed, 1 failed`.

Observed live state after a few seconds:

- HUD: `Day 1`, objective `Build a rest spot`, `3 of 4 required objectives complete`.
- `lifeLoop.currentObjective`: `buildRestSpot`.
- Canvas dataset still showed `bubbleBoyGoal: lifeGatherSupplies` and `bubbleBoyAction: gatherLooseSupplies`.
- Active visual families included `arrivalSupplies`, `looseSupplies`, `materialPile`, `firstFire`, `restShelter`, and `storageWorkbenchTools`.
- Renderer debug reported `builderRenderedObjectCount: 102` and `builderTreeCount: 96`.

## What Is Working

- The intended Day 1-5 sequence is codified in `DAY_1_10_LIFE_TRACK`.
- There is real day progression with sleep gating, dawn wakeup, completed objective tracking, and blocker messages.
- Arrival supplies, fire, rest shelter, camp layout, fish/cooking, and shelter construction have state hooks and presentation descriptors.
- The HUD exposes day/objective/sleep readiness.
- The scene has a readable island, water, dawn lighting, fire, Bubble Boy, rest spot, workbench/storage, and many resource trees.
- Placement checks exist and currently report no live placement conflicts.

## Immersion Problems Killing The Cozy Read

1. The camera starts inside a dense forest impression.

The screenshot is dominated by dark trunks, huge canopy shapes, and long shadows. The camp and rest beat are visually secondary. For Day 1, the screen should say "washed ashore, small fire, first nest," not "forest worksite."

2. The first objective beats complete too fast to perceive.

In the live browser, arrival, gather supplies, and fire stabilization completed within the first ~62 ticks. The player landed on "Build a rest spot" before seeing the first three story beats. This makes the loop technically correct but emotionally invisible.

3. HUD and actor state can disagree.

The HUD advanced to `buildRestSpot`, while the canvas dataset still reported `lifeGatherSupplies` / `gatherLooseSupplies`. Even a short mismatch hurts the authored feeling because Bubble Boy appears to do the previous objective while the UI says he is doing the next one.

4. Early camp props reveal too much infrastructure too soon.

Day 1 already shows workbench/storage/tool visuals. A first-night camp should be sparse: wet bundle, sticks, leaves, fire, rough rest spot. Workbench/tool rack/storage should be hidden or visually downgraded until their day.

5. Arrival supplies and material changes are too small compared with world scale.

The state has washed bundle/scattered sticks/leaves/material pile, but in the visual frame those story objects are not the focal read. They need stronger staging, scale, silhouettes, and camera framing.

6. Procedural placeholders lack tactile coziness.

Many props are audit-friendly simple meshes. That is good for testing, but the cozy vibe needs softer color, readable materials, clustered composition, and hand-made imperfection. Current worksite objects look functional, not emotionally inviting.

7. Day 4/5 fish, cooking, shelter completion, and celebration need authored presentation.

Mechanically, fish/cook/shelter completion exist. Visually, they need a coherent chain: shore cast, held fish, cooking surface, cooked fish moment, shelter visibly more complete, rest/use beat, fire-tend beat, then a small celebration tableau.

8. Visual debug breadth creates clutter pressure.

The project has broad placeholder families for later days. Even when hidden, their descriptors and debug traces dominate thinking and make it easy to accidentally reveal future infrastructure. Days 1-5 need a strict visual budget.

## Regression Risks

The full JS regression failures are all consistent with life-loop priority overriding older behavior:

- warm-up expected, got `lifeArrive`
- wander expected, got `lifeArrive`
- user attention expected, got `lifeArrive`
- fire interaction expected, got `lifeArrive`
- low-fire tending expected, got `lifeArrive`
- mild hunger fishing expected, got `lifeArrive`
- builder gather/build/use-bed/use-toy expectations blocked by `lifeArrive`

This needs a deliberate rule: authored day objectives should drive the main story, but urgent needs, direct user interaction, and test/scenario states need clear opt-in or opt-out behavior. Otherwise, the first-five-days loop will feel rigid and unresponsive.

## Target Day 1-5 Experience

Day 1 should read as survival and softness:

- Arrive on a clear shore.
- Notice washed-up bundle.
- Pick up a few supplies.
- Tend a small existing fire.
- Build a crude leaf/sling rest spot close to the fire.
- Sleep with warm, safe lighting.

Day 2 should read as orientation:

- Wake near the rest spot.
- Explore a short, framed route.
- Gather wood.
- Mark camp with visible stones/sticks.
- Sleep after the camp has a named footprint.

Day 3 should read as making space:

- Clear a small camp patch.
- Gather enough wood.
- Start shelter footprint/foundation.
- Sleep beside visibly started shelter.

Day 4 should read as first meal and shelter progress:

- Continue shelter to a recognizable frame/roof.
- Fish at the shore.
- Carry or show the fish.
- Cook it at the fire.
- Sleep warmer and safer.

Day 5 should read as "early camp complete":

- Gather missing materials only if shelter needs them.
- Finish shelter.
- Rest/use bed or rough rest spot.
- Tend fire.
- Celebrate with a quiet completed-camp tableau.

## Staged Work Plan

### Stage 1: Lock The Day 1-5 Contract

Goal: make the authored sequence reliable without breaking old autonomy unexpectedly.

- Add an explicit life-loop priority policy: direct user interactions and urgent survival needs either interrupt or are intentionally queued, with tests covering the decision.
- Fix the `lifeArrive` regression failures or update tests with a clear `lifeLoop` disabled/completed scenario helper where old autonomy is being tested.
- Ensure objective transition resets Bubble Boy goal/action immediately enough that HUD and actor state do not show different story beats for multiple frames.
- Add one trace field for "visible story beat" so visual tests can assert the same beat as the HUD.

Exit criteria:

- `node --test tests/sim/lifeLoopAndPlacement.test.js` passes.
- `node --test tests/sim/simRegression.test.js` passes or intentionally splits life-loop and legacy-autonomy modes.
- HUD objective, `lifeLoop.currentObjective`, `bubbleBoy.goal`, and presentation action are aligned for each Day 1-5 beat.

### Stage 2: Reframe The First Screen

Goal: make the first viewport say "arrival camp," not "forest/debug worksite."

- Move or thin the nearest tree ring around the Day 1 camera/camp composition.
- Reduce canopy dominance in the default follow camera, especially at dawn.
- Hide or downgrade workbench/storage/tool rack on Day 1. Replace with a simple washed bundle and tiny material pile until later days.
- Create a Day 1 camera preset or initial follow offset that frames Bubble Boy, fire, bundle, and rest spot together.
- Increase arrival bundle/sticks/leaves readability through silhouette, contrast, and clustered placement.

Exit criteria:

- First screenshot at `/toybox` clearly shows Bubble Boy, fire, washed supplies, and rest area without hunting for them.
- Workbench/storage/tool visuals are not first-read objects on Day 1.
- Trees frame the camp instead of swallowing it.

### Stage 3: Make Each Objective Visually Legible

Goal: every step should create a visible before/after change.

- Day 1:
  - Washed bundle visible at start.
  - Bundle/scattered supplies visibly reduce or move into a material pile.
  - Fire has a "stabilized" visual state: stronger flame, tidy stones/logs, warmer pool of light.
  - Rest spot builds from nothing into a crude sling/leaves nest.
- Day 2:
  - Explore uses a short route marker/path trace that appears only during the route.
  - Wood gathering shows carried wood and a deposited pile.
  - Mark camp adds 2-4 obvious camp markers, not a full later-day zone system.
- Day 3:
  - Clearing camp removes debris and brightens/opens a small ground patch.
  - Shelter begins as footprint/foundation/posts, not a near-complete shelter.
- Day 4:
  - Shelter progression is visibly different from Day 3.
  - Fishing has a shore stance, line/cast/readable water target, and fish pickup.
  - Cooking fish creates a visible cooking moment at the fire.
- Day 5:
  - Shelter completion has a distinct silhouette.
  - Rest/use beat places BB at the rest spot/shelter.
  - Celebration is a small, warm, quiet pose with completed-camp composition.

Exit criteria:

- A screenshot after each objective can be recognized without reading debug text.
- Visual state changes are small and cozy, not construction-site clutter.

### Stage 4: Replace Placeholder Feel With Cozy Art Direction

Goal: keep procedural assets, but make them feel intentional.

- Establish a compact early-camp palette: warm fire amber, muted beach greens, driftwood browns, soft leaf greens, low-saturation stone.
- Vary scale/rotation of sticks, leaves, stones, and logs for hand-placed charm.
- Add soft ground decals or color patches for cleared ground, ash, sleeping leaves, and trampled paths.
- Add small atmosphere: smoke curl, ember glow, fish steam, sleeping firelight, dawn warmth.
- Keep mesh counts and instancing efficient; art direction should come from composition/materials/lighting first.

Exit criteria:

- Day 1-5 screenshots feel like a coherent tiny diorama.
- The early camp reads warm and safe by Day 5.

### Stage 5: Build Visual Review Harnesses For The Five Days

Goal: make visual quality testable before adding more content.

- Add review states for each exact Day 1-5 objective, not just broad families.
- Add an automated browser capture script for desktop and mobile:
  - Day 1 arrive
  - Day 1 rest built
  - Day 2 marked camp
  - Day 3 shelter started
  - Day 4 cook fish
  - Day 5 completed camp
- Capture dataset checks for objective/action alignment and visible family counts.
- Save screenshots under `reports/first-five-days-visual-review/<date>/`.

Exit criteria:

- A reviewer can compare six screenshots and understand the first five days visually.
- The capture reports fail if debug-only/later-day objects become visible too early.

### Stage 6: Polish Interaction And Pacing

Goal: make the player feel present without derailing the authored loop.

- Slow down first-time objectives enough to see them, especially arrival, supply gather, and fire stabilization.
- Add minimum on-screen dwell time per objective, separate from simulation completion.
- Let direct fire/rest/sleep interactions produce immediate visual acknowledgement even if the authored objective remains queued.
- Make sleep transition more atmospheric: fade, firelight, dawn wake pose.
- Ensure Day 5 celebration pauses long enough to be noticed before moving into Days 6-10 readiness.

Exit criteria:

- The first five days are understandable at normal runtime without pausing or opening debug.
- Player interaction feels acknowledged, not ignored by the life-loop controller.

## Recommended Next Implementation Order

1. Fix life-loop priority/test regressions.
2. Align HUD/objective/action/presentation state.
3. Recompose the Day 1 default scene and hide premature infrastructure.
4. Add per-objective review states and screenshots.
5. Polish Day 1-2 visuals first, then Day 3-5 shelter/fish/celebration.

## Done Definition For "First 5 Days Are Great"

- Full regression suite is green.
- Six objective screenshots tell a coherent visual story without debug text.
- First viewport is emotionally clear: small creature, warm fire, supplies, rough rest, island context.
- Every Day 1-5 action has an obvious visual before/after.
- No later-day or overbuilt camp assets appear before they are earned.
- Day 5 produces a visibly completed early camp: shelter, rest spot/bed, tended fire, tidy material pile, and Bubble Boy celebrating quietly.
