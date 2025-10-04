/**
 * Divider Component
 * Visual separator between content sections
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-divider`;

interface DividerProps {
  /** Divider orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Divider variant */
  variant?: 'solid' | 'dashed' | 'dotted';
  
  /** Divider thickness */
  thickness?: 'thin' | 'medium' | 'thick';
  
  /** Text content for labeled dividers */
  children?: React.ReactNode;
  
  /** Text alignment for labeled dividers */
  textAlign?: 'left' | 'center' | 'right';
  
  /** Additional CSS class */
  className?: string;
  
  /** Custom color */
  color?: string;
  
  /** Margin around the divider */
  margin?: 'none' | 'sm' | 'md' | 'lg';
  
  /** Full width/height */
  fullSize?: boolean;
  
  /** Custom element type */
  as?: 'div' | 'hr';
  
  /** Custom styles */
  style?: React.CSSProperties;
}

const Divider = forwardRef<HTMLDivElement | HTMLHRElement, DividerProps>(({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  children,
  textAlign = 'center',
  className,
  color,
  margin = 'md',
  fullSize = false,
  as: Component = 'div',
  style,
  ...props
}, ref) => {
  const isVertical = orientation === 'vertical';
  const hasLabel = Boolean(children);
  
  const dividerClasses = cn(
    l_prx,
    `${l_prx}-${orientation}`,
    `${l_prx}-${variant}`,
    `${l_prx}-${thickness}`,
    `${l_prx}-margin-${margin}`,
    hasLabel && `${l_prx}--labeled`,
    hasLabel && `${l_prx}-text-${textAlign}`,
    fullSize && `${l_prx}--fullsize`,
    className
  );
  
  const dividerStyle = {
    ...style,
    ...(color && {
      '--divider-color': color,
    }),
  };
  
  const setRef = (node: HTMLDivElement | HTMLHRElement | null) => {
    if (typeof ref === 'function') ref(node as any);
    else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLDivElement | HTMLHRElement | null>).current = node;
  };
  
  if (hasLabel && !isVertical) {
    return (
      <Component
        ref={setRef}
        role="separator"
        className={dividerClasses}
        style={dividerStyle}
        {...props}
      >
        <span className={`${l_prx}-label`}>
          {children}
        </span>
      </Component>
    );
  }
  
  return (
    <Component
      ref={setRef}
      role="separator"
      className={dividerClasses}
      style={dividerStyle}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';

export { Divider };
export type { DividerProps };