import React, { forwardRef } from 'react';
import { encodeSizeMode as enc } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-container`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid';
type PaddingValue = 0 | 'px' | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Container max-width breakpoint */
  size?: ContainerSize;
  
  /** Horizontal padding */
  px?: PaddingValue;
  
  /** Vertical padding */
  py?: PaddingValue;
  
  /** All-around padding */
  p?: PaddingValue;
  
  /** Whether to center the container */
  center?: boolean;
  
  /** Children elements */
  children: React.ReactNode;
  
  /** Custom CSS class */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
}

const getContainerSizeClass = (size: ContainerSize): string => {
  switch (size) {
    case 'sm': return `${l_prx}-sm`;
    case 'md': return `${l_prx}-md`;
    case 'lg': return `${l_prx}-lg`;
    case 'xl': return `${l_prx}-xl`;
    case '2xl': return `${l_prx}-2xl`;
    case 'fluid': return `${l_prx}-fluid`;
    default: return `${l_prx}-lg`;
  }
};

const getPaddingClass = (value: PaddingValue, direction: 'x' | 'y' | 'all'): string => {
  if (value === 'px') {
    switch (direction) {
      case 'x': return 'px-px';
      case 'y': return 'py-px';
      case 'all': return 'p-px';
    }
  }
  
  switch (direction) {
    case 'x': return `px-${value}`;
    case 'y': return `py-${value}`;
    case 'all': return `p-${value}`;
  }
};

/* @__PURE__ */
const Container = forwardRef<HTMLDivElement, ContainerProps>(({
  size = 'lg',
  px,
  py,
  p,
  center = true,
  children,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseClasses = [l_prx];
  
  // Add size class
  baseClasses.push(getContainerSizeClass(size));
  
  // Add padding classes
  if (p !== undefined) {
    baseClasses.push(getPaddingClass(p, 'all'));
  } else {
    // Default container padding if no specific padding is set
    if (px === undefined && py === undefined) {
      baseClasses.push('px-4'); // Default horizontal padding
    } else {
      if (px !== undefined) {
        baseClasses.push(getPaddingClass(px, 'x'));
      }
      if (py !== undefined) {
        baseClasses.push(getPaddingClass(py, 'y'));
      }
    }
  }
  
  // Container styles
  const containerStyle: React.CSSProperties = { ...style };
  
  if (!center) {
    containerStyle.marginLeft = 0;
    containerStyle.marginRight = 0;
  }
  
  return (
    <div
      ref={ref}
      className={cn(...baseClasses, className)}
      style={containerStyle}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export { Container };