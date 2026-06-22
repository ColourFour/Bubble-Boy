import * as THREE from "three";

import { FIRE_PIT_ID, FOOD_ROUTINE_ID } from "../simulation/worldState.js";

export function createFoodRoutinePresentationProp() {
  const group = new THREE.Group();
  group.name = "foodRoutine_group";
  group.userData.type = "presentationFamily";
  group.userData.family = FOOD_ROUTINE_ID;

  const materials = createFoodRoutineMaterials();
  const cookSurface = createCookSurface(materials);
  const foodBasket = createFoodBasket(materials);
  const storedMeals = createStoredMeals(materials);
  const dryingRack = createDryingRack(materials);
  const fishHarvestDisplay = createFishHarvestDisplay(materials);
  const leftovers = createLeftovers(materials);

  group.add(
    cookSurface.group,
    foodBasket.group,
    storedMeals.group,
    dryingRack.group,
    fishHarvestDisplay.group,
    leftovers.group
  );
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    cookSurface,
    foodBasket,
    storedMeals,
    dryingRack,
    fishHarvestDisplay,
    leftovers
  };
}

export function syncFoodRoutinePresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, FOOD_ROUTINE_ID);
  if (!prop || !prop.group) return hiddenFoodRoutineTrace(descriptor, "food routine prop missing");

  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  const visible = Boolean(descriptor && descriptor.visible);
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenFoodRoutineTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = foodRoutineAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const cookSurfaceVisible = syncFoodSubProp(prop.cookSurface.group, subProps.cookSurface, anchor, { x: 0.08, z: 0.82 }, context);
  const foodBasketVisible = syncFoodSubProp(prop.foodBasket.group, subProps.foodBasket, anchor, { x: -0.42, z: 2.10 }, context);
  const storedMealsVisible = syncFoodSubProp(prop.storedMeals.group, subProps.storedMeals, anchor, { x: -1.04, z: 2.00 }, context);
  const dryingRackVisible = syncFoodSubProp(prop.dryingRack.group, subProps.dryingRack, anchor, { x: 1.22, z: 0.78 }, context);
  const fishHarvestDisplayVisible = syncFoodSubProp(
    prop.fishHarvestDisplay.group,
    subProps.fishHarvestDisplay,
    anchor,
    { x: 0.68, z: 1.56 },
    context
  );
  const leftoversVisible = syncFoodSubProp(prop.leftovers.group, subProps.leftovers, anchor, { x: -0.22, z: 1.42 }, context);

  const basketStock = Number(subProps.foodBasket && subProps.foodBasket.itemCount || 0);
  const mealCount = Number(subProps.storedMeals && subProps.storedMeals.count || 0);
  const driedFishCount = Number(subProps.dryingRack && subProps.dryingRack.count || 0);
  const harvestCount = Number(subProps.fishHarvestDisplay && subProps.fishHarvestDisplay.count || 0);
  const leftoverCount = Number(subProps.leftovers && subProps.leftovers.count || 0);

  syncVisibleChildren(prop.foodBasket.items, basketStock);
  syncVisibleChildren(prop.storedMeals.meals, mealCount);
  syncVisibleChildren(prop.dryingRack.fish, driedFishCount);
  syncVisibleChildren(prop.fishHarvestDisplay.items, harvestCount);
  syncVisibleChildren(prop.leftovers.crumbs, leftoverCount);

  const pulse = 1 + Math.sin((context.time || 0) * 1.7) * 0.004;
  if (cookSurfaceVisible) prop.cookSurface.pot.scale.set(pulse, 1, pulse);
  if (dryingRackVisible) prop.dryingRack.rack.rotation.z = Math.sin((context.time || 0) * 1.1) * 0.006;

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const renderedPropCount = [
    cookSurfaceVisible,
    foodBasketVisible,
    storedMealsVisible,
    dryingRackVisible,
    fishHarvestDisplayVisible,
    leftoversVisible
  ].filter(Boolean).length;

  return {
    id: FOOD_ROUTINE_ID,
    visible: true,
    foodRoutineVisible: true,
    foodRoutineStage: descriptor ? descriptor.stage || "" : "",
    foodRoutineVariant: descriptor ? descriptor.variant || "" : "",
    foodRoutineActive: Boolean(descriptor && descriptor.active),
    foodRoutineCookSurfaceVisible: cookSurfaceVisible,
    foodRoutineBasketVisible: foodBasketVisible,
    foodRoutineStoredMealsVisible: storedMealsVisible,
    foodRoutineDryingRackVisible: dryingRackVisible,
    foodRoutineFishHarvestVisible: fishHarvestDisplayVisible,
    foodRoutineLeftoversVisible: leftoversVisible,
    foodRoutineBasketStock: basketStock,
    foodRoutineMealCount: mealCount,
    foodRoutineDriedFishCount: driedFishCount,
    foodRoutineHarvestCount: harvestCount,
    foodRoutineLeftoverCount: leftoverCount,
    foodRoutineAssetSourceId: source.id || "",
    foodRoutineAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    foodRoutineTransformId: transform ? transform.id || "" : "",
    foodRoutineTransformNormalized: Boolean(transform),
    foodRoutineWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    foodRoutineDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    foodRoutineFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: renderedPropCount
  };
}

export function normalizeFoodRoutineAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createFoodRoutineMaterials() {
  const standard = (color, roughness = 0.86, options = {}) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...options });
  };
  return {
    pot: standard(0x4f5a5a, 0.70),
    potDark: standard(0x303939, 0.76),
    soup: new THREE.MeshBasicMaterial({ color: 0xd57b45, transparent: true, opacity: 0.86 }),
    wood: standard(0x8c5b34, 0.88),
    rope: standard(0xc5a46f, 0.92),
    basket: standard(0xb77a3e, 0.88),
    basketDark: standard(0x7b4d2a, 0.90),
    mealWrap: standard(0xd9c08a, 0.86),
    mealLid: standard(0x7ea0a1, 0.82),
    fish: standard(0x5fb4c7, 0.78),
    fishBelly: standard(0xd9ece6, 0.72),
    carrot: standard(0xef7d37, 0.80),
    berry: standard(0xc9445a, 0.76),
    leafy: standard(0x65a856, 0.84),
    plate: standard(0xe5d7b8, 0.74),
    crumbs: standard(0xb8844a, 0.88),
    shadow: new THREE.MeshBasicMaterial({ color: 0x3f2f23, transparent: true, opacity: 0.30, depthWrite: false })
  };
}

function createCookSurface(materials) {
  const group = new THREE.Group();
  group.name = "foodRoutine_cookSurface";
  group.userData.subPropId = "cookSurface";

  const stones = new THREE.Group();
  stones.name = "foodRoutine_cookSurface_stones";
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2 + 0.20;
    const stone = new THREE.Mesh(new THREE.IcosahedronGeometry(0.10, 0), materials.potDark);
    stone.name = `foodRoutine_cookStone_${i + 1}`;
    stone.position.set(Math.cos(angle) * 0.32, 0.08, Math.sin(angle) * 0.25);
    stone.scale.set(1.2, 0.62, 0.92);
    stones.add(stone);
  }

  const grill = new THREE.Group();
  grill.name = "foodRoutine_grillSlats";
  for (let i = 0; i < 3; i += 1) {
    grill.add(createCylinder(`foodRoutine_grillSlat_${i + 1}`, 0.018, 0.018, 0.64, 8, materials.potDark, [0, 0.24, -0.16 + i * 0.16], [0, 0, Math.PI / 2]));
  }

  const pot = new THREE.Group();
  pot.name = "foodRoutine_cookPot";
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.30, 12, 1, true), materials.pot);
  body.name = "foodRoutine_cookPot_body";
  body.position.set(0, 0.42, 0);
  const soup = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.018, 12), materials.soup);
  soup.name = "foodRoutine_cookPot_soup";
  soup.position.set(0, 0.58, 0);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.018, 8, 14), materials.potDark);
  rim.name = "foodRoutine_cookPot_rim";
  rim.position.set(0, 0.585, 0);
  rim.rotation.x = Math.PI / 2;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.014, 8, 12, Math.PI), materials.potDark);
  handle.name = "foodRoutine_cookPot_handle";
  handle.position.set(0, 0.62, -0.03);
  handle.rotation.set(Math.PI / 2, 0, 0);
  pot.add(body, soup, rim, handle);

  group.add(stones, grill, pot);
  return { group, pot };
}

function createFoodBasket(materials) {
  const group = new THREE.Group();
  group.name = "foodRoutine_foodBasket";
  group.userData.subPropId = "foodBasket";
  group.add(
    createBox("foodRoutine_basket_base", [0.54, 0.08, 0.36], [0, 0.08, 0], materials.basketDark),
    createBox("foodRoutine_basket_front", [0.60, 0.20, 0.045], [0, 0.21, 0.20], materials.basket),
    createBox("foodRoutine_basket_back", [0.60, 0.20, 0.045], [0, 0.21, -0.20], materials.basket),
    createBox("foodRoutine_basket_left", [0.045, 0.20, 0.42], [-0.32, 0.21, 0], materials.basket),
    createBox("foodRoutine_basket_right", [0.045, 0.20, 0.42], [0.32, 0.21, 0], materials.basket)
  );
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.018, 8, 14, Math.PI), materials.basketDark);
  handle.name = "foodRoutine_basket_handle";
  handle.position.set(0, 0.36, 0);
  handle.rotation.set(0, 0, Math.PI);
  group.add(handle);

  const items = [
    createHarvestPiece("foodRoutine_basket_carrot", materials.carrot, [-0.18, 0.34, 0.02], "carrot"),
    createHarvestPiece("foodRoutine_basket_leafy", materials.leafy, [0.02, 0.34, -0.04], "leafy"),
    createHarvestPiece("foodRoutine_basket_berry", materials.berry, [0.18, 0.34, 0.04], "berry"),
    createHarvestPiece("foodRoutine_basket_second_carrot", materials.carrot, [0.10, 0.39, 0.10], "carrot"),
    createHarvestPiece("foodRoutine_basket_second_leafy", materials.leafy, [-0.06, 0.40, 0.08], "leafy")
  ];
  for (const item of items) group.add(item);
  return { group, items };
}

function createStoredMeals(materials) {
  const group = new THREE.Group();
  group.name = "foodRoutine_storedMeals";
  group.userData.subPropId = "storedMeals";
  const mat = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.50, 0.035, 12), materials.shadow);
  mat.name = "foodRoutine_storedMeals_groundMat";
  mat.position.set(0, 0.04, 0);
  mat.scale.set(1, 0.34, 0.68);
  group.add(mat);
  const meals = [
    createStoredMeal("foodRoutine_meal_one", materials, [-0.24, 0.16, 0.00], 0.00),
    createStoredMeal("foodRoutine_meal_two", materials, [0.02, 0.18, -0.07], 0.16),
    createStoredMeal("foodRoutine_meal_three", materials, [0.24, 0.15, 0.06], -0.22),
    createStoredMeal("foodRoutine_meal_four", materials, [0.05, 0.34, 0.02], 0.34)
  ];
  for (const meal of meals) group.add(meal);
  return { group, meals };
}

function createDryingRack(materials) {
  const group = new THREE.Group();
  group.name = "foodRoutine_dryingRack";
  group.userData.subPropId = "dryingRack";
  const rack = new THREE.Group();
  rack.name = "foodRoutine_dryingRack_frame";
  rack.add(
    createCylinder("foodRoutine_dryingRack_leftPost", 0.035, 0.045, 1.02, 8, materials.wood, [-0.36, 0.50, 0], [0.08, 0, 0.16]),
    createCylinder("foodRoutine_dryingRack_rightPost", 0.035, 0.045, 1.02, 8, materials.wood, [0.36, 0.50, 0], [-0.08, 0, -0.16]),
    createCylinder("foodRoutine_dryingRack_topBar", 0.028, 0.028, 0.86, 8, materials.wood, [0, 0.96, 0], [0, 0, Math.PI / 2]),
    createCylinder("foodRoutine_dryingRack_lowBar", 0.022, 0.022, 0.72, 8, materials.rope, [0, 0.64, 0], [0, 0, Math.PI / 2])
  );
  const fish = [
    createHangingFish("foodRoutine_dryingFish_one", materials, [-0.24, 0.66, 0.02]),
    createHangingFish("foodRoutine_dryingFish_two", materials, [-0.08, 0.64, -0.02]),
    createHangingFish("foodRoutine_dryingFish_three", materials, [0.10, 0.66, 0.02]),
    createHangingFish("foodRoutine_dryingFish_four", materials, [0.26, 0.64, -0.02])
  ];
  for (const item of fish) rack.add(item);
  group.add(rack);
  return { group, rack, fish };
}

function createFishHarvestDisplay(materials) {
  const group = new THREE.Group();
  group.name = "foodRoutine_fishHarvestDisplay";
  group.userData.subPropId = "fishHarvestDisplay";
  group.add(createBox("foodRoutine_display_leafMat", [0.90, 0.035, 0.46], [0, 0.045, 0], materials.leafy, [0.02, 0.10, 0]));
  const items = [
    createFish("foodRoutine_display_fish_one", materials, [-0.25, 0.13, -0.05], 0.14),
    createFish("foodRoutine_display_fish_two", materials, [0.20, 0.13, 0.05], -0.22),
    createHarvestPiece("foodRoutine_display_carrot", materials.carrot, [-0.02, 0.15, 0.13], "carrot"),
    createHarvestPiece("foodRoutine_display_leafy", materials.leafy, [0.36, 0.14, -0.12], "leafy"),
    createHarvestPiece("foodRoutine_display_berry", materials.berry, [-0.42, 0.14, 0.10], "berry")
  ];
  for (const item of items) group.add(item);
  return { group, items };
}

function createLeftovers(materials) {
  const group = new THREE.Group();
  group.name = "foodRoutine_leftovers";
  group.userData.subPropId = "leftovers";
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.035, 14), materials.plate);
  plate.name = "foodRoutine_leftovers_plate";
  plate.position.set(0, 0.065, 0);
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.11, 12, 1, true), materials.mealLid);
  bowl.name = "foodRoutine_leftovers_bowl";
  bowl.position.set(-0.04, 0.14, 0.02);
  const crumbs = [
    createBox("foodRoutine_leftover_crumb_one", [0.06, 0.025, 0.04], [0.10, 0.105, 0.05], materials.crumbs, [0, 0.20, 0]),
    createBox("foodRoutine_leftover_crumb_two", [0.045, 0.022, 0.04], [-0.02, 0.20, 0.02], materials.carrot, [0.10, -0.18, 0]),
    createBox("foodRoutine_leftover_crumb_three", [0.055, 0.020, 0.05], [-0.12, 0.105, -0.06], materials.leafy, [0.02, 0.48, 0])
  ];
  group.add(plate, bowl, ...crumbs);
  return { group, crumbs };
}

function createStoredMeal(name, materials, position, yaw) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  group.rotation.y = yaw;
  group.add(
    createBox(`${name}_wrap`, [0.24, 0.12, 0.18], [0, 0, 0], materials.mealWrap, [0.02, 0, 0.02]),
    createBox(`${name}_tie`, [0.27, 0.025, 0.05], [0, 0.07, 0], materials.rope),
    createBox(`${name}_lid`, [0.18, 0.035, 0.14], [0, 0.095, 0], materials.mealLid)
  );
  return group;
}

function createHangingFish(name, materials, position) {
  const group = createFish(name, materials, position, Math.PI / 2);
  group.add(createCylinder(`${name}_tie`, 0.006, 0.006, 0.18, 6, materials.rope, [0, 0.13, 0], [0, 0, 0]));
  return group;
}

function createFish(name, materials, position, yaw) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  group.rotation.y = yaw;
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 6), materials.fish);
  body.name = `${name}_body`;
  body.scale.set(1.55, 0.48, 0.78);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 5), materials.fishBelly);
  belly.name = `${name}_belly`;
  belly.position.set(0.02, -0.025, 0.01);
  belly.scale.set(1.25, 0.26, 0.38);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.16, 3), materials.fish);
  tail.name = `${name}_tail`;
  tail.position.set(-0.19, 0, 0);
  tail.rotation.z = Math.PI / 2;
  group.add(body, belly, tail);
  return group;
}

function createHarvestPiece(name, material, position, type) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  if (type === "carrot") {
    const root = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.20, 8), material);
    root.name = `${name}_root`;
    root.rotation.z = Math.PI;
    const tops = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.10, 6), new THREE.MeshStandardMaterial({ color: 0x65a856, roughness: 0.84, metalness: 0 }));
    tops.name = `${name}_tops`;
    tops.position.y = 0.10;
    group.add(root, tops);
  } else if (type === "berry") {
    for (let i = 0; i < 3; i += 1) {
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), material);
      berry.name = `${name}_berry_${i + 1}`;
      berry.position.set((i - 1) * 0.052, (i % 2) * 0.035, i === 1 ? 0.034 : 0);
      group.add(berry);
    }
  } else {
    for (let i = 0; i < 3; i += 1) {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.035, 0.08), material);
      leaf.name = `${name}_leaf_${i + 1}`;
      leaf.position.set(Math.cos(i * 2.1) * 0.04, i * 0.018, Math.sin(i * 2.1) * 0.04);
      leaf.rotation.set(0.18, i * 2.1, 0.20);
      group.add(leaf);
    }
  }
  return group;
}

function createBox(name, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
  mesh.name = name;
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
  return mesh;
}

function createCylinder(name, radiusTop, radiusBottom, height, segments, material, position, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.name = name;
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
  return mesh;
}

function syncFoodSubProp(group, subProp, anchor, offset, context) {
  if (!group || !subProp || !subProp.visible) {
    if (group) group.visible = false;
    return false;
  }
  group.visible = true;
  placeFoodRoutineSubProp(group, anchor, offset, subProp.transform, context);
  return true;
}

function placeFoodRoutineSubProp(group, anchor, offset, transform, context) {
  const yaw = Number(anchor.yaw || 0);
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const localX = Number(offset.x || 0);
  const localZ = Number(offset.z || 0);
  const x = Number(anchor.x || 0) + localX * cos - localZ * sin;
  const z = Number(anchor.z || 0) + localX * sin + localZ * cos;
  const groundHeightAt = typeof context.groundHeightAt === "function" ? context.groundHeightAt : () => 0;
  const groundOffset = Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : 0;
  const rotation = transform && Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  const scale = transform && Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  group.position.set(x, groundHeightAt(x, z) + groundOffset, z);
  group.rotation.set(Number(rotation[0]) || 0, yaw + (Number(rotation[1]) || 0), Number(rotation[2]) || 0);
  group.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
}

function syncVisibleChildren(children, count) {
  if (!Array.isArray(children)) return;
  const visibleCount = Math.min(children.length, Math.max(0, Math.ceil(Number(count || 0))));
  children.forEach((child, index) => {
    child.visible = index < visibleCount;
  });
}

function foodRoutineAnchor(worldState) {
  const firePit = worldState && worldState.objects ? worldState.objects[FIRE_PIT_ID] || {} : {};
  const position = firePit.position || {};
  return {
    x: Number.isFinite(position.x) ? position.x : 0,
    y: Number.isFinite(position.y) ? position.y : 0,
    z: Number.isFinite(position.z) ? position.z : -0.16,
    yaw: Number.isFinite(firePit.yaw) ? firePit.yaw : 0
  };
}

function descriptorByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function hiddenFoodRoutineTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: FOOD_ROUTINE_ID,
    visible: false,
    foodRoutineVisible: false,
    foodRoutineStage: descriptor ? descriptor.stage || "" : "",
    foodRoutineVariant: descriptor ? descriptor.variant || "" : "",
    foodRoutineActive: Boolean(descriptor && descriptor.active),
    foodRoutineCookSurfaceVisible: false,
    foodRoutineBasketVisible: false,
    foodRoutineStoredMealsVisible: false,
    foodRoutineDryingRackVisible: false,
    foodRoutineFishHarvestVisible: false,
    foodRoutineLeftoversVisible: false,
    foodRoutineBasketStock: 0,
    foodRoutineMealCount: 0,
    foodRoutineDriedFishCount: 0,
    foodRoutineHarvestCount: 0,
    foodRoutineLeftoverCount: 0,
    foodRoutineAssetSourceId: source.id || "",
    foodRoutineAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    foodRoutineTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    foodRoutineTransformNormalized: Boolean(descriptor && descriptor.transform),
    foodRoutineWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    foodRoutineDuplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    foodRoutineFallbackReason: reason || "",
    renderedObjectCount: 0
  };
}
