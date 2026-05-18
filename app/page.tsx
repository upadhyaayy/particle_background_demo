"use client";
import { useState, useCallback, useEffect } from "react";
import ParticleBackground, { type Variant, type ColorScheme } from "../components/ParticleBackground";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Config {
  variant: Variant;
  colorScheme: ColorScheme;
  count: number;
  speed: number;
  connectRadius: number;
  interactive: boolean;
  backgroundColor: string;
}

const DEFAULT: Config = {
  variant: "cube",
  colorScheme: "blue",
  count: 100,
  speed: 4,
  connectRadius: 90,
  interactive: true,
  backgroundColor: "#050a14",
};

const COLOR_OPTIONS: { value: ColorScheme; label: string; dot: string }[] = [
  { value: "blue",   label: "Blue",   dot: "#38b4ff" },
  { value: "teal",   label: "Teal",   dot: "#1ddc96" },
  { value: "purple", label: "Purple", dot: "#a064ff" },
  { value: "white",  label: "White",  dot: "#dce1eb" },
];

const BG_OPTIONS = [
  { value: "#050a14", label: "Deep navy" },
  { value: "#0a0a0a", label: "Black" },
  { value: "#0d1117", label: "GitHub dark" },
  { value: "#0f0e17", label: "Ink" },
];

// ─── Snippet generator ────────────────────────────────────────────────────────

function generateSnippet(cfg: Config): string {
  const lines = [
    `<ParticleBackground`,
    `  variant="${cfg.variant}"`,
    `  colorScheme="${cfg.colorScheme}"`,
    `  count={${cfg.count}}`,
    `  speed={${cfg.speed}}`,
    `  connectRadius={${cfg.connectRadius}}`,
    `  interactive={${cfg.interactive}}`,
    `  backgroundColor="${cfg.backgroundColor}"`,
    `  style={{ position: "absolute", inset: 0 }}`,
    `/>`,
  ];
  return lines.join("\n");
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [cfg, setCfg] = useState<Config>(DEFAULT);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const update = useCallback(<K extends keyof Config>(key: K, val: Config[K]) => {
    setCfg(prev => ({ ...prev, [key]: val }));
  }, []);

  const copySnippet = () => {
    navigator.clipboard.writeText(generateSnippet(cfg));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #07080f;
          --surface: #0e1018;
          --surface2: #161820;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.14);
          --text: #e8eaf0;
          --muted: #6b7080;
          --accent: #38b4ff;
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-display);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Topbar ── */
        .topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 56px;
          background: rgba(7,8,15,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .topbar-brand {
          font-size: 13px; font-weight: 600; letter-spacing: .06em;
          text-transform: uppercase; color: var(--text);
          display: flex; align-items: center; gap: 8px;
        }
        .topbar-brand .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent); display: inline-block;
          box-shadow: 0 0 8px var(--accent);
        }
        .buy-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 6px;
          background: var(--accent); color: #020c18;
          font-family: var(--font-display); font-size: 13px; font-weight: 700;
          letter-spacing: .03em; border: none; cursor: pointer;
          text-decoration: none; transition: opacity .15s;
        }
        .buy-btn:hover { opacity: .88; }

        /* ── Hero ── */
        .hero {
          position: relative; height: 100vh; min-height: 560px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 0 24px;
          overflow: hidden;
        }
        .hero-content { position: relative; z-index: 2; max-width: 680px; }
        .hero-eyebrow {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 20px;
        }
        .hero-title {
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 800; line-height: 1.0;
          letter-spacing: -.02em; margin-bottom: 20px;
        }
        .hero-title span { color: var(--accent); }
        .hero-sub {
          font-size: 16px; font-weight: 400;
          color: var(--muted); line-height: 1.65;
          margin-bottom: 36px; max-width: 480px; margin-left: auto; margin-right: auto;
        }
        .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 11px;
          color: var(--muted); padding: 6px 14px;
          border: 1px solid var(--border); border-radius: 4px;
        }
        .scroll-hint {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          font-family: var(--font-mono); font-size: 11px;
          color: var(--muted); letter-spacing: .08em;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          z-index: 2;
        }
        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, var(--muted), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: .3; } 50% { opacity: .9; }
        }

        /* ── Playground section ── */
        .section {
          max-width: 1100px; margin: 0 auto;
          padding: 80px 24px;
        }
        .section-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 12px;
        }
        .section-title {
          font-size: 32px; font-weight: 700;
          letter-spacing: -.02em; margin-bottom: 40px;
        }

        .playground {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 780px) {
          .playground { grid-template-columns: 1fr; }
        }

        /* ── Canvas preview ── */
        .preview-wrap {
          position: relative;
          border-radius: 12px; overflow: hidden;
          border: 1px solid var(--border);
          aspect-ratio: 16/9;
        }
        .preview-overlay {
          position: absolute; bottom: 16px; left: 16px;
          font-family: var(--font-mono); font-size: 11px;
          color: rgba(255,255,255,0.35); letter-spacing: .06em;
          pointer-events: none; z-index: 2;
        }

        /* ── Controls panel ── */
        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .panel-header {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          font-size: 12px; font-weight: 600;
          letter-spacing: .06em; text-transform: uppercase;
          color: var(--muted);
        }
        .panel-body { padding: 18px; display: flex; flex-direction: column; gap: 20px; }

        .ctrl { display: flex; flex-direction: column; gap: 8px; }
        .ctrl-label {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: var(--muted);
        }
        .ctrl-label strong { color: var(--text); font-weight: 500; font-size: 12px; }

        /* Segmented control */
        .seg {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .seg-btn {
          flex: 1; padding: 7px 10px; border-radius: 6px;
          border: 1px solid var(--border);
          background: transparent; color: var(--muted);
          font-family: var(--font-display); font-size: 12px;
          cursor: pointer; transition: all .15s; white-space: nowrap;
          text-align: center;
        }
        .seg-btn:hover { border-color: var(--border-hover); color: var(--text); }
        .seg-btn.active {
          background: var(--surface2);
          border-color: var(--border-hover);
          color: var(--text); font-weight: 600;
        }

        /* Color picker row */
        .color-row { display: flex; gap: 8px; }
        .color-swatch {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 10px 6px; border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent; cursor: pointer; transition: all .15s;
        }
        .color-swatch:hover { border-color: var(--border-hover); }
        .color-swatch.active { border-color: var(--accent); background: rgba(56,180,255,0.06); }
        .color-swatch .swatch-dot {
          width: 18px; height: 18px; border-radius: 50%;
        }
        .color-swatch .swatch-label {
          font-size: 10px; color: var(--muted); letter-spacing: .04em;
        }
        .color-swatch.active .swatch-label { color: var(--text); }

        /* Range input */
        input[type=range] {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; border-radius: 2px;
          background: var(--surface2); outline: none; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--accent); cursor: pointer;
          box-shadow: 0 0 0 3px rgba(56,180,255,0.2);
        }

        /* Toggle */
        .toggle-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .toggle {
          position: relative; width: 36px; height: 20px;
        }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; inset: 0;
          background: var(--surface2); border-radius: 20px;
          cursor: pointer; transition: background .2s;
          border: 1px solid var(--border);
        }
        .toggle-slider::before {
          content: ""; position: absolute;
          width: 14px; height: 14px; left: 2px; top: 2px;
          background: var(--muted); border-radius: 50%;
          transition: transform .2s, background .2s;
        }
        .toggle input:checked + .toggle-slider { background: rgba(56,180,255,0.2); border-color: var(--accent); }
        .toggle input:checked + .toggle-slider::before { transform: translateX(16px); background: var(--accent); }

        /* Bg selector */
        .bg-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .bg-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 10px; border-radius: 6px;
          border: 1px solid var(--border);
          background: transparent; color: var(--muted);
          font-family: var(--font-display); font-size: 11px;
          cursor: pointer; transition: all .15s;
        }
        .bg-btn.active { border-color: var(--border-hover); color: var(--text); }
        .bg-btn .bg-swatch { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--border); }

        /* ── Code snippet ── */
        .snippet-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden;
          margin-top: 20px;
        }
        .snippet-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 18px;
          border-bottom: 1px solid var(--border);
        }
        .snippet-title {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--muted); letter-spacing: .06em;
        }
        .copy-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 5px;
          border: 1px solid var(--border);
          background: transparent; color: var(--muted);
          font-family: var(--font-mono); font-size: 11px;
          cursor: pointer; transition: all .15s;
        }
        .copy-btn:hover { border-color: var(--border-hover); color: var(--text); }
        .copy-btn.ok { color: #1ddc96; border-color: rgba(29,220,150,0.3); }
        .snippet-code {
          padding: 18px;
          font-family: var(--font-mono); font-size: 12px;
          line-height: 1.7; color: #8b9ac0;
          white-space: pre; overflow-x: auto;
        }
        .snippet-code .kw { color: #38b4ff; }
        .snippet-code .str { color: #1ddc96; }
        .snippet-code .num { color: #f0a050; }
        .snippet-code .tag { color: #e86cac; }

        /* ── Props table ── */
        .props-table {
          width: 100%; border-collapse: collapse;
          font-size: 13px;
        }
        .props-table th {
          text-align: left; padding: 10px 14px;
          font-size: 11px; font-weight: 600;
          letter-spacing: .06em; text-transform: uppercase;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
        }
        .props-table td {
          padding: 12px 14px;
          border-bottom: 1px solid var(--border);
          color: var(--text); vertical-align: top;
        }
        .props-table tr:last-child td { border-bottom: none; }
        .props-table .prop-name {
          font-family: var(--font-mono); font-size: 12px; color: var(--accent);
        }
        .props-table .prop-type {
          font-family: var(--font-mono); font-size: 11px;
          color: #f0a050;
        }
        .props-table .prop-default {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--muted);
        }
        .props-table .prop-desc { font-size: 12px; color: var(--muted); }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid var(--border);
          padding: 32px 24px; text-align: center;
          font-family: var(--font-mono); font-size: 11px;
          color: var(--muted); letter-spacing: .06em;
        }
      `}</style>

      {/* Topbar */}
      <nav className="topbar">
        <div className="topbar-brand">
          <span className="dot" />
          ParticleBackground
        </div>
        <a
          className="buy-btn"
          href="https://gumroad.com" 
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy — $19 / $49
        </a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <ParticleBackground
          style={{ position: "absolute", inset: 0 }}
          variant={cfg.variant}
          colorScheme={cfg.colorScheme}
          count={cfg.count}
          speed={cfg.speed}
          connectRadius={cfg.connectRadius}
          interactive={cfg.interactive}
          backgroundColor={cfg.backgroundColor}
        />
        <div className="hero-content">
          <p className="hero-eyebrow">React component · zero dependencies</p>
          <h1 className="hero-title">
            Particle<br /><span>Background</span>
          </h1>
          <p className="hero-sub">
            Drop-in animated particle system for React and Next.js.
            Two variants, four color presets, fully typed, mobile-optimized.
          </p>
          <div className="hero-actions">
            <a
              className="buy-btn"
              href="https://gumroad.com" 
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy on Gumroad
            </a>
            <span className="hero-badge">
              Personal $19 · Commercial $49
            </span>
          </div>
        </div>
        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Playground */}
      <div className="section">
        <p className="section-label">Playground</p>
        <h2 className="section-title">Configure live</h2>

        <div className="playground">
          {/* Canvas */}
          <div>
            <div className="preview-wrap">
              <ParticleBackground
                style={{ position: "absolute", inset: 0 }}
                variant={cfg.variant}
                colorScheme={cfg.colorScheme}
                count={cfg.count}
                speed={cfg.speed}
                connectRadius={cfg.connectRadius}
                interactive={cfg.interactive}
                backgroundColor={cfg.backgroundColor}
              />
              <div className="preview-overlay">
                {cfg.count} particles · {cfg.variant}
              </div>
            </div>

            {/* Code snippet */}
            <div className="snippet-wrap">
              <div className="snippet-header">
                <span className="snippet-title">JSX · auto-generated from controls</span>
                <button
                  className={`copy-btn ${copied ? "ok" : ""}`}
                  onClick={copySnippet}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="snippet-code">
                <ColorizedSnippet cfg={cfg} />
              </div>
            </div>
          </div>

          {/* Controls panel */}
          <div className="panel">
            <div className="panel-header">Controls</div>
            <div className="panel-body">

              {/* Variant */}
              <div className="ctrl">
                <div className="ctrl-label"><strong>Variant</strong></div>
                <div className="seg">
                  {(["cube", "wave"] as Variant[]).map(v => (
                    <button
                      key={v}
                      className={`seg-btn ${cfg.variant === v ? "active" : ""}`}
                      onClick={() => update("variant", v)}
                    >
                      {v === "cube" ? "Connecting" : "Wave flow"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color scheme */}
              <div className="ctrl">
                <div className="ctrl-label"><strong>Color</strong></div>
                <div className="color-row">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.value}
                      className={`color-swatch ${cfg.colorScheme === c.value ? "active" : ""}`}
                      onClick={() => update("colorScheme", c.value)}
                    >
                      <div className="swatch-dot" style={{ background: c.dot }} />
                      <span className="swatch-label">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div className="ctrl">
                <div className="ctrl-label"><strong>Background</strong></div>
                <div className="bg-row">
                  {BG_OPTIONS.map(b => (
                    <button
                      key={b.value}
                      className={`bg-btn ${cfg.backgroundColor === b.value ? "active" : ""}`}
                      onClick={() => update("backgroundColor", b.value)}
                    >
                      <div className="bg-swatch" style={{ background: b.value }} />
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div className="ctrl">
                <div className="ctrl-label">
                  <strong>Particles</strong>
                  <span>{cfg.count}</span>
                </div>
                <input
                  type="range" min={30} max={200} step={1}
                  value={cfg.count}
                  onChange={e => update("count", +e.target.value)}
                />
              </div>

              {/* Speed */}
              <div className="ctrl">
                <div className="ctrl-label">
                  <strong>Speed</strong>
                  <span>{cfg.speed}</span>
                </div>
                <input
                  type="range" min={1} max={10} step={1}
                  value={cfg.speed}
                  onChange={e => update("speed", +e.target.value)}
                />
              </div>

              {/* Connect radius */}
              <div className="ctrl">
                <div className="ctrl-label">
                  <strong>Connect radius</strong>
                  <span>{cfg.connectRadius}px</span>
                </div>
                <input
                  type="range" min={40} max={160} step={1}
                  value={cfg.connectRadius}
                  onChange={e => update("connectRadius", +e.target.value)}
                />
              </div>

              {/* Interactive toggle */}
              <div className="ctrl">
                <div className="toggle-row">
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    <strong style={{ color: "var(--text)", fontWeight: 500 }}>Mouse repulsion</strong>
                  </span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={cfg.interactive}
                      onChange={e => update("interactive", e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Props table */}
      <div className="section" style={{ paddingTop: 0 }}>
        <p className="section-label">API</p>
        <h2 className="section-title">All props</h2>
        <div style={{
          background: "var(--surface)", borderRadius: 12,
          border: "1px solid var(--border)", overflow: "hidden",
        }}>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {PROPS_DOCS.map(p => (
                <tr key={p.name}>
                  <td><span className="prop-name">{p.name}</span></td>
                  <td><span className="prop-type">{p.type}</span></td>
                  <td><span className="prop-default">{p.default}</span></td>
                  <td><span className="prop-desc">{p.desc}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>ParticleBackground · React component · Personal $19 · Commercial $49</p>
        <p style={{ marginTop: 8 }}>
          <a
            href="https://gumroad.com" /* ← replace */
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            Buy on Gumroad ↗
          </a>
        </p>
      </footer>
    </>
  );
}

// ─── Syntax-highlighted snippet ───────────────────────────────────────────────

function ColorizedSnippet({ cfg }: { cfg: Config }) {
  return (
    <>
      <span className="tag">&lt;ParticleBackground</span>{"\n"}
      {"  "}<span className="kw">variant</span>=<span className="str">"{cfg.variant}"</span>{"\n"}
      {"  "}<span className="kw">colorScheme</span>=<span className="str">"{cfg.colorScheme}"</span>{"\n"}
      {"  "}<span className="kw">count</span>={"{"}
      <span className="num">{cfg.count}</span>{"}"}{"\n"}
      {"  "}<span className="kw">speed</span>={"{"}
      <span className="num">{cfg.speed}</span>{"}"}{"\n"}
      {"  "}<span className="kw">connectRadius</span>={"{"}
      <span className="num">{cfg.connectRadius}</span>{"}"}{"\n"}
      {"  "}<span className="kw">interactive</span>={"{"}
      <span className="num">{String(cfg.interactive)}</span>{"}"}{"\n"}
      {"  "}<span className="kw">backgroundColor</span>=<span className="str">"{cfg.backgroundColor}"</span>{"\n"}
      {"  "}<span className="kw">style</span>={`{{ position: "absolute", inset: 0 }}`}{"\n"}
      <span className="tag">/&gt;</span>
    </>
  );
}

// ─── Props docs ───────────────────────────────────────────────────────────────

const PROPS_DOCS = [
  { name: "count",           type: "number",        default: "100",       desc: "Particle count. Auto-halved on mobile (<768px)." },
  { name: "speed",           type: "number 1–10",   default: "4",         desc: "Movement speed." },
  { name: "connectRadius",   type: "number",        default: "90",        desc: "Max distance (px) to draw connection lines." },
  { name: "colorScheme",     type: "ColorScheme",   default: '"blue"',    desc: "Preset: blue · teal · purple · white" },
  { name: "variant",         type: "Variant",       default: '"cube"',    desc: "cube (connecting dots) or wave (flow)" },
  { name: "interactive",     type: "boolean",       default: "true",      desc: "Mouse & touch repulsion effect." },
  { name: "particleColor",   type: "string (hex)",  default: "—",         desc: "Override particle color. e.g. #ff6b35" },
  { name: "lineColor",       type: "string (hex)",  default: "—",         desc: "Override line color." },
  { name: "backgroundColor", type: "string",        default: '"#050a14"', desc: "Canvas background." },
  { name: "borderRadius",    type: "number|string", default: "0",         desc: "CSS border radius." },
  { name: "className",       type: "string",        default: "—",         desc: "Class on the wrapper div." },
  { name: "style",           type: "CSSProperties", default: "—",         desc: "Inline styles on the wrapper div." },
];
