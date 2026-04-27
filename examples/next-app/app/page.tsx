import Link from 'next/link';

export default function Home() {
  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero-title">Crosstown</h1>
        <div className="hero-meta">
          <span className="hero-version">v0.1.0</span>
          <a
            href="https://github.com/0xchsh/crosstown"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <p className="tagline">Tune page transitions live on localhost.</p>

      <p className="intro">
        A drop-in React component for Next.js App Router. Fourteen built-in
        transition presets and a dev-only toolbar for tuning them in your
        browser. The toolbar tree-shakes in production; only the runtime ships.
      </p>

      <section className="section">
        <div className="section-label">Features</div>
        <ul className="feature-list">
          <li>
            <strong>Fourteen presets</strong>
            <span>
              Crossfade, Fade Out & In, Slide, Push, Wipe — pick a direction.
            </span>
          </li>
          <li>
            <strong>Live tuning</strong>
            <span>
              Bottom-right pill, expands to a panel. Replays in place on every
              tweak.
            </span>
          </li>
          <li>
            <strong>Zero production cost</strong>
            <span>
              Toolbar code tree-shakes. Only the animation runtime is shipped.
            </span>
          </li>
          <li>
            <strong>Framework-aware</strong>
            <span>Next.js App Router. One import, one component.</span>
          </li>
          <li>
            <strong>No styling deps</strong>
            <span>Inline CSS only. No Tailwind, no global stylesheet.</span>
          </li>
          <li>
            <strong>Copy &amp; bake</strong>
            <span>
              Tune in dev, click Copy, paste the prompt into Claude Code.
            </span>
          </li>
        </ul>
      </section>

      <section className="section">
        <div className="section-label">Installation</div>
        <pre className="code-block terminal">npm install crosstown framer-motion</pre>
        <p style={{ color: 'var(--text-dim)' }}>
          Then drop it into your root layout:
        </p>
        <pre className="code-block">{`// app/layout.tsx
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
        <p style={{ color: 'var(--text-dim)' }}>
          The toolbar appears bottom-right in development. Tune your config,
          click <strong style={{ color: 'var(--text)' }}>Copy</strong>, paste
          the prompt into Claude Code or apply by hand. When the{' '}
          <code>config</code> prop is passed, the toolbar hides and the config
          becomes the deterministic source of truth.
        </p>
      </section>

      <section className="section">
        <div className="section-label">Presets</div>
        <ul className="preset-grid">
          <li>
            <code>crossfade</code>
            <span style={{ color: 'var(--text-dim)' }}>
              Opacity 0→1, simultaneous in/out.
            </span>
          </li>
          <li>
            <code>fade-out-in</code>
            <span style={{ color: 'var(--text-dim)' }}>
              Old fades out, then new fades in.
            </span>
          </li>
          <li>
            <code>slide-{'{l,u,r,d}'}</code>
            <span style={{ color: 'var(--text-dim)' }}>
              New slides over the stationary old.
            </span>
          </li>
          <li>
            <code>push-{'{l,u,r,d}'}</code>
            <span style={{ color: 'var(--text-dim)' }}>
              Both pages translate together.
            </span>
          </li>
          <li>
            <code>wipe-{'{l,u,r,d}'}</code>
            <span style={{ color: 'var(--text-dim)' }}>
              <code>clip-path: inset()</code> reveal from one edge.
            </span>
          </li>
        </ul>
      </section>

      <section className="section">
        <div className="section-label">Easings</div>
        <p className="easing-grid">
          <code>linear</code>, <code>easeIn</code>, <code>easeOut</code>,{' '}
          <code>easeInOut</code>, <code>standard</code>, <code>emphasized</code>
          , <code>decelerate</code>, <code>accelerate</code>. Last four are
          Material Design 3 cubic-beziers.
        </p>
      </section>

      <section className="section">
        <div className="section-label">Keyboard</div>
        <ul className="kbd-grid">
          <li>
            <kbd>⌘ ⇧ T</kbd>
            <span style={{ color: 'var(--text-dim)' }}>
              Toggle the toolbar (Mac).
            </span>
          </li>
          <li>
            <kbd>Ctrl ⇧ T</kbd>
            <span style={{ color: 'var(--text-dim)' }}>
              Toggle the toolbar (Windows / Linux).
            </span>
          </li>
        </ul>
      </section>

      <footer className="footer">
        <div>MIT</div>
        <div className="footer-links">
          <Link href="/changelog">Changelog</Link>
          <a
            href="https://github.com/0xchsh/crosstown"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/crosstown"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>
        </div>
      </footer>
    </div>
  );
}
