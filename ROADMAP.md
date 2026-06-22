# Bubble Boy Roadmap

Bubble Boy is a local, simulation-first AI pet. The runtime rule is simple:
`simulate(dt, worldState, intents)` owns authoritative state changes, and rendering
projects from `worldState`.

This is not an emergent chatbot world and not a runtime AI-agent behavior system.
The model may suggest approved changes, text, or intents, but deterministic
simulation remains the source of truth.

## Current Baseline

As of 2026-06-22, the foundation is implemented and should be protected before
more asset or animation work is stacked on top.

Implemented:

- Canonical toybox `worldState`.
- Deterministic `simulate(dt, worldState, intents)` update loop.
- Headless Node regression tests for simulation behavior.
- Presentation resolver and registries for visual descriptors, animation
  fallbacks, carry attachments, source/license metadata, transform normalization,
  and debug traces.
- Three.js `/toybox` scene that reads simulation and presentation state.
- Deterministic camera controls and developer-only review mode.
- Early island slice covering day 1-20 style assets: ocean, sky, Bubble Boy,
  fire, workbench, build sites, shelter/bed/toy progression, resource forest,
  arrival supplies, storage/workbench/tools, camp paths/zones/boundary stones,
  cleared ground, garden plots, and debug traces.
- Safe proposal/approval loop for durable writes inside `bubble/`.
- Main web UI with status, chat, proposals, and sandboxed toybox iframe.

Current quality bar:

- Simulation tests must pass without WebGL, DOM, or canvas.
- Presentation code must not mutate authoritative simulation state.
- Animation must not move Bubble Boy independently of simulation position.
- Every new visual family needs registry metadata, a world-state hook or explicit
  placeholder state, fallback behavior, focused tests, and screenshots.

## Phase 1: Stabilize The Simulation Baseline

Status: done, keep guarded.

Purpose:

- Keep deterministic behavior green before adding more assets or animations.
- Treat failing regressions as blockers for new visual-family work.

Acceptance checks:

- `node --test tests/sim/simRegression.test.js` passes.
- `node --test tests/sim/presentationState.test.js` passes.
- `node --test tests/sim/cameraControls.test.js` passes.
- Replaying the same initial state and intent stream produces the same final
  state.
- No presentation or render module is required for simulation tests to pass.

## Phase 2: Presentation Contract And Asset Review Discipline

Status: in progress.

Purpose:

- Keep asset additions auditable instead of accumulating dead art in the scene.
- Ensure visual families are connected to state, visible when intended, hidden
  when inactive, and safe when assets or clips are missing.

Required for each asset or animation family:

- Registry entry.
- World-state hook or explicit placeholder state.
- Source metadata.
- License metadata for local or external assets.
- Transform normalization metadata.
- Debug/canvas trace visibility.
- Missing asset fallback.
- Missing animation clip fallback.
- Duplicate-system classification.
- Focused presentation resolver tests.
- Developer-only visual review path.
- Screenshots saved under `reports/toybox-asset-review/`.

Do not add new visual families when the simulation regression suite is red.

## Phase 3: Early Island Life Loop

Status: in progress.

Purpose:

- Make the current day 1-20 island loop feel coherent without broadening the
  game into a larger crafting or survival system.

Keep improving:

- Fire tending, warmth, and day/night behavior.
- Foraging, fishing, cooking, and eating fish.
- Rest, shelter, bed, and toy play progression.
- Builder work and small camp improvements.
- Resource regrowth and simple environmental pressure.
- Garden and cleared-ground states only where they support the early island
  slice.

Acceptance checks:

- Behavior remains deterministic and testable headlessly.
- Visuals remain projections of simulation state.
- No render-time mutation of needs, goals, actions, inventory, or environment.
- No expansion of the 100-day loop until the early slice is stable.

## Phase 4: Safe Toybox State Updates

Status: next.

Purpose:

- Let approved proposals change toybox data through narrow, deterministic
  handlers without giving model output arbitrary write power.

Scope:

- Add explicit handlers for a small number of toybox-state changes.
- Keep all durable writes inside `bubble/`.
- Validate proposal shape before mutation.
- Record applied files and timestamps.
- Add policy and approval tests for every handler.

Acceptance checks:

- Invalid or unsupported proposals are blocked.
- The model never writes executable code or arbitrary paths.
- Toybox state changes are deterministic and inspectable.

## Phase 5: Local Demo Polish

Status: next after the early loop and review discipline stay green.

Purpose:

- Package the current experience into a reliable local demo.

Scope:

- Improve first-run setup docs.
- Add seed world data where useful.
- Tighten visual coherence for the existing toybox families.
- Keep procedural placeholder assets auditable.
- Improve empty/error states in the UI.

Acceptance checks:

- A fresh local checkout can run the UI and toybox with documented commands.
- The app remains useful without model API settings by using the mock brain.
- Demo polish does not change simulation outcomes.

## Phase 6: Social Expansion

Status: later.

Purpose:

- Add friends as deterministic non-AI entities after the one-creature loop is
  stable.

Scope:

- Friend entities use explicit needs, mood, goal, action, position, and velocity.
- Group behavior emerges from proximity, state, and priority rules.
- Interactions include follow, sit together, rest near warmth, and respond to
  shared safety conditions.

Acceptance checks:

- Friends can be simulated headlessly.
- Friend behavior is reproducible from initial state and intents.
- No runtime AI controls entity behavior.

## Phase 7: Optional Intelligence Layer

Status: do not start yet.

Purpose:

- Consider LLM enrichment only after deterministic simulation, approval safety,
  and local demo stability are strong.

Allowed future shape:

- LLM output may propose text, names, flavor, intents, or approved content.
- Human approval is required for durable changes.
- Accepted suggestions enter the system as explicit intents or approved data.
- The simulation runs identically with this layer disabled.

Not allowed:

- Direct mutation of `worldState`.
- Runtime AI decision-making for entity behavior.
- Model output overriding deterministic rules.

## Non-Negotiable Constraints

- No AI decision-making in the simulation core.
- No rendering or presentation mutation of authoritative state.
- No root-motion movement overriding simulation position.
- No broad engine rewrite.
- No unrelated families during stabilization passes.
- No generic crafting or inventory system unless explicitly scoped.
- No new heavy visual tooling unless the repo already requires it.
- No direct execution of arbitrary model output.
- Durable world behavior must be reproducible from `worldState`, `dt`, and
  intents.
