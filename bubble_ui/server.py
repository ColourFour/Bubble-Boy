

import json
import mimetypes
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


def _load_json_file(path: Path, fallback: object) -> object:
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return fallback


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

        self._send_json({"error": "Not found."}, HTTPStatus.NOT_FOUND)


def run(host: str = "127.0.0.1", port: int = 8765) -> None:
    server = ThreadingHTTPServer((host, port), BubbleUIHandler)
    print(f"Bubble UI running at http://{host}:{port}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    run()
