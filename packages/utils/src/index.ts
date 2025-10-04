// Utility functions for OptimUI components
export { clsx } from 'clsx';
import React from 'react';

// Component utilities
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// SSR-safe ID hook
export const useSSRSafeId = (prefix?: string): string => {
  const id = React.useId();
  return prefix ? `${prefix}-${id}` : id;
};

// Reduced motion hook
export const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return reducedMotion;
};

// Portal hook for modals and tooltips
export const usePortal = (containerId?: string) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  
  React.useEffect(() => {
    let element: HTMLElement;
    
    if (containerId) {
      element = document.getElementById(containerId) || document.body;
    } else {
      element = document.body;
    }
    
    setContainer(element);
  }, [containerId]);
  
  return container;
};

// Date utilities commonly used across components
export const formatDate = (date: Date | null, format: string = 'MM/dd/yyyy'): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
};

export const parseDate = (dateString: string, format: string = 'MM/dd/yyyy'): Date | null => {
  if (!dateString) return null;
  
  try {
    const parts = dateString.split('/');
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch {
    return null;
  }
  
  return null;
};

export const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
};

// Size utilities
export const getSizeValue = (size: string | number): number => {
  if (typeof size === 'number') return size;
  
  const sizeMap: Record<string, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
  };
  
  return sizeMap[size] || 24;
};

// Color utilities
export const generateBackgroundColor = (name: string): string => {
  const colors = [
    '#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac',
    '#4299e1', '#667eea', '#9f7aea', '#ed64a6', '#f093fb'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length] || colors[0];
};

export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Focus management utilities
export const focusElement = (element: HTMLElement | null): void => {
  if (element) {
    element.focus();
  }
};

// Keyboard utilities
export const isEnterKey = (event: KeyboardEvent): boolean => {
  return event.key === 'Enter';
};

export const isSpaceKey = (event: KeyboardEvent): boolean => {
  return event.key === ' ';
};

export const isEscapeKey = (event: KeyboardEvent): boolean => {
  return event.key === 'Escape';
};

// Polymorphic component utilities
export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponentProp<
  T extends React.ElementType,
  Props = {}
> = Props & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof Props>;

export type PolymorphicComponentPropWithRef<
  T extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> };

// Table utilities
export * from './table-utils';

// Size mode utilities
export * from './sizeMode';