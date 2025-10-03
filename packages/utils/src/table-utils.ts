/**
 * Table Utilities
 * Shared utilities for table components
 */

import React from 'react';

// Basic column definition interface (simplified to avoid circular dependencies)
export interface BasicColumnDef<T = any> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => any);
  cell?: (props: { value: any; row: T; column: BasicColumnDef<T> }) => React.ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  align?: 'left' | 'center' | 'right';
  sticky?: 'left' | 'right';
  hidden?: boolean;
}

/**
 * Get cell value from a row using column accessor
 */
export const getCellValue = <T,>(row: T, column: BasicColumnDef<T>): any => {
  if (column.accessor) {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return (row as any)[column.accessor];
  }
  return '';
};

/**
 * Render cell content using column cell renderer or default value
 */
export const renderCellContent = <T,>(
  row: T, 
  column: BasicColumnDef<T>,
  value?: any
): React.ReactNode => {
  const cellValue = value !== undefined ? value : getCellValue(row, column);
  
  if (column.cell) {
    return column.cell({ value: cellValue, row, column });
  }
  
  return cellValue;
};

/**
 * Generate CSS classes for table cells based on column configuration
 */
export const getTableCellClasses = <T,>(
  column: BasicColumnDef<T>,
  baseClass: string,
  additionalClasses?: string[]
): string => {
  const classes = [baseClass];
  
  // Alignment classes
  if (column.align === 'left') classes.push(`${baseClass}-left`);
  if (column.align === 'center') classes.push(`${baseClass}-center`);
  if (column.align === 'right') classes.push(`${baseClass}-right`);
  
  // Sticky classes
  if (column.sticky === 'left') classes.push(`${baseClass}-sticky-left`);
  if (column.sticky === 'right') classes.push(`${baseClass}-sticky-right`);
  
  // Additional classes
  if (additionalClasses) {
    classes.push(...additionalClasses);
  }
  
  return classes.join(' ');
};

/**
 * Generate CSS styles for table cells based on column configuration
 */
export const getTableCellStyles = <T,>(column: BasicColumnDef<T>): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
  if (column.width) styles.width = column.width;
  if (column.minWidth) styles.minWidth = column.minWidth;
  if (column.maxWidth) styles.maxWidth = column.maxWidth;
  
  return styles;
};

/**
 * Filter visible columns (excluding hidden ones)
 */
export const getVisibleColumns = <T,>(columns: BasicColumnDef<T>[]): BasicColumnDef<T>[] => {
  return columns.filter(col => !col.hidden);
};

/**
 * Sort data by a specific column
 */
export const sortDataByColumn = <T,>(
  data: T[],
  column: BasicColumnDef<T>,
  direction: 'asc' | 'desc'
): T[] => {
  const sorted = [...data].sort((a, b) => {
    if (column.sortFn) {
      return column.sortFn(a, b);
    }
    
    const aValue = getCellValue(a, column);
    const bValue = getCellValue(b, column);
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue;
    }
    
    // Fallback to string comparison
    return String(aValue).localeCompare(String(bValue));
  });
  
  return direction === 'desc' ? sorted.reverse() : sorted;
};

/**
 * Create a default row key getter function
 */
export const createRowKeyGetter = <T,>(
  customGetter?: (row: T, index: number) => string
) => {
  return customGetter || ((row: T, index: number) => index.toString());
};

/**
 * Validate column definitions
 */
export const validateColumns = <T,>(columns: BasicColumnDef<T>[]): string[] => {
  const errors: string[] = [];
  const ids = new Set<string>();
  
  columns.forEach((column, index) => {
    // Check for duplicate IDs
    if (ids.has(column.id)) {
      errors.push(`Duplicate column ID "${column.id}" at index ${index}`);
    } else {
      ids.add(column.id);
    }
    
    // Check for missing required fields
    if (!column.id) {
      errors.push(`Column at index ${index} is missing required "id" field`);
    }
    
    if (!column.header) {
      errors.push(`Column "${column.id}" is missing required "header" field`);
    }
  });
  
  return errors;
};

/**
 * Create sort icon SVG elements
 */
export const createSortIcon = (direction: 'asc' | 'desc' | null): React.ReactNode => {
  const iconProps = {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  };
  
  if (direction === 'asc') {
    return React.createElement('svg', iconProps, 
      React.createElement('path', { d: "M7 14l5-5 5 5z" })
    );
  }
  
  if (direction === 'desc') {
    return React.createElement('svg', iconProps,
      React.createElement('path', { d: "M7 10l5 5 5-5z" })
    );
  }
  
  // Neutral/unsorted state
  return React.createElement('svg', { ...iconProps, opacity: "0.3" },
    React.createElement('path', { d: "M7 10l5 5 5-5z" })
  );
};