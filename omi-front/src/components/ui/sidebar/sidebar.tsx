'use client';

import React, { useState } from 'react';
import { Search, Film, Tv, Baby, Zap, History, User, Menu, X } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { SearchModal } from './SearchModal';
import { Movie } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onVideoSelect?: (movie: Movie) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onVideoSelect }) => {
  const [activeItem, setActiveItem] = useState('PELICULA');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleItemClick = (label: string) => {
    if (label === 'BUSCAR') {
      setIsSearchModalOpen(true);
    } else {
      setActiveItem(label);
    }
    // Cerrar el menú mobile al seleccionar un item
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { icon: <Search className="w-5 h-5" />, label: 'BUSCAR' },
    { icon: <Film className="w-5 h-5" />, label: 'PELICULA' },
    { icon: <Tv className="w-5 h-5" />, label: 'SERIES' },
    { icon: <Baby className="w-5 h-5" />, label: 'NIÑOS' },
    { icon: <Zap className="w-5 h-5" />, label: 'ANIME' },
  ];

  const bottomItems = [
    { icon: <History className="w-5 h-5" />, label: 'HISTORIAL' },
    { icon: <User className="w-5 h-5" />, label: 'CUENTA' },
  ];

  return (
    <>
      {/* Mobile Menu Button - Solo visible en mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay oscuro - Solo en mobile cuando está abierto */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-black border-r border-gray-800 z-50 transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          w-[240px] md:w-[60px] lg:w-[120px]
        `}
      >
        <nav className="flex flex-col h-full py-4">
          {/* Logo Section */}
          <div className="flex items-center justify-center px-4 mb-6">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-12 h-12 md:w-10 md:h-10 lg:w-16 lg:h-16 object-contain"
            />
          </div>
          
          <div className="flex-1 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeItem === item.label}
                onClick={() => handleItemClick(item.label)}
              />
            ))}
          </div>
          
          <div className="space-y-1 border-t border-gray-800 pt-4">
            {bottomItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeItem === item.label}
                onClick={() => handleItemClick(item.label)}
              />
            ))}
          </div>
        </nav>
      </aside>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onVideoSelect={onVideoSelect}
      />
    </>
  );
};