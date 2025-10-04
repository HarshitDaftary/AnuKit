/**
 * Pagination Module Exports
 * Provides both individual components for optimal tree-shaking
 * and the composite component for convenience
 */

// Individual components for optimal bundle size
export { PaginationCore, usePaginationCore, type PaginationCoreConfig, type PaginationCoreProps } from './PaginationCore';
export { PaginationControls, type PaginationControlsProps } from './PaginationControls';
export { PaginationDisplay, type PaginationDisplayProps } from './PaginationDisplay';

// Composite component for convenience (backward compatibility)
export { Pagination, usePagination } from './PaginationOptimized';

// Re-export types for compatibility
export type { PaginationCoreConfig as PaginationConfig } from './PaginationCore';