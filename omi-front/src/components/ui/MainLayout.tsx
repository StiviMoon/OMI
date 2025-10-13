'use client';

import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main className="
      min-h-screen bg-black
      ml-0 md:ml-[60px] lg:ml-[120px]
      transition-all duration-300
    ">
      {children}
    </main>
  );
};