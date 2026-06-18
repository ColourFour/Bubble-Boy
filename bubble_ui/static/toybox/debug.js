export function createDebugController({ toggle, panel }) {
  let visible = false;

  toggle.addEventListener("click", () => {
    visible = !visible;
    toggle.setAttribute("aria-pressed", String(visible));
    panel.classList.toggle("is-visible", visible);
  });

  function update(lines) {
    if (!visible) return;
    panel.textContent = lines.join("\n");
  }

  return {
    get visible() {
      return visible;
    },
    update
  };
}
