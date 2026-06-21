import assert from "node:assert/strict";
import test from "node:test";

import {
  DAY_1_5_PRESENTATION_ACTIONS,
  LEGACY_ACTION_PRESENTATION_MAP,
  resolveToyboxPresentationState
} from "../../bubble_ui/static/toybox/presentation/presentationState.js";
import { assetSourceMetadata } from "../../bubble_ui/static/toybox/presentation/assetSource.js";
import { createInitialWorldState } from "../../bubble_ui/static/toybox/simulation/worldState.js";

const EXPECTED_OVERLAYS = Object.freeze({
  arriveLookAround: "gazeLookAround",
  gatherLooseSupplies: "bendPickup",
  pickupMaterial: "pickup",
  carryBundle: "carryAttachment",
  lightFire: "crouchFire",
  tendFire: "fireCare",
  buildHammock: "tieBuild",
  sleepInHammock: "sleepPose",
  wakeStretch: "stretch"
});

test("presentation resolver returns stable descriptors for Day 1-5 semantic labels", () => {
  for (const action of DAY_1_5_PRESENTATION_ACTIONS) {
    const worldState = createInitialWorldState({ seed: 101 });
    worldState.bubbleBoy.currentAction = action;
    if (action === "carryBundle") {
      worldState.bubbleBoy.velocity = { x: 0.4, y: 0, z: 0 };
    }

    const before = JSON.stringify(worldState);
    const descriptor = resolveToyboxPresentationState(worldState);
    const after = JSON.stringify(worldState);

    assert.equal(after, before, `${action} should not mutate worldState`);
    assert.equal(descriptor.selectedAction, action);
    assert.equal(descriptor.proceduralOverlay, EXPECTED_OVERLAYS[action]);
    assert.equal(typeof descriptor.animation.clip, "string");
    assert.equal(Array.isArray(descriptor.visuals), true);
    assert.equal(descriptor.visuals.length >= 6, true);
    assert.equal(isPlainData(descriptor), true, `${action} descriptor should be plain data`);
    assert.deepEqual(JSON.parse(JSON.stringify(descriptor)), descriptor);
  }
});

test("presentation resolver falls back safely for unknown actions", () => {
  const worldState = createInitialWorldState({ seed: 102 });
  worldState.bubbleBoy.currentAction = "unknownFutureAction";

  const descriptor = resolveToyboxPresentationState(worldState);

  assert.equal(descriptor.selectedAction, "arriveLookAround");
  assert.equal(descriptor.animation.clip, "Idle");
  assert.equal(descriptor.debug.selectedPresentationAction, "arriveLookAround");
  assert.equal(descriptor.unapprovedAssetCount, 0);
});

test("presentation resolver preserves existing action mappings", () => {
  for (const [legacyAction, presentationAction] of Object.entries(LEGACY_ACTION_PRESENTATION_MAP)) {
    const worldState = createInitialWorldState({ seed: 103 });
    worldState.bubbleBoy.currentAction = legacyAction;
    if (legacyAction === "walking") {
      worldState.bubbleBoy.velocity = { x: 0.2, y: 0, z: 0.1 };
    }

    const descriptor = resolveToyboxPresentationState(worldState);

    assert.equal(descriptor.selectedAction, presentationAction, legacyAction);
    assert.equal(typeof descriptor.debug.selectedAnimationFallback, "string");
  }
});

test("presentation resolver reports carry attachment and active visual families", () => {
  const worldState = createInitialWorldState({ seed: 104 });
  worldState.bubbleBoy.currentAction = "carryBundle";

  const descriptor = resolveToyboxPresentationState(worldState);

  assert.equal(descriptor.attachment.id, "carryBundle");
  assert.equal(descriptor.attachment.anchorType, "bbAttachment");
  assert.equal(descriptor.activeVisualFamilies.includes("carryBundle"), true);
  assert.equal(descriptor.debug.selectedCarryAttachment, "carryBundle");
});

test("external asset metadata defaults to unapproved without a confirmed license", () => {
  assert.equal(assetSourceMetadata({ sourceType: "external" }).approvedForUse, false);
  assert.equal(assetSourceMetadata({ sourceType: "external", approvedForUse: true }).approvedForUse, false);
  assert.equal(
    assetSourceMetadata({ sourceType: "external", license: "CC0", approvedForUse: true }).approvedForUse,
    true
  );
});

function isPlainData(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.every(isPlainData);
  if (typeof value !== "object") {
    return ["string", "number", "boolean"].includes(typeof value);
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Object.values(value).every(isPlainData);
}
