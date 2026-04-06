import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cat Caffe — Brewed with Love',
  description: 'Cat Caffe — A cozy premium coffee shop with subtle cat-themed elements. Brewed with love, served with purrfection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🐱%3C/text%3E%3C/svg%3E" />
      </head>
      <body>{children}</body>
    </html>
  );
}
