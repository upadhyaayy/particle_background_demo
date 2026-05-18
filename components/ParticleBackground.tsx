"use client";

import { useEffect, useRef, useCallback } from "react";

export type ColorScheme = "blue" | "teal" | "purple" | "white";
export type Variant = "cube" | "wave";

export interface ParticleBackgroundProps {
  count?: number;
  speed?: number;
  connectRadius?: number;
  colorScheme?: ColorScheme;
  variant?: Variant;
  interactive?: boolean;
  /** Overrides colorScheme for particles */
  particleColor?: string;
  /** Overrides colorScheme for lines */
  lineColor?: string;
  backgroundColor?: string;
  borderRadius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const COLOR_MAP: Record<ColorScheme, { particle: string; line: string }> = {
  blue:   { particle: "56,180,255",  line: "56,140,255"  },
  teal:   { particle: "29,220,150",  line: "29,180,130"  },
  purple: { particle: "160,100,255", line: "130,80,230"  },
  white:  { particle: "220,225,235", line: "180,190,210" },
};

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

export default function ParticleBackground({
  count = 100,
  speed = 4,
  connectRadius = 90,
  colorScheme = "blue",
  variant = "cube",
  interactive = true,
  particleColor,
  lineColor,
  backgroundColor = "#050a14",
  borderRadius = 0,
  className,
  style,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Mutable refs to avoid animation loop restarts on prop changes
  const stateRef = useRef({
    particles: [] as Particle[],
    mouse: { x: -9999, y: -9999 },
    raf: 0,
    frame: 0,
    W: 0,
    H: 0,
    count,
    speed,
    connectRadius,
    colorScheme,
    variant,
    interactive,
    particleColor,
    lineColor,
    backgroundColor,
  });

  useEffect(() => {
    const s = stateRef.current;
    s.speed = speed;
    s.connectRadius = connectRadius;
    s.colorScheme = colorScheme;
    s.variant = variant;
    s.interactive = interactive;
    s.particleColor = particleColor;
    s.lineColor = lineColor;
    s.backgroundColor = backgroundColor;
  }, [speed, connectRadius, colorScheme, variant, interactive, particleColor, lineColor, backgroundColor]);

  useEffect(() => {
    stateRef.current.count = count;
    initParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, variant]);

  function isMobile() {
    return typeof window !== "undefined" && window.innerWidth < 768;
  }

  function effectiveCount() {
    // Automatically halve particle count on mobile for performance
    const base = stateRef.current.count;
    return isMobile() ? Math.floor(base / 2) : base;
  }

  function getColors() {
    const s = stateRef.current;
    const preset = COLOR_MAP[s.colorScheme] ?? COLOR_MAP.blue;
    return {
      particle: s.particleColor ? hexToRgb(s.particleColor) : preset.particle,
      line:     s.lineColor     ? hexToRgb(s.lineColor)     : preset.line,
    };
  }

  function initParticles() {
    const s = stateRef.current;
    const { W, H } = s;
    if (!W || !H) return;
    s.particles = [];
    const n = effectiveCount();
    for (let i = 0; i < n; i++) {
      s.particles.push(makeParticle(W, H, s.speed));
    }
  }

  function makeParticle(W: number, H: number, spd: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const magnitude = (0.3 + Math.random() * 0.7) * (spd / 10) * 1.5;
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    Math.cos(angle) * magnitude,
      vy:    Math.sin(angle) * magnitude,
      r:     1.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function drawCube(ctx: CanvasRenderingContext2D) {
    const s = stateRef.current;
    const { W, H, particles, mouse, interactive: int } = s;
    const col = getColors();

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      if (int) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          p.x -= (dx / dist) * 1.2;
          p.y -= (dy / dist) * 1.2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col.particle},0.85)`;
      ctx.fill();
    }

    const r = s.connectRadius;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < r) {
          const alpha = (1 - d / r) * 0.55;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${col.line},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function drawWave(ctx: CanvasRenderingContext2D) {
    const s = stateRef.current;
    const { W, H, particles } = s;
    const col = getColors();
    const spd = s.speed / 10;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.phase += 0.012 * spd * 5;
      p.x += p.vx * 0.4;

      if (p.x > W + 10) p.x = -10;
      if (p.x < -10) p.x = W + 10;

      const wave = Math.sin(p.phase + p.x * 0.012) * 38;
      const baseY = (i / particles.length) * H;
      const y = baseY + wave;
      const bright = 0.5 + 0.5 * Math.sin(p.phase);
      ctx.beginPath();
      ctx.arc(p.x, y, p.r * bright, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col.particle},${0.5 + bright * 0.5})`;
      ctx.fill();
    }

    const r = s.connectRadius * 1.2;
    for (let i = 0; i < particles.length - 1; i++) {
      const a = particles[i];
      const b = particles[i + 1];
      const ay = (i / particles.length) * H + Math.sin(a.phase + a.x * 0.012) * 38;
      const by = ((i + 1) / particles.length) * H + Math.sin(b.phase + b.x * 0.012) * 38;
      const dx = a.x - b.x;
      const dy = ay - by;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < r) {
        const alpha = (1 - d / r) * 0.4;
        ctx.beginPath();
        ctx.moveTo(a.x, ay);
        ctx.lineTo(b.x, by);
        ctx.strokeStyle = `rgba(${col.line},${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    s.frame++;

    ctx.fillStyle = s.backgroundColor;
    ctx.fillRect(0, 0, s.W, s.H);

    if (s.variant === "cube") drawCube(ctx);
    else drawWave(ctx);

    s.raf = requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const s = stateRef.current;
    s.W = wrap.offsetWidth;
    s.H = wrap.offsetHeight;
    canvas.width = s.W;
    canvas.height = s.H;
    initParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleResize();

    const s = stateRef.current;
    s.raf = requestAnimationFrame(animate);

    const ro = new ResizeObserver(handleResize);
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
    };
  }, [animate, handleResize]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!stateRef.current.interactive) return;
    const rect = wrapRef.current!.getBoundingClientRect();
    stateRef.current.mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function onMouseLeave() {
    stateRef.current.mouse = { x: -9999, y: -9999 };
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (!stateRef.current.interactive) return;
    const rect = wrapRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    stateRef.current.mouse = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  function onTouchEnd() {
    stateRef.current.mouse = { x: -9999, y: -9999 };
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius,
        ...style,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
        aria-hidden="true"
      />
    </div>
  );
}
