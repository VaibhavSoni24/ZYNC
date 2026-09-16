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

  // Hash function
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  // Simplex-style 2D gradient noise
  float noise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;

    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));

    return dot(n, vec3(70.0));
  }

  // Fractional Brownian Motion for smoke tendrils
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      f += w * noise(p);
      p = rot * p * 2.02;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.12;

    // Domain warping for fluid smoke motion
    vec2 q = vec2(fbm(st + vec2(0.0, t * 0.4)), fbm(st + vec2(5.2, 1.3 - t * 0.3)));
    vec2 r = vec2(fbm(st + 4.0 * q + vec2(1.7 - t * 0.5, 9.2)), fbm(st + 4.0 * q + vec2(8.3, 2.8 + t * 0.3)));

    float f = fbm(st + 3.0 * r);

    // Deep Obsidian, Royal Purple, and Electric Blue smoke palette
    vec3 colDeep    = vec3(0.024, 0.024, 0.047);  // #06060C
    vec3 colIndigo  = vec3(0.08, 0.04, 0.22);     // #140A38
    vec3 colPurple  = vec3(0.48, 0.09, 0.95);     // #7B16FF
    vec3 colBlue    = vec3(0.0, 0.36, 0.98);      // #005BFF
    vec3 colCyan    = vec3(0.18, 0.55, 1.0);      // #2E8CFF

    // Layer smoke colors
    vec3 color = mix(colDeep, colIndigo, clamp(f * f * 2.0, 0.0, 1.0));
    color = mix(color, colPurple, clamp(length(q) * 0.7, 0.0, 1.0));
    color = mix(color, colBlue, clamp(length(r.x) * 0.8, 0.0, 1.0));
    color = mix(color, colCyan, clamp(pow(f, 3.0) * 0.6, 0.0, 1.0));

    // Contrast shaping
    color = pow(color, vec3(1.2));

    // Subtle grain
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.025;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
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
      console.warn('WebGL not supported, falling back to CSS background');
      return;
    }

    // Compile shader helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer
    const positionLocation = gl.getAttribLocation(program, 'position');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let animationFrameId: number;
    const startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      // Cap at 1.25 for crispness with max 60fps performance
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    let mouseX = 0.5;
    let mouseY = 0.5;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = (now: number) => {
      if (isVisible) {
        const elapsed = (now - startTime) * 0.001;
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, elapsed);
        gl.uniform2f(mouseLoc, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 select-none">
      {/* Underlying CSS gradient fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06060C] via-[#040409] to-[#0A0A12]" />

      {/* Pure WebGL Smoke Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-65 mix-blend-screen pointer-events-none"
      />

      {/* Atmospheric Smoke & Vignette overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/70 via-transparent to-[#0A0A12] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#06060D]/50 to-[#0A0A12]/95 pointer-events-none" />
    </div>
  );
};
