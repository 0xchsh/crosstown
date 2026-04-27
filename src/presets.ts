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
    // Subtle blur paired with opacity bridges the visual gap between two states
    // when their content overlaps (per Emil Kowalski's crossfade notes). Without
    // it, a same-content preview looks like nothing's animating; with 2px of
    // blur, the eye reads "one transformation" instead of "two layers swapping."
    case 'crossfade':
      return {
        initial: { opacity: 0, filter: 'blur(2px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(2px)' },
        transition: t,
      };

    // Old fades out completely (first half), then new fades in (second half).
    // More blur than crossfade so the gap between fades reads as motion rather
    // than a stutter.
    case 'fade-out-in': {
      const half = dur / 2;
      return {
        initial: { opacity: 0, filter: 'blur(4px)' },
        animate: {
          opacity: 1,
          filter: 'blur(0px)',
          transition: { duration: half, ease, delay: half },
        },
        exit: {
          opacity: 0,
          filter: 'blur(4px)',
          transition: { duration: half, ease },
        },
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
    // as Slide. Exit runs at 70% of the configured duration — per Emil's
    // asymmetric-timing pattern: fast where the system is responding (exit),
    // its natural pace where the user is watching (enter).
    case 'push-left': {
      const exitT = { duration: dur * 0.7, ease };
      return {
        initial: { x: '100vw' },
        animate: { x: 0 },
        exit: { x: '-100vw', transition: exitT },
        transition: t,
      };
    }
    case 'push-right': {
      const exitT = { duration: dur * 0.7, ease };
      return {
        initial: { x: '-100vw' },
        animate: { x: 0 },
        exit: { x: '100vw', transition: exitT },
        transition: t,
      };
    }
    case 'push-up': {
      const exitT = { duration: dur * 0.7, ease };
      return {
        initial: { y: '100vh' },
        animate: { y: 0 },
        exit: { y: '-100vh', transition: exitT },
        transition: t,
      };
    }
    case 'push-down': {
      const exitT = { duration: dur * 0.7, ease };
      return {
        initial: { y: '-100vh' },
        animate: { y: 0 },
        exit: { y: '100vh', transition: exitT },
        transition: t,
      };
    }

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
