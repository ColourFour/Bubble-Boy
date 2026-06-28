# Bubble Boy Motion Standard

Bubble Boy actions should converge on this motion grammar:

`idle -> notice -> orient -> move -> arrive -> face -> act -> react -> recover -> idle`

This document is the written/runtime standard for BB motion before behavior changes. The current runtime does not yet execute a full phase state machine; it exposes the trace needed to see which part of the grammar an action is occupying and which phases are still skipped.

## Phase Definitions

| Phase | Acceptable meaning |
| --- | --- |
| `idle` | BB has no active target or task pressure. Breath, gaze, and tiny posture shifts are allowed. |
| `notice` | BB becomes aware of a goal, object, stimulus, user intent, or life-loop requirement. |
| `orient` | BB turns attention toward the target before translation. Head/gaze may lead the body. |
| `move` | BB translates toward a target or route with visible velocity. |
| `arrive` | BB decelerates, settles his feet/body, and stops close enough to work. |
| `face` | BB aligns body/gaze/hands toward the target after arriving. |
| `act` | BB performs the semantic task: build, gather, sleep, fish, cook, inspect, play, etc. |
| `react` | BB responds to the result: success, surprise, user response, catch, completion, failure. |
| `recover` | BB exits the task pose, releases locks/attachments, and settles back to neutral. |
| `idle` | BB returns to an interruptible baseline. |

## Runtime Trace Contract

The runtime trace is exposed on `worldState.bubbleBoy.motionDebug` and, in the browser after presentation resolution, on `window.__bubbleBoyMotionDebug`.

Required fields:

| Field | Meaning |
| --- | --- |
| `goal` | Current behavior goal, for example `interact`, `lifeArrive`, or `buildProject`. |
| `action` | Current simulation action, for example `walking`, `gatheringWood`, or `sleep`. |
| `animationClip` | Presentation-selected animation clip after render resolution; blank in pure sim tests. |
| `animationPhase` | Current diagnostic phase from the standard grammar. |
| `targetObjectId` | Runtime target id, or `null` when there is no target. |
| `distanceToTarget` | 2D distance from BB to the target, or `null` without a target. |
| `facingError` | Signed yaw error to target in radians, or `null` without a target. |
| `velocity` | Current simulation velocity vector. |
| `isArrived` | Whether BB is within the current target's acceptable work radius. |
| `isActionLocked` | Whether `minActionTime` is still preventing action changes. |

The debug panel also prints these values as:

- `bb motion: goal ... action ... clip ... phase ...`
- `bb target: ... distance ... facingError ... arrived ... locked ...`
- `bb velocity: ...`

## Current Action Phase Gaps

This is the current state of the sim action vocabulary. "Current phase" means the diagnostic phase the trace reports today. "Skipped phases" are not invalid forever; they are the gaps future BB behavior should close.

| Current action | Current phase | Skipped phases today |
| --- | --- | --- |
| `idle` | `idle` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `react`, `recover` |
| `lookingAround` | `notice` | `orient`, `move`, `arrive`, `face`, `act`, `react`, `recover` |
| `walking` | `move` or `arrive` | `notice`, `orient`, `face`, `act`, `react`, `recover` |
| `resting` | `recover` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `react` |
| `warmingHands` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `tendingFire` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `sitting` | `recover` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `react` |
| `interacting` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `foraging` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `fishing` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `cookingFish` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `eatingFish` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `gatheringWood` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `building` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `inspect` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `sleep` | `recover` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `react` |
| `playToy` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `celebrate` | `react` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `recover` |
| `arriveLookAround` | `notice` | `orient`, `move`, `arrive`, `face`, `act`, `react`, `recover` |
| `gatherLooseSupplies` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `buildHammock` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `wakeStretch` | `recover` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `react` |
| `walkRoute` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `kneelMarkZone` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `clearPath` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `castFishingLine` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `catchReaction` | `react` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `recover` |
| `sitRestSpot` | `recover` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `react` |
| `sleepLoop` | `recover` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `react` |
| `quietCelebrate` | `react` | `notice`, `orient`, `move`, `arrive`, `face`, `act`, `recover` |
| `inspectCampLayout` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `sortMaterials` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `depositStorage` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `tidyCamp` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `rakePath` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |
| `sweepLeaves` | `act` | `notice`, `orient`, `move`, `arrive`, `face`, `react`, `recover` |

## Future Rule

Every new BB behavior should declare how it travels through the grammar. It is acceptable for short behaviors to collapse adjacent phases, but the collapse must be visible in debug state rather than implicit in animation choice.
