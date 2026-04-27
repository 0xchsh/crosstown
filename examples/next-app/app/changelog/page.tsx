import Link from 'next/link';

export default function Changelog() {
  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero-title">Changelog</h1>
        <div className="hero-meta">
          <Link href="/">Home</Link>
        </div>
      </header>

      <p className="intro">
        Notable changes between versions. Crosstown follows{' '}
        <a
          href="https://semver.org/"
          target="_blank"
          rel="noreferrer"
        >
          semver
        </a>
        ; breaking changes bump the minor while we're under 1.0.
      </p>

      <section className="section">
        <div className="section-label">v0.1.0 — Initial release</div>
        <ul className="feature-list">
          <li>
            <strong>Fourteen presets</strong>
            <span>
              Crossfade, Fade Out & In, Slide L/U/R/D, Push L/U/R/D, Wipe
              L/U/R/D.
            </span>
          </li>
          <li>
            <strong>Dev toolbar</strong>
            <span>
              Bottom-right pill, expands to a tuning panel. ⌘⇧T toggles.
            </span>
          </li>
          <li>
            <strong>Copy &amp; bake</strong>
            <span>
              Click Copy to paste a config-first prompt into Claude Code.
            </span>
          </li>
          <li>
            <strong>App Router only</strong>
            <span>
              Pages Router and Vite + React Router are tracked for v0.2.
            </span>
          </li>
        </ul>
      </section>

      <section className="section">
        <div className="section-label">Coming in v0.2</div>
        <ul className="feature-list">
          <li>
            <strong>Per-route rules</strong>
            <span>
              Different transitions for different routes; not just one global
              config.
            </span>
          </li>
          <li>
            <strong>More frameworks</strong>
            <span>Pages Router, Vite + React Router.</span>
          </li>
          <li>
            <strong>Asymmetric timing</strong>
            <span>Different durations for enter and exit.</span>
          </li>
          <li>
            <strong>Direction-aware</strong>
            <span>
              Different transitions for back vs forward navigations.
            </span>
          </li>
        </ul>
      </section>

      <footer className="footer">
        <div>MIT</div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <a
            href="https://github.com/0xchsh/crosstown"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
