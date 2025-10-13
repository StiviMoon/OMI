'use client';

import React from 'react';
import { Play } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-[120px] right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold text-cyan-400">MI</span>
        </div>
      </div>
    </header>
  );
};