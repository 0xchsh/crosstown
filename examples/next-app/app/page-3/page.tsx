export default function Page3() {
  return (
    <div className="mx-auto max-w-2xl px-7 pt-22 pb-32">
      <header className="mb-7">
        <div className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">
          Page 3
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Polish</h1>
      </header>

      <p className="mb-7 text-lg tracking-tight">
        The last ten percent that you only notice when it&rsquo;s missing.
      </p>

      <p className="mb-14 text-muted-foreground">
        Once a transition works, it stops being a feature and starts being
        a quality cue. Users won&rsquo;t thank you for it, but they will
        feel the absence. The polish is in the things you decide not to
        do — the second animation you don&rsquo;t add, the duration you
        shave by 50ms.
      </p>

      <Section label="Checklist">
        <ul className="grid gap-3">
          <Check>Reduced-motion users get a brief crossfade, never silence.</Check>
          <Check>No shift on the first paint — cached pages feel instant.</Check>
          <Check>One transition direction per relationship, used consistently.</Check>
          <Check>Replay on tweak — never make the user navigate to preview.</Check>
          <Check>The toolbar leaves no trace in production bundles.</Check>
        </ul>
      </Section>

      <Section label="Anti-patterns">
        <List
          items={[
            ['Stacking presets', 'Picking slide and crossfade together fights the eye.'],
            ['Linear easing', 'Reads as machine-driven. Use a curve.'],
            ['Over 600ms', 'Past this length, motion stops feeling like navigation.'],
            ['Bouncy springs', 'Cute the first time. Tedious by the tenth click.'],
          ]}
        />
      </Section>

      <Section label="Where to go next">
        <p className="text-muted-foreground">
          Open the toolbar, cycle through the presets, and find the one
          that matches the relationship between the pages you&rsquo;re
          connecting. Then forget it&rsquo;s there.
        </p>
      </Section>
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

function List({ items }: { items: [string, string][] }) {
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

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-1.5 inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-foreground/80 text-[9px] font-bold text-background"
      >
        ✓
      </span>
      <span className="text-muted-foreground">{children}</span>
    </li>
  );
}
