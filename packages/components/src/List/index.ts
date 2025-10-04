/**
 * List Module Exports
 * Provides both individual components for optimal tree-shaking
 * and the composite component for convenience
 */

// Individual components for optimal bundle size
export { ListCore, type ListCoreProps } from './ListCore';
export { ListItem, ListItemIcon, ListItemText, type ListItemProps } from './ListItem';
export { ListItemButton, ListSubheader, type ListItemButtonProps } from './ListInteractive';
export { NestedList, useNestedList, type NestedListProps } from './NestedList';

// Composite component for convenience (backward compatibility)
export { List, type ListProps } from './List';