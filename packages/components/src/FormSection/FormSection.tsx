/**
 * FormSection Component
 * A semantic wrapper for grouping related form fields with automatic spacing and optional title
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
  
  /** Custom CSS class */
  className?: string;
  
  /** Children elements */
  children: React.ReactNode;
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
    'anukit-form-section', // Use the existing CSS class we already defined
    className
  );

  return (
    <div
      ref={ref}
      className={sectionClasses}
      {...props}
    >
      {title && (
        <div className={`${l_prx}__header`}>
          <h2 className={`${l_prx}__title`}>{title}</h2>
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