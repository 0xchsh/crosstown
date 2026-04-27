# Crosstown

A dev-only floating toolbar for tuning page transitions on localhost. Six built-in presets, one line of code, works in dev and prod.

> **Hero demo:** _coming soon_ — short clip of the toolbar tuning a transition live.

## Install

```bash
npm install crosstown
```

Works with Next.js 14+ (App Router). Bundles its own animation engine ([motion.dev](https://motion.dev)) so there's nothing else to install.

## Usage

```tsx
// app/layout.tsx
import { Crosstown } from 'crosstown';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Crosstown>{children}</Crosstown>
      </body>
    </html>
  );
}
```

In development, a small toolbar appears bottom-right — use it to tune the transition live. To bake the result into production, click **Copy** in the toolbar and paste the prompt into Claude Code (or apply it manually):

```tsx
import { Crosstown } from 'crosstown';
import { transitionConfig } from '../crosstown.config';

<Crosstown config={transitionConfig}>{children}</Crosstown>
```

When `config` is passed, the toolbar hides and the config is the deterministic source of truth.

## Presets

Fourteen flat presets — pick one in the toolbar, no sub-options to configure.

| Family | Variants | What it does |
|---|---|---|
| Crossfade | `crossfade` | Opacity 0 → 1, simultaneous in/out |
| Fade Out & In | `fade-out-in` | Old fades out completely, then new fades in |
| Slide | `slide-left` `slide-right` `slide-up` `slide-down` | New page slides in over the stationary old page |
| Push | `push-left` `push-right` `push-up` `push-down` | Both pages translate together; new pushes old off |
| Wipe | `wipe-left` `wipe-right` `wipe-up` `wipe-down` | New page reveals via `clip-path: inset()` from one edge |

## Requirements

- React 18+
- Next.js 14+ (App Router only for v0.1)

## License

MIT
