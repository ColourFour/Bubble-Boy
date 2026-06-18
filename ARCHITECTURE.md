# Bubble Boy Architecture

Bubble Boy is moving to a simulation-first architecture. The simulation owns all state transitions. Rendering, UI, input, and any future intelligence features must project from or submit intent into that simulation. They must not become alternate sources of truth.

## Required Layer Model

```text
User input
  -> Input Layer
  -> intent signals
  -> Simulation Layer
  -> worldState
  -> Presentation Layer
  -> pixels/audio/UI display
```

The only authoritative update path is:

```text
worldState = simulate(dt, worldState, intents)
```

No layer may bypass this path to change Bubble Boy, the environment, lighting, animation state, or interaction outcomes.

## A. Simulation Layer: Authority

The Simulation Layer owns every state transition in the world.

Required interface:

```js
simulate(dt, worldState, intents) -> worldState
```

Rules:

- `simulate` is the single authority for world updates.
- Simulation logic must be deterministic for the same initial `worldState`, `dt`, and `intents`.
- Simulation logic must not read from Three.js objects, DOM state, browser animation state, wall-clock time, random globals, or UI controls directly.
- Simulation logic must not mutate render meshes, materials, cameras, lights, DOM nodes, or input devices.
- Simulation logic may only update the explicit `worldState` object.
- All behavior decisions must be rules-based. Runtime AI, LLM calls, behavior trees, and model-driven decisions are not part of the simulation core.

Simulation responsibilities:

- Time progression.
- Bubble Boy needs, mood, goals, actions, movement, and interactions.
- Environment state such as day/night, wind, temperature, fire state, and safety conditions.
- Entity state transitions for future non-AI friends.
- Collision, proximity, trigger, and interaction decisions when implemented.
- Event generation for presentation and debugging, if events are stored in `worldState`.

Forbidden responsibilities:

- Mesh creation.
- Animation blending.
- Lighting implementation.
- Camera behavior.
- DOM updates.
- UI state.
- Direct user input handling.
- LLM or agent calls.

## B. World State Layer: Single Source Of Truth

`worldState` is the complete serialized model of the simulation. No hidden state is allowed anywhere else.

All state needed to continue the world must live in `worldState`. If restarting from a saved `worldState` cannot reproduce the same simulation path with the same future inputs and `dt`, the architecture boundary has been violated.

Canonical shape:

```js
worldState = {
  version: 1,
  sim: {
    tick: 0,
    elapsedSeconds: 0,
    fixedDt: 1 / 60,
    accumulator: 0,
    seed: 0
  },
  time: {
    day: 1,
    timeOfDay: 0,
    dayLengthSeconds: 600,
    phase: "dawn" // dawn | day | dusk | night
  },
  bubbleBoy: {
    id: "bubble-boy",
    energy: 100,
    hunger: 0,
    mood: "calm",
    attention: "idle",
    goal: "wander",
    currentAction: "idle",
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    facing: 0,
    targetId: null,
    actionTimer: 0
  },
  environment: {
    weather: "clear",
    wind: {
      direction: 0,
      strength: 0
    },
    temperature: 20,
    light: {
      sunAngle: 0,
      intensity: 1,
      color: "#ffffff"
    },
    safety: {
      nightRisk: 0,
      shelterAvailable: false,
      fireWarmthRadius: 0
    }
  },
  objects: {
    firePit: {
      id: "fire-pit",
      type: "firePit",
      position: { x: 0, y: 0, z: 0 },
      lit: false,
      warmth: 0,
      fuel: 0
    }
  },
  entities: {},
  intents: [],
  events: []
}
```

Schema rules:

- `worldState` is the only source of truth.
- No simulation state may be stored only inside Three.js meshes, animation mixers, material uniforms, DOM elements, timers, closures, or module-level mutable variables.
- Render caches are allowed only when they can be fully rebuilt from `worldState`.
- Input state is transient and must be converted to intent signals before simulation.
- Presentation-only interpolation state must never affect future simulation decisions.

## C. Presentation Layer: Three.js/WebGL

The Presentation Layer is a pure visual projection of `worldState`.

Required interface:

```js
render(worldState, renderContext)
```

Rules:

- Presentation reads `worldState` and renders visuals.
- Presentation must not decide Bubble Boy behavior.
- Presentation must not mutate simulation state.
- Presentation must not trigger actions directly.
- Animation must be state-driven only.
- Lighting must derive from `worldState.environment.light` and `worldState.time`.
- Bubble Boy meshes must reflect `worldState.bubbleBoy`, not internal idle logic.

Allowed presentation responsibilities:

- Create and cache Three.js scene objects.
- Map state to mesh transforms.
- Map `currentAction`, mood, velocity, and timers to poses.
- Interpolate between previous and current state for smooth visuals.
- Render terrain, water, props, lighting, particles, shadows, and camera view.
- Display debug overlays derived from `worldState`.

Forbidden presentation responsibilities:

- Choosing Bubble Boy goals.
- Updating energy, hunger, mood, attention, or actions.
- Running idle behavior.
- Advancing day/night state.
- Inferring interactions from mesh proximity as an authority.
- Treating animation callbacks as simulation events.

## D. Input Layer

The Input Layer converts user input into intent signals.

Required interface:

```js
collectInput(inputDevices) -> intents
```

Intent examples:

```js
{ type: "move", direction: { x: 1, z: 0 } }
{ type: "interact", targetId: "fire-pit" }
{ type: "cameraOrbit", delta: { x: 0.2, y: -0.1 } }
{ type: "pause", value: true }
```

Rules:

- Input may create intent signals only.
- Input must not mutate `worldState`.
- Input must not move meshes directly.
- Input must not trigger animation directly.
- UI buttons may request actions, but `simulate` decides whether those actions are valid.
- Camera-only intents may be handled by presentation if they do not affect simulation state.

## Boundary Enforcement

Architecture constraints:

- No AI behavior systems in runtime.
- No AI decision making in the simulation core.
- No direct mutation from the rendering layer.
- No coupling between UI and simulation logic.
- No new engine rewrite.
- The current Three.js setup remains the presentation implementation.

Practical enforcement checks:

- Behavior code belongs in simulation modules, not Three.js scene, character, idle, or control modules.
- Three.js modules may import state readers and render helpers, but not simulation mutation helpers except through the top-level application loop.
- UI modules may submit intents, but not call behavior or animation internals.
- A headless simulation test must be able to run without WebGL, DOM, canvas, or browser input.

## Future Intelligence Boundary

Any future LLM or agent feature is outside the simulation authority. It may suggest high-level intent or content for human-approved tools, but it must never override `simulate`, directly mutate `worldState`, or become a runtime behavior engine.

