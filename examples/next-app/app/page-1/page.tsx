export default function Page1() {
  return (
    <div className="mx-auto max-w-2xl px-7 pt-22 pb-32">
      <header className="mb-7">
        <div className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">
          Page 1
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Discovery</h1>
      </header>

      <p className="mb-7 text-lg tracking-tight">
        How a transition is supposed to feel.
      </p>

      <p className="mb-14 text-muted-foreground">
        A good transition is invisible. It tells you what changed and where to
        look next, then gets out of the way. Crossfade, slide, push, wipe —
        each one carries a different message about the relationship between
        the page you left and the page you arrived at.
      </p>

      <Section label="Principles">
        <List
          items={[
            ['Direction has meaning', 'Slide-left implies "next." Slide-right implies "back."'],
            ['Length under 400ms', 'Anything longer is theatre, not navigation.'],
            ['Eased, not linear', 'Linear motion reads as mechanical. Use curves.'],
            ['One idea at a time', 'Pick crossfade or slide. Stacking effects competes for attention.'],
          ]}
        />
      </Section>

      <Section label="When to use crossfade">
        <p className="text-muted-foreground">
          Sibling pages, peer relationships, lateral moves. The user is
          changing topic but not depth — a tab switch, a filter change, a
          variant of the same view. Crossfade says &ldquo;these are
          equivalent.&rdquo;
        </p>
      </Section>

      <Section label="When to use slide">
        <p className="text-muted-foreground">
          Sequential or hierarchical moves. The user is going forward into
          something or back out of it. Slide preserves the sense of
          location — the new page comes from somewhere, and the old page
          goes somewhere.
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
