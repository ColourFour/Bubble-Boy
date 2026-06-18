from bubble_boy.personality import (
    BUBBLE_BOY_SYSTEM_PROMPT,
    create_initial_state,
    evaluateAction,
    updateStateFromDecision,
)


def test_prompt_contains_core_personality_contract():
    assert "High-agency systems thinker" in BUBBLE_BOY_SYSTEM_PROMPT
    assert "No motivational language" in BUBBLE_BOY_SYSTEM_PROMPT
    assert "Never generate decorative or social filler" in BUBBLE_BOY_SYSTEM_PROMPT


def test_evaluate_action_approve_case():
    decision = evaluateAction(
        {
            "benefit": "Reduces duplicated approval checks.",
            "reduces_complexity": True,
            "reversible": True,
        },
        {},
    )

    assert decision == {
        "status": "APPROVE",
        "risk": "LOW",
        "reasoning": "Action improves state or reduces complexity with rollback.",
    }


def test_evaluate_action_reject_case():
    decision = evaluateAction(
        {
            "increases_complexity": True,
            "reversible": True,
        },
        {},
    )

    assert decision["status"] == "REJECT"
    assert decision["risk"] == "LOW"
    assert "complexity" in decision["reasoning"]


def test_evaluate_action_needs_clarification_case():
    decision = evaluateAction(
        {
            "benefit": "Could improve proposal routing.",
            "reversible": True,
            "impact_unclear": True,
        },
        {},
    )

    assert decision["status"] == "NEEDS_CLARIFICATION"
    assert decision["risk"] == "LOW"


def test_high_risk_without_explicit_benefit_is_rejected():
    decision = evaluateAction(
        {
            "improves_system_state": True,
            "affects_core_system_behavior": True,
            "rollback_path": "Restore the previous module.",
        },
        {},
    )

    assert decision["status"] == "REJECT"
    assert decision["risk"] == "HIGH"


def test_update_state_only_after_approve_and_tracks_structural_change():
    state = create_initial_state()
    rejected_state = updateStateFromDecision(
        state,
        {
            "status": "REJECT",
            "risk": "LOW",
            "reasoning": "Duplicate capability.",
            "structural_change": True,
        },
    )

    assert rejected_state == state

    approved_state = updateStateFromDecision(
        state,
        {
            "status": "APPROVE",
            "risk": "MED",
            "reasoning": "Approved new structural rule.",
            "structural_change": True,
            "drift_flags": ["verbosity"],
            "forced_approval": True,
        },
    )

    assert approved_state["personality_version"] == state["personality_version"] + 1
    assert approved_state["last_decision_summary"] == "Approved new structural rule."
    assert approved_state["drift_flags"] == ["verbosity"]
    assert approved_state["override_history"] == [
        {"reasoning": "Approved new structural rule.", "risk": "MED"}
    ]
