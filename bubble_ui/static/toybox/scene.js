import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Water } from "three/addons/objects/Water.js";

import { createPhysicsWorld } from "/static/toybox_physics.js";
import { initializeAudio } from "/static/toybox/audio/audioInit.js";
import { updateAudio } from "/static/toybox/audio/audioSystem.js";
import { createCameraController } from "/static/toybox/controls.js";
import { createDebugController } from "/static/toybox/debug.js";
import { characterAnchors } from "/static/toybox/character.js";
import {
  createCampLayoutPresentationProp,
  syncCampLayoutPresentationProp
} from "/static/toybox/assets/campLayout.js";
import {
  createGardenPlotsPresentationProp,
  syncGardenPlotsPresentationProp
} from "/static/toybox/assets/gardenPlots.js";
import {
  createFoodRoutinePresentationProp,
  syncFoodRoutinePresentationProp
} from "/static/toybox/assets/foodRoutine.js";
import {
  createFishTrapRoutinePresentationProp,
  syncFishTrapRoutinePresentationProp
} from "/static/toybox/assets/fishTrapRoutine.js";
import {
  createToyPlaySetPresentationProp,
  syncToyPlaySetPresentationProp
} from "/static/toybox/assets/toyPlaySet.js";
import {
  createMusicArtDecorPresentationProp,
  syncMusicArtDecorPresentationProp
} from "/static/toybox/assets/musicArtDecor.js";
import {
  createAnimalFamiliarVisitorPresentationProp,
  syncAnimalFamiliarVisitorPresentationProp
} from "/static/toybox/assets/animalFamiliarVisitor.js";
import {
  createNightComfortLightsPresentationProp,
  syncNightComfortLightsPresentationProp
} from "/static/toybox/assets/nightComfortLights.js";
import {
  createLookoutMapHorizonPresentationProp,
  syncLookoutMapHorizonPresentationProp
} from "/static/toybox/assets/lookoutMapHorizon.js";
import {
  createMajorProjectCapstonePresentationProp,
  syncMajorProjectCapstonePresentationProp
} from "/static/toybox/assets/majorProjectCapstone.js";
import {
  createAmbientBeachFindsPresentationProp,
  syncAmbientBeachFindsPresentationProp
} from "/static/toybox/assets/ambientBeachFinds.js";
import {
  createPierShoreWorkSitePresentationProp,
  syncPierShoreWorkSitePresentationProp
} from "/static/toybox/assets/pierShoreWorkSite.js";
import {
  createRaftBoatRoutePresentationProp,
  syncRaftBoatRoutePresentationProp
} from "/static/toybox/assets/raftBoatRoute.js";
import { createIntentCollector } from "/static/toybox/input/intent.js";
import { installPostOverlay } from "/static/toybox/materials.js";
import { resolveToyboxPresentationState } from "/static/toybox/presentation/presentationState.js";
import {
  TOYBOX_REVIEW_DEFAULT_STATE,
  applyToyboxReviewCameraPreset,
  applyToyboxReviewState,
  isToyboxReviewHost,
  normalizeReviewFamily,
  normalizeReviewState,
  readToyboxReviewConfig
} from "/static/toybox/reviewMode.js";
import { activeCelestialSourceFromIntensities, simulate } from "/static/toybox/simulation/simulate.js";
import {
  ARRIVAL_SUPPLIES_ID,
  BED_BUILD_SITE_ID,
  BUILD_SITE_ID,
  BUILDABLE_IDS,
  BUILDABLE_REGISTRY,
  BUILDABLE_SEQUENCE,
  BUILDER_TREE_IDS,
  CAMP_STORAGE_ID,
  FIRE_PIT_ID,
  REST_SHELTER_ID,
  STORAGE_WORKBENCH_TOOLS_ID,
  WORKBENCH_ID,
  buildableObjectId,
  createInitialWorldState
} from "/static/toybox/simulation/worldState.js";
import { terrainConfig } from "/static/toybox/terrain.js";

const TAU = Math.PI * 2;
const WORLD_RADIUS_SCALE = terrainConfig.worldRadiusScale;
const PLAYABLE_RADIUS = terrainConfig.playableRadius;
const BUBBLE_RING_RADIUS = Math.max(PLAYABLE_RADIUS * 4.45, 156);
const BUBBLE_RADIUS = BUBBLE_RING_RADIUS;
const OCEAN_RADIUS = Math.max(terrainConfig.farWaterRadius * 1.9, BUBBLE_RADIUS * 2.9, 460);
const PLANET_RADIUS = Math.max(OCEAN_RADIUS * 2.1, 980);
const WATER_LEVEL = terrainConfig.islandOffsetY;
const CELESTIAL_HORIZON_Y = 1.8;
const CAMERA_TARGET_FLOOR_OFFSET = 0.35;
const CAMERA_EYE_FLOOR_OFFSET = 0.32;
const FOLLOW_CAMERA_TARGET_HEIGHT = 1.22;
const FOLLOW_CAMERA_DEFAULT_DISTANCE = 8.4;
const FOLLOW_CAMERA_MIN_DISTANCE = 5.4;
const FOLLOW_CAMERA_MAX_DISTANCE = 13.5;
const FOLLOW_CAMERA_DEFAULT_PHI = 1.14;
const FOLLOW_CAMERA_MIN_PHI = 0.82;
const FOLLOW_CAMERA_MAX_PHI = 1.38;
const FOLLOW_CAMERA_TARGET_SMOOTHING = 8.0;
const FOLLOW_CAMERA_HEADING_SMOOTHING = 4.2;
const CAMERA_OCCLUSION_FADED_OPACITY = 0.34;
const CAMERA_OCCLUSION_FADE_SMOOTHING = 13.0;
const CAMERA_OCCLUSION_RESTORE_EPSILON = 0.025;
const CAMERA_OCCLUSION_MAX_BLOCKERS = 12;
const CARDINAL_CONVENTION = "Y=up; North=-Z; South=+Z; East=+X; West=-X";
const NORTH = Object.freeze([0, 0, -1]);
const SOUTH = Object.freeze([0, 0, 1]);
const EAST = Object.freeze([1, 0, 0]);
const WEST = Object.freeze([-1, 0, 0]);
const ROBOT_EXPRESSIVE_URL = "/static/toybox/assets/characters/RobotExpressive.glb";
const HUMANOID_TARGET_HEIGHT = 1.48;
const HUMANOID_IDLE_SPEED_THRESHOLD = 0.025;
const HUMANOID_RUN_SPEED_THRESHOLD = 0.78;
const HUMANOID_STATE_STABLE_FRAMES = 3;
const HUMANOID_STUCK_WARNING_FRAMES = 12;
const HUMANOID_BASE_CLIPS = Object.freeze({
  Idle: ["Idle", "Standing", "Sitting"],
  Sitting: ["Sitting", "Idle"],
  Walking: ["Walking", "WalkJump"],
  Running: ["Running", "Walking"]
});
const HUMANOID_EMOTE_CLIPS = Object.freeze({
  Jump: ["Jump", "WalkJump"],
  Yes: ["Yes"],
  No: ["No"],
  Wave: ["Wave"],
  Punch: ["Punch"],
  ThumbsUp: ["ThumbsUp"],
  Sitting: ["Sitting"],
  Standing: ["Standing"]
});
const HUMANOID_ACTION_EMOTES = Object.freeze({
  play: "Jump",
  surprise: "Yes",
  stretch: "ThumbsUp",
  celebrate: "ThumbsUp",
  wave: "Wave",
  punch: "Punch",
  yes: "Yes",
  no: "No",
  jump: "Jump",
  foraging: "Sitting",
  fishing: "Punch",
  castfishingline: "Punch",
  waitfishing: "Standing",
  reelfishingline: "Punch",
  catchreaction: "ThumbsUp",
  fishfrompier: "Punch",
  setfishtrap: "Punch",
  checkfishtrap: "Punch",
  collectcatch: "Punch",
  hangcatchdryingrack: "Punch",
  cookingfish: "Punch",
  eatingfish: "ThumbsUp",
  lightfire: "Punch",
  tendfire: "Punch",
  kneelatfire: "Punch",
  warmhands: "Punch",
  addfuel: "Punch",
  fanfire: "Punch",
  stokefire: "Punch",
  cookfish: "Punch",
  cookmeal: "Punch",
  stirpot: "Punch",
  holdfood: "ThumbsUp",
  eatfood: "ThumbsUp",
  gatheringwood: "Punch",
  gather: "Punch",
  gatherloosesupplies: "Punch",
  bendpickup: "Punch",
  pickupmaterial: "Punch",
  carry: "Walking",
  building: "Punch",
  construct: "Punch",
  hammerstrike: "Punch",
  tieropevines: "Punch",
  placeplank: "Punch",
  pushpostupright: "Punch",
  carvetool: "Punch",
  inspectprogress: "Yes",
  repairshelter: "Punch",
  reinforceshelter: "Punch",
  sortmaterials: "Punch",
  depositstorage: "Punch",
  withdrawstorage: "Punch",
  tidycamp: "Punch",
  sitnearfire: "Sitting",
  restinsideshelter: "Sitting",
  inspectcamplayout: "Yes",
  depositmaterial: "Punch",
  depositmaterials: "Punch",
  setitemdown: "Punch",
  craftatworkbench: "Punch",
  inspecttool: "ThumbsUp",
  rakepath: "Punch",
  clearpath: "Punch",
  sweepleaves: "Punch",
  placeboundarystone: "Punch",
  kneelmarkzone: "Punch",
  walkroute: "Walking",
  walkinspectroute: "Walking",
  diggardenplot: "Punch",
  plantseed: "Punch",
  patsoil: "Punch",
  waterplot: "Punch",
  inspectsprout: "Yes",
  harvestcrop: "Punch",
  carryharvest: "Walking",
  storeharvest: "Punch",
  prepmeal: "Punch",
  carryraftlog: "Walking",
  lashraft: "Punch",
  pushraft: "Punch",
  boardraft: "Punch",
  sitaboardraft: "Sitting",
  standaboardraft: "Standing",
  paddleraft: "Punch",
  lookoutfromraft: "Yes",
  disembarkraft: "Punch",
  returncelebrate: "ThumbsUp",
  crafttoy: "Punch",
  placetoy: "Punch",
  playblocks: "Punch",
  hopplay: "Jump",
  kickball: "Jump",
  tossball: "Punch",
  launchkite: "Punch",
  holdkite: "Standing",
  spintop: "Punch",
  puttoyaway: "Punch",
  planting: "Punch",
  watering: "Punch",
  harvesting: "Punch",
  inspectinggarden: "Yes",
  inspect: "Yes",
  arrivelookaround: "Yes",
  orienttoisland: "Yes",
  respondtoplayer: "Wave",
  inspectobject: "Yes",
  pointnotice: "Wave",
  smallsurprise: "Yes",
  quietcelebrate: "ThumbsUp",
  sitrestspot: "Sitting",
  settleintohammock: "Sitting",
  settleintobed: "Sitting",
  liedown: "Sitting",
  sleeploop: "Sitting",
  sleep: "Sitting",
  usebed: "Sitting",
  wake: "ThumbsUp",
  wakestretch: "ThumbsUp",
  standupfromrest: "Standing",
  playtoy: "Jump",
  celebrate: "ThumbsUp"
});
const OCEAN_FISH_COUNT = 18;
const OCEAN_FISH_SHORE_CLEARANCE = 4.8;
const OCEAN_FISH_INNER_BAND = 2.8;
const OCEAN_FISH_OUTER_RADIUS = Math.min(OCEAN_RADIUS - 18, BUBBLE_RING_RADIUS - 8);
const FISHING_CAST_DISTANCE = 82;
const FISHING_CATCH_RADIUS = 6.5;
const FISHING_SHORE_RADIUS = 8.5;
const FISHING_LINE_SECONDS = 1.8;
const FISHING_AUTONOMOUS_CAST_COOLDOWN = 3.2;
const ARRIVAL_SUPPLIES_ANCHOR = Object.freeze({ x: -6.45, z: 3.85, yaw: -0.42 });

const fallbackState = {
  mood: "curious",
  weather: "clear",
  time_of_day: "dawn",
  camera_mode: "slow_orbit",
  speech: "A new day, a new adventure!",
  objects: []
};

const scratchColor = new THREE.Color();
let bubbleBoyHumanoid = null;

export async function bootToybox() {
  "use strict";
  window.__toyboxBoot = "started";
  window.__toyboxFrameCount = 0;
  window.__toyboxLastError = "";

  const toyboxState = readState();
  let worldState = createInitialWorldState({ toyboxState });
  const reviewConfig = readToyboxReviewConfig();
  if (reviewConfig.enabled) {
    worldState = applyToyboxReviewState(worldState, reviewConfig.family, reviewConfig.state);
  }
  let presentationState = resolveToyboxPresentationState(worldState);
  const reviewLock = {
    active: reviewConfig.enabled,
    family: reviewConfig.family,
    state: reviewConfig.state
  };
  let simulationAccumulator = 0;
  const maxSimulationFrameDelta = 0.25;
  const maxSimulationTicksPerFrame = 12;

  window.__toyboxSim = {
    get state() {
      return worldState;
    }
  };
  window.__toyboxPresentation = presentationState;

  const speech = document.getElementById("toybox-speech");
  if (speech) speech.textContent = toyboxState.speech || fallbackState.speech;
  const toyboxMeta = document.getElementById("toybox-meta");
  const metaMood = toyboxState.mood || "unknown mood";
  const metaWeather = toyboxState.weather || "unknown weather";
  let lastMetaPhase = "";
  function syncToyboxMeta(phase) {
    if (!toyboxMeta || phase === lastMetaPhase) return;
    lastMetaPhase = phase;
    toyboxMeta.textContent = [metaMood, metaWeather, phase || "unknown time"].join(" / ");
  }
  syncToyboxMeta(toyboxState.time_of_day || fallbackState.time_of_day);

  const canvas = document.getElementById("toybox-canvas");
  installPostOverlay(canvas);

  let renderer;
  try {
    THREE.ColorManagement.enabled = true;
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: true,
      powerPreference: "high-performance"
    });
  } catch (error) {
    showRendererError(error);
    return;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.42;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x071423, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x111a26, 0.014);

  const camera3d = new THREE.PerspectiveCamera(51, 1, 0.1, OCEAN_RADIUS * 1.45);
  camera3d.name = "Toybox camera";

  const env = createEnvironmentState();
  syncEnvironmentFromWorldState(env, worldState);

  const cameraController = createCameraController(canvas, {
    groundHeightAt,
    floorHeightAt: groundHeightAt,
    floorOffset: CAMERA_TARGET_FLOOR_OFFSET,
    clampTarget: (target) => clampVectorToBubbleInterior(target, BUBBLE_RADIUS - 10),
    speed: 7.2,
    smoothing: 7.5,
    minDistance: 1.4,
    maxDistance: BUBBLE_RADIUS * 0.78
  });
  const cameraState = cameraController.camera;
  cameraController.setCameraMode("follow");
  cameraState.theta = followCameraTheta(worldState.bubbleBoy);
  cameraState.phi = FOLLOW_CAMERA_DEFAULT_PHI;
  cameraState.distance = FOLLOW_CAMERA_DEFAULT_DISTANCE;
  cameraState.target = resolveBubbleBoyCameraTarget(worldState, [0, 0, 0]);
  cameraState.desiredTarget = cameraState.target.slice();

  const intentCollector = createIntentCollector({
    camera: cameraState,
    pressedKeys: cameraController.pressedKeys
  });

  const cameraToggle = document.getElementById("toybox-camera-toggle");
  const cameraHint = document.getElementById("toybox-controls-hint");
  function setCameraMode(mode) {
    const nextMode = cameraController.setCameraMode(mode);
    cameraState.desiredTarget = cameraState.target.slice();
    syncCameraModeUi();
    return nextMode;
  }
  function syncCameraModeUi() {
    const follow = cameraState.cameraMode === "follow";
    canvas.dataset.cameraMode = cameraState.cameraMode;
    if (cameraToggle) {
      cameraToggle.textContent = follow ? "Follow BB" : "Free Cam";
      cameraToggle.setAttribute("aria-pressed", String(follow));
      cameraToggle.title = follow ? "Switch to free camera controls" : "Follow Bubble Boy";
    }
    if (cameraHint) {
      cameraHint.innerHTML = follow
        ? "Camera: Follow BB<br />Toggle for free WASD"
        : "Free camera<br />Move: WASD / Arrows";
    }
  }
  if (cameraToggle) {
    cameraToggle.addEventListener("click", () => {
      setCameraMode(cameraState.cameraMode === "follow" ? "manual" : "follow");
    });
  }
  syncCameraModeUi();

  window.__toyboxCamera = {
    state: cameraState,
    get mode() {
      return cameraState.cameraMode;
    },
    setMode(mode) {
      return setCameraMode(mode);
    },
    toggleFollow() {
      return this.setMode(cameraState.cameraMode === "follow" ? "manual" : "follow");
    }
  };
  if (reviewConfig.enabled) applyToyboxReviewCameraPreset(cameraState, reviewConfig.state, reviewConfig.family);

  const audioNodes = await initializeAudio();
  const audioCtx = audioNodes ? audioNodes.ctx : null;

  exposeOrientation(canvas);

  const sky = createSky();
  scene.add(sky);

  const stars = createStars();
  scene.add(stars.group);

  const clouds = createClouds();
  scene.add(clouds.group);

  const birds = createBirds();
  scene.add(birds.group);

  const celestialBodies = createCelestialBodies();
  scene.add(celestialBodies.group);

  const water = createWater();
  scene.add(water);

  const bubbleBoundary = createBubbleBoundary();
  scene.add(bubbleBoundary.group);

  const worldRoot = new THREE.Group();
  worldRoot.name = "Bubble Boy toybox Three.js scene";
  scene.add(worldRoot);

  const shoreShelf = new THREE.Mesh(createShoreShelfGeometry(), createShoreShelfMaterial());
  shoreShelf.name = "Sloped wet shoreline shelf";
  shoreShelf.receiveShadow = true;
  worldRoot.add(shoreShelf);

  const sand = new THREE.Mesh(createSandGeometry(), createSandMaterial());
  sand.name = "Low-poly sand island";
  sand.receiveShadow = true;
  worldRoot.add(sand);

  const shoreline = createShorelineFoam();
  shoreline.name = "Irregular shoreline foam";
  shoreline.renderOrder = 3;
  worldRoot.add(shoreline);

  const lighting = createLights(scene);
  const fire = createCampfire();
  worldRoot.add(fire.group);
  const arrivalSupplies = createArrivalSupplies();
  worldRoot.add(arrivalSupplies.group);
  const campLayout = createCampLayoutPresentationProp();
  worldRoot.add(campLayout.group);
  const gardenPlots = createGardenPlotsPresentationProp();
  worldRoot.add(gardenPlots.group);
  const foodRoutine = createFoodRoutinePresentationProp();
  worldRoot.add(foodRoutine.group);
  const fishTrapRoutine = createFishTrapRoutinePresentationProp();
  worldRoot.add(fishTrapRoutine.group);
  const toyPlaySet = createToyPlaySetPresentationProp();
  worldRoot.add(toyPlaySet.group);
  const musicArtDecor = createMusicArtDecorPresentationProp();
  worldRoot.add(musicArtDecor.group);
  const animalFamiliarVisitor = createAnimalFamiliarVisitorPresentationProp();
  worldRoot.add(animalFamiliarVisitor.group);
  const nightComfortLights = createNightComfortLightsPresentationProp();
  worldRoot.add(nightComfortLights.group);
  const lookoutMapHorizon = createLookoutMapHorizonPresentationProp();
  worldRoot.add(lookoutMapHorizon.group);
  const majorProjectCapstone = createMajorProjectCapstonePresentationProp();
  worldRoot.add(majorProjectCapstone.group);
  const ambientBeachFinds = createAmbientBeachFindsPresentationProp();
  worldRoot.add(ambientBeachFinds.group);
  const pierShoreWorkSite = createPierShoreWorkSitePresentationProp();
  worldRoot.add(pierShoreWorkSite.group);
  const raftBoatRoute = createRaftBoatRoutePresentationProp();
  worldRoot.add(raftBoatRoute.group);
  const builderObjects = createBuilderObjects();
  worldRoot.add(builderObjects.group);
  const cameraOcclusion = createCameraOcclusionController({
    scene,
    occluderRoot: builderObjects.group
  });
  const oceanLife = createOceanLife();
  worldRoot.add(oceanLife.group);

  const bubbleBoy = createBubbleBoy();
  worldRoot.add(bubbleBoy.group);
  const bubbleBoyHumanoidController = createBubbleBoyHumanoid({
    scene: worldRoot,
    THREE,
    existingPosition: bubbleBoy.group.position
  });
  const oceanInteraction = createOceanInteractionController({
    oceanLife,
    getWorldState: () => worldState
  });

  const debugGroup = createPhysicsDebugGroup();
  scene.add(debugGroup);

  let physics = null;
  let physicsStoneBody = null;
  let physicsStatus = "initializing";
  const physicsProbe = {
    position: [0.0, groundHeightAt(0, 0) + 1.0, 1.2],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  };

  try {
    physics = await createPhysicsWorld({ gravity: { x: 0, y: -9.81, z: 0 } });
    physics.addStaticCollider({
      name: "toybox-sand-foundation",
      position: [0, 0.03, 0],
      shape: { type: "cylinder", halfHeight: 0.20, radius: PLAYABLE_RADIUS },
      friction: 0.92,
      restitution: 0.03
    });
    physics.addStaticCollider({
      name: "camp-contact-pad",
      position: [0, 0.08, -0.02],
      shape: { type: "cuboid", halfExtents: [2.20, 0.14, 1.80] },
      friction: 0.96,
      restitution: 0.02
    });
    physicsStoneBody = physics.addDynamicBody({
      name: "invisible-physics-probe",
      mesh: physicsProbe,
      position: physicsProbe.position,
      shape: { type: "ball", radius: 0.18 },
      density: 1.6,
      friction: 0.86,
      restitution: 0.08,
      linearDamping: 0.12,
      angularDamping: 0.20,
      affectsWind: true,
      windArea: 0.035
    });
    physicsStatus = `${physics.engine} ${physics.version}`;
  } catch (error) {
    physicsStatus = "physics unavailable";
    physicsProbe.position = [0.0, groundHeightAt(0, 0) + 0.40, 1.2];
    console.warn("Toybox physics could not initialize.", error);
  }

  const debugToggle = document.getElementById("toybox-debug-toggle");
  const debugPanel = document.getElementById("toybox-debug-panel");
  const debugController = createDebugController({ toggle: debugToggle, panel: debugPanel });
  if (reviewConfig.enabled && reviewConfig.state === "debug" && debugToggle) debugToggle.click();

  if (isToyboxReviewHost()) {
    window.__toyboxReview = {
      setFamilyState(family, state = TOYBOX_REVIEW_DEFAULT_STATE) {
        reviewLock.active = true;
        reviewLock.family = normalizeReviewFamily(family);
        reviewLock.state = normalizeReviewState(state);
        worldState = applyToyboxReviewState(worldState, reviewLock.family, reviewLock.state);
        simulationAccumulator = 0;
        syncEnvironmentFromWorldState(env, worldState);
        presentationState = resolveToyboxPresentationState(worldState);
        window.__toyboxPresentation = presentationState;
        applyToyboxReviewCameraPreset(cameraState, reviewLock.state, reviewLock.family);
        syncCameraModeUi();
        return this.status();
      },
      clear() {
        reviewLock.active = false;
        reviewLock.state = "live";
        return this.status();
      },
      setCameraPreset(preset) {
        applyToyboxReviewCameraPreset(cameraState, preset, reviewLock.family);
        syncCameraModeUi();
        return this.status();
      },
      showDebug(visible = true) {
        if (!debugToggle || !debugPanel) return this.status();
        const pressed = debugToggle.getAttribute("aria-pressed") === "true";
        if (Boolean(visible) !== pressed) debugToggle.click();
        return this.status();
      },
      status() {
        return {
          enabled: reviewLock.active,
          family: reviewLock.family,
          state: reviewLock.state,
          presentationAction: presentationState ? presentationState.selectedAction : "",
          activeVisualFamilies: presentationState ? presentationState.activeVisualFamilies.slice() : []
        };
      }
    };
  }

  let lastRenderTime = 0;

  function resize() {
    const width = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
    const height = Math.max(1, canvas.clientHeight || window.innerHeight || 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera3d.aspect = width / Math.max(1, height);
    camera3d.updateProjectionMatrix();
  }

  function scheduleResize() {
    resize();
    window.requestAnimationFrame(resize);
  }

  window.__toyboxResize = resize;
  window.addEventListener("resize", scheduleResize, { passive: true });
  window.addEventListener("orientationchange", scheduleResize, { passive: true });
  window.addEventListener("fullscreenchange", scheduleResize);
  window.addEventListener("webkitfullscreenchange", scheduleResize);
  window.addEventListener("MSFullscreenChange", scheduleResize);
  window.addEventListener("toyboxresize", scheduleResize);
  resize();

  function advanceSimulation(frameDeltaSeconds, now) {
    if (reviewLock.active) {
      syncEnvironmentFromWorldState(env, worldState);
      presentationState = resolveToyboxPresentationState(worldState);
      if (typeof window !== "undefined") window.__toyboxPresentation = presentationState;
      return 0;
    }

    const clampedFrameDelta = Math.min(maxSimulationFrameDelta, Math.max(0, frameDeltaSeconds));
    simulationAccumulator += clampedFrameDelta;
    const fixedDt = worldState.sim.fixedDt || (1 / 60);
    const intents = intentCollector.collectIntents(now);
    let ticks = 0;

    while (simulationAccumulator >= fixedDt && ticks < maxSimulationTicksPerFrame) {
      worldState = simulate(fixedDt, worldState, intents);
      simulationAccumulator -= fixedDt;
      ticks += 1;
    }

    if (ticks >= maxSimulationTicksPerFrame) simulationAccumulator = 0;

    syncEnvironmentFromWorldState(env, worldState);
    presentationState = resolveToyboxPresentationState(worldState);
    if (typeof window !== "undefined") window.__toyboxPresentation = presentationState;
    return ticks;
  }

  function updateDebugPanel(time, celestial) {
    const probeY = physicsStoneBody
      ? physicsStoneBody.body.translation().y.toFixed(2)
      : physicsProbe.position[1].toFixed(2);
    debugController.update([
      `physics: ${physicsStatus}`,
      `sim: tick ${worldState.sim.tick} action ${worldState.bubbleBoy.currentAction}`,
      `presentation: ${presentationState.selectedAction} clip ${presentationState.animation.clip} overlay ${presentationState.proceduralOverlay}`,
      `attachment: ${presentationState.debug.selectedCarryAttachment || "none"} visuals ${presentationState.activeVisualFamilies.join(",") || "none"}`,
      `arrival: bundle ${presentationState.debug.arrivalSuppliesWashedBundle ? "on" : "off"} sticks ${presentationState.debug.arrivalSuppliesScatteredSticks ? "on" : "off"} leaves ${presentationState.debug.arrivalSuppliesScatteredLeaves ? "on" : "off"} pile ${presentationState.debug.arrivalSuppliesMaterialPile ? "on" : "off"} carry ${presentationState.debug.arrivalSuppliesCarryBundle ? "on" : "off"}`,
      `rest: ${presentationState.debug.restShelterStage || "none"} ${presentationState.debug.restShelterVariant || "none"} ${presentationState.debug.restShelterAssetSourceId || ""}`,
      `garden: ${presentationState.debug.gardenPlotsStage || "none"} ${presentationState.debug.gardenCropType || "none"} watered ${presentationState.debug.gardenWatered ? "yes" : "no"}`,
      `food: ${presentationState.debug.foodRoutineStage || "none"} meals ${Number(presentationState.debug.foodRoutineMealCount || 0)} dried ${Number(presentationState.debug.foodRoutineDriedFishCount || 0)}`,
      `animal: ${presentationState.debug.animalFamiliarVisitorStage || "none"} visitor ${Number(presentationState.debug.animalFamiliarVisitorAnimalCount || 0)} crumbs ${Number(presentationState.debug.animalFamiliarVisitorFoodCrumbCount || 0)}`,
      `night lights: ${presentationState.debug.nightComfortLightsStage || "none"} lanterns ${Number(presentationState.debug.nightComfortLightsLanternPostCount || 0)} fireflies ${Number(presentationState.debug.nightComfortLightsFireflyCount || 0)}`,
      `lookout: ${presentationState.debug.lookoutMapHorizonStage || "none"} platform ${Number(presentationState.debug.lookoutMapHorizonPlatformCount || 0)} map ${Number(presentationState.debug.lookoutMapHorizonMapBoardCount || 0)}`,
      `capstone: ${presentationState.debug.majorProjectCapstoneStage || "none"} ${presentationState.debug.majorProjectCapstoneSelectedOption || "none"} planks ${Number(presentationState.debug.majorProjectCapstoneTabletopPieceCount || 0)}`,
      `ambient: ${presentationState.debug.ambientBeachFindsStage || "none"} shells ${Number(presentationState.debug.ambientBeachFindsShellCount || 0)} visitor ${presentationState.debug.ambientBeachFindsAnimalVisitorVisible ? "on" : "off"}`,
      `pier: ${presentationState.debug.pierShoreWorkSiteStage || "none"} posts ${Number(presentationState.debug.pierShoreWorkSitePostCount || 0)} planks ${Number(presentationState.debug.pierShoreWorkSitePlankCount || 0)} safe ${Number(presentationState.debug.pierShoreWorkSiteSafeBuildSiteCount || 0)}`,
      `raft: ${presentationState.debug.raftBoatRouteBuildStage || "none"} water ${presentationState.debug.raftBoatRouteWaterState || "shore"} logs ${Number(presentationState.debug.raftBoatRouteLogCount || 0)} route ${Number(presentationState.debug.raftBoatRouteRouteMarkerCount || 0)}`,
      `unapproved assets: ${presentationState.unapprovedAssetCount}`,
      `build: ${worldState.bubbleBoy.builder.project} ${worldState.bubbleBoy.builder.actionState}`,
      `colliders: ${physics ? physics.colliders.length : 0}`,
      `dynamic bodies: ${physics ? physics.dynamicBodies.length : 0}`,
      `probe y: ${probeY}`,
      `camera: ${cameraState.cameraMode}`,
      `time: ${env.phaseName} ${env.timeOfDay.toFixed(3)}`,
      `sun: ${formatVector(celestial.sunDirection)} intensity ${celestial.sunIntensity.toFixed(2)}`,
      `moon: ${formatVector(celestial.moonDirection)} intensity ${celestial.moonIntensity.toFixed(2)}`,
      `dominant: ${celestial.dominantSource} ${formatVector(celestial.dominantDirection)}`,
      `water sun dir: ${formatVector(celestial.waterDirection)}`,
      `wind: ${env.windVector.x.toFixed(2)}, ${env.windVector.z.toFixed(2)} gust ${env.windVector.gust.toFixed(2)}`,
      `world: fire ${env.world.fireIntensity.toFixed(2)} source ${env.world.ambientEnergy.toFixed(2)} emotion ${env.world.emotionalField.toFixed(2)}`,
      `ocean: fish ${oceanLife.fish.filter((fish) => !fish.caught).length}/${oceanLife.fish.length} inventory ${fishInventoryState(worldState)}`
    ]);
  }

  function render(now) {
    resize();
    window.__toyboxFrameCount += 1;
    const deltaSeconds = lastRenderTime ? Math.min(0.05, (now - lastRenderTime) / 1000) : 1 / 60;
    lastRenderTime = now;

    cameraController.update(deltaSeconds);
    const simulationTicks = advanceSimulation(deltaSeconds, now);
    const time = worldState.sim.elapsedSeconds + simulationAccumulator;
    syncToyboxMeta(env.phaseName);

    if (physics) physics.stepPhysics(deltaSeconds, { wind: env.windVector, floorHeightAt: groundHeightAt });

    const celestial = calculateCanonicalCelestial(env);
    syncLighting({ celestial, lighting, sky, water, celestialBodies, scene, renderer, time });
    syncSkyLife({ stars, clouds, birds, env, celestial, time });
    syncShoreline(shoreline, env, time);
    syncFire(fire, lighting, env, worldState, time);
    syncArrivalSupplies(arrivalSupplies, worldState, presentationState, time);
    window.__toyboxCampLayout = syncCampLayoutPresentationProp(campLayout, {
      presentationState,
      worldState,
      groundHeightAt,
      time,
      dummy: campLayout.dummy
    });
    window.__toyboxGardenPlots = syncGardenPlotsPresentationProp(gardenPlots, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxFoodRoutine = syncFoodRoutinePresentationProp(foodRoutine, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxFishTrapRoutine = syncFishTrapRoutinePresentationProp(fishTrapRoutine, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxToyPlaySet = syncToyPlaySetPresentationProp(toyPlaySet, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxMusicArtDecor = syncMusicArtDecorPresentationProp(musicArtDecor, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxAnimalFamiliarVisitor = syncAnimalFamiliarVisitorPresentationProp(animalFamiliarVisitor, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxNightComfortLights = syncNightComfortLightsPresentationProp(nightComfortLights, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxLookoutMapHorizon = syncLookoutMapHorizonPresentationProp(lookoutMapHorizon, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxMajorProjectCapstone = syncMajorProjectCapstonePresentationProp(majorProjectCapstone, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxAmbientBeachFinds = syncAmbientBeachFindsPresentationProp(ambientBeachFinds, {
      presentationState,
      worldState,
      groundHeightAt,
      time,
      dummy: ambientBeachFinds.dummy
    });
    window.__toyboxPierShoreWorkSite = syncPierShoreWorkSitePresentationProp(pierShoreWorkSite, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    window.__toyboxRaftBoatRoute = syncRaftBoatRoutePresentationProp(raftBoatRoute, {
      presentationState,
      worldState,
      groundHeightAt,
      time
    });
    syncBuilderObjects(builderObjects, worldState, presentationState, time);
    syncOceanLife(oceanLife, worldState, presentationState, time, deltaSeconds);
    syncOceanInteraction(oceanInteraction, oceanLife, worldState, time);
    syncBubbleBoy(bubbleBoy, bubbleBoyHumanoidController, worldState, presentationState, time, deltaSeconds, cameraController.cursor);
    updateFollowCamera(cameraState, worldState, deltaSeconds);
    syncCamera(camera3d, cameraState);
    cameraOcclusion.update({ camera3d, cameraState, worldState, deltaSeconds });
    syncBubbleBoundary(bubbleBoundary, env, time);
    syncTrace(canvas, env, celestial, simulationTicks, presentationState);

    debugGroup.visible = debugController.visible;
    syncPhysicsDebug(debugGroup, physicsProbe);
    updateDebugPanel(time, celestial);

    water.material.uniforms.time.value += deltaSeconds * (0.34 + env.windStrength * 0.22);
    renderer.render(scene, camera3d);
    updateAudio(worldState, audioCtx, audioNodes);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function readState() {
  const node = document.getElementById("toybox-state");
  if (!node) return fallbackState;
  try {
    const parsed = JSON.parse(node.textContent);
    return parsed && typeof parsed === "object" ? parsed : fallbackState;
  } catch (_error) {
    return fallbackState;
  }
}

function showRendererError(error) {
  window.__toyboxLastError = error && error.stack ? error.stack : String(error);
  const errorPanel = document.getElementById("toybox-error");
  if (errorPanel) errorPanel.classList.add("is-visible");
}

function exposeOrientation(canvas) {
  window.__toyboxOrientation = {
    convention: CARDINAL_CONVENTION,
    north: NORTH.slice(),
    east: EAST.slice(),
    south: SOUTH.slice(),
    west: WEST.slice()
  };
  canvas.dataset.cardinalConvention = CARDINAL_CONVENTION;
}

function createEnvironmentState() {
  return {
    timeOfDay: 0,
    dayLength: 600,
    dayFactor: 0,
    nightFactor: 1,
    phaseName: "night",
    fireIntensity: 1,
    windStrength: 0,
    wind: {
      strength: 0,
      gust: 0,
      direction: { x: 1, y: 0, z: 0 }
    },
    windVector: { x: 0, y: 0, z: 0, gust: 0, strength: 0 },
    lighting: {
      timeOfDay: 0,
      sourceLevel: 0,
      sunIntensity: 0,
      moonIntensity: 0,
      fireIntensity: 0.7,
      sunPosition: [0, -128, 0],
      moonPosition: [0, 128, 0],
      sunDirection: [0, 1, 0],
      moonDirection: [0, 1, 0],
      sunColor: [1.0, 0.92, 0.78],
      moonColor: [0.42, 0.55, 0.86],
      fireColor: [1.0, 0.38, 0.1],
      dominantSource: "moon",
      sky: [0.008, 0.02, 0.052],
      fogColor: [0.035, 0.06, 0.11],
      fogDensity: 0.18
    },
    world: {
      timeOfDay: 0,
      windStrength: 0,
      fireIntensity: 1,
      ambientEnergy: 0.34,
      emotionalField: 0.12
    }
  };
}

function syncEnvironmentFromWorldState(envState, state) {
  const simEnv = state.environment;
  const light = simEnv.light;
  const windStrength = Math.hypot(simEnv.wind.vector.x, simEnv.wind.vector.z);
  const emotionalGust = clamp(0.58 + simEnv.wind.gust * 0.72 + simEnv.emotionalField * 0.18, 0.58, 1.38);

  envState.timeOfDay = state.time.timeOfDay;
  envState.dayLength = state.time.dayLengthSeconds;
  envState.dayFactor = simEnv.dayFactor;
  envState.nightFactor = simEnv.nightFactor;
  envState.phaseName = state.time.phase;
  envState.fireIntensity = light.fireIntensity;
  envState.windStrength = windStrength;
  envState.wind.strength = simEnv.wind.strength;
  envState.wind.gust = simEnv.wind.gust;
  envState.wind.direction.x = Math.cos(simEnv.wind.direction);
  envState.wind.direction.y = 0;
  envState.wind.direction.z = Math.sin(simEnv.wind.direction);
  envState.windVector = {
    x: simEnv.wind.vector.x,
    y: 0,
    z: simEnv.wind.vector.z,
    gust: emotionalGust,
    strength: simEnv.wind.strength,
    direction: envState.wind.direction
  };

  envState.lighting.timeOfDay = light.timeOfDay;
  envState.lighting.sunIntensity = light.sunIntensity;
  envState.lighting.moonIntensity = light.moonIntensity;
  envState.lighting.fireIntensity = light.fireIntensity;
  envState.lighting.sunPosition = vec3LikeToArray(light.sunPosition || light.sunDirection, [0, -128, 0]);
  envState.lighting.moonPosition = vec3LikeToArray(light.moonPosition || light.moonDirection, [0, 128, 0]);
  envState.lighting.sunDirection = vec3LikeToArray(light.sunDirection, [0, 1, 0]);
  envState.lighting.moonDirection = vec3LikeToArray(light.moonDirection, [0, 1, 0]);
  envState.lighting.sunColor = light.sunColor.slice();
  envState.lighting.moonColor = light.moonColor.slice();
  envState.lighting.fireColor = light.fireColor.slice();
  envState.lighting.dominantSource = light.dominantSource || "ambient";
  envState.lighting.sourceLevel = light.sourceLevel;
  envState.lighting.sky = light.sky.slice();
  envState.lighting.fogColor = light.fogColor.slice();
  envState.lighting.fogDensity = light.fogDensity;

  envState.world.timeOfDay = state.time.timeOfDay;
  envState.world.windStrength = windStrength;
  envState.world.fireIntensity = light.fireIntensity;
  envState.world.ambientEnergy = simEnv.ambientEnergy;
  envState.world.emotionalField = simEnv.emotionalField;

  window.__toyboxEnv = envState;
  window.__toyboxWorld = envState.world;
  window.__toyboxLighting = envState.lighting;
  window.__toyboxWorldState = state;
  return envState;
}

function createSky() {
  const sky = new Sky();
  sky.name = "Three.js Sky atmosphere";
  sky.scale.setScalar(450000);
  sky.material.uniforms.turbidity.value = 6.0;
  sky.material.uniforms.rayleigh.value = 1.25;
  sky.material.uniforms.mieCoefficient.value = 0.004;
  sky.material.uniforms.mieDirectionalG.value = 0.78;
  installSkyTintLift(sky);
  sky.frustumCulled = false;
  sky.renderOrder = -100;
  return sky;
}

function installSkyTintLift(sky) {
  const tintUniforms = {
    skyHorizonTint: { value: new THREE.Color(0x8fb9df) },
    skyZenithTint: { value: new THREE.Color(0x62b7ff) },
    skyTintStrength: { value: 0.56 }
  };
  sky.userData.tintUniforms = tintUniforms;
  Object.assign(sky.material.uniforms, tintUniforms);
  sky.material.fragmentShader = sky.material.fragmentShader.replace(
    "uniform vec3 up;",
    `
    uniform vec3 up;
    uniform vec3 skyHorizonTint;
    uniform vec3 skyZenithTint;
    uniform float skyTintStrength;`
  );
  sky.material.fragmentShader = sky.material.fragmentShader.replace(
    "gl_FragColor = vec4( retColor, 1.0 );",
    `
      float skyLift = smoothstep( -0.10, 0.85, direction.y );
      vec3 liftedSky = mix( skyHorizonTint, skyZenithTint, skyLift );
      retColor = mix( retColor, liftedSky, skyTintStrength );
      gl_FragColor = vec4( retColor, 1.0 );`
  );
  sky.material.fragmentShader = sky.material.fragmentShader.replace(
    "L0 += ( vSunE * 19000.0 * Fex ) * sundisk;",
    "L0 += vec3( 0.0 ) * sundisk;"
  );
  sky.userData.shaderSunDiskDisabled = true;
  sky.material.needsUpdate = true;
}

function createWater() {
  const geometry = createCurvedOcean({
    radius: OCEAN_RADIUS,
    segments: 160,
    waterY: WATER_LEVEL,
    planetRadius: PLANET_RADIUS
  });
  const water = new Water(geometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: createWaterNormalsTexture(),
    sunDirection: new THREE.Vector3(0.2, 0.8, -0.4).normalize(),
    sunColor: 0xffdfaa,
    waterColor: 0x083044,
    distortionScale: 3.7,
    size: 1.25,
    alpha: 0.94,
    fog: true
  });
  water.name = "Curved spherical-cap Water ocean";
  water.rotation.x = -Math.PI / 2;
  water.position.y = WATER_LEVEL;
  water.receiveShadow = false;
  return water;
}

function createCurvedOcean({ radius, segments, waterY, planetRadius }) {
  const angularSegments = Math.max(64, Math.floor(segments));
  const radialSegments = Math.max(32, Math.floor(angularSegments * 0.5));
  const positions = [0, 0, oceanSurfaceOffsetAtRadius(0, planetRadius)];
  const uvs = [0.5, 0.5];
  const indices = [];

  // The toybox still plays on a flat island, but the ocean vertices fall away
  // as a spherical cap so the horizon reads as a tiny curved world.
  for (let ring = 1; ring <= radialSegments; ring += 1) {
    const ringRadius = (radius * ring) / radialSegments;
    const heightOffset = oceanSurfaceOffsetAtRadius(ringRadius, planetRadius) + subtleOceanCapUndulation(ringRadius, radius);
    for (let segment = 0; segment < angularSegments; segment += 1) {
      const angle = (segment / angularSegments) * TAU;
      const x = Math.cos(angle) * ringRadius;
      const y = Math.sin(angle) * ringRadius;
      positions.push(x, y, heightOffset);
      uvs.push(0.5 + x / (radius * 2), 0.5 + y / (radius * 2));
    }
  }

  const ringStart = (ring) => 1 + (ring - 1) * angularSegments;
  for (let segment = 0; segment < angularSegments; segment += 1) {
    const next = (segment + 1) % angularSegments;
    indices.push(0, ringStart(1) + segment, ringStart(1) + next);
  }
  for (let ring = 2; ring <= radialSegments; ring += 1) {
    const innerStart = ringStart(ring - 1);
    const outerStart = ringStart(ring);
    for (let segment = 0; segment < angularSegments; segment += 1) {
      const next = (segment + 1) % angularSegments;
      indices.push(
        innerStart + segment,
        outerStart + segment,
        outerStart + next,
        innerStart + segment,
        outerStart + next,
        innerStart + next
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.userData.waterY = waterY;
  geometry.userData.planetRadius = planetRadius;
  geometry.userData.oceanRadius = radius;
  return geometry;
}

function oceanSurfaceOffsetAtRadius(radius, planetRadius = PLANET_RADIUS) {
  const safeRadius = Math.min(Math.max(0, radius), planetRadius - 0.001);
  return Math.sqrt(planetRadius * planetRadius - safeRadius * safeRadius) - planetRadius;
}

function oceanSurfaceYAtRadius(radius) {
  return WATER_LEVEL + oceanSurfaceOffsetAtRadius(radius);
}

function subtleOceanCapUndulation(radius, oceanRadius) {
  const horizonBlend = smoothstep(oceanRadius * 0.34, oceanRadius, radius);
  return -0.34 * horizonBlend * horizonBlend;
}

function createBubbleBoundary() {
  const group = new THREE.Group();
  group.name = "Transparent bubble-world boundary";
  group.position.y = oceanSurfaceYAtRadius(BUBBLE_RING_RADIUS);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(BUBBLE_RADIUS, 128, 64),
    createBubbleBoundaryMaterial()
  );
  dome.name = "Soap-bubble Fresnel world boundary";
  dome.renderOrder = 18;
  dome.frustumCulled = false;
  group.add(dome);

  const ringCore = new THREE.Mesh(
    new THREE.TorusGeometry(BUBBLE_RING_RADIUS, 0.42, 10, 256),
    new THREE.MeshBasicMaterial({
      color: 0xdffcff,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      toneMapped: false
    })
  );
  ringCore.name = "Bubble ocean contact glow core";
  ringCore.rotation.x = Math.PI / 2;
  ringCore.renderOrder = 21;
  group.add(ringCore);

  const ringHalo = new THREE.Mesh(
    new THREE.TorusGeometry(BUBBLE_RING_RADIUS, 1.55, 8, 256),
    new THREE.MeshBasicMaterial({
      color: 0x62f4ff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      toneMapped: false
    })
  );
  ringHalo.name = "Bubble ocean contact soft halo";
  ringHalo.rotation.x = Math.PI / 2;
  ringHalo.renderOrder = 20;
  group.add(ringHalo);

  const shimmerBands = createBubbleShimmerBands();
  for (const band of shimmerBands) group.add(band);

  const glints = createBubbleGlints();
  group.add(glints);

  return { group, dome, ringCore, ringHalo, shimmerBands, glints };
}

function createBubbleBoundaryMaterial() {
  return new THREE.ShaderMaterial({
    name: "SoapBubbleFresnelBoundary",
    uniforms: {
      time: { value: 0 },
      radius: { value: BUBBLE_RADIUS },
      cyanColor: { value: new THREE.Color(0x6ff7ff) },
      violetColor: { value: new THREE.Color(0xffa8ff) },
      whiteColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: /* glsl */`
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float time;
      uniform float radius;
      uniform vec3 cyanColor;
      uniform vec3 violetColor;
      uniform vec3 whiteColor;

      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float facing = abs(dot(normalize(vWorldNormal), viewDir));
        float fresnel = pow(1.0 - clamp(facing, 0.0, 1.0), 2.15);
        float domeY = clamp((vWorldPosition.y + radius * 0.18) / (radius * 1.18), 0.0, 1.0);
        float rippleA = sin(vWorldPosition.y * 0.080 + time * 0.92);
        float rippleB = sin(length(vWorldPosition.xz) * 0.065 - time * 0.58);
        float shimmer = 0.5 + 0.5 * sin((vWorldPosition.x + vWorldPosition.z) * 0.036 + time * 0.74 + rippleA * 0.45);
        float ripple = smoothstep(0.58, 0.98, 0.5 + 0.5 * (rippleA * 0.55 + rippleB * 0.45));
        float rim = smoothstep(0.12, 1.0, fresnel);
        vec3 soapColor = mix(cyanColor, violetColor, shimmer * 0.46 + ripple * 0.18);
        soapColor = mix(soapColor, whiteColor, pow(rim, 3.0) * 0.72);
        float film = domeY * (0.010 + shimmer * 0.020 + ripple * 0.024);
        float alpha = 0.014 + rim * 0.19 + pow(rim, 4.5) * 0.38 + film;
        gl_FragColor = vec4(soapColor, clamp(alpha, 0.0, 0.48));
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    toneMapped: false
  });
}

function createBubbleShimmerBands() {
  const specs = [
    { lift: 0.20, tube: 0.20, color: 0xa6fbff, opacity: 0.050, speed: 0.52, phase: 0.2 },
    { lift: 0.48, tube: 0.15, color: 0xffb8ff, opacity: 0.034, speed: 0.38, phase: 1.7 }
  ];
  return specs.map((spec, index) => {
    const y = BUBBLE_RADIUS * spec.lift;
    const radius = Math.sqrt(Math.max(0.001, BUBBLE_RADIUS * BUBBLE_RADIUS - y * y));
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(radius, spec.tube, 6, 192),
      new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        toneMapped: false
      })
    );
    band.name = `Subtle bubble shimmer latitude ${index + 1}`;
    band.position.y = y;
    band.rotation.x = Math.PI / 2;
    band.renderOrder = 19;
    band.userData.baseOpacity = spec.opacity;
    band.userData.speed = spec.speed;
    band.userData.phase = spec.phase;
    return band;
  });
}

function createBubbleGlints() {
  const count = 26;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const angle = hash01(i * 17.1 + 2.0) * TAU;
    const lift = 0.08 + Math.pow(hash01(i * 23.7 + 5.0), 0.62) * 0.82;
    const horizontal = Math.sqrt(Math.max(0, 1 - lift * lift));
    const radius = BUBBLE_RADIUS * (0.985 + hash01(i * 31.9 + 7.0) * 0.010);
    positions[i * 3] = Math.cos(angle) * horizontal * radius;
    positions[i * 3 + 1] = lift * radius;
    positions[i * 3 + 2] = Math.sin(angle) * horizontal * radius;
    color.set(hash01(i * 13.3 + 11.0) > 0.55 ? 0xffffff : 0x95fbff);
    color.lerp(new THREE.Color(0xffb7ff), hash01(i * 19.4 + 13.0) * 0.26);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const glints = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 1.7,
      sizeAttenuation: true,
      map: createStarTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      toneMapped: false
    })
  );
  glints.name = "Small soap-bubble glints";
  glints.renderOrder = 22;
  glints.frustumCulled = false;
  return glints;
}

function createWaterNormalsTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);

  function tileNoise(x, y, cells, seed) {
    const gx = (x / size) * cells;
    const gy = (y / size) * cells;
    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const fx = smoothstep(0, 1, gx - ix);
    const fy = smoothstep(0, 1, gy - iy);
    const x0 = ((ix % cells) + cells) % cells;
    const y0 = ((iy % cells) + cells) % cells;
    const x1 = (x0 + 1) % cells;
    const y1 = (y0 + 1) % cells;
    const a = hash01(x0 * 37.0 + y0 * 83.0 + seed);
    const b = hash01(x1 * 37.0 + y0 * 83.0 + seed);
    const c = hash01(x0 * 37.0 + y1 * 83.0 + seed);
    const d = hash01(x1 * 37.0 + y1 * 83.0 + seed);
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fy);
  }

  function textureHeight(x, y) {
    return (
      (tileNoise(x, y, 5, 11.0) - 0.5) * 0.50 +
      (tileNoise(x + 17.0, y - 9.0, 11, 29.0) - 0.5) * 0.28 +
      (tileNoise(x - 31.0, y + 23.0, 23, 47.0) - 0.5) * 0.16 +
      (tileNoise(x + 71.0, y + 53.0, 47, 89.0) - 0.5) * 0.075
    );
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const left = textureHeight((x - 1 + size) % size, y);
      const right = textureHeight((x + 1) % size, y);
      const down = textureHeight(x, (y - 1 + size) % size);
      const up = textureHeight(x, (y + 1) % size);
      const nx = (left - right) * 92;
      const ny = (down - up) * 92;
      const nz = 1.0;
      const normalLength = Math.hypot(nx, ny, nz) || 1;
      const index = (y * size + x) * 4;
      image.data[index] = clamp(Math.round(128 + (nx / normalLength) * 127), 0, 255);
      image.data[index + 1] = clamp(Math.round(128 + (ny / normalLength) * 127), 0, 255);
      image.data[index + 2] = clamp(Math.round(128 + (nz / normalLength) * 127), 0, 255);
      image.data[index + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = "Procedural calm water normals";
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createStars() {
  const group = new THREE.Group();
  group.name = "Layered procedural starfield";
  const texture = createStarTexture();
  const deepStars = createStarPoints({
    name: "Faint deep star canopy",
    count: 760,
    radiusMin: 190,
    radiusMax: 292,
    liftMin: 0.10,
    liftPower: 0.44,
    size: 0.42,
    brightness: 0.64,
    texture,
    seed: 3.1
  });
  const brightStars = createStarPoints({
    name: "Bright hand-picked star sparks",
    count: 170,
    radiusMin: 178,
    radiusMax: 250,
    liftMin: 0.18,
    liftPower: 0.34,
    size: 0.74,
    brightness: 1.0,
    texture,
    seed: 43.7
  });
  const milkyHaze = createStarPoints({
    name: "Low-contrast milky star band",
    count: 360,
    radiusMin: 196,
    radiusMax: 270,
    liftMin: 0.22,
    liftPower: 0.70,
    size: 1.25,
    brightness: 0.42,
    banded: true,
    texture,
    seed: 91.4
  });

  group.add(deepStars);
  group.add(brightStars);
  group.add(milkyHaze);
  group.renderOrder = -12;
  group.frustumCulled = false;
  return {
    group,
    deepStars,
    brightStars,
    milkyHaze,
    layers: [deepStars, brightStars, milkyHaze]
  };
}

function createStarPoints({ name, count, radiusMin, radiusMax, liftMin, liftPower, size, brightness, texture, seed, banded = false }) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const color = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const bandCurve = Math.sin(i * 0.09 + seed) * 0.18 + Math.sin(i * 0.017 + seed * 1.7) * 0.12;
    const angle = (i * goldenAngle + hash01(i * 7.1 + seed) * (banded ? 0.18 : 0.52)) % TAU;
    const liftNoise = Math.pow(hash01(i * 11.4 + seed), liftPower);
    const lift = banded ? clamp(0.42 + bandCurve + (hash01(i * 5.7 + seed) - 0.5) * 0.18, 0.16, 0.92) : liftMin + liftNoise * (0.92 - liftMin);
    const radius = radiusMin + hash01(i * 3.9 + seed) * (radiusMax - radiusMin);
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = lift * 150;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    color.set(hash01(i * 5.2 + seed) > 0.76 ? 0xffe1a7 : hash01(i * 17.6 + seed) > 0.82 ? 0xd7ecff : 0xb8c9ff);
    color.multiplyScalar((0.42 + hash01(i * 13.5 + seed) * 0.58) * brightness);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    map: texture,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    alphaTest: 0.02,
    blending: THREE.AdditiveBlending
  });
  const stars = new THREE.Points(geometry, material);
  stars.name = name;
  stars.renderOrder = -10;
  stars.frustumCulled = false;
  stars.userData.baseOpacity = brightness;
  stars.userData.twinkleSeed = seed;
  return stars;
}

function createClouds() {
  const group = new THREE.Group();
  group.name = "Layered living sky clouds";
  const layers = [
    createCloudLayer({ name: "High soft cloud veil", count: 18, altitude: 62, radius: 112, scale: [18, 7], opacity: 0.20, speed: 0.018, seed: 12 }),
    createCloudLayer({ name: "Mid scattered cloud puffs", count: 24, altitude: 40, radius: 86, scale: [10, 4.8], opacity: 0.32, speed: 0.032, seed: 46 }),
    createCloudLayer({ name: "Low horizon cloud shelf", count: 15, altitude: 24, radius: 124, scale: [22, 6.2], opacity: 0.26, speed: 0.012, seed: 83 })
  ];
  for (const layer of layers) {
    group.add(layer.group);
  }
  group.renderOrder = -30;
  group.frustumCulled = false;
  return { group, layers };
}

function createCloudLayer({ name, count, altitude, radius, scale, opacity, speed, seed }) {
  const group = new THREE.Group();
  group.name = name;
  const texture = createCloudTexture(seed);
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity,
    depthWrite: false,
    depthTest: true,
    toneMapped: true
  });
  const sprites = [];
  for (let i = 0; i < count; i += 1) {
    const sprite = new THREE.Sprite(material.clone());
    const angle = (i / count) * TAU + (hash01(seed + i * 7.1) - 0.5) * 0.38;
    const radial = radius * (0.78 + hash01(seed + i * 13.7) * 0.28);
    const width = scale[0] * (0.72 + hash01(seed + i * 19.1) * 0.62);
    const height = scale[1] * (0.74 + hash01(seed + i * 29.9) * 0.54);
    sprite.position.set(Math.cos(angle) * radial, altitude + (hash01(seed + i * 31.3) - 0.5) * 8, Math.sin(angle) * radial);
    sprite.scale.set(width, height, 1);
    sprite.rotation.z = (hash01(seed + i * 37.7) - 0.5) * 0.18;
    sprite.renderOrder = -24;
    sprite.userData.angle = angle;
    sprite.userData.radius = radial;
    sprite.userData.altitude = sprite.position.y;
    sprite.userData.speed = speed * (0.72 + hash01(seed + i * 41.9) * 0.48);
    sprite.userData.phase = hash01(seed + i * 43.1) * TAU;
    sprite.userData.baseOpacity = opacity * (0.72 + hash01(seed + i * 47.3) * 0.44);
    sprites.push(sprite);
    group.add(sprite);
  }
  return { group, sprites, material, seed, baseOpacity: opacity };
}

function createCloudTexture(seed) {
  const size = 192;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  for (let i = 0; i < 15; i += 1) {
    const x = size * (0.24 + hash01(seed + i * 11.1) * 0.52);
    const y = size * (0.38 + hash01(seed + i * 17.7) * 0.24);
    const rx = size * (0.14 + hash01(seed + i * 23.3) * 0.18);
    const ry = size * (0.08 + hash01(seed + i * 31.5) * 0.12);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
    gradient.addColorStop(0, "rgba(255,255,255,0.58)");
    gradient.addColorStop(0.58, "rgba(240,247,255,0.22)");
    gradient.addColorStop(1, "rgba(230,240,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (hash01(seed + i * 39.0) - 0.5) * 0.22, 0, TAU);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = "Procedural soft cloud sprite";
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createBirds() {
  const group = new THREE.Group();
  group.name = "Distant living sky bird silhouettes";
  const material = new THREE.LineBasicMaterial({
    color: 0x17202a,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: true
  });
  const birds = [];
  for (let i = 0; i < 12; i += 1) {
    const bird = createBirdSilhouette(material.clone(), i);
    birds.push(bird);
    group.add(bird);
  }
  group.renderOrder = -8;
  group.frustumCulled = false;
  return { group, birds };
}

function createBirdSilhouette(material, index) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -0.50, 0, 0,
    0, 0.18, 0,
    0.50, 0, 0
  ]), 3));
  const bird = new THREE.Line(geometry, material);
  bird.name = `Distant sky bird ${index + 1}`;
  bird.userData.radius = 44 + hash01(index * 13.1) * 34;
  bird.userData.altitude = 16 + hash01(index * 17.7) * 22;
  bird.userData.phase = hash01(index * 19.9) * TAU;
  bird.userData.speed = 0.035 + hash01(index * 23.3) * 0.025;
  bird.userData.scale = 0.62 + hash01(index * 29.1) * 0.68;
  bird.userData.baseOpacity = 0.16 + hash01(index * 31.7) * 0.22;
  bird.scale.setScalar(bird.userData.scale);
  bird.frustumCulled = false;
  return bird;
}

function createCelestialBodies() {
  const group = new THREE.Group();
  group.name = "World-space sun and moon cycle";

  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffee72,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false
  });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(4.8, 32, 18), sunMaterial);
  sun.name = "World-space sun";
  sun.renderOrder = 4;
  group.add(sun);

  const sunHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createRadialGlowTexture([255, 216, 116], 0.62),
      color: 0xffd27a,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    })
  );
  sunHalo.name = "World-space sun halo";
  sunHalo.scale.set(18, 18, 1);
  sunHalo.renderOrder = 3;
  group.add(sunHalo);

  const moon = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createMoonTexture(),
      color: 0xdce5ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false
    })
  );
  moon.name = "World-space moon";
  moon.scale.set(8.2, 8.2, 1);
  moon.renderOrder = 4;
  group.add(moon);

  const moonHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createRadialGlowTexture([138, 166, 255], 0.48),
      color: 0x8fa8ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    })
  );
  moonHalo.name = "World-space moon halo";
  moonHalo.scale.set(15, 15, 1);
  moonHalo.renderOrder = 3;
  group.add(moonHalo);

  return { group, sun, sunHalo, moon, moonHalo };
}

function createStarTexture() {
  const size = 48;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.48);
  gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.92)");
  gradient.addColorStop(0.28, "rgba(220, 234, 255, 0.62)");
  gradient.addColorStop(1.0, "rgba(220, 234, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = "Soft round star sprite";
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createRadialGlowTexture(rgb, centerOpacity) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const [r, g, b] = rgb;
  const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
  gradient.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${centerOpacity})`);
  gradient.addColorStop(0.42, `rgba(${r}, ${g}, ${b}, ${centerOpacity * 0.26})`);
  gradient.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = "Soft celestial glow sprite";
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createMoonTexture() {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  const body = ctx.createRadialGradient(size * 0.38, size * 0.34, size * 0.08, size * 0.5, size * 0.5, size * 0.42);
  body.addColorStop(0.0, "rgba(255, 252, 214, 1)");
  body.addColorStop(0.62, "rgba(216, 226, 255, 0.96)");
  body.addColorStop(1.0, "rgba(155, 177, 230, 0.86)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.5, size * 0.34, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(size * 0.60, size * 0.43, size * 0.28, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.name = "Soft crescent moon sprite";
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createLights(scene) {
  const hemisphere = new THREE.HemisphereLight(0xa8d4ff, 0x445674, 0.34);
  hemisphere.name = "Sky and moon fill hemisphere light";
  scene.add(hemisphere);

  const directional = new THREE.DirectionalLight(0xffe2bd, 1.2);
  directional.name = "Canonical celestial directional light";
  directional.position.set(-32, 38, 18);
  directional.castShadow = true;
  directional.shadow.mapSize.set(2048, 2048);
  directional.shadow.camera.near = 0.5;
  directional.shadow.camera.far = 150;
  directional.shadow.camera.left = -32;
  directional.shadow.camera.right = 32;
  directional.shadow.camera.top = 32;
  directional.shadow.camera.bottom = -32;
  directional.shadow.bias = -0.00025;
  directional.shadow.normalBias = 0.015;
  directional.shadow.radius = 1.6;
  scene.add(directional);
  scene.add(directional.target);

  const fireLight = new THREE.PointLight(0xff8a2d, 7.0, 0, 2.0);
  fireLight.name = "Campfire point light";
  fireLight.position.set(0, 0.64, -0.16);
  fireLight.castShadow = true;
  fireLight.shadow.mapSize.set(512, 512);
  fireLight.shadow.camera.near = 0.08;
  fireLight.shadow.camera.far = 16.0;
  fireLight.shadow.bias = -0.001;
  fireLight.shadow.normalBias = 0.035;
  scene.add(fireLight);

  return { hemisphere, directional, fireLight };
}

function createSandMaterial() {
  return new THREE.MeshStandardMaterial({
    name: "Responsive warm sand",
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.0,
    flatShading: true
  });
}

function createShoreShelfMaterial() {
  return new THREE.MeshStandardMaterial({
    name: "Wet sloped shoreline",
    vertexColors: true,
    roughness: 0.92,
    metalness: 0,
    flatShading: true
  });
}

function createShoreShelfGeometry() {
  const segments = 192;
  const offsets = [-2.4, -1.15, -0.12, 0.95];
  const positions = [];
  const colors = [];
  const normals = [];

  function shoreVertex(angle, offset) {
    const radius = islandShoreRadius(angle) + offset;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const shelfT = smoothstep(-2.4, 0.95, offset);
    const groundY = groundHeightAt(x, z);
    const y = lerp(groundY - 0.018, WATER_LEVEL - 0.036, shelfT);
    return new THREE.Vector3(x, y, z);
  }

  function shoreColor(offset, angle) {
    const t = smoothstep(-2.4, 0.95, offset);
    const color = new THREE.Color(0x8a6f53);
    color.lerp(new THREE.Color(0x5f6f6a), t * 0.55);
    color.lerp(new THREE.Color(0x24485a), t * 0.34);
    color.multiplyScalar(0.95 + hash01(angle * 19.7 + offset * 8.1) * 0.08);
    return color;
  }

  function pushTriangle(a, b, c, ca, cb, cc) {
    const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
    for (const [point, color] of [
      [a, ca],
      [b, cb],
      [c, cc]
    ]) {
      positions.push(point.x, point.y, point.z);
      colors.push(color.r, color.g, color.b);
      normals.push(normal.x, normal.y, normal.z);
    }
  }

  for (let i = 0; i < segments; i += 1) {
    const a0 = (i / segments) * TAU;
    const a1 = ((i + 1) / segments) * TAU;
    for (let band = 0; band < offsets.length - 1; band += 1) {
      const inner = offsets[band];
      const outer = offsets[band + 1];
      const p00 = shoreVertex(a0, inner);
      const p10 = shoreVertex(a1, inner);
      const p11 = shoreVertex(a1, outer);
      const p01 = shoreVertex(a0, outer);
      const c00 = shoreColor(inner, a0);
      const c10 = shoreColor(inner, a1);
      const c11 = shoreColor(outer, a1);
      const c01 = shoreColor(outer, a0);
      pushTriangle(p00, p10, p11, c00, c10, c11);
      pushTriangle(p11, p01, p00, c11, c01, c00);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function createSandGeometry() {
  const extent = maxIslandShoreRadius() + 0.32;
  const cell = 1.34;
  const columns = Math.ceil((extent * 2) / cell);
  const origin = -columns * cell * 0.5;
  const positions = [];
  const colors = [];
  const normals = [];
  const pointCache = new Map();

  function point(ix, iz) {
    const key = `${ix}:${iz}`;
    const cached = pointCache.get(key);
    if (cached) return cached.clone();
    const xBase = origin + ix * cell;
    const zBase = origin + iz * cell;
    const edge = ix === 0 || iz === 0 || ix === columns || iz === columns;
    const seed = ix * 53.0 + iz * 109.0 + 11.0;
    const jitter = edge ? 0 : cell * 0.18;
    const x = xBase + (hash01(seed + 1.0) - 0.5) * jitter;
    const z = zBase + (hash01(seed + 2.0) - 0.5) * jitter;
    const value = new THREE.Vector3(x, groundHeightAt(x, z), z);
    pointCache.set(key, value);
    return value.clone();
  }

  function pushTriangle(a, b, c, color) {
    const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
    for (const p of [a, b, c]) {
      positions.push(p.x, p.y, p.z);
      colors.push(color.r, color.g, color.b);
      normals.push(normal.x, normal.y, normal.z);
    }
  }

  for (let ix = 0; ix < columns; ix += 1) {
    for (let iz = 0; iz < columns; iz += 1) {
      const cx = origin + (ix + 0.5) * cell;
      const cz = origin + (iz + 0.5) * cell;
      if (!insideIsland(cx, cz, 0.22)) continue;

      const p00 = point(ix, iz);
      const p10 = point(ix + 1, iz);
      const p11 = point(ix + 1, iz + 1);
      const p01 = point(ix, iz + 1);
      if (![p00, p10, p11, p01].every((p) => insideIsland(p.x, p.z, -0.12))) continue;

      const center = new THREE.Vector3(
        (p00.x + p10.x + p11.x + p01.x) * 0.25 + (hash01(ix * 47.0 + iz * 31.0) - 0.5) * cell * 0.12,
        groundHeightAt(cx, cz) + 0.004,
        (p00.z + p10.z + p11.z + p01.z) * 0.25 + (hash01(ix * 31.0 + iz * 47.0) - 0.5) * cell * 0.12
      );
      const base = sandColorAt(cx, cz, hash01(ix * 37.0 + iz * 83.0));
      pushTriangle(p00, center, p10, base.clone().multiplyScalar(0.992 + hash01(ix + iz * 2.1) * 0.016));
      pushTriangle(p10, center, p11, base.clone().multiplyScalar(0.992 + hash01(ix * 2.1 + iz) * 0.016));
      pushTriangle(p11, center, p01, base.clone().multiplyScalar(0.992 + hash01(ix * 1.3 + iz * 3.7) * 0.016));
      pushTriangle(p01, center, p00, base.clone().multiplyScalar(0.992 + hash01(ix * 4.7 + iz * 1.3) * 0.016));
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function createShorelineFoam() {
  const group = new THREE.Group();
  group.name = "Animated shoreline foam and wash";

  const shallowWaterMaterial = new THREE.MeshBasicMaterial({
    color: 0x8fc7c7,
    transparent: true,
    opacity: 0.105,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const shallowWater = new THREE.Mesh(createShorelineRibbonGeometry(0, TAU, -0.10, 1.25, 192, 0.024), shallowWaterMaterial);
  shallowWater.name = "Transparent shallow water lap";
  shallowWater.renderOrder = 1;
  shallowWater.userData.staticFoam = true;
  group.add(shallowWater);

  const wetWashMaterial = new THREE.MeshBasicMaterial({
    color: 0xe7d7b4,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const wetWash = new THREE.Mesh(createShorelineRibbonGeometry(0, TAU, -1.22, -0.12, 192, 0.020), wetWashMaterial);
  wetWash.name = "Thin wet sand wash";
  wetWash.renderOrder = 2;
  wetWash.userData.staticFoam = true;
  group.add(wetWash);

  for (let i = 0; i < 42; i += 1) {
    const seed = i * 17.37 + 5.0;
    if (hash01(seed) < 0.24) continue;
    const angle = (i / 42) * TAU + (hash01(seed + 1.0) - 0.5) * 0.11;
    const span = 0.10 + hash01(seed + 2.0) * 0.20;
    const offset = -0.20 + hash01(seed + 3.0) * 0.28;
    const material = new THREE.MeshBasicMaterial({
      color: hash01(seed + 7.0) > 0.52 ? 0xf2f4df : 0xd6ecf0,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(
      createShorelineRibbonGeometry(angle - span * 0.5, span, offset, offset + 0.16 + hash01(seed + 4.0) * 0.11, 8, 0.028),
      material
    );
    mesh.name = "Broken shoreline foam";
    mesh.renderOrder = 4;
    mesh.userData.baseOpacity = 0.18 + hash01(seed + 5.0) * 0.18;
    mesh.userData.phase = hash01(seed + 6.0) * TAU;
    mesh.userData.speed = 0.78 + hash01(seed + 8.0) * 0.44;
    mesh.userData.scalePulse = 0.0045 + hash01(seed + 9.0) * 0.0065;
    group.add(mesh);
  }

  for (let i = 0; i < 28; i += 1) {
    const seed = i * 23.71 + 91.0;
    if (hash01(seed) < 0.38) continue;
    const angle = (i / 28) * TAU + (hash01(seed + 1.0) - 0.5) * 0.18;
    const span = 0.06 + hash01(seed + 2.0) * 0.15;
    const offset = 0.82 + hash01(seed + 3.0) * 1.00;
    const material = new THREE.MeshBasicMaterial({
      color: 0xc8e8ef,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(
      createShorelineRibbonGeometry(angle - span * 0.5, span, offset, offset + 0.075, 6, 0.034),
      material
    );
    mesh.name = "Outer incoming wave line";
    mesh.renderOrder = 3;
    mesh.userData.baseOpacity = 0.10 + hash01(seed + 4.0) * 0.11;
    mesh.userData.phase = hash01(seed + 5.0) * TAU;
    mesh.userData.speed = 0.52 + hash01(seed + 6.0) * 0.34;
    mesh.userData.scalePulse = 0.004 + hash01(seed + 7.0) * 0.006;
    group.add(mesh);
  }
  return group;
}

function createShorelineRibbonGeometry(startAngle, span, innerOffset, outerOffset, segments, yLift) {
  const positions = [];
  const indices = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = startAngle + (span * i) / segments;
    for (const offset of [innerOffset, outerOffset]) {
      const radius = islandShoreRadius(angle) + offset;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const groundY = groundHeightAt(x, z) + yLift;
      const waterY = WATER_LEVEL + yLift;
      const waterBlend = smoothstep(-0.08, 0.26, offset);
      const y = lerp(groundY, waterY, waterBlend);
      positions.push(x, y, z);
    }
  }
  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 1, a + 3, a + 3, a + 2, a);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createOceanLife() {
  const group = new THREE.Group();
  group.name = "Prototype ocean life and fishing props";

  const fishMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x63d8d2, roughness: 0.62, metalness: 0, emissive: 0x063c42, emissiveIntensity: 0.12, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0xf0b35c, roughness: 0.68, metalness: 0, emissive: 0x3c1b04, emissiveIntensity: 0.10, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x7aa7ff, roughness: 0.64, metalness: 0, emissive: 0x071c4a, emissiveIntensity: 0.12, flatShading: true })
  ];
  const rawFishMaterial = new THREE.MeshStandardMaterial({
    color: 0x68d2dd,
    roughness: 0.58,
    metalness: 0,
    emissive: 0x052b35,
    emissiveIntensity: 0.16,
    flatShading: true
  });
  const cookedFishMaterial = new THREE.MeshStandardMaterial({
    color: 0xd46a30,
    roughness: 0.88,
    metalness: 0,
    emissive: 0x3a1004,
    emissiveIntensity: 0.20,
    flatShading: true
  });

  const fish = [];
  const innerRadius = maxIslandShoreRadius() + OCEAN_FISH_SHORE_CLEARANCE;
  const radiusSpan = Math.max(8, OCEAN_FISH_OUTER_RADIUS - innerRadius);
  for (let index = 0; index < OCEAN_FISH_COUNT; index += 1) {
    const seed = 910 + index * 37.0;
    const orbitAngle = hash01(seed) * TAU;
    const orbitRadius = innerRadius + OCEAN_FISH_INNER_BAND + Math.pow(hash01(seed + 1.0), 0.72) * radiusSpan;
    const visual = createLowPolyFish(fishMaterials[index % fishMaterials.length]);
    visual.name = `Ocean fish ${index + 1}`;
    visual.scale.setScalar(0.72 + hash01(seed + 2.0) * 0.42);
    visual.visible = true;
    group.add(visual);
    fish.push({
      id: `ocean-fish-${index + 1}`,
      index,
      group: visual,
      caught: false,
      orbitAngle,
      orbitRadius,
      baseRadius: orbitRadius,
      speed: 0.025 + hash01(seed + 3.0) * 0.032,
      driftPhase: hash01(seed + 4.0) * TAU,
      bobPhase: hash01(seed + 5.0) * TAU,
      bobSpeed: 0.68 + hash01(seed + 6.0) * 0.48,
      depth: 0.34 + hash01(seed + 7.0) * 0.72,
      turnWobble: hash01(seed + 8.0) * 0.18
    });
  }

  const rodGroup = createFishingRodVisual();
  group.add(rodGroup);

  const heldFish = createLowPolyFish(rawFishMaterial);
  heldFish.name = "Held fish inventory visual";
  heldFish.scale.setScalar(0.55);
  heldFish.visible = false;
  group.add(heldFish);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
  const line = new THREE.Line(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: 0xf1f5db, transparent: true, opacity: 0.78 })
  );
  line.name = "Simple fishing line";
  line.visible = false;
  line.renderOrder = 11;
  group.add(line);

  return {
    group,
    fish,
    rodGroup,
    heldFish,
    rawFishMaterial,
    cookedFishMaterial,
    line,
    lastCastStart: new THREE.Vector3(),
    lastCastEnd: new THREE.Vector3(),
    trace: {
      lastResult: "ready",
      lastCaughtId: "",
      activeFishCount: fish.length
    }
  };
}

function createLowPolyFish(material) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.36, 0), material);
  body.name = "Low-poly fish body";
  body.scale.set(1.45, 0.62, 0.78);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.36, 3), material);
  tail.name = "Low-poly fish tail";
  tail.position.set(-0.50, 0, 0);
  tail.rotation.set(0, 0, -Math.PI / 2);
  tail.scale.set(0.85, 1.0, 1.15);
  group.add(tail);

  const finMaterial = material.clone();
  finMaterial.color.offsetHSL(0, -0.04, 0.08);
  const topFin = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 3), finMaterial);
  topFin.name = "Low-poly fish dorsal fin";
  topFin.position.set(0.02, 0.22, 0);
  topFin.rotation.set(Math.PI, 0, 0);
  topFin.scale.set(0.55, 0.68, 1);
  group.add(topFin);

  return group;
}

function createFishingRodVisual() {
  const group = new THREE.Group();
  group.name = "Fishing rod placeholder";
  group.visible = false;
  const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x8a562d, roughness: 0.82, metalness: 0 });
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.86, metalness: 0 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.028, 1.75, 8), rodMaterial);
  rod.name = "Simple fishing rod";
  rod.position.set(0.22, 0.50, -0.34);
  rod.rotation.set(0.66, 0, -0.34);
  group.add(rod);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.038, 0.32, 8), handleMaterial);
  handle.name = "Fishing rod handle";
  handle.position.set(0.06, 0.02, -0.04);
  handle.rotation.set(0.66, 0, -0.34);
  group.add(handle);
  return group;
}

function createOceanInteractionController({ oceanLife, getWorldState }) {
  const state = {
    mode: "idle",
    lastActionTime: -Infinity,
    lineUntil: 0,
    lastResult: "ready",
    lastCaughtId: "",
    castOrigin: "bubbleBoy"
  };

  function cast() {
    const worldState = getWorldState();
    return attemptFishingCast({ oceanLife, worldState, interaction: state });
  }

  if (typeof window !== "undefined") {
    window.__toyboxOceanInteraction = {
      cast,
      state
    };
  }

  return state;
}

function attemptFishingCast({ oceanLife, worldState, interaction }) {
  const inventory = ensureFishInventory(worldState);
  const boy = worldState.bubbleBoy || {};
  const fishing = boy.fishing || (boy.fishing = {});
  const now = worldState.sim ? worldState.sim.elapsedSeconds : 0;
  fishing.lastCastAt = now;
  fishing.attempts = Math.max(0, Number(fishing.attempts) || 0) + 1;
  if (inventory.state !== "none") {
    oceanLife.trace.lastResult = "inventory-full";
    fishing.lastResult = "inventory-full";
    return { result: "inventory-full" };
  }

  const originInfo = resolveFishingOrigin(worldState);
  if (!originInfo.nearWater) {
    oceanLife.trace.lastResult = "too-far-from-ocean";
    fishing.lastResult = "too-far-from-ocean";
    return { result: "too-far-from-ocean" };
  }

  const direction = fishingCastDirection(worldState, originInfo.point, originInfo.source);
  const start = new THREE.Vector3(originInfo.point.x, Math.max(originInfo.point.y + 0.75, WATER_LEVEL + 0.42), originInfo.point.z);
  const end = autonomousCastEnd(oceanLife, start, direction);
  const endRadius = Math.hypot(end.x, end.z);
  if (endRadius > OCEAN_RADIUS - 1) {
    const scale = (OCEAN_RADIUS - 1) / endRadius;
    end.x *= scale;
    end.z *= scale;
  }
  end.y = oceanSurfaceYAtRadius(Math.hypot(end.x, end.z)) - 0.06;

  let caught = null;
  let caughtDistance = Infinity;
  for (const fish of oceanLife.fish) {
    if (fish.caught) continue;
    const distanceToCast = distanceToSegment2d(fish.group.position, start, end);
    const distanceToStart = Math.hypot(fish.group.position.x - start.x, fish.group.position.z - start.z);
    if (distanceToCast <= FISHING_CATCH_RADIUS && distanceToStart <= FISHING_CAST_DISTANCE + FISHING_CATCH_RADIUS) {
      if (distanceToCast < caughtDistance) {
        caught = fish;
        caughtDistance = distanceToCast;
      }
    }
  }

  oceanLife.lastCastStart.copy(start);
  oceanLife.lastCastEnd.copy(end);
  writeFishingLine(oceanLife.line, start, end);
  interaction.lineUntil = (worldState.sim ? worldState.sim.elapsedSeconds : 0) + FISHING_LINE_SECONDS;
  interaction.mode = "fishing";
  interaction.castOrigin = originInfo.source;

  if (!caught) {
    oceanLife.trace.lastResult = "miss";
    fishing.lastResult = "miss";
    return { result: "miss" };
  }

  caught.caught = true;
  caught.group.visible = false;
  inventory.state = "raw";
  inventory.id = caught.id;
  inventory.caughtAt = now;
  inventory.cookedAt = null;
  oceanLife.trace.lastCaughtId = caught.id;
  oceanLife.trace.lastResult = "caught";
  fishing.lastResult = "caught";
  return { result: "caught", fishId: caught.id };
}

function syncOceanLife(oceanLife, worldState, presentationState, time, deltaSeconds) {
  const activeFish = [];
  const innerRadius = maxIslandShoreRadius() + OCEAN_FISH_SHORE_CLEARANCE;
  for (const fish of oceanLife.fish) {
    if (fish.caught) {
      fish.group.visible = false;
      continue;
    }
    fish.orbitAngle += deltaSeconds * fish.speed * (1.0 + Math.sin(time * 0.07 + fish.index) * 0.18);
    const drift = Math.sin(time * 0.11 + fish.driftPhase) * 2.2 + Math.sin(time * 0.043 + fish.index) * 1.6;
    const radius = clamp(fish.baseRadius + drift, innerRadius, OCEAN_FISH_OUTER_RADIUS);
    const x = Math.cos(fish.orbitAngle) * radius;
    const z = Math.sin(fish.orbitAngle) * radius;
    const bob = Math.sin(time * fish.bobSpeed + fish.bobPhase) * 0.10;
    const y = oceanSurfaceYAtRadius(radius) - fish.depth + bob;
    fish.group.visible = true;
    fish.group.position.set(x, y, z);
    fish.group.rotation.y = -fish.orbitAngle + Math.PI * 0.5 + Math.sin(time * 0.5 + fish.index) * fish.turnWobble;
    fish.group.rotation.z = Math.sin(time * fish.bobSpeed + fish.bobPhase) * 0.05;
    activeFish.push(fish);
  }

  const inventory = ensureFishInventory(worldState);
  const boy = worldState.bubbleBoy || {};
  const fishingState = boy.fishing || {};
  const heldFoodAttachmentActive = Boolean(
    presentationState &&
      presentationState.attachment &&
      presentationState.attachment.id === "heldFood"
  );
  const hasFish = inventory.state === "raw" || inventory.state === "cooked";
  syncHeldFish(oceanLife, worldState, inventory, time, heldFoodAttachmentActive);
  oceanLife.trace.activeFishCount = activeFish.length;
  oceanLife.trace.inventoryState = inventory.state;
  oceanLife.trace.lastResult = fishingState.lastResult || oceanLife.trace.lastResult || "ready";
  oceanLife.trace.heldFishVisible = heldFoodAttachmentActive;
  if (typeof window !== "undefined") {
    window.__toyboxOceanLife = {
      fishCount: oceanLife.fish.length,
      activeFishCount: activeFish.length,
      caughtFishCount: oceanLife.fish.length - activeFish.length,
      inventoryFishState: inventory.state,
      inventoryFishId: inventory.id || "",
      heldFishVisible: heldFoodAttachmentActive,
      heldFoodAttachmentActive,
      heldFishInventoryAvailable: hasFish,
      lastFishingResult: oceanLife.trace.lastResult,
      lastCaughtId: oceanLife.trace.lastCaughtId || "",
      fishingGoal: boy.goal || "",
      fishingAction: boy.currentAction || "",
      fishingTargetPosition: fishingState.targetPosition
        ? [fishingState.targetPosition.x, fishingState.targetPosition.y, fishingState.targetPosition.z]
        : null,
      fishingAttempts: Number(fishingState.attempts || 0),
      fishingLastCastAt: Number(fishingState.lastCastAt || -999),
      fishingLastCookAt: Number(fishingState.lastCookAt || -999)
    };
  }
}

function syncOceanInteraction(interaction, oceanLife, worldState, time) {
  const inventory = ensureFishInventory(worldState);
  const boy = worldState.bubbleBoy || {};
  const fishing = boy.fishing || (boy.fishing = {});
  const simTime = worldState.sim ? worldState.sim.elapsedSeconds : time;
  if (
    boy.currentAction === "fishing" &&
    inventory.state === "none" &&
    boy.actionTimer > 0.45 &&
    simTime - (Number(fishing.lastCastAt) || -999) >= FISHING_AUTONOMOUS_CAST_COOLDOWN
  ) {
    const result = attemptFishingCast({ oceanLife, worldState, interaction });
    interaction.lastResult = result.result;
    interaction.lastActionTime = simTime;
  }
  const hasFish = inventory.state === "raw" || inventory.state === "cooked";
  const lineActive = time < interaction.lineUntil;
  const activelyFishing = boy.goal === "goFish" || boy.currentAction === "fishing";
  oceanLife.line.visible = lineActive;
  oceanLife.rodGroup.visible = lineActive || hasFish || activelyFishing || interaction.mode === "fishing";
  syncFishingRod(oceanLife.rodGroup, worldState, time);
  if (!lineActive && !hasFish) interaction.mode = "idle";
  oceanLife.trace.lastResult = interaction.lastResult || oceanLife.trace.lastResult;
}

function syncFishingRod(rodGroup, worldState, time) {
  const boy = worldState.bubbleBoy || {};
  const position = boy.position || { x: 0, y: 0, z: 0 };
  const x = Number(position.x) || 0;
  const z = Number(position.z) || 0;
  const y = groundHeightAt(x, z);
  rodGroup.position.set(x, y + 0.46 + Math.sin(time * 4.0) * 0.01, z);
  rodGroup.rotation.y = Number(boy.facing) || 0;
}

function syncHeldFish(oceanLife, worldState, inventory, time, heldFoodAttachmentActive) {
  const heldFish = oceanLife.heldFish;
  if (!heldFoodAttachmentActive) {
    heldFish.visible = false;
    return;
  }
  const cooked = inventory.state === "cooked";
  const boy = worldState.bubbleBoy || {};
  const position = boy.position || { x: 0, y: 0, z: 0 };
  const facing = Number(boy.facing) || 0;
  const x = Number(position.x) || 0;
  const z = Number(position.z) || 0;
  const y = groundHeightAt(x, z);
  const sideX = Math.cos(facing) * 0.38;
  const sideZ = -Math.sin(facing) * 0.38;
  const frontX = -Math.sin(facing) * 0.24;
  const frontZ = -Math.cos(facing) * 0.24;
  heldFish.visible = true;
  heldFish.position.set(x + sideX + frontX, y + 0.82 + Math.sin(time * 5.2) * 0.018, z + sideZ + frontZ);
  heldFish.rotation.set(0.1, facing + Math.PI * 0.5, Math.sin(time * 3.3) * 0.08);
  heldFish.traverse((object) => {
    if (object.isMesh) object.material = cooked ? oceanLife.cookedFishMaterial : oceanLife.rawFishMaterial;
  });
}

function autonomousCastEnd(oceanLife, start, fallbackDirection) {
  let targetFish = null;
  let targetScore = Infinity;
  for (const fish of oceanLife.fish) {
    if (fish.caught || !fish.group.visible) continue;
    const dx = fish.group.position.x - start.x;
    const dz = fish.group.position.z - start.z;
    const distance = Math.hypot(dx, dz);
    if (distance > FISHING_CAST_DISTANCE + FISHING_CATCH_RADIUS) continue;
    const direction = new THREE.Vector3(dx, 0, dz).normalize();
    const anglePenalty = 1 - Math.max(0, direction.dot(fallbackDirection));
    const score = distance * (1 + anglePenalty * 1.4);
    if (score < targetScore) {
      targetFish = fish;
      targetScore = score;
    }
  }

  if (targetFish) {
    return targetFish.group.position.clone();
  }
  return start.clone().add(fallbackDirection.clone().multiplyScalar(FISHING_CAST_DISTANCE));
}

function resolveFishingOrigin(worldState) {
  const boy = worldState.bubbleBoy || {};
  const boyPoint = vectorLikePoint(boy.position, groundHeightAt(0, 0));
  if (isNearFishingWater(boyPoint)) return { source: "bubbleBoy", point: boyPoint, nearWater: true };
  return { source: "bubbleBoy", point: boyPoint, nearWater: false };
}

function fishingCastDirection(worldState, point, source) {
  const radial = new THREE.Vector3(point.x, 0, point.z);
  if (radial.lengthSq() < 0.000001) radial.set(1, 0, 0);
  radial.normalize();
  if (source !== "bubbleBoy") return radial;

  const facing = Number(worldState.bubbleBoy && worldState.bubbleBoy.facing) || 0;
  const forward = new THREE.Vector3(-Math.sin(facing), 0, -Math.cos(facing)).normalize();
  return forward.dot(radial) > 0.2 ? forward : radial;
}

function isNearFishingWater(point) {
  const radius = Math.hypot(point.x, point.z);
  const shoreRadius = islandShoreRadius(Math.atan2(point.z, point.x));
  return radius >= shoreRadius - FISHING_SHORE_RADIUS && radius <= OCEAN_RADIUS - 2;
}

function ensureFishInventory(worldState) {
  const boy = worldState.bubbleBoy || (worldState.bubbleBoy = {});
  const inventory = boy.inventory || (boy.inventory = {});
  const fish = inventory.fish && typeof inventory.fish === "object" ? inventory.fish : {};
  if (fish.state !== "raw" && fish.state !== "cooked") fish.state = "none";
  if (fish.state === "none") fish.id = null;
  if (fish.caughtAt !== null && !Number.isFinite(fish.caughtAt)) fish.caughtAt = null;
  if (fish.cookedAt !== null && !Number.isFinite(fish.cookedAt)) fish.cookedAt = null;
  inventory.fish = fish;
  return fish;
}

function fishInventoryState(worldState) {
  const fish = worldState && worldState.bubbleBoy && worldState.bubbleBoy.inventory
    ? worldState.bubbleBoy.inventory.fish
    : null;
  return fish && typeof fish.state === "string" ? fish.state : "none";
}

function writeFishingLine(line, start, end) {
  const position = line.geometry.getAttribute("position");
  position.setXYZ(0, start.x, start.y, start.z);
  position.setXYZ(1, end.x, end.y, end.z);
  position.needsUpdate = true;
  line.geometry.computeBoundingSphere();
}

function vectorLikePoint(value, fallbackY = 0) {
  if (!value || typeof value !== "object") return { x: 0, y: fallbackY, z: 0 };
  return {
    x: Number(value.x) || 0,
    y: Number.isFinite(value.y) ? value.y : fallbackY,
    z: Number(value.z) || 0
  };
}

function distanceToSegment2d(point, start, end) {
  const px = Number(point.x) || 0;
  const pz = Number(point.z) || 0;
  const sx = Number(start.x) || 0;
  const sz = Number(start.z) || 0;
  const ex = Number(end.x) || 0;
  const ez = Number(end.z) || 0;
  const dx = ex - sx;
  const dz = ez - sz;
  const lengthSq = dx * dx + dz * dz;
  if (lengthSq <= 0.000001) return Math.hypot(px - sx, pz - sz);
  const t = clamp(((px - sx) * dx + (pz - sz) * dz) / lengthSq, 0, 1);
  return Math.hypot(px - (sx + dx * t), pz - (sz + dz * t));
}

function createBubbleBoy() {
  const group = new THREE.Group();
  group.name = "Bubble Boy";
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xbcefff,
    roughness: 0.24,
    metalness: 0.0,
    clearcoat: 0.9,
    clearcoatRoughness: 0.16,
    sheen: 0.35,
    sheenColor: new THREE.Color(0xffd6f4),
    emissive: 0x12344c,
    emissiveIntensity: 0.07
  });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.52, 48, 32), bodyMaterial);
  body.name = "Bubble Boy smooth body";
  body.position.set(0, 0.66, 0);
  body.scale.set(1.02, 1.07, 0.96);
  body.castShadow = true;
  body.receiveShadow = true;
  body.userData.restPosition = body.position.clone();
  group.add(body);

  const limbMaterial = bodyMaterial.clone();
  limbMaterial.color.set(0x9bdfff);
  const limbs = [
    { name: "left arm", position: [-0.45, 0.54, -0.02], scale: [0.16, 0.19, 0.13] },
    { name: "right arm", position: [0.45, 0.54, -0.02], scale: [0.16, 0.19, 0.13] },
    { name: "left foot", position: [-0.22, 0.17, 0.05], scale: [0.20, 0.12, 0.14] },
    { name: "right foot", position: [0.22, 0.17, 0.05], scale: [0.20, 0.12, 0.14] }
  ];
  const limbMeshes = {};
  for (const limb of limbs) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), limbMaterial);
    mesh.name = `Bubble Boy ${limb.name}`;
    mesh.position.fromArray(limb.position);
    mesh.scale.fromArray(limb.scale);
    mesh.userData.restPosition = mesh.position.clone();
    mesh.userData.restScale = mesh.scale.clone();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    limbMeshes[limb.name.replace(/\s+/g, "")] = mesh;
  }

  const faceMaterial = new THREE.MeshBasicMaterial({
    color: 0x071018,
    side: THREE.DoubleSide
  });
  const sparkMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff5c6,
    side: THREE.DoubleSide
  });
  const cheekMaterial = new THREE.MeshBasicMaterial({
    color: 0xf27b6f,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const markMaterial = new THREE.MeshBasicMaterial({
    color: 0xffca5d,
    side: THREE.DoubleSide
  });

  const faceParts = {
    leftEye: addFaceDisk(group, faceMaterial, [-0.165, 0.745, -0.505], [0.070, 0.102]),
    rightEye: addFaceDisk(group, faceMaterial, [0.165, 0.745, -0.505], [0.070, 0.102]),
    leftSpark: addFaceDisk(group, sparkMaterial, [-0.188, 0.786, -0.512], [0.020, 0.026]),
    rightSpark: addFaceDisk(group, sparkMaterial, [0.142, 0.786, -0.512], [0.020, 0.026]),
    leftCheek: addFaceDisk(group, cheekMaterial, [-0.255, 0.610, -0.482], [0.070, 0.034]),
    rightCheek: addFaceDisk(group, cheekMaterial, [0.255, 0.610, -0.482], [0.070, 0.034]),
    mouth: addMouth(group, faceMaterial),
    spiral: addSpiral(group, markMaterial)
  };

  const glint = addFaceDisk(group, sparkMaterial, [-0.145, 0.960, -0.430], [0.055, 0.020]);
  glint.rotation.z = -0.32;
  faceParts.glint = glint;

  group.traverse((object) => {
    if (object.isMesh && object.material && object.material.transparent) object.renderOrder = 5;
  });

  return {
    group,
    body,
    limbs: limbMeshes,
    faceParts,
    baseScale: body.scale.clone(),
    breath: 0,
    smoothGaze: new THREE.Vector2(0, 0)
  };
}

function addFaceDisk(group, material, position, scale) {
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 32), material);
  mesh.position.fromArray(position);
  mesh.scale.set(scale[0], scale[1], 1);
  mesh.rotation.y = Math.PI;
  mesh.renderOrder = 4;
  group.add(mesh);
  return mesh;
}

function addMouth(group, material) {
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.012, 8, 28, Math.PI), material);
  mouth.name = "Bubble Boy attached smile";
  mouth.position.set(0, 0.575, -0.506);
  mouth.rotation.set(0, Math.PI, Math.PI);
  mouth.scale.set(1.0, 0.72, 1.0);
  mouth.renderOrder = 4;
  group.add(mouth);
  return mouth;
}

function addSpiral(group, material) {
  const curve = new THREE.CatmullRomCurve3(
    Array.from({ length: 24 }, (_, index) => {
      const t = index / 23;
      const angle = t * Math.PI * 4.0;
      const radius = 0.015 + t * 0.065;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    })
  );
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.006, 6, false), material);
  mesh.name = "Bubble Boy front spiral";
  mesh.position.set(0.012, 0.935, -0.506);
  mesh.rotation.y = Math.PI;
  mesh.renderOrder = 4;
  group.add(mesh);
  return mesh;
}

export function createBubbleBoyHumanoid({ scene, THREE: threeRef = THREE, existingPosition } = {}) {
  disposeBubbleBoyHumanoid();

  const root = new threeRef.Group();
  root.name = "Bubble Boy humanoid root";
  root.visible = false;
  if (existingPosition && typeof existingPosition.x === "number") {
    root.position.copy(existingPosition);
  }
  if (scene && typeof scene.add === "function") scene.add(root);

  const controller = {
    root,
    model: null,
    mixer: null,
    actions: Object.create(null),
    activeAction: null,
    prevAction: null,
    state: "loading",
    velocity: new threeRef.Vector3(),
    modelRestRotation: null,
    headBone: null,
    neckBone: null,
    spineBone: null,
    leftArmBone: null,
    rightArmBone: null,
    leftForeArmBone: null,
    rightForeArmBone: null,
    eyeFallback: null,
    baseState: "Idle",
    pendingBaseState: "Idle",
    pendingBaseFrames: 0,
    cursorTarget: new threeRef.Vector2(),
    cursorSmoothed: new threeRef.Vector2(),
    previousPosition: null,
    previousFacing: null,
    currentPosition: new threeRef.Vector3(),
    actualSpeed: 0,
    measuredSpeed: 0,
    simSpeed: 0,
    actualTurnAmount: 0,
    actualTurnSpeed: 0,
    walkInPlaceFrames: 0,
    currentEmote: null,
    lastEmoteSource: "",
    availableClips: [],
    ready: false,
    usingFallback: true,
    loadError: null,
    parent: scene || null,
    disposed: false,
    finishedHandler: null
  };

  bubbleBoyHumanoid = controller;
  exposeBubbleBoyHumanoid(controller);

  new GLTFLoader().load(
    ROBOT_EXPRESSIVE_URL,
    (gltf) => configureBubbleBoyHumanoid(controller, gltf, threeRef),
    undefined,
    (error) => {
      controller.state = "fallback";
      controller.loadError = error;
      controller.usingFallback = true;
      root.visible = false;
      console.warn("Bubble Boy humanoid GLB unavailable; keeping procedural Bubble Boy fallback.", error);
    }
  );

  return controller;
}

export function updateBubbleBoyHumanoid(dt, input = {}, cursor = null, world = null, presentation = null) {
  const controller = bubbleBoyHumanoid;
  if (!controller || controller.disposed || controller.usingFallback || !controller.ready) {
    if (controller && controller.root) controller.root.visible = false;
    return false;
  }

  const simBoy = world && world.bubbleBoy ? world.bubbleBoy : {};
  const pose = simBoy.pose || {};
  const affect = simBoy.affect || {};
  const animation = presentation && presentation.animation ? presentation.animation : {};
  const locomotion = animation.locomotion || {};
  const attentionEmote = animation.attentionEmote || {};
  const overlay = presentation && presentation.proceduralOverlay ? presentation.proceduralOverlay : "";
  const locomotionOverlay = animation.locomotionOverlay || locomotion.overlay || "";
  const position = simBoy.position || {};
  const x = Number.isFinite(position.x) ? position.x : 0;
  const z = Number.isFinite(position.z) ? position.z : 0;
  const ground =
    input && typeof input.groundHeightAt === "function"
      ? input.groundHeightAt(x, z)
      : Number.isFinite(position.y)
        ? position.y
        : 0;
  const bounce = (pose.bounce || 0) * 1.25;
  const restVisualLift = overlay === "lieDownAdditive" || overlay === "sleepLoop" ? 0.36 : 0;

  controller.root.visible = true;
  controller.root.position.set(x, ground + bounce + restVisualLift, z);
  if (Number.isFinite(simBoy.facing)) controller.root.rotation.y = simBoy.facing;
  updateHumanoidActualMovement(controller, dt, simBoy);

  const measuredBaseState = selectBubbleBoyHumanoidBaseState(controller, simBoy, presentation);
  const baseState = resolveStableBubbleBoyHumanoidBaseState(controller, measuredBaseState);
  controller.baseState = baseState;
  const emote = selectBubbleBoyHumanoidEmote(simBoy, presentation);
  if (emote && emote.key !== controller.lastEmoteSource) {
    playBubbleBoyEmote(emote.name, 0.12);
    controller.lastEmoteSource = emote.key;
  } else if (!emote) {
    controller.lastEmoteSource = "";
  }
  if (!controller.currentEmote) {
    const presentationClip = animation.clip || "";
    const fadeSeconds = Number.isFinite(animation.fadeSeconds) ? animation.fadeSeconds : 0.18;
    const timeScale = Number.isFinite(animation.timeScale) ? animation.timeScale : 1;
    setBubbleBoyAnimationState(presentationClip || baseState, fadeSeconds, { timeScale });
  }
  warnIfHumanoidWalksInPlace(controller);
  updateBubbleBoyHumanoidProceduralOverlay(controller, dt, presentation);

  if (controller.mixer) controller.mixer.update(Math.max(0, dt || 0));
  updateBubbleBoyHumanoidUpperBodyOverlay(controller, dt, presentation);
  updateBubbleBoyHumanoidHeadTracking(controller, dt, cursor, pose);

  window.__bubbleBoyMotion = {
    breath: 0,
    bounce,
    humanoid: true,
    humanoidState: controller.state,
    humanoidBaseState: controller.baseState,
    proceduralOverlay: overlay,
    attentionEmoteState: attentionEmote.state || "",
    attentionEmoteClip: attentionEmote.clip || animation.clip || "",
    attentionEmoteName: attentionEmote.emote || animation.emote || "",
    attentionEmoteOverlay: animation.emoteOverlay || attentionEmote.overlay || "",
    attentionEmoteIntensity: Number.isFinite(attentionEmote.intensity) ? attentionEmote.intensity : 0,
    attentionEmoteRootMotion: Boolean(attentionEmote.rootMotion),
    locomotionState: locomotion.state || "",
    locomotionClip: locomotion.clip || animation.clip || "",
    locomotionOverlay,
    locomotionTimeScale: Number.isFinite(locomotion.timeScale) ? locomotion.timeScale : Number(animation.timeScale || 1),
    locomotionRootMotion: Boolean(locomotion.rootMotion),
    locomotionTargetId: locomotion.targetId || "",
    locomotionTargetDistance: locomotion.targetDistance == null ? null : locomotion.targetDistance,
    locomotionTurnAmount: Number.isFinite(locomotion.turnAmount) ? locomotion.turnAmount : controller.actualTurnAmount,
    humanoidClips: controller.availableClips.slice(),
    actualSpeed: controller.actualSpeed,
    measuredSpeed: controller.measuredSpeed,
    simSpeed: controller.simSpeed,
    actualTurnSpeed: controller.actualTurnSpeed,
    headTracking: Boolean(controller.headBone),
    eyeFallback: Boolean(controller.eyeFallback && controller.eyeFallback.group.visible),
    lean: controller.cursorSmoothed.length(),
    visibilityScale: 1 + clamp((affect.attention || 0) * 0.015, 0, 0.015)
  };

  return true;
}

export function setBubbleBoyAnimationState(name, fade = 0.18, options = {}) {
  const controller = bubbleBoyHumanoid;
  if (!controller || !controller.ready || controller.disposed) return false;
  const stateName = canonicalHumanoidBaseState(name);
  const next = findBubbleBoyHumanoidAction(controller, HUMANOID_BASE_CLIPS[stateName] || [stateName]);
  if (!next) return false;
  const timeScale = clamp(Number.isFinite(options.timeScale) ? options.timeScale : 1, 0.35, 1.45);
  if (controller.activeAction === next && controller.state === stateName) {
    next.setEffectiveTimeScale(timeScale);
    return true;
  }

  const fadeSeconds = Number.isFinite(fade) ? Math.max(0, fade) : 0.18;
  controller.prevAction = controller.activeAction;
  if (controller.prevAction && controller.prevAction !== next) controller.prevAction.fadeOut(fadeSeconds);

  next.enabled = true;
  next.reset();
  next.setLoop(THREE.LoopRepeat, Infinity);
  next.clampWhenFinished = false;
  next.setEffectiveTimeScale(timeScale);
  next.setEffectiveWeight(1);
  next.fadeIn(fadeSeconds);
  next.play();

  controller.activeAction = next;
  controller.state = stateName;
  return true;
}

export function playBubbleBoyEmote(name, fade = 0.12) {
  const controller = bubbleBoyHumanoid;
  if (!controller || !controller.ready || controller.disposed) return false;
  const emoteName = canonicalHumanoidEmote(name);
  const next = findBubbleBoyHumanoidAction(controller, HUMANOID_EMOTE_CLIPS[emoteName] || [emoteName]);
  if (!next) return false;

  const fadeSeconds = Number.isFinite(fade) ? Math.max(0, fade) : 0.12;
  const previous = controller.currentEmote || controller.activeAction;
  if (previous && previous !== next) previous.fadeOut(fadeSeconds);

  next.enabled = true;
  next.reset();
  next.setLoop(THREE.LoopOnce, 1);
  next.clampWhenFinished = true;
  next.setEffectiveTimeScale(1);
  next.setEffectiveWeight(1);
  next.fadeIn(fadeSeconds);
  next.play();

  controller.prevAction = previous;
  controller.currentEmote = next;
  controller.state = emoteName;
  return true;
}

export function disposeBubbleBoyHumanoid() {
  const controller = bubbleBoyHumanoid;
  if (!controller) return;
  controller.disposed = true;
  if (controller.mixer && controller.finishedHandler) {
    controller.mixer.removeEventListener("finished", controller.finishedHandler);
  }
  if (controller.mixer) controller.mixer.stopAllAction();
  if (controller.root) {
    controller.root.traverse((object) => {
      if (object.geometry && typeof object.geometry.dispose === "function") object.geometry.dispose();
      disposeMaterial(object.material);
    });
    if (controller.root.parent) controller.root.parent.remove(controller.root);
  }
  if (typeof window !== "undefined" && window.__bubbleBoyHumanoid && window.__bubbleBoyHumanoid.controller === controller) {
    delete window.__bubbleBoyHumanoid;
  }
  bubbleBoyHumanoid = null;
}

function configureBubbleBoyHumanoid(controller, gltf, threeRef) {
  if (!controller || controller.disposed) return;
  const model = gltf.scene || (Array.isArray(gltf.scenes) ? gltf.scenes[0] : null);
  if (!model) {
    controller.state = "fallback";
    controller.usingFallback = true;
    console.warn("Bubble Boy humanoid GLB loaded without a scene; keeping procedural fallback.");
    return;
  }

  model.name = "RobotExpressive Bubble Boy prototype";
  model.rotation.y = Math.PI;
  normalizeBubbleBoyHumanoidModel(model, threeRef);
  controller.modelRestRotation = model.rotation.clone();
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });

  controller.root.add(model);
  controller.model = model;
  controller.mixer = new threeRef.AnimationMixer(model);
  controller.availableClips = (gltf.animations || []).map((clip) => clip.name);
  for (const clip of gltf.animations || []) {
    controller.actions[clip.name] = controller.mixer.clipAction(clip);
  }

  configureBubbleBoyHumanoidActions(controller);
  controller.headBone = findBubbleBoyHumanoidBone(model, [/^mixamorighead$/i, /^head$/i, /head/i]);
  controller.neckBone = findBubbleBoyHumanoidBone(model, [/^mixamorigneck$/i, /^neck$/i, /neck/i]);
  controller.spineBone = findBubbleBoyHumanoidBone(model, [/^mixamorigspine2$/i, /^mixamorigspine1$/i, /^spine2$/i, /^spine1$/i, /spine/i]);
  controller.leftArmBone = findBubbleBoyHumanoidBone(model, [/^mixamorigleftarm$/i, /^leftarm$/i, /leftarm/i]);
  controller.rightArmBone = findBubbleBoyHumanoidBone(model, [/^mixamor_rightarm$/i, /^mixamorigrightarm$/i, /^rightarm$/i, /rightarm/i]);
  controller.leftForeArmBone = findBubbleBoyHumanoidBone(model, [/^mixamorigleftforearm$/i, /^leftforearm$/i, /leftforearm/i]);
  controller.rightForeArmBone = findBubbleBoyHumanoidBone(model, [/^mixamorigrightforearm$/i, /^rightforearm$/i, /rightforearm/i]);
  if (controller.headBone) controller.headBone.userData.bubbleBoyRestRotation = controller.headBone.rotation.clone();
  if (controller.neckBone) controller.neckBone.userData.bubbleBoyRestRotation = controller.neckBone.rotation.clone();
  if (controller.spineBone) controller.spineBone.userData.bubbleBoyRestRotation = controller.spineBone.rotation.clone();
  if (controller.leftArmBone) controller.leftArmBone.userData.bubbleBoyRestRotation = controller.leftArmBone.rotation.clone();
  if (controller.rightArmBone) controller.rightArmBone.userData.bubbleBoyRestRotation = controller.rightArmBone.rotation.clone();
  if (controller.leftForeArmBone) controller.leftForeArmBone.userData.bubbleBoyRestRotation = controller.leftForeArmBone.rotation.clone();
  if (controller.rightForeArmBone) controller.rightForeArmBone.userData.bubbleBoyRestRotation = controller.rightForeArmBone.rotation.clone();
  controller.eyeFallback = createBubbleBoyHumanoidEyeFallback(threeRef);
  controller.eyeFallback.group.visible = !controller.headBone;
  controller.root.add(controller.eyeFallback.group);

  controller.finishedHandler = (event) => {
    if (event.action !== controller.currentEmote) return;
    controller.currentEmote = null;
    setBubbleBoyAnimationState(controller.baseState || "Idle", 0.18);
  };
  controller.mixer.addEventListener("finished", controller.finishedHandler);

  controller.ready = true;
  controller.usingFallback = false;
  controller.root.visible = true;
  setBubbleBoyAnimationState("Idle", 0);
}

function normalizeBubbleBoyHumanoidModel(model, threeRef) {
  model.updateMatrixWorld(true);
  const box = new threeRef.Box3().setFromObject(model);
  const height = box.max.y - box.min.y;
  const scale = height > 0.0001 ? HUMANOID_TARGET_HEIGHT / height : 0.48;
  model.scale.multiplyScalar(scale);
  model.updateMatrixWorld(true);
  const scaledBox = new threeRef.Box3().setFromObject(model);
  model.position.y -= scaledBox.min.y;
}

function configureBubbleBoyHumanoidActions(controller) {
  for (const name of Object.keys(HUMANOID_BASE_CLIPS)) {
    const action = findBubbleBoyHumanoidAction(controller, HUMANOID_BASE_CLIPS[name]);
    if (!action) continue;
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  }
  for (const name of Object.keys(HUMANOID_EMOTE_CLIPS)) {
    const action = findBubbleBoyHumanoidAction(controller, HUMANOID_EMOTE_CLIPS[name]);
    if (!action) continue;
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }
}

function updateHumanoidActualMovement(controller, dt, simBoy = {}) {
  controller.currentPosition.copy(controller.root.position);
  const deltaSeconds = Math.max(0.0001, Number(dt) || 0);
  if (controller.previousPosition) {
    const dx = controller.currentPosition.x - controller.previousPosition.x;
    const dz = controller.currentPosition.z - controller.previousPosition.z;
    controller.velocity.set(dx / deltaSeconds, 0, dz / deltaSeconds);
    controller.measuredSpeed = Math.hypot(dx, dz) / deltaSeconds;
  } else {
    controller.velocity.set(0, 0, 0);
    controller.measuredSpeed = 0;
  }
  controller.simSpeed = bubbleBoyVelocitySpeed(simBoy.velocity);
  controller.actualSpeed = Math.max(controller.measuredSpeed, controller.simSpeed);
  const facing = Number.isFinite(simBoy.facing) ? simBoy.facing : controller.root.rotation.y;
  if (controller.previousFacing != null) {
    controller.actualTurnAmount = angleDelta(facing, controller.previousFacing);
    controller.actualTurnSpeed = Math.abs(controller.actualTurnAmount) / deltaSeconds;
  } else {
    controller.actualTurnAmount = 0;
    controller.actualTurnSpeed = 0;
  }
  controller.previousFacing = facing;
  if (controller.previousPosition) {
    controller.previousPosition.copy(controller.currentPosition);
  } else {
    controller.previousPosition = controller.currentPosition.clone();
  }
}

function selectBubbleBoyHumanoidBaseState(controller, simBoy = {}, presentation = null) {
  const animation = presentation && presentation.animation ? presentation.animation : {};
  const locomotion = animation.locomotion || {};
  if (locomotion.clip || animation.clip) {
    return canonicalHumanoidBaseState(locomotion.clip || animation.clip);
  }
  const actualSpeed = Math.max(controller.actualSpeed || 0, bubbleBoyVelocitySpeed(simBoy.velocity));
  if (actualSpeed <= HUMANOID_IDLE_SPEED_THRESHOLD) return "Idle";
  if (actualSpeed < HUMANOID_RUN_SPEED_THRESHOLD) return "Walking";
  return "Running";
}

function resolveStableBubbleBoyHumanoidBaseState(controller, measuredBaseState) {
  if (measuredBaseState !== controller.pendingBaseState) {
    controller.pendingBaseState = measuredBaseState;
    controller.pendingBaseFrames = 1;
  } else {
    controller.pendingBaseFrames += 1;
  }

  if (
    controller.pendingBaseState !== controller.baseState &&
    controller.pendingBaseFrames >= HUMANOID_STATE_STABLE_FRAMES
  ) {
    return controller.pendingBaseState;
  }

  return controller.baseState;
}

function warnIfHumanoidWalksInPlace(controller) {
  const locomotionState = controller.state === "Walking" || controller.state === "Running";
  if (controller.currentEmote || !locomotionState || controller.actualSpeed > HUMANOID_IDLE_SPEED_THRESHOLD) {
    controller.walkInPlaceFrames = 0;
    return;
  }

  controller.walkInPlaceFrames += 1;
  if (
    controller.walkInPlaceFrames === HUMANOID_STUCK_WARNING_FRAMES &&
    typeof window !== "undefined" &&
    window.__toyboxHumanoidDebug
  ) {
    console.warn(
      `Bubble Boy humanoid ${controller.state} animation has near-zero displacement; forcing velocity-derived Idle.`
    );
  }
}

function updateBubbleBoyHumanoidProceduralOverlay(controller, dt, presentation) {
  if (!controller || !controller.model || !controller.modelRestRotation) return;
  const overlay = presentation && presentation.proceduralOverlay ? presentation.proceduralOverlay : "";
  const animation = presentation && presentation.animation ? presentation.animation : {};
  const locomotion = animation.locomotion || {};
  const locomotionOverlay = animation.locomotionOverlay || locomotion.overlay || "";
  const smoothing = 1 - Math.exp(-Math.max(0, dt || 0) * 7.5);
  const target = controller.modelRestRotation;
  const mixerTime = controller.mixer ? controller.mixer.time : 0;
  const gait = Math.sin(mixerTime * (
    locomotionOverlay === "shortJog" || locomotionOverlay === "routeJog"
      ? 8.8
      : locomotionOverlay === "slowWalk" || locomotionOverlay === "routeSlowWalk"
        ? 4.6
        : 5.8
  ));
  const turnAmount = clamp(
    Number.isFinite(locomotion.turnAmount) ? locomotion.turnAmount : controller.actualTurnAmount,
    -0.92,
    0.92
  );
  const taskBend =
    overlay === "bendPickup" ||
    overlay === "pickup" ||
    overlay === "depositMaterial" ||
    overlay === "depositMaterials" ||
    overlay === "setItemDown" ||
    overlay === "sortMaterials" ||
    overlay === "depositStorage" ||
    overlay === "withdrawStorage" ||
    overlay === "tidyCamp" ||
    overlay === "inspectCampLayout" ||
    overlay === "hammerStrike" ||
    overlay === "tieRopeVines" ||
    overlay === "placePlank" ||
    overlay === "pushPostUpright" ||
    overlay === "carveTool" ||
    overlay === "inspectProgress" ||
    overlay === "repairShelter" ||
    overlay === "reinforceShelter" ||
    overlay === "craftAtWorkbench" ||
    overlay === "pathRakeSweep" ||
    overlay === "kneelPlaceStone" ||
    overlay === "crouchFire" ||
    overlay === "fireCare" ||
    overlay === "fireKneel" ||
    overlay === "fireAddFuel" ||
    overlay === "fireFan" ||
    overlay === "fireStoke" ||
    overlay === "cookFish" ||
    overlay === "cookMeal" ||
    overlay === "stirPot" ||
    overlay === "gardenDig" ||
    overlay === "gardenPlant" ||
    overlay === "gardenPlantSeed" ||
    overlay === "gardenPatSoil" ||
    overlay === "gardenHarvest" ||
    overlay === "gardenInspect" ||
    overlay === "storeHarvest" ||
    overlay === "prepMeal" ||
    overlay === "fishCast" ||
    overlay === "fishWait" ||
    overlay === "fishReel" ||
    overlay === "fishCatchReaction" ||
    overlay === "pierFish" ||
    overlay === "setFishTrap" ||
    overlay === "checkFishTrap" ||
    overlay === "collectCatch" ||
    overlay === "hangCatchDryingRack" ||
    overlay === "raftLash" ||
    overlay === "raftPush" ||
    overlay === "raftBoard" ||
	    overlay === "raftPaddle" ||
	    overlay === "raftLookOut" ||
	    overlay === "raftDisembark" ||
	    overlay === "returnCelebrate" ||
	    overlay === "toyCraft" ||
	    overlay === "toyPlace" ||
	    overlay === "playBlocks" ||
	    overlay === "hopPlay" ||
	    overlay === "kickBall" ||
	    overlay === "tossBall" ||
	    overlay === "launchKite" ||
	    overlay === "holdKite" ||
	    overlay === "spinTop" ||
	    overlay === "putToyAway";
  const carryOverlay =
    overlay === "carryAttachment" ||
    overlay === "carryPlank" ||
    overlay === "carryLog" ||
    overlay === "carryHarvest" ||
    overlay === "carryRaftLog";
  const buildHammerOverlay = overlay === "hammerStrike" || overlay === "carveTool" || overlay === "craftAtWorkbench";
  const buildTieOverlay = overlay === "tieRopeVines" || overlay === "reinforceShelter";
  const buildPlaceOverlay = overlay === "placePlank" || overlay === "repairShelter";
  const buildPushOverlay = overlay === "pushPostUpright";
  const buildInspectOverlay = overlay === "inspectProgress";
  const gatherBendOverlay = overlay === "bendPickup" || overlay === "pickup";
  const placeDownOverlay = overlay === "depositMaterial" || overlay === "depositMaterials" || overlay === "setItemDown";
  const storageSortOverlay = overlay === "sortMaterials";
  const storageDepositOverlay = overlay === "depositStorage" || overlay === "withdrawStorage";
  const storageTidyOverlay = overlay === "tidyCamp";
  const storageInspectOverlay = overlay === "inspectCampLayout";
  const fireKneelOverlay = overlay === "crouchFire" || overlay === "fireKneel";
  const fireCareOverlay =
    overlay === "fireCare" ||
    overlay === "fireWarmHands" ||
    overlay === "fireAddFuel" ||
    overlay === "fireFan" ||
    overlay === "fireStoke";
  const cookingOverlay = overlay === "cookFish" || overlay === "cookMeal" || overlay === "stirPot";
  const gardenGroundOverlay =
    overlay === "gardenDig" ||
    overlay === "gardenPlantSeed" ||
    overlay === "gardenPlant" ||
    overlay === "gardenPatSoil" ||
    overlay === "gardenHarvest";
  const foodHandOverlay = overlay === "holdFood" || overlay === "eatFood";
  const fishCastOverlay = overlay === "fishCast";
  const fishWaitOverlay = overlay === "fishWait";
  const fishReelOverlay = overlay === "fishReel";
  const fishCatchOverlay = overlay === "fishCatchReaction";
  const pierFishOverlay = overlay === "pierFish";
  const fishTrapGroundOverlay =
    overlay === "setFishTrap" ||
    overlay === "checkFishTrap" ||
    overlay === "collectCatch";
  const fishTrapHangOverlay = overlay === "hangCatchDryingRack";
  const restSettleOverlay = overlay === "settleHammock" || overlay === "settleBed";
  const restSeatedOverlay = overlay === "sitNearFire" || overlay === "restInsideShelter";
  const restSleepOverlay = overlay === "lieDownAdditive" || overlay === "sleepLoop";
  const restWakeOverlay = overlay === "wakeRest" || overlay === "wakeStretch";
  const restStandOverlay = overlay === "standUpFromRest";
  const raftLashOverlay = overlay === "raftLash";
  const raftPushOverlay = overlay === "raftPush";
  const raftBoardOverlay = overlay === "raftBoard" || overlay === "raftDisembark";
	  const raftPaddleOverlay = overlay === "raftPaddle";
	  const raftLookOutOverlay = overlay === "raftLookOut";
	  const raftSitOverlay = overlay === "raftSitAboard";
	  const raftCelebrateOverlay = overlay === "returnCelebrate";
	  const toyGroundOverlay =
	    overlay === "toyCraft" ||
	    overlay === "toyPlace" ||
	    overlay === "playBlocks" ||
	    overlay === "spinTop" ||
	    overlay === "putToyAway";
	  const toyBallOverlay = overlay === "kickBall" || overlay === "tossBall";
	  const toyKiteOverlay = overlay === "launchKite" || overlay === "holdKite";
	  const toyHopOverlay = overlay === "hopPlay";
  const locomotionBend =
    locomotionOverlay === "stopSettle"
      ? 0.045 + Math.sin(mixerTime * 8.2) * 0.012
      : locomotionOverlay === "startStep" || locomotionOverlay === "routeStartStep"
        ? -0.10 + Math.max(0, gait) * 0.035
        : locomotionOverlay === "approachTarget" || locomotionOverlay === "routeApproach"
          ? -0.070 + Math.max(0, gait) * 0.020
          : locomotionOverlay === "shortJog" || locomotionOverlay === "routeJog"
            ? -0.11 + Math.max(0, gait) * 0.025
            : locomotionOverlay === "slowWalk" || locomotionOverlay === "routeSlowWalk"
              ? -0.035 + gait * 0.012
              : locomotionOverlay === "normalWalk" || locomotionOverlay === "routeWalk"
                ? -0.052 + gait * 0.018
                : locomotionOverlay === "turnInPlace"
                  ? -0.012
                  : null;
  const targetX = restSleepOverlay
    ? target.x + Math.PI / 2
    : restSettleOverlay
      ? target.x - 0.16 + Math.sin(mixerTime * 3.2) * 0.014
    : overlay === "restSit"
      ? target.x - 0.040
    : restSeatedOverlay
      ? target.x - 0.055 + Math.sin(mixerTime * 2.4) * 0.006
    : overlay === "wakeRest"
      ? target.x - 0.085 + Math.max(0, Math.sin(mixerTime * 4.2)) * 0.018
    : overlay === "wakeStretch"
      ? target.x - 0.040 + Math.max(0, Math.sin(mixerTime * 4.8)) * 0.012
    : restStandOverlay
      ? target.x - 0.025
    : fireKneelOverlay
      ? target.x - 0.34 + Math.sin(mixerTime * 4.4) * 0.020
    : buildPushOverlay
      ? target.x - 0.18 + Math.max(0, Math.sin(mixerTime * 4.6)) * 0.018
    : buildHammerOverlay
      ? target.x - 0.13 + Math.max(0, Math.sin(mixerTime * 7.8)) * 0.030
    : buildTieOverlay
      ? target.x - 0.11 + Math.sin(mixerTime * 5.0) * 0.020
    : buildPlaceOverlay
      ? target.x - 0.22 + Math.max(0, Math.sin(mixerTime * 5.4)) * 0.028
    : buildInspectOverlay
      ? target.x - 0.055
    : fishTrapGroundOverlay
      ? target.x - 0.22 + Math.max(0, Math.sin(mixerTime * 5.2)) * 0.024
    : fishTrapHangOverlay
      ? target.x - 0.12 + Math.max(0, Math.sin(mixerTime * 4.6)) * 0.018
    : fishCastOverlay
      ? target.x - 0.075 + Math.max(0, Math.sin(mixerTime * 5.4)) * 0.018
    : fishReelOverlay
      ? target.x - 0.10 + Math.sin(mixerTime * 5.8) * 0.020
    : pierFishOverlay
      ? target.x - 0.070 + Math.sin(mixerTime * 3.2) * 0.010
    : fishWaitOverlay
      ? target.x - 0.030
    : fishCatchOverlay
      ? target.x - 0.040 + Math.max(0, Math.sin(mixerTime * 6.2)) * 0.010
    : raftSitOverlay
      ? target.x + 0.12 + Math.sin(mixerTime * 2.4) * 0.008
    : raftPaddleOverlay
      ? target.x - 0.11 + Math.max(0, Math.sin(mixerTime * 5.6)) * 0.030
    : raftPushOverlay
      ? target.x - 0.20 + Math.max(0, Math.sin(mixerTime * 4.8)) * 0.020
    : raftBoardOverlay
      ? target.x - 0.10 + Math.sin(mixerTime * 3.8) * 0.014
    : raftLashOverlay
      ? target.x - 0.11 + Math.sin(mixerTime * 5.4) * 0.018
    : raftLookOutOverlay
      ? target.x - 0.045
	    : raftCelebrateOverlay
	      ? target.x - 0.025 + Math.max(0, Math.sin(mixerTime * 5.8)) * 0.010
	    : toyGroundOverlay
	      ? target.x - 0.20 + Math.max(0, Math.sin(mixerTime * 5.2)) * 0.026
	    : toyBallOverlay
	      ? target.x - 0.075 + Math.max(0, Math.sin(mixerTime * 5.8)) * 0.018
	    : toyKiteOverlay
	      ? target.x - 0.055 + Math.sin(mixerTime * 2.8) * 0.014
	    : toyHopOverlay
	      ? target.x - 0.045 + Math.max(0, Math.sin(mixerTime * 7.2)) * 0.016
	    : storageSortOverlay
	      ? target.x - 0.18 + Math.sin(mixerTime * 4.6) * 0.018
    : storageDepositOverlay
      ? target.x - 0.22 + Math.max(0, Math.sin(mixerTime * 4.8)) * 0.026
    : storageTidyOverlay
      ? target.x - 0.10 + Math.sin(mixerTime * 4.0) * 0.020
    : storageInspectOverlay
      ? target.x - 0.050
    : fireCareOverlay
      ? target.x - 0.20 + Math.sin(mixerTime * 5.0) * 0.024
    : cookingOverlay
      ? target.x - 0.15 + Math.sin(mixerTime * 4.8) * 0.020
    : overlay === "prepMeal"
      ? target.x - 0.13 + Math.sin(mixerTime * 4.4) * 0.020
    : gardenGroundOverlay
      ? target.x - 0.21 + Math.sin(mixerTime * 5.6) * 0.028
    : overlay === "storeHarvest"
      ? target.x - 0.18 + Math.max(0, Math.sin(mixerTime * 5.2)) * 0.024
    : foodHandOverlay
      ? target.x - 0.035 + Math.sin(mixerTime * 3.8) * 0.006
    : gatherBendOverlay
      ? target.x - 0.30 + Math.sin(mixerTime * 5.6) * 0.030
    : placeDownOverlay
      ? target.x - 0.24 + Math.sin(mixerTime * 5.2) * 0.024
    : carryOverlay
      ? target.x - 0.045 + Math.sin(mixerTime * 4.2) * 0.010
    : locomotionBend != null
      ? target.x + locomotionBend
    : taskBend
      ? target.x - 0.16 + Math.sin(mixerTime * 6.0) * 0.025
      : target.x;
  const locomotionSway =
    locomotionOverlay === "turnInPlace"
      ? clamp(turnAmount * 0.10, -0.10, 0.10)
      : locomotionOverlay === "stopSettle"
        ? -Math.sin(mixerTime * 7.0) * 0.026
        : locomotionOverlay
          ? gait * (
            locomotionOverlay === "shortJog" || locomotionOverlay === "routeJog"
              ? 0.070
              : locomotionOverlay === "slowWalk" || locomotionOverlay === "routeSlowWalk"
                ? 0.035
                : 0.048
          )
          : 0;
  const taskTargetZ =
    restSettleOverlay
      ? target.z + Math.sin(mixerTime * 2.8) * 0.026
      : restSeatedOverlay
      ? target.z + Math.sin(mixerTime * 2.2) * 0.014
      : restWakeOverlay || restStandOverlay
      ? target.z + Math.sin(mixerTime * 5.8) * 0.04
      : buildTieOverlay
        ? target.z + Math.sin(mixerTime * 5.0) * 0.060
      : buildPlaceOverlay
        ? target.z - Math.sin(mixerTime * 5.2) * 0.034
      : buildPushOverlay
        ? target.z + Math.sin(mixerTime * 4.4) * 0.050
      : buildHammerOverlay
        ? target.z + Math.sin(mixerTime * 7.4) * 0.040
      : buildInspectOverlay
        ? target.z + Math.sin(mixerTime * 2.6) * 0.026
      : fishTrapGroundOverlay
        ? target.z - Math.sin(mixerTime * 4.8) * 0.034
      : fishTrapHangOverlay
        ? target.z + Math.sin(mixerTime * 4.4) * 0.048
      : fishCastOverlay
        ? target.z + Math.sin(mixerTime * 5.2) * 0.070
      : fishReelOverlay
        ? target.z + Math.sin(mixerTime * 5.8) * 0.080
      : pierFishOverlay
        ? target.z + Math.sin(mixerTime * 3.4) * 0.030
      : fishWaitOverlay
        ? target.z + Math.sin(mixerTime * 2.2) * 0.020
      : fishCatchOverlay
        ? target.z + Math.sin(mixerTime * 5.8) * 0.046
      : raftPaddleOverlay
        ? target.z + Math.sin(mixerTime * 5.6) * 0.070
      : raftPushOverlay
        ? target.z + Math.sin(mixerTime * 4.4) * 0.052
      : raftLashOverlay
        ? target.z + Math.sin(mixerTime * 5.0) * 0.054
      : raftBoardOverlay
        ? target.z + Math.sin(mixerTime * 3.8) * 0.035
      : raftLookOutOverlay
        ? target.z + Math.sin(mixerTime * 2.8) * 0.028
	      : raftCelebrateOverlay
	        ? target.z + Math.sin(mixerTime * 5.6) * 0.050
	      : toyGroundOverlay
	        ? target.z + Math.sin(mixerTime * 5.0) * 0.048
	      : toyBallOverlay
	        ? target.z + Math.sin(mixerTime * 5.6) * 0.060
	      : toyKiteOverlay
	        ? target.z + Math.sin(mixerTime * 2.8) * 0.040
	      : toyHopOverlay
	        ? target.z + Math.sin(mixerTime * 7.2) * 0.050
	      : storageSortOverlay
	        ? target.z + Math.sin(mixerTime * 4.2) * 0.040
      : storageDepositOverlay
        ? target.z - Math.sin(mixerTime * 4.8) * 0.032
      : storageTidyOverlay
        ? target.z + Math.sin(mixerTime * 4.0) * 0.052
      : storageInspectOverlay
        ? target.z + Math.sin(mixerTime * 2.4) * 0.024
      : overlay === "inspectTool"
        ? target.z + Math.sin(mixerTime * 3.4) * 0.045
        : overlay === "pathRakeSweep"
          ? target.z + Math.sin(mixerTime * 5.2) * 0.065
        : overlay === "gardenWatering"
          ? target.z + Math.sin(mixerTime * 4.4) * 0.055
        : overlay === "gardenDig" ||
          overlay === "gardenPlantSeed" ||
          overlay === "gardenPatSoil" ||
          overlay === "gardenHarvest" ||
          overlay === "storeHarvest"
          ? target.z + Math.sin(mixerTime * 5.0) * 0.055
        : overlay === "prepMeal"
          ? target.z + Math.sin(mixerTime * 4.6) * 0.034
          : overlay === "fireFan" || overlay === "fireStoke" || overlay === "stirPot"
            ? target.z + Math.sin(mixerTime * 5.2) * 0.060
          : overlay === "fireWarmHands"
            ? target.z + Math.sin(mixerTime * 3.4) * 0.025
          : overlay === "cookFish" || overlay === "cookMeal"
            ? target.z + Math.sin(mixerTime * 4.2) * 0.030
          : carryOverlay
            ? target.z + Math.sin(mixerTime * 3.2) * 0.020
            : overlay === "gardenInspect"
              ? target.z + 0.045
              : target.z;
  const targetZ = taskTargetZ + locomotionSway;
  const targetY = target.y + (locomotionOverlay === "turnInPlace" ? clamp(-turnAmount * 0.08, -0.08, 0.08) : 0);
  controller.model.rotation.x += (targetX - controller.model.rotation.x) * smoothing;
  controller.model.rotation.y += (targetY - controller.model.rotation.y) * smoothing;
  controller.model.rotation.z += (targetZ - controller.model.rotation.z) * smoothing;
}

function updateBubbleBoyHumanoidUpperBodyOverlay(controller, dt, presentation) {
  if (!controller) return;
  const animation = presentation && presentation.animation ? presentation.animation : {};
  const attentionEmote = animation.attentionEmote || {};
  const overlay = animation.emoteOverlay || attentionEmote.overlay || "";
  if (!overlay) return;

  const mixerTime = controller.mixer ? controller.mixer.time : 0;
  const wave = Math.sin(mixerTime * 4.8);
  const pulse = Math.max(0, Math.sin(mixerTime * 5.6));
  const intensity = clamp(Number.isFinite(attentionEmote.intensity) ? attentionEmote.intensity : 0.55, 0.28, 1);
  const scale = 0.62 + intensity * 0.38;
  const spine = { x: 0, y: 0, z: 0 };
  const leftArm = { x: 0, y: 0, z: 0 };
  const rightArm = { x: 0, y: 0, z: 0 };
  const leftForeArm = { x: 0, y: 0, z: 0 };
  const rightForeArm = { x: 0, y: 0, z: 0 };

  if (overlay === "gazeLookAround") {
    spine.y = wave * 0.055 * scale;
    spine.z = Math.sin(mixerTime * 2.6 + 0.5) * 0.025 * scale;
    leftArm.z = -0.030 * scale;
    rightArm.z = 0.030 * scale;
  } else if (overlay === "orientIsland") {
    spine.y = Math.sin(mixerTime * 2.2) * 0.085 * scale;
    spine.x = -0.035 * scale;
    rightArm.x = -0.060 * scale;
    rightForeArm.z = -0.055 * scale;
  } else if (overlay === "playerWave") {
    spine.x = -0.030 * scale;
    spine.z = wave * 0.028 * scale;
    rightArm.x = -0.180 * scale;
    rightArm.z = -0.120 * scale;
    rightForeArm.x = -0.155 * scale + pulse * 0.055;
    rightForeArm.z = -0.105 * scale;
  } else if (overlay === "inspectObject") {
    spine.x = -0.100 * scale;
    spine.y = wave * 0.025 * scale;
    leftArm.x = -0.065 * scale;
    rightArm.x = -0.075 * scale;
    leftForeArm.x = -0.050 * scale;
    rightForeArm.x = -0.050 * scale;
  } else if (overlay === "pointNotice") {
    spine.y = 0.105 * scale;
    spine.z = -0.030 * scale;
    rightArm.x = -0.245 * scale;
    rightArm.y = -0.110 * scale;
    rightArm.z = -0.100 * scale;
    rightForeArm.x = -0.180 * scale;
    rightForeArm.y = -0.080 * scale;
  } else if (overlay === "smallSurprise") {
    spine.x = 0.075 * scale + pulse * 0.020;
    leftArm.x = -0.105 * scale;
    rightArm.x = -0.105 * scale;
    leftArm.z = -0.080 * scale;
    rightArm.z = 0.080 * scale;
    leftForeArm.x = -0.075 * scale;
    rightForeArm.x = -0.075 * scale;
  } else if (overlay === "quietCelebrate") {
    spine.x = -0.035 * scale;
    spine.z = wave * 0.050 * scale;
    leftArm.x = -0.140 * scale;
    rightArm.x = -0.140 * scale;
    leftForeArm.x = -0.090 * scale + pulse * 0.025;
    rightForeArm.x = -0.090 * scale + Math.max(0, -wave) * 0.025;
  } else if (overlay === "sortMaterials") {
    spine.x = -0.165 * scale;
    spine.z = wave * 0.040 * scale;
    leftArm.x = -0.205 * scale;
    rightArm.x = -0.205 * scale;
    leftArm.z = -0.080 * scale - wave * 0.024;
    rightArm.z = 0.080 * scale + wave * 0.024;
    leftForeArm.x = -0.165 * scale - pulse * 0.025;
    rightForeArm.x = -0.165 * scale - Math.max(0, -wave) * 0.025;
  } else if (overlay === "depositStorage" || overlay === "withdrawStorage") {
    spine.x = -0.205 * scale;
    spine.z = -wave * 0.020 * scale;
    leftArm.x = -0.230 * scale;
    rightArm.x = -0.230 * scale;
    leftArm.z = -0.050 * scale;
    rightArm.z = 0.050 * scale;
    leftForeArm.x = -0.205 * scale - pulse * 0.030;
    rightForeArm.x = -0.205 * scale - Math.max(0, -wave) * 0.030;
  } else if (overlay === "tidyCamp") {
    spine.x = -0.095 * scale;
    spine.z = wave * 0.055 * scale;
    leftArm.x = -0.120 * scale;
    rightArm.x = -0.185 * scale;
    rightArm.z = 0.130 * scale + wave * 0.050;
    leftForeArm.x = -0.080 * scale;
    rightForeArm.x = -0.150 * scale;
  } else if (overlay === "sitNearFire" || overlay === "restInsideShelter") {
    spine.x = 0.075 * scale;
    spine.z = wave * 0.012 * scale;
    leftArm.x = -0.080 * scale;
    rightArm.x = -0.080 * scale;
    leftArm.z = -0.040 * scale;
    rightArm.z = 0.040 * scale;
    leftForeArm.x = -0.050 * scale;
    rightForeArm.x = -0.050 * scale;
  } else if (overlay === "inspectCampLayout") {
    spine.x = -0.060 * scale;
    spine.y = wave * 0.050 * scale;
    spine.z = Math.sin(mixerTime * 2.0) * 0.020 * scale;
    leftArm.x = -0.055 * scale;
    rightArm.x = -0.070 * scale;
    rightForeArm.z = -0.060 * scale;
  } else if (overlay === "restSit") {
    spine.x = 0.090 * scale;
    leftArm.x = -0.075 * scale;
    rightArm.x = -0.075 * scale;
    leftArm.z = -0.035 * scale;
    rightArm.z = 0.035 * scale;
    leftForeArm.x = -0.045 * scale;
    rightForeArm.x = -0.045 * scale;
  } else if (overlay === "settleHammock" || overlay === "settleBed") {
    spine.x = 0.035 * scale + Math.max(0, wave) * 0.018;
    spine.z = wave * 0.020 * scale;
    leftArm.x = -0.125 * scale;
    rightArm.x = -0.125 * scale;
    leftArm.z = -0.055 * scale;
    rightArm.z = 0.055 * scale;
    leftForeArm.x = -0.090 * scale;
    rightForeArm.x = -0.090 * scale;
  } else if (overlay === "lieDownAdditive" || overlay === "sleepLoop") {
    spine.x = 0.020 * scale;
    spine.z = Math.sin(mixerTime * 1.6) * 0.010 * scale;
    leftArm.x = -0.040 * scale;
    rightArm.x = -0.040 * scale;
    leftForeArm.x = -0.030 * scale;
    rightForeArm.x = -0.030 * scale;
  } else if (overlay === "wakeRest") {
    spine.x = -0.070 * scale + pulse * 0.018;
    leftArm.x = -0.090 * scale;
    rightArm.x = -0.090 * scale;
    leftArm.z = -0.040 * scale;
    rightArm.z = 0.040 * scale;
    leftForeArm.x = -0.070 * scale;
    rightForeArm.x = -0.070 * scale;
  } else if (overlay === "wakeStretch") {
    spine.x = -0.035 * scale;
    spine.z = wave * 0.038 * scale;
    leftArm.x = -0.195 * scale;
    rightArm.x = -0.195 * scale;
    leftArm.z = -0.065 * scale;
    rightArm.z = 0.065 * scale;
    leftForeArm.x = -0.125 * scale + pulse * 0.025;
    rightForeArm.x = -0.125 * scale + Math.max(0, -wave) * 0.025;
  } else if (overlay === "standUpFromRest") {
    spine.x = -0.055 * scale;
    leftArm.x = -0.060 * scale;
    rightArm.x = -0.060 * scale;
    leftForeArm.x = -0.040 * scale;
    rightForeArm.x = -0.040 * scale;
  } else if (overlay === "crouchFire" || overlay === "fireKneel") {
    spine.x = -0.250 * scale;
    spine.z = wave * 0.018 * scale;
    leftArm.x = -0.225 * scale;
    rightArm.x = -0.225 * scale;
    leftArm.z = -0.050 * scale;
    rightArm.z = 0.050 * scale;
    leftForeArm.x = -0.190 * scale;
    rightForeArm.x = -0.190 * scale;
  } else if (overlay === "fireCare" || overlay === "fireWarmHands") {
    spine.x = -0.135 * scale;
    spine.z = wave * 0.020 * scale;
    leftArm.x = -0.155 * scale;
    rightArm.x = -0.155 * scale;
    leftArm.z = -0.095 * scale;
    rightArm.z = 0.095 * scale;
    leftForeArm.x = -0.155 * scale - pulse * 0.030;
    rightForeArm.x = -0.155 * scale - Math.max(0, -wave) * 0.030;
  } else if (overlay === "fireAddFuel") {
    spine.x = -0.210 * scale;
    spine.z = -wave * 0.025 * scale;
    leftArm.x = -0.145 * scale;
    rightArm.x = -0.260 * scale;
    leftArm.z = -0.040 * scale;
    rightArm.z = 0.070 * scale;
    leftForeArm.x = -0.120 * scale;
    rightForeArm.x = -0.230 * scale - pulse * 0.035;
  } else if (overlay === "fireFan") {
    spine.x = -0.130 * scale;
    spine.z = wave * 0.055 * scale;
    leftArm.x = -0.125 * scale;
    rightArm.x = -0.205 * scale;
    rightArm.z = 0.160 * scale + wave * 0.060;
    leftForeArm.x = -0.090 * scale;
    rightForeArm.x = -0.170 * scale;
    rightForeArm.z = 0.100 * scale + wave * 0.050;
  } else if (overlay === "fireStoke") {
    spine.x = -0.165 * scale;
    spine.z = wave * 0.026 * scale;
    leftArm.x = -0.125 * scale;
    rightArm.x = -0.265 * scale;
    leftArm.z = -0.045 * scale;
    rightArm.z = 0.075 * scale;
    leftForeArm.x = -0.095 * scale;
    rightForeArm.x = -0.245 * scale - pulse * 0.040;
  } else if (overlay === "cookFish" || overlay === "cookMeal") {
    spine.x = -0.155 * scale;
    spine.z = wave * 0.022 * scale;
    leftArm.x = -0.190 * scale;
    rightArm.x = -0.190 * scale;
    leftArm.z = -0.075 * scale;
    rightArm.z = 0.075 * scale;
    leftForeArm.x = -0.150 * scale - pulse * 0.020;
    rightForeArm.x = -0.150 * scale - Math.max(0, -wave) * 0.020;
  } else if (overlay === "stirPot") {
    spine.x = -0.145 * scale;
    spine.z = wave * 0.045 * scale;
    leftArm.x = -0.165 * scale;
    rightArm.x = -0.225 * scale;
    leftArm.z = -0.060 * scale - wave * 0.025;
    rightArm.z = 0.070 * scale + wave * 0.045;
    leftForeArm.x = -0.135 * scale;
    rightForeArm.x = -0.205 * scale - pulse * 0.035;
  } else if (overlay === "holdFood") {
    spine.x = -0.025 * scale;
    rightArm.x = -0.150 * scale;
    rightArm.z = 0.075 * scale;
    rightForeArm.x = -0.150 * scale;
    rightForeArm.z = 0.060 * scale;
    leftArm.x = -0.040 * scale;
  } else if (overlay === "eatFood") {
    spine.x = -0.020 * scale;
    spine.z = wave * 0.014 * scale;
    rightArm.x = -0.230 * scale;
    rightArm.z = 0.080 * scale;
    rightForeArm.x = -0.245 * scale - pulse * 0.025;
    rightForeArm.z = 0.055 * scale;
    leftArm.x = -0.050 * scale;
  } else if (overlay === "fishCast") {
    spine.x = -0.080 * scale;
    spine.z = wave * 0.060 * scale;
    leftArm.x = -0.150 * scale;
    rightArm.x = -0.235 * scale;
    leftArm.z = -0.085 * scale;
    rightArm.z = 0.125 * scale + wave * 0.035;
    leftForeArm.x = -0.110 * scale;
    rightForeArm.x = -0.205 * scale - pulse * 0.040;
  } else if (overlay === "fishWait" || overlay === "pierFish") {
    spine.x = -0.045 * scale;
    spine.y = wave * 0.030 * scale;
    leftArm.x = -0.095 * scale;
    rightArm.x = -0.115 * scale;
    leftArm.z = -0.070 * scale;
    rightArm.z = 0.070 * scale;
    leftForeArm.x = -0.070 * scale;
    rightForeArm.x = -0.090 * scale;
  } else if (overlay === "fishReel") {
    spine.x = -0.105 * scale;
    spine.z = wave * 0.065 * scale;
    leftArm.x = -0.165 * scale;
    rightArm.x = -0.205 * scale;
    leftArm.z = -0.125 * scale - wave * 0.025;
    rightArm.z = 0.125 * scale + wave * 0.025;
    leftForeArm.x = -0.145 * scale - pulse * 0.025;
    rightForeArm.x = -0.175 * scale - Math.max(0, -wave) * 0.030;
  } else if (overlay === "fishCatchReaction") {
    spine.x = -0.035 * scale + pulse * 0.020;
    spine.z = wave * 0.045 * scale;
    leftArm.x = -0.090 * scale;
    rightArm.x = -0.190 * scale;
    rightArm.z = 0.095 * scale;
    leftForeArm.x = -0.060 * scale;
    rightForeArm.x = -0.150 * scale - pulse * 0.024;
  } else if (overlay === "setFishTrap" || overlay === "checkFishTrap" || overlay === "collectCatch") {
    spine.x = -0.220 * scale;
    spine.z = -wave * 0.024 * scale;
    leftArm.x = -0.220 * scale;
    rightArm.x = -0.230 * scale;
    leftArm.z = -0.060 * scale;
    rightArm.z = 0.060 * scale;
    leftForeArm.x = -0.190 * scale - pulse * 0.028;
    rightForeArm.x = -0.195 * scale - Math.max(0, -wave) * 0.030;
  } else if (overlay === "hangCatchDryingRack") {
    spine.x = -0.105 * scale;
    spine.z = wave * 0.045 * scale;
    leftArm.x = -0.105 * scale;
    rightArm.x = -0.245 * scale;
    leftArm.z = -0.040 * scale;
    rightArm.z = 0.100 * scale;
    leftForeArm.x = -0.070 * scale;
    rightForeArm.x = -0.215 * scale - pulse * 0.036;
  } else if (overlay === "toyCraft" || overlay === "toyPlace" || overlay === "playBlocks" || overlay === "putToyAway") {
    spine.x = -0.190 * scale;
    spine.z = wave * 0.034 * scale;
    leftArm.x = -0.210 * scale;
    rightArm.x = -0.210 * scale;
    leftArm.z = -0.070 * scale - wave * 0.018;
    rightArm.z = 0.070 * scale + wave * 0.018;
    leftForeArm.x = -0.175 * scale - pulse * 0.024;
    rightForeArm.x = -0.175 * scale - Math.max(0, -wave) * 0.024;
  } else if (overlay === "spinTop") {
    spine.x = -0.205 * scale;
    spine.z = wave * 0.040 * scale;
    leftArm.x = -0.130 * scale;
    rightArm.x = -0.255 * scale;
    leftArm.z = -0.040 * scale;
    rightArm.z = 0.090 * scale + wave * 0.025;
    leftForeArm.x = -0.090 * scale;
    rightForeArm.x = -0.225 * scale - pulse * 0.046;
  } else if (overlay === "kickBall") {
    spine.x = -0.075 * scale;
    spine.z = wave * 0.055 * scale;
    leftArm.x = -0.070 * scale;
    rightArm.x = -0.155 * scale;
    rightArm.z = 0.110 * scale + wave * 0.035;
    leftForeArm.x = -0.050 * scale;
    rightForeArm.x = -0.120 * scale;
  } else if (overlay === "tossBall") {
    spine.x = -0.050 * scale + pulse * 0.012;
    spine.z = wave * 0.052 * scale;
    leftArm.x = -0.080 * scale;
    rightArm.x = -0.240 * scale;
    rightArm.z = 0.100 * scale;
    rightForeArm.x = -0.230 * scale - pulse * 0.050;
  } else if (overlay === "launchKite" || overlay === "holdKite") {
    spine.x = -0.040 * scale;
    spine.y = Math.sin(mixerTime * 2.2) * 0.050 * scale;
    spine.z = wave * 0.035 * scale;
    leftArm.x = -0.135 * scale;
    rightArm.x = -0.185 * scale;
    leftArm.z = -0.075 * scale;
    rightArm.z = 0.125 * scale + Math.sin(mixerTime * 2.8) * 0.035;
    leftForeArm.x = -0.105 * scale;
    rightForeArm.x = -0.155 * scale;
  } else if (overlay === "hopPlay") {
    spine.x = -0.045 * scale + pulse * 0.018;
    spine.z = wave * 0.060 * scale;
    leftArm.x = -0.145 * scale;
    rightArm.x = -0.145 * scale;
    leftArm.z = -0.090 * scale;
    rightArm.z = 0.090 * scale;
    leftForeArm.x = -0.095 * scale;
    rightForeArm.x = -0.095 * scale;
  } else if (overlay === "hammerStrike" || overlay === "carveTool" || overlay === "craftAtWorkbench") {
    spine.x = -0.125 * scale;
    spine.z = wave * 0.035 * scale;
    leftArm.x = -0.115 * scale;
    rightArm.x = -0.270 * scale;
    leftArm.z = -0.055 * scale;
    rightArm.z = 0.090 * scale;
    leftForeArm.x = -0.075 * scale;
    rightForeArm.x = -0.250 * scale - pulse * 0.050;
  } else if (overlay === "tieRopeVines" || overlay === "reinforceShelter") {
    spine.x = -0.115 * scale;
    spine.z = wave * 0.050 * scale;
    leftArm.x = -0.185 * scale;
    rightArm.x = -0.185 * scale;
    leftArm.z = -0.115 * scale - wave * 0.020;
    rightArm.z = 0.115 * scale + wave * 0.020;
    leftForeArm.x = -0.160 * scale - pulse * 0.020;
    rightForeArm.x = -0.160 * scale - Math.max(0, -wave) * 0.020;
  } else if (overlay === "placePlank" || overlay === "repairShelter") {
    spine.x = -0.205 * scale;
    spine.z = -wave * 0.022 * scale;
    leftArm.x = -0.235 * scale;
    rightArm.x = -0.235 * scale;
    leftArm.z = -0.070 * scale;
    rightArm.z = 0.070 * scale;
    leftForeArm.x = -0.205 * scale - pulse * 0.030;
    rightForeArm.x = -0.205 * scale - Math.max(0, -wave) * 0.030;
  } else if (overlay === "pushPostUpright") {
    spine.x = -0.145 * scale;
    spine.z = wave * 0.035 * scale;
    leftArm.x = -0.260 * scale;
    rightArm.x = -0.260 * scale;
    leftArm.z = -0.090 * scale;
    rightArm.z = 0.090 * scale;
    leftForeArm.x = -0.235 * scale;
    rightForeArm.x = -0.235 * scale;
  } else if (overlay === "inspectProgress") {
    spine.x = -0.065 * scale;
    spine.y = wave * 0.035 * scale;
    leftArm.x = -0.065 * scale;
    rightArm.x = -0.075 * scale;
    leftForeArm.x = -0.045 * scale;
    rightForeArm.x = -0.045 * scale;
  } else if (overlay === "bendPickup" || overlay === "pickup") {
    spine.x = -0.255 * scale;
    spine.z = wave * 0.022 * scale;
    leftArm.x = -0.255 * scale;
    rightArm.x = -0.255 * scale;
    leftArm.z = -0.055 * scale;
    rightArm.z = 0.055 * scale;
    leftForeArm.x = -0.205 * scale - pulse * 0.035;
    rightForeArm.x = -0.195 * scale - Math.max(0, -wave) * 0.035;
  } else if (overlay === "depositMaterial" || overlay === "depositMaterials" || overlay === "setItemDown") {
    spine.x = -0.210 * scale;
    spine.z = -wave * 0.018 * scale;
    leftArm.x = -0.220 * scale;
    rightArm.x = -0.220 * scale;
    leftArm.z = -0.045 * scale;
    rightArm.z = 0.045 * scale;
    leftForeArm.x = -0.205 * scale - pulse * 0.030;
    rightForeArm.x = -0.205 * scale - Math.max(0, -wave) * 0.030;
  } else if (overlay === "carryAttachment" || overlay === "carryPlank" || overlay === "carryLog") {
    spine.x = -0.045 * scale;
    spine.z = wave * 0.012 * scale;
    leftArm.x = -0.150 * scale;
    rightArm.x = -0.150 * scale;
    leftArm.z = -0.090 * scale;
    rightArm.z = 0.090 * scale;
    leftForeArm.x = -0.105 * scale;
    rightForeArm.x = -0.105 * scale;
  } else {
    return;
  }

  applyBoneAdditiveOffset(controller.spineBone, spine, 0.18, 0.20, 0.18);
  applyBoneAdditiveOffset(controller.leftArmBone, leftArm, 0.36, 0.28, 0.30);
  applyBoneAdditiveOffset(controller.rightArmBone, rightArm, 0.36, 0.28, 0.30);
  applyBoneAdditiveOffset(controller.leftForeArmBone, leftForeArm, 0.32, 0.24, 0.26);
  applyBoneAdditiveOffset(controller.rightForeArmBone, rightForeArm, 0.32, 0.24, 0.26);
}

function selectBubbleBoyHumanoidEmote(simBoy, presentation = null) {
  const locomotionState =
    presentation && presentation.animation && presentation.animation.locomotion
      ? presentation.animation.locomotion.state || ""
      : "";
  if (locomotionState === "start" || locomotionState === "stop") return null;
  const presentationEmote = presentation && presentation.animation ? presentation.animation.emote : null;
  if (presentationEmote) {
    return { key: `presentation:${presentation.selectedAction || presentationEmote}`, name: presentationEmote };
  }
  if (locomotionState === "idle" && simBoy.currentAction === "idle") return null;
  const candidates = [simBoy.currentAction, simBoy.attention, simBoy.goal, simBoy.pose && simBoy.pose.dominant];
  for (const candidate of candidates) {
    const key = normalizeHumanoidKey(candidate);
    const name = HUMANOID_ACTION_EMOTES[key];
    if (name) return { key, name };
  }
  return null;
}

function updateBubbleBoyHumanoidHeadTracking(controller, dt, cursor, pose) {
  const now = typeof performance !== "undefined" ? performance.now() : 0;
  const cursorFresh =
    cursor &&
    cursor.active &&
    Number.isFinite(cursor.normalizedX) &&
    Number.isFinite(cursor.normalizedY) &&
    (!Number.isFinite(cursor.lastMoved) || now - cursor.lastMoved < 5000);
  if (cursorFresh) {
    controller.cursorTarget.set(clamp(cursor.normalizedX, -1, 1), clamp(cursor.normalizedY, -1, 1));
  } else {
    controller.cursorTarget.set(clamp((pose.gazeX || 0) * 14, -0.65, 0.65), clamp((pose.gazeY || 0) * -14, -0.55, 0.55));
  }

  const smoothing = 1 - Math.exp(-Math.max(0, dt || 0) * 7.0);
  controller.cursorSmoothed.lerp(controller.cursorTarget, smoothing);
  const yaw = clamp(controller.cursorSmoothed.x * 0.54, -0.54, 0.54);
  const pitch = clamp(-controller.cursorSmoothed.y * 0.32, -0.34, 0.30);

  if (controller.neckBone) {
    applyBoneLookOffset(controller.neckBone, yaw * 0.34, pitch * 0.30, 0.34, 0.24);
  }
  if (controller.headBone) {
    applyBoneLookOffset(controller.headBone, yaw * 0.72, pitch * 0.78, 0.62, 0.42);
  }
  updateBubbleBoyHumanoidEyeFallback(controller, yaw, pitch);
}

function applyBoneLookOffset(bone, yaw, pitch, yawLimit, pitchLimit) {
  const rest = bone.userData.bubbleBoyRestRotation;
  if (!rest) return;
  bone.rotation.y = clamp(bone.rotation.y + yaw, rest.y - yawLimit, rest.y + yawLimit);
  bone.rotation.x = clamp(bone.rotation.x + pitch, rest.x - pitchLimit, rest.x + pitchLimit);
}

function applyBoneAdditiveOffset(bone, offset, xLimit, yLimit, zLimit) {
  if (!bone || !offset) return;
  const rest = bone.userData.bubbleBoyRestRotation;
  if (!rest) return;
  bone.rotation.x = clamp(bone.rotation.x + offset.x, rest.x - xLimit, rest.x + xLimit);
  bone.rotation.y = clamp(bone.rotation.y + offset.y, rest.y - yLimit, rest.y + yLimit);
  bone.rotation.z = clamp(bone.rotation.z + offset.z, rest.z - zLimit, rest.z + zLimit);
}

function updateBubbleBoyHumanoidEyeFallback(controller, yaw, pitch) {
  if (!controller.eyeFallback) return;
  const fallback = controller.eyeFallback;
  fallback.group.rotation.y = yaw * 0.42;
  fallback.group.rotation.x = pitch * 0.32;
  fallback.leftPupil.position.x = fallback.baseLeft.x + controller.cursorSmoothed.x * 0.018;
  fallback.rightPupil.position.x = fallback.baseRight.x + controller.cursorSmoothed.x * 0.018;
  fallback.leftPupil.position.y = fallback.baseLeft.y - controller.cursorSmoothed.y * 0.012;
  fallback.rightPupil.position.y = fallback.baseRight.y - controller.cursorSmoothed.y * 0.012;
}

function createBubbleBoyHumanoidEyeFallback(threeRef) {
  const group = new threeRef.Group();
  group.name = "Bubble Boy humanoid eye fallback";
  group.position.set(0, 1.17, -0.29);
  group.rotation.y = Math.PI;
  const material = new threeRef.MeshBasicMaterial({ color: 0x050914, toneMapped: false });
  const glintMaterial = new threeRef.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const eyeGeometry = new threeRef.SphereGeometry(0.022, 12, 8);
  const glintGeometry = new threeRef.SphereGeometry(0.006, 8, 6);
  const leftPupil = new threeRef.Mesh(eyeGeometry, material);
  const rightPupil = new threeRef.Mesh(eyeGeometry, material);
  leftPupil.position.set(-0.072, 0.014, 0);
  rightPupil.position.set(0.072, 0.014, 0);
  const leftGlint = new threeRef.Mesh(glintGeometry, glintMaterial);
  const rightGlint = new threeRef.Mesh(glintGeometry, glintMaterial);
  leftGlint.position.set(-0.080, 0.023, -0.014);
  rightGlint.position.set(0.064, 0.023, -0.014);
  group.add(leftPupil, rightPupil, leftGlint, rightGlint);
  return {
    group,
    leftPupil,
    rightPupil,
    baseLeft: leftPupil.position.clone(),
    baseRight: rightPupil.position.clone()
  };
}

function findBubbleBoyHumanoidBone(model, patterns) {
  let match = null;
  model.traverse((object) => {
    if (match || !object.isBone) return;
    const name = object.name || "";
    if (patterns.some((pattern) => pattern.test(name))) match = object;
  });
  return match;
}

function findBubbleBoyHumanoidAction(controller, names) {
  const preferred = Array.isArray(names) ? names : [names];
  for (const name of preferred) {
    if (controller.actions[name]) return controller.actions[name];
  }
  const folded = Object.keys(controller.actions).reduce((lookup, key) => {
    lookup[normalizeHumanoidKey(key)] = controller.actions[key];
    return lookup;
  }, Object.create(null));
  for (const name of preferred) {
    const action = folded[normalizeHumanoidKey(name)];
    if (action) return action;
  }
  return null;
}

function canonicalHumanoidBaseState(name) {
  const key = normalizeHumanoidKey(name);
  if (key === "sitting" || key === "sit") return "Sitting";
  if (key === "walk" || key === "walking") return "Walking";
  if (key === "run" || key === "running") return "Running";
  return "Idle";
}

function canonicalHumanoidEmote(name) {
  const key = normalizeHumanoidKey(name);
  for (const emoteName of Object.keys(HUMANOID_EMOTE_CLIPS)) {
    if (normalizeHumanoidKey(emoteName) === key) return emoteName;
  }
  return HUMANOID_ACTION_EMOTES[key] || "Wave";
}

function normalizeHumanoidKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function exposeBubbleBoyHumanoid(controller) {
  if (typeof window === "undefined") return;
  window.__bubbleBoyHumanoid = {
    controller,
    get ready() {
      return controller.ready;
    },
    get fallback() {
      return controller.usingFallback;
    },
    get state() {
      return controller.state;
    },
    get clips() {
      return controller.availableClips.slice();
    },
    setState: setBubbleBoyAnimationState,
    playEmote: playBubbleBoyEmote,
    dispose: disposeBubbleBoyHumanoid
  };
}

function disposeMaterial(material) {
  if (Array.isArray(material)) {
    material.forEach(disposeMaterial);
    return;
  }
  if (material && typeof material.dispose === "function") material.dispose();
}

function createCampfire() {
  const group = new THREE.Group();
  group.name = "Cozy deliberate campfire";
  const barkMaterial = new THREE.MeshStandardMaterial({
    color: 0x70401f,
    roughness: 0.86,
    metalness: 0,
    emissive: 0x210b03,
    emissiveIntensity: 0.04
  });
  const cutMaterial = new THREE.MeshStandardMaterial({
    color: 0xb57942,
    roughness: 0.9,
    metalness: 0
  });
  const stoneMaterials = [0x8b806f, 0x9c8d78, 0x716b62, 0xa89a83].map(
    (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0 })
  );
  const coalMaterial = new THREE.MeshStandardMaterial({
    color: 0x17120f,
    roughness: 0.74,
    emissive: 0x2d0802,
    emissiveIntensity: 0.28
  });
  const emberMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8b2a,
    transparent: true,
    opacity: 0.92,
    toneMapped: false
  });
  const emberGlow = new THREE.MeshBasicMaterial({
    color: 0xff6d1f,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  const flameOuter = new THREE.MeshBasicMaterial({
    color: 0xff5418,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });
  const flameMid = new THREE.MeshBasicMaterial({
    color: 0xff8e24,
    transparent: true,
    opacity: 0.70,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });
  const flameInner = new THREE.MeshBasicMaterial({
    color: 0xffd76a,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });
  const sparkMaterial = new THREE.MeshBasicMaterial({
    color: 0xffbf5c,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false
  });

  const rockGeometry = new THREE.DodecahedronGeometry(0.16, 0);
  for (let i = 0; i < 12; i += 1) {
    const seed = 140 + i * 13;
    const angle = (i / 12) * TAU + (hash01(seed) - 0.5) * 0.055;
    const radius = 0.61 + (hash01(seed + 1.0) - 0.5) * 0.055;
    const stone = new THREE.Mesh(rockGeometry, stoneMaterials[i % stoneMaterials.length]);
    stone.position.set(Math.cos(angle) * radius, 0.070, Math.sin(angle) * radius);
    stone.scale.set(
      0.78 + hash01(seed + 2.0) * 0.34,
      0.52 + hash01(seed + 3.0) * 0.24,
      0.74 + hash01(seed + 4.0) * 0.32
    );
    stone.rotation.set(hash01(seed + 5.0) * 0.46, angle + hash01(seed + 6.0) * 0.22, hash01(seed + 7.0) * 0.36);
    stone.castShadow = true;
    stone.receiveShadow = true;
    group.add(stone);
  }

  const emberDisc = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), emberGlow);
  emberDisc.name = "Warm ember glow under flame";
  emberDisc.position.y = 0.112;
  emberDisc.rotation.x = -Math.PI / 2;
  emberDisc.renderOrder = 7;
  group.add(emberDisc);

  const groundGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: createRadialGlowTexture([255, 118, 36], 0.58),
      color: 0xff8a2d,
      transparent: true,
      opacity: 0.10,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false
    })
  );
  groundGlow.name = "Broad soft firelight ground glow";
  groundGlow.position.y = 0.026;
  groundGlow.rotation.x = -Math.PI / 2;
  groundGlow.scale.set(5.0, 5.0, 1);
  groundGlow.renderOrder = 6;
  group.add(groundGlow);

  const logs = [
    { position: [-0.02, 0.150, -0.205], yaw: 0.08, roll: -0.025, length: 0.82, radius: 0.082 },
    { position: [0.04, 0.150, 0.205], yaw: 0.08, roll: 0.020, length: 0.76, radius: 0.078 },
    { position: [-0.185, 0.325, 0.00], yaw: Math.PI / 2 - 0.08, roll: 0.030, length: 0.72, radius: 0.073 },
    { position: [0.185, 0.325, 0.02], yaw: Math.PI / 2 - 0.08, roll: -0.020, length: 0.70, radius: 0.071 }
  ];
  for (const spec of logs) {
    addCampfireLog(group, { ...spec, barkMaterial, cutMaterial });
  }

  for (let i = 0; i < 8; i += 1) {
    const angle = i * 0.82 + 0.28;
    const radius = 0.07 + (i % 4) * 0.045;
    const coal = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.062 + (i % 2) * 0.018, 0),
      i % 3 === 0 ? emberMaterial : coalMaterial
    );
    coal.position.set(Math.cos(angle) * radius, 0.125, Math.sin(angle) * radius);
    coal.scale.set(1.05 + hash01(i * 9.0) * 0.25, 0.50 + hash01(i * 11.0) * 0.14, 0.78 + hash01(i * 13.0) * 0.18);
    coal.rotation.set(hash01(i + 1.0) * 0.4, angle, hash01(i + 2.0) * 0.3);
    coal.castShadow = true;
    coal.receiveShadow = true;
    group.add(coal);
  }

  const flameGroup = new THREE.Group();
  flameGroup.name = "Layered stylized flame cluster";
  flameGroup.position.y = 0.25;
  const flameMeshes = [
    addFlameLick(flameGroup, flameOuter, 0.235, 0.70, [0.00, 0.34, 0.00], [0.02, 0.16, -0.03]),
    addFlameLick(flameGroup, flameMid, 0.165, 0.56, [-0.055, 0.30, 0.018], [0.08, 0.72, 0.03]),
    addFlameLick(flameGroup, flameInner, 0.112, 0.44, [0.055, 0.265, -0.018], [0.10, -0.54, 0.08]),
    addFlameLick(flameGroup, flameInner, 0.076, 0.32, [-0.005, 0.215, -0.070], [-0.06, 0.28, -0.06])
  ];
  group.add(flameGroup);

  const sparkGroup = new THREE.Group();
  sparkGroup.name = "Subtle campfire sparks";
  const sparkGeometry = new THREE.SphereGeometry(0.012, 8, 6);
  for (let i = 0; i < 13; i += 1) {
    const seed = 410 + i * 29;
    const spark = new THREE.Mesh(sparkGeometry, sparkMaterial.clone());
    spark.userData.baseAngle = hash01(seed) * TAU;
    spark.userData.radius = 0.08 + hash01(seed + 1.0) * 0.22;
    spark.userData.height = 0.42 + hash01(seed + 2.0) * 0.56;
    spark.userData.speed = 0.34 + hash01(seed + 3.0) * 0.34;
    spark.userData.phase = hash01(seed + 4.0) * TAU;
    spark.renderOrder = 9;
    sparkGroup.add(spark);
  }
  group.add(sparkGroup);

  group.traverse((object) => {
    if (object.isMesh && object.material && object.material.transparent) object.renderOrder = 8;
  });

  return { group, flameGroup, flameMeshes, sparkGroup, emberDisc, groundGlow, flameOuter, flameMid, flameInner };
}

function addCampfireLog(group, spec) {
  const geometry = new THREE.CylinderGeometry(spec.radius * 0.95, spec.radius * 1.05, spec.length, 16, 2);
  geometry.rotateZ(Math.PI / 2);
  const log = new THREE.Mesh(geometry, spec.barkMaterial);
  log.position.fromArray(spec.position);
  log.rotation.set(0, spec.yaw, spec.roll || 0);
  log.castShadow = true;
  log.receiveShadow = true;
  group.add(log);

  const direction = new THREE.Vector3(Math.cos(spec.yaw), 0, -Math.sin(spec.yaw));
  for (const side of [-1, 1]) {
    const end = new THREE.Mesh(new THREE.CircleGeometry(spec.radius * 0.98, 16), spec.cutMaterial);
    end.position
      .set(spec.position[0], spec.position[1], spec.position[2])
      .add(direction.clone().multiplyScalar((spec.length * 0.5 + 0.002) * side));
    end.rotation.set(0, Math.PI / 2 + spec.yaw, 0);
    end.castShadow = true;
    group.add(end);
  }

  return log;
}

function addFlameLick(group, material, radius, height, position, rotation) {
  const geometry = createFlameLickGeometry(radius, height, hash01(radius * 113.0 + height * 47.0));
  const flame = new THREE.Mesh(geometry, material);
  flame.position.fromArray(position);
  flame.rotation.set(rotation[0], rotation[1], rotation[2]);
  flame.renderOrder = 8;
  flame.userData.baseOpacity = material.opacity;
  group.add(flame);
  return flame;
}

function createFlameLickGeometry(radius, height, seed) {
  const lean = (seed - 0.5) * radius * 0.42;
  const shoulder = 0.34 + seed * 0.16;
  const waist = 0.56 + hash01(seed * 83.0) * 0.12;
  const positions = new Float32Array([
    -radius, 0, 0,
    radius, 0, 0,
    -radius * shoulder, height * 0.36, 0,
    radius * (0.28 + seed * 0.16), height * 0.43, 0,
    -radius * 0.18, height * waist, 0,
    radius * 0.16, height * 0.68, 0,
    lean, height, 0
  ]);
  const indices = [0, 1, 3, 0, 3, 2, 2, 3, 5, 2, 5, 4, 4, 5, 6];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createArrivalSupplies() {
  const group = new THREE.Group();
  group.name = "arrivalSuppliesGroup";
  group.userData.family = ARRIVAL_SUPPLIES_ID;

  const standardMaterial = (color, roughness, options = {}) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...options });
  };
  const materials = {
    bundle: standardMaterial(0xc9915a, 0.84),
    bundleDark: standardMaterial(0x8a5933, 0.88),
    rope: standardMaterial(0xc0a070, 0.92),
    bark: standardMaterial(0x6f4426, 0.88),
    cut: standardMaterial(0xb57942, 0.90),
    leaf: standardMaterial(0x66864b, 0.86),
    leafDry: standardMaterial(0x8f9b55, 0.90)
  };

  const groundGroup = new THREE.Group();
  groundGroup.name = "arrivalSuppliesGroundProps";
  const washedBundle = createArrivalWashedBundle(materials);
  washedBundle.position.set(0, 0, 0);
  const scatteredSticks = createArrivalStickCluster(materials);
  scatteredSticks.position.set(0.72, 0, 0.18);
  const scatteredLeaves = createArrivalLeafCluster(materials);
  scatteredLeaves.position.set(-0.56, 0, 0.34);
  const materialPile = createArrivalMaterialPile(materials);
  materialPile.position.set(0.18, 0, -0.56);
  groundGroup.add(washedBundle, scatteredSticks, scatteredLeaves, materialPile);

  const carryBundle = createArrivalCarryBundle(materials);
  carryBundle.name = "arrivalSuppliesCarryBundle";
  carryBundle.visible = false;
  group.add(groundGroup, carryBundle);

  const subProps = { washedBundle, scatteredSticks, scatteredLeaves, materialPile, carryBundle };
  for (const object of Object.values(subProps)) cacheArrivalLocalTransform(object);

  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData.cameraOcclusionIgnored = true;
  });

  return { group, groundGroup, subProps, anchor: ARRIVAL_SUPPLIES_ANCHOR };
}

function createArrivalWashedBundle(materials) {
  const group = new THREE.Group();
  group.name = "arrivalSuppliesWashedBundle";
  group.userData.subPropId = "washedBundle";
  group.add(
    createBoxPart("Arrival bundle wrapped core", [0, 0.16, 0], [0.72, 0.28, 0.42], materials.bundle, [0.05, 0.08, -0.03]),
    createBoxPart("Arrival bundle darker tucked side", [-0.21, 0.17, 0.02], [0.18, 0.24, 0.44], materials.bundleDark, [0.02, -0.06, 0.04]),
    createLogPart("Arrival bundle rope tie long", [0.00, 0.30, 0], 0.82, 0.018, materials.rope, "x", [0.00, 0, 0.02]),
    createLogPart("Arrival bundle rope tie cross", [0.00, 0.31, 0], 0.50, 0.016, materials.rope, "z", [0.03, 0, 0.00]),
    createLogPart("Arrival bundle drift stick marker", [0.40, 0.11, -0.12], 0.62, 0.027, materials.bark, "x", [0.02, 0.28, 0.08])
  );
  return group;
}

function createArrivalStickCluster(materials) {
  const group = new THREE.Group();
  group.name = "arrivalSuppliesScatteredSticks";
  group.userData.subPropId = "scatteredSticks";
  const specs = [
    [-0.18, 0.08, -0.05, 0.46, 0.026, "x", [0.10, 0.18, 0.06]],
    [0.02, 0.10, 0.08, 0.58, 0.024, "x", [-0.04, -0.38, -0.02]],
    [0.18, 0.075, -0.02, 0.42, 0.022, "z", [0.08, 0.22, 0.03]],
    [-0.06, 0.15, 0.00, 0.36, 0.020, "x", [0.04, 0.54, 0.12]]
  ];
  specs.forEach((spec, index) => {
    const stick = createLogPart(`Arrival loose stick ${index + 1}`, [spec[0], spec[1], spec[2]], spec[3], spec[4], materials.bark, spec[5], spec[6]);
    group.add(stick);
  });
  return group;
}

function createArrivalLeafCluster(materials) {
  const group = new THREE.Group();
  group.name = "arrivalSuppliesScatteredLeaves";
  group.userData.subPropId = "scatteredLeaves";
  const leafGeometry = new THREE.SphereGeometry(0.12, 7, 5);
  const specs = [
    [-0.16, 0.042, 0.00, 0.18, 0.44, 0.08, 0.18, materials.leaf],
    [0.02, 0.044, -0.08, 0.16, 0.34, 0.07, -0.42, materials.leafDry],
    [0.16, 0.038, 0.08, 0.14, 0.38, 0.06, 0.76, materials.leaf],
    [-0.02, 0.050, 0.12, 0.13, 0.32, 0.055, -0.08, materials.leafDry],
    [0.22, 0.040, -0.10, 0.12, 0.30, 0.052, 0.32, materials.leaf]
  ];
  specs.forEach((spec, index) => {
    const leaf = new THREE.Mesh(leafGeometry, spec[7]);
    leaf.name = `Arrival loose leaf ${index + 1}`;
    leaf.position.set(spec[0], spec[1], spec[2]);
    leaf.scale.set(spec[3], spec[5], spec[4]);
    leaf.rotation.set(-Math.PI / 2 + 0.12, spec[6], 0.04);
    group.add(leaf);
  });
  return group;
}

function createArrivalMaterialPile(materials) {
  const group = new THREE.Group();
  group.name = "arrivalSuppliesMaterialPile";
  group.userData.subPropId = "materialPile";
  group.add(
    createBoxPart("Arrival material pile leaf mat", [0.00, 0.055, 0.02], [0.62, 0.045, 0.42], materials.leaf, [0.02, 0.18, 0]),
    createLogPart("Arrival material pile stick one", [-0.10, 0.14, -0.04], 0.62, 0.026, materials.bark, "x", [0.04, 0.28, 0.02]),
    createLogPart("Arrival material pile stick two", [0.10, 0.19, 0.06], 0.54, 0.023, materials.bark, "x", [-0.03, -0.32, -0.02]),
    createLogPart("Arrival material pile rope ready", [0.02, 0.25, 0.00], 0.48, 0.014, materials.rope, "z", [0.05, 0.02, 0.00]),
    createBoxPart("Arrival material pile folded leaf", [0.22, 0.19, -0.10], [0.20, 0.04, 0.18], materials.leafDry, [0.06, -0.44, 0.02])
  );
  return group;
}

function createArrivalCarryBundle(materials) {
  const group = new THREE.Group();
  group.userData.subPropId = "carryBundle";
  group.add(
    createBoxPart("Arrival carried bundle core", [0, 0, 0], [0.62, 0.34, 0.38], materials.bundle, [0.03, 0.04, -0.02]),
    createLogPart("Arrival carried bundle rope long", [0, 0.19, 0], 0.70, 0.016, materials.rope, "x"),
    createLogPart("Arrival carried bundle rope cross", [0, 0.20, 0], 0.44, 0.014, materials.rope, "z", [0, 0, 0.02]),
    createBoxPart("Arrival carried bundle leaf edge", [0.16, -0.02, 0.16], [0.28, 0.08, 0.16], materials.leaf, [0.08, 0.16, 0])
  );
  return group;
}

function cacheArrivalLocalTransform(object) {
  object.userData.basePosition = object.position.clone();
  object.userData.baseRotation = object.rotation.clone();
  object.userData.baseScale = object.scale.clone();
}

function createBuilderObjects() {
  const group = new THREE.Group();
  group.name = "Builder island work objects";
  const standardMaterial = (color, roughness, options = {}) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...options });
  };
  const materials = {
    benchTop: standardMaterial(0x9a6337, 0.82),
    benchLeg: standardMaterial(0x6f4426, 0.88),
    plank: standardMaterial(0xb57942, 0.86),
    bark: standardMaterial(0xffffff, 0.90, { emissive: 0x211409, emissiveIntensity: 0.18 }),
    leaves: standardMaterial(0xffffff, 0.76, { emissive: 0x12341f, emissiveIntensity: 0.42 }),
    youngLeaves: standardMaterial(0xffffff, 0.78, { emissive: 0x1a3f1d, emissiveIntensity: 0.48 }),
    rope: standardMaterial(0xc0a070, 0.92),
    thatch: standardMaterial(0x8f9b55, 0.94),
    leafMat: standardMaterial(0x66864b, 0.90),
    cloth: standardMaterial(0xd7b37a, 0.86),
    restCloth: standardMaterial(0xd69c75, 0.84),
    softFloor: standardMaterial(0x7fa06a, 0.88),
    blanket: standardMaterial(0x5f8fb3, 0.82),
    pillow: standardMaterial(0xf0d9b1, 0.78),
    toyRed: standardMaterial(0xc75c4a, 0.74),
    toyBlue: standardMaterial(0x4f8fbf, 0.74),
    toyGold: standardMaterial(0xd0a63e, 0.72),
    stoneTool: standardMaterial(0x6f7f7d, 0.92),
    toolEdge: standardMaterial(0xaeb9ae, 0.82),
    storageShadow: standardMaterial(0x4d3a28, 0.94),
    workbenchGlow: new THREE.MeshBasicMaterial({ color: 0xf4d577, transparent: true, opacity: 0.34, depthWrite: false }),
    footprint: new THREE.MeshBasicMaterial({ color: 0x4b3827, transparent: true, opacity: 0.24, depthWrite: false })
  };
  const workbench = createWorkbenchProp(materials);
  const buildables = createBuildableProps(materials);
  const buildSite = buildables.get(BUILDABLE_IDS.shelter);
  const restShelter = createRestShelterPresentationProp(materials);
  const storageWorkbenchTools = createStorageWorkbenchToolsProp(materials);
  const forest = createResourceForestProp(BUILDER_TREE_IDS, materials);

  group.add(workbench.group);
  for (const buildable of buildables.values()) {
    group.add(buildable.group);
  }
  group.add(restShelter.group);
  group.add(storageWorkbenchTools.group);
  group.add(forest.group);

  group.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });
  forest.trunks.castShadow = true;
  forest.trunks.receiveShadow = true;
  for (const mesh of [forest.lowerCanopies, forest.upperCanopies, forest.crowns, forest.cutBands]) {
    mesh.castShadow = false;
    mesh.receiveShadow = true;
  }
  markCameraOccluders(group);

  return { group, workbench, buildSite, buildables, restShelter, storageWorkbenchTools, forest, trees: forest.trees };
}

function markCameraOccluders(root) {
  if (!root || typeof root.traverse !== "function") return;
  root.traverse((object) => {
    if (!object.isMesh || object.userData.cameraOcclusionIgnored) return;
    if (!isOccludableMaterial(object.material)) return;
    object.userData.cameraOccluder = true;
  });
}

function createWorkbenchProp(materials) {
  const group = new THREE.Group();
  group.name = "Builder workbench";
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.16, 0.82), materials.benchTop);
  top.name = "Workbench top";
  top.position.set(0, 0.58, 0);
  group.add(top);

  for (const x of [-0.66, 0.66]) {
    for (const z of [-0.26, 0.26]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.56, 0.16), materials.benchLeg);
      leg.name = "Workbench leg";
      leg.position.set(x, 0.30, z);
      group.add(leg);
    }
  }

  const backRail = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.10, 0.10), materials.benchLeg);
  backRail.name = "Workbench back rail";
  backRail.position.set(0, 0.82, 0.34);
  group.add(backRail);

  const plankStack = new THREE.Group();
  plankStack.name = "Workbench loose planks";
  for (let i = 0; i < 4; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.055, 0.14), materials.plank);
    plank.name = "Workbench stacked plank";
    plank.position.set(-0.32 + i * 0.06, 0.70 + i * 0.035, -0.10 + i * 0.02);
    plank.rotation.y = -0.18 + i * 0.05;
    plankStack.add(plank);
  }
  group.add(plankStack);

  const malletHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.16), materials.benchLeg);
  malletHead.name = "Workbench mallet head";
  malletHead.position.set(0.48, 0.72, -0.10);
  group.add(malletHead);
  const malletHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.54, 10), materials.rope);
  malletHandle.name = "Workbench mallet handle";
  malletHandle.position.set(0.34, 0.70, -0.10);
  malletHandle.rotation.z = Math.PI / 2;
  group.add(malletHandle);

  return { group, plankStack };
}

function createStorageWorkbenchToolsProp(materials) {
  const group = new THREE.Group();
  group.name = "Storage workbench tools presentation family";
  group.userData.type = "presentationFamily";
  group.userData.family = STORAGE_WORKBENCH_TOOLS_ID;

  const campStorage = createCampStorageBasketProp(materials);
  const workbenchUpgrade = createWorkbenchUpgradeOverlayProp(materials);
  const toolRack = createToolRackProp(materials);
  const heldTool = createFirstToolProp(materials, "First tool BB hand attachment");
  const heldPlank = createBuildPlankAttachmentProp(materials);
  const heldRope = createBuildRopeVinesAttachmentProp(materials);
  const heldStorageMaterial = createStorageMaterialAttachmentProp(materials);
  heldTool.visible = false;
  heldPlank.visible = false;
  heldRope.visible = false;
  heldStorageMaterial.visible = false;

  group.add(campStorage.group, workbenchUpgrade.group, toolRack.group, heldTool, heldPlank, heldRope, heldStorageMaterial);
  group.traverse((object) => {
    if (object.isMesh) object.userData.cameraOcclusionIgnored = true;
  });

  return { group, campStorage, workbenchUpgrade, toolRack, heldTool, heldPlank, heldRope, heldStorageMaterial };
}

function createCampStorageBasketProp(materials) {
  const group = new THREE.Group();
  group.name = "Camp storage basket";
  group.userData.subPropId = "campStorage";
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.10, 0.48), materials.storageShadow);
  base.name = "Storage basket base";
  base.position.set(0, 0.06, 0);
  group.add(base);

  const sideSpecs = [
    ["Storage basket north wall", 0, 0.25, -0.28, 0.68, 0.30, 0.08],
    ["Storage basket south wall", 0, 0.25, 0.28, 0.68, 0.30, 0.08],
    ["Storage basket west wall", -0.38, 0.24, 0, 0.08, 0.28, 0.44],
    ["Storage basket east wall", 0.38, 0.24, 0, 0.08, 0.28, 0.44]
  ];
  for (const [name, x, y, z, sx, sy, sz] of sideSpecs) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), materials.plank);
    wall.name = name;
    wall.position.set(x, y, z);
    wall.rotation.y = (x || z) * 0.04;
    group.add(wall);
  }

  const woodPile = new THREE.Group();
  woodPile.name = "Storage basket wood pile";
  const logGeometry = new THREE.CylinderGeometry(0.035, 0.042, 0.48, 8);
  for (let i = 0; i < 6; i += 1) {
    const log = new THREE.Mesh(logGeometry, materials.plank);
    log.name = "Storage basket stored wood";
    log.position.set(-0.18 + (i % 3) * 0.18, 0.22 + Math.floor(i / 3) * 0.08, -0.03 + (i % 2) * 0.12);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = -0.18 + i * 0.09;
    woodPile.add(log);
  }
  group.add(woodPile);

  return { group, woodPile };
}

function createWorkbenchUpgradeOverlayProp(materials) {
  const group = new THREE.Group();
  group.name = "Upgraded workbench tool-ready overlay";
  group.userData.subPropId = "upgradedWorkbench";
  const surfaceMat = materials.benchTop;
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.045, 0.34), surfaceMat);
  tray.name = "Workbench tool tray";
  tray.position.set(-0.10, 0.75, -0.08);
  tray.rotation.y = -0.04;
  group.add(tray);

  const lip = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.06, 0.06), materials.rope);
  lip.name = "Workbench front tool lip";
  lip.position.set(-0.08, 0.81, -0.28);
  group.add(lip);

  const vise = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.18), materials.stoneTool);
  vise.name = "Workbench shaping stone";
  vise.position.set(0.32, 0.84, -0.05);
  vise.rotation.y = 0.34;
  group.add(vise);

  const scrap = createFirstToolProp(materials, "Workbench unfinished first tool");
  scrap.name = "Workbench first tool preview";
  scrap.position.set(-0.34, 0.84, 0.06);
  scrap.rotation.set(-0.10, 0.66, -0.08);
  scrap.scale.setScalar(0.62);
  group.add(scrap);

  const glow = new THREE.Mesh(new THREE.CircleGeometry(0.44, 24), materials.workbenchGlow);
  glow.name = "Workbench crafting focus glow";
  glow.position.set(-0.06, 0.835, -0.06);
  glow.rotation.x = -Math.PI / 2;
  glow.visible = false;
  group.add(glow);

  return { group, glow, previewTool: scrap };
}

function createToolRackProp(materials) {
  const group = new THREE.Group();
  group.name = "Small camp tool rack";
  group.userData.subPropId = "toolRack";
  group.add(
    createLogPart("Tool rack left post", [-0.30, 0.34, 0.00], 0.62, 0.035, materials.benchLeg, "y"),
    createLogPart("Tool rack right post", [0.30, 0.34, 0.00], 0.62, 0.035, materials.benchLeg, "y"),
    createLogPart("Tool rack upper rail", [0.00, 0.56, 0.00], 0.68, 0.030, materials.plank, "x"),
    createLogPart("Tool rack lower rail", [0.00, 0.34, 0.00], 0.58, 0.026, materials.rope, "x")
  );

  const pegGroup = new THREE.Group();
  pegGroup.name = "Tool rack pegs";
  for (let i = 0; i < 3; i += 1) {
    const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 8), materials.rope);
    peg.name = "Tool rack peg";
    peg.position.set(-0.20 + i * 0.20, 0.46, -0.08);
    peg.rotation.x = Math.PI / 2;
    pegGroup.add(peg);
  }
  group.add(pegGroup);

  const rackTool = createFirstToolProp(materials, "First tool on rack");
  rackTool.position.set(-0.20, 0.40, -0.10);
  rackTool.rotation.set(0.36, 0.10, -0.64);
  rackTool.scale.setScalar(0.72);
  rackTool.visible = false;
  group.add(rackTool);

  return { group, rackTool, pegGroup };
}

function createFirstToolProp(materials, name) {
  const group = new THREE.Group();
  group.name = name;
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 0.46, 8), materials.rope);
  handle.name = `${name} handle`;
  handle.rotation.x = Math.PI / 2;
  group.add(handle);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.10), materials.stoneTool);
  head.name = `${name} stone head`;
  head.position.set(0, 0.015, -0.24);
  head.rotation.set(0.08, 0.18, -0.10);
  group.add(head);

  const edge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.035), materials.toolEdge);
  edge.name = `${name} bright tool edge`;
  edge.position.set(0, 0.05, -0.31);
  edge.rotation.set(0.12, 0.18, -0.08);
  group.add(edge);

  return group;
}

function createBuildPlankAttachmentProp(materials) {
  const group = new THREE.Group();
  group.name = "Build plank BB hand attachment";
  group.add(
    createBoxPart("Held build plank", [0, 0, 0], [0.88, 0.075, 0.18], materials.plank, [0.02, 0.10, 0]),
    createBoxPart("Held plank bright edge", [0, 0.052, -0.082], [0.84, 0.018, 0.018], materials.rope)
  );
  return group;
}

function createBuildRopeVinesAttachmentProp(materials) {
  const group = new THREE.Group();
  group.name = "Rope vine BB hand attachment";
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.022, 8, 28), materials.rope);
  coil.name = "Held rope vine coil";
  coil.rotation.x = Math.PI / 2;
  group.add(coil);
  group.add(
    createLogPart("Held rope vine strand A", [-0.18, 0.00, -0.02], 0.42, 0.014, materials.rope, "x", [0, 0, 0.12]),
    createLogPart("Held rope vine strand B", [0.16, 0.02, 0.03], 0.38, 0.012, materials.rope, "x", [0, 0, -0.10])
  );
  return group;
}

function createStorageMaterialAttachmentProp(materials) {
  const group = new THREE.Group();
  group.name = "Storage material BB hand attachment";
  group.add(
    createLogPart("Held sorted stick A", [-0.10, 0.00, -0.02], 0.42, 0.028, materials.plank, "x", [0, 0, 0.10]),
    createLogPart("Held sorted stick B", [0.08, 0.03, 0.04], 0.36, 0.024, materials.benchLeg, "x", [0, 0, -0.12]),
    createBoxPart("Held folded leaf bundle", [0.02, 0.04, 0.00], [0.28, 0.035, 0.18], materials.leaf, [0.04, 0.18, -0.08])
  );
  return group;
}

function createResourceForestProp(treeIds, materials) {
  const group = new THREE.Group();
  group.name = "Builder resource forest";
  const count = treeIds.length;
  const trees = new Map();
  const trunks = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.72, 1.0, 1, 10, 3),
    materials.bark,
    count
  );
  trunks.name = "Instanced resource tree trunks";
  const lowerCanopies = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 2),
    materials.leaves.clone(),
    count
  );
  lowerCanopies.name = "Instanced resource tree lower canopies";
  const upperCanopies = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    materials.leaves.clone(),
    count
  );
  upperCanopies.name = "Instanced resource tree upper canopies";
  const crowns = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    materials.youngLeaves.clone(),
    count
  );
  crowns.name = "Instanced resource tree bright crowns";
  const cutBands = new THREE.InstancedMesh(
    new THREE.TorusGeometry(1, 0.055, 8, 22),
    materials.rope.clone(),
    count
  );
  cutBands.name = "Instanced resource tree harvest bands";

  for (const mesh of [trunks, lowerCanopies, upperCanopies, crowns, cutBands]) {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    group.add(mesh);
  }

  treeIds.forEach((id, index) => {
    trees.set(id, {
      id,
      index,
      yaw: (index * 2.399963 + 0.31) % TAU,
      colorSeed: hash01(index * 19.17 + 4.1),
      crownSeed: hash01(index * 31.77 + 0.7),
      userData: {
        visualHeight: 0
      }
    });
  });

  return {
    group,
    trees,
    trunks,
    lowerCanopies,
    upperCanopies,
    crowns,
    cutBands,
    dummy: new THREE.Object3D(),
    scratchPosition: new THREE.Vector3(),
    scratchRotation: new THREE.Euler(),
    scratchScale: new THREE.Vector3(),
    scratchColor: new THREE.Color(),
    scratchBarkDryColor: new THREE.Color(0x4e3524),
    scratchLeafDryColor: new THREE.Color(0x6f6540),
    scratchCrownDryColor: new THREE.Color(0x8b7a50)
  };
}

function createBuildableProps(materials) {
  return new Map(BUILDABLE_SEQUENCE.map((buildableId) => [buildableId, createBuildableProp(buildableId, materials)]));
}

function createBuildableProp(buildableId, materials) {
  if (buildableId === BUILDABLE_IDS.bed) return createBedBuildableProp(materials);
  if (buildableId === BUILDABLE_IDS.toyBlocks) return createToyBlocksBuildableProp(materials);
  return createShelterBuildableProp(materials);
}

function createShelterBuildableProp(materials) {
  const group = new THREE.Group();
  group.name = "Leaf shelter buildable";
  group.userData.type = "buildable";
  group.userData.buildableId = BUILDABLE_IDS.shelter;
  const footprint = createBuildableFootprint("Shelter build footprint", 1.55, 32, materials.footprint, 0.012);
  group.add(footprint);

  const stageGroups = [
    createStageGroup("shelter-footprint", 0.02, [
      createBoxPart("Shelter entry pebble marker", [0.00, 0.035, 0.96], [0.34, 0.07, 0.12], materials.rope, [0, 0.22, 0])
    ]),
    createStageGroup("shelter-foundation", 0.16, [
      createLogPart("Foundation north log", [0, 0.10, -0.72], 1.82, 0.075, materials.plank, "x"),
      createLogPart("Foundation south log", [0, 0.10, 0.72], 1.82, 0.075, materials.plank, "x"),
      createLogPart("Foundation west log", [-0.86, 0.12, 0], 1.48, 0.070, materials.plank, "z"),
      createLogPart("Foundation east log", [0.86, 0.12, 0], 1.48, 0.070, materials.plank, "z")
    ]),
    createStageGroup("shelter-posts", 0.34, [
      createLogPart("Shelter west front post", [-0.74, 0.70, -0.58], 1.26, 0.065, materials.benchLeg, "y", [0.05, 0, -0.08]),
      createLogPart("Shelter east front post", [0.74, 0.70, -0.58], 1.26, 0.065, materials.benchLeg, "y", [-0.04, 0, 0.08]),
      createLogPart("Shelter back post", [0.00, 0.68, 0.62], 1.16, 0.060, materials.benchLeg, "y", [0.03, 0, 0])
    ]),
    createStageGroup("shelter-roof-frame", 0.54, [
      createLogPart("Shelter ridge beam", [0.00, 1.36, -0.02], 1.58, 0.060, materials.plank, "x"),
      createLogPart("Shelter west rafter", [-0.48, 1.16, 0.00], 1.18, 0.045, materials.rope, "z", [0.58, 0.10, 0]),
      createLogPart("Shelter east rafter", [0.48, 1.16, 0.00], 1.18, 0.045, materials.rope, "z", [0.58, -0.10, 0]),
      createLogPart("Shelter back roof tie", [0.00, 1.08, 0.70], 1.50, 0.046, materials.rope, "x")
    ]),
    createStageGroup("shelter-roof-cover", 0.74, [
      createBoxPart("Shelter west leaf roof", [-0.43, 1.16, 0.02], [0.92, 0.075, 1.66], materials.thatch, [0, 0, -0.48]),
      createBoxPart("Shelter east leaf roof", [0.43, 1.16, 0.02], [0.92, 0.075, 1.66], materials.thatch, [0, 0, 0.48]),
      createBoxPart("Shelter patched cloth flap", [0.00, 0.98, -0.80], [1.18, 0.045, 0.34], materials.cloth, [0.14, 0, 0])
    ]),
    createStageGroup("shelter-entry-rest", 0.92, [
      createBoxPart("Shelter leaf rest mat", [0.10, 0.055, -0.02], [0.92, 0.045, 0.82], materials.leafMat, [0, -0.10, 0]),
      createBoxPart("Shelter small side bundle", [-0.62, 0.14, 0.35], [0.32, 0.16, 0.22], materials.cloth, [0, 0.32, 0])
    ])
  ];
  for (const stage of stageGroups) group.add(stage);

  const storedStack = createStagedStack("Shelter staged lumber", 5, (i) => {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.07, 0.16), materials.plank);
    plank.name = "Build-site staged plank";
    plank.position.set(-1.05 + i * 0.07, 0.08 + i * 0.08, 0.92 - i * 0.04);
    plank.rotation.y = -0.24 + i * 0.04;
    return plank;
  });
  group.add(storedStack);

  return { group, stageGroups, progressParts: stageGroups, storedStack, footprint };
}

function createBedBuildableProp(materials) {
  const group = new THREE.Group();
  group.name = "Leaf bed buildable";
  group.userData.type = "buildable";
  group.userData.buildableId = BUILDABLE_IDS.bed;

  const footprint = createBuildableFootprint("Bed build footprint", 0.98, 24, materials.footprint.clone(), 0.010, [1.28, 0.72, 1]);
  group.add(footprint);

  const stageGroups = [
    createStageGroup("bed-supports", 0.04, [
      createBoxPart("Bed northwest leg", [-0.54, 0.18, -0.36], [0.14, 0.32, 0.14], materials.benchLeg),
      createBoxPart("Bed northeast leg", [0.54, 0.18, -0.36], [0.14, 0.32, 0.14], materials.benchLeg),
      createBoxPart("Bed southwest leg", [-0.54, 0.18, 0.36], [0.14, 0.32, 0.14], materials.benchLeg),
      createBoxPart("Bed southeast leg", [0.54, 0.18, 0.36], [0.14, 0.32, 0.14], materials.benchLeg)
    ]),
    createStageGroup("bed-frame", 0.28, [
      createBoxPart("Bed north rail", [0, 0.38, -0.42], [1.34, 0.12, 0.14], materials.plank),
      createBoxPart("Bed south rail", [0, 0.38, 0.42], [1.34, 0.12, 0.14], materials.plank),
      createBoxPart("Bed west rail", [-0.64, 0.38, 0], [0.14, 0.12, 0.86], materials.plank),
      createBoxPart("Bed east rail", [0.64, 0.38, 0], [0.14, 0.12, 0.86], materials.plank),
      createBoxPart("Bed cross slat", [0, 0.44, 0], [1.08, 0.06, 0.12], materials.rope, [0, 0.12, 0])
    ]),
    createStageGroup("bed-mat", 0.56, [
      createBoxPart("Bed leaf mattress", [0.02, 0.50, 0.02], [1.18, 0.16, 0.76], materials.leafMat, [0, -0.05, 0]),
      createBoxPart("Bed woven edge", [-0.02, 0.60, -0.36], [1.04, 0.04, 0.08], materials.rope)
    ]),
    createStageGroup("bed-blanket", 0.84, [
      createBoxPart("Bed soft blanket", [0.12, 0.62, 0.16], [0.82, 0.06, 0.46], materials.blanket, [0, 0.06, 0]),
      createBoxPart("Bed pillow", [-0.40, 0.66, -0.22], [0.34, 0.12, 0.28], materials.pillow, [0, -0.10, 0])
    ])
  ];
  for (const stage of stageGroups) group.add(stage);

  const storedStack = createStagedStack("Bed staged supplies", 3, (i) => {
    const bundle = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.055, 0.18), i === 2 ? materials.leafMat : materials.plank);
    bundle.name = "Bed staged bundle";
    bundle.position.set(-0.82 + i * 0.07, 0.08 + i * 0.07, 0.54 - i * 0.06);
    bundle.rotation.y = -0.18 + i * 0.11;
    return bundle;
  });
  group.add(storedStack);

  return { group, stageGroups, progressParts: stageGroups, storedStack, footprint };
}

function createToyBlocksBuildableProp(materials) {
  const group = new THREE.Group();
  group.name = "Toy blocks buildable";
  group.userData.type = "buildable";
  group.userData.buildableId = BUILDABLE_IDS.toyBlocks;

  const footprint = createBuildableFootprint("Toy blocks play footprint", 0.72, 20, materials.footprint.clone(), 0.008);
  group.add(footprint);

  const stageGroups = [
    createStageGroup("toy-tray", 0.06, [
      createBoxPart("Toy tray plank", [0, 0.06, 0], [0.92, 0.06, 0.58], materials.plank, [0, 0.12, 0])
    ]),
    createStageGroup("toy-blocks", 0.38, [
      createBoxPart("Toy red cube", [-0.26, 0.20, -0.12], [0.24, 0.24, 0.24], materials.toyRed, [0, 0.22, 0]),
      createBoxPart("Toy blue cube", [0.12, 0.18, 0.02], [0.22, 0.22, 0.22], materials.toyBlue, [0, -0.14, 0]),
      createBoxPart("Toy gold block", [0.34, 0.15, -0.20], [0.26, 0.16, 0.20], materials.toyGold, [0, 0.38, 0])
    ]),
    createStageGroup("toy-stack", 0.70, [
      createBoxPart("Toy stacked base", [-0.05, 0.31, 0.22], [0.30, 0.18, 0.22], materials.toyBlue, [0, 0.10, 0]),
      createBoxPart("Toy stacked top", [-0.06, 0.50, 0.22], [0.22, 0.18, 0.20], materials.toyRed, [0, -0.24, 0]),
      createTopPart("Tiny spinning top", [0.35, 0.24, 0.20], materials.toyGold)
    ])
  ];
  for (const stage of stageGroups) {
    stage.traverse((object) => {
      if (object.isMesh) object.userData.cameraOcclusionIgnored = true;
    });
    group.add(stage);
  }

  const storedStack = createStagedStack("Toy staged scraps", 3, (i) => {
    const scrap = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.045, 0.12), materials.plank);
    scrap.name = "Toy staged wood scrap";
    scrap.position.set(-0.56 + i * 0.08, 0.06 + i * 0.05, 0.44 - i * 0.04);
    scrap.rotation.y = -0.30 + i * 0.18;
    scrap.userData.cameraOcclusionIgnored = true;
    return scrap;
  });
  group.add(storedStack);

  return { group, stageGroups, progressParts: stageGroups, storedStack, footprint };
}

function createRestShelterPresentationProp(materials) {
  const group = new THREE.Group();
  group.name = "Rest shelter presentation family";
  group.userData.type = "presentationFamily";
  group.userData.family = REST_SHELTER_ID;

  const restSling = createRestSlingVariant(materials);
  const cozyBed = createCozyBedVariant(materials);
  const strongShelter = createStrongShelterVariant(materials);
  const variants = { restSling, cozyBed, strongShelter };
  for (const variant of Object.values(variants)) {
    variant.visible = false;
    group.add(variant);
  }

  group.traverse((object) => {
    if (object.isMesh) object.userData.cameraOcclusionIgnored = object.userData.cameraOcclusionIgnored || object.name.includes("soft floor");
  });

  return {
    group,
    variants,
    swayParts: [
      restSling.getObjectByName("Rest sling low-poly cloth"),
      restSling.getObjectByName("Rest sling folded blanket edge"),
      cozyBed.getObjectByName("Cozy bed folded blanket"),
      strongShelter.getObjectByName("Strong shelter windbreak flap")
    ].filter(Boolean)
  };
}

function createRestSlingVariant(materials) {
  const group = new THREE.Group();
  group.name = "Rest sling hammock variant";
  group.userData.variant = "restSling";
  group.add(
    createLogPart("Rest sling west post", [-0.82, 0.54, -0.02], 1.08, 0.055, materials.benchLeg, "y", [0.04, 0, -0.03]),
    createLogPart("Rest sling east post", [0.82, 0.54, -0.02], 1.08, 0.055, materials.benchLeg, "y", [-0.03, 0, 0.04]),
    createLogPart("Rest sling head rope", [0, 0.82, -0.30], 1.76, 0.018, materials.rope, "x"),
    createLogPart("Rest sling foot rope", [0, 0.76, 0.30], 1.68, 0.018, materials.rope, "x"),
    createBoxPart("Rest sling low-poly cloth", [0, 0.62, 0.00], [1.34, 0.055, 0.62], materials.restCloth, [0, 0.02, 0.035]),
    createBoxPart("Rest sling folded blanket edge", [0.28, 0.68, 0.20], [0.48, 0.045, 0.20], materials.blanket, [0, -0.08, 0.02]),
    createBoxPart("Rest sling leaf pillow", [-0.46, 0.70, -0.20], [0.30, 0.09, 0.24], materials.pillow, [0, 0.10, 0.04]),
    createBoxPart("Rest sling west tie knot", [-0.80, 0.80, -0.30], [0.12, 0.08, 0.08], materials.rope, [0.04, 0.30, 0]),
    createBoxPart("Rest sling east tie knot", [0.80, 0.75, 0.30], [0.12, 0.08, 0.08], materials.rope, [-0.02, -0.26, 0])
  );
  return group;
}

function createCozyBedVariant(materials) {
  const group = new THREE.Group();
  group.name = "Cozy bed upgrade variant";
  group.userData.variant = "cozyBed";
  group.add(
    createBoxPart("Cozy bed raised platform marker", [0, 0.13, 0.00], [1.42, 0.10, 0.90], materials.plank, [0, 0.04, 0]),
    createBoxPart("Cozy bed leaf mattress upgrade", [0.02, 0.25, 0.00], [1.20, 0.16, 0.76], materials.softFloor, [0, -0.03, 0]),
    createBoxPart("Cozy bed folded blanket", [0.24, 0.37, 0.17], [0.76, 0.055, 0.40], materials.blanket, [0, 0.07, 0]),
    createBoxPart("Cozy bed rounded pillow", [-0.42, 0.42, -0.22], [0.36, 0.13, 0.28], materials.pillow, [0, -0.08, 0]),
    createBoxPart("Cozy bed shelf vertical", [-0.88, 0.36, 0.42], [0.11, 0.58, 0.12], materials.benchLeg),
    createBoxPart("Cozy bed shelf plank", [-0.62, 0.58, 0.42], [0.58, 0.08, 0.18], materials.plank, [0, -0.05, 0]),
    createBoxPart("Cozy bed small nook bundle", [-0.52, 0.69, 0.42], [0.22, 0.13, 0.16], materials.cloth, [0, 0.18, 0]),
    createBoxPart("Cozy bed rope foot rail", [0.72, 0.38, 0], [0.07, 0.12, 0.86], materials.rope)
  );
  return group;
}

function createStrongShelterVariant(materials) {
  const group = new THREE.Group();
  group.name = "Strong shelter comfort variant";
  group.userData.variant = "strongShelter";
  group.add(
    createBoxPart("Strong shelter soft floor indicator", [0.02, 0.045, 0.05], [1.42, 0.05, 1.06], materials.softFloor, [0, -0.04, 0]),
    createLogPart("Strong shelter front reinforced post west", [-0.86, 0.78, -0.60], 1.48, 0.075, materials.benchLeg, "y", [0.04, 0, -0.06]),
    createLogPart("Strong shelter front reinforced post east", [0.86, 0.78, -0.60], 1.48, 0.075, materials.benchLeg, "y", [-0.04, 0, 0.06]),
    createLogPart("Strong shelter back reinforced post west", [-0.76, 0.72, 0.62], 1.34, 0.070, materials.benchLeg, "y", [0.02, 0, 0.04]),
    createLogPart("Strong shelter back reinforced post east", [0.76, 0.72, 0.62], 1.34, 0.070, materials.benchLeg, "y", [-0.02, 0, -0.04]),
    createBoxPart("Strong shelter thick roof cap west", [-0.43, 1.42, 0.02], [0.94, 0.10, 1.78], materials.thatch, [0, 0, -0.46]),
    createBoxPart("Strong shelter thick roof cap east", [0.43, 1.42, 0.02], [0.94, 0.10, 1.78], materials.thatch, [0, 0, 0.46]),
    createBoxPart("Strong shelter windbreak flap", [0.00, 0.72, 0.88], [1.58, 0.07, 0.54], materials.restCloth, [0.10, 0, 0]),
    createLogPart("Strong shelter left tie-down rope", [-0.96, 0.30, -0.12], 0.88, 0.016, materials.rope, "z", [0.48, 0, 0.16]),
    createLogPart("Strong shelter right tie-down rope", [0.96, 0.30, -0.12], 0.88, 0.016, materials.rope, "z", [0.48, 0, -0.16]),
    createBoxPart("Strong shelter comfort shelf", [-0.68, 0.48, -0.76], [0.56, 0.08, 0.18], materials.plank, [0, 0.10, 0]),
    createBoxPart("Strong shelter tucked blanket", [0.36, 0.18, -0.32], [0.44, 0.08, 0.30], materials.blanket, [0, -0.12, 0])
  );
  return group;
}

function createStageGroup(name, threshold, parts) {
  const group = new THREE.Group();
  group.name = name;
  group.userData.progressThreshold = threshold;
  for (const part of parts) group.add(part);
  return group;
}

function createStagedStack(name, count, createPart) {
  const group = new THREE.Group();
  group.name = name;
  for (let i = 0; i < count; i += 1) group.add(createPart(i));
  return group;
}

function createBuildableFootprint(name, radius, segments, material, y, scale = [1, 1, 1]) {
  const footprint = new THREE.Mesh(new THREE.CircleGeometry(radius, segments), material);
  footprint.name = name;
  footprint.rotation.x = -Math.PI / 2;
  footprint.position.y = y;
  footprint.scale.fromArray(scale);
  footprint.renderOrder = 2;
  footprint.userData.cameraOcclusionIgnored = true;
  return footprint;
}

function createBoxPart(name, position, scale, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(scale[0], scale[1], scale[2]), material);
  mesh.name = name;
  mesh.position.fromArray(position);
  mesh.rotation.fromArray(rotation);
  return mesh;
}

function createLogPart(name, position, length, radius, material, axis = "y", rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.06, length, 8, 1), material);
  mesh.name = name;
  mesh.position.fromArray(position);
  mesh.rotation.fromArray(rotation);
  if (axis === "x") mesh.rotation.z += Math.PI / 2;
  if (axis === "z") mesh.rotation.x += Math.PI / 2;
  return mesh;
}

function createTopPart(name, position, material) {
  const group = new THREE.Group();
  group.name = name;
  group.position.fromArray(position);
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.22, 10), material);
  body.name = "Spinning top body";
  body.position.y = 0.02;
  const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8), material);
  peg.name = "Spinning top peg";
  peg.position.y = 0.14;
  group.add(body, peg);
  return group;
}

function calculateCanonicalCelestial(env) {
  const light = env.lighting;
  const sunPosition = arrayToVector3(light.sunPosition, [0, -128, 0]);
  const moonPosition = arrayToVector3(light.moonPosition, [0, 128, 0]);
  const sunDirection = normalizeVector3FromArray(light.sunDirection, sunPosition);
  const moonDirection = normalizeVector3FromArray(light.moonDirection, moonPosition);
  const sunIntensity = clamp(light.sunIntensity || 0, 0, 1.4);
  const moonIntensity = clamp(light.moonIntensity || 0, 0, 1.0);
  const useSun = activeCelestialSourceFromIntensities(sunIntensity, moonIntensity) === "sun";
  const dominantDirection = (useSun ? sunDirection : moonDirection).clone().normalize();
  const dominantPosition = (useSun ? sunPosition : moonPosition).clone();
  const dominantColor = colorFromArray(useSun ? light.sunColor : light.moonColor);
  const waterDirection = dominantDirection.clone().normalize();

  return {
    sunPosition,
    moonPosition,
    sunDirection,
    moonDirection,
    dominantPosition,
    dominantDirection,
    waterDirection,
    sunIntensity,
    moonIntensity,
    dominantColor,
    dominantSource: useSun ? "sun" : "moon"
  };
}

function syncLighting({ celestial, lighting, sky, water, celestialBodies, scene, renderer, time }) {
  const env = window.__toyboxEnv;
  syncCelestialBodies(celestialBodies, celestial, time);
  const lightAnchor = activeCelestialLightAnchor(celestialBodies, celestial, env);
  celestial.dominantSource = lightAnchor.source;
  celestial.dominantPosition = lightAnchor.position.clone();
  celestial.dominantDirection = lightAnchor.direction.clone();
  celestial.waterDirection = lightAnchor.direction.clone();
  celestial.dominantColor = lightAnchor.color.clone();

  const skyUniforms = sky.material.uniforms;
  const dayFactor = env.dayFactor;
  const nightFactor = env.nightFactor;
  const dawnFactor = cyclePulse01(env.timeOfDay, 0.25, 0.105);
  const duskFactor = cyclePulse01(env.timeOfDay, 0.75, 0.115);
  const warmFactor = clamp(Math.max(dawnFactor, duskFactor), 0, 1);
  const weatherHaze = clamp(env.lighting.fogDensity * 0.45, 0, 0.24);
  const usingSun = lightAnchor.source === "sun";

  skyUniforms.sunPosition.value.copy(lightAnchor.position);
  skyUniforms.turbidity.value = usingSun ? 1.15 + warmFactor * 0.85 + weatherHaze * 2.2 : 0.35 + weatherHaze;
  skyUniforms.rayleigh.value = usingSun ? 3.1 + dayFactor * 0.42 : 0.026 + celestial.moonIntensity * 0.07;
  skyUniforms.mieCoefficient.value = usingSun ? 0.0012 + warmFactor * 0.0014 + weatherHaze * 0.0012 : 0.000020;
  skyUniforms.mieDirectionalG.value = usingSun ? 0.66 + warmFactor * 0.03 : 0.50;
  updateSkyTint(sky, { usingSun, dayFactor, nightFactor, warmFactor, duskFactor, dawnFactor });

  water.material.uniforms.sunDirection.value.copy(celestial.waterDirection);
  water.material.uniforms.sunColor.value.copy(celestial.dominantColor);
  water.material.uniforms.waterColor.value.set(celestial.dominantSource === "sun" ? 0x0b3f52 : 0x081d35);
  water.material.uniforms.distortionScale.value = 3.15 + env.windStrength * 1.35;
  water.material.uniforms.size.value = 1.15 + env.windStrength * 0.42;

  const fogColor = colorFromArray(env.lighting.fogColor);
  scene.fog.color.copy(fogColor);
  scene.fog.density = 0.0015 + env.lighting.fogDensity * 0.0065;
  renderer.toneMappingExposure = clamp(
    0.24 + dayFactor * 0.25 + warmFactor * 0.045 + (usingSun ? 0.02 : celestial.moonIntensity * 0.10),
    0.24,
    0.58
  );

  lighting.directional.position.copy(lightAnchor.position);
  lighting.directional.target.position.set(0, 0.12, 0);
  lighting.directional.target.updateMatrixWorld();
  lighting.directional.color.copy(lightAnchor.color);
  lighting.directional.intensity =
    lightAnchor.source === "sun" ? celestial.sunIntensity * 2.4 : celestial.moonIntensity * 1.35;
  lighting.directional.shadow.radius = lightAnchor.source === "sun" ? 1.4 : 3.4;

  const hemisphereSky = new THREE.Color(0x9bd4ff).lerp(new THREE.Color(0x6078aa), nightFactor * 0.78);
  hemisphereSky.lerp(new THREE.Color(0xffb982), warmFactor * 0.08);
  const hemisphereGround = new THREE.Color(0xb4815a).lerp(new THREE.Color(0x303a4f), nightFactor * 0.78);
  lighting.hemisphere.color.copy(hemisphereSky);
  lighting.hemisphere.groundColor.copy(hemisphereGround);
  lighting.hemisphere.intensity = clamp(
    0.42 + dayFactor * 0.44 + celestial.moonIntensity * 0.28 + warmFactor * 0.08 - weatherHaze * 0.04,
    0.38,
    0.96
  );

  const fireIntensity = env.lighting.fireIntensity;
  lighting.fireLight.color.copy(new THREE.Color(0xff9a3a).lerp(new THREE.Color(0xff6e20), nightFactor * 0.36));
  lighting.fireLight.intensity = fireIntensity > 0.01 ? fireIntensity * (6.8 + nightFactor * 3.0) : 0;
  lighting.fireLight.distance = 0;
  lighting.fireLight.decay = 2.0;
  lighting.fireLight.shadow.camera.far = 16.0;

  window.__toyboxRenderSource = {
    source: lightAnchor.source,
    skyIsThreeSky: Boolean(sky.isSky),
    skyShaderTinted: sky.material.fragmentShader.includes("skyTintStrength"),
    skyShaderSunDiskDisabled: Boolean(
      sky.userData.shaderSunDiskDisabled &&
        sky.material.fragmentShader.includes("L0 += vec3( 0.0 ) * sundisk;")
    ),
    skySunPosition: skyUniforms.sunPosition.value.toArray(),
    visibleSourcePosition: lightAnchor.position.toArray(),
    directionalLightPosition: lighting.directional.position.toArray(),
    directionalLightTarget: lighting.directional.target.position.toArray(),
    directionalLightIntensity: lighting.directional.intensity,
    hemisphereIntensity: lighting.hemisphere.intensity,
    rendererExposure: renderer.toneMappingExposure,
    waterSunDirection: water.material.uniforms.sunDirection.value.toArray(),
    fireLightPosition: lighting.fireLight.position.toArray(),
    fireLightIntensity: lighting.fireLight.intensity,
    fireLightDistance: lighting.fireLight.distance,
    fireLightDecay: lighting.fireLight.decay
  };
}

function syncSkyLife({ stars, clouds, birds, env, celestial, time }) {
  const nightFactor = clamp(env.nightFactor, 0, 1);
  const dayFactor = clamp(env.dayFactor, 0, 1);
  const weather = clamp(env.world.emotionalField * 0.2 + env.wind.gust * 0.22 + env.lighting.fogDensity * 0.38, 0, 1);
  const starVisibility = clamp(nightFactor * 0.72 + celestial.moonIntensity * 0.28 - dayFactor * 0.70 - weather * 0.16, 0, 1);
  const twinkle = 0.88 + Math.sin(time * 1.7) * 0.05 + Math.sin(time * 3.1 + 1.4) * 0.035;
  for (const layer of stars.layers) {
    const layerTwinkle = twinkle + Math.sin(time * (0.45 + layer.userData.twinkleSeed * 0.003)) * 0.04;
    layer.material.opacity = clamp(starVisibility * layer.userData.baseOpacity * layerTwinkle, 0, 0.72);
    layer.rotation.y = time * 0.0008 * (0.8 + layer.userData.twinkleSeed * 0.01);
  }
  stars.group.visible = starVisibility > 0.005;

  const cloudVisibility = clamp(0.34 + dayFactor * 0.42 + env.lighting.fogDensity * 0.38 + env.wind.gust * 0.12, 0.18, 0.86);
  const cloudLight = new THREE.Color().setRGB(
    clamp(env.lighting.sky[0] + 0.58, 0.64, 1.0),
    clamp(env.lighting.sky[1] + 0.56, 0.66, 1.0),
    clamp(env.lighting.sky[2] + 0.54, 0.72, 1.0)
  );
  cloudLight.lerp(new THREE.Color(0xffb684), cyclePulse01(env.timeOfDay, 0.75, 0.12) * 0.20);
  const windDrift = env.windStrength * 0.38 + env.wind.gust * 0.16;
  for (const layer of clouds.layers) {
    for (const sprite of layer.sprites) {
      const drift = time * sprite.userData.speed * (1 + windDrift);
      const angle = sprite.userData.angle + drift;
      const bob = Math.sin(time * 0.12 + sprite.userData.phase) * 1.2;
      sprite.position.set(
        Math.cos(angle) * sprite.userData.radius,
        sprite.userData.altitude + bob,
        Math.sin(angle) * sprite.userData.radius
      );
      sprite.material.opacity = clamp(sprite.userData.baseOpacity * cloudVisibility * (0.88 + Math.sin(time * 0.08 + sprite.userData.phase) * 0.08), 0, 0.54);
      sprite.material.color.copy(cloudLight);
      sprite.rotation.z += 0.0004 * (0.5 + windDrift);
    }
  }

  const birdVisibility = clamp(dayFactor * (1 - env.lighting.fogDensity * 0.85) * (1 - env.wind.gust * 0.55), 0, 1);
  for (const bird of birds.birds) {
    const angle = bird.userData.phase + time * bird.userData.speed;
    const flap = Math.sin(time * 5.5 + bird.userData.phase) * 0.18;
    bird.position.set(
      Math.cos(angle) * bird.userData.radius,
      bird.userData.altitude + Math.sin(time * 0.5 + bird.userData.phase) * 2.0,
      Math.sin(angle) * bird.userData.radius
    );
    bird.rotation.set(0, -angle + Math.PI * 0.5, flap);
    bird.scale.set(bird.userData.scale * (1 + flap * 0.08), bird.userData.scale * (1 - flap * 0.28), bird.userData.scale);
    bird.material.opacity = bird.userData.baseOpacity * birdVisibility;
  }
  birds.group.visible = birdVisibility > 0.02;

  window.__toyboxSkyLife = {
    starLayerCount: stars.layers.length,
    starVisibility,
    cloudLayerCount: clouds.layers.length,
    cloudSpriteCount: clouds.layers.reduce((total, layer) => total + layer.sprites.length, 0),
    cloudVisibility,
    birdCount: birds.birds.length,
    birdVisibility
  };
}

function updateSkyTint(sky, { usingSun, dayFactor, nightFactor, warmFactor, duskFactor, dawnFactor }) {
  const tintUniforms = sky.userData.tintUniforms;
  if (!tintUniforms) return;

  if (usingSun) {
    const horizon = new THREE.Color(0x65c8ff);
    horizon.lerp(new THREE.Color(duskFactor > dawnFactor ? 0xffa16c : 0xffc17a), warmFactor * 0.32);
    horizon.lerp(new THREE.Color(0xaadfff), dayFactor * 0.12);
    const zenith = new THREE.Color(0x1f74d6).lerp(new THREE.Color(0x57bbff), dayFactor * 0.64);
    zenith.lerp(new THREE.Color(0x3154a8), warmFactor * 0.12);
    tintUniforms.skyHorizonTint.value.copy(horizon);
    tintUniforms.skyZenithTint.value.copy(zenith);
    tintUniforms.skyTintStrength.value = 0.86 + warmFactor * 0.08;
  } else {
    tintUniforms.skyHorizonTint.value.set(0x0d1b34);
    tintUniforms.skyZenithTint.value.set(0x061027);
    tintUniforms.skyTintStrength.value = 0.58 + nightFactor * 0.14;
  }
}

function activeCelestialLightAnchor(celestialBodies, celestial, env) {
  const source = celestial.dominantSource === "moon" ? "moon" : "sun";
  const object = source === "sun" ? celestialBodies.sun : celestialBodies.moon;
  const position = object.getWorldPosition(new THREE.Vector3());
  const direction = position.lengthSq() > 0.000001 ? position.clone().normalize() : new THREE.Vector3(0, 1, 0);
  const color = colorFromArray(source === "sun" ? env.lighting.sunColor : env.lighting.moonColor);
  return { source, object, position, direction, color };
}

function syncCelestialBodies(celestialBodies, celestial, time) {
  const sunOpacity =
    celestial.dominantSource === "sun"
      ? celestialOpacity(celestial.sunPosition, celestial.sunIntensity, 0.24)
      : 0;
  const moonOpacity =
    celestial.dominantSource === "moon"
      ? celestialOpacity(celestial.moonPosition, celestial.moonIntensity, 0.38)
      : 0;

  celestialBodies.sun.position.copy(celestial.sunPosition);
  celestialBodies.sunHalo.position.copy(celestial.sunPosition);
  celestialBodies.moon.position.copy(celestial.moonPosition);
  celestialBodies.moonHalo.position.copy(celestial.moonPosition);

  const sunPulse = 1 + Math.sin(time * 0.42) * 0.015;
  celestialBodies.sun.scale.setScalar(sunPulse);
  celestialBodies.sun.material.opacity = sunOpacity;
  celestialBodies.sunHalo.material.opacity = sunOpacity * 0.32;
  celestialBodies.moon.material.opacity = moonOpacity;
  celestialBodies.moonHalo.material.opacity = moonOpacity * 0.18;
}

function celestialOpacity(position, intensity, floor) {
  const visibleIntensity = clamp(intensity || 0, 0, 1.4);
  if (visibleIntensity <= 0.001) return 0;
  const horizonFade = smoothstep(CELESTIAL_HORIZON_Y - 8.0, CELESTIAL_HORIZON_Y + 8.0, position.y);
  return clamp(horizonFade * (floor + visibleIntensity * 0.86), 0, 1);
}

function syncShoreline(shoreline, env, time) {
  const windLift = clamp(env.windStrength * 0.32, 0, 0.18);
  for (const child of shoreline.children) {
    if (!child.material || child.userData.staticFoam) continue;
    const phase = child.userData.phase || 0;
    const speed = child.userData.speed || 0.7;
    const pulse = Math.sin(time * speed + phase) * 0.5 + 0.5;
    const scalePulse = child.userData.scalePulse || 0.004;
    const scale = 1 + (pulse - 0.44) * scalePulse * (1.0 + windLift);
    child.scale.set(scale, 1, scale);
    child.position.y = Math.sin(time * speed * 1.7 + phase) * 0.004;
    child.material.opacity = (child.userData.baseOpacity || 0.16) * (0.72 + pulse * 0.44 + windLift);
  }
}

function syncBubbleBoundary(boundary, env, time) {
  if (!boundary || !boundary.group) return;
  const dayFactor = clamp(env.dayFactor || 0, 0, 1);
  const nightFactor = clamp(env.nightFactor || 0, 0, 1);
  const stormEnergy = clamp(env.wind.gust * 0.20 + env.world.emotionalField * 0.16, 0, 0.24);
  const pulse = 0.5 + Math.sin(time * 0.82) * 0.5;
  const slowPulse = 0.5 + Math.sin(time * 0.28 + 1.4) * 0.5;

  if (boundary.dome.material.uniforms && boundary.dome.material.uniforms.time) {
    boundary.dome.material.uniforms.time.value = time;
  }

  // The ring makes the glass boundary feel seated in the ocean instead of pasted over the scene.
  boundary.ringCore.material.opacity = clamp(0.42 + pulse * 0.20 + stormEnergy, 0.30, 0.76);
  boundary.ringHalo.material.opacity = clamp(0.10 + slowPulse * 0.10 + stormEnergy * 0.8, 0.08, 0.36);
  boundary.ringCore.scale.setScalar(1 + Math.sin(time * 1.15) * 0.0026);
  boundary.ringHalo.scale.setScalar(1 + Math.sin(time * 0.72 + 0.8) * 0.0045);
  for (const band of boundary.shimmerBands) {
    const bandPulse = 0.5 + Math.sin(time * band.userData.speed + band.userData.phase) * 0.5;
    band.material.opacity = band.userData.baseOpacity * (0.62 + bandPulse * 0.72 + stormEnergy);
    band.rotation.z = Math.sin(time * 0.10 + band.userData.phase) * 0.020;
  }
  boundary.glints.rotation.y = time * 0.018;
  boundary.glints.rotation.x = Math.sin(time * 0.11) * 0.018;
  boundary.glints.material.opacity = clamp(0.28 + dayFactor * 0.20 + nightFactor * 0.12 + pulse * 0.16, 0.18, 0.72);
}

function syncArrivalSupplies(arrivalSupplies, worldState, presentationState, time) {
  const descriptor = arrivalSuppliesDescriptorFromPresentation(presentationState);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  const state = worldState && worldState.arrivalSupplies ? worldState.arrivalSupplies : {};
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const carriedItem = typeof boy.carriedItem === "string" ? boy.carriedItem : "";
  const carriedByBB = Boolean(subProps.carryBundle && subProps.carryBundle.visible);
  const groundVisibleIds = ["washedBundle", "scatteredSticks", "scatteredLeaves", "materialPile"].filter((id) => {
    return Boolean(subProps[id] && subProps[id].visible);
  });

  if (!arrivalSupplies || !arrivalSupplies.group) return;
  arrivalSupplies.group.visible = Boolean(descriptor && descriptor.visible !== false && (groundVisibleIds.length > 0 || carriedByBB));

  const anchor = arrivalSupplies.anchor || ARRIVAL_SUPPLIES_ANCHOR;
  const groundY = groundHeightAt(anchor.x, anchor.z);
  arrivalSupplies.groundGroup.visible = groundVisibleIds.length > 0;
  arrivalSupplies.groundGroup.position.set(anchor.x, groundY, anchor.z);
  arrivalSupplies.groundGroup.rotation.y = Number(anchor.yaw || 0);

  syncArrivalGroundSubProp(arrivalSupplies.subProps.washedBundle, subProps.washedBundle, time);
  syncArrivalGroundSubProp(arrivalSupplies.subProps.scatteredSticks, subProps.scatteredSticks, time);
  syncArrivalGroundSubProp(arrivalSupplies.subProps.scatteredLeaves, subProps.scatteredLeaves, time);
  syncArrivalGroundSubProp(arrivalSupplies.subProps.materialPile, subProps.materialPile, time);
  syncArrivalCarryBundle(arrivalSupplies.subProps.carryBundle, subProps.carryBundle, worldState, carriedByBB, time);

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  window.__toyboxArrivalSupplies = {
    id: ARRIVAL_SUPPLIES_ID,
    visible: arrivalSupplies.group.visible,
    stage: descriptor ? descriptor.stage || "" : state.stage || "",
    variant: descriptor ? descriptor.variant || "" : state.variant || "",
    washedBundle: Boolean(subProps.washedBundle && subProps.washedBundle.visible),
    scatteredSticks: Boolean(subProps.scatteredSticks && subProps.scatteredSticks.visible),
    scatteredLeaves: Boolean(subProps.scatteredLeaves && subProps.scatteredLeaves.visible),
    materialPile: Boolean(subProps.materialPile && subProps.materialPile.visible),
    carryBundle: carriedByBB,
    bbCarriedItem: carriedItem,
    assetSourceId: source.id || "",
    assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    transformId: transform ? transform.id || "" : "",
    transformNormalized: Boolean(transform),
    worldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    duplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    fallbackReason: descriptor && descriptor.debug ? descriptor.debug.fallbackReason || "" : "descriptor missing",
    anchor: [anchor.x, groundY, anchor.z]
  };
}

function syncArrivalGroundSubProp(object, descriptor, time) {
  if (!object) return;
  const visible = Boolean(descriptor && descriptor.visible);
  object.visible = visible;
  if (!visible) return;
  applyArrivalNormalizedTransform(object, descriptor.transform);
  if (object.userData.subPropId === "washedBundle") {
    object.rotation.z += Math.sin(time * 1.35) * 0.006;
  }
}

function syncArrivalCarryBundle(object, descriptor, worldState, visible, time) {
  if (!object) return;
  object.visible = Boolean(visible && descriptor);
  if (!object.visible) return;
  applyArrivalNormalizedTransform(object, descriptor.transform);
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const position = boy.position || {};
  const x = Number.isFinite(position.x) ? position.x : 0;
  const z = Number.isFinite(position.z) ? position.z : 0;
  const facing = Number.isFinite(boy.facing) ? boy.facing : 0;
  const forwardOffset = 0.34;
  object.position.set(
    x - Math.sin(facing) * forwardOffset,
    groundHeightAt(x, z) + 0.78 + Math.sin(time * 4.4) * 0.006,
    z - Math.cos(facing) * forwardOffset
  );
  object.rotation.y = facing + Math.PI * 0.5;
}

function applyArrivalNormalizedTransform(object, transform) {
  const basePosition = object.userData.basePosition || object.position;
  const baseRotation = object.userData.baseRotation || object.rotation;
  const baseScale = object.userData.baseScale || object.scale;
  const scale = transform && Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  const rotation = transform && Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  object.position.set(
    basePosition.x,
    basePosition.y + (Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : 0),
    basePosition.z
  );
  object.rotation.set(
    baseRotation.x + (Number(rotation[0]) || 0),
    baseRotation.y + (Number(rotation[1]) || 0),
    baseRotation.z + (Number(rotation[2]) || 0)
  );
  object.scale.set(
    baseScale.x * (Number(scale[0]) || 1),
    baseScale.y * (Number(scale[1]) || 1),
    baseScale.z * (Number(scale[2]) || 1)
  );
}

function arrivalSuppliesDescriptorFromPresentation(presentationState) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === ARRIVAL_SUPPLIES_ID) || null;
}

function syncBuilderObjects(builderObjects, worldState, presentationState, time) {
  const objects = worldState.objects || {};
  const buildablesState = worldState.buildables || {};
  const workbenchState = objects[WORKBENCH_ID];
  const buildSiteState = objects[BUILD_SITE_ID];
  const simBoy = worldState.bubbleBoy || {};
  const inventoryWood = Number((simBoy.inventory && simBoy.inventory.wood) || 0);
  const workbenchWood = Number((workbenchState && workbenchState.wood) || inventoryWood);

  syncBuilderObjectPosition(builderObjects.workbench.group, workbenchState);
  const activeBuildableId = simBoy.builder && simBoy.builder.active ? simBoy.builder.project : "";
  const shelterProgress = clamp(Number((buildSiteState && buildSiteState.progress) || 0), 0, 1);
  const buildComplete = shelterProgress >= 0.999;
  const storedWood = Number((buildSiteState && buildSiteState.storedWood) || 0);
  const requiredWood = Math.max(0.001, Number((buildSiteState && buildSiteState.requiredWood) || 1));
  const displayedWorkbenchWood = Math.max(inventoryWood, workbenchWood);
  const visibleWorkbenchPlanks = Math.min(
    builderObjects.workbench.plankStack.children.length,
    Math.ceil(displayedWorkbenchWood)
  );
  builderObjects.workbench.plankStack.children.forEach((plank, index) => {
    plank.visible = displayedWorkbenchWood > 0.05 && index < visibleWorkbenchPlanks;
  });

  const buildableTrace = [];
  for (const buildableId of BUILDABLE_SEQUENCE) {
    const prop = builderObjects.buildables.get(buildableId);
    const buildableState = buildablesState[buildableId] || objects[buildableObjectId(buildableId)];
    if (!prop) continue;
    const summary = syncBuildableObject(prop, buildableState, {
      active: activeBuildableId === buildableId,
      displayedWorkbenchWood,
      time
    });
    buildableTrace.push(summary);
  }
  const restShelterTrace = syncRestShelterPresentationObject(
    builderObjects.restShelter,
    worldState,
    presentationState,
    time
  );
  const storageWorkbenchToolsTrace = syncStorageWorkbenchToolsObject(
    builderObjects.storageWorkbenchTools,
    worldState,
    presentationState,
    time
  );

  const treeSummaries = [];
  const treeHeights = [];
  const treeRegrowth = [];
  const forestTrace = calculateResourceForestTrace(objects);
  for (const treeId of BUILDER_TREE_IDS) {
    const tree = builderObjects.trees.get(treeId);
    const treeState = objects[treeId];
    if (!tree) continue;
    const summary = syncResourceTreeInstance(builderObjects.forest, tree, treeState, time, treeId);
    if (summary) {
      treeSummaries.push(summary);
      treeHeights.push(Number(tree.userData.visualHeight || 0).toFixed(2));
      treeRegrowth.push(`${treeId}:${Number((treeState && treeState.regrowth) || 0).toFixed(2)}`);
    }
  }
  finalizeResourceForestInstances(builderObjects.forest);

  window.__toyboxBuilderObjects = {
    workbenchPosition: workbenchState ? [workbenchState.position.x, workbenchState.position.y, workbenchState.position.z] : null,
    buildSitePosition: buildSiteState ? [buildSiteState.position.x, buildSiteState.position.y, buildSiteState.position.z] : null,
    buildProgress: shelterProgress,
    buildComplete,
    storedWood,
    requiredWood,
    inventoryWood,
    workbenchWood,
    activeBuildableId,
    buildables: buildableTrace,
    restShelter: restShelterTrace,
    storageWorkbenchTools: storageWorkbenchToolsTrace,
    treeCount: BUILDER_TREE_IDS.length,
    treeHeights,
    treeWood: treeSummaries,
    treeRegrowth,
    forestCoverage: forestTrace.coverage,
    forestAngleSpan: forestTrace.angleSpan,
    forestRadialSpan: forestTrace.radialSpan,
    renderedObjectCount:
      1 +
      buildableTrace.filter((buildable) => buildable.visible).length +
      (restShelterTrace.visible ? 1 : 0) +
      Number(storageWorkbenchToolsTrace.renderedObjectCount || 0) +
      BUILDER_TREE_IDS.length
  };
}

function syncBuildableObject(prop, buildableState, context) {
  const buildableId = prop.group.userData.buildableId;
  const progress = clamp(Number((buildableState && buildableState.progress) || 0), 0, 1);
  const complete = progress >= 0.999;
  const started = progress > 0.001 || complete;
  const visible = Boolean(context.active || started || complete);
  if (!buildableState || !buildableState.position) {
    prop.group.visible = false;
    return {
      id: buildableId,
      visible: false,
      progress: 0,
      completedStageCount: 0,
      complete: false
    };
  }

  syncBuilderObjectPosition(prop.group, buildableState);
  prop.group.visible = visible;
  const stageGroups = prop.stageGroups || prop.progressParts || [];
  let visibleStages = 0;
  for (const stage of stageGroups) {
    const threshold = Number(stage.userData.progressThreshold || 0);
    stage.visible = progress + 0.001 >= threshold;
    if (stage.visible) {
      visibleStages += 1;
      const pulse = 1 + Math.sin(context.time * 2.4 + threshold * 8.0) * 0.006 * (1 - progress);
      stage.scale.setScalar(pulse);
    }
  }

  const storedWood = Number((buildableState && buildableState.storedWood) || 0);
  const requiredWood = Math.max(0.001, Number((buildableState && buildableState.requiredWood) || 1));
  const stagedWood = clamp(Math.max(context.active ? context.displayedWorkbenchWood : 0, storedWood) / requiredWood, 0, 1);
  if (prop.storedStack) {
    prop.storedStack.children.forEach((plank, index, planks) => {
      plank.visible = visible && progress < 0.98 && index / Math.max(1, planks.length - 1) <= stagedWood + 0.04;
    });
  }

  return {
    id: buildableId,
    label: buildableState.label || (BUILDABLE_REGISTRY[buildableId] && BUILDABLE_REGISTRY[buildableId].label) || buildableId,
    visible,
    active: Boolean(context.active),
    progress,
    complete,
    status: buildableState.status || (complete ? "complete" : started ? "building" : "planned"),
    completedStageCount: Number(buildableState.completedStageCount || visibleStages),
    stageCount: Array.isArray(buildableState.stages) ? buildableState.stages.length : stageGroups.length,
    storedWood,
    requiredWood,
    position: [buildableState.position.x, buildableState.position.y, buildableState.position.z]
  };
}

function syncRestShelterPresentationObject(prop, worldState, presentationState, time) {
  const descriptor = restShelterDescriptorFromPresentation(presentationState);
  const restState = worldState && worldState.restShelter ? worldState.restShelter : {};
  const stage = descriptor && descriptor.stage ? descriptor.stage : restState.stage || "hammock";
  const requestedVariant = descriptor && descriptor.variant ? descriptor.variant : restState.variant || "restSling";
  const visible = Boolean(descriptor && descriptor.visible !== false && stage !== "none");
  if (!prop || !prop.group) {
    return {
      id: REST_SHELTER_ID,
      visible: false,
      stage,
      variant: requestedVariant,
      renderedVariant: "none",
      fallbackReason: "rest shelter prop missing"
    };
  }

  if (!visible) {
    prop.group.visible = false;
    for (const variant of Object.values(prop.variants || {})) variant.visible = false;
    return {
      id: REST_SHELTER_ID,
      visible: false,
      stage,
      variant: requestedVariant,
      renderedVariant: "none",
      active: false,
      usable: false,
      fallbackReason: "descriptor hidden"
    };
  }

  const buildables = worldState && worldState.buildables ? worldState.buildables : {};
  const objects = worldState && worldState.objects ? worldState.objects : {};
  const anchorState =
    buildables[BUILDABLE_IDS.bed] ||
    objects[BED_BUILD_SITE_ID] ||
    buildables[BUILDABLE_IDS.shelter] ||
    objects[BUILD_SITE_ID];
  syncBuilderObjectPosition(prop.group, anchorState);
  const normalizedTransform = descriptor && descriptor.transform ? descriptor.transform : null;
  const rotation = normalizedTransform && Array.isArray(normalizedTransform.rotation)
    ? normalizedTransform.rotation
    : [0, 0, 0];
  const scale = normalizedTransform && Array.isArray(normalizedTransform.scale)
    ? normalizedTransform.scale
    : [1, 1, 1];
  const anchorYaw = anchorState && Number.isFinite(anchorState.yaw) ? anchorState.yaw : 0;
  prop.group.rotation.set(
    Number(rotation[0]) || 0,
    anchorYaw + (Number(rotation[1]) || 0),
    Number(rotation[2]) || 0
  );
  prop.group.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
  prop.group.position.y += Number.isFinite(normalizedTransform && normalizedTransform.groundOffset)
    ? normalizedTransform.groundOffset
    : 0;

  const variants = prop.variants || {};
  const variantObject = variants[requestedVariant] || variants.restSling;
  const renderedVariant = variantObject && variantObject.userData ? variantObject.userData.variant : "restSling";
  for (const [variant, object] of Object.entries(variants)) {
    object.visible = object === variantObject;
    if (object.visible) {
      object.scale.setScalar(1 + Math.sin(time * 1.4) * 0.004);
    } else {
      object.scale.setScalar(1);
    }
  }
  for (const part of prop.swayParts || []) {
    if (!Number.isFinite(part.userData.restRotationZ)) part.userData.restRotationZ = part.rotation.z;
    part.rotation.z = part.userData.restRotationZ + Math.sin(time * 1.8 + part.id * 0.07) * 0.004;
  }

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const position = anchorState && anchorState.position
    ? [anchorState.position.x, anchorState.position.y, anchorState.position.z]
    : prop.group.position.toArray();
  return {
    id: REST_SHELTER_ID,
    visible: true,
    stage,
    variant: requestedVariant,
    renderedVariant,
    active: Boolean(descriptor && descriptor.active),
    usable: Boolean(descriptor && descriptor.usable),
    sourceType: source.sourceType || "procedural",
    assetSourceId: source.id || "",
    assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    transformId: normalizedTransform ? normalizedTransform.id || "" : "",
    transformNormalized: Boolean(normalizedTransform),
    worldStateHook: descriptor && descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    duplicateSystemClassification: descriptor && descriptor.debug
      ? descriptor.debug.duplicateSystemClassification || ""
      : "",
    fallbackReason: variantObject ? "" : "unknown rest shelter variant; using restSling",
    position
  };
}

function restShelterDescriptorFromPresentation(presentationState) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === REST_SHELTER_ID) || null;
}

function syncStorageWorkbenchToolsObject(prop, worldState, presentationState, time) {
  const descriptor = storageWorkbenchToolsDescriptorFromPresentation(presentationState);
  const subProps = descriptor && descriptor.subProps ? descriptor.subProps : {};
  const objects = worldState && worldState.objects ? worldState.objects : {};
  const buildables = worldState && worldState.buildables ? worldState.buildables : {};
  const workbenchState = buildables[WORKBENCH_ID] || objects[WORKBENCH_ID] || {};
  const campStorageState = worldState && worldState.campStorage ? worldState.campStorage : {};
  const toolRackState = worldState && worldState.toolRack ? worldState.toolRack : {};
  const action = presentationState && presentationState.selectedAction ? presentationState.selectedAction : "";
  const visible = Boolean(prop && prop.group && descriptor && descriptor.visible !== false);

  if (!prop || !prop.group || !visible || !workbenchState.position) {
    if (prop && prop.group) prop.group.visible = false;
    return {
      id: STORAGE_WORKBENCH_TOOLS_ID,
      visible: false,
      stage: descriptor ? descriptor.stage || "" : "",
      variant: descriptor ? descriptor.variant || "" : "",
      fallbackReason: !descriptor ? "descriptor missing" : "workbench anchor missing"
    };
  }

  prop.group.visible = true;
  const campStorageDescriptor = subProps.campStorage || {};
  const workbenchDescriptor = subProps.upgradedWorkbench || {};
  const rackDescriptor = subProps.toolRack || {};
  const firstToolDescriptor = subProps.firstTool || {};
  const workbenchYaw = Number(workbenchState.yaw) || 0;
  const woodCount = Number(campStorageDescriptor.woodCount || campStorageState.woodCount || campStorageState.storedWood || 0);

  prop.campStorage.group.visible = Boolean(campStorageDescriptor.visible);
  placeStorageWorkbenchSubProp(prop.campStorage.group, workbenchState, { x: -0.92, z: 0.68 }, campStorageDescriptor.transform);
  syncCampStorageWoodPile(prop.campStorage, woodCount);

  prop.workbenchUpgrade.group.visible = Boolean(workbenchDescriptor.visible);
  placeStorageWorkbenchSubProp(prop.workbenchUpgrade.group, workbenchState, { x: 0, z: 0 }, workbenchDescriptor.transform);
  if (prop.workbenchUpgrade.glow) {
    const crafting = action === "craftAtWorkbench";
    prop.workbenchUpgrade.glow.visible = crafting;
    prop.workbenchUpgrade.glow.material.opacity = crafting ? 0.24 + Math.sin(time * 5.2) * 0.06 : 0;
    prop.workbenchUpgrade.glow.scale.setScalar(1 + Math.sin(time * 4.8) * 0.035);
  }
  if (prop.workbenchUpgrade.previewTool) {
    prop.workbenchUpgrade.previewTool.rotation.y = 0.66 + Math.sin(time * 3.8) * 0.025;
  }

  prop.toolRack.group.visible = Boolean(rackDescriptor.visible);
  placeStorageWorkbenchSubProp(prop.toolRack.group, workbenchState, { x: 0.90, z: 0.62 }, rackDescriptor.transform);
  prop.toolRack.rackTool.visible = Boolean(firstToolDescriptor.rackVisible);
  if (prop.toolRack.rackTool.visible) {
    prop.toolRack.rackTool.rotation.z = -0.64 + Math.sin(time * 1.9) * 0.012;
  }

  const attachment = presentationState && presentationState.attachment ? presentationState.attachment : null;
  const heldToolVisible = Boolean(attachment && (attachment.id === "firstTool" || attachment.id === "buildTool"));
  const heldPlankVisible = Boolean(attachment && attachment.id === "buildPlank");
  const heldRopeVisible = Boolean(attachment && attachment.id === "buildRopeVines");
  const heldStorageMaterialVisible = Boolean(attachment && attachment.id === "storageMaterial");
  syncFirstToolAttachment(prop.heldTool, attachment, worldState, heldToolVisible, time);
  syncBuildHandAttachment(prop.heldPlank, attachment, worldState, heldPlankVisible, time, {
    y: 0.62,
    right: 0,
    forward: 0.36,
    yawOffset: Math.PI * 0.5,
    bob: 0.006
  });
  syncBuildHandAttachment(prop.heldRope, attachment, worldState, heldRopeVisible, time, {
    y: 0.58,
    right: 0.04,
    forward: 0.32,
    yawOffset: Math.PI * 0.5,
    bob: 0.018
  });
  syncBuildHandAttachment(prop.heldStorageMaterial, attachment, worldState, heldStorageMaterialVisible, time, {
    y: 0.57,
    right: 0.02,
    forward: 0.30,
    yawOffset: Math.PI * 0.5,
    bob: 0.012
  });

  const source = descriptor && descriptor.source ? descriptor.source : {};
  const transform = descriptor && descriptor.transform ? descriptor.transform : null;
  const slotCount = Array.isArray(toolRackState.slots) ? toolRackState.slots.length : Number(rackDescriptor.slotCount || 0);
  const renderedObjectCount = [
    prop.campStorage.group.visible,
    prop.workbenchUpgrade.group.visible,
    prop.toolRack.group.visible,
    prop.toolRack.rackTool.visible,
    heldToolVisible,
    heldPlankVisible,
    heldRopeVisible,
    heldStorageMaterialVisible
  ].filter(Boolean).length;

  return {
    id: STORAGE_WORKBENCH_TOOLS_ID,
    visible: true,
    active: Boolean(descriptor.active),
    usable: Boolean(descriptor.usable),
    stage: descriptor.stage || "",
    variant: descriptor.variant || "",
    campStorageVisible: prop.campStorage.group.visible,
    campStorageStage: campStorageDescriptor.stage || campStorageState.stage || "",
    campStorageWoodCount: woodCount,
    workbenchUpgradedVisible: prop.workbenchUpgrade.group.visible,
    workbenchStage: workbenchDescriptor.stage || workbenchState.stage || "",
    workbenchVariant: workbenchDescriptor.variant || workbenchState.variant || "",
    toolRackVisible: prop.toolRack.group.visible,
    toolRackStage: rackDescriptor.stage || toolRackState.stage || "",
    toolRackSlotCount: slotCount,
    stoneToolVisible: Boolean(prop.toolRack.rackTool.visible || heldToolVisible),
    heldToolVisible,
    heldPlankVisible,
    heldRopeVisible,
    heldStorageMaterialVisible,
    sourceType: source.sourceType || "procedural",
    assetSourceId: source.id || "",
    assetApprovalStatus: source.approvalStatus || (source.approvedForUse ? "approved" : "unapproved"),
    transformId: transform ? transform.id || "" : "",
    transformNormalized: Boolean(transform),
    worldStateHook: descriptor.stateHook ? descriptor.stateHook.state || "" : "",
    duplicateSystemClassification: descriptor.debug ? descriptor.debug.duplicateSystemClassification || "" : "",
    fallbackReason: descriptor.debug ? descriptor.debug.fallbackReason || "" : "",
    renderedObjectCount,
    workbenchYaw
  };
}

function placeStorageWorkbenchSubProp(group, workbenchState, offset, transform) {
  if (!group || !workbenchState || !workbenchState.position) return;
  const yaw = Number(workbenchState.yaw) || 0;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const localX = Number(offset.x) || 0;
  const localZ = Number(offset.z) || 0;
  const x = Number(workbenchState.position.x || 0) + localX * cos - localZ * sin;
  const z = Number(workbenchState.position.z || 0) + localX * sin + localZ * cos;
  const rotation = transform && Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  const scale = transform && Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  group.position.set(
    x,
    groundHeightAt(x, z) + (Number.isFinite(transform && transform.groundOffset) ? transform.groundOffset : 0),
    z
  );
  group.rotation.set(
    Number(rotation[0]) || 0,
    yaw + (Number(rotation[1]) || 0),
    Number(rotation[2]) || 0
  );
  group.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
}

function syncCampStorageWoodPile(campStorage, woodCount) {
  if (!campStorage || !campStorage.woodPile) return;
  const visibleCount = Math.min(campStorage.woodPile.children.length, Math.ceil(Math.max(0, woodCount)));
  campStorage.woodPile.children.forEach((log, index) => {
    log.visible = visibleCount > 0 && index < visibleCount;
  });
}

function syncFirstToolAttachment(object, attachment, worldState, visible, time) {
  syncBuildHandAttachment(object, attachment, worldState, visible, time, {
    y: 0.74,
    right: 0.24,
    forward: 0.30,
    yawOffset: Math.PI * 0.5,
    bob: 0.010,
    twist: 0.10
  });
}

function syncBuildHandAttachment(object, attachment, worldState, visible, time, options = {}) {
  if (!object) return;
  object.visible = Boolean(visible && attachment);
  if (!object.visible) return;
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const position = boy.position || {};
  const x = Number.isFinite(position.x) ? position.x : 0;
  const z = Number.isFinite(position.z) ? position.z : 0;
  const facing = Number.isFinite(boy.facing) ? boy.facing : 0;
  const rightOffset = Number.isFinite(options.right) ? options.right : 0.24;
  const forwardOffset = Number.isFinite(options.forward) ? options.forward : 0.30;
  const yOffset = Number.isFinite(options.y) ? options.y : 0.72;
  const bob = Number.isFinite(options.bob) ? options.bob : 0.010;
  object.position.set(
    x + Math.cos(facing) * rightOffset - Math.sin(facing) * forwardOffset,
    groundHeightAt(x, z) + yOffset + Math.sin(time * 3.6) * bob,
    z - Math.sin(facing) * rightOffset - Math.cos(facing) * forwardOffset
  );
  const transform = attachment.transform || {};
  const rotation = Array.isArray(transform.rotation) ? transform.rotation : [0, 0, 0];
  const scale = Array.isArray(transform.scale) ? transform.scale : [1, 1, 1];
  object.rotation.set(
    Number(rotation[0]) || 0,
    facing +
      (Number.isFinite(options.yawOffset) ? options.yawOffset : Math.PI * 0.5) +
      (Number(rotation[1]) || 0) +
      Math.sin(time * 2.8) * (Number.isFinite(options.twist) ? options.twist : 0.035),
    Number(rotation[2]) || 0
  );
  object.scale.set(Number(scale[0]) || 1, Number(scale[1]) || 1, Number(scale[2]) || 1);
}

function storageWorkbenchToolsDescriptorFromPresentation(presentationState) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === STORAGE_WORKBENCH_TOOLS_ID) || null;
}

function syncResourceTreeInstance(forest, tree, treeState, time, treeId) {
  if (!treeState || !treeState.position) {
    writeHiddenTreeInstance(forest, tree.index);
    return null;
  }
  const height = Math.max(2, Number(treeState.height) || 4.8);
  const trunkRadius = clamp(Number(treeState.trunkRadius) || 0.35, 0.18, 1.2);
  const canopyRadius = clamp(Number(treeState.canopyRadius) || 1.6, 0.8, 3.6);
  const maxWood = Math.max(0.001, Number(treeState.maxWood) || 1);
  const woodFactor = clamp(Number(treeState.wood || 0) / maxWood, 0, 1);
  const trunkHeight = Math.max(1.2, height * 0.58);
  const canopyFullness = 0.82 + woodFactor * 0.18;
  const crownFullness = 0.64 + woodFactor * 0.28;
  const sway = Math.sin(time * 0.58 + tree.index * 0.37) * 0.018;
  const x = Number(treeState.position.x) || 0;
  const z = Number(treeState.position.z) || 0;
  const y = groundHeightAt(x, z);
  const yaw = tree.yaw + sway * 0.35;
  const index = tree.index;
  const lowerCanopyVisible = woodFactor > 0.05;
  const upperCanopyVisible = woodFactor > 0.14;
  const crownVisible = woodFactor > 0.22;
  const bandVisible = woodFactor < 0.96;
  const lowerScale = lowerCanopyVisible ? 1 : 0.001;
  const upperScale = upperCanopyVisible ? 1 : 0.001;
  const crownScale = crownVisible ? 1 : 0.001;
  const bandScale = bandVisible ? 1 : 0.001;

  setForestInstanceTransform(
    forest,
    forest.trunks,
    index,
    x,
    y + trunkHeight * 0.5,
    z,
    0,
    yaw,
    sway,
    trunkRadius,
    trunkHeight,
    trunkRadius
  );
  setForestInstanceTransform(
    forest,
    forest.lowerCanopies,
    index,
    x + Math.cos(yaw + Math.PI * 0.35) * canopyRadius * 0.10,
    y + trunkHeight + canopyRadius * 0.52,
    z + Math.sin(yaw + Math.PI * 0.35) * canopyRadius * 0.10,
    sway * 0.2,
    yaw,
    -sway * 0.3,
    canopyRadius * 1.22 * canopyFullness * lowerScale,
    canopyRadius * 0.82 * canopyFullness * lowerScale,
    canopyRadius * 1.16 * canopyFullness * lowerScale
  );
  setForestInstanceTransform(
    forest,
    forest.upperCanopies,
    index,
    x + Math.cos(yaw - Math.PI * 0.42) * canopyRadius * 0.18,
    y + trunkHeight + canopyRadius * 0.95,
    z + Math.sin(yaw - Math.PI * 0.42) * canopyRadius * 0.18,
    -sway * 0.25,
    yaw + 0.4,
    sway * 0.2,
    canopyRadius * 0.92 * canopyFullness * upperScale,
    canopyRadius * 0.70 * canopyFullness * upperScale,
    canopyRadius * 0.88 * canopyFullness * upperScale
  );
  setForestInstanceTransform(
    forest,
    forest.crowns,
    index,
    x + Math.cos(yaw + 2.18) * canopyRadius * 0.36,
    y + trunkHeight + canopyRadius * 1.10,
    z + Math.sin(yaw + 2.18) * canopyRadius * 0.36,
    sway * 0.15,
    yaw - 0.2,
    -sway * 0.2,
    canopyRadius * 0.62 * crownFullness * crownScale,
    canopyRadius * 0.52 * crownFullness * crownScale,
    canopyRadius * 0.58 * crownFullness * crownScale
  );
  setForestInstanceTransform(
    forest,
    forest.cutBands,
    index,
    x,
    y + trunkHeight * 0.34,
    z,
    Math.PI / 2,
    yaw,
    0,
    trunkRadius * 1.12 * bandScale,
    trunkRadius * 1.12 * bandScale,
    trunkRadius * 1.12 * bandScale
  );

  forest.trunks.material.emissiveIntensity = 0.18 + woodFactor * 0.08;
  forest.lowerCanopies.material.emissiveIntensity = 0.34 + woodFactor * 0.18;
  forest.upperCanopies.material.emissiveIntensity = 0.32 + woodFactor * 0.17;
  forest.crowns.material.emissiveIntensity = 0.40 + woodFactor * 0.20;
  setForestInstanceColors(forest, tree, index, woodFactor);
  tree.userData.visualHeight = trunkHeight + canopyRadius * 1.55;

  return `${treeId}:${woodFactor.toFixed(2)}:${tree.userData.visualHeight.toFixed(2)}`;
}

function setForestInstanceTransform(forest, mesh, index, x, y, z, rotationX, rotationY, rotationZ, scaleX, scaleY, scaleZ) {
  forest.dummy.position.set(x, y, z);
  forest.dummy.rotation.set(rotationX, rotationY, rotationZ);
  forest.dummy.scale.set(scaleX, scaleY, scaleZ);
  forest.dummy.updateMatrix();
  mesh.setMatrixAt(index, forest.dummy.matrix);
}

function setForestInstanceColors(forest, tree, index, woodFactor) {
  const dryness = 1 - woodFactor;
  forest.scratchColor.setHSL(0.075, 0.42, 0.31 + tree.colorSeed * 0.08);
  forest.scratchColor.lerp(forest.scratchBarkDryColor, dryness * 0.38);
  forest.trunks.setColorAt(index, forest.scratchColor);
  forest.scratchColor.setHSL(0.32 + tree.colorSeed * 0.045, 0.40 + tree.crownSeed * 0.16, 0.26 + tree.colorSeed * 0.10);
  forest.scratchColor.lerp(forest.scratchLeafDryColor, dryness * 0.48);
  forest.lowerCanopies.setColorAt(index, forest.scratchColor);
  forest.scratchColor.offsetHSL(0.018, 0.03, 0.035);
  forest.upperCanopies.setColorAt(index, forest.scratchColor);
  forest.scratchColor.setHSL(0.27 + tree.crownSeed * 0.055, 0.46, 0.34 + tree.crownSeed * 0.12);
  forest.scratchColor.lerp(forest.scratchCrownDryColor, dryness * 0.42);
  forest.crowns.setColorAt(index, forest.scratchColor);
  forest.scratchColor.setHex(0xc0a070);
  forest.cutBands.setColorAt(index, forest.scratchColor);
}

function writeHiddenTreeInstance(forest, index) {
  for (const mesh of [forest.trunks, forest.lowerCanopies, forest.upperCanopies, forest.crowns, forest.cutBands]) {
    setForestInstanceTransform(forest, mesh, index, 0, -100, 0, 0, 0, 0, 0.001, 0.001, 0.001);
  }
}

function finalizeResourceForestInstances(forest) {
  for (const mesh of [forest.trunks, forest.lowerCanopies, forest.upperCanopies, forest.crowns, forest.cutBands]) {
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }
}

function calculateResourceForestTrace(objects) {
  const angles = [];
  const radii = [];
  for (const treeId of BUILDER_TREE_IDS) {
    const tree = objects[treeId];
    if (!tree || !tree.position) continue;
    const x = Number(tree.position.x) || 0;
    const z = Number(tree.position.z) || 0;
    angles.push(Math.atan2(z, x));
    radii.push(Math.hypot(x, z));
  }
  if (angles.length < 2 || radii.length < 2) {
    return { coverage: 0, angleSpan: 0, radialSpan: 0 };
  }
  const angleSpan = Math.max(...angles) - Math.min(...angles);
  const minRadius = Math.min(...radii);
  const maxRadius = Math.max(...radii);
  const radialSpan = maxRadius - minRadius;
  const forestSectorArea = 0.5 * angleSpan * (maxRadius * maxRadius - minRadius * minRadius);
  const islandArea = Math.PI * PLAYABLE_RADIUS * PLAYABLE_RADIUS;
  return {
    coverage: clamp(forestSectorArea / islandArea, 0, 1),
    angleSpan,
    radialSpan
  };
}

function syncBuilderObjectPosition(group, objectState) {
  if (!group || !objectState || !objectState.position) {
    if (group) group.visible = false;
    return;
  }
  const x = Number(objectState.position.x) || 0;
  const z = Number(objectState.position.z) || 0;
  group.visible = true;
  group.position.set(x, groundHeightAt(x, z), z);
  group.rotation.y = Number(objectState.yaw) || 0;
}

function syncFire(fire, lighting, env, worldState, time) {
  const firePit = worldState.objects["fire-pit"];
  const x = firePit.position.x;
  const z = firePit.position.z;
  const y = groundHeightAt(x, z);
  fire.group.position.set(x, y + 0.01, z);
  const intensity = clamp(env.lighting.fireIntensity, 0, 1.0);
  const lit = Boolean(firePit.lit && intensity > 0.01);
  const flicker = smoothCampfireFlicker(time);
  fire.flameGroup.visible = lit;
  fire.sparkGroup.visible = lit;
  fire.emberDisc.visible = lit;
  if (fire.groundGlow) fire.groundGlow.visible = lit;
  fire.flameGroup.scale.set(0.88 + intensity * 0.12, (0.82 + intensity * 0.30) * flicker, 0.88 + intensity * 0.12);
  fire.flameGroup.rotation.y = Math.sin(time * 2.2) * 0.06;
  fire.emberDisc.material.opacity = clamp(0.16 + intensity * 0.18 + Math.sin(time * 4.6) * 0.018, 0, 0.42);
  if (fire.groundGlow) {
    const glowPulse = clamp(0.94 + (flicker - 1) * 1.25 + Math.sin(time * 1.7 + 0.4) * 0.025, 0.84, 1.08);
    const glowScale = (4.35 + intensity * 1.85) * (0.99 + (flicker - 1) * 0.45);
    fire.groundGlow.scale.set(glowScale, glowScale, 1);
    fire.groundGlow.material.opacity = (0.045 + intensity * 0.090) * glowPulse;
  }
  for (let i = 0; i < fire.flameMeshes.length; i += 1) {
    const flame = fire.flameMeshes[i];
    const pulse = 1 + Math.sin(time * (3.2 + i * 1.2) + i * 0.9) * (0.022 + i * 0.005);
    flame.scale.set(1 - (pulse - 1) * 0.5, pulse, 1 - (pulse - 1) * 0.35);
    flame.material.opacity = (flame.userData.baseOpacity || 0.6) * (0.62 + intensity * 0.42);
  }

  for (const spark of fire.sparkGroup.children) {
    const data = spark.userData;
    const travel = (time * data.speed + data.phase) % 1;
    const angle = data.baseAngle + Math.sin(time * 0.8 + data.phase) * 0.45;
    const radius = data.radius * (0.65 + travel * 0.72);
    spark.position.set(Math.cos(angle) * radius, data.height * travel + 0.34, Math.sin(angle) * radius);
    spark.material.opacity = Math.pow(1 - travel, 1.8) * 0.34 * intensity;
  }

  lighting.fireLight.position.set(x, y + 0.62, z);
  lighting.fireLight.intensity *= flicker;
}

function smoothCampfireFlicker(time) {
  return clamp(
    0.985 +
      Math.sin(time * 3.4) * 0.026 +
      Math.sin(time * 5.7 + 0.65) * 0.018 +
      Math.sin(time * 1.35 + 2.1) * 0.014,
    0.91,
    1.055
  );
}

function syncBubbleBoy(bubbleBoy, humanoidController, worldState, presentationState, time, deltaSeconds, cursor) {
  const humanoidActive =
    humanoidController &&
    updateBubbleBoyHumanoid(
      deltaSeconds,
      {
        groundHeightAt
      },
      cursor,
      worldState,
      presentationState
    );
  bubbleBoy.group.visible = !humanoidActive;
  if (humanoidActive) return;

  const simBoy = worldState.bubbleBoy;
  const pose = simBoy.pose;
  const affect = simBoy.affect;
  const x = simBoy.position.x;
  const z = simBoy.position.z;
  const ground = groundHeightAt(x, z);
  const bounce = (pose.bounce || 0) * 2.5;
  bubbleBoy.group.position.set(x, ground + bounce, z);
  bubbleBoy.group.rotation.y = simBoy.facing;

  const breathSpeed = 0.85 + clamp(pose.breathEnergy || 0.42, 0, 1) * 0.45;
  bubbleBoy.breath = Math.sin(time * breathSpeed * TAU) * (0.012 + affect.comfort * 0.018);
  const bodyScale = bubbleBoy.baseScale;
  bubbleBoy.body.scale.set(
    bodyScale.x * (1 - bubbleBoy.breath * 0.16),
    bodyScale.y * (1 + bubbleBoy.breath),
    bodyScale.z * (1 - bubbleBoy.breath * 0.12)
  );
  applyBubbleBoyActionPose(bubbleBoy, simBoy, presentationState, time, deltaSeconds);

  const targetGaze = new THREE.Vector2(clamp(pose.gazeX || 0, -0.04, 0.04), clamp(pose.gazeY || 0, -0.03, 0.03));
  const gazeSmoothing = 1 - Math.exp(-deltaSeconds * 8);
  bubbleBoy.smoothGaze.lerp(targetGaze, gazeSmoothing);
  const gx = bubbleBoy.smoothGaze.x;
  const gy = bubbleBoy.smoothGaze.y;
  bubbleBoy.faceParts.leftEye.position.x = -0.165 + gx;
  bubbleBoy.faceParts.rightEye.position.x = 0.165 + gx;
  bubbleBoy.faceParts.leftEye.position.y = 0.745 + gy;
  bubbleBoy.faceParts.rightEye.position.y = 0.745 + gy;
  bubbleBoy.faceParts.leftSpark.position.x = -0.188 + gx * 1.25;
  bubbleBoy.faceParts.rightSpark.position.x = 0.142 + gx * 1.25;
  bubbleBoy.faceParts.leftSpark.position.y = 0.786 + gy * 1.15;
  bubbleBoy.faceParts.rightSpark.position.y = 0.786 + gy * 1.15;
  bubbleBoy.faceParts.mouth.scale.y = 0.72 + affect.comfort * 0.16 - affect.stimulus * 0.05;

  const animation = presentationState && presentationState.animation ? presentationState.animation : {};
  window.__bubbleBoyMotion = {
    breath: bubbleBoy.breath,
    bounce,
    humanoid: false,
    attentionEmoteState: animation.attentionEmote ? animation.attentionEmote.state || "" : "",
    attentionEmoteClip: animation.attentionEmote ? animation.attentionEmote.clip || animation.clip || "" : animation.clip || "",
    attentionEmoteName: animation.attentionEmote ? animation.attentionEmote.emote || animation.emote || "" : "",
    attentionEmoteOverlay: animation.emoteOverlay || (animation.attentionEmote ? animation.attentionEmote.overlay || "" : ""),
    attentionEmoteIntensity: animation.attentionEmote ? Number(animation.attentionEmote.intensity || 0) : 0,
    attentionEmoteRootMotion: animation.attentionEmote ? Boolean(animation.attentionEmote.rootMotion) : false,
    locomotionState: presentationState && presentationState.animation && presentationState.animation.locomotion
      ? presentationState.animation.locomotion.state || ""
      : "",
    locomotionClip: presentationState && presentationState.animation && presentationState.animation.locomotion
      ? presentationState.animation.locomotion.clip || presentationState.animation.clip || ""
      : "",
    locomotionOverlay: presentationState && presentationState.animation
      ? presentationState.animation.locomotionOverlay || ""
      : "",
    locomotionTimeScale: presentationState && presentationState.animation
      ? Number(presentationState.animation.timeScale || 1)
      : 1,
    locomotionRootMotion: presentationState && presentationState.animation && presentationState.animation.locomotion
      ? Boolean(presentationState.animation.locomotion.rootMotion)
      : false,
    locomotionTargetId: presentationState && presentationState.animation && presentationState.animation.locomotion
      ? presentationState.animation.locomotion.targetId || ""
      : "",
    locomotionTargetDistance: presentationState && presentationState.animation && presentationState.animation.locomotion
      ? presentationState.animation.locomotion.targetDistance
      : null,
    locomotionTurnAmount: presentationState && presentationState.animation && presentationState.animation.locomotion
      ? Number(presentationState.animation.locomotion.turnAmount || 0)
      : 0,
    actualSpeed: bubbleBoyVelocitySpeed(simBoy.velocity),
    measuredSpeed: bubbleBoyVelocitySpeed(simBoy.velocity),
    simSpeed: bubbleBoyVelocitySpeed(simBoy.velocity),
    actualTurnSpeed: 0,
    lean: Math.hypot(gx, gy),
    visibilityScale: 1
  };
}

function applyBubbleBoyActionPose(bubbleBoy, simBoy, presentationState, time, deltaSeconds) {
  if (!bubbleBoy || !bubbleBoy.limbs) return;
  const smoothing = 1 - Math.exp(-Math.max(0, deltaSeconds) * 10.0);
  const action = simBoy.currentAction || "";
  const builderAction = simBoy.builder && simBoy.builder.actionState ? simBoy.builder.actionState : "";
  const overlay = presentationState && presentationState.proceduralOverlay ? presentationState.proceduralOverlay : "";
  const animation = presentationState && presentationState.animation ? presentationState.animation : {};
  const locomotion = animation.locomotion || {};
  const attentionEmote = animation.attentionEmote || {};
  const attentionOverlay = animation.emoteOverlay || attentionEmote.overlay || overlay;
  const locomotionOverlay = animation.locomotionOverlay || locomotion.overlay || "";
  const locomotionState = locomotion.state || "";
  const bendPickup = action === "bendPickup" || overlay === "bendPickup";
  const pickupMaterial = action === "pickupMaterial" || overlay === "pickup";
  const depositMaterials =
    action === "depositMaterials" ||
    action === "depositMaterial" ||
    action === "setItemDown" ||
    overlay === "depositMaterials" ||
    overlay === "depositMaterial" ||
    overlay === "setItemDown";
  const carryAttachment =
    action === "carryBundle" ||
    action === "carryPlank" ||
    action === "carryLog" ||
    action === "carryRaftLog" ||
    overlay === "carryAttachment" ||
    overlay === "carryPlank" ||
    overlay === "carryLog" ||
    overlay === "carryRaftLog";
  const hammerStrike = action === "hammerStrike" || overlay === "hammerStrike";
  const tieRopeVines = action === "tieRopeVines" || overlay === "tieRopeVines";
  const placePlank = action === "placePlank" || overlay === "placePlank";
  const pushPostUpright = action === "pushPostUpright" || overlay === "pushPostUpright";
  const carveTool = action === "carveTool" || overlay === "carveTool";
  const inspectProgress = action === "inspectProgress" || overlay === "inspectProgress";
  const repairShelter = action === "repairShelter" || overlay === "repairShelter";
  const reinforceShelter = action === "reinforceShelter" || overlay === "reinforceShelter";
  const craftAtWorkbench = action === "craftAtWorkbench" || overlay === "craftAtWorkbench";
  const sortMaterials = action === "sortMaterials" || overlay === "sortMaterials";
  const depositStorage = action === "depositStorage" || overlay === "depositStorage";
  const withdrawStorage = action === "withdrawStorage" || overlay === "withdrawStorage";
  const tidyCamp = action === "tidyCamp" || overlay === "tidyCamp";
  const sitNearFire = action === "sitNearFire" || overlay === "sitNearFire";
  const restInsideShelter = action === "restInsideShelter" || overlay === "restInsideShelter";
  const inspectCampLayout = action === "inspectCampLayout" || overlay === "inspectCampLayout";
  const inspectTool = action === "inspectTool" || overlay === "inspectTool";
  const rakePath = action === "rakePath" || overlay === "pathRakeSweep";
  const clearPath = action === "clearPath" || overlay === "pathClear";
  const sweepLeaves = action === "sweepLeaves" || overlay === "pathSweep";
  const placeBoundaryStone = action === "placeBoundaryStone" || overlay === "kneelPlaceStone";
  const kneelMarkZone = action === "kneelMarkZone" || overlay === "kneelMarkZone";
  const walkInspectRoute = action === "walkInspectRoute" || overlay === "routeInspect";
  const gardenDig = action === "digGardenPlot" || overlay === "gardenDig";
  const gardenPlant =
    action === "planting" ||
    action === "plantSeed" ||
    overlay === "gardenPlant" ||
    overlay === "gardenPlantSeed";
  const gardenPatSoil = action === "patSoil" || overlay === "gardenPatSoil";
  const gardenWatering = action === "watering" || action === "waterPlot" || overlay === "gardenWatering";
  const gardenHarvest = action === "harvesting" || action === "harvestCrop" || overlay === "gardenHarvest";
  const gardenInspect = action === "inspectingGarden" || action === "inspectSprout" || overlay === "gardenInspect";
  const carryHarvest = action === "carryHarvest" || overlay === "carryHarvest";
  const storeHarvest = action === "storeHarvest" || overlay === "storeHarvest";
  const prepMeal = action === "prepMeal" || overlay === "prepMeal";
  const castFishingLine = action === "castFishingLine" || overlay === "fishCast";
  const waitFishing = action === "waitFishing" || overlay === "fishWait";
  const reelFishingLine = action === "reelFishingLine" || overlay === "fishReel";
  const catchReaction = action === "catchReaction" || overlay === "fishCatchReaction";
  const fishFromPier = action === "fishFromPier" || overlay === "pierFish";
  const setFishTrap = action === "setFishTrap" || overlay === "setFishTrap";
  const checkFishTrap = action === "checkFishTrap" || overlay === "checkFishTrap";
  const collectCatch = action === "collectCatch" || overlay === "collectCatch";
  const hangCatchDryingRack = action === "hangCatchDryingRack" || overlay === "hangCatchDryingRack";
  const carryRaftLog = action === "carryRaftLog" || overlay === "carryRaftLog";
  const lashRaft = action === "lashRaft" || overlay === "raftLash";
  const pushRaft = action === "pushRaft" || overlay === "raftPush";
  const boardRaft = action === "boardRaft" || overlay === "raftBoard";
  const sitAboardRaft = action === "sitAboardRaft" || overlay === "raftSitAboard";
  const standAboardRaft = action === "standAboardRaft" || overlay === "raftStandAboard";
  const paddleRaft = action === "paddleRaft" || overlay === "raftPaddle";
  const lookOutFromRaft = action === "lookOutFromRaft" || overlay === "raftLookOut";
  const disembarkRaft = action === "disembarkRaft" || overlay === "raftDisembark";
  const returnCelebrate = action === "returnCelebrate" || overlay === "returnCelebrate";
  const craftToy = action === "craftToy" || overlay === "toyCraft";
  const placeToy = action === "placeToy" || overlay === "toyPlace";
  const playBlocks = action === "playBlocks" || overlay === "playBlocks";
  const hopPlay = action === "hopPlay" || overlay === "hopPlay";
  const kickBall = action === "kickBall" || overlay === "kickBall";
  const tossBall = action === "tossBall" || overlay === "tossBall";
  const launchKite = action === "launchKite" || overlay === "launchKite";
  const holdKite = action === "holdKite" || overlay === "holdKite";
  const spinTop = action === "spinTop" || overlay === "spinTop";
  const putToyAway = action === "putToyAway" || overlay === "putToyAway";
  const toyGroundWork = craftToy || placeToy || playBlocks || spinTop || putToyAway;
  const toyBallPlay = kickBall || tossBall;
  const toyKitePlay = launchKite || holdKite;
  const fireKneel = action === "lightFire" || action === "kneelAtFire" || overlay === "crouchFire" || overlay === "fireKneel";
  const fireWarmHands = action === "warmHands" || overlay === "fireWarmHands" || overlay === "fireCare";
  const fireAddFuel = action === "addFuel" || overlay === "fireAddFuel";
  const fireFan = action === "fanFire" || overlay === "fireFan";
  const fireStoke = action === "stokeFire" || overlay === "fireStoke";
  const cookFishMeal = action === "cookFish" || action === "cookMeal" || overlay === "cookFish" || overlay === "cookMeal";
  const stirPot = action === "stirPot" || overlay === "stirPot";
  const holdFood = action === "holdFood" || overlay === "holdFood";
  const eatFood = action === "eatFood" || overlay === "eatFood";
  const fireCare = fireKneel || fireWarmHands || fireAddFuel || fireFan || fireStoke;
  const cookingCare = cookFishMeal || stirPot || prepMeal;
  const buildWork =
    hammerStrike ||
    tieRopeVines ||
    placePlank ||
    pushPostUpright ||
    carveTool ||
    inspectProgress ||
    repairShelter ||
    reinforceShelter ||
    craftAtWorkbench;
  const hammer = action === "building" || builderAction === "construct" || overlay === "tieBuild" || buildWork;
  const gather =
    action === "gatheringWood" ||
    builderAction === "gather" ||
    bendPickup ||
    pickupMaterial ||
    depositMaterials;
  const restSit =
    action === "sitRestSpot" ||
    action === "rest" ||
    action === "resting" ||
    sitNearFire ||
    restInsideShelter ||
    overlay === "restSit";
  const restSettle =
    action === "settleIntoHammock" ||
    action === "settleIntoBed" ||
    overlay === "settleHammock" ||
    overlay === "settleBed";
  const sleep =
    action === "sleep" ||
    action === "sleepLoop" ||
    action === "lieDown" ||
    overlay === "sleepPose" ||
    overlay === "lieDownAdditive" ||
    overlay === "sleepLoop";
  const play = action === "playToy";
  const wake = action === "wake" || overlay === "wakeRest";
  const wakeStretch = action === "wakeStretch" || overlay === "wakeStretch";
  const standUpRest = action === "standUpFromRest" || overlay === "standUpFromRest";
  const arriveLookAround = attentionOverlay === "gazeLookAround";
  const orientIsland = attentionOverlay === "orientIsland";
  const respondPlayer = attentionOverlay === "playerWave";
  const inspectObject = attentionOverlay === "inspectObject";
  const pointNotice = attentionOverlay === "pointNotice";
  const smallSurprise = attentionOverlay === "smallSurprise";
  const quietCelebrate = attentionOverlay === "quietCelebrate";
  const celebrate = action === "celebrate" || overlay === "stretch" || wakeStretch || quietCelebrate;
  const locomotionMoving =
    locomotionState === "start" ||
    locomotionState === "slowWalk" ||
    locomotionState === "normalWalk" ||
    locomotionState === "approachTarget" ||
    locomotionState === "shortJog";
  const locomotionTurn = locomotionState === "turnInPlace";
  const locomotionStop = locomotionState === "stop";
  const wave = Math.sin(time * (
    hammerStrike || carveTool || craftAtWorkbench
      ? 9.2
      : sortMaterials || tidyCamp
        ? 5.4
      : depositStorage || withdrawStorage
        ? 5.8
      : tieRopeVines || repairShelter || reinforceShelter
        ? 5.8
      : placePlank || pushPostUpright
        ? 5.2
      : inspectProgress
        ? 2.8
      : inspectCampLayout
        ? 2.8
      : sweepLeaves
        ? 5.4
      : clearPath || rakePath
        ? 5.8
      : kneelMarkZone
        ? 4.4
      : walkInspectRoute
        ? 2.8
      : castFishingLine || reelFishingLine || collectCatch
        ? 5.8
      : setFishTrap || checkFishTrap || hangCatchDryingRack
        ? 5.0
      : waitFishing || fishFromPier
        ? 2.8
      : catchReaction
        ? 7.0
      : paddleRaft
        ? 5.8
      : lashRaft
        ? 5.4
      : pushRaft || boardRaft || disembarkRaft
        ? 4.8
      : lookOutFromRaft
        ? 2.8
      : returnCelebrate
        ? 7.2
      : hammer
        ? 9.2
      : fireFan || fireStoke || stirPot
        ? 6.0
      : fireWarmHands || cookFishMeal
        ? 4.8
      : gardenWatering || prepMeal
          ? 4.8
          : gardenDig || gardenPlant || gardenPatSoil || gardenHarvest || storeHarvest
            ? 5.8
            : carryHarvest
              ? 3.8
	    : toyGroundWork || toyBallPlay || toyKitePlay || hopPlay || play || respondPlayer
	      ? 6.8
              : celebrate
                ? 7.4
                : 4.2
  ));
  const gaitFrequency =
    locomotionState === "shortJog"
      ? 8.8
      : locomotionState === "slowWalk" || locomotionState === "approachTarget"
        ? 4.8
        : 6.2;
  const gait = Math.sin(time * gaitFrequency);
  const turnAmount = clamp(Number.isFinite(locomotion.turnAmount) ? locomotion.turnAmount : 0, -0.92, 0.92);
  const groupSleepPitch = sleep ? -Math.PI / 2 : 0;
  const groupWakeRoll = wake || wakeStretch ? Math.sin(time * 4.6) * 0.035 : locomotionTurn ? turnAmount * 0.045 : 0;
  bubbleBoy.group.rotation.x += (groupSleepPitch - bubbleBoy.group.rotation.x) * smoothing;
  bubbleBoy.group.rotation.z += (groupWakeRoll - bubbleBoy.group.rotation.z) * smoothing;
  if (sleep) bubbleBoy.group.position.y += 0.48;
  if (hopPlay) bubbleBoy.group.position.y += Math.max(0, Math.sin(time * 7.2)) * 0.10;

  const bodyRest = bubbleBoy.body.userData.restPosition;
  if (bodyRest) {
    bubbleBoy.body.position.lerp(bodyRest, smoothing);
    if (restSit || restSettle) bubbleBoy.body.position.y -= 0.08;
  }
  let bodyLean = 0;
  if (toyGroundWork) {
    bodyLean = -0.19 + Math.max(0, wave) * 0.024;
  } else if (kickBall) {
    bodyLean = -0.055 + Math.max(0, wave) * 0.014;
  } else if (tossBall) {
    bodyLean = -0.045 + Math.max(0, wave) * 0.018;
  } else if (toyKitePlay) {
    bodyLean = -0.035 + Math.sin(time * 2.4) * 0.010;
  } else if (hopPlay) {
    bodyLean = -0.045 + Math.max(0, wave) * 0.018;
  } else if (fireKneel) {
    bodyLean = -0.26 + Math.max(0, wave) * 0.018;
  } else if (fireCare) {
    bodyLean = fireAddFuel || fireStoke
      ? -0.20 + Math.max(0, wave) * 0.028
      : -0.13 + wave * 0.020;
  } else if (cookingCare) {
    bodyLean = -0.15 + Math.max(0, wave) * 0.020;
  } else if (holdFood || eatFood) {
    bodyLean = eatFood ? -0.025 + Math.max(0, wave) * 0.008 : -0.020;
  } else if (castFishingLine) {
    bodyLean = -0.070 + Math.max(0, wave) * 0.018;
  } else if (waitFishing || fishFromPier) {
    bodyLean = -0.045 + Math.sin(time * 2.4) * 0.006;
  } else if (reelFishingLine) {
    bodyLean = -0.10 + Math.max(0, wave) * 0.030;
  } else if (catchReaction) {
    bodyLean = -0.025 + Math.max(0, wave) * 0.014;
  } else if (setFishTrap || checkFishTrap || collectCatch) {
    bodyLean = -0.22 + Math.max(0, wave) * 0.026;
  } else if (hangCatchDryingRack) {
    bodyLean = -0.12 + Math.max(0, wave) * 0.020;
  } else if (pushRaft) {
    bodyLean = -0.21 + Math.max(0, wave) * 0.020;
  } else if (boardRaft || disembarkRaft) {
    bodyLean = -0.10 + Math.sin(time * 3.8) * 0.014;
  } else if (paddleRaft) {
    bodyLean = -0.12 + Math.max(0, wave) * 0.028;
  } else if (lashRaft) {
    bodyLean = -0.12 + wave * 0.022;
  } else if (sitAboardRaft) {
    bodyLean = 0.18 + Math.sin(time * 2.4) * 0.010;
  } else if (standAboardRaft || lookOutFromRaft) {
    bodyLean = lookOutFromRaft ? -0.035 : -0.020;
  } else if (returnCelebrate) {
    bodyLean = -0.025 + Math.max(0, wave) * 0.012;
  } else if (pushPostUpright) {
    bodyLean = -0.18 + Math.max(0, wave) * 0.018;
  } else if (placePlank || repairShelter) {
    bodyLean = -0.22 + Math.max(0, wave) * 0.026;
  } else if (tieRopeVines || reinforceShelter) {
    bodyLean = -0.12 + wave * 0.022;
  } else if (hammerStrike || carveTool || craftAtWorkbench) {
    bodyLean = -0.12 + Math.max(0, wave) * 0.035;
  } else if (inspectProgress) {
    bodyLean = -0.06 + Math.max(0, wave) * 0.010;
  } else if (sortMaterials) {
    bodyLean = -0.17 + Math.max(0, wave) * 0.020;
  } else if (depositStorage || withdrawStorage) {
    bodyLean = -0.22 + Math.max(0, wave) * 0.026;
  } else if (tidyCamp) {
    bodyLean = -0.10 + wave * 0.024;
  } else if (inspectCampLayout) {
    bodyLean = -0.055 + Math.max(0, wave) * 0.008;
  } else if (placeBoundaryStone) {
    bodyLean = -0.22 + Math.max(0, wave) * 0.02;
  } else if (kneelMarkZone) {
    bodyLean = -0.20 + Math.max(0, wave) * 0.018;
  } else if (gardenDig || gardenPlant || gardenPatSoil || gardenHarvest) {
    bodyLean = -0.20 + Math.max(0, wave) * 0.025;
  } else if (gardenInspect) {
    bodyLean = -0.16;
  } else if (gardenWatering) {
    bodyLean = -0.08 + wave * 0.025;
  } else if (storeHarvest) {
    bodyLean = -0.18 + Math.max(0, wave) * 0.024;
  } else if (prepMeal) {
    bodyLean = -0.13 + Math.max(0, wave) * 0.020;
  } else if (carryHarvest) {
    bodyLean = locomotionMoving
      ? -0.050 + gait * 0.010
      : -0.030 + Math.sin(time * 3.2) * 0.006;
  } else if (carryRaftLog) {
    bodyLean = locomotionMoving
      ? -0.055 + gait * 0.010
      : -0.040 + Math.sin(time * 3.8) * 0.008;
  } else if (clearPath) {
    bodyLean = -0.20 + Math.max(0, wave) * 0.034;
  } else if (sweepLeaves) {
    bodyLean = -0.12 + wave * 0.030;
  } else if (rakePath) {
    bodyLean = -0.14 + wave * 0.035;
  } else if (walkInspectRoute) {
    bodyLean = locomotionMoving ? -0.035 + gait * 0.010 : -0.04 + Math.max(0, wave) * 0.010;
  } else if (carryAttachment) {
    bodyLean = locomotionMoving
      ? -0.055 + gait * 0.010
      : -0.040 + Math.sin(time * 3.8) * 0.008;
  } else if (gather) {
    bodyLean = depositMaterials
      ? -0.20 + Math.max(0, wave) * 0.026
      : -0.24 + Math.max(0, wave) * 0.034;
  } else if (hammer) {
    bodyLean = -0.12 + Math.max(0, wave) * 0.035;
  } else if (restSettle) {
    bodyLean = 0.11 + Math.max(0, wave) * 0.012;
  } else if (restSit) {
    bodyLean = 0.24;
  } else if (wake) {
    bodyLean = -0.07 + Math.max(0, wave) * 0.014;
  } else if (wakeStretch) {
    bodyLean = -0.035 + Math.max(0, wave) * 0.012;
  } else if (standUpRest) {
    bodyLean = -0.025;
  } else if (inspectTool) {
    bodyLean = -0.05;
  } else if (inspectObject) {
    bodyLean = -0.10 + Math.max(0, wave) * 0.018;
  } else if (smallSurprise) {
    bodyLean = 0.06 + Math.max(0, wave) * 0.012;
  } else if (pointNotice) {
    bodyLean = -0.035;
  } else if (respondPlayer || orientIsland || arriveLookAround || quietCelebrate) {
    bodyLean = quietCelebrate ? -0.025 : -0.015;
  } else if (locomotionStop) {
    bodyLean = 0.04 + Math.sin(time * 7.0) * 0.012;
  } else if (locomotionState === "start") {
    bodyLean = -0.09 + Math.max(0, gait) * 0.025;
  } else if (locomotionState === "shortJog") {
    bodyLean = -0.11 + Math.max(0, gait) * 0.020;
  } else if (locomotionState === "approachTarget") {
    bodyLean = -0.07;
  } else if (locomotionMoving) {
    bodyLean = -0.045 + gait * 0.012;
  } else if (locomotionTurn) {
    bodyLean = -0.015;
  } else if (play) {
    bodyLean = -0.06;
  }

  bubbleBoy.body.rotation.x += (bodyLean - bubbleBoy.body.rotation.x) * smoothing;
  const locomotionBodyRoll = locomotionTurn
    ? turnAmount * 0.11
    : locomotionMoving
      ? gait * (locomotionState === "shortJog" ? 0.075 : 0.045)
      : locomotionStop
        ? Math.sin(time * 7.0) * 0.035
        : 0;
  bubbleBoy.body.rotation.z += (
	      (
	      toyGroundWork
	        ? wave * 0.046
	      : toyBallPlay
	        ? wave * 0.064
	      : toyKitePlay
	        ? Math.sin(time * 2.8) * 0.040
	      : hopPlay
	        ? wave * 0.070
	      : quietCelebrate
	        ? wave * 0.055
        : castFishingLine
          ? wave * 0.070
        : reelFishingLine
          ? wave * 0.080
        : waitFishing || fishFromPier
          ? wave * 0.024
        : catchReaction
          ? wave * 0.065
        : setFishTrap || checkFishTrap || collectCatch
          ? -wave * 0.030
        : hangCatchDryingRack
          ? wave * 0.050
        : returnCelebrate
          ? wave * 0.070
        : paddleRaft
          ? wave * 0.075
        : lashRaft
          ? wave * 0.060
        : pushRaft
          ? wave * 0.050
        : boardRaft || disembarkRaft
          ? wave * 0.035
        : lookOutFromRaft
          ? wave * 0.025
        : tieRopeVines || reinforceShelter
          ? wave * 0.060
        : placePlank || repairShelter
          ? -wave * 0.030
        : pushPostUpright
          ? wave * 0.045
        : hammerStrike || carveTool || craftAtWorkbench
          ? wave * 0.040
        : inspectProgress
          ? wave * 0.020
        : sortMaterials
          ? wave * 0.052
        : depositStorage || withdrawStorage
          ? -wave * 0.030
        : tidyCamp
          ? wave * 0.060
        : inspectCampLayout
          ? wave * 0.025
        : fireFan || fireStoke || stirPot
          ? wave * 0.060
        : fireWarmHands || cookFishMeal
          ? wave * 0.024
        : respondPlayer
          ? wave * 0.040
          : pointNotice
            ? -0.055
            : arriveLookAround || orientIsland
              ? wave * 0.025
              : celebrate
                ? wave * 0.08
                : play
                  ? wave * 0.035
                  : locomotionBodyRoll
    ) - bubbleBoy.body.rotation.z
  ) * smoothing;
  for (const limb of Object.values(bubbleBoy.limbs)) {
    const rest = limb.userData.restPosition;
    const restScale = limb.userData.restScale;
    if (!rest || !restScale) continue;
    limb.position.lerp(rest, smoothing);
    limb.scale.lerp(restScale, smoothing);
  }

  const leftArm = bubbleBoy.limbs.leftarm;
  const rightArm = bubbleBoy.limbs.rightarm;
  const leftFoot = bubbleBoy.limbs.leftfoot;
  const rightFoot = bubbleBoy.limbs.rightfoot;
  if ((craftToy || placeToy || playBlocks || putToyAway) && leftArm && rightArm) {
    const reach = putToyAway ? 0.8 : placeToy ? 1.0 : 0.9;
    rightArm.position.set(0.25, 0.34 + Math.max(0, -wave) * 0.042 * reach, -0.29);
    leftArm.position.set(-0.25, 0.35 + Math.max(0, wave) * 0.036 * reach, -0.26);
    if (leftFoot) leftFoot.position.set(-0.23, 0.10, -0.04);
    if (rightFoot) rightFoot.position.set(0.23, 0.10, -0.03);
  } else if (spinTop && leftArm && rightArm) {
    rightArm.position.set(0.27, 0.31 + Math.max(0, -wave) * 0.052, -0.31);
    leftArm.position.set(-0.21, 0.39 + Math.max(0, wave) * 0.026, -0.20);
    if (leftFoot) leftFoot.position.set(-0.23, 0.10, -0.04);
    if (rightFoot) rightFoot.position.set(0.23, 0.10, -0.02);
  } else if (kickBall && leftArm && rightArm) {
    rightArm.position.set(0.32, 0.51 + Math.max(0, wave) * 0.026, -0.16);
    leftArm.position.set(-0.28, 0.46, -0.12);
    if (leftFoot) leftFoot.position.set(-0.26, 0.12, -0.04);
    if (rightFoot) rightFoot.position.set(0.32, 0.17 + Math.max(0, wave) * 0.060, -0.23);
  } else if (tossBall && leftArm && rightArm) {
    rightArm.position.set(0.35, 0.64 + Math.max(0, wave) * 0.060, -0.18);
    leftArm.position.set(-0.24, 0.45, -0.10);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z += 0.02;
  } else if ((launchKite || holdKite) && leftArm && rightArm) {
    rightArm.position.set(0.36, 0.66 + Math.max(0, Math.sin(time * 2.8)) * 0.040, -0.20);
    leftArm.position.set(-0.25, 0.55 + Math.max(0, -wave) * 0.026, -0.18);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z -= 0.01;
  } else if (hopPlay && leftArm && rightArm) {
    leftArm.position.set(-0.32, 0.62 + Math.max(0, wave) * 0.046, -0.10);
    rightArm.position.set(0.32, 0.62 + Math.max(0, -wave) * 0.046, -0.10);
    if (leftFoot) leftFoot.position.set(-0.25, 0.14 + Math.max(0, wave) * 0.020, -0.06);
    if (rightFoot) rightFoot.position.set(0.25, 0.14 + Math.max(0, -wave) * 0.020, -0.06);
  } else if (fireKneel && leftArm && rightArm) {
    rightArm.position.set(0.26, 0.34 + Math.max(0, -wave) * 0.026, -0.26);
    leftArm.position.set(-0.24, 0.35 + Math.max(0, wave) * 0.024, -0.22);
    if (leftFoot) leftFoot.position.set(-0.24, 0.10, -0.05);
    if (rightFoot) rightFoot.position.set(0.24, 0.10, -0.03);
  } else if (fireWarmHands && leftArm && rightArm) {
    rightArm.position.set(0.30, 0.47 + Math.max(0, -wave) * 0.035, -0.25);
    leftArm.position.set(-0.30, 0.47 + Math.max(0, wave) * 0.035, -0.25);
  } else if (fireAddFuel && leftArm && rightArm) {
    rightArm.position.set(0.27, 0.33 + Math.max(0, -wave) * 0.040, -0.30);
    leftArm.position.set(-0.21, 0.40, -0.18);
    if (leftFoot) leftFoot.position.set(-0.22, 0.11, -0.04);
    if (rightFoot) rightFoot.position.set(0.22, 0.11, -0.02);
  } else if (fireFan && leftArm && rightArm) {
    rightArm.position.set(0.34 + wave * 0.055, 0.48 + Math.max(0, wave) * 0.040, -0.23);
    leftArm.position.set(-0.24, 0.42, -0.12);
  } else if (fireStoke && leftArm && rightArm) {
    rightArm.position.set(0.30, 0.35 + Math.max(0, -wave) * 0.050, -0.31);
    leftArm.position.set(-0.22, 0.40, -0.16);
    if (rightFoot) rightFoot.position.z += 0.02;
  } else if (cookFishMeal && leftArm && rightArm) {
    rightArm.position.set(0.28, 0.43 + Math.max(0, -wave) * 0.035, -0.27);
    leftArm.position.set(-0.28, 0.43 + Math.max(0, wave) * 0.035, -0.25);
  } else if (stirPot && leftArm && rightArm) {
    rightArm.position.set(0.29 + wave * 0.035, 0.40 + Math.max(0, -wave) * 0.046, -0.30);
    leftArm.position.set(-0.22, 0.42, -0.17);
  } else if (holdFood && rightArm) {
    rightArm.position.set(0.30, 0.58 + Math.sin(time * 3.4) * 0.012, -0.18);
    if (leftArm) leftArm.position.set(-0.24, 0.45, -0.08);
  } else if (eatFood && rightArm) {
    rightArm.position.set(0.28, 0.69 + Math.max(0, wave) * 0.018, -0.10);
    if (leftArm) leftArm.position.set(-0.24, 0.44, -0.08);
  } else if (castFishingLine && leftArm && rightArm) {
    rightArm.position.set(0.36 + Math.max(0, wave) * 0.030, 0.58 + Math.max(0, wave) * 0.070, -0.28);
    leftArm.position.set(-0.22, 0.46 + Math.max(0, -wave) * 0.030, -0.20);
    if (leftFoot) leftFoot.position.set(-0.27, 0.12, -0.04);
    if (rightFoot) rightFoot.position.set(0.30, 0.12, -0.08);
  } else if ((waitFishing || fishFromPier) && leftArm && rightArm) {
    rightArm.position.set(0.32, 0.52 + Math.sin(time * 2.4) * 0.010, -0.24);
    leftArm.position.set(-0.28, 0.47 + Math.sin(time * 2.0) * 0.008, -0.18);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z -= 0.02;
  } else if (reelFishingLine && leftArm && rightArm) {
    rightArm.position.set(0.34 + wave * 0.060, 0.48 + Math.max(0, -wave) * 0.050, -0.26);
    leftArm.position.set(-0.30 + wave * 0.040, 0.46 + Math.max(0, wave) * 0.042, -0.23);
    if (leftFoot) leftFoot.position.set(-0.28, 0.12, -0.05);
    if (rightFoot) rightFoot.position.set(0.28, 0.12, -0.07);
  } else if (catchReaction && leftArm && rightArm) {
    rightArm.position.set(0.30, 0.60 + Math.max(0, wave) * 0.032, -0.16);
    leftArm.position.set(-0.26, 0.48, -0.10);
    if (rightFoot) rightFoot.position.z += 0.02;
  } else if ((setFishTrap || checkFishTrap || collectCatch) && leftArm && rightArm) {
    const reach = checkFishTrap ? 0.7 : collectCatch ? 1.0 : 0.9;
    rightArm.position.set(0.25, 0.32 + Math.max(0, -wave) * 0.045 * reach, -0.30);
    leftArm.position.set(-0.25, 0.34 + Math.max(0, wave) * 0.036 * reach, -0.27);
    if (leftFoot) leftFoot.position.set(-0.23, 0.10, -0.04);
    if (rightFoot) rightFoot.position.set(0.23, 0.10, -0.02);
  } else if (hangCatchDryingRack && leftArm && rightArm) {
    rightArm.position.set(0.30, 0.60 + Math.max(0, wave) * 0.060, -0.24);
    leftArm.position.set(-0.22, 0.45, -0.12);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z += 0.02;
  } else if (gardenDig && leftArm && rightArm) {
    rightArm.position.set(0.24, 0.28 + Math.max(0, wave) * 0.060, -0.32);
    leftArm.position.set(-0.20, 0.34 + Math.max(0, -wave) * 0.030, -0.24);
    if (leftFoot) leftFoot.position.set(-0.22, 0.10, -0.04);
    if (rightFoot) rightFoot.position.set(0.22, 0.10, -0.03);
  } else if (gardenPlant && leftArm && rightArm) {
    rightArm.position.set(0.22, 0.33 + Math.max(0, wave) * 0.045, -0.27);
    leftArm.position.set(-0.24, 0.38 + Math.max(0, -wave) * 0.025, -0.19);
    if (leftFoot) leftFoot.position.set(-0.22, 0.10, -0.04);
    if (rightFoot) rightFoot.position.set(0.22, 0.10, -0.03);
  } else if (gardenPatSoil && leftArm && rightArm) {
    rightArm.position.set(0.24, 0.30 + Math.max(0, wave) * 0.032, -0.28);
    leftArm.position.set(-0.24, 0.31 + Math.max(0, -wave) * 0.032, -0.27);
    if (leftFoot) leftFoot.position.set(-0.23, 0.10, -0.04);
    if (rightFoot) rightFoot.position.set(0.23, 0.10, -0.03);
  } else if (gardenWatering && leftArm && rightArm) {
    rightArm.position.set(0.35, 0.58 + Math.max(0, wave) * 0.035, -0.18);
    leftArm.position.set(-0.24, 0.42, -0.08);
  } else if (gardenHarvest && leftArm && rightArm) {
    rightArm.position.set(0.28, 0.36 + Math.max(0, -wave) * 0.045, -0.30);
    leftArm.position.set(-0.18, 0.38 + Math.max(0, wave) * 0.025, -0.22);
    if (leftFoot) leftFoot.position.set(-0.22, 0.11, -0.04);
    if (rightFoot) rightFoot.position.set(0.22, 0.11, -0.02);
  } else if (gardenInspect && leftArm && rightArm) {
    rightArm.position.set(0.26, 0.40, -0.18);
    leftArm.position.set(-0.26, 0.40, -0.16);
    if (leftFoot) leftFoot.position.z -= 0.03;
    if (rightFoot) rightFoot.position.z -= 0.03;
  } else if (carryHarvest && leftArm && rightArm) {
    rightArm.position.set(0.26, 0.52 + Math.sin(time * 3.2) * 0.010, -0.12);
    leftArm.position.set(-0.22, 0.50 + Math.sin(time * 3.2 + 0.8) * 0.010, -0.12);
  } else if (storeHarvest && leftArm && rightArm) {
    rightArm.position.set(0.27, 0.36 + Math.max(0, -wave) * 0.040, -0.28);
    leftArm.position.set(-0.22, 0.40 + Math.max(0, wave) * 0.030, -0.20);
    if (leftFoot) leftFoot.position.set(-0.22, 0.10, -0.04);
    if (rightFoot) rightFoot.position.set(0.22, 0.10, -0.03);
  } else if (prepMeal && leftArm && rightArm) {
    rightArm.position.set(0.28 + wave * 0.024, 0.43 + Math.max(0, -wave) * 0.034, -0.24);
    leftArm.position.set(-0.25, 0.44 + Math.max(0, wave) * 0.024, -0.20);
  } else if ((hammerStrike || carveTool || craftAtWorkbench) && rightArm) {
    rightArm.position.set(0.28, 0.48 + Math.max(0, wave) * 0.16, -0.24);
    if (leftArm) leftArm.position.set(-0.24, 0.43, -0.18);
    if (leftFoot) leftFoot.position.z -= 0.025;
    if (rightFoot) rightFoot.position.z += 0.025;
  } else if ((tieRopeVines || reinforceShelter) && leftArm && rightArm) {
    rightArm.position.set(0.32 + wave * 0.045, 0.50 + Math.max(0, -wave) * 0.040, -0.24);
    leftArm.position.set(-0.32 + wave * 0.045, 0.49 + Math.max(0, wave) * 0.040, -0.22);
    if (leftFoot) leftFoot.position.set(-0.26, 0.12, -0.03);
    if (rightFoot) rightFoot.position.set(0.26, 0.12, -0.03);
  } else if ((placePlank || repairShelter) && leftArm && rightArm) {
    rightArm.position.set(0.26, 0.34 + Math.max(0, -wave) * 0.045, -0.30);
    leftArm.position.set(-0.26, 0.35 + Math.max(0, wave) * 0.035, -0.28);
    if (leftFoot) leftFoot.position.set(-0.24, 0.11, -0.04);
    if (rightFoot) rightFoot.position.set(0.24, 0.11, -0.02);
  } else if (pushPostUpright && leftArm && rightArm) {
    rightArm.position.set(0.34, 0.56 + Math.max(0, wave) * 0.030, -0.30);
    leftArm.position.set(-0.34, 0.56 + Math.max(0, -wave) * 0.030, -0.30);
    if (leftFoot) leftFoot.position.set(-0.30, 0.12, 0.01);
    if (rightFoot) rightFoot.position.set(0.30, 0.12, -0.08);
  } else if (inspectProgress && leftArm && rightArm) {
    rightArm.position.set(0.26, 0.48 + Math.max(0, wave) * 0.016, -0.20);
    leftArm.position.set(-0.24, 0.46, -0.16);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z -= 0.02;
  } else if (sortMaterials && leftArm && rightArm) {
    rightArm.position.set(0.30 + wave * 0.040, 0.39 + Math.max(0, -wave) * 0.040, -0.28);
    leftArm.position.set(-0.30 + wave * 0.035, 0.39 + Math.max(0, wave) * 0.036, -0.24);
    if (leftFoot) leftFoot.position.set(-0.24, 0.11, -0.05);
    if (rightFoot) rightFoot.position.set(0.24, 0.11, -0.03);
  } else if ((depositStorage || withdrawStorage) && leftArm && rightArm) {
    const reach = depositStorage ? 1 : -1;
    rightArm.position.set(0.25, 0.34 + Math.max(0, -wave * reach) * 0.050, -0.30);
    leftArm.position.set(-0.25, 0.35 + Math.max(0, wave * reach) * 0.040, -0.27);
    if (leftFoot) leftFoot.position.set(-0.23, 0.11, -0.04);
    if (rightFoot) rightFoot.position.set(0.23, 0.11, -0.02);
  } else if (tidyCamp && leftArm && rightArm) {
    rightArm.position.set(0.34 + wave * 0.060, 0.46 + Math.max(0, wave) * 0.035, -0.22);
    leftArm.position.set(-0.24, 0.42, -0.12);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z += 0.02;
  } else if (inspectCampLayout && leftArm && rightArm) {
    rightArm.position.set(0.28, 0.50 + Math.max(0, wave) * 0.018, -0.16);
    leftArm.position.set(-0.24, 0.46, -0.12);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z -= 0.02;
  } else if (placeBoundaryStone && leftArm && rightArm) {
    rightArm.position.set(0.24, 0.34 + Math.max(0, -wave) * 0.035, -0.26);
    leftArm.position.set(-0.24, 0.34 + Math.max(0, wave) * 0.035, -0.24);
    if (leftFoot) leftFoot.position.set(-0.22, 0.10, -0.03);
    if (rightFoot) rightFoot.position.set(0.22, 0.10, -0.02);
  } else if (kneelMarkZone && leftArm && rightArm) {
    rightArm.position.set(0.22, 0.34 + Math.max(0, -wave) * 0.028, -0.25);
    leftArm.position.set(-0.25, 0.36 + Math.max(0, wave) * 0.025, -0.22);
    if (leftFoot) leftFoot.position.set(-0.22, 0.10, -0.02);
    if (rightFoot) rightFoot.position.set(0.22, 0.10, -0.01);
  } else if (clearPath && leftArm && rightArm) {
    rightArm.position.set(0.32 + wave * 0.08, 0.40 + Math.max(0, wave) * 0.050, -0.28);
    leftArm.position.set(-0.26 + wave * 0.05, 0.42 + Math.max(0, -wave) * 0.042, -0.20);
    if (leftFoot) leftFoot.position.z -= 0.05;
    if (rightFoot) rightFoot.position.z += 0.04;
  } else if (sweepLeaves && leftArm && rightArm) {
    rightArm.position.set(0.34 + wave * 0.10, 0.43 + Math.max(0, wave) * 0.036, -0.24);
    leftArm.position.set(-0.26 + wave * 0.07, 0.41 + Math.max(0, -wave) * 0.032, -0.18);
    if (leftFoot) leftFoot.position.z -= 0.03;
    if (rightFoot) rightFoot.position.z += 0.03;
  } else if (rakePath && leftArm && rightArm) {
    rightArm.position.set(0.31 + wave * 0.07, 0.45 + Math.max(0, wave) * 0.05, -0.24);
    leftArm.position.set(-0.29 + wave * 0.05, 0.43 + Math.max(0, -wave) * 0.05, -0.20);
    if (leftFoot) leftFoot.position.z -= 0.04;
    if (rightFoot) rightFoot.position.z += 0.03;
  } else if (walkInspectRoute && leftArm && rightArm) {
    rightArm.position.set(0.28, 0.49 + Math.max(0, wave) * 0.016, -0.18);
    leftArm.position.set(-0.24, 0.45, -0.12);
    if (leftFoot && locomotionMoving) {
      leftFoot.position.z += gait * 0.058;
      leftFoot.position.y += Math.max(0, gait) * 0.020;
    }
    if (rightFoot && locomotionMoving) {
      rightFoot.position.z -= gait * 0.058;
      rightFoot.position.y += Math.max(0, -gait) * 0.020;
    }
  } else if (inspectTool && leftArm && rightArm) {
    rightArm.position.set(0.30, 0.56 + Math.sin(time * 3.2) * 0.025, -0.26);
    leftArm.position.set(-0.24, 0.49, -0.18);
  } else if (carryRaftLog && leftArm && rightArm) {
    const carryLift = locomotionMoving ? gait * 0.010 : Math.sin(time * 3.8) * 0.008;
    leftArm.position.set(-0.34, 0.52 + carryLift, -0.30);
    rightArm.position.set(0.34, 0.52 - carryLift, -0.30);
    if (leftFoot && locomotionMoving) {
      const stride = locomotionState === "shortJog" ? 0.12 : locomotionState === "slowWalk" ? 0.050 : 0.078;
      const lift = locomotionState === "shortJog" ? 0.050 : locomotionState === "slowWalk" ? 0.018 : 0.030;
      leftFoot.position.z += gait * stride * 0.72;
      leftFoot.position.y += Math.max(0, gait) * lift;
    }
    if (rightFoot && locomotionMoving) {
      const stride = locomotionState === "shortJog" ? 0.12 : locomotionState === "slowWalk" ? 0.050 : 0.078;
      const lift = locomotionState === "shortJog" ? 0.050 : locomotionState === "slowWalk" ? 0.018 : 0.030;
      rightFoot.position.z -= gait * stride * 0.72;
      rightFoot.position.y += Math.max(0, -gait) * lift;
    }
  } else if (lashRaft && leftArm && rightArm) {
    rightArm.position.set(0.32 + wave * 0.046, 0.48 + Math.max(0, -wave) * 0.038, -0.26);
    leftArm.position.set(-0.32 + wave * 0.046, 0.48 + Math.max(0, wave) * 0.038, -0.24);
    if (leftFoot) leftFoot.position.set(-0.26, 0.12, -0.03);
    if (rightFoot) rightFoot.position.set(0.26, 0.12, -0.03);
  } else if (pushRaft && leftArm && rightArm) {
    rightArm.position.set(0.36, 0.56 + Math.max(0, wave) * 0.028, -0.32);
    leftArm.position.set(-0.36, 0.56 + Math.max(0, -wave) * 0.028, -0.32);
    if (leftFoot) leftFoot.position.set(-0.30, 0.12, 0.00);
    if (rightFoot) rightFoot.position.set(0.30, 0.12, -0.09);
  } else if ((boardRaft || disembarkRaft) && leftArm && rightArm) {
    const reach = boardRaft ? -1 : 1;
    rightArm.position.set(0.34, 0.54 + Math.max(0, wave * reach) * 0.026, -0.27);
    leftArm.position.set(-0.28, 0.48 + Math.max(0, -wave * reach) * 0.020, -0.18);
    if (leftFoot) leftFoot.position.set(-0.28, 0.12, boardRaft ? -0.08 : 0.02);
    if (rightFoot) rightFoot.position.set(0.28, 0.12, boardRaft ? 0.02 : -0.08);
  } else if (sitAboardRaft && leftArm && rightArm) {
    leftArm.position.set(-0.31, 0.40 + Math.max(0, wave) * 0.012, -0.14);
    rightArm.position.set(0.31, 0.40 + Math.max(0, -wave) * 0.012, -0.14);
    if (leftFoot) leftFoot.position.set(-0.26, 0.12, -0.10);
    if (rightFoot) rightFoot.position.set(0.26, 0.12, -0.10);
  } else if (standAboardRaft && leftArm && rightArm) {
    leftArm.position.set(-0.28, 0.46, -0.12);
    rightArm.position.set(0.28, 0.46, -0.12);
    if (leftFoot) leftFoot.position.set(-0.30, 0.12, -0.04);
    if (rightFoot) rightFoot.position.set(0.30, 0.12, -0.04);
  } else if (paddleRaft && leftArm && rightArm) {
    rightArm.position.set(0.34 + wave * 0.060, 0.50 + Math.max(0, wave) * 0.046, -0.27);
    leftArm.position.set(-0.32 + wave * 0.055, 0.44 + Math.max(0, -wave) * 0.038, -0.22);
    if (leftFoot) leftFoot.position.set(-0.25, 0.12, -0.10);
    if (rightFoot) rightFoot.position.set(0.25, 0.12, -0.10);
  } else if (lookOutFromRaft && leftArm && rightArm) {
    rightArm.position.set(0.28, 0.52 + Math.max(0, wave) * 0.016, -0.18);
    leftArm.position.set(-0.24, 0.45, -0.12);
    if (leftFoot) leftFoot.position.z -= 0.02;
    if (rightFoot) rightFoot.position.z -= 0.02;
  } else if (returnCelebrate && leftArm && rightArm) {
    leftArm.position.y += 0.15 + Math.max(0, wave) * 0.034;
    rightArm.position.y += 0.15 + Math.max(0, -wave) * 0.034;
    leftArm.position.z -= 0.026;
    rightArm.position.z -= 0.026;
  } else if (carryAttachment && leftArm && rightArm) {
    const carryLift = locomotionMoving ? gait * 0.010 : Math.sin(time * 3.8) * 0.008;
    leftArm.position.set(-0.31, 0.51 + carryLift, -0.28);
    rightArm.position.set(0.31, 0.51 - carryLift, -0.28);
    if (leftFoot && locomotionMoving) {
      const stride = locomotionState === "shortJog" ? 0.12 : locomotionState === "slowWalk" ? 0.050 : 0.078;
      const lift = locomotionState === "shortJog" ? 0.050 : locomotionState === "slowWalk" ? 0.018 : 0.030;
      leftFoot.position.z += gait * stride * 0.72;
      leftFoot.position.y += Math.max(0, gait) * lift;
    }
    if (rightFoot && locomotionMoving) {
      const stride = locomotionState === "shortJog" ? 0.12 : locomotionState === "slowWalk" ? 0.050 : 0.078;
      const lift = locomotionState === "shortJog" ? 0.050 : locomotionState === "slowWalk" ? 0.018 : 0.030;
      rightFoot.position.z -= gait * stride * 0.72;
      rightFoot.position.y += Math.max(0, -gait) * lift;
    }
  } else if (depositMaterials && leftArm && rightArm) {
    leftArm.position.set(-0.24, 0.32 + Math.max(0, wave) * 0.030, -0.26);
    rightArm.position.set(0.24, 0.32 + Math.max(0, -wave) * 0.030, -0.26);
    if (leftFoot) leftFoot.position.set(-0.23, 0.11, -0.04);
    if (rightFoot) rightFoot.position.set(0.23, 0.11, -0.02);
  } else if (hammer && rightArm) {
    rightArm.position.y += Math.max(0, wave) * 0.16;
    rightArm.position.z -= 0.06;
    if (leftArm) leftArm.position.y -= 0.04;
  } else if (gather && leftArm && rightArm) {
    leftArm.position.y -= 0.08 + Math.max(0, wave) * 0.04;
    rightArm.position.y -= 0.06 + Math.max(0, -wave) * 0.04;
    leftArm.position.z -= 0.04;
    rightArm.position.z -= 0.04;
  } else if (restSettle) {
    if (leftArm) leftArm.position.set(-0.31, 0.40 + Math.max(0, wave) * 0.014, -0.16);
    if (rightArm) rightArm.position.set(0.31, 0.40 + Math.max(0, -wave) * 0.014, -0.16);
    if (leftFoot) leftFoot.position.set(-0.26, 0.12, -0.08);
    if (rightFoot) rightFoot.position.set(0.26, 0.12, -0.08);
  } else if (restSit) {
    if (leftArm) leftArm.position.set(-0.33, 0.42, -0.12);
    if (rightArm) rightArm.position.set(0.33, 0.42, -0.12);
    if (leftFoot) leftFoot.position.set(-0.25, 0.12, -0.10);
    if (rightFoot) rightFoot.position.set(0.25, 0.12, -0.10);
  } else if (sleep) {
    if (leftArm) leftArm.position.set(-0.32, 0.43 + Math.sin(time * 1.4) * 0.004, -0.10);
    if (rightArm) rightArm.position.set(0.30, 0.43 - Math.sin(time * 1.4) * 0.004, -0.10);
    if (leftFoot) leftFoot.position.set(-0.30, 0.16, 0.10);
    if (rightFoot) rightFoot.position.set(0.30, 0.16, 0.10);
  } else if (wakeStretch && leftArm && rightArm) {
    leftArm.position.set(-0.32, 0.64 + Math.max(0, wave) * 0.045, -0.08);
    rightArm.position.set(0.32, 0.64 + Math.max(0, -wave) * 0.045, -0.08);
    if (leftFoot) leftFoot.position.set(-0.25, 0.12, -0.04);
    if (rightFoot) rightFoot.position.set(0.25, 0.12, -0.04);
  } else if (wake && leftArm && rightArm) {
    leftArm.position.set(-0.28, 0.42 + Math.max(0, wave) * 0.020, -0.14);
    rightArm.position.set(0.28, 0.42 + Math.max(0, -wave) * 0.020, -0.14);
    if (leftFoot) leftFoot.position.set(-0.25, 0.12, -0.06);
    if (rightFoot) rightFoot.position.set(0.25, 0.12, -0.06);
  } else if (standUpRest && leftArm && rightArm) {
    leftArm.position.set(-0.28, 0.45, -0.08);
    rightArm.position.set(0.28, 0.45, -0.08);
    if (leftFoot) leftFoot.position.set(-0.26, 0.12, -0.02);
    if (rightFoot) rightFoot.position.set(0.26, 0.12, -0.02);
  } else if (respondPlayer && leftArm && rightArm) {
    rightArm.position.set(0.38, 0.72 + Math.max(0, wave) * 0.055, -0.08);
    leftArm.position.set(-0.28, 0.47, -0.10);
  } else if (inspectObject && leftArm && rightArm) {
    rightArm.position.set(0.26, 0.47 + Math.max(0, wave) * 0.018, -0.22);
    leftArm.position.set(-0.24, 0.46 + Math.max(0, -wave) * 0.016, -0.20);
  } else if (pointNotice && leftArm && rightArm) {
    rightArm.position.set(0.40, 0.60, -0.22);
    leftArm.position.set(-0.24, 0.43, -0.10);
  } else if (smallSurprise && leftArm && rightArm) {
    rightArm.position.set(0.34, 0.61 + Math.max(0, wave) * 0.025, -0.06);
    leftArm.position.set(-0.34, 0.61 + Math.max(0, -wave) * 0.025, -0.06);
  } else if (quietCelebrate && leftArm && rightArm) {
    leftArm.position.y += 0.13 + Math.max(0, wave) * 0.030;
    rightArm.position.y += 0.13 + Math.max(0, -wave) * 0.030;
    leftArm.position.z -= 0.025;
    rightArm.position.z -= 0.025;
  } else if ((arriveLookAround || orientIsland) && leftArm && rightArm) {
    leftArm.position.z += Math.sin(time * 2.4) * 0.020;
    rightArm.position.z -= Math.sin(time * 2.7 + 0.3) * 0.020;
  } else if (locomotionMoving && leftArm && rightArm) {
    const stride = locomotionState === "shortJog" ? 0.14 : locomotionState === "slowWalk" ? 0.055 : 0.09;
    const lift = locomotionState === "shortJog" ? 0.055 : locomotionState === "slowWalk" ? 0.020 : 0.035;
    leftArm.position.y += -gait * stride * 0.55;
    rightArm.position.y += gait * stride * 0.55;
    leftArm.position.z += gait * stride;
    rightArm.position.z -= gait * stride;
    if (leftFoot) {
      leftFoot.position.z += gait * stride * 0.72;
      leftFoot.position.y += Math.max(0, gait) * lift;
    }
    if (rightFoot) {
      rightFoot.position.z -= gait * stride * 0.72;
      rightFoot.position.y += Math.max(0, -gait) * lift;
    }
    if (locomotionOverlay.includes("Approach") || locomotionState === "approachTarget") {
      if (leftArm) leftArm.position.z -= 0.025;
      if (rightArm) rightArm.position.z -= 0.025;
    }
  } else if (locomotionTurn && leftArm && rightArm) {
    leftArm.position.z += clamp(turnAmount * 0.08, -0.08, 0.08);
    rightArm.position.z -= clamp(turnAmount * 0.08, -0.08, 0.08);
    if (leftFoot) leftFoot.position.set(-0.27, 0.12, -0.02 - Math.sign(turnAmount || 1) * 0.035);
    if (rightFoot) rightFoot.position.set(0.27, 0.12, -0.02 + Math.sign(turnAmount || 1) * 0.035);
  } else if (locomotionStop && leftArm && rightArm) {
    const settle = Math.sin(time * 7.0);
    leftArm.position.z += 0.025 + settle * 0.015;
    rightArm.position.z += 0.025 - settle * 0.015;
    if (leftFoot) leftFoot.position.z -= 0.025;
    if (rightFoot) rightFoot.position.z += 0.025;
  } else if (play && leftArm && rightArm) {
    leftArm.position.y += 0.08 + Math.max(0, wave) * 0.05;
    rightArm.position.y += 0.06 + Math.max(0, -wave) * 0.05;
    leftArm.position.x += 0.04;
    rightArm.position.x -= 0.04;
  } else if (celebrate && leftArm && rightArm) {
    leftArm.position.y += 0.18 + Math.max(0, wave) * 0.04;
    rightArm.position.y += 0.18 + Math.max(0, -wave) * 0.04;
  }
}

function createCameraOcclusionController({ scene, occluderRoot }) {
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const target = new THREE.Vector3();
  const rayTarget = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const cameraRight = new THREE.Vector3();
  const targetArray = [0, 0, 0];
  const activeKeys = new Set();
  const meshEntries = new Map();
  const instanceEntries = new Map();
  const hiddenInstanceMatrix = new THREE.Matrix4().makeScale(0.0001, 0.0001, 0.0001);
  const workingMatrix = new THREE.Matrix4();

  function update({ camera3d, cameraState, worldState, deltaSeconds }) {
    activeKeys.clear();

    if (!camera3d || cameraState.cameraMode !== "follow" || !occluderRoot) {
      restoreInactive(meshEntries, deltaSeconds, restoreMeshEntry);
      restoreInactive(instanceEntries, deltaSeconds, restoreInstanceEntry);
      writeTrace();
      return;
    }

    scene.updateMatrixWorld(true);
    resolveBubbleBoyCameraTarget(worldState, targetArray);
    target.fromArray(targetArray);
    origin.copy(camera3d.position);
    cameraRight.setFromMatrixColumn(camera3d.matrixWorld, 0).normalize();
    let blockerCount = 0;

    blockerCount = raycastForOccluders(target, blockerCount, deltaSeconds);
    rayTarget.copy(target).addScaledVector(cameraRight, 0.34);
    blockerCount = raycastForOccluders(rayTarget, blockerCount, deltaSeconds);
    rayTarget.copy(target).addScaledVector(cameraRight, -0.34);
    blockerCount = raycastForOccluders(rayTarget, blockerCount, deltaSeconds);
    rayTarget.copy(target);
    rayTarget.y += 0.36;
    blockerCount = raycastForOccluders(rayTarget, blockerCount, deltaSeconds);
    rayTarget.copy(target);
    rayTarget.y -= 0.46;
    blockerCount = raycastForOccluders(rayTarget, blockerCount, deltaSeconds);

    restoreInactive(meshEntries, deltaSeconds, restoreMeshEntry);
    restoreInactive(instanceEntries, deltaSeconds, restoreInstanceEntry);
    writeTrace();
  }

  function raycastForOccluders(rayEnd, blockerCount, deltaSeconds) {
    if (blockerCount >= CAMERA_OCCLUSION_MAX_BLOCKERS) return blockerCount;
    direction.subVectors(rayEnd, origin);
    const distance = direction.length();
    if (distance <= 0.001) {
      return blockerCount;
    }

    raycaster.set(origin, direction.multiplyScalar(1 / distance));
    raycaster.far = Math.max(0.001, distance - 0.08);
    const hits = raycaster.intersectObject(occluderRoot, true);
    let nextCount = blockerCount;
    for (const hit of hits) {
      if (nextCount >= CAMERA_OCCLUSION_MAX_BLOCKERS) break;
      const object = hit.object;
      if (!isCameraOccluder(object, meshEntries)) continue;
      if (object.isInstancedMesh && Number.isInteger(hit.instanceId)) {
        const key = instanceEntryKey(object, hit.instanceId);
        if (activeKeys.has(key)) continue;
        activeKeys.add(key);
        fadeInstanceEntry(ensureInstanceEntry(object, hit.instanceId, key), deltaSeconds);
      } else {
        const key = object.uuid;
        if (activeKeys.has(key)) continue;
        activeKeys.add(key);
        fadeMeshEntry(ensureMeshEntry(object, key), deltaSeconds);
      }
      nextCount += 1;
    }
    return nextCount;
  }

  function ensureMeshEntry(object, key) {
    let entry = meshEntries.get(key);
    if (entry) return entry;
    const originalMaterial = object.material;
    const materials = materialList(originalMaterial);
    const fadedMaterials = materials.map((material) => cloneOcclusionMaterial(material));
    entry = {
      key,
      object,
      originalMaterial,
      fadedMaterial: Array.isArray(originalMaterial) ? fadedMaterials : fadedMaterials[0],
      materials: fadedMaterials,
      currentOpacity: averageMaterialOpacity(materials)
    };
    object.material = entry.fadedMaterial;
    meshEntries.set(key, entry);
    return entry;
  }

  function fadeMeshEntry(entry, deltaSeconds) {
    entry.object.material = entry.fadedMaterial;
    fadeEntryMaterials(entry, CAMERA_OCCLUSION_FADED_OPACITY, deltaSeconds);
  }

  function restoreMeshEntry(entry, deltaSeconds) {
    const restored = fadeEntryMaterials(entry, 1, deltaSeconds);
    if (!restored) return false;
    entry.object.material = entry.originalMaterial;
    disposeEntryMaterials(entry);
    meshEntries.delete(entry.key);
    return true;
  }

  function ensureInstanceEntry(object, instanceId, key) {
    let entry = instanceEntries.get(key);
    object.getMatrixAt(instanceId, workingMatrix);
    if (entry) {
      entry.originalMatrix.copy(workingMatrix);
      return entry;
    }

    const originalMaterials = materialList(object.material);
    const proxyMaterials = originalMaterials.map((material) => cloneOcclusionMaterial(material));
    const proxy = new THREE.Mesh(
      object.geometry,
      Array.isArray(object.material) ? proxyMaterials : proxyMaterials[0]
    );
    proxy.name = `${object.name || "Instanced occluder"} transparent occlusion proxy`;
    proxy.userData.cameraOcclusionProxy = true;
    proxy.userData.cameraOccluder = false;
    proxy.castShadow = false;
    proxy.receiveShadow = object.receiveShadow;
    proxy.frustumCulled = false;
    proxy.matrixAutoUpdate = false;
    object.add(proxy);

    entry = {
      key,
      object,
      instanceId,
      proxy,
      materials: proxyMaterials,
      originalMatrix: workingMatrix.clone(),
      currentOpacity: averageMaterialOpacity(originalMaterials)
    };
    instanceEntries.set(key, entry);
    return entry;
  }

  function fadeInstanceEntry(entry, deltaSeconds) {
    entry.proxy.visible = true;
    entry.proxy.matrix.copy(entry.originalMatrix);
    entry.object.setMatrixAt(entry.instanceId, hiddenInstanceMatrix);
    entry.object.instanceMatrix.needsUpdate = true;
    fadeEntryMaterials(entry, CAMERA_OCCLUSION_FADED_OPACITY, deltaSeconds);
  }

  function restoreInstanceEntry(entry, deltaSeconds) {
    const restored = fadeEntryMaterials(entry, 1, deltaSeconds);
    if (!restored) return false;
    entry.object.setMatrixAt(entry.instanceId, entry.originalMatrix);
    entry.object.instanceMatrix.needsUpdate = true;
    if (entry.proxy.parent) entry.proxy.parent.remove(entry.proxy);
    disposeEntryMaterials(entry);
    instanceEntries.delete(entry.key);
    return true;
  }

  function restoreInactive(entries, deltaSeconds, restore) {
    for (const entry of Array.from(entries.values())) {
      if (activeKeys.has(entry.key)) continue;
      restore(entry, deltaSeconds);
    }
  }

  function fadeEntryMaterials(entry, targetOpacity, deltaSeconds) {
    const smoothing = 1 - Math.exp(-Math.max(0, deltaSeconds) * CAMERA_OCCLUSION_FADE_SMOOTHING);
    entry.currentOpacity += (targetOpacity - entry.currentOpacity) * smoothing;
    for (const material of entry.materials) {
      material.opacity = entry.currentOpacity;
    }
    return Math.abs(entry.currentOpacity - targetOpacity) <= CAMERA_OCCLUSION_RESTORE_EPSILON;
  }

  function writeTrace() {
    if (typeof window === "undefined") return;
    window.__toyboxCameraOcclusion = {
      activeMeshCount: meshEntries.size,
      activeInstanceCount: instanceEntries.size,
      activeCount: meshEntries.size + instanceEntries.size
    };
  }

  return { update };
}

function isCameraOccluder(object, meshEntries = null) {
  if (!object || !object.visible || !object.isMesh) return false;
  if (object.userData.cameraOcclusionProxy) return false;
  if (!object.userData.cameraOccluder) return false;
  if (meshEntries && meshEntries.has(object.uuid)) return true;
  return isOccludableMaterial(object.material);
}

function isOccludableMaterial(material) {
  const materials = materialList(material);
  if (!materials.length) return false;
  return materials.every((item) => item && !item.transparent && Number(item.opacity ?? 1) >= 0.95);
}

function materialList(material) {
  if (Array.isArray(material)) return material.filter(Boolean);
  return material ? [material] : [];
}

function averageMaterialOpacity(materials) {
  if (!materials.length) return 1;
  let opacity = 0;
  for (const material of materials) opacity += Number(material.opacity ?? 1);
  return opacity / materials.length;
}

function cloneOcclusionMaterial(material) {
  const clone = material.clone();
  clone.transparent = true;
  clone.depthWrite = false;
  clone.opacity = Number(material.opacity ?? 1);
  clone.needsUpdate = true;
  return clone;
}

function disposeEntryMaterials(entry) {
  for (const material of entry.materials) {
    if (material && typeof material.dispose === "function") material.dispose();
  }
}

function instanceEntryKey(object, instanceId) {
  return `${object.uuid}:${instanceId}`;
}

function updateFollowCamera(cameraState, worldState, deltaSeconds) {
  if (!cameraState || cameraState.cameraMode !== "follow") return;

  const desiredTarget = resolveBubbleBoyCameraTarget(
    worldState,
    cameraState.followDesiredTarget || (cameraState.followDesiredTarget = [0, 0, 0])
  );
  if (!Array.isArray(cameraState.target) || cameraState.target.length < 3) {
    cameraState.target = desiredTarget.slice();
  }
  if (!Array.isArray(cameraState.desiredTarget) || cameraState.desiredTarget.length < 3) {
    cameraState.desiredTarget = desiredTarget.slice();
  }

  cameraState.desiredTarget[0] = desiredTarget[0];
  cameraState.desiredTarget[1] = desiredTarget[1];
  cameraState.desiredTarget[2] = desiredTarget[2];

  const targetSmoothing = 1 - Math.exp(-Math.max(0, deltaSeconds) * FOLLOW_CAMERA_TARGET_SMOOTHING);
  cameraState.target[0] += (desiredTarget[0] - cameraState.target[0]) * targetSmoothing;
  cameraState.target[1] += (desiredTarget[1] - cameraState.target[1]) * targetSmoothing;
  cameraState.target[2] += (desiredTarget[2] - cameraState.target[2]) * targetSmoothing;

  const desiredTheta = followCameraTheta(worldState && worldState.bubbleBoy);
  if (!cameraState.dragging) {
    const headingSmoothing = 1 - Math.exp(-Math.max(0, deltaSeconds) * FOLLOW_CAMERA_HEADING_SMOOTHING);
    cameraState.theta = lerpAngle(cameraState.theta, desiredTheta, headingSmoothing);
  }
  cameraState.phi = clamp(cameraState.phi, FOLLOW_CAMERA_MIN_PHI, FOLLOW_CAMERA_MAX_PHI);
  cameraState.distance = clamp(cameraState.distance, FOLLOW_CAMERA_MIN_DISTANCE, FOLLOW_CAMERA_MAX_DISTANCE);
}

function resolveBubbleBoyCameraTarget(worldState, target) {
  const boy = worldState && worldState.bubbleBoy ? worldState.bubbleBoy : {};
  const position = boy.position || {};
  const x = Number.isFinite(position.x) ? position.x : 0;
  const z = Number.isFinite(position.z) ? position.z : 0;
  target[0] = x;
  target[1] = groundHeightAt(x, z) + FOLLOW_CAMERA_TARGET_HEIGHT;
  target[2] = z;
  return target;
}

function followCameraTheta(boy) {
  const facing = boy && Number.isFinite(boy.facing) ? boy.facing : 0;
  return Math.PI * 0.5 - facing;
}

function syncCamera(camera3d, cameraState) {
  clampVectorToGroundFloor(cameraState.desiredTarget, CAMERA_TARGET_FLOOR_OFFSET);
  clampVectorToGroundFloor(cameraState.target, CAMERA_TARGET_FLOOR_OFFSET);
  const eye = [
    cameraState.target[0] + Math.cos(cameraState.theta) * Math.sin(cameraState.phi) * cameraState.distance,
    cameraState.target[1] + Math.cos(cameraState.phi) * cameraState.distance,
    cameraState.target[2] + Math.sin(cameraState.theta) * Math.sin(cameraState.phi) * cameraState.distance
  ];
  clampVectorToGroundFloor(eye, CAMERA_EYE_FLOOR_OFFSET);
  clampVectorToBubbleInterior(eye, BUBBLE_RADIUS - 2.0);
  camera3d.position.fromArray(eye);
  camera3d.lookAt(cameraState.target[0], cameraState.target[1], cameraState.target[2]);
}

function lerpAngle(current, target, alpha) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * clamp(alpha, 0, 1);
}

function angleDelta(target, current) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

function bubbleBoyVelocitySpeed(velocity) {
  if (!velocity || typeof velocity !== "object") return 0;
  const x = Number.isFinite(velocity.x) ? velocity.x : 0;
  const z = Number.isFinite(velocity.z) ? velocity.z : 0;
  return Math.hypot(x, z);
}

function clampVectorToGroundFloor(vector, offset) {
  if (!Array.isArray(vector) || vector.length < 3) return vector;
  const floorY = groundHeightAt(vector[0], vector[2]) + offset;
  if (Number.isFinite(floorY) && vector[1] < floorY) vector[1] = floorY;
  return vector;
}

function clampVectorToBubbleInterior(vector, radius) {
  if (!Array.isArray(vector) || vector.length < 3) return vector;
  const bubbleCenterY = oceanSurfaceYAtRadius(BUBBLE_RING_RADIUS);
  const dx = Number(vector[0]) || 0;
  const dy = (Number(vector[1]) || 0) - bubbleCenterY;
  const dz = Number(vector[2]) || 0;
  const distance = Math.hypot(dx, dy, dz);
  const safeRadius = Math.max(1, radius);
  if (distance <= safeRadius) return vector;
  const scale = safeRadius / Math.max(0.001, distance);
  vector[0] = dx * scale;
  vector[1] = bubbleCenterY + dy * scale;
  vector[2] = dz * scale;
  return vector;
}

function presentationVisualByFamily(presentationState, family) {
  const visuals = presentationState && Array.isArray(presentationState.visuals) ? presentationState.visuals : [];
  return visuals.find((descriptor) => descriptor && descriptor.family === family) || null;
}

function syncTrace(canvas, env, celestial, simulationTicks, presentationState = null) {
  canvas.dataset.simTick = String(window.__toyboxWorldState.sim.tick);
  canvas.dataset.simTicksThisFrame = String(simulationTicks);
  const cameraDebug = typeof window !== "undefined" ? window.__toyboxCamera : null;
  canvas.dataset.cameraMode =
    cameraDebug && cameraDebug.state ? cameraDebug.state.cameraMode : canvas.dataset.cameraMode || "unknown";
  const cameraOcclusion = typeof window !== "undefined" ? window.__toyboxCameraOcclusion || {} : {};
  canvas.dataset.cameraOcclusionCount = String(Number(cameraOcclusion.activeCount || 0));
  canvas.dataset.envTimeOfDay = env.timeOfDay.toFixed(3);
  canvas.dataset.envPhase = env.phaseName;
  canvas.dataset.envWindStrength = env.windStrength.toFixed(3);
  canvas.dataset.envWindGust = env.wind.gust.toFixed(3);
  canvas.dataset.envFireIntensity = env.fireIntensity.toFixed(2);
  canvas.dataset.envSunIntensity = env.lighting.sunIntensity.toFixed(3);
  canvas.dataset.envMoonIntensity = env.lighting.moonIntensity.toFixed(3);
  canvas.dataset.envSunPosition = formatVector(celestial.sunPosition);
  canvas.dataset.envMoonPosition = formatVector(celestial.moonPosition);
  canvas.dataset.envActiveLightPosition = formatVector(celestial.dominantPosition);
  canvas.dataset.envActiveLightDirection = formatVector(celestial.dominantDirection);
  canvas.dataset.envDominantLight = celestial.dominantSource;
  canvas.dataset.envSourceLevel = env.lighting.sourceLevel.toFixed(3);
  canvas.dataset.celestialPhase = env.phaseName;
  canvas.dataset.celestialSunPosition = formatVector(celestial.sunPosition);
  canvas.dataset.celestialMoonPosition = formatVector(celestial.moonPosition);
  canvas.dataset.celestialActiveLightPosition = formatVector(celestial.dominantPosition);
  canvas.dataset.celestialActiveLightDirection = formatVector(celestial.dominantDirection);
  canvas.dataset.celestialDominantLight = celestial.dominantSource;
  canvas.dataset.celestialConvention = CARDINAL_CONVENTION;
  canvas.dataset.oceanCurved = "true";
  canvas.dataset.oceanRadius = OCEAN_RADIUS.toFixed(1);
  canvas.dataset.planetRadius = PLANET_RADIUS.toFixed(1);
  canvas.dataset.bubbleRadius = BUBBLE_RADIUS.toFixed(1);
  canvas.dataset.bubbleRingRadius = BUBBLE_RING_RADIUS.toFixed(1);
  const skyLife = typeof window !== "undefined" ? window.__toyboxSkyLife || {} : {};
  canvas.dataset.skyStarLayerCount = String(Number(skyLife.starLayerCount || 0));
  canvas.dataset.skyStarVisibility = Number(skyLife.starVisibility || 0).toFixed(3);
  canvas.dataset.skyCloudLayerCount = String(Number(skyLife.cloudLayerCount || 0));
  canvas.dataset.skyCloudSpriteCount = String(Number(skyLife.cloudSpriteCount || 0));
  canvas.dataset.skyCloudVisibility = Number(skyLife.cloudVisibility || 0).toFixed(3);
  canvas.dataset.skyBirdCount = String(Number(skyLife.birdCount || 0));
  canvas.dataset.skyBirdVisibility = Number(skyLife.birdVisibility || 0).toFixed(3);
  const simBoy = window.__toyboxWorldState.bubbleBoy;
  canvas.dataset.bubbleBoyBrain = "simulation";
  canvas.dataset.bubbleBoyGoal = simBoy.goal;
  canvas.dataset.bubbleBoyAction = simBoy.currentAction;
  canvas.dataset.bubbleBoyMood = simBoy.mood;
  canvas.dataset.bubbleBoyEnergy = Number(simBoy.energy || 0).toFixed(1);
  canvas.dataset.bubbleBoyHunger = Number(simBoy.hunger || 0).toFixed(1);
  canvas.dataset.bubbleBoyAttention = simBoy.attention || "idle";
  canvas.dataset.bubbleBoyFocus = simBoy.focus && simBoy.focus.kind ? simBoy.focus.kind : "unknown";
  canvas.dataset.bubbleBoyPosition = formatPlainVector(simBoy.position);
  canvas.dataset.bubbleBoyCarriedItem = simBoy.carriedItem || "";
  canvas.dataset.bubbleBoyCarriedObject = simBoy.carriedObject || "";
  canvas.dataset.bubbleBoyCarrying = simBoy.carrying || "";
  const firePit = window.__toyboxWorldState.objects[FIRE_PIT_ID] || {};
  canvas.dataset.firePitPosition = formatPlainVector(firePit.position);
  canvas.dataset.firePitLit = String(Boolean(firePit.lit));
  canvas.dataset.firePitFuel = Number(firePit.fuel || 0).toFixed(2);
  canvas.dataset.firePitWarmth = Number(firePit.warmth || 0).toFixed(2);
  const firstFireTrace = presentationVisualByFamily(presentationState, "firstFire") || {};
  const firstFireDebug = firstFireTrace.debug || {};
  canvas.dataset.firstFireVisible = String(Boolean(firstFireTrace.visible));
  canvas.dataset.firstFireStage = firstFireTrace.stage || "";
  canvas.dataset.firstFireVariant = firstFireTrace.variant || "";
  canvas.dataset.firstFireState = firstFireDebug.currentFamilyState || "";
  canvas.dataset.firstFireCookingSurfaceActive = String(Boolean(firstFireDebug.cookingSurfaceActive));
  canvas.dataset.firstFireAssetSourceId = firstFireTrace.source ? firstFireTrace.source.id || "" : "";
  canvas.dataset.firstFireAssetApprovalStatus = firstFireTrace.source
    ? firstFireTrace.source.approvalStatus || (firstFireTrace.source.approvedForUse ? "approved" : "unapproved")
    : "";
  canvas.dataset.firstFireTransformId = firstFireTrace.transform ? firstFireTrace.transform.id || "" : "";
  canvas.dataset.firstFireTransformNormalized = String(Boolean(firstFireTrace.transform));
  canvas.dataset.firstFireWorldStateHook = firstFireTrace.stateHook ? firstFireTrace.stateHook.state || "" : "";
  canvas.dataset.firstFireDuplicateSystemClassification = firstFireDebug.duplicateSystemClassification || "";
  canvas.dataset.firstFireFallbackReason = firstFireDebug.fallbackReason || "";
  const reviewTrace = typeof window !== "undefined" && window.__toyboxReview ? window.__toyboxReview.status() : {};
  canvas.dataset.reviewMode = String(Boolean(reviewTrace.enabled));
  canvas.dataset.reviewFamily = reviewTrace.family || "";
  canvas.dataset.reviewState = reviewTrace.state || "";
  canvas.dataset.reviewPresentationAction = reviewTrace.presentationAction || "";
  const arrivalTrace = typeof window !== "undefined" ? window.__toyboxArrivalSupplies || {} : {};
  canvas.dataset.arrivalSuppliesVisible = String(Boolean(arrivalTrace.visible));
  canvas.dataset.arrivalSuppliesStage = arrivalTrace.stage || "";
  canvas.dataset.arrivalSuppliesVariant = arrivalTrace.variant || "";
  canvas.dataset.arrivalSuppliesWashedBundle = String(Boolean(arrivalTrace.washedBundle));
  canvas.dataset.arrivalSuppliesScatteredSticks = String(Boolean(arrivalTrace.scatteredSticks));
  canvas.dataset.arrivalSuppliesScatteredLeaves = String(Boolean(arrivalTrace.scatteredLeaves));
  canvas.dataset.arrivalSuppliesMaterialPile = String(Boolean(arrivalTrace.materialPile));
  canvas.dataset.arrivalSuppliesCarryBundle = String(Boolean(arrivalTrace.carryBundle));
  canvas.dataset.arrivalSuppliesAssetSourceId = arrivalTrace.assetSourceId || "";
  canvas.dataset.arrivalSuppliesAssetApprovalStatus = arrivalTrace.assetApprovalStatus || "";
  canvas.dataset.arrivalSuppliesTransformId = arrivalTrace.transformId || "";
  canvas.dataset.arrivalSuppliesTransformNormalized = String(Boolean(arrivalTrace.transformNormalized));
  canvas.dataset.arrivalSuppliesWorldStateHook = arrivalTrace.worldStateHook || "";
  canvas.dataset.arrivalSuppliesDuplicateSystemClassification = arrivalTrace.duplicateSystemClassification || "";
  canvas.dataset.arrivalSuppliesFallbackReason = arrivalTrace.fallbackReason || "";
  const builderTrace = typeof window !== "undefined" ? window.__toyboxBuilderObjects || {} : {};
  const buildSite = window.__toyboxWorldState.objects[BUILD_SITE_ID] || {};
  canvas.dataset.builderRole = simBoy.role || "builder";
  canvas.dataset.builderActionState = simBoy.builder && simBoy.builder.actionState ? simBoy.builder.actionState : "idle";
  canvas.dataset.builderActiveBuildable = builderTrace.activeBuildableId || (simBoy.builder && simBoy.builder.project) || "";
  canvas.dataset.builderInventoryWood = Number((simBoy.inventory && simBoy.inventory.wood) || 0).toFixed(2);
  canvas.dataset.builderWorkbenchWood = Number(builderTrace.workbenchWood || 0).toFixed(2);
  canvas.dataset.builderBuildProgress = Number(buildSite.progress || (simBoy.builder && simBoy.builder.progress) || 0).toFixed(3);
  canvas.dataset.builderBuildComplete = String(Boolean(builderTrace.buildComplete || Number(buildSite.progress || 0) >= 0.999));
  canvas.dataset.builderBuildStoredWood = Number(builderTrace.storedWood || buildSite.storedWood || 0).toFixed(2);
  canvas.dataset.builderBuildRequiredWood = Number(builderTrace.requiredWood || buildSite.requiredWood || 0).toFixed(2);
  canvas.dataset.builderTargetId = simBoy.targetId || "";
  canvas.dataset.builderRenderedObjectCount = String(Number(builderTrace.renderedObjectCount || 0));
  canvas.dataset.builderWorkbenchPosition = formatVector(builderTrace.workbenchPosition || []);
  canvas.dataset.builderBuildSitePosition = formatVector(builderTrace.buildSitePosition || []);
  const restTrace = builderTrace.restShelter || {};
  canvas.dataset.restShelterVisible = String(Boolean(restTrace.visible));
  canvas.dataset.restShelterStage = restTrace.stage || "";
  canvas.dataset.restShelterVariant = restTrace.variant || "";
  canvas.dataset.restShelterRenderedVariant = restTrace.renderedVariant || "";
  canvas.dataset.restShelterActive = String(Boolean(restTrace.active));
  canvas.dataset.restShelterUsable = String(Boolean(restTrace.usable));
  canvas.dataset.restShelterAssetSourceId = restTrace.assetSourceId || "";
  canvas.dataset.restShelterAssetApprovalStatus = restTrace.assetApprovalStatus || "";
  canvas.dataset.restShelterTransformId = restTrace.transformId || "";
  canvas.dataset.restShelterTransformNormalized = String(Boolean(restTrace.transformNormalized));
  canvas.dataset.restShelterWorldStateHook = restTrace.worldStateHook || "";
  canvas.dataset.restShelterDuplicateSystemClassification = restTrace.duplicateSystemClassification || "";
  canvas.dataset.restShelterFallbackReason = restTrace.fallbackReason || "";
  const storageTrace = builderTrace.storageWorkbenchTools || {};
  canvas.dataset.storageWorkbenchToolsVisible = String(Boolean(storageTrace.visible));
  canvas.dataset.storageWorkbenchToolsStage = storageTrace.stage || "";
  canvas.dataset.storageWorkbenchToolsVariant = storageTrace.variant || "";
  canvas.dataset.storageWorkbenchToolsActive = String(Boolean(storageTrace.active));
  canvas.dataset.campStorageVisible = String(Boolean(storageTrace.campStorageVisible));
  canvas.dataset.campStorageStage = storageTrace.campStorageStage || "";
  canvas.dataset.campStorageWoodCount = Number(storageTrace.campStorageWoodCount || 0).toFixed(2);
  canvas.dataset.upgradedWorkbenchVisible = String(Boolean(storageTrace.workbenchUpgradedVisible));
  canvas.dataset.upgradedWorkbenchStage = storageTrace.workbenchStage || "";
  canvas.dataset.upgradedWorkbenchVariant = storageTrace.workbenchVariant || "";
  canvas.dataset.toolRackVisible = String(Boolean(storageTrace.toolRackVisible));
  canvas.dataset.toolRackStage = storageTrace.toolRackStage || "";
  canvas.dataset.toolRackSlotCount = String(Number(storageTrace.toolRackSlotCount || 0));
  canvas.dataset.firstToolVisible = String(Boolean(storageTrace.stoneToolVisible));
  canvas.dataset.firstToolHeldVisible = String(Boolean(storageTrace.heldToolVisible));
  canvas.dataset.buildPlankHeldVisible = String(Boolean(storageTrace.heldPlankVisible));
  canvas.dataset.buildRopeHeldVisible = String(Boolean(storageTrace.heldRopeVisible));
  canvas.dataset.storageMaterialHeldVisible = String(Boolean(storageTrace.heldStorageMaterialVisible));
  canvas.dataset.storageWorkbenchToolsAssetSourceId = storageTrace.assetSourceId || "";
  canvas.dataset.storageWorkbenchToolsAssetApprovalStatus = storageTrace.assetApprovalStatus || "";
  canvas.dataset.storageWorkbenchToolsTransformId = storageTrace.transformId || "";
  canvas.dataset.storageWorkbenchToolsTransformNormalized = String(Boolean(storageTrace.transformNormalized));
  canvas.dataset.storageWorkbenchToolsWorldStateHook = storageTrace.worldStateHook || "";
  canvas.dataset.storageWorkbenchToolsDuplicateSystemClassification = storageTrace.duplicateSystemClassification || "";
  canvas.dataset.storageWorkbenchToolsFallbackReason = storageTrace.fallbackReason || "";
  const campLayoutTrace = typeof window !== "undefined" ? window.__toyboxCampLayout || {} : {};
  canvas.dataset.campPathsVisible = String(Boolean(campLayoutTrace.campPathsVisible));
  canvas.dataset.campPathsStage = campLayoutTrace.campPathsStage || "";
  canvas.dataset.campPathsVariant = campLayoutTrace.campPathsVariant || "";
  canvas.dataset.campPathsActive = String(Boolean(campLayoutTrace.campPathsActive));
  canvas.dataset.campPathsActivePathCount = String(Number(campLayoutTrace.campPathsActivePathCount || 0));
  canvas.dataset.campPathsClearedPaths = Array.isArray(campLayoutTrace.campPathsClearedPaths)
    ? campLayoutTrace.campPathsClearedPaths.join("|")
    : "";
  canvas.dataset.campPathsLitPaths = Array.isArray(campLayoutTrace.campPathsLitPaths)
    ? campLayoutTrace.campPathsLitPaths.join("|")
    : "";
  canvas.dataset.campPathsRenderedSegmentCount = String(Number(campLayoutTrace.campPathsRenderedSegmentCount || 0));
  canvas.dataset.campPathsLitAnchorCount = String(Number(campLayoutTrace.campPathsLitAnchorCount || 0));
  canvas.dataset.campBoundaryStoneCount = String(Number(campLayoutTrace.boundaryStoneCount || 0));
  canvas.dataset.campPathToolHeldVisible = String(Boolean(campLayoutTrace.carriedPathToolVisible));
  canvas.dataset.campPathToolAttachmentId = campLayoutTrace.carriedPathToolAttachmentId || "";
  canvas.dataset.campZonesVisible = String(Boolean(campLayoutTrace.campZonesVisible));
  canvas.dataset.campZonesStage = campLayoutTrace.campZonesStage || "";
  canvas.dataset.campZonesMarkedZones = Array.isArray(campLayoutTrace.campZonesMarkedZones)
    ? campLayoutTrace.campZonesMarkedZones.join("|")
    : "";
  canvas.dataset.campZonesMarkedZoneCount = String(Number(campLayoutTrace.campZonesMarkedZoneCount || 0));
  canvas.dataset.campZonesRenderedMarkerCount = String(Number(campLayoutTrace.campZonesRenderedMarkerCount || 0));
  canvas.dataset.campCarriedBoundaryStoneVisible = String(Boolean(campLayoutTrace.carriedStoneVisible));
  canvas.dataset.campLayoutCarriedObject = campLayoutTrace.carriedObject || "";
  canvas.dataset.campLayoutRenderedObjectCount = String(Number(campLayoutTrace.renderedObjectCount || 0));
  canvas.dataset.campPathsAssetSourceId = campLayoutTrace.campPathsAssetSourceId || "";
  canvas.dataset.campPathsAssetApprovalStatus = campLayoutTrace.campPathsAssetApprovalStatus || "";
  canvas.dataset.campPathsTransformId = campLayoutTrace.campPathsTransformId || "";
  canvas.dataset.campPathsTransformNormalized = String(Boolean(campLayoutTrace.campPathsTransformNormalized));
  canvas.dataset.campPathsWorldStateHook = campLayoutTrace.campPathsWorldStateHook || "";
  canvas.dataset.campPathsDuplicateSystemClassification = campLayoutTrace.campPathsDuplicateSystemClassification || "";
  canvas.dataset.campPathsFallbackReason = campLayoutTrace.campPathsFallbackReason || "";
  canvas.dataset.campZonesAssetSourceId = campLayoutTrace.campZonesAssetSourceId || "";
  canvas.dataset.campZonesAssetApprovalStatus = campLayoutTrace.campZonesAssetApprovalStatus || "";
  canvas.dataset.campZonesTransformId = campLayoutTrace.campZonesTransformId || "";
  canvas.dataset.campZonesTransformNormalized = String(Boolean(campLayoutTrace.campZonesTransformNormalized));
  canvas.dataset.campZonesWorldStateHook = campLayoutTrace.campZonesWorldStateHook || "";
  canvas.dataset.campZonesDuplicateSystemClassification = campLayoutTrace.campZonesDuplicateSystemClassification || "";
  canvas.dataset.campZonesFallbackReason = campLayoutTrace.campZonesFallbackReason || "";
  const gardenTrace = typeof window !== "undefined" ? window.__toyboxGardenPlots || {} : {};
  canvas.dataset.gardenPlotsVisible = String(Boolean(gardenTrace.gardenPlotsVisible));
  canvas.dataset.gardenPlotsStage = gardenTrace.gardenPlotsStage || "";
  canvas.dataset.gardenPlotsVariant = gardenTrace.gardenPlotsVariant || "";
  canvas.dataset.gardenPlotsActive = String(Boolean(gardenTrace.gardenPlotsActive));
  canvas.dataset.gardenActivePlotId = gardenTrace.gardenActivePlotId || "";
  canvas.dataset.gardenCropType = gardenTrace.gardenCropType || "";
  canvas.dataset.gardenWatered = String(Boolean(gardenTrace.gardenWatered));
  canvas.dataset.gardenPlotCount = String(Number(gardenTrace.gardenPlotCount || 0));
  canvas.dataset.gardenSeededPlotCount = String(Number(gardenTrace.gardenSeededPlotCount || 0));
  canvas.dataset.gardenSproutPlotCount = String(Number(gardenTrace.gardenSproutPlotCount || 0));
  canvas.dataset.gardenMaturePlotCount = String(Number(gardenTrace.gardenMaturePlotCount || 0));
  canvas.dataset.gardenWateredPlotCount = String(Number(gardenTrace.gardenWateredPlotCount || 0));
  canvas.dataset.gardenRenderedPlotCount = String(Number(gardenTrace.gardenRenderedPlotCount || 0));
  canvas.dataset.gardenWaterCanVisible = String(Boolean(gardenTrace.carriedWaterCanVisible));
  canvas.dataset.gardenSeedPouchVisible = String(Boolean(gardenTrace.carriedSeedPouchVisible));
  canvas.dataset.gardenHarvestedCropVisible = String(Boolean(gardenTrace.carriedHarvestedCropVisible));
  canvas.dataset.gardenCarrying = gardenTrace.carrying || "";
  canvas.dataset.gardenPlotsAssetSourceId = gardenTrace.gardenPlotsAssetSourceId || "";
  canvas.dataset.gardenPlotsAssetApprovalStatus = gardenTrace.gardenPlotsAssetApprovalStatus || "";
  canvas.dataset.gardenPlotsTransformId = gardenTrace.gardenPlotsTransformId || "";
  canvas.dataset.gardenPlotsTransformNormalized = String(Boolean(gardenTrace.gardenPlotsTransformNormalized));
  canvas.dataset.gardenPlotsWorldStateHook = gardenTrace.gardenPlotsWorldStateHook || "";
  canvas.dataset.gardenPlotsDuplicateSystemClassification = gardenTrace.gardenPlotsDuplicateSystemClassification || "";
  canvas.dataset.gardenPlotsFallbackReason = gardenTrace.gardenPlotsFallbackReason || "";
  const foodTrace = typeof window !== "undefined" ? window.__toyboxFoodRoutine || {} : {};
  canvas.dataset.foodRoutineVisible = String(Boolean(foodTrace.foodRoutineVisible));
  canvas.dataset.foodRoutineStage = foodTrace.foodRoutineStage || "";
  canvas.dataset.foodRoutineVariant = foodTrace.foodRoutineVariant || "";
  canvas.dataset.foodRoutineActive = String(Boolean(foodTrace.foodRoutineActive));
  canvas.dataset.foodRoutineCookSurfaceVisible = String(Boolean(foodTrace.foodRoutineCookSurfaceVisible));
  canvas.dataset.foodRoutineBasketVisible = String(Boolean(foodTrace.foodRoutineBasketVisible));
  canvas.dataset.foodRoutineStoredMealsVisible = String(Boolean(foodTrace.foodRoutineStoredMealsVisible));
  canvas.dataset.foodRoutineDryingRackVisible = String(Boolean(foodTrace.foodRoutineDryingRackVisible));
  canvas.dataset.foodRoutineFishHarvestVisible = String(Boolean(foodTrace.foodRoutineFishHarvestVisible));
  canvas.dataset.foodRoutineLeftoversVisible = String(Boolean(foodTrace.foodRoutineLeftoversVisible));
  canvas.dataset.foodRoutineBasketStock = String(Number(foodTrace.foodRoutineBasketStock || 0));
  canvas.dataset.foodRoutineMealCount = String(Number(foodTrace.foodRoutineMealCount || 0));
  canvas.dataset.foodRoutineDriedFishCount = String(Number(foodTrace.foodRoutineDriedFishCount || 0));
  canvas.dataset.foodRoutineHarvestCount = String(Number(foodTrace.foodRoutineHarvestCount || 0));
  canvas.dataset.foodRoutineLeftoverCount = String(Number(foodTrace.foodRoutineLeftoverCount || 0));
  canvas.dataset.foodRoutineRenderedObjectCount = String(Number(foodTrace.renderedObjectCount || 0));
  canvas.dataset.foodRoutineAssetSourceId = foodTrace.foodRoutineAssetSourceId || "";
  canvas.dataset.foodRoutineAssetApprovalStatus = foodTrace.foodRoutineAssetApprovalStatus || "";
  canvas.dataset.foodRoutineTransformId = foodTrace.foodRoutineTransformId || "";
  canvas.dataset.foodRoutineTransformNormalized = String(Boolean(foodTrace.foodRoutineTransformNormalized));
  canvas.dataset.foodRoutineWorldStateHook = foodTrace.foodRoutineWorldStateHook || "";
  canvas.dataset.foodRoutineDuplicateSystemClassification = foodTrace.foodRoutineDuplicateSystemClassification || "";
  canvas.dataset.foodRoutineFallbackReason = foodTrace.foodRoutineFallbackReason || "";
  const fishTrapTrace = typeof window !== "undefined" ? window.__toyboxFishTrapRoutine || {} : {};
  canvas.dataset.fishTrapRoutineVisible = String(Boolean(fishTrapTrace.fishTrapRoutineVisible));
  canvas.dataset.fishTrapRoutineStage = fishTrapTrace.fishTrapRoutineStage || "";
  canvas.dataset.fishTrapRoutineVariant = fishTrapTrace.fishTrapRoutineVariant || "";
  canvas.dataset.fishTrapRoutineActive = String(Boolean(fishTrapTrace.fishTrapRoutineActive));
  canvas.dataset.fishTrapRoutineTrapState = fishTrapTrace.fishTrapRoutineTrapState || "";
  canvas.dataset.fishTrapRoutineTrapVisible = String(Boolean(fishTrapTrace.fishTrapRoutineTrapVisible));
  canvas.dataset.fishTrapRoutineBuoyVisible = String(Boolean(fishTrapTrace.fishTrapRoutineBuoyVisible));
  canvas.dataset.fishTrapRoutineLineVisible = String(Boolean(fishTrapTrace.fishTrapRoutineLineVisible));
  canvas.dataset.fishTrapRoutineStateCuesVisible = String(Boolean(fishTrapTrace.fishTrapRoutineStateCuesVisible));
  canvas.dataset.fishTrapRoutineDryingRackVisible = String(Boolean(fishTrapTrace.fishTrapRoutineDryingRackVisible));
  canvas.dataset.fishTrapRoutineCatchDisplayVisible = String(Boolean(fishTrapTrace.fishTrapRoutineCatchDisplayVisible));
  canvas.dataset.fishTrapRoutineCarriedRodVisible =
    String(Boolean(fishTrapTrace.fishTrapRoutineCarriedRodVisible));
  canvas.dataset.fishTrapRoutineCarriedTrapVisible =
    String(Boolean(fishTrapTrace.fishTrapRoutineCarriedTrapVisible));
  canvas.dataset.fishTrapRoutineCarriedCatchVisible =
    String(Boolean(fishTrapTrace.fishTrapRoutineCarriedCatchVisible));
  canvas.dataset.fishTrapRoutineTrapCount = String(Number(fishTrapTrace.fishTrapRoutineTrapCount || 0));
  canvas.dataset.fishTrapRoutineBuoyCount = String(Number(fishTrapTrace.fishTrapRoutineBuoyCount || 0));
  canvas.dataset.fishTrapRoutineLineCount = String(Number(fishTrapTrace.fishTrapRoutineLineCount || 0));
  canvas.dataset.fishTrapRoutineStateCueCount = String(Number(fishTrapTrace.fishTrapRoutineStateCueCount || 0));
  canvas.dataset.fishTrapRoutineDryingRackCount = String(Number(fishTrapTrace.fishTrapRoutineDryingRackCount || 0));
  canvas.dataset.fishTrapRoutineCatchDisplayCount = String(Number(fishTrapTrace.fishTrapRoutineCatchDisplayCount || 0));
  canvas.dataset.fishTrapRoutineFishCount = String(Number(fishTrapTrace.fishTrapRoutineFishCount || 0));
  canvas.dataset.fishTrapRoutineCrabCount = String(Number(fishTrapTrace.fishTrapRoutineCrabCount || 0));
  canvas.dataset.fishTrapRoutineDryingFishCount = String(Number(fishTrapTrace.fishTrapRoutineDryingFishCount || 0));
  canvas.dataset.fishTrapRoutineCarriedAttachmentCount =
    String(Number(fishTrapTrace.fishTrapRoutineCarriedAttachmentCount || 0));
  canvas.dataset.fishTrapRoutineRenderedObjectCount = String(Number(fishTrapTrace.renderedObjectCount || 0));
  canvas.dataset.fishTrapRoutineAssetSourceId = fishTrapTrace.fishTrapRoutineAssetSourceId || "";
  canvas.dataset.fishTrapRoutineAssetApprovalStatus = fishTrapTrace.fishTrapRoutineAssetApprovalStatus || "";
  canvas.dataset.fishTrapRoutineTransformId = fishTrapTrace.fishTrapRoutineTransformId || "";
  canvas.dataset.fishTrapRoutineTransformNormalized = String(Boolean(fishTrapTrace.fishTrapRoutineTransformNormalized));
  canvas.dataset.fishTrapRoutineWorldStateHook = fishTrapTrace.fishTrapRoutineWorldStateHook || "";
  canvas.dataset.fishTrapRoutineDuplicateSystemClassification = fishTrapTrace.fishTrapRoutineDuplicateSystemClassification || "";
  canvas.dataset.fishTrapRoutinePlaceholderNote = fishTrapTrace.fishTrapRoutinePlaceholderNote || "";
  canvas.dataset.fishTrapRoutineFallbackReason = fishTrapTrace.fishTrapRoutineFallbackReason || "";
  const toyPlaySetTrace = typeof window !== "undefined" ? window.__toyboxToyPlaySet || {} : {};
  canvas.dataset.toyPlaySetVisible = String(Boolean(toyPlaySetTrace.toyPlaySetVisible));
  canvas.dataset.toyPlaySetStage = toyPlaySetTrace.toyPlaySetStage || "";
  canvas.dataset.toyPlaySetVariant = toyPlaySetTrace.toyPlaySetVariant || "";
  canvas.dataset.toyPlaySetActive = String(Boolean(toyPlaySetTrace.toyPlaySetActive));
  canvas.dataset.toyPlaySetCollectionSlotsVisible = String(Boolean(toyPlaySetTrace.toyPlaySetCollectionSlotsVisible));
  canvas.dataset.toyPlaySetToyBlocksVisible = String(Boolean(toyPlaySetTrace.toyPlaySetToyBlocksVisible));
  canvas.dataset.toyPlaySetBallVisible = String(Boolean(toyPlaySetTrace.toyPlaySetBallVisible));
  canvas.dataset.toyPlaySetKiteVisible = String(Boolean(toyPlaySetTrace.toyPlaySetKiteVisible));
  canvas.dataset.toyPlaySetKiteStringVisible = String(Boolean(toyPlaySetTrace.toyPlaySetKiteStringVisible));
  canvas.dataset.toyPlaySetKiteHandleVisible = String(Boolean(toyPlaySetTrace.toyPlaySetKiteHandleVisible));
  canvas.dataset.toyPlaySetSpinningTopVisible = String(Boolean(toyPlaySetTrace.toyPlaySetSpinningTopVisible));
  canvas.dataset.toyPlaySetPlayMatVisible = String(Boolean(toyPlaySetTrace.toyPlaySetPlayMatVisible));
  canvas.dataset.toyPlaySetCarriedBlockVisible = String(Boolean(toyPlaySetTrace.toyPlaySetCarriedBlockVisible));
  canvas.dataset.toyPlaySetCarriedBallVisible = String(Boolean(toyPlaySetTrace.toyPlaySetCarriedBallVisible));
  canvas.dataset.toyPlaySetCarriedKiteVisible = String(Boolean(toyPlaySetTrace.toyPlaySetCarriedKiteVisible));
  canvas.dataset.toyPlaySetCarriedTopVisible = String(Boolean(toyPlaySetTrace.toyPlaySetCarriedTopVisible));
  canvas.dataset.toyPlaySetCollectionSlotCount = String(Number(toyPlaySetTrace.toyPlaySetCollectionSlotCount || 0));
  canvas.dataset.toyPlaySetBlockCount = String(Number(toyPlaySetTrace.toyPlaySetBlockCount || 0));
  canvas.dataset.toyPlaySetBallCount = String(Number(toyPlaySetTrace.toyPlaySetBallCount || 0));
  canvas.dataset.toyPlaySetKiteCount = String(Number(toyPlaySetTrace.toyPlaySetKiteCount || 0));
  canvas.dataset.toyPlaySetStringCount = String(Number(toyPlaySetTrace.toyPlaySetStringCount || 0));
  canvas.dataset.toyPlaySetHandleCount = String(Number(toyPlaySetTrace.toyPlaySetHandleCount || 0));
  canvas.dataset.toyPlaySetSpinningTopCount = String(Number(toyPlaySetTrace.toyPlaySetSpinningTopCount || 0));
  canvas.dataset.toyPlaySetPlayMatCount = String(Number(toyPlaySetTrace.toyPlaySetPlayMatCount || 0));
  canvas.dataset.toyPlaySetCarriedAttachmentCount =
    String(Number(toyPlaySetTrace.toyPlaySetCarriedAttachmentCount || 0));
  canvas.dataset.toyPlaySetRenderedObjectCount = String(Number(toyPlaySetTrace.renderedObjectCount || 0));
  canvas.dataset.toyPlaySetExistingBuildableId = toyPlaySetTrace.toyPlaySetExistingBuildableId || "";
  canvas.dataset.toyPlaySetExistingUseSlotAction = toyPlaySetTrace.toyPlaySetExistingUseSlotAction || "";
  canvas.dataset.toyPlaySetAssetSourceId = toyPlaySetTrace.toyPlaySetAssetSourceId || "";
  canvas.dataset.toyPlaySetAssetApprovalStatus = toyPlaySetTrace.toyPlaySetAssetApprovalStatus || "";
  canvas.dataset.toyPlaySetTransformId = toyPlaySetTrace.toyPlaySetTransformId || "";
  canvas.dataset.toyPlaySetTransformNormalized = String(Boolean(toyPlaySetTrace.toyPlaySetTransformNormalized));
  canvas.dataset.toyPlaySetWorldStateHook = toyPlaySetTrace.toyPlaySetWorldStateHook || "";
  canvas.dataset.toyPlaySetDuplicateSystemClassification =
    toyPlaySetTrace.toyPlaySetDuplicateSystemClassification || "";
  canvas.dataset.toyPlaySetPlaceholderNote = toyPlaySetTrace.toyPlaySetPlaceholderNote || "";
  canvas.dataset.toyPlaySetFallbackReason = toyPlaySetTrace.toyPlaySetFallbackReason || "";
  const musicArtDecorTrace = typeof window !== "undefined" ? window.__toyboxMusicArtDecor || {} : {};
  canvas.dataset.musicArtDecorVisible = String(Boolean(musicArtDecorTrace.musicArtDecorVisible));
  canvas.dataset.musicArtDecorStage = musicArtDecorTrace.musicArtDecorStage || "";
  canvas.dataset.musicArtDecorVariant = musicArtDecorTrace.musicArtDecorVariant || "";
  canvas.dataset.musicArtDecorActive = String(Boolean(musicArtDecorTrace.musicArtDecorActive));
  canvas.dataset.musicArtDecorShellChimeVisible = String(Boolean(musicArtDecorTrace.musicArtDecorShellChimeVisible));
  canvas.dataset.musicArtDecorPaintedStonesVisible =
    String(Boolean(musicArtDecorTrace.musicArtDecorPaintedStonesVisible));
  canvas.dataset.musicArtDecorDrumVisible = String(Boolean(musicArtDecorTrace.musicArtDecorDrumVisible));
  canvas.dataset.musicArtDecorFluteVisible = String(Boolean(musicArtDecorTrace.musicArtDecorFluteVisible));
  canvas.dataset.musicArtDecorHangingDecorationVisible =
    String(Boolean(musicArtDecorTrace.musicArtDecorHangingDecorationVisible));
  canvas.dataset.musicArtDecorArtDisplaySlotVisible =
    String(Boolean(musicArtDecorTrace.musicArtDecorArtDisplaySlotVisible));
  canvas.dataset.musicArtDecorPerformanceMarkerVisible =
    String(Boolean(musicArtDecorTrace.musicArtDecorPerformanceMarkerVisible));
  canvas.dataset.musicArtDecorNoteMarkersVisible =
    String(Boolean(musicArtDecorTrace.musicArtDecorNoteMarkersVisible));
  canvas.dataset.musicArtDecorShellChimeCount = String(Number(musicArtDecorTrace.musicArtDecorShellChimeCount || 0));
  canvas.dataset.musicArtDecorPaintedStoneCount =
    String(Number(musicArtDecorTrace.musicArtDecorPaintedStoneCount || 0));
  canvas.dataset.musicArtDecorDrumCount = String(Number(musicArtDecorTrace.musicArtDecorDrumCount || 0));
  canvas.dataset.musicArtDecorFluteCount = String(Number(musicArtDecorTrace.musicArtDecorFluteCount || 0));
  canvas.dataset.musicArtDecorHangingDecorationCount =
    String(Number(musicArtDecorTrace.musicArtDecorHangingDecorationCount || 0));
  canvas.dataset.musicArtDecorArtDisplaySlotCount =
    String(Number(musicArtDecorTrace.musicArtDecorArtDisplaySlotCount || 0));
  canvas.dataset.musicArtDecorPerformanceMarkerCount =
    String(Number(musicArtDecorTrace.musicArtDecorPerformanceMarkerCount || 0));
  canvas.dataset.musicArtDecorNoteMarkerCount =
    String(Number(musicArtDecorTrace.musicArtDecorNoteMarkerCount || 0));
  canvas.dataset.musicArtDecorRenderedObjectCount = String(Number(musicArtDecorTrace.renderedObjectCount || 0));
  canvas.dataset.musicArtDecorStaticMarkerPoolSize =
    String(Number(musicArtDecorTrace.staticMarkerPoolSize || 0));
  canvas.dataset.musicArtDecorAssetSourceId = musicArtDecorTrace.musicArtDecorAssetSourceId || "";
  canvas.dataset.musicArtDecorAssetApprovalStatus = musicArtDecorTrace.musicArtDecorAssetApprovalStatus || "";
  canvas.dataset.musicArtDecorTransformId = musicArtDecorTrace.musicArtDecorTransformId || "";
  canvas.dataset.musicArtDecorTransformNormalized =
    String(Boolean(musicArtDecorTrace.musicArtDecorTransformNormalized));
  canvas.dataset.musicArtDecorWorldStateHook = musicArtDecorTrace.musicArtDecorWorldStateHook || "";
  canvas.dataset.musicArtDecorDuplicateSystemClassification =
    musicArtDecorTrace.musicArtDecorDuplicateSystemClassification || "";
  canvas.dataset.musicArtDecorPlaceholderNote = musicArtDecorTrace.musicArtDecorPlaceholderNote || "";
  canvas.dataset.musicArtDecorParticlePerformanceNote =
    musicArtDecorTrace.musicArtDecorParticlePerformanceNote || "";
  canvas.dataset.musicArtDecorFallbackReason = musicArtDecorTrace.musicArtDecorFallbackReason || "";
  const animalFamiliarVisitorTrace =
    typeof window !== "undefined" ? window.__toyboxAnimalFamiliarVisitor || {} : {};
  canvas.dataset.animalFamiliarVisitorVisible =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorVisible));
  canvas.dataset.animalFamiliarVisitorStage = animalFamiliarVisitorTrace.animalFamiliarVisitorStage || "";
  canvas.dataset.animalFamiliarVisitorVariant = animalFamiliarVisitorTrace.animalFamiliarVisitorVariant || "";
  canvas.dataset.animalFamiliarVisitorActive =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorActive));
  canvas.dataset.animalFamiliarVisitorGroundVisitorVisible =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorGroundVisitorVisible));
  canvas.dataset.animalFamiliarVisitorBirdVisitorVisible =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorBirdVisitorVisible));
  canvas.dataset.animalFamiliarVisitorFishVisitorVisible =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorFishVisitorVisible));
  canvas.dataset.animalFamiliarVisitorFoodCrumbsVisible =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorFoodCrumbsVisible));
  canvas.dataset.animalFamiliarVisitorObserveRingVisible =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorObserveRingVisible));
  canvas.dataset.animalFamiliarVisitorApproachMarkersVisible =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorApproachMarkersVisible));
  canvas.dataset.animalFamiliarVisitorAnimalCount =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorAnimalCount || 0));
  canvas.dataset.animalFamiliarVisitorBirdVisitorCount =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorBirdVisitorCount || 0));
  canvas.dataset.animalFamiliarVisitorFishVisitorCount =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorFishVisitorCount || 0));
  canvas.dataset.animalFamiliarVisitorFoodCrumbCount =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorFoodCrumbCount || 0));
  canvas.dataset.animalFamiliarVisitorObserveRingCount =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorObserveRingCount || 0));
  canvas.dataset.animalFamiliarVisitorApproachMarkerCount =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorApproachMarkerCount || 0));
  canvas.dataset.animalFamiliarVisitorRenderedObjectCount =
    String(Number(animalFamiliarVisitorTrace.renderedObjectCount || 0));
  canvas.dataset.animalFamiliarVisitorPooledObjectCount =
    String(Number(animalFamiliarVisitorTrace.pooledObjectCount || 0));
  canvas.dataset.animalFamiliarVisitorObserveRadius =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorObserveRadius || 0));
  canvas.dataset.animalFamiliarVisitorApproachDistance =
    String(Number(animalFamiliarVisitorTrace.animalFamiliarVisitorApproachDistance || 0));
  canvas.dataset.animalFamiliarVisitorCollisionEnabled =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorCollisionEnabled));
  canvas.dataset.animalFamiliarVisitorBlocksMovement =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorBlocksMovement));
  canvas.dataset.animalFamiliarVisitorAffectsCameraFollow =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorAffectsCameraFollow));
  canvas.dataset.animalFamiliarVisitorAssetSourceId =
    animalFamiliarVisitorTrace.animalFamiliarVisitorAssetSourceId || "";
  canvas.dataset.animalFamiliarVisitorAssetApprovalStatus =
    animalFamiliarVisitorTrace.animalFamiliarVisitorAssetApprovalStatus || "";
  canvas.dataset.animalFamiliarVisitorTransformId =
    animalFamiliarVisitorTrace.animalFamiliarVisitorTransformId || "";
  canvas.dataset.animalFamiliarVisitorTransformNormalized =
    String(Boolean(animalFamiliarVisitorTrace.animalFamiliarVisitorTransformNormalized));
  canvas.dataset.animalFamiliarVisitorWorldStateHook =
    animalFamiliarVisitorTrace.animalFamiliarVisitorWorldStateHook || "";
  canvas.dataset.animalFamiliarVisitorDuplicateSystemClassification =
    animalFamiliarVisitorTrace.animalFamiliarVisitorDuplicateSystemClassification || "";
  canvas.dataset.animalFamiliarVisitorNonblockingNote =
    animalFamiliarVisitorTrace.animalFamiliarVisitorNonblockingNote || "";
  canvas.dataset.animalFamiliarVisitorPlaceholderNote =
    animalFamiliarVisitorTrace.animalFamiliarVisitorPlaceholderNote || "";
  canvas.dataset.animalFamiliarVisitorFallbackReason =
    animalFamiliarVisitorTrace.animalFamiliarVisitorFallbackReason || "";
  const nightComfortLightsTrace = typeof window !== "undefined" ? window.__toyboxNightComfortLights || {} : {};
  canvas.dataset.nightComfortLightsVisible = String(Boolean(nightComfortLightsTrace.nightComfortLightsVisible));
  canvas.dataset.nightComfortLightsStage = nightComfortLightsTrace.nightComfortLightsStage || "";
  canvas.dataset.nightComfortLightsVariant = nightComfortLightsTrace.nightComfortLightsVariant || "";
  canvas.dataset.nightComfortLightsActive = String(Boolean(nightComfortLightsTrace.nightComfortLightsActive));
  canvas.dataset.nightComfortLightsLanternPostsVisible =
    String(Boolean(nightComfortLightsTrace.nightComfortLightsLanternPostsVisible));
  canvas.dataset.nightComfortLightsLitPathAnchorsVisible =
    String(Boolean(nightComfortLightsTrace.nightComfortLightsLitPathAnchorsVisible));
  canvas.dataset.nightComfortLightsGlowingShellsVisible =
    String(Boolean(nightComfortLightsTrace.nightComfortLightsGlowingShellsVisible));
  canvas.dataset.nightComfortLightsFirefliesVisible =
    String(Boolean(nightComfortLightsTrace.nightComfortLightsFirefliesVisible));
  canvas.dataset.nightComfortLightsSitAnchorVisible =
    String(Boolean(nightComfortLightsTrace.nightComfortLightsSitAnchorVisible));
  canvas.dataset.nightComfortLightsLanternPostCount =
    String(Number(nightComfortLightsTrace.nightComfortLightsLanternPostCount || 0));
  canvas.dataset.nightComfortLightsLitPathAnchorCount =
    String(Number(nightComfortLightsTrace.nightComfortLightsLitPathAnchorCount || 0));
  canvas.dataset.nightComfortLightsGlowingShellCount =
    String(Number(nightComfortLightsTrace.nightComfortLightsGlowingShellCount || 0));
  canvas.dataset.nightComfortLightsFireflyCount =
    String(Number(nightComfortLightsTrace.nightComfortLightsFireflyCount || 0));
  canvas.dataset.nightComfortLightsSitAnchorCount =
    String(Number(nightComfortLightsTrace.nightComfortLightsSitAnchorCount || 0));
  canvas.dataset.nightComfortLightsRenderedObjectCount =
    String(Number(nightComfortLightsTrace.renderedObjectCount || 0));
  canvas.dataset.nightComfortLightsPooledObjectCount =
    String(Number(nightComfortLightsTrace.pooledObjectCount || 0));
  canvas.dataset.nightComfortLightsDynamicLightCount =
    String(Number(nightComfortLightsTrace.nightComfortLightsDynamicLightCount || 0));
  canvas.dataset.nightComfortLightsUsesDynamicLights =
    String(Boolean(nightComfortLightsTrace.nightComfortLightsUsesDynamicLights));
  canvas.dataset.nightComfortLightsMaxFireflySprites =
    String(Number(nightComfortLightsTrace.nightComfortLightsMaxFireflySprites || 0));
  canvas.dataset.nightComfortLightsAssetSourceId =
    nightComfortLightsTrace.nightComfortLightsAssetSourceId || "";
  canvas.dataset.nightComfortLightsAssetApprovalStatus =
    nightComfortLightsTrace.nightComfortLightsAssetApprovalStatus || "";
  canvas.dataset.nightComfortLightsTransformId =
    nightComfortLightsTrace.nightComfortLightsTransformId || "";
  canvas.dataset.nightComfortLightsTransformNormalized =
    String(Boolean(nightComfortLightsTrace.nightComfortLightsTransformNormalized));
  canvas.dataset.nightComfortLightsWorldStateHook =
    nightComfortLightsTrace.nightComfortLightsWorldStateHook || "";
  canvas.dataset.nightComfortLightsDuplicateSystemClassification =
    nightComfortLightsTrace.nightComfortLightsDuplicateSystemClassification || "";
  canvas.dataset.nightComfortLightsLightPerformanceNote =
    nightComfortLightsTrace.nightComfortLightsLightPerformanceNote || "";
  canvas.dataset.nightComfortLightsPlaceholderNote =
    nightComfortLightsTrace.nightComfortLightsPlaceholderNote || "";
  canvas.dataset.nightComfortLightsFallbackReason =
    nightComfortLightsTrace.nightComfortLightsFallbackReason || "";
  const lookoutMapHorizonTrace = typeof window !== "undefined" ? window.__toyboxLookoutMapHorizon || {} : {};
  canvas.dataset.lookoutMapHorizonVisible = String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonVisible));
  canvas.dataset.lookoutMapHorizonStage = lookoutMapHorizonTrace.lookoutMapHorizonStage || "";
  canvas.dataset.lookoutMapHorizonVariant = lookoutMapHorizonTrace.lookoutMapHorizonVariant || "";
  canvas.dataset.lookoutMapHorizonActive = String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonActive));
  canvas.dataset.lookoutMapHorizonPlatformVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonPlatformVisible));
  canvas.dataset.lookoutMapHorizonStepsVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonStepsVisible));
  canvas.dataset.lookoutMapHorizonMapBoardVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonMapBoardVisible));
  canvas.dataset.lookoutMapHorizonSketchMapVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonSketchMapVisible));
  canvas.dataset.lookoutMapHorizonHorizonMarkerVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonHorizonMarkerVisible));
  canvas.dataset.lookoutMapHorizonHorizonHighlightVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonHorizonHighlightVisible));
  canvas.dataset.lookoutMapHorizonKeepsakeDisplayVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonKeepsakeDisplayVisible));
  canvas.dataset.lookoutMapHorizonDay100GatheringVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonDay100GatheringVisible));
  canvas.dataset.lookoutMapHorizonUseSlotVisible =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonUseSlotVisible));
  canvas.dataset.lookoutMapHorizonPlatformCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonPlatformCount || 0));
  canvas.dataset.lookoutMapHorizonStepCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonStepCount || 0));
  canvas.dataset.lookoutMapHorizonMapBoardCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonMapBoardCount || 0));
  canvas.dataset.lookoutMapHorizonSketchMapCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonSketchMapCount || 0));
  canvas.dataset.lookoutMapHorizonHorizonMarkerCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonHorizonMarkerCount || 0));
  canvas.dataset.lookoutMapHorizonHorizonHighlightCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonHorizonHighlightCount || 0));
  canvas.dataset.lookoutMapHorizonKeepsakeCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonKeepsakeCount || 0));
  canvas.dataset.lookoutMapHorizonGatheringDetailCount =
    String(Number(lookoutMapHorizonTrace.lookoutMapHorizonGatheringDetailCount || 0));
  canvas.dataset.lookoutMapHorizonRenderedObjectCount =
    String(Number(lookoutMapHorizonTrace.renderedObjectCount || 0));
  canvas.dataset.lookoutMapHorizonPooledObjectCount =
    String(Number(lookoutMapHorizonTrace.pooledObjectCount || 0));
  canvas.dataset.lookoutMapHorizonClimbingEnabled =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonClimbingEnabled));
  canvas.dataset.lookoutMapHorizonVerticalMovementEnabled =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonVerticalMovementEnabled));
  canvas.dataset.lookoutMapHorizonMapDiscoveryEnabled =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonMapDiscoveryEnabled));
  canvas.dataset.lookoutMapHorizonDay100CompletionEnabled =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonDay100CompletionEnabled));
  canvas.dataset.lookoutMapHorizonAssetSourceId =
    lookoutMapHorizonTrace.lookoutMapHorizonAssetSourceId || "";
  canvas.dataset.lookoutMapHorizonAssetApprovalStatus =
    lookoutMapHorizonTrace.lookoutMapHorizonAssetApprovalStatus || "";
  canvas.dataset.lookoutMapHorizonTransformId =
    lookoutMapHorizonTrace.lookoutMapHorizonTransformId || "";
  canvas.dataset.lookoutMapHorizonTransformNormalized =
    String(Boolean(lookoutMapHorizonTrace.lookoutMapHorizonTransformNormalized));
  canvas.dataset.lookoutMapHorizonWorldStateHook =
    lookoutMapHorizonTrace.lookoutMapHorizonWorldStateHook || "";
  canvas.dataset.lookoutMapHorizonDuplicateSystemClassification =
    lookoutMapHorizonTrace.lookoutMapHorizonDuplicateSystemClassification || "";
  canvas.dataset.lookoutMapHorizonMovementDiscoveryNote =
    lookoutMapHorizonTrace.lookoutMapHorizonMovementDiscoveryNote || "";
  canvas.dataset.lookoutMapHorizonPlaceholderNote =
    lookoutMapHorizonTrace.lookoutMapHorizonPlaceholderNote || "";
  canvas.dataset.lookoutMapHorizonFallbackReason =
    lookoutMapHorizonTrace.lookoutMapHorizonFallbackReason || "";
  const majorProjectCapstoneTrace = typeof window !== "undefined" ? window.__toyboxMajorProjectCapstone || {} : {};
  canvas.dataset.majorProjectCapstoneVisible =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneVisible));
  canvas.dataset.majorProjectCapstoneStage = majorProjectCapstoneTrace.majorProjectCapstoneStage || "";
  canvas.dataset.majorProjectCapstoneVariant = majorProjectCapstoneTrace.majorProjectCapstoneVariant || "";
  canvas.dataset.majorProjectCapstoneSelectedOption =
    majorProjectCapstoneTrace.majorProjectCapstoneSelectedOption || "";
  canvas.dataset.majorProjectCapstoneActive =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneActive));
  canvas.dataset.majorProjectCapstoneStage0SuppliesVisible =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneStage0SuppliesVisible));
  canvas.dataset.majorProjectCapstonePartialBuildVisible =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstonePartialBuildVisible));
  canvas.dataset.majorProjectCapstoneMostlyBuiltVisible =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneMostlyBuiltVisible));
  canvas.dataset.majorProjectCapstoneCompleteBuildVisible =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneCompleteBuildVisible));
  canvas.dataset.majorProjectCapstonePlaceSettingsVisible =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstonePlaceSettingsVisible));
  canvas.dataset.majorProjectCapstoneCelebrationDetailVisible =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneCelebrationDetailVisible));
  canvas.dataset.majorProjectCapstoneSupplyMarkerCount =
    String(Number(majorProjectCapstoneTrace.majorProjectCapstoneSupplyMarkerCount || 0));
  canvas.dataset.majorProjectCapstoneTableLegCount =
    String(Number(majorProjectCapstoneTrace.majorProjectCapstoneTableLegCount || 0));
  canvas.dataset.majorProjectCapstoneTabletopPieceCount =
    String(Number(majorProjectCapstoneTrace.majorProjectCapstoneTabletopPieceCount || 0));
  canvas.dataset.majorProjectCapstoneBenchCount =
    String(Number(majorProjectCapstoneTrace.majorProjectCapstoneBenchCount || 0));
  canvas.dataset.majorProjectCapstonePlaceSettingCount =
    String(Number(majorProjectCapstoneTrace.majorProjectCapstonePlaceSettingCount || 0));
  canvas.dataset.majorProjectCapstoneCelebrationDetailCount =
    String(Number(majorProjectCapstoneTrace.majorProjectCapstoneCelebrationDetailCount || 0));
  canvas.dataset.majorProjectCapstoneRenderedObjectCount =
    String(Number(majorProjectCapstoneTrace.renderedObjectCount || 0));
  canvas.dataset.majorProjectCapstonePooledObjectCount =
    String(Number(majorProjectCapstoneTrace.pooledObjectCount || 0));
  canvas.dataset.majorProjectCapstoneResourcePlanningEnabled =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneResourcePlanningEnabled));
  canvas.dataset.majorProjectCapstoneConstructionMechanicsEnabled =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneConstructionMechanicsEnabled));
  canvas.dataset.majorProjectCapstoneMilestoneLogicEnabled =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneMilestoneLogicEnabled));
  canvas.dataset.majorProjectCapstoneTravelDiscoveryEnabled =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneTravelDiscoveryEnabled));
  canvas.dataset.majorProjectCapstoneDay100CompletionEnabled =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneDay100CompletionEnabled));
  canvas.dataset.majorProjectCapstoneAssetSourceId =
    majorProjectCapstoneTrace.majorProjectCapstoneAssetSourceId || "";
  canvas.dataset.majorProjectCapstoneAssetApprovalStatus =
    majorProjectCapstoneTrace.majorProjectCapstoneAssetApprovalStatus || "";
  canvas.dataset.majorProjectCapstoneTransformId =
    majorProjectCapstoneTrace.majorProjectCapstoneTransformId || "";
  canvas.dataset.majorProjectCapstoneTransformNormalized =
    String(Boolean(majorProjectCapstoneTrace.majorProjectCapstoneTransformNormalized));
  canvas.dataset.majorProjectCapstoneWorldStateHook =
    majorProjectCapstoneTrace.majorProjectCapstoneWorldStateHook || "";
  canvas.dataset.majorProjectCapstoneDuplicateSystemClassification =
    majorProjectCapstoneTrace.majorProjectCapstoneDuplicateSystemClassification || "";
  canvas.dataset.majorProjectCapstoneOptionNote =
    majorProjectCapstoneTrace.majorProjectCapstoneOptionNote || "";
  canvas.dataset.majorProjectCapstonePlaceholderNote =
    majorProjectCapstoneTrace.majorProjectCapstonePlaceholderNote || "";
  canvas.dataset.majorProjectCapstoneFallbackReason =
    majorProjectCapstoneTrace.majorProjectCapstoneFallbackReason || "";
  const ambientBeachFindsTrace = typeof window !== "undefined" ? window.__toyboxAmbientBeachFinds || {} : {};
  canvas.dataset.ambientBeachFindsVisible = String(Boolean(ambientBeachFindsTrace.ambientBeachFindsVisible));
  canvas.dataset.ambientBeachFindsStage = ambientBeachFindsTrace.ambientBeachFindsStage || "";
  canvas.dataset.ambientBeachFindsVariant = ambientBeachFindsTrace.ambientBeachFindsVariant || "";
  canvas.dataset.ambientBeachFindsActive = String(Boolean(ambientBeachFindsTrace.ambientBeachFindsActive));
  canvas.dataset.ambientBeachFindsShellsVisible = String(Boolean(ambientBeachFindsTrace.ambientBeachFindsShellsVisible));
  canvas.dataset.ambientBeachFindsDriftwoodVisible = String(Boolean(ambientBeachFindsTrace.ambientBeachFindsDriftwoodVisible));
  canvas.dataset.ambientBeachFindsTinyFindsVisible = String(Boolean(ambientBeachFindsTrace.ambientBeachFindsTinyFindsVisible));
  canvas.dataset.ambientBeachFindsFoodCrumbsVisible = String(Boolean(ambientBeachFindsTrace.ambientBeachFindsFoodCrumbsVisible));
  canvas.dataset.ambientBeachFindsAnimalVisitorVisible =
    String(Boolean(ambientBeachFindsTrace.ambientBeachFindsAnimalVisitorVisible));
  canvas.dataset.ambientBeachFindsBirdMarkersVisible =
    String(Boolean(ambientBeachFindsTrace.ambientBeachFindsBirdMarkersVisible));
  canvas.dataset.ambientBeachFindsFishMarkersVisible =
    String(Boolean(ambientBeachFindsTrace.ambientBeachFindsFishMarkersVisible));
  canvas.dataset.ambientBeachFindsShellCount = String(Number(ambientBeachFindsTrace.ambientBeachFindsShellCount || 0));
  canvas.dataset.ambientBeachFindsDriftwoodCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsDriftwoodCount || 0));
  canvas.dataset.ambientBeachFindsTinyFindCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsTinyFindCount || 0));
  canvas.dataset.ambientBeachFindsFoodCrumbCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsFoodCrumbCount || 0));
  canvas.dataset.ambientBeachFindsBirdMarkerCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsBirdMarkerCount || 0));
  canvas.dataset.ambientBeachFindsFishMarkerCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsFishMarkerCount || 0));
  canvas.dataset.ambientBeachFindsRenderedObjectCount =
    String(Number(ambientBeachFindsTrace.renderedObjectCount || 0));
  canvas.dataset.ambientBeachFindsInstancedShellCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsInstancedShellCount || 0));
  canvas.dataset.ambientBeachFindsInstancedTinyFindCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsInstancedTinyFindCount || 0));
  canvas.dataset.ambientBeachFindsPooledObjectCount =
    String(Number(ambientBeachFindsTrace.ambientBeachFindsPooledObjectCount || 0));
  canvas.dataset.ambientBeachFindsAssetSourceId = ambientBeachFindsTrace.ambientBeachFindsAssetSourceId || "";
  canvas.dataset.ambientBeachFindsAssetApprovalStatus =
    ambientBeachFindsTrace.ambientBeachFindsAssetApprovalStatus || "";
  canvas.dataset.ambientBeachFindsTransformId = ambientBeachFindsTrace.ambientBeachFindsTransformId || "";
  canvas.dataset.ambientBeachFindsTransformNormalized =
    String(Boolean(ambientBeachFindsTrace.ambientBeachFindsTransformNormalized));
  canvas.dataset.ambientBeachFindsWorldStateHook = ambientBeachFindsTrace.ambientBeachFindsWorldStateHook || "";
  canvas.dataset.ambientBeachFindsDuplicateSystemClassification =
    ambientBeachFindsTrace.ambientBeachFindsDuplicateSystemClassification || "";
  canvas.dataset.ambientBeachFindsFallbackReason = ambientBeachFindsTrace.ambientBeachFindsFallbackReason || "";
  const pierShoreWorkSiteTrace = typeof window !== "undefined" ? window.__toyboxPierShoreWorkSite || {} : {};
  canvas.dataset.pierShoreWorkSiteVisible = String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSiteVisible));
  canvas.dataset.pierShoreWorkSiteStage = pierShoreWorkSiteTrace.pierShoreWorkSiteStage || "";
  canvas.dataset.pierShoreWorkSiteVariant = pierShoreWorkSiteTrace.pierShoreWorkSiteVariant || "";
  canvas.dataset.pierShoreWorkSiteActive = String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSiteActive));
  canvas.dataset.pierShoreWorkSitePostsVisible =
    String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSitePostsVisible));
  canvas.dataset.pierShoreWorkSitePlanksVisible =
    String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSitePlanksVisible));
  canvas.dataset.pierShoreWorkSiteLashingsVisible =
    String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSiteLashingsVisible));
  canvas.dataset.pierShoreWorkSiteShoreWorkMarkerVisible =
    String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSiteShoreWorkMarkerVisible));
  canvas.dataset.pierShoreWorkSiteSafeBuildSiteVisible =
    String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSiteSafeBuildSiteVisible));
  canvas.dataset.pierShoreWorkSiteFishingSlotVisible =
    String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSiteFishingSlotVisible));
  canvas.dataset.pierShoreWorkSitePostCount =
    String(Number(pierShoreWorkSiteTrace.pierShoreWorkSitePostCount || 0));
  canvas.dataset.pierShoreWorkSitePlankCount =
    String(Number(pierShoreWorkSiteTrace.pierShoreWorkSitePlankCount || 0));
  canvas.dataset.pierShoreWorkSiteLashingCount =
    String(Number(pierShoreWorkSiteTrace.pierShoreWorkSiteLashingCount || 0));
  canvas.dataset.pierShoreWorkSiteWorkMarkerCount =
    String(Number(pierShoreWorkSiteTrace.pierShoreWorkSiteWorkMarkerCount || 0));
  canvas.dataset.pierShoreWorkSiteSafeBuildSiteCount =
    String(Number(pierShoreWorkSiteTrace.pierShoreWorkSiteSafeBuildSiteCount || 0));
  canvas.dataset.pierShoreWorkSiteFishingSlotCount =
    String(Number(pierShoreWorkSiteTrace.pierShoreWorkSiteFishingSlotCount || 0));
  canvas.dataset.pierShoreWorkSiteRenderedObjectCount =
    String(Number(pierShoreWorkSiteTrace.renderedObjectCount || 0));
  canvas.dataset.pierShoreWorkSitePooledObjectCount =
    String(Number(pierShoreWorkSiteTrace.pierShoreWorkSitePooledObjectCount || 0));
  canvas.dataset.pierShoreWorkSiteAssetSourceId = pierShoreWorkSiteTrace.pierShoreWorkSiteAssetSourceId || "";
  canvas.dataset.pierShoreWorkSiteAssetApprovalStatus =
    pierShoreWorkSiteTrace.pierShoreWorkSiteAssetApprovalStatus || "";
  canvas.dataset.pierShoreWorkSiteTransformId = pierShoreWorkSiteTrace.pierShoreWorkSiteTransformId || "";
  canvas.dataset.pierShoreWorkSiteTransformNormalized =
    String(Boolean(pierShoreWorkSiteTrace.pierShoreWorkSiteTransformNormalized));
  canvas.dataset.pierShoreWorkSiteWorldStateHook = pierShoreWorkSiteTrace.pierShoreWorkSiteWorldStateHook || "";
  canvas.dataset.pierShoreWorkSiteDuplicateSystemClassification =
    pierShoreWorkSiteTrace.pierShoreWorkSiteDuplicateSystemClassification || "";
  canvas.dataset.pierShoreWorkSiteSafetyNote = pierShoreWorkSiteTrace.pierShoreWorkSiteSafetyNote || "";
  canvas.dataset.pierShoreWorkSiteFallbackReason = pierShoreWorkSiteTrace.pierShoreWorkSiteFallbackReason || "";
  const raftBoatRouteTrace = typeof window !== "undefined" ? window.__toyboxRaftBoatRoute || {} : {};
  canvas.dataset.raftBoatRouteVisible = String(Boolean(raftBoatRouteTrace.raftBoatRouteVisible));
  canvas.dataset.raftBoatRouteStage = raftBoatRouteTrace.raftBoatRouteStage || "";
  canvas.dataset.raftBoatRouteVariant = raftBoatRouteTrace.raftBoatRouteVariant || "";
  canvas.dataset.raftBoatRouteActive = String(Boolean(raftBoatRouteTrace.raftBoatRouteActive));
  canvas.dataset.raftBoatRouteBuildStage = raftBoatRouteTrace.raftBoatRouteBuildStage || "";
  canvas.dataset.raftBoatRouteWaterState = raftBoatRouteTrace.raftBoatRouteWaterState || "";
  canvas.dataset.raftBoatRouteRouteMarker = String(Boolean(raftBoatRouteTrace.raftBoatRouteRouteMarker));
  canvas.dataset.raftBoatRouteFrameVisible = String(Boolean(raftBoatRouteTrace.raftBoatRouteFrameVisible));
  canvas.dataset.raftBoatRouteTiedPlatformVisible =
    String(Boolean(raftBoatRouteTrace.raftBoatRouteTiedPlatformVisible));
  canvas.dataset.raftBoatRoutePaddleVisible = String(Boolean(raftBoatRouteTrace.raftBoatRoutePaddleVisible));
  canvas.dataset.raftBoatRouteOnWaterVisible = String(Boolean(raftBoatRouteTrace.raftBoatRouteOnWaterVisible));
  canvas.dataset.raftBoatRouteWakeVisible = String(Boolean(raftBoatRouteTrace.raftBoatRouteWakeVisible));
  canvas.dataset.raftBoatRouteRouteMarkerVisible =
    String(Boolean(raftBoatRouteTrace.raftBoatRouteRouteMarkerVisible));
  canvas.dataset.raftBoatRouteReturnLandingVisible =
    String(Boolean(raftBoatRouteTrace.raftBoatRouteReturnLandingVisible));
  canvas.dataset.raftBoatRouteCarriedLogVisible =
    String(Boolean(raftBoatRouteTrace.raftBoatRouteCarriedLogVisible));
  canvas.dataset.raftBoatRouteCarriedRopeVisible =
    String(Boolean(raftBoatRouteTrace.raftBoatRouteCarriedRopeVisible));
  canvas.dataset.raftBoatRouteCarriedPaddleVisible =
    String(Boolean(raftBoatRouteTrace.raftBoatRouteCarriedPaddleVisible));
  canvas.dataset.raftBoatRouteLogCount = String(Number(raftBoatRouteTrace.raftBoatRouteLogCount || 0));
  canvas.dataset.raftBoatRoutePlatformPlankCount =
    String(Number(raftBoatRouteTrace.raftBoatRoutePlatformPlankCount || 0));
  canvas.dataset.raftBoatRouteLashingCount = String(Number(raftBoatRouteTrace.raftBoatRouteLashingCount || 0));
  canvas.dataset.raftBoatRoutePaddleCount = String(Number(raftBoatRouteTrace.raftBoatRoutePaddleCount || 0));
  canvas.dataset.raftBoatRouteWakeMarkerCount =
    String(Number(raftBoatRouteTrace.raftBoatRouteWakeMarkerCount || 0));
  canvas.dataset.raftBoatRouteRouteMarkerCount =
    String(Number(raftBoatRouteTrace.raftBoatRouteRouteMarkerCount || 0));
  canvas.dataset.raftBoatRouteLandingMarkerCount =
    String(Number(raftBoatRouteTrace.raftBoatRouteLandingMarkerCount || 0));
  canvas.dataset.raftBoatRouteCarriedAttachmentCount =
    String(Number(raftBoatRouteTrace.raftBoatRouteCarriedAttachmentCount || 0));
  canvas.dataset.raftBoatRouteRenderedObjectCount = String(Number(raftBoatRouteTrace.renderedObjectCount || 0));
  canvas.dataset.raftBoatRoutePooledObjectCount =
    String(Number(raftBoatRouteTrace.raftBoatRoutePooledObjectCount || 0));
  canvas.dataset.raftBoatRouteAssetSourceId = raftBoatRouteTrace.raftBoatRouteAssetSourceId || "";
  canvas.dataset.raftBoatRouteAssetApprovalStatus = raftBoatRouteTrace.raftBoatRouteAssetApprovalStatus || "";
  canvas.dataset.raftBoatRouteTransformId = raftBoatRouteTrace.raftBoatRouteTransformId || "";
  canvas.dataset.raftBoatRouteTransformNormalized =
    String(Boolean(raftBoatRouteTrace.raftBoatRouteTransformNormalized));
  canvas.dataset.raftBoatRouteWorldStateHook = raftBoatRouteTrace.raftBoatRouteWorldStateHook || "";
  canvas.dataset.raftBoatRouteDuplicateSystemClassification =
    raftBoatRouteTrace.raftBoatRouteDuplicateSystemClassification || "";
  canvas.dataset.raftBoatRouteFutureIntegrationNote = raftBoatRouteTrace.raftBoatRouteFutureIntegrationNote || "";
  canvas.dataset.raftBoatRouteFallbackReason = raftBoatRouteTrace.raftBoatRouteFallbackReason || "";
  const buildableTrace = Array.isArray(builderTrace.buildables) ? builderTrace.buildables : [];
  canvas.dataset.builderBuildableCount = String(buildableTrace.length);
  canvas.dataset.builderBuildableProgress = buildableTrace
    .map((buildable) => `${buildable.id}:${Number(buildable.progress || 0).toFixed(3)}`)
    .join("|");
  canvas.dataset.builderBuildableStages = buildableTrace
    .map((buildable) => `${buildable.id}:${Number(buildable.completedStageCount || 0)}/${Number(buildable.stageCount || 0)}`)
    .join("|");
  canvas.dataset.builderBuildableComplete = buildableTrace
    .filter((buildable) => buildable.complete)
    .map((buildable) => buildable.id)
    .join("|");
  canvas.dataset.builderTreeCount = String(Number(builderTrace.treeCount || 0));
  canvas.dataset.builderTreeHeights = Array.isArray(builderTrace.treeHeights) ? builderTrace.treeHeights.join(",") : "";
  canvas.dataset.builderTreeWood = Array.isArray(builderTrace.treeWood) ? builderTrace.treeWood.join("|") : "";
  canvas.dataset.builderTreeRegrowth = Array.isArray(builderTrace.treeRegrowth) ? builderTrace.treeRegrowth.join("|") : "";
  canvas.dataset.builderForestCoverage = Number(builderTrace.forestCoverage || 0).toFixed(3);
  canvas.dataset.builderForestAngleSpan = Number(builderTrace.forestAngleSpan || 0).toFixed(3);
  canvas.dataset.builderForestRadialSpan = Number(builderTrace.forestRadialSpan || 0).toFixed(2);
  const oceanTrace = typeof window !== "undefined" ? window.__toyboxOceanLife || {} : {};
  canvas.dataset.oceanFishCount = String(Number(oceanTrace.fishCount || 0));
  canvas.dataset.oceanActiveFishCount = String(Number(oceanTrace.activeFishCount || 0));
  canvas.dataset.oceanCaughtFishCount = String(Number(oceanTrace.caughtFishCount || 0));
  canvas.dataset.oceanInventoryFishState = oceanTrace.inventoryFishState || "none";
  canvas.dataset.oceanInventoryFishId = oceanTrace.inventoryFishId || "";
  canvas.dataset.oceanHeldFishVisible = String(Boolean(oceanTrace.heldFishVisible));
  canvas.dataset.oceanLastFishingResult = oceanTrace.lastFishingResult || "ready";
  canvas.dataset.oceanLastCaughtId = oceanTrace.lastCaughtId || "";
  canvas.dataset.oceanFishingGoal = oceanTrace.fishingGoal || "";
  canvas.dataset.oceanFishingAction = oceanTrace.fishingAction || "";
  canvas.dataset.oceanFishingTargetPosition = formatVector(oceanTrace.fishingTargetPosition || []);
  canvas.dataset.oceanFishingAttempts = String(Number(oceanTrace.fishingAttempts || 0));
  const humanoid = typeof window !== "undefined" ? window.__bubbleBoyHumanoid : null;
  canvas.dataset.bubbleBoyRenderer = humanoid && humanoid.ready && !humanoid.fallback ? "humanoid" : "procedural";
  canvas.dataset.bubbleBoyHumanoidState = humanoid ? humanoid.state : "none";
  canvas.dataset.bubbleBoyHumanoidFallback = humanoid ? String(humanoid.fallback) : "true";
  const motion = typeof window !== "undefined" ? window.__bubbleBoyMotion || {} : {};
  canvas.dataset.bubbleBoyAttentionEmoteState = motion.attentionEmoteState || "";
  canvas.dataset.bubbleBoyAttentionEmoteClip = motion.attentionEmoteClip || "";
  canvas.dataset.bubbleBoyAttentionEmoteName = motion.attentionEmoteName || "";
  canvas.dataset.bubbleBoyAttentionEmoteOverlay = motion.attentionEmoteOverlay || "";
  canvas.dataset.bubbleBoyAttentionEmoteIntensity = Number(motion.attentionEmoteIntensity || 0).toFixed(3);
  canvas.dataset.bubbleBoyAttentionEmoteRootMotion = String(Boolean(motion.attentionEmoteRootMotion));
  canvas.dataset.bubbleBoyHeadTracking = String(Boolean(motion.headTracking));
  canvas.dataset.bubbleBoyLookLean = Number(motion.lean || 0).toFixed(3);
  canvas.dataset.bubbleBoyActualSpeed = Number(motion.actualSpeed || 0).toFixed(3);
  canvas.dataset.bubbleBoyMeasuredSpeed = Number(motion.measuredSpeed || 0).toFixed(3);
  canvas.dataset.bubbleBoySimSpeed = Number(motion.simSpeed || 0).toFixed(3);
  canvas.dataset.bubbleBoyActualTurnSpeed = Number(motion.actualTurnSpeed || 0).toFixed(3);
  canvas.dataset.bubbleBoyLocomotionState = motion.locomotionState || "";
  canvas.dataset.bubbleBoyLocomotionClip = motion.locomotionClip || "";
  canvas.dataset.bubbleBoyLocomotionOverlay = motion.locomotionOverlay || "";
  canvas.dataset.bubbleBoyLocomotionTimeScale = Number(motion.locomotionTimeScale || 1).toFixed(3);
  canvas.dataset.bubbleBoyLocomotionRootMotion = String(Boolean(motion.locomotionRootMotion));
  canvas.dataset.bubbleBoyLocomotionTargetId = motion.locomotionTargetId || "";
  canvas.dataset.bubbleBoyLocomotionTargetDistance =
    motion.locomotionTargetDistance == null ? "" : Number(motion.locomotionTargetDistance || 0).toFixed(3);
  canvas.dataset.bubbleBoyLocomotionTurnAmount = Number(motion.locomotionTurnAmount || 0).toFixed(3);
  const presentation = presentationState || (typeof window !== "undefined" ? window.__toyboxPresentation : null) || {};
  const presentationDebug = presentation.debug || {};
  canvas.dataset.presentationAction = presentationDebug.selectedPresentationAction || presentation.selectedAction || "";
  canvas.dataset.presentationAnimationFallback = presentationDebug.selectedAnimationFallback || "";
  canvas.dataset.presentationAnimationSemanticAction = presentationDebug.selectedAnimationSemanticAction || "";
  canvas.dataset.presentationAnimationFallbackReason = presentationDebug.selectedAnimationFallbackReason || "";
  canvas.dataset.presentationAnimationRootMotion = String(Boolean(presentationDebug.selectedAnimationRootMotion));
  canvas.dataset.presentationAnimationEmoteState = presentationDebug.selectedAnimationEmoteState || "";
  canvas.dataset.presentationAnimationEmoteClip = presentationDebug.selectedAnimationEmoteClip || "";
  canvas.dataset.presentationAnimationEmoteName = presentationDebug.selectedAnimationEmoteName || "";
  canvas.dataset.presentationAnimationEmoteOverlay = presentationDebug.selectedAnimationEmoteOverlay || "";
  canvas.dataset.presentationAnimationEmoteIntensity =
    Number(presentationDebug.selectedAnimationEmoteIntensity || 0).toFixed(3);
  canvas.dataset.presentationAnimationEmoteRootMotion = String(Boolean(presentationDebug.selectedAnimationEmoteRootMotion));
  canvas.dataset.presentationAnimationLocomotionState = presentationDebug.selectedAnimationLocomotionState || "";
  canvas.dataset.presentationAnimationLocomotionOverlay = presentationDebug.selectedAnimationLocomotionOverlay || "";
  canvas.dataset.presentationAnimationLocomotionClip = presentationDebug.selectedAnimationLocomotionClip || "";
  canvas.dataset.presentationAnimationLocomotionTimeScale =
    Number(presentationDebug.selectedAnimationLocomotionTimeScale || 1).toFixed(3);
  canvas.dataset.presentationAnimationLocomotionSpeed =
    Number(presentationDebug.selectedAnimationLocomotionSpeed || 0).toFixed(3);
  canvas.dataset.presentationAnimationLocomotionTargetId = presentationDebug.selectedAnimationLocomotionTargetId || "";
  canvas.dataset.presentationAnimationLocomotionRootMotion =
    String(Boolean(presentationDebug.selectedAnimationLocomotionRootMotion));
  canvas.dataset.presentationProceduralOverlay = presentationDebug.selectedProceduralOverlay || "";
  canvas.dataset.presentationCarryAttachment = presentationDebug.selectedCarryAttachment || "";
  canvas.dataset.presentationCarryAttachmentSourceId = presentationDebug.selectedCarryAttachmentSourceId || "";
  canvas.dataset.presentationCarryAttachmentTransformId = presentationDebug.selectedCarryAttachmentTransformId || "";
  canvas.dataset.presentationArrivalSuppliesStage = presentationDebug.arrivalSuppliesStage || "";
  canvas.dataset.presentationArrivalSuppliesVariant = presentationDebug.arrivalSuppliesVariant || "";
  canvas.dataset.presentationArrivalSuppliesWashedBundle = String(Boolean(presentationDebug.arrivalSuppliesWashedBundle));
  canvas.dataset.presentationArrivalSuppliesScatteredSticks = String(Boolean(presentationDebug.arrivalSuppliesScatteredSticks));
  canvas.dataset.presentationArrivalSuppliesScatteredLeaves = String(Boolean(presentationDebug.arrivalSuppliesScatteredLeaves));
  canvas.dataset.presentationArrivalSuppliesMaterialPile = String(Boolean(presentationDebug.arrivalSuppliesMaterialPile));
  canvas.dataset.presentationArrivalSuppliesCarryBundle = String(Boolean(presentationDebug.arrivalSuppliesCarryBundle));
  canvas.dataset.presentationArrivalSuppliesAssetSourceId = presentationDebug.arrivalSuppliesAssetSourceId || "";
  canvas.dataset.presentationArrivalSuppliesAssetApprovalStatus = presentationDebug.arrivalSuppliesAssetApprovalStatus || "";
  canvas.dataset.presentationArrivalSuppliesTransformId = presentationDebug.arrivalSuppliesTransformId || "";
  canvas.dataset.presentationArrivalSuppliesDuplicateSystemClassification =
    presentationDebug.arrivalSuppliesDuplicateSystemClassification || "";
  canvas.dataset.presentationBubbleBoyCarriedItem = presentationDebug.bubbleBoyCarriedItem || "";
  canvas.dataset.presentationFirstFireStage = presentationDebug.firstFireStage || "";
  canvas.dataset.presentationFirstFireVariant = presentationDebug.firstFireVariant || "";
  canvas.dataset.presentationFirstFireState = presentationDebug.firstFireState || "";
  canvas.dataset.presentationFirstFireAssetSourceId = presentationDebug.firstFireAssetSourceId || "";
  canvas.dataset.presentationFirstFireAssetApprovalStatus = presentationDebug.firstFireAssetApprovalStatus || "";
  canvas.dataset.presentationFirstFireTransformId = presentationDebug.firstFireTransformId || "";
  canvas.dataset.presentationFirstFireDuplicateSystemClassification =
    presentationDebug.firstFireDuplicateSystemClassification || "";
  canvas.dataset.presentationRestShelterStage = presentationDebug.restShelterStage || "";
  canvas.dataset.presentationRestShelterVariant = presentationDebug.restShelterVariant || "";
  canvas.dataset.presentationRestShelterState = presentationDebug.restShelterState || "";
  canvas.dataset.presentationRestShelterAssetSourceId = presentationDebug.restShelterAssetSourceId || "";
  canvas.dataset.presentationRestShelterAssetApprovalStatus = presentationDebug.restShelterAssetApprovalStatus || "";
  canvas.dataset.presentationRestShelterTransformId = presentationDebug.restShelterTransformId || "";
  canvas.dataset.presentationStorageWorkbenchToolsStage = presentationDebug.storageWorkbenchToolsStage || "";
  canvas.dataset.presentationStorageWorkbenchToolsVariant = presentationDebug.storageWorkbenchToolsVariant || "";
  canvas.dataset.presentationStorageWorkbenchToolsState = presentationDebug.storageWorkbenchToolsState || "";
  canvas.dataset.presentationStorageWorkbenchToolsAssetSourceId =
    presentationDebug.storageWorkbenchToolsAssetSourceId || "";
  canvas.dataset.presentationStorageWorkbenchToolsAssetApprovalStatus =
    presentationDebug.storageWorkbenchToolsAssetApprovalStatus || "";
  canvas.dataset.presentationStorageWorkbenchToolsTransformId = presentationDebug.storageWorkbenchToolsTransformId || "";
  canvas.dataset.presentationCampStorageStage = presentationDebug.campStorageStage || "";
  canvas.dataset.presentationCampStorageWoodCount = Number(presentationDebug.campStorageWoodCount || 0).toFixed(2);
  canvas.dataset.presentationUpgradedWorkbenchVisible = String(Boolean(presentationDebug.upgradedWorkbenchVisible));
  canvas.dataset.presentationToolRackStage = presentationDebug.toolRackStage || "";
  canvas.dataset.presentationToolRackSlotCount = String(Number(presentationDebug.toolRackSlotCount || 0));
  canvas.dataset.presentationToolInventoryHasStoneTool = String(Boolean(presentationDebug.toolInventoryHasStoneTool));
  canvas.dataset.presentationStorageWorkbenchToolsDuplicateSystemClassification =
    presentationDebug.storageWorkbenchToolsDuplicateSystemClassification || "";
  canvas.dataset.presentationCampPathsStage = presentationDebug.campPathsStage || "";
  canvas.dataset.presentationCampPathsVariant = presentationDebug.campPathsVariant || "";
  canvas.dataset.presentationCampPathsState = presentationDebug.campPathsState || "";
  canvas.dataset.presentationCampPathsActivePathCount = String(Number(presentationDebug.campPathsActivePathCount || 0));
  canvas.dataset.presentationCampPathsClearedPaths = Array.isArray(presentationDebug.campPathsClearedPaths)
    ? presentationDebug.campPathsClearedPaths.join("|")
    : "";
  canvas.dataset.presentationCampPathsLitPaths = Array.isArray(presentationDebug.campPathsLitPaths)
    ? presentationDebug.campPathsLitPaths.join("|")
    : "";
  canvas.dataset.presentationCampPathsBoundaryStoneCount =
    String(Number(presentationDebug.campPathsBoundaryStoneCount || 0));
  canvas.dataset.presentationCampPathsAssetSourceId = presentationDebug.campPathsAssetSourceId || "";
  canvas.dataset.presentationCampPathsAssetApprovalStatus = presentationDebug.campPathsAssetApprovalStatus || "";
  canvas.dataset.presentationCampPathsTransformId = presentationDebug.campPathsTransformId || "";
  canvas.dataset.presentationCampPathsDuplicateSystemClassification =
    presentationDebug.campPathsDuplicateSystemClassification || "";
  canvas.dataset.presentationCampZonesStage = presentationDebug.campZonesStage || "";
  canvas.dataset.presentationCampZonesVariant = presentationDebug.campZonesVariant || "";
  canvas.dataset.presentationCampZonesState = presentationDebug.campZonesState || "";
  canvas.dataset.presentationCampZonesMarkedZones = Array.isArray(presentationDebug.campZonesMarkedZones)
    ? presentationDebug.campZonesMarkedZones.join("|")
    : "";
  canvas.dataset.presentationCampZonesMarkedZoneCount = String(Number(presentationDebug.campZonesMarkedZoneCount || 0));
  canvas.dataset.presentationCampZonesAssetSourceId = presentationDebug.campZonesAssetSourceId || "";
  canvas.dataset.presentationCampZonesAssetApprovalStatus = presentationDebug.campZonesAssetApprovalStatus || "";
  canvas.dataset.presentationCampZonesTransformId = presentationDebug.campZonesTransformId || "";
  canvas.dataset.presentationCampZonesDuplicateSystemClassification =
    presentationDebug.campZonesDuplicateSystemClassification || "";
  canvas.dataset.presentationBubbleBoyCarriedObject = presentationDebug.bubbleBoyCarriedObject || "";
  canvas.dataset.presentationGardenPlotsStage = presentationDebug.gardenPlotsStage || "";
  canvas.dataset.presentationGardenPlotsVariant = presentationDebug.gardenPlotsVariant || "";
  canvas.dataset.presentationGardenPlotsState = presentationDebug.gardenPlotsState || "";
  canvas.dataset.presentationGardenActivePlotId = presentationDebug.gardenActivePlotId || "";
  canvas.dataset.presentationGardenCropType = presentationDebug.gardenCropType || "";
  canvas.dataset.presentationGardenWatered = String(Boolean(presentationDebug.gardenWatered));
  canvas.dataset.presentationGardenPlotCount = String(Number(presentationDebug.gardenPlotCount || 0));
  canvas.dataset.presentationGardenSeededPlotCount = String(Number(presentationDebug.gardenSeededPlotCount || 0));
  canvas.dataset.presentationGardenSproutPlotCount = String(Number(presentationDebug.gardenSproutPlotCount || 0));
  canvas.dataset.presentationGardenMaturePlotCount = String(Number(presentationDebug.gardenMaturePlotCount || 0));
  canvas.dataset.presentationGardenWateredPlotCount = String(Number(presentationDebug.gardenWateredPlotCount || 0));
  canvas.dataset.presentationGardenPlotsAssetSourceId = presentationDebug.gardenPlotsAssetSourceId || "";
  canvas.dataset.presentationGardenPlotsAssetApprovalStatus = presentationDebug.gardenPlotsAssetApprovalStatus || "";
  canvas.dataset.presentationGardenPlotsTransformId = presentationDebug.gardenPlotsTransformId || "";
  canvas.dataset.presentationGardenPlotsDuplicateSystemClassification =
    presentationDebug.gardenPlotsDuplicateSystemClassification || "";
  canvas.dataset.presentationFoodRoutineStage = presentationDebug.foodRoutineStage || "";
  canvas.dataset.presentationFoodRoutineVariant = presentationDebug.foodRoutineVariant || "";
  canvas.dataset.presentationFoodRoutineState = presentationDebug.foodRoutineState || "";
  canvas.dataset.presentationFoodRoutineDay = String(Number(presentationDebug.foodRoutineDay || 0));
  canvas.dataset.presentationFoodRoutineBasketStock = String(Number(presentationDebug.foodRoutineBasketStock || 0));
  canvas.dataset.presentationFoodRoutineMealCount = String(Number(presentationDebug.foodRoutineMealCount || 0));
  canvas.dataset.presentationFoodRoutineDriedFishCount = String(Number(presentationDebug.foodRoutineDriedFishCount || 0));
  canvas.dataset.presentationFoodRoutineHarvestCount = String(Number(presentationDebug.foodRoutineHarvestCount || 0));
  canvas.dataset.presentationFoodRoutineLeftoverCount = String(Number(presentationDebug.foodRoutineLeftoverCount || 0));
  canvas.dataset.presentationFoodRoutineAssetSourceId = presentationDebug.foodRoutineAssetSourceId || "";
  canvas.dataset.presentationFoodRoutineAssetApprovalStatus = presentationDebug.foodRoutineAssetApprovalStatus || "";
  canvas.dataset.presentationFoodRoutineTransformId = presentationDebug.foodRoutineTransformId || "";
  canvas.dataset.presentationFoodRoutineDuplicateSystemClassification =
    presentationDebug.foodRoutineDuplicateSystemClassification || "";
  canvas.dataset.presentationAmbientBeachFindsStage = presentationDebug.ambientBeachFindsStage || "";
  canvas.dataset.presentationAmbientBeachFindsVariant = presentationDebug.ambientBeachFindsVariant || "";
  canvas.dataset.presentationAmbientBeachFindsState = presentationDebug.ambientBeachFindsState || "";
  canvas.dataset.presentationAmbientBeachFindsDay = String(Number(presentationDebug.ambientBeachFindsDay || 0));
  canvas.dataset.presentationAmbientBeachFindsShellCount =
    String(Number(presentationDebug.ambientBeachFindsShellCount || 0));
  canvas.dataset.presentationAmbientBeachFindsDriftwoodCount =
    String(Number(presentationDebug.ambientBeachFindsDriftwoodCount || 0));
  canvas.dataset.presentationAmbientBeachFindsTinyFindCount =
    String(Number(presentationDebug.ambientBeachFindsTinyFindCount || 0));
  canvas.dataset.presentationAmbientBeachFindsFoodCrumbCount =
    String(Number(presentationDebug.ambientBeachFindsFoodCrumbCount || 0));
  canvas.dataset.presentationAmbientBeachFindsBirdMarkerCount =
    String(Number(presentationDebug.ambientBeachFindsBirdMarkerCount || 0));
  canvas.dataset.presentationAmbientBeachFindsFishMarkerCount =
    String(Number(presentationDebug.ambientBeachFindsFishMarkerCount || 0));
  canvas.dataset.presentationAmbientBeachFindsAnimalVisitorVisible =
    String(Boolean(presentationDebug.ambientBeachFindsAnimalVisitorVisible));
  canvas.dataset.presentationAmbientBeachFindsAssetSourceId =
    presentationDebug.ambientBeachFindsAssetSourceId || "";
  canvas.dataset.presentationAmbientBeachFindsAssetApprovalStatus =
    presentationDebug.ambientBeachFindsAssetApprovalStatus || "";
  canvas.dataset.presentationAmbientBeachFindsTransformId =
    presentationDebug.ambientBeachFindsTransformId || "";
  canvas.dataset.presentationAmbientBeachFindsDuplicateSystemClassification =
    presentationDebug.ambientBeachFindsDuplicateSystemClassification || "";
  canvas.dataset.presentationPierShoreWorkSiteStage = presentationDebug.pierShoreWorkSiteStage || "";
  canvas.dataset.presentationPierShoreWorkSiteVariant = presentationDebug.pierShoreWorkSiteVariant || "";
  canvas.dataset.presentationPierShoreWorkSiteState = presentationDebug.pierShoreWorkSiteState || "";
  canvas.dataset.presentationPierShoreWorkSiteDay = String(Number(presentationDebug.pierShoreWorkSiteDay || 0));
  canvas.dataset.presentationPierShoreWorkSitePostCount =
    String(Number(presentationDebug.pierShoreWorkSitePostCount || 0));
  canvas.dataset.presentationPierShoreWorkSitePlankCount =
    String(Number(presentationDebug.pierShoreWorkSitePlankCount || 0));
  canvas.dataset.presentationPierShoreWorkSiteLashingCount =
    String(Number(presentationDebug.pierShoreWorkSiteLashingCount || 0));
  canvas.dataset.presentationPierShoreWorkSiteWorkMarkerCount =
    String(Number(presentationDebug.pierShoreWorkSiteWorkMarkerCount || 0));
  canvas.dataset.presentationPierShoreWorkSiteSafeBuildSiteCount =
    String(Number(presentationDebug.pierShoreWorkSiteSafeBuildSiteCount || 0));
  canvas.dataset.presentationPierShoreWorkSiteFishingSlotCount =
    String(Number(presentationDebug.pierShoreWorkSiteFishingSlotCount || 0));
  canvas.dataset.presentationPierShoreWorkSiteAssetSourceId =
    presentationDebug.pierShoreWorkSiteAssetSourceId || "";
  canvas.dataset.presentationPierShoreWorkSiteAssetApprovalStatus =
    presentationDebug.pierShoreWorkSiteAssetApprovalStatus || "";
  canvas.dataset.presentationPierShoreWorkSiteTransformId =
    presentationDebug.pierShoreWorkSiteTransformId || "";
  canvas.dataset.presentationPierShoreWorkSiteDuplicateSystemClassification =
    presentationDebug.pierShoreWorkSiteDuplicateSystemClassification || "";
  canvas.dataset.presentationPierShoreWorkSiteSafetyNote =
    presentationDebug.pierShoreWorkSiteSafetyNote || "";
  canvas.dataset.presentationRaftBoatRouteStage = presentationDebug.raftBoatRouteStage || "";
  canvas.dataset.presentationRaftBoatRouteVariant = presentationDebug.raftBoatRouteVariant || "";
  canvas.dataset.presentationRaftBoatRouteState = presentationDebug.raftBoatRouteState || "";
  canvas.dataset.presentationRaftBoatRouteDay = String(Number(presentationDebug.raftBoatRouteDay || 0));
  canvas.dataset.presentationRaftBoatRouteBuildStage = presentationDebug.raftBoatRouteBuildStage || "";
  canvas.dataset.presentationRaftBoatRouteWaterState = presentationDebug.raftBoatRouteWaterState || "";
  canvas.dataset.presentationRaftBoatRouteRouteMarker =
    String(Boolean(presentationDebug.raftBoatRouteRouteMarker));
  canvas.dataset.presentationRaftBoatRouteLogCount =
    String(Number(presentationDebug.raftBoatRouteLogCount || 0));
  canvas.dataset.presentationRaftBoatRoutePlatformPlankCount =
    String(Number(presentationDebug.raftBoatRoutePlatformPlankCount || 0));
  canvas.dataset.presentationRaftBoatRouteLashingCount =
    String(Number(presentationDebug.raftBoatRouteLashingCount || 0));
  canvas.dataset.presentationRaftBoatRoutePaddleCount =
    String(Number(presentationDebug.raftBoatRoutePaddleCount || 0));
  canvas.dataset.presentationRaftBoatRouteWakeMarkerCount =
    String(Number(presentationDebug.raftBoatRouteWakeMarkerCount || 0));
  canvas.dataset.presentationRaftBoatRouteRouteMarkerCount =
    String(Number(presentationDebug.raftBoatRouteRouteMarkerCount || 0));
  canvas.dataset.presentationRaftBoatRouteLandingMarkerCount =
    String(Number(presentationDebug.raftBoatRouteLandingMarkerCount || 0));
  canvas.dataset.presentationRaftBoatRouteAssetSourceId =
    presentationDebug.raftBoatRouteAssetSourceId || "";
  canvas.dataset.presentationRaftBoatRouteAssetApprovalStatus =
    presentationDebug.raftBoatRouteAssetApprovalStatus || "";
  canvas.dataset.presentationRaftBoatRouteTransformId =
    presentationDebug.raftBoatRouteTransformId || "";
  canvas.dataset.presentationRaftBoatRouteDuplicateSystemClassification =
    presentationDebug.raftBoatRouteDuplicateSystemClassification || "";
  canvas.dataset.presentationRaftBoatRouteFutureIntegrationNote =
    presentationDebug.raftBoatRouteFutureIntegrationNote || "";
  canvas.dataset.presentationBubbleBoyCarrying = presentationDebug.bubbleBoyCarrying || "";
  canvas.dataset.presentationDuplicateSystemClassification = presentationDebug.duplicateSystemClassification || "";
  canvas.dataset.presentationActiveVisualFamilies = Array.isArray(presentationDebug.activeVisualFamilies)
    ? presentationDebug.activeVisualFamilies.join("|")
    : "";
  canvas.dataset.presentationUnapprovedAssetCount = String(Number(presentationDebug.unapprovedAssetCount || 0));

  window.__toyboxCelestial = {
    phase: env.phaseName,
    timeOfDay: env.timeOfDay,
    sunPosition: celestial.sunPosition.toArray(),
    moonPosition: celestial.moonPosition.toArray(),
    activeLightPosition: celestial.dominantPosition.toArray(),
    activeLightDirection: celestial.dominantDirection.toArray(),
    sunDirection: celestial.sunDirection.toArray(),
    moonDirection: celestial.moonDirection.toArray(),
    waterDirection: celestial.waterDirection.toArray(),
    sunIntensity: celestial.sunIntensity,
    moonIntensity: celestial.moonIntensity,
    dominantLight: celestial.dominantSource,
    skyLife,
    cardinalConvention: CARDINAL_CONVENTION
  };
}

function createPhysicsDebugGroup() {
  const group = new THREE.Group();
  group.name = "Physics debug overlay";
  group.visible = false;
  const material = new THREE.MeshBasicMaterial({
    color: 0x55b7ff,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
    depthWrite: false
  });
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(PLAYABLE_RADIUS, PLAYABLE_RADIUS, 0.40, 64, 1), material);
  cylinder.position.set(0, 0.03, 0);
  group.add(cylinder);
  const pad = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.28, 3.6), material);
  pad.position.set(0, 0.08, -0.02);
  group.add(pad);
  const probe = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 10), material);
  probe.name = "debug-probe";
  group.add(probe);
  return group;
}

function syncPhysicsDebug(group, physicsProbe) {
  const probe = group.getObjectByName("debug-probe");
  if (probe) probe.position.fromArray(physicsProbe.position);
}

function islandShoreRadius(angle) {
  let radius = 3.02;
  radius += Math.sin(angle * 2.0 + 0.35) * 0.15;
  radius += Math.sin(angle * 3.0 - 1.20) * 0.10;
  radius += Math.sin(angle * 5.0 + 1.65) * 0.055;
  radius -= islandCove(angle, 2.42, 0.34, 0.20);
  radius -= islandCove(angle, -1.82, 0.28, 0.16);
  radius += islandCove(angle, -0.55, 0.40, 0.12);
  return radius * WORLD_RADIUS_SCALE;
}

function maxIslandShoreRadius() {
  let radius = 0;
  for (let i = 0; i < 192; i += 1) {
    radius = Math.max(radius, islandShoreRadius((i / 192) * TAU));
  }
  return radius;
}

function islandCove(angle, center, width, depth) {
  const distance = Math.atan2(Math.sin(angle - center), Math.cos(angle - center));
  return depth * Math.exp(-(distance * distance) / (width * width));
}

function insideIsland(x, z, inset = 0) {
  const angle = Math.atan2(z, x);
  return Math.hypot(x, z) <= islandShoreRadius(angle) - inset;
}

function groundHeightAt(x, z) {
  const angle = Math.atan2(z, x);
  const radial = clamp(Math.hypot(x, z) / Math.max(1, islandShoreRadius(angle)), 0, 1);
  const centerRise = (1 - smoothstep(0.04, 0.78, radial)) * 0.145;
  const shoulder = Math.exp(-Math.pow((radial - 0.50) / 0.25, 2)) * (0.025 + valueNoise2d(x, z, 23.0, 15.0) * 0.035);
  const diagonalLift = Math.sin((x - z) * 0.050 + 0.8) * smoothstep(0.14, 0.76, radial) * (1 - smoothstep(0.84, 1.0, radial)) * 0.030;
  const broadRoll = Math.sin(x * 0.10 + z * 0.07) * 0.038 + Math.sin(x * -0.06 + z * 0.12 + 0.7) * 0.031;
  const facetedNoise = (valueNoise2d(x, z, 7.8, 3.0) - 0.5) * 0.052 + (valueNoise2d(x, z, 17.5, 7.0) - 0.5) * 0.034;
  let y = 0.070 + centerRise + shoulder + diagonalLift - radial * 0.038 + broadRoll + facetedNoise * smoothstep(0.05, 0.94, radial);
  const fireFlat = 1 - smoothstep(0.24, 1.30, Math.hypot(x - characterAnchors.fire[0], z - characterAnchors.fire[2]));
  const boyFlat = 1 - smoothstep(0.24, 0.92, Math.hypot(x - characterAnchors.startOrigin[0], z - characterAnchors.startOrigin[2]));
  const campUndulation = Math.sin(x * 0.72 + z * 0.36) * 0.006 + Math.sin(x * -0.28 + z * 0.52) * 0.004;
  y = lerp(y, 0.205 + campUndulation, fireFlat * 0.76);
  y = lerp(y, 0.202 + campUndulation * 0.7, boyFlat * 0.56);
  y -= smoothstep(0.70, 1.0, radial) * 0.170;
  y -= smoothstep(0.91, 1.0, radial) * 0.060;
  return y;
}

function sandColorAt(x, z, variation) {
  const angle = Math.atan2(z, x);
  const radial = clamp(Math.hypot(x, z) / Math.max(1, islandShoreRadius(angle)), 0, 1);
  const broad = valueNoise2d(x, z, 12.5, 91.0);
  const dune = valueNoise2d(x + z * 0.28, z - x * 0.20, 22.0, 92.0);
  const wet = smoothstep(0.76, 1.0, radial);
  const color = new THREE.Color(0xe3b474);
  color.lerp(new THREE.Color(0xb98d55), 0.34 + radial * 0.30);
  color.lerp(new THREE.Color(0xd9a963), clamp(0.06 + dune * 0.10, 0, 0.16));
  color.lerp(new THREE.Color(0x9f7650), clamp((0.52 - broad) * 0.12 + radial * 0.05, 0, 0.15));
  color.lerp(new THREE.Color(0x625e55), wet * 0.30);
  color.lerp(new THREE.Color(0xd0c0a0), smoothstep(0.82, 0.96, radial) * 0.08);
  color.multiplyScalar(0.98 + variation * 0.045);
  return color;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function valueNoise2d(x, z, scale, seed) {
  const px = (x + seed * 11.3) / scale;
  const pz = (z - seed * 5.9) / scale;
  const ix = Math.floor(px);
  const iz = Math.floor(pz);
  const fx = smoothstep(0, 1, px - ix);
  const fz = smoothstep(0, 1, pz - iz);
  const a = hash01(ix * 37.0 + iz * 83.0 + seed * 19.0);
  const b = hash01((ix + 1) * 37.0 + iz * 83.0 + seed * 19.0);
  const c = hash01(ix * 37.0 + (iz + 1) * 83.0 + seed * 19.0);
  const d = hash01((ix + 1) * 37.0 + (iz + 1) * 83.0 + seed * 19.0);
  return lerp(lerp(a, b, fx), lerp(c, d, fx), fz);
}

function hash01(value) {
  const x = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function cyclePulse01(value, center, width) {
  const distance = Math.abs(Math.atan2(Math.sin((value - center) * TAU), Math.cos((value - center) * TAU))) / TAU;
  return Math.exp(-Math.pow(distance / width, 2));
}

function vec3LikeToArray(vector, fallback) {
  if (!vector) return fallback.slice();
  if (Array.isArray(vector)) return [Number(vector[0]) || 0, Number(vector[1]) || 0, Number(vector[2]) || 0];
  return [Number(vector.x) || 0, Number(vector.y) || 0, Number(vector.z) || 0];
}

function arrayToVector3(value, fallback) {
  const array = vec3LikeToArray(value, fallback);
  return new THREE.Vector3(array[0], array[1], array[2]);
}

function normalizeVector3FromArray(value, positionFallback) {
  const vector = arrayToVector3(value, [positionFallback.x, positionFallback.y, positionFallback.z]);
  if (vector.lengthSq() < 0.000001) vector.copy(positionFallback);
  return vector.normalize();
}

function colorFromArray(array) {
  const values = Array.isArray(array) ? array : [1, 1, 1];
  return scratchColor.setRGB(values[0] || 0, values[1] || 0, values[2] || 0).clone();
}

function formatVector(vector) {
  if (vector instanceof THREE.Vector3) {
    return [vector.x, vector.y, vector.z].map((value) => Number(value || 0).toFixed(2)).join(",");
  }
  if (Array.isArray(vector)) {
    return vector.map((value) => Number(value || 0).toFixed(2)).join(",");
  }
  return "0.00,0.00,0.00";
}

function formatPlainVector(vector) {
  if (!vector || typeof vector !== "object") return "0.00,0.00,0.00";
  return [vector.x, vector.y, vector.z].map((value) => Number(value || 0).toFixed(2)).join(",");
}
