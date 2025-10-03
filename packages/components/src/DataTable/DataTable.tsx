/**
 * DataTable Component
 * High-performance virtualized table for large datasets with infinite scrolling
 */

import React, { forwardRef, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { cn } from '@optimui/utils';
import { Table, TableProps, ColumnDef } from '../Table/Table';
import { useVirtualization } from './hooks/useVirtualization';

const lib = "optimui";
const l_prx = `${lib}-datatable`;

// Virtualization configuration
export interface VirtualizationConfig {
  /** Height of each row in pixels */
  rowHeight: number;
  
  /** Container height in pixels */
  containerHeight: number;
  
  /** Number of extra rows to render outside visible area */
  overscan?: number;
  
  /** Whether to enable horizontal virtualization */
  enableHorizontalVirtualization?: boolean;
  
  /** Column width for horizontal virtualization */
  columnWidth?: number;
}

// Infinite scroll configuration
export interface InfiniteScrollConfig {
  /** Whether infinite scroll is enabled */
  enabled: boolean;
  
  /** Callback to load more data */
  onLoadMore: () => void | Promise<void>;
  
  /** Whether more data is available */
  hasMore: boolean;
  
  /** Whether currently loading more data */
  loading: boolean;
  
  /** Distance from bottom to trigger load more */
  threshold?: number;
}

// Performance configuration
export interface PerformanceConfig {
  /** Whether to enable row recycling */
  enableRowRecycling?: boolean;
  
  /** Debounce time for scroll events in ms */
  scrollDebounce?: number;
  
  /** Whether to use transform for positioning (better performance) */
  useTransform?: boolean;
  
  /** Whether to enable GPU acceleration */
  enableGPUAcceleration?: boolean;
}

export interface DataTableProps<T = any> extends Omit<TableProps<T>, 'data'> {
  /** Table data - can be large datasets */
  data: T[];
  
  /** Virtualization configuration */
  virtualization?: VirtualizationConfig;
  
  /** Infinite scroll configuration */
  infiniteScroll?: InfiniteScrollConfig;
  
  /** Performance optimization configuration */
  performance?: PerformanceConfig;
  
  /** Whether to enable virtual scrolling */
  enableVirtualization?: boolean;
  
  /** Custom row renderer for virtualized rows */
  renderVirtualRow?: (props: {
    row: T;
    index: number;
    style: React.CSSProperties;
    columns: ColumnDef<T>[];
  }) => React.ReactNode;
  
  /** Callback when visible range changes */
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
  
  /** Custom loading indicator for infinite scroll */
  loadMoreIndicator?: React.ReactNode;
  
  /** Custom end reached indicator */
  endReachedIndicator?: React.ReactNode;
}

// Intersection observer hook for infinite scroll
const useInfiniteScroll = (
  hasMore: boolean,
  loading: boolean,
  onLoadMore: () => void | Promise<void>,
  threshold: number = 200
) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasMore || loading) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore, threshold]);
  
  return { loadMoreRef };
};

const DataTable = <T,>({
  data,
  columns,
  virtualization,
  infiniteScroll,
  performance = {},
  enableVirtualization = true,
  renderVirtualRow,
  onVisibleRangeChange,
  loadMoreIndicator = 'Loading more...',
  endReachedIndicator = 'No more data',
  className,
  ...tableProps
}: DataTableProps<T>) => {
  const [scrollDebounceTimer, setScrollDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  
  const {
    scrollDebounce = 16,
    enableRowRecycling = true,
    useTransform = true,
    enableGPUAcceleration = true,
  } = performance;
  
  // Virtual scroll setup using extracted hook (OPTIMIZATION: reusable logic)
  const virtualConfig = virtualization || {
    rowHeight: 48,
    containerHeight: 400,
    overscan: 5,
  };
  
  const {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    containerRef,
    handleScroll,
    getVisibleSlice,
    getContainerStyle,
    getInnerStyle,
    getContentStyle,
  } = useVirtualization({
    itemCount: data.length,
    config: virtualConfig,
    enabled: enableVirtualization,
  });
  
  // Infinite scroll setup
  const { loadMoreRef } = useInfiniteScroll(
    infiniteScroll?.hasMore || false,
    infiniteScroll?.loading || false,
    infiniteScroll?.onLoadMore || (() => {}),
    infiniteScroll?.threshold
  );
  
  // Notify about visible range changes
  useEffect(() => {
    onVisibleRangeChange?.(startIndex, endIndex);
  }, [startIndex, endIndex, onVisibleRangeChange]);
  
  // Get visible data slice using hook helper
  const visibleData = getVisibleSlice(data);
  
  // Render virtualized table
  const renderVirtualizedTable = () => {
    if (!enableVirtualization) {
      return (
        <Table
          {...tableProps}
          data={data}
          columns={columns}
          className={cn(`${l_prx}-table`, className)}
        />
      );
    }
    
    const containerStyle: React.CSSProperties = {
      height: virtualConfig.containerHeight,
      overflow: 'auto',
      position: 'relative',
      ...(enableGPUAcceleration && {
        willChange: 'transform',
        transform: 'translateZ(0)',
      }),
    };
    
    const innerStyle: React.CSSProperties = {
      height: totalHeight,
      position: 'relative',
    };
    
    const contentStyle: React.CSSProperties = {
      position: 'absolute',
      top: offsetY,
      left: 0,
      right: 0,
      ...(useTransform && {
        transform: `translateY(${offsetY}px)`,
        top: 0,
      }),
    };
    
    return (
      <div
        ref={containerRef}
        style={containerStyle}
        onScroll={handleScroll}
        className={`${l_prx}-virtual-container`
      >
        <div style={innerStyle}>
          <div style={contentStyle}>
            {renderVirtualRow ? (
              <div className={`${l_prx}-virtual-rows`}>
                {visibleData.map((row, index) => {
                  const actualIndex = startIndex + index;
                  const rowStyle: React.CSSProperties = {
                    height: virtualConfig.rowHeight,
                    position: 'absolute',
                    top: index * virtualConfig.rowHeight,
                    left: 0,
                    right: 0,
                  };
                  
                  return renderVirtualRow({
                    row,
                    index: actualIndex,
                    style: rowStyle,
                    columns,
                  });
                })}
              </div>
            ) : (
              <Table
                {...tableProps}
                data={visibleData}
                columns={columns}
                className={cn(`${l_prx}-table`, className)}
                getRowKey={(row, index) => `${startIndex + index}`}
              />
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const wrapperClasses = cn(
    l_prx,
    {
      [`${l_prx}--virtualized`]: enableVirtualization,
      [`${l_prx}--infinite-scroll`]: infiniteScroll?.enabled,
    }
  );
  
  return (
    <div className={wrapperClasses}>
      {renderVirtualizedTable()}
      
      {/* Infinite scroll indicators */}
      {infiniteScroll?.enabled && (
        <div className={`${l_prx}-infinite-container`}>
          {infiniteScroll.hasMore ? (
            <div
              ref={loadMoreRef}
              className={`${l_prx}-load-more`
            >
              {infiniteScroll.loading ? loadMoreIndicator : null}
            </div>
          ) : (
            <div className={`${l_prx}-end-reached`}>
              {endReachedIndicator}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// High-performance row component for custom rendering
export const VirtualTableRow = <T,>({
  row,
  columns,
  style,
  onClick,
  className,
}: {
  row: T;
  columns: ColumnDef<T>[];
  style: React.CSSProperties;
  onClick?: (row: T) => void;
  className?: string;
}) => {
  const handleClick = useCallback(() => {
    onClick?.(row);
  }, [onClick, row]);
  
  return (
    <div
      style={style}
      onClick={handleClick}
      className={cn(`${l_prx}-virtual-row`, className)}
    >
      {columns.map((column) => {
        let value: any;
        if (column.accessor) {
          if (typeof column.accessor === 'function') {
            value = column.accessor(row);
          } else {
            value = (row as any)[column.accessor];
          }
        }
        
        return (
          <div
            key={column.id}
            className={`${l_prx}-virtual-cell`
            style={{
              width: column.width,
              minWidth: column.minWidth,
              maxWidth: column.maxWidth,
            }}
          >
            {column.cell ? column.cell({ value, row, column }) : value}
          </div>
        );
      })}
    </div>
  );
};

// Hook for managing large datasets efficiently
export const useDataTableState = <T,>(initialData: T[] = []) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = useCallback(async (loader: () => Promise<T[]>) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newData = await loader();
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...newData]);
      }
    } catch (error) {
      console.error('Failed to load more data:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);
  
  const reset = useCallback((newData: T[] = []) => {
    setData(newData);
    setLoading(false);
    setHasMore(true);
  }, []);
  
  return {
    data,
    loading,
    hasMore,
    loadMore,
    reset,
    setData,
  };
};

DataTable.displayName = 'DataTable';

export { DataTable };