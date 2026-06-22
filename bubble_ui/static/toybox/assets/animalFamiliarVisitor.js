import * as THREE from "three";

import { ANIMAL_FAMILIAR_VISITOR_ID } from "../simulation/worldState.js";

const DEFAULT_ANCHOR = Object.freeze({ x: -10.95, y: 0.18, z: 30.86, yaw: -0.52 });
const DEFAULT_AIR_ANCHOR = Object.freeze({ x: -10.36, y: 0.58, z: 30.38, yaw: -0.36 });
const DEFAULT_WATER_ANCHOR = Object.freeze({ x: -13.18, y: -0.08, z: 32.12, yaw: -0.12 });
const DEFAULT_APPROACH_ANCHOR = Object.freeze({ x: -10.18, y: 0.18, z: 29.92, yaw: -0.44 });
const MAX_BIRDS = 2;
const MAX_FISH = 2;
const MAX_CRUMBS = 5;
const MAX_APPROACH_MARKERS = 4;

const BIRD_LAYOUT = Object.freeze([
  [-0.18, 0.02, 0.12, 0.92],
  [0.32, 0.10, -0.18, 0.76]
]);

const FISH_LAYOUT = Object.freeze([
  [-0.22, -0.04, 0.18, 0.90],
  [0.32, 0.12, -0.24, 0.72]
]);

const CRUMB_LAYOUT = Object.freeze([
  [-0.18, 0.08, 0.08, 0.92],
  [0.02, -0.06, -0.18, 0.78],
  [0.18, 0.10, 0.24, 0.70],
  [-0.04, 0.24, -0.10, 0.62],
  [0.28, -0.18, 0.14, 0.58]
]);

const APPROACH_LAYOUT = Object.freeze([
  [-0.54, 0.00, 0.08, 0.82],
  [-0.24, 0.16, -0.12, 0.72],
  [0.08, 0.28, 0.18, 0.66],
  [0.40, 0.42, -0.06, 0.58]
]);

export function createAnimalFamiliarVisitorPresentationProp() {
  const group = new THREE.Group();
  group.name = "animalFamiliarVisitor_group";
  group.userData.type = "presentationFamily";
  group.userData.family = ANIMAL_FAMILIAR_VISITOR_ID;

  const materials = createAnimalFamiliarMaterials();
  const shared = createSharedGeometries();
  const observeRing = createObserveRing(materials);
  const approachMarkers = createApproachMarkers(materials, shared);
  const foodCrumbs = createFoodCrumbs(materials, shared);
  const groundVisitor = createGroundVisitor(materials, shared);
  const birdVisitors = createBirdVisitors(materials, shared);
  const fishVisitors = createFishVisitors(materials, shared);

  group.add(
    observeRing.group,
    approachMarkers.group,
    foodCrumbs.group,
    groundVisitor.group,
    birdVisitors.group,
    fishVisitors.group
  );
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
    object.userData.nonBlockingVisual = true;
  });

  return {
    group,
    observeRing,
    approachMarkers,
    foodCrumbs,
    groundVisitor,
    birdVisitors,
    fishVisitors
  };
}

export function syncAnimalFamiliarVisitorPresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, ANIMAL_FAMILIAR_VISITOR_ID);
  if (!prop || !prop.group) return hiddenAnimalFamiliarVisitorTrace(descriptor, "animal familiar visitor prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenAnimalFamiliarVisitorTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = animalFamiliarAnchor(context.worldState);
  const airAnchor = animalFamiliarAirAnchor(context.worldState);
  const waterAnchor = animalFamiliarWaterAnchor(context.worldState);
  const approachAnchor = animalFamiliarApproachAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const observeRingCount = syncObserveRing(prop.observeRing, subProps.observeRing, anchor, context);
  const approachMarkerCount = syncApproachMarkers(prop.approachMarkers, subProps.approachMarkers, approachAnchor, context);
  const foodCrumbCount = syncFoodCrumbs(prop.foodCrumbs, subProps.foodCrumbs, anchor, context);
  const animalCount = syncGroundVisitor(prop.groundVisitor, subProps.groundVisitor, anchor, context);
  const birdVisitorCount = syncBirdVisitors(prop.birdVisitors, subProps.birdVisitor, airAnchor, context);
  const fishVisitorCount = syncFishVisitors(prop.fishVisitors, subProps.fishVisitor, waterAnchor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount = approachMarkerCount + foodCrumbCount + birdVisitorCount + fishVisitorCount + animalCount;

  return {
    id: ANIMAL_FAMILIAR_VISITOR_ID,
    visible: true,
    animalFamiliarVisitorVisible: true,
    animalFamiliarVisitorStage: descriptor ? descriptor.stage || "" : "",
    animalFamiliarVisitorVariant: descriptor ? descriptor.variant || "" : "",
    animalFamiliarVisitorActive: Boolean(descriptor && descriptor.active),
    animalFamiliarVisitorGroundVisitorVisible: animalCount > 0,
    animalFamiliarVisitorBirdVisitorVisible: birdVisitorCount > 0,
    animalFamiliarVisitorFishVisitorVisible: fishVisitorCount > 0,
    animalFamiliarVisitorFoodCrumbsVisible: foodCrumbCount > 0,
    animalFamiliarVisitorObserveRingVisible: observeRingCount > 0,
    animalFamiliarVisitorApproachMarkersVisible: approachMarkerCount > 0,
    animalFamiliarVisitorAnimalCount: animalCount,
    animalFamiliarVisitorBirdVisitorCount: birdVisitorCount,
    animalFamiliarVisitorFishVisitorCount: fishVisitorCount,
    animalFamiliarVisitorFoodCrumbCount: foodCrumbCount,
    animalFamiliarVisitorObserveRingCount: observeRingCount,
    animalFamiliarVisitorApproachMarkerCount: approachMarkerCount,
    animalFamiliarVisitorObserveRadius: Number(debug.observeRadius || 0),
    animalFamiliarVisitorApproachDistance: Number(debug.approachDistance || 0),
    animalFamiliarVisitorCollisionEnabled: false,
    animalFamiliarVisitorBlocksMovement: false,
    animalFamiliarVisitorAffectsCameraFollow: false,
    animalFamiliarVisitorAssetSourceId: source.id || "",
    animalFamiliarVisitorAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    animalFamiliarVisitorTransformId: transform ? transform.id || "" : "",
    animalFamiliarVisitorTransformNormalized: Boolean(transform),
    animalFamiliarVisitorWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    animalFamiliarVisitorDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    animalFamiliarVisitorNonblockingNote: debug.nonblockingNote || "",
    animalFamiliarVisitorPlaceholderNote: debug.placeholderNote || "",
    animalFamiliarVisitorFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount + observeRingCount,
    pooledObjectCount
  };
}

export function normalizeAnimalFamiliarVisitorAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createAnimalFamiliarMaterials() {
  const standard = (color, roughness = 0.84, options = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...options });
  return {
    body: standard(0x8bb186, 0.86),
    belly: standard(0xe1cda5, 0.82),
    ear: standard(0x6d9275, 0.88),
    eye: standard(0x26323a, 0.70),
    crumb: standard(0xd0a35a, 0.88),
    leaf: standard(0x667f4b, 0.90),
    bird: standard(0x577c9a, 0.78),
    birdWing: standard(0x395875, 0.80),
    beak: standard(0xd5a24f, 0.74),
    fish: standard(0x4aa7b7, 0.76),
    fishFin: standard(0x2e788f, 0.82),
    pebble: standard(0xa69a86, 0.90),
    observe: new THREE.MeshBasicMaterial({
      color: 0x8fc8a0,
      transparent: true,
      opacity: 0.32,
      depthWrite: false
    }),
    shadow: new THREE.MeshBasicMaterial({ color: 0x2f332b, transparent: true, opacity: 0.20, depthWrite: false })
  };
}

function createSharedGeometries() {
  return {
    round: new THREE.IcosahedronGeometry(0.12, 1),
    crumb: new THREE.BoxGeometry(0.065, 0.030, 0.045),
    plate: new THREE.CylinderGeometry(0.25, 0.28, 0.018, 10),
    birdBody: new THREE.SphereGeometry(0.12, 8, 6),
    birdWing: new THREE.ConeGeometry(0.075, 0.18, 3),
    fishBody: new THREE.SphereGeometry(0.13, 8, 6),
    fishTail: new THREE.ConeGeometry(0.075, 0.14, 3),
    pebble: new THREE.IcosahedronGeometry(0.070, 0)
  };
}

function createObserveRing(materials) {
  const group = new THREE.Group();
  group.name = "animalFamiliarVisitor_observeRing";
  group.userData.subPropId = "observeRing";
  group.visible = false;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.014, 6, 40), materials.observe);
  ring.name = "animalFamiliarVisitor_observeDistanceRing";
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  return { group, ring };
}

function createApproachMarkers(materials, shared) {
  const group = new THREE.Group();
  group.name = "animalFamiliarVisitor_approachMarkers";
  group.userData.subPropId = "approachMarkers";
  const markers = [];
  for (let i = 0; i < MAX_APPROACH_MARKERS; i += 1) {
    const marker = new THREE.Mesh(shared.pebble, i % 2 === 0 ? materials.pebble : materials.leaf);
    marker.name = `animalFamiliarVisitor_approachMarker_${i + 1}`;
    marker.visible = false;
    group.add(marker);
    markers.push(marker);
  }
  group.visible = false;
  return { group, markers };
}

function createFoodCrumbs(materials, shared) {
  const group = new THREE.Group();
  group.name = "animalFamiliarVisitor_foodCrumbs";
  group.userData.subPropId = "foodCrumbs";
  const plate = new THREE.Mesh(shared.plate, materials.leaf);
  plate.name = "animalFamiliarVisitor_crumbLeaf";
  plate.position.set(0, 0.012, 0);
  plate.scale.set(1.12, 0.52, 0.76);
  group.add(plate);
  const crumbs = [];
  for (let i = 0; i < MAX_CRUMBS; i += 1) {
    const crumb = new THREE.Mesh(shared.crumb, materials.crumb);
    crumb.name = `animalFamiliarVisitor_crumb_${i + 1}`;
    crumb.visible = false;
    group.add(crumb);
    crumbs.push(crumb);
  }
  group.visible = false;
  return { group, crumbs };
}

function createGroundVisitor(materials, shared) {
  const group = new THREE.Group();
  group.name = "animalFamiliarVisitor_groundVisitor";
  group.userData.subPropId = "groundVisitor";
  group.visible = false;
  const shadow = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.45, 0.012, 12), materials.shadow);
  shadow.name = "animalFamiliarVisitor_groundShadow";
  shadow.position.set(0, 0.012, 0);
  const body = new THREE.Mesh(shared.round, materials.body);
  body.name = "animalFamiliarVisitor_body";
  body.position.set(0, 0.18, 0);
  body.scale.set(1.52, 0.64, 0.94);
  const belly = new THREE.Mesh(shared.round, materials.belly);
  belly.name = "animalFamiliarVisitor_belly";
  belly.position.set(0.18, 0.16, 0.02);
  belly.scale.set(0.70, 0.40, 0.50);
  const head = new THREE.Mesh(shared.round, materials.body);
  head.name = "animalFamiliarVisitor_head";
  head.position.set(0.38, 0.24, 0.02);
  head.scale.set(0.62, 0.52, 0.50);
  const earA = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 5), materials.ear);
  earA.name = "animalFamiliarVisitor_earA";
  earA.position.set(0.35, 0.42, -0.10);
  earA.rotation.z = -0.18;
  const earB = earA.clone();
  earB.name = "animalFamiliarVisitor_earB";
  earB.position.z = 0.12;
  const eyeA = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 4), materials.eye);
  eyeA.name = "animalFamiliarVisitor_eyeA";
  eyeA.position.set(0.50, 0.27, -0.09);
  const eyeB = eyeA.clone();
  eyeB.name = "animalFamiliarVisitor_eyeB";
  eyeB.position.z = 0.10;
  group.add(shadow, body, belly, head, earA, earB, eyeA, eyeB);
  return { group };
}

function createBirdVisitors(materials, shared) {
  const group = new THREE.Group();
  group.name = "animalFamiliarVisitor_birdVisitors";
  group.userData.subPropId = "birdVisitor";
  const birds = [];
  for (let i = 0; i < MAX_BIRDS; i += 1) {
    const bird = new THREE.Group();
    bird.name = `animalFamiliarVisitor_birdVisitor_${i + 1}`;
    bird.visible = false;
    const body = new THREE.Mesh(shared.birdBody, materials.bird);
    body.name = "birdVisitor_body";
    body.scale.set(1.12, 0.72, 0.82);
    const leftWing = new THREE.Mesh(shared.birdWing, materials.birdWing);
    leftWing.name = "birdVisitor_leftWing";
    leftWing.position.set(-0.08, 0.00, -0.08);
    leftWing.rotation.set(0.20, 0.08, Math.PI / 2.8);
    const rightWing = leftWing.clone();
    rightWing.name = "birdVisitor_rightWing";
    rightWing.position.z = 0.08;
    rightWing.rotation.z = -Math.PI / 2.8;
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.095, 5), materials.beak);
    beak.name = "birdVisitor_beak";
    beak.position.set(0.14, 0.00, 0);
    beak.rotation.z = -Math.PI / 2;
    bird.add(body, leftWing, rightWing, beak);
    group.add(bird);
    birds.push(bird);
  }
  group.visible = false;
  return { group, birds };
}

function createFishVisitors(materials, shared) {
  const group = new THREE.Group();
  group.name = "animalFamiliarVisitor_fishVisitors";
  group.userData.subPropId = "fishVisitor";
  const fish = [];
  for (let i = 0; i < MAX_FISH; i += 1) {
    const marker = new THREE.Group();
    marker.name = `animalFamiliarVisitor_fishVisitor_${i + 1}`;
    marker.visible = false;
    const body = new THREE.Mesh(shared.fishBody, materials.fish);
    body.name = "fishVisitor_body";
    body.scale.set(1.28, 0.48, 0.62);
    const tail = new THREE.Mesh(shared.fishTail, materials.fishFin);
    tail.name = "fishVisitor_tail";
    tail.position.set(-0.16, 0, 0);
    tail.rotation.z = Math.PI / 2;
    const fin = new THREE.Mesh(shared.fishTail, materials.fishFin);
    fin.name = "fishVisitor_topFin";
    fin.position.set(0.02, 0.08, 0);
    fin.scale.set(0.55, 0.55, 0.55);
    marker.add(body, tail, fin);
    group.add(marker);
    fish.push(marker);
  }
  group.visible = false;
  return { group, fish };
}

function syncObserveRing(observeRing, subProp, anchor, context) {
  const count = clampedCount(subProp, 1);
  observeRing.group.visible = count > 0;
  if (count <= 0) return 0;
  positionAtAnchor(observeRing.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.020);
  const radius = Math.max(0.4, Number(subProp.radius || 2.55));
  observeRing.group.scale.set(radius, 1, radius);
  return 1;
}

function syncApproachMarkers(approachMarkers, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_APPROACH_MARKERS);
  approachMarkers.group.visible = count > 0;
  for (let i = 0; i < approachMarkers.markers.length; i += 1) {
    const marker = approachMarkers.markers[i];
    const visible = i < count;
    marker.visible = visible;
    if (!visible) continue;
    const offset = APPROACH_LAYOUT[i];
    positionAtAnchor(marker, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.030);
    marker.scale.setScalar(offset[3]);
  }
  return count;
}

function syncFoodCrumbs(foodCrumbs, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_CRUMBS);
  foodCrumbs.group.visible = count > 0;
  positionAtAnchor(foodCrumbs.group, anchor, { x: -0.38, z: 0.42, yaw: 0.18 }, context, 0.028);
  for (let i = 0; i < foodCrumbs.crumbs.length; i += 1) {
    const crumb = foodCrumbs.crumbs[i];
    const visible = i < count;
    crumb.visible = visible;
    if (!visible) continue;
    const offset = CRUMB_LAYOUT[i];
    crumb.position.set(offset[0], 0.050, offset[1]);
    crumb.rotation.set(0.04, offset[2], 0.02);
    crumb.scale.setScalar(offset[3]);
  }
  return count;
}

function syncGroundVisitor(groundVisitor, subProp, anchor, context) {
  const count = clampedCount(subProp, 1);
  groundVisitor.group.visible = count > 0;
  if (count <= 0) return 0;
  positionAtAnchor(groundVisitor.group, anchor, { x: 0.58, z: -0.18, yaw: -0.46 }, context, 0.044);
  const pulse = Math.sin((context.time || 0) * 1.1) * 0.006;
  groundVisitor.group.scale.set(1 + pulse, 1, 1 + pulse);
  return 1;
}

function syncBirdVisitors(birdVisitors, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_BIRDS);
  birdVisitors.group.visible = count > 0;
  for (let i = 0; i < birdVisitors.birds.length; i += 1) {
    const bird = birdVisitors.birds[i];
    const visible = i < count;
    bird.visible = visible;
    if (!visible) continue;
    const offset = BIRD_LAYOUT[i];
    positionAtAnchor(bird, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.54 + i * 0.12);
    bird.scale.setScalar(offset[3]);
    bird.rotation.z = Math.sin((context.time || 0) * 0.8 + i) * 0.03;
  }
  return count;
}

function syncFishVisitors(fishVisitors, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_FISH);
  fishVisitors.group.visible = count > 0;
  for (let i = 0; i < fishVisitors.fish.length; i += 1) {
    const fish = fishVisitors.fish[i];
    const visible = i < count;
    fish.visible = visible;
    if (!visible) continue;
    const offset = FISH_LAYOUT[i];
    positionAtAnchor(fish, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.076);
    fish.scale.setScalar(offset[3]);
    fish.position.y += Math.sin((context.time || 0) * 1.2 + i) * 0.004;
  }
  return count;
}

function animalFamiliarAnchor(worldState) {
  const state = worldState && worldState.animalFamiliarVisitor ? worldState.animalFamiliarVisitor : {};
  return normalizedAnchor(state.anchorPosition, DEFAULT_ANCHOR, state.yaw);
}

function animalFamiliarAirAnchor(worldState) {
  const state = worldState && worldState.animalFamiliarVisitor ? worldState.animalFamiliarVisitor : {};
  return normalizedAnchor(state.airAnchorPosition, DEFAULT_AIR_ANCHOR, state.airYaw);
}

function animalFamiliarWaterAnchor(worldState) {
  const state = worldState && worldState.animalFamiliarVisitor ? worldState.animalFamiliarVisitor : {};
  return normalizedAnchor(state.waterAnchorPosition, DEFAULT_WATER_ANCHOR, state.waterYaw);
}

function animalFamiliarApproachAnchor(worldState) {
  const state = worldState && worldState.animalFamiliarVisitor ? worldState.animalFamiliarVisitor : {};
  return normalizedAnchor(state.approachAnchorPosition, DEFAULT_APPROACH_ANCHOR, state.approachYaw);
}

function normalizedAnchor(position, fallback, yaw) {
  const source = position && typeof position === "object" ? position : {};
  return {
    x: Number.isFinite(source.x) ? source.x : fallback.x,
    y: Number.isFinite(source.y) ? source.y : fallback.y,
    z: Number.isFinite(source.z) ? source.z : fallback.z,
    yaw: Number.isFinite(yaw) ? yaw : fallback.yaw
  };
}

function positionAtAnchor(object, anchor, offset, context, lift = 0) {
  const yaw = Number(anchor.yaw || 0);
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const x = anchor.x + offset.x * cos - offset.z * sin;
  const z = anchor.z + offset.x * sin + offset.z * cos;
  const ground = typeof context.groundHeightAt === "function" ? context.groundHeightAt(x, z) : Number(anchor.y || 0);
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

function hiddenAnimalFamiliarVisitorTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: ANIMAL_FAMILIAR_VISITOR_ID,
    visible: false,
    animalFamiliarVisitorVisible: false,
    animalFamiliarVisitorStage: descriptor ? descriptor.stage || "" : "",
    animalFamiliarVisitorVariant: descriptor ? descriptor.variant || "" : "",
    animalFamiliarVisitorActive: Boolean(descriptor && descriptor.active),
    animalFamiliarVisitorGroundVisitorVisible: false,
    animalFamiliarVisitorBirdVisitorVisible: false,
    animalFamiliarVisitorFishVisitorVisible: false,
    animalFamiliarVisitorFoodCrumbsVisible: false,
    animalFamiliarVisitorObserveRingVisible: false,
    animalFamiliarVisitorApproachMarkersVisible: false,
    animalFamiliarVisitorAnimalCount: 0,
    animalFamiliarVisitorBirdVisitorCount: 0,
    animalFamiliarVisitorFishVisitorCount: 0,
    animalFamiliarVisitorFoodCrumbCount: 0,
    animalFamiliarVisitorObserveRingCount: 0,
    animalFamiliarVisitorApproachMarkerCount: 0,
    animalFamiliarVisitorObserveRadius: descriptor && descriptor.debug ? Number(descriptor.debug.observeRadius || 0) : 0,
    animalFamiliarVisitorApproachDistance:
      descriptor && descriptor.debug ? Number(descriptor.debug.approachDistance || 0) : 0,
    animalFamiliarVisitorCollisionEnabled: false,
    animalFamiliarVisitorBlocksMovement: false,
    animalFamiliarVisitorAffectsCameraFollow: false,
    animalFamiliarVisitorAssetSourceId: source.id || "",
    animalFamiliarVisitorAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    animalFamiliarVisitorTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    animalFamiliarVisitorTransformNormalized: Boolean(descriptor && descriptor.transform),
    animalFamiliarVisitorWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    animalFamiliarVisitorDuplicateSystemClassification:
      descriptor && descriptor.debug ? descriptor.debug.duplicateSystemClassification || "" : "",
    animalFamiliarVisitorNonblockingNote: descriptor && descriptor.debug ? descriptor.debug.nonblockingNote || "" : "",
    animalFamiliarVisitorPlaceholderNote: descriptor && descriptor.debug ? descriptor.debug.placeholderNote || "" : "",
    animalFamiliarVisitorFallbackReason: reason || "",
    renderedObjectCount: 0,
    pooledObjectCount: 0
  };
}
