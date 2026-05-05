'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Crosstown } from 'crosstown';

export function DemoCrosstown({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Crosstown defaultOpen={pathname === '/'}>{children}</Crosstown>
  );
}
