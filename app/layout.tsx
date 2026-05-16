import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/app/components/AuthProvider';
import { Footer } from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Mzansi Scholar Transport',
  description: 'Trusted scholar transport service for Soweto families with verified drivers and real-time safety updates.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
