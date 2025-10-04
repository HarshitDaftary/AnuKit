import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-menu`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
  divider?: boolean;
  shortcut?: string;
}

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Menu items */
  items: MenuItem[];
  
  /** Trigger element */
  trigger?: React.ReactNode;
  
  /** Whether menu is open (controlled) */
  open?: boolean;
  
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  
  /** Callback when menu open state changes */
  onOpenChange?: (open: boolean) => void;
  
  /** Menu size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Placement of the menu */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';
  
  /** Whether to close menu on item click */
  closeOnItemClick?: boolean;
  
  /** Whether menu should be modal */
  modal?: boolean;
}

// Size-based CSS classes
const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return `${l_prx}-sm`;
    case 'lg':
      return `${l_prx}-lg`;
    default:
      return `${l_prx}-md`;
  }
};

// Placement-based CSS classes
const getPlacementClasses = (placement: string) => {
  return `anukit-menu-${placement}`;
};

const Menu = forwardRef<HTMLDivElement, MenuProps>(({
  items,
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  size = 'md',
  placement = 'bottom-start',
  closeOnItemClick = true,
  modal = false,
  className = '',
  ...props
}, ref) => {
  // State management
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  
  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  
  // Get all non-disabled, non-divider items for keyboard navigation
  const getNavigableItems = (menuItems: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = [];
    
    const traverse = (items: MenuItem[]) => {
      items.forEach(item => {
        if (!item.divider && !item.disabled) {
          result.push(item);
        }
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    
    traverse(menuItems);
    return result;
  };
  
  const navigableItems = getNavigableItems(items);
  
  // Handle open state change
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    
    if (!newOpen) {
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    }
  };
  
  // Handle item click
  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    
    item.onClick?.();
    
    if (closeOnItemClick && !item.children) {
      handleOpenChange(false);
    }
  };
  
  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        handleOpenChange(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < navigableItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : navigableItems.length - 1
        );
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(navigableItems.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < navigableItems.length) {
          handleItemClick(navigableItems[focusedIndex]);
        }
        break;
    }
  };
  
  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && focusedIndex < navigableItems.length) {
      const item = navigableItems[focusedIndex];
      const element = itemRefs.current.get(item.id);
      element?.focus();
    }
  }, [focusedIndex, isOpen, navigableItems]);
  
  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        triggerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Render menu item
  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isFocused = navigableItems[focusedIndex]?.id === item.id;
    
    if (item.divider) {
      return (
        <div 
          key={`divider-${item.id}`} 
          className={`${l_prx}-divider`}
          role="separator"
        />
      );
    }
    
    const ItemComponent = item.href ? 'a' : 'button';
    
    return (
      <ItemComponent
        key={item.id}
        ref={(el: HTMLElement | null) => {
          if (el) {
            itemRefs.current.set(item.id, el);
          } else {
            itemRefs.current.delete(item.id);
          }
        }}
        className={cn(
          `${l_prx}-item`,
          item.disabled && `${l_prx}-item-disabled`,
          isFocused && `${l_prx}-item-focused`,
          level > 0 && `${l_prx}-item-nested`
        )}
        role="menuitem"
        tabIndex={-1}
        disabled={item.disabled}
        href={item.href}
        onClick={() => handleItemClick(item)}
        aria-disabled={item.disabled}
      >
        {item.icon && (
          <span className={`${l_prx}-item-icon`}>
            {item.icon}
          </span>
        )}
        
        <span className={`${l_prx}-item-label`}>
          {item.label}
        </span>
        
        {item.shortcut && (
          <span className={`${l_prx}-item-shortcut`}>
            {item.shortcut}
          </span>
        )}
        
        {item.children && (
          <span className={`${l_prx}-item-arrow`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d="M4.5 3L7.5 6L4.5 9" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </ItemComponent>
    );
  };
  
  // Build CSS classes
  const menuClasses = cn(
    l_prx,
    getSizeClasses(size),
    getPlacementClasses(placement),
    isOpen && `${l_prx}-open`,
    modal && `${l_prx}-modal`,
    className
  );

  return (
    <div ref={ref} className={`${l_prx}-container`} {...props}>
      {/* Trigger */}
      {trigger && (
        <button
          ref={triggerRef}
          className={`${l_prx}-trigger`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => handleOpenChange(!isOpen)}
        >
          {trigger}
        </button>
      )}
      
      {/* Menu Portal/Overlay */}
      {isOpen && (
        <>
          {modal && (
            <div 
              className={`${l_prx}-overlay`}
              onClick={() => handleOpenChange(false)}
            />
          )}
          
          <div
            ref={menuRef}
            className={menuClasses}
            role="menu"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {items.map(item => renderMenuItem(item))}
          </div>
        </>
      )}
    </div>
  );
});

Menu.displayName = 'Menu';

export { Menu };