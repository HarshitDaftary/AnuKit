/**
 * useTableSorting Hook
 * Manages table sorting state and operations
 */

import { useState, useMemo, useCallback } from 'react';
import type { ColumnDef } from '../Table';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface UseTableSortingProps<T> {
  /** Initial sort configuration */
  initialSort?: SortConfig | null;
  
  /** Controlled sort configuration */
  sort?: SortConfig | null;
  
  /** Callback when sort changes */
  onSortChange?: (sort: SortConfig | null) => void;
  
  /** Whether sorting is enabled */
  enableSorting?: boolean;
  
  /** Table data to sort */
  data: T[];
  
  /** Column definitions for sort functions */
  columns: ColumnDef<T>[];
}

export interface UseTableSortingReturn<T> {
  /** Current sort configuration */
  currentSort: SortConfig | null;
  
  /** Sorted data */
  sortedData: T[];
  
  /** Function to handle sort changes */
  handleSortChange: (columnId: string) => void;
  
  /** Get sort direction for a column */
  getSortDirection: (columnId: string) => 'asc' | 'desc' | null;
  
  /** Check if a column is currently sorted */
  isColumnSorted: (columnId: string) => boolean;
}

/**
 * Hook for managing table sorting state and operations
 */
export const useTableSorting = <T,>({
  initialSort = null,
  sort,
  onSortChange,
  enableSorting = true,
  data,
  columns,
}: UseTableSortingProps<T>): UseTableSortingReturn<T> => {
  const [internalSort, setInternalSort] = useState<SortConfig | null>(initialSort);
  
  const currentSort = sort !== undefined ? sort : internalSort;
  
  // Optimized sorting function
  const sortData = useCallback((data: T[], sort: SortConfig, columns: ColumnDef<T>[]) => {
    const { key, direction } = sort;
    const column = columns.find(col => col.id === key);
    if (!column) return data;
    
    const getValue = (row: T) => {
      if (column.accessor) {
        return typeof column.accessor === 'function' 
          ? column.accessor(row) 
          : row[column.accessor];
      }
      return '';
    };
    
    const compare = column.sortFn || ((a: T, b: T) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      
      // Optimized null handling
      if (aValue == null) return bValue == null ? 0 : 1;
      if (bValue == null) return -1;
      
      // Type-specific comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
      return String(aValue).localeCompare(String(bValue));
    });
    
    const sorted = [...data].sort(compare);
    return direction === 'desc' ? sorted.reverse() : sorted;
  }, []);
  
  // Memoized sorted data with optimized dependencies
  const sortedData = useMemo(() => {
    if (!currentSort || !enableSorting) return data;
    return sortData(data, currentSort, columns);
  }, [data, currentSort, enableSorting, columns, sortData]);
  
  // Optimized sort change handler
  const handleSortChange = useCallback((columnId: string) => {
    const newDirection = currentSort?.key === columnId && currentSort.direction === 'asc' ? 'desc' : 'asc';
    const newSort: SortConfig = { key: columnId, direction: newDirection };
    
    onSortChange ? onSortChange(newSort) : setInternalSort(newSort);
  }, [currentSort?.key, currentSort?.direction, onSortChange]);
  
  // Get sort direction for a column
  const getSortDirection = useCallback((columnId: string): 'asc' | 'desc' | null => {
    if (currentSort?.key === columnId) {
      return currentSort.direction;
    }
    return null;
  }, [currentSort]);
  
  // Check if a column is currently sorted
  const isColumnSorted = useCallback((columnId: string): boolean => {
    return currentSort?.key === columnId;
  }, [currentSort]);
  
  return {
    currentSort,
    sortedData,
    handleSortChange,
    getSortDirection,
    isColumnSorted,
  };
};