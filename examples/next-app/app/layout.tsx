import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { Crosstown } from 'crosstown';
import { Agentation } from 'agentation';
import { cn } from '@/lib/utils';
import './globals.css';

const openRunde = localFont({
  src: [
    {
      path: '../public/fonts/open-runde/OpenRunde-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/open-runde/OpenRunde-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/open-runde/OpenRunde-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/open-runde/OpenRunde-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-open-runde',
  display: 'swap',
});

export const metadata = {
  title: 'Crosstown — tune page transitions on localhost',
  description:
    'A dev-only floating toolbar for tuning Next.js page transitions, with fourteen built-in presets.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(openRunde.variable, 'font-sans')}>
      <body>
        <Crosstown>{children}</Crosstown>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  );
}
