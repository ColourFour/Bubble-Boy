

from bubble_boy.checks import bubble_health
from bubble_boy.storage import list_tree, read_text


def inspect_bubble() -> dict[str, object]:
    readable_files: dict[str, str] = {}

    for path in ["home.md", "status.md", "memory.json"]:
        try:
            readable_files[path] = read_text(path)
        except FileNotFoundError:
            readable_files[path] = ""

    return {
        "health": bubble_health(),
        "files": list_tree("."),
        "readable_files": readable_files,
        "available_tools": [
            "inspect_bubble",
            "create_proposal",
            "read_text",
            "list_tree",
            "append_log",
        ],
        "forbidden_tools": [
            "unfenced_shell",
            "delete_files",
            "write_outside_bubble",
            "read_secrets",
            "network_except_model_api",
        ],
    }