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
  "e"
]);

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

  function movementKey(key) {
    return MOVEMENT_KEYS.has(key.toLowerCase());
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
    camera.dragging = true;
    camera.lastX = event.clientX;
    camera.lastY = event.clientY;
    camera.lastInteraction = performance.now();
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!camera.dragging) return;
    const dx = event.clientX - camera.lastX;
    const dy = event.clientY - camera.lastY;
    camera.lastX = event.clientX;
    camera.lastY = event.clientY;
    camera.theta -= dx * 0.008;
    camera.phi = Math.max(0.42, Math.min(1.48, camera.phi + dy * 0.006));
    camera.lastInteraction = performance.now();
  });

  canvas.addEventListener("pointerup", (event) => {
    camera.dragging = false;
    camera.lastInteraction = performance.now();
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointercancel", () => {
    camera.dragging = false;
    camera.lastInteraction = performance.now();
  });

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    camera.distance = Math.max(7.8, Math.min(24.0, camera.distance + event.deltaY * 0.008));
    camera.lastInteraction = performance.now();
  }, { passive: false });

  function update(deltaSeconds) {
    let moveX = 0;
    let moveZ = 0;
    if (pressedKeys.has("w") || pressedKeys.has("arrowup")) moveZ += 1;
    if (pressedKeys.has("s") || pressedKeys.has("arrowdown")) moveZ -= 1;
    if (pressedKeys.has("d") || pressedKeys.has("arrowright")) moveX += 1;
    if (pressedKeys.has("a") || pressedKeys.has("arrowleft")) moveX -= 1;
    if (pressedKeys.has("q")) camera.theta += deltaSeconds * 1.35;
    if (pressedKeys.has("e")) camera.theta -= deltaSeconds * 1.35;

    if (moveX || moveZ) {
      const length = Math.hypot(moveX, moveZ) || 1;
      const forward = [-Math.cos(camera.theta), -Math.sin(camera.theta)];
      const right = [Math.sin(camera.theta), -Math.cos(camera.theta)];
      const speed = options.speed || 7.2;
      const step = (speed * deltaSeconds) / length;
      camera.desiredTarget[0] += (forward[0] * moveZ + right[0] * moveX) * step;
      camera.desiredTarget[2] += (forward[1] * moveZ + right[1] * moveX) * step;
      camera.desiredTarget = options.clampTarget(camera.desiredTarget);
      camera.desiredTarget[1] = options.groundHeightAt(camera.desiredTarget[0], camera.desiredTarget[2]) + 0.96;
    }

    const smoothing = 1 - Math.exp(-deltaSeconds * (options.smoothing || 7.5));
    camera.target[0] += (camera.desiredTarget[0] - camera.target[0]) * smoothing;
    camera.target[1] += (camera.desiredTarget[1] - camera.target[1]) * smoothing;
    camera.target[2] += (camera.desiredTarget[2] - camera.target[2]) * smoothing;
  }

  return { camera, pressedKeys, update };
}
