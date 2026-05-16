import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mzansi Scholar Transport | Safe Rides. Smart Futures.',
  description:
    'Premium school transport in Soweto. Safe daily routes, live tracking, payments, and family-first transport management.',
  keywords: [
    'Soweto school transport',
    'School transport near me',
    'Scholar transport Johannesburg',
    'Safe kids transport South Africa'
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
