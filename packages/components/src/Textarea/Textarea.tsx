import React, { forwardRef } from 'react';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";

const l_prx = `${lib}-textarea`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual variant of the textarea */
  variant?: 'default' | 'error' | 'success';
  
  /** Size of the textarea */
  size?: 'sm' | 'md' | 'lg';
  
  /** Label text */
  label?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Take full width of container */
  fullWidth?: boolean;
  
  /** Auto-resize textarea based on content */
  autoResize?: boolean;
  
  /** Minimum number of rows */
  minRows?: number;
  
  /** Maximum number of rows (for auto-resize) */
  maxRows?: number;
  
  /** Character counter */
  showCharacterCount?: boolean;
  
  /** Maximum character limit */
  maxLength?: number;
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

// Variant-based CSS classes
const getVariantClasses = (variant: 'default' | 'error' | 'success', hasError: boolean) => {
  if (hasError || encodeSizeMode(variant) === encodeSizeMode('error')) {
    return `${l_prx}-error`;
  }
  if (encodeSizeMode(variant) === encodeSizeMode('success')) {
    return `${l_prx}-success`;
  }
  return `${l_prx}-default`;
};

/* @__PURE__ */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  fullWidth = false,
  autoResize = false,
  minRows = 3,
  maxRows,
  showCharacterCount = false,
  maxLength,
  className = '',
  id,
  value,
  onChange,
  ...props
}, ref) => {
  // Generate unique IDs for accessibility
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperTextId = helperText ? `${textareaId}-helper` : undefined;
  const characterCountId = showCharacterCount ? `${textareaId}-count` : undefined;
  
  const hasError = encodeSizeMode(variant) === encodeSizeMode('error') || Boolean(error);
  
  // Character count logic
  const currentLength = typeof value === 'string' ? value.length : 0;
  const hasMaxLength = typeof maxLength === 'number';
  const isNearLimit = hasMaxLength && currentLength > maxLength * 0.8;
  const isOverLimit = hasMaxLength && currentLength > maxLength;
  
  // Auto-resize functionality
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = maxRows ? maxRows * 24 : undefined; // Approximate line height
      
      if (maxHeight && scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  // Build CSS classes
  const textareaClasses = cn(
    l_prx,
    getSizeClasses(size),
    getVariantClasses(variant, hasError),
    fullWidth && `${l_prx}-full-width`,
    autoResize && `${l_prx}-auto-resize`,
    className
  );
  
  const wrapperClasses = cn(
    `${l_prx}-wrapper`,
    fullWidth && `${l_prx}-wrapper-full-width`
  );

  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={textareaId}
          className={`${lib}-label`
        >
          {label}
        </label>
      )}
      
      <div className={`${l_prx}-container`}>
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          rows={autoResize ? minRows : props.rows || minRows}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={cn(errorId, helperTextId, characterCountId)}
          value={value}
          onChange={handleChange}
          {...props}
        />
      </div>
      
      <div className={`${lib}-form-footer`}>
        {(error || (helperText && !error)) && (
          <div className={`${lib}-form-messages`}>
            {error && (
              <div
                id={errorId}
                className={`${lib}-form-error`
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
            
            {helperText && !error && (
              <div
                id={helperTextId}
                className={`${lib}-form-helper`
              >
                {helperText}
              </div>
            )}
          </div>
        )}
        
        {showCharacterCount && (
          <div
            id={characterCountId}
            className={cn(
              `${lib}-form-character-count`,
              isOverLimit && `${lib}-form-character-count-over`,
              isNearLimit && !isOverLimit && `${lib}-form-character-count-near`
            )}
            aria-live="polite"
          >
            {hasMaxLength ? `${currentLength}/${maxLength}` : currentLength}
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };