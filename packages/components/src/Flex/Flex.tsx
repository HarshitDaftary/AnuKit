import React, { forwardRef } from 'react';

const lib = "anukit";
const l_prx = `${lib}-flex`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

type GapValue = 0 | 'px' | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24;
type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
type AlignContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
type FlexWrap = 'wrap' | 'wrap-reverse' | 'nowrap';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction */
  direction?: FlexDirection | {
    default?: FlexDirection;
    sm?: FlexDirection;
    md?: FlexDirection;
    lg?: FlexDirection;
    xl?: FlexDirection;
  };
  
  /** Justify content (main axis alignment) */
  justify?: JustifyContent;
  
  /** Align items (cross axis alignment) */
  align?: AlignItems;
  
  /** Align content (for wrapped lines) */
  alignContent?: AlignContent;
  
  /** Flex wrap behavior */
  wrap?: FlexWrap;
  
  /** Gap between flex items */
  gap?: GapValue;
  
  /** Whether to make flex items grow equally */
  grow?: boolean;
  
  /** Whether to make flex items shrink equally */
  shrink?: boolean;
  
  /** Children elements */
  children: React.ReactNode;
  
  /** Custom CSS class */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
}

const getDirectionClass = (direction: FlexDirection): string => {
  switch (direction) {
    case 'row': return `${l_prx}-row`;
    case 'row-reverse': return `${l_prx}-row-reverse`;
    case 'col': return `${l_prx}-col`;
    case 'col-reverse': return `${l_prx}-col-reverse`;
    default: return `${l_prx}-row`;
  }
};

const getJustifyClass = (justify: JustifyContent): string => {
  return `anukit-justify-${justify}`;
};

const getAlignClass = (align: AlignItems): string => {
  return `anukit-items-${align}`;
};

const getAlignContentClass = (alignContent: AlignContent): string => {
  return `anukit-content-${alignContent}`;
};

const getWrapClass = (wrap: FlexWrap): string => {
  return `anukit-flex-${wrap}`;
};

const getGapClass = (gap: GapValue | undefined): string => {
  if (gap === undefined) return '';
  if (gap === 'px') return `${lib}-gap-px`;
  return `anukit-gap-${gap}`;
};

/* @__PURE__ */
const Flex = forwardRef<HTMLDivElement, FlexProps>(({
  direction = 'row',
  justify,
  align,
  alignContent,
  wrap,
  gap = 4,
  grow = false,
  shrink = false,
  children,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseClasses = [l_prx];
  
  // Handle responsive direction
  if (typeof direction === 'object' && direction !== null) {
    if (direction.default !== undefined) {
      baseClasses.push(getDirectionClass(direction.default));
    }
    if (direction.sm !== undefined) {
      baseClasses.push(`sm:${getDirectionClass(direction.sm)}`);
    }
    if (direction.md !== undefined) {
      baseClasses.push(`md:${getDirectionClass(direction.md)}`);
    }
    if (direction.lg !== undefined) {
      baseClasses.push(`lg:${getDirectionClass(direction.lg)}`);
    }
    if (direction.xl !== undefined) {
      baseClasses.push(`xl:${getDirectionClass(direction.xl)}`);
    }
  } else {
    baseClasses.push(getDirectionClass(direction));
  }
  
  // Add other flex classes
  if (justify) {
    baseClasses.push(getJustifyClass(justify));
  }
  
  if (align) {
    baseClasses.push(getAlignClass(align));
  }
  
  if (alignContent) {
    baseClasses.push(getAlignContentClass(alignContent));
  }
  
  if (wrap) {
    baseClasses.push(getWrapClass(wrap));
  }
  
  // Add gap class
  baseClasses.push(getGapClass(gap));
  
  // Custom styles for grow/shrink
  const flexStyle: React.CSSProperties = { ...style };
  
  if (grow) {
    flexStyle.flex = '1 1 0%';
  } else if (shrink) {
    flexStyle.flex = '0 1 auto';
  }
  
  return (
    <div
      ref={ref}
      className={cn(...baseClasses, className)}
      style={flexStyle}
      {...props}
    >
      {children}
    </div>
  );
});

Flex.displayName = 'Flex';

export { Flex };