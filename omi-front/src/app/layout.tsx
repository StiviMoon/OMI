'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from 'react';
import "./globals.css";
import { Footer } from '@/components/footer/Footer';
import ModalCuenta from '@/components/ui/Cuenta/ModalCuenta';
import { SearchModal } from "@/components/ui/sidebar/SearchModal";
import { AuthProvider } from '@/lib/context/AuthContext';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCuentaModalOpen, setIsCuentaModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Footer onOpenAccountModal={() => setIsCuentaModalOpen(true)}
          onOpenSearchModal={()=> setIsSearchModalOpen(true)} />
          
          <ModalCuenta 
            isOpen={isCuentaModalOpen}
            onClose={() => setIsCuentaModalOpen(false)}
          />
          <SearchModal 
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
          />
        </AuthProvider>
      </body>
    </html>
  );
}