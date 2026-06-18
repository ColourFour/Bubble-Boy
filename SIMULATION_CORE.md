# Simulation Core

The simulation core is the deterministic substrate for Bubble Boy. It defines the world update loop, the world model, and the rules that produce behavior. Rendering is not part of this layer.

## Core Loop

Authoritative function:

```js
simulate(dt, worldState, intents = []) -> worldState
```

`dt` is elapsed simulation time in seconds. The preferred runtime is a fixed timestep at 60 ticks per second:

```text
fixedDt = 1 / 60
```

The browser may render at variable frame rates, but simulation should advance through fixed ticks when stability matters:

```js
accumulator += frameDt

while (accumulator >= fixedDt) {
  worldState = simulate(fixedDt, worldState, intentsForTick)
  accumulator -= fixedDt
}

render(worldState)
```

Headless tests may call `simulate(1 / 60, worldState, intents)` directly for thousands of ticks without creating a renderer.

## Deterministic Update Order

Each tick must update in a stable order:

1. Normalize and validate input intents.
2. Advance simulation counters and time of day.
3. Update environmental systems.
4. Update object states.
5. Evaluate Bubble Boy needs.
6. Select Bubble Boy goal from deterministic rules.
7. Select or continue Bubble Boy action.
8. Integrate movement and position.
9. Resolve interactions and triggers.
10. Emit deterministic events.
11. Clamp values and validate invariants.

Rules:

- Do not iterate unordered maps when order can affect outcomes.
- Do not use `Math.random()` in simulation logic.
- Use seeded deterministic values only when variation is required.
- Do not read wall-clock time in simulation logic.
- Do not depend on render frame rate for behavior outcomes.

## Bubble Boy Model

Bubble Boy is a rule-driven state machine. He is not an AI agent at runtime.

Required fields:

```js
bubbleBoy = {
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
}
```

Field meanings:

- `energy`: 0-100. Decreases with activity, recovers through rest.
- `hunger`: 0-100. Increases over time, affects mood and activity preference.
- `mood`: stable emotional state such as `calm`, `curious`, `tired`, `hungry`, or `cozy`.
- `attention`: current focus category such as `idle`, `fire`, `shelter`, `tree`, `friend`, or `userIntent`.
- `goal`: selected objective such as `rest`, `wander`, `warmUp`, `approachFire`, `sit`, or `interact`.
- `currentAction`: concrete action currently executing, such as `idle`, `walking`, `resting`, `sitting`, `warmingHands`, or `lookingAround`.
- `position`: simulation-space position.
- `velocity`: simulation-space velocity.
- `facing`: orientation in radians or degrees, as long as the schema is consistent.
- `targetId`: optional object or entity target.
- `actionTimer`: elapsed or remaining time for the current action.

## Behavior System: No AI

Bubble Boy behavior is deterministic rule evaluation. Runtime AI is explicitly forbidden in the simulation core.

Forbidden:

- LLM calls.
- Runtime AI agents.
- Runtime behavior trees.
- Model-generated decisions.
- Prompt-driven state changes.
- Rendering callbacks that alter behavior.

Allowed:

- Threshold rules.
- Priority rules.
- State machines.
- Timers.
- Proximity checks against `worldState`.
- Seeded deterministic variation.

## Goal Selection Rules

Goal selection should be boring, inspectable, and testable.

Example priority order:

```text
if energy <= 20:
  goal = "rest"
else if hunger >= 80:
  goal = "seekFood"
else if nightRisk > 0.7 and firePit.lit:
  goal = "approachFire"
else if nearFire and temperature < 12:
  goal = "warmUp"
else if hasInteractIntent and targetIsReachable:
  goal = "interact"
else:
  goal = "wander"
```

When two rules compete, the earlier rule wins. Rule order is part of the design and must be tested.

## Action Selection Rules

Actions are selected from the current goal and state.

Examples:

- `rest` -> `resting`
- `wander` -> `walking` or `lookingAround`
- `approachFire` -> `walking`
- `warmUp` -> `warmingHands`
- `interact` with fire -> `sitting` or `warmingHands`

Action rules must avoid chaotic switching. Use minimum action durations or explicit transition guards:

```text
currentAction may change only when:
- the action is complete
- a higher-priority need interrupts it
- the target becomes invalid
- an explicit valid user intent overrides it
```

## Example Behaviors

Rest when energy is low:

```text
condition:
  energy <= 20
effect:
  goal = "rest"
  currentAction = "resting"
  velocity = 0
  energy increases each tick
```

Wander when idle:

```text
condition:
  no urgent needs
  no active valid interaction
effect:
  goal = "wander"
  currentAction alternates between "walking" and "lookingAround"
  movement target comes from deterministic seeded selection
```

Interact with fire when nearby:

```text
condition:
  firePit.lit
  distance(bubbleBoy.position, firePit.position) <= firePit.warmthRadius
effect:
  attention = "fire"
  if cold or nightRisk is elevated:
    goal = "warmUp"
    currentAction = "warmingHands"
```

Respond to environmental triggers:

```text
condition:
  time.phase == "night"
  environment.safety.nightRisk > threshold
effect:
  prefer fire, shelter, or rest over wandering
```

## Simulation Events

Events are optional but must be deterministic and derived from state transitions.

Examples:

```js
{ tick: 1200, type: "actionChanged", entityId: "bubble-boy", from: "walking", to: "resting" }
{ tick: 3000, type: "environmentChanged", key: "time.phase", value: "night" }
```

Events may help render transitions, debug state changes, or drive UI display. They must not be the hidden source of future state.

## Invariants

Each tick should preserve these invariants:

- `energy` is clamped to 0-100.
- `hunger` is clamped to 0-100.
- `position` and `velocity` are finite numbers.
- `goal` and `currentAction` are valid enum values.
- `targetId` is either `null` or references an existing object/entity.
- Environment values are finite and within defined ranges.
- Simulation can run without DOM, WebGL, Three.js, or network access.

