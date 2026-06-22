import * as THREE from "three";

import { RAFT_BOAT_ROUTE_ID } from "../simulation/worldState.js";

const MAX_LOGS = 6;
const MAX_PLATFORM_PLANKS = 6;
const MAX_LASHINGS = 10;
const MAX_WAKE_MARKERS = 5;
const MAX_ROUTE_MARKERS = 6;
const DEFAULT_SHORE_ANCHOR = Object.freeze({ x: -12.7, y: 0.18, z: 31.7, yaw: -0.45 });
const DEFAULT_WATER_ANCHOR = Object.freeze({ x: -15.1, y: -0.16, z: 33.6, yaw: -0.68 });
const DEFAULT_ROUTE_ANCHOR = Object.freeze({ x: -16.2, y: -0.16, z: 34.8, yaw: -0.74 });
const DEFAULT_LANDING_ANCHOR = Object.freeze({ x: -10.9, y: 0.18, z: 29.7, yaw: -0.18 });

const LOG_OFFSETS = Object.freeze([-0.44, -0.26, -0.08, 0.10, 0.28, 0.46]);
const PLANK_OFFSETS = Object.freeze([-0.48, -0.29, -0.10, 0.09, 0.28, 0.47]);
const LASHING_OFFSETS = Object.freeze([
  [-0.64, -0.45, 0.00],
  [0.64, -0.45, 0.00],
  [-0.64, -0.12, 0.03],
  [0.64, -0.12, -0.03],
  [-0.64, 0.22, -0.02],
  [0.64, 0.22, 0.02],
  [-0.64, 0.50, 0.02],
  [0.64, 0.50, -0.02],
  [-0.12, 0.02, 0.08],
  [0.18, -0.28, -0.08]
]);
const WAKE_OFFSETS = Object.freeze([
  [-0.80, 0.78, -0.30, 1.00],
  [-0.34, 1.04, -0.18, 0.86],
  [0.20, 1.26, 0.02, 0.76],
  [0.66, 1.46, 0.12, 0.66],
  [-1.18, 1.18, -0.42, 0.72]
]);
const ROUTE_OFFSETS = Object.freeze([
  [-0.12, 0.00, -0.06, 1.00],
  [0.36, 0.76, 0.08, 0.88],
  [0.80, 1.58, 0.18, 0.76],
  [1.20, 2.32, 0.24, 0.66],
  [1.62, 3.02, 0.30, 0.58],
  [2.06, 3.72, 0.34, 0.52]
]);

export function createRaftBoatRoutePresentationProp() {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_group";
  group.userData.type = "presentationFamily";
  group.userData.family = RAFT_BOAT_ROUTE_ID;

  const materials = createRaftMaterials();
  const shared = createSharedGeometries();
  const raftFrame = createRaftFrame(materials, shared);
  const tiedPlatform = createTiedPlatform(materials, shared);
  const paddleOar = createPaddleOar(materials, shared);
  const raftOnWater = createRaftOnWaterMarker(materials, shared);
  const wakeMarkers = createWakeMarkerPool(materials, shared);
  const routeMarkers = createRouteMarkerPool(materials, shared);
  const returnLanding = createReturnLandingMarker(materials, shared);

  group.add(
    raftOnWater.group,
    raftFrame.group,
    tiedPlatform.group,
    paddleOar.group,
    wakeMarkers.group,
    routeMarkers.group,
    returnLanding.group
  );
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = false;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    raftFrame,
    tiedPlatform,
    paddleOar,
    raftOnWater,
    wakeMarkers,
    routeMarkers,
    returnLanding
  };
}

export function syncRaftBoatRoutePresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, RAFT_BOAT_ROUTE_ID);
  if (!prop || !prop.group) return hiddenRaftBoatRouteTrace(descriptor, "raft boat route prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenRaftBoatRouteTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const state = context.worldState && context.worldState.raftBoatRoute ? context.worldState.raftBoatRoute : {};
  const waterState = state.waterState || (descriptor && descriptor.debug ? descriptor.debug.waterState : "shore") || "shore";
  const shoreAnchor = raftShoreAnchor(context.worldState);
  const waterAnchor = raftWaterAnchor(context.worldState);
  const routeAnchor = raftRouteAnchor(context.worldState);
  const landingAnchor = raftLandingAnchor(context.worldState);
  const raftAnchor = waterState === "water" || waterState === "route" || waterState === "return"
    ? waterAnchor
    : shoreAnchor;

  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const raftOnWaterCount = syncRaftOnWater(prop.raftOnWater, subProps.raftOnWater, raftAnchor, context, waterState);
  const logCount = syncRaftFrame(prop.raftFrame, subProps.raftFrame, raftAnchor, context, waterState);
  const platformPlankCount = syncTiedPlatform(prop.tiedPlatform, subProps.tiedPlatform, raftAnchor, context, waterState);
  const lashingCount = syncLashings(prop.tiedPlatform, subProps.tiedPlatform);
  const paddleCount = syncPaddleOar(prop.paddleOar, subProps.paddleOar, raftAnchor, context, waterState);
  const wakeMarkerCount = syncWakeMarkers(prop.wakeMarkers, subProps.wakeMarker, raftAnchor, context);
  const routeMarkerCount = syncRouteMarkers(prop.routeMarkers, subProps.routeMarker, routeAnchor, context);
  const landingMarkerCount = syncReturnLanding(prop.returnLanding, subProps.returnLanding, landingAnchor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount =
    logCount + platformPlankCount + lashingCount + paddleCount + raftOnWaterCount + wakeMarkerCount + routeMarkerCount + landingMarkerCount;

  return {
    id: RAFT_BOAT_ROUTE_ID,
    visible: true,
    raftBoatRouteVisible: true,
    raftBoatRouteStage: descriptor ? descriptor.stage || "" : "",
    raftBoatRouteVariant: descriptor ? descriptor.variant || "" : "",
    raftBoatRouteActive: Boolean(descriptor && descriptor.active),
    raftBoatRouteBuildStage: debug.buildStage || "",
    raftBoatRouteWaterState: debug.waterState || waterState,
    raftBoatRouteRouteMarker: Boolean(debug.routeMarker),
    raftBoatRouteFrameVisible: logCount > 0,
    raftBoatRouteTiedPlatformVisible: platformPlankCount > 0,
    raftBoatRoutePaddleVisible: paddleCount > 0,
    raftBoatRouteOnWaterVisible: raftOnWaterCount > 0,
    raftBoatRouteWakeVisible: wakeMarkerCount > 0,
    raftBoatRouteRouteMarkerVisible: routeMarkerCount > 0,
    raftBoatRouteReturnLandingVisible: landingMarkerCount > 0,
    raftBoatRouteLogCount: logCount,
    raftBoatRoutePlatformPlankCount: platformPlankCount,
    raftBoatRouteLashingCount: lashingCount,
    raftBoatRoutePaddleCount: paddleCount,
    raftBoatRouteWakeMarkerCount: wakeMarkerCount,
    raftBoatRouteRouteMarkerCount: routeMarkerCount,
    raftBoatRouteLandingMarkerCount: landingMarkerCount,
    raftBoatRoutePooledObjectCount: pooledObjectCount,
    raftBoatRouteAssetSourceId: source.id || "",
    raftBoatRouteAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    raftBoatRouteTransformId: transform ? transform.id || "" : "",
    raftBoatRouteTransformNormalized: Boolean(transform),
    raftBoatRouteWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    raftBoatRouteDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    raftBoatRouteFutureIntegrationNote: debug.futureIntegrationNote || "",
    raftBoatRouteFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount
  };
}

export function normalizeRaftBoatRouteAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createRaftMaterials() {
  const standard = (color, roughness = 0.86, options = {}) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, emissive: color, emissiveIntensity: 0.08, ...options });
  };
  return {
    logWood: standard(0x9b6b3f, 0.92),
    logEnd: standard(0x765036, 0.94),
    platformWood: standard(0xc18b54, 0.88),
    rope: standard(0xd2b06b, 0.92),
    paddleShaft: standard(0x8c5d38, 0.90),
    paddleBlade: standard(0xd49a5e, 0.86),
    waterBlue: new THREE.MeshBasicMaterial({ color: 0x4fb4ce, transparent: true, opacity: 0.46, depthWrite: false }),
    routeBlue: new THREE.MeshBasicMaterial({ color: 0x60c9df, transparent: true, opacity: 0.66, depthWrite: false }),
    landingBlue: standard(0x62b9c7, 0.82),
    markerFlag: standard(0xf0c35c, 0.78),
    shadow: new THREE.MeshBasicMaterial({ color: 0x332b22, transparent: true, opacity: 0.20, depthWrite: false })
  };
}

function createSharedGeometries() {
  return {
    log: new THREE.CylinderGeometry(0.105, 0.13, 1.62, 7),
    logEnd: new THREE.CylinderGeometry(0.112, 0.116, 0.028, 7),
    plank: new THREE.BoxGeometry(1.34, 0.065, 0.145),
    lashing: new THREE.TorusGeometry(0.12, 0.012, 6, 12),
    paddleShaft: new THREE.CylinderGeometry(0.024, 0.03, 1.18, 7),
    paddleBlade: new THREE.BoxGeometry(0.30, 0.045, 0.42),
    floatShadow: new THREE.CylinderGeometry(0.88, 0.94, 0.018, 16),
    wakeStroke: new THREE.TorusGeometry(0.30, 0.012, 5, 18, Math.PI * 1.12),
    routeBuoy: new THREE.CylinderGeometry(0.09, 0.11, 0.16, 8),
    routeArrow: new THREE.ConeGeometry(0.12, 0.24, 3),
    landingRing: new THREE.CylinderGeometry(0.44, 0.48, 0.02, 14),
    landingStake: new THREE.CylinderGeometry(0.028, 0.04, 0.56, 7),
    flag: new THREE.ConeGeometry(0.14, 0.26, 3)
  };
}

function createRaftFrame(materials, shared) {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_frame";
  group.userData.subPropId = "raftFrame";
  const logs = [];
  for (let i = 0; i < MAX_LOGS; i += 1) {
    const logGroup = new THREE.Group();
    logGroup.name = `raftBoatRoute_log_${i + 1}`;
    logGroup.visible = false;
    const log = new THREE.Mesh(shared.log, materials.logWood);
    log.name = "raftLog_body";
    log.rotation.z = Math.PI / 2;
    const endA = new THREE.Mesh(shared.logEnd, materials.logEnd);
    endA.name = "raftLog_end_a";
    endA.rotation.z = Math.PI / 2;
    endA.position.x = -0.82;
    const endB = endA.clone();
    endB.name = "raftLog_end_b";
    endB.position.x = 0.82;
    logGroup.add(log, endA, endB);
    group.add(logGroup);
    logs.push(logGroup);
  }
  return { group, logs };
}

function createTiedPlatform(materials, shared) {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_tiedPlatform";
  group.userData.subPropId = "tiedPlatform";
  const planks = [];
  for (let i = 0; i < MAX_PLATFORM_PLANKS; i += 1) {
    const plank = new THREE.Mesh(shared.plank, materials.platformWood);
    plank.name = `raftBoatRoute_platformPlank_${i + 1}`;
    plank.visible = false;
    group.add(plank);
    planks.push(plank);
  }
  const lashings = [];
  for (let i = 0; i < MAX_LASHINGS; i += 1) {
    const lashing = new THREE.Mesh(shared.lashing, materials.rope);
    lashing.name = `raftBoatRoute_lashing_${i + 1}`;
    lashing.visible = false;
    group.add(lashing);
    lashings.push(lashing);
  }
  return { group, planks, lashings };
}

function createPaddleOar(materials, shared) {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_paddleOar";
  group.userData.subPropId = "paddleOar";
  group.visible = false;
  const shaft = new THREE.Mesh(shared.paddleShaft, materials.paddleShaft);
  shaft.name = "paddleOar_shaft";
  shaft.rotation.z = Math.PI / 2;
  const blade = new THREE.Mesh(shared.paddleBlade, materials.paddleBlade);
  blade.name = "paddleOar_blade";
  blade.position.x = 0.68;
  blade.scale.set(0.92, 1, 0.72);
  const grip = new THREE.Mesh(shared.logEnd, materials.logEnd);
  grip.name = "paddleOar_grip";
  grip.rotation.z = Math.PI / 2;
  grip.position.x = -0.64;
  group.add(shaft, blade, grip);
  return { group };
}

function createRaftOnWaterMarker(materials, shared) {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_onWater";
  group.userData.subPropId = "raftOnWater";
  group.visible = false;
  const shadow = new THREE.Mesh(shared.floatShadow, materials.waterBlue);
  shadow.name = "raftOnWater_waterGlow";
  shadow.scale.set(1.62, 1, 0.88);
  shadow.position.y = 0.01;
  group.add(shadow);
  return { group };
}

function createWakeMarkerPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_wakeMarkers";
  group.userData.subPropId = "wakeMarker";
  const markers = [];
  for (let i = 0; i < MAX_WAKE_MARKERS; i += 1) {
    const marker = new THREE.Mesh(shared.wakeStroke, materials.waterBlue);
    marker.name = `raftBoatRoute_wake_${i + 1}`;
    marker.visible = false;
    marker.rotation.x = Math.PI / 2;
    group.add(marker);
    markers.push(marker);
  }
  return { group, markers };
}

function createRouteMarkerPool(materials, shared) {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_routeMarkers";
  group.userData.subPropId = "routeMarker";
  const markers = [];
  for (let i = 0; i < MAX_ROUTE_MARKERS; i += 1) {
    const marker = new THREE.Group();
    marker.name = `raftBoatRoute_routeMarker_${i + 1}`;
    marker.visible = false;
    const buoy = new THREE.Mesh(shared.routeBuoy, materials.routeBlue);
    buoy.name = "routeMarker_buoy";
    buoy.position.y = 0.08;
    const arrow = new THREE.Mesh(shared.routeArrow, materials.routeBlue);
    arrow.name = "routeMarker_arrow";
    arrow.rotation.x = Math.PI / 2;
    arrow.position.set(0, 0.16, -0.20);
    marker.add(buoy, arrow);
    group.add(marker);
    markers.push(marker);
  }
  return { group, markers };
}

function createReturnLandingMarker(materials, shared) {
  const group = new THREE.Group();
  group.name = "raftBoatRoute_returnLanding";
  group.userData.subPropId = "returnLanding";
  group.visible = false;
  const ring = new THREE.Mesh(shared.landingRing, materials.landingBlue);
  ring.name = "returnLanding_ring";
  ring.scale.set(1.28, 1, 0.72);
  const stake = new THREE.Mesh(shared.landingStake, materials.paddleShaft);
  stake.name = "returnLanding_stake";
  stake.position.set(0.30, 0.29, -0.08);
  const flag = new THREE.Mesh(shared.flag, materials.markerFlag);
  flag.name = "returnLanding_flag";
  flag.position.set(0.42, 0.48, -0.08);
  flag.rotation.set(0, 0, -Math.PI / 2);
  group.add(ring, stake, flag);
  return { group };
}

function syncRaftFrame(raftFrame, subProp, anchor, context, waterState) {
  const count = clampedCount(subProp, MAX_LOGS);
  raftFrame.group.visible = count > 0;
  positionAtAnchor(raftFrame.group, anchor, { x: 0, z: 0, yaw: 0 }, context, waterLift(waterState, 0.11), isWater(waterState));
  for (let i = 0; i < raftFrame.logs.length; i += 1) {
    const log = raftFrame.logs[i];
    const visible = i < count;
    log.visible = visible;
    if (!visible) continue;
    log.position.set(0, 0, LOG_OFFSETS[i]);
    log.rotation.set((i % 2 === 0 ? 0.012 : -0.018), 0, (i - 2) * 0.006);
    log.scale.set(1, 0.92 + (i % 3) * 0.04, 1);
  }
  return count;
}

function syncTiedPlatform(tiedPlatform, subProp, anchor, context, waterState) {
  const count = clampedCount(subProp, MAX_PLATFORM_PLANKS);
  tiedPlatform.group.visible = count > 0 || clampedLashingCount(subProp) > 0;
  positionAtAnchor(tiedPlatform.group, anchor, { x: 0, z: 0, yaw: 0 }, context, waterLift(waterState, 0.21), isWater(waterState));
  for (let i = 0; i < tiedPlatform.planks.length; i += 1) {
    const plank = tiedPlatform.planks[i];
    const visible = i < count;
    plank.visible = visible;
    if (!visible) continue;
    plank.position.set(0, 0.02, PLANK_OFFSETS[i]);
    plank.rotation.set(0.016 * (i % 2 === 0 ? 1 : -1), 0.02 * (i - 2), 0);
    plank.scale.set(0.86 + i * 0.025, 1, 1);
  }
  return count;
}

function syncLashings(tiedPlatform, subProp) {
  const count = clampedLashingCount(subProp);
  for (let i = 0; i < tiedPlatform.lashings.length; i += 1) {
    const lashing = tiedPlatform.lashings[i];
    const visible = i < count;
    lashing.visible = visible;
    if (!visible) continue;
    const offset = LASHING_OFFSETS[i];
    lashing.position.set(offset[0], 0.04, offset[1]);
    lashing.rotation.set(Math.PI / 2, 0, offset[2]);
    lashing.scale.setScalar(i < 8 ? 0.82 : 0.68);
  }
  return count;
}

function syncPaddleOar(paddleOar, subProp, anchor, context, waterState) {
  const count = clampedCount(subProp, 1);
  paddleOar.group.visible = count > 0;
  if (count > 0) {
    positionAtAnchor(
      paddleOar.group,
      anchor,
      { x: 0.88, z: -0.62, yaw: -0.34 },
      context,
      waterLift(waterState, 0.28),
      isWater(waterState)
    );
    paddleOar.group.rotation.z = -0.08;
  }
  return count;
}

function syncRaftOnWater(raftOnWater, subProp, anchor, context, waterState) {
  const count = clampedCount(subProp, 1);
  raftOnWater.group.visible = count > 0;
  if (count > 0) {
    positionAtAnchor(raftOnWater.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.005, true);
    raftOnWater.group.position.y += Math.sin((context.time || 0) * 1.2) * 0.006;
  }
  return count;
}

function syncWakeMarkers(wakeMarkers, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_WAKE_MARKERS);
  wakeMarkers.group.visible = count > 0;
  for (let i = 0; i < wakeMarkers.markers.length; i += 1) {
    const marker = wakeMarkers.markers[i];
    const visible = i < count;
    marker.visible = visible;
    if (!visible) continue;
    const offset = WAKE_OFFSETS[i];
    positionAtAnchor(marker, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.014, true);
    marker.scale.set(offset[3] * 1.08, offset[3] * 0.58, offset[3] * 0.70);
    marker.position.y += Math.sin((context.time || 0) * 1.4 + i) * 0.004;
  }
  return count;
}

function syncRouteMarkers(routeMarkers, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_ROUTE_MARKERS);
  routeMarkers.group.visible = count > 0;
  for (let i = 0; i < routeMarkers.markers.length; i += 1) {
    const marker = routeMarkers.markers[i];
    const visible = i < count;
    marker.visible = visible;
    if (!visible) continue;
    const offset = ROUTE_OFFSETS[i];
    positionAtAnchor(marker, anchor, { x: offset[0], z: offset[1], yaw: offset[2] }, context, 0.02, true);
    marker.scale.setScalar(offset[3]);
    marker.position.y += Math.sin((context.time || 0) * 1.1 + i) * 0.006;
  }
  return count;
}

function syncReturnLanding(returnLanding, subProp, anchor, context) {
  const count = clampedCount(subProp, 1);
  returnLanding.group.visible = count > 0;
  if (count > 0) {
    positionAtAnchor(returnLanding.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.034, false);
  }
  return count;
}

function raftShoreAnchor(worldState) {
  const state = worldState && worldState.raftBoatRoute ? worldState.raftBoatRoute : {};
  return vectorAnchor(state.anchorPosition, DEFAULT_SHORE_ANCHOR, state.yaw);
}

function raftWaterAnchor(worldState) {
  const state = worldState && worldState.raftBoatRoute ? worldState.raftBoatRoute : {};
  return vectorAnchor(state.waterAnchorPosition, DEFAULT_WATER_ANCHOR, state.waterYaw);
}

function raftRouteAnchor(worldState) {
  const state = worldState && worldState.raftBoatRoute ? worldState.raftBoatRoute : {};
  return vectorAnchor(state.routeMarkerAnchorPosition, DEFAULT_ROUTE_ANCHOR, state.routeYaw);
}

function raftLandingAnchor(worldState) {
  const state = worldState && worldState.raftBoatRoute ? worldState.raftBoatRoute : {};
  return vectorAnchor(state.landingAnchor || state.landingAnchorPosition, DEFAULT_LANDING_ANCHOR, state.landingYaw);
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

function positionAtAnchor(object, anchor, offset, context, lift = 0, water = false) {
  const yaw = Number(anchor.yaw || 0);
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const x = anchor.x + offset.x * cos - offset.z * sin;
  const z = anchor.z + offset.x * sin + offset.z * cos;
  const ground = water
    ? Number.isFinite(anchor.y) ? anchor.y : DEFAULT_WATER_ANCHOR.y
    : typeof context.groundHeightAt === "function" ? context.groundHeightAt(x, z) : 0;
  object.position.set(x, ground + lift, z);
  object.rotation.set(0, yaw + Number(offset.yaw || 0), 0);
}

function isWater(waterState) {
  return waterState === "water" || waterState === "route" || waterState === "return";
}

function waterLift(waterState, shoreLift) {
  return isWater(waterState) ? 0.045 : shoreLift;
}

function clampedCount(subProp, max) {
  if (!subProp || !subProp.visible) return 0;
  return Math.max(0, Math.min(max, Math.floor(Number(subProp.count || 0))));
}

function clampedLashingCount(subProp) {
  if (!subProp || !subProp.visible) return 0;
  return Math.max(0, Math.min(MAX_LASHINGS, Math.floor(Number(subProp.lashingCount || 0))));
}

function descriptorByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function hiddenRaftBoatRouteTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  return {
    id: RAFT_BOAT_ROUTE_ID,
    visible: false,
    raftBoatRouteVisible: false,
    raftBoatRouteStage: descriptor ? descriptor.stage || "" : "",
    raftBoatRouteVariant: descriptor ? descriptor.variant || "" : "",
    raftBoatRouteActive: Boolean(descriptor && descriptor.active),
    raftBoatRouteBuildStage: debug.buildStage || "",
    raftBoatRouteWaterState: debug.waterState || "",
    raftBoatRouteRouteMarker: Boolean(debug.routeMarker),
    raftBoatRouteFrameVisible: false,
    raftBoatRouteTiedPlatformVisible: false,
    raftBoatRoutePaddleVisible: false,
    raftBoatRouteOnWaterVisible: false,
    raftBoatRouteWakeVisible: false,
    raftBoatRouteRouteMarkerVisible: false,
    raftBoatRouteReturnLandingVisible: false,
    raftBoatRouteLogCount: 0,
    raftBoatRoutePlatformPlankCount: 0,
    raftBoatRouteLashingCount: 0,
    raftBoatRoutePaddleCount: 0,
    raftBoatRouteWakeMarkerCount: 0,
    raftBoatRouteRouteMarkerCount: 0,
    raftBoatRouteLandingMarkerCount: 0,
    raftBoatRoutePooledObjectCount: 0,
    raftBoatRouteAssetSourceId: source.id || "",
    raftBoatRouteAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    raftBoatRouteTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    raftBoatRouteTransformNormalized: Boolean(descriptor && descriptor.transform),
    raftBoatRouteWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    raftBoatRouteDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    raftBoatRouteFutureIntegrationNote: debug.futureIntegrationNote || "",
    raftBoatRouteFallbackReason: reason || "",
    renderedObjectCount: 0
  };
}
