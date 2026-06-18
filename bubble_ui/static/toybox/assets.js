const COMPONENT_SIZE = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
};

const TYPE_SIZE = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT4: 16
};

export async function loadGlb(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GLB load failed: ${response.status} ${url}`);
  const buffer = await response.arrayBuffer();
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== 0x46546c67) throw new Error(`Invalid GLB: ${url}`);
  const jsonLength = view.getUint32(12, true);
  const jsonType = view.getUint32(16, true);
  if (jsonType !== 0x4e4f534a) throw new Error(`GLB missing JSON chunk: ${url}`);
  const jsonText = new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength));
  const json = JSON.parse(jsonText);
  const binHeader = 20 + jsonLength;
  const binLength = view.getUint32(binHeader, true);
  const binType = view.getUint32(binHeader + 4, true);
  if (binType !== 0x004e4942) throw new Error(`GLB missing BIN chunk: ${url}`);
  return { json, bin: buffer.slice(binHeader + 8, binHeader + 8 + binLength) };
}

function readAccessor(asset, index) {
  const accessor = asset.json.accessors[index];
  const view = asset.json.bufferViews[accessor.bufferView];
  const componentCount = TYPE_SIZE[accessor.type];
  const componentSize = COMPONENT_SIZE[accessor.componentType];
  const byteOffset = (view.byteOffset || 0) + (accessor.byteOffset || 0);
  const stride = view.byteStride || componentCount * componentSize;
  const dataView = new DataView(asset.bin, byteOffset);
  const values = [];
  for (let i = 0; i < accessor.count; i += 1) {
    const base = i * stride;
    for (let c = 0; c < componentCount; c += 1) {
      const offset = base + c * componentSize;
      if (accessor.componentType === 5126) values.push(dataView.getFloat32(offset, true));
      else if (accessor.componentType === 5123) values.push(dataView.getUint16(offset, true));
      else if (accessor.componentType === 5125) values.push(dataView.getUint32(offset, true));
      else if (accessor.componentType === 5121) values.push(dataView.getUint8(offset));
      else values.push(dataView.getInt16(offset, true));
    }
  }
  return values;
}

export function glbToToyboxVertices(asset, color = [0.8, 0.8, 0.8]) {
  const mesh = asset.json.meshes?.[0];
  const primitive = mesh?.primitives?.[0];
  if (primitive?.attributes?.POSITION == null) throw new Error("GLB mesh has no POSITION attribute.");
  const positions = readAccessor(asset, primitive.attributes.POSITION);
  const normals = primitive.attributes.NORMAL ? readAccessor(asset, primitive.attributes.NORMAL) : null;
  const colors = primitive.attributes.COLOR_0 ? readAccessor(asset, primitive.attributes.COLOR_0) : null;
  const indices = primitive.indices == null
    ? Array.from({ length: positions.length / 3 }, (_, index) => index)
    : readAccessor(asset, primitive.indices);
  const vertices = [];
  for (const index of indices) {
    vertices.push(
      positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2],
      normals ? normals[index * 3] : 0,
      normals ? normals[index * 3 + 1] : 1,
      normals ? normals[index * 3 + 2] : 0,
      colors ? colors[index * 3] : color[0],
      colors ? colors[index * 3 + 1] : color[1],
      colors ? colors[index * 3 + 2] : color[2]
    );
  }
  return vertices;
}
