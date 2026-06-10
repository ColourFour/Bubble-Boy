from bubble_boy.storage import list_tree, read_text


def test_reads_home_file():
    content = read_text("home.md")
    assert "Bubble Boy" in content


def test_lists_tree():
    files = list_tree(".")
    assert "home.md" in files
    assert "memory.json" in files