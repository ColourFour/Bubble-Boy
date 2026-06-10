# Bubble Boy

Bubble Boy is a sandboxed local AI creature that lives inside `bubble/`.

He can inspect his bubble, create proposals, write small artifacts, and keep receipts. He must not touch files outside the bubble root.

## Core rule

No mutation outside `bubble/`.

## Initial commands

```bash
python -m bubble_boy.cli status
python -m bubble_boy.cli wake
python -m pytest