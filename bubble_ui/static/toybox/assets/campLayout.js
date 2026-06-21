import * as THREE from "three";

const MAX_PATH_SEGMENTS = 32;
const MAX_BOUNDARY_STONES = 72;
const MAX_LIT_ANCHORS = 32;
const MAX_ZONE_MARKERS = 8;

const WORK_COLOR = 0xd2a44c;
const REST_COLOR = 0x7fb4c8;
const COOK_COLOR = 0xd07a4c;

export function createCampLayoutPresentationProp() {
  const group = new THREE.Group();
  group.name = "campPaths_group";
  group.userData.type = "presentationFamily";
  group.userData.family = "campLayout";

  const materials = createCampLayoutMaterials();
  const pathSegments = createPathSegmentPool(materials);
  const boundaryStones = createInstancedRocks("Camp boundary stones", MAX_BOUNDARY_STONES, materials.stone);
  const litAnchors = createLitAnchorInstances(materials);
  const zoneMarkers = createZoneMarkerPool(materials);
  const carriedStone = createCarriedBoundaryStone(materials);

  for (const segment of pathSegments) group.add(segment);
  group.add(boundaryStones.mesh, litAnchors.mesh, zoneMarkers.group, carriedStone.group);
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    pathSegments,
    boundaryStones,
    litAnchors,
    zoneMarkers,
    carriedStone,
    dummy: new THREE.Object3D()
  };
}

export function syncCampLayoutPresentationProp(prop, context) {
  const pathsDescriptor = descriptorByFamily(context.presentationState, "campPaths");
  const zonesDescriptor = descriptorByFamily(context.presentationState, "campZones");
  const pathSubProps = pathsDescriptor && pathsDescriptor.subProps ? pathsDescriptor.subProps : {};
  const zoneSubProps = zonesDescriptor && zonesDescriptor.subProps ? zonesDescriptor.subProps : {};
  const footpaths = pathSubProps.footpaths || {};
  const boundaryStoneProp = pathSubProps.boundaryStones || {};
  const litAnchorProp = pathSubProps.litAnchors || {};
  const zoneMarkerProp = zoneSubProps.zoneMarkers || {};
  const carriedStoneProp = pathSubProps.carriedBoundaryStone || {};

  if (!prop || !prop.group) return hiddenCampLayoutTrace(pathsDescriptor, zonesDescriptor, "camp layout prop missing");

  const pathItems = Array.isArray(footpaths.items) ? footpaths.items : [];
  const stoneItems = Array.isArray(boundaryStoneProp.items) ? boundaryStoneProp.items : [];
  const litItems = Array.isArray(litAnchorProp.items) ? litAnchorProp.items : [];
  const zoneItems = Array.isArray(zoneMarkerProp.items) ? zoneMarkerProp.items : [];
  const anyVisible =
    Boolean(footpaths.visible && pathItems.length) ||
    Boolean(boundaryStoneProp.visible && stoneItems.length) ||
    Boolean(litAnchorProp.visible && litItems.length) ||
    Boolean(zoneMarkerProp.visible && zoneItems.length) ||
    Boolean(carriedStoneProp.visible);

  prop.group.visible = anyVisible || Boolean(pathsDescriptor && pathsDescriptor.active) || Boolean(zonesDescriptor && zonesDescriptor.active);
  const renderedPathSegments = syncPathSegments(prop.pathSegments, pathItems, footpaths.transform, context);
  const renderedBoundaryStones = syncInstancedPositions(
    prop.boundaryStones,
    stoneItems,
    boundaryStoneProp.transform,
    context,
    "position"
  );
  const renderedLitAnchors = syncInstancedPositions(prop.litAnchors, litItems, litAnchorProp.transform, context, "position");
  const renderedZoneMarkers = syncZoneMarkers(prop.zoneMarkers, zoneItems, zoneMarkerProp.transform, context);
  const carriedStoneVisible = syncCarriedStone(prop.carriedStone.group, carriedStoneProp, context);

  const pathSource = pathsDescriptor && pathsDescriptor.source ? pathsDescriptor.source : {};
  const zoneSource = zonesDescriptor && zonesDescriptor.source ? zonesDescriptor.source : {};
  const pathDebug = pathsDescriptor && pathsDescriptor.debug ? pathsDescriptor.debug : {};
  const zoneDebug = zonesDescriptor && zonesDescriptor.debug ? zonesDescriptor.debug : {};

  return {
    id: "campLayout",
    visible: prop.group.visible,
    campPathsVisible: Boolean(pathsDescriptor && pathsDescriptor.visible),
    campPathsStage: pathsDescriptor ? pathsDescriptor.stage || "" : "",
    campPathsVariant: pathsDescriptor ? pathsDescriptor.variant || "" : "",
    campPathsActive: Boolean(pathsDescriptor && pathsDescriptor.active),
    campPathsActivePathCount: Number(pathDebug.activePathCount || pathItems.length || 0),
    campPathsClearedPaths: Array.isArray(pathDebug.clearedPaths) ? pathDebug.clearedPaths.slice() : [],
    campPathsLitPaths: Array.isArray(pathDebug.litPaths) ? pathDebug.litPaths.slice() : [],
    campPathsRenderedSegmentCount: renderedPathSegments,
    campPathsLitAnchorCount: renderedLitAnchors,
    boundaryStoneCount: renderedBoundaryStones,
    campZonesVisible: Boolean(zonesDescriptor && zonesDescriptor.visible),
    campZonesStage: zonesDescriptor ? zonesDescriptor.stage || "" : "",
    campZonesMarkedZones: Array.isArray(zoneDebug.markedZones) ? zoneDebug.markedZones.slice() : [],
    campZonesMarkedZoneCount: Number(zoneDebug.markedZoneCount || zoneItems.length || 0),
    campZonesRenderedMarkerCount: renderedZoneMarkers,
    carriedStoneVisible,
    carriedObject: context.worldState && context.worldState.bubbleBoy ? context.worldState.bubbleBoy.carriedObject || "" : "",
    campPathsAssetSourceId: pathSource.id || "",
    campPathsAssetApprovalStatus: pathSource.approvalStatus || (pathSource.approvedForUse ? "approved" : "unapproved"),
    campPathsTransformId: pathsDescriptor && pathsDescriptor.transform ? pathsDescriptor.transform.id || "" : "",
    campPathsTransformNormalized: Boolean(pathsDescriptor && pathsDescriptor.transform),
    campPathsWorldStateHook: pathsDescriptor && pathsDescriptor.stateHook ? pathsDescriptor.stateHook.state || "" : "",
    campPathsDuplicateSystemClassification: pathDebug.duplicateSystemClassification || "",
    campPathsFallbackReason: pathDebug.fallbackReason || "",
    campZonesAssetSourceId: zoneSource.id || "",
    campZonesAssetApprovalStatus: zoneSource.approvalStatus || (zoneSource.approvedForUse ? "approved" : "unapproved"),
    campZonesTransformId: zonesDescriptor && zonesDescriptor.transform ? zonesDescriptor.transform.id || "" : "",
    campZonesTransformNormalized: Boolean(zonesDescriptor && zonesDescriptor.transform),
    campZonesWorldStateHook: zonesDescriptor && zonesDescriptor.stateHook ? zonesDescriptor.stateHook.state || "" : "",
    campZonesDuplicateSystemClassification: zoneDebug.duplicateSystemClassification || "",
    campZonesFallbackReason: zoneDebug.fallbackReason || "",
    renderedObjectCount:
      renderedPathSegments + renderedBoundaryStones + renderedLitAnchors + renderedZoneMarkers + (carriedStoneVisible ? 1 : 0)
  };
}

export function normalizeCampAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createCampLayoutMaterials() {
  return {
    path: new THREE.MeshStandardMaterial({
      color: 0x6f583c,
      roughness: 0.96,
      metalness: 0,
      transparent: true,
      opacity: 0.58,
      depthWrite: false
    }),
    stone: new THREE.MeshStandardMaterial({ color: 0x7a8176, roughness: 0.92, metalness: 0 }),
    post: new THREE.MeshStandardMaterial({ color: 0x6f4426, roughness: 0.88, metalness: 0 }),
    workBand: new THREE.MeshStandardMaterial({ color: WORK_COLOR, roughness: 0.82, metalness: 0 }),
    restBand: new THREE.MeshStandardMaterial({ color: REST_COLOR, roughness: 0.82, metalness: 0 }),
    cookBand: new THREE.MeshStandardMaterial({ color: COOK_COLOR, roughness: 0.82, metalness: 0 }),
    litAnchor: new THREE.MeshBasicMaterial({ color: 0xffd477, transparent: true, opacity: 0.78 })
  };
}

function createPathSegmentPool(materials) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  return Array.from({ length: MAX_PATH_SEGMENTS }, (_unused, index) => {
    const segment = new THREE.Mesh(geometry, materials.path);
    segment.name = `Camp footpath strip ${index + 1}`;
    segment.visible = false;
    return segment;
  });
}

function createInstancedRocks(name, count, material) {
  const mesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), material, count);
  mesh.name = name;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  return { mesh, maxCount: count };
}

function createLitAnchorInstances(materials) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), materials.litAnchor, MAX_LIT_ANCHORS);
  mesh.name = "Camp lit path anchors";
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  return { mesh, maxCount: MAX_LIT_ANCHORS };
}

function createZoneMarkerPool(materials) {
  const group = new THREE.Group();
  group.name = "Camp zone marker props";
  const markers = Array.from({ length: MAX_ZONE_MARKERS }, (_unused, index) => createZoneMarker(index, materials));
  for (const marker of markers) group.add(marker.group);
  return { group, markers };
}

function createZoneMarker(index, materials) {
  const group = new THREE.Group();
  group.name = `Camp zone marker ${index + 1}`;
  group.visible = false;

  const base = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 0), materials.stone);
  base.name = "Zone marker base stone";
  base.position.set(0, 0.10, 0);
  group.add(base);

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.42, 8), materials.post);
  post.name = "Zone marker post";
  post.position.set(0, 0.34, 0);
  group.add(post);

  const bands = {
    work: createZoneBand("work", materials.workBand),
    rest: createZoneBand("rest", materials.restBand),
    cook: createZoneBand("cook", materials.cookBand)
  };
  for (const band of Object.values(bands)) group.add(band);
  return { group, bands };
}

function createZoneBand(type, material) {
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.055, 0.055), material);
  band.name = `Zone marker ${type} band`;
  band.position.set(0, 0.50, 0);
  band.visible = false;
  return band;
}

function createCarriedBoundaryStone(materials) {
  const group = new THREE.Group();
  group.name = "Carried boundary stone attachment";
  group.visible = false;
  const stone = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), materials.stone);
  stone.name = "Carried boundary stone";
  group.add(stone);
  return { group, stone };
}

function syncPathSegments(segments, paths, transform, context) {
  let segmentIndex = 0;
  const groundOffset = Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : 0.018;
  const width = 0.42;
  for (const path of paths) {
    const waypoints = Array.isArray(path.waypoints) ? path.waypoints : [];
    for (let i = 0; i < waypoints.length - 1 && segmentIndex < segments.length; i += 1) {
      const start = waypoints[i];
      const end = waypoints[i + 1];
      const dx = Number(end.x || 0) - Number(start.x || 0);
      const dz = Number(end.z || 0) - Number(start.z || 0);
      const length = Math.hypot(dx, dz);
      if (length <= 0.05) continue;
      const x = Number(start.x || 0) + dx * 0.5;
      const z = Number(start.z || 0) + dz * 0.5;
      const segment = segments[segmentIndex];
      segment.visible = true;
      segment.position.set(x, context.groundHeightAt(x, z) + groundOffset, z);
      segment.rotation.set(0, -Math.atan2(dz, dx), 0);
      segment.scale.set(length, 0.012, width);
      segmentIndex += 1;
    }
  }
  for (let i = segmentIndex; i < segments.length; i += 1) segments[i].visible = false;
  return segmentIndex;
}

function syncInstancedPositions(instanceSet, items, transform, context, positionKey) {
  const mesh = instanceSet.mesh;
  const maxCount = instanceSet.maxCount;
  const scale = transformScale(transform);
  const groundOffset = Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : 0;
  const count = Math.min(maxCount, items.length);
  const dummy = context.dummy || new THREE.Object3D();
  for (let i = 0; i < maxCount; i += 1) {
    if (i < count) {
      const source = items[i] && items[i][positionKey] ? items[i][positionKey] : {};
      const x = Number(source.x || 0);
      const z = Number(source.z || 0);
      dummy.position.set(x, context.groundHeightAt(x, z) + groundOffset, z);
      dummy.rotation.set(0, i * 1.718 + 0.21, 0);
      dummy.scale.set(scale.x, scale.y, scale.z);
    } else {
      dummy.position.set(0, -999, 0);
      dummy.scale.set(0.0001, 0.0001, 0.0001);
    }
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.count = maxCount;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.visible = count > 0;
  return count;
}

function syncZoneMarkers(zoneMarkers, zones, transform, context) {
  const count = Math.min(zoneMarkers.markers.length, zones.length);
  for (let i = 0; i < zoneMarkers.markers.length; i += 1) {
    const marker = zoneMarkers.markers[i];
    if (i >= count) {
      marker.group.visible = false;
      continue;
    }
    const zone = zones[i];
    const position = zone.anchorPosition || {};
    const x = Number(position.x || 0);
    const z = Number(position.z || 0);
    marker.group.visible = true;
    normalizeCampAsset(marker.group, transform);
    marker.group.position.set(x, context.groundHeightAt(x, z) + normalizedGroundOffset(transform, 0.035), z);
    marker.group.rotation.y = normalizedRotationY(transform) + i * 0.44 + 0.18;
    for (const [type, band] of Object.entries(marker.bands)) {
      band.visible = zone.type === type;
    }
  }
  return count;
}

function syncCarriedStone(group, descriptor, context) {
  const attachment = context.presentationState && context.presentationState.attachment ? context.presentationState.attachment : null;
  const visible = Boolean(descriptor && descriptor.visible && attachment && attachment.id === "boundaryStoneCarry");
  group.visible = visible;
  if (!visible) return false;
  const boy = context.worldState && context.worldState.bubbleBoy ? context.worldState.bubbleBoy : {};
  const position = boy.position || {};
  const x = Number.isFinite(position.x) ? position.x : 0;
  const z = Number.isFinite(position.z) ? position.z : 0;
  const facing = Number.isFinite(boy.facing) ? boy.facing : 0;
  const transform = attachment.transform || descriptor.transform || {};
  const scale = transformScale(transform);
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  group.position.set(
    x + Math.cos(facing) * 0.22 - Math.sin(facing) * 0.28,
    context.groundHeightAt(x, z) + 0.62 + Math.sin(context.time * 3.1) * 0.008,
    z - Math.sin(facing) * 0.22 - Math.cos(facing) * 0.28
  );
  group.rotation.set(
    Number(rotation[0]) || 0,
    facing + Math.PI * 0.5 + (Number(rotation[1]) || 0),
    Number(rotation[2]) || 0
  );
  group.scale.set(scale.x, scale.y, scale.z);
  return true;
}

function descriptorByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function hiddenCampLayoutTrace(pathsDescriptor, zonesDescriptor, fallbackReason) {
  return {
    id: "campLayout",
    visible: false,
    campPathsVisible: false,
    campPathsStage: pathsDescriptor ? pathsDescriptor.stage || "" : "",
    campZonesVisible: false,
    campZonesStage: zonesDescriptor ? zonesDescriptor.stage || "" : "",
    fallbackReason
  };
}

function transformScale(transform) {
  const scale = transform && Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  return {
    x: Number(scale[0]) || 1,
    y: Number(scale[1]) || 1,
    z: Number(scale[2]) || 1
  };
}

function normalizedGroundOffset(transform, fallback) {
  return Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : fallback;
}

function normalizedRotationY(transform) {
  const rotation = transform && Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  return Number(rotation[1]) || 0;
}
