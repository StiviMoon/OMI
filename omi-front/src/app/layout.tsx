'use client';

import { useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/footer/Footer';
import ModalCuenta from '@/components/ui/Cuenta/ModalCuenta';
import { SearchModal } from '@/components/ui/sidebar/SearchModal';
import { AuthProvider } from '@/lib/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCuentaModalOpen, setIsCuentaModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleOpenAccountModal = () => setIsCuentaModalOpen(true);
  const handleCloseAccountModal = () => setIsCuentaModalOpen(false);
  const handleOpenSearchModal = () => setIsSearchModalOpen(true);
  const handleCloseSearchModal = () => setIsSearchModalOpen(false);

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Footer 
            onOpenAccountModal={handleOpenAccountModal}
            onOpenSearchModal={handleOpenSearchModal} 
          />
          <ModalCuenta 
            isOpen={isCuentaModalOpen}
            onClose={handleCloseAccountModal}
          />
          <SearchModal 
            isOpen={isSearchModalOpen}
            onClose={handleCloseSearchModal}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
