import * as THREE from "three";

import { MUSIC_ART_DECOR_ID } from "../simulation/worldState.js";

const DEFAULT_ANCHOR = Object.freeze({ x: -1.42, y: 0.18, z: -0.92, yaw: 0.22 });
const DEFAULT_HANGING_ANCHOR = Object.freeze({ x: -1.86, y: 0.18, z: -1.30, yaw: 0.08 });
const DEFAULT_PERFORMANCE_ANCHOR = Object.freeze({ x: -1.12, y: 0.18, z: -0.54, yaw: -0.16 });
const MAX_STONES = 6;
const MAX_NOTES = 5;
const MAX_HANGING_DECOR = 2;

const STONE_LAYOUT = Object.freeze([
  [-0.46, -0.12, 0.18, 0.82],
  [-0.22, 0.14, -0.06, 1.08],
  [0.06, -0.10, 0.12, 0.94],
  [0.30, 0.12, -0.14, 0.76],
  [0.52, -0.04, 0.12, 0.70],
  [-0.04, 0.34, -0.18, 0.66]
]);

const NOTE_LAYOUT = Object.freeze([
  [-0.46, 0.62, -0.20, 0.18],
  [-0.18, 0.82, 0.08, -0.24],
  [0.14, 0.68, -0.10, 0.34],
  [0.42, 0.92, 0.12, -0.14],
  [0.02, 1.04, 0.30, 0.10]
]);

const yAxis = new THREE.Vector3(0, 1, 0);
const scratchStart = new THREE.Vector3();
const scratchEnd = new THREE.Vector3();
const scratchDirection = new THREE.Vector3();

export function createMusicArtDecorPresentationProp() {
  const group = new THREE.Group();
  group.name = "musicArtDecor_group";
  group.userData.type = "presentationFamily";
  group.userData.family = MUSIC_ART_DECOR_ID;

  const materials = createMusicArtMaterials();
  const shellChime = createShellChime(materials);
  const paintedStones = createPaintedStones(materials);
  const drumFlute = createDrumFlute(materials);
  const hangingDecoration = createHangingDecoration(materials);
  const artDisplaySlot = createArtDisplaySlot(materials);
  const performanceMarker = createPerformanceMarker(materials);
  const noteMarkers = createStaticNoteMarkers(materials);
  const carriedAttachments = createCarriedMusicArtAttachments(materials);

  group.add(
    performanceMarker.group,
    paintedStones.group,
    artDisplaySlot.group,
    drumFlute.group,
    shellChime.group,
    hangingDecoration.group,
    noteMarkers.group,
    carriedAttachments.group
  );
  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return {
    group,
    shellChime,
    paintedStones,
    drumFlute,
    hangingDecoration,
    artDisplaySlot,
    performanceMarker,
    noteMarkers,
    carriedAttachments
  };
}

export function syncMusicArtDecorPresentationProp(prop, context) {
  const descriptor = descriptorByFamily(context.presentationState, MUSIC_ART_DECOR_ID);
  if (!prop || !prop.group) return hiddenMusicArtDecorTrace(descriptor, "music art decor prop missing");

  const visible = Boolean(descriptor && descriptor.visible);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  if (!visible) {
    prop.group.visible = false;
    for (const child of prop.group.children) child.visible = false;
    return hiddenMusicArtDecorTrace(
      descriptor,
      descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "descriptor hidden" : "descriptor hidden"
    );
  }

  const anchor = musicArtAnchor(context.worldState);
  const hangingAnchor = musicArtHangingAnchor(context.worldState);
  const performanceAnchor = musicArtPerformanceAnchor(context.worldState);
  prop.group.visible = true;
  prop.group.position.set(0, 0, 0);
  prop.group.rotation.set(0, 0, 0);
  prop.group.scale.set(1, 1, 1);

  const performanceMarkerCount = syncPerformanceMarker(
    prop.performanceMarker,
    subProps.performanceMarker,
    performanceAnchor,
    context
  );
  const paintedStoneCount = syncPaintedStones(prop.paintedStones, subProps.paintedStones, anchor, context);
  const artDisplaySlotCount = syncArtDisplaySlot(prop.artDisplaySlot, subProps.artDisplaySlot, anchor, context);
  const drumFluteCounts = syncDrumFlute(prop.drumFlute, subProps.drumFlute, anchor, context);
  const shellChimeCount = syncShellChime(prop.shellChime, subProps.shellChime, hangingAnchor, context);
  const hangingDecorationCount = syncHangingDecoration(
    prop.hangingDecoration,
    subProps.hangingDecoration,
    hangingAnchor,
    context
  );
  const noteMarkerCount = syncStaticNoteMarkers(prop.noteMarkers, subProps.noteMarkers, performanceAnchor, context);
  const carriedAttachmentCount = syncCarriedMusicArtAttachments(prop.carriedAttachments, context);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const debug = descriptor && descriptor.debug ? descriptor.debug : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const carried = prop.carriedAttachments || {};
  const pooledObjectCount =
    performanceMarkerCount +
    paintedStoneCount +
    artDisplaySlotCount +
    drumFluteCounts.drumCount +
    drumFluteCounts.fluteCount +
    shellChimeCount +
    hangingDecorationCount +
    noteMarkerCount +
    carriedAttachmentCount;

  return {
    id: MUSIC_ART_DECOR_ID,
    visible: true,
    musicArtDecorVisible: true,
    musicArtDecorStage: descriptor ? descriptor.stage || "" : "",
    musicArtDecorVariant: descriptor ? descriptor.variant || "" : "",
    musicArtDecorActive: Boolean(descriptor && descriptor.active),
    musicArtDecorShellChimeVisible: shellChimeCount > 0,
    musicArtDecorPaintedStonesVisible: paintedStoneCount > 0,
    musicArtDecorDrumVisible: drumFluteCounts.drumCount > 0,
    musicArtDecorFluteVisible: drumFluteCounts.fluteCount > 0,
    musicArtDecorHangingDecorationVisible: hangingDecorationCount > 0,
    musicArtDecorArtDisplaySlotVisible: artDisplaySlotCount > 0,
    musicArtDecorPerformanceMarkerVisible: performanceMarkerCount > 0,
    musicArtDecorNoteMarkersVisible: noteMarkerCount > 0,
    musicArtDecorCarriedStoneVisible: Boolean(carried.carriedStone && carried.carriedStone.visible),
    musicArtDecorCarriedDecorationVisible: Boolean(carried.carriedDecoration && carried.carriedDecoration.visible),
    musicArtDecorCarriedShellChimeVisible: Boolean(carried.carriedShellChime && carried.carriedShellChime.visible),
    musicArtDecorCarriedDrumStickVisible: Boolean(carried.carriedDrumStick && carried.carriedDrumStick.visible),
    musicArtDecorCarriedFluteVisible: Boolean(carried.carriedFlute && carried.carriedFlute.visible),
    musicArtDecorShellChimeCount: shellChimeCount,
    musicArtDecorPaintedStoneCount: paintedStoneCount,
    musicArtDecorDrumCount: drumFluteCounts.drumCount,
    musicArtDecorFluteCount: drumFluteCounts.fluteCount,
    musicArtDecorHangingDecorationCount: hangingDecorationCount,
    musicArtDecorArtDisplaySlotCount: artDisplaySlotCount,
    musicArtDecorPerformanceMarkerCount: performanceMarkerCount,
    musicArtDecorNoteMarkerCount: noteMarkerCount,
    musicArtDecorCarriedAttachmentCount: carriedAttachmentCount,
    musicArtDecorAssetSourceId: source.id || "",
    musicArtDecorAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    musicArtDecorTransformId: transform ? transform.id || "" : "",
    musicArtDecorTransformNormalized: Boolean(transform),
    musicArtDecorWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    musicArtDecorDuplicateSystemClassification: debug.duplicateSystemClassification || "",
    musicArtDecorPlaceholderNote: debug.placeholderNote || "",
    musicArtDecorParticlePerformanceNote: debug.particlePerformanceNote || "",
    musicArtDecorFallbackReason: debug.fallbackReason || "",
    renderedObjectCount: pooledObjectCount,
    staticMarkerPoolSize: MAX_NOTES
  };
}

export function normalizeMusicArtDecorAsset(object, transform) {
  if (!object || !transform) return;
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  object.rotation.set(Number(rotation[0]) || 0, Number(rotation[1]) || 0, Number(rotation[2]) || 0);
}

function createMusicArtMaterials() {
  const standard = (color, roughness = 0.82, options = {}) => new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
    emissive: color,
    emissiveIntensity: 0.05,
    ...options
  });
  return {
    wood: standard(0x956843, 0.90),
    darkWood: standard(0x5d402d, 0.92),
    rope: standard(0xd0b274, 0.90),
    shellCream: standard(0xe7d7b0, 0.82),
    shellPink: standard(0xd69a86, 0.80),
    stone: standard(0x6f7673, 0.90),
    stoneDark: standard(0x434b4d, 0.94),
    paintRed: standard(0xd65b4c, 0.78),
    paintBlue: standard(0x4f84bd, 0.78),
    paintGold: standard(0xe6bf55, 0.74),
    paintGreen: standard(0x6ca861, 0.80),
    drumBody: standard(0x9a5b3e, 0.82),
    drumSkin: standard(0xe8d9b6, 0.76),
    flute: standard(0xc89f59, 0.84),
    leaf: standard(0x4f8d67, 0.84),
    clothBlue: standard(0x486fb0, 0.80),
    marker: standard(0xf0c15a, 0.70),
    note: standard(0xf3d778, 0.70),
    noteBlue: standard(0x6ab0c8, 0.76),
    shadow: new THREE.MeshBasicMaterial({ color: 0x2b261e, transparent: true, opacity: 0.18, depthWrite: false })
  };
}

function createShellChime(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_shellChime";
  group.userData.subPropId = "shellChime";
  group.visible = false;

  const leftPost = createLineCylinder("Shell chime left post", [-0.36, 0.04, 0], [-0.34, 1.26, 0], 0.030, materials.darkWood);
  const rightPost = createLineCylinder("Shell chime right post", [0.36, 0.04, 0], [0.34, 1.24, 0], 0.030, materials.darkWood);
  const crossbar = createLineCylinder("Shell chime crossbar", [-0.48, 1.18, 0], [0.48, 1.22, 0], 0.026, materials.wood);
  group.add(leftPost, rightPost, crossbar);

  const shellGeometry = new THREE.SphereGeometry(0.075, 8, 5);
  const shells = [];
  const offsets = [-0.30, -0.10, 0.12, 0.32];
  offsets.forEach((x, index) => {
    const top = [x, 1.16, 0.01];
    const bottom = [x + (index % 2 === 0 ? -0.03 : 0.03), 0.72 - index * 0.035, 0.02];
    group.add(createLineCylinder("Shell chime cord", top, bottom, 0.006, materials.rope));
    const shell = new THREE.Mesh(shellGeometry, index % 2 === 0 ? materials.shellCream : materials.shellPink);
    shell.name = "Shell chime shell";
    shell.position.set(bottom[0], bottom[1] - 0.03, bottom[2]);
    shell.scale.set(1.0, 0.42, 0.72);
    shell.rotation.set(0.12, index * 0.36, 0.08);
    group.add(shell);
    shells.push(shell);
  });

  return { group, shells };
}

function createPaintedStones(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_paintedStones";
  group.userData.subPropId = "paintedStones";
  group.visible = false;

  const stones = [];
  const paintMaterials = [materials.paintRed, materials.paintBlue, materials.paintGold, materials.paintGreen];
  for (let index = 0; index < MAX_STONES; index += 1) {
    const layout = STONE_LAYOUT[index];
    const stone = new THREE.Group();
    stone.name = "Painted stone";
    stone.position.set(layout[0], 0.06, layout[1]);
    stone.rotation.y = layout[3];
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 5), materials.stone);
    body.name = "Painted stone body";
    body.scale.set(1.15, 0.36, 0.82);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.014, 0.026), paintMaterials[index % paintMaterials.length]);
    stripe.name = "Painted stone mark";
    stripe.position.set(0, 0.055, 0);
    stripe.rotation.y = index % 2 === 0 ? 0.12 : -0.32;
    stone.add(body, stripe);
    group.add(stone);
    stones.push(stone);
  }

  return { group, stones };
}

function createDrumFlute(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_drumFlute";
  group.userData.subPropId = "drumFlute";
  group.visible = false;

  const drum = new THREE.Group();
  drum.name = "Small hand drum";
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.28, 12), materials.drumBody);
  body.name = "Drum body";
  body.rotation.x = Math.PI / 2;
  const skinFront = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.020, 12), materials.drumSkin);
  skinFront.name = "Drum front skin";
  skinFront.position.z = 0.15;
  skinFront.rotation.x = Math.PI / 2;
  const skinBack = skinFront.clone();
  skinBack.name = "Drum back skin";
  skinBack.position.z = -0.15;
  drum.add(body, skinFront, skinBack);
  drum.position.set(-0.18, 0.20, 0.02);
  drum.rotation.set(0.18, -0.34, 0.08);
  group.add(drum);

  const flute = new THREE.Group();
  flute.name = "Small flute";
  const fluteBody = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.62, 10), materials.flute);
  fluteBody.name = "Flute body";
  fluteBody.rotation.z = Math.PI / 2;
  fluteBody.position.set(0.18, 0.16, -0.14);
  fluteBody.rotation.y = -0.24;
  flute.add(fluteBody);
  const holeGeometry = new THREE.CylinderGeometry(0.011, 0.011, 0.005, 8);
  for (let index = 0; index < 4; index += 1) {
    const hole = new THREE.Mesh(holeGeometry, materials.stoneDark);
    hole.name = "Flute finger hole";
    hole.position.set(-0.02 + index * 0.10, 0.164, -0.14);
    hole.rotation.x = Math.PI / 2;
    flute.add(hole);
  }
  group.add(flute);

  return { group, drum, flute };
}

function createHangingDecoration(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_hangingDecoration";
  group.userData.subPropId = "hangingDecoration";
  group.visible = false;

  const decorations = [];
  for (let index = 0; index < MAX_HANGING_DECOR; index += 1) {
    const deco = new THREE.Group();
    deco.name = "Hanging decoration strand";
    deco.position.set(index === 0 ? -0.22 : 0.28, 0, index === 0 ? 0.12 : -0.08);
    const cord = createLineCylinder("Hanging decoration cord", [0, 1.08, 0], [0, 0.42, 0], 0.006, materials.rope);
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), index === 0 ? materials.paintBlue : materials.paintGold);
    bead.name = "Hanging decoration bead";
    bead.position.set(0, 0.72, 0);
    const pennant = new THREE.Mesh(createTriangleGeometry([0, 0.56, 0], [-0.08, 0.38, 0], [0.08, 0.38, 0]), index === 0 ? materials.leaf : materials.clothBlue);
    pennant.name = "Hanging decoration pennant";
    pennant.position.z = 0.006;
    deco.add(cord, bead, pennant);
    group.add(deco);
    decorations.push(deco);
  }

  return { group, decorations };
}

function createArtDisplaySlot(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_artDisplaySlot";
  group.userData.subPropId = "artDisplaySlot";
  group.visible = false;

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.36, 0.035), materials.wood);
  back.name = "Art display backing";
  back.position.set(0, 0.42, 0);
  back.rotation.x = -0.18;
  group.add(back);
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.055, 0.16), materials.darkWood);
  shelf.name = "Art display shelf";
  shelf.position.set(0, 0.19, 0.08);
  group.add(shelf);
  const leftLeg = createLineCylinder("Art display left leg", [-0.20, 0.06, 0.08], [-0.10, 0.32, 0], 0.018, materials.darkWood);
  const rightLeg = createLineCylinder("Art display right leg", [0.20, 0.06, 0.08], [0.10, 0.32, 0], 0.018, materials.darkWood);
  group.add(leftLeg, rightLeg);
  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.040, 0.018), materials.paintBlue);
  mark.name = "Art display painted mark";
  mark.position.set(0, 0.44, 0.024);
  mark.rotation.z = 0.50;
  group.add(mark);

  return { group };
}

function createPerformanceMarker(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_performanceMarker";
  group.userData.subPropId = "performanceMarker";
  group.visible = false;

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.014, 6, 28), materials.marker);
  ring.name = "Dusk performance marker ring";
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.035;
  group.add(ring);

  const center = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.055, 10), materials.darkWood);
  center.name = "Performance center marker";
  center.position.set(0, 0.055, 0);
  group.add(center);

  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 8), materials.note);
  lantern.name = "Tiny dusk marker lantern";
  lantern.position.set(0.36, 0.13, -0.18);
  group.add(lantern);

  const shadow = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.60, 0.012, 24), materials.shadow);
  shadow.name = "Performance marker soft shadow";
  shadow.position.y = 0.008;
  group.add(shadow);

  return { group };
}

function createStaticNoteMarkers(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_staticNoteMarkers";
  group.userData.subPropId = "noteMarkers";
  group.visible = false;

  const notes = [];
  for (let index = 0; index < MAX_NOTES; index += 1) {
    const note = new THREE.Group();
    note.name = "Static music-note marker";
    const layout = NOTE_LAYOUT[index];
    note.position.set(layout[0], layout[1], layout[2]);
    note.rotation.y = layout[3];
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.28, 6), index % 2 === 0 ? materials.note : materials.noteBlue);
    stem.name = "Static note stem";
    stem.position.set(0.04, 0.11, 0);
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), index % 2 === 0 ? materials.note : materials.noteBlue);
    bead.name = "Static note bead";
    bead.position.set(-0.02, -0.03, 0);
    bead.scale.set(1.2, 0.82, 0.9);
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.026, 0.012), index % 2 === 0 ? materials.note : materials.noteBlue);
    flag.name = "Static note flag";
    flag.position.set(0.09, 0.24, 0);
    flag.rotation.z = -0.26;
    note.add(stem, bead, flag);
    group.add(note);
    notes.push(note);
  }

  return { group, notes };
}

function createCarriedMusicArtAttachments(materials) {
  const group = new THREE.Group();
  group.name = "musicArtDecor_carriedAttachments";
  group.userData.subPropId = "carriedAttachments";
  group.visible = false;

  const carriedStone = new THREE.Group();
  carriedStone.name = "Carried painted stone attachment";
  carriedStone.userData.attachmentId = "paintedStoneCarry";
  const stoneBody = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 5), materials.stone);
  stoneBody.name = "Carried painted stone body";
  stoneBody.scale.set(1.18, 0.42, 0.82);
  const stonePaint = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.032), materials.paintBlue);
  stonePaint.name = "Carried painted stone mark";
  stonePaint.position.y = 0.055;
  stonePaint.rotation.y = -0.28;
  carriedStone.add(stoneBody, stonePaint);

  const carriedDecoration = new THREE.Group();
  carriedDecoration.name = "Carried decoration attachment";
  carriedDecoration.userData.attachmentId = "musicDecorationCarry";
  const decorationCord = createLineCylinder("Carried decoration cord", [0, 0.16, 0], [0, -0.18, 0], 0.007, materials.rope);
  const decorationBead = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), materials.paintGold);
  decorationBead.name = "Carried decoration bead";
  decorationBead.position.y = -0.02;
  const decorationPennant = new THREE.Mesh(
    createTriangleGeometry([0, -0.04, 0.004], [-0.08, -0.20, 0.004], [0.08, -0.20, 0.004]),
    materials.clothBlue
  );
  decorationPennant.name = "Carried decoration pennant";
  carriedDecoration.add(decorationCord, decorationBead, decorationPennant);

  const carriedShellChime = new THREE.Group();
  carriedShellChime.name = "Carried shell chime attachment";
  carriedShellChime.userData.attachmentId = "shellChimeCarry";
  carriedShellChime.add(createLineCylinder("Carried shell chime crossbar", [-0.18, 0.18, 0], [0.18, 0.18, 0], 0.012, materials.wood));
  for (const [x, material] of [[-0.12, materials.shellCream], [0.02, materials.shellPink], [0.14, materials.shellCream]]) {
    carriedShellChime.add(createLineCylinder("Carried shell chime cord", [x, 0.17, 0], [x, -0.10, 0], 0.004, materials.rope));
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 5), material);
    shell.name = "Carried shell chime shell";
    shell.position.set(x, -0.13, 0);
    shell.scale.set(1.0, 0.45, 0.72);
    carriedShellChime.add(shell);
  }

  const carriedDrumStick = new THREE.Group();
  carriedDrumStick.name = "Carried drum stick attachment";
  carriedDrumStick.userData.attachmentId = "drumStickCarry";
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.017, 0.46, 8), materials.wood);
  stick.name = "Carried rhythm stick";
  stick.rotation.z = Math.PI / 2;
  const stickTip = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), materials.drumSkin);
  stickTip.name = "Carried rhythm stick tip";
  stickTip.position.x = 0.24;
  carriedDrumStick.add(stick, stickTip);

  const carriedFlute = new THREE.Group();
  carriedFlute.name = "Carried flute attachment";
  carriedFlute.userData.attachmentId = "fluteCarry";
  const fluteBody = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.58, 10), materials.flute);
  fluteBody.name = "Carried flute body";
  fluteBody.rotation.z = Math.PI / 2;
  carriedFlute.add(fluteBody);
  const holeGeometry = new THREE.CylinderGeometry(0.009, 0.009, 0.004, 8);
  for (let index = 0; index < 4; index += 1) {
    const hole = new THREE.Mesh(holeGeometry, materials.stoneDark);
    hole.name = "Carried flute finger hole";
    hole.position.set(-0.14 + index * 0.08, 0.024, 0);
    hole.rotation.x = Math.PI / 2;
    carriedFlute.add(hole);
  }

  group.add(carriedStone, carriedDecoration, carriedShellChime, carriedDrumStick, carriedFlute);
  return { group, carriedStone, carriedDecoration, carriedShellChime, carriedDrumStick, carriedFlute };
}

function syncCarriedMusicArtAttachments(carriedAttachments, context) {
  if (!carriedAttachments || !carriedAttachments.group) return 0;
  const attachment = context && context.presentationState ? context.presentationState.attachment : null;
  const boy = context && context.worldState && context.worldState.bubbleBoy ? context.worldState.bubbleBoy : {};
  const position = boy.position || {};
  const facing = finite(boy.facing, 0);
  const baseX = finite(position.x, 0);
  const baseZ = finite(position.z, 0);
  const baseY = groundY(context, baseX, baseZ, finite(position.y, 0.2));
  const time = context && Number.isFinite(context.time) ? context.time : 0;
  const forwardX = Math.sin(facing);
  const forwardZ = Math.cos(facing);
  const sideX = Math.cos(facing);
  const sideZ = -Math.sin(facing);
  const specs = [
    ["paintedStoneCarry", carriedAttachments.carriedStone, 0.30, 0.16, 0.61, -0.12, 0.035],
    ["musicDecorationCarry", carriedAttachments.carriedDecoration, 0.32, -0.02, 0.66, 0.10, 0.045],
    ["shellChimeCarry", carriedAttachments.carriedShellChime, 0.34, -0.02, 0.78, 0.04, 0.040],
    ["drumStickCarry", carriedAttachments.carriedDrumStick, 0.28, 0.18, 0.65, -0.18, 0.060],
    ["fluteCarry", carriedAttachments.carriedFlute, 0.30, 0.02, 0.70, -0.24, 0.025]
  ];
  let visibleCount = 0;
  for (const [id, group, forward, side, lift, yawOffset, bobScale] of specs) {
    const visible = Boolean(attachment && attachment.id === id);
    if (!group) continue;
    group.visible = visible;
    if (!visible) continue;
    const bob = Math.sin(time * (id === "drumStickCarry" ? 7.4 : 4.2) + side * 5.0) * bobScale;
    group.position.set(
      baseX + forwardX * forward + sideX * side,
      baseY + lift + bob,
      baseZ + forwardZ * forward + sideZ * side
    );
    group.rotation.set(
      0.08 + bob * 0.20,
      facing + yawOffset,
      id === "shellChimeCarry" || id === "musicDecorationCarry" ? Math.sin(time * 2.4) * 0.08 : 0
    );
    visibleCount += 1;
  }
  carriedAttachments.group.visible = visibleCount > 0;
  return visibleCount;
}

function syncShellChime(shellChime, descriptor, anchor, context) {
  const visible = Boolean(descriptor && descriptor.visible);
  shellChime.group.visible = visible;
  if (!visible) return 0;
  const x = anchor.x;
  const z = anchor.z;
  shellChime.group.position.set(x, groundY(context, x, z, anchor.y) + 0.035, z);
  shellChime.group.rotation.set(0, anchor.yaw - 0.18, 0);
  return 1;
}

function syncPaintedStones(paintedStones, descriptor, anchor, context) {
  const count = Math.min(MAX_STONES, Math.max(0, Number((descriptor && descriptor.count) || 0)));
  const visible = Boolean(descriptor && descriptor.visible && count > 0);
  paintedStones.group.visible = visible;
  for (let index = 0; index < paintedStones.stones.length; index += 1) {
    paintedStones.stones[index].visible = visible && index < count;
  }
  if (!visible) return 0;
  const x = anchor.x - 0.28;
  const z = anchor.z + 0.42;
  paintedStones.group.position.set(x, groundY(context, x, z, anchor.y) + 0.025, z);
  paintedStones.group.rotation.set(0, anchor.yaw + 0.12, 0);
  return count;
}

function syncDrumFlute(drumFlute, descriptor, anchor, context) {
  const drumCount = Math.min(1, Math.max(0, Number((descriptor && descriptor.drumCount) || 0)));
  const fluteCount = Math.min(1, Math.max(0, Number((descriptor && descriptor.fluteCount) || 0)));
  const visible = Boolean(descriptor && descriptor.visible && (drumCount > 0 || fluteCount > 0));
  drumFlute.group.visible = visible;
  drumFlute.drum.visible = visible && drumCount > 0;
  drumFlute.flute.visible = visible && fluteCount > 0;
  if (!visible) return { drumCount: 0, fluteCount: 0 };
  const x = anchor.x + 0.44;
  const z = anchor.z + 0.16;
  drumFlute.group.position.set(x, groundY(context, x, z, anchor.y) + 0.040, z);
  drumFlute.group.rotation.set(0, anchor.yaw - 0.32, 0);
  return { drumCount, fluteCount };
}

function syncHangingDecoration(hangingDecoration, descriptor, anchor, context) {
  const count = Math.min(MAX_HANGING_DECOR, Math.max(0, Number((descriptor && descriptor.count) || 0)));
  const visible = Boolean(descriptor && descriptor.visible && count > 0);
  hangingDecoration.group.visible = visible;
  for (let index = 0; index < hangingDecoration.decorations.length; index += 1) {
    hangingDecoration.decorations[index].visible = visible && index < count;
  }
  if (!visible) return 0;
  const x = anchor.x + 0.46;
  const z = anchor.z + 0.10;
  hangingDecoration.group.position.set(x, groundY(context, x, z, anchor.y) + 0.030, z);
  hangingDecoration.group.rotation.set(0, anchor.yaw + 0.20, 0);
  return count;
}

function syncArtDisplaySlot(artDisplaySlot, descriptor, anchor, context) {
  const visible = Boolean(descriptor && descriptor.visible);
  artDisplaySlot.group.visible = visible;
  if (!visible) return 0;
  const x = anchor.x - 0.70;
  const z = anchor.z - 0.16;
  artDisplaySlot.group.position.set(x, groundY(context, x, z, anchor.y) + 0.035, z);
  artDisplaySlot.group.rotation.set(0, anchor.yaw + 0.28, 0);
  return 1;
}

function syncPerformanceMarker(performanceMarker, descriptor, anchor, context) {
  const visible = Boolean(descriptor && descriptor.visible);
  performanceMarker.group.visible = visible;
  if (!visible) return 0;
  const x = anchor.x;
  const z = anchor.z;
  performanceMarker.group.position.set(x, groundY(context, x, z, anchor.y) + 0.015, z);
  performanceMarker.group.rotation.set(0, anchor.yaw, 0);
  return 1;
}

function syncStaticNoteMarkers(noteMarkers, descriptor, anchor, context) {
  const count = Math.min(MAX_NOTES, Math.max(0, Number((descriptor && descriptor.count) || 0)));
  const visible = Boolean(descriptor && descriptor.visible && count > 0);
  noteMarkers.group.visible = visible;
  for (let index = 0; index < noteMarkers.notes.length; index += 1) {
    noteMarkers.notes[index].visible = visible && index < count;
  }
  if (!visible) return 0;
  const x = anchor.x;
  const z = anchor.z;
  noteMarkers.group.position.set(x, groundY(context, x, z, anchor.y) + 0.04, z);
  noteMarkers.group.rotation.set(0, anchor.yaw, 0);
  return count;
}

function musicArtAnchor(worldState) {
  const state = worldState && worldState.musicArtDecor ? worldState.musicArtDecor : {};
  const position = state.anchorPosition || {};
  return {
    x: finite(position.x, DEFAULT_ANCHOR.x),
    y: finite(position.y, DEFAULT_ANCHOR.y),
    z: finite(position.z, DEFAULT_ANCHOR.z),
    yaw: finite(state.yaw, DEFAULT_ANCHOR.yaw)
  };
}

function musicArtHangingAnchor(worldState) {
  const state = worldState && worldState.musicArtDecor ? worldState.musicArtDecor : {};
  const position = state.hangingAnchorPosition || {};
  return {
    x: finite(position.x, DEFAULT_HANGING_ANCHOR.x),
    y: finite(position.y, DEFAULT_HANGING_ANCHOR.y),
    z: finite(position.z, DEFAULT_HANGING_ANCHOR.z),
    yaw: finite(state.hangingYaw, DEFAULT_HANGING_ANCHOR.yaw)
  };
}

function musicArtPerformanceAnchor(worldState) {
  const state = worldState && worldState.musicArtDecor ? worldState.musicArtDecor : {};
  const position = state.performanceAnchorPosition || {};
  return {
    x: finite(position.x, DEFAULT_PERFORMANCE_ANCHOR.x),
    y: finite(position.y, DEFAULT_PERFORMANCE_ANCHOR.y),
    z: finite(position.z, DEFAULT_PERFORMANCE_ANCHOR.z),
    yaw: finite(state.performanceYaw, DEFAULT_PERFORMANCE_ANCHOR.yaw)
  };
}

function groundY(context, x, z, fallback) {
  if (context && typeof context.groundHeightAt === "function") {
    return context.groundHeightAt(x, z);
  }
  return Number.isFinite(fallback) ? fallback : 0.18;
}

function hiddenMusicArtDecorTrace(descriptor, reason) {
  const source = descriptor && descriptor.source ? descriptor.source : {};
  return {
    id: MUSIC_ART_DECOR_ID,
    visible: false,
    musicArtDecorVisible: false,
    musicArtDecorStage: descriptor ? descriptor.stage || "" : "",
    musicArtDecorVariant: descriptor ? descriptor.variant || "" : "",
    musicArtDecorActive: Boolean(descriptor && descriptor.active),
    musicArtDecorShellChimeVisible: false,
    musicArtDecorPaintedStonesVisible: false,
    musicArtDecorDrumVisible: false,
    musicArtDecorFluteVisible: false,
    musicArtDecorHangingDecorationVisible: false,
    musicArtDecorArtDisplaySlotVisible: false,
    musicArtDecorPerformanceMarkerVisible: false,
    musicArtDecorNoteMarkersVisible: false,
    musicArtDecorCarriedStoneVisible: false,
    musicArtDecorCarriedDecorationVisible: false,
    musicArtDecorCarriedShellChimeVisible: false,
    musicArtDecorCarriedDrumStickVisible: false,
    musicArtDecorCarriedFluteVisible: false,
    musicArtDecorShellChimeCount: 0,
    musicArtDecorPaintedStoneCount: 0,
    musicArtDecorDrumCount: 0,
    musicArtDecorFluteCount: 0,
    musicArtDecorHangingDecorationCount: 0,
    musicArtDecorArtDisplaySlotCount: 0,
    musicArtDecorPerformanceMarkerCount: 0,
    musicArtDecorNoteMarkerCount: 0,
    musicArtDecorCarriedAttachmentCount: 0,
    musicArtDecorAssetSourceId: source.id || "",
    musicArtDecorAssetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    musicArtDecorTransformId: descriptor && descriptor.transform ? descriptor.transform.id || "" : "",
    musicArtDecorTransformNormalized: Boolean(descriptor && descriptor.transform),
    musicArtDecorWorldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    musicArtDecorDuplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    musicArtDecorPlaceholderNote: descriptor && descriptor.debug ? descriptor.debug.placeholderNote || "" : "",
    musicArtDecorParticlePerformanceNote: descriptor && descriptor.debug
      ? descriptor.debug.particlePerformanceNote || ""
      : "",
    musicArtDecorFallbackReason: reason || "",
    renderedObjectCount: 0,
    staticMarkerPoolSize: MAX_NOTES
  };
}

function descriptorByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function createLineCylinder(name, start, end, radius, material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 6), material);
  mesh.name = name;
  scratchStart.set(start[0], start[1], start[2]);
  scratchEnd.set(end[0], end[1], end[2]);
  scratchDirection.copy(scratchEnd).sub(scratchStart);
  const length = Math.max(0.001, scratchDirection.length());
  scratchDirection.normalize();
  mesh.position.copy(scratchStart).add(scratchEnd).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(yAxis, scratchDirection);
  mesh.scale.set(1, length, 1);
  return mesh;
}

function createTriangleGeometry(a, b, c) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

function finite(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}
