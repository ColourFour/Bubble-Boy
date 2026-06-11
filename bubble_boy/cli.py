import argparse
from pathlib import Path

from bubble_boy.checks import bubble_health
from bubble_boy.config import BUBBLE_ROOT
from bubble_boy.mind import wake_brain
from bubble_boy.proposals import BubbleProposalError, approve_proposal, create_proposal
from bubble_boy.storage import append_log, list_tree, read_text


def status() -> None:
    print("Bubble Boy Status")
    for key, value in bubble_health().items():
        print(f"{key}: {value}")


def tree() -> None:
    for path in list_tree("."):
        print(path)


def read(path: str) -> None:
    print(read_text(path))


def wake() -> None:
    result = wake_brain()
    speech = str(result.get("speech", "")).strip()
    proposal = result.get("proposal")

    print(f"Bubble Boy: {speech}")

    if isinstance(proposal, dict):
        path, record = create_proposal(proposal)
        append_log(f"created proposal {record['id']}: {record['title']}")
        relative_path = Path(path).relative_to(BUBBLE_ROOT)
        print(f"Proposal saved: bubble/{relative_path}")
        print(f"Proposal title: {record['title']}")


def main() -> None:
    parser = argparse.ArgumentParser(prog="bubble-boy")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("status")
    subparsers.add_parser("tree")
    subparsers.add_parser("wake")

    approve_parser = subparsers.add_parser("approve")
    approve_parser.add_argument("proposal_ref")

    read_parser = subparsers.add_parser("read")
    read_parser.add_argument("path")

    args = parser.parse_args()

    if args.command == "status":
        status()
    elif args.command == "tree":
        tree()
    elif args.command == "wake":
        wake()
    elif args.command == "approve":
        try:
            record = approve_proposal(args.proposal_ref)
        except BubbleProposalError as exc:
            raise SystemExit(f"Approval blocked: {exc}") from exc
        print(f"Applied proposal: {record['id']}")
        for changed_file in record.get("changed_files", []):
            print(f"Changed: bubble/{changed_file}")
    elif args.command == "read":
        read(args.path)


if __name__ == "__main__":
    main()