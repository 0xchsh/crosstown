import Link from 'next/link';
import { GithubLogo, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import { CopyableCode } from '@/components/copyable-code';

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-7 pt-22 pb-32">
      <header className="mb-7 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Crosstown</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            v0.1.0
          </span>
          <Button
            render={
              <a
                href="https://github.com/0xchsh/crosstown"
                target="_blank"
                rel="noreferrer"
              />
            }
            variant="ghost"
            size="sm"
          >
            <GithubLogo data-icon="inline-start" weight="regular" />
            GitHub
          </Button>
        </div>
      </header>

      <p className="mb-7 text-lg tracking-tight">
        Tune page transitions live on localhost.
      </p>

      <p className="mb-14 text-muted-foreground">
        A drop-in React component for Next.js App Router. Fourteen built-in
        transition presets and a dev-only toolbar for tuning them in your
        browser. The toolbar tree-shakes in production; only the runtime
        ships.
      </p>

      <Section label="Features">
        <FeatureList
          items={[
            ['Fourteen presets', 'Crossfade, Fade Out & In, Slide, Push, Wipe — pick a direction.'],
            ['Live tuning', 'Bottom-right pill, expands to a panel. Replays in place on every tweak.'],
            ['Zero production cost', 'Toolbar code tree-shakes. Only the animation runtime ships.'],
            ['Framework-aware', 'Next.js App Router. One import, one component.'],
            ['No styling deps', 'Inline CSS only. No Tailwind, no global stylesheet.'],
            ['Copy & bake', 'Tune in dev, click Copy, paste the prompt into Claude Code.'],
          ]}
        />
      </Section>

      <Section label="Installation">
        <CopyableCode value="npm install crosstown" terminal />
        <p className="mt-3 mb-3 text-muted-foreground">
          Then drop it into your root layout:
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted px-4 py-3 font-mono text-[13px] leading-relaxed">{`// app/layout.tsx
import { Crosstown } from 'crosstown';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Crosstown>{children}</Crosstown>
      </body>
    </html>
  );
}`}</pre>
        <p className="mt-3 text-muted-foreground">
          The toolbar appears bottom-right in development. Tune your config,
          click <span className="font-medium text-foreground">Copy</span>,
          paste the prompt into Claude Code or apply by hand. When the{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">config</code>{' '}
          prop is passed, the toolbar hides and the config becomes the
          deterministic source of truth.
        </p>
      </Section>

      <Section label="Presets">
        <PresetList
          items={[
            ['crossfade', 'Opacity 0→1, simultaneous in/out.'],
            ['fade-out-in', 'Old fades out, then new fades in.'],
            ['slide-{l,u,r,d}', 'New slides over the stationary old.'],
            ['push-{l,u,r,d}', 'Both pages translate together.'],
            ['wipe-{l,u,r,d}', 'clip-path: inset() reveal from one edge.'],
          ]}
        />
      </Section>

      <Section label="Easings">
        <p className="text-muted-foreground">
          <code className="text-foreground">linear</code>,{' '}
          <code className="text-foreground">easeIn</code>,{' '}
          <code className="text-foreground">easeOut</code>,{' '}
          <code className="text-foreground">easeInOut</code>,{' '}
          <code className="text-foreground">standard</code>,{' '}
          <code className="text-foreground">emphasized</code>,{' '}
          <code className="text-foreground">decelerate</code>,{' '}
          <code className="text-foreground">accelerate</code>. Last four are
          Material Design 3 cubic-beziers.
        </p>
      </Section>

      <Section label="Keyboard">
        <ul className="space-y-3">
          <li className="grid grid-cols-[180px_1fr] items-baseline gap-5">
            <kbd className="inline-flex w-fit items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">
              ⌘ ⇧ C
            </kbd>
            <span className="text-muted-foreground">
              Toggle the toolbar (Mac).
            </span>
          </li>
          <li className="grid grid-cols-[180px_1fr] items-baseline gap-5">
            <kbd className="inline-flex w-fit items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">
              Ctrl ⇧ C
            </kbd>
            <span className="text-muted-foreground">
              Toggle the toolbar (Windows / Linux).
            </span>
          </li>
        </ul>
      </Section>

      <footer className="mt-20 flex items-center justify-between border-t border-border pt-7 text-sm text-muted-foreground">
        <span>MIT</span>
        <div className="flex items-center gap-4">
          <Link href="/changelog" className="hover:text-foreground">
            Changelog
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
          <a
            href="https://www.npmjs.com/package/crosstown"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            npm
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

function FeatureList({ items }: { items: [string, string][] }) {
  return (
    <ul className="grid gap-3.5">
      {items.map(([title, desc], i, arr) => (
        <li
          key={title}
          className={`grid grid-cols-[160px_1fr] items-baseline gap-5 ${
            i < arr.length - 1 ? 'border-b border-dashed border-border pb-3.5' : ''
          }`}
        >
          <strong className="font-medium">{title}</strong>
          <span className="text-muted-foreground">{desc}</span>
        </li>
      ))}
    </ul>
  );
}

function PresetList({ items }: { items: [string, string][] }) {
  return (
    <ul className="grid gap-3">
      {items.map(([code, desc]) => (
        <li
          key={code}
          className="grid grid-cols-[200px_1fr] items-baseline gap-5"
        >
          <code className="font-mono text-sm">{code}</code>
          <span className="text-muted-foreground">{desc}</span>
        </li>
      ))}
    </ul>
  );
}
