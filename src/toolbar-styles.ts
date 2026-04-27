import type { CSSProperties } from 'react';

const BG = 'rgba(20, 20, 22, 0.92)';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const TEXT = 'rgba(255, 255, 255, 0.92)';
const TEXT_DIM = 'rgba(255, 255, 255, 0.55)';
const ACCENT = '#7c5cff';
const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

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
    background: '#a1ff8b',
    boxShadow: '0 0 6px rgba(161, 255, 139, 0.7)',
    flexShrink: 0,
  } as CSSProperties,

  panel: {
    width: 320,
    boxSizing: 'border-box',
    background: BG,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.32)',
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  } as CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as CSSProperties,

  title: {
    fontWeight: 600,
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
    fontWeight: 600,
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
    gap: 8,
    marginTop: 2,
  } as CSSProperties,

  playButton: {
    flex: '0 0 auto',
    background: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid ${BORDER}`,
    color: TEXT,
    fontFamily: FONT,
    fontSize: 13,
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  } as CSSProperties,

  copyButton: {
    flex: 1,
    background: ACCENT,
    border: `1px solid ${ACCENT}`,
    color: 'white',
    fontFamily: FONT,
    fontSize: 13,
    padding: '8px 12px',
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
    fontWeight: 600,
  } as CSSProperties,
};
