from datetime import datetime, timezone
from pathlib import Path

from bubble_boy.policy import resolve_bubble_path


def read_text(path: str | Path) -> str:
    return resolve_bubble_path(path).read_text(encoding="utf-8")


def write_text(path: str | Path, content: str) -> Path:
    target = resolve_bubble_path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
    return target


def append_log(message: str) -> Path:
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    target = resolve_bubble_path(f"logs/{date}.log")
    target.parent.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).isoformat()
    with target.open("a", encoding="utf-8") as handle:
        handle.write(f"{timestamp} {message}\n")

    return target


def list_tree(path: str | Path = ".") -> list[str]:
    root = resolve_bubble_path(path)
    if not root.exists():
        return []

    output: list[str] = []
    for item in sorted(root.rglob("*")):
        if item.is_file():
            output.append(str(item.relative_to(root)))
    return output