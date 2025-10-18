import React from 'react';
import { Sidebar } from '@/components/ui/sidebar/sidebar';

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      <Sidebar />
      {children}
    </div>
  );
}