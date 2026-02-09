import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Why Do I Like This Song?',
  description: 'Analyze songs to understand what makes them appeal to you through audio fingerprints and deterministic explanations.',
  keywords: ['Last.fm', 'music analysis', 'audio features', 'song analysis', 'music recommendations'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#0a0a0c] text-white`}>
        {children}
      </body>
    </html>
  );
}
