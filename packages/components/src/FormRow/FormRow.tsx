/**
 * FormRow Component
 * Arranges form controls in a responsive grid layout
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-form-row`;

export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (responsive, will be 1 on mobile) */
  columns?: 1 | 2 | 3 | 4;
  
  /** Additional CSS class */
  className?: string;
  
  /** Children components */
  children?: React.ReactNode;
}

const FormRow = forwardRef<HTMLDivElement, FormRowProps>(({
  columns = 1,
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
