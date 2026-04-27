import type { EasingName, TransitionConfig } from './types';

type Easing = string | [number, number, number, number];

export const EASING_VALUES: Record<EasingName, Easing> = {
  linear: 'linear',
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  standard: [0.2, 0, 0, 1],
  emphasized: [0.05, 0.7, 0.1, 1],
  decelerate: [0, 0, 0, 1],
  accelerate: [0.3, 0, 1, 1],
};

interface InlineTransition {
  duration: number;
  ease: Easing;
  delay?: number;
}

// Loose shape — the wrapper casts these to framer-motion's prop types at the
// call site. Trying to reuse motion.div's `initial`/`animate`/`exit` types here
// produces a union that's too complex for TS to represent.
export interface PresetMotion {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit: Record<string, unknown>;
  transition: InlineTransition;
}

export function getPresetMotion(config: TransitionConfig): PresetMotion {
  const ease = EASING_VALUES[config.easing];
  const dur = config.duration / 1000;
  const t: InlineTransition = { duration: dur, ease };

  switch (config.preset) {
    case 'crossfade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: t,
      };

    // Old fades out completely (first half), then new fades in (second half).
    // Per-variant transitions override the outer one.
    case 'fade-out-in': {
      const half = dur / 2;
      return {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: half, ease, delay: half },
        },
        exit: { opacity: 0, transition: { duration: half, ease } },
        transition: t,
      };
    }

    // Slide: only the entering page moves; the exiting page stays put and is
    // covered as the new layer slides over it. Translates use viewport units
    // (100vw / 100vh) instead of element percentages so the motion stays bounded
    // to what the user can actually see — long pages shouldn't scroll their
    // entire content past the viewport during a single transition.
    case 'slide-left':
      return {
        initial: { x: '100vw' },
        animate: { x: 0 },
        exit: { x: 0 },
        transition: t,
      };
    case 'slide-right':
      return {
        initial: { x: '-100vw' },
        animate: { x: 0 },
        exit: { x: 0 },
        transition: t,
      };
    case 'slide-up':
      return {
        initial: { y: '100vh' },
        animate: { y: 0 },
        exit: { y: 0 },
        transition: t,
      };
    case 'slide-down':
      return {
        initial: { y: '-100vh' },
        animate: { y: 0 },
        exit: { y: 0 },
        transition: t,
      };

    // Push: both pages translate in the same direction; the new page enters from
    // one side as the old page exits to the other. Same viewport-unit treatment
    // as Slide.
    case 'push-left':
      return {
        initial: { x: '100vw' },
        animate: { x: 0 },
        exit: { x: '-100vw' },
        transition: t,
      };
    case 'push-right':
      return {
        initial: { x: '-100vw' },
        animate: { x: 0 },
        exit: { x: '100vw' },
        transition: t,
      };
    case 'push-up':
      return {
        initial: { y: '100vh' },
        animate: { y: 0 },
        exit: { y: '-100vh' },
        transition: t,
      };
    case 'push-down':
      return {
        initial: { y: '-100vh' },
        animate: { y: 0 },
        exit: { y: '100vh' },
        transition: t,
      };

    // Wipe: only the entering page animates; clip-path expands across the
    // viewport from the trailing edge. The exiting page is fully visible
    // underneath and gets progressively covered.
    case 'wipe-left':
      return {
        initial: { clipPath: 'inset(0% 0% 0% 100%)' },
        animate: { clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { clipPath: 'inset(0% 0% 0% 0%)' },
        transition: t,
      };
    case 'wipe-right':
      return {
        initial: { clipPath: 'inset(0% 100% 0% 0%)' },
        animate: { clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { clipPath: 'inset(0% 0% 0% 0%)' },
        transition: t,
      };
    case 'wipe-up':
      return {
        initial: { clipPath: 'inset(100% 0% 0% 0%)' },
        animate: { clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { clipPath: 'inset(0% 0% 0% 0%)' },
        transition: t,
      };
    case 'wipe-down':
      return {
        initial: { clipPath: 'inset(0% 0% 100% 0%)' },
        animate: { clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { clipPath: 'inset(0% 0% 0% 0%)' },
        transition: t,
      };
  }
}
