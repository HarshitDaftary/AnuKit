/**
 * PaginationDisplay Component
 * Display components for pagination: total count, current range, status text
 * Lightweight component for showing pagination information
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-pagination-display`;

export interface PaginationDisplayProps {
  /** Current page */
  currentPage: number;
  
  /** Total number of items */
  totalItems: number;
  
  /** Items per page */
  itemsPerPage: number;
  
  /** Show total count */
  showTotalCount?: boolean;
  
  /** Show current range (e.g., "1-10 of 100") */
  showCurrentRange?: boolean;
  
  /** Additional CSS class */
  className?: string;
  
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Custom labels */
  labels?: {
    of?: string;
    showing?: string;
    to?: string;
    results?: string;
  };
}

const PaginationDisplay = /* @__PURE__ */ forwardRef<HTMLDivElement, PaginationDisplayProps>(({
  currentPage,
  totalItems,
  itemsPerPage,
  showTotalCount = true,
  showCurrentRange = true,
  className,
  size = 'md',
  labels = {},
}, ref) => {
  const {
    of = 'of',
    showing = 'Showing',
    to = 'to',
    results = 'results',
  } = labels;
  
  const currentRangeStart = (currentPage - 1) * itemsPerPage + 1;
  const currentRangeEnd = Math.min(currentPage * itemsPerPage, totalItems);
  
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
  
  const containerClasses = cn(
    l_prx,
    `${l_prx}--${size}`,
    'flex items-center space-x-4 text-gray-600',
    getSizeClasses(size),
    className
  );
  
  if (totalItems === 0) {
    return (
      <div ref={ref} className={containerClasses}>
        <span>No {results}</span>
      </div>
    );
  }
  
  return (
    <div ref={ref} className={containerClasses}>
      {/* Current range */}
      {showCurrentRange && (
        <span className={`${l_prx}-range`}>
          {showing} {currentRangeStart} {to} {currentRangeEnd} {of} {totalItems} {results}
        </span>
      )}
      
      {/* Total count only */}
      {showTotalCount && !showCurrentRange && (
        <span className={`${l_prx}-total`}>
          {totalItems} {results}
        </span>
      )}
    </div>
  );
});

PaginationDisplay.displayName = 'PaginationDisplay';

export { PaginationDisplay };