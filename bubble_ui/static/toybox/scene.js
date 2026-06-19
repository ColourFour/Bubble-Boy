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
import { createIntentCollector } from "/static/toybox/input/intent.js";
import { installPostOverlay } from "/static/toybox/materials.js";
import { simulate } from "/static/toybox/simulation/simulate.js";
import { createInitialWorldState } from "/static/toybox/simulation/worldState.js";
import { clampToPlayableRadius, terrainConfig } from "/static/toybox/terrain.js";

const TAU = Math.PI * 2;
const WORLD_RADIUS_SCALE = terrainConfig.worldRadiusScale;
const PLAYABLE_RADIUS = terrainConfig.playableRadius;
const WATER_RADIUS = Math.max(terrainConfig.farWaterRadius, 340);
const WATER_LEVEL = terrainConfig.islandOffsetY;
const CELESTIAL_HORIZON_Y = 1.8;
const CARDINAL_CONVENTION = "Y=up; North=-Z; South=+Z; East=+X; West=-X";
const NORTH = Object.freeze([0, 0, -1]);
const SOUTH = Object.freeze([0, 0, 1]);
const EAST = Object.freeze([1, 0, 0]);
const WEST = Object.freeze([-1, 0, 0]);
const ROBOT_EXPRESSIVE_URL = "/static/toybox/assets/characters/RobotExpressive.glb";
const HUMANOID_TARGET_HEIGHT = 1.48;
const HUMANOID_BASE_CLIPS = Object.freeze({
  Idle: ["Idle", "Standing", "Sitting"],
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
  jump: "Jump"
});

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
  let simulationAccumulator = 0;
  const maxSimulationFrameDelta = 0.25;
  const maxSimulationTicksPerFrame = 12;

  window.__toyboxSim = {
    get state() {
      return worldState;
    }
  };

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

  const camera3d = new THREE.PerspectiveCamera(51, 1, 0.1, WATER_RADIUS * 1.6);
  camera3d.name = "Toybox camera";

  const env = createEnvironmentState();
  syncEnvironmentFromWorldState(env, worldState);

  const cameraController = createCameraController(canvas, {
    groundHeightAt,
    clampTarget: (target) => clampToPlayableRadius(target, PLAYABLE_RADIUS),
    speed: 7.2,
    smoothing: 7.5
  });
  const cameraState = cameraController.camera;
  cameraState.theta = 2.82;
  cameraState.phi = 1.30;
  cameraState.distance = 9.7;
  cameraState.target = [0.28, 0.82, -0.18];
  cameraState.desiredTarget = cameraState.target.slice();

  const intentCollector = createIntentCollector({
    camera: cameraState,
    pressedKeys: cameraController.pressedKeys
  });

  const audioNodes = await initializeAudio();
  const audioCtx = audioNodes ? audioNodes.ctx : null;

  exposeOrientation(canvas);

  const sky = createSky();
  scene.add(sky);

  const stars = createStars();
  scene.add(stars);

  const celestialBodies = createCelestialBodies();
  scene.add(celestialBodies.group);

  const water = createWater();
  scene.add(water);

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

  const bubbleBoy = createBubbleBoy();
  worldRoot.add(bubbleBoy.group);
  const bubbleBoyHumanoidController = createBubbleBoyHumanoid({
    scene: worldRoot,
    THREE,
    existingPosition: bubbleBoy.group.position
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
    return ticks;
  }

  function updateDebugPanel(time, celestial) {
    const probeY = physicsStoneBody
      ? physicsStoneBody.body.translation().y.toFixed(2)
      : physicsProbe.position[1].toFixed(2);
    debugController.update([
      `physics: ${physicsStatus}`,
      `sim: tick ${worldState.sim.tick} action ${worldState.bubbleBoy.currentAction}`,
      `colliders: ${physics ? physics.colliders.length : 0}`,
      `dynamic bodies: ${physics ? physics.dynamicBodies.length : 0}`,
      `probe y: ${probeY}`,
      `time: ${env.phaseName} ${env.timeOfDay.toFixed(3)}`,
      `sun: ${formatVector(celestial.sunDirection)} intensity ${celestial.sunIntensity.toFixed(2)}`,
      `moon: ${formatVector(celestial.moonDirection)} intensity ${celestial.moonIntensity.toFixed(2)}`,
      `dominant: ${celestial.dominantSource} ${formatVector(celestial.dominantDirection)}`,
      `water sun dir: ${formatVector(celestial.waterDirection)}`,
      `wind: ${env.windVector.x.toFixed(2)}, ${env.windVector.z.toFixed(2)} gust ${env.windVector.gust.toFixed(2)}`,
      `world: fire ${env.world.fireIntensity.toFixed(2)} source ${env.world.ambientEnergy.toFixed(2)} emotion ${env.world.emotionalField.toFixed(2)}`
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

    if (physics) physics.stepPhysics(deltaSeconds, { wind: env.windVector });

    const celestial = calculateCanonicalCelestial(env);
    syncLighting({ celestial, lighting, sky, water, stars, celestialBodies, scene, renderer, time });
    syncShoreline(shoreline, env, time);
    syncFire(fire, lighting, env, worldState, time);
    syncBubbleBoy(bubbleBoy, bubbleBoyHumanoidController, worldState, time, deltaSeconds, cameraController.cursor);
    syncCamera(camera3d, cameraState);
    syncTrace(canvas, env, celestial, simulationTicks);

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
  sky.material.needsUpdate = true;
}

function createWater() {
  const geometry = new THREE.PlaneGeometry(WATER_RADIUS * 2, WATER_RADIUS * 2);
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
  water.name = "Three.js Water ocean";
  water.rotation.x = -Math.PI / 2;
  water.position.y = WATER_LEVEL;
  water.receiveShadow = false;
  return water;
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
  const count = 420;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const color = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const angle = (i * goldenAngle + hash01(i * 7.1) * 0.45) % TAU;
    const lift = 0.16 + Math.pow(hash01(i * 11.4), 0.46) * 0.74;
    const radius = 180 + hash01(i * 3.9) * 84;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = lift * 150;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    color.set(hash01(i * 5.2) > 0.75 ? 0xffe1a7 : 0xb8c9ff);
    color.multiplyScalar(0.55 + hash01(i * 13.5) * 0.55);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.52,
    sizeAttenuation: true,
    map: createStarTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    alphaTest: 0.02,
    blending: THREE.AdditiveBlending
  });
  const stars = new THREE.Points(geometry, material);
  stars.name = "Scene-space night stars";
  stars.renderOrder = -10;
  return stars;
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
  const hemisphere = new THREE.HemisphereLight(0xa8d4ff, 0x7a4b2c, 0.38);
  hemisphere.name = "Low fill hemisphere light";
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
  scene.add(directional);
  scene.add(directional.target);

  const fireLight = new THREE.PointLight(0xff8a2d, 9.5, 8.5, 2.0);
  fireLight.name = "Campfire point light";
  fireLight.position.set(0, 0.64, -0.16);
  fireLight.castShadow = true;
  fireLight.shadow.mapSize.set(512, 512);
  fireLight.shadow.camera.near = 0.08;
  fireLight.shadow.camera.far = 9.5;
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
  group.add(body);

  const limbMaterial = bodyMaterial.clone();
  limbMaterial.color.set(0x9bdfff);
  const limbs = [
    { name: "left arm", position: [-0.45, 0.54, -0.02], scale: [0.16, 0.19, 0.13] },
    { name: "right arm", position: [0.45, 0.54, -0.02], scale: [0.16, 0.19, 0.13] },
    { name: "left foot", position: [-0.22, 0.17, 0.05], scale: [0.20, 0.12, 0.14] },
    { name: "right foot", position: [0.22, 0.17, 0.05], scale: [0.20, 0.12, 0.14] }
  ];
  for (const limb of limbs) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), limbMaterial);
    mesh.name = `Bubble Boy ${limb.name}`;
    mesh.position.fromArray(limb.position);
    mesh.scale.fromArray(limb.scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
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
    headBone: null,
    neckBone: null,
    eyeFallback: null,
    baseState: "Idle",
    cursorTarget: new threeRef.Vector2(),
    cursorSmoothed: new threeRef.Vector2(),
    previousPosition: null,
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

export function updateBubbleBoyHumanoid(dt, input = {}, cursor = null, world = null) {
  const controller = bubbleBoyHumanoid;
  if (!controller || controller.disposed || controller.usingFallback || !controller.ready) {
    if (controller && controller.root) controller.root.visible = false;
    return false;
  }

  const simBoy = world && world.bubbleBoy ? world.bubbleBoy : {};
  const pose = simBoy.pose || {};
  const affect = simBoy.affect || {};
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

  controller.root.visible = true;
  controller.root.position.set(x, ground + bounce, z);
  if (Number.isFinite(simBoy.facing)) controller.root.rotation.y = simBoy.facing;
  updateHumanoidVelocity(controller, simBoy, dt, x, z);

  const baseState = selectBubbleBoyHumanoidBaseState(simBoy, controller.velocity.length());
  controller.baseState = baseState;
  const emote = selectBubbleBoyHumanoidEmote(simBoy);
  if (emote && emote.key !== controller.lastEmoteSource) {
    playBubbleBoyEmote(emote.name, 0.12);
    controller.lastEmoteSource = emote.key;
  } else if (!emote) {
    controller.lastEmoteSource = "";
  }
  if (!controller.currentEmote) setBubbleBoyAnimationState(baseState, 0.18);

  if (controller.mixer) controller.mixer.update(Math.max(0, dt || 0));
  updateBubbleBoyHumanoidHeadTracking(controller, dt, cursor, pose);

  window.__bubbleBoyMotion = {
    breath: 0,
    bounce,
    humanoid: true,
    humanoidState: controller.state,
    humanoidClips: controller.availableClips.slice(),
    headTracking: Boolean(controller.headBone),
    eyeFallback: Boolean(controller.eyeFallback && controller.eyeFallback.group.visible),
    lean: controller.cursorSmoothed.length(),
    visibilityScale: 1 + clamp((affect.attention || 0) * 0.015, 0, 0.015)
  };

  return true;
}

export function setBubbleBoyAnimationState(name, fade = 0.18) {
  const controller = bubbleBoyHumanoid;
  if (!controller || !controller.ready || controller.disposed) return false;
  const stateName = canonicalHumanoidBaseState(name);
  const next = findBubbleBoyHumanoidAction(controller, HUMANOID_BASE_CLIPS[stateName] || [stateName]);
  if (!next) return false;
  if (controller.activeAction === next && controller.state === stateName) return true;

  const fadeSeconds = Number.isFinite(fade) ? Math.max(0, fade) : 0.18;
  controller.prevAction = controller.activeAction;
  if (controller.prevAction && controller.prevAction !== next) controller.prevAction.fadeOut(fadeSeconds);

  next.enabled = true;
  next.reset();
  next.setLoop(THREE.LoopRepeat, Infinity);
  next.clampWhenFinished = false;
  next.setEffectiveTimeScale(1);
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
  if (controller.headBone) controller.headBone.userData.bubbleBoyRestRotation = controller.headBone.rotation.clone();
  if (controller.neckBone) controller.neckBone.userData.bubbleBoyRestRotation = controller.neckBone.rotation.clone();
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

function updateHumanoidVelocity(controller, simBoy, dt, x, z) {
  const velocity = simBoy.velocity || {};
  if (Number.isFinite(velocity.x) || Number.isFinite(velocity.z)) {
    controller.velocity.set(Number(velocity.x) || 0, Number(velocity.y) || 0, Number(velocity.z) || 0);
  } else if (controller.previousPosition && dt > 0) {
    controller.velocity.set(
      (x - controller.previousPosition.x) / dt,
      0,
      (z - controller.previousPosition.z) / dt
    );
  } else {
    controller.velocity.set(0, 0, 0);
  }
  controller.previousPosition = { x, z };
}

function selectBubbleBoyHumanoidBaseState(simBoy, speed) {
  const action = normalizeHumanoidKey(simBoy.currentAction);
  const goal = normalizeHumanoidKey(simBoy.goal);
  const moving =
    action === "walking" ||
    action === "walk" ||
    action === "running" ||
    action === "run" ||
    goal === "wander" ||
    goal === "approachfire" ||
    goal === "returntofire" ||
    goal === "followintent";
  if (!moving) return "Idle";
  if (action === "running" || action === "run" || goal === "followintent" || speed > 0.72) return "Running";
  return speed > 0.04 || goal === "wander" || goal === "approachfire" || goal === "returntofire" ? "Walking" : "Idle";
}

function selectBubbleBoyHumanoidEmote(simBoy) {
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

  return { group, flameGroup, flameMeshes, sparkGroup, emberDisc, flameOuter, flameMid, flameInner };
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

function calculateCanonicalCelestial(env) {
  const light = env.lighting;
  const sunPosition = arrayToVector3(light.sunPosition, [0, -128, 0]);
  const moonPosition = arrayToVector3(light.moonPosition, [0, 128, 0]);
  const sunDirection = normalizeVector3FromArray(light.sunDirection, sunPosition);
  const moonDirection = normalizeVector3FromArray(light.moonDirection, moonPosition);
  const sunIntensity = clamp(light.sunIntensity || 0, 0, 1.4);
  const moonIntensity = clamp(light.moonIntensity || 0, 0, 1.0);
  const useSun = sunIntensity >= moonIntensity * 1.15 || sunIntensity > 0.06;
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

function syncLighting({ celestial, lighting, sky, water, stars, celestialBodies, scene, renderer, time }) {
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
  renderer.toneMappingExposure = 0.09 + dayFactor * 0.25 + warmFactor * 0.045 + (usingSun ? 0 : celestial.moonIntensity * 0.04);

  lighting.directional.position.copy(lightAnchor.position);
  lighting.directional.target.position.set(0, 0.12, 0);
  lighting.directional.target.updateMatrixWorld();
  lighting.directional.color.copy(lightAnchor.color);
  lighting.directional.intensity =
    lightAnchor.source === "sun" ? celestial.sunIntensity * 2.55 : celestial.moonIntensity * 0.72;

  lighting.hemisphere.color.copy(new THREE.Color(0x8ecbff).lerp(new THREE.Color(0x526894), nightFactor * 0.62));
  lighting.hemisphere.groundColor.copy(new THREE.Color(0xa87549).lerp(new THREE.Color(0x322d34), nightFactor * 0.72));
  lighting.hemisphere.intensity = 0.20 + dayFactor * 0.52 + celestial.moonIntensity * 0.18 + warmFactor * 0.10;

  const fireIntensity = env.lighting.fireIntensity;
  lighting.fireLight.color.set(0xff8a2d);
  lighting.fireLight.intensity = fireIntensity * (nightFactor > 0.35 ? 24.0 : 15.0);
  lighting.fireLight.distance = fireIntensity > 0.01 ? 5.2 + fireIntensity * 4.2 : 0;

  window.__toyboxRenderSource = {
    source: lightAnchor.source,
    skyIsThreeSky: Boolean(sky.isSky),
    skyShaderTinted: sky.material.fragmentShader.includes("skyTintStrength"),
    skySunPosition: skyUniforms.sunPosition.value.toArray(),
    visibleSourcePosition: lightAnchor.position.toArray(),
    directionalLightPosition: lighting.directional.position.toArray(),
    directionalLightTarget: lighting.directional.target.position.toArray(),
    waterSunDirection: water.material.uniforms.sunDirection.value.toArray(),
    fireLightPosition: lighting.fireLight.position.toArray(),
    fireLightIntensity: lighting.fireLight.intensity
  };

  stars.material.opacity = clamp(nightFactor * 0.56 + celestial.moonIntensity * 0.30 - dayFactor * 0.55, 0, 0.56);
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
  const sunOpacity = celestialOpacity(celestial.sunPosition, celestial.sunIntensity, 0.24);
  const moonOpacity = celestialOpacity(celestial.moonPosition, celestial.moonIntensity, 0.38);

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
  const horizonFade = smoothstep(CELESTIAL_HORIZON_Y - 8.0, CELESTIAL_HORIZON_Y + 8.0, position.y);
  return clamp(horizonFade * (floor + intensity * 0.86), 0, 1);
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

function syncFire(fire, lighting, env, worldState, time) {
  const firePit = worldState.objects["fire-pit"];
  const x = firePit.position.x;
  const z = firePit.position.z;
  const y = groundHeightAt(x, z);
  fire.group.position.set(x, y + 0.01, z);
  const intensity = clamp(env.lighting.fireIntensity, 0, 1.0);
  const lit = Boolean(firePit.lit && intensity > 0.01);
  const flicker = 0.96 + Math.sin(time * 8.2) * 0.035 + Math.sin(time * 13.7 + 0.4) * 0.025;
  fire.flameGroup.visible = lit;
  fire.sparkGroup.visible = lit;
  fire.emberDisc.visible = lit;
  fire.flameGroup.scale.set(0.88 + intensity * 0.12, (0.82 + intensity * 0.30) * flicker, 0.88 + intensity * 0.12);
  fire.flameGroup.rotation.y = Math.sin(time * 2.2) * 0.06;
  fire.emberDisc.material.opacity = 0.18 + intensity * 0.18 + Math.sin(time * 6.1) * 0.025;
  for (let i = 0; i < fire.flameMeshes.length; i += 1) {
    const flame = fire.flameMeshes[i];
    const pulse = 1 + Math.sin(time * (4.0 + i * 1.7) + i * 0.9) * (0.025 + i * 0.006);
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

function syncBubbleBoy(bubbleBoy, humanoidController, worldState, time, deltaSeconds, cursor) {
  const humanoidActive =
    humanoidController &&
    updateBubbleBoyHumanoid(
      deltaSeconds,
      {
        groundHeightAt
      },
      cursor,
      worldState
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

  window.__bubbleBoyMotion = {
    breath: bubbleBoy.breath,
    bounce,
    lean: Math.hypot(gx, gy),
    visibilityScale: 1
  };
}

function syncCamera(camera3d, cameraState) {
  const eye = [
    cameraState.target[0] + Math.cos(cameraState.theta) * Math.sin(cameraState.phi) * cameraState.distance,
    cameraState.target[1] + Math.cos(cameraState.phi) * cameraState.distance,
    cameraState.target[2] + Math.sin(cameraState.theta) * Math.sin(cameraState.phi) * cameraState.distance
  ];
  camera3d.position.fromArray(eye);
  camera3d.lookAt(cameraState.target[0], cameraState.target[1], cameraState.target[2]);
}

function syncTrace(canvas, env, celestial, simulationTicks) {
  canvas.dataset.simTick = String(window.__toyboxWorldState.sim.tick);
  canvas.dataset.simTicksThisFrame = String(simulationTicks);
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
  canvas.dataset.bubbleBoyBrain = "simulation";
  canvas.dataset.bubbleBoyGoal = window.__toyboxWorldState.bubbleBoy.goal;
  canvas.dataset.bubbleBoyAction = window.__toyboxWorldState.bubbleBoy.currentAction;
  canvas.dataset.bubbleBoyMood = window.__toyboxWorldState.bubbleBoy.mood;
  canvas.dataset.bubbleBoyPosition = formatPlainVector(window.__toyboxWorldState.bubbleBoy.position);
  canvas.dataset.firePitPosition = formatPlainVector(window.__toyboxWorldState.objects["fire-pit"].position);
  const humanoid = typeof window !== "undefined" ? window.__bubbleBoyHumanoid : null;
  canvas.dataset.bubbleBoyRenderer = humanoid && humanoid.ready && !humanoid.fallback ? "humanoid" : "procedural";
  canvas.dataset.bubbleBoyHumanoidState = humanoid ? humanoid.state : "none";
  canvas.dataset.bubbleBoyHumanoidFallback = humanoid ? String(humanoid.fallback) : "true";
  const motion = typeof window !== "undefined" ? window.__bubbleBoyMotion || {} : {};
  canvas.dataset.bubbleBoyHeadTracking = String(Boolean(motion.headTracking));
  canvas.dataset.bubbleBoyLookLean = Number(motion.lean || 0).toFixed(3);

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
