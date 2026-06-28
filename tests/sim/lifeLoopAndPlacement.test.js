import assert from "node:assert/strict";
import test from "node:test";

import { simulate } from "../../bubble_ui/static/toybox/simulation/simulate.js";
import {
  BUILDABLE_IDS,
  BUILDER_TREE_IDS,
  FIRE_PIT_ID,
  FIXED_DT,
  LIFE_LOOP_READY_DAYS_11_TO_15,
  LIFE_LOOP_READY_OBJECTIVE,
  PLACEMENT_FOOTPRINT_RADII,
  WORKBENCH_ID,
  createInitialWorldState,
  distance2d,
  findNearestFreePosition,
  isAreaFree,
  lifeObjectiveKey,
  normalizeWorldState,
  reserveFootprint,
  resolveOverlaps,
  vec3
} from "../../bubble_ui/static/toybox/simulation/worldState.js";

test("life loop starts on Day 1 arrive objective", () => {
  const worldState = createInitialWorldState({ seed: 201 });

  assert.equal(worldState.lifeLoop.lifeDay, 1);
  assert.equal(worldState.lifeLoop.currentObjective, "arrive");
  assert.deepEqual(worldState.lifeLoop.completedObjectives, []);
  assert.equal(worldState.lifeLoop.canSleep, false);
  assert.equal(worldState.lifeLoop.sleeping, false);
});

test("Day 1 arrive and gather supplies select explicit life loop goals", () => {
  const arrivalState = createInitialWorldState({
    seed: 212,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });

  simulate(FIXED_DT, arrivalState);

  assert.equal(arrivalState.bubbleBoy.goal, "lifeArrive");
  assert.equal(arrivalState.bubbleBoy.currentAction, "arriveLookAround");

  const gatherState = createInitialWorldState({
    seed: 213,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  gatherState.lifeLoop.currentObjective = "gatherSupplies";
  gatherState.lifeLoop.objectiveStartedAt = null;
  gatherState.lifeLoop.objectiveStartedTick = 0;
  gatherState.lifeLoop.objectiveStartedKey = "";
  gatherState.bubbleBoy.minActionTime = 0;

  simulate(FIXED_DT, gatherState);

  assert.equal(gatherState.bubbleBoy.goal, "lifeGatherSupplies");
  assert.equal(gatherState.bubbleBoy.currentAction, "gatherLooseSupplies");
});

test("Day 1 cannot advance by sleeping before required objectives are complete", () => {
  const worldState = createInitialWorldState({ seed: 202 });

  simulate(FIXED_DT, worldState, [{ type: "sleep" }]);

  assert.equal(worldState.lifeLoop.lifeDay, 1);
  assert.equal(worldState.lifeLoop.sleepRequested, true);
  assert.equal(worldState.lifeLoop.sleeping, false);
  assert.equal(worldState.lifeLoop.canSleep, false);
  assert.match(worldState.lifeLoop.currentBlocker, /Complete .* before sleeping|Finish the day's required objectives/);
});

test("Completing Day 1 objectives and sleeping advances to life day 2 at dawn", () => {
  const worldState = createInitialWorldState({
    seed: 203,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });

  driveLifeLoop(worldState, {
    stop: (state) => state.lifeLoop.lifeDay === 2 && state.lifeLoop.currentObjective === "wake"
  });

  assert.equal(worldState.lifeLoop.lifeDay, 2);
  assert.equal(worldState.lifeLoop.currentObjective, "wake");
  assert.equal(worldState.lifeLoop.lastWakeDay, 2);
  assert.equal(worldState.lifeLoop.wakePending, true);
  assert.equal(worldState.time.phase, "dawn");
  assert.ok(Math.abs(worldState.time.timeOfDay - 0.258) < 0.015);
  assert.equal(worldState.bubbleBoy.energy, 100);
  assert.ok(worldState.lifeLoop.completedObjectives.includes(lifeObjectiveKey(1, "sleepUntilMorning")));
});

test("Days 1-5 objective sequence progresses in authored order and pauses ready for Days 6-10", () => {
  const worldState = createInitialWorldState({
    seed: 204,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });

  driveLifeLoop(worldState, {
    stop: (state) => state.lifeLoop.lifeDay === 5 && state.lifeLoop.currentObjective === LIFE_LOOP_READY_OBJECTIVE
  });

  assert.deepEqual(worldState.lifeLoop.completedObjectives, [
    "day1.arrive",
    "day1.gatherSupplies",
    "day1.stabilizeFire",
    "day1.buildRestSpot",
    "day1.sleepUntilMorning",
    "day2.wake",
    "day2.exploreIsland",
    "day2.gatherWood",
    "day2.markCamp",
    "day2.sleepUntilMorning",
    "day3.wake",
    "day3.clearCampArea",
    "day3.gatherWood",
    "day3.startShelter",
    "day3.sleepUntilMorning",
    "day4.wake",
    "day4.continueShelter",
    "day4.fish",
    "day4.cookFish",
    "day4.sleepUntilMorning",
    "day5.wake",
    "day5.finishShelter",
    "day5.useBedOrRestSpot",
    "day5.tendFire",
    "day5.completeDayFive"
  ]);
  assert.equal(worldState.lifeLoop.lifeDay, 5);
  assert.equal(worldState.lifeLoop.currentObjective, LIFE_LOOP_READY_OBJECTIVE);
  assert.equal(worldState.lifeLoop.trackComplete, false);
  assert.equal(worldState.lifeLoop.readyForNextTrack, true);
  assert.equal(worldState.lifeLoop.canSleep, false);
  assert.match(worldState.lifeLoop.currentBlocker, /Ready for Days 6-10/);
});

test("Days 1-5 acceptance progresses naturally without helper resource injection", () => {
  const worldState = createInitialWorldState({
    seed: 211,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });

  driveNaturalLifeLoop(worldState, {
    stop: (state) => state.lifeLoop.lifeDay === 5 && state.lifeLoop.currentObjective === LIFE_LOOP_READY_OBJECTIVE
  });

  assert.deepEqual(worldState.lifeLoop.completedObjectives, [
    "day1.arrive",
    "day1.gatherSupplies",
    "day1.stabilizeFire",
    "day1.buildRestSpot",
    "day1.sleepUntilMorning",
    "day2.wake",
    "day2.exploreIsland",
    "day2.gatherWood",
    "day2.markCamp",
    "day2.sleepUntilMorning",
    "day3.wake",
    "day3.clearCampArea",
    "day3.gatherWood",
    "day3.startShelter",
    "day3.sleepUntilMorning",
    "day4.wake",
    "day4.continueShelter",
    "day4.fish",
    "day4.cookFish",
    "day4.sleepUntilMorning",
    "day5.wake",
    "day5.finishShelter",
    "day5.useBedOrRestSpot",
    "day5.tendFire",
    "day5.completeDayFive"
  ]);
  assert.equal(worldState.lifeLoop.currentObjective, LIFE_LOOP_READY_OBJECTIVE);
  assert.equal(worldState.lifeLoop.readyForNextTrack, true);
  assert.equal(worldState.buildables[BUILDABLE_IDS.shelter].progress, 1);
  assert.equal(worldState.environment.safety.shelterAvailable, true);
  assert.ok(worldState.lifeLoop.firstRestSpotBuilt);
});

test("shelter objectives gather missing wood before building", () => {
  const worldState = createInitialWorldState({
    seed: 212,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });
  const tree = worldState.objects[BUILDER_TREE_IDS[0]];
  const shelter = worldState.buildables[BUILDABLE_IDS.shelter];
  worldState.lifeLoop.lifeDay = 3;
  worldState.lifeLoop.currentObjective = "startShelter";
  worldState.lifeLoop.objectiveStartedAt = null;
  worldState.lifeLoop.objectiveStartedTick = 0;
  worldState.lifeLoop.objectiveStartedKey = "";
  shelter.progress = 0;
  shelter.storedWood = 0;
  shelter.storedResources.wood = 0;
  worldState.bubbleBoy.energy = 100;
  worldState.bubbleBoy.hunger = 0;
  worldState.bubbleBoy.inventory.wood = 0.5;
  worldState.objects[WORKBENCH_ID].wood = worldState.bubbleBoy.inventory.wood;
  worldState.bubbleBoy.position = {
    x: tree.position.x + 0.25,
    y: worldState.bubbleBoy.position.y,
    z: tree.position.z + 0.25
  };
  worldState.bubbleBoy.goal = "wander";
  worldState.bubbleBoy.currentAction = "idle";
  worldState.bubbleBoy.minActionTime = 0;

  simulate(FIXED_DT, worldState);

  assert.equal(worldState.bubbleBoy.goal, "gatherWood");
  assert.equal(worldState.bubbleBoy.currentAction, "gatheringWood");
  assert.equal(worldState.bubbleBoy.targetId, tree.id);
  assert.equal(shelter.progress, 0);
});

test("Day 6 cannot start unless Day 5 is complete", () => {
  const worldState = createInitialWorldState({ seed: 206 });
  worldState.lifeLoop.lifeDay = 5;
  worldState.lifeLoop.currentObjective = "completeDayFive";
  worldState.lifeLoop.completedObjectives = [
    "day5.wake",
    "day5.finishShelter",
    "day5.useBedOrRestSpot",
    "day5.tendFire"
  ];

  simulate(FIXED_DT, worldState);

  assert.equal(worldState.lifeLoop.lifeDay, 5);
  assert.equal(worldState.lifeLoop.currentObjective, "completeDayFive");
});

test("Day 6 starts from readyForDays6To10 and clears the ready blocker", () => {
  const worldState = createInitialWorldState({ seed: 207 });

  driveLifeLoop(worldState, {
    stop: (state) => state.lifeLoop.lifeDay === 5 && state.lifeLoop.currentObjective === LIFE_LOOP_READY_OBJECTIVE
  });
  simulate(FIXED_DT, worldState);

  assert.equal(worldState.lifeLoop.lifeDay, 6);
  assert.equal(worldState.lifeLoop.currentObjective, "wake");
  assert.equal(worldState.lifeLoop.readyForNextTrack, false);
  assert.equal(worldState.lifeLoop.currentBlocker, "");
});

test("Days 6-10 camp organization objectives progress and stop ready for Days 11-15", () => {
  const worldState = createInitialWorldState({
    seed: 208,
    toyboxState: { time_of_day: "day", weather: "clear" }
  });

  driveLifeLoop(worldState, { stop: (state) => state.lifeLoop.trackComplete });

  assert.deepEqual(worldState.lifeLoop.completedObjectives.slice(25), [
    "day6.wake",
    "day6.inspectCamp",
    "day6.buildStorageBasket",
    "day6.depositSupplies",
    "day6.sleepUntilMorning",
    "day7.wake",
    "day7.gatherWood",
    "day7.stackFirewood",
    "day7.tendFire",
    "day7.sleepUntilMorning",
    "day8.wake",
    "day8.clearLooseDebris",
    "day8.organizeTools",
    "day8.sweepCamp",
    "day8.sleepUntilMorning",
    "day9.wake",
    "day9.markRestZone",
    "day9.markWorkZone",
    "day9.markCookZone",
    "day9.sleepUntilMorning",
    "day10.wake",
    "day10.checkStorage",
    "day10.checkFire",
    "day10.eatOrPrepareFood",
    "day10.completeDayTen"
  ]);
  assert.equal(worldState.lifeLoop.lifeDay, 10);
  assert.equal(worldState.lifeLoop.currentObjective, LIFE_LOOP_READY_DAYS_11_TO_15);
  assert.equal(worldState.lifeLoop.trackComplete, true);
  assert.equal(worldState.campOrganization.storageBuilt, true);
  assert.ok(worldState.campOrganization.storedSupplies > 0);
  assert.ok(worldState.campOrganization.storedWood > 0);
  assert.equal(worldState.campOrganization.firewoodStacked, true);
  assert.equal(worldState.campOrganization.fireRoutineChecked, true);
  assert.equal(worldState.campOrganization.looseDebrisCleared, true);
  assert.equal(worldState.campOrganization.toolsOrganized, true);
  assert.equal(worldState.campOrganization.campSwept, true);
  assert.deepEqual(worldState.campOrganization.zonesMarked, { rest: true, work: true, cook: true });
  assert.equal(worldState.campOrganization.routineEstablished, true);
  assert.match(worldState.lifeLoop.currentBlocker, /Ready for Days 11-15/);
});

test("sleep cannot advance Days 6-9 before required objectives are complete", () => {
  const worldState = createInitialWorldState({ seed: 209 });
  driveLifeLoop(worldState, {
    stop: (state) => state.lifeLoop.lifeDay === 5 && state.lifeLoop.currentObjective === LIFE_LOOP_READY_OBJECTIVE
  });
  simulate(FIXED_DT, worldState);

  simulate(FIXED_DT, worldState, [{ type: "sleep" }]);

  assert.equal(worldState.lifeLoop.lifeDay, 6);
  assert.equal(worldState.lifeLoop.sleeping, false);
  assert.equal(worldState.lifeLoop.canSleep, false);
  assert.match(worldState.lifeLoop.currentBlocker, /Complete wake before sleeping|Complete inspectCamp before sleeping/);
});

test("placement helper detects overlapping footprints", () => {
  const reservations = [];
  reserveFootprint("fire", vec3(0, 0, 0), 1.1, "fire", reservations);

  assert.equal(isAreaFree(vec3(0.2, 0, 0.1), 0.8, reservations, { family: "rest" }), false);
  assert.equal(isAreaFree(vec3(5.0, 0, 0), 0.8, reservations, { family: "rest" }), true);
});

test("placement helper finds a nearby free position", () => {
  const reservations = [];
  reserveFootprint("fire", vec3(0, 0, 0), 1.1, "fire", reservations);

  const result = findNearestFreePosition(vec3(0.1, 0, 0.1), 0.8, {
    id: "rest",
    family: "rest",
    reservations
  });

  assert.equal(result.success, true);
  assert.equal(result.moved, true);
  assert.equal(isAreaFree(result.position, 0.8, reservations, { family: "rest" }), true);
});

test("placement resolver settles and does not move objects every tick once resolved", () => {
  const objects = [
    { id: "fire", family: "fire", radius: 1.1, position: vec3(0, 0, 0), fixed: true },
    { id: "rest", family: "rest", radius: 0.9, position: vec3(0.1, 0, 0.1) },
    { id: "toy", family: "toy", radius: 0.6, position: vec3(0.2, 0, 0.2) }
  ];

  const first = resolveOverlaps(objects);
  const second = resolveOverlaps(objects);

  assert.equal(first.conflictCount > 0, true);
  assert.equal(first.resolvedCount, first.conflictCount);
  assert.equal(second.conflictCount, 0);
  assert.deepEqual(second.nudgedObjects, []);
});

test("fire, rest, toy, and buildable placements respect minimum spacing after normalization", () => {
  const worldState = createInitialWorldState({ seed: 205 });
  const fire = worldState.objects[FIRE_PIT_ID];
  worldState.buildables[BUILDABLE_IDS.shelter].position = vec3(fire.position.x + 0.1, fire.position.y, fire.position.z);
  worldState.buildables[BUILDABLE_IDS.bed].position = vec3(fire.position.x + 0.2, fire.position.y, fire.position.z);
  worldState.buildables[BUILDABLE_IDS.toyBlocks].position = vec3(fire.position.x + 0.3, fire.position.y, fire.position.z);
  worldState.buildables[BUILDABLE_IDS.toyBlocks].status = "building";
  worldState.buildables[BUILDABLE_IDS.toyBlocks].progress = 0.05;
  worldState.toyPlaySet.visible = true;
  worldState.toyPlaySet.anchorPosition = vec3(fire.position.x + 0.4, fire.position.y, fire.position.z);

  normalizeWorldState(worldState);

  assert.ok(worldState.placement.resolvedCount >= 3);
  assert.ok(distance2d(fire.position, worldState.buildables[BUILDABLE_IDS.shelter].position) > 2.6);
  assert.ok(distance2d(fire.position, worldState.buildables[BUILDABLE_IDS.bed].position) > 2.4);
  assert.ok(distance2d(fire.position, worldState.buildables[BUILDABLE_IDS.toyBlocks].position) > 2.3);
  assert.ok(distance2d(fire.position, worldState.toyPlaySet.anchorPosition) > 2.3);
});

test("camp organization placements avoid fire, rest, workbench, shelter, and each other", () => {
  const worldState = createInitialWorldState({ seed: 210 });
  const fire = worldState.objects[FIRE_PIT_ID];
  const shelter = worldState.buildables[BUILDABLE_IDS.shelter];
  worldState.campOrganization.storageBuilt = true;
  worldState.campOrganization.firewoodStacked = true;
  worldState.campOrganization.storedWood = 2;
  worldState.campOrganization.zonesMarked = { rest: true, work: true, cook: true };
  worldState.campStorage.visible = true;
  worldState.campStorage.storageBuilt = true;
  worldState.campStorage.storedWood = 2;
  worldState.campStorage.woodCount = 2;
  worldState.campStorage.anchorPosition = vec3(fire.position.x + 0.1, fire.position.y, fire.position.z);
  worldState.campStorage.firewoodStackPosition = vec3(fire.position.x + 0.2, fire.position.y, fire.position.z);
  worldState.toolRack.anchorPosition = vec3(shelter.position.x + 0.1, shelter.position.y, shelter.position.z);
  for (const zone of worldState.campLayout.zones) {
    zone.visible = true;
    zone.stage = "marked";
    zone.markerPlaced = true;
    zone.anchorPosition = vec3(fire.position.x + 0.15, fire.position.y, fire.position.z + 0.15);
  }

  normalizeWorldState(worldState);
  const firstResolvedCount = worldState.placement.resolvedCount;
  const firstPositions = {
    storage: { ...worldState.campStorage.anchorPosition },
    firewood: { ...worldState.campStorage.firewoodStackPosition },
    toolRack: { ...worldState.toolRack.anchorPosition },
    zones: worldState.campLayout.zones.map((zone) => ({ ...zone.anchorPosition }))
  };
  normalizeWorldState(worldState);

  assert.ok(firstResolvedCount >= 4);
  assert.ok(distance2d(fire.position, worldState.campStorage.anchorPosition) > 1.9);
  assert.ok(distance2d(fire.position, worldState.campStorage.firewoodStackPosition) > 1.7);
  assert.ok(distance2d(fire.position, zoneByType(worldState, "rest").anchorPosition) > 2.0);
  assert.ok(distance2d(fire.position, zoneByType(worldState, "cook").anchorPosition) > 1.4);
  assert.ok(distance2d(worldState.objects[WORKBENCH_ID].position, worldState.campStorage.anchorPosition) > 1.8);
  assert.ok(distance2d(shelter.position, worldState.toolRack.anchorPosition) > 1.8);
  assert.ok(distance2d(zoneByType(worldState, "work").anchorPosition, zoneByType(worldState, "rest").anchorPosition) > 1.3);
  assert.deepEqual(worldState.campStorage.anchorPosition, firstPositions.storage);
  assert.deepEqual(worldState.campStorage.firewoodStackPosition, firstPositions.firewood);
  assert.deepEqual(worldState.toolRack.anchorPosition, firstPositions.toolRack);
  assert.deepEqual(worldState.campLayout.zones.map((zone) => zone.anchorPosition), firstPositions.zones);
});

function driveLifeLoop(worldState, { stop, maxTicks = 6500 }) {
  let lastObjective = "";
  for (let tick = 0; tick < maxTicks; tick += 1) {
    prepareAuthoredObjective(worldState, lastObjective);
    lastObjective = worldState.lifeLoop.currentObjective;
    const intents = worldState.lifeLoop.currentObjective === "sleepUntilMorning" && worldState.lifeLoop.canSleep
      ? [{ type: "sleep" }]
      : [];
    simulate(FIXED_DT, worldState, intents);
    if (stop(worldState)) return worldState;
  }
  assert.fail(`life loop did not reach target from ${worldState.lifeLoop.currentObjective}`);
}

function driveNaturalLifeLoop(worldState, { stop, maxTicks = 10000 }) {
  for (let tick = 0; tick < maxTicks; tick += 1) {
    const intents = worldState.lifeLoop.currentObjective === "sleepUntilMorning" && worldState.lifeLoop.canSleep
      ? [{ type: "sleep" }]
      : [];
    simulate(FIXED_DT, worldState, intents);
    if (stop(worldState)) return worldState;
  }
  assert.fail(`natural life loop did not reach target from ${worldState.lifeLoop.currentObjective}`);
}

function prepareAuthoredObjective(worldState, lastObjective) {
  const objective = worldState.lifeLoop.currentObjective;
  if (objective !== lastObjective) worldState.bubbleBoy.minActionTime = 0;
  worldState.bubbleBoy.energy = 100;
  worldState.bubbleBoy.hunger = 0;
  worldState.environment.weatherIntensity = 0;
  worldState.environment.safety.nightRisk = 0;

  if (objective === "gatherSupplies" || objective === "gatherWood") {
    const tree = worldState.objects[BUILDER_TREE_IDS[0]];
    worldState.bubbleBoy.targetId = tree.id;
    worldState.bubbleBoy.position = {
      x: tree.position.x + 0.2,
      y: worldState.bubbleBoy.position.y,
      z: tree.position.z + 0.2
    };
  }

  if (objective === "startShelter" || objective === "continueShelter" || objective === "finishShelter") {
    const shelter = worldState.buildables[BUILDABLE_IDS.shelter];
    worldState.bubbleBoy.inventory.wood = Math.max(worldState.bubbleBoy.inventory.wood, shelter.requiredWood);
    worldState.objects[WORKBENCH_ID].wood = worldState.bubbleBoy.inventory.wood;
    worldState.bubbleBoy.targetId = shelter.id;
    worldState.bubbleBoy.position = {
      x: shelter.position.x + 0.2,
      y: worldState.bubbleBoy.position.y,
      z: shelter.position.z + 0.2
    };
  }

  if (objective === "stabilizeFire" || objective === "cookFish" || objective === "tendFire") {
    const fire = worldState.objects[FIRE_PIT_ID];
    worldState.bubbleBoy.targetId = FIRE_PIT_ID;
    worldState.bubbleBoy.position = {
      x: fire.position.x + 5.4,
      y: worldState.bubbleBoy.position.y,
      z: fire.position.z
    };
  }
}

function zoneByType(worldState, type) {
  const zone = worldState.campLayout.zones.find((entry) => entry.type === type);
  assert.ok(zone, `expected ${type} zone`);
  return zone;
}
