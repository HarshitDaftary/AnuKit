/**
 * PaginationCore Component
 * Core pagination functionality with basic page navigation
 * Optimized for minimal bundle size when advanced features aren't needed
 */

import React, { forwardRef } from 'react';
import { CSS_UTILITIES, cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-pagination`;

// Core pagination configuration
export interface PaginationCoreConfig {
  /** Current page (1-based) */
  currentPage: number;
  
  /** Total number of items */
  totalItems: number;
  
  /** Items per page */
  itemsPerPage: number;
  
  /** Callback when page changes */
  onPageChange: (page: number) => void;
}

// Core display options
export interface PaginationCoreProps extends PaginationCoreConfig {
  /** Additional CSS class */
  className?: string;
  
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disable pagination */
  disabled?: boolean;
  
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  
  /** Maximum number of page buttons to show */
  maxPageButtons?: number;
  
  /** Custom labels */
  labels?: {
    previous?: string;
    next?: string;
  };
}

// Core pagination hook
export const usePaginationCore = (config: PaginationCoreConfig) => {
  const { currentPage, totalItems, itemsPerPage, onPageChange } = config;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  const goToPreviousPage = () => handlePageChange(currentPage - 1);
  const goToNextPage = () => handlePageChange(currentPage + 1);
  
  return {
    currentPage,
    totalPages,
    handlePageChange,
    goToPreviousPage,
    goToNextPage,
    canGoToPrevious: currentPage > 1,
    canGoToNext: currentPage < totalPages,
  };
};

// Get visible page numbers
const getVisiblePages = (currentPage: number, totalPages: number, maxButtons: number): number[] => {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxButtons - 1);
  
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const PaginationCore = /* @__PURE__ */ forwardRef<HTMLDivElement, PaginationCoreProps>(({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  size = 'md',
  disabled = false,
  showPrevNext = true,
  maxPageButtons = 7,
  labels = {},
}, ref) => {
  const {
    previous = '‹',
    next = '›',
  } = labels;
  
  const pagination = usePaginationCore({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
  });
  
  const visiblePages = getVisiblePages(currentPage, pagination.totalPages, maxPageButtons);
  
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };
  
  const buttonClasses = cn(
    `${l_prx}-button`,
    'px-3 py-1 border border-gray-300 text-gray-700',
    'hover:bg-gray-50 focus:outline-none focus:ring-2',
    'focus:ring-blue-500 focus:border-blue-500',
    CSS_UTILITIES.DISABLED,
    getSizeClasses(size)
  );
  
  const activeButtonClasses = cn(
    buttonClasses,
    'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
  );
  
  const containerClasses = cn(
    l_prx,
    `${l_prx}--${size}`,
    CSS_UTILITIES.FLEX_ITEMS_CENTER,
    CSS_UTILITIES.SPACE_X_1,
    disabled && `${l_prx}--disabled`,
    className
  );
  
  if (pagination.totalPages <= 1) {
    return null;
  }
  
  return (
    <div ref={ref} className={containerClasses} role="navigation" aria-label="Pagination">
      {/* Previous button */}
      {showPrevNext && (
        <button
          className={buttonClasses}
          onClick={pagination.goToPreviousPage}
          disabled={disabled || !pagination.canGoToPrevious}
          aria-label="Previous page"
        >
          {previous}
        </button>
      )}
      
      {/* Page buttons */}
      {visiblePages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? activeButtonClasses : buttonClasses}
          onClick={() => pagination.handlePageChange(page)}
          disabled={disabled}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      
      {/* Next button */}
      {showPrevNext && (
        <button
          className={buttonClasses}
          onClick={pagination.goToNextPage}
          disabled={disabled || !pagination.canGoToNext}
          aria-label="Next page"
        >
          {next}
        </button>
      )}
    </div>
  );
});

PaginationCore.displayName = 'PaginationCore';

export { PaginationCore };