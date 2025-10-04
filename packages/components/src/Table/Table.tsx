/**
 * Table Component - Optimized with hooks
 */

import React, { useCallback, forwardRef } from 'react';
import { cn } from '@optimui/utils';
import { useTableSorting } from './hooks/useTableSorting';
import { useTableSelection } from './hooks/useTableSelection';

const lib = 'optimui';
const l_prx = `${lib}-table`;

export type { SortConfig } from './hooks/useTableSorting';
export type { SelectionConfig } from './hooks/useTableSelection';

export interface ColumnDef<T = any> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => any);
  cell?: (props: { value: any; row: T; column: ColumnDef<T> }) => React.ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  resizable?: boolean;
  sticky?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  headerCell?: (props: { column: ColumnDef<T> }) => React.ReactNode;
  footerCell?: (props: { column: ColumnDef<T> }) => React.ReactNode;
}

export interface TableProps<T = any> extends Omit<React.HTMLAttributes<HTMLTableElement>, 'onSelect'> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  emptyContent?: React.ReactNode;
  loadingContent?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'striped' | 'bordered';
  hoverable?: boolean;
  responsive?: boolean;
  selection?: import('./hooks/useTableSelection').SelectionConfig<T>;
  sort?: import('./hooks/useTableSorting').SortConfig;
  onSortChange?: (sort: import('./hooks/useTableSorting').SortConfig | null) => void;
  enableSorting?: boolean;
  caption?: React.ReactNode;
  showFooter?: boolean;
  renderRow?: (props: { row: T; index: number; columns: ColumnDef<T>[] }) => React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  getRowKey?: (row: T, index: number) => string;
  className?: string;
}

const Table = forwardRef<HTMLTableElement, TableProps<any>>(({
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
}, ref) => {
  const { currentSort, sortedData, handleSortChange, getSortDirection, isColumnSorted } = useTableSorting({
    sort,
    onSortChange,
    enableSorting,
    data,
    columns,
  });

  const { processedColumns, isRowSelected } = useTableSelection({ selection, data, columns });

  const getCellValue = useCallback((row: any, column: ColumnDef<any>) => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') return column.accessor(row);
      return row[column.accessor];
    }
    return '';
  }, []);

  const renderCell = useCallback((row: any, column: ColumnDef<any>) => {
    const value = getCellValue(row, column);
    return column.cell ? column.cell({ value, row, column }) : value;
  }, [getCellValue]);

  const getColumnClasses = useCallback((column: ColumnDef<any>, base: string, extra: string[] = []) => {
    const classes = [base, ...extra];
    if (column.align === 'left') classes.push(`${base}-left`);
    if (column.align === 'center') classes.push(`${base}-center`);
    if (column.align === 'right') classes.push(`${base}-right`);
    if (column.sticky === 'left') classes.push(`${base}-sticky-left`);
    if (column.sticky === 'right') classes.push(`${base}-sticky-right`);
    return classes.filter(Boolean).join(' ');
  }, []);

  const getColumnStyles = useCallback((column: ColumnDef<any>): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    if (column.width) styles.width = column.width;
    if (column.minWidth) styles.minWidth = column.minWidth;
    if (column.maxWidth) styles.maxWidth = column.maxWidth;
    return styles;
  }, []);

  const tableClasses = cn(
    l_prx,
    size === 'sm' && `${l_prx}--sm`,
    size === 'md' && `${l_prx}--md`,
    size === 'lg' && `${l_prx}--lg`,
    variant === 'striped' && `${l_prx}--striped`,
    variant === 'bordered' && `${l_prx}--bordered`,
    hoverable && `${l_prx}--hoverable`,
    loading && `${l_prx}--loading`,
    className
  );

  const wrapperClasses = cn(`${l_prx}-wrapper`, responsive && `${l_prx}-wrapper--responsive`);

  const handleRowClick = useCallback((row: any, index: number) => onRowClick?.(row, index), [onRowClick]);

  return (
    <div className={wrapperClasses}>
      <table ref={ref} {...props} className={tableClasses}>
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
                  className={getColumnClasses(column, `${lib}-table-header-cell`, [
                    isSortable ? `${lib}-table-header-cell-sortable` : '',
                    isSorted ? `${lib}-table-header-cell-sorted` : '',
                    sortDirection === 'asc' ? `${lib}-table-header-cell-sorted-asc` : '',
                    sortDirection === 'desc' ? `${lib}-table-header-cell-sorted-desc` : '',
                  ].filter(Boolean))}
                  style={getColumnStyles(column)}
                  onClick={isSortable ? () => handleSortChange(column.id) : undefined}
                  role={isSortable ? 'button' : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  aria-sort={
                    isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : isSortable ? 'none' : undefined
                  }
                >
                  <div className={`${lib}-table-header-content`}>
                    {column.headerCell ? column.headerCell({ column }) : column.header}
                    {isSortable && (
                      <span className={`${lib}-table-sort-icon`}>
                        {sortDirection === 'asc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 14l5-5 5 5z"/>
                          </svg>
                        ) : sortDirection === 'desc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        )}
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
              if (renderRow) return renderRow({ row, index: rowIndex, columns: processedColumns });
              return (
                <tr
                  key={rowKey}
                  className={cn(
                    `${l_prx}-row`,
                    selected && `${l_prx}-row--selected`,
                    Boolean(onRowClick) && `${l_prx}-row--clickable`
                  )}
                  onClick={() => handleRowClick(row, rowIndex)}
                >
                  {processedColumns.map((column) => (
                    <td key={column.id} className={getColumnClasses(column, `${lib}-table-cell`)} style={getColumnStyles(column)}>
                      {renderCell(row, column)}
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
                <td key={column.id} className={getColumnClasses(column, `${lib}-table-footer-cell`)}>
                  {column.footerCell ? column.footerCell({ column }) : ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
});

Table.displayName = 'Table';

export { Table };