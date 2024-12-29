import localFont from 'next/font/local';
import { JetBrains_Mono as JetBrainsMono } from 'next/font/google';

export const inter = localFont({
  src: [
    {
      path: './Inter-roman.var.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: './Inter-italic.var.woff2',
      style: 'italic',
      weight: '100 900',
    }
  ],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

export const jetBrainsMono = JetBrainsMono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const fontVariables = [
  inter.variable,
  jetBrainsMono.variable
].join(' ');