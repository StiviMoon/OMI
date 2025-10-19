'use client';

import React from 'react';

/**
 * Props for the {@link MainLayout} component.
 * 
 * @interface MainLayoutProps
 */
interface MainLayoutProps {
  /** React children to render inside the main layout. */
  children: React.ReactNode;
}

/**
 * Global layout container for the main application area.
 * 
 * This component provides:
 * - A responsive content wrapper with dynamic left margin.
 * - Visual alignment with the persistent {@link Sidebar}.
 * - Global background color and smooth width transitions.
 * 
 * Designed to be used as a parent wrapper for all pages and routes.
 * 
 * @component
 * @example
 * <MainLayout>
 *   <Dashboard />
 * </MainLayout>
 * 
 * @param {MainLayoutProps} props - Component props.
 * @returns {JSX.Element} The rendered layout container.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main
      className="
        min-h-screen bg-black
        ml-0 md:ml-[60px] lg:ml-[120px]
        transition-all duration-300
      "
    >
      {children}
    </main>
  );
};
