import * as THREE from "three";

const MAX_GARDEN_PLOTS = 8;

export function createGardenPlotsPresentationProp() {
  const group = new THREE.Group();
  group.name = "gardenPlots_group";
  group.userData.type = "presentationFamily";
  group.userData.family = "gardenPlots";

  const materials = createGardenMaterials();
  const plots = Array.from({ length: MAX_GARDEN_PLOTS }, (_unused, index) => createGardenPlot(index, materials));
  const carriedWaterCan = createWateringCan(materials);
  const carriedCrop = createHarvestedCrop(materials);

  for (const plot of plots) group.add(plot.group);
  group.add(carriedWaterCan.group, carriedCrop.group);
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return { group, plots, carriedWaterCan, carriedCrop };
}

export function syncGardenPlotsPresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, "gardenPlots");
  if (!prop || !prop.group) return hiddenGardenTrace(descriptor, "garden plot prop missing");

  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  const plotSubProp = subProps.plots || {};
  const waterCanSubProp = subProps.waterCan || {};
  const cropSubProp = subProps.harvestedCrop || {};
  const plotItems = Array.isArray(plotSubProp.items) ? plotSubProp.items : [];
  const renderedPlotCount = syncPlotPool(prop.plots, plotItems, plotSubProp.transform, context);
  const carriedWaterCanVisible = syncCarriedGardenAttachment(
    prop.carriedWaterCan.group,
    waterCanSubProp,
    context,
    "waterCan"
  );
  const carriedHarvestedCropVisible = syncCarriedGardenAttachment(
    prop.carriedCrop.group,
    cropSubProp,
    context,
    "harvestedCropCarry"
  );

  prop.group.visible =
    renderedPlotCount > 0 ||
    carriedWaterCanVisible ||
    carriedHarvestedCropVisible ||
    Boolean(descriptor && descriptor.active);

  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const source = descriptor && descriptor.source ? descriptor.source : {};

  return {
    id: "gardenPlots",
    visible: prop.group.visible,
    gardenPlotsVisible: Boolean(descriptor && descriptor.visible),
    gardenPlotsStage: descriptor ? descriptor.stage || "" : "",
    gardenPlotsVariant: descriptor ? descriptor.variant || "" : "",
    gardenPlotsActive: Boolean(descriptor && descriptor.active),
    gardenActivePlotId: debug.activePlotId || "",
    gardenCropType: debug.cropType || "",
    gardenWatered: Boolean(debug.watered),
    gardenPlotCount: Number(debug.plotCount || plotItems.length || 0),
    gardenSeededPlotCount: Number(debug.seededPlotCount || 0),
    gardenSproutPlotCount: Number(debug.sproutPlotCount || 0),
    gardenMaturePlotCount: Number(debug.maturePlotCount || 0),
    gardenWateredPlotCount: Number(debug.wateredPlotCount || 0),
    gardenRenderedPlotCount: renderedPlotCount,
    carriedWaterCanVisible,
    carriedHarvestedCropVisible,
    carrying: context.worldState && context.worldState.bubbleBoy ? context.worldState.bubbleBoy.carrying || "" : "",
    gardenPlotsAssetSourceId: source.id || "",
    gardenPlotsAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    gardenPlotsTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    gardenPlotsTransformNormalized: Boolean(descriptor && descriptor.transform),
    gardenPlotsWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    gardenPlotsDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    gardenPlotsFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: renderedPlotCount + (carriedWaterCanVisible ? 1 : 0) + (carriedHarvestedCropVisible ? 1 : 0)
  };
}

export function normalizeGardenAsset(object, transform) {
  if (!object || !transform) return;
  const scale = transformScale(transform);
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(scale.x, scale.y, scale.z);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createGardenMaterials() {
  return {
    soil: new THREE.MeshStandardMaterial({ color: 0x6f4b32, roughness: 0.96, metalness: 0 }),
    furrow: new THREE.MeshStandardMaterial({ color: 0x4d3324, roughness: 0.98, metalness: 0 }),
    seed: new THREE.MeshStandardMaterial({ color: 0xd7b36c, roughness: 0.84, metalness: 0 }),
    stem: new THREE.MeshStandardMaterial({ color: 0x4d9a50, roughness: 0.86, metalness: 0 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x6fba5d, roughness: 0.84, metalness: 0 }),
    carrot: new THREE.MeshStandardMaterial({ color: 0xf07b32, roughness: 0.82, metalness: 0 }),
    berry: new THREE.MeshStandardMaterial({ color: 0xd94d68, roughness: 0.78, metalness: 0 }),
    water: new THREE.MeshBasicMaterial({ color: 0x74c7ef, transparent: true, opacity: 0.58, depthWrite: false }),
    can: new THREE.MeshStandardMaterial({ color: 0x6fb3c6, roughness: 0.72, metalness: 0 }),
    canDark: new THREE.MeshStandardMaterial({ color: 0x417b91, roughness: 0.78, metalness: 0 })
  };
}

function createGardenPlot(index, materials) {
  const group = new THREE.Group();
  group.name = `gardenPlot_${index + 1}`;
  group.visible = false;

  const soil = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.08, 0.82), materials.soil);
  soil.name = "gardenPlot_soil";
  soil.position.set(0, 0.04, 0);
  group.add(soil);

  const furrows = new THREE.Group();
  furrows.name = "gardenPlot_furrows";
  for (let i = 0; i < 4; i += 1) {
    const furrow = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.018, 0.045), materials.furrow);
    furrow.name = `gardenPlot_furrow_${i + 1}`;
    furrow.position.set(0, 0.09, -0.27 + i * 0.18);
    furrows.add(furrow);
  }
  group.add(furrows);

  const seeds = createSeedCluster(materials);
  const sprout1 = createSproutStage("gardenPlot_sprout1", materials, 0.24);
  const sprout2 = createSproutStage("gardenPlot_sprout2", materials, 0.46);
  const crop = createMatureCrop(materials);
  const watered = createWateredIndicator(materials);

  group.add(seeds, sprout1, sprout2, crop, watered);
  return { group, soil, furrows, seeds, sprout1, sprout2, crop, watered };
}

function createSeedCluster(materials) {
  const group = new THREE.Group();
  group.name = "gardenPlot_seeds";
  const positions = [
    [-0.30, 0.12, -0.12],
    [-0.10, 0.12, 0.09],
    [0.10, 0.12, -0.07],
    [0.30, 0.12, 0.12]
  ];
  for (let i = 0; i < positions.length; i += 1) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), materials.seed);
    seed.name = `gardenSeed_${i + 1}`;
    seed.position.set(...positions[i]);
    group.add(seed);
  }
  group.visible = false;
  return group;
}

function createSproutStage(name, materials, height) {
  const group = new THREE.Group();
  group.name = name;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, height, 7), materials.stem);
  stem.name = `${name}_stem`;
  stem.position.set(0, 0.12 + height * 0.5, 0);
  group.add(stem);

  const leafCount = height > 0.3 ? 4 : 2;
  for (let i = 0; i < leafCount; i += 1) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.07), materials.leaf);
    leaf.name = `${name}_leaf_${i + 1}`;
    leaf.position.set(Math.cos(i * Math.PI) * 0.08, 0.16 + height * 0.55 + (i % 2) * 0.05, Math.sin(i * Math.PI * 0.5) * 0.08);
    leaf.rotation.set(0.18, i * Math.PI * 0.5, 0.22);
    group.add(leaf);
  }
  group.visible = false;
  return group;
}

function createMatureCrop(materials) {
  const group = new THREE.Group();
  group.name = "gardenPlot_matureCrop";
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.54, 7), materials.stem);
  stem.name = "matureCrop_stem";
  stem.position.set(0, 0.36, 0);
  group.add(stem);

  for (let i = 0; i < 5; i += 1) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.045, 0.10), materials.leaf);
    leaf.name = `matureCrop_leaf_${i + 1}`;
    leaf.position.set(Math.cos(i * 1.257) * 0.10, 0.54 + (i % 2) * 0.04, Math.sin(i * 1.257) * 0.10);
    leaf.rotation.set(0.22, i * 1.257, 0.28);
    group.add(leaf);
  }

  const variants = new THREE.Group();
  variants.name = "matureCrop_variants";
  variants.add(createCarrotFruit(materials), createBerryFruit(materials), createLeafyFruit(materials));
  group.add(variants);
  group.visible = false;
  return group;
}

function createCarrotFruit(materials) {
  const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.30, 8), materials.carrot);
  carrot.name = "cropFruit_carrot";
  carrot.position.set(0, 0.74, 0);
  carrot.rotation.z = Math.PI;
  return carrot;
}

function createBerryFruit(materials) {
  const berry = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), materials.berry);
  berry.name = "cropFruit_berry";
  berry.position.set(0, 0.70, 0);
  return berry;
}

function createLeafyFruit(materials) {
  const leafy = new THREE.Group();
  leafy.name = "cropFruit_leafy";
  for (let i = 0; i < 3; i += 1) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.055, 0.11), materials.leaf);
    leaf.position.set(Math.cos(i * 2.1) * 0.06, 0.70, Math.sin(i * 2.1) * 0.06);
    leaf.rotation.set(0.32, i * 2.1, 0.12);
    leafy.add(leaf);
  }
  return leafy;
}

function createWateredIndicator(materials) {
  const group = new THREE.Group();
  group.name = "gardenPlot_wateredIndicator";
  const puddle = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.01, 16), materials.water);
  puddle.name = "gardenPlot_wateredPuddle";
  puddle.position.set(0, 0.115, 0);
  group.add(puddle);
  group.visible = false;
  return group;
}

function createWateringCan(materials) {
  const group = new THREE.Group();
  group.name = "gardenWaterCan_attachment";
  group.visible = false;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.38), materials.can);
  body.name = "gardenWaterCan_body";
  body.position.set(0, 0, 0);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.035, 8, 12), materials.canDark);
  handle.name = "gardenWaterCan_handle";
  handle.position.set(-0.32, 0.04, 0);
  handle.rotation.y = Math.PI / 2;
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 0.56, 8), materials.canDark);
  spout.name = "gardenWaterCan_spout";
  spout.position.set(0.42, 0.05, 0);
  spout.rotation.z = Math.PI / 2.8;
  const dropGroup = new THREE.Group();
  dropGroup.name = "gardenWaterCan_drops";
  for (let i = 0; i < 3; i += 1) {
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), materials.water);
    drop.name = `gardenWaterDrop_${i + 1}`;
    drop.position.set(0.64 + i * 0.08, -0.16 - i * 0.08, (i - 1) * 0.05);
    dropGroup.add(drop);
  }
  group.add(body, handle, spout, dropGroup);
  group.userData.dropGroup = dropGroup;
  return { group, dropGroup };
}

function createHarvestedCrop(materials) {
  const group = new THREE.Group();
  group.name = "gardenHarvestedCrop_attachment";
  group.visible = false;
  const crop = createCarrotFruit(materials);
  crop.name = "harvestedCrop_carrot";
  crop.position.set(0, 0.02, 0);
  const tops = createSproutStage("harvestedCrop_tops", materials, 0.20);
  tops.visible = true;
  tops.position.set(0, 0.08, 0);
  group.add(crop, tops);
  return { group };
}

function syncPlotPool(plots, items, transform, context) {
  const count = Math.min(plots.length, items.length);
  for (let i = 0; i < plots.length; i += 1) {
    const plot = plots[i];
    if (i >= count) {
      plot.group.visible = false;
      continue;
    }
    syncPlot(plot, items[i], transform, context, i);
  }
  return count;
}

function syncPlot(plot, item, transform, context, index) {
  const position = item && item.position ? item.position : {};
  const x = Number(position.x || 0);
  const z = Number(position.z || 0);
  const groundOffset = Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : 0.035;
  normalizeGardenAsset(plot.group, transform);
  plot.group.visible = true;
  plot.group.name = `${item.id || "gardenPlot"}_group`;
  plot.group.position.set(x, context.groundHeightAt(x, z) + groundOffset, z);
  plot.group.rotation.y = normalizedRotationY(transform) + index * 0.08;
  plot.seeds.visible = item.stage === "seeded";
  plot.sprout1.visible = item.stage === "sprout1";
  plot.sprout2.visible = item.stage === "sprout2";
  plot.crop.visible = item.stage === "grown";
  plot.watered.visible = Boolean(item.watered);
  syncCropVariant(plot.crop, item.cropType || item.variant || "carrot");
}

function syncCropVariant(crop, cropType) {
  const variants = crop.getObjectByName("matureCrop_variants");
  if (!variants) return;
  for (const child of variants.children) {
    child.visible =
      (cropType === "berry" && child.name === "cropFruit_berry") ||
      (cropType === "leafy" && child.name === "cropFruit_leafy") ||
      ((cropType === "carrot" || !cropType) && child.name === "cropFruit_carrot");
  }
}

function syncCarriedGardenAttachment(group, descriptor, context, attachmentId) {
  const attachment = context.presentationState && context.presentationState.attachment ? context.presentationState.attachment : null;
  const visible = Boolean(descriptor && descriptor.visible && attachment && attachment.id === attachmentId);
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
    x + Math.cos(facing) * 0.24 - Math.sin(facing) * 0.30,
    context.groundHeightAt(x, z) + 0.62 + Math.sin(context.time * 3.2) * 0.01,
    z - Math.sin(facing) * 0.24 - Math.cos(facing) * 0.30
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

function hiddenGardenTrace(descriptor, fallbackReason) {
  return {
    id: "gardenPlots",
    visible: false,
    gardenPlotsVisible: false,
    gardenPlotsStage: descriptor ? descriptor.stage || "" : "",
    gardenPlotsVariant: descriptor ? descriptor.variant || "" : "",
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

function normalizedRotationY(transform) {
  const rotation = transform && Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  return Number(rotation[1]) || 0;
}
