/**
 * FormRow Component
 * A layout component for horizontal arrangement of form fields with responsive behavior
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-form-row`;

export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns on desktop */
  columns?: 1 | 2 | 3 | 4;
  
  /** Custom CSS class */
  className?: string;
  
  /** Children elements */
  children: React.ReactNode;
}

const FormRow = forwardRef<HTMLDivElement, FormRowProps>(({
  columns = 2,
  className,
  children,
  ...props
}, ref) => {
  const rowClasses = cn(
    l_prx,
    columns === 2 && `${l_prx}--2-cols`,
    columns === 3 && `${l_prx}--3-cols`,
    columns === 4 && `${l_prx}--4-cols`,
    className
  );

  return (
    <div
      ref={ref}
      className={rowClasses}
      {...props}
    >
      {children}
    </div>
  );
});

FormRow.displayName = 'FormRow';

export { FormRow };