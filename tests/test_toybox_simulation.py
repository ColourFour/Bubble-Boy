import shutil
import subprocess
import textwrap

import pytest


@pytest.mark.skipif(shutil.which("node") is None, reason="Node.js is required for JS simulation tests")
def test_toybox_simulation_replay_is_deterministic():
    script = textwrap.dedent(
        """
        import { createInitialWorldState } from "./bubble_ui/static/toybox/simulation/worldState.js";
        import { simulate } from "./bubble_ui/static/toybox/simulation/simulate.js";

        function runReplay() {
          const state = createInitialWorldState({
            toyboxState: { mood: "curious", weather: "storm", time_of_day: "twilight" }
          });
          const intents = [
            {
              type: "userPresence",
              active: true,
              ageSeconds: 0.1,
              position: { x: 0.1, y: 1.0, z: -0.4 }
            }
          ];
          for (let tick = 0; tick < 900; tick += 1) {
            simulate(1 / 60, state, intents);
          }
          return JSON.stringify({
            tick: state.sim.tick,
            phase: state.time.phase,
            action: state.bubbleBoy.currentAction,
            mood: state.bubbleBoy.mood,
            position: state.bubbleBoy.position,
            wind: state.environment.wind,
            fire: state.environment.light.fireIntensity
          });
        }

        const first = runReplay();
        const second = runReplay();
        if (first !== second) {
          console.error(first);
          console.error(second);
          process.exit(1);
        }
        """
    )

    result = subprocess.run(
        ["node", "--experimental-default-type=module", "--input-type=module", "-e", script],
        check=False,
        cwd=".",
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0, result.stderr
