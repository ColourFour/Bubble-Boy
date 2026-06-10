from pathlib import Path

from bubble_boy.policy import resolve_bubble_path


def read_text(path: str | Path) -> str:
    return resolve_bubble_path(path).read_text(encoding="utf-8")


def write_text(path: str | Path, content: str) -> Path:
    target = resolve_bubble_path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
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