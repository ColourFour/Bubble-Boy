import pytest

from bubble_boy.policy import BubblePolicyError, resolve_bubble_path


def test_allows_path_inside_bubble():
    path = resolve_bubble_path("home.md")
    assert path.name == "home.md"


def test_blocks_parent_escape():
    with pytest.raises(BubblePolicyError):
        resolve_bubble_path("../README.md")


def test_blocks_nested_parent_escape():
    with pytest.raises(BubblePolicyError):
        resolve_bubble_path("world/../../README.md")


def test_blocks_absolute_escape():
    with pytest.raises(BubblePolicyError):
        resolve_bubble_path("/tmp/outside-bubble.txt")