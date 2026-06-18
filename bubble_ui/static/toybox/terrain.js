export const terrainConfig = {
  worldRadiusScale: 14.0,
  playableRadius: 35.0,
  farWaterRadius: 240.0,
  islandOffsetY: -0.18
};

export function clampToPlayableRadius(target, playableRadius) {
  const x = target[0];
  const z = target[2];
  const distance = Math.hypot(x, z);
  if (distance <= playableRadius) return target;
  const scale = playableRadius / Math.max(0.001, distance);
  return [x * scale, target[1], z * scale];
}
