'use client';

import type { ReactNode } from 'react';
import { Toolbar } from './toolbar';
import { Wrapper } from './wrapper';
import type { TransitionConfig } from './types';

export interface CrosstownProps {
  children: ReactNode;
  /**
   * If provided, this config is the source of truth: the toolbar is hidden
   * (even in development) and localStorage is ignored. Use this in production
   * to bake in a config you tuned in dev.
   */
  config?: TransitionConfig;
}

export function Crosstown({ children, config }: CrosstownProps) {
  // The literal `process.env.NODE_ENV !== 'production'` check is what enables
  // tree-shaking. The consumer's bundler statically replaces NODE_ENV in
  // production, the boolean folds to false, and the Toolbar import below
  // becomes dead code that gets eliminated. Don't refactor this into a
  // module-level constant — that breaks constant propagation in some bundlers.
  return (
    <>
      <Wrapper config={config}>{children}</Wrapper>
      {process.env.NODE_ENV !== 'production' && !config ? <Toolbar /> : null}
    </>
  );
}
