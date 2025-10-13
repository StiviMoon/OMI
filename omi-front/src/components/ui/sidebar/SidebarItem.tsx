'use client';

import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  active = false,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 transition-all duration-200
        hover:bg-gray-800/50
        ${active ? 'bg-gray-800 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}
        md:flex-col md:gap-1 md:px-2 md:py-3
        lg:flex-row lg:gap-3 lg:px-4 lg:py-3
      `}
    >
      <div className={`
        flex-shrink-0
        ${active ? 'text-blue-500' : 'text-gray-400'}
      `}>
        {icon}
      </div>
      <span className={`
        text-xs font-medium uppercase tracking-wider
        ${active ? 'text-white' : 'text-gray-400'}
        md:text-[10px] lg:text-xs
      `}>
        {label}
      </span>
    </button>
  );
};