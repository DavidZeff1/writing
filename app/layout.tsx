import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'The writing room — Learn to write, by writing',
  description: 'A quiet, self-paced article-writing workbook. Learn from sentences to independent articles, with practice, revision, and writing saved on your device.',
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
