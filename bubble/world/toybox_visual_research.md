# Toybox Visual Research Pass

Research date: 2026-06-18

## Asset Sources To Prefer

- Kenney Nature Kit: CC0, 330 3D files, useful for trees, rocks, and foliage. Source: https://kenney.nl/assets/nature-kit
- Quaternius Free Game Assets: CC0 low-poly model library with nature packs covering trees, rocks, grass, logs, and flowers. Source: https://quaternius.com/
- Poly Pizza Quaternius Ultimate Stylized Nature Pack: CC0/public-domain pack with FBX and GLB downloads, useful when the renderer needs ready-to-load `.glb` assets. Source: https://poly.pizza/bundle/Ultimate-Stylized-Nature-Pack-zyIyYd9yGr
- KayKit Forest Nature Pack: stylized forest assets with trees, bushes, rocks, grass, and terrain pieces. Source: https://kaylousberg.itch.io/kaykit-forest

## Techniques To Borrow

- Keep low-poly silhouettes chunky and readable: conical canopy tiers, faceted rocks, separate grass clusters, and camp props with simple rectangular or cylindrical profiles.
- Prefer material-color variation over textures in this renderer. It matches the existing custom shader and keeps GLB imports simple.
- Treat repeated foliage as instanced batches, not individual scene objects. The implementation now uses `ANGLE_instanced_arrays` for scatter meshes.
- Cull and LOD at the instance-group level first. Fine per-instance frustum culling can come later, but group distance thresholds already avoid submitting far-off dense scatter.
- Use GLB as the preferred interchange format for runtime assets. Blender exports and free-pack GLB downloads can be listed in `toybox_state.json` under `assets`.

## Imported Subset

The current checked-in free-pack subset comes from Kenney Nature Kit OBJ files converted to GLB for this renderer:

- `tree_simple.glb`
- `grass.glb`
- `rock_small_a.glb`
- `plant_bush.glb`
- `log.glb`
- `campfire_logs.glb`

The source license is preserved at `bubble_ui/static/assets/toybox/kenney_nature_kit/License.txt`.

## Culling And LOD Notes

Three.js `InstancedMesh` discussions repeatedly note that instancing reduces draw-call overhead but does not automatically solve culling for each object. The toybox approach follows that lesson: repeated mesh groups have `maxDistance` and `lodDistance` thresholds so large-island scatter can be skipped or reduced before draw submission.

References:

- https://github.com/agargaro/instanced-mesh
- https://discourse.threejs.org/t/lod-instancing/20524
- https://discourse.threejs.org/t/instancedmesh2-easy-handling-and-frustum-culling/58622
