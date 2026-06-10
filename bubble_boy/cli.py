import argparse

from bubble_boy.checks import bubble_exists, required_files_exist
from bubble_boy.mind import mock_wake
from bubble_boy.storage import list_tree


def status() -> None:
    print("Bubble Boy Status")
    print(f"bubble_exists: {bubble_exists()}")
    print(f"required_files_exist: {required_files_exist()}")


def tree() -> None:
    for path in list_tree("."):
        print(path)


def wake() -> None:
    print(mock_wake())


def main() -> None:
    parser = argparse.ArgumentParser(prog="bubble-boy")
    parser.add_argument("command", choices=["status", "tree", "wake"])
    args = parser.parse_args()

    if args.command == "status":
        status()
    elif args.command == "tree":
        tree()
    elif args.command == "wake":
        wake()


if __name__ == "__main__":
    main()