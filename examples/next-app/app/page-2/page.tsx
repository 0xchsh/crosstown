export default function Page2() {
  return (
    <div className="mx-auto max-w-2xl px-7 pt-22 pb-32">
      <header className="mb-7">
        <div className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">
          Page 2
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Craft</h1>
      </header>

      <p className="mb-7 text-lg tracking-tight">
        Easings are the personality of the motion.
      </p>

      <p className="mb-14 text-muted-foreground">
        The same translation feels mechanical with linear timing and warm
        with an emphasized curve. Picking the right easing matters more
        than picking the right preset — it&rsquo;s the difference between
        a transition that interrupts and one that connects.
      </p>

      <Section label="Material curves">
        <List
          items={[
            ['standard', 'Default for most UI motion. Symmetrical ease in/out.'],
            ['emphasized', 'Slow start, fast finish. Best for entering content.'],
            ['decelerate', 'Slows as it lands. Use when something is arriving.'],
            ['accelerate', 'Speeds up as it leaves. Use when something is exiting.'],
          ]}
        />
      </Section>

      <Section label="Duration intuition">
        <ul className="grid gap-3">
          <Bar label="Snappy" value="150ms" pct={15} />
          <Bar label="Default" value="300ms" pct={30} />
          <Bar label="Considered" value="500ms" pct={50} />
          <Bar label="Theatrical" value="800ms" pct={80} />
        </ul>
      </Section>

      <Section label="Field notes">
        <p className="text-muted-foreground">
          Hover and tap feedback should be under 200ms. Page-to-page motion
          lives between 250 and 400ms. Anything past 600ms reads as a
          decision the interface is making about you, not for you.
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
          <strong className="font-medium font-mono text-sm">{title}</strong>
          <span className="text-muted-foreground">{desc}</span>
        </li>
      ))}
    </ul>
  );
}

function Bar({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <li className="grid grid-cols-[120px_1fr_60px] items-center gap-5">
      <span className="text-sm">{label}</span>
      <span className="h-1.5 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-foreground/70"
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="text-right font-mono text-xs text-muted-foreground">
        {value}
      </span>
    </li>
  );
}
