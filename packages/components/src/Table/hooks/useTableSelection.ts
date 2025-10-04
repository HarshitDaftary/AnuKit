/**
 * useTableSelection Hook
 * Manages table selection state and operations
 */

import React, { useMemo, useCallback } from 'react';
import type { ColumnDef } from '../Table';

export interface SelectionConfig<T = any> {
  /** Selected row keys */
  selectedKeys: Set<string>;
  
  /** Callback when selection changes */
  onSelectionChange: (selectedKeys: Set<string>) => void;
  
  /** Row key accessor */
  getRowKey: (row: T) => string;
  
  /** Whether to show select all checkbox */
  showSelectAll?: boolean;
  
  /** Custom selection column configuration */
  selectionColumn?: Partial<ColumnDef<T>>;
}

export interface UseTableSelectionProps<T> {
  /** Selection configuration */
  selection?: SelectionConfig<T>;
  
  /** Table data for selection operations */
  data: T[];
  
  /** Original columns (selection column will be added) */
  columns: ColumnDef<T>[];
}

export interface UseTableSelectionReturn<T> {
  /** Processed columns including selection column */
  processedColumns: ColumnDef<T>[];
  
  /** Check if a row is selected */
  isRowSelected: (row: T) => boolean;
  
  /** Check if all rows are selected */
  isAllSelected: boolean;
  
  /** Check if some (but not all) rows are selected */
  isIndeterminate: boolean;
  
  /** Toggle selection for a single row */
  toggleRowSelection: (row: T) => void;
  
  /** Toggle selection for all rows */
  toggleAllSelection: () => void;
  
  /** Clear all selections */
  clearSelection: () => void;
  
  /** Create selection header element */
  createSelectionHeader: () => React.ReactNode;
  
  /** Create selection cell element */
  createSelectionCell: (row: T) => React.ReactNode;
}

/**
 * Hook for managing table selection state and operations
 */
export const useTableSelection = <T,>({
  selection,
  data,
  columns,
}: UseTableSelectionProps<T>): UseTableSelectionReturn<T> => {
  
  // Create selection header element
  const createSelectionHeader = useCallback((): React.ReactNode => {
    if (!selection || selection.showSelectAll === false) return '';
    
    return React.createElement('input', {
      type: 'checkbox',
      checked: selection.selectedKeys.size > 0 && selection.selectedKeys.size === data.length,
      ref: (input: HTMLInputElement | null) => {
        if (input) {
          input.indeterminate = selection.selectedKeys.size > 0 && selection.selectedKeys.size < data.length;
        }
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
          const allKeys = new Set(data.map(selection.getRowKey));
          selection.onSelectionChange(allKeys);
        } else {
          selection.onSelectionChange(new Set());
        }
      },
      'aria-label': 'Select all rows',
      className: 'anukit-table-checkbox',
    });
  }, [selection, data]);
  
  // Create selection cell element
  const createSelectionCell = useCallback((row: T): React.ReactNode => {
    if (!selection) return null;
    
    return React.createElement('input', {
      type: 'checkbox',
      checked: selection.selectedKeys.has(selection.getRowKey(row)),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const rowKey = selection.getRowKey(row);
        const newSelection = new Set(selection.selectedKeys);
        if (e.target.checked) {
          newSelection.add(rowKey);
        } else {
          newSelection.delete(rowKey);
        }
        selection.onSelectionChange(newSelection);
      },
      'aria-label': 'Select row',
      className: 'anukit-table-checkbox',
    });
  }, [selection]);
  
  // Memoize processed columns (including selection column)
  const processedColumns = useMemo(() => {
    const cols = [...columns];
    
    // Add selection column if selection is enabled
    if (selection) {
      const selectionColumn: ColumnDef<T> = {
        id: '__selection__',
        header: createSelectionHeader(),
        width: 40,
        cell: ({ row }) => createSelectionCell(row),
        ...selection.selectionColumn,
      };
      cols.unshift(selectionColumn);
    }
    
    return cols.filter(col => !col.hidden);
  }, [columns, selection, createSelectionHeader, createSelectionCell]);
  
  // Check if a row is selected
  const isRowSelected = useCallback((row: T): boolean => {
    if (!selection) return false;
    return selection.selectedKeys.has(selection.getRowKey(row));
  }, [selection]);
  
  // Check if all rows are selected
  const isAllSelected = useMemo((): boolean => {
    if (!selection || data.length === 0) return false;
    return selection.selectedKeys.size === data.length;
  }, [selection, data.length]);
  
  // Check if some (but not all) rows are selected
  const isIndeterminate = useMemo((): boolean => {
    if (!selection) return false;
    return selection.selectedKeys.size > 0 && selection.selectedKeys.size < data.length;
  }, [selection, data.length]);
  
  // Toggle selection for a single row
  const toggleRowSelection = useCallback((row: T) => {
    if (!selection) return;
    
    const rowKey = selection.getRowKey(row);
    const newSelection = new Set(selection.selectedKeys);
    
    if (newSelection.has(rowKey)) {
      newSelection.delete(rowKey);
    } else {
      newSelection.add(rowKey);
    }
    
    selection.onSelectionChange(newSelection);
  }, [selection]);
  
  // Toggle selection for all rows
  const toggleAllSelection = useCallback(() => {
    if (!selection) return;
    
    if (isAllSelected) {
      selection.onSelectionChange(new Set());
    } else {
      const allKeys = new Set(data.map(selection.getRowKey));
      selection.onSelectionChange(allKeys);
    }
  }, [selection, data, isAllSelected]);
  
  // Clear all selections
  const clearSelection = useCallback(() => {
    if (!selection) return;
    selection.onSelectionChange(new Set());
  }, [selection]);
  
  return {
    processedColumns,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    createSelectionHeader,
    createSelectionCell,
  };
};