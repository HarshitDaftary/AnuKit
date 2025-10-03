/**
 * Table Component
 * Comprehensive table with sorting, pagination, selection, and responsive design
 */

import React, { forwardRef, useState, useMemo, useCallback } from 'react';
import { clsx } from '@optimui/utils';
import { useTableSorting } from './hooks/useTableSorting';

const lib = "optimui";

const l_prx = `${lib}-table`;

// Column definition types
export interface ColumnDef<T = any> {
  /** Unique identifier for the column */
  id: string;
  
  /** Header content */
  header: React.ReactNode;
  
  /** Accessor function or key path for cell data */
  accessor?: keyof T | ((row: T) => any);
  
  /** Custom cell renderer */
  cell?: (props: { value: any; row: T; column: ColumnDef<T> }) => React.ReactNode;
  
  /** Column width */
  width?: string | number;
  
  /** Minimum column width */
  minWidth?: string | number;
  
  /** Maximum column width */
  maxWidth?: string | number;
  
  /** Whether column can be sorted */
  sortable?: boolean;
  
  /** Custom sort function */
  sortFn?: (a: T, b: T) => number;
  
  /** Whether column can be resized */
  resizable?: boolean;
  
  /** Whether column is sticky */
  sticky?: 'left' | 'right';
  
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Whether column is hidden */
  hidden?: boolean;
  
  /** Custom header renderer */
  headerCell?: (props: { column: ColumnDef<T> }) => React.ReactNode;
  
  /** Custom footer renderer */
  footerCell?: (props: { column: ColumnDef<T> }) => React.ReactNode;
}

// Sort configuration
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Selection configuration
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

export interface TableProps<T = any> extends Omit<React.HTMLAttributes<HTMLTableElement>, 'onSelect'> {
  /** Table data */
  data: T[];
  
  /** Column definitions */
  columns: ColumnDef<T>[];
  
  /** Loading state */
  loading?: boolean;
  
  /** Empty state content */
  emptyContent?: React.ReactNode;
  
  /** Loading content */
  loadingContent?: React.ReactNode;
  
  /** Table size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Table variant */
  variant?: 'default' | 'striped' | 'bordered';
  
  /** Whether table has hover effect */
  hoverable?: boolean;
  
  /** Whether table is responsive */
  responsive?: boolean;
  
  /** Selection configuration */
  selection?: SelectionConfig<T>;
  
  /** Sort configuration */
  sort?: SortConfig;
  
  /** Callback when sort changes */
  onSortChange?: (sort: SortConfig | null) => void;
  
  /** Whether to enable client-side sorting */
  enableSorting?: boolean;
  
  /** Caption for the table */
  caption?: React.ReactNode;
  
  /** Whether to show table footer */
  showFooter?: boolean;
  
  /** Custom row renderer */
  renderRow?: (props: { row: T; index: number; columns: ColumnDef<T>[] }) => React.ReactNode;
  
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  
  /** Row key accessor for React keys */
  getRowKey?: (row: T, index: number) => string;
  
  /** Additional CSS class */
  className?: string;
}

const Table = <T,>({
  data,
  columns,
  loading = false,
  emptyContent = 'No data available',
  loadingContent = 'Loading...',
  size = 'md',
  variant = 'default',
  hoverable = true,
  responsive = true,
  selection,
  sort,
  onSortChange,
  enableSorting = true,
  caption,
  showFooter = false,
  renderRow,
  onRowClick,
  getRowKey = (row, index) => index.toString(),
  className,
  ...props
}: TableProps<T>) => {
  // Use extracted sorting hook (OPTIMIZATION: cleaner logic separation)
  const {
    sortedData,
    handleSortChange,
    currentSort,
  } = useTableSorting({
    sort,
    onSortChange,
    enableSorting,
    data,
    columns,
  });
  
  // Optimized selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (!selection) return;
    const allKeys = new Set(data.map(selection.getRowKey));
    selection.onSelectionChange(checked ? allKeys : new Set());
  }, [selection, data]);
  
  const handleRowSelect = useCallback((row: T, checked: boolean) => {
    if (!selection) return;
    const rowKey = selection.getRowKey(row);
    const newSelection = new Set(selection.selectedKeys);
    checked ? newSelection.add(rowKey) : newSelection.delete(rowKey);
    selection.onSelectionChange(newSelection);
  }, [selection]);
  
  // Memoized selection column
  const selectionColumn = useMemo(() => {
    if (!selection) return null;
    
    const isAllSelected = selection.selectedKeys.size > 0 && selection.selectedKeys.size === data.length;
    
    return {
      id: '__selection__',
      header: selection.showSelectAll !== false ? (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
          aria-label="Select all rows"
          className={`${l_prx}-checkbox`}
        />
      ) : '',
      width: 40,
      cell: ({ row }: { row: T }) => (
        <input
          type="checkbox"
          checked={selection.selectedKeys.has(selection.getRowKey(row))}
          onChange={(e) => handleRowSelect(row, e.target.checked)}
          aria-label="Select row"
          className={`${l_prx}-checkbox`}
        />
      ),
      ...selection.selectionColumn,
    } as ColumnDef<T>;
  }, [selection, data.length, handleSelectAll, handleRowSelect]);
  
  // Memoize processed columns
  const processedColumns = useMemo(() => {
    const cols = selectionColumn ? [selectionColumn, ...columns] : [...columns];
    return cols.filter(col => !col.hidden);
  }, [columns, selectionColumn]);
  
  // Get cell value
  const getCellValue = useCallback((row: T, column: ColumnDef<T>) => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(row);
      }
      return row[column.accessor];
    }
    return '';
  }, []);
  
  // Render cell content
  const renderCell = useCallback((row: T, column: ColumnDef<T>, rowIndex: number) => {
    const value = getCellValue(row, column);
    
    if (column.cell) {
      return column.cell({ value, row, column });
    }
    
    return value;
  }, [getCellValue]);
  
  // Memoized header cell class generator
  const getHeaderCellClasses = useCallback((column: ColumnDef<T>, isSortable: boolean, sortDirection: 'asc' | 'desc' | null) => clsx(
    `${l_prx}-header-cell`,
    {
      [`${l_prx}-header-cell-sortable`]: isSortable,
      [`${l_prx}-header-cell-sorted`]: sortDirection !== null,
      [`${l_prx}-header-cell-sorted-asc`]: sortDirection === 'asc',
      [`${l_prx}-header-cell-sorted-desc`]: sortDirection === 'desc',
      [`${l_prx}-header-cell-left`]: column.align === 'left',
      [`${l_prx}-header-cell-center`]: column.align === 'center',
      [`${l_prx}-header-cell-right`]: column.align === 'right',
      [`${l_prx}-header-cell-sticky-left`]: column.sticky === 'left',
      [`${l_prx}-header-cell-sticky-right`]: column.sticky === 'right',
    }
  ), []);
  
  // Memoized cell class generator  
  const getCellClasses = useCallback((column: ColumnDef<T>) => clsx(
    `${l_prx}-cell`,
    {
      [`${l_prx}-cell-left`]: column.align === 'left',
      [`${l_prx}-cell-center`]: column.align === 'center',
      [`${l_prx}-cell-right`]: column.align === 'right',
      [`${l_prx}-cell-sticky-left`]: column.sticky === 'left',
      [`${l_prx}-cell-sticky-right`]: column.sticky === 'right',
    }
  ), []);
  
  // Memoized column styles
  const getColumnStyles = useCallback((column: ColumnDef<T>) => ({
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  }), []);
  
  // Memoized sort icon component
  const SortIcon = useMemo(() => ({ direction }: { direction: 'asc' | 'desc' | null }) => (
    <span className={`${l_prx}-sort-icon`}>
      {direction === 'asc' ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      ) : direction === 'desc' ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      )}
    </span>
  ), []);
  
  // Handle row click
  const handleRowClick = useCallback((row: T, index: number) => {
    onRowClick?.(row, index);
  }, [onRowClick]);
  
  // Memoized CSS classes
  const tableClasses = useMemo(() => clsx(
    l_prx,
    {
      [`${l_prx}-sm`]: size === 'sm',
      [`${l_prx}-md`]: size === 'md', 
      [`${l_prx}-lg`]: size === 'lg',
      [`${l_prx}-striped`]: variant === 'striped',
      [`${l_prx}-bordered`]: variant === 'bordered',
      [`${l_prx}-hoverable`]: hoverable,
      [`${l_prx}-loading`]: loading,
    },
    className
  ), [size, variant, hoverable, loading, className]);
  
  const wrapperClasses = useMemo(() => clsx(
    `${l_prx}-wrapper`,
    { [`${l_prx}-responsive`]: responsive }
  ), [responsive]);
  
  return (
    <div className={wrapperClasses}>
      <table {...props} className={tableClasses}>
        {caption && <caption className={`${l_prx}-caption`}>{caption}</caption>}
        
        <thead className={`${l_prx}-header`}>
          <tr className={`${l_prx}-header-row`}>
            {processedColumns.map((column) => {
              const isSortable = column.sortable !== false && enableSorting;
              const isSorted = currentSort?.key === column.id;
              const sortDirection = isSorted ? currentSort.direction : null;
              
              return (
                <th
                  key={column.id}
                  className={getHeaderCellClasses(column, isSortable, sortDirection)}
                  style={getColumnStyles(column)}
                  onClick={isSortable ? () => handleSortChange(column.id) : undefined}
                  role={isSortable ? 'button' : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  aria-sort={
                    isSorted 
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : isSortable ? 'none' : undefined
                  }
                >
                  <div className={`${l_prx}-header-content`}>
                    {column.headerCell ? column.headerCell({ column }) : column.header}
                    {isSortable && <SortIcon direction={sortDirection} />}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        
        <tbody className={`${lib}-table-body`}>
          {loading ? (
            <tr className={`${lib}-table-loading-row`}>
              <td colSpan={processedColumns.length} className={`${lib}-table-loading-cell`}>
                {loadingContent}
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr className={`${lib}-table-empty-row`}>
              <td colSpan={processedColumns.length} className={`${lib}-table-empty-cell`}>
                {emptyContent}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex);
              const isSelected = selection?.selectedKeys.has(selection.getRowKey(row));
              
              if (renderRow) {
                return renderRow({ row, index: rowIndex, columns: processedColumns });
              }
              
              return (
                <tr
                  key={rowKey}
                  className={clsx(
                    `${lib}-table-row`,
                    {
                      [`${lib}-table-row--selected`]: isSelected,
                      [`${lib}-table-row--clickable`]: Boolean(onRowClick),
                    }
                  )}
                  onClick={() => handleRowClick(row, rowIndex)}
                >
                  {processedColumns.map((column) => (
                    <td
                      key={column.id}
                      className={getCellClasses(column)}
                      style={getColumnStyles(column)}
                    >
                      {renderCell(row, column, rowIndex)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
        
        {showFooter && (
          <tfoot className={`${lib}-table-footer`}>
            <tr className={`${lib}-table-footer-row`}>
              {processedColumns.map((column) => (
                <td
                  key={column.id}
                  className={clsx(
                    `${lib}-table-footer-cell`,
                    {
                      [`${lib}-table-footer-cell--align-left`]: column.align === 'left',
                      [`${lib}-table-footer-cell--align-center`]: column.align === 'center',
                      [`${lib}-table-footer-cell--align-right`]: column.align === 'right',
                    }
                  )}
                >
                  {column.footerCell ? column.footerCell({ column }) : ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

Table.displayName = 'Table';

export { Table };