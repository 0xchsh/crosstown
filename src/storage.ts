import type { EasingName, TransitionConfig, TransitionPreset } from './types';

const STORAGE_KEY = 'crosstown:config';
const CHANGE_EVENT = 'crosstown-change';
const REPLAY_EVENT = 'crosstown-replay';

const VALID_PRESETS: readonly TransitionPreset[] = [
  'crossfade',
  'fade-out-in',
  'slide-left',
  'slide-right',
  'slide-up',
  'slide-down',
  'push-left',
  'push-right',
  'push-up',
  'push-down',
  'wipe-left',
  'wipe-right',
  'wipe-up',
  'wipe-down',
];

const VALID_EASINGS: readonly EasingName[] = [
  'linear',
  'easeIn',
  'easeOut',
  'easeInOut',
  'standard',
  'emphasized',
  'decelerate',
  'accelerate',
];

export function loadConfig(): TransitionConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveConfig(config: TransitionConfig): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(
      new CustomEvent<TransitionConfig>(CHANGE_EVENT, { detail: config }),
    );
  } catch {
    /* swallow storage errors (quota, disabled, etc.) */
  }
}

export function clearConfig(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent<TransitionConfig | null>(CHANGE_EVENT, { detail: null }),
    );
  } catch {
    /* swallow */
  }
}

export function dispatchReplay(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(REPLAY_EVENT));
}

export function subscribeConfigChange(
  listener: (config: TransitionConfig | null) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    listener((e as CustomEvent<TransitionConfig | null>).detail ?? null);
  };
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

export function subscribeReplay(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(REPLAY_EVENT, listener);
  return () => window.removeEventListener(REPLAY_EVENT, listener);
}

function isValidConfig(input: unknown): input is TransitionConfig {
  if (!input || typeof input !== 'object') return false;
  const c = input as Record<string, unknown>;
  return (
    typeof c.preset === 'string' &&
    VALID_PRESETS.includes(c.preset as TransitionPreset) &&
    typeof c.duration === 'number' &&
    Number.isFinite(c.duration) &&
    typeof c.easing === 'string' &&
    VALID_EASINGS.includes(c.easing as EasingName)
  );
}
