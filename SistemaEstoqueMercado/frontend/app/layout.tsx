import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Estoque Mercado',
  description: 'Gestão de Estoque e Recebimento de Mercadorias',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-background text-foreground lg:flex-row`}
        suppressHydrationWarning
      >
        <AuthGuard>
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </AuthGuard>
      </body>
    </html>
  );
}
