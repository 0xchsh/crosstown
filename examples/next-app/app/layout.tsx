import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Crosstown } from 'crosstown';
import { Agentation } from 'agentation';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Crosstown — tune page transitions on localhost',
  description:
    'A dev-only floating toolbar for tuning Next.js page transitions, with fourteen built-in presets.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <Crosstown>{children}</Crosstown>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  );
}
