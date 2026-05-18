# ParticleBackground

Interactive particle background component for React and Next.js. Two variants, four color presets, mouse/touch repulsion, mobile-optimized, zero dependencies beyond React.

**[Live Demo →](https://particle-background-demo.vercel.app)**

## What's in this repo

This is the demo site for the ParticleBackground component. The full component with commercial license is available on Gumroad.

**[Buy on Gumroad →](https://gumroad.com)** <!-- replace with your Gumroad link once live -->

## Quick look

```tsx
<ParticleBackground
  variant="cube"
  colorScheme="blue"
  count={100}
  speed={4}
  style={{ position: "absolute", inset: 0 }}
/>
```

## Variants

- **Connecting particles** — dots connected by lines, reacts to mouse. Great for fintech, SaaS, crypto.
- **Wave flow** — flowing particle streams. Great for agencies, portfolios, AI tools.

## Color presets

| Preset | Use case |
|--------|----------|
| `blue` | Fintech, crypto, SaaS |
| `teal` | Health, productivity |
| `purple` | AI, creative tools |
| `white` | Minimal / light sites |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"cube" \| "wave"` | `"cube"` | Particle style |
| `colorScheme` | `ColorScheme` | `"blue"` | Color preset |
| `count` | number | `100` | Particle count (auto-halved on mobile) |
| `speed` | number 1–10 | `4` | Movement speed |
| `connectRadius` | number | `90` | Max distance to draw lines (px) |
| `interactive` | boolean | `true` | Mouse/touch repulsion |
| `particleColor` | string (hex) | — | Override particle color |
| `lineColor` | string (hex) | — | Override line color |
| `backgroundColor` | string | `"#050a14"` | Canvas background |
| `borderRadius` | number\|string | `0` | CSS border radius |
| `className` | string | — | Wrapper class |
| `style` | CSSProperties | — | Wrapper inline styles |

## License

Personal and commercial licenses available on Gumroad.
