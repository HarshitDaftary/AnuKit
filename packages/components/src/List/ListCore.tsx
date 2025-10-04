/**
 * ListCore Component
 * Basic list container with minimal features
 * Optimized for simple use cases
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-list`;

// Core list configuration
interface ListCoreProps {
  /** List items */
  children?: React.ReactNode;
  
  /** List variant */
  variant?: 'plain' | 'bordered' | 'divided';
  
  /** Dense mode (smaller padding) */
  dense?: boolean;
  
  /** Additional CSS class */
  className?: string;
  
  /** Custom element type */
  as?: 'ul' | 'ol' | 'div';
  
  /** Whether list is interactive (adds hover states) */
  interactive?: boolean;
}

const ListCore = /* @__PURE__ */ forwardRef<HTMLElement, ListCoreProps>(({
  children,
  variant = 'plain',
  dense = false,
  className,
  as: Component = 'ul',
  interactive = false,
  ...props
}, ref) => {
  const getVariantClasses = (variant: 'plain' | 'bordered' | 'divided') => {
    switch (variant) {
      case 'bordered':
        return 'border border-gray-200 rounded-md';
      case 'divided':
        return 'divide-y divide-gray-200';
      default:
        return '';
    }
  };
  
  const classes = cn(
    l_prx,
    `${l_prx}--${variant}`,
    getVariantClasses(variant),
    dense && `${l_prx}--dense`,
    interactive && `${l_prx}--interactive`,
    className
  );
  
  const handleRef = (node: HTMLElement | null) => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && 'current' in ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };
  
  return (
    <Component
      ref={handleRef}
      className={classes}
      {...props}
    >
      {children}
    </Component>
  );
});

ListCore.displayName = 'ListCore';

export { ListCore, type ListCoreProps };