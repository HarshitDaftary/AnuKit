/**
 * Pagination Component
 * Comprehensive pagination with page navigation, items per page, and customization
 */

import React, { forwardRef, useMemo, useCallback } from 'react';
import { cn } from '@optimui/utils';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";

const l_prx = `${lib}-pagination`;

// Pagination configuration
interface PaginationConfig {
  /** Current page (1-based) */
  currentPage: number;
  
  /** Total number of items */
  totalItems: number;
  
  /** Items per page *    </div>
  );
});

Pagination.displayName = 'Pagination';temsPerPage: number;
  
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

// Display configuration
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
  
  /** Custom page button renderer */
  renderPageButton?: (props: {
    page: number;
    isActive: boolean;
    onClick: () => void;
    disabled: boolean;
  }) => React.ReactNode;
  
  /** Custom navigation button renderer */
  renderNavButton?: (props: {
    type: 'first' | 'previous' | 'next' | 'last';
    onClick: () => void;
    disabled: boolean;
    label: string;
  }) => React.ReactNode;
}

// Calculate page numbers to display
const calculatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxButtons: number
): number[] => {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxButtons - 1);
  
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Hook for pagination state management
export const usePagination = (
  totalItems: number,
  initialItemsPerPage: number = 10,
  initialPage: number = 1
) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);
  
  const goToFirstPage = useCallback(() => handlePageChange(1), [handlePageChange]);
  const goToLastPage = useCallback(() => handlePageChange(totalPages), [handlePageChange, totalPages]);
  const goToPreviousPage = useCallback(() => handlePageChange(currentPage - 1), [handlePageChange, currentPage]);
  const goToNextPage = useCallback(() => handlePageChange(currentPage + 1), [handlePageChange, currentPage]);
  
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

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(({
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
  renderPageButton,
  renderNavButton,
}, ref) => {
  const {
    previous = '‹',
    next = '›',
    first = '«',
    last = '»',
    itemsPerPage: itemsPerPageLabel = 'Items per page:',
    jumpToPage = 'Go to page:',
    of = 'of',
    showing = 'Showing',
    to = 'to',
    results = 'results',
  } = labels;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = useMemo(
    () => calculatePageNumbers(currentPage, totalPages, maxPageButtons),
    [currentPage, totalPages, maxPageButtons]
  );
  
  const currentRangeStart = (currentPage - 1) * itemsPerPage + 1;
  const currentRangeEnd = Math.min(currentPage * itemsPerPage, totalItems);
  
  const canGoToPrevious = currentPage > 1;
  const canGoToNext = currentPage < totalPages;
  
  const handlePageClick = useCallback((page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [disabled, currentPage, totalPages, onPageChange]);
  
  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    onItemsPerPageChange?.(newItemsPerPage);
  }, [onItemsPerPageChange]);
  
  const [jumpToPageValue, setJumpToPageValue] = React.useState('');
  
  const handleJumpToPage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpToPageValue, 10);
    if (!isNaN(page)) {
      handlePageClick(page);
      setJumpToPageValue('');
    }
  }, [jumpToPageValue, handlePageClick]);
  
  // Render page button
  const renderPageBtn = (page: number, isActive: boolean) => {
    if (renderPageButton) {
      return renderPageButton({
        page,
        isActive,
        onClick: () => handlePageClick(page),
        disabled: disabled || isActive,
      });
    }
    
    return (
      <button
        key={page}
        onClick={() => handlePageClick(page)}
        disabled={disabled || isActive}
        className={cn(
          `${l_prx}-page`,
          `${l_prx}-page-${size}`,
          {
            [`${l_prx}-page--active`]: isActive,
            [`${l_prx}-page--disabled`]: disabled,
          }
        )}
        aria-label={`Go to page ${page}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };
  
  // Render navigation button
  const renderNavBtn = (
    type: 'first' | 'previous' | 'next' | 'last',
    onClick: () => void,
    isDisabled: boolean,
    label: string
  ) => {
    if (renderNavBtn) {
      return renderNavBtn({
        type,
        onClick,
        disabled: disabled || isDisabled,
        label,
      });
    }
    
    return (
      <button
        onClick={onClick}
        disabled={disabled || isDisabled}
        className={cn(
          `${l_prx}-nav`,
          `${l_prx}-nav-${size}`,
          `${l_prx}-nav-${type}`,
          {
            [`${l_prx}-nav--disabled`]: disabled || isDisabled,
          }
        )}
        aria-label={`${type.charAt(0).toUpperCase() + type.slice(1)} page`}
      >
        {label}
      </button>
    );
  };
  
  if (totalItems === 0) {
    return null;
  }
  
  const wrapperClasses = cn(
    l_prx,
    `${l_prx}-${size}`,
    compact && `${l_prx}--compact`,
    disabled && `${l_prx}--disabled`,
    className
  );
  
  return (
    <nav ref={ref} className={wrapperClasses} role="navigation" aria-label="Pagination">
      <div className={`${l_prx}-container`}>
        {/* Page size selector */}
        {showPageSizeSelector && onItemsPerPageChange && !compact && (
          <div className={`${l_prx}-page-size`}>
            <label className={`${l_prx}-page-size-label`}>
              {itemsPerPageLabel}
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                disabled={disabled}
                className={`${l_prx}-page-size-select`}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        
        {/* Current range and total count */}
        {(showCurrentRange || showTotalCount) && !compact && (
          <div className={`${l_prx}-info`}>
            {showCurrentRange && (
              <span className={`${l_prx}-range`}>
                {showing} {currentRangeStart} {to} {currentRangeEnd} {of} {totalItems} {results}
              </span>
            )}
            {showTotalCount && !showCurrentRange && (
              <span className={`${l_prx}-total`}>
                {totalItems} {results}
              </span>
            )}
          </div>
        )}
        
        {/* Page navigation */}
        <div className={`${l_prx}-nav-container`}>
          {/* First page */}
          {showFirstLast && !compact && (
            renderNavBtn('first', () => handlePageClick(1), !canGoToPrevious, first)
          )}
          
          {/* Previous page */}
          {showPrevNext && (
            renderNavBtn('previous', () => handlePageClick(currentPage - 1), !canGoToPrevious, previous)
          )}
          
          {/* Page numbers */}
          <div className={`${l_prx}-pages`}>
            {pageNumbers.map((page) => renderPageBtn(page, page === currentPage))}
          </div>
          
          {/* Next page */}
          {showPrevNext && (
            renderNavBtn('next', () => handlePageClick(currentPage + 1), !canGoToNext, next)
          )}
          
          {/* Last page */}
          {showFirstLast && !compact && (
            renderNavBtn('last', () => handlePageClick(totalPages), !canGoToNext, last)
          )}
        </div>
        
        {/* Jump to page */}
        {showJumpToPage && !compact && (
          <form onSubmit={handleJumpToPage} className={`${l_prx}-jump`}>
            <label className={`${l_prx}-jump-label`}>
              {jumpToPage}
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPageValue}
                onChange={(e) => setJumpToPageValue(e.target.value)}
                disabled={disabled}
                className={`${l_prx}-jump-input`}
                placeholder="1"
              />
            </label>
            <button
              type="submit"
              disabled={disabled || !jumpToPageValue}
              className={`${l_prx}-jump-button`}
            >
              Go
            </button>
          </form>
        )}
      </div>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export { Pagination, usePagination };
export type { PaginationProps, PaginationConfig, PaginationDisplayConfig };