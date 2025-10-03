/**
 * DataTable Component Index
 * Exports optimized hooks for developers who want to build custom virtualized components
 */

// Main component (backwards compatible)
export { DataTable, VirtualTableRow, useDataTableState } from './DataTable';
export type {
  DataTableProps,
  VirtualizationConfig,
  InfiniteScrollConfig,
  PerformanceConfig,
} from './DataTable';

// Hook for advanced users (NEW - enables custom virtualization)
export { useVirtualization } from './hooks/useVirtualization';
export type { 
  UseVirtualizationProps, 
  UseVirtualizationReturn 
} from './hooks/useVirtualization';