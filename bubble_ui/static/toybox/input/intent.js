const MOVE_KEYS = {
  w: { x: 0, z: 1 },
  arrowup: { x: 0, z: 1 },
  s: { x: 0, z: -1 },
  arrowdown: { x: 0, z: -1 },
  d: { x: 1, z: 0 },
  arrowright: { x: 1, z: 0 },
  a: { x: -1, z: 0 },
  arrowleft: { x: -1, z: 0 }
};

export function createIntentCollector(options = {}) {
  const camera = options.camera;
  const pressedKeys = options.pressedKeys;
  const emitMoveIntents = Boolean(options.emitMoveIntents);

  function collectIntents(now) {
    const intents = [];
    if (!camera) return intents;

    const activeKeys = pressedKeys && typeof pressedKeys.size === "number" ? pressedKeys : new Set();
    const ageMs = Math.max(0, now - (Number.isFinite(camera.lastInteraction) ? camera.lastInteraction : 0));
    const active = activeKeys.size > 0 || Boolean(camera.dragging) || ageMs < 1250;
    intents.push({
      type: "userPresence",
      active,
      ageSeconds: ageMs / 1000,
      position: {
        x: finiteTargetValue(camera.target, 0, 0),
        y: finiteTargetValue(camera.target, 1, 0.96),
        z: finiteTargetValue(camera.target, 2, 0)
      }
    });

    if (emitMoveIntents) {
      const move = movementVector(activeKeys);
      if (move.x || move.z) {
        intents.push({ type: "move", direction: move });
      }
    }

    return intents;
  }

  return { collectIntents };
}

function movementVector(pressedKeys) {
  let x = 0;
  let z = 0;
  for (const key of pressedKeys) {
    const vector = MOVE_KEYS[String(key).toLowerCase()];
    if (!vector) continue;
    x += vector.x;
    z += vector.z;
  }
  const length = Math.hypot(x, z);
  if (!length) return { x: 0, z: 0 };
  return { x: x / length, z: z / length };
}

function finiteTargetValue(target, index, fallback) {
  const value = Array.isArray(target) ? target[index] : fallback;
  return Number.isFinite(value) ? value : fallback;
}
