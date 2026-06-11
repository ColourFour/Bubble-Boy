from pathlib import Path

from bubble_boy.config import BUBBLE_ROOT


class BubblePolicyError(ValueError):
    pass


def resolve_bubble_path(path: str | Path) -> Path:
    candidate = (BUBBLE_ROOT / path).resolve()
    bubble_root = BUBBLE_ROOT.resolve()

    if candidate != bubble_root and bubble_root not in candidate.parents:
        raise BubblePolicyError(f"Blocked path outside bubble: {candidate}")

    return candidate


def assert_safe_relative_path(path: str | Path) -> None:
    resolve_bubble_path(path)