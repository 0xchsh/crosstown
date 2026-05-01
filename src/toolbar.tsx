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
  CaretLeft,
  CaretRight,
  Clock,
  DiceFive,
  Gear,
  X as XIcon,
} from '@phosphor-icons/react';
import {
  dispatchReplay,
  loadConfig,
  saveConfig,
  subscribeConfigChange,
} from './storage';
import { styles } from './toolbar-styles';
import {
  DEFAULT_CONFIG,
  type TransitionConfig,
  type TransitionPreset,
} from './types';

const VERSION = '0.1.0';

// Common transition durations: snappy, default, considered, theatrical, max.
// Click to snap. The slider stays free-form between them.
const DURATION_PRESETS = [150, 300, 500, 800, 1200] as const;

// Only enable hover effects on devices that actually have hover (mouse/pen).
// On touch, mouseenter fires on tap-down which would flash the hover state.
const HOVER_CAPABLE =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const ANIM_EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

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
  const [expandedEntered, setExpandedEntered] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [durationEntered, setDurationEntered] = useState(false);
  const [settingsEntered, setSettingsEntered] = useState(false);
  const [diceSpin, setDiceSpin] = useState(0);
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
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (mod && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        setExpanded((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Collapsing the toolbar dismisses any open popovers.
  useEffect(() => {
    if (!expanded) {
      setSettingsOpen(false);
      setDurationOpen(false);
    }
  }, [expanded]);

  // Origin-aware popover entrance: render at scale(0.96)/opacity:0 for one
  // frame, then transition to scale(1)/opacity:1. Avoids the "appears from
  // nothing" feel that a scale(0) → scale(1) animation has.
  useEffect(() => {
    if (durationOpen) {
      const id = requestAnimationFrame(() => setDurationEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setDurationEntered(false);
  }, [durationOpen]);

  useEffect(() => {
    if (settingsOpen) {
      const id = requestAnimationFrame(() => setSettingsEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setSettingsEntered(false);
  }, [settingsOpen]);

  // Pill → bar entrance: render the bar at scale(0.96)/opacity:0 for one frame,
  // then transition into place. Collapse is instant (the user's intent is
  // unambiguous — animating out would feel laggy).
  useEffect(() => {
    if (expanded) {
      const id = requestAnimationFrame(() => setExpandedEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setExpandedEntered(false);
  }, [expanded]);

  // Click-outside / Escape closes both popovers. Clicks inside the container
  // (including the bar buttons and the popovers themselves) are ignored — each
  // bar button decides for itself whether opening one popover should close the
  // other.
  useEffect(() => {
    if (!durationOpen && !settingsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setDurationOpen(false);
      setSettingsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDurationOpen(false);
        setSettingsOpen(false);
      }
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [durationOpen, settingsOpen]);

  const commit = useCallback((next: TransitionConfig) => {
    setConfig(next);
    saveConfig(next);
  }, []);

  const updateLocal = useCallback((patch: Partial<TransitionConfig>) => {
    setConfig((c) => ({ ...c, ...patch }));
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
    setDiceSpin((s) => s + 360);
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

  // Drag-to-reposition the expanded panel. Only fires when the pointerdown
  // lands on a non-interactive surface (panel padding / row gaps); clicks on
  // buttons, the select, or popovers fall through to their own handlers. We
  // store the cursor's offset within the panel so the grab point stays under
  // the finger instead of jumping to the panel center.
  const panelOffsetRef = useRef({ x: 0, y: 0 });
  const onPanelPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, select, input, a, label')) return;
      const rect = e.currentTarget.getBoundingClientRect();
      panelOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        pillW: rect.width,
        pillH: rect.height,
        didDrag: false,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [],
  );
  const onPanelPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      const { startX, startY, pillW, pillH, didDrag } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!didDrag && Math.hypot(dx, dy) <= DRAG_THRESHOLD_PX) return;
      if (!didDrag) {
        dragRef.current.didDrag = true;
        setIsDragging(true);
      }
      const { x: ox, y: oy } = panelOffsetRef.current;
      setPosition(
        clampToViewport(e.clientX - ox, e.clientY - oy, pillW, pillH),
      );
    },
    [],
  );
  const onPanelPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.didDrag) return;
      const { pillW, pillH } = dragRef.current;
      const { x: ox, y: oy } = panelOffsetRef.current;
      const next = clampToViewport(
        e.clientX - ox,
        e.clientY - oy,
        pillW,
        pillH,
      );
      setPosition(next);
      savePosition(next);
      setIsDragging(false);
      dragRef.current.didDrag = false;
    },
    [],
  );

  // When the panel expands, its bounds are much larger than the pill's, so a
  // pill position near a viewport edge can leave the panel clipped. Measure
  // after layout and shift the panel into the viewport before paint.
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
          title="Crosstown — ⌘⇧C"
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
      {durationOpen && (
        <div
          style={{
            ...styles.popover,
            ...styles.popoverAnimate,
            transformOrigin: 'bottom left',
            transform: durationEntered ? 'scale(1)' : 'scale(0.96)',
            opacity: durationEntered ? 1 : 0,
          }}
          role="dialog"
          aria-label="Duration"
        >
          <div style={styles.durationChips}>
            {DURATION_PRESETS.map((ms) => (
              <Pressable
                key={ms}
                style={
                  ms === config.duration
                    ? { ...styles.durationChip, ...styles.durationChipActive }
                    : styles.durationChip
                }
                onClick={() => commit({ ...config, duration: ms })}
                aria-pressed={ms === config.duration}
                aria-label={`${ms} milliseconds`}
              >
                {ms}ms
              </Pressable>
            ))}
          </div>
        </div>
      )}
      {settingsOpen && (
        <div
          style={{
            ...styles.popover,
            ...styles.popoverNarrow,
            ...styles.popoverAnimate,
            transformOrigin: 'bottom right',
            transform: settingsEntered ? 'scale(1)' : 'scale(0.96)',
            opacity: settingsEntered ? 1 : 0,
          }}
          role="dialog"
          aria-label="Settings"
        >
          <SettingsView />
        </div>
      )}
      <div
        style={{
          ...styles.panel,
          cursor: isDragging ? 'grabbing' : 'grab',
          transformOrigin: 'bottom right',
          transform: expandedEntered ? 'scale(1)' : 'scale(0.96)',
          opacity: expandedEntered ? 1 : 0,
          transition: `transform 180ms ${ANIM_EASE}, opacity 180ms ${ANIM_EASE}`,
        }}
        onPointerDown={onPanelPointerDown}
        onPointerMove={onPanelPointerMove}
        onPointerUp={onPanelPointerUp}
        onPointerCancel={onPanelPointerUp}
      >
        <div style={styles.barRow}>
          <Pressable
            style={styles.barStepButton}
            onClick={() => stepPreset(-1)}
            aria-label="Previous preset"
            title="Previous preset"
          >
            <ChevronLeftIcon />
          </Pressable>
          <select
            style={styles.barPresetPill}
            value={config.preset}
            onChange={(e) =>
              commit({
                ...config,
                preset: e.target.value as TransitionPreset,
              })
            }
            aria-label="Preset"
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {PRESET_LABELS[p]}
              </option>
            ))}
          </select>
          <Pressable
            style={styles.barStepButton}
            onClick={() => stepPreset(1)}
            aria-label="Next preset"
            title="Next preset"
          >
            <ChevronRightIcon />
          </Pressable>
        </div>
        <div style={styles.barRow}>
          <Pressable
            style={
              durationOpen
                ? { ...styles.barIconButton, ...styles.barIconButtonActive }
                : styles.barIconButton
            }
            hoverStyle={durationOpen ? undefined : styles.barIconButtonHover}
            onClick={() => {
              setSettingsOpen(false);
              setDurationOpen((v) => !v);
            }}
            aria-label="Duration"
            aria-expanded={durationOpen}
            title={`Duration (${config.duration}ms)`}
          >
            <ClockIcon />
          </Pressable>
          <Pressable
            style={styles.barIconButton}
            hoverStyle={styles.barIconButtonHover}
            onClick={handleRandomize}
            aria-label="Random preset"
            title="Random preset"
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                transform: `rotate(${diceSpin}deg)`,
                transition:
                  'transform 420ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              <DiceIcon />
            </span>
          </Pressable>
          <Pressable
            style={
              settingsOpen
                ? { ...styles.barIconButton, ...styles.barIconButtonActive }
                : styles.barIconButton
            }
            hoverStyle={settingsOpen ? undefined : styles.barIconButtonHover}
            onClick={() => {
              setDurationOpen(false);
              setSettingsOpen((v) => !v);
            }}
            aria-label="Settings"
            aria-expanded={settingsOpen}
            title="Settings"
          >
            <SettingsIcon />
          </Pressable>
          <Pressable
            style={
              copied
                ? { ...styles.barCopyButton, ...styles.barCopyButtonCopied }
                : styles.barCopyButton
            }
            onClick={handleCopy}
            aria-label="Copy config-first prompt to clipboard"
          >
            {copied ? 'Copied' : 'Copy Prompt'}
          </Pressable>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <>
      <div style={styles.settingsRowFirst}>
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
        <span style={styles.settingsValue}>⌘⇧C</span>
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
  hoverStyle,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  style: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
}) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const release = () => setPressed(false);
  return (
    <button
      type="button"
      {...props}
      style={{
        ...style,
        ...(HOVER_CAPABLE && hovered && hoverStyle ? hoverStyle : null),
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: `transform 160ms cubic-bezier(0.2, 0, 0, 1), background-color 120ms ${ANIM_EASE}`,
      }}
      onPointerEnter={(e) => {
        setHovered(true);
        props.onPointerEnter?.(e);
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
        setHovered(false);
        release();
        props.onPointerLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

// All toolbar icons render with Phosphor's "fill" weight for a consistent,
// solid-glyph look that matches the rest of the example app.
const ICON_PROPS = { weight: 'fill' as const, size: 18, 'aria-hidden': true };

const ChevronLeftIcon = () => <CaretLeft {...ICON_PROPS} size={16} />;
const ChevronRightIcon = () => <CaretRight {...ICON_PROPS} size={16} />;
const ClockIcon = () => <Clock {...ICON_PROPS} />;
const DiceIcon = () => <DiceFive {...ICON_PROPS} />;
const SettingsIcon = () => <Gear {...ICON_PROPS} />;
const CloseIcon = () => <XIcon {...ICON_PROPS} size={14} />;

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
