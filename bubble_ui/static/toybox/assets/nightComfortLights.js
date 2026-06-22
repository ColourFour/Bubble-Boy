import * as THREE from "three";

import { NIGHT_COMFORT_LIGHTS_ID } from "../simulation/worldState.js";

const DEFAULT_ANCHOR = Object.freeze({ x: -2.80, y: 0.18, z: -1.74, yaw: 0.22 });
const DEFAULT_PATH_ANCHOR = Object.freeze({ x: -3.56, y: 0.18, z: -1.98, yaw: 0.18 });
const DEFAULT_SHELL_ANCHOR = Object.freeze({ x: -2.02, y: 0.18, z: -1.28, yaw: -0.12 });
const DEFAULT_FIREFLY_ANCHOR = Object.freeze({ x: -2.38, y: 0.18, z: -2.44, yaw: 0.06 });
const DEFAULT_SIT_ANCHOR = Object.freeze({ x: -1.18, y: 0.18, z: -0.64, yaw: 0.28 });
const MAX_LANTERNS = 4;
const MAX_PATH_ANCHORS = 6;
const MAX_SHELLS = 8;
const MAX_FIREFLIES = 12;
const MAX_SIT_ANCHORS = 2;

const LANTERN_LAYOUT = Object.freeze([
  [-0.72, -0.28, 0.04, 0.94],
  [0.62, 0.22, -0.18, 0.86],
  [-1.10, 0.60, 0.16, 0.78],
  [1.04, -0.54, -0.08, 0.74]
]);

const PATH_LAYOUT = Object.freeze([
  [-1.20, -0.18, 0.12, 0.86],
  [-0.72, 0.08, -0.08, 0.80],
  [-0.24, -0.10, 0.18, 0.74],
  [0.24, 0.12, -0.12, 0.70],
  [0.72, -0.04, 0.10, 0.66],
  [1.18, 0.18, -0.18, 0.62]
]);

const SHELL_LAYOUT = Object.freeze([
  [-0.56, -0.18, 0.08, 0.88],
  [-0.28, 0.10, -0.12, 0.78],
  [0.00, -0.26, 0.20, 0.76],
  [0.26, 0.08, -0.18, 0.70],
  [0.52, -0.08, 0.12, 0.66],
  [-0.12, 0.36, -0.22, 0.62],
  [0.72, 0.24, 0.16, 0.58],
  [-0.72, 0.20, -0.06, 0.56]
]);

const FIREFLY_LAYOUT = Object.freeze([
  [-0.60, 0.42, -0.18, 0.72],
  [-0.32, 0.70, 0.16, 0.82],
  [0.02, 0.52, -0.04, 0.64],
  [0.34, 0.82, 0.20, 0.76],
  [0.62, 0.58, -0.16, 0.70],
  [-0.12, 1.02, 0.10, 0.58],
  [-0.78, 0.86, 0.24, 0.62],
  [0.82, 0.96, -0.22, 0.54],
  [0.18, 1.18, 0.02, 0.50],
  [-0.46, 1.12, -0.28, 0.46],
  [0.52, 1.30, 0.26, 0.44],
  [-0.02, 1.40, -0.12, 0.42]
]);

const SIT_LAYOUT = Object.freeze([
  [-0.22, 0.00, 0.06, 0.96],
  [0.34, 0.22, -0.16, 0.74]
]);

export function createNightComfortLightsPresentationProp() {
  const group = new THREE.Group();
  group.name = "nightComfortLights_group";
  group.userData.type = "presentationFamily";
  group.userData.family = NIGHT_COMFORT_LIGHTS_ID;

  const materials = createNightComfortMaterials();
  const shared = createSharedGeometries();
  const lanternPosts = createLanternPosts(materials, shared);
  const litPathAnchors = createLitPathAnchors(materials, shared);
  const glowingShells = createGlowingShells(materials, shared);
  const fireflies = createFireflies(materials, shared);
  const sitAnchors = createSitAnchors(materials, shared);

  group.add(litPathAnchors.group, glowingShells.group, sitAnchors.group, lanternPosts.group, fireflies.group);
  group.traverse((object) => {
    if (!object.isMesh && !object.isSprite) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    lanternPosts,
    litPathAnchors,
    glowingShells,
    fireflies,
    sitAnchors
  };
}

export function syncNightComfortLightsPresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, NIGHT_COMFORT_LIGHTS_ID);
  if (!prop || !prop.group) return hiddenNightComfortLightsTrace(descriptor, "night comfort lights prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenNightComfortLightsTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = nightAnchor(context.worldState);
  const pathAnchor = nightPathAnchor(context.worldState);
  const shellAnchor = nightShellAnchor(context.worldState);
  const fireflyAnchor = nightFireflyAnchor(context.worldState);
  const sitAnchor = nightSitAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const lanternPostCount = syncLanternPosts(prop.lanternPosts, subProps.lanternPosts, anchor, context);
  const litPathAnchorCount = syncLitPathAnchors(prop.litPathAnchors, subProps.litPathAnchors, pathAnchor, context);
  const glowingShellCount = syncGlowingShells(prop.glowingShells, subProps.glowingShells, shellAnchor, context);
  const fireflyCount = syncFireflies(prop.fireflies, subProps.fireflies, fireflyAnchor, context);
  const sitAnchorCount = syncSitAnchors(prop.sitAnchors, subProps.sitAnchor, sitAnchor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount =
    lanternPostCount + litPathAnchorCount + glowingShellCount + fireflyCount + sitAnchorCount;

  return {
    id: NIGHT_COMFORT_LIGHTS_ID,
    visible: true,
    nightComfortLightsVisible: true,
    nightComfortLightsStage: descriptor ? descriptor.stage || "" : "",
    nightComfortLightsVariant: descriptor ? descriptor.variant || "" : "",
    nightComfortLightsActive: Boolean(descriptor && descriptor.active),
    nightComfortLightsLanternPostsVisible: lanternPostCount > 0,
    nightComfortLightsLitPathAnchorsVisible: litPathAnchorCount > 0,
    nightComfortLightsGlowingShellsVisible: glowingShellCount > 0,
    nightComfortLightsFirefliesVisible: fireflyCount > 0,
    nightComfortLightsSitAnchorVisible: sitAnchorCount > 0,
    nightComfortLightsLanternPostCount: lanternPostCount,
    nightComfortLightsLitPathAnchorCount: litPathAnchorCount,
    nightComfortLightsGlowingShellCount: glowingShellCount,
    nightComfortLightsFireflyCount: fireflyCount,
    nightComfortLightsSitAnchorCount: sitAnchorCount,
    nightComfortLightsDynamicLightCount: 0,
    nightComfortLightsUsesDynamicLights: false,
    nightComfortLightsMaxFireflySprites: MAX_FIREFLIES,
    nightComfortLightsAssetSourceId: source.id || "",
    nightComfortLightsAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    nightComfortLightsTransformId: transform ? transform.id || "" : "",
    nightComfortLightsTransformNormalized: Boolean(transform),
    nightComfortLightsWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    nightComfortLightsDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    nightComfortLightsLightPerformanceNote: debug.lightPerformanceNote || "",
    nightComfortLightsPlaceholderNote: debug.placeholderNote || "",
    nightComfortLightsFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount,
    pooledObjectCount
  };
}

export function normalizeNightComfortLightsAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createNightComfortMaterials() {
  const standard = (color, roughness = 0.82, options = {}) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0,
      ...options
    });
  return {
    wood: standard(0x72573d, 0.90),
    darkWood: standard(0x3c2f26, 0.94),
    cord: standard(0xc4a66d, 0.88),
    lanternGlass: standard(0xf1c96a, 0.58, { emissive: 0xf1a94b, emissiveIntensity: 0.46 }),
    lanternUnlit: standard(0x6e6956, 0.82, { emissive: 0x2d2419, emissiveIntensity: 0.04 }),
    glow: new THREE.MeshBasicMaterial({ color: 0xf6d472, transparent: true, opacity: 0.52, depthWrite: false }),
    pathStone: standard(0x8d8c7e, 0.90),
    pathGlow: standard(0xe8d277, 0.76, { emissive: 0xdab55e, emissiveIntensity: 0.38 }),
    shell: standard(0xe3d3aa, 0.80, { emissive: 0x89d0bd, emissiveIntensity: 0.32 }),
    shellBlue: standard(0xa5d9cf, 0.74, { emissive: 0x70c6bd, emissiveIntensity: 0.48 }),
    firefly: new THREE.SpriteMaterial({ color: 0xffe07a, transparent: true, opacity: 0.74, depthWrite: false }),
    sitRing: new THREE.MeshBasicMaterial({ color: 0xd9bc6b, transparent: true, opacity: 0.30, depthWrite: false }),
    shadow: new THREE.MeshBasicMaterial({ color: 0x241f1a, transparent: true, opacity: 0.20, depthWrite: false })
  };
}

function createSharedGeometries() {
  return {
    post: new THREE.CylinderGeometry(0.030, 0.040, 0.92, 7),
    crossbar: new THREE.CylinderGeometry(0.018, 0.022, 0.48, 7),
    lantern: new THREE.BoxGeometry(0.18, 0.22, 0.16),
    cap: new THREE.CylinderGeometry(0.11, 0.13, 0.040, 8),
    glowOrb: new THREE.SphereGeometry(0.17, 8, 6),
    pathStone: new THREE.IcosahedronGeometry(0.09, 0),
    shell: new THREE.SphereGeometry(0.11, 8, 5),
    sitShell: new THREE.SphereGeometry(0.14, 8, 5),
    pebble: new THREE.IcosahedronGeometry(0.065, 0)
  };
}

function createLanternPosts(materials, shared) {
  const group = new THREE.Group();
  group.name = "nightComfortLights_lanternPosts";
  group.userData.subPropId = "lanternPosts";
  const posts = [];
  for (let i = 0; i < MAX_LANTERNS; i += 1) {
    const post = new THREE.Group();
    post.name = `nightComfortLights_lanternPost_${i + 1}`;
    post.visible = false;
    const pole = new THREE.Mesh(shared.post, materials.wood);
    pole.name = "lanternPost_pole";
    pole.position.set(0, 0.46, 0);
    const crossbar = new THREE.Mesh(shared.crossbar, materials.darkWood);
    crossbar.name = "lanternPost_crossbar";
    crossbar.position.set(0.12, 0.92, 0);
    crossbar.rotation.z = Math.PI / 2;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.007, 0.18, 5), materials.cord);
    cord.name = "lanternPost_cord";
    cord.position.set(0.30, 0.80, 0);
    const lantern = new THREE.Mesh(shared.lantern, materials.lanternGlass);
    lantern.name = "lanternPost_lantern";
    lantern.position.set(0.30, 0.68, 0);
    const capTop = new THREE.Mesh(shared.cap, materials.darkWood);
    capTop.name = "lanternPost_capTop";
    capTop.position.set(0.30, 0.82, 0);
    const capBottom = capTop.clone();
    capBottom.name = "lanternPost_capBottom";
    capBottom.position.y = 0.54;
    const glow = new THREE.Mesh(shared.glowOrb, materials.glow);
    glow.name = "lanternPost_emissiveHalo";
    glow.position.set(0.30, 0.68, 0);
    glow.scale.set(1.10, 0.92, 1.10);
    post.add(pole, crossbar, cord, lantern, capTop, capBottom, glow);
    group.add(post);
    posts.push({ group: post, lantern, glow });
  }
  group.visible = false;
  return { group, posts };
}

function createLitPathAnchors(materials, shared) {
  const group = new THREE.Group();
  group.name = "nightComfortLights_litPathAnchors";
  group.userData.subPropId = "litPathAnchors";
  const anchors = [];
  for (let i = 0; i < MAX_PATH_ANCHORS; i += 1) {
    const anchor = new THREE.Group();
    anchor.name = `nightComfortLights_litPathAnchor_${i + 1}`;
    anchor.visible = false;
    const stone = new THREE.Mesh(shared.pathStone, materials.pathStone);
    stone.name = "litPathAnchor_stone";
    stone.scale.set(1.08, 0.40, 0.86);
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.012, 10), materials.pathGlow);
    glow.name = "litPathAnchor_emissiveTop";
    glow.position.set(0, 0.050, 0);
    anchor.add(stone, glow);
    group.add(anchor);
    anchors.push({ group: anchor, glow });
  }
  group.visible = false;
  return { group, anchors };
}

function createGlowingShells(materials, shared) {
  const group = new THREE.Group();
  group.name = "nightComfortLights_glowingShells";
  group.userData.subPropId = "glowingShells";
  const shells = [];
  for (let i = 0; i < MAX_SHELLS; i += 1) {
    const shell = new THREE.Mesh(shared.shell, i % 2 === 0 ? materials.shell : materials.shellBlue);
    shell.name = `nightComfortLights_glowingShell_${i + 1}`;
    shell.visible = false;
    shell.scale.set(1.10, 0.34, 0.72);
    group.add(shell);
    shells.push(shell);
  }
  group.visible = false;
  return { group, shells };
}

function createFireflies(materials) {
  const group = new THREE.Group();
  group.name = "nightComfortLights_fireflies";
  group.userData.subPropId = "fireflies";
  const sprites = [];
  for (let i = 0; i < MAX_FIREFLIES; i += 1) {
    const sprite = new THREE.Sprite(materials.firefly.clone());
    sprite.name = `nightComfortLights_firefly_${i + 1}`;
    sprite.visible = false;
    group.add(sprite);
    sprites.push(sprite);
  }
  group.visible = false;
  return { group, sprites };
}

function createSitAnchors(materials, shared) {
  const group = new THREE.Group();
  group.name = "nightComfortLights_sitAnchors";
  group.userData.subPropId = "sitAnchor";
  const anchors = [];
  for (let i = 0; i < MAX_SIT_ANCHORS; i += 1) {
    const anchor = new THREE.Group();
    anchor.name = `nightComfortLights_sitAnchor_${i + 1}`;
    anchor.visible = false;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.010, 5, 32), materials.sitRing);
    ring.name = "sitAnchor_ring";
    ring.rotation.x = Math.PI / 2;
    const shell = new THREE.Mesh(shared.sitShell, materials.shellBlue);
    shell.name = "sitAnchor_glowingShell";
    shell.position.set(0.02, 0.060, 0);
    shell.scale.set(1.02, 0.32, 0.72);
    const pebble = new THREE.Mesh(shared.pebble, materials.pathStone);
    pebble.name = "sitAnchor_pebble";
    pebble.position.set(-0.28, 0.040, 0.16);
    anchor.add(ring, shell, pebble);
    group.add(anchor);
    anchors.push(anchor);
  }
  group.visible = false;
  return { group, anchors };
}

function syncLanternPosts(lanternPosts, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_LANTERNS);
  const lit = Boolean(subProp && subProp.lit);
  lanternPosts.group.visible = count > 0;
  for (let i = 0; i < lanternPosts.posts.length; i += 1) {
    const post = lanternPosts.posts[i];
    const visible = i < count;
    post.group.visible = visible;
    if (!visible) continue;
    const offset = LANTERN_LAYOUT[i];
    positionAtAnchor(post.group, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.040);
    post.group.scale.setScalar(offset[3]);
    post.lantern.material = lit ? contextMaterials(post.lantern).lit : contextMaterials(post.lantern).unlit;
    post.glow.visible = lit;
  }
  return count;
}

function syncLitPathAnchors(litPathAnchors, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_PATH_ANCHORS);
  const lit = Boolean(subProp && subProp.lit);
  litPathAnchors.group.visible = count > 0;
  for (let i = 0; i < litPathAnchors.anchors.length; i += 1) {
    const marker = litPathAnchors.anchors[i];
    const visible = i < count;
    marker.group.visible = visible;
    if (!visible) continue;
    const offset = PATH_LAYOUT[i];
    positionAtAnchor(marker.group, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.032);
    marker.group.scale.setScalar(offset[3]);
    marker.glow.visible = lit;
  }
  return count;
}

function syncGlowingShells(glowingShells, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_SHELLS);
  glowingShells.group.visible = count > 0;
  for (let i = 0; i < glowingShells.shells.length; i += 1) {
    const shell = glowingShells.shells[i];
    const visible = i < count;
    shell.visible = visible;
    if (!visible) continue;
    const offset = SHELL_LAYOUT[i];
    positionAtAnchor(shell, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.042);
    shell.scale.set(offset[3] * 1.10, offset[3] * 0.34, offset[3] * 0.72);
  }
  return count;
}

function syncFireflies(fireflies, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_FIREFLIES);
  fireflies.group.visible = count > 0;
  for (let i = 0; i < fireflies.sprites.length; i += 1) {
    const sprite = fireflies.sprites[i];
    const visible = i < count;
    sprite.visible = visible;
    if (!visible) continue;
    const offset = FIREFLY_LAYOUT[i];
    positionAtAnchor(sprite, anchor, { x: offset[0], z: offset[2], yaw: 0 }, context, offset[1]);
    const size = 0.08 * offset[3];
    sprite.scale.set(size, size, 1);
  }
  return count;
}

function syncSitAnchors(sitAnchors, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_SIT_ANCHORS);
  sitAnchors.group.visible = count > 0;
  for (let i = 0; i < sitAnchors.anchors.length; i += 1) {
    const marker = sitAnchors.anchors[i];
    const visible = i < count;
    marker.visible = visible;
    if (!visible) continue;
    const offset = SIT_LAYOUT[i];
    positionAtAnchor(marker, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.034);
    marker.scale.setScalar(offset[3]);
  }
  return count;
}

function contextMaterials(mesh) {
  if (!mesh.userData.materials) {
    mesh.userData.materials = {
      lit: mesh.material,
      unlit: new THREE.MeshStandardMaterial({
        color: 0x6e6956,
        roughness: 0.82,
        metalness: 0,
        emissive: 0x2d2419,
        emissiveIntensity: 0.04
      })
    };
  }
  return mesh.userData.materials;
}

function nightAnchor(worldState) {
  const state = worldState && worldState.nightComfortLights ? worldState.nightComfortLights : {};
  return normalizedAnchor(state.anchorPosition, DEFAULT_ANCHOR, state.yaw);
}

function nightPathAnchor(worldState) {
  const state = worldState && worldState.nightComfortLights ? worldState.nightComfortLights : {};
  return normalizedAnchor(state.pathAnchorPosition, DEFAULT_PATH_ANCHOR, state.pathYaw);
}

function nightShellAnchor(worldState) {
  const state = worldState && worldState.nightComfortLights ? worldState.nightComfortLights : {};
  return normalizedAnchor(state.shellAnchorPosition, DEFAULT_SHELL_ANCHOR, state.shellYaw);
}

function nightFireflyAnchor(worldState) {
  const state = worldState && worldState.nightComfortLights ? worldState.nightComfortLights : {};
  return normalizedAnchor(state.fireflyAnchorPosition, DEFAULT_FIREFLY_ANCHOR, state.fireflyYaw);
}

function nightSitAnchor(worldState) {
  const state = worldState && worldState.nightComfortLights ? worldState.nightComfortLights : {};
  return normalizedAnchor(state.sitAnchorPosition, DEFAULT_SIT_ANCHOR, state.sitYaw);
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

function hiddenNightComfortLightsTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: NIGHT_COMFORT_LIGHTS_ID,
    visible: false,
    nightComfortLightsVisible: false,
    nightComfortLightsStage: descriptor ? descriptor.stage || "" : "",
    nightComfortLightsVariant: descriptor ? descriptor.variant || "" : "",
    nightComfortLightsActive: Boolean(descriptor && descriptor.active),
    nightComfortLightsLanternPostsVisible: false,
    nightComfortLightsLitPathAnchorsVisible: false,
    nightComfortLightsGlowingShellsVisible: false,
    nightComfortLightsFirefliesVisible: false,
    nightComfortLightsSitAnchorVisible: false,
    nightComfortLightsLanternPostCount: 0,
    nightComfortLightsLitPathAnchorCount: 0,
    nightComfortLightsGlowingShellCount: 0,
    nightComfortLightsFireflyCount: 0,
    nightComfortLightsSitAnchorCount: 0,
    nightComfortLightsDynamicLightCount: 0,
    nightComfortLightsUsesDynamicLights: false,
    nightComfortLightsMaxFireflySprites: MAX_FIREFLIES,
    nightComfortLightsAssetSourceId: source.id || "",
    nightComfortLightsAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    nightComfortLightsTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    nightComfortLightsTransformNormalized: Boolean(descriptor && descriptor.transform),
    nightComfortLightsWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    nightComfortLightsDuplicateSystemClassification:
      descriptor && descriptor.debug ? descriptor.debug.duplicateSystemClassification || "" : "",
    nightComfortLightsLightPerformanceNote:
      descriptor && descriptor.debug ? descriptor.debug.lightPerformanceNote || "" : "",
    nightComfortLightsPlaceholderNote: descriptor && descriptor.debug ? descriptor.debug.placeholderNote || "" : "",
    nightComfortLightsFallbackReason: reason || "",
    renderedObjectCount: 0,
    pooledObjectCount: 0
  };
}
