import * as RAPIER from "./vendor/rapier3d/rapier.mjs";

const WASM_URL = new URL("./vendor/rapier3d/rapier_wasm3d_bg.wasm", import.meta.url).href;

let rapierReady = null;

function toVector(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  return {
    x: Number(value[0]) || 0,
    y: Number(value[1]) || 0,
    z: Number(value[2]) || 0
  };
}

function colliderDesc(engine, shape) {
  if (shape.type === "ball") return engine.ColliderDesc.ball(shape.radius);
  if (shape.type === "cylinder") return engine.ColliderDesc.cylinder(shape.halfHeight, shape.radius);
  return engine.ColliderDesc.cuboid(shape.halfExtents[0], shape.halfExtents[1], shape.halfExtents[2]);
}

function floorClearanceForShape(shape) {
  if (shape.type === "ball") return shape.radius;
  if (shape.type === "cylinder") return shape.halfHeight;
  if (Array.isArray(shape.halfExtents)) return shape.halfExtents[1];
  return 0;
}

function setColliderMaterial(desc, options) {
  desc.setFriction(options.friction ?? 0.82);
  desc.setRestitution(options.restitution ?? 0.04);
  return desc;
}

function quaternionToEuler(rotation) {
  const x = rotation.x;
  const y = rotation.y;
  const z = rotation.z;
  const w = rotation.w;
  const sinr = 2 * (w * x + y * z);
  const cosr = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinr, cosr);
  const sinp = 2 * (w * y - z * x);
  const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);
  const siny = 2 * (w * z + x * y);
  const cosy = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(siny, cosy);
  return [pitch, yaw, roll];
}

export function createBreezeState(options = {}) {
  const direction = toVector(options.direction, { x: 0.72, y: 0, z: -0.42 });
  const length = Math.hypot(direction.x, direction.z) || 1;
  const normalized = { x: direction.x / length, y: 0, z: direction.z / length };
  const strength = options.strength ?? 0.34;
  return {
    direction: normalized,
    strength,
    gustAt(timeSeconds) {
      const slow = Math.sin(timeSeconds * 0.32 + 1.4) * 0.5 + 0.5;
      const quick = Math.sin(timeSeconds * 1.13 + 0.7) * 0.5 + 0.5;
      return 0.55 + slow * 0.30 + quick * 0.15;
    },
    vectorAt(timeSeconds) {
      const gust = this.gustAt(timeSeconds);
      return {
        x: this.direction.x * this.strength * gust,
        y: 0,
        z: this.direction.z * this.strength * gust,
        gust
      };
    }
  };
}

export async function createPhysicsWorld(options = {}) {
  if (!rapierReady) {
    rapierReady = RAPIER.init({ module_or_path: WASM_URL });
  }
  await rapierReady;

  const world = new RAPIER.World(options.gravity || { x: 0, y: -9.81, z: 0 });
  const eventQueue = new RAPIER.EventQueue(true);
  const dynamicBodies = [];
  const colliders = [];
  let accumulator = 0;

  function addStaticCollider(config) {
    const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      config.position[0],
      config.position[1],
      config.position[2]
    );
    if (config.rotation) {
      bodyDesc.setRotation(config.rotation);
    }
    const body = world.createRigidBody(bodyDesc);
    const desc = setColliderMaterial(colliderDesc(RAPIER, config.shape), config);
    const collider = world.createCollider(desc, body);
    const record = { body, collider, static: true, config };
    colliders.push(record);
    return record;
  }

  function addDynamicBody(config) {
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
      config.position[0],
      config.position[1],
      config.position[2]
    );
    if (config.linearDamping != null) bodyDesc.setLinearDamping(config.linearDamping);
    if (config.angularDamping != null) bodyDesc.setAngularDamping(config.angularDamping);
    if (config.canSleep === false) bodyDesc.setCanSleep(false);
    const body = world.createRigidBody(bodyDesc);
    const desc = setColliderMaterial(colliderDesc(RAPIER, config.shape), config);
    if (config.density != null) desc.setDensity(config.density);
    const collider = world.createCollider(desc, body);
    const record = {
      body,
      collider,
      mesh: config.mesh || null,
      affectsWind: Boolean(config.affectsWind),
      windArea: config.windArea ?? 0.12,
      floorClearance: config.floorClearance ?? floorClearanceForShape(config.shape),
      config
    };
    dynamicBodies.push(record);
    return record;
  }

  function syncMeshToBody(mesh, body) {
    if (!mesh || !body) return;
    const position = body.translation();
    mesh.position = [position.x, position.y, position.z];
    if (mesh.syncRotation !== false) {
      mesh.rotation = quaternionToEuler(body.rotation());
    }
  }

  function applyImpulse(record, impulse) {
    if (!record?.body) return;
    record.body.applyImpulse(toVector(impulse, { x: 0, y: 0, z: 0 }), true);
  }

  function applyForce(record, force) {
    if (!record?.body) return;
    record.body.addForce(toVector(force, { x: 0, y: 0, z: 0 }), true);
  }

  function floorHeightAt(environment, x, z) {
    if (typeof environment.floorHeightAt === "function") {
      const height = environment.floorHeightAt(x, z);
      if (Number.isFinite(height)) return height;
    }
    return Number.isFinite(environment.floorY) ? environment.floorY : -Infinity;
  }

  function enforceDynamicBodyFloor(record, environment) {
    if (!record?.body) return;
    const position = record.body.translation();
    const floorY = floorHeightAt(environment, position.x, position.z);
    const minY = floorY + (record.floorClearance || 0);
    if (!Number.isFinite(minY) || position.y >= minY) return;

    record.body.setTranslation({ x: position.x, y: minY, z: position.z }, true);
    if (typeof record.body.linvel === "function" && typeof record.body.setLinvel === "function") {
      const velocity = record.body.linvel();
      if (velocity.y < 0) {
        record.body.setLinvel({ x: velocity.x, y: 0, z: velocity.z }, true);
      }
    }
  }

  function stepPhysics(deltaSeconds, environment = {}) {
    const clampedDelta = Math.min(Math.max(deltaSeconds || 0, 0), 1 / 20);
    accumulator += clampedDelta;
    const fixedStep = 1 / 60;
    const wind = environment.wind;
    while (accumulator >= fixedStep) {
      if (wind) {
        for (const record of dynamicBodies) {
          if (!record.affectsWind) continue;
          applyForce(record, {
            x: wind.x * record.windArea,
            y: 0,
            z: wind.z * record.windArea
          });
        }
      }
      world.timestep = fixedStep;
      world.step(eventQueue);
      for (const record of dynamicBodies) {
        enforceDynamicBodyFloor(record, environment);
      }
      accumulator -= fixedStep;
    }
    for (const record of dynamicBodies) {
      syncMeshToBody(record.mesh, record.body);
    }
  }

  return {
    engine: "Rapier 3D",
    version: RAPIER.version(),
    world,
    eventQueue,
    colliders,
    dynamicBodies,
    addStaticCollider,
    addDynamicBody,
    stepPhysics,
    syncMeshToBody,
    applyImpulse,
    applyForce,
    RAPIER
  };
}
