# PRD — Crosstown

**A dev-only floating toolbar for tuning page transitions on localhost.**

**Owner:** Charles (`0xchsh`)
**Status:** Ready for Claude Code
**Target:** `v0.1.0` on npm

---

## One-liner

Crosstown is a single React component you drop into your Next.js app. It ships six page transition presets and a dev-only toolbar for tuning them live. One import, one line of code, works in dev and prod.

## The category

Crosstown is a **floating localhost toolbar** — a drop-in React component that gives you a design-tool affordance inside your running app. Small, bottom-corner pill in dev; invisible in production; zero framework lock-in. Pick a verb, give developers a direct-manipulation UI for it inside the app they're already building.

Crosstown's verb is **configure** — specifically, page transitions. The toolbar gives you a Framer-style control panel for tuning transition presets live; the package ships the actual transition implementations so the animation engine keeps working after the toolbar is gone.

One meaningful property worth calling out: **Crosstown is both a dev tool and a production runtime.** The toolbar disappears in production builds via tree-shaking, but the animation wrapper stays — the user's pages still transition using Crosstown's presets. Pure dev-time toolbars don't ship runtime code; Crosstown does.

---

## Why it exists

Framer's Page Effects panel is the best-in-class UX for configuring page transitions — dial it in visually, see it live, ship it. But it only exists inside Framer. Production React developers fall back to writing Framer Motion boilerplate by hand: an `AnimatePresence` wrapper, hard-coded easing, hand-tuned `clip-path` values. The feedback loop is slow and the final result rarely feels as considered as the Framer version because nobody iterates enough.

Crosstown ships the transition implementations as a library and puts a live toolbar on top of them. You tune in dev; the same code runs in prod.

---

## Who it's for

**Primary:** Vibecoders shipping Next.js apps with Claude Code. Design-tool ergonomics, agent-native workflow.

**Secondary:** Designers-who-code and Framer Motion users who want a config layer on top of their existing setup.

**Not for:** Teams whose design system already defines transitions as tokens — they'll want their own baked-in behavior.

---

## Goals

1. **One-line install.** `npm install crosstown`, then `<Crosstown>{children}</Crosstown>` in the root layout. That's the full setup.
2. **Six working presets.** Crossfade, wipe, circular, blinds, zigzag, inset — all implemented inside the package. Consumers never write animation code.
3. **Live tuning.** Toolbar changes auto-preview the new transition in-place on release (sliders) or on select (dropdowns). A Play button replays the current config on demand.
4. **Copy prompt → apply globally.** A button copies a config-first prompt that an AI agent can paste-and-apply to bake the transition into the user's project.
5. **Zero production footprint for the toolbar.** Toolbar tree-shakes to zero bytes in production. Animation runtime stays.
6. **Works without Tailwind, CSS-in-JS, or global CSS.** Toolbar styling is entirely inline.

## Non-goals (for v0.1)

- **No per-route transition rules.** v0.1 is global-only. Per-route targeting is v0.2.
- **No Pages Router, Vite + React Router, or View Transitions API variant.** App Router only for v0.1. Others in v0.2.
- **No CLI.** Just `npm install`. If people want source, they can fork.
- **No standalone documentation site.** GitHub README + npm page. v0.2 can have `crosstown.dev`.
- **No custom preset authoring.** Six presets are the complete set.
- **No telemetry.** Dev tools with telemetry feel wrong.
- **No React Native.** Web only.
- **No direction-aware (back vs forward) navigation.** v0.2.

---

## Decisions already made

Locked in. Claude Code: don't re-litigate unless you find a concrete blocker.

| Decision | Choice | Why |
|---|---|---|
| Package name | `crosstown` (npm), `0xchsh/crosstown` (GitHub) | Evokes motion between places; fits the .dev toolbar naming style. |
| Install | `npm install crosstown` (no `-D`) | The animation runtime ships to prod; it's a real dep, not dev-only. Toolbar tree-shakes separately. |
| API surface | Single `<Crosstown>` component | Simpler than a wrapper + toolbar pair. One import, one mount, the simplest possible API. |
| Framework | Next.js App Router | v0.1 focus. Others in v0.2. |
| Animation library | Framer Motion | De facto standard; users likely already have it. Peer dep. |
| Masking technique | CSS `clip-path` | Simpler than SVG `<clipPath>`, animates cleanly with Framer Motion, keeps DOM interactive. |
| Styling | Inline styles | No Tailwind dep, no global CSS, no reset conflicts. |
| Dev gate | `process.env.NODE_ENV !== 'development'` on toolbar UI | Wrapper code always runs; toolbar UI tree-shakes out of prod. |
| Persistence | `localStorage` + in-memory state | Toolbar writes to localStorage; wrapper reads same store. No reload needed. |
| Preview trigger | Slider-release for continuous controls; immediate for dropdowns; explicit Play button for replay | Matches user's explicit instruction. Avoids jitter during slider drag. |
| Copy output format | Config-first prompt (structured config + one-line prose header) | Agent already knows about Crosstown; job is to wire up the config, not interpret intent. |
| License | MIT | Easier adoption; no need to block competing products at v0.1. |

---

## The six presets

Implemented inside `src/presets.ts`. The type system in `src/types.ts` is the source of truth.

| Preset | Configurable params | Implementation |
|---|---|---|
| `crossfade` | `duration`, `easing` | Pure opacity 0→1 / 1→0. |
| `wipe` | `direction` (left/right/up/down), `duration`, `easing` | `clip-path: inset(...)` animating from 100% to 0%. |
| `circular` | `origin` (normalized x/y, default center), `duration`, `easing` | `clip-path: circle(r at x y)` animating 0%→150%. |
| `blinds` | `orientation` (vertical/horizontal), `segments` (2–30, default 8), `duration`, `easing` | `polygon()` of N strips collapsing to leading edge. |
| `zigzag` | `direction`, `segments` (4–40, default 12), `duration`, `easing` | `polygon()` with sawtooth leading edge sweeping across axis. |
| `inset` | `duration`, `easing` | Transform — new page scales from 0.92 with opacity fade. |

**Shared params (all presets):**
- `duration`: 0–1200ms, step 25
- `easing`: `linear` / `easeIn` / `easeOut` / `easeInOut` / `standard` / `emphasized` / `decelerate` / `accelerate` (last four are Material Design 3 cubic-beziers)

---

## API

### Component

```tsx
import { Crosstown } from 'crosstown';

// Dev: toolbar visible, user tunes via UI, localStorage persists
<Crosstown>{children}</Crosstown>

// Prod or dev-with-baked-config: toolbar hidden, config is deterministic
<Crosstown config={{ preset: 'wipe', direction: 'left', duration: 400, easing: 'easeOut' }}>
  {children}
</Crosstown>
```

When `config` prop is passed, localStorage is ignored — the passed config is the source of truth. Useful for deterministic production behavior after tuning in dev.

### Types

```ts
// Exported from 'crosstown'
export type TransitionPreset = 'crossfade' | 'wipe' | 'circular' | 'blinds' | 'zigzag' | 'inset';
export type Direction = 'left' | 'right' | 'up' | 'down';
export type Orientation = 'vertical' | 'horizontal';
export type EasingName = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'standard' | 'emphasized' | 'decelerate' | 'accelerate';

export interface TransitionConfig {
  preset: TransitionPreset;
  direction?: Direction;
  orientation?: Orientation;
  segments?: number;
  origin?: { x: number; y: number };
  duration: number;  // ms
  easing: EasingName;
}
```

No separate Enter/Exit config in v0.1 — one config applies symmetrically. Asymmetric timing is v0.2.

### Default config

```ts
{ preset: 'crossfade', duration: 300, easing: 'easeOut' }
```

Safe, universally pleasant. Gives users a reason to open the toolbar (it's subtle — they'll want to try something more visible).

---

## Toolbar UX

### States

**Collapsed (default):** Pill, bottom-right, 16px inset. Shows `{preset} · {duration}ms`. Click to expand.

**Expanded:** 320px panel. Dark glass (`rgba(20, 20, 22, 0.92)` + `backdrop-filter: blur(16px)`), subtle border, elevation shadow.

### Panel contents (top to bottom)

1. **Header** — "Crosstown" title, close button.
2. **Preset dropdown** — the six presets.
3. **Direction / orientation / segments / origin** — shown conditionally based on the selected preset.
4. **Duration slider** — 0–1200ms, step 25.
5. **Easing dropdown** — eight options.
6. **Play button** — ▶ icon, replays the current config.
7. **Copy button** — outputs the config-first prompt to clipboard. Shows "Copied" for 1.5s.
8. **Footer** — Reset link, "dev only" label.

### Auto-preview behavior

- **Preset / direction / orientation / easing dropdown change:** animation replays immediately.
- **Duration slider / segments slider / origin picker:** animation replays on release (mouseup / touchend), not during drag.
- **Play button:** replays the current config any time.

### How the preview works

Crosstown internally keys `<AnimatePresence mode="wait">` on a `replayKey` state value in addition to `pathname`. When the user triggers a preview:

1. `replayKey` increments.
2. `AnimatePresence` sees the key change, plays exit on the old child.
3. Plays enter on the new child (same content, new key).
4. User sees the transition in-place with no navigation.

Real navigations use the same animation path (keyed on `pathname`), so what the user sees in preview is identical to what happens on a real route change. No gap between demo and production.

### Keyboard shortcut

`⌘⇧T` (Mac) / `Ctrl+Shift+T` (Windows/Linux) toggles the toolbar.

### Accessibility

- `role="dialog"` on the expanded panel.
- `aria-label` on all icon-only buttons.
- Color contrast: text at `rgba(255,255,255,0.92)` primary, `0.7` secondary — verified WCAG AA against the dark glass background.
- Origin picker is mouse-only in v0.1 (keyboard support is v0.2).

---

## The Copy button

When the user clicks Copy, this is written to their clipboard:

```
Apply this Crosstown transition config globally. Crosstown is already installed. Create crosstown.config.ts with the config below, then update the root layout to pass it to <Crosstown> via the config prop.

// crosstown.config.ts
import type { TransitionConfig } from 'crosstown';

export const transitionConfig: TransitionConfig = {
  preset: 'wipe',
  direction: 'left',
  duration: 400,
  easing: 'easeOut',
};

// app/layout.tsx
import { Crosstown } from 'crosstown';
import { transitionConfig } from '../crosstown.config';

<Crosstown config={transitionConfig}>{children}</Crosstown>
```

The agent receives: prose intent, the exact config file to create, the exact layout edit to make. No ambiguity. No hand-rolled Framer Motion code.

---

## Architecture

### File manifest

```
crosstown/
├── package.json
├── README.md
├── LICENSE (MIT)
├── tsconfig.json
├── tsup.config.ts
└── src/
    ├── index.ts           # exports: Crosstown, TransitionConfig, type helpers
    ├── Crosstown.tsx      # the single public component (wrapper + toolbar)
    ├── wrapper.tsx        # internal: AnimatePresence logic, replay key, reads config
    ├── toolbar.tsx        # internal: the dev-only UI
    ├── toolbar-styles.ts  # inline style objects
    ├── presets.ts         # the six preset implementations (clip-path builders + motion props)
    ├── types.ts           # TransitionConfig, TransitionPreset, etc.
    └── storage.ts         # localStorage load/save + CustomEvent subscription
```

### Data flow

```
User tweaks slider in toolbar
        ↓
storage.saveConfig() writes to localStorage
        ↓
dispatchEvent('crosstown-change', { detail: config })
        ↓
wrapper.tsx receives event, setConfig(new)
        ↓
wrapper.tsx increments replayKey
        ↓
AnimatePresence plays exit → enter with new config
```

Real navigation takes the same path minus the replayKey bump — pathname change triggers the same animation code.

### Tree-shaking the toolbar in production

`Crosstown.tsx` has a top-level check:

```tsx
export function Crosstown({ children, config }: Props) {
  return (
    <>
      <Wrapper config={config}>{children}</Wrapper>
      {process.env.NODE_ENV === 'development' && !config && <Toolbar />}
    </>
  );
}
```

Two conditions for showing the toolbar:
1. `NODE_ENV === 'development'` — bundler strips this branch in production builds.
2. `!config` — if the user has baked in a config via the prop, they're done tuning. Hide the toolbar even in dev.

---

## Acceptance criteria

### Package

- [ ] `npm install crosstown` works.
- [ ] `import { Crosstown } from 'crosstown'` resolves; types ship alongside.
- [ ] Peer deps: `react >=18`, `framer-motion >=11`. No hard runtime deps.
- [ ] Dual ESM + CJS build via `tsup`.
- [ ] Bundle size (runtime only, gzipped): ≤8kb. Measure with `size-limit`.
- [ ] Toolbar code excluded from production builds (verified by grepping build output for toolbar-specific strings).

### Runtime behavior

- [ ] `<Crosstown>{children}</Crosstown>` animates page transitions on every route change.
- [ ] All six presets render correctly with no console errors.
- [ ] Default config applies when no `config` prop and no localStorage value.
- [ ] Passing a `config` prop overrides localStorage and hides the toolbar.
- [ ] Animations use the specified duration and easing.

### Toolbar UX

- [ ] Pill shows `{preset} · {duration}ms`, updates live.
- [ ] Clicking the pill expands to the panel.
- [ ] `⌘⇧T` / `Ctrl+Shift+T` toggles the toolbar.
- [ ] Preset / direction / orientation / easing changes auto-preview immediately.
- [ ] Duration / segments / origin changes auto-preview on release, not during drag.
- [ ] Play button replays the current config.
- [ ] Copy button writes a valid paste-ready prompt to clipboard; shows "Copied" feedback.
- [ ] Reset link restores default config.
- [ ] Config persists to localStorage across page reloads.

### Copy prompt

- [ ] Prompt is config-first with prose header and both file contents (`crosstown.config.ts` + layout edit).
- [ ] Pasting the prompt into Claude Code on a fresh Crosstown-installed project produces a working baked config.

### Docs

- [ ] README: hero GIF, install, usage (three-line code block), feature list (six presets), requirements, license.
- [ ] README length: tight and scannable (~60–80 lines). No excess.

---

## Distribution

- **npm package:** `crosstown`
- **GitHub repo:** `github.com/0xchsh/crosstown`
- **License:** MIT
- **Launch channels:**
  - Tweet the repo + hero GIF from `@0xchsh`.
  - Post in Framer Motion Discord and Next.js Discord.
  - Submit to `awesome-nextjs`.
  - Cross-post to r/nextjs.
  - Reach out to authors of adjacent localhost dev tools for cross-promotion.

### Versioning

- `0.1.0` — six presets, global config, App Router, toolbar, Copy button.
- `0.2.0` — Pages Router, Vite + React Router, per-route rules, draggable pill, `crosstown.dev` site, asymmetric enter/exit timing.
- `1.0.0` — after 3 months of real use and at least two breaking changes absorbed.

---

## Implementation order

**Step 1 — Scaffold.** `pnpm init`, `tsup` config, `tsconfig`, `package.json` with peer deps (`react >=18`, `framer-motion >=11`). Port `src/presets.ts` and `src/types.ts` from the existing skill.

**Step 2 — Runtime.** Build `src/wrapper.tsx` (AnimatePresence + replayKey + storage subscription) and `src/Crosstown.tsx` (the single public component). Verify all six presets animate correctly in a throwaway Next.js App Router test app.

**Step 3 — Toolbar.** Build `src/toolbar.tsx`: panel UI, auto-preview behavior, Play button, Copy button, Reset link. Verify auto-preview fires correctly on dropdown change vs slider release.

**Step 4 — Ship.** Write README. Record hero GIF. `npm publish`. Push to GitHub. Tweet.

The skill already has the hardest code (preset math, toolbar UI primitives, clip-path builders) written, so each step should move fast.

---

## Open questions

These still need Charles's answer:

1. **GIF vs MP4 for the hero.** GIF is universal but large. MP4 is smaller and crisper but requires GitHub's video embed. Recommendation: both — MP4 in the README via GitHub video upload, GIF as fallback for Twitter.
2. **Reset button.** Include a Reset link in the toolbar footer to restore default config? Recommendation: yes, one line of code, saves a user from googling. (Already in the acceptance criteria above — flag if you disagree.)

---

## Success criteria

**Day 0:** a fresh `create-next-app` project, install Crosstown, drop in the component, all six presets work. No TypeScript errors, no console warnings, no visual glitches.

**Week 1 post-launch:** 25–50 GitHub stars, zero critical bugs, one unsolicited mention from someone in the Framer Motion or Next.js community.

**Month 1:** 200+ weekly npm downloads, two community PRs, one production site shipping transitions tuned with Crosstown.

**Month 3:** Crosstown sits in the default mental list of "localhost dev toolbars." If someone writes up the category, Crosstown gets mentioned unprompted.

If none of that lands, Crosstown is still a polished open-source tool that demonstrates taste and engineering judgment — a strong portfolio artifact for the job search regardless of adoption.