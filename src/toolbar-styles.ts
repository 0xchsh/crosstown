import type { CSSProperties } from 'react';

const BG = 'rgba(20, 20, 22, 0.92)';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const TEXT = 'rgba(255, 255, 255, 0.92)';
const TEXT_DIM = 'rgba(255, 255, 255, 0.55)';
// Tailwind slate-200 / slate-300 — neutral accents that read on dark backgrounds.
const ACCENT = '#e2e8f0';
const ACCENT_DARK = '#cbd5e1';
// Resolves to Open Runde when the host app exposes it as --font-open-runde
// (e.g. via Next.js next/font/local). Falls back to platform system fonts
// otherwise so the toolbar still looks reasonable in any app.
const FONT =
  'var(--font-open-runde), -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

export const styles = {
  container: {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 2147483600,
    fontFamily: FONT,
    fontSize: 13,
    color: TEXT,
    lineHeight: 1.4,
  } as CSSProperties,

  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 14px',
    background: BG,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${BORDER}`,
    borderRadius: 999,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
    color: TEXT,
    fontFamily: FONT,
    fontSize: 13,
    cursor: 'pointer',
    userSelect: 'none',
    appearance: 'none',
    margin: 0,
  } as CSSProperties,

  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background: ACCENT,
    boxShadow: '0 0 6px rgba(226, 232, 240, 0.5)',
    flexShrink: 0,
  } as CSSProperties,

  panel: {
    width: 360,
    boxSizing: 'border-box',
    background: BG,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.32)',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  } as CSSProperties,

  panelSettings: {
    // Settings view is a vertical list — narrower, with column padding restored.
    width: 320,
    padding: 14,
    gap: 10,
  } as CSSProperties,

  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  } as CSSProperties,

  barPresetPill: {
    flex: 1,
    minWidth: 0,
    height: 36,
    background: 'rgba(255, 255, 255, 0.12)',
    border: 'none',
    color: TEXT,
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: 500,
    padding: '0 36px 0 16px',
    borderRadius: 10,
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='rgba(255,255,255,0.8)' d='M6 8 0 0h12z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
  } as CSSProperties,

  barStepButton: {
    flex: '0 0 auto',
    width: 36,
    height: 36,
    background: 'rgba(255, 255, 255, 0.12)',
    border: 'none',
    color: TEXT,
    fontFamily: FONT,
    borderRadius: 10,
    cursor: 'pointer',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  } as CSSProperties,

  barIconButton: {
    flex: '0 0 auto',
    width: 36,
    height: 36,
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    color: TEXT,
    fontFamily: FONT,
    borderRadius: 8,
    cursor: 'pointer',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  } as CSSProperties,

  barIconButtonActive: {
    background: 'rgba(255, 255, 255, 0.14)',
  } as CSSProperties,

  barIconButtonHover: {
    background: 'rgba(255, 255, 255, 0.06)',
  } as CSSProperties,

  barCopyButton: {
    height: 36,
    background: '#ffffff',
    border: 'none',
    color: '#0b0b0d',
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: 500,
    padding: '0 28px',
    borderRadius: 10,
    cursor: 'pointer',
    outline: 'none',
    marginLeft: 'auto',
  } as CSSProperties,

  barCopyButtonCopied: {
    background: ACCENT,
    color: '#0b0b0d',
  } as CSSProperties,

  popover: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: 0,
    width: 360,
    boxSizing: 'border-box',
    background: BG,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.32)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  } as CSSProperties,

  popoverNarrow: {
    width: 320,
    left: 'auto',
    right: 0,
  } as CSSProperties,

  // The popover scales in from its anchor point (bottom of the bar near the
  // trigger button) for an origin-aware entrance. Custom strong-out cubic per
  // Emil's design notes — feels punchier than the built-in ease-out.
  popoverAnimate: {
    transition:
      'transform 180ms cubic-bezier(0.23, 1, 0.32, 1), opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)',
  } as CSSProperties,

  durationHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  } as CSSProperties,

  durationLabel: {
    fontSize: 11,
    color: TEXT_DIM,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 500,
  } as CSSProperties,

  durationValue: {
    color: TEXT,
    fontSize: 24,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  } as CSSProperties,

  durationValueUnit: {
    color: TEXT_DIM,
    fontSize: 13,
    fontWeight: 500,
    marginLeft: 4,
  } as CSSProperties,

  durationChips: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  } as CSSProperties,

  durationChip: {
    flex: '1 1 0',
    height: 30,
    background: 'rgba(255, 255, 255, 0.06)',
    border: 'none',
    color: TEXT_DIM,
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
    borderRadius: 8,
    cursor: 'pointer',
    outline: 'none',
    padding: 0,
  } as CSSProperties,

  durationChipActive: {
    background: ACCENT,
    color: '#0b0b0d',
    fontWeight: 500,
  } as CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as CSSProperties,

  title: {
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: '0.01em',
  } as CSSProperties,

  iconButton: {
    background: 'transparent',
    border: 'none',
    color: TEXT_DIM,
    fontSize: 18,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 6,
    padding: 0,
    lineHeight: 1,
  } as CSSProperties,

  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  } as CSSProperties,

  label: {
    fontSize: 10,
    color: TEXT_DIM,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  } as CSSProperties,

  labelValue: {
    color: TEXT,
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  } as CSSProperties,

  select: {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    color: TEXT,
    fontFamily: FONT,
    fontSize: 13,
    padding: '7px 28px 7px 10px',
    width: '100%',
    cursor: 'pointer',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='rgba(255,255,255,0.55)' d='M5 6 0 0h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  } as CSSProperties,

  slider: {
    width: '100%',
    accentColor: ACCENT,
    margin: 0,
    cursor: 'pointer',
  } as CSSProperties,

  presetStepper: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 6,
  } as CSSProperties,

  stepButton: {
    flex: '0 0 auto',
    width: 32,
    background: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    color: TEXT,
    fontFamily: FONT,
    fontSize: 16,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    userSelect: 'none',
  } as CSSProperties,

  originPicker: {
    position: 'relative',
    width: '100%',
    height: 96,
    background:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 32px), rgba(255,255,255,0.04)',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    cursor: 'crosshair',
    userSelect: 'none',
    touchAction: 'none',
  } as CSSProperties,

  originDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
    background: ACCENT,
    border: '2px solid rgba(255, 255, 255, 0.95)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  } as CSSProperties,

  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  } as CSSProperties,

  iconActionButton: {
    flex: '0 0 auto',
    width: 32,
    height: 32,
    background: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid ${BORDER}`,
    color: TEXT,
    fontFamily: FONT,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    userSelect: 'none',
  } as CSSProperties,

  actionDivider: {
    width: 1,
    height: 18,
    background: BORDER,
    flex: '0 0 auto',
  } as CSSProperties,

  copyButton: {
    flex: 1,
    height: 32,
    background: ACCENT,
    border: `1px solid ${ACCENT}`,
    color: 'white',
    fontFamily: FONT,
    fontSize: 13,
    padding: '0 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 500,
  } as CSSProperties,

  copyButtonCopied: {
    background: '#3aab5a',
    borderColor: '#3aab5a',
  } as CSSProperties,

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTop: `1px solid ${BORDER}`,
    marginTop: 2,
  } as CSSProperties,

  resetLink: {
    background: 'transparent',
    border: 'none',
    color: TEXT_DIM,
    fontFamily: FONT,
    fontSize: 12,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: 2,
  } as CSSProperties,

  devLabel: {
    fontSize: 10,
    color: TEXT_DIM,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 500,
  } as CSSProperties,

  settingsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
    borderTop: `1px solid ${BORDER}`,
  } as CSSProperties,

  settingsRowFirst: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 8,
  } as CSSProperties,

  settingsLabel: {
    fontSize: 13,
    color: TEXT,
    fontWeight: 500,
  } as CSSProperties,

  settingsValue: {
    fontSize: 13,
    color: TEXT_DIM,
  } as CSSProperties,

  settingsLink: {
    background: 'transparent',
    border: 'none',
    padding: 0,
    color: ACCENT,
    fontFamily: FONT,
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 500,
  } as CSSProperties,

  settingsSelect: {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    color: TEXT,
    fontFamily: FONT,
    fontSize: 13,
    padding: '6px 28px 6px 10px',
    cursor: 'pointer',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='rgba(255,255,255,0.55)' d='M5 6 0 0h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  } as CSSProperties,
};
