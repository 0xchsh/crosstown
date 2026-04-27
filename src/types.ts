export type TransitionPreset =
  | 'crossfade'
  | 'fade-out-in'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'push-left'
  | 'push-right'
  | 'push-up'
  | 'push-down'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-up'
  | 'wipe-down';

export type EasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'standard'
  | 'emphasized'
  | 'decelerate'
  | 'accelerate';

export interface TransitionConfig {
  preset: TransitionPreset;
  duration: number;
  easing: EasingName;
}

export const DEFAULT_CONFIG: TransitionConfig = {
  preset: 'crossfade',
  duration: 300,
  easing: 'easeOut',
};
