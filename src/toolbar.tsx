'use client';

import {
  useCallback,
  useEffect,
  useState,
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

export function Toolbar() {
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [config, setConfig] = useState<TransitionConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = loadConfig();
    if (stored) setConfig(stored);
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

  if (!hydrated) return null;

  if (!expanded) {
    return (
      <div style={styles.container}>
        <Pressable
          style={styles.pill}
          onClick={() => setExpanded(true)}
          aria-label="Open Crosstown toolbar"
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
    <div style={styles.container} role="dialog" aria-label="Crosstown toolbar">
      <div style={styles.panel}>
        <div style={styles.header}>
          <span style={styles.title}>Crosstown</span>
          <Pressable
            style={styles.iconButton}
            onClick={() => setExpanded(false)}
            aria-label="Close Crosstown toolbar"
            title="Close (⌘⇧T)"
          >
            ×
          </Pressable>
        </div>

        <Row label="Preset">
          <select
            style={styles.select}
            value={config.preset}
            onChange={(e) =>
              commit({ ...config, preset: e.target.value as TransitionPreset })
            }
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {PRESET_LABELS[p]}
              </option>
            ))}
          </select>
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

        <Row label="Easing">
          <select
            style={styles.select}
            value={config.easing}
            onChange={(e) =>
              commit({ ...config, easing: e.target.value as EasingName })
            }
          >
            {EASINGS.map((eName) => (
              <option key={eName} value={eName}>
                {eName}
              </option>
            ))}
          </select>
        </Row>

        <div style={styles.actionRow}>
          <Pressable
            style={styles.playButton}
            onClick={dispatchReplay}
            aria-label="Replay current transition"
            title="Replay"
          >
            <span aria-hidden="true">▶</span>
            <span>Play</span>
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
        </div>

        <div style={styles.footer}>
          <button type="button" style={styles.resetLink} onClick={handleReset}>
            Reset
          </button>
          <span style={styles.devLabel}>dev only</span>
        </div>
      </div>
    </div>
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
