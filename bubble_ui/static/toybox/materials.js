export const skyByTime = {
  dawn: [0.032, 0.072, 0.122, 1],
  day: [0.040, 0.092, 0.150, 1],
  twilight: [0.012, 0.040, 0.090, 1],
  night: [0.008, 0.020, 0.052, 1]
};

export const materialIds = {
  default: 0,
  water: 1,
  foam: 2,
  spray: 3,
  flame: 4,
  stars: 5,
  haze: 6,
  wetShore: 7,
  moon: 8,
  moonReflection: 9,
  sun: 16,
  cloud: 17,
  celestialArc: 18
};

export function installPostOverlay(canvas) {
  const host = canvas.parentElement || document.body;
  let overlay = document.querySelector(".toybox-post-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "toybox-post-overlay";
    overlay.setAttribute("aria-hidden", "true");
    host.appendChild(overlay);
  }
  return overlay;
}
