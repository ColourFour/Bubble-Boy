import * as THREE from "three";

import { FISH_TRAP_ROUTINE_ID } from "../simulation/worldState.js";

const DEFAULT_TRAP_ANCHOR = Object.freeze({ x: -13.7, y: 0.18, z: 32.6, yaw: -0.58 });
const DEFAULT_BUOY_ANCHOR = Object.freeze({ x: -15.05, y: -0.12, z: 33.8, yaw: -0.28 });
const DEFAULT_DRYING_ANCHOR = Object.freeze({ x: -11.52, y: 0.18, z: 30.28, yaw: -0.22 });
const MAX_DRYING_FISH = 5;
const MAX_DISPLAY_FISH = 3;
const MAX_DISPLAY_CRABS = 2;
const MAX_TRAP_CATCH = 3;

const scratchStart = new THREE.Vector3();
const scratchEnd = new THREE.Vector3();
const scratchMid = new THREE.Vector3();
const scratchDirection = new THREE.Vector3();
const yAxis = new THREE.Vector3(0, 1, 0);

export function createFishTrapRoutinePresentationProp() {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_group";
  group.userData.type = "presentationFamily";
  group.userData.family = FISH_TRAP_ROUTINE_ID;

  const materials = createFishTrapMaterials();
  const trap = createTrapCrabPot(materials);
  const buoy = createBuoyMarker(materials);
  const ropeLine = createRopeLine(materials);
  const stateCues = createStateCues(materials);
  const dryingRack = createDryingRack(materials);
  const catchDisplay = createCatchDisplay(materials);
  const carriedAttachments = createCarriedFishingAttachments(materials);

  group.add(
    trap.group,
    ropeLine.group,
    buoy.group,
    stateCues.group,
    dryingRack.group,
    catchDisplay.group,
    carriedAttachments.group
  );
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    trap,
    buoy,
    ropeLine,
    stateCues,
    dryingRack,
    catchDisplay,
    carriedAttachments
  };
}

export function syncFishTrapRoutinePresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, FISH_TRAP_ROUTINE_ID);
  if (!prop || !prop.group) return hiddenFishTrapRoutineTrace(descriptor, "fish trap routine prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenFishTrapRoutineTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const state = context.worldState && context.worldState.fishTrapRoutine ? context.worldState.fishTrapRoutine : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const trapState = state.trapState || debug.trapState || descriptor.stage || "unset";
  const trapAnchor = fishTrapAnchor(context.worldState);
  const buoyAnchor = fishTrapBuoyAnchor(context.worldState);
  const dryingAnchor = fishTrapDryingAnchor(context.worldState);

  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const trapCount = syncTrapCrabPot(prop.trap, subProps.trap, trapAnchor, context, trapState);
  const buoyCount = syncBuoyMarker(prop.buoy, subProps.buoy, buoyAnchor, context, trapState);
  const lineCount = syncRopeLine(prop.ropeLine, subProps.ropeLine, trapAnchor, buoyAnchor, context);
  const cueCount = syncStateCues(
    prop.stateCues,
    subProps.stateCues,
    trapState === "drying" ? dryingAnchor : trapAnchor,
    context,
    trapState
  );
  const dryingRackCount = syncDryingRack(prop.dryingRack, subProps.dryingRack, dryingAnchor, context, trapState);
  const catchDisplayCount = syncCatchDisplay(
    prop.catchDisplay,
    subProps.catchDisplay,
    trapState === "drying" ? dryingAnchor : trapAnchor,
    context,
    trapState
  );
  const carriedAttachmentState = syncCarriedFishingAttachments(prop.carriedAttachments, descriptor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount =
    trapCount +
    buoyCount +
    lineCount +
    cueCount +
    dryingRackCount +
    catchDisplayCount +
    carriedAttachmentState.count;

  return {
    id: FISH_TRAP_ROUTINE_ID,
    visible: true,
    fishTrapRoutineVisible: true,
    fishTrapRoutineStage: descriptor ? descriptor.stage || "" : "",
    fishTrapRoutineVariant: descriptor ? descriptor.variant || "" : "",
    fishTrapRoutineActive: Boolean(descriptor && descriptor.active),
    fishTrapRoutineTrapState: trapState,
    fishTrapRoutineTrapVisible: trapCount > 0,
    fishTrapRoutineBuoyVisible: buoyCount > 0,
    fishTrapRoutineLineVisible: lineCount > 0,
    fishTrapRoutineStateCuesVisible: cueCount > 0,
    fishTrapRoutineDryingRackVisible: dryingRackCount > 0,
    fishTrapRoutineCatchDisplayVisible: catchDisplayCount > 0,
    fishTrapRoutineCarriedRodVisible: carriedAttachmentState.rodVisible,
    fishTrapRoutineCarriedTrapVisible: carriedAttachmentState.trapVisible,
    fishTrapRoutineCarriedCatchVisible: carriedAttachmentState.catchVisible,
    fishTrapRoutineTrapCount: trapCount,
    fishTrapRoutineBuoyCount: buoyCount,
    fishTrapRoutineLineCount: lineCount,
    fishTrapRoutineStateCueCount: cueCount,
    fishTrapRoutineDryingRackCount: dryingRackCount,
    fishTrapRoutineCatchDisplayCount: catchDisplayCount,
    fishTrapRoutineFishCount: Math.max(0, Number(debug.fishCount || 0)),
    fishTrapRoutineCrabCount: Math.max(0, Number(debug.crabCount || 0)),
    fishTrapRoutineDryingFishCount: Math.max(0, Number(debug.dryingFishCount || 0)),
    fishTrapRoutineCarriedAttachmentCount: carriedAttachmentState.count,
    fishTrapRoutineAssetSourceId: source.id || "",
    fishTrapRoutineAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    fishTrapRoutineTransformId: transform ? transform.id || "" : "",
    fishTrapRoutineTransformNormalized: Boolean(transform),
    fishTrapRoutineWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    fishTrapRoutineDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    fishTrapRoutinePlaceholderNote: debug.placeholderNote || "",
    fishTrapRoutineFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount
  };
}

export function normalizeFishTrapRoutineAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createFishTrapMaterials() {
  const standard = (color, roughness = 0.86, options = {}) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, emissive: color, emissiveIntensity: 0.08, ...options });
  };
  return {
    trapWood: standard(0x8a633d, 0.92),
    trapDark: standard(0x5b452f, 0.94),
    net: standard(0x5f705f, 0.88, { transparent: true, opacity: 0.34 }),
    rope: standard(0xd5b36f, 0.92),
    buoyRed: standard(0xd85b45, 0.76),
    buoyWhite: standard(0xf0e5cf, 0.72),
    buoyBlue: standard(0x4aa9c6, 0.78),
    ready: standard(0xf0c24e, 0.72),
    collect: standard(0x83b35d, 0.76),
    drying: standard(0xc89052, 0.84),
    fish: standard(0x5bb2c8, 0.78),
    fishBelly: standard(0xddece5, 0.76),
    crab: standard(0xd56545, 0.78),
    crabDark: standard(0x8b3f32, 0.84),
    leafMat: standard(0x6b9a54, 0.88),
    shadow: new THREE.MeshBasicMaterial({ color: 0x30281f, transparent: true, opacity: 0.24, depthWrite: false }),
    line: standard(0xcaa76b, 0.94)
  };
}

function createTrapCrabPot(materials) {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_trapCrabPot";
  group.userData.subPropId = "trap";
  group.visible = false;

  const shadow = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.54, 0.018, 14), materials.shadow);
  shadow.name = "fishTrap_shadow";
  shadow.position.set(0, 0.012, 0);
  shadow.scale.set(1.05, 1, 0.76);

  const net = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.42, 8, 1, true), materials.net);
  net.name = "fishTrap_netCage";
  net.position.set(0, 0.30, 0);

  const lowerHoop = new THREE.Mesh(new THREE.TorusGeometry(0.40, 0.018, 6, 16), materials.trapDark);
  lowerHoop.name = "fishTrap_lowerHoop";
  lowerHoop.position.set(0, 0.11, 0);
  lowerHoop.rotation.x = Math.PI / 2;
  lowerHoop.scale.set(1, 0.78, 1);

  const upperHoop = lowerHoop.clone();
  upperHoop.name = "fishTrap_upperHoop";
  upperHoop.position.y = 0.51;

  const slats = new THREE.Group();
  slats.name = "fishTrap_slats";
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const slat = createCylinder(
      `fishTrap_verticalSlat_${i + 1}`,
      0.012,
      0.015,
      0.43,
      6,
      materials.trapWood,
      [Math.cos(angle) * 0.39, 0.31, Math.sin(angle) * 0.31],
      [0, 0, 0]
    );
    slat.rotation.y = -angle * 0.12;
    slats.add(slat);
  }

  const funnel = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.28, 8, 1, true), materials.net);
  funnel.name = "fishTrap_funnelEntrance";
  funnel.position.set(0, 0.30, 0.39);
  funnel.rotation.x = Math.PI / 2;

  const lid = new THREE.Group();
  lid.name = "fishTrap_lid";
  lid.position.set(0, 0.55, 0);
  lid.add(
    createCylinder("fishTrap_lid_frontBar", 0.012, 0.012, 0.58, 6, materials.trapDark, [0, 0, 0.20], [0, 0, Math.PI / 2]),
    createCylinder("fishTrap_lid_backBar", 0.012, 0.012, 0.58, 6, materials.trapDark, [0, 0, -0.20], [0, 0, Math.PI / 2]),
    createCylinder("fishTrap_lid_leftBar", 0.012, 0.012, 0.42, 6, materials.trapDark, [-0.29, 0, 0], [Math.PI / 2, 0, 0]),
    createCylinder("fishTrap_lid_rightBar", 0.012, 0.012, 0.42, 6, materials.trapDark, [0.29, 0, 0], [Math.PI / 2, 0, 0]),
    createBox("fishTrap_lid_crossSlat", [0.48, 0.018, 0.05], [0, 0.01, 0], materials.trapWood, [0, 0.28, 0])
  );

  const readyBand = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.012, 6, 16), materials.ready);
  readyBand.name = "fishTrap_readyCheckBand";
  readyBand.position.set(0, 0.57, 0);
  readyBand.rotation.x = Math.PI / 2;
  readyBand.scale.set(1, 0.78, 1);
  readyBand.visible = false;

  const catchItems = [
    createSmallFish("fishTrap_insideFish_one", materials, [-0.12, 0.22, 0.02], 0.34, 0.68),
    createSmallFish("fishTrap_insideFish_two", materials, [0.12, 0.23, -0.05], -0.36, 0.60),
    createCrab("fishTrap_insideCrab", materials, [0.02, 0.20, 0.10], -0.16, 0.50)
  ];
  for (const item of catchItems) item.visible = false;

  group.add(shadow, net, lowerHoop, upperHoop, slats, funnel, lid, readyBand, ...catchItems);
  return { group, lid, readyBand, catchItems };
}

function createBuoyMarker(materials) {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_buoyMarker";
  group.userData.subPropId = "buoy";
  group.visible = false;

  const shadow = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.014, 12), materials.shadow);
  shadow.name = "fishTrap_buoy_shadow";
  shadow.position.set(0, 0.01, 0);
  shadow.scale.set(1, 1, 0.64);

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 7), materials.buoyRed);
  body.name = "fishTrap_buoy_body";
  body.position.set(0, 0.19, 0);
  body.scale.set(0.86, 1.18, 0.86);

  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.055, 10), materials.buoyWhite);
  stripe.name = "fishTrap_buoy_stripe";
  stripe.position.set(0, 0.20, 0);

  const stem = createCylinder("fishTrap_buoy_flagStem", 0.012, 0.016, 0.46, 6, materials.rope, [0, 0.47, 0]);
  const flag = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 3), materials.buoyBlue);
  flag.name = "fishTrap_buoy_flag";
  flag.position.set(0.10, 0.62, 0);
  flag.rotation.set(0, 0, -Math.PI / 2);

  group.add(shadow, body, stripe, stem, flag);
  return { group, body, flag };
}

function createRopeLine(materials) {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_ropeLine";
  group.userData.subPropId = "ropeLine";
  group.visible = false;

  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 1, 6), materials.line);
  line.name = "fishTrap_ropeLine_mesh";
  group.add(line);
  return { group, line };
}

function createStateCues(materials) {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_stateCues";
  group.userData.subPropId = "stateCues";
  group.visible = false;

  const setCue = createFlagCue("fishTrap_setCue", materials.rope, materials.buoyBlue);
  setCue.position.set(-0.42, 0, -0.18);
  const readyCue = createFlagCue("fishTrap_readyCue", materials.rope, materials.ready);
  readyCue.position.set(0.42, 0, -0.20);
  const collectCue = createFlagCue("fishTrap_collectCue", materials.rope, materials.collect);
  collectCue.position.set(0.42, 0, -0.20);
  const dryingCue = createFlagCue("fishTrap_dryingCue", materials.rope, materials.drying);
  dryingCue.position.set(-0.46, 0, 0.14);

  group.add(setCue, readyCue, collectCue, dryingCue);
  return { group, setCue, readyCue, collectCue, dryingCue };
}

function createDryingRack(materials) {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_dryingRack";
  group.userData.subPropId = "dryingRack";
  group.visible = false;

  const frame = new THREE.Group();
  frame.name = "fishTrap_dryingRack_frame";
  frame.add(
    createCylinder("fishTrap_dryingRack_leftPost", 0.028, 0.040, 1.08, 7, materials.trapWood, [-0.38, 0.53, 0], [0.10, 0, 0.18]),
    createCylinder("fishTrap_dryingRack_rightPost", 0.028, 0.040, 1.08, 7, materials.trapWood, [0.38, 0.53, 0], [-0.10, 0, -0.18]),
    createCylinder("fishTrap_dryingRack_topBar", 0.024, 0.026, 0.94, 7, materials.trapDark, [0, 1.03, 0], [0, 0, Math.PI / 2]),
    createCylinder("fishTrap_dryingRack_lowRope", 0.012, 0.012, 0.76, 6, materials.rope, [0, 0.72, 0], [0, 0, Math.PI / 2])
  );

  const hangingFish = [];
  const positions = [
    [-0.28, 0.78, 0.02],
    [-0.14, 0.75, -0.02],
    [0.02, 0.78, 0.02],
    [0.18, 0.75, -0.02],
    [0.32, 0.78, 0.02]
  ];
  for (let i = 0; i < MAX_DRYING_FISH; i += 1) {
    const fish = createHangingFish(`fishTrap_dryingFish_${i + 1}`, materials, positions[i]);
    fish.visible = false;
    hangingFish.push(fish);
    frame.add(fish);
  }

  group.add(frame);
  return { group, frame, hangingFish };
}

function createCatchDisplay(materials) {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_catchDisplay";
  group.userData.subPropId = "catchDisplay";
  group.visible = false;

  const mat = createBox("fishTrap_catchDisplay_leafMat", [0.88, 0.035, 0.44], [0, 0.04, 0], materials.leafMat, [0, 0.18, 0]);
  const fish = [
    createSmallFish("fishTrap_displayFish_one", materials, [-0.24, 0.13, -0.05], 0.16, 0.90),
    createSmallFish("fishTrap_displayFish_two", materials, [0.02, 0.14, 0.06], -0.34, 0.82),
    createSmallFish("fishTrap_displayFish_three", materials, [0.28, 0.13, -0.02], 0.28, 0.74)
  ];
  const crabs = [
    createCrab("fishTrap_displayCrab_one", materials, [-0.08, 0.15, 0.16], 0.22, 0.72),
    createCrab("fishTrap_displayCrab_two", materials, [0.36, 0.14, 0.14], -0.26, 0.58)
  ];
  for (const item of fish) item.visible = false;
  for (const item of crabs) item.visible = false;

  group.add(mat, ...fish, ...crabs);
  return { group, fish, crabs };
}

function createCarriedFishingAttachments(materials) {
  const group = new THREE.Group();
  group.name = "fishTrapRoutine_carriedAttachments";
  group.userData.subPropId = "carriedAttachments";

  const carriedRod = new THREE.Group();
  carriedRod.name = "fishTrapRoutine_carriedRod";
  carriedRod.visible = false;
  const rod = createCylinder(
    "carriedFishingRod_shaft",
    0.014,
    0.024,
    1.52,
    8,
    materials.trapWood,
    [0, 0, 0],
    [0.18, 0, Math.PI / 2]
  );
  const handle = createCylinder(
    "carriedFishingRod_handle",
    0.030,
    0.036,
    0.26,
    8,
    materials.trapDark,
    [-0.70, -0.02, 0],
    [0.18, 0, Math.PI / 2]
  );
  const line = createCylinder(
    "carriedFishingRod_line",
    0.004,
    0.004,
    0.72,
    5,
    materials.line,
    [0.48, -0.24, 0],
    [0.48, 0, 0]
  );
  const float = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 5), materials.buoyRed);
  float.name = "carriedFishingRod_float";
  float.position.set(0.48, -0.60, 0);
  carriedRod.add(rod, handle, line, float);

  const carriedTrap = new THREE.Group();
  carriedTrap.name = "fishTrapRoutine_carriedTrap";
  carriedTrap.visible = false;
  const trapBody = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.30, 8, 1, true), materials.net);
  trapBody.name = "carriedFishTrap_netBody";
  trapBody.rotation.x = Math.PI / 2;
  const trapHoopA = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.014, 6, 14), materials.trapDark);
  trapHoopA.name = "carriedFishTrap_frontHoop";
  trapHoopA.rotation.x = Math.PI / 2;
  trapHoopA.position.z = 0.15;
  const trapHoopB = trapHoopA.clone();
  trapHoopB.name = "carriedFishTrap_backHoop";
  trapHoopB.position.z = -0.15;
  const trapHandle = createCylinder(
    "carriedFishTrap_handle",
    0.010,
    0.010,
    0.54,
    6,
    materials.rope,
    [0, 0.24, 0],
    [0, 0, Math.PI / 2]
  );
  carriedTrap.add(trapBody, trapHoopA, trapHoopB, trapHandle);

  const carriedCatch = new THREE.Group();
  carriedCatch.name = "fishTrapRoutine_carriedCatch";
  carriedCatch.visible = false;
  const caughtFish = createSmallFish("carriedTrapCatch_fish", materials, [0, 0, 0], 0.24, 0.82);
  const catchTie = createCylinder(
    "carriedTrapCatch_tie",
    0.005,
    0.005,
    0.22,
    5,
    materials.rope,
    [0.04, 0.10, 0],
    [0.18, 0, 0]
  );
  carriedCatch.add(caughtFish, catchTie);

  group.add(carriedRod, carriedTrap, carriedCatch);
  return { group, carriedRod, carriedTrap, carriedCatch };
}

function createFlagCue(name, poleMaterial, flagMaterial) {
  const group = new THREE.Group();
  group.name = name;
  const pole = createCylinder(`${name}_pole`, 0.011, 0.016, 0.48, 6, poleMaterial, [0, 0.24, 0]);
  const knot = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 5, 10), poleMaterial);
  knot.name = `${name}_knot`;
  knot.position.set(0, 0.30, 0);
  knot.rotation.x = Math.PI / 2;
  const flag = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.20, 3), flagMaterial);
  flag.name = `${name}_flag`;
  flag.position.set(0.10, 0.44, 0);
  flag.rotation.set(0, 0, -Math.PI / 2);
  group.add(pole, knot, flag);
  return group;
}

function createHangingFish(name, materials, position) {
  const group = createSmallFish(name, materials, position, Math.PI / 2, 0.70);
  group.add(createCylinder(`${name}_tie`, 0.005, 0.005, 0.18, 5, materials.rope, [0, 0.14, 0]));
  return group;
}

function createSmallFish(name, materials, position, yaw, scale = 1) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(position[0], position[1], position[2]);
  group.rotation.y = yaw;
  group.scale.setScalar(scale);

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.10, 9, 6), materials.fish);
  body.name = `${name}_body`;
  body.scale.set(1.55, 0.48, 0.72);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.06, 7, 5), materials.fishBelly);
  belly.name = `${name}_belly`;
  belly.position.set(0.02, -0.02, 0.012);
  belly.scale.set(1.25, 0.28, 0.36);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.13, 3), materials.fish);
  tail.name = `${name}_tail`;
  tail.position.set(-0.16, 0, 0);
  tail.rotation.z = Math.PI / 2;
  group.add(body, belly, tail);
  return group;
}

function createCrab(name, materials, position, yaw, scale = 1) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(position[0], position[1], position[2]);
  group.rotation.y = yaw;
  group.scale.setScalar(scale);

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.095, 8, 5), materials.crab);
  body.name = `${name}_body`;
  body.scale.set(1.28, 0.36, 0.86);
  group.add(body);

  for (let side = -1; side <= 1; side += 2) {
    const claw = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.10, 3), materials.crabDark);
    claw.name = `${name}_claw_${side < 0 ? "left" : "right"}`;
    claw.position.set(side * 0.13, 0.00, 0.09);
    claw.rotation.set(0, side * 0.60, side * -Math.PI / 2);
    group.add(claw);
    for (let i = 0; i < 3; i += 1) {
      const leg = createBox(
        `${name}_leg_${side < 0 ? "left" : "right"}_${i + 1}`,
        [0.12, 0.014, 0.022],
        [side * 0.12, -0.005, -0.06 + i * 0.045],
        materials.crabDark,
        [0, side * (0.34 + i * 0.10), 0]
      );
      group.add(leg);
    }
  }
  return group;
}

function syncTrapCrabPot(trap, subProp, anchor, context, trapState) {
  const count = clampedCount(subProp, 1);
  trap.group.visible = count > 0;
  if (count <= 0) return 0;

  placeAtAnchor(trap.group, anchor, subProp.transform, context, false);
  trap.lid.rotation.z = trapState === "collected" ? -0.42 : trapState === "readyToCheck" ? -0.12 : 0;
  trap.readyBand.visible = trapState === "readyToCheck";
  const catchCount = trapState === "readyToCheck"
    ? Math.max(0, Number(subProp.fishCount || 0)) + Math.max(0, Number(subProp.crabCount || 0))
    : 0;
  syncVisibleChildren(trap.catchItems, Math.min(MAX_TRAP_CATCH, catchCount));
  return count;
}

function syncBuoyMarker(buoy, subProp, anchor, context, trapState) {
  const count = clampedCount(subProp, 1);
  buoy.group.visible = count > 0;
  if (count <= 0) return 0;

  placeAtAnchor(buoy.group, anchor, subProp.transform, context, true);
  const pulse = trapState === "readyToCheck" ? 1 + Math.sin((context.time || 0) * 2.4) * 0.035 : 1;
  buoy.body.scale.set(0.86 * pulse, 1.18 * pulse, 0.86 * pulse);
  buoy.flag.rotation.z = -Math.PI / 2 + Math.sin((context.time || 0) * 1.6) * 0.08;
  return count;
}

function syncRopeLine(ropeLine, subProp, trapAnchor, buoyAnchor, context) {
  const count = clampedCount(subProp, 1);
  ropeLine.group.visible = count > 0;
  if (count <= 0) return 0;

  anchorPoint(scratchStart, trapAnchor, context, false, 0.18);
  anchorPoint(scratchEnd, buoyAnchor, context, true, 0.12);
  scratchMid.copy(scratchStart).add(scratchEnd).multiplyScalar(0.5);
  scratchDirection.copy(scratchEnd).sub(scratchStart);
  const length = scratchDirection.length();
  ropeLine.line.visible = length > 0.001;
  if (length <= 0.001) return 0;
  ropeLine.line.position.copy(scratchMid);
  ropeLine.line.scale.set(1, length, 1);
  ropeLine.line.quaternion.setFromUnitVectors(yAxis, scratchDirection.normalize());
  return count;
}

function syncStateCues(stateCues, subProp, anchor, context, trapState) {
  const count = clampedCount(subProp, 1);
  stateCues.group.visible = count > 0;
  if (count <= 0) return 0;

  placeAtAnchor(stateCues.group, anchor, subProp.transform, context, false);
  stateCues.setCue.visible = trapState === "set";
  stateCues.readyCue.visible = trapState === "readyToCheck";
  stateCues.collectCue.visible = trapState === "collected";
  stateCues.dryingCue.visible = trapState === "drying";
  return count;
}

function syncDryingRack(dryingRack, subProp, anchor, context) {
  const count = clampedCount(subProp, 1);
  dryingRack.group.visible = count > 0;
  if (count <= 0) return 0;

  placeAtAnchor(dryingRack.group, anchor, subProp.transform, context, false);
  const fishCount = Math.max(0, Math.min(MAX_DRYING_FISH, Math.floor(Number(subProp.dryingFishCount || 0))));
  syncVisibleChildren(dryingRack.hangingFish, fishCount);
  dryingRack.frame.rotation.z = Math.sin((context.time || 0) * 1.1) * 0.005;
  return count;
}

function syncCatchDisplay(catchDisplay, subProp, anchor, context, trapState) {
  const count = clampedCount(subProp, 1);
  catchDisplay.group.visible = count > 0;
  if (count <= 0) return 0;

  const offset = trapState === "drying" ? { x: 0.78, z: 0.18, yaw: 0.20 } : { x: 0.68, z: -0.34, yaw: -0.18 };
  placeAtAnchor(catchDisplay.group, anchor, subProp.transform, context, trapState === "drying", offset);
  const fishCount = Math.max(0, Math.min(MAX_DISPLAY_FISH, Math.floor(Number(subProp.fishCount || 0))));
  const crabCount = Math.max(0, Math.min(MAX_DISPLAY_CRABS, Math.floor(Number(subProp.crabCount || 0))));
  syncVisibleChildren(catchDisplay.fish, fishCount);
  syncVisibleChildren(catchDisplay.crabs, crabCount);
  return count;
}

function syncCarriedFishingAttachments(attachments, descriptor, context) {
  const rodVisible = syncCarriedFishingAttachment(
    attachments.carriedRod,
    descriptor,
    context,
    "fishingRodCarry",
    { forward: 0.32, side: 0.03, y: 0.62, bobSpeed: 4.8, bobHeight: 0.014, yawOffset: 0.14, strokeYaw: 0.16 }
  );
  const trapVisible = syncCarriedFishingAttachment(
    attachments.carriedTrap,
    descriptor,
    context,
    "fishTrapCarry",
    { forward: 0.25, side: -0.02, y: 0.50, bobSpeed: 4.6, bobHeight: 0.010, yawOffset: -0.04 }
  );
  const catchVisible = syncCarriedFishingAttachment(
    attachments.carriedCatch,
    descriptor,
    context,
    "trapCatchCarry",
    { forward: 0.28, side: 0.18, y: 0.58, bobSpeed: 5.2, bobHeight: 0.016, yawOffset: 0.20 }
  );
  attachments.group.visible = Boolean(rodVisible || trapVisible || catchVisible);
  return {
    rodVisible,
    trapVisible,
    catchVisible,
    count: (rodVisible ? 1 : 0) + (trapVisible ? 1 : 0) + (catchVisible ? 1 : 0)
  };
}

function syncCarriedFishingAttachment(group, descriptor, context, attachmentId, options) {
  const attachment = context.presentationState && context.presentationState.attachment
    ? context.presentationState.attachment
    : null;
  const visible = Boolean(descriptor && descriptor.visible && attachment && attachment.id === attachmentId);
  group.visible = visible;
  if (!visible) return false;

  const boy = context.worldState && context.worldState.bubbleBoy ? context.worldState.bubbleBoy : {};
  const position = boy.position || {};
  const baseX = Number.isFinite(position.x) ? position.x : 0;
  const baseZ = Number.isFinite(position.z) ? position.z : 0;
  const facing = Number.isFinite(boy.facing) ? boy.facing : 0;
  const forward = Number(options.forward || 0);
  const side = Number(options.side || 0);
  const x = baseX + Math.cos(facing) * forward - Math.sin(facing) * side;
  const z = baseZ - Math.sin(facing) * forward - Math.cos(facing) * side;
  const transform = attachment.transform || {};
  const scale = transformScale(transform);
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  const bob = Math.sin((context.time || 0) * Number(options.bobSpeed || 3.8)) * Number(options.bobHeight || 0);
  const strokeYaw = Number(options.strokeYaw || 0) * Math.sin((context.time || 0) * Number(options.bobSpeed || 3.8));
  const ground = typeof context.groundHeightAt === "function"
    ? context.groundHeightAt(x, z)
    : Number.isFinite(position.y)
      ? position.y
      : 0;

  group.position.set(x, ground + Number(options.y || 0.56) + bob, z);
  group.rotation.set(
    Number(rotation[0]) || 0,
    facing + Math.PI * 0.5 + Number(options.yawOffset || 0) + strokeYaw + (Number(rotation[1]) || 0),
    Number(rotation[2]) || 0
  );
  group.scale.set(scale.x, scale.y, scale.z);
  return true;
}

function fishTrapAnchor(worldState) {
  const state = worldState && worldState.fishTrapRoutine ? worldState.fishTrapRoutine : {};
  return vectorAnchor(state.anchorPosition, DEFAULT_TRAP_ANCHOR, state.yaw);
}

function fishTrapBuoyAnchor(worldState) {
  const state = worldState && worldState.fishTrapRoutine ? worldState.fishTrapRoutine : {};
  return vectorAnchor(state.buoyPosition, DEFAULT_BUOY_ANCHOR, state.buoyYaw);
}

function fishTrapDryingAnchor(worldState) {
  const state = worldState && worldState.fishTrapRoutine ? worldState.fishTrapRoutine : {};
  return vectorAnchor(state.dryingRackPosition, DEFAULT_DRYING_ANCHOR, state.dryingYaw);
}

function vectorAnchor(position, fallback, yaw) {
  const value = position && typeof position === "object" ? position : {};
  return {
    x: Number.isFinite(value.x) ? value.x : fallback.x,
    y: Number.isFinite(value.y) ? value.y : fallback.y,
    z: Number.isFinite(value.z) ? value.z : fallback.z,
    yaw: Number.isFinite(yaw) ? yaw : fallback.yaw
  };
}

function placeAtAnchor(object, anchor, transform, context, water = false, offset = { x: 0, z: 0, yaw: 0 }) {
  const yaw = Number(anchor.yaw || 0);
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const localX = Number(offset.x || 0);
  const localZ = Number(offset.z || 0);
  const x = anchor.x + localX * cos - localZ * sin;
  const z = anchor.z + localX * sin + localZ * cos;
  const ground = water
    ? Number.isFinite(anchor.y) ? anchor.y : DEFAULT_BUOY_ANCHOR.y
    : typeof context.groundHeightAt === "function" ? context.groundHeightAt(x, z) : 0;
  const groundOffset = Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : 0;
  const rotation = transform && Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  const scale = transform && Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  object.position.set(x, ground + groundOffset, z);
  object.rotation.set(
    Number(rotation[0]) || 0,
    yaw + (Number(rotation[1]) || 0) + (Number(offset.yaw) || 0),
    Number(rotation[2]) || 0
  );
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
}

function anchorPoint(target, anchor, context, water, lift) {
  const ground = water
    ? Number.isFinite(anchor.y) ? anchor.y : DEFAULT_BUOY_ANCHOR.y
    : typeof context.groundHeightAt === "function" ? context.groundHeightAt(anchor.x, anchor.z) : 0;
  target.set(anchor.x, ground + lift, anchor.z);
  return target;
}

function syncVisibleChildren(children, count) {
  if (!Array.isArray(children)) return;
  const visibleCount = Math.min(children.length, Math.max(0, Math.ceil(Number(count || 0))));
  children.forEach((child, index) => {
    child.visible = index < visibleCount;
  });
}

function clampedCount(subProp, max) {
  if (!subProp || !subProp.visible) return 0;
  return Math.max(0, Math.min(max, Math.floor(Number(subProp.count || 0))));
}

function transformScale(transform) {
  const scale = transform && Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  return {
    x: Number(scale[0]) || 1,
    y: Number(scale[1]) || 1,
    z: Number(scale[2]) || 1
  };
}

function descriptorByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function hiddenFishTrapRoutineTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: FISH_TRAP_ROUTINE_ID,
    visible: false,
    fishTrapRoutineVisible: false,
    fishTrapRoutineStage: descriptor ? descriptor.stage || "" : "",
    fishTrapRoutineVariant: descriptor ? descriptor.variant || "" : "",
    fishTrapRoutineActive: Boolean(descriptor && descriptor.active),
    fishTrapRoutineTrapState: descriptor && descriptor.debug ? descriptor.debug.trapState || "unset" : "unset",
    fishTrapRoutineTrapVisible: false,
    fishTrapRoutineBuoyVisible: false,
    fishTrapRoutineLineVisible: false,
    fishTrapRoutineStateCuesVisible: false,
    fishTrapRoutineDryingRackVisible: false,
    fishTrapRoutineCatchDisplayVisible: false,
    fishTrapRoutineCarriedRodVisible: false,
    fishTrapRoutineCarriedTrapVisible: false,
    fishTrapRoutineCarriedCatchVisible: false,
    fishTrapRoutineTrapCount: 0,
    fishTrapRoutineBuoyCount: 0,
    fishTrapRoutineLineCount: 0,
    fishTrapRoutineStateCueCount: 0,
    fishTrapRoutineDryingRackCount: 0,
    fishTrapRoutineCatchDisplayCount: 0,
    fishTrapRoutineFishCount: 0,
    fishTrapRoutineCrabCount: 0,
    fishTrapRoutineDryingFishCount: 0,
    fishTrapRoutineCarriedAttachmentCount: 0,
    fishTrapRoutineAssetSourceId: source.id || "",
    fishTrapRoutineAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    fishTrapRoutineTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    fishTrapRoutineTransformNormalized: Boolean(descriptor && descriptor.transform),
    fishTrapRoutineWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    fishTrapRoutineDuplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    fishTrapRoutinePlaceholderNote: descriptor && descriptor.debug ? descriptor.debug.placeholderNote || "" : "",
    fishTrapRoutineFallbackReason: reason || "",
    renderedObjectCount: 0
  };
}

function createBox(name, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
  mesh.name = name;
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
  return mesh;
}

function createCylinder(name, radiusTop, radiusBottom, height, segments, material, position, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.name = name;
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
  return mesh;
}
