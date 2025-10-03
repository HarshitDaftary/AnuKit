/**
 * useVirtualization Hook
 * Manages virtual scrolling calculations and state for large datasets
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

export interface VirtualizationConfig {
  /** Height of each row in pixels */
  rowHeight: number;
  
  /** Container height in pixels */
  containerHeight: number;
  
  /** Number of extra rows to render outside visible area */
  overscan?: number;
  
  /** Whether to enable horizontal virtualization */
  enableHorizontalVirtualization?: boolean;
  
  /** Column width for horizontal virtualization */
  columnWidth?: number;
}

export interface UseVirtualizationProps {
  /** Total number of items */
  itemCount: number;
  
  /** Virtualization configuration */
  config: VirtualizationConfig;
  
  /** Whether virtualization is enabled */
  enabled?: boolean;
}

export interface UseVirtualizationReturn {
  /** Start index of visible range */
  startIndex: number;
  
  /** End index of visible range */
  endIndex: number;
  
  /** Number of visible items */
  visibleCount: number;
  
  /** Total height of all items */
  totalHeight: number;
  
  /** Vertical offset for positioning */
  offsetY: number;
  
  /** Container ref for scroll handling */
  containerRef: React.RefObject<HTMLDivElement>;
  
  /** Handle scroll events */
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  
  /** Get visible data slice */
  getVisibleSlice: <T>(data: T[]) => T[];
  
  /** Get style for virtual container */
  getContainerStyle: (enableGPUAcceleration?: boolean) => React.CSSProperties;
  
  /** Get style for inner content */
  getInnerStyle: () => React.CSSProperties;
  
  /** Get style for content positioning */
  getContentStyle: (useTransform?: boolean) => React.CSSProperties;
}

/**
 * Hook for managing virtualization state and calculations
 */
export const useVirtualization = ({
  itemCount,
  config,
  enabled = true,
}: UseVirtualizationProps): UseVirtualizationReturn => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollDebounceTimer, setScrollDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    rowHeight,
    containerHeight,
    overscan = 5,
  } = config;
  
  // Calculate visible range
  const { startIndex, endIndex, visibleCount, totalHeight, offsetY } = useMemo(() => {
    if (!enabled) {
      return {
        startIndex: 0,
        endIndex: itemCount - 1,
        visibleCount: itemCount,
        totalHeight: itemCount * rowHeight,
        offsetY: 0,
      };
    }
    
    const visibleCount = Math.ceil(containerHeight / rowHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);
    const totalHeight = itemCount * rowHeight;
    const offsetY = startIndex * rowHeight;
    
    return {
      startIndex,
      endIndex,
      visibleCount,
      totalHeight,
      offsetY,
    };
  }, [itemCount, rowHeight, containerHeight, overscan, scrollTop, enabled]);
  
  // Handle scroll events with debouncing
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    
    if (scrollDebounceTimer) {
      clearTimeout(scrollDebounceTimer);
    }
    
    const timer = setTimeout(() => {
      setScrollTop(target.scrollTop);
    }, 16); // 60fps debouncing
    
    setScrollDebounceTimer(timer);
  }, [scrollDebounceTimer]);
  
  // Get visible data slice
  const getVisibleSlice = useCallback(<T,>(data: T[]): T[] => {
    if (!enabled) return data;
    return data.slice(startIndex, endIndex + 1);
  }, [startIndex, endIndex, enabled]);
  
  // Get container style
  const getContainerStyle = useCallback((enableGPUAcceleration = true): React.CSSProperties => ({
    height: containerHeight,
    overflow: 'auto',
    position: 'relative',
    ...(enableGPUAcceleration && {
      willChange: 'transform',
      transform: 'translateZ(0)',
    }),
  }), [containerHeight]);
  
  // Get inner style
  const getInnerStyle = useCallback((): React.CSSProperties => ({
    height: totalHeight,
    position: 'relative',
  }), [totalHeight]);
  
  // Get content style
  const getContentStyle = useCallback((useTransform = true): React.CSSProperties => ({
    position: 'absolute',
    top: useTransform ? 0 : offsetY,
    left: 0,
    right: 0,
    ...(useTransform && {
      transform: `translateY(${offsetY}px)`,
    }),
  }), [offsetY]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
    };
  }, [scrollDebounceTimer]);
  
  return {
    startIndex,
    endIndex,
    visibleCount,
    totalHeight,
    offsetY,
    containerRef,
    handleScroll,
    getVisibleSlice,
    getContainerStyle,
    getInnerStyle,
    getContentStyle,
  };
};