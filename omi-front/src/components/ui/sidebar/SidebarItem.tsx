'use client';

import React from 'react';

/**
 * Props for the {@link SidebarItem} component.
 * 
 * @interface SidebarItemProps
 */
interface SidebarItemProps {
  /** Icon element displayed on the left (or top on mobile). */
  icon: React.ReactNode;
  /** Label text displayed next to the icon. */
  label: string;
  /** Whether the item is currently active (highlighted). */
  active?: boolean;
  /** Optional click handler for selecting the item. */
  onClick?: () => void;
}

/**
 * Reusable navigation item for the sidebar.
 * 
 * This component provides:
 * - Responsive layout (horizontal on large screens, vertical on mobile).
 * - Dynamic highlighting for active states.
 * - Visual feedback on hover and click.
 * 
 * Accessibility:
 * - Fully keyboard and screen-reader accessible.
 * - Uses semantic `<button>` with clear focus states.
 * 
 * @component
 * @example
 * <SidebarItem
 *   icon={<Film className="w-5 h-5" />}
 *   label="Movies"
 *   active={true}
 *   onClick={() => console.log('Movies clicked')}
 * />
 * 
 * @param {SidebarItemProps} props - Component props.
 * @returns {JSX.Element} A styled sidebar navigation item.
 */
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
      aria-pressed={active}
      aria-label={label}
    >
      <div
        className={`
          flex-shrink-0
          ${active ? 'text-blue-500' : 'text-gray-400'}
        `}
      >
        {icon}
      </div>

      <span
        className={`
          text-xs font-medium uppercase tracking-wider
          ${active ? 'text-white' : 'text-gray-400'}
          md:text-[10px] lg:text-xs
        `}
      >
        {label}
      </span>
    </button>
  );
};
