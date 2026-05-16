import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mzansi Scholar Transport',
  description: 'Trusted scholar transport service for Soweto families with verified drivers and real-time safety updates.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
