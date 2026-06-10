from bubble_boy.config import BUBBLE_ROOT


def bubble_exists() -> bool:
    return BUBBLE_ROOT.exists() and BUBBLE_ROOT.is_dir()


def required_files_exist() -> bool:
    required = [
        BUBBLE_ROOT / "home.md",
        BUBBLE_ROOT / "status.md",
        BUBBLE_ROOT / "memory.json",
    ]
    return all(path.exists() for path in required)