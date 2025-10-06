/**
 * Form Demo Component
 * Demonstrates Form, FormSection, and FormRow components
 */

import React, { useState } from 'react';
import { 
  Form, 
  FormSection, 
  FormRow, 
  FormControl, 
  TextField, 
  Select, 
  Textarea, 
  Button 
} from '@anukit/components';

const FormDemo: React.FC = () => {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (values: Record<string, any>) => {
    console.log('Form submitted:', values);
    setFormData(values);
  };

  const roleOptions = [
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Manager' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="p-8 space-y-12 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">AnuKit Form Components</h1>
        <p className="text-xl text-gray-600">
          Flexible form layout components with FormSection and FormRow
        </p>
      </div>

      {/* Simple Form Example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Simple Form Example</h2>
        <p className="text-gray-600">
          A basic form without any layout helpers - Form component provides automatic spacing
        </p>
        <div className="p-6 border rounded-lg bg-white">
          <Form onSubmit={handleSubmit}>
            <FormControl>
              <TextField 
                name="name" 
                label="Full Name" 
                placeholder="Enter your name"
                fullWidth
              />
            </FormControl>
            <FormControl>
              <TextField 
                name="email" 
                label="Email" 
                type="email"
                placeholder="you@example.com"
                fullWidth
              />
            </FormControl>
            <FormControl>
              <Select 
                name="role" 
                label="Role" 
                options={roleOptions}
                fullWidth
              />
            </FormControl>
            <FormControl>
              <Textarea 
                name="bio" 
                label="Bio"
                placeholder="Tell us about yourself"
                fullWidth
              />
            </FormControl>
            <Button type="submit" variant="primary">Submit</Button>
          </Form>
        </div>
      </div>

      {/* Complex Form Example with FormSection and FormRow */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Complex Form with FormSection & FormRow</h2>
        <p className="text-gray-600">
          Demonstrates semantic sections and responsive multi-column layouts
        </p>
        <div className="p-6 border rounded-lg bg-white">
          <Form onSubmit={handleSubmit}>
            <FormSection 
              title="Personal Information" 
              description="Please provide your personal details"
            >
              <FormRow columns={2}>
                <FormControl>
                  <TextField 
                    name="firstName" 
                    label="First Name"
                    placeholder="John"
                    fullWidth
                  />
                </FormControl>
                <FormControl>
                  <TextField 
                    name="lastName" 
                    label="Last Name"
                    placeholder="Doe"
                    fullWidth
                  />
                </FormControl>
              </FormRow>
              
              <FormControl>
                <TextField 
                  name="email2" 
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@example.com"
                  fullWidth
                />
              </FormControl>
              
              <FormControl>
                <TextField 
                  name="phone" 
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  fullWidth
                />
              </FormControl>
            </FormSection>

            <FormSection 
              title="Address" 
              description="Where do you live?"
            >
              <FormControl>
                <TextField 
                  name="street" 
                  label="Street Address"
                  placeholder="123 Main St"
                  fullWidth
                />
              </FormControl>
              
              <FormRow columns={3}>
                <FormControl>
                  <TextField 
                    name="city" 
                    label="City"
                    placeholder="New York"
                    fullWidth
                  />
                </FormControl>
                <FormControl>
                  <TextField 
                    name="state" 
                    label="State"
                    placeholder="NY"
                    fullWidth
                  />
                </FormControl>
                <FormControl>
                  <TextField 
                    name="zip" 
                    label="ZIP Code"
                    placeholder="10001"
                    fullWidth
                  />
                </FormControl>
              </FormRow>
            </FormSection>

            <FormSection 
              title="Preferences" 
              description="Tell us about your preferences"
            >
              <FormControl>
                <Select 
                  name="role2" 
                  label="Your Role" 
                  options={roleOptions}
                  fullWidth
                />
              </FormControl>
              
              <FormControl>
                <Textarea 
                  name="comments" 
                  label="Additional Comments"
                  placeholder="Any additional information..."
                  fullWidth
                />
              </FormControl>
            </FormSection>

            <div className="flex gap-3">
              <Button type="submit" variant="primary">Submit Form</Button>
              <Button type="button" variant="secondary">Cancel</Button>
            </div>
          </Form>
        </div>
      </div>

      {/* 4-Column Layout Example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">4-Column Responsive Layout</h2>
        <p className="text-gray-600">
          FormRow with 4 columns (responsive - collapses on mobile)
        </p>
        <div className="p-6 border rounded-lg bg-white">
          <Form onSubmit={handleSubmit}>
            <FormRow columns={4}>
              <FormControl>
                <TextField 
                  name="q1" 
                  label="Q1"
                  placeholder="Jan-Mar"
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <TextField 
                  name="q2" 
                  label="Q2"
                  placeholder="Apr-Jun"
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <TextField 
                  name="q3" 
                  label="Q3"
                  placeholder="Jul-Sep"
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <TextField 
                  name="q4" 
                  label="Q4"
                  placeholder="Oct-Dec"
                  fullWidth
                />
              </FormControl>
            </FormRow>
            <Button type="submit" variant="primary">Save Quarters</Button>
          </Form>
        </div>
      </div>

      {/* Form Data Display */}
      {Object.keys(formData).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Submitted Form Data</h2>
          <div className="p-6 border rounded-lg bg-gray-50">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDemo;
