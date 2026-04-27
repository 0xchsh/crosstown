'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
};

export function Wrapper({ children, config }: WrapperProps) {
  const pathname = usePathname();
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
  const motionProps = getPresetMotion(active);
  const compositeKey = `${pathname ?? ''}::${replayKey}`;

  return (
    <div style={containerStyle}>
      <AnimatePresence initial={false}>
        <motion.div
          key={compositeKey}
          style={itemStyle}
          // framer-motion's prop types for these are deeply union'd; the cast
          // accepts our loose preset shape without giving up runtime safety.
          initial={motionProps.initial as never}
          animate={motionProps.animate as never}
          exit={motionProps.exit as never}
          transition={motionProps.transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
