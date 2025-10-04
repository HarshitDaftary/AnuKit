/**
 * Form Component
 * Form wrapper component that handles form state, validation, submission, and provides context
 */

import React, { forwardRef, createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@optimui/utils';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";
const l_prx = `${lib}-form`;

// Form validation types
interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

interface FieldState {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

interface FormState {
  [fieldName: string]: FieldState;
}

interface FormContextValue {
  formState: FormState;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error?: string) => void;
  setFieldTouched: (name: string, touched?: boolean) => void;
  validateField: (name: string, rules?: ValidationRule) => string | undefined;
  isSubmitting: boolean;
  hasErrors: boolean;
  resetForm: () => void;
}

// Form Context
const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }
  return context;
};

export const useFormField = (name: string, rules?: ValidationRule) => {
  const context = useFormContext();
  const fieldState = context.formState[name] || {
    value: '',
    error: undefined,
    touched: false,
    dirty: false,
  };

  const setValue = useCallback((value: any) => {
    context.setFieldValue(name, value);
  }, [context, name]);

  const setError = useCallback((error?: string) => {
    context.setFieldError(name, error);
  }, [context, name]);

  const setTouched = useCallback((touched: boolean = true) => {
    context.setFieldTouched(name, touched);
  }, [context, name]);

  const validate = useCallback(() => {
    return context.validateField(name, rules);
  }, [context, name, rules]);

  return {
    ...fieldState,
    setValue,
    setError,
    setTouched,
    validate,
    hasError: Boolean(fieldState.error),
  };
};

interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Initial values for the form */
  initialValues?: Record<string, any>;
  
  /** Validation schema */
  validationRules?: Record<string, ValidationRule>;
  
  /** Form submission handler */
  onSubmit?: (values: Record<string, any>, { setSubmitting, setErrors }: {
    setSubmitting: (submitting: boolean) => void;
    setErrors: (errors: Record<string, string>) => void;
  }) => void | Promise<void>;
  
  /** Validation mode */
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  
  /** Whether to validate on mount */
  validateOnMount?: boolean;
  
  /** Whether to reset form after successful submission */
  resetOnSubmit?: boolean;
  
  /** Size of the form components */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether form components take full width */
  fullWidth?: boolean;
  
  /** Additional CSS class */
  className?: string;
  
  /** Children components */
  children?: React.ReactNode;
}

const Form = forwardRef<HTMLFormElement, FormProps>(({
  initialValues = {},
  validationRules = {},
  onSubmit,
  mode = 'onChange',
  validateOnMount = false,
  resetOnSubmit = false,
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}, ref) => {
  const [formState, setFormState] = useState<FormState>(() => {
    const initialState: FormState = {};
    Object.keys(initialValues).forEach(key => {
      initialState[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false,
        dirty: false,
      };
    });
    return initialState;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation function
  const validateValue = useCallback((value: any, rules: ValidationRule): string | undefined => {
    if (rules.required && (value === undefined || value === null || value === '')) {
      return 'This field is required';
    }
    
    if (rules.min && typeof value === 'number' && value < rules.min) {
      return `Value must be at least ${rules.min}`;
    }
    
    if (rules.max && typeof value === 'number' && value > rules.max) {
      return `Value must be at most ${rules.max}`;
    }
    
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Must be at most ${rules.maxLength} characters`;
    }
    
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Invalid format';
    }
    
    if (rules.custom) {
      return rules.custom(value);
    }
    
    return undefined;
  }, []);
  
  const validateField = useCallback((name: string, rules?: ValidationRule): string | undefined => {
    const fieldState = formState[name];
    if (!fieldState) return undefined;
    
    const fieldRules = rules || validationRules[name];
    if (!fieldRules) return undefined;
    
    return validateValue(fieldState.value, fieldRules);
  }, [formState, validationRules, validateValue]);
  
  const validateForm = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    Object.keys(formState).forEach(name => {
      const error = validateField(name);
      if (error) {
        errors[name] = error;
      }
    });
    
    return errors;
  }, [formState, validateField]);
  
  const setFieldValue = useCallback((name: string, value: any) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        [name]: {
          ...prev[name],
          value,
          dirty: true,
          error: mode === 'onChange' ? validateField(name) : prev[name]?.error,
        },
      };
      return newState;
    });
  }, [mode, validateField]);
  
  const setFieldError = useCallback((name: string, error?: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  }, []);
  
  const setFieldTouched = useCallback((name: string, touched: boolean = true) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        [name]: {
          ...prev[name],
          touched,
          error: mode === 'onBlur' && touched ? validateField(name) : prev[name]?.error,
        },
      };
      return newState;
    });
  }, [mode, validateField]);
  
  const resetForm = useCallback(() => {
    const resetState: FormState = {};
    Object.keys(initialValues).forEach(key => {
      resetState[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false,
        dirty: false,
      };
    });
    setFormState(resetState);
    setIsSubmitting(false);
  }, [initialValues]);
  
  const hasErrors = Object.values(formState).some(field => Boolean(field.error));
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!onSubmit || isSubmitting) return;
    
    // Mark all fields as touched
    const touchedState: FormState = {};
    Object.keys(formState).forEach(name => {
      touchedState[name] = {
        ...formState[name],
        touched: true,
      };
    });
    setFormState(touchedState);
    
    // Validate all fields
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Set errors in state
      const errorState: FormState = {};
      Object.keys(formState).forEach(name => {
        errorState[name] = {
          ...formState[name],
          error: errors[name],
          touched: true,
        };
      });
      setFormState(errorState);
      return;
    }
    
    setIsSubmitting(true);
    
    // Extract values
    const values: Record<string, any> = {};
    Object.keys(formState).forEach(name => {
      values[name] = formState[name].value;
    });
    
    try {
      await onSubmit(values, {
        setSubmitting: setIsSubmitting,
        setErrors: (errors: Record<string, string>) => {
          const errorState: FormState = {};
          Object.keys(formState).forEach(name => {
            errorState[name] = {
              ...formState[name],
              error: errors[name],
            };
          });
          setFormState(prev => ({ ...prev, ...errorState }));
        },
      });
      
      if (resetOnSubmit) {
        resetForm();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const contextValue: FormContextValue = {
    formState,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    isSubmitting,
    hasErrors,
    resetForm,
  };
  
  const formClasses = cn(
    l_prx,
    size === 'sm' && `${l_prx}--size-sm`,
    size === 'md' && `${l_prx}--size-md`,
    size === 'lg' && `${l_prx}--size-lg`,
    fullWidth && `${l_prx}--full-width`,
    isSubmitting && `${l_prx}--submitting`,
    hasErrors && `${l_prx}--has-errors`,
    className
  );
  
  return (
    <FormContext.Provider value={contextValue}>
      <form
        ref={ref}
        className={formClasses}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

Form.displayName = 'Form';

export { Form };
export type { FormProps, ValidationRule, FieldState, FormState };