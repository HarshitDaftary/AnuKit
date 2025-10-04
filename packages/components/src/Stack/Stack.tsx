import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-stack`;

type GapValue = 0 | 'px' | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24;
type StackDirection = 'vertical' | 'horizontal';
type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stack direction */
  direction?: StackDirection;
  
  /** Gap between stack items */
  gap?: GapValue;
  
  /** Alignment of items on cross-axis */
  align?: AlignItems;
  
  /** Justification of items on main-axis */
  justify?: JustifyContent;
  
  /** Whether to add dividers between items */
  divider?: boolean;
  
  /** Custom divider element */
  dividerElement?: React.ReactNode;
  
  /** Whether items should wrap */
  wrap?: boolean;
  
  /** Children elements */
  children: React.ReactNode;
  
  /** Custom CSS class */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
}

const getDirectionClass = (direction: StackDirection): string => {
  return direction === 'vertical' ? `${l_prx}-vertical` : `${l_prx}-horizontal`;
};

const getAlignClass = (align: AlignItems): string => {
  return `anukit-items-${align}`;
};

const getJustifyClass = (justify: JustifyContent): string => {
  return `anukit-justify-${justify}`;
};

const getGapClass = (gap: GapValue | undefined): string => {
  if (gap === undefined) return '';
  if (gap === 'px') return `${lib}-gap-px`;
  return `anukit-gap-${gap}`;
};

const Stack = forwardRef<HTMLDivElement, StackProps>(({
  direction = 'vertical',
  gap = 4,
  align,
  justify,
  divider = false,
  dividerElement,
  wrap = false,
  children,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseClasses = [l_prx];
  
  // Add direction class
  baseClasses.push(getDirectionClass(direction));
  
  // Add alignment classes
  if (align) {
    baseClasses.push(getAlignClass(align));
  }
  
  if (justify) {
    baseClasses.push(getJustifyClass(justify));
  }
  
  // Add gap class
  baseClasses.push(getGapClass(gap));
  
  // Add wrap class
  if (wrap) {
    baseClasses.push(`${lib}-flex-wrap`);
  }
  
  // Add divider class
  if (divider) {
    baseClasses.push(`${l_prx}-divider`);
  }
  
  // Render children with custom dividers if provided
  const renderChildren = () => {
    if (!dividerElement || !divider) {
      return children;
    }
    
    const childArray = React.Children.toArray(children);
    const childrenWithDividers: React.ReactNode[] = [];
    
    childArray.forEach((child, index) => {
      childrenWithDividers.push(child);
      
      // Add custom divider between items (but not after the last item)
      if (index < childArray.length - 1) {
        childrenWithDividers.push(
          <div key={`divider-${index}`} className={`${l_prx}-divider-element`}>
            {dividerElement}
          </div>
        );
      }
    });
    
    return childrenWithDividers;
  };
  
  return (
    <div
      ref={ref}
      className={cn(...baseClasses, className)}
      style={style}
      {...props}
    >
      {renderChildren()}
    </div>
  );
});

Stack.displayName = 'Stack';

export { Stack };