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

  // Permutation polynomial for noise
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  // 2D Simplex Noise
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= taylorInvSqrt(a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Multi-octave fluid fractal noise (smoke simulation)
  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.55;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      total += amp * snoise(p * freq);
      p = p * 1.85 + vec2(0.35, 0.15);
      amp *= 0.52;
      freq *= 1.95;
    }
    return total;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv;
    p.x *= aspect;

    float t = u_time * 0.08;

    // Organic fluid domain warping - simulates swirling liquid smoke
    vec2 q = vec2(
      fbm(p + vec2(0.0, t * 0.5)),
      fbm(p + vec2(2.8, 1.4 - t * 0.35))
    );

    vec2 r = vec2(
      fbm(p + 3.0 * q + vec2(1.7 - t * 0.4, 9.2)),
      fbm(p + 3.0 * q + vec2(8.3, 2.8 + t * 0.3))
    );

    float smoke = fbm(p + 3.2 * r);
    smoke = 0.5 + 0.5 * smoke; // Map to [0, 1]

    // Vivid Blue, Purple, Magenta and Obsidian Black Smoke Palette
    vec3 deepBlack  = vec3(0.02, 0.02, 0.04);   // #05050A
    vec3 darkIndigo  = vec3(0.06, 0.04, 0.18);   // #0F0A2E
    vec3 royalBlue   = vec3(0.02, 0.32, 0.98);   // #0552FA
    vec3 electricPurp = vec3(0.55, 0.12, 1.0);   // #8C1FFF
    vec3 neonViolet  = vec3(0.72, 0.22, 1.0);   // #B838FF
    vec3 brightCyan  = vec3(0.15, 0.65, 1.0);   // #26A6FF

    // Layer the fluid smoke colors with rich transitions
    vec3 col = mix(deepBlack, darkIndigo, smoothstep(0.0, 0.4, smoke));
    col = mix(col, royalBlue, smoothstep(0.35, 0.65, length(q)));
    col = mix(col, electricPurp, smoothstep(0.4, 0.75, length(r)));
    col = mix(col, neonViolet, smoothstep(0.65, 0.95, smoke * length(q)));
    col = mix(col, brightCyan, smoothstep(0.85, 1.1, smoke * smoke));

    // Dynamic vignette to keep center content crisp and visible
    float centerDist = distance(uv, vec2(0.5, 0.45));
    col *= (1.05 - smoothstep(0.2, 0.85, centerDist) * 0.35);

    // Subtle film grain
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.015;
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
      // High-performance resolution scaling (max 1.25 DPR for butter smooth 60fps)
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

    let mouseX = 0.5;
    let mouseY = 0.5;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
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
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, elapsed);
        gl.uniform2f(mouseLoc, mouseX, mouseY);
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
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Dynamic 60fps WebGL Smoke Shader Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle bottom fade so footer transitions smoothly */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A12] to-transparent pointer-events-none" />
    </div>
  );
};
