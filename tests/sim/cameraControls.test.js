import assert from "node:assert/strict";
import test from "node:test";

import { createCameraController } from "../../bubble_ui/static/toybox/controls.js";

function createHarness() {
  const windowListeners = new Map();
  const canvasListeners = new Map();
  const previousWindow = globalThis.window;

  globalThis.window = {
    addEventListener(type, handler) {
      windowListeners.set(type, handler);
    }
  };

  const canvas = {
    clientWidth: 800,
    clientHeight: 600,
    addEventListener(type, handler) {
      canvasListeners.set(type, handler);
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 800, height: 600 };
    },
    setPointerCapture() {},
    releasePointerCapture() {},
    hasPointerCapture() {
      return false;
    }
  };

  function key(type, value) {
    const handler = windowListeners.get(type);
    assert.equal(typeof handler, "function", `${type} listener was not registered`);
    handler({
      key: value,
      preventDefault() {}
    });
  }

  function restore() {
    if (previousWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }
  }

  return { canvas, canvasListeners, key, restore, windowListeners };
}

test("camera controls can move freely past the old z boundary", () => {
  const harness = createHarness();
  try {
    const controller = createCameraController(harness.canvas, {
      speed: 10,
      smoothing: 10
    });
    controller.camera.theta = -Math.PI / 2;
    controller.camera.phi = Math.PI / 2;
    controller.camera.target = [0, 5, 34];
    controller.camera.desiredTarget = controller.camera.target.slice();

    harness.key("keydown", "w");
    controller.update(1);

    assert.ok(controller.camera.desiredTarget[2] > 43.9);
    assert.ok(Math.abs(controller.camera.desiredTarget[1] - 5) < 1e-9);
  } finally {
    harness.restore();
  }
});

test("camera controls support vertical target movement", () => {
  const harness = createHarness();
  try {
    const controller = createCameraController(harness.canvas, {
      speed: 10,
      smoothing: 10
    });
    controller.camera.theta = -Math.PI / 2;
    controller.camera.phi = Math.PI / 2;
    controller.camera.target = [0, 2, 0];
    controller.camera.desiredTarget = controller.camera.target.slice();

    harness.key("keydown", " ");
    controller.update(1);

    assert.ok(controller.camera.desiredTarget[1] > 11.9);
  } finally {
    harness.restore();
  }
});

test("camera controls keep the target above the configured floor", () => {
  const harness = createHarness();
  try {
    const controller = createCameraController(harness.canvas, {
      floorHeightAt: () => 1.5,
      floorOffset: 0.25,
      speed: 10,
      smoothing: 10
    });
    controller.camera.target = [0, 0, 0];
    controller.camera.desiredTarget = [0, 0, 0];

    controller.update(1 / 60);

    assert.equal(controller.camera.desiredTarget[1], 1.75);
    assert.ok(controller.camera.target[1] > 0);
  } finally {
    harness.restore();
  }
});

test("camera pitch allows looking past horizon and overhead limits", () => {
  const harness = createHarness();
  try {
    const controller = createCameraController(harness.canvas, {});
    const pointerMove = harness.canvasListeners.get("pointermove");
    assert.equal(typeof pointerMove, "function");
    controller.camera.dragging = true;
    controller.camera.lastX = 0;
    controller.camera.lastY = 0;

    pointerMove({ clientX: 0, clientY: 400, preventDefault() {} });
    assert.ok(controller.camera.phi > 1.48);

    controller.camera.lastY = 400;
    pointerMove({ clientX: 0, clientY: -1000, preventDefault() {} });
    assert.ok(controller.camera.phi < 0.42);
  } finally {
    harness.restore();
  }
});
