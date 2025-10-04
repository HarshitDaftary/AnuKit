/**
 * PaginationControls Component
 * Advanced pagination controls: page size selector, jump to page, first/last buttons
 * Can be used separately or combined with PaginationCore
 */

import React, { forwardRef, useState } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-pagination-controls`;

export interface PaginationControlsProps {
  /** Current page */
  currentPage: number;
  
  /** Total pages */
  totalPages: number;
  
  /** Current items per page */
  itemsPerPage: number;
  
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  
  /** Available page sizes */
  pageSizeOptions?: number[];
  
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  
  /** Show jump to page input */
  showJumpToPage?: boolean;
  
  /** Additional CSS class */
  className?: string;
  
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disable controls */
  disabled?: boolean;
  
  /** Custom labels */
  labels?: {
    first?: string;
    last?: string;
    itemsPerPage?: string;
    jumpToPage?: string;
  };
}

const PaginationControls = /* @__PURE__ */ forwardRef<HTMLDivElement, PaginationControlsProps>(({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showPageSizeSelector = true,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showFirstLast = true,
  showJumpToPage = false,
  className,
  size = 'md',
  disabled = false,
  labels = {},
}, ref) => {
  const {
    first = '«',
    last = '»',
    itemsPerPage: itemsPerPageLabel = 'Items per page:',
    jumpToPage = 'Go to page:',
  } = labels;
  
  const [jumpPage, setJumpPage] = useState('');
  
  const handleJumpToPage = () => {
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };
  
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
    'disabled:opacity-50 disabled:cursor-not-allowed',
    getSizeClasses(size)
  );
  
  const selectClasses = cn(
    `${l_prx}-select`,
    'px-2 py-1 border border-gray-300 rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    getSizeClasses(size)
  );
  
  const inputClasses = cn(
    `${l_prx}-input`,
    'w-16 px-2 py-1 border border-gray-300 rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    getSizeClasses(size)
  );
  
  const containerClasses = cn(
    l_prx,
    `${l_prx}--${size}`,
    'flex items-center space-x-4',
    disabled && `${l_prx}--disabled`,
    className
  );
  
  return (
    <div ref={ref} className={containerClasses}>
      {/* First/Last buttons */}
      {showFirstLast && (
        <div className="flex items-center space-x-1">
          <button
            className={buttonClasses}
            onClick={() => onPageChange(1)}
            disabled={disabled || currentPage === 1}
            aria-label="First page"
          >
            {first}
          </button>
          <button
            className={buttonClasses}
            onClick={() => onPageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            aria-label="Last page"
          >
            {last}
          </button>
        </div>
      )}
      
      {/* Page size selector */}
      {showPageSizeSelector && onItemsPerPageChange && (
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">{itemsPerPageLabel}</label>
          <select
            className={selectClasses}
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value, 10))}
            disabled={disabled}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Jump to page */}
      {showJumpToPage && (
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">{jumpToPage}</label>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyPress={handleKeyPress}
            className={inputClasses}
            disabled={disabled}
          />
          <button
            className={buttonClasses}
            onClick={handleJumpToPage}
            disabled={disabled || !jumpPage}
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
});

PaginationControls.displayName = 'PaginationControls';

export { PaginationControls };