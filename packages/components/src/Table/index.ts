/**
 * Table Component Index
 * Exports optimized hooks for developers who want to build custom table components
 */

// Main component (backwards compatible)
export { Table } from './Table';
export type { TableProps, ColumnDef, SortConfig, SelectionConfig } from './Table';

// Hooks for advanced users (NEW - enables custom table building)
export { useTableSorting } from './hooks/useTableSorting';
export { useTableSelection } from './hooks/useTableSelection';

// Types for hook users
export type { 
  UseTableSortingProps, 
  UseTableSortingReturn 
} from './hooks/useTableSorting';

export type { 
  UseTableSelectionProps, 
  UseTableSelectionReturn 
} from './hooks/useTableSelection';