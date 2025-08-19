import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GymFinder - Compara Precios y Ocupación de Gimnasios',
  description: 'Encuentra y compara precios de gimnasios, consulta niveles de ocupación en tiempo real y descubre el centro de fitness perfecto cerca de ti.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}