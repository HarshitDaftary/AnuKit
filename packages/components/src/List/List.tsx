/**
 * List Component - Optimized Composite Version
 * Combines ListCore, ListItem, ListInteractive, and NestedList components
 * Users can import individual components for smaller bundle sizes
 * 
 * This file provides backward compatibility while enabling tree-shaking
 * Import from individual modules for optimal bundle size
 */

import React, { forwardRef } from 'react';
import { ListCore, type ListCoreProps } from './ListCore';
import { ListItem, ListItemIcon, ListItemText, type ListItemProps } from './ListItem';
import { ListItemButton, ListSubheader, type ListItemButtonProps } from './ListInteractive';
import { NestedList, useNestedList, type NestedListProps } from './NestedList';

// Re-export individual components for tree-shaking
export { ListCore, ListItem, ListItemIcon, ListItemText, ListItemButton, ListSubheader, NestedList, useNestedList };
export type { ListCoreProps, ListItemProps, ListItemButtonProps, NestedListProps };

// Extended list props for backward compatibility
interface ListProps extends ListCoreProps {
  /** Subheader content */
  subheader?: React.ReactNode;
}

// Composite List component for convenience (backward compatibility)
const List = /* @__PURE__ */ forwardRef<HTMLElement, ListProps>(({
  children,
  subheader,
  variant = 'plain',
  dense = false,
  className,
  as = 'ul',
  interactive = false,
  ...props
}, ref) => {
  return (
    <ListCore
      ref={ref}
      variant={variant}
      dense={dense}
      className={className}
      as={as}
      interactive={interactive}
      {...props}
    >
      {subheader && <ListSubheader>{subheader}</ListSubheader>}
      {children}
    </ListCore>
  );
});

List.displayName = 'List';
ListItem.displayName = 'ListItem';
ListItemButton.displayName = 'ListItemButton';
ListItemIcon.displayName = 'ListItemIcon';
ListItemText.displayName = 'ListItemText';
ListSubheader.displayName = 'ListSubheader';
NestedList.displayName = 'NestedList';

export { List, type ListProps };