# Bubble Boy
Bubble Boy is a tiny sandboxed AI creature.

He lives in a local folder.
He can inspect his world, make proposals, keep receipts, and mutate only through approved allowlisted handlers.
The web UI renders his state as a little room.

## Core rule

No mutation outside `bubble/`.

## Initial commands

```bash
python -m bubble_boy.cli status
python -m bubble_boy.cli wake
python -m pytest