import React, { forwardRef } from 'react';

const lib = "anukit";
const l_prx = `${lib}-textarea`;

// Simple className joiner (truthy values only)
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCharacterCount?: boolean;
  maxLength?: number;
}

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

const getVariantClasses = (variant: 'default' | 'error' | 'success', hasError: boolean) => {
  if (hasError || variant === 'error') return `${l_prx}-error`;
  if (variant === 'success') return `${l_prx}-success`;
  return `${l_prx}-default`;
};

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
  className,
  id,
  value,
  onChange,
  ...props
}, ref) => {
  // IDs for a11y
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 11)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperTextId = helperText ? `${textareaId}-helper` : undefined;
  const characterCountId = showCharacterCount ? `${textareaId}-count` : undefined;

  const hasError = variant === 'error' || Boolean(error);

  // Character count
  const currentLength = typeof value === 'string' ? value.length : 0;
  const hasMaxLength = typeof maxLength === 'number';
  const isNearLimit = hasMaxLength && currentLength > maxLength * 0.8;
  const isOverLimit = hasMaxLength && currentLength > maxLength;

  // Handle change with optional auto-resize
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      const textarea = e.target;
      textarea.style.height = 'auto';

      const scrollHeight = textarea.scrollHeight;
      const maxHeight = maxRows ? maxRows * 24 : undefined; // approx line-height

      if (maxHeight && scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }

    onChange?.(e);
  };

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
        <label htmlFor={textareaId} className={`${lib}-label`}>
          {label}
        </label>
      )}

      <div className={`${l_prx}-container`}>
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          rows={autoResize ? minRows : (props.rows || minRows)}
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
              <div id={errorId} className={`${lib}-form-error`} role="alert" aria-live="polite">
                {error}
              </div>
            )}

            {helperText && !error && (
              <div id={helperTextId} className={`${lib}-form-helper`}>
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