/**
 * NestedList Component
 * Advanced nested list functionality with collapsible sections
 * Separated to reduce bundle size when nested lists aren't needed
 */

import React, { useCallback, useState } from 'react';
import { cn } from '@anukit/utils';
import { ListItem, type ListItemProps } from './ListItem';
import { ListCore } from './ListCore';

const lib = "anukit";

// Nested list configuration
interface NestedListProps extends Omit<ListItemProps, 'children'> {
  /** Primary content */
  primary: React.ReactNode;
  
  /** Nested list items */
  children: React.ReactNode;
  
  /** Whether nested list is expanded */
  expanded?: boolean;
  
  /** Toggle handler */
  onToggle?: () => void;
  
  /** Custom expand icon */
  expandIcon?: React.ReactNode;
  
  /** Custom collapse icon */
  collapseIcon?: React.ReactNode;
}

export const NestedList: React.FC<NestedListProps> = ({
  primary,
  children,
  expanded = false,
  onToggle,
  expandIcon = '▶',
  collapseIcon = '▼',
  icon,
  trailing,
  disabled = false,
  selected = false,
  className,
  divider = false,
  dense = false,
  indent = 0,
}) => {
  const handleToggle = () => {
    if (!disabled && onToggle) {
      onToggle();
    }
  };
  
  return (
    <div className={cn(`${lib}-nested-list`, className)}>
      <ListItem
        primary={primary}
        icon={icon}
        trailing={
          <div className={`${lib}-nested-list-controls`}>
            {trailing}
            <button
              className={`${lib}-nested-list-toggle`}
              onClick={handleToggle}
              disabled={disabled}
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? collapseIcon : expandIcon}
            </button>
          </div>
        }
        disabled={disabled}
        selected={selected}
        divider={divider}
        dense={dense}
        indent={indent}
      />
      
      {expanded && (
        <div className={`${lib}-nested-list-content`}>
          <ListCore dense={dense}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.props) {
                return React.cloneElement(child, {
                  ...child.props,
                  indent: (child.props.indent || 0) + 1,
                });
              }
              return child;
            })}
          </ListCore>
        </div>
      )}
    </div>
  );
};

// Hook for managing nested list state
export const useNestedList = (initialExpanded: boolean = false) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  
  const toggle = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);
  
  const expand = useCallback(() => {
    setExpanded(true);
  }, []);
  
  const collapse = useCallback(() => {
    setExpanded(false);
  }, []);
  
  return {
    expanded,
    toggle,
    expand,
    collapse,
    setExpanded,
  };
};

NestedList.displayName = 'NestedList';

export type { NestedListProps };