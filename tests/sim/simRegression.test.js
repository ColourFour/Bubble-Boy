import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { runSimulation } from "./headlessRunner.js";
import { snapshotsEqual } from "./snapshot.js";
import { hasInstability } from "./simMetrics.js";
import { createInitialWorldState, FIRE_PIT_ID } from "../../bubble_ui/static/toybox/simulation/worldState.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");

test("A: deterministic runs produce identical final hashes and checkpoints", () => {
  const worldState = createInitialWorldState({
    seed: 7,
    toyboxState: { mood: "curious", weather: "clear", time_of_day: "twilight" }
  });
  const intents = [
    {
      tick: 120,
      intents: [
        {
          type: "userPresence",
          active: true,
          ageSeconds: 0.1,
          position: { x: 0.2, y: 1.0, z: -0.3 }
        }
      ]
    },
    { tick: 300, type: "interact", targetId: FIRE_PIT_ID },
    { tick: 480, type: "move", direction: { x: 1, z: 0 } }
  ];

  const first = runSimulation({ ticks: 2400, seed: 7, worldState, intents });
  const second = runSimulation({ ticks: 2400, seed: 7, worldState, intents });

  assert.equal(first.finalStateHash, second.finalStateHash);
  assert.equal(snapshotsEqual(first.snapshots, second.snapshots), true);
  assert.deepEqual(first.snapshots, second.snapshots);
});

test("B: long headless run stays numerically stable and keeps advancing", () => {
  const result = runSimulation({ ticks: 10000, seed: 11 });

  assert.equal(result.summary.finalTick, 10000);
  assert.equal(hasInstability(result.metrics), false, JSON.stringify(result.metrics.instability, null, 2));
  assert.ok(result.metrics.energy.min >= 0);
  assert.ok(result.metrics.energy.max <= 100);
  assert.ok(result.metrics.energy.avg >= 0 && result.metrics.energy.avg <= 100);
  assert.ok(result.summary.elapsedSeconds > 0);
  assert.ok(result.snapshots.length > 2);
  assert.notEqual(result.snapshots[0].hash, result.snapshots.at(-1).hash);
});

test("C1: low energy deterministically selects rest", () => {
  const worldState = createInitialWorldState({ seed: 3 });
  worldState.bubbleBoy.energy = 10;
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "walking";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({ ticks: 1, seed: 3, worldState });

  assert.equal(result.finalState.bubbleBoy.goal, "rest");
  assert.equal(result.finalState.bubbleBoy.currentAction, "resting");
  assert.equal(result.metrics.actionDistribution.rest, 1);
});

test("C2: near fire at night deterministically selects fire gaze and warm-up behavior", () => {
  const worldState = createInitialWorldState({
    seed: 5,
    toyboxState: { time_of_day: "night", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];
  worldState.bubbleBoy.energy = 80;
  worldState.bubbleBoy.position = {
    x: firePit.position.x + 0.15,
    y: worldState.bubbleBoy.position.y,
    z: firePit.position.z + 0.15
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "walking";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({ ticks: 1, seed: 5, worldState });

  assert.equal(result.finalState.bubbleBoy.goal, "warmUp");
  assert.equal(result.finalState.bubbleBoy.currentAction, "warmingHands");
  assert.equal(result.finalState.bubbleBoy.focus.kind, "fire");
  assert.equal(result.finalState.bubbleBoy.attention, "fire");
  assert.equal(result.metrics.actionDistribution.gaze_fire, 1);
});

test("C3: wander remains the deterministic fallback state", () => {
  const worldState = createInitialWorldState({
    seed: 13,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = { x: -5, y: worldState.bubbleBoy.position.y, z: 5 };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({ ticks: 1, seed: 13, worldState });

  assert.equal(result.finalState.bubbleBoy.goal, "wander");
  assert.match(result.finalState.bubbleBoy.currentAction, /^(walking|lookingAround)$/);
  assert.equal(result.metrics.actionDistribution.wander, 1);
});

test("C4: nearby active user interrupts wandering into attentive user-facing state", () => {
  const worldState = createInitialWorldState({
    seed: 19,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "walking";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({
    ticks: 1,
    seed: 19,
    worldState,
    intents: [
      {
        type: "userPresence",
        active: true,
        ageSeconds: 0.1,
        position: {
          x: worldState.bubbleBoy.position.x + 0.25,
          y: 1.0,
          z: worldState.bubbleBoy.position.z + 0.25
        }
      }
    ]
  });

  assert.equal(result.finalState.bubbleBoy.goal, "attendUser");
  assert.equal(result.finalState.bubbleBoy.currentAction, "lookingAround");
  assert.equal(result.finalState.bubbleBoy.focus.kind, "player");
  assert.equal(result.finalState.bubbleBoy.attention, "userIntent");
  assert.equal(result.finalState.bubbleBoy.mood, "curious");
  assert.ok(result.finalState.bubbleBoy.pose.weights.gaze_follow > 0.3);
  assert.equal(result.metrics.actionDistribution.attend_user, 1);
  assert.equal(result.metrics.actionDistribution.wander, 0);
  assert.deepEqual(
    result.finalState.events.find((event) => event.type === "goalChanged"),
    {
      tick: 1,
      type: "goalChanged",
      entityId: "bubble-boy",
      from: "wander",
      to: "attendUser"
    }
  );
  assert.deepEqual(
    result.finalState.events.find((event) => event.type === "attentionChanged"),
    {
      tick: 1,
      type: "attentionChanged",
      entityId: "bubble-boy",
      from: "idle",
      to: "userIntent"
    }
  );
});

test("C5: fire interaction intent focuses and targets the fire from a distance", () => {
  const worldState = createInitialWorldState({
    seed: 23,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.bubbleBoy.energy = 85;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = { x: -5, y: worldState.bubbleBoy.position.y, z: 5 };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "walking";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({
    ticks: 1,
    seed: 23,
    worldState,
    intents: [{ type: "interact", targetId: FIRE_PIT_ID }]
  });

  assert.equal(result.finalState.bubbleBoy.goal, "interact");
  assert.equal(result.finalState.bubbleBoy.currentAction, "interacting");
  assert.equal(result.finalState.bubbleBoy.targetId, FIRE_PIT_ID);
  assert.equal(result.finalState.bubbleBoy.focus.kind, "fire");
  assert.equal(result.finalState.bubbleBoy.attention, "fire");
  assert.equal(result.metrics.actionDistribution.interact, 1);
});

test("C6: storm weather raises wind, fog, and environmental tension", () => {
  function runWeather(weather) {
    const worldState = createInitialWorldState({
      seed: 31,
      toyboxState: { time_of_day: "twilight", weather }
    });
    return runSimulation({ ticks: 600, seed: 31, worldState });
  }

  const clear = runWeather("clear").finalState.environment;
  const storm = runWeather("storm").finalState.environment;

  assert.ok(storm.weatherIntensity > 0.72);
  assert.ok(storm.wind.strength > clear.wind.strength + 0.08);
  assert.ok(storm.wind.gust > clear.wind.gust + 0.05);
  assert.ok(storm.light.fogDensity > clear.light.fogDensity + 0.03);
  assert.ok(storm.emotionalField > clear.emotionalField + 0.04);
});

test("C7: sustained storm makes Bubble Boy alert to the weather", () => {
  const worldState = createInitialWorldState({
    seed: 37,
    toyboxState: { time_of_day: "day", weather: "storm" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = { x: -5, y: worldState.bubbleBoy.position.y, z: 5 };

  const result = runSimulation({ ticks: 900, seed: 37, worldState });

  assert.equal(result.finalState.bubbleBoy.mood, "alert");
  assert.equal(result.finalState.bubbleBoy.attention, "weather");
  assert.equal(result.finalState.bubbleBoy.focus.kind, "weather");
  assert.ok(result.finalState.bubbleBoy.focus.strength > 0.62);
});

test("C8: storm alert posture includes wind bracing", () => {
  const worldState = createInitialWorldState({
    seed: 41,
    toyboxState: { time_of_day: "day", weather: "storm" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = { x: -5, y: worldState.bubbleBoy.position.y, z: 5 };

  const result = runSimulation({ ticks: 900, seed: 41, worldState });

  assert.ok(result.finalState.bubbleBoy.pose.weights.wind_brace > 0.12);
  assert.ok(result.finalState.bubbleBoy.pose.settle < 0.12);
  assert.ok(result.finalState.bubbleBoy.pose.breathEnergy > 0.43);
});

test("C9: near a low fire Bubble Boy chooses to tend it", () => {
  const worldState = createInitialWorldState({
    seed: 43,
    toyboxState: { time_of_day: "night", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];
  firePit.fuel = 12;
  worldState.bubbleBoy.energy = 80;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = {
    x: firePit.position.x + 0.2,
    y: worldState.bubbleBoy.position.y,
    z: firePit.position.z + 0.2
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "walking";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({ ticks: 1, seed: 43, worldState });

  assert.equal(result.finalState.bubbleBoy.goal, "tendFire");
  assert.equal(result.finalState.bubbleBoy.currentAction, "tendingFire");
  assert.equal(result.finalState.bubbleBoy.targetId, FIRE_PIT_ID);
  assert.equal(result.finalState.bubbleBoy.focus.kind, "fire");
  assert.equal(result.finalState.bubbleBoy.mood, "focused");
});

test("C10: tending the fire restores fuel and emits a fire tended event", () => {
  const worldState = createInitialWorldState({
    seed: 47,
    toyboxState: { time_of_day: "night", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];
  firePit.fuel = 12;
  firePit.warmth = 0.35;
  worldState.bubbleBoy.energy = 80;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = {
    x: firePit.position.x + 0.2,
    y: worldState.bubbleBoy.position.y,
    z: firePit.position.z + 0.2
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "walking";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({ ticks: 180, seed: 47, worldState });

  assert.equal(result.finalState.bubbleBoy.goal, "tendFire");
  assert.ok(result.finalState.objects[FIRE_PIT_ID].fuel > 18);
  assert.ok(result.finalState.objects[FIRE_PIT_ID].warmth > 0.7);
  assert.ok(result.finalState.events.some((event) => event.type === "fireTended"));
});

test("C11: sun and moon directions move across opposite sides of the sky cycle", () => {
  const dawn = createInitialWorldState({
    seed: 53,
    toyboxState: { time_of_day: "dawn", weather: "clear" }
  });
  const day = createInitialWorldState({
    seed: 53,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const night = createInitialWorldState({
    seed: 53,
    toyboxState: { time_of_day: "night", weather: "clear" }
  });
  const twilight = createInitialWorldState({
    seed: 53,
    toyboxState: { time_of_day: "twilight", weather: "clear" }
  });

  const dawnResult = runSimulation({ ticks: 1, seed: 53, worldState: dawn });
  const dayResult = runSimulation({ ticks: 1, seed: 53, worldState: day });
  const nightResult = runSimulation({ ticks: 1, seed: 53, worldState: night });
  const twilightResult = runSimulation({ ticks: 1, seed: 53, worldState: twilight });
  const dawnSun = dawnResult.finalState.environment.light.sunDirection;
  const daySun = dayResult.finalState.environment.light.sunDirection;
  const nightSun = nightResult.finalState.environment.light.sunDirection;
  const nightMoon = nightResult.finalState.environment.light.moonDirection;
  const twilightSun = twilightResult.finalState.environment.light.sunDirection;
  const dawnSunPosition = dawnResult.finalState.environment.light.sunPosition;
  const daySunPosition = dayResult.finalState.environment.light.sunPosition;
  const twilightSunPosition = twilightResult.finalState.environment.light.sunPosition;
  const nightMoonPosition = nightResult.finalState.environment.light.moonPosition;

  assert.notDeepEqual(dawnSun, daySun);
  assert.equal(dawnResult.finalState.time.phase, "dawn");
  assert.equal(twilightResult.finalState.time.phase, "twilight");
  assert.ok(dawnSunPosition.x > 120);
  assert.ok(Math.abs(dawnSunPosition.z) < 0.001);
  assert.ok(dawnSun.x > 0.99);
  assert.ok(dayResult.finalState.environment.light.sunIntensity > 0.9);
  assert.ok(Math.abs(daySunPosition.x) < 0.1);
  assert.ok(daySunPosition.y > dawnSunPosition.y + 120);
  assert.ok(daySun.y > dawnSun.y + 0.2);
  assert.ok(twilightSunPosition.x < -120);
  assert.ok(Math.abs(twilightSunPosition.z) < 0.001);
  assert.ok(twilightSun.x < -0.99);
  assert.ok(nightResult.finalState.environment.light.moonIntensity > 0.14);
  assert.ok(Math.abs(nightMoonPosition.x) < 0.1);
  assert.ok(nightMoonPosition.y > 120);
  assert.ok(nightMoon.y > nightSun.y + 0.1);
  assert.ok(nightMoon.x * nightSun.x + nightMoon.y * nightSun.y + nightMoon.z * nightSun.z < -0.99);
});

test("D: simulation state and core source remain independent of rendering and wall-clock APIs", () => {
  const result = runSimulation({ ticks: 600, seed: 17 });
  const renderReferences = collectRenderReferences(result.finalState);
  assert.deepEqual(renderReferences, []);

  const simulationSource = readFileSync(
    resolve(REPO_ROOT, "bubble_ui/static/toybox/simulation/simulate.js"),
    "utf8"
  );
  const worldStateSource = readFileSync(
    resolve(REPO_ROOT, "bubble_ui/static/toybox/simulation/worldState.js"),
    "utf8"
  );
  const combinedSource = `${simulationSource}\n${worldStateSource}`;
  const forbiddenSourcePatterns = [
    /\bMath\.random\b/,
    /\bDate\.now\b/,
    /\bperformance\.now\b/,
    /\bdocument\b/,
    /\bwindow\b/,
    /\brequestAnimationFrame\b/,
    /\bTHREE\b/,
    /\bWebGL\b/,
    /\bshaderTime\b/
  ];

  for (const pattern of forbiddenSourcePatterns) {
    assert.equal(pattern.test(combinedSource), false, `simulation core references ${pattern}`);
  }
});

function collectRenderReferences(value, path = "worldState", references = []) {
  const forbiddenNames = new Set([
    "mesh",
    "camera",
    "dom",
    "document",
    "canvas",
    "shader",
    "material",
    "performance",
    "frameDelta",
    "three"
  ]);

  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    for (const name of forbiddenNames) {
      if (normalized === name.toLowerCase() || normalized === `${name.toLowerCase()}.now`) {
        references.push({ path, value });
      }
    }
    return references;
  }

  if (!value || typeof value !== "object") return references;
  if (Array.isArray(value)) {
    value.forEach((child, index) => collectRenderReferences(child, `${path}[${index}]`, references));
    return references;
  }

  for (const [key, child] of Object.entries(value)) {
    if (forbiddenNames.has(key)) {
      references.push({ path: `${path}.${key}`, value: child });
    }
    collectRenderReferences(child, `${path}.${key}`, references);
  }
  return references;
}
