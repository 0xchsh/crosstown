'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const PAGES = [
  { href: '/', label: 'Home' },
  { href: '/page-1', label: 'Page 1' },
  { href: '/page-2', label: 'Page 2' },
  { href: '/page-3', label: 'Page 3' },
];

export function PageNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-1 px-7 py-3">
        {PAGES.map((p) => {
          const active = pathname === p.href;
          return (
            <Link
              key={p.href}
              href={p.href}
              className={cn(
                'rounded-md px-2.5 py-1 text-sm transition-colors',
                active
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {p.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
