const MOVEMENT_KEYS = new Set([
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowleft",
  "arrowdown",
  "arrowright",
  "q",
  "e",
  "r",
  "f",
  " ",
  "spacebar",
  "shift",
  "pageup",
  "pagedown"
]);

const MIN_CAMERA_PHI = 0.04;
const MAX_CAMERA_PHI = Math.PI - 0.04;
const DEFAULT_MIN_DISTANCE = 1.4;
const DEFAULT_MAX_DISTANCE = 180;
const DEFAULT_FLOOR_OFFSET = 0.16;

export function createCameraController(canvas, options) {
  const camera = {
    theta: 2.90,
    phi: 1.42,
    distance: 8.8,
    target: [0.26, 0.84, -0.06],
    desiredTarget: [0.26, 0.84, -0.06],
    dragging: false,
    lastX: 0,
    lastY: 0,
    lastInteraction: 0
  };
  const pressedKeys = new Set();
  const cursor = {
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    active: false,
    lastMoved: 0
  };

  function movementKey(key) {
    return MOVEMENT_KEYS.has(key.toLowerCase());
  }

  function updateCursor(event) {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width || canvas.clientWidth || 1);
    const height = Math.max(1, rect.height || canvas.clientHeight || 1);
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    cursor.normalizedX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / width) * 2 - 1));
    cursor.normalizedY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / height) * 2 - 1));
    cursor.active = true;
    cursor.lastMoved = performance.now();
  }

  window.addEventListener("keydown", (event) => {
    if (!movementKey(event.key)) return;
    pressedKeys.add(event.key.toLowerCase());
    camera.lastInteraction = performance.now();
    event.preventDefault();
  });

  window.addEventListener("keyup", (event) => {
    if (!movementKey(event.key)) return;
    pressedKeys.delete(event.key.toLowerCase());
    event.preventDefault();
  });

  window.addEventListener("blur", () => {
    pressedKeys.clear();
  });

  canvas.addEventListener("pointerdown", (event) => {
    updateCursor(event);
    camera.dragging = true;
    camera.lastX = event.clientX;
    camera.lastY = event.clientY;
    camera.lastInteraction = performance.now();
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    updateCursor(event);
    if (!camera.dragging) return;
    const dx = event.clientX - camera.lastX;
    const dy = event.clientY - camera.lastY;
    camera.lastX = event.clientX;
    camera.lastY = event.clientY;
    camera.theta -= dx * 0.008;
    camera.phi = Math.max(MIN_CAMERA_PHI, Math.min(MAX_CAMERA_PHI, camera.phi + dy * 0.006));
    camera.lastInteraction = performance.now();
  });

  canvas.addEventListener("pointerup", (event) => {
    camera.dragging = false;
    camera.lastInteraction = performance.now();
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointercancel", () => {
    camera.dragging = false;
    cursor.active = false;
    camera.lastInteraction = performance.now();
  });

  canvas.addEventListener("pointerleave", () => {
    if (!camera.dragging) cursor.active = false;
  });

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const minDistance = Number.isFinite(options.minDistance) ? options.minDistance : DEFAULT_MIN_DISTANCE;
    const maxDistance = Number.isFinite(options.maxDistance) ? options.maxDistance : DEFAULT_MAX_DISTANCE;
    camera.distance = Math.max(minDistance, Math.min(maxDistance, camera.distance + event.deltaY * 0.008));
    camera.lastInteraction = performance.now();
  }, { passive: false });

  function floorHeightAt(target) {
    if (typeof options.floorHeightAt !== "function") return -Infinity;
    const height = options.floorHeightAt(target[0], target[2]);
    return Number.isFinite(height) ? height : -Infinity;
  }

  function clampTargetToFloor(target) {
    const floorOffset = Number.isFinite(options.floorOffset) ? options.floorOffset : DEFAULT_FLOOR_OFFSET;
    target[1] = Math.max(target[1], floorHeightAt(target) + floorOffset);
    return target;
  }

  function update(deltaSeconds) {
    let moveX = 0;
    let moveY = 0;
    let moveZ = 0;
    if (pressedKeys.has("w") || pressedKeys.has("arrowup")) moveZ += 1;
    if (pressedKeys.has("s") || pressedKeys.has("arrowdown")) moveZ -= 1;
    if (pressedKeys.has("d") || pressedKeys.has("arrowright")) moveX += 1;
    if (pressedKeys.has("a") || pressedKeys.has("arrowleft")) moveX -= 1;
    if (pressedKeys.has("r") || pressedKeys.has(" ") || pressedKeys.has("spacebar") || pressedKeys.has("pageup")) moveY += 1;
    if (pressedKeys.has("f") || pressedKeys.has("shift") || pressedKeys.has("pagedown")) moveY -= 1;
    if (pressedKeys.has("q")) camera.theta += deltaSeconds * 1.35;
    if (pressedKeys.has("e")) camera.theta -= deltaSeconds * 1.35;

    if (moveX || moveY || moveZ) {
      const sinPhi = Math.sin(camera.phi);
      const cosPhi = Math.cos(camera.phi);
      const forward = [-Math.cos(camera.theta) * sinPhi, -cosPhi, -Math.sin(camera.theta) * sinPhi];
      const right = [Math.sin(camera.theta), 0, -Math.cos(camera.theta)];
      const up = [0, 1, 0];
      const move = [
        forward[0] * moveZ + right[0] * moveX + up[0] * moveY,
        forward[1] * moveZ + right[1] * moveX + up[1] * moveY,
        forward[2] * moveZ + right[2] * moveX + up[2] * moveY
      ];
      const length = Math.hypot(move[0], move[1], move[2]) || 1;
      const speed = options.speed || 7.2;
      const step = (speed * deltaSeconds) / length;
      camera.desiredTarget[0] += move[0] * step;
      camera.desiredTarget[1] += move[1] * step;
      camera.desiredTarget[2] += move[2] * step;
      if (typeof options.clampTarget === "function") {
        camera.desiredTarget = options.clampTarget(camera.desiredTarget);
      }
    }
    clampTargetToFloor(camera.desiredTarget);

    const smoothing = 1 - Math.exp(-deltaSeconds * (options.smoothing || 7.5));
    camera.target[0] += (camera.desiredTarget[0] - camera.target[0]) * smoothing;
    camera.target[1] += (camera.desiredTarget[1] - camera.target[1]) * smoothing;
    camera.target[2] += (camera.desiredTarget[2] - camera.target[2]) * smoothing;
  }

  return { camera, pressedKeys, cursor, update };
}
