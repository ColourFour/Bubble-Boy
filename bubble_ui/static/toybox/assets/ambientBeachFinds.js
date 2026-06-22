import * as THREE from "three";

import { AMBIENT_BEACH_FINDS_ID } from "../simulation/worldState.js";

const MAX_SHELLS = 16;
const MAX_DRIFTWOOD = 6;
const MAX_TINY_FINDS = 12;
const MAX_CRUMBS = 4;
const MAX_BIRD_MARKERS = 4;
const MAX_FISH_MARKERS = 5;
const DEFAULT_ANCHOR = Object.freeze({ x: -12.4, z: 31.5, yaw: -0.22 });

const SHELL_OFFSETS = Object.freeze([
  [-0.80, -0.18, -0.36, 1.06],
  [-0.52, 0.12, 0.08, 0.88],
  [-0.24, -0.34, 0.42, 1.18],
  [0.02, 0.20, -0.12, 0.94],
  [0.34, -0.08, 0.62, 1.05],
  [0.58, 0.28, -0.52, 0.82],
  [0.88, -0.24, 0.30, 1.00],
  [-1.04, 0.26, 0.16, 0.78],
  [1.08, 0.12, -0.16, 0.92],
  [-0.08, -0.62, 0.74, 0.86],
  [0.62, -0.54, -0.28, 0.76],
  [-0.64, -0.56, 0.52, 0.84],
  [1.30, -0.12, 0.10, 0.70],
  [-1.24, -0.08, -0.62, 0.74],
  [0.20, 0.52, 0.24, 0.72],
  [-0.32, 0.48, -0.40, 0.78]
]);

const TINY_FIND_OFFSETS = Object.freeze([
  [-0.52, 0.02, 0.12, 1.00],
  [-0.26, 0.30, -0.10, 0.74],
  [0.04, -0.22, 0.54, 0.90],
  [0.28, 0.18, -0.42, 0.82],
  [0.56, -0.12, 0.30, 0.78],
  [0.78, 0.22, -0.24, 0.72],
  [-0.76, -0.24, 0.64, 0.76],
  [-0.10, 0.56, 0.16, 0.66],
  [0.86, -0.46, -0.18, 0.68],
  [-0.98, 0.36, 0.36, 0.64],
  [0.38, 0.48, -0.58, 0.58],
  [-0.38, -0.48, 0.28, 0.70]
]);

const DRIFTWOOD_OFFSETS = Object.freeze([
  [-1.46, -0.22, -0.34],
  [1.42, 0.30, 0.42],
  [-0.92, 0.76, 0.12],
  [0.96, -0.72, -0.58],
  [1.70, -0.30, 0.18],
  [-1.72, 0.44, -0.70]
]);

const CRUMB_OFFSETS = Object.freeze([
  [-0.18, 0.04, 0.18],
  [0.04, 0.10, -0.20],
  [0.18, -0.02, 0.46],
  [-0.06, -0.14, -0.52]
]);

const BIRD_OFFSETS = Object.freeze([
  [-1.60, 0.12, 0.35, 0.96],
  [0.26, 0.28, -0.18, 1.14],
  [1.28, -0.02, 0.20, 0.88],
  [-0.46, -0.20, -0.32, 0.82]
]);

const FISH_OFFSETS = Object.freeze([
  [-1.18, -1.12, -0.20, 0.86],
  [-0.42, -1.34, 0.18, 1.04],
  [0.46, -1.08, -0.12, 0.92],
  [1.18, -1.28, 0.24, 0.78],
  [1.72, -0.92, -0.42, 0.70]
]);

export function createAmbientBeachFindsPresentationProp() {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_group";
  group.userData.type = "presentationFamily";
  group.userData.family = AMBIENT_BEACH_FINDS_ID;

  const materials = createAmbientMaterials();
  const shared = createSharedGeometries();
  const shells = createShellInstances(materials, shared);
  const driftwood = createDriftwoodPool(materials, shared);
  const tinyFinds = createTinyFindInstances(materials, shared);
  const foodCrumbs = createFoodCrumbPool(materials, shared);
  const animalVisitor = createAnimalVisitor(materials, shared);
  const birdMarkers = createBirdMarkerPool(materials, shared);
  const fishMarkers = createFishMarkerPool(materials, shared);

  group.add(
    shells.group,
    driftwood.group,
    tinyFinds.group,
    foodCrumbs.group,
    animalVisitor.group,
    birdMarkers.group,
    fishMarkers.group
  );
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    dummy: new THREE.Object3D(),
    shells,
    driftwood,
    tinyFinds,
    foodCrumbs,
    animalVisitor,
    birdMarkers,
    fishMarkers
  };
}

export function syncAmbientBeachFindsPresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, AMBIENT_BEACH_FINDS_ID);
  if (!prop || !prop.group) return hiddenAmbientBeachFindsTrace(descriptor, "ambient beach finds prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenAmbientBeachFindsTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = ambientBeachFindsAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const shellCount = syncShellInstances(prop.shells, subProps.shells, anchor, context, prop.dummy);
  const driftwoodCount = syncDriftwoodPool(prop.driftwood, subProps.driftwood, anchor, context);
  const tinyFindCount = syncTinyFindInstances(prop.tinyFinds, subProps.tinyFinds, anchor, context, prop.dummy);
  const foodCrumbCount = syncFoodCrumbPool(prop.foodCrumbs, subProps.foodCrumbs, anchor, context);
  const animalVisitorVisible = syncAnimalVisitor(prop.animalVisitor, subProps.animalVisitor, anchor, context);
  const birdMarkerCount = syncBirdMarkerPool(prop.birdMarkers, subProps.birdMarkers, anchor, context);
  const fishMarkerCount = syncFishMarkerPool(prop.fishMarkers, subProps.fishMarkers, anchor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount =
    driftwoodCount + foodCrumbCount + birdMarkerCount + fishMarkerCount + (animalVisitorVisible ? 1 : 0);

  return {
    id: AMBIENT_BEACH_FINDS_ID,
    visible: true,
    ambientBeachFindsVisible: true,
    ambientBeachFindsStage: descriptor ? descriptor.stage || "" : "",
    ambientBeachFindsVariant: descriptor ? descriptor.variant || "" : "",
    ambientBeachFindsActive: Boolean(descriptor && descriptor.active),
    ambientBeachFindsShellsVisible: shellCount > 0,
    ambientBeachFindsDriftwoodVisible: driftwoodCount > 0,
    ambientBeachFindsTinyFindsVisible: tinyFindCount > 0,
    ambientBeachFindsFoodCrumbsVisible: foodCrumbCount > 0,
    ambientBeachFindsAnimalVisitorVisible: animalVisitorVisible,
    ambientBeachFindsBirdMarkersVisible: birdMarkerCount > 0,
    ambientBeachFindsFishMarkersVisible: fishMarkerCount > 0,
    ambientBeachFindsShellCount: shellCount,
    ambientBeachFindsDriftwoodCount: driftwoodCount,
    ambientBeachFindsTinyFindCount: tinyFindCount,
    ambientBeachFindsFoodCrumbCount: foodCrumbCount,
    ambientBeachFindsBirdMarkerCount: birdMarkerCount,
    ambientBeachFindsFishMarkerCount: fishMarkerCount,
    ambientBeachFindsInstancedShellCount: shellCount,
    ambientBeachFindsInstancedTinyFindCount: tinyFindCount,
    ambientBeachFindsPooledObjectCount: pooledObjectCount,
    ambientBeachFindsAssetSourceId: source.id || "",
    ambientBeachFindsAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    ambientBeachFindsTransformId: transform ? transform.id || "" : "",
    ambientBeachFindsTransformNormalized: Boolean(transform),
    ambientBeachFindsWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    ambientBeachFindsDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    ambientBeachFindsFallbackReason: debug.fallbackReason || "",
    renderedObjectCount:
      shellCount +
      driftwoodCount +
      tinyFindCount +
      foodCrumbCount +
      birdMarkerCount +
      fishMarkerCount +
      (animalVisitorVisible ? 1 : 0)
  };
}

export function normalizeAmbientBeachFindsAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createAmbientMaterials() {
  const standard = (color, roughness = 0.86, options = {}) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...options });
  };
  return {
    shellCream: standard(0xf0d7b8, 0.82),
    shellPink: standard(0xe6a6a3, 0.84),
    driftwood: standard(0x7c644e, 0.94),
    driftwoodDark: standard(0x514236, 0.96),
    pebble: standard(0xa69a87, 0.94),
    seaGlass: standard(0x75b9b2, 0.72),
    crumb: standard(0xc28d4f, 0.90),
    leafPlate: standard(0x76935f, 0.88),
    visitorBody: standard(0x6aa28f, 0.86),
    visitorShell: standard(0x9abf7a, 0.88),
    visitorFace: standard(0xe4d0ad, 0.82),
    markerBird: standard(0x3d5267, 0.80),
    markerFish: standard(0x4aa8c4, 0.78),
    markerFin: standard(0x2f7a9b, 0.84),
    shadow: new THREE.MeshBasicMaterial({ color: 0x40382f, transparent: true, opacity: 0.22, depthWrite: false })
  };
}

function createSharedGeometries() {
  return {
    fanShell: new THREE.SphereGeometry(0.18, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.58),
    coneShell: new THREE.ConeGeometry(0.13, 0.28, 8),
    log: new THREE.CylinderGeometry(0.075, 0.105, 1, 7),
    twig: new THREE.CylinderGeometry(0.028, 0.042, 0.56, 7),
    pebble: new THREE.IcosahedronGeometry(0.075, 0),
    seaGlass: new THREE.BoxGeometry(0.12, 0.035, 0.09),
    crumb: new THREE.BoxGeometry(0.065, 0.028, 0.045),
    plate: new THREE.CylinderGeometry(0.24, 0.26, 0.02, 10),
    birdStroke: new THREE.CylinderGeometry(0.014, 0.018, 0.42, 6),
    fishBody: new THREE.SphereGeometry(0.14, 8, 6),
    fishTail: new THREE.ConeGeometry(0.08, 0.16, 3),
    smallRound: new THREE.IcosahedronGeometry(0.11, 1)
  };
}

function createShellInstances(materials, shared) {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_shells";
  group.userData.subPropId = "shells";
  const fanShells = new THREE.InstancedMesh(shared.fanShell, materials.shellCream, MAX_SHELLS);
  fanShells.name = "ambientBeachFinds_fanShells_instanced";
  fanShells.count = 0;
  const coneShells = new THREE.InstancedMesh(shared.coneShell, materials.shellPink, MAX_SHELLS);
  coneShells.name = "ambientBeachFinds_coneShells_instanced";
  coneShells.count = 0;
  group.add(fanShells, coneShells);
  return { group, fanShells, coneShells };
}

function createDriftwoodPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_driftwood";
  group.userData.subPropId = "driftwood";
  const pieces = [];
  for (let i = 0; i < MAX_DRIFTWOOD; i += 1) {
    const piece = new THREE.Group();
    piece.name = `ambientBeachFinds_driftwood_${i + 1}`;
    piece.visible = false;
    const log = new THREE.Mesh(shared.log, materials.driftwood);
    log.name = "driftwood_log";
    log.rotation.z = Math.PI / 2;
    log.scale.set(1, 0.72 + i * 0.04, 1);
    const twigA = new THREE.Mesh(shared.twig, materials.driftwoodDark);
    twigA.name = "driftwood_twig_a";
    twigA.position.set(-0.18, 0.03, 0.06);
    twigA.rotation.set(0.34, 0, Math.PI / 2.9);
    const twigB = new THREE.Mesh(shared.twig, materials.driftwoodDark);
    twigB.name = "driftwood_twig_b";
    twigB.position.set(0.20, 0.02, -0.04);
    twigB.rotation.set(-0.22, 0, -Math.PI / 2.7);
    piece.add(log, twigA, twigB);
    group.add(piece);
    pieces.push(piece);
  }
  return { group, pieces };
}

function createTinyFindInstances(materials, shared) {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_tinyFinds";
  group.userData.subPropId = "tinyFinds";
  const pebbles = new THREE.InstancedMesh(shared.pebble, materials.pebble, MAX_TINY_FINDS);
  pebbles.name = "ambientBeachFinds_pebbles_instanced";
  pebbles.count = 0;
  const seaGlass = new THREE.InstancedMesh(shared.seaGlass, materials.seaGlass, MAX_TINY_FINDS);
  seaGlass.name = "ambientBeachFinds_seaGlass_instanced";
  seaGlass.count = 0;
  group.add(pebbles, seaGlass);
  return { group, pebbles, seaGlass };
}

function createFoodCrumbPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_foodCrumbs";
  group.userData.subPropId = "foodCrumbs";
  const plate = new THREE.Mesh(shared.plate, materials.leafPlate);
  plate.name = "ambientBeachFinds_crumbLeaf";
  plate.scale.set(1.26, 0.5, 0.72);
  plate.position.set(0, 0.012, 0);
  group.add(plate);
  const crumbs = [];
  for (let i = 0; i < MAX_CRUMBS; i += 1) {
    const crumb = new THREE.Mesh(shared.crumb, materials.crumb);
    crumb.name = `ambientBeachFinds_crumb_${i + 1}`;
    crumb.visible = false;
    group.add(crumb);
    crumbs.push(crumb);
  }
  group.visible = false;
  return { group, crumbs, plate };
}

function createAnimalVisitor(materials, shared) {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_animalVisitor";
  group.userData.subPropId = "animalVisitor";
  group.visible = false;
  const shadow = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.012, 12), materials.shadow);
  shadow.name = "animalVisitor_shadow";
  shadow.position.set(0, 0.012, 0);
  const body = new THREE.Mesh(shared.smallRound, materials.visitorBody);
  body.name = "animalVisitor_body";
  body.position.set(0, 0.17, 0);
  body.scale.set(1.44, 0.58, 1.02);
  const shell = new THREE.Mesh(shared.smallRound, materials.visitorShell);
  shell.name = "animalVisitor_softShell";
  shell.position.set(0, 0.25, -0.02);
  shell.scale.set(1.12, 0.42, 0.82);
  const face = new THREE.Mesh(shared.smallRound, materials.visitorFace);
  face.name = "animalVisitor_face";
  face.position.set(0.30, 0.18, 0.02);
  face.scale.set(0.54, 0.42, 0.42);
  const feet = new THREE.Group();
  feet.name = "animalVisitor_feet";
  for (let i = 0; i < 4; i += 1) {
    const foot = new THREE.Mesh(shared.smallRound, materials.visitorBody);
    foot.name = `animalVisitor_foot_${i + 1}`;
    foot.position.set(i < 2 ? -0.18 : 0.18, 0.08, i % 2 === 0 ? -0.22 : 0.22);
    foot.scale.set(0.32, 0.18, 0.24);
    feet.add(foot);
  }
  group.add(shadow, body, shell, face, feet);
  return { group };
}

function createBirdMarkerPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_birdMarkers";
  group.userData.subPropId = "birdMarkers";
  const markers = [];
  for (let i = 0; i < MAX_BIRD_MARKERS; i += 1) {
    const marker = new THREE.Group();
    marker.name = `ambientBeachFinds_birdMarker_${i + 1}`;
    marker.visible = false;
    const left = new THREE.Mesh(shared.birdStroke, materials.markerBird);
    left.name = "birdMarker_leftWing";
    left.position.set(-0.10, 0, 0);
    left.rotation.set(0, 0, Math.PI / 3.2);
    const right = new THREE.Mesh(shared.birdStroke, materials.markerBird);
    right.name = "birdMarker_rightWing";
    right.position.set(0.10, 0, 0);
    right.rotation.set(0, 0, -Math.PI / 3.2);
    marker.add(left, right);
    group.add(marker);
    markers.push(marker);
  }
  return { group, markers };
}

function createFishMarkerPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "ambientBeachFinds_fishMarkers";
  group.userData.subPropId = "fishMarkers";
  const fish = [];
  for (let i = 0; i < MAX_FISH_MARKERS; i += 1) {
    const marker = new THREE.Group();
    marker.name = `ambientBeachFinds_fishMarker_${i + 1}`;
    marker.visible = false;
    const body = new THREE.Mesh(shared.fishBody, materials.markerFish);
    body.name = "fishMarker_body";
    body.scale.set(1.24, 0.48, 0.58);
    const tail = new THREE.Mesh(shared.fishTail, materials.markerFin);
    tail.name = "fishMarker_tail";
    tail.position.set(-0.17, 0, 0);
    tail.rotation.z = Math.PI / 2;
    const fin = new THREE.Mesh(shared.fishTail, materials.markerFin);
    fin.name = "fishMarker_topFin";
    fin.position.set(0.03, 0.08, 0);
    fin.scale.set(0.62, 0.62, 0.62);
    marker.add(body, tail, fin);
    group.add(marker);
    fish.push(marker);
  }
  return { group, fish };
}

function syncShellInstances(shells, subProp, anchor, context, dummy) {
  const count = clampedCount(subProp, MAX_SHELLS);
  shells.group.visible = count > 0;
  positionAtAnchor(shells.group, anchor, { x: -0.58, z: 0.04, yaw: -0.06 }, context, 0.026);
  const fanCount = Math.min(count, Math.ceil(count * 0.62));
  const coneCount = count - fanCount;
  shells.fanShells.count = fanCount;
  shells.coneShells.count = coneCount;
  writeInstancedMatrices(shells.fanShells, SHELL_OFFSETS, fanCount, dummy, { fan: true });
  writeInstancedMatrices(shells.coneShells, SHELL_OFFSETS.slice(fanCount), coneCount, dummy, { cone: true });
  return count;
}

function syncDriftwoodPool(driftwood, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_DRIFTWOOD);
  driftwood.group.visible = count > 0;
  for (let i = 0; i < driftwood.pieces.length; i += 1) {
    const piece = driftwood.pieces[i];
    const visible = i < count;
    piece.visible = visible;
    if (!visible) continue;
    const offset = DRIFTWOOD_OFFSETS[i];
    positionAtAnchor(piece, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.058);
    piece.scale.setScalar(0.96 + (i % 3) * 0.08);
  }
  return count;
}

function syncTinyFindInstances(tinyFinds, subProp, anchor, context, dummy) {
  const count = clampedCount(subProp, MAX_TINY_FINDS);
  tinyFinds.group.visible = count > 0;
  positionAtAnchor(tinyFinds.group, anchor, { x: 0.66, z: 0.42, yaw: 0.14 }, context, 0.024);
  const pebbleCount = Math.ceil(count * 0.56);
  const glassCount = count - pebbleCount;
  tinyFinds.pebbles.count = pebbleCount;
  tinyFinds.seaGlass.count = glassCount;
  writeInstancedMatrices(tinyFinds.pebbles, TINY_FIND_OFFSETS, pebbleCount, dummy, { pebble: true });
  writeInstancedMatrices(tinyFinds.seaGlass, TINY_FIND_OFFSETS.slice(pebbleCount), glassCount, dummy, {
    glass: true
  });
  return count;
}

function syncFoodCrumbPool(foodCrumbs, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_CRUMBS);
  foodCrumbs.group.visible = count > 0;
  positionAtAnchor(foodCrumbs.group, anchor, { x: 0.98, z: -0.34, yaw: -0.36 }, context, 0.026);
  for (let i = 0; i < foodCrumbs.crumbs.length; i += 1) {
    const crumb = foodCrumbs.crumbs[i];
    const visible = i < count;
    crumb.visible = visible;
    if (!visible) continue;
    const offset = CRUMB_OFFSETS[i];
    crumb.position.set(offset[0], 0.052, offset[1]);
    crumb.rotation.set(0.06, offset[2], 0.02);
    crumb.scale.setScalar(0.92 - i * 0.08);
  }
  return count;
}

function syncAnimalVisitor(animalVisitor, subProp, anchor, context) {
  const visible = Boolean(subProp && subProp.visible);
  animalVisitor.group.visible = visible;
  if (!visible) return false;
  positionAtAnchor(animalVisitor.group, anchor, { x: 1.74, z: 0.54, yaw: -0.78 }, context, 0.042);
  const pulse = Math.sin((context.time || 0) * 1.2) * 0.006;
  animalVisitor.group.scale.set(1 + pulse, 1, 1 + pulse);
  return true;
}

function syncBirdMarkerPool(birdMarkers, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_BIRD_MARKERS);
  birdMarkers.group.visible = count > 0;
  for (let i = 0; i < birdMarkers.markers.length; i += 1) {
    const marker = birdMarkers.markers[i];
    const visible = i < count;
    marker.visible = visible;
    if (!visible) continue;
    const offset = BIRD_OFFSETS[i];
    positionAtAnchor(marker, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 1.05 + i * 0.18);
    marker.scale.setScalar(offset[3]);
    marker.rotation.z = Math.sin((context.time || 0) * 0.8 + i) * 0.04;
  }
  return count;
}

function syncFishMarkerPool(fishMarkers, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_FISH_MARKERS);
  fishMarkers.group.visible = count > 0;
  for (let i = 0; i < fishMarkers.fish.length; i += 1) {
    const marker = fishMarkers.fish[i];
    const visible = i < count;
    marker.visible = visible;
    if (!visible) continue;
    const offset = FISH_OFFSETS[i];
    positionAtAnchor(marker, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.092);
    marker.scale.setScalar(offset[3]);
    marker.position.y += Math.sin((context.time || 0) * 1.3 + i) * 0.004;
  }
  return count;
}

function writeInstancedMatrices(mesh, offsets, count, dummy, options = {}) {
  const target = dummy || new THREE.Object3D();
  for (let i = 0; i < count; i += 1) {
    const offset = offsets[i % offsets.length];
    target.position.set(offset[0], 0, offset[1]);
    target.rotation.set(
      options.cone ? Math.PI / 2 : 0,
      offset[2],
      options.fan ? 0.02 : options.glass ? 0.04 : 0
    );
    const scale = offset[3] || 1;
    if (options.fan) {
      target.scale.set(scale * 1.08, scale * 0.26, scale * 0.72);
    } else if (options.cone) {
      target.scale.set(scale * 0.82, scale * 0.94, scale * 0.82);
    } else if (options.glass) {
      target.scale.set(scale * 0.86, scale * 0.64, scale * 1.08);
    } else {
      target.scale.set(scale, scale * 0.55, scale * 0.86);
    }
    target.updateMatrix();
    mesh.setMatrixAt(i, target.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

function ambientBeachFindsAnchor(worldState) {
  const state = worldState && worldState.ambientBeachFinds ? worldState.ambientBeachFinds : {};
  const position = state.anchorPosition && typeof state.anchorPosition === "object" ? state.anchorPosition : {};
  return {
    x: Number.isFinite(position.x) ? position.x : DEFAULT_ANCHOR.x,
    z: Number.isFinite(position.z) ? position.z : DEFAULT_ANCHOR.z,
    yaw: Number.isFinite(state.yaw) ? state.yaw : DEFAULT_ANCHOR.yaw
  };
}

function positionAtAnchor(object, anchor, offset, context, lift = 0) {
  const yaw = Number(anchor.yaw || 0);
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const x = anchor.x + offset.x * cos - offset.z * sin;
  const z = anchor.z + offset.x * sin + offset.z * cos;
  const ground = typeof context.groundHeightAt === "function" ? context.groundHeightAt(x, z) : 0;
  object.position.set(x, ground + lift, z);
  object.rotation.set(0, yaw + Number(offset.yaw || 0), 0);
}

function clampedCount(subProp, max) {
  if (!subProp || !subProp.visible) return 0;
  return Math.max(0, Math.min(max, Math.floor(Number(subProp.count || 0))));
}

function descriptorByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function hiddenAmbientBeachFindsTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: AMBIENT_BEACH_FINDS_ID,
    visible: false,
    ambientBeachFindsVisible: false,
    ambientBeachFindsStage: descriptor ? descriptor.stage || "" : "",
    ambientBeachFindsVariant: descriptor ? descriptor.variant || "" : "",
    ambientBeachFindsActive: Boolean(descriptor && descriptor.active),
    ambientBeachFindsShellsVisible: false,
    ambientBeachFindsDriftwoodVisible: false,
    ambientBeachFindsTinyFindsVisible: false,
    ambientBeachFindsFoodCrumbsVisible: false,
    ambientBeachFindsAnimalVisitorVisible: false,
    ambientBeachFindsBirdMarkersVisible: false,
    ambientBeachFindsFishMarkersVisible: false,
    ambientBeachFindsShellCount: 0,
    ambientBeachFindsDriftwoodCount: 0,
    ambientBeachFindsTinyFindCount: 0,
    ambientBeachFindsFoodCrumbCount: 0,
    ambientBeachFindsBirdMarkerCount: 0,
    ambientBeachFindsFishMarkerCount: 0,
    ambientBeachFindsInstancedShellCount: 0,
    ambientBeachFindsInstancedTinyFindCount: 0,
    ambientBeachFindsPooledObjectCount: 0,
    ambientBeachFindsAssetSourceId: source.id || "",
    ambientBeachFindsAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    ambientBeachFindsTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    ambientBeachFindsTransformNormalized: Boolean(descriptor && descriptor.transform),
    ambientBeachFindsWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    ambientBeachFindsDuplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    ambientBeachFindsFallbackReason: reason || "",
    renderedObjectCount: 0
  };
}
