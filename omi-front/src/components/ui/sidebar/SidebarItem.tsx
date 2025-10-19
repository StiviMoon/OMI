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
        group w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 relative
        hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-transparent
        ${active ? 'bg-gradient-to-r from-blue-900/30 to-transparent' : ''}
        md:flex-col md:gap-1 md:px-2 md:py-3
        lg:flex-row lg:gap-3 lg:px-4 lg:py-3
      `}
    >
      {/* Barra lateral animada */}
      <div className={`
        absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300
        ${active ? 'h-12 bg-blue-500' : 'h-0 bg-blue-500 group-hover:h-8'}
      `} />
      
      {/* Icono con efecto de escala */}
      <div className={`
        flex-shrink-0 transition-all duration-300
        ${active ? 'text-blue-400 scale-110' : 'text-gray-400 group-hover:text-gray-300 group-hover:scale-105'}
      `}>
        {icon}
      </div>
      
      {/* Label con animación */}
      <span className={`
        text-xs font-medium uppercase tracking-wider transition-all duration-300
        ${active ? 'text-white font-semibold' : 'text-gray-400 group-hover:text-gray-300'}
        md:text-[10px] lg:text-xs
      `}>
        {label}
      </span>

      {/* Glow effect cuando está activo */}
      {active && (
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none rounded" />
      )}
    </button>
  );
};