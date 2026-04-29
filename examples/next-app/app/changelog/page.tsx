import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

export default function Changelog() {
  return (
    <div className="mx-auto max-w-2xl px-7 pt-22 pb-32">
      <header className="mb-7 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Changelog</h1>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Home
        </Link>
      </header>

      <p className="mb-14 text-muted-foreground">
        Notable changes between versions. Crosstown follows{' '}
        <a
          href="https://semver.org/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-border underline-offset-2 hover:decoration-foreground"
        >
          semver
        </a>
        ; breaking changes bump the minor while we&rsquo;re under 1.0.
      </p>

      <Section label="v0.1.0 — Initial release">
        <ChangeList
          items={[
            ['Fourteen presets', 'Crossfade, Fade Out & In, Slide L/U/R/D, Push L/U/R/D, Wipe L/U/R/D.'],
            ['Dev toolbar', 'Bottom-right pill, expands to a tuning panel. ⌘⇧T toggles. Drag-to-reposition snaps to corners.'],
            ['Copy & bake', 'Click Copy to paste a config-first prompt into Claude Code.'],
            ['App Router only', 'Pages Router and Vite + React Router are tracked for v0.2.'],
          ]}
        />
      </Section>

      <Section label="Coming in v0.2">
        <ChangeList
          items={[
            ['Per-route rules', 'Different transitions for different routes; not just one global config.'],
            ['More frameworks', 'Pages Router, Vite + React Router.'],
            ['Asymmetric timing', 'Different durations for enter and exit (currently fixed at 70% for Push).'],
            ['Direction-aware', 'Different transitions for back vs forward navigations.'],
          ]}
        />
      </Section>

      <footer className="mt-20 flex items-center justify-between border-t border-border pt-7 text-sm text-muted-foreground">
        <span>MIT</span>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <a
            href="https://github.com/0xchsh/crosstown"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            GitHub
            <ArrowUpRight size={12} weight="regular" />
          </a>
        </div>
      </footer>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="mb-4 text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </div>
      {children}
    </section>
  );
}

function ChangeList({ items }: { items: [string, string][] }) {
  return (
    <ul className="grid gap-3.5">
      {items.map(([title, desc], i, arr) => (
        <li
          key={title}
          className={`grid grid-cols-[160px_1fr] items-baseline gap-5 ${
            i < arr.length - 1
              ? 'border-b border-dashed border-border pb-3.5'
              : ''
          }`}
        >
          <strong className="font-medium">{title}</strong>
          <span className="text-muted-foreground">{desc}</span>
        </li>
      ))}
    </ul>
  );
}
