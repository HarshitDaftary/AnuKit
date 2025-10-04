// AnuKit Icon components
import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  className?: string;
}

const defaultIconProps: Partial<IconProps> = {
  size: 24,
  fill: 'currentColor',
  focusable: 'false',
  'aria-hidden': 'true',
};

// Arrow Icons
export const ChevronUpIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );
};

export const ChevronDownIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
};

export const ChevronLeftIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
};

export const ChevronRightIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  );
};

// Action Icons
export const CloseIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
};

export const PlusIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
};

export const MinusIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path d="M19 13H5v-2h14v2z" />
    </svg>
  );
};

// Status Icons
export const AlertCircleIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...rest}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
};

export const InfoIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...rest}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

export const CheckCircleIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...rest}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  );
};

export const AlertTriangleIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...rest}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
};

// Common interface icons
export const SearchIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...rest}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
};

export const MenuIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...rest}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
};

export const MoreHorizontalIcon: React.FC<IconProps> = (props) => {
  const { size, ...rest } = { ...defaultIconProps, ...props };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...rest}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
};

// All available icons
export const icons = {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  AlertCircleIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SearchIcon,
  MenuIcon,
  MoreHorizontalIcon,
} as const;

export type IconName = keyof typeof icons;