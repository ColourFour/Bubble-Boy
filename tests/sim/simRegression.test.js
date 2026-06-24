import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
  activeCelestialSourceFromIntensities,
  simulate
} from "../../bubble_ui/static/toybox/simulation/simulate.js";
import { runSimulation } from "./headlessRunner.js";
import { snapshotsEqual } from "./snapshot.js";
import { hasInstability } from "./simMetrics.js";
import {
  ANIMAL_FAMILIAR_VISITOR_ID,
  AMBIENT_BEACH_FINDS_ID,
  ARRIVAL_BUNDLE_ITEM_ID,
  ARRIVAL_SUPPLIES_ID,
  BUILD_SITE_ID,
  BUILDABLE_IDS,
  BUILDER_FOREST_SECTOR,
  BUILDER_TREE_MIN_DISTANCE,
  BUILDER_TREE_WATER_CLEARANCE,
  BUILDER_TREE_IDS,
  CAMP_LAYOUT_ID,
  CAMP_PATHS_FAMILY,
  CAMP_STORAGE_ID,
  CAMP_ZONES_FAMILY,
  FISH_TRAP_ROUTINE_ID,
  FOOD_ROUTINE_ID,
  GARDEN_PLOT_FAMILY,
  LOOKOUT_MAP_HORIZON_ID,
  MAJOR_PROJECT_CAPSTONE_ID,
  MUSIC_ART_DECOR_ID,
  NIGHT_COMFORT_LIGHTS_ID,
  PIER_SHORE_WORK_SITE_ID,
  RAFT_BOAT_ROUTE_ID,
  WORKBENCH_ID,
  createInitialWorldState,
  FIRE_PIT_ID,
  FIXED_DT,
  normalizeWorldState,
  STORAGE_WORKBENCH_TOOLS_ID,
  TOOL_RACK_ID,
  TOY_PLAY_SET_ID
} from "../../bubble_ui/static/toybox/simulation/worldState.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const WORLD_RADIUS_SCALE = 14.0;
const PLAYABLE_RADIUS = 35.0;
const BUBBLE_BOY_RADIUS = 0.62;
const BUBBLE_BOY_SIZE = BUBBLE_BOY_RADIUS * 2;
const BUBBLE_BOY_CLEARANCE = BUBBLE_BOY_SIZE * 3;
const WATER_CLEAR_INSET = BUBBLE_BOY_RADIUS + BUBBLE_BOY_CLEARANCE;
const FIRE_VISUAL_RADIUS = 0.86;
const FIRE_CLEAR_RADIUS = FIRE_VISUAL_RADIUS + BUBBLE_BOY_RADIUS + BUBBLE_BOY_CLEARANCE;

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

test("B2: sparse legacy world state normalizes into the current schema", () => {
  const legacyState = {
    version: 1,
    sim: { seed: 23 },
    bubbleBoy: {
      mood: "curious",
      position: { x: Number.NaN, z: 1.5 }
    },
    environment: {
      weather: "clear"
    },
    objects: {
      [FIRE_PIT_ID]: {
        id: FIRE_PIT_ID,
        type: "firePit",
        position: { x: 0, y: 0.62, z: -0.16 },
        fuel: 80
      }
    }
  };

  const normalized = normalizeWorldState(legacyState);
  simulate(FIXED_DT, normalized, []);

  assert.equal(normalized.bubbleBoy.id, "bubble-boy");
  assert.equal(normalized.bubbleBoy.role, "builder");
  assert.equal(normalized.bubbleBoy.inventory.wood, normalized.objects[WORKBENCH_ID].wood);
  assert.equal(normalized.objects[BUILD_SITE_ID].type, "buildSite");
  assert.equal(BUILDER_TREE_IDS.every((treeId) => normalized.objects[treeId].type === "resourceTree"), true);
  assert.equal(Number.isFinite(normalized.bubbleBoy.position.x), true);
  assert.equal(Number.isFinite(normalized.environment.light.sunPosition.x), true);
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
  worldState.bubbleBoy.builder.active = false;

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
  assert.equal(result.finalState.bubbleBoy.currentAction, "walking");
  assert.equal(result.finalState.bubbleBoy.targetId, FIRE_PIT_ID);
  assert.ok(Math.hypot(result.finalState.bubbleBoy.velocity.x, result.finalState.bubbleBoy.velocity.z) > 0.1);
  assert.equal(result.finalState.bubbleBoy.focus.kind, "fire");
  assert.equal(result.finalState.bubbleBoy.attention, "fire");
  assert.equal(result.metrics.actionDistribution.interact, 1);
});

test("C5b: unsupported interaction targets do not enter a stuck interact goal", () => {
  const worldState = createInitialWorldState({
    seed: 30,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.builder.active = false;
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({
    ticks: 1,
    seed: 30,
    worldState,
    intents: [{ type: "interact", targetId: "missing-object" }]
  });

  assert.equal(result.finalState.bubbleBoy.goal, "wander");
  assert.notEqual(result.finalState.bubbleBoy.currentAction, "interacting");
  assert.notEqual(result.finalState.bubbleBoy.currentAction, "warmingHands");
  assert.equal(result.finalState.bubbleBoy.targetId, null);
  assert.equal(result.metrics.actionDistribution.interact, 0);
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
  assert.ok(Math.abs(nightMoonPosition.x) < 0.2);
  assert.ok(nightMoonPosition.y > 120);
  assert.ok(nightMoon.y > nightSun.y + 0.1);
  assert.ok(nightMoon.x * nightSun.x + nightMoon.y * nightSun.y + nightMoon.z * nightSun.z < -0.99);
});

test("C11b: sun and moon rendering intensities are mutually exclusive", () => {
  const day = runSimulation({
    ticks: 1,
    seed: 54,
    worldState: createInitialWorldState({
      seed: 54,
      toyboxState: { time_of_day: "day", weather: "clear" }
    })
  }).finalState.environment.light;
  const night = runSimulation({
    ticks: 1,
    seed: 54,
    worldState: createInitialWorldState({
      seed: 54,
      toyboxState: { time_of_day: "night", weather: "clear" }
    })
  }).finalState.environment.light;
  const twilight = runSimulation({
    ticks: 1,
    seed: 54,
    worldState: createInitialWorldState({
      seed: 54,
      toyboxState: { time_of_day: "twilight", weather: "clear" }
    })
  }).finalState.environment.light;

  assert.ok(day.sunIntensity > 0.9);
  assert.equal(day.moonIntensity, 0);
  assert.equal(activeCelestialSourceFromIntensities(day.sunIntensity, day.moonIntensity), "sun");

  assert.equal(night.sunIntensity, 0);
  assert.ok(night.moonIntensity > 0.14);
  assert.equal(activeCelestialSourceFromIntensities(night.sunIntensity, night.moonIntensity), "moon");

  const twilightVisibleCount =
    Number(twilight.sunIntensity > 0.001) + Number(twilight.moonIntensity > 0.001);
  assert.equal(twilightVisibleCount, 1);
});

test("C11c: renderer hides the inactive celestial body before applying opacity floors", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const syncStart = sceneSource.indexOf("function syncCelestialBodies");
  const syncEnd = sceneSource.indexOf("function celestialOpacity", syncStart);
  const syncSource = sceneSource.slice(syncStart, syncEnd);
  const opacityEnd = sceneSource.indexOf("function syncShoreline", syncEnd);
  const opacitySource = sceneSource.slice(syncEnd, opacityEnd);

  assert.match(syncSource, /celestial\.dominantSource === "sun"/);
  assert.match(syncSource, /celestial\.dominantSource === "moon"/);
  assert.match(opacitySource, /visibleIntensity <= 0\.001/);
});

test("C11d: renderer disables the Three.js Sky built-in sun disk", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const skyStart = sceneSource.indexOf("function installSkyTintLift");
  const skyEnd = sceneSource.indexOf("function createWater", skyStart);
  const skySource = sceneSource.slice(skyStart, skyEnd);

  assert.match(skySource, /L0 \+= \( vSunE \* 19000\.0 \* Fex \) \* sundisk;/);
  assert.match(skySource, /L0 \+= vec3\( 0\.0 \) \* sundisk;/);
  assert.match(skySource, /shaderSunDiskDisabled = true/);
});

test("C11f: night lighting uses sky fill and no-cutoff fire falloff", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const lightsStart = sceneSource.indexOf("function createLights");
  const lightsEnd = sceneSource.indexOf("function createSandMaterial", lightsStart);
  const lightsSource = sceneSource.slice(lightsStart, lightsEnd);
  const syncStart = sceneSource.indexOf("function syncLighting");
  const syncEnd = sceneSource.indexOf("function syncSkyLife", syncStart);
  const syncSource = sceneSource.slice(syncStart, syncEnd);
  const campfireStart = sceneSource.indexOf("function createCampfire");
  const campfireEnd = sceneSource.indexOf("function addCampfireLog", campfireStart);
  const campfireSource = sceneSource.slice(campfireStart, campfireEnd);
  const fireStart = sceneSource.indexOf("function syncFire");
  const fireEnd = sceneSource.indexOf("function smoothCampfireFlicker", fireStart);
  const fireSource = sceneSource.slice(fireStart, fireEnd);

  assert.match(lightsSource, /new THREE\.HemisphereLight/);
  assert.match(lightsSource, /new THREE\.PointLight\(0xff8a2d,\s*7\.0,\s*0,\s*2\.0\)/);
  assert.match(syncSource, /lighting\.directional\.position\.copy\(lightAnchor\.position\)/);
  assert.match(syncSource, /renderer\.toneMappingExposure = clamp/);
  assert.match(syncSource, /lighting\.hemisphere\.intensity = clamp/);
  assert.match(syncSource, /lighting\.fireLight\.distance = 0/);
  assert.match(syncSource, /lighting\.fireLight\.decay = 2\.0/);
  assert.match(campfireSource, /Broad soft firelight ground glow/);
  assert.match(fireSource, /smoothCampfireFlicker\(time\)/);
});

test("C11e: camera and dynamic physics bodies enforce hard terrain floors", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const physicsSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox_physics.js"), "utf8");
  const cameraSetupStart = sceneSource.indexOf("const cameraController = createCameraController");
  const cameraSetupEnd = sceneSource.indexOf("const cameraState = cameraController.camera", cameraSetupStart);
  const cameraSetupSource = sceneSource.slice(cameraSetupStart, cameraSetupEnd);
  const cameraSyncStart = sceneSource.indexOf("function syncCamera");
  const cameraSyncEnd = sceneSource.indexOf("function clampVectorToGroundFloor", cameraSyncStart);
  const cameraSyncSource = sceneSource.slice(cameraSyncStart, cameraSyncEnd);

  assert.match(cameraSetupSource, /floorHeightAt:\s*groundHeightAt/);
  assert.match(cameraSetupSource, /floorOffset:\s*CAMERA_TARGET_FLOOR_OFFSET/);
  assert.match(cameraSyncSource, /clampVectorToGroundFloor\(cameraState\.desiredTarget/);
  assert.match(cameraSyncSource, /clampVectorToGroundFloor\(eye,\s*CAMERA_EYE_FLOOR_OFFSET\)/);
  assert.match(sceneSource, /stepPhysics\(deltaSeconds,\s*\{ wind:\s*env\.windVector,\s*floorHeightAt:\s*groundHeightAt \}\)/);
  assert.match(physicsSource, /function enforceDynamicBodyFloor/);
  assert.match(physicsSource, /body\.setTranslation/);
  assert.match(physicsSource, /body\.setLinvel/);
});

test("C12: random wandering covers ground while staying clear of fire and water", () => {
  const worldState = createInitialWorldState({
    seed: 61,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];
  worldState.bubbleBoy.energy = 100;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = { x: -8, y: worldState.bubbleBoy.position.y, z: 8 };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;
  worldState.bubbleBoy.builder.active = false;

  let totalDistance = 0;
  let walkingTicks = 0;
  for (let tick = 0; tick < 1800; tick += 1) {
    const before = { ...worldState.bubbleBoy.position };
    simulate(FIXED_DT, worldState, []);
    const position = worldState.bubbleBoy.position;
    totalDistance += Math.hypot(position.x - before.x, position.z - before.z);
    if (worldState.bubbleBoy.currentAction === "walking") walkingTicks += 1;
    assertSafeFromFireAndWater(position, firePit);
  }

  assert.ok(walkingTicks > 900);
  assert.ok(totalDistance > 7.5);
});

test("C13: direct movement intent cannot drive Bubble Boy into water or over the fire", () => {
  const towardWater = createInitialWorldState({
    seed: 67,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  towardWater.bubbleBoy.energy = 100;
  towardWater.bubbleBoy.position = {
    x: safeIslandCenterRadius(0) - 0.1,
    y: towardWater.bubbleBoy.position.y,
    z: 0
  };
  for (let tick = 0; tick < 240; tick += 1) {
    simulate(FIXED_DT, towardWater, [{ type: "move", direction: { x: 1, z: 0 } }]);
    assertSafeFromFireAndWater(towardWater.bubbleBoy.position, towardWater.objects[FIRE_PIT_ID]);
  }

  const towardFire = createInitialWorldState({
    seed: 71,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const firePit = towardFire.objects[FIRE_PIT_ID];
  towardFire.bubbleBoy.energy = 100;
  towardFire.bubbleBoy.position = { x: firePit.position.x + 2.2, y: towardFire.bubbleBoy.position.y, z: firePit.position.z };
  for (let tick = 0; tick < 240; tick += 1) {
    simulate(FIXED_DT, towardFire, [{ type: "move", direction: { x: -1, z: 0 } }]);
    assertSafeFromFireAndWater(towardFire.bubbleBoy.position, firePit);
  }
});

test("C14: initial Bubble Boy placement is visibly clear of fire and water before movement", () => {
  const worldState = createInitialWorldState({
    seed: 73,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  assertSafeFromFireAndWater(worldState.bubbleBoy.position, worldState.objects[FIRE_PIT_ID]);
});

test("C15: hunger produces a foraging loop that relieves hunger", () => {
  const worldState = createInitialWorldState({
    seed: 79,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 86;
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  simulate(FIXED_DT, worldState, []);

  assert.equal(worldState.bubbleBoy.goal, "seekFood");
  assert.equal(worldState.bubbleBoy.currentAction, "foraging");
  assert.equal(worldState.bubbleBoy.mood, "hungry");

  for (let tick = 0; tick < 360; tick += 1) {
    simulate(FIXED_DT, worldState, []);
  }

  assert.ok(worldState.bubbleBoy.hunger < 84, `hunger stayed high at ${worldState.bubbleBoy.hunger}`);
});

test("C15b: mild hunger can become an autonomous fishing goal", () => {
  const worldState = createInitialWorldState({
    seed: 80,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 2;
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;
  worldState.bubbleBoy.builder.active = false;

  simulate(FIXED_DT, worldState, []);

  assert.equal(worldState.bubbleBoy.goal, "goFish");
  assert.equal(worldState.bubbleBoy.targetId, "ocean-fishing-spot");
  assert.match(worldState.bubbleBoy.currentAction, /^(walking|fishing)$/);
  assert.equal(worldState.bubbleBoy.inventory.fish.state, "none");
});

test("C15c: raw and cooked fish progress through cooking and eating without user control", () => {
  const worldState = createInitialWorldState({
    seed: 81,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 42;
  worldState.bubbleBoy.position = {
    x: firePit.position.x + 5.9,
    y: worldState.bubbleBoy.position.y,
    z: firePit.position.z
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;
  worldState.bubbleBoy.builder.active = false;
  worldState.bubbleBoy.inventory.fish = {
    state: "raw",
    id: "test-fish",
    caughtAt: worldState.sim.elapsedSeconds,
    cookedAt: null
  };

  for (let tick = 0; tick < 80; tick += 1) {
    simulate(FIXED_DT, worldState, []);
  }

  assert.equal(worldState.bubbleBoy.inventory.fish.state, "cooked");

  for (let tick = 0; tick < 140; tick += 1) {
    simulate(FIXED_DT, worldState, []);
  }

  assert.equal(worldState.bubbleBoy.inventory.fish.state, "none");
  assert.ok(worldState.bubbleBoy.hunger < 10, `cooked fish did not reduce hunger enough: ${worldState.bubbleBoy.hunger}`);

  for (let tick = 0; tick < 120; tick += 1) {
    simulate(FIXED_DT, worldState, []);
  }

  assert.notEqual(worldState.bubbleBoy.goal, "goFish");
});

test("C16: fire interaction from a distance walks to a safe warming spot", () => {
  const worldState = createInitialWorldState({
    seed: 83,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = { x: -8, y: worldState.bubbleBoy.position.y, z: 8 };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;
  const initialDistance = Math.hypot(
    worldState.bubbleBoy.position.x - firePit.position.x,
    worldState.bubbleBoy.position.z - firePit.position.z
  );
  const fireIntent = [{ type: "interact", targetId: FIRE_PIT_ID }];

  simulate(FIXED_DT, worldState, fireIntent);

  assert.equal(worldState.bubbleBoy.goal, "interact");
  assert.equal(worldState.bubbleBoy.currentAction, "walking");
  assert.equal(worldState.bubbleBoy.targetId, FIRE_PIT_ID);
  assert.ok(Math.hypot(worldState.bubbleBoy.velocity.x, worldState.bubbleBoy.velocity.z) > 0.1);

  for (let tick = 0; tick < 900; tick += 1) {
    simulate(FIXED_DT, worldState, fireIntent);
    assertSafeFromFireAndWater(worldState.bubbleBoy.position, firePit);
  }

  const finalDistance = Math.hypot(
    worldState.bubbleBoy.position.x - firePit.position.x,
    worldState.bubbleBoy.position.z - firePit.position.z
  );
  assert.ok(finalDistance < initialDistance - 4.5);
  assert.equal(worldState.bubbleBoy.currentAction, "warmingHands");
  assert.equal(worldState.bubbleBoy.focus.kind, "fire");
});

test("C17: nearby active user presence outranks storm weather focus", () => {
  const worldState = createInitialWorldState({
    seed: 89,
    toyboxState: { time_of_day: "day", weather: "storm" }
  });
  worldState.bubbleBoy.energy = 90;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.position = { x: -5, y: worldState.bubbleBoy.position.y, z: 5 };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "walking";
  worldState.bubbleBoy.minActionTime = 0;
  const userPresence = [
    {
      type: "userPresence",
      active: true,
      ageSeconds: 0.1,
      position: {
        x: worldState.bubbleBoy.position.x + 0.2,
        y: 1.0,
        z: worldState.bubbleBoy.position.z + 0.2
      }
    }
  ];

  for (let tick = 0; tick < 900; tick += 1) {
    simulate(FIXED_DT, worldState, userPresence);
  }

  assert.ok(worldState.environment.weatherIntensity > 0.72);
  assert.equal(worldState.bubbleBoy.goal, "attendUser");
  assert.equal(worldState.bubbleBoy.focus.kind, "player");
  assert.equal(worldState.bubbleBoy.attention, "userIntent");
  assert.equal(worldState.bubbleBoy.mood, "curious");
});

test("C18: foraging action has a humanoid presentation mapping", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const mappingStart = sceneSource.indexOf("const HUMANOID_ACTION_EMOTES");
  const mappingEnd = sceneSource.indexOf("});", mappingStart);
  const mappingSource = sceneSource.slice(mappingStart, mappingEnd + 3);
  const baseStart = sceneSource.indexOf("const HUMANOID_BASE_CLIPS");
  const baseEnd = sceneSource.indexOf("});", baseStart);
  const baseSource = sceneSource.slice(baseStart, baseEnd + 3);

  assert.match(mappingSource, /foraging:\s*"Sitting"/);
  assert.match(mappingSource, /gatherloosesupplies:\s*"Punch"/);
  assert.match(mappingSource, /bendpickup:\s*"Punch"/);
  assert.match(mappingSource, /pickupmaterial:\s*"Punch"/);
  assert.match(mappingSource, /hammerstrike:\s*"Punch"/);
  assert.match(mappingSource, /tieropevines:\s*"Punch"/);
  assert.match(mappingSource, /placeplank:\s*"Punch"/);
  assert.match(mappingSource, /pushpostupright:\s*"Punch"/);
  assert.match(mappingSource, /carvetool:\s*"Punch"/);
  assert.match(mappingSource, /inspectprogress:\s*"Yes"/);
  assert.match(mappingSource, /repairshelter:\s*"Punch"/);
  assert.match(mappingSource, /reinforceshelter:\s*"Punch"/);
  assert.match(mappingSource, /sortmaterials:\s*"Punch"/);
  assert.match(mappingSource, /depositstorage:\s*"Punch"/);
  assert.match(mappingSource, /withdrawstorage:\s*"Punch"/);
  assert.match(mappingSource, /tidycamp:\s*"Punch"/);
  assert.match(mappingSource, /sitnearfire:\s*"Sitting"/);
  assert.match(mappingSource, /restinsideshelter:\s*"Sitting"/);
  assert.match(mappingSource, /inspectcamplayout:\s*"Yes"/);
  assert.match(mappingSource, /depositmaterial:\s*"Punch"/);
  assert.match(mappingSource, /depositmaterials:\s*"Punch"/);
  assert.match(mappingSource, /setitemdown:\s*"Punch"/);
  assert.match(mappingSource, /craftatworkbench:\s*"Punch"/);
  assert.match(mappingSource, /inspecttool:\s*"ThumbsUp"/);
  assert.match(mappingSource, /rakepath:\s*"Punch"/);
  assert.match(mappingSource, /clearpath:\s*"Punch"/);
  assert.match(mappingSource, /sweepleaves:\s*"Punch"/);
  assert.match(mappingSource, /placeboundarystone:\s*"Punch"/);
  assert.match(mappingSource, /kneelmarkzone:\s*"Punch"/);
  assert.match(mappingSource, /walkroute:\s*"Walking"/);
  assert.match(mappingSource, /walkinspectroute:\s*"Walking"/);
  assert.match(mappingSource, /diggardenplot:\s*"Punch"/);
  assert.match(mappingSource, /plantseed:\s*"Punch"/);
  assert.match(mappingSource, /patsoil:\s*"Punch"/);
  assert.match(mappingSource, /waterplot:\s*"Punch"/);
  assert.match(mappingSource, /inspectsprout:\s*"Yes"/);
  assert.match(mappingSource, /harvestcrop:\s*"Punch"/);
  assert.match(mappingSource, /carryharvest:\s*"Walking"/);
  assert.match(mappingSource, /storeharvest:\s*"Punch"/);
  assert.match(mappingSource, /prepmeal:\s*"Punch"/);
  assert.match(mappingSource, /castfishingline:\s*"Punch"/);
  assert.match(mappingSource, /waitfishing:\s*"Standing"/);
  assert.match(mappingSource, /reelfishingline:\s*"Punch"/);
  assert.match(mappingSource, /catchreaction:\s*"ThumbsUp"/);
  assert.match(mappingSource, /fishfrompier:\s*"Punch"/);
  assert.match(mappingSource, /setfishtrap:\s*"Punch"/);
  assert.match(mappingSource, /checkfishtrap:\s*"Punch"/);
  assert.match(mappingSource, /collectcatch:\s*"Punch"/);
  assert.match(mappingSource, /hangcatchdryingrack:\s*"Punch"/);
  assert.match(mappingSource, /carryraftlog:\s*"Walking"/);
  assert.match(mappingSource, /lashraft:\s*"Punch"/);
  assert.match(mappingSource, /pushraft:\s*"Punch"/);
  assert.match(mappingSource, /boardraft:\s*"Punch"/);
  assert.match(mappingSource, /sitaboardraft:\s*"Sitting"/);
  assert.match(mappingSource, /standaboardraft:\s*"Standing"/);
  assert.match(mappingSource, /paddleraft:\s*"Punch"/);
  assert.match(mappingSource, /lookoutfromraft:\s*"Yes"/);
  assert.match(mappingSource, /disembarkraft:\s*"Punch"/);
  assert.match(mappingSource, /returncelebrate:\s*"ThumbsUp"/);
  assert.match(mappingSource, /crafttoy:\s*"Punch"/);
  assert.match(mappingSource, /placetoy:\s*"Punch"/);
  assert.match(mappingSource, /playblocks:\s*"Punch"/);
  assert.match(mappingSource, /hopplay:\s*"Jump"/);
  assert.match(mappingSource, /kickball:\s*"Jump"/);
  assert.match(mappingSource, /tossball:\s*"Punch"/);
  assert.match(mappingSource, /launchkite:\s*"Punch"/);
  assert.match(mappingSource, /holdkite:\s*"Standing"/);
  assert.match(mappingSource, /spintop:\s*"Punch"/);
  assert.match(mappingSource, /puttoyaway:\s*"Punch"/);
  assert.match(mappingSource, /paintstone:\s*"Punch"/);
  assert.match(mappingSource, /placedecoration:\s*"Punch"/);
  assert.match(mappingSource, /hangshellchime:\s*"Punch"/);
  assert.match(mappingSource, /playdrum:\s*"Punch"/);
  assert.match(mappingSource, /playflute:\s*"Punch"/);
  assert.match(mappingSource, /taprhythm:\s*"Punch"/);
  assert.match(mappingSource, /performatdusk:\s*"Dance"/);
  assert.match(mappingSource, /admiredisplay:\s*"Yes"/);
  assert.match(mappingSource, /planting:\s*"Punch"/);
  assert.match(mappingSource, /watering:\s*"Punch"/);
  assert.match(mappingSource, /harvesting:\s*"Punch"/);
  assert.match(mappingSource, /inspectinggarden:\s*"Yes"/);
  assert.match(mappingSource, /lightfire:\s*"Punch"/);
  assert.match(mappingSource, /kneelatfire:\s*"Punch"/);
  assert.match(mappingSource, /warmhands:\s*"Punch"/);
  assert.match(mappingSource, /addfuel:\s*"Punch"/);
  assert.match(mappingSource, /fanfire:\s*"Punch"/);
  assert.match(mappingSource, /stokefire:\s*"Punch"/);
  assert.match(mappingSource, /cookfish:\s*"Punch"/);
  assert.match(mappingSource, /cookmeal:\s*"Punch"/);
  assert.match(mappingSource, /stirpot:\s*"Punch"/);
  assert.match(mappingSource, /holdfood:\s*"ThumbsUp"/);
  assert.match(mappingSource, /eatfood:\s*"ThumbsUp"/);
  assert.match(mappingSource, /arrivelookaround:\s*"Yes"/);
  assert.match(mappingSource, /respondtoplayer:\s*"Wave"/);
  assert.match(mappingSource, /inspectobject:\s*"Yes"/);
  assert.match(mappingSource, /pointnotice:\s*"Wave"/);
  assert.match(mappingSource, /smallsurprise:\s*"Yes"/);
  assert.match(mappingSource, /quietcelebrate:\s*"ThumbsUp"/);
  assert.match(mappingSource, /sitrestspot:\s*"Sitting"/);
  assert.match(mappingSource, /settleintohammock:\s*"Sitting"/);
  assert.match(mappingSource, /settleintobed:\s*"Sitting"/);
  assert.match(mappingSource, /liedown:\s*"Sitting"/);
  assert.match(mappingSource, /sleeploop:\s*"Sitting"/);
  assert.match(mappingSource, /wake:\s*"ThumbsUp"/);
  assert.match(mappingSource, /wakestretch:\s*"ThumbsUp"/);
  assert.match(mappingSource, /standupfromrest:\s*"Standing"/);
  assert.match(baseSource, /Sitting:\s*\["Sitting",\s*"Idle"\]/);
});

test("C19: canvas trace exposes Bubble Boy drive and focus state", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const traceStart = sceneSource.indexOf("function syncTrace");
  const traceEnd = sceneSource.indexOf("window.__toyboxCelestial", traceStart);
  const traceSource = sceneSource.slice(traceStart, traceEnd);

  assert.match(traceSource, /canvas\.dataset\.bubbleBoyEnergy/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyHunger/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyAttention/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyFocus/);
});

test("C20: initial world state includes builder supplies and safe island work objects", () => {
  const worldState = createInitialWorldState({
    seed: 97,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];
  const workbench = worldState.objects[WORKBENCH_ID];
  const buildSite = worldState.objects[BUILD_SITE_ID];

  assert.equal(worldState.bubbleBoy.role, "builder");
  assert.equal(worldState.bubbleBoy.inventory.wood, 0);
  assert.equal(worldState.bubbleBoy.builder.project, BUILDABLE_IDS.shelter);
  assert.equal(worldState.bubbleBoy.builder.actionState, "inspect");
  assert.equal(worldState.bubbleBoy.builder.progress, 0);
  assert.equal(worldState.bubbleBoy.carriedItem, null);
  assert.equal(worldState.bubbleBoy.carriedObject, null);
  assert.equal(worldState.bubbleBoy.carrying, null);
  assert.equal(worldState.arrivalSupplies.id, ARRIVAL_SUPPLIES_ID);
  assert.equal(worldState.arrivalSupplies.family, "arrivalShoreBundle");
  assert.equal(worldState.arrivalSupplies.stage, "supplies");
  assert.equal(worldState.arrivalSupplies.variant, "beachBundle");
  assert.equal(worldState.arrivalSupplies.washedBundleVisible, true);
  assert.equal(worldState.arrivalSupplies.scatteredSticksVisible, true);
  assert.equal(worldState.arrivalSupplies.scatteredLeavesVisible, true);
  assert.equal(worldState.arrivalSupplies.materialPileVisible, false);
  assert.equal(worldState.arrivalSupplies.bundleCarriedByBB, false);
  assert.equal(worldState.campStorage.id, CAMP_STORAGE_ID);
  assert.equal(worldState.campStorage.family, "storage");
  assert.equal(worldState.campStorage.stage, "empty");
  assert.equal(worldState.campStorage.variant, "basket");
  assert.equal(worldState.campStorage.woodCount, 0);
  assert.equal(worldState.bubbleBoy.toolInventory.hasStoneTool, false);
  assert.equal(worldState.bubbleBoy.toolInventory.hasWoodTool, false);
  assert.equal(worldState.toolRack.id, TOOL_RACK_ID);
  assert.equal(worldState.toolRack.family, "toolRack");
  assert.equal(worldState.toolRack.stage, "empty");
  assert.deepEqual(worldState.toolRack.slots, []);
  assert.equal(worldState.campLayout.id, CAMP_LAYOUT_ID);
  assert.equal(worldState.campLayout.family, "campLayout");
  assert.equal(worldState.campLayout.stage, "none");
  assert.equal(worldState.campLayout.variant, "pathsZones");
  assert.equal(worldState.campLayout.visible, false);
  assert.equal(worldState.campLayout.paths.length, 2);
  assert.equal(worldState.campLayout.zones.length, 3);
  assert.equal(worldState.campLayout.paths.every((path) => path.family === CAMP_PATHS_FAMILY && path.stage === "none"), true);
  assert.equal(worldState.campLayout.zones.every((zone) => zone.family === CAMP_ZONES_FAMILY && zone.stage === "none"), true);
  assert.equal(Array.isArray(worldState.gardenPlots), true);
  assert.equal(worldState.gardenPlots.length, 1);
  assert.equal(worldState.gardenPlots[0].id, "gardenPlot_01");
  assert.equal(worldState.gardenPlots[0].family, GARDEN_PLOT_FAMILY);
  assert.equal(worldState.gardenPlots[0].stage, "none");
  assert.equal(worldState.gardenPlots[0].cropType, "carrot");
  assert.equal(worldState.gardenPlots[0].visible, false);
  assert.equal(worldState.gardenPlots[0].watered, false);
  assert.equal(worldState.foodRoutine.id, FOOD_ROUTINE_ID);
  assert.equal(worldState.foodRoutine.family, FOOD_ROUTINE_ID);
  assert.equal(worldState.foodRoutine.stage, "none");
  assert.equal(worldState.foodRoutine.variant, "cookPrep");
  assert.equal(worldState.foodRoutine.visible, false);
  assert.equal(worldState.foodRoutine.basketStock, 0);
  assert.equal(worldState.foodRoutine.mealCount, 0);
  assert.equal(worldState.fishTrapRoutine.id, FISH_TRAP_ROUTINE_ID);
  assert.equal(worldState.fishTrapRoutine.family, FISH_TRAP_ROUTINE_ID);
  assert.equal(worldState.fishTrapRoutine.stage, "unset");
  assert.equal(worldState.fishTrapRoutine.variant, "unsetMarker");
  assert.equal(worldState.fishTrapRoutine.trapState, "unset");
  assert.equal(worldState.fishTrapRoutine.visible, false);
  assert.equal(worldState.fishTrapRoutine.trapCount, 0);
  assert.equal(worldState.fishTrapRoutine.buoyCount, 0);
  assert.equal(worldState.fishTrapRoutine.dryingRackCount, 0);
  assert.equal(worldState.toyPlaySet.id, TOY_PLAY_SET_ID);
  assert.equal(worldState.toyPlaySet.family, TOY_PLAY_SET_ID);
  assert.equal(worldState.toyPlaySet.stage, "hidden");
  assert.equal(worldState.toyPlaySet.variant, "activeMain");
  assert.equal(worldState.toyPlaySet.visible, false);
  assert.equal(worldState.toyPlaySet.collectionSlotCount, 0);
  assert.equal(worldState.toyPlaySet.blockCount, 0);
  assert.equal(worldState.toyPlaySet.kiteCount, 0);
  assert.equal(worldState.toyPlaySet.playMatCount, 0);
  assert.equal(worldState.musicArtDecor.id, MUSIC_ART_DECOR_ID);
  assert.equal(worldState.musicArtDecor.family, MUSIC_ART_DECOR_ID);
  assert.equal(worldState.musicArtDecor.stage, "hidden");
  assert.equal(worldState.musicArtDecor.variant, "decorCluster");
  assert.equal(worldState.musicArtDecor.visible, false);
  assert.equal(worldState.musicArtDecor.shellChimeCount, 0);
  assert.equal(worldState.musicArtDecor.paintedStoneCount, 0);
  assert.equal(worldState.musicArtDecor.performanceMarkerCount, 0);
  assert.equal(worldState.musicArtDecor.noteMarkerCount, 0);
  assert.equal(worldState.animalFamiliarVisitor.id, ANIMAL_FAMILIAR_VISITOR_ID);
  assert.equal(worldState.animalFamiliarVisitor.family, ANIMAL_FAMILIAR_VISITOR_ID);
  assert.equal(worldState.animalFamiliarVisitor.stage, "hidden");
  assert.equal(worldState.animalFamiliarVisitor.variant, "groundVisitor");
  assert.equal(worldState.animalFamiliarVisitor.visible, false);
  assert.equal(worldState.animalFamiliarVisitor.animalCount, 0);
  assert.equal(worldState.animalFamiliarVisitor.foodCrumbCount, 0);
  assert.equal(worldState.animalFamiliarVisitor.observeRingCount, 0);
  assert.equal(worldState.animalFamiliarVisitor.collisionEnabled, false);
  assert.equal(worldState.animalFamiliarVisitor.blocksMovement, false);
  assert.equal(worldState.animalFamiliarVisitor.affectsCameraFollow, false);
  assert.equal(worldState.nightComfortLights.id, NIGHT_COMFORT_LIGHTS_ID);
  assert.equal(worldState.nightComfortLights.family, NIGHT_COMFORT_LIGHTS_ID);
  assert.equal(worldState.nightComfortLights.stage, "hidden");
  assert.equal(worldState.nightComfortLights.variant, "nightLit");
  assert.equal(worldState.nightComfortLights.visible, false);
  assert.equal(worldState.nightComfortLights.lanternPostCount, 0);
  assert.equal(worldState.nightComfortLights.litPathAnchorCount, 0);
  assert.equal(worldState.nightComfortLights.glowingShellCount, 0);
  assert.equal(worldState.nightComfortLights.fireflyCount, 0);
  assert.equal(worldState.nightComfortLights.dynamicLightCount, 0);
  assert.equal(worldState.nightComfortLights.usesDynamicLights, false);
  assert.equal(worldState.nightComfortLights.maxFireflySprites, 12);
  assert.equal(worldState.lookoutMapHorizon.id, LOOKOUT_MAP_HORIZON_ID);
  assert.equal(worldState.lookoutMapHorizon.family, LOOKOUT_MAP_HORIZON_ID);
  assert.equal(worldState.lookoutMapHorizon.stage, "hidden");
  assert.equal(worldState.lookoutMapHorizon.variant, "lookoutActive");
  assert.equal(worldState.lookoutMapHorizon.visible, false);
  assert.equal(worldState.lookoutMapHorizon.lookoutPlatformCount, 0);
  assert.equal(worldState.lookoutMapHorizon.stepCount, 0);
  assert.equal(worldState.lookoutMapHorizon.mapBoardCount, 0);
  assert.equal(worldState.lookoutMapHorizon.horizonMarkerCount, 0);
  assert.equal(worldState.lookoutMapHorizon.climbingEnabled, false);
  assert.equal(worldState.lookoutMapHorizon.verticalMovementEnabled, false);
  assert.equal(worldState.lookoutMapHorizon.mapDiscoveryEnabled, false);
  assert.equal(worldState.lookoutMapHorizon.day100CompletionEnabled, false);
  assert.equal(worldState.majorProjectCapstone.id, MAJOR_PROJECT_CAPSTONE_ID);
  assert.equal(worldState.majorProjectCapstone.family, MAJOR_PROJECT_CAPSTONE_ID);
  assert.equal(worldState.majorProjectCapstone.selectedOption, "communityTable");
  assert.equal(worldState.majorProjectCapstone.stage, "hidden");
  assert.equal(worldState.majorProjectCapstone.variant, "communityTableStage0");
  assert.equal(worldState.majorProjectCapstone.visible, false);
  assert.equal(worldState.majorProjectCapstone.supplyMarkerCount, 0);
  assert.equal(worldState.majorProjectCapstone.tableLegCount, 0);
  assert.equal(worldState.majorProjectCapstone.tabletopPieceCount, 0);
  assert.equal(worldState.majorProjectCapstone.resourcePlanningEnabled, false);
  assert.equal(worldState.majorProjectCapstone.constructionMechanicsEnabled, false);
  assert.equal(worldState.majorProjectCapstone.milestoneLogicEnabled, false);
  assert.equal(worldState.majorProjectCapstone.travelDiscoveryEnabled, false);
  assert.equal(worldState.ambientBeachFinds.id, AMBIENT_BEACH_FINDS_ID);
  assert.equal(worldState.ambientBeachFinds.family, AMBIENT_BEACH_FINDS_ID);
  assert.equal(worldState.ambientBeachFinds.stage, "none");
  assert.equal(worldState.ambientBeachFinds.variant, "shorelineFinds");
  assert.equal(worldState.ambientBeachFinds.visible, false);
  assert.equal(worldState.ambientBeachFinds.shellCount, 0);
  assert.equal(worldState.ambientBeachFinds.driftwoodCount, 0);
  assert.equal(worldState.pierShoreWorkSite.id, PIER_SHORE_WORK_SITE_ID);
  assert.equal(worldState.pierShoreWorkSite.family, PIER_SHORE_WORK_SITE_ID);
  assert.equal(worldState.pierShoreWorkSite.stage, "none");
  assert.equal(worldState.pierShoreWorkSite.variant, "shoreSurvey");
  assert.equal(worldState.pierShoreWorkSite.visible, false);
  assert.equal(worldState.pierShoreWorkSite.pierPostCount, 0);
  assert.equal(worldState.pierShoreWorkSite.plankCount, 0);
  assert.equal(worldState.pierShoreWorkSite.safeBuildSiteCount, 0);
  assert.equal(worldState.raftBoatRoute.id, RAFT_BOAT_ROUTE_ID);
  assert.equal(worldState.raftBoatRoute.family, RAFT_BOAT_ROUTE_ID);
  assert.equal(worldState.raftBoatRoute.stage, "none");
  assert.equal(worldState.raftBoatRoute.buildStage, "none");
  assert.equal(worldState.raftBoatRoute.waterState, "shore");
  assert.equal(worldState.raftBoatRoute.variant, "shoreBuild");
  assert.equal(worldState.raftBoatRoute.visible, false);
  assert.equal(worldState.raftBoatRoute.logCount, 0);
  assert.equal(worldState.raftBoatRoute.routeMarkerCount, 0);
  assert.equal(worldState.raftBoatRoute.landingMarkerCount, 0);
  assert.equal(Object.keys(worldState.buildables).length, 4);
  assert.equal(worldState.buildables[BUILDABLE_IDS.shelter], buildSite);
  assert.equal(worldState.buildables[BUILDABLE_IDS.bed].requiredResources.wood, 3.5);
  assert.equal(worldState.buildables[BUILDABLE_IDS.toyBlocks].useSlots[0].action, "playToy");
  assert.equal(worldState.buildables[BUILDABLE_IDS.workbench], workbench);
  assert.equal(worldState.lifeLoop.canSleep, false);
  assert.equal(worldState.lifeLoop.sleepAvailable, false);
  assert.equal(worldState.restShelter.id, "restShelter");
  assert.equal(worldState.restShelter.family, "hammockBedShelter");
  assert.equal(worldState.restShelter.stage, "hammock");
  assert.equal(worldState.restShelter.variant, "restSling");
  assert.equal(worldState.restShelter.source, "procedural");
  assert.equal(workbench.type, "workbench");
  assert.equal(workbench.family, "workbench");
  assert.equal(workbench.stage, "complete");
  assert.equal(workbench.variant, "upgraded");
  assert.equal(workbench.usable, true);
  assert.equal(workbench.useSlots[0].action, "craftAtWorkbench");
  assert.equal(buildSite.type, "buildSite");
  assert.equal(buildSite.buildableId, BUILDABLE_IDS.shelter);
  assert.equal(buildSite.progress, 0);
  assert.ok(buildSite.requiredWood > 0);
  assertSafeFromFireAndWater(workbench.position, firePit);
  assertSafeFromFireAndWater(buildSite.position, firePit);

  for (const treeId of BUILDER_TREE_IDS) {
    const tree = worldState.objects[treeId];
    assert.equal(tree.type, "resourceTree");
    assert.ok(tree.wood > 0);
    assertSafeFromFireAndWater(tree.position, firePit);
  }
});

test("C20b: arrival supplies placeholder normalizes carried bundle state", () => {
  const worldState = createInitialWorldState({
    seed: 98,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.arrivalSupplies.bundleCarriedByBB = true;
  normalizeWorldState(worldState);

  assert.equal(worldState.bubbleBoy.carriedItem, ARRIVAL_BUNDLE_ITEM_ID);
  assert.equal(worldState.arrivalSupplies.bundleCarriedByBB, true);
  assert.equal(worldState.arrivalSupplies.carried, true);
  assert.equal(worldState.arrivalSupplies.owner, "bubble-boy");
  assert.equal(worldState.arrivalSupplies.washedBundleVisible, false);
  assert.match(worldState.arrivalSupplies.debugLabel, /carried=1/);
});

test("C21: builder gathers wood from a nearby resource tree when the project needs materials", () => {
  const worldState = createInitialWorldState({
    seed: 101,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const tree = worldState.objects[BUILDER_TREE_IDS[0]];
  worldState.bubbleBoy.energy = 92;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.inventory.wood = 0;
  worldState.bubbleBoy.position = {
    x: tree.position.x + 0.35,
    y: worldState.bubbleBoy.position.y,
    z: tree.position.z + 0.35
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  simulate(FIXED_DT, worldState, []);

  assert.equal(worldState.bubbleBoy.goal, "gatherWood");
  assert.equal(worldState.bubbleBoy.currentAction, "gatheringWood");
  assert.equal(worldState.bubbleBoy.targetId, tree.id);
  assert.equal(worldState.objects[WORKBENCH_ID].wood, worldState.bubbleBoy.inventory.wood);

  let emittedGatherEvent = worldState.events.some((event) => event.type === "woodGathered");
  let maxInventoryWood = worldState.bubbleBoy.inventory.wood;
  let minTreeWood = worldState.objects[tree.id].wood;
  for (let tick = 0; tick < 240; tick += 1) {
    simulate(FIXED_DT, worldState, []);
    emittedGatherEvent = emittedGatherEvent || worldState.events.some((event) => event.type === "woodGathered");
    maxInventoryWood = Math.max(maxInventoryWood, worldState.bubbleBoy.inventory.wood);
    minTreeWood = Math.min(minTreeWood, worldState.objects[tree.id].wood);
  }

  assert.ok(maxInventoryWood > 0.45);
  assert.ok(minTreeWood < tree.maxWood);
  assert.equal(worldState.objects[WORKBENCH_ID].wood, worldState.bubbleBoy.inventory.wood);
  assert.ok(emittedGatherEvent);
});

test("C21b: depleted builder trees regrow deterministically during simulation", () => {
  const worldState = createInitialWorldState({
    seed: 102,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const tree = worldState.objects[BUILDER_TREE_IDS[0]];
  worldState.bubbleBoy.builder.active = false;
  tree.wood = 0;
  tree.regrowth = 0;

  for (let tick = 0; tick < 600; tick += 1) {
    simulate(FIXED_DT, worldState, []);
  }

  assert.ok(tree.wood > 0.12, `tree wood only regrew to ${tree.wood}`);
  assert.ok(tree.wood < tree.maxWood);
  assert.equal(tree.regrowth, tree.wood / tree.maxWood);
});

test("C22: builder spends gathered wood into build-site shelter progress", () => {
  const worldState = createInitialWorldState({
    seed: 103,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const buildSite = worldState.objects[BUILD_SITE_ID];
  worldState.bubbleBoy.energy = 92;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.inventory.wood = 2.4;
  worldState.bubbleBoy.position = {
    x: buildSite.position.x + 0.35,
    y: worldState.bubbleBoy.position.y,
    z: buildSite.position.z + 0.35
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  simulate(FIXED_DT, worldState, []);

  assert.equal(worldState.bubbleBoy.goal, "buildProject");
  assert.equal(worldState.bubbleBoy.currentAction, "building");
  assert.equal(worldState.bubbleBoy.targetId, BUILD_SITE_ID);

  let emittedBuildEvent = worldState.events.some((event) => event.type === "projectBuilt");
  for (let tick = 0; tick < 300; tick += 1) {
    simulate(FIXED_DT, worldState, []);
    emittedBuildEvent = emittedBuildEvent || worldState.events.some((event) => event.type === "projectBuilt");
  }

  assert.ok(worldState.objects[BUILD_SITE_ID].progress > 0.12);
  assert.ok(worldState.bubbleBoy.builder.progress > 0.12);
  assert.ok(worldState.bubbleBoy.inventory.wood < 2.4);
  assert.equal(worldState.objects[WORKBENCH_ID].wood, worldState.bubbleBoy.inventory.wood);
  assert.ok(emittedBuildEvent);
});

test("C22b: headless metrics classify builder work separately from wandering", () => {
  const worldState = createInitialWorldState({
    seed: 104,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const tree = worldState.objects[BUILDER_TREE_IDS[0]];
  worldState.bubbleBoy.energy = 92;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.inventory.wood = 0;
  worldState.bubbleBoy.position = {
    x: tree.position.x + 0.35,
    y: worldState.bubbleBoy.position.y,
    z: tree.position.z + 0.35
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  const result = runSimulation({ ticks: 120, seed: 104, worldState });

  assert.ok(result.metrics.actionDistribution.builder > 0);
  assert.equal(result.metrics.actionDistribution.wander, 0);
});

test("C22c: completing the shelter emits one completion event and queues the bed", () => {
  const worldState = createInitialWorldState({
    seed: 105,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const buildSite = worldState.objects[BUILD_SITE_ID];
  worldState.bubbleBoy.energy = 100;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.inventory.wood = buildSite.requiredWood;
  worldState.bubbleBoy.position = {
    x: buildSite.position.x + 0.35,
    y: worldState.bubbleBoy.position.y,
    z: buildSite.position.z + 0.35
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  let completionEvents = 0;
  for (let tick = 0; tick < 900; tick += 1) {
    simulate(FIXED_DT, worldState, []);
    completionEvents += worldState.events.filter((event) => event.type === "projectCompleted").length;
  }

  assert.equal(completionEvents, 1);
  assert.equal(worldState.objects[BUILD_SITE_ID].progress, 1);
  assert.equal(worldState.environment.safety.shelterAvailable, true);
  assert.equal(worldState.buildables[BUILDABLE_IDS.bed].progress < 1, true);
  assert.equal(worldState.bubbleBoy.builder.active, true);
  assert.equal(worldState.bubbleBoy.builder.project, BUILDABLE_IDS.bed);
  assert.notEqual(worldState.bubbleBoy.goal, "buildProject");
  assert.notEqual(worldState.bubbleBoy.currentAction, "building");
});

test("C22d: buildable sequence completes shelter, bed, and toy in priority order", () => {
  const worldState = createInitialWorldState({
    seed: 106,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  worldState.bubbleBoy.energy = 100;
  worldState.bubbleBoy.hunger = 0;
  const completed = [];

  for (let tick = 0; tick < 4200; tick += 1) {
    worldState.bubbleBoy.energy = 100;
    const project = worldState.bubbleBoy.builder.project;
    const buildable = worldState.buildables[project];
    if (buildable && buildable.progress < 1) {
      worldState.bubbleBoy.inventory.wood = buildable.requiredWood;
      worldState.bubbleBoy.position = {
        x: buildable.position.x + 0.30,
        y: worldState.bubbleBoy.position.y,
        z: buildable.position.z + 0.30
      };
    }
    simulate(FIXED_DT, worldState, []);
    for (const event of worldState.events) {
      if (event.type === "buildableCompleted") completed.push(event.buildableId);
    }
    if (BUILDABLE_IDS.toyBlocks && worldState.buildables[BUILDABLE_IDS.toyBlocks].progress >= 1) break;
  }

  assert.deepEqual(completed, [
    BUILDABLE_IDS.shelter,
    BUILDABLE_IDS.bed,
    BUILDABLE_IDS.toyBlocks
  ]);
  assert.equal(worldState.buildables[BUILDABLE_IDS.shelter].progress, 1);
  assert.equal(worldState.buildables[BUILDABLE_IDS.bed].progress, 1);
  assert.equal(worldState.buildables[BUILDABLE_IDS.toyBlocks].progress, 1);
});

test("C22e: completed bed can be used for a sleep/rest action", () => {
  const worldState = createInitialWorldState({
    seed: 108,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  completeBuildableForTest(worldState, BUILDABLE_IDS.shelter);
  completeBuildableForTest(worldState, BUILDABLE_IDS.bed);
  worldState.bubbleBoy.energy = 72;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.builder.restedAfterBed = false;
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;
  const slot = worldState.buildables[BUILDABLE_IDS.bed].useSlots[0];
  worldState.bubbleBoy.position = {
    x: slot.position.x,
    y: worldState.bubbleBoy.position.y,
    z: slot.position.z
  };

  simulate(FIXED_DT, worldState, []);

  assert.equal(worldState.bubbleBoy.goal, "useBed");
  assert.equal(worldState.bubbleBoy.currentAction, "sleep");
  assert.equal(worldState.bubbleBoy.builder.actionState, "sleep");
  assert.equal(worldState.lifeLoop.canSleep, true);
  assert.equal(worldState.restShelter.stage, "bedUpgrade");
  assert.equal(worldState.restShelter.variant, "cozyBed");
  assert.equal(worldState.restShelter.active, true);
  assert.equal(worldState.restShelter.usable, true);

  let usedBed = false;
  for (let tick = 0; tick < 360; tick += 1) {
    simulate(FIXED_DT, worldState, []);
    usedBed = usedBed || worldState.events.some((event) => event.type === "bedUsed");
  }

  assert.equal(usedBed, true);
  assert.equal(worldState.bubbleBoy.builder.restedAfterBed, true);
  assert.ok(worldState.bubbleBoy.energy > 72);
});

test("C22f: completed toy can be used for a play action", () => {
  const worldState = createInitialWorldState({
    seed: 110,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  completeBuildableForTest(worldState, BUILDABLE_IDS.shelter);
  completeBuildableForTest(worldState, BUILDABLE_IDS.bed);
  completeBuildableForTest(worldState, BUILDABLE_IDS.toyBlocks);
  worldState.bubbleBoy.energy = 88;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.builder.restedAfterBed = true;
  worldState.bubbleBoy.builder.lastBedUseAt = worldState.sim.elapsedSeconds;
  worldState.bubbleBoy.builder.lastToyPlayAt = -999;
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;
  const slot = worldState.buildables[BUILDABLE_IDS.toyBlocks].useSlots[0];
  worldState.bubbleBoy.position = {
    x: slot.position.x,
    y: worldState.bubbleBoy.position.y,
    z: slot.position.z
  };

  let played = false;
  for (let tick = 0; tick < 600; tick += 1) {
    simulate(FIXED_DT, worldState, []);
    played = played || worldState.bubbleBoy.currentAction === "playToy";
    if (played) break;
  }

  assert.equal(played, true);
  assert.equal(worldState.bubbleBoy.goal, "playToy");
  assert.equal(worldState.bubbleBoy.builder.actionState, "playToy");
});

test("C23: scene renders builder objects from world-state IDs", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const reviewModeSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/reviewMode.js"), "utf8");

  assert.match(sceneSource, /WORKBENCH_ID/);
  assert.match(sceneSource, /BUILD_SITE_ID/);
  assert.match(sceneSource, /BUILDER_TREE_IDS/);
  assert.match(sceneSource, /function createBuilderObjects/);
  assert.match(sceneSource, /function syncBuilderObjects/);
  assert.match(sceneSource, /function createArrivalSupplies/);
  assert.match(sceneSource, /function syncArrivalSupplies/);
  assert.match(sceneSource, /readToyboxReviewConfig/);
  assert.match(sceneSource, /applyToyboxReviewState/);
  assert.match(reviewModeSource, /function readToyboxReviewConfig/);
  assert.match(reviewModeSource, /function applyToyboxReviewState/);
  assert.match(reviewModeSource, /BED_BUILD_SITE_ID/);
  assert.match(reviewModeSource, /REST_SLEEP_WAKE_REVIEW_FAMILY/);
  assert.match(reviewModeSource, /function applyRestSleepWakeReviewState/);
  assert.match(reviewModeSource, /BUILD_TIE_CRAFT_REPAIR_REVIEW_FAMILY/);
  assert.match(reviewModeSource, /function applyBuildTieCraftRepairReviewState/);
  assert.match(reviewModeSource, /CAMP_STORAGE_SITTING_REVIEW_FAMILY/);
  assert.match(reviewModeSource, /function applyCampStorageSittingReviewState/);
  assert.match(reviewModeSource, /PATH_CLEARING_GROUND_WORK_REVIEW_FAMILY/);
  assert.match(reviewModeSource, /function applyPathClearingGroundWorkReviewState/);
  assert.match(reviewModeSource, /GARDEN_HARVEST_FOOD_PREP_REVIEW_FAMILY/);
  assert.match(reviewModeSource, /function applyGardenHarvestFoodPrepReviewState/);
  assert.match(reviewModeSource, /devOnly: true/);
  assert.match(sceneSource, /window\.__toyboxReview/);
  assert.match(sceneSource, /reviewLock\.active/);
  assert.match(sceneSource, /function createRestShelterPresentationProp/);
  assert.match(sceneSource, /function syncRestShelterPresentationObject/);
  assert.match(sceneSource, /function createStorageWorkbenchToolsProp/);
  assert.match(sceneSource, /function syncStorageWorkbenchToolsObject/);
  assert.match(sceneSource, /STORAGE_WORKBENCH_TOOLS_ID/);
  assert.match(sceneSource, /createCampLayoutPresentationProp/);
  assert.match(sceneSource, /syncCampLayoutPresentationProp/);
  assert.match(sceneSource, /createGardenPlotsPresentationProp/);
  assert.match(sceneSource, /syncGardenPlotsPresentationProp/);
  assert.match(sceneSource, /createFoodRoutinePresentationProp/);
  assert.match(sceneSource, /syncFoodRoutinePresentationProp/);
  assert.match(sceneSource, /createFishTrapRoutinePresentationProp/);
  assert.match(sceneSource, /syncFishTrapRoutinePresentationProp/);
  assert.match(sceneSource, /createToyPlaySetPresentationProp/);
  assert.match(sceneSource, /syncToyPlaySetPresentationProp/);
  assert.match(sceneSource, /createMusicArtDecorPresentationProp/);
  assert.match(sceneSource, /syncMusicArtDecorPresentationProp/);
  assert.match(sceneSource, /createAnimalFamiliarVisitorPresentationProp/);
  assert.match(sceneSource, /syncAnimalFamiliarVisitorPresentationProp/);
  assert.match(sceneSource, /createNightComfortLightsPresentationProp/);
  assert.match(sceneSource, /syncNightComfortLightsPresentationProp/);
  assert.match(sceneSource, /createLookoutMapHorizonPresentationProp/);
  assert.match(sceneSource, /syncLookoutMapHorizonPresentationProp/);
  assert.match(sceneSource, /createMajorProjectCapstonePresentationProp/);
  assert.match(sceneSource, /syncMajorProjectCapstonePresentationProp/);
  assert.match(sceneSource, /createAmbientBeachFindsPresentationProp/);
  assert.match(sceneSource, /syncAmbientBeachFindsPresentationProp/);
  assert.match(sceneSource, /createPierShoreWorkSitePresentationProp/);
  assert.match(sceneSource, /syncPierShoreWorkSitePresentationProp/);
  assert.match(sceneSource, /createRaftBoatRoutePresentationProp/);
  assert.match(sceneSource, /syncRaftBoatRoutePresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(arrivalSupplies\.group\)/);
  assert.match(sceneSource, /syncArrivalSupplies\(arrivalSupplies,\s*worldState,\s*presentationState,\s*time\)/);
  assert.match(sceneSource, /worldRoot\.add\(builderObjects\.group\)/);
  assert.match(sceneSource, /syncBuilderObjects\(builderObjects,\s*worldState,\s*presentationState,\s*time\)/);
  assert.match(sceneSource, /worldRoot\.add\(campLayout\.group\)/);
  assert.match(sceneSource, /window\.__toyboxCampLayout = syncCampLayoutPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(gardenPlots\.group\)/);
  assert.match(sceneSource, /window\.__toyboxGardenPlots = syncGardenPlotsPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(foodRoutine\.group\)/);
  assert.match(sceneSource, /window\.__toyboxFoodRoutine = syncFoodRoutinePresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(fishTrapRoutine\.group\)/);
  assert.match(sceneSource, /window\.__toyboxFishTrapRoutine = syncFishTrapRoutinePresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(toyPlaySet\.group\)/);
  assert.match(sceneSource, /window\.__toyboxToyPlaySet = syncToyPlaySetPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(musicArtDecor\.group\)/);
  assert.match(sceneSource, /window\.__toyboxMusicArtDecor = syncMusicArtDecorPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(animalFamiliarVisitor\.group\)/);
  assert.match(sceneSource, /window\.__toyboxAnimalFamiliarVisitor = syncAnimalFamiliarVisitorPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(nightComfortLights\.group\)/);
  assert.match(sceneSource, /window\.__toyboxNightComfortLights = syncNightComfortLightsPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(lookoutMapHorizon\.group\)/);
  assert.match(sceneSource, /window\.__toyboxLookoutMapHorizon = syncLookoutMapHorizonPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(majorProjectCapstone\.group\)/);
  assert.match(sceneSource, /window\.__toyboxMajorProjectCapstone = syncMajorProjectCapstonePresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(ambientBeachFinds\.group\)/);
  assert.match(sceneSource, /window\.__toyboxAmbientBeachFinds = syncAmbientBeachFindsPresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(pierShoreWorkSite\.group\)/);
  assert.match(sceneSource, /window\.__toyboxPierShoreWorkSite = syncPierShoreWorkSitePresentationProp/);
  assert.match(sceneSource, /worldRoot\.add\(raftBoatRoute\.group\)/);
  assert.match(sceneSource, /window\.__toyboxRaftBoatRoute = syncRaftBoatRoutePresentationProp/);
});

test("C23b: camera occlusion raycasts receive frame delta for fading", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const occlusionStart = sceneSource.indexOf("function createCameraOcclusionController");
  const occlusionEnd = sceneSource.indexOf("function updateFollowCamera", occlusionStart);
  const occlusionSource = sceneSource.slice(occlusionStart, occlusionEnd);

  assert.match(occlusionSource, /function raycastForOccluders\(rayEnd, blockerCount, deltaSeconds\)/);
  assert.equal((occlusionSource.match(/blockerCount = raycastForOccluders\([^)]*deltaSeconds\);/g) || []).length, 5);
});

test("C24: canvas trace exposes builder inventory, progress, and prop rendering", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const traceStart = sceneSource.indexOf("function syncTrace");
  const traceEnd = sceneSource.indexOf("window.__toyboxCelestial", traceStart);
  const traceSource = sceneSource.slice(traceStart, traceEnd);

  assert.match(traceSource, /canvas\.dataset\.builderRole/);
  assert.match(traceSource, /canvas\.dataset\.builderInventoryWood/);
  assert.match(traceSource, /canvas\.dataset\.builderWorkbenchWood/);
  assert.match(traceSource, /canvas\.dataset\.builderBuildProgress/);
  assert.match(traceSource, /canvas\.dataset\.builderBuildComplete/);
  assert.match(traceSource, /canvas\.dataset\.builderBuildStoredWood/);
  assert.match(traceSource, /canvas\.dataset\.builderBuildRequiredWood/);
  assert.match(traceSource, /canvas\.dataset\.builderTargetId/);
  assert.match(traceSource, /canvas\.dataset\.builderRenderedObjectCount/);
  assert.match(traceSource, /canvas\.dataset\.buildPlankHeldVisible/);
  assert.match(traceSource, /canvas\.dataset\.buildRopeHeldVisible/);
  assert.match(traceSource, /canvas\.dataset\.arrivalSuppliesWashedBundle/);
  assert.match(traceSource, /canvas\.dataset\.arrivalSuppliesScatteredSticks/);
  assert.match(traceSource, /canvas\.dataset\.arrivalSuppliesScatteredLeaves/);
  assert.match(traceSource, /canvas\.dataset\.arrivalSuppliesMaterialPile/);
  assert.match(traceSource, /canvas\.dataset\.arrivalSuppliesCarryBundle/);
  assert.match(traceSource, /canvas\.dataset\.arrivalSuppliesWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyCarriedItem/);
  assert.match(traceSource, /canvas\.dataset\.restShelterVisible/);
  assert.match(traceSource, /canvas\.dataset\.restShelterStage/);
  assert.match(traceSource, /canvas\.dataset\.restShelterVariant/);
  assert.match(traceSource, /canvas\.dataset\.restShelterAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.restShelterTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.restShelterWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.storageWorkbenchToolsVisible/);
  assert.match(traceSource, /canvas\.dataset\.storageWorkbenchToolsStage/);
  assert.match(traceSource, /canvas\.dataset\.campStorageWoodCount/);
  assert.match(traceSource, /canvas\.dataset\.upgradedWorkbenchVisible/);
  assert.match(traceSource, /canvas\.dataset\.toolRackStage/);
  assert.match(traceSource, /canvas\.dataset\.firstToolHeldVisible/);
  assert.match(traceSource, /canvas\.dataset\.storageWorkbenchToolsAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.storageMaterialHeldVisible/);
  assert.match(traceSource, /canvas\.dataset\.storageWorkbenchToolsTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.storageWorkbenchToolsWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyCarriedObject/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyCarrying/);
  assert.match(traceSource, /canvas\.dataset\.reviewMode/);
  assert.match(traceSource, /canvas\.dataset\.reviewFamily/);
  assert.match(traceSource, /canvas\.dataset\.reviewState/);
  assert.match(traceSource, /canvas\.dataset\.firePitLit/);
  assert.match(traceSource, /canvas\.dataset\.firePitFuel/);
  assert.match(traceSource, /canvas\.dataset\.firstFireVisible/);
  assert.match(traceSource, /canvas\.dataset\.firstFireStage/);
  assert.match(traceSource, /canvas\.dataset\.firstFireVariant/);
  assert.match(traceSource, /canvas\.dataset\.firstFireAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.firstFireTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.firstFireWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.firstFireDuplicateSystemClassification/);
  assert.match(traceSource, /canvas\.dataset\.campPathsVisible/);
  assert.match(traceSource, /canvas\.dataset\.campPathsStage/);
  assert.match(traceSource, /canvas\.dataset\.campPathsRenderedSegmentCount/);
  assert.match(traceSource, /canvas\.dataset\.campBoundaryStoneCount/);
  assert.match(traceSource, /canvas\.dataset\.campPathToolHeldVisible/);
  assert.match(traceSource, /canvas\.dataset\.campPathToolAttachmentId/);
  assert.match(traceSource, /canvas\.dataset\.campZonesVisible/);
  assert.match(traceSource, /canvas\.dataset\.campZonesMarkedZoneCount/);
  assert.match(traceSource, /canvas\.dataset\.campCarriedBoundaryStoneVisible/);
  assert.match(traceSource, /canvas\.dataset\.campPathsAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.campPathsTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.campPathsWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.campZonesAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.campZonesTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.campZonesWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.gardenPlotsVisible/);
  assert.match(traceSource, /canvas\.dataset\.gardenPlotsStage/);
  assert.match(traceSource, /canvas\.dataset\.gardenCropType/);
  assert.match(traceSource, /canvas\.dataset\.gardenWatered/);
  assert.match(traceSource, /canvas\.dataset\.gardenRenderedPlotCount/);
  assert.match(traceSource, /canvas\.dataset\.gardenWaterCanVisible/);
  assert.match(traceSource, /canvas\.dataset\.gardenSeedPouchVisible/);
  assert.match(traceSource, /canvas\.dataset\.gardenHarvestedCropVisible/);
  assert.match(traceSource, /canvas\.dataset\.gardenPlotsAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.gardenPlotsTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.gardenPlotsWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineVisible/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineStage/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineCookSurfaceVisible/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineBasketVisible/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineStoredMealsVisible/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineDryingRackVisible/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineFishHarvestVisible/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineLeftoversVisible/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.foodRoutineWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineStage/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineTrapState/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineTrapVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineBuoyVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineLineVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineDryingRackVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineCatchDisplayVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineCarriedRodVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineCarriedTrapVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineCarriedCatchVisible/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineCarriedAttachmentCount/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutineWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.fishTrapRoutinePlaceholderNote/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetStage/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetCollectionSlotsVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetToyBlocksVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetBallVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetKiteVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetSpinningTopVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetPlayMatVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetCarriedBlockVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetCarriedBallVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetCarriedKiteVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetCarriedTopVisible/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetCarriedAttachmentCount/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetExistingBuildableId/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetDuplicateSystemClassification/);
  assert.match(traceSource, /canvas\.dataset\.toyPlaySetPlaceholderNote/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorStage/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorShellChimeVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorPaintedStonesVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorDrumVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorFluteVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorHangingDecorationVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorArtDisplaySlotVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorPerformanceMarkerVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorNoteMarkersVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorCarriedStoneVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorCarriedDecorationVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorCarriedShellChimeVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorCarriedDrumStickVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorCarriedFluteVisible/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorCarriedAttachmentCount/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorStaticMarkerPoolSize/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorDuplicateSystemClassification/);
  assert.match(traceSource, /canvas\.dataset\.musicArtDecorParticlePerformanceNote/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorVisible/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorStage/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorGroundVisitorVisible/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorBirdVisitorVisible/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorFishVisitorVisible/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorFoodCrumbsVisible/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorObserveRingVisible/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorApproachMarkersVisible/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorCollisionEnabled/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorBlocksMovement/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorAffectsCameraFollow/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.animalFamiliarVisitorNonblockingNote/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsVisible/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsStage/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsLanternPostsVisible/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsLitPathAnchorsVisible/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsGlowingShellsVisible/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsFirefliesVisible/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsSitAnchorVisible/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsDynamicLightCount/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsUsesDynamicLights/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsMaxFireflySprites/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.nightComfortLightsLightPerformanceNote/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonStage/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonPlatformVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonStepsVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonMapBoardVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonSketchMapVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonHorizonMarkerVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonHorizonHighlightVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonKeepsakeDisplayVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonDay100GatheringVisible/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonClimbingEnabled/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonMapDiscoveryEnabled/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonDay100CompletionEnabled/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.lookoutMapHorizonMovementDiscoveryNote/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneVisible/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneStage/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneSelectedOption/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneStage0SuppliesVisible/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstonePartialBuildVisible/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneMostlyBuiltVisible/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneCompleteBuildVisible/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneCelebrationDetailVisible/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneResourcePlanningEnabled/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneConstructionMechanicsEnabled/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneMilestoneLogicEnabled/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneTravelDiscoveryEnabled/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.majorProjectCapstoneOptionNote/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsStage/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsShellsVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsDriftwoodVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsTinyFindsVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsFoodCrumbsVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsAnimalVisitorVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsBirdMarkersVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsFishMarkersVisible/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsShellCount/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsRenderedObjectCount/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsInstancedShellCount/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsInstancedTinyFindCount/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsPooledObjectCount/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.ambientBeachFindsWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteVisible/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteStage/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSitePostsVisible/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSitePlanksVisible/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteLashingsVisible/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteSafeBuildSiteVisible/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteFishingSlotVisible/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSitePostCount/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteRenderedObjectCount/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSitePooledObjectCount/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.pierShoreWorkSiteSafetyNote/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteStage/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteBuildStage/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteWaterState/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteFrameVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteTiedPlatformVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRoutePaddleVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteOnWaterVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteWakeVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteRouteMarkerVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteReturnLandingVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteCarriedLogVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteCarriedRopeVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteCarriedPaddleVisible/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteLogCount/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteRouteMarkerCount/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteCarriedAttachmentCount/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteRenderedObjectCount/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRoutePooledObjectCount/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteTransformNormalized/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteWorldStateHook/);
  assert.match(traceSource, /canvas\.dataset\.raftBoatRouteFutureIntegrationNote/);
  assert.match(traceSource, /canvas\.dataset\.presentationAnimationRootMotion/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyAttentionEmoteState/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyAttentionEmoteRootMotion/);
  assert.match(traceSource, /canvas\.dataset\.presentationAnimationEmoteState/);
  assert.match(traceSource, /canvas\.dataset\.presentationAnimationEmoteRootMotion/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyLocomotionState/);
  assert.match(traceSource, /canvas\.dataset\.bubbleBoyLocomotionRootMotion/);
  assert.match(traceSource, /canvas\.dataset\.presentationAnimationLocomotionState/);
  assert.match(traceSource, /canvas\.dataset\.presentationAnimationLocomotionRootMotion/);
  assert.match(traceSource, /canvas\.dataset\.presentationFirstFireStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationFirstFireAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.presentationFirstFireTransformId/);
  assert.match(traceSource, /canvas\.dataset\.presentationArrivalSuppliesStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationBubbleBoyCarriedItem/);
  assert.match(traceSource, /canvas\.dataset\.presentationRestShelterStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationStorageWorkbenchToolsStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationGardenPlotsStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationFoodRoutineStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationFoodRoutineAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.presentationFoodRoutineTransformId/);
  assert.match(traceSource, /canvas\.dataset\.presentationAmbientBeachFindsStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationAmbientBeachFindsShellCount/);
  assert.match(traceSource, /canvas\.dataset\.presentationAmbientBeachFindsAnimalVisitorVisible/);
  assert.match(traceSource, /canvas\.dataset\.presentationAmbientBeachFindsAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.presentationAmbientBeachFindsTransformId/);
  assert.match(traceSource, /canvas\.dataset\.presentationPierShoreWorkSiteStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationPierShoreWorkSitePostCount/);
  assert.match(traceSource, /canvas\.dataset\.presentationPierShoreWorkSiteAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.presentationPierShoreWorkSiteTransformId/);
  assert.match(traceSource, /canvas\.dataset\.presentationPierShoreWorkSiteSafetyNote/);
  assert.match(traceSource, /canvas\.dataset\.presentationRaftBoatRouteStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationRaftBoatRouteBuildStage/);
  assert.match(traceSource, /canvas\.dataset\.presentationRaftBoatRouteWaterState/);
  assert.match(traceSource, /canvas\.dataset\.presentationRaftBoatRouteAssetSourceId/);
  assert.match(traceSource, /canvas\.dataset\.presentationRaftBoatRouteTransformId/);
  assert.match(traceSource, /canvas\.dataset\.presentationRaftBoatRouteFutureIntegrationNote/);
  assert.match(traceSource, /canvas\.dataset\.presentationBubbleBoyCarrying/);
});

test("C25: builder resource trees expose mature tree scale metadata", () => {
  const worldState = createInitialWorldState({
    seed: 107,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];

  for (const treeId of BUILDER_TREE_IDS) {
    const tree = worldState.objects[treeId];
    assert.equal(tree.type, "resourceTree");
    assert.ok(tree.height >= 4.6, `${treeId} height ${tree.height} is too small`);
    assert.ok(tree.canopyRadius >= 1.45, `${treeId} canopyRadius ${tree.canopyRadius} is too small`);
    assert.ok(tree.trunkRadius >= 0.32, `${treeId} trunkRadius ${tree.trunkRadius} is too small`);
    assert.ok(tree.harvestRadius >= 1.2, `${treeId} harvestRadius ${tree.harvestRadius} is too small`);
    assert.ok(tree.maxWood >= 5, `${treeId} maxWood ${tree.maxWood} is too small`);
    assertSafeFromFireAndWater(tree.position, firePit);
  }
});

test("C26: scene scales resource tree props from world-state tree dimensions", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const createStart = sceneSource.indexOf("function createResourceForestProp");
  const createEnd = sceneSource.indexOf("function createBuildSiteProp", createStart);
  const createSource = sceneSource.slice(createStart, createEnd);
  const syncStart = sceneSource.indexOf("function syncResourceTreeInstance");
  const syncEnd = sceneSource.indexOf("function syncBuilderObjectPosition", syncStart);
  const syncSource = sceneSource.slice(syncStart, syncEnd);

  assert.match(createSource, /new THREE\.InstancedMesh/);
  assert.match(createSource, /trunks/);
  assert.match(createSource, /lowerCanopies/);
  assert.match(createSource, /upperCanopies/);
  assert.match(createSource, /crowns/);
  assert.match(syncSource, /treeState\.height/);
  assert.match(syncSource, /treeState\.trunkRadius/);
  assert.match(syncSource, /treeState\.canopyRadius/);
  assert.match(syncSource, /setMatrixAt/);
  assert.match(syncSource, /setColorAt/);
  assert.match(syncSource, /instanceMatrix\.needsUpdate/);
  assert.match(syncSource, /tree\.userData\.visualHeight/);
});

test("C27: builder island starts with a mature resource forest across the whole island", () => {
  const worldState = createInitialWorldState({
    seed: 109,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const firePit = worldState.objects[FIRE_PIT_ID];

  assert.ok(BUILDER_TREE_IDS.length >= 90);
  assert.ok(BUILDER_FOREST_SECTOR.targetIslandCoverage >= 0.8);
  const positions = [];
  const angles = [];
  const radii = [];
  const quadrantCounts = [0, 0, 0, 0];
  for (const treeId of BUILDER_TREE_IDS) {
    const tree = worldState.objects[treeId];
    assert.equal(tree.type, "resourceTree");
    assert.ok(tree.height >= 4.6);
    assert.ok(tree.canopyRadius >= 1.45);
    assertSafeFromFireAndWater(tree.position, firePit);
    const waterClearance = islandShoreRadius(Math.atan2(tree.position.z, tree.position.x)) - Math.hypot(tree.position.x, tree.position.z);
    assert.ok(
      waterClearance >= BUILDER_TREE_WATER_CLEARANCE - 0.001,
      `${treeId} water clearance ${waterClearance.toFixed(3)} below ${BUILDER_TREE_WATER_CLEARANCE.toFixed(3)}`
    );
    positions.push(tree.position);
    const angle = Math.atan2(tree.position.z, tree.position.x);
    angles.push(angle);
    radii.push(Math.hypot(tree.position.x, tree.position.z));
    const quadrant = Math.floor(((angle + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 2)) % 4;
    quadrantCounts[quadrant] += 1;
  }

  const angleSpan = Math.max(...angles) - Math.min(...angles);
  const radialSpan = Math.max(...radii) - Math.min(...radii);
  const forestSectorArea = 0.5 * angleSpan * (Math.max(...radii) ** 2 - Math.min(...radii) ** 2);
  const islandArea = Math.PI * PLAYABLE_RADIUS ** 2;
  assert.ok(angleSpan >= 6.0, `forest angle span ${angleSpan.toFixed(2)} is too narrow`);
  assert.ok(radialSpan >= 26, `forest radial span ${radialSpan.toFixed(2)} is too shallow`);
  assert.ok(forestSectorArea / islandArea >= 0.80, `forest coverage ${(forestSectorArea / islandArea).toFixed(2)} is too small`);
  assert.ok(quadrantCounts.every((count) => count >= 18), `forest quadrants are imbalanced: ${quadrantCounts.join(",")}`);
  assert.ok(positions.filter((position) => Math.hypot(position.x, position.z) > 24).length >= 30);
  for (let outer = 0; outer < positions.length; outer += 1) {
    for (let inner = outer + 1; inner < positions.length; inner += 1) {
      const distance = Math.hypot(positions[outer].x - positions[inner].x, positions[outer].z - positions[inner].z);
      assert.ok(
        distance >= BUILDER_TREE_MIN_DISTANCE - 0.001,
        `tree spacing ${distance.toFixed(3)} below ${BUILDER_TREE_MIN_DISTANCE.toFixed(3)}`
      );
    }
  }
});

test("C28: canvas trace exposes mature builder tree count and visual heights", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const traceStart = sceneSource.indexOf("function syncTrace");
  const traceEnd = sceneSource.indexOf("window.__toyboxCelestial", traceStart);
  const traceSource = sceneSource.slice(traceStart, traceEnd);
  const builderSyncStart = sceneSource.indexOf("function syncBuilderObjects");
  const builderSyncEnd = sceneSource.indexOf("function syncResourceTreeInstance", builderSyncStart);
  const builderSyncSource = sceneSource.slice(builderSyncStart, builderSyncEnd);

  assert.match(builderSyncSource, /treeHeights/);
  assert.match(builderSyncSource, /treeRegrowth/);
  assert.match(builderSyncSource, /buildComplete/);
  assert.match(builderSyncSource, /workbenchWood/);
  assert.match(traceSource, /canvas\.dataset\.builderTreeCount/);
  assert.match(traceSource, /canvas\.dataset\.builderTreeHeights/);
  assert.match(traceSource, /canvas\.dataset\.builderTreeWood/);
  assert.match(traceSource, /canvas\.dataset\.builderTreeRegrowth/);
  assert.match(traceSource, /canvas\.dataset\.builderForestCoverage/);
  assert.match(traceSource, /canvas\.dataset\.builderForestAngleSpan/);
  assert.match(traceSource, /canvas\.dataset\.builderForestRadialSpan/);
});

test("C29: resource tree materials stay readable in low light", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const builderStart = sceneSource.indexOf("function createBuilderObjects");
  const builderEnd = sceneSource.indexOf("function createWorkbenchProp", builderStart);
  const builderSource = sceneSource.slice(builderStart, builderEnd);
  const syncStart = sceneSource.indexOf("function syncResourceTreeInstance");
  const syncEnd = sceneSource.indexOf("function syncBuilderObjectPosition", syncStart);
  const syncSource = sceneSource.slice(syncStart, syncEnd);

  assert.match(builderSource, /bark:[\s\S]*emissive:[\s\S]*emissiveIntensity/);
  assert.match(builderSource, /leaves:[\s\S]*emissive:[\s\S]*emissiveIntensity/);
  assert.match(builderSource, /youngLeaves:[\s\S]*emissive:[\s\S]*emissiveIntensity/);
  assert.match(syncSource, /forest\.trunks\.material\.emissiveIntensity/);
  assert.match(syncSource, /forest\.lowerCanopies\.material\.emissiveIntensity/);
  assert.match(syncSource, /forest\.crowns\.material\.emissiveIntensity/);
  assert.match(syncSource, /woodFactor/);
});

test("C30: resource forest follows Three.js instancing patterns", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const createStart = sceneSource.indexOf("function createResourceForestProp");
  const createEnd = sceneSource.indexOf("function createBuildSiteProp", createStart);
  const createSource = sceneSource.slice(createStart, createEnd);
  const syncStart = sceneSource.indexOf("function syncResourceTreeInstance");
  const syncEnd = sceneSource.indexOf("function syncBuilderObjectPosition", syncStart);
  const syncSource = sceneSource.slice(syncStart, syncEnd);

  assert.match(createSource, /new THREE\.InstancedMesh/);
  assert.match(createSource, /instanceMatrix\.setUsage\(THREE\.DynamicDrawUsage\)/);
  assert.match(createSource, /frustumCulled = false/);
  assert.match(syncSource, /mesh\.setMatrixAt\(index,\s*forest\.dummy\.matrix\)/);
  assert.match(syncSource, /forest\.trunks\.setColorAt/);
  assert.match(syncSource, /forest\.lowerCanopies\.setColorAt/);
  assert.match(syncSource, /mesh\.instanceMatrix\.needsUpdate = true/);
  assert.match(syncSource, /mesh\.instanceColor\.needsUpdate = true/);
});

test("C31: skybox has layered stars, clouds, birds, and trace fields", () => {
  const sceneSource = readFileSync(resolve(REPO_ROOT, "bubble_ui/static/toybox/scene.js"), "utf8");
  const starsStart = sceneSource.indexOf("function createStars");
  const starsEnd = sceneSource.indexOf("function createCelestialBodies", starsStart);
  const starsSource = sceneSource.slice(starsStart, starsEnd);
  const skyLifeStart = sceneSource.indexOf("function syncSkyLife");
  const skyLifeEnd = sceneSource.indexOf("function updateSkyTint", skyLifeStart);
  const skyLifeSource = sceneSource.slice(skyLifeStart, skyLifeEnd);
  const traceStart = sceneSource.indexOf("function syncTrace");
  const traceEnd = sceneSource.indexOf("window.__toyboxCelestial", traceStart);
  const traceSource = sceneSource.slice(traceStart, traceEnd);

  assert.match(sceneSource, /const clouds = createClouds\(\)/);
  assert.match(sceneSource, /const birds = createBirds\(\)/);
  assert.match(sceneSource, /syncSkyLife\(\{ stars,\s*clouds,\s*birds,\s*env,\s*celestial,\s*time \}\)/);
  assert.match(starsSource, /Layered procedural starfield/);
  assert.match(starsSource, /Faint deep star canopy/);
  assert.match(starsSource, /Bright hand-picked star sparks/);
  assert.match(starsSource, /Low-contrast milky star band/);
  assert.match(sceneSource, /function createClouds/);
  assert.match(sceneSource, /function createCloudTexture/);
  assert.match(sceneSource, /function createBirds/);
  assert.match(sceneSource, /function createBirdSilhouette/);
  assert.match(skyLifeSource, /starVisibility/);
  assert.match(skyLifeSource, /cloudVisibility/);
  assert.match(skyLifeSource, /birdVisibility/);
  assert.match(skyLifeSource, /window\.__toyboxSkyLife/);
  assert.match(traceSource, /canvas\.dataset\.skyStarLayerCount/);
  assert.match(traceSource, /canvas\.dataset\.skyCloudSpriteCount/);
  assert.match(traceSource, /canvas\.dataset\.skyBirdCount/);
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

function completeBuildableForTest(worldState, buildableId) {
  const buildable = worldState.buildables[buildableId];
  buildable.progress = 1;
  buildable.status = "complete";
  buildable.storedWood = buildable.requiredWood;
  buildable.storedResources.wood = buildable.requiredWood;
  buildable.completedStageCount = buildable.stages.length;
  buildable.currentStageIndex = buildable.stages.length;
  buildable.stageProgress = 1;
  buildable.completedAt = worldState.sim.elapsedSeconds;
  if (buildableId === BUILDABLE_IDS.shelter) {
    worldState.environment.safety.shelterAvailable = true;
  }
}

function assertSafeFromFireAndWater(position, firePit) {
  const distanceFromFireCenter = Math.hypot(position.x - firePit.position.x, position.z - firePit.position.z);
  const fireEdgeClearance = distanceFromFireCenter - FIRE_VISUAL_RADIUS - BUBBLE_BOY_RADIUS;
  assert.ok(
    fireEdgeClearance >= BUBBLE_BOY_CLEARANCE - 0.001,
    `fire edge clearance ${fireEdgeClearance.toFixed(3)} below ${BUBBLE_BOY_CLEARANCE.toFixed(3)}`
  );

  const waterEdgeClearance = islandShoreRadius(Math.atan2(position.z, position.x)) - Math.hypot(position.x, position.z) - BUBBLE_BOY_RADIUS;
  assert.ok(
    waterEdgeClearance >= BUBBLE_BOY_CLEARANCE - 0.001,
    `water edge clearance ${waterEdgeClearance.toFixed(3)} below ${BUBBLE_BOY_CLEARANCE.toFixed(3)}`
  );
}

function safeIslandCenterRadius(angle) {
  return Math.max(0, islandShoreRadius(angle) - WATER_CLEAR_INSET);
}

function islandShoreRadius(angle) {
  let radius = 3.02;
  radius += Math.sin(angle * 2.0 + 0.35) * 0.15;
  radius += Math.sin(angle * 3.0 - 1.20) * 0.10;
  radius += Math.sin(angle * 5.0 + 1.65) * 0.055;
  radius -= islandCove(angle, 2.42, 0.34, 0.20);
  radius -= islandCove(angle, -1.82, 0.28, 0.16);
  radius += islandCove(angle, -0.55, 0.40, 0.12);
  return radius * WORLD_RADIUS_SCALE;
}

function islandCove(angle, center, width, depth) {
  const distance = Math.atan2(Math.sin(angle - center), Math.cos(angle - center));
  return depth * Math.exp(-(distance * distance) / (width * width));
}
