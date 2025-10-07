/**
 * FormSection Component
 * Provides semantic grouping for form fields with optional title and description
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-form-section`;

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string;
  
  /** Section description */
  description?: string;
  
  /** Additional CSS class */
  className?: string;
  
  /** Children components */
  children?: React.ReactNode;
}

const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(({
  title,
  description,
  className,
  children,
  ...props
}, ref) => {
  const sectionClasses = cn(
    l_prx,
    className
  );

  return (
    <div
      ref={ref}
      className={sectionClasses}
      {...props}
    >
      {(title || description) && (
        <div className={`${l_prx}__header`}>
          {title && (
            <h3 className={`${l_prx}__title`}>{title}</h3>
          )}
          {description && (
            <p className={`${l_prx}__description`}>{description}</p>
          )}
        </div>
      )}
      <div className={`${l_prx}__content`}>
        {children}
      </div>
    </div>
  );
});

FormSection.displayName = 'FormSection';

export { FormSection };
