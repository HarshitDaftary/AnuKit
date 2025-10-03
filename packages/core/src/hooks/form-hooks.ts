/**
 * Form Validation Hooks
 * Comprehensive form state management and validation logic
 */

import { useState, useCallback, useMemo } from 'react';

// Types
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  custom?: (value: any) => string | undefined | Promise<string | undefined>;
}

export interface FieldConfig {
  initialValue?: any;
  rules?: ValidationRule;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FieldState {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
}

export interface FormConfig {
  initialValues?: Record<string, any>;
  validationRules?: Record<string, ValidationRule>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  validateOnMount?: boolean;
  revalidateOnChange?: boolean;
}

export interface UseFormReturn {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error?: string) => void;
  setTouched: (name: string, touched?: boolean) => void;
  setFieldState: (name: string, state: Partial<FieldState>) => void;
  reset: (values?: Record<string, any>) => void;
  validate: (name?: string) => Promise<boolean>;
  handleSubmit: (onSubmit: (values: Record<string, any>) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>;
  getFieldProps: (name: string) => {
    value: any;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
    error?: string;
    touched: boolean;
  };
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/.+/;

/**
 * Validates a value against validation rules
 */
export const validateValue = async (value: any, rules: ValidationRule): Promise<string | undefined> => {
  // Required validation
  if (rules.required && (value === undefined || value === null || value === '')) {
    return 'This field is required';
  }
  
  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  // Number validations
  if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
    return `Value must be at least ${rules.min}`;
  }
  
  if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
    return `Value must be at most ${rules.max}`;
  }
  
  // String length validations
  if (rules.minLength !== undefined && typeof value === 'string' && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }
  
  if (rules.maxLength !== undefined && typeof value === 'string' && value.length > rules.maxLength) {
    return `Must be at most ${rules.maxLength} characters`;
  }
  
  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Invalid format';
  }
  
  // Email validation
  if (rules.email && typeof value === 'string' && !EMAIL_REGEX.test(value)) {
    return 'Invalid email address';
  }
  
  // URL validation
  if (rules.url && typeof value === 'string' && !URL_REGEX.test(value)) {
    return 'Invalid URL';
  }
  
  // Custom validation
  if (rules.custom) {
    return await rules.custom(value);
  }
  
  return undefined;
};

/**
 * Main form hook for managing form state and validation
 */
export const useForm = (config: FormConfig = {}): UseFormReturn => {
  const {
    initialValues = {},
    validationRules = {},
    mode = 'onChange',
    validateOnMount = false,
    revalidateOnChange = true,
  } = config;
  
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const states: Record<string, FieldState> = {};
    Object.keys(initialValues).forEach(name => {
      states[name] = {
        value: initialValues[name],
        error: undefined,
        touched: false,
        dirty: false,
        validating: false,
      };
    });
    return states;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Derived state
  const values = useMemo(() => {
    const vals: Record<string, any> = {};
    Object.keys(fieldStates).forEach(name => {
      vals[name] = fieldStates[name]?.value;
    });
    return vals;
  }, [fieldStates]);
  
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    Object.keys(fieldStates).forEach(name => {
      if (fieldStates[name]?.error) {
        errs[name] = fieldStates[name].error!;
      }
    });
    return errs;
  }, [fieldStates]);
  
  const touched = useMemo(() => {
    const touchedFields: Record<string, boolean> = {};
    Object.keys(fieldStates).forEach(name => {
      touchedFields[name] = fieldStates[name]?.touched || false;
    });
    return touchedFields;
  }, [fieldStates]);
  
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);
  
  const isDirty = useMemo(() => {
    return Object.values(fieldStates).some(state => state?.dirty);
  }, [fieldStates]);
  
  // Field validation
  const validateField = useCallback(async (name: string): Promise<string | undefined> => {
    const fieldState = fieldStates[name];
    const rules = validationRules[name];
    
    if (!fieldState || !rules) {
      return undefined;
    }
    
    setFieldStates(prev => ({
      ...prev,
      [name]: { ...prev[name], validating: true },
    }));
    
    try {
      const error = await validateValue(fieldState.value, rules);
      
      setFieldStates(prev => ({
        ...prev,
        [name]: { ...prev[name], error, validating: false },
      }));
      
      return error;
    } catch (err) {
      const error = 'Validation failed';
      
      setFieldStates(prev => ({
        ...prev,
        [name]: { ...prev[name], error, validating: false },
      }));
      
      return error;
    }
  }, [fieldStates, validationRules]);
  
  // Form validation
  const validate = useCallback(async (name?: string): Promise<boolean> => {
    if (name) {
      const error = await validateField(name);
      return !error;
    }
    
    const promises = Object.keys(fieldStates).map(fieldName => validateField(fieldName));
    const results = await Promise.all(promises);
    
    return results.every(error => !error);
  }, [fieldStates, validateField]);
  
  // Set field value
  const setValue = useCallback((name: string, value: any) => {
    setFieldStates(prev => {
      const newState = {
        ...prev,
        [name]: {
          ...prev[name],
          value,
          dirty: value !== initialValues[name],
          error: undefined, // Clear error when value changes
        },
      };
      
      // Validate if needed
      if (mode === 'onChange' && revalidateOnChange && prev[name]?.touched) {
        // Trigger validation asynchronously
        setTimeout(() => validateField(name), 0);
      }
      
      return newState;
    });
  }, [initialValues, mode, revalidateOnChange, validateField]);
  
  // Set field error
  const setError = useCallback((name: string, error?: string) => {
    setFieldStates(prev => ({
      ...prev,
      [name]: { ...prev[name], error },
    }));
  }, []);
  
  // Set field touched
  const setTouched = useCallback((name: string, touched: boolean = true) => {
    setFieldStates(prev => ({
      ...prev,
      [name]: { ...prev[name], touched },
    }));
    
    // Validate on blur if needed
    if (mode === 'onBlur' && touched) {
      setTimeout(() => validateField(name), 0);
    }
  }, [mode, validateField]);
  
  // Set field state
  const setFieldState = useCallback((name: string, state: Partial<FieldState>) => {
    setFieldStates(prev => ({
      ...prev,
      [name]: { ...prev[name], ...state },
    }));
  }, []);
  
  // Reset form
  const reset = useCallback((newValues?: Record<string, any>) => {
    const resetValues = newValues || initialValues;
    const resetStates: Record<string, FieldState> = {};
    
    Object.keys(resetValues).forEach(name => {
      resetStates[name] = {
        value: resetValues[name],
        error: undefined,
        touched: false,
        dirty: false,
        validating: false,
      };
    });
    
    setFieldStates(resetStates);
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Handle form submission
  const handleSubmit = useCallback((onSubmit: (values: Record<string, any>) => void | Promise<void>) => {
    return async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      if (isSubmitting) return;
      
      // Mark all fields as touched
      setFieldStates(prev => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach(name => {
          newStates[name] = { ...newStates[name], touched: true };
        });
        return newStates;
      });
      
      // Validate all fields
      const isFormValid = await validate();
      
      if (!isFormValid) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [isSubmitting, validate, values]);
  
  // Get field props for easy form field integration
  const getFieldProps = useCallback((name: string) => {
    const fieldState = fieldStates[name] || {
      value: '',
      error: undefined,
      touched: false,
      dirty: false,
      validating: false,
    };
    
    return {
      value: fieldState.value,
      onChange: (e: React.ChangeEvent<any>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setValue(name, value);
      },
      onBlur: () => {
        setTouched(name, true);
      },
      error: fieldState.touched ? fieldState.error : undefined,
      touched: fieldState.touched,
    };
  }, [fieldStates, setValue, setTouched]);
  
  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setError,
    setTouched,
    setFieldState,
    reset,
    validate,
    handleSubmit,
    getFieldProps,
  };
};

/**
 * Hook for managing a single field with validation
 */
export const useField = (name: string, config: FieldConfig = {}) => {
  const {
    initialValue = '',
    rules,
    validateOnChange = true,
    validateOnBlur = true,
  } = config;
  
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [validating, setValidating] = useState(false);
  
  const validate = useCallback(async (): Promise<boolean> => {
    if (!rules) return true;
    
    setValidating(true);
    
    try {
      const validationError = await validateValue(value, rules);
      setError(validationError);
      return !validationError;
    } catch {
      setError('Validation failed');
      return false;
    } finally {
      setValidating(false);
    }
  }, [value, rules]);
  
  const handleChange = useCallback((newValue: any) => {
    setValue(newValue);
    setError(undefined); // Clear error when value changes
    
    if (validateOnChange && touched) {
      setTimeout(validate, 0);
    }
  }, [validateOnChange, touched, validate]);
  
  const handleBlur = useCallback(() => {
    setTouched(true);
    
    if (validateOnBlur) {
      setTimeout(validate, 0);
    }
  }, [validateOnBlur, validate]);
  
  const reset = useCallback((newValue = initialValue) => {
    setValue(newValue);
    setError(undefined);
    setTouched(false);
    setValidating(false);
  }, [initialValue]);
  
  return {
    value,
    error,
    touched,
    validating,
    isValid: !error,
    isDirty: value !== initialValue,
    setValue: handleChange,
    setError,
    setTouched,
    validate,
    reset,
    fieldProps: {
      value,
      onChange: (e: React.ChangeEvent<any>) => {
        const newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        handleChange(newValue);
      },
      onBlur: handleBlur,
      error: touched ? error : undefined,
    },
  };
};

/**
 * Hook for managing form validation schemas
 */
export const useValidation = () => {
  const [schema, setSchema] = useState<Record<string, ValidationRule>>({});
  
  const addRule = useCallback((field: string, rule: ValidationRule) => {
    setSchema(prev => ({
      ...prev,
      [field]: { ...prev[field], ...rule },
    }));
  }, []);
  
  const removeRule = useCallback((field: string, ruleKey?: keyof ValidationRule) => {
    setSchema(prev => {
      if (!ruleKey) {
        const { [field]: removed, ...rest } = prev;
        return rest;
      }
      
      const { [ruleKey]: removedRule, ...fieldRules } = prev[field] || {};
      return {
        ...prev,
        [field]: fieldRules,
      };
    });
  }, []);
  
  const validateField = useCallback(async (field: string, value: any): Promise<string | undefined> => {
    const rules = schema[field];
    if (!rules) return undefined;
    
    return await validateValue(value, rules);
  }, [schema]);
  
  const validateForm = useCallback(async (values: Record<string, any>): Promise<Record<string, string>> => {
    const errors: Record<string, string> = {};
    
    const promises = Object.keys(schema).map(async field => {
      const error = await validateField(field, values[field]);
      if (error) {
        errors[field] = error;
      }
    });
    
    await Promise.all(promises);
    
    return errors;
  }, [schema, validateField]);
  
  return {
    schema,
    addRule,
    removeRule,
    validateField,
    validateForm,
  };
};