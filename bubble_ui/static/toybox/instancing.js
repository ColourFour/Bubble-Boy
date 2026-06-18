export function createInstancing(gl) {
  const ext = gl.getExtension("ANGLE_instanced_arrays");
  if (!ext) return null;

  function createGroup(mesh, instances, options = {}) {
    const matrices = new Float32Array(instances.flatMap((entry) => entry.matrix));
    const centers = instances.map((entry) => entry.center || [entry.matrix[12], entry.matrix[13], entry.matrix[14]]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, matrices, gl.STATIC_DRAW);
    return {
      mesh,
      buffer,
      count: instances.length,
      centers,
      material: options.material || 0,
      maxDistance: options.maxDistance || 72,
      lodDistance: options.lodDistance || 46,
      stride: 16 * 4
    };
  }

  function drawGroup(group, locations, bindMesh, setIdentityModel, eye) {
    const instanceCount = group.count;
    bindMesh(group.mesh);
    gl.uniform1f(locations.material, group.material);
    gl.uniform1f(locations.instanced, 1);
    setIdentityModel();

    gl.bindBuffer(gl.ARRAY_BUFFER, group.buffer);
    for (let i = 0; i < locations.instanceMatrix.length; i += 1) {
      const location = locations.instanceMatrix[i];
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 4, gl.FLOAT, false, group.stride, i * 16);
      ext.vertexAttribDivisorANGLE(location, 1);
    }
    ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, group.mesh.count, instanceCount);
    for (const location of locations.instanceMatrix) {
      ext.vertexAttribDivisorANGLE(location, 0);
      gl.disableVertexAttribArray(location);
    }
    gl.uniform1f(locations.instanced, 0);
    return instanceCount;
  }

  return { createGroup, drawGroup };
}
