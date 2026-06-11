
from pathlib import Path
import os


PROJECT_ROOT = Path(__file__).resolve().parents[1]
BUBBLE_ROOT = PROJECT_ROOT / "bubble"
ENV_PATH = PROJECT_ROOT / ".env"


def load_local_env() -> None:
    if not ENV_PATH.exists():
        return

    for raw_line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


def get_setting(name: str, default: str | None = None) -> str | None:
    load_local_env()
    return os.environ.get(name, default)
