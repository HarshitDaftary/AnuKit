/**
 * Pagination Component - Optimized Composite Version
 * Combines PaginationCore, PaginationControls, and PaginationDisplay
 * Users can import individual components for smaller bundle sizes
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';
import { PaginationCore, type PaginationCoreConfig } from './PaginationCore';
import { PaginationControls } from './PaginationControls';
import { PaginationDisplay } from './PaginationDisplay';

const lib = "anukit";
const l_prx = `${lib}-pagination`;

// Re-export for backward compatibility
export type { PaginationCoreConfig };
export { PaginationCore, PaginationControls, PaginationDisplay };

// Pagination configuration (keeping existing interface for compatibility)
interface PaginationConfig extends PaginationCoreConfig {
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

// Display configuration (keeping existing interface for compatibility)
interface PaginationDisplayConfig {
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  
  /** Available page sizes */
  pageSizeOptions?: number[];
  
  /** Show total count */
  showTotalCount?: boolean;
  
  /** Show current range (e.g., "1-10 of 100") */
  showCurrentRange?: boolean;
  
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  
  /** Maximum number of page buttons to show */
  maxPageButtons?: number;
  
  /** Show jump to page input */
  showJumpToPage?: boolean;
  
  /** Custom labels */
  labels?: {
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    itemsPerPage?: string;
    jumpToPage?: string;
    of?: string;
    showing?: string;
    to?: string;
    results?: string;
  };
}

interface PaginationProps extends PaginationConfig, PaginationDisplayConfig {
  /** Additional CSS class */
  className?: string;
  
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disable pagination */
  disabled?: boolean;
  
  /** Compact mode (minimal UI) */
  compact?: boolean;
  
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
}

// Hook for full pagination functionality (keeping existing interface)
export const usePagination = (config: PaginationConfig) => {
  const { currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange } = config;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (onItemsPerPageChange && newItemsPerPage !== itemsPerPage) {
      onItemsPerPageChange(newItemsPerPage);
      // Reset to first page when changing page size
      if (currentPage !== 1) {
        onPageChange(1);
      }
    }
  };
  
  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(totalPages);
  const goToPreviousPage = () => handlePageChange(currentPage - 1);
  const goToNextPage = () => handlePageChange(currentPage + 1);
  
  const currentRangeStart = (currentPage - 1) * itemsPerPage + 1;
  const currentRangeEnd = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    currentRangeStart,
    currentRangeEnd,
    handlePageChange,
    handleItemsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    canGoToPrevious: currentPage > 1,
    canGoToNext: currentPage < totalPages,
  };
};

const Pagination = /* @__PURE__ */ forwardRef<HTMLDivElement, PaginationProps>(({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showPageSizeSelector = true,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showTotalCount = true,
  showCurrentRange = true,
  showFirstLast = true,
  showPrevNext = true,
  maxPageButtons = 7,
  showJumpToPage = false,
  labels = {},
  className,
  size = 'md',
  disabled = false,
  compact = false,
  layout = 'horizontal',
}, ref) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // In compact mode, only show core pagination
  if (compact) {
    return (
      <PaginationCore
        ref={ref}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        className={className}
        size={size}
        disabled={disabled}
        showPrevNext={showPrevNext}
        maxPageButtons={maxPageButtons}
        labels={{
          previous: labels.previous,
          next: labels.next,
        }}
      />
    );
  }
  
  const containerClasses = cn(
    l_prx,
    `${l_prx}--${size}`,
    `${l_prx}--${layout}`,
    layout === 'horizontal' ? 'flex items-center justify-between space-x-4' : 'space-y-4',
    disabled && `${l_prx}--disabled`,
    className
  );
  
  const hasControls = showPageSizeSelector || showFirstLast || showJumpToPage;
  const hasDisplay = showTotalCount || showCurrentRange;
  
  return (
    <div ref={ref} className={containerClasses}>
      {/* Display information */}
      {hasDisplay && (
        <PaginationDisplay
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          showTotalCount={showTotalCount}
          showCurrentRange={showCurrentRange}
          size={size}
          labels={{
            of: labels.of,
            showing: labels.showing,
            to: labels.to,
            results: labels.results,
          }}
        />
      )}
      
      {/* Core pagination */}
      <PaginationCore
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        size={size}
        disabled={disabled}
        showPrevNext={showPrevNext}
        maxPageButtons={maxPageButtons}
        labels={{
          previous: labels.previous,
          next: labels.next,
        }}
      />
      
      {/* Advanced controls */}
      {hasControls && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          showPageSizeSelector={showPageSizeSelector}
          pageSizeOptions={pageSizeOptions}
          showFirstLast={showFirstLast}
          showJumpToPage={showJumpToPage}
          size={size}
          disabled={disabled}
          labels={{
            first: labels.first,
            last: labels.last,
            itemsPerPage: labels.itemsPerPage,
            jumpToPage: labels.jumpToPage,
          }}
        />
      )}
    </div>
  );
});

Pagination.displayName = 'Pagination';

export { Pagination };