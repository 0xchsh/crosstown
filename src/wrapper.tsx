'use client';

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { getPresetMotion } from './presets';
import {
  loadConfig,
  subscribeConfigChange,
  subscribeReplay,
} from './storage';
import { DEFAULT_CONFIG, type TransitionConfig } from './types';

export interface WrapperProps {
  children: ReactNode;
  config?: TransitionConfig;
}

// Container is a 1×1 grid so old + new motion divs share the same cell during
// a transition. `overflow: hidden` clips translated children that animate from
// outside the viewport (Slide/Push). `isolation: isolate` keeps z-index stacking
// of the wrapper independent of the rest of the page.
const containerStyle: CSSProperties = {
  display: 'grid',
  overflow: 'hidden',
  position: 'relative',
  isolation: 'isolate',
  width: '100%',
  minHeight: 'inherit',
};

const itemStyle: CSSProperties = {
  gridArea: '1 / 1',
  width: '100%',
  minHeight: '100%',
  // Hint to the browser to promote this to a GPU layer up front. Keeps slides
  // and pushes smooth even when the main thread is busy (per Emil Kowalski's
  // performance notes — motion's transform shorthand isn't always GPU-accel).
  willChange: 'transform, opacity, clip-path, filter',
};

const REDUCED_MOTION_DURATION_CAP = 200;

export function Wrapper({ children, config }: WrapperProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [storedConfig, setStoredConfig] = useState<TransitionConfig | null>(
    null,
  );
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (config) return;
    setStoredConfig(loadConfig());
    const unsubChange = subscribeConfigChange((next) => {
      setStoredConfig(next);
      setReplayKey((k) => k + 1);
    });
    const unsubReplay = subscribeReplay(() => {
      setReplayKey((k) => k + 1);
    });
    return () => {
      unsubChange();
      unsubReplay();
    };
  }, [config]);

  const active = config ?? storedConfig ?? DEFAULT_CONFIG;
  // When the user prefers reduced motion, fall back to a brief crossfade.
  // Per Emil/WCAG: don't disable transitions entirely — opacity changes still
  // aid comprehension; just remove movement and shorten duration.
  const effectiveConfig: TransitionConfig = prefersReducedMotion
    ? {
        preset: 'crossfade',
        duration: Math.min(active.duration, REDUCED_MOTION_DURATION_CAP),
        easing: active.easing,
      }
    : active;
  const motionProps = getPresetMotion(effectiveConfig);
  const compositeKey = `${pathname ?? ''}::${replayKey}`;

  return (
    <LazyMotion features={domAnimation} strict>
      <div style={containerStyle}>
        <AnimatePresence initial={false}>
          <m.div
            key={compositeKey}
            style={itemStyle}
            // motion's prop types for these are deeply union'd; the cast accepts
            // our loose preset shape without giving up runtime safety.
            initial={motionProps.initial as never}
            animate={motionProps.animate as never}
            exit={motionProps.exit as never}
            transition={motionProps.transition as never}
          >
            {children}
          </m.div>
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
