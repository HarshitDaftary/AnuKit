/**
 * Table Component - Optimized
 * Comprehensive table with sorting, pagination, selection, and responsive design
 * Uses extracted hooks for better maintainability while keeping developer-friendly API
 */

import React, { useCallback } from 'react';
import { cn } from '@optimui/utils';
import { useTableSorting } from './hooks/useTableSorting';
import { useTableSelection } from './hooks/useTableSelection';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";
const l_prx = `${lib}-table`;

// Re-export types from hooks for convenience - these will be re-exported at the end
import type { SortConfig } from './hooks/useTableSorting';
import type { SelectionConfig } from './hooks/useTableSelection';

// Column definition types
interface ColumnDef<T = any> {
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

interface TableProps<T = any> extends Omit<React.HTMLAttributes<HTMLTableElement>, 'onSelect'> {
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
  
  // Use sorting hook
  const {
    currentSort,
    sortedData,
    handleSortChange,
    getSortDirection,
    isColumnSorted,
  } = useTableSorting({
    sort,
    onSortChange,
    enableSorting,
    data,
    columns,
  });
  
  // Use selection hook
  const {
    processedColumns,
    isRowSelected,
  } = useTableSelection({
    selection,
    data,
    columns,
  });
  
  // Helper functions
  const getCellValue = useCallback((row: T, column: ColumnDef<T>) => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(row);
      }
      return row[column.accessor];
    }
    return '';
  }, []);
  
  const renderCell = useCallback((row: T, column: ColumnDef<T>, rowIndex: number) => {
    const value = getCellValue(row, column);
    
    if (column.cell) {
      return column.cell({ value, row, column });
    }
    
    return value;
  }, [getCellValue]);
  
  const getColumnClasses = useCallback((column: ColumnDef<T>, baseClass: string, additionalClasses: string[] = []) => {
    const classes = [baseClass, ...additionalClasses];
    
    if (column.align === 'left') classes.push(`${baseClass}-left`);
    if (column.align === 'center') classes.push(`${baseClass}-center`);
    if (column.align === 'right') classes.push(`${baseClass}-right`);
    if (column.sticky === 'left') classes.push(`${baseClass}-sticky-left`);
    if (column.sticky === 'right') classes.push(`${baseClass}-sticky-right`);
    
    return classes.filter(Boolean).join(' ');
  }, []);
  
  const getColumnStyles = useCallback((column: ColumnDef<T>): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    if (column.width) styles.width = column.width;
    if (column.minWidth) styles.minWidth = column.minWidth;
    if (column.maxWidth) styles.maxWidth = column.maxWidth;
    return styles;
  }, []);
  
  const getSortIcon = useCallback((direction: 'asc' | 'desc' | null) => {
    if (direction === 'asc') {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      );
    }
    if (direction === 'desc') {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    );
  }, []);
  
  // Render cell content
  const renderCell = useCallback((row: T, column: ColumnDef<T>, rowIndex: number) => {
    const value = getCellValue(row, column);
    
    if (column.cell) {
      return column.cell({ value, row, column });
    }
    
    return value;
  }, [getCellValue]);
  
  // Handle row click
  const handleRowClick = useCallback((row: T, index: number) => {
    onRowClick?.(row, index);
  }, [onRowClick]);
  
  const tableClasses = cn(
    l_prx,
    {
      [`${l_prx}--sm`]: size === 'sm',
      [`${l_prx}--md`]: size === 'md',
      [`${l_prx}--lg`]: size === 'lg',
      [`${l_prx}--striped`]: variant === 'striped',
      [`${l_prx}--bordered`]: variant === 'bordered',
      [`${l_prx}--hoverable`]: hoverable,
      [`${l_prx}--loading`]: loading,
    },
    className
  );
  
  const wrapperClasses = cn(
    `${l_prx}-wrapper`,
    {
      [`${l_prx}-wrapper--responsive`]: responsive,
    }
  );
  
  return (
    <div className={wrapperClasses}>
      <table {...props} className={tableClasses}>
        {caption && <caption className={`${lib}-table-caption`}>{caption}</caption>}
        
        <thead className={`${lib}-table-header`}>
          <tr className={`${lib}-table-header-row`}>
            {processedColumns.map((column) => {
              const isSortable = column.sortable !== false && enableSorting;
              const isSorted = isColumnSorted(column.id);
              const sortDirection = getSortDirection(column.id);
              
              return (
                <th
                  key={column.id}
                  className={cn(
                    getTableCellClasses(column, `${lib}-table-header-cell`, [
                      isSortable ? `${lib}-table-header-cell-sortable` : '',
                      isSorted ? `${lib}-table-header-cell-sorted` : '',
                      sortDirection === 'asc' ? `${lib}-table-header-cell-sorted-asc` : '',
                      sortDirection === 'desc' ? `${lib}-table-header-cell-sorted-desc` : '',
                    ].filter(Boolean))
                  )}
                  style={getTableCellStyles(column)}
                  onClick={isSortable ? () => handleSortChange(column.id) : undefined}
                  role={isSortable ? 'button' : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  aria-sort={
                    isSorted 
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : isSortable ? 'none' : undefined
                  }
                >
                  <div className={`${lib}-table-header-content`}>
                    {column.headerCell ? column.headerCell({ column }) : column.header}
                    {isSortable && (
                      <span className={`${lib}-table-sort-icon`}>
                        {createSortIcon(sortDirection)}
                      </span>
                    )}
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
              const selected = isRowSelected(row);
              
              if (renderRow) {
                return renderRow({ row, index: rowIndex, columns: processedColumns });
              }
              
              return (
                <tr
                  key={rowKey}
                  className={cn(
                    `${l_prx}-row`,
                    {
                      [`${l_prx}-row--selected`]: selected,
                      [`${l_prx}-row--clickable`]: Boolean(onRowClick),
                    }
                  )}
                  onClick={() => handleRowClick(row, rowIndex)}
                >
                  {processedColumns.map((column) => (
                    <td
                      key={column.id}
                      className={getTableCellClasses(column, `${lib}-table-cell`)}
                      style={getTableCellStyles(column)}
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
                  className={getTableCellClasses(column, `${lib}-table-footer-cell`)}
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
export type { TableProps, ColumnDef, SortConfig, SelectionConfig };