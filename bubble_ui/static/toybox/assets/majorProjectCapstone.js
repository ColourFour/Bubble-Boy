import * as THREE from "three";

import { MAJOR_PROJECT_CAPSTONE_ID } from "../simulation/worldState.js";

const DEFAULT_ANCHOR = Object.freeze({ x: 1.82, y: 0.20, z: -2.20, yaw: 0.18 });
const DEFAULT_CELEBRATION_ANCHOR = Object.freeze({ x: 1.82, y: 0.20, z: -1.52, yaw: 0.18 });
const MAX_SUPPLIES = 6;
const MAX_TABLE_LEGS = 4;
const MAX_TABLETOP = 3;
const MAX_BENCHES = 2;
const MAX_SETTINGS = 6;
const MAX_CELEBRATION = 5;

const SUPPLY_LAYOUT = Object.freeze([
  [-0.76, -0.50, -0.12, 0.94],
  [-0.42, -0.72, 0.08, 0.82],
  [0.02, -0.64, -0.20, 0.76],
  [0.46, -0.52, 0.16, 0.70],
  [0.78, -0.30, -0.06, 0.64],
  [-0.06, -0.96, 0.24, 0.58]
]);

const LEG_LAYOUT = Object.freeze([
  [-0.62, -0.34],
  [0.62, -0.34],
  [-0.62, 0.34],
  [0.62, 0.34]
]);

const SETTING_LAYOUT = Object.freeze([
  [-0.52, -0.18],
  [-0.22, 0.20],
  [0.10, -0.20],
  [0.42, 0.18],
  [-0.74, 0.14],
  [0.74, -0.12]
]);

const CELEBRATION_LAYOUT = Object.freeze([
  [-0.62, 0.00, -0.12],
  [0.62, 0.00, 0.12],
  [-0.28, 0.36, 0.08],
  [0.30, 0.36, -0.08],
  [0.00, 0.62, 0.00]
]);

export function createMajorProjectCapstonePresentationProp() {
  const group = new THREE.Group();
  group.name = "majorProjectCapstone_group";
  group.userData.type = "presentationFamily";
  group.userData.family = MAJOR_PROJECT_CAPSTONE_ID;

  const materials = createCapstoneMaterials();
  const supplies = createSupplies(materials);
  const table = createCommunityTable(materials);
  const celebration = createCelebrationDetails(materials);

  group.add(supplies.group, table.group, celebration.group);
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return { group, supplies, table, celebration };
}

export function syncMajorProjectCapstonePresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, MAJOR_PROJECT_CAPSTONE_ID);
  if (!prop || !prop.group) return hiddenMajorProjectCapstoneTrace(descriptor, "major project capstone prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenMajorProjectCapstoneTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = capstoneAnchor(context.worldState);
  const celebrationAnchor = capstoneCelebrationAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const supplyCount = syncSupplies(prop.supplies, subProps.stage0Supplies, anchor, context);
  const tableCount = syncCommunityTable(prop.table, subProps, anchor, context);
  const celebrationCount = syncCelebration(prop.celebration, subProps.celebrationDetail, celebrationAnchor, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const pooledObjectCount = supplyCount + tableCount + celebrationCount;

  return {
    id: MAJOR_PROJECT_CAPSTONE_ID,
    visible: true,
    majorProjectCapstoneVisible: true,
    majorProjectCapstoneStage: descriptor ? descriptor.stage || "" : "",
    majorProjectCapstoneVariant: descriptor ? descriptor.variant || "" : "",
    majorProjectCapstoneSelectedOption: debug.selectedOption || "communityTable",
    majorProjectCapstoneActive: Boolean(descriptor && descriptor.active),
    majorProjectCapstoneStage0SuppliesVisible: supplyCount > 0,
    majorProjectCapstonePartialBuildVisible: Boolean(subProps.partialBuild && subProps.partialBuild.visible),
    majorProjectCapstoneMostlyBuiltVisible: Boolean(subProps.mostlyBuilt && subProps.mostlyBuilt.visible),
    majorProjectCapstoneCompleteBuildVisible: Boolean(subProps.completeBuild && subProps.completeBuild.visible),
    majorProjectCapstonePlaceSettingsVisible: Boolean(subProps.placeSettings && subProps.placeSettings.visible),
    majorProjectCapstoneCelebrationDetailVisible: celebrationCount > 0,
    majorProjectCapstoneSupplyMarkerCount: Number(debug.supplyMarkerCount || 0),
    majorProjectCapstoneTableLegCount: Number(debug.tableLegCount || 0),
    majorProjectCapstoneTabletopPieceCount: Number(debug.tabletopPieceCount || 0),
    majorProjectCapstoneBenchCount: Number(debug.benchCount || 0),
    majorProjectCapstonePlaceSettingCount: Number(debug.placeSettingCount || 0),
    majorProjectCapstoneCelebrationDetailCount: Number(debug.celebrationDetailCount || 0),
    majorProjectCapstoneResourcePlanningEnabled: false,
    majorProjectCapstoneConstructionMechanicsEnabled: false,
    majorProjectCapstoneMilestoneLogicEnabled: false,
    majorProjectCapstoneTravelDiscoveryEnabled: false,
    majorProjectCapstoneDay100CompletionEnabled: false,
    majorProjectCapstoneAssetSourceId: source.id || "",
    majorProjectCapstoneAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    majorProjectCapstoneTransformId: transform ? transform.id || "" : "",
    majorProjectCapstoneTransformNormalized: Boolean(transform),
    majorProjectCapstoneWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    majorProjectCapstoneDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    majorProjectCapstoneOptionNote: debug.capstoneOptionNote || "",
    majorProjectCapstonePlaceholderNote: debug.placeholderNote || "",
    majorProjectCapstoneFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount,
    pooledObjectCount
  };
}

export function normalizeMajorProjectCapstoneAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createCapstoneMaterials() {
  const standard = (color, roughness = 0.82, options = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...options });
  return {
    wood: standard(0x7b4a2b, 0.84),
    darkWood: standard(0x3a2319, 0.90),
    rope: standard(0xb08b55, 0.86),
    cloth: standard(0x4f8b9a, 0.74),
    setting: standard(0xd8d0b0, 0.70),
    foodDisplay: standard(0xe7a85b, 0.72),
    celebration: standard(0xe25f3a, 0.70, { emissive: 0x441408, emissiveIntensity: 0.08 })
  };
}

function createSupplies(materials) {
  const group = new THREE.Group();
  group.name = "majorProjectCapstone_stage0Supplies";
  const supplies = SUPPLY_LAYOUT.map((entry, index) => {
    const [x, z, yaw, scale] = entry;
    const supply = new THREE.Group();
    supply.name = `majorProjectCapstone_supply_${index + 1}`;
    supply.position.set(x, 0, z);
    supply.rotation.y = yaw;
    supply.scale.setScalar(scale);
    supply.add(createBox("majorProjectCapstone_supplyPlank", [0.46, 0.08, 0.14], materials.wood, { y: 0.08, ry: 0.18 }));
    supply.add(createBox("majorProjectCapstone_supplyBundle", [0.22, 0.18, 0.18], materials.cloth, { x: 0.16, y: 0.16, z: 0.06 }));
    group.add(supply);
    return supply;
  });
  return { group, supplies };
}

function createCommunityTable(materials) {
  const group = new THREE.Group();
  group.name = "majorProjectCapstone_communityTable";
  const legs = LEG_LAYOUT.map(([x, z], index) => {
    const leg = createBox(`majorProjectCapstone_tableLeg_${index + 1}`, [0.12, 0.46, 0.12], materials.darkWood, {
      x,
      y: 0.23,
      z
    });
    group.add(leg);
    return leg;
  });
  const tabletop = [-0.34, 0, 0.34].map((x, index) => {
    const plank = createBox(`majorProjectCapstone_tabletop_${index + 1}`, [0.34, 0.08, 1.04], materials.wood, {
      x,
      y: 0.50,
      z: 0
    });
    group.add(plank);
    return plank;
  });
  const benches = [-0.74, 0.74].map((z, index) => {
    const bench = createBox(`majorProjectCapstone_bench_${index + 1}`, [1.32, 0.14, 0.22], materials.wood, {
      x: 0,
      y: 0.24,
      z
    });
    group.add(bench);
    return bench;
  });
  const settings = SETTING_LAYOUT.map(([x, z], index) => {
    const setting = new THREE.Group();
    setting.name = `majorProjectCapstone_placeSetting_${index + 1}`;
    setting.position.set(x, 0.58, z);
    setting.add(createBox("majorProjectCapstone_placeMat", [0.18, 0.018, 0.14], materials.setting, { y: 0 }));
    setting.add(createBox("majorProjectCapstone_placeFruit", [0.07, 0.055, 0.07], materials.foodDisplay, { y: 0.04 }));
    group.add(setting);
    return setting;
  });
  return { group, legs, tabletop, benches, settings };
}

function createCelebrationDetails(materials) {
  const group = new THREE.Group();
  group.name = "majorProjectCapstone_celebrationDetails";
  const details = CELEBRATION_LAYOUT.map((entry, index) => {
    const [x, z, yaw] = entry;
    const detail = new THREE.Group();
    detail.name = `majorProjectCapstone_celebration_${index + 1}`;
    detail.position.set(x, 0, z);
    detail.rotation.y = yaw;
    if (index < 4) {
      detail.add(createBox("majorProjectCapstone_celebrationPole", [0.05, 0.46, 0.05], materials.darkWood, { y: 0.23 }));
      detail.add(createBox("majorProjectCapstone_celebrationFlag", [0.26, 0.12, 0.035], materials.celebration, { x: 0.13, y: 0.42 }));
    } else {
      detail.add(createBox("majorProjectCapstone_centerDisplay", [0.28, 0.08, 0.28], materials.setting, { y: 0.07 }));
      detail.add(createBox("majorProjectCapstone_centerFlame", [0.12, 0.24, 0.12], materials.celebration, { y: 0.24, ry: 0.58 }));
    }
    group.add(detail);
    return detail;
  });
  return { group, details };
}

function syncSupplies(supplies, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_SUPPLIES);
  supplies.group.visible = count > 0;
  if (!supplies.group.visible) return 0;
  positionAtAnchor(supplies.group, anchor, { x: -0.12, z: -0.38, yaw: 0 }, context, 0.02);
  supplies.supplies.forEach((supply, index) => {
    supply.visible = index < count;
  });
  return count;
}

function syncCommunityTable(table, subProps, anchor, context) {
  const partial = subProps.partialBuild || {};
  const mostly = subProps.mostlyBuilt || {};
  const complete = subProps.completeBuild || {};
  const settings = subProps.placeSettings || {};
  const legCount = Math.min(MAX_TABLE_LEGS, Math.max(Number(partial.tableLegCount || 0), Number(mostly.tableLegCount || 0), Number(complete.tableLegCount || 0)));
  const tabletopCount = Math.min(MAX_TABLETOP, Math.max(Number(partial.tabletopPieceCount || 0), Number(mostly.tabletopPieceCount || 0), Number(complete.tabletopPieceCount || 0)));
  const benchCount = Math.min(MAX_BENCHES, Math.max(Number(mostly.benchCount || 0), Number(complete.benchCount || 0)));
  const settingCount = clampedCount(settings, MAX_SETTINGS);
  const visible = Boolean(partial.visible || mostly.visible || complete.visible || settingCount > 0);
  table.group.visible = visible;
  if (!visible) return 0;
  positionAtAnchor(table.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.02);
  table.legs.forEach((leg, index) => {
    leg.visible = index < legCount;
  });
  table.tabletop.forEach((plank, index) => {
    plank.visible = index < tabletopCount;
  });
  table.benches.forEach((bench, index) => {
    bench.visible = index < benchCount;
  });
  table.settings.forEach((setting, index) => {
    setting.visible = index < settingCount;
  });
  return legCount + tabletopCount + benchCount + settingCount;
}

function syncCelebration(celebration, subProp, anchor, context) {
  const count = clampedCount(subProp, MAX_CELEBRATION);
  celebration.group.visible = count > 0;
  if (!celebration.group.visible) return 0;
  positionAtAnchor(celebration.group, anchor, { x: 0, z: 0, yaw: 0 }, context, 0.02);
  celebration.details.forEach((detail, index) => {
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

function capstoneAnchor(worldState) {
  const state = worldState && worldState.majorProjectCapstone ? worldState.majorProjectCapstone : {};
  return normalizedAnchor(state.anchorPosition, DEFAULT_ANCHOR, state.yaw);
}

function capstoneCelebrationAnchor(worldState) {
  const state = worldState && worldState.majorProjectCapstone ? worldState.majorProjectCapstone : {};
  return normalizedAnchor(state.celebrationPosition, DEFAULT_CELEBRATION_ANCHOR, state.celebrationYaw);
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

function hiddenMajorProjectCapstoneTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: MAJOR_PROJECT_CAPSTONE_ID,
    visible: false,
    majorProjectCapstoneVisible: false,
    majorProjectCapstoneStage: descriptor ? descriptor.stage || "" : "",
    majorProjectCapstoneVariant: descriptor ? descriptor.variant || "" : "",
    majorProjectCapstoneSelectedOption:
      descriptor && descriptor.debug ? descriptor.debug.selectedOption || "communityTable" : "communityTable",
    majorProjectCapstoneActive: Boolean(descriptor && descriptor.active),
    majorProjectCapstoneStage0SuppliesVisible: false,
    majorProjectCapstonePartialBuildVisible: false,
    majorProjectCapstoneMostlyBuiltVisible: false,
    majorProjectCapstoneCompleteBuildVisible: false,
    majorProjectCapstonePlaceSettingsVisible: false,
    majorProjectCapstoneCelebrationDetailVisible: false,
    majorProjectCapstoneSupplyMarkerCount: 0,
    majorProjectCapstoneTableLegCount: 0,
    majorProjectCapstoneTabletopPieceCount: 0,
    majorProjectCapstoneBenchCount: 0,
    majorProjectCapstonePlaceSettingCount: 0,
    majorProjectCapstoneCelebrationDetailCount: 0,
    majorProjectCapstoneResourcePlanningEnabled: false,
    majorProjectCapstoneConstructionMechanicsEnabled: false,
    majorProjectCapstoneMilestoneLogicEnabled: false,
    majorProjectCapstoneTravelDiscoveryEnabled: false,
    majorProjectCapstoneDay100CompletionEnabled: false,
    majorProjectCapstoneAssetSourceId: source.id || "",
    majorProjectCapstoneAssetApprovalStatus:
      source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    majorProjectCapstoneTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    majorProjectCapstoneTransformNormalized: Boolean(descriptor && descriptor.transform),
    majorProjectCapstoneWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    majorProjectCapstoneDuplicateSystemClassification:
      descriptor && descriptor.debug ? descriptor.debug.duplicateSystemClassification || "" : "",
    majorProjectCapstoneOptionNote: descriptor && descriptor.debug ? descriptor.debug.capstoneOptionNote || "" : "",
    majorProjectCapstonePlaceholderNote: descriptor && descriptor.debug ? descriptor.debug.placeholderNote || "" : "",
    majorProjectCapstoneFallbackReason: reason || "",
    renderedObjectCount: 0,
    pooledObjectCount: 0
  };
}
