import React, { forwardRef } from 'react';

const lib = "anukit";
const l_prx = `${lib}-grid`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

type ColsValue = number | 'auto-fit' | 'auto-fill';
type GapValue = 0 | 'px' | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns or responsive column configuration */
  cols?: ColsValue | {
    default?: ColsValue;
    sm?: ColsValue;
    md?: ColsValue;
    lg?: ColsValue;
    xl?: ColsValue;
  };
  
  /** Number of rows */
  rows?: number;
  
  /** Gap between grid items */
  gap?: GapValue;
  
  /** Minimum column width for auto-fit/auto-fill */
  minColWidth?: string;
  
  /** Custom grid template columns */
  templateColumns?: string;
  
  /** Custom grid template rows */
  templateRows?: string;
  
  /** Grid auto flow */
  autoFlow?: 'row' | 'column' | 'row-dense' | 'column-dense';
  
  /** Children elements */
  children: React.ReactNode;
  
  /** Custom CSS class */
  className?: string;
}

const getColsClass = (cols: ColsValue): string => {
  if (cols === 'auto-fit') return `${l_prx}-cols-auto-fit`;
  if (cols === 'auto-fill') return `${l_prx}-cols-auto-fill`;
  if (typeof cols === 'number' && cols >= 1 && cols <= 12) {
    return `anukit-grid-cols-${cols}`;
  }
  return `${l_prx}-cols-1`;
};

const getRowsClass = (rows: number): string => {
  if (rows >= 1 && rows <= 6) {
    return `anukit-grid-rows-${rows}`;
  }
  return '';
};

const getGapClass = (gap: GapValue | undefined): string => {
  if (gap === undefined) return '';
  if (gap === 'px') return `${lib}-gap-px`;
  return `anukit-gap-${gap}`;
};

/* @__PURE__ */
const Grid = forwardRef<HTMLDivElement, GridProps>(({
  cols = 1,
  rows,
  gap = 4,
  minColWidth = '250px',
  templateColumns,
  templateRows,
  autoFlow,
  children,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseClasses = [l_prx];
  
  // Handle responsive columns
  if (typeof cols === 'object' && cols !== null) {
    // Responsive grid configuration
    if (cols.default !== undefined) {
      baseClasses.push(getColsClass(cols.default));
    }
    if (cols.sm !== undefined) {
      baseClasses.push(`sm:${getColsClass(cols.sm)}`);
    }
    if (cols.md !== undefined) {
      baseClasses.push(`md:${getColsClass(cols.md)}`);
    }
    if (cols.lg !== undefined) {
      baseClasses.push(`lg:${getColsClass(cols.lg)}`);
    }
    if (cols.xl !== undefined) {
      baseClasses.push(`xl:${getColsClass(cols.xl)}`);
    }
  } else {
    // Simple columns configuration
    baseClasses.push(getColsClass(cols));
  }
  
  // Add rows class
  if (rows) {
    baseClasses.push(getRowsClass(rows));
  }
  
  // Add gap class
  baseClasses.push(getGapClass(gap));
  
  // Custom styles
  const gridStyle: React.CSSProperties = { ...style };
  
  if (templateColumns) {
    gridStyle.gridTemplateColumns = templateColumns;
  } else if (typeof cols !== 'object' && (cols === 'auto-fit' || cols === 'auto-fill') && minColWidth) {
    const autoType = cols === 'auto-fit' ? 'auto-fit' : 'auto-fill';
    gridStyle.gridTemplateColumns = `repeat(${autoType}, minmax(${minColWidth}, 1fr))`;
  }
  
  if (templateRows) {
    gridStyle.gridTemplateRows = templateRows;
  }
  
  if (autoFlow) {
    gridStyle.gridAutoFlow = autoFlow;
  }
  
  return (
    <div
      ref={ref}
      className={cn(...baseClasses, className)}
      style={gridStyle}
      role="grid"
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

export { Grid };