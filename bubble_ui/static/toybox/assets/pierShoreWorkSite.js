import * as THREE from "three";

import { PIER_SHORE_WORK_SITE_ID } from "../simulation/worldState.js";

const MAX_POSTS = 8;
const MAX_PLANKS = 7;
const MAX_LASHINGS = 12;
const DEFAULT_ANCHOR = Object.freeze({ x: -11.9, z: 31.1, yaw: -0.52 });
const DEFAULT_SAFE_BUILD_ANCHOR = Object.freeze({ x: -10.6, z: 29.5, yaw: -0.22 });
const DEFAULT_FISHING_SLOT = Object.freeze({ x: -13.4, z: 31.9, yaw: -0.62 });

const POST_OFFSETS = Object.freeze([
  [-0.52, 0.18, 0.02],
  [0.52, 0.18, -0.02],
  [-0.58, -0.42, 0.04],
  [0.58, -0.42, -0.04],
  [-0.62, -1.02, -0.02],
  [0.62, -1.02, 0.02],
  [-0.50, -1.54, 0.06],
  [0.50, -1.54, -0.06]
]);

const PLANK_OFFSETS = Object.freeze([
  [0, 0.16, 0.02, 1.02],
  [0, -0.10, -0.03, 0.96],
  [0, -0.36, 0.04, 1.00],
  [0, -0.62, -0.02, 0.92],
  [0, -0.88, 0.03, 0.94],
  [0, -1.14, -0.04, 0.82],
  [0, -1.38, 0.02, 0.76]
]);

const LASHING_OFFSETS = Object.freeze([
  [-0.52, 0.18, 0.14],
  [0.52, 0.18, -0.14],
  [-0.58, -0.42, -0.16],
  [0.58, -0.42, 0.16],
  [-0.62, -1.02, 0.12],
  [0.62, -1.02, -0.12],
  [-0.50, -1.54, -0.10],
  [0.50, -1.54, 0.10],
  [-0.18, -0.36, 0.36],
  [0.18, -0.84, -0.34],
  [-0.22, -1.18, 0.32],
  [0.22, -1.38, -0.28]
]);

export function createPierShoreWorkSitePresentationProp() {
  const group = new THREE.Group();
  group.name = "pierShoreWorkSite_group";
  group.userData.type = "presentationFamily";
  group.userData.family = PIER_SHORE_WORK_SITE_ID;

  const materials = createPierMaterials();
  const shared = createSharedGeometries();
  const pierPosts = createPostPool(materials, shared);
  const planks = createPlankPool(materials, shared);
  const lashings = createLashingPool(materials, shared);
  const shoreWorkMarker = createShoreWorkMarker(materials, shared);
  const safeBuildSite = createSafeBuildSiteMarker(materials, shared);
  const fishingSlot = createFishingSlotMarker(materials, shared);

  group.add(
    pierPosts.group,
    planks.group,
    lashings.group,
    shoreWorkMarker.group,
    safeBuildSite.group,
    fishingSlot.group
  );
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = false;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    pierPosts,
    planks,
    lashings,
    shoreWorkMarker,
    safeBuildSite,
    fishingSlot
  };
}

export function syncPierShoreWorkSitePresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, PIER_SHORE_WORK_SITE_ID);
  if (!prop || !prop.group) return hiddenPierShoreWorkSiteTrace(descriptor, "pier shore work site prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenPierShoreWorkSiteTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = pierAnchor(context.worldState);
  const safeAnchor = safeBuildAnchor(context.worldState);
  const fishingAnchor = fishingSlotAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const pierPostCount = syncPostPool(prop.pierPosts, subProps.pierPosts, anchor, context);
  const plankCount = syncPlankPool(prop.planks, subProps.planks, anchor, context);
  const lashingCount = syncLashingPool(prop.lashings, subProps.lashings, anchor, context);
  const workMarkerCount = syncShoreWorkMarker(prop.shoreWorkMarker, subProps.shoreWorkMarker, anchor, context);
  const safeBuildSiteCount = syncSafeBuildSite(prop.safeBuildSite, subProps.safeBuildSite, safeAnchor, context);
  const fishingSlotCount = syncFishingSlot(prop.fishingSlot, subProps.pierFishingSlot, fishingAnchor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount = pierPostCount + plankCount + lashingCount + workMarkerCount + safeBuildSiteCount + fishingSlotCount;

  return {
    id: PIER_SHORE_WORK_SITE_ID,
    visible: true,
    pierShoreWorkSiteVisible: true,
    pierShoreWorkSiteStage: descriptor ? descriptor.stage || "" : "",
    pierShoreWorkSiteVariant: descriptor ? descriptor.variant || "" : "",
    pierShoreWorkSiteActive: Boolean(descriptor && descriptor.active),
    pierShoreWorkSitePostsVisible: pierPostCount > 0,
    pierShoreWorkSitePlanksVisible: plankCount > 0,
    pierShoreWorkSiteLashingsVisible: lashingCount > 0,
    pierShoreWorkSiteShoreWorkMarkerVisible: workMarkerCount > 0,
    pierShoreWorkSiteSafeBuildSiteVisible: safeBuildSiteCount > 0,
    pierShoreWorkSiteFishingSlotVisible: fishingSlotCount > 0,
    pierShoreWorkSitePostCount: pierPostCount,
    pierShoreWorkSitePlankCount: plankCount,
    pierShoreWorkSiteLashingCount: lashingCount,
    pierShoreWorkSiteWorkMarkerCount: workMarkerCount,
    pierShoreWorkSiteSafeBuildSiteCount: safeBuildSiteCount,
    pierShoreWorkSiteFishingSlotCount: fishingSlotCount,
    pierShoreWorkSitePooledObjectCount: pooledObjectCount,
    pierShoreWorkSiteAssetSourceId: source.id || "",
    pierShoreWorkSiteAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    pierShoreWorkSiteTransformId: transform ? transform.id || "" : "",
    pierShoreWorkSiteTransformNormalized: Boolean(transform),
    pierShoreWorkSiteWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    pierShoreWorkSiteDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    pierShoreWorkSiteSafetyNote: debug.shoreSafetyNote || "",
    pierShoreWorkSiteFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount
  };
}

export function normalizePierShoreWorkSiteAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createPierMaterials() {
  const standard = (color, roughness = 0.86, options = {}) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, emissive: color, emissiveIntensity: 0.12, ...options });
  };
  return {
    postWood: standard(0xa87345, 0.92),
    plankWood: standard(0xd19355, 0.88),
    plankEdge: standard(0x8b6040, 0.94),
    rope: standard(0xe2c178, 0.92),
    vine: standard(0x7b9254, 0.94),
    markerFlag: standard(0xe8b550, 0.78),
    buildRing: standard(0xd7c08b, 0.88),
    safeBlue: standard(0x67b6c9, 0.76),
    slotBlue: standard(0x4fa9c7, 0.74),
    slotDark: standard(0x245f78, 0.82),
    shadow: new THREE.MeshBasicMaterial({ color: 0x382d22, transparent: true, opacity: 0.26, depthWrite: false })
  };
}

function createSharedGeometries() {
  return {
    post: new THREE.CylinderGeometry(0.08, 0.11, 1.05, 7),
    plank: new THREE.BoxGeometry(1.28, 0.08, 0.20),
    plankEnd: new THREE.BoxGeometry(0.04, 0.086, 0.22),
    lashing: new THREE.TorusGeometry(0.105, 0.013, 6, 12),
    stake: new THREE.CylinderGeometry(0.035, 0.048, 0.68, 7),
    flag: new THREE.ConeGeometry(0.15, 0.28, 3),
    markerBase: new THREE.CylinderGeometry(0.26, 0.28, 0.018, 10),
    safeCenter: new THREE.CylinderGeometry(0.32, 0.34, 0.018, 12),
    ringStone: new THREE.BoxGeometry(0.18, 0.045, 0.10),
    slotFloat: new THREE.SphereGeometry(0.14, 8, 6),
    slotStem: new THREE.CylinderGeometry(0.018, 0.024, 0.42, 6),
    slotRing: new THREE.TorusGeometry(0.22, 0.016, 6, 14)
  };
}

function createPostPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "pierShoreWorkSite_posts";
  group.userData.subPropId = "pierPosts";
  const posts = [];
  for (let i = 0; i < MAX_POSTS; i += 1) {
    const post = new THREE.Mesh(shared.post, materials.postWood);
    post.name = `pierShoreWorkSite_post_${i + 1}`;
    post.visible = false;
    group.add(post);
    posts.push(post);
  }
  return { group, posts };
}

function createPlankPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "pierShoreWorkSite_planks";
  group.userData.subPropId = "planks";
  const planks = [];
  for (let i = 0; i < MAX_PLANKS; i += 1) {
    const plank = new THREE.Group();
    plank.name = `pierShoreWorkSite_plank_${i + 1}`;
    plank.visible = false;
    const body = new THREE.Mesh(shared.plank, materials.plankWood);
    body.name = "pierPlank_body";
    const endA = new THREE.Mesh(shared.plankEnd, materials.plankEdge);
    endA.name = "pierPlank_end_a";
    endA.position.x = -0.66;
    const endB = endA.clone();
    endB.name = "pierPlank_end_b";
    endB.position.x = 0.66;
    plank.add(body, endA, endB);
    group.add(plank);
    planks.push(plank);
  }
  return { group, planks };
}

function createLashingPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "pierShoreWorkSite_lashings";
  group.userData.subPropId = "lashings";
  const lashings = [];
  for (let i = 0; i < MAX_LASHINGS; i += 1) {
    const lashing = new THREE.Mesh(shared.lashing, i % 3 === 0 ? materials.vine : materials.rope);
    lashing.name = `pierShoreWorkSite_lashing_${i + 1}`;
    lashing.visible = false;
    group.add(lashing);
    lashings.push(lashing);
  }
  return { group, lashings };
}

function createShoreWorkMarker(materials, shared) {
  const group = new THREE.Group();
  group.name = "pierShoreWorkSite_shoreWorkMarker";
  group.userData.subPropId = "shoreWorkMarker";
  group.visible = false;
  const stake = new THREE.Mesh(shared.stake, materials.postWood);
  stake.name = "shoreWorkMarker_stake";
  stake.position.set(0, 0.34, 0);
  const flag = new THREE.Mesh(shared.flag, materials.markerFlag);
  flag.name = "shoreWorkMarker_flag";
  flag.position.set(0.13, 0.58, 0);
  flag.rotation.set(0, 0, -Math.PI / 2);
  const base = new THREE.Mesh(shared.markerBase, materials.shadow);
  base.name = "shoreWorkMarker_shadow";
  base.position.set(0, 0.012, 0);
  group.add(base, stake, flag);
  return { group };
}

function createSafeBuildSiteMarker(materials, shared) {
  const group = new THREE.Group();
  group.name = "pierShoreWorkSite_safeBuildSite";
  group.userData.subPropId = "safeBuildSite";
  group.visible = false;
  const center = new THREE.Mesh(shared.safeCenter, materials.safeBlue);
  center.name = "safeBuildSite_center";
  center.scale.set(1.2, 1, 0.64);
  const stones = new THREE.Group();
  stones.name = "safeBuildSite_ringStones";
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const stone = new THREE.Mesh(shared.ringStone, materials.buildRing);
    stone.name = `safeBuildSite_ringStone_${i + 1}`;
    stone.position.set(Math.cos(angle) * 0.46, 0.035, Math.sin(angle) * 0.28);
    stone.rotation.y = -angle;
    stones.add(stone);
  }
  group.add(center, stones);
  return { group };
}

function createFishingSlotMarker(materials, shared) {
  const group = new THREE.Group();
  group.name = "pierShoreWorkSite_fishingSlot";
  group.userData.subPropId = "pierFishingSlot";
  group.visible = false;
  const stem = new THREE.Mesh(shared.slotStem, materials.slotDark);
  stem.name = "fishingSlot_stem";
  stem.position.set(0, 0.22, 0);
  const float = new THREE.Mesh(shared.slotFloat, materials.slotBlue);
  float.name = "fishingSlot_float";
  float.position.set(0, 0.46, 0);
  float.scale.set(0.82, 0.52, 0.82);
  const ring = new THREE.Mesh(shared.slotRing, materials.slotBlue);
  ring.name = "fishingSlot_visualRing";
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.06, 0);
  group.add(stem, float, ring);
  return { group, float };
}

function syncPostPool(pierPosts, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_POSTS);
  pierPosts.group.visible = count > 0;
  for (let i = 0; i < pierPosts.posts.length; i += 1) {
    const post = pierPosts.posts[i];
    const visible = i < count;
    post.visible = visible;
    if (!visible) continue;
    const offset = POST_OFFSETS[i];
    positionAtAnchor(post, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.50);
    post.rotation.x = i % 2 === 0 ? 0.025 : -0.018;
    post.scale.set(1, 0.92 + (i % 3) * 0.05, 1);
  }
  return count;
}

function syncPlankPool(planks, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_PLANKS);
  planks.group.visible = count > 0;
  for (let i = 0; i < planks.planks.length; i += 1) {
    const plank = planks.planks[i];
    const visible = i < count;
    plank.visible = visible;
    if (!visible) continue;
    const offset = PLANK_OFFSETS[i];
    positionAtAnchor(plank, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.62);
    plank.scale.set(offset[3], 1, 1);
  }
  return count;
}

function syncLashingPool(lashings, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_LASHINGS);
  lashings.group.visible = count > 0;
  for (let i = 0; i < lashings.lashings.length; i += 1) {
    const lashing = lashings.lashings[i];
    const visible = i < count;
    lashing.visible = visible;
    if (!visible) continue;
    const offset = LASHING_OFFSETS[i];
    positionAtAnchor(lashing, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, i < 8 ? 0.58 : 0.66);
    lashing.rotation.x = Math.PI / 2;
    lashing.scale.setScalar(i < 8 ? 0.90 : 0.76);
  }
  return count;
}

function syncShoreWorkMarker(marker, subProp, anchor, context) {
  const count = clampedCount(subProp, 1);
  marker.group.visible = count > 0;
  if (count > 0) positionAtAnchor(marker.group, anchor, { x: 1.16, z: 0.68, yaw: 0.42 }, context, 0.035);
  return count;
}

function syncSafeBuildSite(safeBuildSite, subProp, safeAnchor, context) {
  const count = clampedCount(subProp, 1);
  safeBuildSite.group.visible = count > 0;
  if (count > 0) {
    positionAtAnchor(safeBuildSite.group, safeAnchor, { x: 0, z: 0, yaw: 0 }, context, 0.03);
  }
  return count;
}

function syncFishingSlot(fishingSlot, subProp, fishingAnchor, context) {
  const count = clampedCount(subProp, 1);
  fishingSlot.group.visible = count > 0;
  if (count > 0) {
    positionAtAnchor(fishingSlot.group, fishingAnchor, { x: 0, z: 0, yaw: 0 }, context, 0.07);
    fishingSlot.float.position.y = 0.46 + Math.sin((context.time || 0) * 1.8) * 0.01;
  }
  return count;
}

function pierAnchor(worldState) {
  const state = worldState && worldState.pierShoreWorkSite ? worldState.pierShoreWorkSite : {};
  return vectorAnchor(state.anchorPosition, DEFAULT_ANCHOR, state.yaw);
}

function safeBuildAnchor(worldState) {
  const state = worldState && worldState.pierShoreWorkSite ? worldState.pierShoreWorkSite : {};
  return vectorAnchor(state.safeBuildAnchorPosition, DEFAULT_SAFE_BUILD_ANCHOR, state.safeBuildYaw);
}

function fishingSlotAnchor(worldState) {
  const state = worldState && worldState.pierShoreWorkSite ? worldState.pierShoreWorkSite : {};
  return vectorAnchor(state.fishingSlotPosition, DEFAULT_FISHING_SLOT, state.fishingSlotYaw);
}

function vectorAnchor(position, fallback, yaw) {
  const value = position && typeof position === "object" ? position : {};
  return {
    x: Number.isFinite(value.x) ? value.x : fallback.x,
    z: Number.isFinite(value.z) ? value.z : fallback.z,
    yaw: Number.isFinite(yaw) ? yaw : fallback.yaw
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

function hiddenPierShoreWorkSiteTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: PIER_SHORE_WORK_SITE_ID,
    visible: false,
    pierShoreWorkSiteVisible: false,
    pierShoreWorkSiteStage: descriptor ? descriptor.stage || "" : "",
    pierShoreWorkSiteVariant: descriptor ? descriptor.variant || "" : "",
    pierShoreWorkSiteActive: Boolean(descriptor && descriptor.active),
    pierShoreWorkSitePostsVisible: false,
    pierShoreWorkSitePlanksVisible: false,
    pierShoreWorkSiteLashingsVisible: false,
    pierShoreWorkSiteShoreWorkMarkerVisible: false,
    pierShoreWorkSiteSafeBuildSiteVisible: false,
    pierShoreWorkSiteFishingSlotVisible: false,
    pierShoreWorkSitePostCount: 0,
    pierShoreWorkSitePlankCount: 0,
    pierShoreWorkSiteLashingCount: 0,
    pierShoreWorkSiteWorkMarkerCount: 0,
    pierShoreWorkSiteSafeBuildSiteCount: 0,
    pierShoreWorkSiteFishingSlotCount: 0,
    pierShoreWorkSitePooledObjectCount: 0,
    pierShoreWorkSiteAssetSourceId: source.id || "",
    pierShoreWorkSiteAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    pierShoreWorkSiteTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    pierShoreWorkSiteTransformNormalized: Boolean(descriptor && descriptor.transform),
    pierShoreWorkSiteWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    pierShoreWorkSiteDuplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    pierShoreWorkSiteSafetyNote: descriptor && descriptor.debug ? descriptor.debug.shoreSafetyNote || "" : "",
    pierShoreWorkSiteFallbackReason: reason || "",
    renderedObjectCount: 0
  };
}
