'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Film, Star, History, User, Menu, X, HandHeart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarItem } from './SidebarItem';
import { SearchModal } from './SearchModal';
import { Movie } from '@/lib/types';
import ModalCuenta from '../Cuenta/ModalCuenta';

interface SidebarProps {
  onVideoSelect?: (movie: Movie) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onVideoSelect }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determinar el item activo basado en la ruta actual
  const getActiveItem = useCallback(() => {
    if (pathname === '/videos') return 'PELICULA';
    if (pathname === '/historial') return 'HISTORIAL';
    if (pathname === '/fav') return 'FAVORITOS';
    return 'PELICULA'; // Default
  }, [pathname]);

  const [activeItem, setActiveItem] = useState(getActiveItem());
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCuentaModalOpen, setIsCuentaModalOpen] = useState(false);

  // Sincronizar activeItem cuando cambie la ruta
  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [pathname, getActiveItem]);

  const handleItemClick = (label: string) => {
    setIsMobileMenuOpen(false);

    // Manejar BUSCAR
    if (label === 'BUSCAR') {
      setIsSearchModalOpen(true);
      return;
    }

    // Manejar CUENTA
    if (label === 'CUENTA') {
      setIsCuentaModalOpen(true);
      return;
    }

    // Manejar navegación
    setActiveItem(label);

    switch (label) {
      case 'PELICULA':
        router.push('/videos');
        break;
      case 'FAVORITOS':
        router.push('/fav');
        break;
      case 'HISTORIAL':
        // router.push('/historial'); // Descomentar cuando tengas la ruta
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { icon: <Search className="w-5 h-5" />, label: 'BUSCAR' },
    { icon: <Film className="w-5 h-5" />, label: 'PELICULA' },
    { icon: <Star className="w-5 h-5" />, label: 'FAVORITOS' }
    
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
          w-[260px] md:w-[80px] lg:w-[160px]
        `}
      >
        <nav className="flex flex-col h-full py-4">
          {/* Logo Section */}
          <div className="flex items-center justify-center px-4 mb-6">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={64}
              height={64}
              className="w-12 h-12 md:w-10 md:h-10 lg:w-16 lg:h-16 object-contain cursor-pointer hover:opacity-80 transition-opacity"
              priority
              onClick={() => {
                router.push('/videos');
                setActiveItem('PELICULA');
              }}
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
      <ModalCuenta 
        isOpen={isCuentaModalOpen}
        onClose={() => setIsCuentaModalOpen(false)}
      />
    </>
  );
};