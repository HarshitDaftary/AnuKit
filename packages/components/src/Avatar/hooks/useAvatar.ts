/**
 * Avatar Hook
 * State management and utilities for Avatar component
 */

import { useState, useCallback } from 'react';
import { generateBackgroundColor, generateInitials, getSizeValue } from '@optimui/utils';

export interface UseAvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  loadingStrategy?: 'lazy' | 'eager';
  onImageError?: () => void;
  onImageLoad?: () => void;
}

export interface UseAvatarReturn {
  // State
  imageError: boolean;
  imageLoading: boolean;
  
  // Computed values
  sizeValue: number;
  displayInitials: string;
  backgroundColor: string;
  
  // Handlers
  handleImageError: () => void;
  handleImageLoad: () => void;
  reset: () => void;
}

export const useAvatar = ({
  src,
  name = '',
  size = 'md',
  onImageError,
  onImageLoad,
}: UseAvatarProps): UseAvatarReturn => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(Boolean(src));

  const sizeValue = getSizeValue(size);
  const displayInitials = generateInitials(name);
  const backgroundColor = generateBackgroundColor(name);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
    onImageError?.();
  }, [onImageError]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    onImageLoad?.();
  }, [onImageLoad]);

  const reset = useCallback(() => {
    setImageError(false);
    setImageLoading(Boolean(src));
  }, [src]);

  return {
    imageError,
    imageLoading,
    sizeValue,
    displayInitials,
    backgroundColor,
    handleImageError,
    handleImageLoad,
    reset,
  };
};