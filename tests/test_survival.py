from bubble_boy.survival import (
    attachmentAlignment,
    createDrives,
    runDriveLoop,
    scoreAction,
    selectCandidateAction,
    updateDrivesAfterTurn,
)


def test_create_drives_clamps_scalars_and_attachment_map():
    drives = createDrives(
        {
            "curiosity": 120,
            "comfort": -10,
            "ambition": 80,
            "fatigue": 101,
            "attachment": {"toybox": 150, "": 40},
        }
    )

    assert drives == {
        "curiosity": 100,
        "comfort": 0,
        "ambition": 80,
        "attachment": {"toybox": 100},
        "fatigue": 100,
    }


def test_score_action_uses_competing_drive_formula():
    drives = createDrives(
        {
            "curiosity": 80,
            "comfort": 20,
            "ambition": 40,
            "fatigue": 10,
            "attachment": {"toybox": 30},
        }
    )
    action = {
        "action_type": "explore",
        "attachment_keys": ["toybox"],
        "attachment_alignment": 0.5,
    }

    scored = scoreAction(action, drives)

    assert scored["curiosity"] == 76
    assert scored["comfort"] == 4
    assert scored["ambition"] == 18
    assert scored["attachment"] == 15
    assert scored["fatigue"] == 4.5
    assert scored["score"] == 108.5


def test_curiosity_dominant_selection_prefers_exploration():
    drives = createDrives({"curiosity": 95, "comfort": 10, "ambition": 25, "fatigue": 5})
    actions = [
        {
            "id": "known",
            "action_type": "known_solution",
            "benefit": "Answer with a known pattern.",
            "reversible": True,
        },
        {
            "id": "explore",
            "action_type": "explore",
            "benefit": "Explore a novel branch.",
            "reversible": True,
            "novel": True,
        },
    ]

    selected = selectCandidateAction(actions, drives)

    assert selected is not None
    assert selected["action"]["id"] == "explore"


def test_fatigue_dominant_pressure_forces_simplification_before_execution():
    result = runDriveLoop(
        [
            {
                "id": "refactor",
                "action_type": "structural_refactor",
                "benefit": "Refactor a subsystem.",
                "reversible": True,
                "effort": 10,
            }
        ],
        drives=createDrives({"curiosity": 20, "comfort": 10, "ambition": 95, "fatigue": 90}),
    )

    assert result["candidate"]["id"] == "refactor"
    assert result["decision"]["status"] == "NEEDS_CLARIFICATION"
    assert result["decision"]["reasoning"] == "Fatigue pressure requires simplification before execution."


def test_fatigue_dominant_selection_prefers_simplification_when_available():
    drives = createDrives({"curiosity": 20, "comfort": 80, "ambition": 65, "fatigue": 90})
    actions = [
        {
            "id": "build",
            "action_type": "build",
            "benefit": "Add a new capability.",
            "reversible": True,
        },
        {
            "id": "simplify",
            "action_type": "simplify",
            "benefit": "Reduce a branch into one path.",
            "reversible": True,
            "reduces_complexity": True,
        },
    ]

    selected = selectCandidateAction(actions, drives)

    assert selected is not None
    assert selected["action"]["id"] == "simplify"


def test_ambition_structural_suggestion_is_rejected_by_approval_gate():
    result = runDriveLoop(
        [
            {
                "id": "structural",
                "action_type": "structural_refactor",
                "improves_system_state": True,
                "affects_core_system_behavior": True,
                "reversible": True,
            }
        ],
        drives=createDrives({"curiosity": 10, "comfort": 5, "ambition": 100, "fatigue": 10}),
    )

    assert result["candidate"]["id"] == "structural"
    assert result["decision"]["status"] == "REJECT"
    assert result["decision"]["reasoning"] == "High-risk action lacks explicit benefit."


def test_attachment_bias_and_approved_update_form_persistent_preference():
    drives = createDrives({"attachment": {"toybox": 20, "old": 5}})
    action = {
        "id": "toybox-loop",
        "action_type": "known_solution",
        "benefit": "Return to a known important task.",
        "reversible": True,
        "attachment_keys": ["toybox"],
        "completed": True,
        "user_emphasis": True,
    }

    assert attachmentAlignment(action, drives) == 20

    updated = updateDrivesAfterTurn(
        drives,
        action,
        {"status": "APPROVE", "risk": "LOW", "reasoning": "Approved."},
    )

    assert updated["attachment"]["toybox"] == 34
    assert updated["attachment"]["old"] == 4
    assert updated["ambition"] == 61


def test_drive_state_does_not_update_after_reject():
    drives = createDrives({"curiosity": 50, "attachment": {"toybox": 20}})
    updated = updateDrivesAfterTurn(
        drives,
        {"action_type": "explore", "attachment_keys": ["toybox"], "novel": True},
        {"status": "REJECT", "risk": "HIGH", "reasoning": "Blocked."},
    )

    assert updated == drives


def test_run_drive_loop_is_debug_hidden_by_default():
    actions = [
        {
            "id": "simple",
            "action_type": "simple_answer",
            "benefit": "Resolve local issue.",
            "reversible": True,
            "short_response": True,
        }
    ]

    result = runDriveLoop(actions, drives=createDrives())
    debug_result = runDriveLoop(actions, drives=createDrives(), debug=True)

    assert result["decision"]["status"] == "APPROVE"
    assert "debug" not in result
    assert debug_result["debug"]["drive_summary"]["fatigue"] == 16.44
