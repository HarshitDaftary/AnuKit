import React from 'react';
import {
  Button,
  Card,
  Form,
  FormControl,
  FormRow,
  FormSection,
  Input,
  Radio,
  Select,
  TextField,
  Textarea,
  useFormContext,
  useFormField,
} from '@anukit/components';

/**
 * Comprehensive Form Example
 * Demonstrates all form input types available in AnuKit using the Form component
 */
export const ComprehensiveFormExample: React.FC = () => {
  // Initial form values
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    age: 25,
    experience: 'intermediate',
    department: '',
    volume: 50
  };

  // Form validation rules
  const validationRules = {
    firstName: { required: true, minLength: 2 },
    lastName: { required: true, minLength: 2 },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
      }
    },
    bio: { required: true, minLength: 10, maxLength: 500 },
    department: { required: true }
  };

  // Dropdown options
  const departmentOptions = [
    { value: '', label: 'Select a department', disabled: true },
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' }
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Form submitted successfully!\n\n${JSON.stringify(values, null, 2)}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Comprehensive Form Example
        </h1>
        <p className="text-gray-600 mb-8">
          This form demonstrates all available input field types in AnuKit using the Form component
          with built-in validation, state management, and error handling.
        </p>

        <Form
          initialValues={initialValues}
          validationRules={validationRules}
          onSubmit={handleSubmit}
          mode="onChange"
          resetOnSubmit={false}
          className="anukit-form"
        >
          <FormFieldsContent departmentOptions={departmentOptions} />
        </Form>
      </Card>
    </div>
  );
};

// Separate component for form fields to use form context
const FormFieldsContent: React.FC<{ departmentOptions: Array<{value: string, label: string, disabled?: boolean}> }> = ({ departmentOptions }) => {
  const firstNameField = useFormField('firstName');
  const lastNameField = useFormField('lastName');
  const emailField = useFormField('email');
  const bioField = useFormField('bio');
  const ageField = useFormField('age');
  const experienceField = useFormField('experience');
  const departmentField = useFormField('department');
  const volumeField = useFormField('volume');

  return (
    <>
      {/* Text Fields Section */}
      <FormSection title="Personal Information">
        <FormRow columns={2}>
          <FormControl
            label="First Name"
            required
            error={firstNameField.error}
            fullWidth
          >
            <TextField
              placeholder="Enter your first name"
              value={firstNameField.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => firstNameField.setValue(e.target.value)}
              onBlur={() => firstNameField.setTouched(true)}
              variant={firstNameField.hasError ? 'error' : 'default'}
              fullWidth
            />
          </FormControl>

          <FormControl
            label="Last Name"
            required
            error={lastNameField.error}
            fullWidth
          >
            <TextField
              placeholder="Enter your last name"
              value={lastNameField.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => lastNameField.setValue(e.target.value)}
              onBlur={() => lastNameField.setTouched(true)}
              variant={lastNameField.hasError ? 'error' : 'default'}
              fullWidth
            />
          </FormControl>
        </FormRow>

        <FormControl
          label="Email Address"
          required
          error={emailField.error}
          helperText="We'll never share your email with anyone else"
          fullWidth
        >
          <TextField
            type="email"
            placeholder="your.email@example.com"
            value={emailField.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => emailField.setValue(e.target.value)}
            onBlur={() => emailField.setTouched(true)}
            variant={emailField.hasError ? 'error' : 'default'}
            fullWidth
          />
        </FormControl>
      </FormSection>

      {/* Textarea Section */}
      <FormSection title="About You">
        <FormControl
          label="Bio"
          required
          error={bioField.error}
          helperText={`${bioField.value?.length || 0}/500 characters`}
          fullWidth
        >
          <Textarea
            placeholder="Tell us about yourself..."
            value={bioField.value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => bioField.setValue(e.target.value)}
            onBlur={() => bioField.setTouched(true)}
            variant={bioField.hasError ? 'error' : 'default'}
            minRows={4}
            maxRows={8}
            maxLength={500}
            showCharacterCount
            fullWidth
          />
        </FormControl>
      </FormSection>

      {/* Slider Section */}
      <FormSection title="Preferences">
        <FormRow columns={2}>
          <FormControl
            label={`Age: ${ageField.value} years`}
            fullWidth
          >
            <Input
              type="range"
              min="18"
              max="100"
              value={ageField.value?.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => ageField.setValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>18</span>
              <span>100</span>
            </div>
          </FormControl>

          <FormControl
            label={`Volume: ${volumeField.value}%`}
            fullWidth
          >
            <Input
              type="range"
              min="0"
              max="100"
              value={volumeField.value?.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => volumeField.setValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </FormControl>
        </FormRow>
      </FormSection>

      {/* Radio Buttons Section */}
      <FormSection title="Experience Level">
        <FormControl label="Select your experience level" fullWidth>
          <div className="space-y-3">
            <Radio
              name="experience"
              value="beginner"
              checked={experienceField.value === 'beginner'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => experienceField.setValue(e.target.value)}
              label="Beginner"
              description="Just starting out, learning the basics"
            />
            <Radio
              name="experience"
              value="intermediate"
              checked={experienceField.value === 'intermediate'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => experienceField.setValue(e.target.value)}
              label="Intermediate"
              description="Some experience, comfortable with common tasks"
            />
            <Radio
              name="experience"
              value="advanced"
              checked={experienceField.value === 'advanced'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => experienceField.setValue(e.target.value)}
              label="Advanced"
              description="Extensive experience, able to handle complex challenges"
            />
            <Radio
              name="experience"
              value="expert"
              checked={experienceField.value === 'expert'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => experienceField.setValue(e.target.value)}
              label="Expert"
              description="Deep expertise, able to mentor others"
            />
          </div>
        </FormControl>
      </FormSection>

      {/* Dropdown Section */}
      <FormSection title="Professional Information">
        <FormControl
          label="Department"
          required
          error={departmentField.error}
          helperText="Select the department you work in or are interested in"
          fullWidth
        >
          <Select
            placeholder="Choose your department"
            value={departmentField.value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => departmentField.setValue(e.target.value)}
            onBlur={() => departmentField.setTouched(true)}
            options={departmentOptions}
            variant={departmentField.hasError ? 'error' : 'default'}
            fullWidth
          />
        </FormControl>
      </FormSection>

      <FormActions />
    </>
  );
};

// Form actions component that uses form context
const FormActions: React.FC = () => {
  const { isSubmitting, resetForm, formState } = useFormContext();

  // Get all current form values for preview
  const allValues = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].value;
    return acc;
  }, {} as Record<string, unknown>);

  return (
    <>
      {/* Form Actions */}
      <div className="border-t pt-6 flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Reset Form
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Form'}
        </Button>
      </div>

      {/* Form Data Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold text-gray-900 mb-2">Current Form Data:</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(allValues, null, 2)}
        </pre>
      </div>

      {/* Minimal styling for range sliders only */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb:hover {
          background: #2563eb;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
        }

        .slider::-moz-range-track {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </>
  );
};

export default ComprehensiveFormExample;