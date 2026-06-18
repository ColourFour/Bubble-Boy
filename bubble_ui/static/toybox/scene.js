import { createPhysicsWorld } from "/static/toybox_physics.js";
import { glbToToyboxVertices, loadGlb } from "/static/toybox/assets.js";
import { createCameraController } from "/static/toybox/controls.js";
import { createDebugController } from "/static/toybox/debug.js";
import { createInstancing } from "/static/toybox/instancing.js";
import { characterAnchors } from "/static/toybox/character.js";
import { createBehaviorState, updateBehaviorState } from "/static/toybox/idle.js";
import { installPostOverlay, skyByTime } from "/static/toybox/materials.js";
import { clampToPlayableRadius, terrainConfig } from "/static/toybox/terrain.js";

export async function bootToybox() {
  "use strict";
  window.__toyboxBoot = "started";
  window.__toyboxFrameCount = 0;
  window.__toyboxLastError = "";

  const fallbackState = {
    mood: "curious",
    weather: "storm",
    time_of_day: "twilight",
    camera_mode: "slow_orbit",
    speech: "The waves are loud today. Perfect for making big plans.",
    objects: [
      { id: "proposal_scrolls", type: "proposal", count: 3, state: "waiting" },
      { id: "approved_tokens", type: "approval", count: 1, state: "stored" },
      { id: "world_logs", type: "log", count: 4, state: "stacked" }
    ]
  };

  function readState() {
    const node = document.getElementById("toybox-state");
    if (!node) return fallbackState;
    try {
      const parsed = JSON.parse(node.textContent);
      return parsed && typeof parsed === "object" ? parsed : fallbackState;
    } catch (_error) {
      return fallbackState;
    }
  }

  const toyboxState = readState();
  document.getElementById("toybox-speech").textContent =
    toyboxState.speech || fallbackState.speech;
  document.getElementById("toybox-meta").textContent = [
    toyboxState.mood || "unknown mood",
    toyboxState.weather || "unknown weather",
    toyboxState.time_of_day || "unknown time"
  ].join(" / ");

  const canvas = document.getElementById("toybox-canvas");
  installPostOverlay(canvas);
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: true,
    depth: true,
    powerPreference: "high-performance"
  });

  if (!gl) {
    document.getElementById("toybox-error").classList.add("is-visible");
    return;
  }

  const vertexSource = `
    precision mediump float;
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;
    attribute vec4 aInstanceMatrix0;
    attribute vec4 aInstanceMatrix1;
    attribute vec4 aInstanceMatrix2;
    attribute vec4 aInstanceMatrix3;
    uniform mat4 uProjection;
    uniform mat4 uView;
    uniform mat4 uModel;
    uniform float uInstanced;
    uniform float uTime;
    uniform float uMaterial;
    uniform vec2 uWindDirection;
    uniform float uWindStrength;
    uniform float uWindGust;
    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vWaveHeight;
    varying float vShore;
    varying float vFoam;
    varying float vLocalY;
    varying float vFlameFlicker;

    float islandCove(float angle, float center, float width, float depth) {
      float d = atan(sin(angle - center), cos(angle - center));
      return depth * exp(-(d * d) / (width * width));
    }

    float islandRadius(float angle) {
      float radius = 3.12;
      radius += sin(angle * 2.0 + 0.35) * 0.21;
      radius += sin(angle * 3.0 - 1.20) * 0.14;
      radius += sin(angle * 5.0 + 1.65) * 0.10;
      radius += sin(angle * 9.0 - 0.55) * 0.045;
      radius -= islandCove(angle, 2.42, 0.34, 0.28);
      radius -= islandCove(angle, -1.82, 0.28, 0.22);
      radius += islandCove(angle, -0.55, 0.40, 0.24);
      radius += islandCove(angle, 1.05, 0.30, 0.16);
      return radius * 14.0;
    }

    float waveHeight(vec2 point) {
      float radius = length(point);
      float angle = atan(point.y, point.x);
      float shoreDistance = abs(radius - islandRadius(angle));
      float broadSwell = sin(dot(point, normalize(vec2(0.82, 0.57))) * 0.72 - uTime * 0.68) * 0.28;
      float crossSwell = sin(dot(point, normalize(vec2(-0.35, 0.94))) * 1.12 - uTime * 0.92) * 0.18;
      float windChop = sin(dot(point, normalize(vec2(0.98, -0.22))) * 2.25 - uTime * 1.85) * 0.075;
      float sharpChop = sin(dot(point, normalize(vec2(-0.73, -0.68))) * 3.80 - uTime * 2.65) * 0.04;
      float shorePush = (1.0 - smoothstep(0.0, 3.20, shoreDistance)) *
        sin(radius * 1.35 - uTime * 4.20 + angle * 3.0) * 0.12;
      return broadSwell + crossSwell + windChop + sharpChop + shorePush;
    }

    vec3 waterNormal(vec2 point) {
      float sampleGap = 0.11;
      float left = waveHeight(point - vec2(sampleGap, 0.0));
      float right = waveHeight(point + vec2(sampleGap, 0.0));
      float back = waveHeight(point - vec2(0.0, sampleGap));
      float front = waveHeight(point + vec2(0.0, sampleGap));
      return normalize(vec3(left - right, sampleGap * 2.0, back - front));
    }

    void main() {
      vec3 position = aPosition;
      float material = uMaterial;
      vLocalY = position.y;
      vFlameFlicker = 1.0;
      vec2 waterPoint = position.xz;
      float radius = length(waterPoint);
      float angle = atan(position.z, position.x);
      float height = waveHeight(waterPoint);
      float shoreRadius = islandRadius(angle);
      float shoreDistance = radius - shoreRadius;
      float waterAccess = smoothstep(0.02, 0.34, shoreDistance);
      float offshoreWave = smoothstep(0.10, 1.36, shoreDistance);
      vShore = 1.0 - smoothstep(shoreRadius + 0.04, shoreRadius + 1.48, radius);
      vFoam = 0.0;
      if (material > 0.5 && material < 1.5) {
        position.y += height * mix(0.16, 1.0, offshoreWave);
        position.y -= (1.0 - waterAccess) * 0.10;
      } else if (material > 1.5 && material < 2.5) {
        float boil = sin(angle * 11.0 + radius * 4.3 - uTime * 3.25);
        float breakUp = sin(position.x * 5.6 - position.z * 3.9 + uTime * 2.7);
        position.y += height * 0.58 * waterAccess + 0.035 + boil * 0.025 * waterAccess;
        position.xz += normalize(position.xz) * (boil * 0.035 + breakUp * 0.015) * waterAccess;
        vFoam = clamp((0.52 + boil * 0.32 + breakUp * 0.18) * waterAccess, 0.0, 1.0);
      } else if (material > 2.5 && material < 3.5) {
        float lift = clamp(sin(angle * 7.0 - uTime * 4.6) * 0.5 + 0.5, 0.0, 1.0);
        position.y += height * 0.42 * waterAccess + lift * 0.22 * waterAccess;
        position.xz += normalize(position.xz) * lift * 0.08 * waterAccess;
        vFoam = lift * waterAccess;
      } else if (material > 3.5 && material < 4.5) {
        float flameLift = smoothstep(-0.28, 0.38, position.y);
        float lean = sin(uTime * 7.4 + position.x * 8.5 + position.z * 5.2) * 0.045;
        vec2 windLean = uWindDirection * uWindStrength * uWindGust * 0.18;
        position.x += (lean + windLean.x) * flameLift;
        position.z += (cos(uTime * 6.2 + position.x * 5.8) * 0.028 + windLean.y) * flameLift;
        position.y += sin(uTime * 8.6 + position.z * 4.0) * 0.035 * flameLift;
        vFlameFlicker = 0.86 + sin(uTime * 9.0 + position.x * 6.0) * 0.10 + sin(uTime * 14.5 + position.z * 8.0) * 0.05;
      } else if (material > 4.5 && material < 5.5) {
        float starSeed = sin(position.x * 8.3 + position.y * 4.7 + position.z * 6.1);
        position.y += sin(uTime * 0.10 + starSeed * 6.283) * 0.012;
      } else if (material > 6.5 && material < 7.5) {
        float wetBeat = sin(radius * 5.2 - uTime * 3.8 + angle * 2.4);
        position.y += 0.012 * wetBeat;
        vFoam = clamp(0.40 + wetBeat * 0.34 + uWindGust * 0.12, 0.0, 1.0);
      } else if (material > 14.5 && material < 15.5) {
        float grassLift = smoothstep(-0.22, 0.36, position.y);
        float grassWave = sin(uTime * (1.05 + uWindGust * 0.55) + position.x * 2.8 + position.z * 3.4);
        position.x += uWindDirection.x * uWindStrength * grassLift * (0.10 + grassWave * 0.035);
        position.z += uWindDirection.y * uWindStrength * grassLift * (0.10 + grassWave * 0.035);
      }
      mat4 instanceMatrix = uInstanced > 0.5
        ? mat4(aInstanceMatrix0, aInstanceMatrix1, aInstanceMatrix2, aInstanceMatrix3)
        : mat4(1.0);
      vec4 world = uModel * instanceMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      vColor = aColor;
      vWaveHeight = height;
      if (material > 0.5 && material < 2.5) {
        vNormal = normalize(mat3(uModel) * waterNormal(waterPoint));
      } else {
        vNormal = normalize(mat3(uModel) * mat3(instanceMatrix) * aNormal);
      }
      gl_Position = uProjection * uView * world;
    }
  `;

  const fragmentSource = `
    precision mediump float;
    uniform vec3 uLight;
    uniform vec3 uLightColor;
    uniform vec3 uAmbient;
    uniform vec3 uFogColor;
    uniform vec3 uFire;
    uniform vec3 uEye;
    uniform float uTime;
    uniform float uMaterial;
    uniform float uFogDensity;
    uniform float uFireBoost;
    uniform float uMoonStrength;
    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vWaveHeight;
    varying float vShore;
    varying float vFoam;
    varying float vLocalY;
    varying float vFlameFlicker;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 sunDir = normalize(uLight - vWorld);
      vec3 viewDir = normalize(uEye - vWorld);
      float diffuse = max(dot(normal, sunDir), 0.0);
      if (uMaterial > 0.5 && uMaterial < 1.5) {
        float peak = smoothstep(0.08, 0.42, vWaveHeight);
        float trough = smoothstep(-0.38, -0.05, vWaveHeight);
        float distanceHaze = smoothstep(30.0, 165.0, length(vWorld.xz));
        float crestStreak = smoothstep(0.22, 0.43, vWaveHeight) * (0.35 + vShore * 0.65);
        float shoreFroth = vShore * smoothstep(0.14, 0.38, vWaveHeight);
        float specular = pow(max(dot(reflect(-sunDir, normal), viewDir), 0.0), 44.0) * 0.64;
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.18;
        vec2 moonAxis = normalize(vec2(-0.98, 0.21));
        vec2 moonCross = vec2(-moonAxis.y, moonAxis.x);
        float moonBand = exp(-pow(dot(vWorld.xz, moonCross) / 15.0, 2.0)) *
          smoothstep(12.0, 76.0, dot(vWorld.xz, moonAxis)) *
          (1.0 - smoothstep(140.0, 222.0, length(vWorld.xz)));
        float brokenStreaks = 0.52 +
          sin(vWorld.x * 0.58 + vWorld.z * 1.04 + uTime * 0.36) * 0.26 +
          sin(vWorld.x * 1.18 - vWorld.z * 0.62 - uTime * 0.18) * 0.16;
        vec3 troughColor = vec3(0.018, 0.060, 0.125);
        vec3 bodyColor = vec3(0.036, 0.135, 0.215);
        vec3 crestColor = vec3(0.245, 0.430, 0.560);
        vec3 color = mix(troughColor, bodyColor, trough);
        color = mix(color, crestColor, peak * 0.62);
        vec3 facetTint = vec3(0.80 + vColor.r * 2.0, 0.86 + vColor.g * 0.95, 0.94 + vColor.b * 1.0);
        color *= facetTint;
        color *= uAmbient + diffuse * uLightColor;
        color += vec3(0.56, 0.70, 0.88) * specular;
        color += vec3(0.12, 0.25, 0.35) * fresnel;
        color += vec3(0.60, 0.78, 0.92) * crestStreak * 0.13;
        color += vec3(0.56, 0.76, 0.90) * shoreFroth * 0.11;
        color += vec3(0.58, 0.72, 0.92) * moonBand * clamp(brokenStreaks, 0.0, 1.0) * 0.52 * uMoonStrength;
        color = mix(color, uFogColor, distanceHaze * (0.18 + uFogDensity * 0.54));
        gl_FragColor = vec4(color, 1.0);
        return;
      }
      if (uMaterial > 1.5 && uMaterial < 2.5) {
        float flicker = 0.55 + 0.45 * sin(vWorld.x * 4.8 - vWorld.z * 3.4 + vFoam * 2.6);
        vec3 foamColor = mix(vec3(0.40, 0.58, 0.66), vec3(0.82, 0.92, 0.92), clamp(vFoam * 0.78 + flicker * 0.18, 0.0, 1.0));
        gl_FragColor = vec4(foamColor, 0.46);
        return;
      }
      if (uMaterial > 2.5 && uMaterial < 3.5) {
        vec3 mistColor = mix(vec3(0.22, 0.38, 0.50), vec3(0.64, 0.78, 0.84), vFoam);
        gl_FragColor = vec4(mistColor, 0.13 + vFoam * 0.20);
        return;
      }
      if (uMaterial > 3.5 && uMaterial < 4.5) {
        float core = smoothstep(-0.28, 0.32, vLocalY);
        vec3 edgeColor = vec3(1.0, 0.24, 0.035);
        vec3 coreColor = vec3(1.0, 0.84, 0.20);
        vec3 flameColor = mix(edgeColor, coreColor, core);
        flameColor = mix(flameColor, vColor, 0.20);
        gl_FragColor = vec4(flameColor * (1.08 + vFlameFlicker * 0.22), 1.0);
        return;
      }
      if (uMaterial > 4.5 && uMaterial < 5.5) {
        float seed = fract(sin(dot(vWorld.xz, vec2(12.9898, 78.233)) + vWorld.y * 37.719) * 43758.5453);
        float twinkle = 0.48 + 0.52 * sin(uTime * (0.45 + seed * 0.82) + seed * 6.283);
        float horizonFade = smoothstep(0.18, 1.20, vWorld.y) * (1.0 - smoothstep(7.4, 8.6, vWorld.y));
        float alpha = (0.16 + twinkle * 0.48) * horizonFade * uMoonStrength;
        gl_FragColor = vec4(vColor * (0.76 + twinkle * 0.68), alpha);
        return;
      }
      if (uMaterial > 5.5 && uMaterial < 6.5) {
        float lowGlow = 1.0 - smoothstep(-0.70, 4.20, vLocalY);
        float upperFade = 1.0 - smoothstep(3.0, 9.0, vLocalY);
        float pulse = 0.86 + sin(uTime * 0.22 + vWorld.x * 0.035 + vWorld.z * 0.025) * 0.08;
      gl_FragColor = vec4(vColor * pulse, lowGlow * upperFade * (0.18 + uFogDensity * 0.26));
        return;
      }
      if (uMaterial > 6.5 && uMaterial < 7.5) {
        vec3 wetColor = mix(vColor * 0.66, vColor * 1.08, vFoam);
        gl_FragColor = vec4(wetColor, 0.16 + vFoam * 0.12);
        return;
      }
      if (uMaterial > 7.5 && uMaterial < 8.5) {
        float moonMottle = 0.88 + sin(vWorld.x * 0.16 + vWorld.y * 0.21 + vWorld.z * 0.13) * 0.08;
        gl_FragColor = vec4(vColor * moonMottle * (0.42 + uMoonStrength * 0.80), 0.38 + uMoonStrength * 0.50);
        return;
      }
      if (uMaterial > 8.5 && uMaterial < 9.5) {
        float shimmer = 0.62 + 0.38 * sin(vWorld.x * 0.78 + vWorld.z * 1.42 + uTime * 0.80);
        float skyBias = smoothstep(4.0, 16.0, vWorld.y);
        float alpha = mix(0.16, 0.25, skyBias) * (0.72 + shimmer * 0.28);
        gl_FragColor = vec4(vColor * (0.74 + shimmer * 0.32) * (0.34 + uMoonStrength * 0.84), alpha * uMoonStrength);
        return;
      }
      if (uMaterial > 9.5 && uMaterial < 10.5) {
        float ndv = max(dot(normal, viewDir), 0.0);
        float edge = pow(1.0 - ndv, 2.25);
        float specular = pow(max(dot(reflect(-sunDir, normal), viewDir), 0.0), 58.0) * 0.58;
        float softWrap = pow(clamp(dot(-normal, sunDir) * 0.45 + 0.55, 0.0, 1.0), 2.0);
        float innerWarmth = 1.0 - smoothstep(-0.34, 0.54, abs(vLocalY + 0.10));
        float fireDistance = distance(vWorld, uFire);
        float fireGlow = clamp(1.12 * uFireBoost / (fireDistance * fireDistance * 0.34 + 1.65), 0.0, 0.30);
        vec3 edgeShift = mix(vec3(0.44, 0.72, 1.00), vec3(1.00, 0.68, 0.92), smoothstep(0.18, 1.0, edge));
        vec3 glass = vColor * (uAmbient * 0.72 + diffuse * uLightColor * 0.44);
        glass += edgeShift * edge * 0.34;
        glass += vec3(1.0, 0.66, 0.28) * (innerWarmth * 0.20 + fireGlow);
        glass += vec3(0.72, 0.92, 1.0) * specular;
        glass += vec3(0.74, 0.88, 1.0) * softWrap * 0.08;
        gl_FragColor = vec4(glass, 0.34 + edge * 0.30 + innerWarmth * 0.035);
        return;
      }
      if (uMaterial > 10.5 && uMaterial < 11.5) {
        if (dot(normal, viewDir) < 0.015) discard;
        float pulse = 0.90 + sin(uTime * 1.2 + vWorld.y * 1.7) * 0.08;
        gl_FragColor = vec4(vColor * (1.05 + pulse * 0.16), 0.72);
        return;
      }
      if (uMaterial > 11.5 && uMaterial < 12.5) {
        if (dot(normal, viewDir) < 0.015) discard;
        float catchlight = pow(max(dot(reflect(-sunDir, normal), viewDir), 0.0), 32.0) * 0.42;
        gl_FragColor = vec4(vColor + vec3(catchlight), 1.0);
        return;
      }
      if (uMaterial > 12.5 && uMaterial < 13.5) {
        if (dot(normal, viewDir) < 0.015) discard;
        float softEdge = 0.80 + max(dot(normal, sunDir), 0.0) * 0.20;
        gl_FragColor = vec4(vColor * softEdge, 0.42);
        return;
      }
      if (uMaterial > 13.5 && uMaterial < 14.5) {
        float warmth = 1.0 - smoothstep(-0.56, 0.62, abs(vLocalY + 0.16));
        float pulse = 0.94 + sin(uTime * 0.85 + vWorld.x * 1.8) * 0.06;
        gl_FragColor = vec4(vColor * pulse, 0.10 + warmth * 0.12);
        return;
      }
      float rim = pow(1.0 - max(dot(normal, normalize(-vWorld)), 0.0), 2.0) * 0.16;
      float fireDistance = distance(vWorld, uFire);
      float firePulse = 0.78 + sin(uTime * 5.4) * 0.12 + sin(uTime * 10.7 + vWorld.x * 2.2) * 0.06;
      float fireGlow = clamp(1.44 * firePulse * uFireBoost / (fireDistance * fireDistance * 0.52 + 0.80), 0.0, 1.04);
      float fireAura = clamp(1.80 * firePulse * uFireBoost / (fireDistance * fireDistance * 0.20 + 2.28), 0.0, 0.62);
      float upLight = 0.74 + max(normal.y, 0.0) * 0.36;
      float fog = smoothstep(20.0, 72.0, length(vWorld.xz)) * uFogDensity;
      vec3 coolLight = uAmbient * (1.02 + max(normal.y, 0.0) * 0.30) + diffuse * uLightColor;
      vec3 color = vColor * coolLight;
      vec3 moonDir = normalize(vec3(-0.55, 0.36, 0.76));
      float moonRim = pow(max(dot(normal, moonDir), 0.0), 1.65) * (0.50 + smoothstep(4.0, 34.0, length(vWorld.xz)) * 0.50);
      color = mix(color, color * vec3(1.30, 0.90, 0.58), clamp((fireGlow + fireAura) * 0.30, 0.0, 0.52));
      color += vec3(1.0, 0.54, 0.16) * fireGlow * upLight;
      color += vec3(1.0, 0.64, 0.24) * fireAura * max(normal.y, 0.0);
      color += vec3(0.12, 0.24, 0.40) * moonRim * uMoonStrength;
      color += vec3(0.30, 0.56, 0.88) * rim;
      color = mix(color, uFogColor, fog);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || "Shader compile failed.");
    }
    return shader;
  }

  function createProgram() {
    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Shader link failed.");
    }
    return program;
  }

  const program = createProgram();
  gl.useProgram(program);

  const locations = {
    position: gl.getAttribLocation(program, "aPosition"),
    normal: gl.getAttribLocation(program, "aNormal"),
    color: gl.getAttribLocation(program, "aColor"),
    instanceMatrix: [
      gl.getAttribLocation(program, "aInstanceMatrix0"),
      gl.getAttribLocation(program, "aInstanceMatrix1"),
      gl.getAttribLocation(program, "aInstanceMatrix2"),
      gl.getAttribLocation(program, "aInstanceMatrix3")
    ],
    projection: gl.getUniformLocation(program, "uProjection"),
    view: gl.getUniformLocation(program, "uView"),
    model: gl.getUniformLocation(program, "uModel"),
    instanced: gl.getUniformLocation(program, "uInstanced"),
    time: gl.getUniformLocation(program, "uTime"),
    material: gl.getUniformLocation(program, "uMaterial"),
    light: gl.getUniformLocation(program, "uLight"),
    lightColor: gl.getUniformLocation(program, "uLightColor"),
    ambient: gl.getUniformLocation(program, "uAmbient"),
    fogColor: gl.getUniformLocation(program, "uFogColor"),
    fire: gl.getUniformLocation(program, "uFire"),
    eye: gl.getUniformLocation(program, "uEye"),
    windDirection: gl.getUniformLocation(program, "uWindDirection"),
    windStrength: gl.getUniformLocation(program, "uWindStrength"),
    windGust: gl.getUniformLocation(program, "uWindGust"),
    fogDensity: gl.getUniformLocation(program, "uFogDensity"),
    fireBoost: gl.getUniformLocation(program, "uFireBoost"),
    moonStrength: gl.getUniformLocation(program, "uMoonStrength")
  };
  gl.uniform1f(locations.instanced, 0);

  function v3(x, y, z) {
    return [x, y, z];
  }

  function sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function normalize(a) {
    const length = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / length, a[1] / length, a[2] / length];
  }

  function pushTriangle(mesh, a, b, c, color, normalOverride) {
    const normal = normalOverride || normalize(cross(sub(b, a), sub(c, a)));
    for (const point of [a, b, c]) {
      mesh.vertices.push(
        point[0], point[1], point[2],
        normal[0], normal[1], normal[2],
        color[0], color[1], color[2]
      );
    }
  }

  function pushQuad(mesh, a, b, c, d, color, normalOverride) {
    pushTriangle(mesh, a, b, c, color, normalOverride);
    pushTriangle(mesh, a, c, d, color, normalOverride);
  }

  function createMesh(vertices) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return { buffer, count: vertices.length / 9 };
  }

  function box(width, height, depth, color) {
    const mesh = { vertices: [] };
    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;
    pushQuad(mesh, v3(-x, -y, z), v3(x, -y, z), v3(x, y, z), v3(-x, y, z), color, v3(0, 0, 1));
    pushQuad(mesh, v3(x, -y, -z), v3(-x, -y, -z), v3(-x, y, -z), v3(x, y, -z), color, v3(0, 0, -1));
    pushQuad(mesh, v3(-x, y, z), v3(x, y, z), v3(x, y, -z), v3(-x, y, -z), color, v3(0, 1, 0));
    pushQuad(mesh, v3(-x, -y, -z), v3(x, -y, -z), v3(x, -y, z), v3(-x, -y, z), color, v3(0, -1, 0));
    pushQuad(mesh, v3(x, -y, z), v3(x, -y, -z), v3(x, y, -z), v3(x, y, z), color, v3(1, 0, 0));
    pushQuad(mesh, v3(-x, -y, -z), v3(-x, -y, z), v3(-x, y, z), v3(-x, y, -z), color, v3(-1, 0, 0));
    return createMesh(mesh.vertices);
  }

  function frustum(topRadius, bottomRadius, height, sides, topColor, sideColor, bottomColor) {
    const mesh = { vertices: [] };
    const topY = height / 2;
    const bottomY = -height / 2;
    const topCenter = v3(0, topY, 0);
    const bottomCenter = v3(0, bottomY, 0);
    for (let i = 0; i < sides; i += 1) {
      const a0 = (i / sides) * Math.PI * 2;
      const a1 = ((i + 1) / sides) * Math.PI * 2;
      const top0 = v3(Math.cos(a0) * topRadius, topY, Math.sin(a0) * topRadius);
      const top1 = v3(Math.cos(a1) * topRadius, topY, Math.sin(a1) * topRadius);
      const bottom0 = v3(Math.cos(a0) * bottomRadius, bottomY, Math.sin(a0) * bottomRadius);
      const bottom1 = v3(Math.cos(a1) * bottomRadius, bottomY, Math.sin(a1) * bottomRadius);
      pushQuad(mesh, bottom0, bottom1, top1, top0, sideColor);
      if (topRadius > 0) pushTriangle(mesh, topCenter, top0, top1, topColor, v3(0, 1, 0));
      if (bottomRadius > 0) pushTriangle(mesh, bottomCenter, bottom1, bottom0, bottomColor, v3(0, -1, 0));
    }
    return createMesh(mesh.vertices);
  }

  function sphere(radius, stacks, slices, color) {
    const mesh = { vertices: [] };
    for (let y = 0; y < stacks; y += 1) {
      const v0 = y / stacks;
      const v1 = (y + 1) / stacks;
      const p0 = v0 * Math.PI;
      const p1 = v1 * Math.PI;
      for (let x = 0; x < slices; x += 1) {
        const u0 = x / slices;
        const u1 = (x + 1) / slices;
        const t0 = u0 * Math.PI * 2;
        const t1 = u1 * Math.PI * 2;
        const a = v3(Math.sin(p0) * Math.cos(t0) * radius, Math.cos(p0) * radius, Math.sin(p0) * Math.sin(t0) * radius);
        const b = v3(Math.sin(p1) * Math.cos(t0) * radius, Math.cos(p1) * radius, Math.sin(p1) * Math.sin(t0) * radius);
        const c = v3(Math.sin(p1) * Math.cos(t1) * radius, Math.cos(p1) * radius, Math.sin(p1) * Math.sin(t1) * radius);
        const d = v3(Math.sin(p0) * Math.cos(t1) * radius, Math.cos(p0) * radius, Math.sin(p0) * Math.sin(t1) * radius);
        pushTriangle(mesh, a, b, c, color, normalize(a));
        pushTriangle(mesh, a, c, d, color, normalize(d));
      }
    }
    return createMesh(mesh.vertices);
  }

  function appendSoftSphere(mesh, center, radius, stacks, slices, color, stretch) {
    const shape = stretch || [1, 1, 1];
    for (let y = 0; y < stacks; y += 1) {
      const v0 = y / stacks;
      const v1 = (y + 1) / stacks;
      const p0 = v0 * Math.PI;
      const p1 = v1 * Math.PI;
      for (let x = 0; x < slices; x += 1) {
        const u0 = x / slices;
        const u1 = (x + 1) / slices;
        const t0 = u0 * Math.PI * 2;
        const t1 = u1 * Math.PI * 2;
        const point = (polar, theta) => {
          const unit = v3(Math.sin(polar) * Math.cos(theta), Math.cos(polar), Math.sin(polar) * Math.sin(theta));
          return v3(
            center[0] + unit[0] * radius * shape[0],
            center[1] + unit[1] * radius * shape[1],
            center[2] + unit[2] * radius * shape[2]
          );
        };
        const a = point(p0, t0);
        const b = point(p1, t0);
        const c = point(p1, t1);
        const d = point(p0, t1);
        pushTriangle(mesh, a, b, c, color, normalize(v3((a[0] - center[0]) / shape[0], (a[1] - center[1]) / shape[1], (a[2] - center[2]) / shape[2])));
        pushTriangle(mesh, a, c, d, color, normalize(v3((d[0] - center[0]) / shape[0], (d[1] - center[1]) / shape[1], (d[2] - center[2]) / shape[2])));
      }
    }
  }

  function softBubbleBody(color) {
    const mesh = { vertices: [] };
    appendSoftSphere(mesh, v3(0, 0, 0), 0.52, 16, 24, color, [1.0, 1.04, 0.96]);
    appendSoftSphere(mesh, v3(-0.45, -0.12, -0.01), 0.125, 8, 12, color, [0.82, 1.04, 0.74]);
    appendSoftSphere(mesh, v3(0.45, -0.12, -0.01), 0.125, 8, 12, color, [0.82, 1.04, 0.74]);
    appendSoftSphere(mesh, v3(-0.22, -0.47, 0.04), 0.145, 8, 12, color, [1.22, 0.62, 0.82]);
    appendSoftSphere(mesh, v3(0.22, -0.47, 0.04), 0.145, 8, 12, color, [1.22, 0.62, 0.82]);
    return createMesh(mesh.vertices);
  }

  function flatEllipse(width, height, segments, color) {
    const mesh = { vertices: [] };
    const center = v3(0, 0, 0);
    for (let i = 0; i < segments; i += 1) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      pushTriangle(
        mesh,
        center,
        v3(Math.cos(a0) * width * 0.5, Math.sin(a0) * height * 0.5, 0),
        v3(Math.cos(a1) * width * 0.5, Math.sin(a1) * height * 0.5, 0),
        color,
        v3(0, 0, 1)
      );
    }
    return createMesh(mesh.vertices);
  }

  function appendLineStrip2d(mesh, points, width, color) {
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const length = Math.hypot(dx, dy) || 1;
      const ox = (-dy / length) * width * 0.5;
      const oy = (dx / length) * width * 0.5;
      pushQuad(
        mesh,
        v3(a[0] - ox, a[1] - oy, 0),
        v3(b[0] - ox, b[1] - oy, 0),
        v3(b[0] + ox, b[1] + oy, 0),
        v3(a[0] + ox, a[1] + oy, 0),
        color,
        v3(0, 0, 1)
      );
    }
  }

  function arcStrip(radius, width, startAngle, endAngle, segments, color) {
    const mesh = { vertices: [] };
    const points = [];
    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const angle = startAngle + (endAngle - startAngle) * t;
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
    appendLineStrip2d(mesh, points, width, color);
    return createMesh(mesh.vertices);
  }

  function spiralMark(color) {
    const mesh = { vertices: [] };
    const points = [];
    for (let i = 0; i <= 42; i += 1) {
      const t = i / 42;
      const angle = 0.55 + t * Math.PI * 4.55;
      const radius = 0.014 + t * 0.078;
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
    appendLineStrip2d(mesh, points, 0.012, color);
    appendLineStrip2d(mesh, [[0.0, -0.100], [0.0, -0.150]], 0.012, color);
    return createMesh(mesh.vertices);
  }

  function blendColor(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t
    ];
  }

  function hash01(value) {
    const x = Math.sin(value * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function blendNumber(a, b, t) {
    return a + (b - a) * t;
  }

  function scaleColor(color, amount) {
    return [
      clamp(color[0] * amount, 0, 1),
      clamp(color[1] * amount, 0, 1),
      clamp(color[2] * amount, 0, 1)
    ];
  }

  function addColor(a, b) {
    return [
      clamp(a[0] + b[0], 0, 1),
      clamp(a[1] + b[1], 0, 1),
      clamp(a[2] + b[2], 0, 1)
    ];
  }

  function angleDistance(a, b) {
    return Math.atan2(Math.sin(a - b), Math.cos(a - b));
  }

  function patchNoise2d(x, z, scale, seed) {
    const cellX = Math.floor((x + seed * 13.7) / scale);
    const cellZ = Math.floor((z - seed * 7.3) / scale);
    return hash01(cellX * 37.0 + cellZ * 83.0 + seed * 19.0);
  }

  function valueNoise2d(x, z, scale, seed) {
    const px = (x + seed * 11.3) / scale;
    const pz = (z - seed * 5.9) / scale;
    const ix = Math.floor(px);
    const iz = Math.floor(pz);
    const fx = smoothstep(0, 1, px - ix);
    const fz = smoothstep(0, 1, pz - iz);
    const a = hash01(ix * 37.0 + iz * 83.0 + seed * 19.0);
    const b = hash01((ix + 1) * 37.0 + iz * 83.0 + seed * 19.0);
    const c = hash01(ix * 37.0 + (iz + 1) * 83.0 + seed * 19.0);
    const d = hash01((ix + 1) * 37.0 + (iz + 1) * 83.0 + seed * 19.0);
    return blendNumber(blendNumber(a, b, fx), blendNumber(c, d, fx), fz);
  }

  function ovalMask(x, z, cx, cz, rx, rz, yaw, feather) {
    const dx = x - cx;
    const dz = z - cz;
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const localX = (dx * c + dz * s) / rx;
    const localZ = (-dx * s + dz * c) / rz;
    const radius = Math.hypot(localX, localZ);
    return 1 - smoothstep(1 - feather, 1, radius);
  }

  function campClearingMask(x, z) {
    const dx = x - 0.18;
    const dz = z + 0.24;
    const angle = Math.atan2(dz / 0.78, dx / 1.08);
    const radius = Math.hypot(dx / 1.08, dz / 0.78);
    const edge =
      4.25 +
      Math.sin(angle * 2.7 + 0.35) * 0.30 +
      Math.sin(angle * 4.9 - 1.18) * 0.22 +
      (patchNoise2d(x, z, 2.8, 4.0) - 0.5) * 0.28;
    return 1 - smoothstep(edge * 0.68, edge, radius);
  }

  const WORLD_RADIUS_SCALE = terrainConfig.worldRadiusScale;
  const PLAYABLE_RADIUS = terrainConfig.playableRadius;
  const FAR_WATER_RADIUS = terrainConfig.farWaterRadius;

  function islandCove(angle, center, width, depth) {
    const distance = angleDistance(angle, center);
    return depth * Math.exp(-(distance * distance) / (width * width));
  }

  function islandShoreRadius(angle) {
    let radius = 3.12;
    radius += Math.sin(angle * 2.0 + 0.35) * 0.21;
    radius += Math.sin(angle * 3.0 - 1.20) * 0.14;
    radius += Math.sin(angle * 5.0 + 1.65) * 0.10;
    radius += Math.sin(angle * 9.0 - 0.55) * 0.045;
    radius -= islandCove(angle, 2.42, 0.34, 0.28);
    radius -= islandCove(angle, -1.82, 0.28, 0.22);
    radius += islandCove(angle, -0.55, 0.40, 0.24);
    radius += islandCove(angle, 1.05, 0.30, 0.16);
    return radius * WORLD_RADIUS_SCALE;
  }

  function distanceToSegment2d(x, z, ax, az, bx, bz) {
    const vx = bx - ax;
    const vz = bz - az;
    const wx = x - ax;
    const wz = z - az;
    const lengthSq = vx * vx + vz * vz || 1;
    const t = clamp((wx * vx + wz * vz) / lengthSq, 0, 1);
    const px = ax + vx * t;
    const pz = az + vz * t;
    return Math.hypot(x - px, z - pz);
  }

  function terrainHeight(angle, radial, x, z) {
    const facetWeight = smoothstep(0.08, 0.98, radial);
    const broadRoll = Math.sin(x * 0.16 + z * 0.07) * 0.034 + Math.sin(x * -0.08 + z * 0.15 + 0.7) * 0.026;
    const patchLift = (patchNoise2d(x, z, 4.2, 1.0) - 0.5) * 0.040 + (patchNoise2d(x, z, 7.8, 2.0) - 0.5) * 0.030;
    const organicLift = (valueNoise2d(x, z, 5.8, 3.0) - 0.5) * 0.050 + (valueNoise2d(x, z, 12.5, 7.0) - 0.5) * 0.045;
    const moonShoulder = ovalMask(x, z, -5.8, 4.4, 16.0, 4.6, 0.36, 0.62);
    const campBasin = ovalMask(x, z, 0.35, -0.28, 6.4, 4.0, -0.12, 0.54);
    let y = 0.42 - radial * 0.12 + (1 - smoothstep(0.0, 0.72, radial)) * 0.028;
    y += (broadRoll + patchLift + organicLift) * facetWeight;
    y += moonShoulder * 0.026 * facetWeight;
    y -= campBasin * 0.020 * facetWeight;

    const campFlat = 1 - smoothstep(0.18, 0.82, Math.hypot(x - 0.86, z + 0.14));
    const benchFlat = 1 - smoothstep(0.18, 0.76, Math.hypot(x + 1.85, z + 1.15));
    const centerFlat = 1 - smoothstep(0.18, 0.70, Math.hypot(x, z - 0.10));
    const authoredClearing = campClearingMask(x, z);
    y = blendNumber(y, 0.34, authoredClearing * 0.34);
    y = blendNumber(y, 0.33, campFlat * 0.52);
    y = blendNumber(y, 0.32, benchFlat * 0.50);
    y = blendNumber(y, 0.40, centerFlat * 0.18);
    y -= smoothstep(0.84, 1.0, radial) * 0.030;
    return y;
  }

  function terrainPoint(radial, angle) {
    const radius = islandShoreRadius(angle) * radial;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return v3(x, terrainHeight(angle, radial, x, z), z);
  }

  function groundHeightAt(x, z) {
    const angle = Math.atan2(z, x);
    const shore = Math.max(0.001, islandShoreRadius(angle));
    const radial = clamp(Math.hypot(x, z) / shore, 0, 1);
    return terrainHeight(angle, radial, x, z) + ISLAND_OFFSET_Y;
  }

  const shorelineModel = {
    radiusAt(angle) {
      return islandShoreRadius(angle);
    },
    samplePoint(angle, offset) {
      const radius = this.radiusAt(angle) + (offset || 0);
      return [Math.cos(angle) * radius, Math.sin(angle) * radius];
    },
    signedDistance(x, z) {
      const angle = Math.atan2(z, x);
      return Math.hypot(x, z) - this.radiusAt(angle);
    },
    containsPoint(x, z, inset) {
      return this.signedDistance(x, z) < -(inset || 0);
    },
    nearShore(x, z, width) {
      return Math.abs(this.signedDistance(x, z)) <= (width || 0.36);
    },
    shoreFactor(x, z, width) {
      const distance = Math.abs(this.signedDistance(x, z));
      return 1 - smoothstep(0, width || 0.72, distance);
    }
  };

  function oceanSurface(innerRadius, outerRadius, rings, segments, nearColor, farColor) {
    const mesh = { vertices: [] };
    for (let r = 0; r < rings; r += 1) {
      const outward0 = ((outerRadius - innerRadius) * r) / rings;
      const outward1 = ((outerRadius - innerRadius) * (r + 1)) / rings;
      for (let s = 0; s < segments; s += 1) {
        const a0 = (s / segments) * Math.PI * 2;
        const a1 = ((s + 1) / segments) * Math.PI * 2;
        const shore0 = shorelineModel.radiusAt(a0) + 0.10;
        const shore1 = shorelineModel.radiusAt(a1) + 0.10;
        const radius0a = shore0 + outward0;
        const radius0b = shore1 + outward0;
        const radius1a = shore0 + outward1;
        const radius1b = shore1 + outward1;
        const depthMix = Math.min(1, outward0 / (outerRadius - innerRadius));
        const facet = hash01(r * 29.0 + s * 7.0);
        const moonPath = 1 - smoothstep(0.18, 0.88, Math.abs(angleDistance((a0 + a1) * 0.5, 2.28)));
        const color = scaleColor(
          blendColor(nearColor, farColor, depthMix),
          0.90 + facet * 0.14 + moonPath * 0.05
        );
        const p0 = v3(Math.cos(a0) * radius0a, -0.54, Math.sin(a0) * radius0a);
        const p1 = v3(Math.cos(a1) * radius0b, -0.54, Math.sin(a1) * radius0b);
        const p2 = v3(Math.cos(a1) * radius1b, -0.54, Math.sin(a1) * radius1b);
        const p3 = v3(Math.cos(a0) * radius1a, -0.54, Math.sin(a0) * radius1a);
        pushQuad(mesh, p0, p1, p2, p3, color, v3(0, 1, 0));
      }
    }
    return createMesh(mesh.vertices);
  }

  function shorelineFoam(bands, segments) {
    const mesh = { vertices: [] };
    for (let band = 0; band < bands; band += 1) {
      for (let s = 0; s < segments; s += 1) {
        const patchNoise = hash01(band * 41.0 + s * 9.7);
        const clusterNoise = Math.sin(s * 0.37 + band * 1.9) * 0.5 + 0.5;
        if (patchNoise < 0.48 || (band > 0 && clusterNoise < 0.50)) continue;
        const angleSpan = 1.35 + hash01(s * 2.3 + band) * 2.85;
        const a0 = ((s + patchNoise * 0.32) / segments) * Math.PI * 2;
        const a1 = ((s + angleSpan) / segments) * Math.PI * 2;
        const midAngle = (a0 + a1) * 0.5;
        const offset = 0.03 + band * 0.20 + (hash01(s * 4.2 + band * 3.1) - 0.5) * 0.12;
        const width = 0.10 + patchNoise * 0.16 + hash01(s * 5.1 + band * 6.7) * 0.07;
        const inner0 = shorelineModel.radiusAt(a0) + Math.max(0.04, offset);
        const innerMid = shorelineModel.radiusAt(midAngle) + Math.max(0.04, offset + (hash01(s * 8.4 + band) - 0.5) * 0.08);
        const inner1 = shorelineModel.radiusAt(a1) + Math.max(0.04, offset);
        const outer0 = inner0 + width * (0.75 + hash01(s * 1.9 + band) * 0.35);
        const outerMid = innerMid + width;
        const outer1 = inner1 + width * (0.72 + hash01(s * 6.4 + band) * 0.42);
        const color = blendColor([0.70, 0.84, 0.80], [0.93, 0.96, 0.88], patchNoise);
        const p0 = v3(Math.cos(a0) * inner0, -0.49, Math.sin(a0) * inner0);
        const pMidInner = v3(Math.cos(midAngle) * innerMid, -0.49, Math.sin(midAngle) * innerMid);
        const p1 = v3(Math.cos(a1) * inner1, -0.49, Math.sin(a1) * inner1);
        const p2 = v3(Math.cos(a1) * outer1, -0.49, Math.sin(a1) * outer1);
        const pMidOuter = v3(Math.cos(midAngle) * outerMid, -0.49, Math.sin(midAngle) * outerMid);
        const p3 = v3(Math.cos(a0) * outer0, -0.49, Math.sin(a0) * outer0);
        pushQuad(mesh, p0, pMidInner, pMidOuter, p3, color, v3(0, 1, 0));
        pushQuad(mesh, pMidInner, p1, p2, pMidOuter, color, v3(0, 1, 0));
      }
    }
    return createMesh(mesh.vertices);
  }

  function shorelineSpray(count) {
    const mesh = { vertices: [] };
    for (let i = 0; i < count; i += 1) {
      const activity = hash01(i * 13.37);
      if (activity < 0.70) continue;
      const angle = (i / count) * Math.PI * 2 + (activity - 0.5) * 0.16;
      const tangent = v3(-Math.sin(angle), 0, Math.cos(angle));
      const outward = v3(Math.cos(angle), 0, Math.sin(angle));
      const baseRadius = shorelineModel.radiusAt(angle) + 0.12 + Math.max(0, (hash01(i * 2.1) - 0.5) * 0.24);
      const base = v3(outward[0] * baseRadius, -0.42, outward[2] * baseRadius);
      const width = 0.035 + activity * 0.045;
      const height = 0.12 + hash01(i * 4.8) * 0.24;
      const lean = 0.05 + hash01(i * 7.4) * 0.12;
      const left = v3(base[0] + tangent[0] * width, base[1], base[2] + tangent[2] * width);
      const right = v3(base[0] - tangent[0] * width, base[1], base[2] - tangent[2] * width);
      const top = v3(base[0] + outward[0] * lean, base[1] + height, base[2] + outward[2] * lean);
      pushTriangle(mesh, left, right, top, [0.76, 0.88, 0.84], outward);
    }
    return createMesh(mesh.vertices);
  }

  function wetShoreBand(segments) {
    const mesh = { vertices: [] };
    for (let s = 0; s < segments; s += 1) {
      const patch = hash01(s * 10.8);
      const pulse = Math.sin(s * 0.41) * 0.5 + 0.5;
      if (patch < 0.34 || pulse < 0.18) continue;
      const a0 = (s / segments) * Math.PI * 2;
      const a1 = ((s + 0.62 + patch * 0.64) / segments) * Math.PI * 2;
      const mid = (a0 + a1) * 0.5;
      const width = 0.12 + hash01(s * 4.9) * 0.18;
      const inset0 = 0.03 + hash01(s * 2.2) * 0.06;
      const inset1 = 0.03 + hash01(s * 3.3) * 0.08;
      const outer0 = shorelineModel.radiusAt(a0) - inset0;
      const outerMid = shorelineModel.radiusAt(mid) - 0.04;
      const outer1 = shorelineModel.radiusAt(a1) - inset1;
      const inner0 = outer0 - width * (0.70 + hash01(s * 7.2) * 0.28);
      const innerMid = outerMid - width;
      const inner1 = outer1 - width * (0.68 + hash01(s * 9.2) * 0.30);
      const y0 = terrainHeight(a0, 0.96, Math.cos(a0) * outer0, Math.sin(a0) * outer0) + ISLAND_OFFSET_Y + 0.012;
      const yMid = terrainHeight(mid, 0.94, Math.cos(mid) * outerMid, Math.sin(mid) * outerMid) + ISLAND_OFFSET_Y + 0.014;
      const y1 = terrainHeight(a1, 0.96, Math.cos(a1) * outer1, Math.sin(a1) * outer1) + ISLAND_OFFSET_Y + 0.012;
      const color = blendColor(colors.shoreWet, colors.wetRock, patch * 0.36);
      const p0 = v3(Math.cos(a0) * outer0, y0, Math.sin(a0) * outer0);
      const pMidOuter = v3(Math.cos(mid) * outerMid, yMid, Math.sin(mid) * outerMid);
      const p1 = v3(Math.cos(a1) * outer1, y1, Math.sin(a1) * outer1);
      const p2 = v3(Math.cos(a1) * inner1, y1 + 0.006, Math.sin(a1) * inner1);
      const pMidInner = v3(Math.cos(mid) * innerMid, yMid + 0.006, Math.sin(mid) * innerMid);
      const p3 = v3(Math.cos(a0) * inner0, y0 + 0.006, Math.sin(a0) * inner0);
      pushQuad(mesh, p0, pMidOuter, pMidInner, p3, color, v3(0, 1, 0));
      pushQuad(mesh, pMidOuter, p1, p2, pMidInner, color, v3(0, 1, 0));
    }
    return createMesh(mesh.vertices);
  }

  const colors = {
    grass: [0.175, 0.345, 0.145],
    grassDeep: [0.095, 0.230, 0.105],
    grassLit: [0.335, 0.520, 0.215],
    moss: [0.190, 0.330, 0.135],
    mossBlue: [0.135, 0.275, 0.210],
    dirt: [0.330, 0.215, 0.125],
    dirtLight: [0.430, 0.315, 0.185],
    dirtDry: [0.365, 0.255, 0.145],
    dirtWet: [0.150, 0.125, 0.090],
    path: [0.295, 0.195, 0.110],
    shoreWet: [0.095, 0.120, 0.118],
    cliffDirt: [0.220, 0.155, 0.105],
    cliffRock: [0.245, 0.260, 0.335],
    wetRock: [0.120, 0.145, 0.175],
    stonePatch: [0.250, 0.270, 0.235],
    underside: [0.055, 0.066, 0.092],
    rock: [0.315, 0.320, 0.410],
    pebble: [0.370, 0.375, 0.435],
    waterNear: [0.025, 0.135, 0.220],
    waterFar: [0.012, 0.055, 0.118],
    foam: [0.58, 0.78, 0.88],
    wood: [0.405, 0.225, 0.105],
    woodWarm: [0.560, 0.330, 0.135],
    woodDark: [0.235, 0.125, 0.070],
    bark: [0.375, 0.200, 0.095],
    barkLight: [0.590, 0.335, 0.155],
    paper: [0.92, 0.78, 0.55],
    paperLight: [0.98, 0.88, 0.64],
    receiptInk: [0.34, 0.22, 0.19],
    approval: [0.35, 0.85, 0.58],
    logBook: [0.32, 0.23, 0.18],
    mat: [0.300, 0.170, 0.095],
    cup: [0.520, 0.455, 0.335],
    toolMetal: [0.56, 0.58, 0.60],
    coal: [0.08, 0.07, 0.06],
    ember: [0.95, 0.23, 0.05],
    flame: [1.00, 0.30, 0.05],
    flameHot: [1.00, 0.82, 0.20],
    lanternFrame: [0.185, 0.120, 0.075],
    lanternGlow: [1.00, 0.70, 0.22],
    campGlow: [1.000, 0.470, 0.135],
    bubble: [0.720, 0.860, 0.940],
    bubbleCore: [1.000, 0.575, 0.205],
    bubbleGlint: [1.000, 0.965, 0.820],
    cheek: [0.950, 0.435, 0.330],
    faceInk: [0.008, 0.012, 0.018],
    faceMark: [1.00, 0.740, 0.300],
    leaf: [0.200, 0.390, 0.165],
    leafDark: [0.095, 0.230, 0.105],
    leafLit: [0.410, 0.580, 0.235],
    leafMoon: [0.155, 0.335, 0.295],
    leafFire: [0.485, 0.445, 0.185],
    leafHaze: [0.115, 0.245, 0.230],
    barkHaze: [0.245, 0.185, 0.125],
    flowerBlue: [0.205, 0.310, 0.720],
    flowerViolet: [0.430, 0.300, 0.680],
    flowerMoon: [0.660, 0.760, 0.820],
    flowerWarm: [0.920, 0.670, 0.230],
    mushroomCap: [0.560, 0.285, 0.185],
    mushroomStem: [0.760, 0.680, 0.520],
    root: [0.220, 0.115, 0.060],
    string: [0.58, 0.43, 0.28],
    physicsDebug: [0.30, 0.68, 0.95],
    starCool: [0.62, 0.74, 1.00],
    starWarm: [1.00, 0.86, 0.58],
    starDim: [0.44, 0.55, 0.82],
    hazeBlue: [0.060, 0.130, 0.235],
    hazePurple: [0.105, 0.090, 0.185],
    moon: [0.840, 0.900, 1.000],
    moonHalo: [0.220, 0.425, 0.700],
    moonReflection: [0.390, 0.590, 0.800]
  };

  function terrainTopColor(angle, radial, x, z, variation) {
    const patch = patchNoise2d(x, z, 3.8, 8.0);
    const broadPatch = patchNoise2d(x, z, 8.4, 12.0);
    const softPatch = valueNoise2d(x, z, 6.6, 18.0);
    const moonFern = ovalMask(x, z, -5.4, 4.2, 12.0, 4.2, 0.40, 0.58);
    const fireMeadow = ovalMask(x, z, 1.8, -2.1, 6.4, 2.8, -0.52, 0.50);
    const dryRidge = ovalMask(x, z, 5.0, 1.2, 8.2, 2.9, 0.26, 0.48);
    const warmClearing = campClearingMask(x, z);
    let color = blendColor(colors.grassLit, colors.grass, smoothstep(0.12, 0.52, radial));
    color = blendColor(color, colors.moss, smoothstep(0.36, 0.82, radial) * (0.20 + broadPatch * 0.16));
    color = blendColor(color, colors.mossBlue, clamp(smoothstep(0.50, 0.92, radial) * 0.18 + moonFern * 0.16, 0, 0.36));
    color = blendColor(color, colors.grassLit, fireMeadow * 0.10);
    color = blendColor(color, colors.dirtDry, clamp(smoothstep(0.80, 1.0, radial) * 0.18 + dryRidge * 0.14, 0, 0.32));

    const campStone = 1 - smoothstep(0.18, 0.78, Math.hypot(x - 0.86, z + 0.14));
    const benchScuff = 1 - smoothstep(0.14, 0.72, Math.hypot(x + 1.85, z + 1.15));
    const workPath = distanceToSegment2d(x, z, -1.85, -1.15, 0.86, -0.14);
    const centerPath = distanceToSegment2d(x, z, -0.20, 0.10, -0.96, 1.84);
    const pathMask = Math.max(1 - smoothstep(0.12, 0.38, workPath), 1 - smoothstep(0.10, 0.34, centerPath));
    const clearingDirt = clamp(warmClearing * 0.26 + pathMask * 0.34 + benchScuff * 0.20 + campStone * 0.18, 0, 0.58);
    color = blendColor(color, colors.dirtLight, warmClearing * 0.18);
    color = blendColor(color, colors.path, clearingDirt);
    color = blendColor(color, colors.stonePatch, clamp(campStone * 0.34 + benchScuff * 0.12, 0, 0.42));

    const mossMask = radial > 0.24 && radial < 0.86 && softPatch > 0.52 ? (softPatch - 0.52) / 0.48 : 0;
    color = blendColor(color, patch > 0.80 ? colors.mossBlue : colors.grassDeep, mossMask * 0.12);
    color = blendColor(color, colors.shoreWet, smoothstep(0.86, 1.0, radial) * 0.24);
    return scaleColor(color, 0.92 + variation * 0.06);
  }

  function cliffLayerPoint(angle, layer) {
    if (layer === 0) return terrainPoint(1, angle);
    const shore = islandShoreRadius(angle);
    const rough = hash01(Math.floor((angle + Math.PI) * 19.0) + layer * 97.0) - 0.5;
    const wave = Math.sin(angle * (2.8 + layer) + layer * 1.7) * 0.035;
    const layerData = [
      null,
      { scale: 0.985, offset: -0.02, y: 0.02, jitter: 0.08 },
      { scale: 0.905, offset: -0.03, y: -0.30, jitter: 0.13 },
      { scale: 0.720, offset: 0.02, y: -0.76, jitter: 0.18 }
    ][layer];
    const radius = shore * layerData.scale + layerData.offset + rough * layerData.jitter + wave;
    const y = layerData.y + rough * 0.055 + Math.sin(angle * 5.0 + layer) * 0.025;
    return v3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  }

  function cliffColor(layer, angle, variation) {
    if (layer === 0) {
      return scaleColor(blendColor(colors.cliffDirt, colors.dirtWet, 0.36 + variation * 0.22), 0.86 + variation * 0.18);
    }
    if (layer === 1) {
      const rockMix = 0.34 + hash01(angle * 11.3 + layer * 23.0) * 0.42;
      return scaleColor(blendColor(colors.cliffDirt, colors.cliffRock, rockMix), 0.82 + variation * 0.18);
    }
    const wetMix = 0.42 + hash01(angle * 17.5 + layer * 31.0) * 0.36;
    return scaleColor(blendColor(colors.wetRock, colors.underside, wetMix), 0.78 + variation * 0.16);
  }

  function createIslandTerrain() {
    const mesh = { vertices: [] };
    const segments = 108;
    const topRings = [0.045, 0.10, 0.18, 0.28, 0.40, 0.52, 0.64, 0.75, 0.85, 0.93, 1.0];
    function terrainRingPoint(ringIndex, segmentIndex) {
      const radialBase = topRings[ringIndex];
      const wrapped = ((segmentIndex % segments) + segments) % segments;
      const ringBlend = smoothstep(0.08, 0.92, radialBase);
      const angleJitter =
        Math.sin(ringIndex * 1.71 + 0.4) * 0.016 +
        (hash01(ringIndex * 131.0 + wrapped * 17.0) - 0.5) * 0.032 * ringBlend;
      const radialJitter = radialBase < 1
        ? (hash01(ringIndex * 97.0 + wrapped * 23.0 + 4.0) - 0.5) * 0.022 * ringBlend
        : 0;
      const angle = (wrapped / segments) * Math.PI * 2 + angleJitter;
      return terrainPoint(clamp(radialBase + radialJitter, 0.02, 1.0), angle);
    }
    const centerPoint = terrainPoint(0, 0);
    for (let s = 0; s < segments; s += 1) {
      const p0 = terrainRingPoint(0, s);
      const p1 = terrainRingPoint(0, s + 1);
      const midX = (centerPoint[0] + p0[0] + p1[0]) / 3;
      const midZ = (centerPoint[2] + p0[2] + p1[2]) / 3;
      const color = terrainTopColor(Math.atan2(midZ, midX), 0.025, midX, midZ, hash01(s * 11.0));
      pushTriangle(mesh, centerPoint, p1, p0, color);
    }
    for (let r = 0; r < topRings.length - 1; r += 1) {
      const radial0 = topRings[r];
      const radial1 = topRings[r + 1];
      for (let s = 0; s < segments; s += 1) {
        const p00 = terrainRingPoint(r, s);
        const p01 = terrainRingPoint(r, s + 1);
        const p10 = terrainRingPoint(r + 1, s);
        const p11 = terrainRingPoint(r + 1, s + 1);
        const midRadial = (radial0 + radial1) * 0.5;
        const midX = (p00[0] + p01[0] + p10[0] + p11[0]) * 0.25;
        const midZ = (p00[2] + p01[2] + p10[2] + p11[2]) * 0.25;
        const midAngle = Math.atan2(midZ, midX);
        const color = terrainTopColor(midAngle, midRadial, midX, midZ, hash01(r * 83.0 + s * 7.0));
        pushQuad(mesh, p00, p01, p11, p10, color);
      }
    }

    const cliffLayers = 4;
    for (let layer = 0; layer < cliffLayers - 1; layer += 1) {
      for (let s = 0; s < segments; s += 1) {
        const a0 = (s / segments) * Math.PI * 2;
        const a1 = ((s + 1) / segments) * Math.PI * 2;
        const upper0 = cliffLayerPoint(a0, layer);
        const upper1 = cliffLayerPoint(a1, layer);
        const lower0 = cliffLayerPoint(a0, layer + 1);
        const lower1 = cliffLayerPoint(a1, layer + 1);
        const color = cliffColor(layer, (a0 + a1) * 0.5, hash01(layer * 101.0 + s * 13.0));
        pushQuad(mesh, lower0, upper0, upper1, lower1, color);
      }
    }

    const bottomCenter = v3(0, -0.82, 0);
    for (let s = 0; s < segments; s += 1) {
      const a0 = (s / segments) * Math.PI * 2;
      const a1 = ((s + 1) / segments) * Math.PI * 2;
      const bottom0 = cliffLayerPoint(a0, cliffLayers - 1);
      const bottom1 = cliffLayerPoint(a1, cliffLayers - 1);
      const color = scaleColor(colors.underside, 0.82 + hash01(s * 9.0) * 0.12);
      pushTriangle(mesh, bottomCenter, bottom0, bottom1, color);
    }
    return createMesh(mesh.vertices);
  }

  function roughBoulder(radius, stacks, slices, colorA, colorB) {
    const mesh = { vertices: [] };
    const points = [];
    for (let y = 0; y <= stacks; y += 1) {
      const row = [];
      const v = y / stacks;
      const polar = v * Math.PI;
      for (let x = 0; x < slices; x += 1) {
        const u = x / slices;
        const theta = u * Math.PI * 2;
        const cap = y === 0 || y === stacks;
        const lump = cap ? 1 : 0.86 + hash01(x * 19.0 + y * 31.0) * 0.26;
        row.push(v3(
          Math.sin(polar) * Math.cos(theta) * radius * lump,
          Math.cos(polar) * radius * (0.78 + (cap ? 0 : hash01(x * 7.0 + y * 11.0) * 0.18)),
          Math.sin(polar) * Math.sin(theta) * radius * (0.86 + hash01(x * 13.0 + y * 17.0) * 0.20)
        ));
      }
      points.push(row);
    }
    for (let y = 0; y < stacks; y += 1) {
      for (let x = 0; x < slices; x += 1) {
        const next = (x + 1) % slices;
        const a = points[y][x];
        const b = points[y + 1][x];
        const c = points[y + 1][next];
        const d = points[y][next];
        const color = blendColor(colorA, colorB, hash01(y * 23.0 + x * 5.0));
        pushTriangle(mesh, a, b, c, color);
        pushTriangle(mesh, a, c, d, color);
      }
    }
    return createMesh(mesh.vertices);
  }

  function pushSkyQuad(mesh, center, tangent, up, halfWidth, halfHeight, color, normal) {
    const p0 = v3(
      center[0] - tangent[0] * halfWidth - up[0] * halfHeight,
      center[1] - tangent[1] * halfWidth - up[1] * halfHeight,
      center[2] - tangent[2] * halfWidth - up[2] * halfHeight
    );
    const p1 = v3(
      center[0] + tangent[0] * halfWidth - up[0] * halfHeight,
      center[1] + tangent[1] * halfWidth - up[1] * halfHeight,
      center[2] + tangent[2] * halfWidth - up[2] * halfHeight
    );
    const p2 = v3(
      center[0] + tangent[0] * halfWidth + up[0] * halfHeight,
      center[1] + tangent[1] * halfWidth + up[1] * halfHeight,
      center[2] + tangent[2] * halfWidth + up[2] * halfHeight
    );
    const p3 = v3(
      center[0] - tangent[0] * halfWidth + up[0] * halfHeight,
      center[1] - tangent[1] * halfWidth + up[1] * halfHeight,
      center[2] - tangent[2] * halfWidth + up[2] * halfHeight
    );
    pushQuad(mesh, p0, p1, p2, p3, color, normal);
  }

  function createStarField(count) {
    const mesh = { vertices: [] };
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i += 1) {
      const spread = hash01(i * 23.71);
      const angle = (i * goldenAngle + (hash01(i * 5.13) - 0.5) * 0.24) % (Math.PI * 2);
      const radius = 120.0 + hash01(i * 3.91) * 52.0;
      const y = 8.0 + Math.pow(hash01(i * 7.41), 1.18) * 38.0;
      const outward = v3(Math.cos(angle), 0, Math.sin(angle));
      const tangent = v3(-Math.sin(angle), 0, Math.cos(angle));
      const up = v3(0, 1, 0);
      const center = v3(outward[0] * radius, y, outward[2] * radius);
      const normal = v3(-outward[0], 0, -outward[2]);
      const size = 0.18 + Math.pow(hash01(i * 11.17), 2.0) * 0.72;
      const color = scaleColor(
        blendColor(
          blendColor(colors.starDim, colors.starCool, hash01(i * 2.77)),
          colors.starWarm,
          Math.pow(hash01(i * 13.23), 3.2) * 0.70
        ),
        0.74 + spread * 0.38
      );

      if (spread > 0.72) {
        pushSkyQuad(mesh, center, tangent, up, size * 1.70, size * 0.25, color, normal);
        pushSkyQuad(mesh, center, tangent, up, size * 0.25, size * 1.70, color, normal);
      } else {
        pushSkyQuad(mesh, center, tangent, up, size, size, color, normal);
      }
    }
    return createMesh(mesh.vertices);
  }

  function createHorizonHaze(segments, bands) {
    const mesh = { vertices: [] };
    const radius = 148.0;
    const bottom = -0.72;
    const top = 20.0;
    for (let band = 0; band < bands; band += 1) {
      const y0 = bottom + ((top - bottom) * band) / bands;
      const y1 = bottom + ((top - bottom) * (band + 1)) / bands;
      for (let s = 0; s < segments; s += 1) {
        const a0 = (s / segments) * Math.PI * 2;
        const a1 = ((s + 1) / segments) * Math.PI * 2;
        const colorMix = 0.35 + 0.30 * Math.sin((a0 + a1) * 0.5 * 2.0 + band * 0.8);
        const bandFade = 1 - band / Math.max(1, bands - 1);
        const color = scaleColor(blendColor(colors.hazeBlue, colors.hazePurple, colorMix), 0.74 + bandFade * 0.42);
        const p0 = v3(Math.cos(a0) * radius, y0, Math.sin(a0) * radius);
        const p1 = v3(Math.cos(a1) * radius, y0, Math.sin(a1) * radius);
        const p2 = v3(Math.cos(a1) * radius, y1, Math.sin(a1) * radius);
        const p3 = v3(Math.cos(a0) * radius, y1, Math.sin(a0) * radius);
        const normal = normalize(v3(-Math.cos((a0 + a1) * 0.5), 0, -Math.sin((a0 + a1) * 0.5)));
        pushQuad(mesh, p0, p1, p2, p3, color, normal);
      }
    }
    return createMesh(mesh.vertices);
  }

  const ISLAND_OFFSET_Y = terrainConfig.islandOffsetY;

  function createDisk(radius, segments, innerColor, outerColor) {
    const mesh = { vertices: [] };
    const center = v3(0, 0, 0);
    for (let i = 0; i < segments; i += 1) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      const edge0 = v3(Math.cos(a0) * radius, Math.sin(a0) * radius, 0);
      const edge1 = v3(Math.cos(a1) * radius, Math.sin(a1) * radius, 0);
      const color = blendColor(innerColor, outerColor, 0.46 + hash01(i * 5.7) * 0.38);
      pushTriangle(mesh, center, edge0, edge1, color, v3(0, 0, 1));
    }
    return createMesh(mesh.vertices);
  }

  function pushGroundPatch(mesh, x, z, width, depth, yaw, color, lift) {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const hx = width / 2;
    const hz = depth / 2;
    const corners = [
      [-hx, -hz],
      [hx * (0.84 + hash01(x * 1.7 + z * 2.1) * 0.28), -hz],
      [hx, hz * (0.86 + hash01(x * 2.9 - z * 1.3) * 0.26)],
      [-hx * (0.82 + hash01(x * 3.4 + z * 0.8) * 0.30), hz]
    ].map((point, index) => {
      const px = x + point[0] * c + point[1] * s;
      const pz = z - point[0] * s + point[1] * c;
      return v3(px, groundHeightAt(px, pz) + (lift || 0.018) + index * 0.0007, pz);
    });
    pushQuad(mesh, corners[0], corners[1], corners[2], corners[3], color, v3(0, 1, 0));
  }

  function pushGrassBlade(mesh, x, z, yaw, height, width, color, seed) {
    const sideYaw = yaw + Math.PI / 2;
    const lean = 0.04 + hash01(seed + 8.0) * 0.12;
    const baseY = groundHeightAt(x, z) + 0.022;
    const left = v3(x + Math.cos(sideYaw) * width, baseY, z + Math.sin(sideYaw) * width);
    const right = v3(x - Math.cos(sideYaw) * width, baseY, z - Math.sin(sideYaw) * width);
    const top = v3(
      x + Math.cos(yaw) * lean,
      baseY + height,
      z + Math.sin(yaw) * lean
    );
    pushTriangle(mesh, left, right, top, color);
  }

  function pushFlower(mesh, x, z, color, seed) {
    const ground = groundHeightAt(x, z);
    const stemHeight = 0.08 + hash01(seed + 0.2) * 0.06;
    const stemTop = v3(x, ground + stemHeight, z);
    pushTriangle(
      mesh,
      v3(x - 0.010, ground + 0.020, z),
      v3(x + 0.010, ground + 0.020, z),
      stemTop,
      scaleColor(colors.grassLit, 0.72)
    );
    for (let petal = 0; petal < 3; petal += 1) {
      const angle = seed * 0.37 + petal * 2.09;
      const side = angle + Math.PI / 2;
      const radius = 0.035 + hash01(seed + petal) * 0.012;
      const outer = v3(
        x + Math.cos(angle) * radius,
        ground + stemHeight + 0.016,
        z + Math.sin(angle) * radius
      );
      const left = v3(
        x + Math.cos(side) * radius * 0.42,
        ground + stemHeight,
        z + Math.sin(side) * radius * 0.42
      );
      const right = v3(
        x - Math.cos(side) * radius * 0.42,
        ground + stemHeight,
        z - Math.sin(side) * radius * 0.42
      );
      pushTriangle(mesh, left, right, outer, color);
    }
  }

  function pushShrub(mesh, x, z, yaw, size, seed) {
    const ground = groundHeightAt(x, z);
    const clumps = 3 + Math.floor(hash01(seed + 0.4) * 3);
    for (let i = 0; i < clumps; i += 1) {
      const angle = yaw + (i / clumps) * Math.PI * 2 + hash01(seed + i) * 0.62;
      const radius = size * (0.08 + hash01(seed + i * 2.0) * 0.16);
      const cx = x + Math.cos(angle) * radius;
      const cz = z + Math.sin(angle) * radius;
      const baseY = groundHeightAt(cx, cz) + 0.020;
      const width = size * (0.10 + hash01(seed + i * 3.0) * 0.08);
      const height = size * (0.20 + hash01(seed + i * 4.0) * 0.16);
      const side = angle + Math.PI / 2;
      const color = scaleColor(
        blendColor(colors.grassDeep, colors.mossBlue, hash01(seed + i * 5.0) * 0.58),
        0.80 + hash01(seed + i * 6.0) * 0.18
      );
      pushTriangle(
        mesh,
        v3(cx + Math.cos(side) * width, baseY, cz + Math.sin(side) * width),
        v3(cx - Math.cos(side) * width, baseY, cz - Math.sin(side) * width),
        v3(cx + Math.cos(angle) * width * 0.32, baseY + height, cz + Math.sin(angle) * width * 0.32),
        color
      );
    }
  }

  function pushTwig(mesh, x, z, yaw, length, width, color) {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const side = yaw + Math.PI / 2;
    const sc = Math.cos(side) * width;
    const ss = Math.sin(side) * width;
    const half = length / 2;
    const p0 = v3(x - c * half - sc, groundHeightAt(x - c * half, z - s * half) + 0.035, z - s * half - ss);
    const p1 = v3(x + c * half - sc, groundHeightAt(x + c * half, z + s * half) + 0.037, z + s * half - ss);
    const p2 = v3(x + c * half + sc, groundHeightAt(x + c * half, z + s * half) + 0.039, z + s * half + ss);
    const p3 = v3(x - c * half + sc, groundHeightAt(x - c * half, z - s * half) + 0.036, z - s * half + ss);
    pushQuad(mesh, p0, p1, p2, p3, color, v3(0, 1, 0));
  }

  function pushMushroom(mesh, x, z, yaw, size, seed) {
    const ground = groundHeightAt(x, z);
    const stem = scaleColor(colors.mushroomStem, 0.72 + hash01(seed + 1.0) * 0.16);
    const cap = scaleColor(colors.mushroomCap, 0.70 + hash01(seed + 2.0) * 0.22);
    pushTriangle(
      mesh,
      v3(x - Math.cos(yaw + Math.PI / 2) * size * 0.025, ground + 0.026, z - Math.sin(yaw + Math.PI / 2) * size * 0.025),
      v3(x + Math.cos(yaw + Math.PI / 2) * size * 0.025, ground + 0.026, z + Math.sin(yaw + Math.PI / 2) * size * 0.025),
      v3(x, ground + size * 0.13, z),
      stem
    );
    pushTriangle(
      mesh,
      v3(x - Math.cos(yaw + Math.PI / 2) * size * 0.090, ground + size * 0.12, z - Math.sin(yaw + Math.PI / 2) * size * 0.090),
      v3(x + Math.cos(yaw + Math.PI / 2) * size * 0.090, ground + size * 0.12, z + Math.sin(yaw + Math.PI / 2) * size * 0.090),
      v3(x + Math.cos(yaw) * size * 0.025, ground + size * 0.21, z + Math.sin(yaw) * size * 0.025),
      cap
    );
  }

  function createGroundDetailMesh() {
    const mesh = { vertices: [] };
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < 52; i += 1) {
      const seed = i * 7.91 + 5.0;
      const angle = i * 1.21 + hash01(seed) * 0.55;
      const radius = 0.86 + Math.pow(hash01(seed + 1.0), 0.72) * 5.3;
      const x = 0.18 + Math.cos(angle) * radius * (0.86 + hash01(seed + 2.0) * 0.44);
      const z = -0.24 + Math.sin(angle) * radius * (0.56 + hash01(seed + 3.0) * 0.44);
      if (Math.hypot(x - 0.80, z + 0.20) < 0.82 || Math.hypot(x + 1.72, z + 1.03) < 0.64) continue;
      const warmScuff = 1 - smoothstep(1.4, 4.6, Math.hypot(x - 0.80, z + 0.20));
      const color = scaleColor(
        blendColor(
          blendColor(colors.grassDeep, colors.moss, hash01(seed + 4.0) * 0.55),
          colors.dirt,
          warmScuff * 0.34
        ),
        0.70 + hash01(seed + 5.0) * 0.12
      );
      pushGroundPatch(
        mesh,
        x,
        z,
        0.82 + hash01(seed + 6.0) * 1.92,
        0.42 + hash01(seed + 7.0) * 1.16,
        angle + hash01(seed + 8.0) * Math.PI,
        color,
        0.030
      );
    }

    for (let i = 0; i < 118; i += 1) {
      const seed = i * 13.73 + 19.0;
      const angle = i * goldenAngle + (hash01(seed) - 0.5) * 0.26;
      const radial = 0.07 + Math.pow(hash01(seed + 1.0), 0.82) * 0.68;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 4.2, (hash01(seed + 3.0) - 0.5) * 0.045);
      const x = place[0];
      const z = place[2];
      if (!shorelineModel.containsPoint(x, z, 2.0)) continue;
      if (Math.hypot(x - 0.80, z + 0.20) < 0.92 || Math.hypot(x + 1.72, z + 1.03) < 0.80) continue;
      const campBias = 1 - smoothstep(2.0, 8.0, Math.hypot(x - 0.2, z + 0.1));
      const mossMix = hash01(seed + 5.0);
      const base = mossMix > 0.58 ? colors.mossBlue : colors.grassDeep;
      const color = scaleColor(
        blendColor(base, campBias > 0.45 ? colors.grassLit : colors.moss, 0.22 + hash01(seed + 6.0) * 0.34),
        0.72 + hash01(seed + 7.0) * 0.18
      );
      pushGroundPatch(
        mesh,
        x,
        z,
        0.52 + hash01(seed + 8.0) * 1.24,
        0.26 + hash01(seed + 9.0) * 0.68,
        angle + hash01(seed + 10.0) * Math.PI,
        color,
        0.020
      );
    }

    for (let i = 0; i < 176; i += 1) {
      const seed = i * 17.91 + 101.0;
      const angle = i * goldenAngle + (hash01(seed) - 0.5) * 0.42;
      const radial = 0.06 + Math.pow(hash01(seed + 1.0), 1.18) * 0.70;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 4.8, (hash01(seed + 3.0) - 0.5) * 0.035);
      const x = place[0];
      const z = place[2];
      if (!shorelineModel.containsPoint(x, z, 1.8)) continue;
      if (Math.hypot(x - 0.80, z + 0.20) < 0.80 || Math.hypot(x + 1.72, z + 1.03) < 0.72) continue;
      const bladeCount = 3 + Math.floor(hash01(seed + 4.0) * 3);
      for (let blade = 0; blade < bladeCount; blade += 1) {
        const bladeSeed = seed + blade * 3.3;
        const offsetYaw = hash01(bladeSeed + 0.7) * Math.PI * 2;
        const offset = hash01(bladeSeed + 1.2) * 0.12;
        const bladeX = x + Math.cos(offsetYaw) * offset;
        const bladeZ = z + Math.sin(offsetYaw) * offset;
        const color = scaleColor(
          blendColor(colors.grassDeep, colors.grassLit, hash01(bladeSeed + 2.0) * 0.55),
          0.64 + hash01(bladeSeed + 3.0) * 0.22
        );
        pushGrassBlade(
          mesh,
          bladeX,
          bladeZ,
          offsetYaw + hash01(bladeSeed + 4.0) * 1.4,
          0.12 + hash01(bladeSeed + 5.0) * 0.18,
          0.010 + hash01(bladeSeed + 6.0) * 0.012,
          color,
          bladeSeed
        );
      }
    }

    for (let i = 0; i < 54; i += 1) {
      const seed = i * 31.41 + 7.0;
      const angle = i * 1.91 + (hash01(seed) - 0.5) * 0.50;
      const radial = 0.08 + hash01(seed + 1.0) * 0.64;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 5.0, 0);
      const x = place[0];
      const z = place[2];
      if (!shorelineModel.containsPoint(x, z, 2.0) || nearMainCamp(x, z, 1.55)) continue;
      const palette = [colors.flowerBlue, colors.flowerViolet, colors.flowerMoon, colors.flowerWarm];
      const flowerColor = palette[Math.floor(hash01(seed + 3.0) * palette.length)];
      const cluster = 2 + Math.floor(hash01(seed + 4.0) * 4);
      for (let bloom = 0; bloom < cluster; bloom += 1) {
        const bloomSeed = seed + bloom * 2.7;
        const offsetYaw = hash01(bloomSeed + 0.6) * Math.PI * 2;
        const offset = 0.04 + hash01(bloomSeed + 1.4) * 0.20;
        pushFlower(
          mesh,
          x + Math.cos(offsetYaw) * offset,
          z + Math.sin(offsetYaw) * offset,
          scaleColor(flowerColor, 0.70 + hash01(bloomSeed + 2.2) * 0.28),
          bloomSeed
        );
      }
    }

    for (let i = 0; i < 70; i += 1) {
      const seed = i * 11.83 + 221.0;
      const angle = i * 2.37 + hash01(seed) * 0.35;
      const radial = 0.05 + hash01(seed + 1.0) * 0.44;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 3.4, 0);
      const x = place[0];
      const z = place[2];
      if (Math.hypot(x - 0.80, z + 0.20) < 0.80) continue;
      pushGroundPatch(
        mesh,
        x,
        z,
        0.08 + hash01(seed + 3.0) * 0.10,
        0.05 + hash01(seed + 4.0) * 0.08,
        angle,
        scaleColor(blendColor(colors.pebble, colors.rock, hash01(seed + 5.0)), 0.70),
        0.032
      );
    }

    for (let i = 0; i < 62; i += 1) {
      const seed = i * 21.67 + 377.0;
      const angle = i * goldenAngle + (hash01(seed) - 0.5) * 0.72;
      const radial = 0.06 + Math.pow(hash01(seed + 1.0), 1.34) * 0.62;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 4.4, 0);
      const x = place[0];
      const z = place[2];
      if (!shorelineModel.containsPoint(x, z, 2.0)) continue;
      if (Math.hypot(x - 0.80, z + 0.20) < 0.72) continue;
      pushShrub(mesh, x, z, angle + hash01(seed + 3.0) * Math.PI, 0.78 + hash01(seed + 4.0) * 0.72, seed);
    }

    for (let i = 0; i < 52; i += 1) {
      const seed = i * 16.43 + 811.0;
      const angle = i * 2.11 + hash01(seed) * 0.65;
      const radial = 0.05 + hash01(seed + 1.0) * 0.52;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 3.6, 0);
      const x = place[0];
      const z = place[2];
      if (!shorelineModel.containsPoint(x, z, 1.8) || nearMainCamp(x, z, 1.18)) continue;
      if (hash01(seed + 3.0) > 0.46) {
        pushTwig(
          mesh,
          x,
          z,
          angle + hash01(seed + 4.0) * Math.PI,
          0.22 + hash01(seed + 5.0) * 0.38,
          0.010 + hash01(seed + 6.0) * 0.015,
          scaleColor(colors.root, 0.76 + hash01(seed + 7.0) * 0.20)
        );
      } else {
        const count = 1 + Math.floor(hash01(seed + 8.0) * 3);
        for (let m = 0; m < count; m += 1) {
          const mSeed = seed + m * 5.9;
          const offsetAngle = hash01(mSeed + 1.0) * Math.PI * 2;
          const offset = hash01(mSeed + 2.0) * 0.20;
          pushMushroom(
            mesh,
            x + Math.cos(offsetAngle) * offset,
            z + Math.sin(offsetAngle) * offset,
            offsetAngle,
            0.66 + hash01(mSeed + 3.0) * 0.48,
            mSeed
          );
        }
      }
    }

    const clearingEdgeTufts = [
      [-3.18, -1.70, -0.36, 701.0],
      [-2.42, 1.36, 0.82, 712.0],
      [2.86, 1.18, 2.46, 723.0],
      [3.28, -1.52, -1.05, 734.0],
      [-0.58, -2.54, -0.80, 745.0],
      [0.30, 2.24, 1.70, 756.0]
    ];
    for (const tuft of clearingEdgeTufts) {
      const [x, z, yaw, seed] = tuft;
      pushShrub(mesh, x, z, yaw, 0.72, seed);
      for (let blade = 0; blade < 7; blade += 1) {
        const bladeSeed = seed + blade * 2.9;
        const bladeYaw = yaw + (hash01(bladeSeed) - 0.5) * 1.6;
        const offset = 0.08 + hash01(bladeSeed + 1.0) * 0.38;
        const bx = x + Math.cos(bladeYaw) * offset;
        const bz = z + Math.sin(bladeYaw) * offset;
        pushGrassBlade(
          mesh,
          bx,
          bz,
          bladeYaw,
          0.18 + hash01(bladeSeed + 2.0) * 0.20,
          0.012 + hash01(bladeSeed + 3.0) * 0.012,
          scaleColor(blendColor(colors.grass, colors.grassLit, hash01(bladeSeed + 4.0)), 0.82),
          bladeSeed
        );
      }
    }

    const campFlowers = [
      [-2.78, -1.28, colors.flowerWarm, 802.0],
      [-2.18, 1.02, colors.flowerMoon, 813.0],
      [2.42, 1.42, colors.flowerBlue, 824.0],
      [2.84, -1.10, colors.flowerWarm, 835.0],
      [-0.72, -2.22, colors.flowerViolet, 846.0],
      [0.86, 2.02, colors.flowerMoon, 857.0]
    ];
    for (const bloom of campFlowers) {
      const [x, z, color, seed] = bloom;
      for (let i = 0; i < 4; i += 1) {
        const flowerSeed = seed + i * 3.1;
        const angle = hash01(flowerSeed) * Math.PI * 2;
        const radius = hash01(flowerSeed + 1.0) * 0.28;
        pushFlower(
          mesh,
          x + Math.cos(angle) * radius,
          z + Math.sin(angle) * radius,
          scaleColor(color, 0.86 + hash01(flowerSeed + 2.0) * 0.18),
          flowerSeed
        );
      }
    }

    return createMesh(mesh.vertices);
  }

  function createCampClearingMesh() {
    const mesh = { vertices: [] };
    const center = [0.22, -0.24];
    const segments = 56;
    const rings = [0, 0.34, 0.72, 1.16, 1.72, 2.34, 3.10, 4.02, 5.08];

    function clearingAngle(ring, segment) {
      const wrapped = ((segment % segments) + segments) % segments;
      if (ring === 0) return 0;
      return (wrapped / segments) * Math.PI * 2 +
        Math.sin(ring * 1.47 + 0.2) * 0.024 +
        (hash01(ring * 67.0 + wrapped * 13.0) - 0.5) * 0.040;
    }

    function point(radius, angle, ring, segment) {
      if (ring === 0) return v3(center[0], groundHeightAt(center[0], center[1]) + 0.036, center[1]);
      const notch = 1 - 0.22 * Math.exp(-Math.pow(angleDistance(angle, -2.35) / 0.42, 2));
      const lobe = 1 + 0.28 * Math.exp(-Math.pow(angleDistance(angle, 0.72) / 0.52, 2));
      const benchPull = 1 + 0.20 * Math.exp(-Math.pow(angleDistance(angle, -0.62) / 0.46, 2));
      const firePocket = 1 + 0.10 * Math.exp(-Math.pow(angleDistance(angle, 2.95) / 0.54, 2));
      const rough = 0.90 + hash01(ring * 41.0 + segment * 19.0) * 0.16;
      const naturalRadius = radius * rough * notch * lobe * benchPull;
      const ovalX = Math.cos(angle) * naturalRadius * 1.08 * firePocket;
      const ovalZ = Math.sin(angle) * naturalRadius * 0.78;
      const x = center[0] + ovalX;
      const z = center[1] + ovalZ;
      return v3(x, groundHeightAt(x, z) + 0.036 + ring * 0.0008, z);
    }

    function clearingColor(x, z, ring, segment) {
      const fire = 1 - smoothstep(0.45, 2.55, Math.hypot(x - 0.80, z + 0.20));
      const bench = 1 - smoothstep(0.38, 1.70, Math.hypot(x + 1.72, z + 1.03));
      const path = Math.max(
        1 - smoothstep(0.18, 0.54, distanceToSegment2d(x, z, -1.72, -1.03, 0.80, -0.20)),
        1 - smoothstep(0.16, 0.48, distanceToSegment2d(x, z, 0.12, -0.04, -0.96, 1.84))
      );
      const facet = hash01(ring * 37.0 + segment * 5.0);
      const grassBreak = 0.18 + 0.30 * Math.sin(x * 1.7 + z * 0.9 + facet * 5.0);
      let color = blendColor(colors.grassLit, colors.moss, 0.22 + facet * 0.18);
      color = blendColor(color, colors.grass, clamp(grassBreak, 0, 0.28));
      color = blendColor(color, colors.dirtLight, 0.10 + Math.min(0.28, ring * 0.035));
      color = blendColor(color, colors.dirtDry, clamp(fire * 0.36 + bench * 0.24 + path * 0.28, 0, 0.46));
      color = blendColor(color, colors.path, clamp(path * 0.24 + fire * 0.12, 0, 0.32));
      color = blendColor(color, colors.stonePatch, fire * 0.10);
      return scaleColor(color, 0.94 + facet * 0.06);
    }

    for (let r = 0; r < rings.length - 1; r += 1) {
      for (let s = 0; s < segments; s += 1) {
        const a00 = clearingAngle(r, s);
        const a01 = clearingAngle(r, s + 1);
        const a10 = clearingAngle(r + 1, s);
        const a11 = clearingAngle(r + 1, s + 1);
        const p00 = point(rings[r], a00, r, s);
        const p01 = point(rings[r], a01, r, s + 1);
        const p10 = point(rings[r + 1], a10, r + 1, s);
        const p11 = point(rings[r + 1], a11, r + 1, s + 1);
        const midX = (p00[0] + p01[0] + p10[0] + p11[0]) * 0.25;
        const midZ = (p00[2] + p01[2] + p10[2] + p11[2]) * 0.25;
        const color = clearingColor(midX, midZ, r, s);
        if (rings[r] === 0) {
          pushTriangle(mesh, p00, p11, p10, color, v3(0, 1, 0));
        } else {
          pushQuad(mesh, p00, p01, p11, p10, color, v3(0, 1, 0));
        }
      }
    }

    return createMesh(mesh.vertices);
  }

  function createTerrainVeilMesh() {
    const mesh = { vertices: [] };
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < 138; i += 1) {
      const seed = i * 10.37 + 1221.0;
      const angle = i * goldenAngle + (hash01(seed) - 0.5) * 0.60;
      const radial = 0.05 + Math.pow(hash01(seed + 1.0), 0.96) * 0.70;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 5.8, (hash01(seed + 3.0) - 0.5) * 0.05);
      const x = place[0];
      const z = place[2];
      if (!shorelineModel.containsPoint(x, z, 2.2)) continue;
      if (Math.hypot(x - 0.80, z + 0.20) < 0.78 || Math.hypot(x + 1.72, z + 1.03) < 0.66) continue;
      const camp = 1 - smoothstep(1.8, 8.4, Math.hypot(x - 0.20, z + 0.16));
      const moonSide = smoothstep(-4.0, 10.0, z);
      let color = blendColor(colors.grassDeep, colors.mossBlue, 0.26 + hash01(seed + 4.0) * 0.42);
      color = blendColor(color, colors.grassLit, camp * 0.14);
      color = blendColor(color, colors.moss, moonSide * 0.12);
      color = scaleColor(color, 0.70 + hash01(seed + 5.0) * 0.16);
      pushGroundPatch(
        mesh,
        x,
        z,
        1.15 + hash01(seed + 6.0) * 2.35,
        0.58 + hash01(seed + 7.0) * 1.36,
        angle + hash01(seed + 8.0) * Math.PI,
        color,
        0.026
      );
    }

    return createMesh(mesh.vertices);
  }

  function createGroundGlow(radius, segments, color) {
    const mesh = { vertices: [] };
    const center = v3(0, 0, 0);
    for (let i = 0; i < segments; i += 1) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      const wobble0 = 0.86 + hash01(i * 13.1) * 0.22;
      const wobble1 = 0.86 + hash01(i * 17.7) * 0.22;
      const edge0 = v3(Math.cos(a0) * radius * 1.32 * wobble0, 0, Math.sin(a0) * radius * 0.74 * wobble0);
      const edge1 = v3(Math.cos(a1) * radius * 1.32 * wobble1, 0, Math.sin(a1) * radius * 0.74 * wobble1);
      pushTriangle(mesh, center, edge0, edge1, scaleColor(color, 0.74 + hash01(i * 4.2) * 0.18), v3(0, 1, 0));
    }
    return createMesh(mesh.vertices);
  }

  function createMoonReflection(angle, strips) {
    const mesh = { vertices: [] };
    const axis = v3(Math.cos(angle), 0, Math.sin(angle));
    const tangent = v3(-axis[2], 0, axis[0]);
    const start = shorelineModel.radiusAt(angle) + 1.6;
    for (let i = 0; i < strips; i += 1) {
      const seed = i * 9.13 + 14.0;
      const distance = start + i * (1.62 + hash01(seed) * 1.54);
      const center = v3(axis[0] * distance, -0.455, axis[2] * distance);
      const width = 1.02 + Math.sqrt(i + 1) * 0.54 + hash01(seed + 1.0) * 0.94;
      const length = 0.34 + hash01(seed + 2.0) * 0.76;
      const drift = (hash01(seed + 3.0) - 0.5) * 3.1;
      const c0 = v3(center[0] + tangent[0] * drift, center[1], center[2] + tangent[2] * drift);
      const p0 = v3(c0[0] - tangent[0] * width - axis[0] * length, c0[1], c0[2] - tangent[2] * width - axis[2] * length);
      const p1 = v3(c0[0] + tangent[0] * width - axis[0] * length, c0[1], c0[2] + tangent[2] * width - axis[2] * length);
      const p2 = v3(c0[0] + tangent[0] * width + axis[0] * length, c0[1], c0[2] + tangent[2] * width + axis[2] * length);
      const p3 = v3(c0[0] - tangent[0] * width + axis[0] * length, c0[1], c0[2] - tangent[2] * width + axis[2] * length);
      const fade = 1.0 - smoothstep(0.0, strips, i);
      const color = scaleColor(blendColor(colors.moonReflection, colors.moon, hash01(seed + 4.0) * 0.42), 0.50 + fade * 0.30 + hash01(seed + 5.0) * 0.20);
      pushQuad(mesh, p0, p1, p2, p3, color, v3(0, 1, 0));
    }
    return createMesh(mesh.vertices);
  }

  const meshes = {
    moon: createDisk(2.35, 18, colors.moon, scaleColor(colors.moon, 0.66)),
    moonHalo: createDisk(7.20, 30, colors.moonHalo, scaleColor(colors.moonHalo, 0.22)),
    stars: createStarField(184),
    horizonHaze: createHorizonHaze(72, 5),
    campGlow: createGroundGlow(2.9, 34, colors.campGlow),
    island: createIslandTerrain(),
    campClearing: createCampClearingMesh(),
    terrainVeil: createTerrainVeilMesh(),
    groundDetail: createGroundDetailMesh(),
    water: oceanSurface(2.16, FAR_WATER_RADIUS, 62, 192, colors.waterNear, colors.waterFar),
    moonReflection: createMoonReflection(2.93, 58),
    foam: shorelineFoam(3, 108),
    spray: shorelineSpray(64),
    wetShore: wetShoreBand(126),
    cube: box(1, 1, 1, colors.wood),
    crate: box(1, 1, 1, colors.woodDark),
    rolledMat: frustum(0.10, 0.11, 0.72, 7, colors.mat, colors.mat, colors.woodDark),
    cup: frustum(0.10, 0.075, 0.18, 7, colors.cup, colors.cup, colors.woodDark),
    benchTop: box(1, 1, 1, colors.woodWarm),
    benchDark: box(1, 1, 1, colors.woodDark),
    toolMetal: box(1, 1, 1, colors.toolMetal),
    toolHandle: box(1, 1, 1, colors.barkLight),
    lanternFrame: box(1, 1, 1, colors.lanternFrame),
    lanternGlow: sphere(0.14, 5, 8, colors.lanternGlow),
    coal: roughBoulder(0.16, 3, 6, colors.coal, colors.wetRock),
    ember: roughBoulder(0.10, 3, 5, colors.ember, colors.flameHot),
    paper: box(0.34, 0.035, 0.48, colors.paper),
    receipt: box(0.28, 0.028, 0.62, colors.paperLight),
    receiptLine: box(0.20, 0.012, 0.025, colors.receiptInk),
    string: box(0.025, 0.24, 0.025, colors.string),
    logBook: box(0.55, 0.12, 0.42, colors.logBook),
    approval: frustum(0.14, 0.22, 0.28, 6, colors.approval, colors.approval, [0.12, 0.36, 0.24]),
    softBubbleBody: softBubbleBody(colors.bubble),
    softBubbleGlow: sphere(0.32, 10, 16, colors.bubbleCore),
    softEye: flatEllipse(0.150, 0.218, 28, colors.faceInk),
    softEyeSpark: flatEllipse(0.044, 0.058, 18, colors.bubbleGlint),
    softCheek: flatEllipse(0.134, 0.070, 22, colors.cheek),
    softMouth: arcStrip(0.114, 0.018, Math.PI * 1.12, Math.PI * 1.88, 18, colors.faceInk),
    softSpiral: spiralMark(colors.faceMark),
    trunk: frustum(0.13, 0.28, 1.12, 8, colors.barkLight, colors.bark, colors.woodDark),
    trunkUpper: frustum(0.08, 0.16, 0.92, 7, colors.barkLight, colors.bark, colors.bark),
    branch: frustum(0.045, 0.10, 1.0, 6, colors.barkLight, colors.bark, colors.bark),
    twig: frustum(0.024, 0.052, 0.72, 5, colors.barkLight, colors.bark, colors.bark),
    leaves: roughBoulder(0.50, 4, 7, colors.leafDark, colors.leafLit),
    leavesMoon: roughBoulder(0.50, 4, 7, colors.leafDark, colors.leafMoon),
    leavesFire: roughBoulder(0.50, 4, 7, colors.leaf, colors.leafFire),
    leavesHaze: roughBoulder(0.48, 4, 7, colors.leafDark, colors.leafHaze),
    leavesDeep: roughBoulder(0.50, 4, 7, scaleColor(colors.leafDark, 0.82), blendColor(colors.leaf, colors.mossBlue, 0.38)),
    leavesSoft: roughBoulder(0.50, 4, 7, blendColor(colors.leafDark, colors.moss, 0.28), blendColor(colors.leafLit, colors.moss, 0.22)),
    leavesWarm: roughBoulder(0.50, 4, 7, blendColor(colors.leafDark, colors.bark, 0.18), blendColor(colors.leafLit, colors.flowerWarm, 0.16)),
    leavesCool: roughBoulder(0.50, 4, 7, blendColor(colors.leafDark, colors.hazeBlue, 0.30), blendColor(colors.leafMoon, colors.leafLit, 0.18)),
    trunkHaze: frustum(0.10, 0.22, 1.0, 7, colors.barkHaze, colors.bark, colors.woodDark),
    bush: roughBoulder(0.36, 3, 6, colors.grassDeep, colors.mossBlue),
    bushSoft: roughBoulder(0.36, 3, 6, blendColor(colors.grassDeep, colors.moss, 0.24), blendColor(colors.mossBlue, colors.grassLit, 0.18)),
    bushDry: roughBoulder(0.36, 3, 6, blendColor(colors.grassDeep, colors.dirt, 0.18), blendColor(colors.moss, colors.flowerWarm, 0.10)),
    flame: frustum(0, 0.24, 0.78, 7, colors.flameHot, colors.flame, colors.flame),
    flameInner: frustum(0, 0.13, 0.56, 7, colors.flameHot, colors.flameHot, colors.flame),
    log: frustum(0.12, 0.14, 0.72, 7, colors.barkLight, colors.wood, colors.woodDark),
    rock: roughBoulder(0.42, 4, 7, colors.cliffRock, colors.wetRock),
    physicsStone: roughBoulder(0.18, 4, 7, colors.toolMetal, colors.cliffRock),
    debugCylinder: frustum(1, 1, 1, 36, colors.physicsDebug, colors.physicsDebug, colors.physicsDebug),
    debugBox: box(1, 1, 1, colors.physicsDebug)
  };

  function identity() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  function multiply(a, b) {
    const out = new Array(16);
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        out[column * 4 + row] =
          a[0 * 4 + row] * b[column * 4 + 0] +
          a[1 * 4 + row] * b[column * 4 + 1] +
          a[2 * 4 + row] * b[column * 4 + 2] +
          a[3 * 4 + row] * b[column * 4 + 3];
      }
    }
    return out;
  }

  function translation(x, y, z) {
    const matrix = identity();
    matrix[12] = x;
    matrix[13] = y;
    matrix[14] = z;
    return matrix;
  }

  function scale(x, y, z) {
    return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
  }

  function rotateX(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }

  function rotateY(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }

  function rotateZ(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  const TAU = Math.PI * 2;

  function cyclePulse(value, center, width) {
    const distance = Math.abs(angleDistance(value * TAU, center * TAU)) / TAU;
    return Math.exp(-Math.pow(distance / width, 2));
  }

  function dayFactorFromTime(timeOfDay) {
    const sunHeight = Math.sin(timeOfDay * TAU - Math.PI / 2);
    return smoothstep(-0.12, 0.34, sunHeight);
  }

  function phaseNameFromTime(timeOfDay) {
    const dayFactor = dayFactorFromTime(timeOfDay);
    if (dayFactor < 0.18) return "night";
    if (cyclePulse(timeOfDay, 0.25, 0.10) > 0.42) return "dawn";
    if (cyclePulse(timeOfDay, 0.75, 0.10) > 0.42) return "twilight";
    return "day";
  }

  function createWorldState() {
    return {
      timeOfDay: 0,
      windStrength: 0,
      fireIntensity: 1,
      ambientEnergy: 0.34,
      emotionalField: 0.12
    };
  }

  function worldLerp(current, target) {
    return blendNumber(current, target, 0.05);
  }

  function createEnvironment() {
    return {
      timeOfDay: 0,
      dayLength: 600,
      world: createWorldState(),
      wind: {
        strength: 0,
        direction: { x: 1, y: 0, z: 0 },
        gust: 0
      },
      windVector: { x: 0, y: 0, z: 0, gust: 0, strength: 0 },
      windStrength: 0,
      fireIntensity: 1,
      dayFactor: 0,
      nightFactor: 1,
      phaseName: "night",
      lighting: {
        sky: skyByTime.night.slice(0, 3),
        lightPosition: [34, 18, 56],
        lightColor: [0.16, 0.20, 0.32],
        ambient: [0.08, 0.10, 0.16],
        fogColor: [0.035, 0.060, 0.110],
        fogDensity: 0.42,
        fireBoost: 1.45,
        moonStrength: 1
      }
    };
  }

  function updateEnvironment(envState, now, deltaSeconds) {
    const absoluteSeconds = now / 1000;
    const world = envState.world;
    envState.timeOfDay = (absoluteSeconds / envState.dayLength) % 1;
    const timeOfDay = envState.timeOfDay;
    const dayFactor = dayFactorFromTime(timeOfDay);
    const nightFactor = 1 - dayFactor;
    const dawn = cyclePulse(timeOfDay, 0.25, 0.085);
    const sunset = cyclePulse(timeOfDay, 0.75, 0.095);
    const warmFactor = clamp(Math.max(dawn, sunset), 0, 1);
    const twilightFactor = clamp(sunset, 0, 1);
    const noonFactor = cyclePulse(timeOfDay, 0.50, 0.22);
    const moonStrength = clamp(nightFactor * 1.12 + dawn * 0.18 + sunset * 0.18, 0.06, 1.15);
    const busAmbient = clamp(world.ambientEnergy, 0, 1);
    const busEmotion = clamp(world.emotionalField, 0, 1);
    const fireStability = clamp((world.fireIntensity - 0.82) / 0.96, 0, 1);
    const fireDamping = clamp(fireStability * (0.24 + (1 - busEmotion) * 0.28), 0, 0.54);
    const emotionalVariance = clamp(busEmotion * (0.10 + twilightFactor * 0.18) + busAmbient * 0.035, 0, 0.30);

    envState.dayFactor = dayFactor;
    envState.nightFactor = nightFactor;
    envState.phaseName = phaseNameFromTime(timeOfDay);

    const daySky = [0.055, 0.175, 0.285];
    const nightSky = [0.007, 0.018, 0.050];
    const warmSky = sunset > dawn ? [0.145, 0.082, 0.070] : [0.105, 0.112, 0.155];
    envState.lighting.sky = addColor(
      blendColor(nightSky, daySky, dayFactor),
      scaleColor(warmSky, warmFactor * 0.45)
    );

    const sunAngle = timeOfDay * TAU - Math.PI / 2;
    const sunHeight = Math.sin(sunAngle);
    const sunRadius = 54;
    envState.lighting.lightPosition = [
      Math.cos(sunAngle) * sunRadius,
      8 + Math.max(0.04, sunHeight) * 38,
      Math.sin(sunAngle + 0.72) * sunRadius
    ];
    const noonLight = [0.62, 0.66, 0.62];
    const nightLight = [0.13, 0.18, 0.31];
    const warmLight = sunset > dawn ? [0.76, 0.38, 0.18] : [0.74, 0.48, 0.28];
    envState.lighting.lightColor = addColor(
      blendColor(nightLight, noonLight, clamp(dayFactor * (0.72 + noonFactor * 0.28), 0, 1)),
      scaleColor(warmLight, warmFactor * 0.36)
    );
    envState.lighting.ambient = addColor(
      blendColor([0.070, 0.092, 0.160], [0.245, 0.265, 0.235], dayFactor),
      scaleColor([0.18, 0.10, 0.065], warmFactor * 0.26)
    );
    envState.lighting.fogColor = addColor(
      blendColor([0.026, 0.050, 0.098], [0.135, 0.178, 0.196], dayFactor),
      scaleColor([0.24, 0.095, 0.050], warmFactor * 0.32)
    );
    envState.lighting.fogDensity = clamp(0.20 + nightFactor * 0.24 + warmFactor * 0.28 - noonFactor * 0.06, 0.14, 0.68);
    const baseFireBoost = 0.86 + nightFactor * 0.82 + warmFactor * 0.18;
    const reactiveFire = busAmbient * 0.08 + busEmotion * 0.07;
    envState.lighting.fireBoost = clamp(baseFireBoost + reactiveFire, 0.82, 1.86);
    envState.lighting.moonStrength = moonStrength;
    envState.fireIntensity = envState.lighting.fireBoost;

    const windAngle = 0.64 +
      Math.sin(absoluteSeconds * 0.018) * (0.62 + busEmotion * 0.20) +
      Math.sin(absoluteSeconds * 0.006 + 1.9) * (0.40 + twilightFactor * 0.16);
    const baseStrength = 0.18 +
      (Math.sin(absoluteSeconds * 0.027 + 0.4) * 0.5 + 0.5) * 0.18 +
      (Math.sin(absoluteSeconds * 0.011 + 2.4) * 0.5 + 0.5) * 0.10;
    const gustRaw = Math.sin(absoluteSeconds * 0.083 + Math.sin(absoluteSeconds * 0.019) * 2.1) * 0.5 + 0.5;
    const targetGust = clamp(Math.pow(smoothstep(0.72, 1.0, gustRaw), 2.4) * (1 - fireDamping) + emotionalVariance, 0, 1);
    const gustSpeed = targetGust > envState.wind.gust ? 1.30 + busEmotion * 0.70 : 0.38 + fireStability * 0.34;
    envState.wind.gust += (targetGust - envState.wind.gust) * (1 - Math.exp(-deltaSeconds * gustSpeed));
    const targetStrength = clamp(baseStrength + envState.wind.gust * 0.30 + busAmbient * 0.08 + busEmotion * 0.06 - fireStability * 0.055, 0.08, 0.84);
    envState.wind.strength += (targetStrength - envState.wind.strength) * (1 - Math.exp(-deltaSeconds * (0.58 + fireStability * 0.20)));
    envState.wind.direction.x = Math.cos(windAngle);
    envState.wind.direction.y = 0;
    envState.wind.direction.z = Math.sin(windAngle);
    envState.windStrength = envState.wind.strength * (0.72 + envState.wind.gust * 0.68);
    const emotionalGust = clamp(0.58 + envState.wind.gust * 0.72 + busEmotion * 0.18 + busAmbient * 0.05, 0.58, 1.38);
    envState.windVector = {
      x: envState.wind.direction.x * envState.windStrength,
      y: 0,
      z: envState.wind.direction.z * envState.windStrength,
      gust: emotionalGust,
      strength: envState.wind.strength,
      direction: envState.wind.direction
    };

    world.timeOfDay = timeOfDay;
    world.windStrength = worldLerp(world.windStrength, envState.windStrength);
    world.fireIntensity = worldLerp(world.fireIntensity, envState.fireIntensity);
    world.ambientEnergy = worldLerp(world.ambientEnergy, clamp(0.26 + dayFactor * 0.08 + fireStability * 0.11 + busEmotion * 0.08, 0, 1));
    world.emotionalField = worldLerp(world.emotionalField, clamp(busEmotion * 0.94 + twilightFactor * 0.028 + envState.wind.gust * 0.018 - fireStability * 0.020, 0.04, 0.78));

    window.__toyboxEnv = envState;
    window.__toyboxWorld = world;
    return envState;
  }

  const env = createEnvironment();

  function modelMatrix(item, time) {
    let matrix = identity();
    let position = item.position || [0, 0, 0];
    let rotation = item.rotation || [0, 0, 0];
    let size = item.scale || [1, 1, 1];
    if (item.motion) {
      const phase = item.motion.phase || 0;
      const side = item.motion.side || 1;
      const windScale = item.motion.windScale == null ? 1 : item.motion.windScale;
      const breeze = env.windVector;
      const windWave = Math.sin(time * (0.94 + breeze.gust * 0.70) + phase);
      position = [position[0], position[1], position[2]];
      rotation = [rotation[0] || 0, rotation[1] || 0, rotation[2] || 0];
      size = [size[0], size[1], size[2]];

      if (item.motion.role === "leaf") {
        const heightBias = item.motion.heightBias == null ? 1 : item.motion.heightBias;
        position[0] += breeze.x * 0.12 * windWave * windScale * heightBias;
        position[2] += breeze.z * 0.12 * windWave * windScale * heightBias;
        rotation[0] += breeze.z * 0.15 * windScale + windWave * 0.034 * windScale;
        rotation[2] -= breeze.x * 0.18 * windScale + windWave * 0.024 * windScale;
      } else if (item.motion.role === "trunk") {
        rotation[0] += breeze.z * 0.030 * windScale + windWave * 0.008 * windScale;
        rotation[2] -= breeze.x * 0.034 * windScale;
      } else if (item.motion.role === "grass") {
        position[0] += breeze.x * 0.055 * windWave * windScale;
        position[2] += breeze.z * 0.055 * windWave * windScale;
        rotation[0] += breeze.z * 0.090 * windScale;
        rotation[2] -= breeze.x * 0.090 * windScale;
      } else if (item.motion.role === "receipt") {
        position[0] += breeze.x * 0.045 * windWave;
        position[2] += breeze.z * 0.045 * windWave;
        rotation[0] += windWave * 0.062 + breeze.z * 0.060;
        rotation[2] += side * (windWave * 0.052 + breeze.x * 0.060);
      } else if (item.motion.role === "loose-paper") {
        position[1] += Math.max(0, windWave) * 0.014 * breeze.gust;
        rotation[0] += windWave * 0.024;
        rotation[2] += side * breeze.x * 0.030;
      } else if (item.motion.role === "ember") {
        const lift = ((time * (0.10 + item.motion.speed * 0.02) + phase) % 1);
        const drift = Math.sin(time * 1.2 + phase * 7.0);
        position[0] += breeze.x * lift * 0.42 + drift * 0.030 * windScale;
        position[1] += lift * (0.34 + item.motion.height * 0.16);
        position[2] += breeze.z * lift * 0.42 + Math.cos(time * 1.1 + phase * 5.0) * 0.030 * windScale;
        size[0] *= 0.55 + (1 - lift) * 0.55;
        size[1] *= 0.55 + (1 - lift) * 0.55;
        size[2] *= 0.55 + (1 - lift) * 0.55;
      }
    }
    matrix = multiply(matrix, translation(position[0], position[1], position[2]));
    matrix = multiply(matrix, rotateY(rotation[1] || 0));
    matrix = multiply(matrix, rotateX(rotation[0] || 0));
    matrix = multiply(matrix, rotateZ(rotation[2] || 0));
    matrix = multiply(matrix, scale(size[0], size[1], size[2]));
    return matrix;
  }

  function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ];
  }

  function lookAt(eye, center, up) {
    const zAxis = normalize(sub(eye, center));
    const xAxis = normalize(cross(up, zAxis));
    const yAxis = cross(zAxis, xAxis);
    return [
      xAxis[0], yAxis[0], zAxis[0], 0,
      xAxis[1], yAxis[1], zAxis[1], 0,
      xAxis[2], yAxis[2], zAxis[2], 0,
      -xAxis[0] * eye[0] - xAxis[1] * eye[1] - xAxis[2] * eye[2],
      -yAxis[0] * eye[0] - yAxis[1] * eye[1] - yAxis[2] * eye[2],
      -zAxis[0] * eye[0] - zAxis[1] * eye[1] - zAxis[2] * eye[2],
      1
    ];
  }

  const backgroundItems = [];
  const skyOverlayItems = [];
  const renderItems = [];
  const debugRenderItems = [];
  const instancing = createInstancing(gl);
  const instancedRenderGroups = [];

  function makeRenderItem(mesh, position, itemScale, rotation, material, transparent, motion) {
    if (!mesh || !mesh.buffer || !mesh.count) return null;
    return {
      mesh,
      position,
      scale: itemScale || [1, 1, 1],
      rotation: rotation || [0, 0, 0],
      material: material || 0,
      transparent: Boolean(transparent),
      motion: motion || null
    };
  }

  function add(mesh, position, itemScale, rotation, material, transparent, motion) {
    const item = makeRenderItem(mesh, position, itemScale, rotation, material, transparent, motion);
    if (!item) return null;
    renderItems.push(item);
    return item;
  }

  function addBackground(mesh, position, itemScale, rotation, material) {
    const item = makeRenderItem(mesh, position, itemScale, rotation, material, true);
    if (item) backgroundItems.push(item);
  }

  function addSkyOverlay(mesh, position, itemScale, rotation, material) {
    const item = makeRenderItem(mesh, position, itemScale, rotation, material, true);
    if (item) skyOverlayItems.push(item);
  }

  function addDebug(mesh, position, itemScale, rotation, material) {
    const item = makeRenderItem(mesh, position, itemScale, rotation, material, true);
    if (item) debugRenderItems.push(item);
  }

  async function addConfiguredAssets() {
    const assets = Array.isArray(toyboxState.assets) ? toyboxState.assets : [];
    for (const asset of assets) {
      if (!asset || typeof asset.url !== "string") continue;
      try {
        const glb = await loadGlb(asset.url);
        const mesh = createMesh(glbToToyboxVertices(glb, asset.color || [0.75, 0.75, 0.75]));
        const instances = Array.isArray(asset.instances) ? asset.instances : [];
        for (const instance of instances) {
          const basePosition = Array.isArray(instance.position) ? instance.position : [0, 0, 0];
          const position = basePosition.slice();
          if (Math.abs(position[1]) < 0.001) position[1] = groundHeightAt(position[0], position[2]);
          add(
            mesh,
            position,
            Array.isArray(instance.scale) ? instance.scale : [1, 1, 1],
            Array.isArray(instance.rotation) ? instance.rotation : [0, 0, 0],
            0,
            false
          );
        }
      } catch (error) {
        console.warn("Toybox GLB asset could not be loaded.", asset.url, error);
      }
    }
  }

  const MOON_ANGLE = 2.93;
  const MOON_POSITION = [Math.cos(MOON_ANGLE) * 108.0, 20.2, Math.sin(MOON_ANGLE) * 108.0];
  const MOON_YAW = -MOON_ANGLE - Math.PI / 2;

  addSkyOverlay(meshes.stars, [0, 0, 0], [1, 1, 1], [0, 0, 0], 5);
  addBackground(meshes.horizonHaze, [0, 0, 0], [1, 1, 1], [0, 0, 0], 6);
  addBackground(meshes.moonHalo, MOON_POSITION, [1, 1, 1], [0, MOON_YAW, 0], 9);
  addBackground(meshes.moon, MOON_POSITION, [1, 1, 1], [0, MOON_YAW, 0], 8);
  add(meshes.water, [0, 0, 0], [1, 1, 1], [0, 0, 0], 1);
  add(meshes.moonReflection, [0, 0, 0], [1, 1, 1], [0, 0, 0], 9, true);
  add(meshes.island, [0, ISLAND_OFFSET_Y, 0], [1, 1, 1]);
  add(meshes.campClearing, [0, 0, 0], [1, 1, 1]);
  add(meshes.terrainVeil, [0, 0, 0], [1, 1, 1]);
  add(meshes.groundDetail, [0, 0, 0], [1, 1, 1]);
  add(meshes.campGlow, [0.48, groundHeightAt(0.48, -0.28) + 0.070, -0.28], [0.78, 0.72, 0.78], [0, -0.18, 0], 6, true);

  function addShoreRocks() {
    const clusters = [
      { angle: -2.58, count: 4, spread: 0.66, offset: -0.06, scale: 0.72, jitter: 0.16 },
      { angle: -0.98, count: 5, spread: 0.74, offset: -0.02, scale: 0.68, jitter: 0.18 },
      { angle: 0.34, count: 3, spread: 0.42, offset: 0.02, scale: 0.58, jitter: 0.12 },
      { angle: 1.50, count: 4, spread: 0.58, offset: -0.10, scale: 0.62, jitter: 0.14 },
      { angle: 2.78, count: 2, spread: 0.28, offset: 0.06, scale: 0.78, jitter: 0.10 }
    ];

    for (let c = 0; c < clusters.length; c += 1) {
      const cluster = clusters[c];
      for (let i = 0; i < cluster.count; i += 1) {
        const placement = cluster.count === 1 ? 0 : i / (cluster.count - 1) - 0.5;
        const seed = c * 41.0 + i * 9.0;
        const angle = cluster.angle + placement * cluster.spread + (hash01(seed) - 0.5) * cluster.jitter;
        const radius = islandShoreRadius(angle) + cluster.offset + (hash01(seed + 1.7) - 0.5) * 0.22;
        const shore = terrainPoint(0.98, angle);
        const size = cluster.scale * (0.76 + hash01(seed + 2.9) * 0.62);
        const sx = size * (0.82 + hash01(seed + 4.1) * 0.44);
        const sy = size * (0.56 + hash01(seed + 5.3) * 0.42);
        const sz = size * (0.76 + hash01(seed + 6.7) * 0.52);
        const y = ISLAND_OFFSET_Y + shore[1] + 0.06 + sy * 0.08;
        add(
          meshes.rock,
          [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
          [sx, sy, sz],
          [(hash01(seed + 7.1) - 0.5) * 0.34, angle + hash01(seed + 8.6) * 1.7, (hash01(seed + 9.4) - 0.5) * 0.26]
        );
      }
    }
  }

  function terrainPlacement(radial, angle, tangentialJitter, radialJitter) {
    const radius = islandShoreRadius(angle) * clamp(radial + (radialJitter || 0), 0.08, 0.88);
    const tangent = angle + Math.PI / 2;
    const x = Math.cos(angle) * radius + Math.cos(tangent) * (tangentialJitter || 0);
    const z = Math.sin(angle) * radius + Math.sin(tangent) * (tangentialJitter || 0);
    return [x, groundHeightAt(x, z), z];
  }

  function environmentDensityAt(x, z, seed) {
    const campDensity = 1 - smoothstep(5.4, 20.0, Math.hypot(x - characterAnchors.startOrigin[0], z - characterAnchors.startOrigin[2]));
    const pocket = valueNoise2d(x, z, 8.5, 31.0 + seed);
    const cluster = valueNoise2d(x + 3.8, z - 2.1, 5.2, 57.0 + seed);
    const emptyPocket = smoothstep(0.66, 0.92, pocket) * (1 - smoothstep(0.62, 0.86, cluster));
    return clamp(0.26 + campDensity * 0.38 + cluster * 0.30 - emptyPocket * 0.55, 0.05, 0.94);
  }

  function nearMainCamp(x, z, buffer) {
    const clearance = buffer || 3.2;
    return (
      Math.hypot(x + 0.20, z - 0.02) < clearance ||
      Math.hypot(x - 0.80, z + 0.20) < clearance ||
      Math.hypot(x + 1.72, z + 1.03) < clearance ||
      Math.hypot(x - 1.52, z - 1.36) < clearance
    );
  }

  function canopyMeshFor(seed, nearFire, haze) {
    if (haze) return hash01(seed + 0.8) > 0.46 ? meshes.leavesHaze : meshes.leavesCool;
    if (nearFire && hash01(seed + 1.1) > 0.48) return meshes.leavesWarm;
    const variants = [meshes.leaves, meshes.leavesDeep, meshes.leavesSoft, meshes.leavesCool, meshes.leavesMoon];
    return variants[Math.floor(hash01(seed + 1.9) * variants.length) % variants.length];
  }

  function bushMeshFor(seed) {
    const variants = [meshes.bush, meshes.bushSoft, meshes.bushDry];
    return variants[Math.floor(hash01(seed + 2.2) * variants.length) % variants.length];
  }

  function addWildTree(x, z, yaw, size, seed) {
    const ground = groundHeightAt(x, z);
    const heightScale = 0.70 + hash01(seed + 0.2) * 0.70;
    const thickness = 0.82 + hash01(seed + 0.4) * 0.48;
    const canopyScale = 0.86 + hash01(seed + 0.6) * 0.52;
    const leanX = (hash01(seed + 0.7) - 0.5) * 0.18;
    const leanZ = (hash01(seed + 1.4) - 0.5) * 0.16;
    const phase = seed * 0.19;
    const nearFire = Math.hypot(x - 0.80, z + 0.20) < 6.2;
    const leafMesh = canopyMeshFor(seed, nearFire, false);
    const shadowLeafMesh = canopyMeshFor(seed + 9.0, false, hash01(seed + 9.4) > 0.60);
    const trunkTall = (1.34 + hash01(seed + 13.0) * 0.42) * heightScale;
    const canopyLift = (2.70 + hash01(seed + 14.0) * 0.74) * heightScale;
    const spreadA = (0.46 + hash01(seed + 15.0) * 0.34) * canopyScale;
    const spreadB = (0.50 + hash01(seed + 16.0) * 0.36) * canopyScale;
    const branchSweep = 0.26 + hash01(seed + 17.0) * 0.36;

    const trunkMotion = { role: "trunk", phase, windScale: 0.34 + heightScale * 0.18 };
    add(meshes.trunk, [x, ground + 0.56 * trunkTall * size, z], [1.04 * size * thickness, trunkTall * size, 1.04 * size * thickness], [leanX, yaw, leanZ], 0, false, trunkMotion);
    add(meshes.trunkUpper, [x + Math.cos(yaw) * 0.12 * size, ground + 1.42 * trunkTall * size, z + Math.sin(yaw) * 0.12 * size], [0.94 * size * thickness, 1.18 * size * heightScale, 0.94 * size * thickness], [0.14 + leanX, yaw - 0.22, -0.10 + leanZ], 0, false, trunkMotion);
    add(meshes.branch, [x - Math.sin(yaw) * 0.52 * size, ground + 1.74 * trunkTall * size, z + Math.cos(yaw) * 0.52 * size], [0.86 * size, 0.92 * size, 0.86 * size], [0.72 + branchSweep * 0.25, yaw + branchSweep, 0.48 + branchSweep], 0, false, { role: "trunk", phase: phase + 0.4, windScale: 0.45 });
    add(meshes.branch, [x + Math.sin(yaw) * 0.56 * size, ground + 1.80 * trunkTall * size, z - Math.cos(yaw) * 0.56 * size], [0.78 * size, 0.88 * size, 0.78 * size], [0.68 + branchSweep * 0.18, yaw - branchSweep * 1.1, -0.46 - branchSweep], 0, false, { role: "trunk", phase: phase + 0.8, windScale: 0.45 });

    const canopyMotion = { role: "leaf", phase, windScale: 0.70 + canopyScale * 0.28, heightBias: heightScale };
    add(leafMesh, [x - Math.sin(yaw) * spreadA * size, ground + canopyLift * size, z + Math.cos(yaw) * spreadA * size], [1.22 * size * canopyScale, 0.90 * size * canopyScale, 1.10 * size * canopyScale], [0.06, yaw + hash01(seed + 18.0) * 0.36, -0.08], 0, false, canopyMotion);
    add(leafMesh, [x + Math.sin(yaw) * spreadB * size, ground + (canopyLift + 0.14 * heightScale) * size, z - Math.cos(yaw) * spreadB * size], [1.10 * size * canopyScale, 0.94 * size * canopyScale, 1.24 * size * canopyScale], [-0.05, yaw + 0.28 + hash01(seed + 19.0) * 0.42, 0.08], 0, false, { ...canopyMotion, phase: phase + 0.9 });
    add(leafMesh, [x, ground + (canopyLift + 0.44 * heightScale) * size, z], [1.14 * size * canopyScale, 0.82 * size * canopyScale, 1.16 * size * canopyScale], [0.10, yaw - 0.18 + hash01(seed + 20.0) * 0.36, 0.04], 0, false, { ...canopyMotion, phase: phase + 1.8 });
    add(leafMesh, [x + Math.cos(yaw) * 0.18 * size, ground + (canopyLift - 0.18 * heightScale) * size, z + Math.sin(yaw) * 0.18 * size], [0.98 * size * canopyScale, 0.72 * size * canopyScale, 0.96 * size * canopyScale], [-0.08, yaw + 0.52, -0.03], 0, false, { ...canopyMotion, phase: phase + 2.6 });
    if (hash01(seed + 21.0) > 0.34) {
      const back = -0.38 - hash01(seed + 22.0) * 0.30;
      add(shadowLeafMesh, [x + Math.cos(yaw) * back * size, ground + (canopyLift + 0.20 * heightScale) * size, z + Math.sin(yaw) * back * size], [0.92 * size * canopyScale, 0.66 * size * canopyScale, 1.04 * size * canopyScale], [0.08, yaw + 0.82, -0.06], 0, false, { role: "leaf", phase: phase + 3.3, windScale: 0.58 + canopyScale * 0.20, heightBias: heightScale });
    }
  }

  function addSapling(x, z, yaw, size, seed) {
    const ground = groundHeightAt(x, z);
    const leanX = (hash01(seed + 1.0) - 0.5) * 0.28;
    const leanZ = (hash01(seed + 2.0) - 0.5) * 0.24;
    add(meshes.trunkUpper, [x, ground + 0.52 * size, z], [0.50 * size, 0.92 * size, 0.50 * size], [leanX, yaw, leanZ], 0, false, { role: "trunk", phase: seed * 0.12, windScale: 0.28 });
    const leafMesh = hash01(seed + 3.0) > 0.55 ? canopyMeshFor(seed, false, false) : bushMeshFor(seed);
    add(leafMesh, [x, ground + 1.08 * size, z], [0.66 * size, 0.56 * size, 0.70 * size], [0.08, yaw + hash01(seed + 4.0), -0.06], 0, false, { role: "leaf", phase: seed * 0.12, windScale: 0.68 });
  }

  function addLowBush(x, z, yaw, size, seed) {
    const ground = groundHeightAt(x, z);
    const clumps = 2 + Math.floor(hash01(seed + 1.0) * 3);
    for (let i = 0; i < clumps; i += 1) {
      const angle = yaw + i * 2.1 + hash01(seed + i * 2.0) * 0.54;
      const offset = 0.12 + hash01(seed + i * 3.0) * 0.38;
      const sx = x + Math.cos(angle) * offset * size;
      const sz = z + Math.sin(angle) * offset * size;
      add(
        bushMeshFor(seed + i),
        [sx, groundHeightAt(sx, sz) + 0.20 * size, sz],
        [0.72 * size, 0.44 * size, 0.68 * size],
        [0.05, angle, -0.04],
        0,
        false,
        { role: "grass", phase: seed * 0.15 + i, windScale: 0.42 + hash01(seed + i * 1.7) * 0.34 }
      );
    }
  }

  function addHazeTree(x, z, yaw, size, seed) {
    const ground = groundHeightAt(x, z);
    const leanX = (hash01(seed + 0.8) - 0.5) * 0.18;
    const leanZ = (hash01(seed + 1.6) - 0.5) * 0.16;
    const phase = seed * 0.13;
    const leafMesh = canopyMeshFor(seed, false, true);
    add(meshes.trunkHaze, [x, ground + 0.46 * size, z], [0.78 * size, 1.20 * size, 0.78 * size], [leanX, yaw, leanZ], 0, false, { role: "trunk", phase, windScale: 0.20 });
    add(meshes.trunkUpper, [x + Math.cos(yaw) * 0.06 * size, ground + 1.10 * size, z + Math.sin(yaw) * 0.06 * size], [0.54 * size, 0.86 * size, 0.54 * size], [0.10 + leanX, yaw - 0.14, leanZ], 0, false, { role: "trunk", phase: phase + 0.4, windScale: 0.24 });
    add(leafMesh, [x, ground + 2.14 * size, z], [1.02 * size, 0.72 * size, 0.98 * size], [0.08, yaw + 0.18, -0.04], 0, false, { role: "leaf", phase, windScale: 0.50 });
    add(leafMesh, [x - Math.sin(yaw) * 0.42 * size, ground + 1.92 * size, z + Math.cos(yaw) * 0.42 * size], [0.82 * size, 0.58 * size, 0.86 * size], [0.02, yaw - 0.26, 0.06], 0, false, { role: "leaf", phase: phase + 0.8, windScale: 0.46 });
    add(leafMesh, [x + Math.sin(yaw) * 0.38 * size, ground + 1.98 * size, z - Math.cos(yaw) * 0.38 * size], [0.78 * size, 0.60 * size, 0.82 * size], [-0.02, yaw + 0.34, -0.05], 0, false, { role: "leaf", phase: phase + 1.6, windScale: 0.46 });
  }

  function addFallenLog(x, z, yaw, size) {
    const ground = groundHeightAt(x, z);
    add(meshes.log, [x, ground + 0.18 * size, z], [1.18 * size, 2.35 * size, 1.18 * size], [Math.PI / 2 + 0.06, yaw, 0.05]);
  }

  function addFieldStone(x, z, yaw, size, seed) {
    const ground = groundHeightAt(x, z);
    add(
      meshes.rock,
      [x, ground + 0.14 * size, z],
      [size * (0.62 + hash01(seed + 2.0) * 0.48), size * (0.36 + hash01(seed + 3.0) * 0.30), size * (0.58 + hash01(seed + 4.0) * 0.52)],
      [(hash01(seed + 5.0) - 0.5) * 0.24, yaw, (hash01(seed + 6.0) - 0.5) * 0.22]
    );
  }

  function addForegroundFrameTrees() {
    const frames = [
      { x: 12.6, z: -8.4, yaw: -2.50, size: 2.08, seed: 704.0 },
      { x: -10.4, z: -6.7, yaw: 1.86, size: 2.02, seed: 731.0 },
      { x: -10.8, z: 3.3, yaw: 0.78, size: 1.72, seed: 769.0 },
      { x: 9.8, z: 5.6, yaw: -1.24, size: 1.84, seed: 797.0 },
      { x: 15.2, z: -1.9, yaw: -1.72, size: 1.72, seed: 821.0 },
      { x: -14.3, z: 0.8, yaw: 1.32, size: 1.86, seed: 842.0 }
    ];

    for (const frame of frames) {
      if (!shorelineModel.containsPoint(frame.x, frame.z, 2.0)) continue;
      addWildTree(frame.x, frame.z, frame.yaw, frame.size, frame.seed);
    }

    const silhouetteCanopies = [
      [-13.6, 2.5, 4.1, 2.6, 861.0],
      [14.2, 3.2, -0.8, 2.3, 872.0]
    ];
    for (const entry of silhouetteCanopies) {
      const [x, z, yaw, size, seed] = entry;
      if (!shorelineModel.containsPoint(x, z, 1.2)) continue;
      const ground = groundHeightAt(x, z);
      add(meshes.trunkHaze, [x, ground + 0.62 * size, z], [0.86 * size, 1.52 * size, 0.86 * size], [0.08, yaw, -0.04]);
      add(meshes.leavesHaze, [x - Math.sin(yaw) * 0.72 * size, ground + 2.16 * size, z + Math.cos(yaw) * 0.72 * size], [1.48 * size, 0.96 * size, 1.34 * size], [0.04, yaw, -0.08], 0, false, { role: "leaf", phase: seed * 0.13 });
      add(meshes.leavesHaze, [x + Math.sin(yaw) * 0.48 * size, ground + 2.32 * size, z - Math.cos(yaw) * 0.48 * size], [1.24 * size, 0.82 * size, 1.28 * size], [-0.02, yaw + 0.34, 0.06], 0, false, { role: "leaf", phase: seed * 0.17 });
    }
  }

  function addForestDepthLayer() {
    const moonSide = [
      [1.42, 0.74, 0.92, 1001.0],
      [1.66, 0.82, 0.78, 1012.0],
      [1.88, 0.70, 0.86, 1023.0],
      [2.10, 0.87, 0.72, 1034.0],
      [2.32, 0.78, 0.82, 1045.0],
      [2.58, 0.84, 0.76, 1056.0],
      [2.82, 0.72, 0.90, 1067.0]
    ];
    for (const tree of moonSide) {
      const [angle, radial, size, seed] = tree;
      const place = terrainPlacement(radial, angle, (hash01(seed) - 0.5) * 3.4, (hash01(seed + 1.0) - 0.5) * 0.035);
      if (!shorelineModel.containsPoint(place[0], place[2], 2.4)) continue;
      addHazeTree(place[0], place[2], angle + Math.PI + (hash01(seed + 2.0) - 0.5) * 0.75, size, seed);
    }

    const lowFrame = [
      [5.60, -4.88, -2.20, 0.62, 1101.0],
      [-5.50, -3.68, 1.85, 0.58, 1112.0],
      [4.42, -2.92, -1.30, 0.46, 1123.0],
      [-4.72, -1.62, 0.92, 0.42, 1134.0]
    ];
    for (const frame of lowFrame) {
      if (!shorelineModel.containsPoint(frame[0], frame[1], 2.0)) continue;
      addLowBush(frame[0], frame[1], frame[2], frame[3], frame[4]);
      addFieldStone(frame[0] + Math.cos(frame[2]) * 0.52, frame[1] + Math.sin(frame[2]) * 0.52, frame[2] + 0.4, frame[3] * 0.42, frame[4] + 5.0);
    }

    for (let i = 0; i < 18; i += 1) {
      const seed = i * 27.31 + 1301.0;
      const angle = -0.15 + i * 0.19 + (hash01(seed) - 0.5) * 0.08;
      const radial = 0.52 + hash01(seed + 1.0) * 0.28;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 2.8, 0);
      if (!shorelineModel.containsPoint(place[0], place[2], 3.0) || nearMainCamp(place[0], place[2], 5.4)) continue;
      addHazeTree(place[0], place[2], angle + Math.PI + (hash01(seed + 3.0) - 0.5) * 0.7, 0.64 + hash01(seed + 4.0) * 0.34, seed);
    }
  }

  function addLargeWorldScatter() {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < 76; i += 1) {
      const seed = i * 17.31 + 4.0;
      const angle = i * goldenAngle + (hash01(seed) - 0.5) * 0.36;
      const radial = 0.18 + Math.pow(hash01(seed + 1.0), 0.76) * 0.60;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 2.8, (hash01(seed + 3.0) - 0.5) * 0.035);
      if (nearMainCamp(place[0], place[2], 3.45)) continue;
      if (hash01(seed + 6.0) > environmentDensityAt(place[0], place[2], 0.0)) continue;
      addWildTree(place[0], place[2], angle + Math.PI + (hash01(seed + 4.0) - 0.5) * 1.2, 0.76 + hash01(seed + 5.0) * 0.86, seed);
    }

    for (let i = 0; i < 48; i += 1) {
      const seed = i * 19.83 + 62.0;
      const angle = i * goldenAngle * 1.21 + (hash01(seed) - 0.5) * 0.58;
      const radial = 0.16 + Math.pow(hash01(seed + 1.0), 0.92) * 0.56;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 4.2, (hash01(seed + 3.0) - 0.5) * 0.04);
      if (nearMainCamp(place[0], place[2], 1.90)) continue;
      if (hash01(seed + 9.0) > environmentDensityAt(place[0], place[2], 11.0)) continue;
      if (hash01(seed + 4.0) > 0.46) {
        addSapling(place[0], place[2], angle + Math.PI, 0.74 + hash01(seed + 5.0) * 0.56, seed);
      } else {
        addLowBush(place[0], place[2], angle, 0.82 + hash01(seed + 6.0) * 0.54, seed);
      }
    }

    for (let i = 0; i < 42; i += 1) {
      const seed = i * 23.7 + 91.0;
      const angle = i * 1.731 + hash01(seed) * 0.55;
      const radial = 0.12 + hash01(seed + 1.0) * 0.68;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 3.8, (hash01(seed + 3.0) - 0.5) * 0.05);
      if (nearMainCamp(place[0], place[2], 2.2)) continue;
      if (hash01(seed + 11.0) > environmentDensityAt(place[0], place[2], 23.0) + 0.18) continue;
      addFieldStone(place[0], place[2], angle + hash01(seed + 4.0) * Math.PI, 0.52 + hash01(seed + 5.0) * 0.72, seed);
      if (hash01(seed + 6.0) > 0.62) {
        addFieldStone(
          place[0] + Math.cos(angle + 1.4) * (0.52 + hash01(seed + 7.0) * 0.72),
          place[2] + Math.sin(angle + 1.4) * (0.52 + hash01(seed + 8.0) * 0.72),
          angle - 0.4,
          0.34 + hash01(seed + 9.0) * 0.48,
          seed + 10.0
        );
      }
    }

    for (let i = 0; i < 14; i += 1) {
      const seed = i * 29.1 + 203.0;
      const angle = i * 2.09 + (hash01(seed) - 0.5) * 0.44;
      const radial = 0.20 + hash01(seed + 1.0) * 0.54;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 3.2, 0);
      if (nearMainCamp(place[0], place[2], 2.8)) continue;
      addFallenLog(place[0], place[2], angle + Math.PI / 2 + (hash01(seed + 3.0) - 0.5) * 1.2, 0.72 + hash01(seed + 4.0) * 0.72);
    }

    const campEdgeShrubs = [
      [-3.45, -1.98, -0.28, 0.82, 901.0],
      [3.22, -2.10, 0.54, 0.74, 912.0],
      [-2.75, 1.76, 1.10, 0.66, 923.0],
      [2.88, 1.42, -1.22, 0.72, 934.0]
    ];
    for (const shrub of campEdgeShrubs) {
      addLowBush(shrub[0], shrub[1], shrub[2], shrub[3], shrub[4]);
    }

    for (let i = 0; i < 34; i += 1) {
      const seed = i * 12.77 + 1601.0;
      const ring = 4.0 + hash01(seed + 1.0) * 4.6;
      const angle = hash01(seed + 2.0) * Math.PI * 2;
      const x = characterAnchors.startOrigin[0] + Math.cos(angle) * ring * (0.84 + hash01(seed + 3.0) * 0.38);
      const z = characterAnchors.startOrigin[2] + Math.sin(angle) * ring * (0.70 + hash01(seed + 4.0) * 0.46);
      if (!shorelineModel.containsPoint(x, z, 2.0) || nearMainCamp(x, z, 2.0)) continue;
      if (hash01(seed + 5.0) > environmentDensityAt(x, z, 41.0) + 0.16) continue;
      if (hash01(seed + 6.0) > 0.54) addLowBush(x, z, angle + Math.PI, 0.46 + hash01(seed + 7.0) * 0.46, seed);
      else addFieldStone(x, z, angle, 0.24 + hash01(seed + 8.0) * 0.36, seed);
    }
  }

  function makeInstance(position, itemScale, rotation) {
    return {
      matrix: modelMatrix({
        position,
        scale: itemScale || [1, 1, 1],
        rotation: rotation || [0, 0, 0]
      }, 0),
      center: position
    };
  }

  function addInstancedScatter() {
    if (!instancing) return;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const grass = [];
    const rocks = [];
    const trunks = [];
    const canopies = [];

    for (let i = 0; i < 560; i += 1) {
      const seed = i * 13.17 + 4001.0;
      const angle = i * goldenAngle + (hash01(seed) - 0.5) * 0.80;
      const radial = 0.10 + Math.pow(hash01(seed + 1.0), 0.88) * 0.70;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 5.6, (hash01(seed + 3.0) - 0.5) * 0.05);
      if (!shorelineModel.containsPoint(place[0], place[2], 2.2) || nearMainCamp(place[0], place[2], 3.0)) continue;
      if (hash01(seed + 10.0) > environmentDensityAt(place[0], place[2], 65.0) + 0.22) continue;
      const size = 0.36 + hash01(seed + 4.0) * 0.58;
      grass.push(makeInstance(
        [place[0], place[1] + 0.18 * size, place[2]],
        [0.72 * size, 0.46 * size, 0.68 * size],
        [0.04, angle + hash01(seed + 5.0) * Math.PI, -0.03]
      ));
    }

    for (let i = 0; i < 190; i += 1) {
      const seed = i * 17.67 + 5001.0;
      const angle = i * goldenAngle * 1.37 + (hash01(seed) - 0.5) * 0.66;
      const radial = 0.14 + Math.pow(hash01(seed + 1.0), 1.06) * 0.66;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 4.8, 0);
      if (!shorelineModel.containsPoint(place[0], place[2], 1.7) || nearMainCamp(place[0], place[2], 3.1)) continue;
      if (hash01(seed + 10.0) > environmentDensityAt(place[0], place[2], 75.0) + 0.24) continue;
      const size = 0.26 + hash01(seed + 3.0) * 0.60;
      rocks.push(makeInstance(
        [place[0], place[1] + 0.12 * size, place[2]],
        [size * (0.68 + hash01(seed + 4.0) * 0.42), size * (0.34 + hash01(seed + 5.0) * 0.28), size * (0.58 + hash01(seed + 6.0) * 0.48)],
        [(hash01(seed + 7.0) - 0.5) * 0.22, angle, (hash01(seed + 8.0) - 0.5) * 0.18]
      ));
    }

    for (let i = 0; i < 112; i += 1) {
      const seed = i * 19.91 + 6001.0;
      const angle = i * goldenAngle * 1.12 + (hash01(seed) - 0.5) * 0.52;
      const radial = 0.32 + Math.pow(hash01(seed + 1.0), 0.78) * 0.44;
      const place = terrainPlacement(radial, angle, (hash01(seed + 2.0) - 0.5) * 3.8, 0);
      if (!shorelineModel.containsPoint(place[0], place[2], 2.6) || nearMainCamp(place[0], place[2], 4.2)) continue;
      if (hash01(seed + 10.0) > environmentDensityAt(place[0], place[2], 85.0) + 0.10) continue;
      const size = 0.52 + hash01(seed + 3.0) * 0.48;
      const yaw = angle + Math.PI + (hash01(seed + 4.0) - 0.5) * 0.9;
      trunks.push(makeInstance([place[0], place[1] + 0.44 * size, place[2]], [0.42 * size, 0.92 * size, 0.42 * size], [0.04, yaw, -0.03]));
      canopies.push(makeInstance([place[0], place[1] + 1.24 * size, place[2]], [0.72 * size, 0.54 * size, 0.76 * size], [0.06, yaw, -0.04]));
    }

    if (grass.length) instancedRenderGroups.push(instancing.createGroup(meshes.bushSoft, grass, { material: 15, maxDistance: 82, lodDistance: 46 }));
    if (rocks.length) instancedRenderGroups.push(instancing.createGroup(meshes.rock, rocks, { maxDistance: 86, lodDistance: 50 }));
    if (trunks.length) instancedRenderGroups.push(instancing.createGroup(meshes.trunkUpper, trunks, { maxDistance: 88, lodDistance: 54 }));
    if (canopies.length) instancedRenderGroups.push(instancing.createGroup(meshes.leavesHaze, canopies, { maxDistance: 88, lodDistance: 54 }));
  }

  function localPoint(origin, local, yaw) {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    return [
      origin[0] + local[0] * c + local[2] * s,
      origin[1] + local[1],
      origin[2] - local[0] * s + local[2] * c
    ];
  }

  function addLocal(mesh, origin, local, itemScale, rotation, yaw, material, transparent, motion) {
    const spin = rotation || [0, 0, 0];
    return add(
      mesh,
      localPoint(origin, local, yaw),
      itemScale,
      [spin[0] || 0, yaw + (spin[1] || 0), spin[2] || 0],
      material,
      transparent,
      motion
    );
  }

  function addHangingReceipt(position, yaw, size, tilt) {
    const scaleSize = size || 1;
    const spin = [Math.PI / 2 + (tilt || 0), yaw, (tilt || 0) * 0.35];
    add(meshes.string, [position[0], position[1] + 0.28 * scaleSize, position[2]], [1, 0.80 * scaleSize, 1]);
    const motion = { role: "receipt", phase: position[0] * 1.7 + position[2] * 2.3, side: Math.sign(Math.sin(yaw)) || 1 };
    add(meshes.receipt, position, [scaleSize, 1, scaleSize], spin, 0, false, motion);
    add(meshes.receiptLine, [position[0], position[1] + 0.08 * scaleSize, position[2] + 0.014], [0.82 * scaleSize, 1, 1], spin, 0, false, motion);
    add(meshes.receiptLine, [position[0], position[1] - 0.04 * scaleSize, position[2] + 0.014], [0.62 * scaleSize, 1, 1], spin, 0, false, motion);
  }

  function createBubbleBoyCharacter() {
    const origin = characterAnchors.startOrigin.slice();
    const yaw = characterAnchors.startYaw;
    const firstPartIndex = renderItems.length;
    const rootMotion = { role: "core", phase: 0.15 };
    const faceTurn = Math.PI;

    addLocal(meshes.softBubbleGlow, origin, [0.000, 0.520, -0.045], [0.84, 0.62, 0.78], [0, 0, 0], yaw, 14, true, rootMotion);
    addLocal(meshes.softBubbleBody, origin, [0.000, 0.590, 0.000], [1.04, 1.08, 1.00], [0.010, 0, 0], yaw, 10, true, rootMotion);

    addLocal(meshes.softCheek, origin, [-0.220, 0.570, -0.506], [1.00, 1.00, 1.00], [0.030, faceTurn, 0], yaw, 13, true, rootMotion);
    addLocal(meshes.softCheek, origin, [0.220, 0.570, -0.506], [1.00, 1.00, 1.00], [0.030, faceTurn, 0], yaw, 13, true, rootMotion);
    addLocal(meshes.softEye, origin, [-0.160, 0.710, -0.520], [1.00, 1.00, 1.00], [0.035, faceTurn, 0], yaw, 12, true, rootMotion);
    addLocal(meshes.softEye, origin, [0.160, 0.710, -0.520], [1.00, 1.00, 1.00], [0.035, faceTurn, 0], yaw, 12, true, rootMotion);
    addLocal(meshes.softMouth, origin, [0.000, 0.535, -0.528], [1.00, 1.00, 1.00], [0.025, faceTurn, 0], yaw, 12, true, rootMotion);
    addLocal(meshes.softEyeSpark, origin, [-0.188, 0.768, -0.535], [1.00, 1.00, 1.00], [0.035, faceTurn, 0], yaw, 11, true, rootMotion);
    addLocal(meshes.softEyeSpark, origin, [0.132, 0.768, -0.535], [1.00, 1.00, 1.00], [0.035, faceTurn, 0], yaw, 11, true, rootMotion);
    addLocal(meshes.softSpiral, origin, [0.000, 0.942, -0.498], [1.00, 1.00, 1.00], [-0.010, faceTurn, 0], yaw, 11, true, rootMotion);
    function baseLocalFor(item) {
      const dx = item.position[0] - origin[0];
      const dz = item.position[2] - origin[2];
      const c = Math.cos(yaw);
      const s = Math.sin(yaw);
      return [
        dx * c - dz * s,
        item.position[1] - origin[1],
        dx * s + dz * c
      ];
    }

    function faceRoleFor(item) {
      if (item.mesh === meshes.softEye) return "eye";
      if (item.mesh === meshes.softEyeSpark) return "spark";
      if (item.mesh === meshes.softMouth) return "mouth";
      if (item.mesh === meshes.softSpiral) return "spiral";
      if (item.mesh === meshes.softCheek) return "cheek";
      if (item.mesh === meshes.softBubbleGlow) return "glow";
      if (item.mesh === meshes.softBubbleBody) return "body";
      return "";
    }

    return {
      origin: origin.slice(),
      baseOrigin: origin.slice(),
      yaw,
      baseYaw: yaw,
      state: createBehaviorState(),
      focusTarget: {
        kind: "default",
        position: localPoint(origin, [0, 0.72, -1.2], yaw),
        strength: 0.2
      },
      behavior: {
        dominant: "observe",
        weights: {},
        gazeX: 0,
        gazeY: 0,
        bounce: 0,
        scan: 0,
        settle: 0
      },
      core: {
        breath: 0,
        energy: 0.42,
        leanX: 0,
        leanZ: 0,
        time: 0
      },
      parts: renderItems.slice(firstPartIndex).map((item) => ({
        item,
        baseLocal: baseLocalFor(item),
        basePosition: item.position.slice(),
        baseRotation: item.rotation.slice(),
        baseScale: item.scale.slice(),
        motion: item.motion || null,
        role: item.motion ? item.motion.role : "",
        faceRole: faceRoleFor(item),
        side: item.motion ? item.motion.side || 1 : 1,
        lagBreath: 0,
        lagLeanX: 0,
        lagLeanZ: 0
      }))
    };
  }

  function addWorkbench() {
    const origin = [-1.72, 0.58, -1.03];
    const yaw = -0.40;

    addLocal(meshes.benchTop, origin, [0, 0, 0], [1.58, 0.20, 0.72], [0, 0, 0], yaw);
    addLocal(meshes.benchDark, origin, [0, -0.15, -0.42], [1.64, 0.10, 0.09], [0, 0, 0], yaw);
    addLocal(meshes.benchDark, origin, [0, -0.15, 0.42], [1.64, 0.10, 0.09], [0, 0, 0], yaw);
    addLocal(meshes.benchDark, origin, [-0.78, -0.12, 0], [0.10, 0.10, 0.72], [0, 0, 0], yaw);
    addLocal(meshes.benchDark, origin, [0.78, -0.12, 0], [0.10, 0.10, 0.72], [0, 0, 0], yaw);

    for (const x of [-0.64, 0.64]) {
      for (const z of [-0.28, 0.28]) {
        addLocal(meshes.benchDark, origin, [x, -0.34, z], [0.13, 0.64, 0.13], [0.04 * Math.sign(z), 0, -0.05 * Math.sign(x)], yaw);
      }
    }

    addLocal(meshes.benchDark, origin, [0, -0.38, -0.34], [1.28, 0.07, 0.07], [0, 0, 0], yaw);
    addLocal(meshes.benchDark, origin, [0, -0.38, 0.34], [1.28, 0.07, 0.07], [0, 0, 0], yaw);
    addLocal(meshes.benchDark, origin, [-0.48, -0.23, -0.38], [0.90, 0.055, 0.055], [0, 0, 0.42], yaw);
    addLocal(meshes.benchDark, origin, [0.48, -0.23, 0.38], [0.90, 0.055, 0.055], [0, 0, -0.42], yaw);

    addLocal(meshes.paper, origin, [0.22, 0.13, -0.08], [1.20, 1, 1.08], [0.02, 0.12, 0], yaw, 0, false, { role: "loose-paper", phase: 0.9, side: 1 });
    addLocal(meshes.receiptLine, origin, [0.18, 0.155, -0.18], [1.10, 1, 1], [0.02, 0.12, 0], yaw, 0, false, { role: "loose-paper", phase: 0.9, side: 1 });
    addLocal(meshes.receiptLine, origin, [0.28, 0.155, -0.05], [0.82, 1, 1], [0.02, 0.12, 0], yaw, 0, false, { role: "loose-paper", phase: 0.9, side: 1 });
    addLocal(meshes.toolHandle, origin, [-0.38, 0.14, 0.12], [0.52, 0.045, 0.06], [0.02, 0.65, 0.06], yaw);
    addLocal(meshes.toolMetal, origin, [-0.58, 0.17, 0.20], [0.18, 0.08, 0.10], [0.02, 0.65, 0.06], yaw);
    addLocal(meshes.toolMetal, origin, [-0.08, 0.15, 0.24], [0.46, 0.035, 0.055], [0.02, -0.35, 0], yaw);
    addLocal(meshes.benchTop, origin, [0.62, 0.16, 0.14], [0.18, 0.16, 0.18], [0, 0.2, 0], yaw);
    addLocal(meshes.approval, origin, [-0.70, 0.22, -0.20], [0.82, 0.82, 0.82], [0, 0.35, 0], yaw);
    addLocal(meshes.lanternGlow, origin, [0.70, 0.36, -0.26], [0.54, 0.70, 0.54], [0, 0.12, 0], yaw, 4);
    addLocal(meshes.lanternFrame, origin, [0.70, 0.47, -0.26], [0.16, 0.024, 0.16], [0, 0.12, 0], yaw);
    addLocal(meshes.lanternFrame, origin, [0.70, 0.27, -0.26], [0.14, 0.024, 0.14], [0, 0.12, 0], yaw);
    addLocal(meshes.lanternFrame, origin, [0.60, 0.36, -0.26], [0.024, 0.20, 0.024], [0, 0.12, 0], yaw);
    addLocal(meshes.lanternFrame, origin, [0.80, 0.36, -0.26], [0.024, 0.20, 0.024], [0, 0.12, 0], yaw);
  }

  function addCampfire() {
    const center = [0.80, 0.32, -0.20];

    for (let i = 0; i < 13; i += 1) {
      const angle = i * 0.483 + 0.12;
      const radius = 0.52 + (i % 3) * 0.045;
      const x = center[0] + Math.cos(angle) * radius;
      const z = center[2] + Math.sin(angle) * radius;
      const ground = groundHeightAt(x, z);
      add(
        meshes.rock,
        [x, ground + 0.085, z],
        [0.26 + hash01(i + 12.0) * 0.12, 0.15 + hash01(i + 15.0) * 0.08, 0.23 + hash01(i + 18.0) * 0.10],
        [0.06 * Math.sin(angle), angle, 0.05 * Math.cos(angle)]
      );
    }

    for (let i = 0; i < 6; i += 1) {
      const angle = i * 1.047 + 0.28;
      const x = center[0] + Math.cos(angle) * 0.20;
      const z = center[2] + Math.sin(angle) * 0.17;
      add(meshes.log, [x, center[1] + 0.018 * (i % 2), z], [1.02, 1.04, 1.02], [Math.PI / 2, angle + Math.PI / 2, 0.10 * Math.sin(angle)]);
    }

    for (let i = 0; i < 8; i += 1) {
      const angle = i * 0.785;
      const radius = 0.13 + (i % 3) * 0.035;
      const coalMesh = i % 3 === 0 ? meshes.ember : meshes.coal;
      add(coalMesh, [center[0] + Math.cos(angle) * radius, 0.25, center[2] + Math.sin(angle) * radius], [0.85, 0.62, 0.85], [0, angle, 0]);
    }

    add(meshes.flame, [center[0], 0.67, center[2]], [0.70, 0.92, 0.70], [0, 0.16, 0], 4);
    add(meshes.flameInner, [center[0] - 0.05, 0.66, center[2] + 0.02], [0.82, 0.88, 0.82], [0, 0.84, 0], 4);
    add(meshes.flameInner, [center[0] + 0.08, 0.58, center[2] - 0.03], [0.62, 0.70, 0.62], [0.02, -0.55, 0], 4);
  }

  function addLanternPost() {
    const x = 1.58;
    const z = -1.08;
    const ground = groundHeightAt(x, z);
    add(meshes.trunkUpper, [x, ground + 0.66, z], [0.34, 1.28, 0.34], [0.03, -0.12, -0.04]);
    add(meshes.log, [x + 0.34, ground + 1.30, z], [0.36, 1.02, 0.36], [0, 0.02, Math.PI / 2]);
    add(meshes.string, [x + 0.75, ground + 1.08, z], [1, 0.62, 1]);
    add(meshes.lanternGlow, [x + 0.75, ground + 0.82, z], [1.0, 1.12, 1.0], [0, 0, 0], 4);
    add(meshes.lanternFrame, [x + 0.75, ground + 0.99, z], [0.26, 0.035, 0.26], [0, 0.18, 0]);
    add(meshes.lanternFrame, [x + 0.75, ground + 0.66, z], [0.24, 0.035, 0.24], [0, 0.18, 0]);
    add(meshes.lanternFrame, [x + 0.62, ground + 0.82, z], [0.035, 0.30, 0.035], [0, 0.18, 0]);
    add(meshes.lanternFrame, [x + 0.88, ground + 0.82, z], [0.035, 0.30, 0.035], [0, 0.18, 0]);
  }

  function addCampClutter() {
    const pileX = 2.22;
    const pileZ = -1.32;
    const ground = groundHeightAt(pileX, pileZ);
    for (let i = 0; i < 4; i += 1) {
      const offset = (i - 1.5) * 0.16;
      add(
        meshes.log,
        [pileX + offset, ground + 0.12 + i * 0.045, pileZ + (i % 2) * 0.10],
        [0.82, 1.36, 0.82],
        [Math.PI / 2 + 0.04 * (i % 2 ? -1 : 1), -0.76 + i * 0.16, 0.06]
      );
    }

    const crateX = -2.66;
    const crateZ = -0.38;
    const crateGround = groundHeightAt(crateX, crateZ);
    add(meshes.crate, [crateX, crateGround + 0.24, crateZ], [0.48, 0.48, 0.48], [0.04, 0.42, -0.03]);
    add(meshes.benchDark, [crateX, crateGround + 0.49, crateZ], [0.54, 0.035, 0.10], [0.04, 0.42, -0.03]);
    add(meshes.benchDark, [crateX, crateGround + 0.26, crateZ + 0.23], [0.50, 0.035, 0.08], [0.04, 0.42, -0.03]);
    add(meshes.logBook, [crateX - 0.08, crateGround + 0.56, crateZ - 0.08], [0.58, 0.58, 0.58], [0.05, 0.74, -0.04]);
    add(meshes.paper, [crateX + 0.16, crateGround + 0.58, crateZ + 0.04], [0.58, 1.0, 0.64], [0.09, 0.56, 0.03], 0, false, { role: "loose-paper", phase: 3.1, side: -1 });

    const matX = -0.72;
    const matZ = -1.72;
    const matGround = groundHeightAt(matX, matZ);
    add(meshes.rolledMat, [matX, matGround + 0.12, matZ], [1.0, 1.0, 1.0], [Math.PI / 2, -0.72, 0.02]);
    add(meshes.cup, [-0.54, groundHeightAt(-0.54, -1.42) + 0.11, -1.42], [0.82, 0.82, 0.82], [0.02, 0.34, -0.02]);
    add(meshes.paper, [-0.82, groundHeightAt(-0.82, -0.98) + 0.055, -0.98], [0.70, 1.0, 0.56], [0.05, -0.28, 0.02], 0, false, { role: "loose-paper", phase: 4.2, side: 1 });

    const seatLogs = [
      [-0.18, 0.78, 0.18, 0.74],
      [1.62, 0.92, -0.38, 0.68],
      [1.82, -1.86, -0.92, 0.72],
      [-0.92, -1.30, 0.58, 0.64]
    ];
    for (const seat of seatLogs) {
      const seatGround = groundHeightAt(seat[0], seat[1]);
      add(meshes.log, [seat[0], seatGround + 0.16, seat[1]], [1.04 * seat[3], 1.78 * seat[3], 1.04 * seat[3]], [Math.PI / 2 + 0.04, seat[2], 0.02]);
    }

    addFieldStone(2.88, 0.18, -0.60, 0.40, 519.0);
    addFieldStone(-2.96, 0.84, 0.76, 0.32, 541.0);
    addFieldStone(-3.12, -1.08, -0.18, 0.42, 552.0);
    addFieldStone(2.76, 1.04, 0.34, 0.36, 563.0);
    addLowBush(-3.34, -1.74, -0.20, 0.60, 574.0);
    addLowBush(3.10, 1.46, 1.10, 0.56, 585.0);
    addLowBush(-2.46, 1.58, 0.48, 0.48, 596.0);
  }

  function addForegroundTextureBand() {
    const logs = [
      [4.10, -4.78, -0.88, 0.86],
      [5.36, -4.18, -1.18, 0.62],
      [-4.52, -3.96, 0.64, 0.58]
    ];
    for (const log of logs) {
      if (shorelineModel.containsPoint(log[0], log[1], 1.4)) {
        addFallenLog(log[0], log[1], log[2], log[3]);
      }
    }

    const stones = [
      [3.46, -3.54, -0.20, 0.42, 1401.0],
      [5.88, -3.40, 0.72, 0.34, 1412.0],
      [-3.86, -3.12, 0.36, 0.36, 1423.0],
      [-5.46, -4.54, -0.64, 0.46, 1434.0],
      [2.72, -5.16, 0.18, 0.30, 1445.0]
    ];
    for (const stone of stones) {
      if (shorelineModel.containsPoint(stone[0], stone[1], 1.2)) {
        addFieldStone(stone[0], stone[1], stone[2], stone[3], stone[4]);
      }
    }

    const bushes = [
      [3.74, -4.36, -0.42, 0.54, 1456.0],
      [-4.24, -3.52, 0.58, 0.48, 1467.0],
      [6.20, -2.72, -1.10, 0.42, 1478.0]
    ];
    for (const bush of bushes) {
      if (shorelineModel.containsPoint(bush[0], bush[1], 1.4)) {
        addLowBush(bush[0], bush[1], bush[2], bush[3], bush[4]);
      }
    }
  }

  function addWarmPockets() {
    const fireflies = [
      [-2.52, 1.28, 1.54, 0.18],
      [-1.70, 1.56, 1.86, 0.14],
      [2.52, 1.32, 1.18, 0.16],
      [3.02, 1.08, -0.92, 0.13],
      [-2.96, 1.10, -1.26, 0.14],
      [0.40, 1.68, 2.36, 0.12],
      [2.04, 1.54, -2.16, 0.13],
      [-0.84, 1.32, -2.42, 0.12]
    ];
    for (let i = 0; i < fireflies.length; i += 1) {
      const fly = fireflies[i];
      add(
        meshes.lanternGlow,
        [fly[0], groundHeightAt(fly[0], fly[2]) + fly[1], fly[2]],
        [fly[3], fly[3] * 1.18, fly[3]],
        [0, i * 0.37, 0],
        4
      );
    }

    const glowCaps = [
      [-3.06, -1.86, 0.18],
      [2.94, 1.72, 0.16],
      [-2.34, 1.76, 0.14],
      [3.26, -1.42, 0.13]
    ];
    for (let i = 0; i < glowCaps.length; i += 1) {
      const cap = glowCaps[i];
      add(
        meshes.lanternGlow,
        [cap[0], groundHeightAt(cap[0], cap[1]) + 0.18, cap[1]],
        [cap[2], cap[2] * 0.72, cap[2]],
        [0, i * 0.9, 0],
        4
      );
    }
  }

  function addAmbientParticles() {
    for (let i = 0; i < 22; i += 1) {
      const seed = i * 8.73 + 2401.0;
      const angle = hash01(seed) * Math.PI * 2;
      const radius = 0.26 + hash01(seed + 1.0) * 1.80;
      const x = characterAnchors.fire[0] + Math.cos(angle) * radius * 0.78;
      const z = characterAnchors.fire[2] + Math.sin(angle) * radius * 0.58;
      const y = groundHeightAt(x, z) + 0.30 + hash01(seed + 2.0) * 0.42;
      const size = 0.045 + hash01(seed + 3.0) * 0.060;
      add(
        meshes.lanternGlow,
        [x, y, z],
        [size, size * 1.35, size],
        [0, angle, 0],
        4,
        true,
        {
          role: "ember",
          phase: hash01(seed + 4.0),
          speed: 0.8 + hash01(seed + 5.0) * 1.4,
          height: 0.6 + hash01(seed + 6.0) * 1.2,
          windScale: 0.50 + hash01(seed + 7.0) * 0.44
        }
      );
    }
  }

  function addReceiptTree() {
    const base = [1.52, 0.78, 1.36];

    add(meshes.trunk, base, [0.95, 1.02, 0.95], [0.04, 0.34, -0.08]);
    add(meshes.trunkUpper, [1.55, 1.38, 1.38], [0.92, 1.02, 0.92], [0.14, -0.10, 0.10]);
    add(meshes.branch, [1.22, 1.68, 1.33], [0.78, 0.86, 0.78], [0.84, 0.22, 0.74]);
    add(meshes.branch, [1.88, 1.74, 1.28], [0.82, 0.92, 0.82], [0.76, -0.42, -0.72]);
    add(meshes.branch, [1.55, 1.88, 1.72], [0.72, 0.88, 0.72], [0.98, 0.82, 0.16]);
    add(meshes.twig, [1.42, 1.58, 0.98], [0.78, 0.88, 0.78], [0.70, -0.06, 0.20]);
    add(meshes.twig, [1.74, 1.92, 1.08], [0.70, 0.78, 0.70], [0.86, -0.52, -0.34]);

    add(meshes.leaves, [1.08, 2.16, 1.34], [0.78, 0.58, 0.70], [0.08, 0.2, -0.10], 0, false, { role: "leaf", phase: 0.2 });
    add(meshes.leaves, [1.94, 2.18, 1.28], [0.72, 0.62, 0.78], [-0.04, -0.28, 0.08], 0, false, { role: "leaf", phase: 1.1 });
    add(meshes.leaves, [1.54, 2.35, 1.78], [0.66, 0.54, 0.74], [0.12, 0.62, 0], 0, false, { role: "leaf", phase: 1.8 });
    add(meshes.leaves, [1.46, 2.18, 0.96], [0.58, 0.48, 0.58], [0, -0.12, 0.10], 0, false, { role: "leaf", phase: 2.6 });
    add(meshes.leaves, [1.54, 2.50, 1.42], [0.50, 0.38, 0.56], [-0.10, 0.42, -0.08], 0, false, { role: "leaf", phase: 3.4 });

    addHangingReceipt([1.03, 1.70, 1.42], -0.35, 0.82, -0.07);
    addHangingReceipt([1.96, 1.82, 1.18], 0.24, 0.78, 0.06);
    addHangingReceipt([1.37, 1.92, 1.84], 0.70, 0.72, -0.04);
    addHangingReceipt([1.38, 1.58, 0.94], -0.10, 0.70, 0.08);
    addHangingReceipt([1.73, 2.02, 1.04], -0.56, 0.64, -0.02);
    addHangingReceipt([1.18, 2.02, 1.22], 0.36, 0.58, 0.04);
    addHangingReceipt([1.72, 2.12, 1.70], 0.92, 0.58, -0.06);
  }

  function addStateObjects() {
    const objects = Array.isArray(toyboxState.objects) ? toyboxState.objects : [];
    let proposalCount = 3;
    let approvalCount = 1;
    let logCount = 4;
    for (const item of objects) {
      if (item && item.type === "proposal") proposalCount = Number(item.count) || proposalCount;
      if (item && item.type === "approval") approvalCount = Number(item.count) || approvalCount;
      if (item && item.type === "log") logCount = Number(item.count) || logCount;
    }
    for (let i = 0; i < Math.min(proposalCount, 8); i += 1) {
      add(meshes.paper, [-0.96 + i * 0.11, 0.23 + i * 0.025, 1.84], [0.95, 1, 1.12], [0.08, -0.62 + i * 0.11, 0], 0, false, { role: "loose-paper", phase: i * 0.47, side: i % 2 ? -1 : 1 });
    }
    for (let i = 0; i < Math.min(logCount, 8); i += 1) {
      add(meshes.logBook, [-2.0 + i * 0.12, 0.23 + i * 0.04, 0.88], [1, 1, 1], [0, 0.45, 0]);
    }
    for (let i = 0; i < Math.min(approvalCount, 6); i += 1) {
      add(meshes.approval, [2.38 - i * 0.2, 0.25, -0.9 + i * 0.12], [1, 1, 1], [0, i * 0.5, 0]);
    }
  }

  const bubbleBoy = createBubbleBoyCharacter();
  addWorkbench();
  addCampfire();
  addLanternPost();
  addCampClutter();
  addForegroundTextureBand();
  addWarmPockets();
  addAmbientParticles();
  addReceiptTree();
  addStateObjects();
  await addConfiguredAssets();
  addLargeWorldScatter();
  addForestDepthLayer();
  addForegroundFrameTrees();
  addShoreRocks();
  addInstancedScatter();
  add(meshes.wetShore, [0, 0.018, 0], [1, 1, 1], [0, 0, 0], 7, true);
  add(meshes.foam, [0, 0.02, 0], [1, 1, 1], [0, 0, 0], 2, true);
  add(meshes.spray, [0, 0.02, 0], [1, 1, 1], [0, 0, 0], 3, true);

  const physicsStone = add(
    meshes.physicsStone,
    [-1.14, 1.28, -0.72],
    [1, 1, 1],
    [0.22, -0.18, 0.12]
  );

  let physics = null;
  let physicsStoneBody = null;
  let physicsStatus = "initializing";
  try {
    physics = await createPhysicsWorld({ gravity: { x: 0, y: -9.81, z: 0 } });
    physics.addStaticCollider({
      name: "island-core",
      position: [0, 0.02, 0],
      shape: { type: "cylinder", halfHeight: 0.22, radius: PLAYABLE_RADIUS },
      friction: 0.92,
      restitution: 0.03
    });
    physics.addStaticCollider({
      name: "workbench-side-plateau",
      position: [-1.42, 0.08, -1.02],
      shape: { type: "cuboid", halfExtents: [0.96, 0.16, 0.82] },
      friction: 0.96,
      restitution: 0.02
    });
    physics.addStaticCollider({
      name: "camp-side-plateau",
      position: [0.92, 0.09, -0.10],
      shape: { type: "cuboid", halfExtents: [0.88, 0.15, 0.72] },
      friction: 0.96,
      restitution: 0.02
    });
    physicsStoneBody = physics.addDynamicBody({
      name: "settling-stone",
      mesh: physicsStone,
      position: physicsStone.position,
      shape: { type: "ball", radius: 0.18 },
      density: 1.6,
      friction: 0.86,
      restitution: 0.08,
      linearDamping: 0.12,
      angularDamping: 0.20,
      affectsWind: true,
      windArea: 0.035
    });
    addDebug(meshes.debugCylinder, [0, 0.02, 0], [PLAYABLE_RADIUS, 0.44, PLAYABLE_RADIUS], [0, 0, 0], 7);
    addDebug(meshes.debugBox, [-1.42, 0.08, -1.02], [1.92, 0.32, 1.64], [0, 0, 0], 7);
    addDebug(meshes.debugBox, [0.92, 0.09, -0.10], [1.76, 0.30, 1.44], [0, 0, 0], 7);
    physicsStatus = `${physics.engine} ${physics.version}`;
  } catch (error) {
    physicsStatus = "physics unavailable";
    physicsStone.position = [-1.14, 0.44, -0.72];
    console.warn("Toybox physics could not initialize.", error);
  }

  const debugToggle = document.getElementById("toybox-debug-toggle");
  const debugPanel = document.getElementById("toybox-debug-panel");
  const debugController = createDebugController({ toggle: debugToggle, panel: debugPanel });

  function updateDebugPanel(time, wind) {
    const stoneY = physicsStoneBody ? physicsStoneBody.body.translation().y.toFixed(2) : physicsStone.position[1].toFixed(2);
    debugController.update([
      `physics: ${physicsStatus}`,
      `colliders: ${physics ? physics.colliders.length : 0}`,
      `dynamic bodies: ${physics ? physics.dynamicBodies.length : 0}`,
      `stone y: ${stoneY}`,
      `time: ${env.phaseName} ${env.timeOfDay.toFixed(3)}`,
      `wind: ${wind.x.toFixed(2)}, ${wind.z.toFixed(2)} gust ${wind.gust.toFixed(2)}`,
      `world: fire ${env.world.fireIntensity.toFixed(2)} ambient ${env.world.ambientEnergy.toFixed(2)} emotion ${env.world.emotionalField.toFixed(2)}`,
      `shore test: ${shorelineModel.signedDistance(physicsStone.position[0], physicsStone.position[2]).toFixed(2)}`
    ]);
  }

  const opaqueRenderItems = renderItems.filter((entry) => !entry.transparent);
  const transparentRenderItems = renderItems.filter((entry) => entry.transparent);

  const BUBBLE_BOY_FIRE = characterAnchors.fire;
  const BUBBLE_BOY_MOTION_FOCUS_ROLES = new Set(["leaf", "grass", "receipt", "loose-paper", "ember"]);

  function smoothMotionValue(current, target, deltaSeconds, speed) {
    return current + (target - current) * (1 - Math.exp(-deltaSeconds * speed));
  }

  function syncBubbleBoyBehaviorTrace() {
    const state = bubbleBoy.state;
    const focus = bubbleBoy.focusTarget || { kind: "default", strength: 0 };
    const behavior = bubbleBoy.behavior || { dominant: "observe" };
    canvas.dataset.bubbleBoyBrain = "continuous-behavior";
    canvas.dataset.bubbleBoyAttention = state.attention.toFixed(2);
    canvas.dataset.bubbleBoyCuriosity = state.curiosity.toFixed(2);
    canvas.dataset.bubbleBoyComfort = state.comfort.toFixed(2);
    canvas.dataset.bubbleBoyStimulus = state.stimulus.toFixed(2);
    canvas.dataset.bubbleBoyFocus = focus.kind;
    canvas.dataset.bubbleBoyFocusStrength = focus.strength.toFixed(2);
    canvas.dataset.bubbleBoyBehavior = behavior.dominant;
    canvas.dataset.bubbleBoyIntent = "present";
  }

  function syncWorldBusTrace() {
    const world = env.world;
    canvas.dataset.worldTimeOfDay = world.timeOfDay.toFixed(3);
    canvas.dataset.worldWindStrength = world.windStrength.toFixed(3);
    canvas.dataset.worldFireIntensity = world.fireIntensity.toFixed(2);
    canvas.dataset.worldAmbientEnergy = world.ambientEnergy.toFixed(2);
    canvas.dataset.worldEmotionalField = world.emotionalField.toFixed(2);
  }

  function rotateLocalPitchRoll(local, pivot, pitch, roll) {
    let x = local[0] - pivot[0];
    let y = local[1] - pivot[1];
    let z = local[2] - pivot[2];
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const pitchedY = y * cp - z * sp;
    const pitchedZ = y * sp + z * cp;
    y = pitchedY;
    z = pitchedZ;
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    const rolledX = x * cr - y * sr;
    const rolledY = x * sr + y * cr;
    x = rolledX;
    y = rolledY;
    return [x + pivot[0], y + pivot[1], z + pivot[2]];
  }

  function bubbleBoyLocalToWorld(local, yaw) {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    return [
      bubbleBoy.origin[0] + local[0] * c + local[2] * s,
      bubbleBoy.origin[1] + local[1],
      bubbleBoy.origin[2] - local[0] * s + local[2] * c
    ];
  }

  function bubbleBoyDefaultFocusPoint() {
    return bubbleBoyLocalToWorld([0, 0.72, -1.28], bubbleBoy.baseYaw);
  }

  function fireCoherenceForBubbleBoy() {
    const distance = Math.hypot(bubbleBoy.origin[0] - BUBBLE_BOY_FIRE[0], bubbleBoy.origin[2] - BUBBLE_BOY_FIRE[2]);
    const proximity = 1 - smoothstep(1.15, 4.40, distance);
    const fireStrength = clamp((env.world.fireIntensity - 0.82) / 1.04, 0, 1);
    return clamp(proximity * 0.56 + fireStrength * 0.44, 0, 1);
  }

  function emitBubbleBoyPresenceToWorld() {
    const world = env.world;
    const state = bubbleBoy.state;
    const fireCoherence = fireCoherenceForBubbleBoy();
    const curiousPressure = state.curiosity * 0.01;
    const stimulusPressure = state.stimulus * 0.006;
    const calmStabilizer = state.comfort * fireCoherence * 0.012;
    const fieldTarget = clamp(
      world.emotionalField + curiousPressure + stimulusPressure - calmStabilizer,
      0.04,
      0.82
    );
    const ambientTarget = clamp(
      world.ambientEnergy + state.curiosity * 0.010 + state.stimulus * 0.006 + fireCoherence * 0.004 - state.comfort * 0.002,
      0.08,
      0.72
    );
    const fireTarget = clamp(
      world.fireIntensity + state.stimulus * 0.012 + state.comfort * fireCoherence * 0.004 - world.emotionalField * 0.006,
      0.82,
      1.86
    );

    world.emotionalField = worldLerp(world.emotionalField, fieldTarget);
    world.ambientEnergy = worldLerp(world.ambientEnergy, ambientTarget);
    world.fireIntensity = worldLerp(world.fireIntensity, fireTarget);
    syncWorldBusTrace();
  }

  function yawToFocusPoint(point) {
    const dx = point[0] - bubbleBoy.origin[0];
    const dz = point[2] - bubbleBoy.origin[2];
    return Math.atan2(-dx, -dz);
  }

  function nearestMotionFocus(envState) {
    const motionAmount = clamp(
      (envState.windStrength || 0) * 1.16 +
        (((envState.wind && envState.wind.gust) || 0.58) - 0.58) * 0.55 +
        (envState.emotionalField || 0) * 0.16,
      0,
      1
    );
    if (motionAmount < 0.08) return null;

    let best = null;
    for (const item of renderItems) {
      if (!item.motion || !BUBBLE_BOY_MOTION_FOCUS_ROLES.has(item.motion.role)) continue;
      const dx = item.position[0] - bubbleBoy.origin[0];
      const dz = item.position[2] - bubbleBoy.origin[2];
      const distance = Math.hypot(dx, dz);
      if (distance > 7.2) continue;
      const roleWeight = item.motion.role === "receipt" || item.motion.role === "loose-paper"
        ? 1.12
        : item.motion.role === "ember"
          ? 0.94
          : 0.72;
      const score = (motionAmount * roleWeight) / (0.82 + distance * 0.32);
      if (!best || score > best.score) {
        best = {
          kind: "environment",
          position: [item.position[0], item.position[1] + 0.22, item.position[2]],
          strength: clamp(score * 1.45, 0, 0.72),
          score
        };
      }
    }
    return best;
  }

  function computeBubbleBoyFocus(envState) {
    const state = bubbleBoy.state;
    const time = envState.time || 0;
    const fireIntensity = clamp(envState.fireIntensity || 0, 0, 1);
    const fireCoherence = clamp(envState.fireCoherence == null ? fireIntensity : envState.fireCoherence, 0, 1);
    const emotionalField = clamp(envState.emotionalField || 0, 0, 1);
    const firePulse = 0.5 + Math.sin(time * 4.2) * 0.5;
    const firePull = clamp(0.32 + fireIntensity * 0.38 + fireCoherence * 0.24 + firePulse * fireIntensity * 0.10 - emotionalField * 0.035, 0, 1);
    const playerPosition = envState.playerPosition || [camera.target[0], camera.target[1], camera.target[2]];
    const playerNear = 1 - smoothstep(1.4, 8.4, envState.playerDistance == null ? 8 : envState.playerDistance);
    const playerPull = clamp((envState.playerActive ? 0.74 : 0.06) + playerNear * 0.22 + state.stimulus * 0.12, 0, 1);
    const motionFocus = nearestMotionFocus(envState);
    const defaultFocus = {
      kind: "default",
      position: bubbleBoyDefaultFocusPoint(),
      strength: 0.18
    };

    let nextFocus = defaultFocus;
    if (firePull > 0.38 && !(envState.playerActive && playerPull > firePull + 0.08)) {
      nextFocus = {
        kind: "fire",
        position: [BUBBLE_BOY_FIRE[0], groundHeightAt(BUBBLE_BOY_FIRE[0], BUBBLE_BOY_FIRE[2]) + 0.52, BUBBLE_BOY_FIRE[2]],
        strength: firePull
      };
    } else if (playerPull > 0.34) {
      nextFocus = {
        kind: "player",
        position: playerPosition.slice(),
        strength: playerPull
      };
    } else if (motionFocus && motionFocus.strength > 0.16) {
      nextFocus = motionFocus;
    }

    bubbleBoy.focusTarget = nextFocus;
    return nextFocus;
  }

  function normalizeBehaviorWeights(scores) {
    const names = Object.keys(scores);
    let total = 0;
    let dominant = "observe";
    let dominantScore = -Infinity;
    for (const name of names) {
      const score = Math.max(0, scores[name]);
      scores[name] = score;
      total += score;
      if (score > dominantScore) {
        dominant = name;
        dominantScore = score;
      }
    }
    if (total <= 0.0001) {
      return {
        dominant: "observe",
        weights: {
          gaze_follow: 0,
          slow_turn: 0,
          sway_alignment: 0,
          settle: 0,
          micro_bounce: 0,
          observe: 1
        }
      };
    }
    const weights = {};
    for (const name of names) weights[name] = scores[name] / total;
    return { dominant, weights };
  }

  function updateBubbleBoyBehavior(deltaSeconds, envState) {
    const state = updateBehaviorState(bubbleBoy.state, deltaSeconds, envState);
    const focus = computeBubbleBoyFocus(envState);
    const time = envState.time || 0;
    const fireIntensity = clamp(envState.fireIntensity || 0, 0, 1);
    const fireCoherence = clamp(envState.fireCoherence == null ? fireIntensity : envState.fireCoherence, 0, 1);
    const emotionalField = clamp(envState.emotionalField || 0, 0, 1);
    const ambientEnergy = clamp(envState.ambientEnergy == null ? 0.34 : envState.ambientEnergy, 0, 1);
    const windStrength = clamp(envState.windStrength || 0, 0, 1);
    const focusEnergy = clamp(state.attention * 0.78 + focus.strength * 0.22, 0, 1);
    const quietPresence = clamp(state.comfort * (1 - state.stimulus * 0.36), 0, 1);
    const twilightBias = envState.timeOfDay === "twilight" ? 1 : envState.timeOfDay === "dawn" ? 0.38 : 0;
    const scores = {
      gaze_follow:
        0.20 +
        focusEnergy * 0.44 +
        fireCoherence * 0.10 +
        state.curiosity * 0.14 +
        (focus.kind === "player" ? 0.16 : 0) +
        (focus.kind === "fire" ? 0.08 : 0),
      slow_turn:
        0.05 +
        state.curiosity * (1 - state.stimulus * 0.58) * (0.20 + (envState.dayFactor || 0) * 0.08) +
        twilightBias * emotionalField * 0.07 +
        (focus.kind === "environment" || focus.kind === "default" ? 0.08 : 0),
      sway_alignment:
        0.10 +
        state.comfort * 0.30 +
        windStrength * (0.12 + emotionalField * 0.06) +
        fireIntensity * 0.08,
      settle:
        0.08 +
        quietPresence * 0.24 +
        fireCoherence * 0.13 +
        (envState.nightFactor || 0) * 0.06 +
        (1 - Math.abs(angleDistance(bubbleBoy.yaw, bubbleBoy.baseYaw)) / 0.45) * 0.05,
      micro_bounce:
        0.025 +
        state.curiosity * 0.16 +
        state.stimulus * 0.24 +
        (((envState.wind && envState.wind.gust) || 0.58) - 0.58) * 0.08 +
        emotionalField * 0.05,
      observe:
        0.12 +
        focusEnergy * 0.22 +
        quietPresence * 0.22 +
        fireCoherence * 0.08 +
        ambientEnergy * 0.04 +
        (0.5 + Math.sin(time * 0.12 + 0.7) * 0.5) * 0.04
    };
    const behavior = normalizeBehaviorWeights(scores);

    const focusYaw = yawToFocusPoint(focus.position);
    const focusDelta = angleDistance(focusYaw, bubbleBoy.baseYaw);
    const slowTurn =
      Math.sin(time * (0.09 + state.curiosity * 0.04) + state.curiosity * 1.7) *
      0.09 *
      behavior.weights.slow_turn *
      (1 - state.stimulus * 0.42) *
      (1 - fireCoherence * 0.24);
    const focusYawBias = clamp(focusDelta, -0.58, 0.58) * (0.20 + state.attention * 0.30);
    const targetYaw = bubbleBoy.baseYaw + focusYawBias + slowTurn;
    bubbleBoy.yaw = smoothMotionValue(
      bubbleBoy.yaw,
      targetYaw,
      deltaSeconds,
      0.72 + state.attention * 1.50 + state.stimulus * 1.35
    );

    const gazeError = clamp(angleDistance(focusYaw, bubbleBoy.yaw), -0.62, 0.62);
    const faceY = bubbleBoy.origin[1] + 0.72;
    const verticalError = clamp((focus.position[1] - faceY) * 0.55, -0.34, 0.34);
    const scan =
      Math.sin(time * (0.18 + state.stimulus * 0.08) + state.curiosity * 2.0) *
      0.012 *
      (behavior.weights.observe + behavior.weights.slow_turn * 0.72);
    const targetGazeX =
      gazeError *
        (0.046 + state.attention * 0.026 + state.curiosity * 0.010) *
        (0.72 + behavior.weights.gaze_follow * 0.85) +
      scan;
    const targetGazeY = verticalError * (0.020 + state.attention * 0.018);
    const bounceWave = Math.max(0, Math.sin(time * (3.2 + state.stimulus * 2.6) + state.curiosity * 2.8));
    const targetBounce = bounceWave * (0.006 + state.curiosity * 0.010 + state.stimulus * 0.012 + emotionalField * 0.005) * behavior.weights.micro_bounce * (1 - fireCoherence * 0.18);

    bubbleBoy.behavior.dominant = behavior.dominant;
    bubbleBoy.behavior.weights = behavior.weights;
    bubbleBoy.behavior.gazeX = smoothMotionValue(bubbleBoy.behavior.gazeX, targetGazeX, deltaSeconds, 5.6 + state.stimulus * 6.5);
    bubbleBoy.behavior.gazeY = smoothMotionValue(bubbleBoy.behavior.gazeY, targetGazeY, deltaSeconds, 4.8 + state.attention * 5.0);
    bubbleBoy.behavior.bounce = smoothMotionValue(bubbleBoy.behavior.bounce, targetBounce, deltaSeconds, 6.0 + state.stimulus * 7.0);
    bubbleBoy.behavior.scan = scan;
    bubbleBoy.behavior.settle = behavior.weights.settle;
    syncBubbleBoyBehaviorTrace();
    return state;
  }

  function createBubbleBoyEnvState(time, wind) {
    const world = env.world;
    const fireDistance = Math.hypot(bubbleBoy.origin[0] - BUBBLE_BOY_FIRE[0], bubbleBoy.origin[2] - BUBBLE_BOY_FIRE[2]);
    const fireNear = 1 - smoothstep(1.15, 4.40, fireDistance);
    const fireCoherence = clamp(fireNear * 0.58 + ((world.fireIntensity - 0.82) / 1.04) * 0.42, 0, 1);
    const firePulse = env.fireIntensity * (
      0.82 +
      Math.sin(time * 4.2) * (0.08 + world.emotionalField * 0.035) +
      (wind.gust || 0) * 0.035 +
      world.ambientEnergy * 0.025
    );
    const playerActive = pressedKeys.size > 0 || camera.dragging || performance.now() - camera.lastInteraction < 1250;
    const playerDistance = Math.hypot(camera.target[0] - bubbleBoy.origin[0], camera.target[2] - bubbleBoy.origin[2]);
    return {
      time,
      wind,
      fireIntensity: clamp(fireNear * firePulse * (0.88 + fireCoherence * 0.12), 0, 1),
      windStrength: clamp(env.windStrength * 0.72 + world.windStrength * 0.28, 0, 1),
      ambientEnergy: world.ambientEnergy,
      emotionalField: world.emotionalField,
      fireCoherence,
      playerActive,
      playerDistance,
      playerPosition: camera.target.slice(),
      timeOfDay: env.phaseName,
      cycleTimeOfDay: env.timeOfDay,
      dayFactor: env.dayFactor,
      nightFactor: env.nightFactor
    };
  }

  function updateBubbleBoyMotion(deltaSeconds, envState) {
    const core = bubbleBoy.core;
    const state = bubbleBoy.state;
    const behavior = bubbleBoy.behavior;
    const weights = behavior.weights || {};
    const nightFactor = envState.nightFactor == null
      ? (envState.timeOfDay === "night" ? 1 : envState.timeOfDay === "twilight" ? 0.35 : 0)
      : clamp(envState.nightFactor, 0, 1);
    const dayFactor = clamp(envState.dayFactor || 0, 0, 1);
    const fireIntensity = clamp(envState.fireIntensity || 0, 0, 1);
    const fireCoherence = clamp(envState.fireCoherence == null ? fireIntensity : envState.fireCoherence, 0, 1);
    const emotionalField = clamp(envState.emotionalField || 0, 0, 1);
    const ambientEnergy = clamp(envState.ambientEnergy == null ? 0.34 : envState.ambientEnergy, 0, 1);
    const playerDistance = envState.playerDistance == null ? 8 : envState.playerDistance;
    const playerNear = 1 - smoothstep(1.8, 8.0, playerDistance);
    const focusedBreath = 1 - state.attention * (0.28 + fireCoherence * 0.10);
    const behaviorPresence = Math.max(
      weights.gaze_follow || 0,
      weights.slow_turn || 0,
      weights.sway_alignment || 0,
      weights.settle || 0,
      weights.micro_bounce || 0,
      weights.observe || 0
    );
    const targetEnergy = clamp(
      0.18 +
        fireIntensity * 0.16 +
        fireCoherence * 0.06 +
        state.curiosity * (0.11 + dayFactor * 0.09 + ambientEnergy * 0.04) +
        state.stimulus * (0.14 + emotionalField * 0.05) +
        state.comfort * 0.06 +
        playerNear * 0.04 -
        nightFactor * (0.10 + fireCoherence * 0.03),
      0.12,
      0.86
    );
    const energySpeed = envState.playerActive ? 8.0 : 1.35;
    core.energy = smoothMotionValue(core.energy, targetEnergy, deltaSeconds, energySpeed);

    const breathSpeed = clamp(0.68 + core.energy * 0.66 + state.stimulus * 0.15 + ambientEnergy * 0.08 - nightFactor * 0.14 - fireCoherence * 0.04, 0.48, 1.40);
    const breathAmplitude = clamp(
      (0.010 + state.comfort * 0.017 + core.energy * 0.013 + fireIntensity * 0.006 + state.stimulus * 0.005 + emotionalField * 0.004) * focusedBreath,
      0.006,
      0.038
    );
    core.time += deltaSeconds * breathSpeed;
    core.breath = Math.sin(core.time) * breathAmplitude;

    const windLean = envState.wind
      ? envState.wind.x * (0.007 + (envState.windStrength || 0) * (0.005 + emotionalField * 0.004)) * (0.30 + (weights.sway_alignment || 0) * 1.20) * (1 - fireCoherence * 0.18)
      : 0;
    const observationSway = Math.sin(core.time * 0.38 + 1.1) * (0.009 + emotionalField * 0.004) * ((weights.observe || 0) + (weights.slow_turn || 0) * 0.65);
    const focusLean = fireIntensity * (0.030 + fireCoherence * 0.012) * ((weights.gaze_follow || 0) + (weights.observe || 0) * 0.50);
    const settlePull = weights.settle || 0;
    const targetLeanX = clamp(windLean + observationSway * (1 - settlePull * 0.55) * (1 - fireCoherence * 0.16), -0.045, 0.045);
    const targetLeanZ = clamp(focusLean + Math.cos(core.time * 0.31) * (0.009 + emotionalField * 0.003) * (weights.sway_alignment || 0) - state.stimulus * 0.008, -0.032, 0.062);
    core.leanX = smoothMotionValue(core.leanX, targetLeanX, deltaSeconds, 1.35 + state.stimulus * 3.2 + settlePull * 1.8 + fireCoherence * 0.7);
    core.leanZ = smoothMotionValue(core.leanZ, targetLeanZ, deltaSeconds, 1.45 + state.attention * 2.0 + settlePull * 1.4 + fireCoherence * 0.5);
    bubbleBoy.origin[0] = smoothMotionValue(bubbleBoy.origin[0], bubbleBoy.baseOrigin[0], deltaSeconds, 2.6 + settlePull * 2.2);
    bubbleBoy.origin[1] = bubbleBoy.baseOrigin[1] + behavior.bounce;
    bubbleBoy.origin[2] = smoothMotionValue(bubbleBoy.origin[2], bubbleBoy.baseOrigin[2], deltaSeconds, 2.6 + settlePull * 2.2);

    const yawDelta = bubbleBoy.yaw - bubbleBoy.baseYaw;
    const rootPivot = [0, 0.59, 0];
    const breathStretch = core.breath * 0.34;
    const rootScale = [
      1 - breathStretch * 0.16,
      1 + breathStretch,
      1 - breathStretch * 0.12
    ];
    for (const part of bubbleBoy.parts) {
      const item = part.item;
      const scaledLocal = [
        rootPivot[0] + (part.baseLocal[0] - rootPivot[0]) * rootScale[0],
        rootPivot[1] + (part.baseLocal[1] - rootPivot[1]) * rootScale[1],
        rootPivot[2] + (part.baseLocal[2] - rootPivot[2]) * rootScale[2]
      ];
      const local = rotateLocalPitchRoll(scaledLocal, rootPivot, -core.leanZ, core.leanX);
      if (part.faceRole) {
        const gazeScale = part.faceRole === "eye" || part.faceRole === "spark"
          ? 1
          : part.faceRole === "mouth" || part.faceRole === "spiral"
            ? 0.44
            : part.faceRole === "cheek"
              ? 0.30
              : 0;
        local[0] += behavior.gazeX * gazeScale;
        local[1] += behavior.gazeY * gazeScale;
        if (part.faceRole === "spark") local[2] -= Math.abs(behavior.gazeX) * 0.22;
      }

      const world = bubbleBoyLocalToWorld(local, bubbleBoy.yaw);
      item.position[0] = world[0];
      item.position[1] = world[1];
      item.position[2] = world[2];

      item.rotation[0] = part.baseRotation[0] - core.leanZ;
      item.rotation[1] = part.baseRotation[1] + yawDelta;
      item.rotation[2] = part.baseRotation[2] + core.leanX;
      if (part.faceRole === "eye" || part.faceRole === "spark") {
        item.rotation[0] += behavior.gazeY * 0.16;
        item.rotation[1] += behavior.gazeX * 0.38;
      }

      item.scale[0] = part.baseScale[0] * rootScale[0];
      item.scale[1] = part.baseScale[1] * rootScale[1];
      item.scale[2] = part.baseScale[2] * rootScale[2];
      if (item.mesh === meshes.softBubbleGlow) {
        const glowScale = 0.88 + core.energy * 0.14 + fireIntensity * 0.11 + fireCoherence * 0.06 + ambientEnergy * 0.035 + behaviorPresence * 0.04;
        item.scale[0] *= glowScale;
        item.scale[1] *= glowScale;
        item.scale[2] *= glowScale;
      }
    }

    canvas.dataset.bubbleBoyEnergy = core.energy.toFixed(2);
    canvas.dataset.bubbleBoyBreath = core.breath.toFixed(3);
    canvas.dataset.bubbleBoyGaze = `${behavior.gazeX.toFixed(3)},${behavior.gazeY.toFixed(3)}`;
  }

  function clampCameraTarget(target) {
    return clampToPlayableRadius(target, PLAYABLE_RADIUS);
  }

  const cameraController = createCameraController(canvas, {
    groundHeightAt,
    clampTarget: clampCameraTarget,
    speed: 7.2,
    smoothing: 7.5
  });
  const camera = cameraController.camera;
  const pressedKeys = cameraController.pressedKeys;

  function updateCameraMovement(deltaSeconds) {
    cameraController.update(deltaSeconds);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function bindMesh(mesh) {
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
    const stride = 9 * 4;
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(locations.normal);
    gl.vertexAttribPointer(locations.normal, 3, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(locations.color);
    gl.vertexAttribPointer(locations.color, 3, gl.FLOAT, false, stride, 6 * 4);
  }

  function setIdentityModel() {
    gl.uniformMatrix4fv(locations.model, false, new Float32Array(identity()));
  }

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const stormBoost = toyboxState.weather === "storm" ? 0.008 : 0;
  let lastRenderTime = 0;

  function render(now) {
    resize();
    window.__toyboxFrameCount += 1;
    const time = now / 1000;
    const deltaSeconds = lastRenderTime ? Math.min(0.05, (now - lastRenderTime) / 1000) : 1 / 60;
    lastRenderTime = now;
    updateEnvironment(env, now, deltaSeconds);
    const wind = env.windVector;
    if (physics) physics.stepPhysics(deltaSeconds, { wind });
    updateDebugPanel(time, wind);
    updateCameraMovement(deltaSeconds);
    const bubbleBoyEnv = createBubbleBoyEnvState(time, wind);
    updateBubbleBoyBehavior(deltaSeconds, bubbleBoyEnv);
    updateBubbleBoyMotion(deltaSeconds, bubbleBoyEnv);
    emitBubbleBoyPresenceToWorld();
    const aspect = canvas.width / Math.max(1, canvas.height);
    const eye = [
      camera.target[0] + Math.cos(camera.theta) * Math.sin(camera.phi) * camera.distance,
      camera.target[1] + Math.cos(camera.phi) * camera.distance,
      camera.target[2] + Math.sin(camera.theta) * Math.sin(camera.phi) * camera.distance
    ];

    const sky = env.lighting.sky;
    gl.clearColor(sky[0] + stormBoost, sky[1] + stormBoost * 0.55, sky[2] + stormBoost * 0.35, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(locations.projection, false, new Float32Array(perspective(Math.PI / 3.8, aspect, 0.1, 280)));
    gl.uniformMatrix4fv(locations.view, false, new Float32Array(lookAt(eye, camera.target, [0, 1, 0])));
    gl.uniform1f(locations.time, time);
    gl.uniform3fv(locations.light, new Float32Array(env.lighting.lightPosition));
    gl.uniform3fv(locations.lightColor, new Float32Array(env.lighting.lightColor));
    gl.uniform3fv(locations.ambient, new Float32Array(env.lighting.ambient));
    gl.uniform3fv(locations.fogColor, new Float32Array(env.lighting.fogColor));
    gl.uniform3fv(locations.fire, new Float32Array([0.80, 0.62, -0.20]));
    gl.uniform3fv(locations.eye, new Float32Array(eye));
    gl.uniform2fv(locations.windDirection, new Float32Array([env.wind.direction.x, env.wind.direction.z]));
    gl.uniform1f(locations.windStrength, env.windStrength);
    gl.uniform1f(locations.windGust, wind.gust);
    gl.uniform1f(locations.fogDensity, env.lighting.fogDensity);
    gl.uniform1f(locations.fireBoost, env.lighting.fireBoost);
    gl.uniform1f(locations.moonStrength, env.lighting.moonStrength);
    canvas.dataset.envTimeOfDay = env.timeOfDay.toFixed(3);
    canvas.dataset.envPhase = env.phaseName;
    canvas.dataset.envWindStrength = env.windStrength.toFixed(3);
    canvas.dataset.envWindGust = env.wind.gust.toFixed(3);
    canvas.dataset.envFireIntensity = env.fireIntensity.toFixed(2);
    syncWorldBusTrace();

    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    for (const item of backgroundItems) {
      bindMesh(item.mesh);
      gl.uniformMatrix4fv(locations.model, false, new Float32Array(modelMatrix(item, time)));
      gl.uniform1f(locations.material, item.material);
      gl.drawArrays(gl.TRIANGLES, 0, item.mesh.count);
    }
    gl.enable(gl.CULL_FACE);
    gl.depthMask(true);

          for (const item of opaqueRenderItems) {
            bindMesh(item.mesh);
            gl.uniformMatrix4fv(locations.model, false, new Float32Array(modelMatrix(item, time)));
            gl.uniform1f(locations.material, item.material);
            gl.drawArrays(gl.TRIANGLES, 0, item.mesh.count);
          }
          if (instancing) {
            let visibleInstances = 0;
            for (const group of instancedRenderGroups) {
              visibleInstances += instancing.drawGroup(group, locations, bindMesh, setIdentityModel, eye);
            }
            canvas.dataset.instancedVisible = String(visibleInstances);
          }
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    for (const item of transparentRenderItems) {
      bindMesh(item.mesh);
      gl.uniformMatrix4fv(locations.model, false, new Float32Array(modelMatrix(item, time)));
      gl.uniform1f(locations.material, item.material);
      gl.drawArrays(gl.TRIANGLES, 0, item.mesh.count);
    }
    if (debugController.visible) {
      for (const item of debugRenderItems) {
        bindMesh(item.mesh);
        gl.uniformMatrix4fv(locations.model, false, new Float32Array(modelMatrix(item, time)));
        gl.uniform1f(locations.material, item.material);
        gl.drawArrays(gl.TRIANGLES, 0, item.mesh.count);
      }
    }
    gl.enable(gl.CULL_FACE);
    gl.depthMask(true);

    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    for (const item of skyOverlayItems) {
      bindMesh(item.mesh);
      gl.uniformMatrix4fv(locations.model, false, new Float32Array(modelMatrix(item, time)));
      gl.uniform1f(locations.material, item.material);
      gl.drawArrays(gl.TRIANGLES, 0, item.mesh.count);
    }
    gl.enable(gl.CULL_FACE);
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
