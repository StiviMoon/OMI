'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Film, Tv, Baby, Zap, History, User, Menu, X } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { SearchModal } from './SearchModal';
import { Movie } from '@/lib/types';

/**
 * Props for the {@link Sidebar} component.
 * 
 * @interface SidebarProps
 */
interface SidebarProps {
  /** Optional callback triggered when a video is selected from search results. */
  onVideoSelect?: (movie: Movie) => void;
}

/**
 * Responsive sidebar component for main navigation.
 * 
 * This component provides:
 * - Vertical sidebar with categorized navigation icons.
 * - Collapsible mobile version with toggle button.
 * - Integrated search modal trigger.
 * - Highlights active navigation section.
 * 
 * Features:
 * - Adaptive layout for desktop and mobile.
 * - Smooth slide animations for menu transitions.
 * - Modular design using reusable {@link SidebarItem} and {@link SearchModal}.
 * 
 * @component
 * @example
 * <Sidebar onVideoSelect={(movie) => console.log('Selected movie:', movie)} />
 * 
 * @param {SidebarProps} props - Component props.
 * @returns {JSX.Element} The rendered sidebar component.
 */
export const Sidebar: React.FC<SidebarProps> = ({ onVideoSelect }) => {
  // ======= STATE =======
  /** Current active menu label. */
  const [activeItem, setActiveItem] = useState('PELICULA');
  /** Whether the search modal is visible. */
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  /** Whether the sidebar is open in mobile view. */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ======= HANDLERS =======
  /**
   * Handles item selection from the sidebar.
   * - Opens the search modal if "BUSCAR" is clicked.
   * - Updates active item for navigation highlighting.
   * - Closes mobile menu automatically after selection.
   * 
   * @param {string} label - The label of the clicked item.
   */
  const handleItemClick = (label: string) => {
    if (label === 'BUSCAR') {
      setIsSearchModalOpen(true);
    } else {
      setActiveItem(label);
    }
    setIsMobileMenuOpen(false);
  };

  // ======= MENU CONFIGURATION =======
  /** Top navigation items. */
  const menuItems = [
    { icon: <Search className="w-5 h-5" />, label: 'BUSCAR' },
    { icon: <Film className="w-5 h-5" />, label: 'PELICULA' },
    { icon: <Tv className="w-5 h-5" />, label: 'SERIES' },
    { icon: <Baby className="w-5 h-5" />, label: 'NIÑOS' },
    { icon: <Zap className="w-5 h-5" />, label: 'ANIME' },
  ];

  /** Bottom (secondary) navigation items. */
  const bottomItems = [
    { icon: <History className="w-5 h-5" />, label: 'HISTORIAL' },
    { icon: <User className="w-5 h-5" />, label: 'CUENTA' },
  ];

  // ======= RENDER =======
  return (
    <>
      {/* ======= MOBILE MENU TOGGLE BUTTON ======= */}
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

      {/* ======= MOBILE OVERLAY ======= */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ======= SIDEBAR PANEL ======= */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-black border-r border-gray-800 z-50 transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          w-[240px] md:w-[60px] lg:w-[120px]
        `}
      >
        <nav className="flex flex-col h-full py-4">
          {/* ======= LOGO SECTION ======= */}
          <div className="flex items-center justify-center px-4 mb-6">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={64}
              height={64}
              className="w-12 h-12 md:w-10 md:h-10 lg:w-16 lg:h-16 object-contain"
              priority
            />
          </div>
          
          {/* ======= MAIN MENU ======= */}
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

          {/* ======= BOTTOM MENU ======= */}
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

      {/* ======= SEARCH MODAL ======= */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onVideoSelect={onVideoSelect}
      />
    </>
  );
};
