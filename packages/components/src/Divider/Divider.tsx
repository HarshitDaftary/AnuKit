/**
 * Divider Component
 * Visual separator between content sections
 */

import React, { forwardRef } from 'react';
import { cn } from '@optimui/utils';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";

const l_prx = `${lib}-divider`;

export interface DividerProps {
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
  as?: keyof JSX.IntrinsicElements;
  
  /** Custom styles */
  style?: React.CSSProperties;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(({
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
    `optimui-divider-${orientation}`,
    `optimui-divider-${variant}`,
    `optimui-divider-${thickness}`,
    `optimui-divider-margin-${margin}`,
    {
      `${[^}]*}[^`]*`: hasLabel,
      [`optimui-divider-text-${textAlign}`]: hasLabel,
      `${[^}]*}[^`]*`: fullSize,
    },
    className
  );
  
  const dividerStyle = {
    ...style,
    ...(color && {
      '--divider-color': color,
    }),
  };
  
  if (hasLabel && !isVertical) {
    return (
      <Component
        ref={ref}
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
      ref={ref}
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