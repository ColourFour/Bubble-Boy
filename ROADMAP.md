# Bubble Boy Roadmap

The project direction is a cozy, living, vibrant simulation world with Bubble Boy and future entities. The path is stability first: build a deterministic simulation substrate, then make Three.js a pure projection of that state.

This is not an AI agent system. It is not an emergent chatbot world. It is a simulation first. Everything else is a projection layer.

## Phase 1: Simulation Backbone

Stability first.

Scope:

- Implement the canonical `worldState` object.
- Implement `simulate(dt, worldState, intents)`.
- Define deterministic update order.
- Move state transitions out of Three.js modules.
- Remove behavioral logic from render, idle, character, scene, and control modules.
- Convert user input into intent signals only.
- Add headless simulation test mode.
- Add long-run simulation checks.

Goal:

- The system runs for 10-30 minutes with zero divergence or crashes.

Acceptance checks:

- Simulation can run without WebGL, DOM, or canvas.
- Replaying the same initial state and intent stream produces the same final state.
- Bubble Boy state is inspectable in one `worldState` object.
- No hidden behavior state remains in renderer-only modules.

## Phase 2: Rendering Decoupling

Make Three.js a pure renderer.

Scope:

- Connect Three.js to `worldState` as read-only input.
- Make Bubble Boy a state-driven mesh.
- Drive lighting only from `worldState.time` and `worldState.environment.light`.
- Replace render-owned animation decisions with state-to-pose mapping.
- Keep presentation interpolation separate from simulation state.
- Audit scene, character, idle, terrain, controls, and lighting code for logic leaks.

Goal:

- The visual world fully reflects simulation state with no logic leaks.

Acceptance checks:

- Renderer can be rebuilt from `worldState`.
- Render frame rate changes do not change simulation outcomes.
- Animation callbacks do not update needs, goals, actions, or environment.
- Day/night visuals are derived from simulation time only.

## Phase 3: Bubble Boy Consistency Layer

Make Bubble Boy predictable.

Scope:

- Implement stable idle/action state.
- Add deterministic goal and action transitions.
- Make energy, hunger, mood, and attention fully functional.
- Add basic interaction rules for fire, movement, and rest.
- Add transition guards to prevent chaotic action switching.
- Add tests for low energy, hunger, fire proximity, night behavior, and user intents.

Goal:

- Bubble Boy behaves predictably without randomness chaos.

Acceptance checks:

- Low energy reliably causes rest.
- Idle reliably becomes wander or look-around based on rules.
- Nearby lit fire affects attention and warmth behavior.
- Repeated runs produce identical action timelines.

## Phase 4: World Richness Expansion

Make the world feel alive without AI.

Scope:

- Add environmental objects:
  - Fire pit.
  - Trees with interaction states.
  - Rocks.
  - Shelters.
  - Simple props.
- Add environmental simulation:
  - Wind.
  - Temperature.
  - Night safety.
  - Rest behavior affected by safety and warmth.
- Define object schemas and deterministic interaction rules.
- Keep object state inside `worldState`.

Goal:

- The world feels alive without AI.

Acceptance checks:

- Environmental objects expose explicit state.
- Wind, temperature, and night safety change behavior through rules.
- Bubble Boy chooses warmth, shelter, rest, or wandering from deterministic conditions.
- Visual changes remain projections of simulation state.

## Phase 5: Social Expansion

Add friends as simple non-AI entities.

Scope:

- Introduce friend entities using the same state machine model.
- Give each friend explicit needs, mood, goal, action, position, and velocity.
- Add simple interaction rules:
  - Follow.
  - Sit together.
  - Respond to fire.
  - Rest near safe or warm locations.
- Add shared environment behaviors.
- Keep all friend behavior deterministic.

Goal:

- Cozy group dynamics emerge from rules, not intelligence.

Acceptance checks:

- Friends can be simulated headlessly.
- Friend behavior is reproducible from initial state and intents.
- Group interactions come from proximity, state, and priority rules.
- No runtime AI controls entity behavior.

## Phase 6: Cozy World Polish Layer

Improve tone and presentation without changing logic.

Scope:

- Visual warmth pass.
- Lighting refinement.
- Idle ambient life loops.
- Small environmental animations.
- Emotional tone tuning through state-to-pose and state-to-material mapping.
- Camera and composition polish.
- Sound or ambient effects only if they remain presentation-only.

Goal:

- The world feels emotionally alive, warm, and slow.

Acceptance checks:

- Polish changes do not alter simulation outcomes.
- Ambient animations are driven by `worldState` or presentation-only clocks that cannot feed back into simulation.
- Lighting and color remain explainable from state.
- Bubble Boy's emotional read is consistent with `mood`, `attention`, and `currentAction`.

## Phase 7: Optional Intelligence Layer

Future extension only. Do not implement yet.

Scope:

- Consider LLM integration only as a suggestion layer.
- LLM output may propose intents, names, text, or content.
- Human approval is required for durable changes.
- Simulation remains the authority.
- LLM output must never directly mutate `worldState`.
- LLM output must never override deterministic rules.

Goal:

- Optional intelligence can enrich content without weakening the simulation architecture.

Acceptance checks:

- The simulation runs identically with the intelligence layer disabled.
- All accepted suggestions enter as explicit intents or approved data.
- Deterministic rules remain the final authority.

## Non-Negotiable Constraints

- No AI behavior systems in runtime.
- No AI decision making in simulation core.
- No direct mutation from rendering layer.
- No coupling between UI and simulation logic.
- No new engine rewrite.
- Remain compatible with the current Three.js setup.
- All durable world behavior must be reproducible from `worldState`, `dt`, and intents.

