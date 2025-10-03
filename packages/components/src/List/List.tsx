/**
 * List Components
 * Display structured lists with icons, text, and interactive states
 */

import React, { forwardRef } from 'react';
import { cn } from '@optimui/utils';

const lib = "optimui";

const l_prx = `${lib}-list`;

// List item configuration
export interface ListItemProps {
  /** List item content */
  children?: React.ReactNode;
  
  /** Leading icon */
  icon?: React.ReactNode;
  
  /** Primary text */
  primary?: React.ReactNode;
  
  /** Secondary text */
  secondary?: React.ReactNode;
  
  /** Trailing element (icon, button, etc.) */
  trailing?: React.ReactNode;
  
  /** Whether item is disabled */
  disabled?: boolean;
  
  /** Whether item is selected */
  selected?: boolean;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Additional CSS class */
  className?: string;
  
  /** Divider after this item */
  divider?: boolean;
  
  /** Dense mode (smaller padding) */
  dense?: boolean;
  
  /** Indent level for nested items */
  indent?: number;
}

// List configuration
export interface ListProps {
  /** List items */
  children?: React.ReactNode;
  
  /** List variant */
  variant?: 'plain' | 'bordered' | 'divided';
  
  /** Dense mode (smaller padding) */
  dense?: boolean;
  
  /** Additional CSS class */
  className?: string;
  
  /** Custom element type */
  as?: keyof JSX.IntrinsicElements;
  
  /** Subheader content */
  subheader?: React.ReactNode;
  
  /** Whether list is interactive (adds hover states) */
  interactive?: boolean;
}

// List item icon
export const ListItemIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(`${l_prx}-item-icon`, className)}>
    {children}
  </div>
);

// List item text
export const ListItemText: React.FC<{
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
}> = ({ primary, secondary, className }) => (
  <div className={cn(`${l_prx}-item-text`, className)}>
    {primary && (
      <div className={`${l_prx}-item-primary`}>
        {primary}
      </div>
    )}
    {secondary && (
      <div className={`${l_prx}-item-secondary`}>
        {secondary}
      </div>
    )}
  </div>
);

// List item button
export const ListItemButton = forwardRef<HTMLButtonElement, ListItemProps>(
  ({
    children,
    icon,
    primary,
    secondary,
    trailing,
    disabled = false,
    selected = false,
    onClick,
    className,
    divider = false,
    dense = false,
    indent = 0,
    ...props
  }, ref) => {
    const classes = cn(
      `${l_prx}-item`,
      `${l_prx}-item-button`,
      {
        [`${l_prx}-item--disabled`]: disabled,
        [`${l_prx}-item--selected`]: selected,
        [`${l_prx}-item--divider`]: divider,
        [`${l_prx}-item--dense`]: dense,
      },
      className
    );
    
    const style = {
      paddingLeft: indent ? `${24 + indent * 16}px` : undefined,
    };
    
    return (
      <button
        ref={ref}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        style={style}
        {...props}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        
        {(primary || secondary) ? (
          <ListItemText primary={primary} secondary={secondary} />
        ) : (
          <div className={`${l_prx}-item-content`}>
            {children}
          </div>
        )}
        
        {trailing && (
          <div className={`${l_prx}-item-trailing`}>
            {trailing}
          </div>
        )}
      </button>
    );
  }
);

// List item
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({
    children,
    icon,
    primary,
    secondary,
    trailing,
    disabled = false,
    selected = false,
    onClick,
    className,
    divider = false,
    dense = false,
    indent = 0,
    ...props
  }, ref) => {
    const classes = cn(
      `${l_prx}-item`,
      {
        [`${l_prx}-item--clickable`]: onClick,
        [`${l_prx}-item--disabled`]: disabled,
        [`${l_prx}-item--selected`]: selected,
        [`${l_prx}-item--divider`]: divider,
        [`${l_prx}-item--dense`]: dense,
      },
      className
    );
    
    const style = {
      paddingLeft: indent ? `${16 + indent * 16}px` : undefined,
    };
    
    const content = (
      <>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        
        {(primary || secondary) ? (
          <ListItemText primary={primary} secondary={secondary} />
        ) : (
          <div className={`${l_prx}-item-content`}>
            {children}
          </div>
        )}
        
        {trailing && (
          <div className={`${l_prx}-item-trailing`}>
            {trailing}
          </div>
        )}
      </>
    );
    
    if (onClick) {
      return (
        <li ref={ref} className={classes} style={style} {...props}>
          <button
            className={`${l_prx}-item-button-wrapper`
            onClick={onClick}
            disabled={disabled}
          >
            {content}
          </button>
        </li>
      );
    }
    
    return (
      <li ref={ref} className={classes} style={style} {...props}>
        {content}
      </li>
    );
  }
);

// List subheader
export const ListSubheader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(`${l_prx}-subheader`, className)}>
    {children}
  </div>
);

// Main list component
export const List = forwardRef<HTMLElement, ListProps>(
  ({
    children,
    variant = 'plain',
    dense = false,
    className,
    as: Component = 'ul',
    subheader,
    interactive = false,
    ...props
  }, ref) => {
    const classes = cn(
      l_prx,
      `optimui-list-${variant}`,
      {
        [`${l_prx}-subheader--dense`]: dense,
        [`${l_prx}-subheader--interactive`]: interactive,
      },
      className
    );
    
    return (
      <Component ref={ref} className={classes} {...props}>
        {subheader && <ListSubheader>{subheader}</ListSubheader>}
        {children}
      </Component>
    );
  }
);

// Nested list (for collapsible lists)
export interface NestedListProps extends Omit<ListItemProps, 'children'> {
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
              className={`${lib}-nested-list-toggle`
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
        onClick={handleToggle}
      />
      
      {expanded && (
        <div className={`${lib}-nested-list-content`}>
          <List dense={dense}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.props) {
                return React.cloneElement(child, {
                  ...child.props,
                  indent: (child.props.indent || 0) + 1,
                });
              }
              return child;
            })}
          </List>
        </div>
      )}
    </div>
  );
};

// Hook for managing nested list state
export const useNestedList = (initialExpanded: boolean = false) => {
  const [expanded, setExpanded] = React.useState(initialExpanded);
  
  const toggle = React.useCallback(() => {
    setExpanded(prev => !prev);
  }, []);
  
  const expand = React.useCallback(() => {
    setExpanded(true);
  }, []);
  
  const collapse = React.useCallback(() => {
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

ListItem.displayName = 'ListItem';
ListItemButton.displayName = 'ListItemButton';
ListItemIcon.displayName = 'ListItemIcon';
ListItemText.displayName = 'ListItemText';
ListSubheader.displayName = 'ListSubheader';
List.displayName = 'List';
NestedList.displayName = 'NestedList';

export { List };
export type { ListProps, ListItemProps, NestedListProps };