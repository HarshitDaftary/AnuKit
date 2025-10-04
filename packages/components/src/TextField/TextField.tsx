/**
 * TextField Component
 * Enhanced text input with advanced features like prefix/suffix, clear button, password toggle
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@anukit/utils';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-textfield`;

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Visual variant of the text field */
  variant?: 'default' | 'outlined' | 'filled' | 'error' | 'success';
  
  /** Size of the text field */
  size?: 'sm' | 'md' | 'lg';
  
  /** Error message to display */
  error?: string;
  
  /** Helper text to display */
  helperText?: string;
  
  /** Label for the text field */
  label?: string;
  
  /** Element to display on the left side */
  leftIcon?: React.ReactNode;
  
  /** Element to display on the right side */
  rightIcon?: React.ReactNode;
  
  /** Prefix text to display before the input */
  prefix?: string;
  
  /** Suffix text to display after the input */
  suffix?: string;
  
  /** Whether to show a clear button when there's a value */
  clearable?: boolean;
  
  /** Whether to show password toggle for password fields */
  showPasswordToggle?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Whether the field takes full width of its container */
  fullWidth?: boolean;
  
  /** Callback when clear button is clicked */
  onClear?: () => void;
  
  /** Maximum character count */
  maxLength?: number;
  
  /** Whether to show character count */
  showCharacterCount?: boolean;
  
  /** Additional CSS class */
  className?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
  variant = 'default',
  size = 'md',
  error,
  helperText,
  label,
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  clearable = false,
  showPasswordToggle = false,
  loading = false,
  fullWidth = false,
  onClear,
  maxLength,
  showCharacterCount = false,
  className,
  type = 'text',
  value,
  defaultValue,
  disabled,
  readOnly,
  onChange,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use external ref if provided, otherwise use internal ref
  const inputElement = ref ? (ref as React.RefObject<HTMLInputElement>) : inputRef;
  
  const hasError = Boolean(error);
  const hasValue = Boolean(internalValue);
  const currentValue = value !== undefined ? value : internalValue;
  const characterCount = String(currentValue).length;
  const isOverLimit = maxLength ? characterCount > maxLength : false;
  const isNearLimit = maxLength ? characterCount >= maxLength * 0.8 : false;
  
  // Sync internal value with external value
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);
  
  const fieldId = props.id || `textfield-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const helperTextId = `${fieldId}-helper`;
  const characterCountId = `${fieldId}-character-count`;
  
  const getSizeClass = (): string => {
    return `anukit-input-${size}`;
  };
  
  const getVariantClass = (): string => {
    if (hasError) return `anukit-input-error`;
    if (variant === 'success') return `anukit-input-success`;
    return '';
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(e);
  };
  
  const handleClear = () => {
    const clearEvent = {
      target: { value: '' },
      currentTarget: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    
    setInternalValue('');
    onClear?.();
    onChange?.(clearEvent);
    
    // Focus the input after clearing
    if (inputElement.current) {
      inputElement.current.focus();
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const wrapperClasses = cn(
    l_prx,
    getSizeClass(),
    getVariantClass(),
    isFocused && `${l_prx}--focused`,
    disabled && `${l_prx}--disabled`,
    readOnly && `${l_prx}--readonly`,
    loading && `${l_prx}--loading`,
    hasValue && `${l_prx}--has-value`,
    fullWidth && `${l_prx}--full-width`,
    Boolean(leftIcon) && `${l_prx}--with-left-icon`,
    (Boolean(rightIcon) || clearable || showPasswordToggle) && `${l_prx}--with-right-icon`,
    Boolean(prefix) && `${l_prx}--with-prefix`,
    Boolean(suffix) && `${l_prx}--with-suffix`,
    className
  );
  
  const inputClasses = cn(
    'anukit-input',
    getSizeClass(),
    getVariantClass(),
    fullWidth && 'anukit-input-full-width'
  );
  
  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={fieldId}
          className={`${l_prx}-label`}
        >
          {label}
        </label>
      )}
      
      <div className={`${l_prx}-container`}>
        {leftIcon && (
          <div className={`${l_prx}-left-icon`}>
            {leftIcon}
          </div>
        )}
        
        {prefix && (
          <span className={`${l_prx}-prefix`}>
            {prefix}
          </span>
        )}
        
        <input
          ref={inputElement}
          id={fieldId}
          type={inputType}
          value={currentValue}
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={cn(
            error && errorId,
            helperText && !error && helperTextId,
            showCharacterCount && characterCountId
          )}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {suffix && (
          <span className={`${l_prx}-suffix`}>
            {suffix}
          </span>
        )}
        
        <div className={`${l_prx}-right-section`}>
          {loading && (
            <div className={`${l_prx}-spinner`} aria-label="Loading">
              <svg
                className={`${lib}-spinner`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="32"
                  strokeDashoffset="32"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    dur="2s"
                    values="0 32;16 16;0 32;0 32"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="2s"
                    values="0;-16;-32;-32"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          )}
          
          {clearable && hasValue && !loading && !disabled && !readOnly && (
            <button
              type="button"
              className={`${l_prx}-clear`}
              onClick={handleClear}
              aria-label="Clear input"
              tabIndex={-1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          
          {showPasswordToggle && type === 'password' && !loading && (
            <button
              type="button"
              className={`${l_prx}-password-toggle`}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 1l22 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )}
          
          {rightIcon && !clearable && !showPasswordToggle && !loading && (
            <div className={`${l_prx}-right-icon`}>
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      
      <div className={`${l_prx}-footer`}>
        <div className={`${l_prx}-messages`}>
          {error && (
            <div
              id={errorId}
              className={`${l_prx}-error`}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
          
          {helperText && !error && (
            <div
              id={helperTextId}
              className={`${l_prx}-helper`}
            >
              {helperText}
            </div>
          )}
        </div>
        
        {showCharacterCount && (
          <div
            id={characterCountId}
            className={cn(
              `${l_prx}-character-count`,
              isOverLimit && `${l_prx}-character-count-over`,
              isNearLimit && !isOverLimit && `${l_prx}-character-count-near`
            )}
            aria-live="polite"
          >
            {maxLength ? `${characterCount}/${maxLength}` : characterCount}
          </div>
        )}
      </div>
    </div>
  );
});

TextField.displayName = 'TextField';

export { TextField };
export type { TextFieldProps };