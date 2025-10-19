import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple conditional class names and resolves Tailwind CSS conflicts.
 *
 * @description
 * This utility combines multiple class values (strings, arrays, objects, or conditional expressions)
 * using `clsx`, and then merges any conflicting Tailwind classes via `tailwind-merge`.
 *
 * - `clsx` allows conditional class composition:
 *   ```ts
 *   clsx('text-sm', isActive && 'font-bold', ['p-4', 'm-2']);
 *   ```
 * - `twMerge` intelligently resolves conflicting Tailwind utilities:
 *   ```ts
 *   twMerge('p-2 p-4'); // -> 'p-4'
 *   ```
 *
 * @param {...ClassValue[]} inputs - List of class values or expressions to combine.
 * @returns {string} A single merged class name string ready to be used in a `className` prop.
 *
 * @example
 * ```tsx
 * import { cn } from '@/lib/utils';
 *
 * <button
 *   className={cn(
 *     'px-4 py-2 text-white rounded',
 *     isPrimary ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600',
 *     disabled && 'opacity-50 cursor-not-allowed'
 *   )}
 * >
 *   Click me
 * </button>
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
