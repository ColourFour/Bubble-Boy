import * as THREE from "three";

import { LOOKOUT_MAP_HORIZON_ID } from "../simulation/worldState.js";

const DEFAULT_ANCHOR = Object.freeze({ x: 5.80, y: 0.22, z: 6.40, yaw: -0.36 });
const DEFAULT_MAP_BOARD_ANCHOR = Object.freeze({ x: 5.22, y: 0.22, z: 5.50, yaw: 0.18 });
const DEFAULT_HORIZON_ANCHOR = Object.freeze({ x: 7.40, y: 0.22, z: 8.20, yaw: -0.48 });
const DEFAULT_KEEPSAKE_ANCHOR = Object.freeze({ x: 6.28, y: 0.22, z: 5.62, yaw: -0.18 });
const DEFAULT_GATHERING_ANCHOR = Object.freeze({ x: 5.82, y: 0.22, z: 6.98, yaw: -0.10 });
const MAX_STEPS = 5;
const MAX_SKETCH_MAPS = 3;
const MAX_HORIZON_MARKERS = 4;
const MAX_KEEPSAKES = 4;
const MAX_GATHERING_DETAILS = 6;

const STEP_LAYOUT = Object.freeze([
  [-0.88, -0.64, 0.00],
  [-0.62, -0.38, 0.02],
  [-0.36, -0.12, -0.02],
  [-0.10, 0.14, 0.01],
  [0.16, 0.40, -0.01]
]);

const SKETCH_LAYOUT = Object.freeze([
  [-0.22, 0.00, 0.04, -0.08],
  [0.16, 0.02, -0.06, 0.10],
  [-0.02, 0.03, 0.16, 0.02]
]);

const HORIZON_LAYOUT = Object.freeze([
  [-0.88, -0.12, -0.04, 0.78],
  [-0.34, 0.06, 0.08, 0.90],
  [0.34, -0.06, -0.08, 0.82],
  [0.90, 0.10, 0.04, 0.72]
]);

const KEEPSAKE_LAYOUT = Object.freeze([
  [-0.28, 0.00, 0.00, 0.92],
  [-0.08, 0.04, -0.02, 0.78],
  [0.12, -0.03, 0.02, 0.72],
  [0.32, 0.02, -0.01, 0.66]
]);

const GATHERING_LAYOUT = Object.freeze([
  [-0.54, -0.34, 0.00, 0.80],
  [0.54, -0.30, 0.00, 0.80],
  [-0.36, 0.42, 0.12, 0.72],
  [0.38, 0.44, -0.10, 0.72],
  [0.00, 0.00, 0.04, 0.92],
  [0.00, -0.74, -0.02, 0.70]
]);

export function createLookoutMapHorizonPresentationProp() {
  const group = new THREE.Group();
  group.name = "lookoutMapHorizon_group";
  group.userData.type = "presentationFamily";
  group.userData.family = LOOKOUT_MAP_HORIZON_ID;

  const materials = createLookoutMaterials();
  const platform = createLookoutPlatform(materials);
  const mapBoard = createMapBoard(materials);
  const horizonMarkers = createHorizonMarkers(materials);
  const keepsakeDisplay = createKeepsakeDisplay(materials);
  const day100Gathering = createDay100Gathering(materials);

  group.add(platform.group, mapBoard.group, horizonMarkers.group, keepsakeDisplay.group, day100Gathering.group);
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    platform,
    mapBoard,
    horizonMarkers,
    keepsakeDisplay,
    day100Gathering
  };
}

export function syncLookoutMapHorizonPresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, LOOKOUT_MAP_HORIZON_ID);
  if (!prop || !prop.group) return hiddenLookoutMapHorizonTrace(descriptor, "lookout map horizon prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenLookoutMapHorizonTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = lookoutAnchor(context.worldState);
  const mapAnchor = mapBoardAnchor(context.worldState);
  const horizonAnchor = horizonAnchorForState(context.worldState);
  const keepsakeAnchor = keepsakeAnchorForState(context.worldState);
  const gatheringAnchor = gatheringAnchorForState(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const platformCount = syncPlatform(prop.platform, subProps.lookoutPlatform, subProps.steps, subProps.useSlot, anchor, context);
  const mapBoardCount = syncMapBoard(prop.mapBoard, subProps.mapBoard, subProps.sketchMap, mapAnchor, context);
  const horizonMarkerCount = syncHorizonMarkers(
    prop.horizonMarkers,
    subProps.horizonMarker,
    subProps.horizonHighlight,
    horizonAnchor,
    context
  );
  const keepsakeCount = syncKeepsakeDisplay(prop.keepsakeDisplay, subProps.keepsakeDisplay, keepsakeAnchor, context);
  const gatheringDetailCount = syncDay100Gathering(
    prop.day100Gathering,
    subProps.day100Gathering,
    gatheringAnchor,
    context
  );

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount =
    platformCount + mapBoardCount + horizonMarkerCount + keepsakeCount + gatheringDetailCount;

  return {
    id: LOOKOUT_MAP_HORIZON_ID,
    visible: true,
    lookoutMapHorizonVisible: true,
    lookoutMapHorizonStage: descriptor ? descriptor.stage || "" : "",
    lookoutMapHorizonVariant: descriptor ? descriptor.variant || "" : "",
    lookoutMapHorizonActive: Boolean(descriptor && descriptor.active),
    lookoutMapHorizonPlatformVisible: platformCount > 0,
    lookoutMapHorizonStepsVisible: Boolean(subProps.steps && subProps.steps.visible),
    lookoutMapHorizonMapBoardVisible: mapBoardCount > 0,
    lookoutMapHorizonSketchMapVisible: Boolean(subProps.sketchMap && subProps.sketchMap.visible),
    lookoutMapHorizonHorizonMarkerVisible: horizonMarkerCount > 0,
    lookoutMapHorizonHorizonHighlightVisible: Boolean(subProps.horizonHighlight && subProps.horizonHighlight.visible),
    lookoutMapHorizonKeepsakeDisplayVisible: keepsakeCount > 0,
    lookoutMapHorizonDay100GatheringVisible: gatheringDetailCount > 0,
    lookoutMapHorizonUseSlotVisible: Boolean(subProps.useSlot && subProps.useSlot.visible),
    lookoutMapHorizonPlatformCount: Number(subProps.lookoutPlatform ? subProps.lookoutPlatform.count || 0 : 0),
    lookoutMapHorizonStepCount: Number(subProps.steps ? subProps.steps.count || 0 : 0),
    lookoutMapHorizonMapBoardCount: Number(subProps.mapBoard ? subProps.mapBoard.count || 0 : 0),
    lookoutMapHorizonSketchMapCount: Number(subProps.sketchMap ? subProps.sketchMap.count || 0 : 0),
    lookoutMapHorizonHorizonMarkerCount: Number(subProps.horizonMarker ? subProps.horizonMarker.count || 0 : 0),
    lookoutMapHorizonHorizonHighlightCount: Number(
      subProps.horizonHighlight ? subProps.horizonHighlight.count || 0 : 0
    ),
    lookoutMapHorizonKeepsakeCount: Number(subProps.keepsakeDisplay ? subProps.keepsakeDisplay.count || 0 : 0),
    lookoutMapHorizonGatheringDetailCount: Number(
      subProps.day100Gathering ? subProps.day100Gathering.count || 0 : 0
    ),
    lookoutMapHorizonClimbingEnabled: false,
    lookoutMapHorizonVerticalMovementEnabled: false,
    lookoutMapHorizonMapDiscoveryEnabled: false,
    lookoutMapHorizonDay100CompletionEnabled: false,
    lookoutMapHorizonAssetSourceId: source.id || "",
    lookoutMapHorizonAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    lookoutMapHorizonTransformId: transform ? transform.id || "" : "",
    lookoutMapHorizonTransformNormalized: Boolean(transform),
    lookoutMapHorizonWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    lookoutMapHorizonDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    lookoutMapHorizonMovementDiscoveryNote: debug.movementDiscoveryNote || "",
    lookoutMapHorizonPlaceholderNote: debug.placeholderNote || "",
    lookoutMapHorizonFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount,
    pooledObjectCount
  };
}

export function normalizeLookoutMapHorizonAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createLookoutMaterials() {
  const standard = (color, roughness = 0.82, options = {}) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0,
      ...options
    });
  return {
    wood: standard(0x6c3d24, 0.86),
    darkWood: standard(0x3a2118, 0.90),
    rope: standard(0xb18b55, 0.86),
    parchment: standard(0xd9c486, 0.72),
    ink: standard(0x253445, 0.76),
    horizonBlue: standard(0x4c84a8, 0.68, { emissive: 0x0c2734, emissiveIntensity: 0.10 }),
    highlight: standard(0xf4c85b, 0.66, { emissive: 0x8d5c12, emissiveIntensity: 0.28 }),
    stone: standard(0x8f8b78, 0.86),
    shell: standard(0xc7e2de, 0.72),
    celebration: standard(0xe86f3a, 0.70, { emissive: 0x4a1608, emissiveIntensity: 0.12 })
  };
}

function createLookoutPlatform(materials) {
  const group = new THREE.Group();
  group.name = "lookoutMapHorizon_platform";
  const deck = new THREE.Group();
  deck.name = "lookoutMapHorizon_deck";
  for (let i = 0; i < 4; i += 1) {
    deck.add(createBox(`lookoutMapHorizon_deckPlank_${i + 1}`, [0.38, 0.08, 1.46], materials.wood, {
      x: -0.57 + i * 0.38,
      y: 0.50,
      z: 0
    }));
  }
  for (const [x, z] of [[-0.68, -0.58], [0.68, -0.58], [-0.68, 0.58], [0.68, 0.58]]) {
    group.add(createBox("lookoutMapHorizon_platformLeg", [0.14, 0.54, 0.14], materials.darkWood, { x, y: 0.25, z }));
    group.add(createBox("lookoutMapHorizon_platformPost", [0.10, 1.08, 0.10], materials.darkWood, { x, y: 0.82, z }));
  }
  group.add(deck);
  group.add(createBox("lookoutMapHorizon_frontRail", [1.58, 0.08, 0.08], materials.rope, { x: 0, y: 1.26, z: -0.64 }));
  group.add(createBox("lookoutMapHorizon_backRail", [1.58, 0.08, 0.08], materials.rope, { x: 0, y: 1.26, z: 0.64 }));
  group.add(createBox("lookoutMapHorizon_sideRailLeft", [0.08, 0.08, 1.34], materials.rope, { x: -0.74, y: 1.18, z: 0 }));
  group.add(createBox("lookoutMapHorizon_sideRailRight", [0.08, 0.08, 1.34], materials.rope, { x: 0.74, y: 1.18, z: 0 }));

  const steps = STEP_LAYOUT.map((entry, index) => {
    const [x, z, yaw] = entry;
    const step = createBox(`lookoutMapHorizon_step_${index + 1}`, [0.44, 0.10, 0.26], materials.wood, {
      x,
      y: 0.07 + index * 0.055,
      z
    });
    step.rotation.y = yaw;
    group.add(step);
    return step;
  });

  const useSlot = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.018, 6, 24), materials.highlight);
  useSlot.name = "lookoutMapHorizon_useSlot";
  useSlot.position.set(0.36, 0.56, 0.20);
  useSlot.rotation.x = Math.PI / 2;
  group.add(useSlot);

  return { group, steps, useSlot };
}

function createMapBoard(materials) {
  const group = new THREE.Group();
  group.name = "lookoutMapHorizon_mapBoard";
  group.add(createBox("lookoutMapHorizon_mapBoardPostLeft", [0.10, 1.12, 0.10], materials.darkWood, { x: -0.48, y: 0.56, z: 0 }));
  group.add(createBox("lookoutMapHorizon_mapBoardPostRight", [0.10, 1.12, 0.10], materials.darkWood, { x: 0.48, y: 0.56, z: 0 }));
  group.add(createBox("lookoutMapHorizon_mapBoardPanel", [1.08, 0.68, 0.08], materials.parchment, { x: 0, y: 0.88, z: -0.03 }));
  group.add(createBox("lookoutMapHorizon_mapBoardHorizonLine", [0.78, 0.025, 0.09], materials.ink, { x: 0, y: 0.96, z: -0.09 }));
  group.add(createBox("lookoutMapHorizon_mapBoardRouteLine", [0.44, 0.025, 0.09], materials.horizonBlue, { x: -0.10, y: 0.80, z: -0.10, rz: -0.35 }));
  group.add(createBox("lookoutMapHorizon_mapBoardIslandDot", [0.10, 0.08, 0.10], materials.highlight, { x: 0.22, y: 0.78, z: -0.11 }));

  const sketchMaps = SKETCH_LAYOUT.map((entry, index) => {
    const [x, y, z, yaw] = entry;
    const sketch = new THREE.Group();
    sketch.name = `lookoutMapHorizon_sketchMap_${index + 1}`;
    sketch.position.set(x, y + 0.46, z - 0.40);
    sketch.rotation.y = yaw;
    sketch.add(createBox("lookoutMapHorizon_sketchPaper", [0.34, 0.028, 0.24], materials.parchment, { x: 0, y: 0, z: 0 }));
    sketch.add(createBox("lookoutMapHorizon_sketchLineA", [0.22, 0.014, 0.018], materials.ink, { x: 0.00, y: 0.025, z: -0.02, ry: 0.24 }));
    sketch.add(createBox("lookoutMapHorizon_sketchLineB", [0.15, 0.014, 0.018], materials.horizonBlue, { x: 0.03, y: 0.027, z: 0.05, ry: -0.34 }));
    group.add(sketch);
    return sketch;
  });

  return { group, sketchMaps };
}

function createHorizonMarkers(materials) {
  const group = new THREE.Group();
  group.name = "lookoutMapHorizon_horizonMarkers";
  const markers = HORIZON_LAYOUT.map((entry, index) => {
    const [x, z, yaw, scale] = entry;
    const marker = new THREE.Group();
    marker.name = `lookoutMapHorizon_horizonMarker_${index + 1}`;
    marker.position.set(x, 0, z);
    marker.rotation.y = yaw;
    marker.scale.setScalar(scale);
    marker.add(createBox("lookoutMapHorizon_horizonPole", [0.08, 0.54, 0.08], materials.darkWood, { x: 0, y: 0.27, z: 0 }));
    marker.add(createBox("lookoutMapHorizon_horizonFlag", [0.34, 0.16, 0.035], materials.horizonBlue, { x: 0.18, y: 0.54, z: 0 }));
    group.add(marker);
    return marker;
  });
  const highlight = createBox("lookoutMapHorizon_horizonHighlight", [2.16, 0.035, 0.06], materials.highlight, {
    x: 0,
    y: 0.08,
    z: 0.40
  });
  group.add(highlight);
  return { group, markers, highlight };
}

function createKeepsakeDisplay(materials) {
  const group = new THREE.Group();
  group.name = "lookoutMapHorizon_keepsakeDisplay";
  group.add(createBox("lookoutMapHorizon_keepsakeShelf", [0.86, 0.08, 0.26], materials.wood, { x: 0, y: 0.14, z: 0 }));
  const keepsakes = KEEPSAKE_LAYOUT.map((entry, index) => {
    const [x, z, yaw, scale] = entry;
    const material = index % 2 === 0 ? materials.shell : materials.stone;
    const keepsake = new THREE.Mesh(new THREE.DodecahedronGeometry(0.095 * scale, 0), material);
    keepsake.name = `lookoutMapHorizon_keepsake_${index + 1}`;
    keepsake.position.set(x, 0.25, z);
    keepsake.rotation.set(0.18, yaw, -0.08);
    group.add(keepsake);
    return keepsake;
  });
  return { group, keepsakes };
}

function createDay100Gathering(materials) {
  const group = new THREE.Group();
  group.name = "lookoutMapHorizon_day100Gathering";
  const details = GATHERING_LAYOUT.map((entry, index) => {
    const [x, z, yaw, scale] = entry;
    const detail = new THREE.Group();
    detail.name = `lookoutMapHorizon_gatheringDetail_${index + 1}`;
    detail.position.set(x, 0, z);
    detail.rotation.y = yaw;
    detail.scale.setScalar(scale);
    if (index === 4) {
      detail.add(createBox("lookoutMapHorizon_displayFireBase", [0.30, 0.08, 0.30], materials.stone, { x: 0, y: 0.06, z: 0 }));
      detail.add(createBox("lookoutMapHorizon_displayFireFlame", [0.13, 0.28, 0.13], materials.celebration, { x: 0, y: 0.25, z: 0, ry: 0.7 }));
    } else if (index === 5) {
      detail.add(createBox("lookoutMapHorizon_day100BannerPole", [0.06, 0.52, 0.06], materials.darkWood, { x: 0, y: 0.26, z: 0 }));
      detail.add(createBox("lookoutMapHorizon_day100Banner", [0.36, 0.16, 0.035], materials.highlight, { x: 0.18, y: 0.48, z: 0 }));
    } else {
      detail.add(createBox("lookoutMapHorizon_gatheringSeat", [0.34, 0.14, 0.24], materials.wood, { x: 0, y: 0.09, z: 0 }));
    }
    group.add(detail);
    return detail;
  });
  return { group, details };
}

function syncPlatform(platform, platformSubProp, stepsSubProp, useSlotSubProp, anchor, context) {
  const visible = Boolean(platformSubProp && platformSubProp.visible);
  platform.group.visible = visible;
  if (!visible) return 0;
  positionAtAnchor(platform.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.02);
  const stepCount = clampedCount(stepsSubProp, MAX_STEPS);
  platform.steps.forEach((step, index) => {
    step.visible = index < stepCount;
  });
  platform.useSlot.visible = Boolean(useSlotSubProp && useSlotSubProp.visible);
  return 1 + stepCount + (platform.useSlot.visible ? 1 : 0);
}

function syncMapBoard(mapBoard, boardSubProp, sketchSubProp, anchor, context) {
  const boardVisible = Boolean(boardSubProp && boardSubProp.visible);
  const sketchCount = clampedCount(sketchSubProp, MAX_SKETCH_MAPS);
  mapBoard.group.visible = boardVisible || sketchCount > 0;
  if (!mapBoard.group.visible) return 0;
  positionAtAnchor(mapBoard.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.02);
  mapBoard.sketchMaps.forEach((sketch, index) => {
    sketch.visible = index < sketchCount;
  });
  return (boardVisible ? 1 : 0) + sketchCount;
}

function syncHorizonMarkers(horizonMarkers, markerSubProp, highlightSubProp, anchor, context) {
  const markerCount = clampedCount(markerSubProp, MAX_HORIZON_MARKERS);
  const highlightVisible = Boolean(highlightSubProp && highlightSubProp.visible);
  horizonMarkers.group.visible = markerCount > 0 || highlightVisible;
  if (!horizonMarkers.group.visible) return 0;
  positionAtAnchor(horizonMarkers.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.02);
  horizonMarkers.markers.forEach((marker, index) => {
    marker.visible = index < markerCount;
  });
  horizonMarkers.highlight.visible = highlightVisible;
  return markerCount + (highlightVisible ? 1 : 0);
}

function syncKeepsakeDisplay(keepsakeDisplay, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_KEEPSAKES);
  keepsakeDisplay.group.visible = count > 0;
  if (!keepsakeDisplay.group.visible) return 0;
  positionAtAnchor(keepsakeDisplay.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.02);
  keepsakeDisplay.keepsakes.forEach((keepsake, index) => {
    keepsake.visible = index < count;
  });
  return count;
}

function syncDay100Gathering(day100Gathering, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_GATHERING_DETAILS);
  day100Gathering.group.visible = count > 0;
  if (!day100Gathering.group.visible) return 0;
  positionAtAnchor(day100Gathering.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.02);
  day100Gathering.details.forEach((detail, index) => {
    detail.visible = index < count;
  });
  return count;
}

function createBox(name, size, material, position = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
  mesh.name = name;
  mesh.position.set(Number(position.x || 0), Number(position.y || 0), Number(position.z || 0));
  mesh.rotation.set(Number(position.rx || 0), Number(position.ry || 0), Number(position.rz || 0));
  return mesh;
}

function lookoutAnchor(worldState) {
  const state = worldState && worldState.lookoutMapHorizon ? worldState.lookoutMapHorizon : {};
  return normalizedAnchor(state.anchorPosition, DEFAULT_ANCHOR, state.yaw);
}

function mapBoardAnchor(worldState) {
  const state = worldState && worldState.lookoutMapHorizon ? worldState.lookoutMapHorizon : {};
  return normalizedAnchor(state.mapBoardPosition, DEFAULT_MAP_BOARD_ANCHOR, state.mapBoardYaw);
}

function horizonAnchorForState(worldState) {
  const state = worldState && worldState.lookoutMapHorizon ? worldState.lookoutMapHorizon : {};
  return normalizedAnchor(state.horizonMarkerPosition, DEFAULT_HORIZON_ANCHOR, state.horizonYaw);
}

function keepsakeAnchorForState(worldState) {
  const state = worldState && worldState.lookoutMapHorizon ? worldState.lookoutMapHorizon : {};
  return normalizedAnchor(state.keepsakePosition, DEFAULT_KEEPSAKE_ANCHOR, state.keepsakeYaw);
}

function gatheringAnchorForState(worldState) {
  const state = worldState && worldState.lookoutMapHorizon ? worldState.lookoutMapHorizon : {};
  return normalizedAnchor(state.gatheringPosition, DEFAULT_GATHERING_ANCHOR, state.gatheringYaw);
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
  const x = anchor.x + Number(offset.x || 0) * cos - Number(offset.z || 0) * sin;
  const z = anchor.z + Number(offset.x || 0) * sin + Number(offset.z || 0) * cos;
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

function hiddenLookoutMapHorizonTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: LOOKOUT_MAP_HORIZON_ID,
    visible: false,
    lookoutMapHorizonVisible: false,
    lookoutMapHorizonStage: descriptor ? descriptor.stage || "" : "",
    lookoutMapHorizonVariant: descriptor ? descriptor.variant || "" : "",
    lookoutMapHorizonActive: Boolean(descriptor && descriptor.active),
    lookoutMapHorizonPlatformVisible: false,
    lookoutMapHorizonStepsVisible: false,
    lookoutMapHorizonMapBoardVisible: false,
    lookoutMapHorizonSketchMapVisible: false,
    lookoutMapHorizonHorizonMarkerVisible: false,
    lookoutMapHorizonHorizonHighlightVisible: false,
    lookoutMapHorizonKeepsakeDisplayVisible: false,
    lookoutMapHorizonDay100GatheringVisible: false,
    lookoutMapHorizonUseSlotVisible: false,
    lookoutMapHorizonPlatformCount: 0,
    lookoutMapHorizonStepCount: 0,
    lookoutMapHorizonMapBoardCount: 0,
    lookoutMapHorizonSketchMapCount: 0,
    lookoutMapHorizonHorizonMarkerCount: 0,
    lookoutMapHorizonHorizonHighlightCount: 0,
    lookoutMapHorizonKeepsakeCount: 0,
    lookoutMapHorizonGatheringDetailCount: 0,
    lookoutMapHorizonClimbingEnabled: false,
    lookoutMapHorizonVerticalMovementEnabled: false,
    lookoutMapHorizonMapDiscoveryEnabled: false,
    lookoutMapHorizonDay100CompletionEnabled: false,
    lookoutMapHorizonAssetSourceId: source.id || "",
    lookoutMapHorizonAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    lookoutMapHorizonTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    lookoutMapHorizonTransformNormalized: Boolean(descriptor && descriptor.transform),
    lookoutMapHorizonWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    lookoutMapHorizonDuplicateSystemClassification:
      descriptor && descriptor.debug ? descriptor.debug.duplicateSystemClassification || "" : "",
    lookoutMapHorizonMovementDiscoveryNote:
      descriptor && descriptor.debug ? descriptor.debug.movementDiscoveryNote || "" : "",
    lookoutMapHorizonPlaceholderNote: descriptor && descriptor.debug ? descriptor.debug.placeholderNote || "" : "",
    lookoutMapHorizonFallbackReason: reason || "",
    renderedObjectCount: 0,
    pooledObjectCount: 0
  };
}
