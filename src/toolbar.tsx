'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  clearConfig,
  dispatchReplay,
  loadConfig,
  saveConfig,
  subscribeConfigChange,
} from './storage';
import { styles } from './toolbar-styles';
import {
  DEFAULT_CONFIG,
  type EasingName,
  type TransitionConfig,
  type TransitionPreset,
} from './types';

const EASINGS: EasingName[] = [
  'linear',
  'easeIn',
  'easeOut',
  'easeInOut',
  'standard',
  'emphasized',
  'decelerate',
  'accelerate',
];

const VERSION = '0.1.0';

interface Position {
  x: number;
  y: number;
}
const POSITION_KEY = 'crosstown:position';
const DRAG_THRESHOLD_PX = 5;
const VIEWPORT_MARGIN = 8;

function clampToViewport(
  x: number,
  y: number,
  w: number,
  h: number,
): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(VIEWPORT_MARGIN, vw - w - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, vh - h - VIEWPORT_MARGIN);
  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(x, maxX)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(y, maxY)),
  };
}

function loadPosition(): Position | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'x' in parsed &&
      'y' in parsed &&
      typeof (parsed as Position).x === 'number' &&
      typeof (parsed as Position).y === 'number'
    ) {
      return parsed as Position;
    }
    return null;
  } catch {
    return null;
  }
}

function savePosition(p: Position): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(POSITION_KEY, JSON.stringify(p));
  } catch {
    /* swallow */
  }
}

const PRESET_LABELS: Record<TransitionPreset, string> = {
  crossfade: 'Crossfade',
  'fade-out-in': 'Fade Out & In',
  'slide-left': 'Slide Left',
  'slide-up': 'Slide Up',
  'slide-right': 'Slide Right',
  'slide-down': 'Slide Down',
  'push-left': 'Push Left',
  'push-up': 'Push Up',
  'push-right': 'Push Right',
  'push-down': 'Push Down',
  'wipe-left': 'Wipe Left',
  'wipe-up': 'Wipe Up',
  'wipe-right': 'Wipe Right',
  'wipe-down': 'Wipe Down',
};

// Order matches the Framer reference dropdown.
const PRESETS: TransitionPreset[] = [
  'crossfade',
  'fade-out-in',
  'slide-left',
  'slide-up',
  'slide-right',
  'slide-down',
  'push-left',
  'push-up',
  'push-right',
  'push-down',
  'wipe-left',
  'wipe-up',
  'wipe-right',
  'wipe-down',
];

export function Toolbar() {
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [config, setConfig] = useState<TransitionConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    pillW: number;
    pillH: number;
    didDrag: boolean;
  }>({ startX: 0, startY: 0, pillW: 0, pillH: 0, didDrag: false });

  useEffect(() => {
    const stored = loadConfig();
    if (stored) setConfig(stored);
    setPosition(loadPosition());
    setHydrated(true);
    return subscribeConfigChange((next) => {
      setConfig(next ?? DEFAULT_CONFIG);
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.shiftKey && e.code === 'KeyT') {
        e.preventDefault();
        setExpanded((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Always open the panel to the main view, never to settings.
  useEffect(() => {
    if (!expanded) setSettingsOpen(false);
  }, [expanded]);

  const commit = useCallback((next: TransitionConfig) => {
    setConfig(next);
    saveConfig(next);
  }, []);

  const updateLocal = useCallback((patch: Partial<TransitionConfig>) => {
    setConfig((c) => ({ ...c, ...patch }));
  }, []);

  const handleReset = useCallback(() => {
    clearConfig();
    setConfig(DEFAULT_CONFIG);
  }, []);

  const stepPreset = useCallback(
    (delta: 1 | -1) => {
      setConfig((c) => {
        const i = PRESETS.indexOf(c.preset);
        const next = PRESETS[(i + delta + PRESETS.length) % PRESETS.length];
        const updated = { ...c, preset: next };
        saveConfig(updated);
        return updated;
      });
    },
    [],
  );

  const handleRandomize = useCallback(() => {
    setConfig((c) => {
      // Avoid landing on the same preset twice in a row — feels broken otherwise.
      const others = PRESETS.filter((p) => p !== c.preset);
      const next = others[Math.floor(Math.random() * others.length)];
      const updated = { ...c, preset: next };
      saveConfig(updated);
      return updated;
    });
  }, []);

  const handleCopy = useCallback(async () => {
    const prompt = buildCopyPrompt(config);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be denied; fail silently */
    }
  }, [config]);

  // Pill drag-to-reposition. We track movement past a 5px threshold to
  // distinguish "click to expand" from "drag to move." On release we snap
  // to the nearest of the four screen corners and persist that choice.
  const onPillPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        pillW: rect.width,
        pillH: rect.height,
        didDrag: false,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );
  const onPillPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      // pointermove fires on plain hover too — only respond while the pointer
      // is captured (i.e., between pointerdown and pointerup).
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      const { startX, startY, pillW, pillH, didDrag } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!didDrag && Math.hypot(dx, dy) <= DRAG_THRESHOLD_PX) return;
      if (!didDrag) {
        dragRef.current.didDrag = true;
        setIsDragging(true);
      }
      setPosition(
        clampToViewport(
          e.clientX - pillW / 2,
          e.clientY - pillH / 2,
          pillW,
          pillH,
        ),
      );
    },
    [],
  );
  const onPillPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (dragRef.current.didDrag) {
        // Free-form positioning: stays exactly where dropped, no corner snap.
        // Clamp so the pill can't be left straddling a viewport edge.
        const { pillW, pillH } = dragRef.current;
        const next = clampToViewport(
          e.clientX - pillW / 2,
          e.clientY - pillH / 2,
          pillW,
          pillH,
        );
        setPosition(next);
        savePosition(next);
        setIsDragging(false);
        // Click event fires after pointerup — bail out via the ref check in
        // onPillClick.
      }
    },
    [],
  );
  const onPillClick = useCallback(() => {
    if (dragRef.current.didDrag) {
      dragRef.current.didDrag = false;
      return;
    }
    setExpanded(true);
  }, []);

  // When the panel expands, its bounds are much larger than the pill's, so a
  // pill position near a viewport edge can leave the panel clipped. Measure
  // after layout and shift the panel into the viewport before paint.
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelClamp, setPanelClamp] = useState<Position | null>(null);

  useLayoutEffect(() => {
    if (!expanded || !position) {
      setPanelClamp(null);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = clampToViewport(position.x, position.y, rect.width, rect.height);
    setPanelClamp(
      next.x === position.x && next.y === position.y ? null : next,
    );
    // Re-run when settingsOpen flips: switching views resizes the panel, so a
    // stale clamp from the previous view can leave the new view overflowing.
  }, [expanded, position, settingsOpen]);

  const containerStyle: CSSProperties = useMemo(() => {
    const effective = expanded ? panelClamp ?? position : position;
    if (effective) {
      return {
        ...styles.container,
        top: effective.y,
        left: effective.x,
        bottom: 'auto',
        right: 'auto',
      };
    }
    // No saved or active position — fall back to the default in styles.container
    // (bottom-right with 16px inset).
    return styles.container;
  }, [position, panelClamp, expanded]);

  if (!hydrated) return null;

  if (!expanded) {
    return (
      <div ref={containerRef} style={containerStyle}>
        <Pressable
          style={
            isDragging
              ? { ...styles.pill, cursor: 'grabbing' }
              : { ...styles.pill, cursor: 'grab' }
          }
          onClick={onPillClick}
          onPointerDown={onPillPointerDown}
          onPointerMove={onPillPointerMove}
          onPointerUp={onPillPointerUp}
          onPointerCancel={onPillPointerUp}
          aria-label="Crosstown toolbar — click to open, drag to reposition"
          title="Crosstown — ⌘⇧T"
        >
          <span style={styles.pillDot} />
          <span>
            {PRESET_LABELS[config.preset]} · {config.duration}ms
          </span>
        </Pressable>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      role="dialog"
      aria-label="Crosstown toolbar"
    >
      <div style={styles.panel}>
        <div style={styles.header}>
          {settingsOpen ? (
            <span style={styles.title}>Settings</span>
          ) : (
            <span aria-hidden="true" />
          )}
          <Pressable
            style={styles.iconButton}
            onClick={() =>
              settingsOpen ? setSettingsOpen(false) : setExpanded(false)
            }
            aria-label={
              settingsOpen ? 'Close settings' : 'Close Crosstown toolbar'
            }
            title={settingsOpen ? 'Back' : 'Close (⌘⇧T)'}
          >
            <CloseIcon />
          </Pressable>
        </div>

        {settingsOpen ? (
          <SettingsView
            config={config}
            onEasingChange={(easing) => commit({ ...config, easing })}
            onReset={handleReset}
          />
        ) : (
          <>
            <Row label="Preset">
              <div style={styles.presetStepper}>
                <Pressable
                  style={styles.stepButton}
                  onClick={() => stepPreset(-1)}
                  aria-label="Previous preset"
                  title="Previous preset"
                >
                  <span aria-hidden="true">‹</span>
                </Pressable>
                <select
                  style={{ ...styles.select, flex: 1 }}
                  value={config.preset}
                  onChange={(e) =>
                    commit({
                      ...config,
                      preset: e.target.value as TransitionPreset,
                    })
                  }
                >
                  {PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {PRESET_LABELS[p]}
                    </option>
                  ))}
                </select>
                <Pressable
                  style={styles.stepButton}
                  onClick={() => stepPreset(1)}
                  aria-label="Next preset"
                  title="Next preset"
                >
                  <span aria-hidden="true">›</span>
                </Pressable>
              </div>
            </Row>

            <SliderRow
              label="Duration"
              valueLabel={`${config.duration}ms`}
              min={0}
              max={1200}
              step={25}
              value={config.duration}
              onLive={(v) => updateLocal({ duration: v })}
              onCommit={(v) => commit({ ...config, duration: v })}
            />

            <div style={styles.actionRow}>
              <Pressable
                style={styles.iconActionButton}
                onClick={handleRandomize}
                aria-label="Random preset"
                title="Random preset"
              >
                <DiceIcon />
              </Pressable>
              <Pressable
                style={styles.iconActionButton}
                onClick={dispatchReplay}
                aria-label="Replay current transition"
                title="Replay"
              >
                <PlayIcon />
              </Pressable>
              <Pressable
                style={
                  copied
                    ? { ...styles.copyButton, ...styles.copyButtonCopied }
                    : styles.copyButton
                }
                onClick={handleCopy}
                aria-label="Copy config-first prompt to clipboard"
              >
                {copied ? 'Copied' : 'Copy prompt'}
              </Pressable>
              <span style={styles.actionDivider} aria-hidden="true" />
              <Pressable
                style={styles.iconActionButton}
                onClick={() => setSettingsOpen(true)}
                aria-label="Open settings"
                title="Settings"
              >
                <SettingsIcon />
              </Pressable>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SettingsView({
  config,
  onEasingChange,
  onReset,
}: {
  config: TransitionConfig;
  onEasingChange: (easing: EasingName) => void;
  onReset: () => void;
}) {
  return (
    <>
      <div style={styles.settingsRowFirst}>
        <span style={styles.settingsLabel}>Easing</span>
        <select
          style={styles.settingsSelect}
          value={config.easing}
          onChange={(e) => onEasingChange(e.target.value as EasingName)}
        >
          {EASINGS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.settingsRow}>
        <span style={styles.settingsLabel}>Reset to defaults</span>
        <button type="button" onClick={onReset} style={styles.settingsLink}>
          Reset
        </button>
      </div>
      <div style={styles.settingsRow}>
        <span style={styles.settingsLabel}>Version</span>
        <span style={styles.settingsValue}>v{VERSION}</span>
      </div>
      <div style={styles.settingsRow}>
        <span style={styles.settingsLabel}>Repository</span>
        <a
          href="https://github.com/0xchsh/crosstown"
          target="_blank"
          rel="noreferrer"
          style={styles.settingsLink}
        >
          GitHub ↗
        </a>
      </div>
      <div style={styles.settingsRow}>
        <span style={styles.settingsLabel}>Shortcut</span>
        <span style={styles.settingsValue}>⌘⇧T</span>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={styles.row}>
      <label style={styles.label}>
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

function SliderRow({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onLive,
  onCommit,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onLive: (v: number) => void;
  onCommit: (v: number) => void;
}) {
  return (
    <div style={styles.row}>
      <label style={styles.label}>
        <span>{label}</span>
        <span style={styles.labelValue}>{valueLabel}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onLive(Number(e.target.value))}
        onPointerUp={(e) =>
          onCommit(Number((e.target as HTMLInputElement).value))
        }
        onKeyUp={(e) => {
          if (
            ['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(
              e.key,
            )
          ) {
            onCommit(Number((e.target as HTMLInputElement).value));
          }
        }}
        style={styles.slider}
      />
    </div>
  );
}

// Per Emil Kowalski: buttons must feel responsive to press. transform: scale(0.97)
// gives the interface "instant feedback that it heard the user." Inline-style
// constraint of v0.1 means we manage the pressed state in React rather than via
// :active CSS — the transition smooths the un-press.
function Pressable({
  style,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  style: React.CSSProperties;
}) {
  const [pressed, setPressed] = useState(false);
  const release = () => setPressed(false);
  return (
    <button
      type="button"
      {...props}
      style={{
        ...style,
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 160ms cubic-bezier(0.2, 0, 0, 1)',
      }}
      onPointerDown={(e) => {
        setPressed(true);
        props.onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        release();
        props.onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        release();
        props.onPointerCancel?.(e);
      }}
      onPointerLeave={(e) => {
        release();
        props.onPointerLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

// Inline SVG icons keep the package free of external icon dependencies and
// render consistently across platforms (unlike unicode glyphs / emoji).
const ICON_BASE = {
  width: 14,
  height: 14,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function PlayIcon() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="6,4 20,12 6,20" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg {...ICON_BASE}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg {...ICON_BASE}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg {...ICON_BASE}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg {...ICON_BASE}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function buildCopyPrompt(config: TransitionConfig): string {
  const literal = `{
  preset: '${config.preset}',
  duration: ${config.duration},
  easing: '${config.easing}',
}`;

  return `Apply this Crosstown transition config globally. Crosstown is already installed. Create crosstown.config.ts with the config below, then update the root layout to pass it to <Crosstown> via the config prop.

// crosstown.config.ts
import type { TransitionConfig } from 'crosstown';

export const transitionConfig: TransitionConfig = ${literal};

// app/layout.tsx
import { Crosstown } from 'crosstown';
import { transitionConfig } from '../crosstown.config';

<Crosstown config={transitionConfig}>{children}</Crosstown>
`;
}
