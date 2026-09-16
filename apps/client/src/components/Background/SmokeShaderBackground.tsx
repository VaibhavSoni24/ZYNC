import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  // Standard Ashima Simplex 2D noise with correct GLSL ES 1.0 vector overloads
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = u_time * 0.22;

    // Fluid mouse interaction
    vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
    float dMouse = length(p - m);
    vec2 mousePull = (p - m) * exp(-dMouse * 2.2) * 0.16;

    // Organic domain warping for fluid smoke billows
    vec2 warp = vec2(
      snoise(p * 0.65 + vec2(t * 0.15, -t * 0.12) + mousePull),
      snoise(p * 0.65 + vec2(-t * 0.14, t * 0.18) - mousePull)
    );

    vec2 pWarped = p + warp * 0.35;

    // Drifting color nodes for silky mesh-gradient smoke
    // Node 1: Electric Cobalt Blue (#005BFF)
    vec2 pt1 = vec2(sin(t * 0.38) * 0.62 * aspect, cos(t * 0.30) * 0.45);
    float w1 = smoothstep(1.30, 0.05, length(pWarped - pt1));

    // Node 2: Royal Neon Violet (#7B16FF)
    vec2 pt2 = vec2(cos(t * 0.34 + 2.0) * 0.68 * aspect, sin(t * 0.40 + 1.5) * 0.48);
    float w2 = smoothstep(1.25, 0.05, length(pWarped - pt2));

    // Node 3: Radiant Orchid Magenta (#AD26E0)
    vec2 pt3 = vec2(sin(t * 0.28 + 4.2) * 0.55 * aspect, cos(t * 0.36 + 3.8) * 0.45);
    float w3 = smoothstep(1.15, 0.05, length(pWarped - pt3));

    // Node 4: Luminous Cyan Crest (#00D2FF)
    vec2 pt4 = vec2(cos(t * 0.46 + 1.0) * 0.45 * aspect, sin(t * 0.26 + 4.0) * 0.35);
    float w4 = smoothstep(0.95, 0.05, length(pWarped - pt4));

    // Secondary smoke turbulence
    float smoke = snoise(pWarped * 1.05 + vec2(t * 0.07, -t * 0.09));
    float smokeMask = 0.5 + 0.5 * smoke;

    // Premium Color Palette
    vec3 cBase    = vec3(0.024, 0.024, 0.048); // #06060C Deep obsidian void
    vec3 cBlue    = vec3(0.00, 0.36, 1.00);    // #005BFF Electric Cobalt
    vec3 cPurple  = vec3(0.48, 0.09, 1.00);    // #7B16FF Royal Purple
    vec3 cMagenta = vec3(0.78, 0.12, 0.88);    // #AD26E0 Vivid Magenta
    vec3 cCyan    = vec3(0.00, 0.82, 1.00);    // #00D2FF Neon Cyan

    // Continuous fluid color blending
    vec3 col = cBase;
    col = mix(col, cBlue, w1 * 0.85);
    col = mix(col, cPurple, w2 * 0.80);
    col = mix(col, cMagenta, w3 * 0.65);
    col = mix(col, cCyan, w4 * 0.35);

    // Modulate with smoke turbulence
    col *= 0.88 + 0.25 * smokeMask;

    // Subtle center vignette for crystal-clear typography readability
    float centerDim = smoothstep(0.08, 0.95, length((uv - vec2(0.5, 0.44)) * vec2(aspect * 0.85, 1.0)));
    col = mix(col * 0.82, col, 0.5 + 0.5 * centerDim);

    // Micro filmic dither
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.008;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const SmokeShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });

    if (!gl) {
      console.warn('WebGL not available');
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, 'position');
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let animId: number;
    const startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let isVisible = true;
    const onVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const render = (now: number) => {
      if (isVisible) {
        const elapsed = (now - startTime) * 0.001;
        // Smooth mouse damping
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, elapsed);
        gl.uniform2f(mouseLoc, currentMouseX, currentMouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 60fps WebGL Vivid Fluid Smoke Shader Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle bottom gradient to blend cleanly with the footer */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A12] to-transparent pointer-events-none" />
    </div>
  );
};
