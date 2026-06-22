import * as THREE from "three";

import { TOY_PLAY_SET_ID } from "../simulation/worldState.js";

const DEFAULT_ANCHOR = Object.freeze({ x: -4.18, y: 0.18, z: -2.22, yaw: -0.20 });
const DEFAULT_KITE_ANCHOR = Object.freeze({ x: -4.72, y: 0.18, z: -2.86, yaw: -0.28 });
const MAX_SLOTS = 5;
const MAX_BLOCKS = 8;

const BLOCK_LAYOUT = Object.freeze([
  [-0.38, 0.14, -0.10, 0.24, 0.24, 0.24, 0.18],
  [-0.10, 0.12, 0.12, 0.28, 0.18, 0.20, -0.22],
  [0.18, 0.16, -0.16, 0.20, 0.30, 0.20, 0.38],
  [0.42, 0.12, 0.18, 0.26, 0.18, 0.22, -0.36],
  [-0.20, 0.34, -0.08, 0.22, 0.20, 0.22, 0.10],
  [0.04, 0.32, -0.10, 0.20, 0.20, 0.20, -0.18],
  [0.26, 0.31, 0.08, 0.24, 0.16, 0.20, 0.28],
  [-0.48, 0.10, 0.22, 0.18, 0.16, 0.30, -0.08]
]);

const SLOT_LAYOUT = Object.freeze([
  [-0.42, 0.00],
  [-0.20, 0.08],
  [0.02, -0.02],
  [0.24, 0.08],
  [0.46, 0.00]
]);

const yAxis = new THREE.Vector3(0, 1, 0);
const scratchStart = new THREE.Vector3();
const scratchEnd = new THREE.Vector3();
const scratchDirection = new THREE.Vector3();

export function createToyPlaySetPresentationProp() {
  const group = new THREE.Group();
  group.name = "toyPlaySet_group";
  group.userData.type = "presentationFamily";
  group.userData.family = TOY_PLAY_SET_ID;

  const materials = createToyMaterials();
  const playMat = createPlayMat(materials);
  const collectionSlots = createCollectionSlots(materials);
  const toyBlocks = createToyBlocks(materials);
  const ball = createToyBall(materials);
  const kite = createToyKite(materials);
  const spinningTop = createSpinningTop(materials);

  group.add(playMat.group, collectionSlots.group, toyBlocks.group, ball.group, kite.group, spinningTop.group);
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    playMat,
    collectionSlots,
    toyBlocks,
    ball,
    kite,
    spinningTop
  };
}

export function syncToyPlaySetPresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, TOY_PLAY_SET_ID);
  if (!prop || !prop.group) return hiddenToyPlaySetTrace(descriptor, "toy play set prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenToyPlaySetTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = toyPlaySetAnchor(context.worldState);
  const kiteAnchor = toyPlaySetKiteAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const playMatCount = syncPlayMat(prop.playMat, subProps.playMat, anchor, context);
  const collectionSlotCount = syncCollectionSlots(prop.collectionSlots, subProps.collectionSlots, anchor, context);
  const blockCount = syncToyBlocks(prop.toyBlocks, subProps.toyBlocks, anchor, context);
  const ballCount = syncToyBall(prop.ball, subProps.ball, anchor, context);
  const kiteCount = syncToyKite(prop.kite, subProps.kite, kiteAnchor, context);
  const spinningTopCount = syncSpinningTop(prop.spinningTop, subProps.spinningTop, anchor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount = playMatCount + collectionSlotCount + blockCount + ballCount + kiteCount + spinningTopCount;

  return {
    id: TOY_PLAY_SET_ID,
    visible: true,
    toyPlaySetVisible: true,
    toyPlaySetStage: descriptor ? descriptor.stage || "" : "",
    toyPlaySetVariant: descriptor ? descriptor.variant || "" : "",
    toyPlaySetActive: Boolean(descriptor && descriptor.active),
    toyPlaySetCollectionSlotsVisible: collectionSlotCount > 0,
    toyPlaySetToyBlocksVisible: blockCount > 0,
    toyPlaySetBallVisible: ballCount > 0,
    toyPlaySetKiteVisible: kiteCount > 0,
    toyPlaySetKiteStringVisible: Boolean(subProps.kite && subProps.kite.stringCount > 0 && kiteCount > 0),
    toyPlaySetKiteHandleVisible: Boolean(subProps.kite && subProps.kite.handleCount > 0 && kiteCount > 0),
    toyPlaySetSpinningTopVisible: spinningTopCount > 0,
    toyPlaySetPlayMatVisible: playMatCount > 0,
    toyPlaySetCollectionSlotCount: collectionSlotCount,
    toyPlaySetBlockCount: blockCount,
    toyPlaySetBallCount: ballCount,
    toyPlaySetKiteCount: kiteCount,
    toyPlaySetStringCount: Math.max(0, Number(debug.stringCount || 0)),
    toyPlaySetHandleCount: Math.max(0, Number(debug.handleCount || 0)),
    toyPlaySetSpinningTopCount: spinningTopCount,
    toyPlaySetPlayMatCount: playMatCount,
    toyPlaySetExistingBuildableId: debug.existingToyBuildableId || "",
    toyPlaySetExistingUseSlotAction: debug.existingToyBuildableUseSlotAction || "",
    toyPlaySetAssetSourceId: source.id || "",
    toyPlaySetAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    toyPlaySetTransformId: transform ? transform.id || "" : "",
    toyPlaySetTransformNormalized: Boolean(transform),
    toyPlaySetWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    toyPlaySetDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    toyPlaySetPlaceholderNote: debug.placeholderNote || "",
    toyPlaySetFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount
  };
}

export function normalizeToyPlaySetAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createToyMaterials() {
  const standard = (color, roughness = 0.78, options = {}) => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0,
      emissive: color,
      emissiveIntensity: 0.05,
      ...options
    });
  };
  return {
    matBase: standard(0x3f9d8f, 0.86),
    matBorder: standard(0xf1d06f, 0.78),
    matMarking: standard(0xf4efe2, 0.74),
    wood: standard(0xa97847, 0.88),
    slotCup: standard(0x5c6fb7, 0.80),
    slotInner: standard(0x30364c, 0.90),
    red: standard(0xdf5e4b, 0.74),
    blue: standard(0x4e86d8, 0.74),
    gold: standard(0xe2bb4e, 0.72),
    green: standard(0x67a85a, 0.78),
    white: standard(0xf2ead8, 0.72),
    kiteRed: standard(0xda5546, 0.74, { side: THREE.DoubleSide }),
    kiteGold: standard(0xf0c35a, 0.74, { side: THREE.DoubleSide }),
    kiteBlue: standard(0x4e8fc6, 0.74),
    string: standard(0xd8bf82, 0.86),
    topDark: standard(0x485061, 0.82),
    shadow: new THREE.MeshBasicMaterial({ color: 0x2c2a24, transparent: true, opacity: 0.18, depthWrite: false })
  };
}

function createPlayMat(materials) {
  const group = new THREE.Group();
  group.name = "toyPlaySet_playMat";
  group.userData.subPropId = "playMat";
  group.visible = false;

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.035, 1.30), materials.matBase);
  base.name = "Toy play mat base";
  base.position.set(0, 0.018, 0);
  group.add(base);

  const borderSpecs = [
    [0, 0.043, -0.63, 1.76, 0.018, 0.045],
    [0, 0.043, 0.63, 1.76, 0.018, 0.045],
    [-0.86, 0.043, 0, 0.045, 0.018, 1.30],
    [0.86, 0.043, 0, 0.045, 0.018, 1.30]
  ];
  for (const spec of borderSpecs) {
    const border = new THREE.Mesh(new THREE.BoxGeometry(spec[3], spec[4], spec[5]), materials.matBorder);
    border.name = "Toy play mat border";
    border.position.set(spec[0], spec[1], spec[2]);
    group.add(border);
  }

  const lane = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.014, 0.045), materials.matMarking);
  lane.name = "Toy play mat center lane";
  lane.position.set(0.04, 0.062, 0.02);
  lane.rotation.y = -0.22;
  group.add(lane);

  const dotGeometry = new THREE.CylinderGeometry(0.045, 0.045, 0.015, 8);
  for (const [x, z] of [[-0.48, -0.34], [-0.18, 0.34], [0.24, -0.28], [0.54, 0.26]]) {
    const dot = new THREE.Mesh(dotGeometry, materials.matMarking);
    dot.name = "Toy play mat dot";
    dot.position.set(x, 0.066, z);
    group.add(dot);
  }

  return { group };
}

function createCollectionSlots(materials) {
  const group = new THREE.Group();
  group.name = "toyPlaySet_collectionSlots";
  group.userData.subPropId = "collectionSlots";
  group.visible = false;

  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.08, 0.36), materials.wood);
  tray.name = "Toy collection slot tray";
  tray.position.set(0, 0.06, 0);
  tray.rotation.y = -0.06;
  group.add(tray);

  const cupGeometry = new THREE.CylinderGeometry(0.085, 0.10, 0.07, 10);
  const innerGeometry = new THREE.CylinderGeometry(0.058, 0.064, 0.073, 10);
  const cups = [];
  for (let index = 0; index < MAX_SLOTS; index += 1) {
    const cup = new THREE.Group();
    cup.name = "Toy collection cup";
    const [x, z] = SLOT_LAYOUT[index];
    cup.position.set(x, 0.13, z);
    const outer = new THREE.Mesh(cupGeometry, materials.slotCup);
    outer.name = "Toy slot outer cup";
    const inner = new THREE.Mesh(innerGeometry, materials.slotInner);
    inner.name = "Toy slot dark center";
    inner.position.y = 0.006;
    cup.add(outer, inner);
    group.add(cup);
    cups.push(cup);
  }

  return { group, cups };
}

function createToyBlocks(materials) {
  const group = new THREE.Group();
  group.name = "toyPlaySet_toyBlocks";
  group.userData.subPropId = "toyBlocks";
  group.visible = false;

  const materialsByIndex = [materials.red, materials.blue, materials.gold, materials.green, materials.blue, materials.red, materials.gold, materials.green];
  const blocks = [];
  for (let index = 0; index < MAX_BLOCKS; index += 1) {
    const layout = BLOCK_LAYOUT[index];
    const block = new THREE.Mesh(new THREE.BoxGeometry(layout[3], layout[4], layout[5]), materialsByIndex[index]);
    block.name = "Toy play loose block";
    block.position.set(layout[0], layout[1], layout[2]);
    block.rotation.y = layout[6];
    group.add(block);
    blocks.push(block);
  }

  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.18, 4), materials.red);
  roof.name = "Toy play roof block";
  roof.position.set(0.02, 0.53, -0.10);
  roof.rotation.set(0, Math.PI / 4, 0);
  group.add(roof);
  blocks.push(roof);

  return { group, blocks };
}

function createToyBall(materials) {
  const group = new THREE.Group();
  group.name = "toyPlaySet_ball";
  group.userData.subPropId = "ball";
  group.visible = false;

  const shadow = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.23, 0.012, 12), materials.shadow);
  shadow.name = "Toy ball contact shadow";
  shadow.position.set(0, 0.010, 0);
  group.add(shadow);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), materials.white);
  ball.name = "Low-poly toy ball";
  ball.position.set(0, 0.19, 0);
  group.add(ball);

  const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.182, 0.012, 6, 18), materials.red);
  stripe.name = "Toy ball red stripe";
  stripe.position.copy(ball.position);
  stripe.rotation.x = Math.PI / 2;
  group.add(stripe);

  const stripeCross = new THREE.Mesh(new THREE.TorusGeometry(0.183, 0.010, 6, 18), materials.blue);
  stripeCross.name = "Toy ball blue stripe";
  stripeCross.position.copy(ball.position);
  stripeCross.rotation.y = Math.PI / 2;
  group.add(stripeCross);

  return { group };
}

function createToyKite(materials) {
  const group = new THREE.Group();
  group.name = "toyPlaySet_kite";
  group.userData.subPropId = "kite";
  group.visible = false;

  const leftWing = new THREE.Mesh(createTriangleGeometry([0, 0.42, 0], [0, -0.46, 0], [-0.36, 0.00, 0]), materials.kiteGold);
  leftWing.name = "Toy kite gold wing";
  const rightWing = new THREE.Mesh(createTriangleGeometry([0, 0.42, 0], [0.36, 0.00, 0], [0, -0.46, 0]), materials.kiteRed);
  rightWing.name = "Toy kite red wing";
  const kiteFace = new THREE.Group();
  kiteFace.name = "Toy kite diamond";
  kiteFace.position.set(0, 1.18, 0);
  kiteFace.rotation.y = -0.14;
  kiteFace.add(leftWing, rightWing);
  group.add(kiteFace);

  const verticalSpar = createLineCylinder("Toy kite vertical spar", [0, 0.78, 0.012], [0, 1.60, 0.012], 0.012, materials.wood);
  const crossSpar = createLineCylinder("Toy kite cross spar", [-0.31, 1.18, 0.014], [0.31, 1.18, 0.014], 0.010, materials.wood);
  group.add(verticalSpar, crossSpar);

  const string = createLineCylinder("Toy kite static string", [0, 0.78, 0], [0.52, 0.12, 0.18], 0.008, materials.string);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.28, 8), materials.wood);
  handle.name = "Toy kite string handle";
  handle.position.set(0.56, 0.11, 0.20);
  handle.rotation.set(Math.PI / 2, 0.10, 0.30);
  group.add(string, handle);

  const tail = new THREE.Group();
  tail.name = "Toy kite ribbon tail";
  const tailSegments = [
    [[0, 0.76, 0], [0.08, 0.56, 0.04]],
    [[0.08, 0.56, 0.04], [-0.04, 0.38, -0.02]],
    [[-0.04, 0.38, -0.02], [0.10, 0.22, 0.02]]
  ];
  for (const segment of tailSegments) {
    tail.add(createLineCylinder("Toy kite tail segment", segment[0], segment[1], 0.010, materials.kiteBlue));
  }
  group.add(tail);

  return { group, string, handle };
}

function createSpinningTop(materials) {
  const group = new THREE.Group();
  group.name = "toyPlaySet_spinningTop";
  group.userData.subPropId = "spinningTop";
  group.visible = false;

  const shadow = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.012, 12), materials.shadow);
  shadow.name = "Spinning top shadow";
  shadow.position.set(0, 0.010, 0);
  group.add(shadow);

  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 12), materials.gold);
  cone.name = "Spinning top cone";
  cone.position.set(0, 0.15, 0);
  cone.rotation.y = 0.32;
  group.add(cone);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.11, 12), materials.red);
  body.name = "Spinning top body";
  body.position.set(0, 0.26, 0);
  group.add(body);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.132, 0.014, 6, 16), materials.topDark);
  ring.name = "Spinning top ring";
  ring.position.set(0, 0.29, 0);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.020, 0.18, 8), materials.wood);
  stem.name = "Spinning top peg";
  stem.position.set(0, 0.43, 0);
  group.add(stem);

  return { group };
}

function syncPlayMat(playMat, descriptor, anchor, context) {
  const visible = Boolean(descriptor && descriptor.visible);
  playMat.group.visible = visible;
  if (!visible) return 0;
  const x = anchor.x;
  const z = anchor.z;
  playMat.group.position.set(x, groundY(context, x, z, anchor.y) + 0.012, z);
  playMat.group.rotation.set(0, anchor.yaw + 0.06, 0);
  return 1;
}

function syncCollectionSlots(collectionSlots, descriptor, anchor, context) {
  const count = Math.min(MAX_SLOTS, Math.max(0, Number((descriptor && descriptor.count) || 0)));
  const visible = Boolean(descriptor && descriptor.visible && count > 0);
  collectionSlots.group.visible = visible;
  for (let index = 0; index < collectionSlots.cups.length; index += 1) {
    collectionSlots.cups[index].visible = visible && index < count;
  }
  if (!visible) return 0;
  const x = anchor.x - 0.76;
  const z = anchor.z - 0.52;
  collectionSlots.group.position.set(x, groundY(context, x, z, anchor.y) + 0.035, z);
  collectionSlots.group.rotation.set(0, anchor.yaw - 0.14, 0);
  return count;
}

function syncToyBlocks(toyBlocks, descriptor, anchor, context) {
  const requested = Math.min(MAX_BLOCKS, Math.max(0, Number((descriptor && descriptor.count) || 0)));
  const visible = Boolean(descriptor && descriptor.visible && requested > 0);
  toyBlocks.group.visible = visible;
  for (let index = 0; index < toyBlocks.blocks.length; index += 1) {
    toyBlocks.blocks[index].visible = visible && index < requested;
  }
  if (!visible) return 0;
  const x = anchor.x - 0.12;
  const z = anchor.z + 0.12;
  toyBlocks.group.position.set(x, groundY(context, x, z, anchor.y) + 0.040, z);
  toyBlocks.group.rotation.set(0, anchor.yaw + 0.22, 0);
  return requested;
}

function syncToyBall(ball, descriptor, anchor, context) {
  const visible = Boolean(descriptor && descriptor.visible);
  ball.group.visible = visible;
  if (!visible) return 0;
  const x = anchor.x + 0.58;
  const z = anchor.z - 0.28;
  ball.group.position.set(x, groundY(context, x, z, anchor.y) + 0.020, z);
  ball.group.rotation.set(0.04, anchor.yaw - 0.18, 0.08);
  return 1;
}

function syncToyKite(kite, descriptor, anchor, context) {
  const visible = Boolean(descriptor && descriptor.visible);
  kite.group.visible = visible;
  if (!visible) return 0;
  const x = anchor.x;
  const z = anchor.z;
  kite.group.position.set(x, groundY(context, x, z, anchor.y) + 0.020, z);
  kite.group.rotation.set(0, anchor.yaw - 0.18, 0);
  kite.string.visible = Number((descriptor && descriptor.stringCount) || 0) > 0;
  kite.handle.visible = Number((descriptor && descriptor.handleCount) || 0) > 0;
  return 1;
}

function syncSpinningTop(spinningTop, descriptor, anchor, context) {
  const visible = Boolean(descriptor && descriptor.visible);
  spinningTop.group.visible = visible;
  if (!visible) return 0;
  const x = anchor.x + 0.48;
  const z = anchor.z + 0.36;
  spinningTop.group.position.set(x, groundY(context, x, z, anchor.y) + 0.018, z);
  spinningTop.group.rotation.set(0, anchor.yaw + 0.54, 0.05);
  return 1;
}

function toyPlaySetAnchor(worldState) {
  const state = worldState && worldState.toyPlaySet ? worldState.toyPlaySet : {};
  const position = state.anchorPosition || {};
  return {
    x: finite(position.x, DEFAULT_ANCHOR.x),
    y: finite(position.y, DEFAULT_ANCHOR.y),
    z: finite(position.z, DEFAULT_ANCHOR.z),
    yaw: finite(state.yaw, DEFAULT_ANCHOR.yaw)
  };
}

function toyPlaySetKiteAnchor(worldState) {
  const state = worldState && worldState.toyPlaySet ? worldState.toyPlaySet : {};
  const position = state.kiteAnchorPosition || {};
  return {
    x: finite(position.x, DEFAULT_KITE_ANCHOR.x),
    y: finite(position.y, DEFAULT_KITE_ANCHOR.y),
    z: finite(position.z, DEFAULT_KITE_ANCHOR.z),
    yaw: finite(state.kiteYaw, DEFAULT_KITE_ANCHOR.yaw)
  };
}

function groundY(context, x, z, fallback) {
  if (context && typeof context.groundHeightAt === "function") {
    return context.groundHeightAt(x, z);
  }
  return Number.isFinite(fallback) ? fallback : 0.18;
}

function hiddenToyPlaySetTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: TOY_PLAY_SET_ID,
    visible: false,
    toyPlaySetVisible: false,
    toyPlaySetStage: descriptor ? descriptor.stage || "" : "",
    toyPlaySetVariant: descriptor ? descriptor.variant || "" : "",
    toyPlaySetActive: Boolean(descriptor && descriptor.active),
    toyPlaySetCollectionSlotsVisible: false,
    toyPlaySetToyBlocksVisible: false,
    toyPlaySetBallVisible: false,
    toyPlaySetKiteVisible: false,
    toyPlaySetKiteStringVisible: false,
    toyPlaySetKiteHandleVisible: false,
    toyPlaySetSpinningTopVisible: false,
    toyPlaySetPlayMatVisible: false,
    toyPlaySetCollectionSlotCount: 0,
    toyPlaySetBlockCount: 0,
    toyPlaySetBallCount: 0,
    toyPlaySetKiteCount: 0,
    toyPlaySetStringCount: 0,
    toyPlaySetHandleCount: 0,
    toyPlaySetSpinningTopCount: 0,
    toyPlaySetPlayMatCount: 0,
    toyPlaySetExistingBuildableId: descriptor && descriptor.debug ? descriptor.debug.existingToyBuildableId || "" : "",
    toyPlaySetExistingUseSlotAction: descriptor && descriptor.debug
      ? descriptor.debug.existingToyBuildableUseSlotAction || ""
      : "",
    toyPlaySetAssetSourceId: source.id || "",
    toyPlaySetAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    toyPlaySetTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    toyPlaySetTransformNormalized: Boolean(descriptor && descriptor.transform),
    toyPlaySetWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    toyPlaySetDuplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    toyPlaySetPlaceholderNote: descriptor && descriptor.debug ? descriptor.debug.placeholderNote || "" : "",
    toyPlaySetFallbackReason: reason || "",
    renderedObjectCount: 0
  };
}

function descriptorByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function createTriangleGeometry(a, b, c) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

function createLineCylinder(name, start, end, radius, material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 6), material);
  mesh.name = name;
  positionLine(mesh, start, end);
  return mesh;
}

function positionLine(mesh, start, end) {
  scratchStart.set(start[0], start[1], start[2]);
  scratchEnd.set(end[0], end[1], end[2]);
  scratchDirection.copy(scratchEnd).sub(scratchStart);
  const length = Math.max(0.001, scratchDirection.length());
  scratchDirection.normalize();
  mesh.position.copy(scratchStart).add(scratchEnd).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(yAxis, scratchDirection);
  mesh.scale.set(1, length, 1);
}

function finite(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}
