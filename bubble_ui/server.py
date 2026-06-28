

import json
import math
import mimetypes
import os
import tempfile
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from bubble_boy.checks import bubble_health
from bubble_boy.config import BUBBLE_ROOT, PROJECT_ROOT
from bubble_boy.mind import chat_brain, post_approval_brain, wake_brain
from bubble_boy.proposals import BubbleProposalError, approve_proposal, create_proposal
from bubble_boy.storage import append_log, list_tree, read_text


UI_ROOT = PROJECT_ROOT / "bubble_ui"
STATIC_ROOT = UI_ROOT / "static"
TEMPLATE_ROOT = UI_ROOT / "templates"
INDEX_PATH = TEMPLATE_ROOT / "index.html"
TOYBOX_PATH = BUBBLE_ROOT / "world" / "toybox.html"
TOYBOX_STATE_PATH = BUBBLE_ROOT / "world" / "toybox_state.json"
TOYBOX_MILESTONE_SCHEMA_VERSION = 1
TOYBOX_BUILDABLE_IDS = frozenset({"shelter", "bed", "toy-blocks", "workbench"})


def _load_json_file(path: Path, fallback: object) -> object:
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return fallback


def _finite_number(value: object, fallback: float = 0) -> float:
    if isinstance(value, int | float) and not isinstance(value, bool) and math.isfinite(value):
        return value
    return fallback


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def _string_list(value: object, *, limit: int = 128) -> list[str]:
    if not isinstance(value, list):
        return []
    output: list[str] = []
    for entry in value:
        if isinstance(entry, str) and entry and entry not in output:
            output.append(entry[:160])
        if len(output) >= limit:
            break
    return output


def _string_dict(value: object, *, limit: int = 64) -> dict[str, str]:
    if not isinstance(value, dict):
        return {}
    output: dict[str, str] = {}
    for key, entry in value.items():
        if isinstance(key, str) and isinstance(entry, str) and key and entry:
            output[key[:160]] = entry[:240]
        if len(output) >= limit:
            break
    return output


def _sanitize_fish_inventory(value: object) -> dict[str, object]:
    source = value if isinstance(value, dict) else {}
    state = source.get("state")
    return {
        "state": state if state in {"none", "raw", "cooked", "dried"} else "none",
        "id": source.get("id")[:120] if isinstance(source.get("id"), str) else None,
    }


def _sanitize_inventory(value: object) -> dict[str, object]:
    source = value if isinstance(value, dict) else {}
    return {
        "wood": _clamp(_finite_number(source.get("wood"), 0), 0, 100),
        "fish": _sanitize_fish_inventory(source.get("fish")),
    }


def _sanitize_builder(value: object) -> dict[str, object]:
    source = value if isinstance(value, dict) else {}
    project = source.get("project")
    action_state = source.get("actionState")
    completed_id = source.get("lastCompletedBuildableId")
    return {
        "project": project if project in TOYBOX_BUILDABLE_IDS else "shelter",
        "actionState": action_state[:80] if isinstance(action_state, str) else "inspect",
        "progress": _clamp(_finite_number(source.get("progress"), 0), 0, 1),
        "requiredWood": max(0, _finite_number(source.get("requiredWood"), 0)),
        "active": bool(source.get("active")),
        "restedAfterBed": bool(source.get("restedAfterBed")),
        "lastBedUseAt": _finite_number(source.get("lastBedUseAt"), -999),
        "lastToyPlayAt": _finite_number(source.get("lastToyPlayAt"), -999),
        "lastCompletionAt": _finite_number(source.get("lastCompletionAt"), -999),
        "lastCompletedBuildableId": completed_id if completed_id in TOYBOX_BUILDABLE_IDS else None,
    }


def _sanitize_buildables(value: object) -> dict[str, dict[str, object]]:
    if not isinstance(value, dict):
        return {}
    buildables: dict[str, dict[str, object]] = {}
    for buildable_id in TOYBOX_BUILDABLE_IDS:
        source = value.get(buildable_id)
        if not isinstance(source, dict):
            continue
        status = source.get("status")
        completed_at = source.get("completedAt")
        buildables[buildable_id] = {
            "buildableId": buildable_id,
            "status": status if status in {"planned", "building", "complete"} else "planned",
            "progress": _clamp(_finite_number(source.get("progress"), 0), 0, 1),
            "storedWood": max(0, _finite_number(source.get("storedWood"), 0)),
            "completedAt": _finite_number(completed_at) if completed_at is not None else None,
        }
    return buildables


def _sanitize_life_loop(value: object) -> dict[str, object]:
    source = value if isinstance(value, dict) else {}
    current_objective = source.get("currentObjective")
    current_blocker = source.get("currentBlocker")
    day_ended_at = source.get("dayEndedAt")
    sleep_started_at = source.get("sleepStartedAt")
    return {
        "lifeDay": int(_clamp(_finite_number(source.get("lifeDay"), 1), 1, 100)),
        "currentObjective": current_objective[:120]
        if isinstance(current_objective, str) else "arrive",
        "completedObjectives": _string_list(source.get("completedObjectives")),
        "dayStartedAt": _finite_number(source.get("dayStartedAt"), 0),
        "dayEndedAt": _finite_number(day_ended_at) if day_ended_at is not None else None,
        "sleepRequested": bool(source.get("sleepRequested")),
        "sleeping": bool(source.get("sleeping")),
        "sleepStartedAt": _finite_number(sleep_started_at)
        if sleep_started_at is not None else None,
        "wakePending": bool(source.get("wakePending")),
        "lastWakeDay": int(max(0, _finite_number(source.get("lastWakeDay"), 0))),
        "objectiveBlockers": _string_dict(source.get("objectiveBlockers")),
        "currentBlocker": current_blocker[:240] if isinstance(current_blocker, str) else "",
        "firstRestSpotBuilt": bool(source.get("firstRestSpotBuilt")),
        "campMarked": bool(source.get("campMarked")),
        "campAreaCleared": bool(source.get("campAreaCleared")),
        "shelterStarted": bool(source.get("shelterStarted")),
        "shelterContinued": bool(source.get("shelterContinued")),
        "shelterFinished": bool(source.get("shelterFinished")),
        "routineEstablished": bool(source.get("routineEstablished")),
        "trackComplete": bool(source.get("trackComplete")),
        "readyForNextTrack": bool(source.get("readyForNextTrack")),
    }


def _sanitize_camp_organization(value: object) -> dict[str, object]:
    source = value if isinstance(value, dict) else {}
    zones = source.get("zonesMarked") if isinstance(source.get("zonesMarked"), dict) else {}
    return {
        "storageBuilt": bool(source.get("storageBuilt")),
        "storedSupplies": max(0, _finite_number(source.get("storedSupplies"), 0)),
        "storedWood": max(0, _finite_number(source.get("storedWood"), 0)),
        "firewoodStacked": bool(source.get("firewoodStacked")),
        "fireRoutineChecked": bool(source.get("fireRoutineChecked")),
        "looseDebrisCleared": bool(source.get("looseDebrisCleared")),
        "toolsOrganized": bool(source.get("toolsOrganized")),
        "campSwept": bool(source.get("campSwept")),
        "zonesMarked": {
            "rest": bool(zones.get("rest")),
            "work": bool(zones.get("work")),
            "cook": bool(zones.get("cook")),
        },
        "routineEstablished": bool(source.get("routineEstablished")),
    }


def _sanitize_toybox_milestones(value: object) -> dict[str, object]:
    source = value if isinstance(value, dict) else {}
    return {
        "schemaVersion": TOYBOX_MILESTONE_SCHEMA_VERSION,
        "lifeLoop": _sanitize_life_loop(source.get("lifeLoop")),
        "inventory": _sanitize_inventory(source.get("inventory")),
        "builder": _sanitize_builder(source.get("builder")),
        "buildables": _sanitize_buildables(source.get("buildables")),
        "campOrganization": _sanitize_camp_organization(source.get("campOrganization")),
    }


def save_toybox_milestones(payload: object) -> dict[str, object]:
    milestones = _sanitize_toybox_milestones(payload)
    state = _load_json_file(TOYBOX_STATE_PATH, {})
    if not isinstance(state, dict):
        state = {}
    state["version"] = 1
    state["milestones"] = milestones
    state["lifeLoop"] = milestones["lifeLoop"]
    state["campOrganization"] = milestones["campOrganization"]
    state["buildables"] = milestones["buildables"]
    state["bubbleBoy"] = {
        **(state.get("bubbleBoy") if isinstance(state.get("bubbleBoy"), dict) else {}),
        "inventory": milestones["inventory"],
        "builder": milestones["builder"],
    }

    TOYBOX_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w",
        delete=False,
        dir=TOYBOX_STATE_PATH.parent,
        encoding="utf-8",
    ) as handle:
        json.dump(state, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
        temporary_path = Path(handle.name)
    os.replace(temporary_path, TOYBOX_STATE_PATH)
    return milestones


def _proposal_records() -> list[dict[str, object]]:
    proposals_root = BUBBLE_ROOT / "proposals"
    if not proposals_root.exists():
        return []

    records: list[dict[str, object]] = []
    for path in sorted(proposals_root.glob("*.json")):
        try:
            record = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if isinstance(record, dict):
            records.append(record)
    return records


def _world_payload() -> dict[str, object]:
    return {
        "health": bubble_health(),
        "avatar": _load_json_file(BUBBLE_ROOT / "world" / "avatar_state.json", {}),
        "room": _load_json_file(BUBBLE_ROOT / "world" / "room_state.json", {}),
        "status_md": read_text("status.md"),
        "tree": list_tree("."),
        "proposals": _proposal_records(),
    }


class BubbleUIHandler(SimpleHTTPRequestHandler):
    server_version = "BubbleBoyUI/0.1"

    def log_message(self, format: str, *args: object) -> None:
        print(f"[bubble-ui] {self.address_string()} - {format % args}")

    def _send_json(self, payload: object, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, indent=2, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_text(
        self,
        text: str,
        status: HTTPStatus = HTTPStatus.OK,
        content_type: str = "text/plain",
        headers: dict[str, str] | None = None,
    ) -> None:
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        if headers:
            for key, value in headers.items():
                self.send_header(key, value)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_bytes(
        self,
        body: bytes,
        status: HTTPStatus = HTTPStatus.OK,
        content_type: str = "application/octet-stream",
        headers: dict[str, str] | None = None,
    ) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        if headers:
            for key, value in headers.items():
                self.send_header(key, value)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_toybox(self) -> None:
        if not TOYBOX_PATH.exists():
            self._send_text("toybox.html has not been created yet.", HTTPStatus.NOT_FOUND)
            return

        state = _load_json_file(TOYBOX_STATE_PATH, {})
        state_json = json.dumps(state, ensure_ascii=False).replace("</", "<\\/")
        html = TOYBOX_PATH.read_text(encoding="utf-8").replace(
            "__TOYBOX_STATE_JSON__",
            state_json,
        )
        self._send_text(
            html,
            content_type="text/html",
            headers={
                "Content-Security-Policy": (
                    "default-src 'none'; "
                    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' http://127.0.0.1:8765 http://localhost:8765; "
                    "style-src 'unsafe-inline'; "
                    "img-src data:; "
                    "connect-src 'self' http://127.0.0.1:8765 http://localhost:8765; "
                    "base-uri 'none'; "
                    "form-action 'none'; "
                    "frame-ancestors 'self'"
                )
            },
        )

    def _read_json_body(self) -> dict[str, object]:
        content_length = int(self.headers.get("Content-Length", "0") or "0")
        if content_length <= 0:
            return {}
        raw_body = self.rfile.read(content_length).decode("utf-8")
        try:
            parsed = json.loads(raw_body)
        except json.JSONDecodeError:
            return {}
        return parsed if isinstance(parsed, dict) else {}

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/":
            if not INDEX_PATH.exists():
                self._send_text("index.html has not been created yet.", HTTPStatus.NOT_FOUND)
                return
            self._send_text(INDEX_PATH.read_text(encoding="utf-8"), content_type="text/html")
            return

        if path == "/toybox":
            self._send_toybox()
            return

        if path == "/api/status":
            self._send_json({"health": bubble_health(), "status_md": read_text("status.md")})
            return

        if path == "/api/world":
            self._send_json(_world_payload())
            return

        if path == "/api/tree":
            self._send_json({"tree": list_tree(".")})
            return

        if path == "/api/proposals":
            self._send_json({"proposals": _proposal_records()})
            return

        if path.startswith("/static/"):
            relative_path = path.removeprefix("/static/")
            target = (STATIC_ROOT / relative_path).resolve()
            static_root = STATIC_ROOT.resolve()
            if target != static_root and static_root not in target.parents:
                self._send_text("Blocked static path.", HTTPStatus.FORBIDDEN)
                return
            if not target.exists() or not target.is_file():
                self._send_text("Static file not found.", HTTPStatus.NOT_FOUND)
                return
            suffix = target.suffix.lower()
            content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
            if suffix in {".js", ".mjs"}:
                content_type = "application/javascript"
            elif suffix == ".glb":
                content_type = "model/gltf-binary"
            elif suffix == ".wasm":
                content_type = "application/wasm"
            elif suffix == ".css":
                content_type = "text/css"
            elif suffix == ".html":
                content_type = "text/html; charset=utf-8"
            elif suffix in {".json", ".map"}:
                content_type = "application/json; charset=utf-8"
            self._send_bytes(
                target.read_bytes(),
                content_type=content_type,
                headers={"Access-Control-Allow-Origin": "*"},
            )
            return

        self._send_text("Not found.", HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/wake":
            result = wake_brain()
            proposal = result.get("proposal")
            saved: dict[str, object] | None = None
            if isinstance(proposal, dict):
                _, saved = create_proposal(proposal)
                append_log(f"ui created proposal {saved['id']}: {saved['title']}")
            self._send_json({"speech": result.get("speech", ""), "proposal": saved, "world": _world_payload()})
            return

        if path == "/api/chat":
            body = self._read_json_body()
            user_message = str(body.get("message", "")).strip()
            if not user_message:
                self._send_json({"error": "Missing message."}, HTTPStatus.BAD_REQUEST)
                return

            result = chat_brain(user_message)
            if not isinstance(result, dict):
                self._send_json({"error": "Chat brain returned an invalid response."}, HTTPStatus.INTERNAL_SERVER_ERROR)
                return

            proposal = result.get("proposal")
            saved: dict[str, object] | None = None
            if isinstance(proposal, dict):
                _, saved = create_proposal(proposal)
                append_log(f"ui chat created proposal {saved['id']}: {saved['title']}")

            self._send_json({"speech": result.get("speech", ""), "proposal": saved, "world": _world_payload()})
            return

        if path == "/api/approve":
            body = self._read_json_body()
            proposal_ref = str(body.get("proposal_ref", "")).strip()
            if not proposal_ref:
                self._send_json({"error": "Missing proposal_ref."}, HTTPStatus.BAD_REQUEST)
                return

            try:
                record = approve_proposal(proposal_ref)
            except BubbleProposalError as exc:
                self._send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return

            reflection = post_approval_brain(record)
            if not isinstance(reflection, dict):
                reflection = {
                    "speech": "The proposal was applied, but reflection came back malformed. Still counts. Receipts exist.",
                    "next_intent": "Inspect the changed files.",
                }

            append_log(
                f"ui reflected on approved proposal {record.get('id')}: "
                f"{reflection.get('next_intent', 'no next intent')}"
            )
            self._send_json({"proposal": record, "reflection": reflection, "world": _world_payload()})
            return

        if path == "/api/toybox/milestones":
            body = self._read_json_body()
            milestones = save_toybox_milestones(body)
            self._send_json({"ok": True, "milestones": milestones})
            return

        self._send_json({"error": "Not found."}, HTTPStatus.NOT_FOUND)


def run(host: str = "127.0.0.1", port: int = 8765) -> None:
    server = ThreadingHTTPServer((host, port), BubbleUIHandler)
    print(f"Bubble UI running at http://{host}:{port}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    run()
