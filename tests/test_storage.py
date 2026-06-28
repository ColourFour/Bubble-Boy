from bubble_boy.storage import list_tree, read_text
from bubble_ui import server as ui_server


def test_reads_home_file():
    content = read_text("home.md")
    assert "Bubble Boy" in content


def test_lists_tree():
    files = list_tree(".")
    assert "home.md" in files
    assert "memory.json" in files


def test_saves_toybox_milestones_without_clobbering_base_state(tmp_path, monkeypatch):
    state_path = tmp_path / "toybox_state.json"
    state_path.write_text(
        '{"version": 1, "mood": "curious", "weather": "clear", "speech": "hello"}',
        encoding="utf-8",
    )
    monkeypatch.setattr(ui_server, "TOYBOX_STATE_PATH", state_path)

    saved = ui_server.save_toybox_milestones(
        {
            "lifeLoop": {
                "lifeDay": 6,
                "currentObjective": "buildStorageBasket",
                "completedObjectives": ["day6.wake", "day6.inspectCamp"],
                "campMarked": True,
            },
            "inventory": {"wood": 2.5, "fish": {"state": "raw", "id": "ocean-fish-1"}},
            "builder": {"project": "bed", "progress": 0.4, "active": True},
            "buildables": {
                "shelter": {"progress": 1, "status": "complete", "completedAt": 42.0},
                "bed": {"progress": 0.4, "status": "building", "storedWood": 1.4},
            },
            "campOrganization": {
                "storageBuilt": True,
                "storedSupplies": 3,
                "zonesMarked": {"rest": True, "work": False, "cook": True},
            },
        }
    )

    assert saved["lifeLoop"]["lifeDay"] == 6
    assert saved["inventory"]["wood"] == 2.5
    state = ui_server._load_json_file(state_path, {})
    assert state["mood"] == "curious"
    assert state["speech"] == "hello"
    assert state["milestones"]["lifeLoop"]["currentObjective"] == "buildStorageBasket"
    assert state["lifeLoop"]["completedObjectives"] == ["day6.wake", "day6.inspectCamp"]
    assert state["bubbleBoy"]["inventory"]["fish"]["state"] == "raw"
    assert state["buildables"]["shelter"]["status"] == "complete"
    assert state["campOrganization"]["zonesMarked"]["cook"] is True


def test_toybox_milestone_save_sanitizes_untrusted_values(tmp_path, monkeypatch):
    state_path = tmp_path / "toybox_state.json"
    monkeypatch.setattr(ui_server, "TOYBOX_STATE_PATH", state_path)

    saved = ui_server.save_toybox_milestones(
        {
            "lifeLoop": {"lifeDay": -10, "completedObjectives": ["day1.arrive", "", 7]},
            "inventory": {"wood": 9999, "fish": {"state": "bad"}},
            "builder": {"project": "unknown", "progress": 9},
            "buildables": {"unknown": {"progress": 1}, "toy-blocks": {"progress": -4}},
        }
    )

    assert saved["lifeLoop"]["lifeDay"] == 1
    assert saved["lifeLoop"]["completedObjectives"] == ["day1.arrive"]
    assert saved["inventory"]["wood"] == 100
    assert saved["inventory"]["fish"]["state"] == "none"
    assert saved["builder"]["project"] == "shelter"
    assert saved["builder"]["progress"] == 1
    assert "unknown" not in saved["buildables"]
    assert saved["buildables"]["toy-blocks"]["progress"] == 0
