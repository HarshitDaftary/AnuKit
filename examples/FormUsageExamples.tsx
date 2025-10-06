import React from 'react';
import {
  Button,
  Card,
  Form,
  FormControl,
  FormRow,
  FormSection,
  Select,
  TextField,
  Textarea,
} from '../packages/components/src';

// Simple Form Example - Shows that developers can use Form without any layout helpers
function SimpleFormExample() {
  const handleSubmit = (values: Record<string, unknown>) => {
    alert(`Simple form submitted: ${JSON.stringify(values, null, 2)}`);
  };

  return (
    <Card>
      <h2>Simple Form (No Layout Helpers)</h2>
      <p>This shows how Form automatically provides good spacing without any layout components.</p>
      
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <TextField name="name" label="Full Name" placeholder="Enter your name" />
        </FormControl>

        <FormControl>
          <TextField name="email" label="Email" type="email" placeholder="Enter your email" />
        </FormControl>

        <FormControl>
          <Select
            name="role"
            label="Role"
            placeholder="Select your role"
            options={[
              { value: 'developer', label: 'Developer' },
              { value: 'designer', label: 'Designer' },
              { value: 'manager', label: 'Manager' },
            ]}
          />
        </FormControl>

        <FormControl>
          <Textarea name="bio" label="Bio" placeholder="Tell us about yourself" />
        </FormControl>

        <Button type="submit" variant="primary">
          Submit Simple Form
        </Button>
      </Form>
    </Card>
  );
}

// Complex Form Example - Shows FormRow and FormSection for advanced layouts
function ComplexFormExample() {
  const handleSubmit = (values: Record<string, unknown>) => {
    alert(`Complex form submitted: ${JSON.stringify(values, null, 2)}`);
  };

  return (
    <Card>
      <h2>Complex Form (With Layout Helpers)</h2>
      <p>This shows FormSection and FormRow for advanced layouts.</p>
      
      <Form onSubmit={handleSubmit}>
        <FormSection title="Personal Information" description="Basic details about you">
          <FormRow columns={2}>
            <FormControl>
              <TextField name="firstName" label="First Name" placeholder="John" />
            </FormControl>
            <FormControl>
              <TextField name="lastName" label="Last Name" placeholder="Doe" />
            </FormControl>
          </FormRow>

          <FormControl>
            <TextField name="email" label="Email" type="email" placeholder="john@example.com" />
          </FormControl>
        </FormSection>

        <FormSection title="Address Details">
          <FormControl>
            <TextField name="street" label="Street Address" placeholder="123 Main St" />
          </FormControl>

          <FormRow columns={3}>
            <FormControl>
              <TextField name="city" label="City" placeholder="New York" />
            </FormControl>
            <FormControl>
              <TextField name="state" label="State" placeholder="NY" />
            </FormControl>
            <FormControl>
              <TextField name="zip" label="ZIP Code" placeholder="10001" />
            </FormControl>
          </FormRow>
        </FormSection>

        <FormSection title="Preferences">
          <FormRow columns={2}>
            <FormControl>
              <Select
                name="country"
                label="Country"
                placeholder="Select country"
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'ca', label: 'Canada' },
                  { value: 'uk', label: 'United Kingdom' },
                ]}
              />
            </FormControl>
            <FormControl>
              <Select
                name="timezone"
                label="Timezone"
                placeholder="Select timezone"
                options={[
                  { value: 'est', label: 'Eastern Time' },
                  { value: 'pst', label: 'Pacific Time' },
                  { value: 'utc', label: 'UTC' },
                ]}
              />
            </FormControl>
          </FormRow>

          <FormControl>
            <Textarea name="notes" label="Additional Notes" placeholder="Any additional information..." />
          </FormControl>
        </FormSection>

        <Button type="submit" variant="primary" size="lg">
          Submit Complex Form
        </Button>
      </Form>
    </Card>
  );
}

// Main component showing both examples
export default function FormUsageExamples() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>AnuKit Form Usage Examples</h1>
      <p>
        These examples demonstrate the flexibility of AnuKit&apos;s Form component.
        You can use it with or without layout helpers based on your needs.
      </p>
      
      <div style={{ marginBottom: '40px' }}>
        <SimpleFormExample />
      </div>
      
      <div>
        <ComplexFormExample />
      </div>
    </div>
  );
}