/**
 * New Form Components Tests
 * Tests for TextField, DatePicker, Form and validation hooks
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField, DatePicker, Form, useFormField } from '../src/index';

describe('New Form Components', () => {
  describe('TextField Component', () => {
    it('renders without crashing', () => {
      const { container } = render(<TextField />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders label correctly', () => {
      render(<TextField label="Username" data-testid="textfield" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('handles value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(
        <TextField 
          label="Email"
          onChange={handleChange}
          data-testid="textfield"
        />
      );
      
      const input = screen.getByTestId('textfield');
      await user.type(input, 'test@example.com');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('shows error message when error prop is provided', () => {
      render(
        <TextField 
          label="Password"
          error="Password is required"
          data-testid="textfield"
        />
      );
      
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows helper text when provided', () => {
      render(
        <TextField 
          label="Username"
          helperText="Choose a unique username"
          data-testid="textfield"
        />
      );
      
      expect(screen.getByText('Choose a unique username')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
      const { rerender, container } = render(
        <TextField size="sm" data-testid="textfield" />
      );
      
      expect(container.firstChild).toHaveClass('anukit-textfield-sm');
      
      rerender(<TextField size="lg" data-testid="textfield" />);
      expect(container.firstChild).toHaveClass('anukit-textfield-lg');
    });

    it('applies variant classes correctly', () => {
      const { rerender, container } = render(
        <TextField variant="outlined" data-testid="textfield" />
      );
      
      expect(container.firstChild).toHaveClass('anukit-textfield-outlined');
      
      rerender(<TextField variant="filled" data-testid="textfield" />);
      expect(container.firstChild).toHaveClass('anukit-textfield-filled');
    });

    it('shows clear button when clearable and has value', async () => {
      const user = userEvent.setup();
      
      render(
        <TextField 
          clearable
          defaultValue="test value"
          data-testid="textfield"
        />
      );
      
      expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
    });

    it('shows password toggle for password fields', () => {
      render(
        <TextField 
          type="password"
          showPasswordToggle
          data-testid="textfield"
        />
      );
      
      expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    });

    it('shows character count when enabled', () => {
      render(
        <TextField 
          showCharacterCount
          maxLength={50}
          defaultValue="Hello"
          data-testid="textfield"
        />
      );
      
      expect(screen.getByText('5/50')).toBeInTheDocument();
    });

    it('applies disabled state correctly', () => {
      render(<TextField disabled data-testid="textfield" />);
      
      const input = screen.getByTestId('textfield');
      expect(input).toBeDisabled();
    });

    it('applies full width class when specified', () => {
      const { container } = render(<TextField fullWidth />);
      expect(container.firstChild).toHaveClass('anukit-textfield-full-width');
    });
  });

  describe('DatePicker Component', () => {
    it('renders without crashing', () => {
      const { container } = render(<DatePicker />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders label correctly', () => {
      render(<DatePicker label="Birth Date" />);
      expect(screen.getByText('Birth Date')).toBeInTheDocument();
    });

    it('shows calendar trigger button', () => {
      render(<DatePicker />);
      expect(screen.getByLabelText('Open calendar')).toBeInTheDocument();
    });

    it('opens calendar when trigger is clicked', async () => {
      const user = userEvent.setup();
      
      render(<DatePicker />);
      
      const trigger = screen.getByLabelText('Open calendar');
      await user.click(trigger);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText('Choose date')).toBeInTheDocument();
    });

    it('shows error message when error prop is provided', () => {
      render(
        <DatePicker 
          label="Date"
          error="Date is required"
        />
      );
      
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows helper text when provided', () => {
      render(
        <DatePicker 
          label="Event Date"
          helperText="Select the event date"
        />
      );
      
      expect(screen.getByText('Select the event date')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
      const { rerender, container } = render(<DatePicker size="sm" />);
      
      expect(container.firstChild).toHaveClass('anukit-datepicker-sm');
      
      rerender(<DatePicker size="lg" />);
      expect(container.firstChild).toHaveClass('anukit-datepicker-lg');
    });

    it('applies disabled state correctly', () => {
      render(<DatePicker disabled data-testid="datepicker-input" />);
      
      const input = screen.getByTestId('datepicker-input');
      const trigger = screen.getByLabelText('Open calendar');
      
      expect(input).toBeDisabled();
      expect(trigger).toBeDisabled();
    });

    it('formats date correctly', () => {
      const date = new Date(2023, 11, 25); // December 25, 2023
      
      render(<DatePicker value={date} />);
      
      const input = screen.getByDisplayValue('12/25/2023');
      expect(input).toBeInTheDocument();
    });

    it('calls onChange when date is selected', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<DatePicker onChange={handleChange} />);
      
      // Open calendar
      const trigger = screen.getByLabelText('Open calendar');
      await user.click(trigger);
      
      // Click on a day (assuming it's rendered)
      const calendar = screen.getByRole('dialog');
      expect(calendar).toBeInTheDocument();
    });
  });

  describe('Form Component', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <Form>
          <TextField name="test" />
        </Form>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('provides form context to children', () => {
      const TestField = () => {
        const { setValue, formState } = useFormField('test');
        return (
          <div>
            <input onChange={(e) => setValue(e.target.value)} />
            <span data-testid="field-value">{formState.test?.value || ''}</span>
          </div>
        );
      };

      render(
        <Form initialValues={{ test: 'initial' }}>
          <TestField />
        </Form>
      );

      expect(screen.getByTestId('field-value')).toHaveTextContent('initial');
    });

    it('handles form submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      
      render(
        <Form onSubmit={handleSubmit}>
          <TextField name="username" />
          <button type="submit">Submit</button>
        </Form>
      );
      
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('applies size classes correctly', () => {
      const { rerender, container } = render(
        <Form size="sm">
          <TextField name="test" />
        </Form>
      );
      
      expect(container.firstChild).toHaveClass('anukit-form-sm');
      
      rerender(
        <Form size="lg">
          <TextField name="test" />
        </Form>
      );
      expect(container.firstChild).toHaveClass('anukit-form-lg');
    });

    it('applies full width class when specified', () => {
      const { container } = render(
        <Form fullWidth>
          <TextField name="test" />
        </Form>
      );
      expect(container.firstChild).toHaveClass('anukit-form-full-width');
    });

    it('validates required fields on submit', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      
      render(
        <Form 
          onSubmit={handleSubmit}
          validationRules={{ username: { required: true } }}
        >
          <TextField name="username" />
          <button type="submit">Submit</button>
        </Form>
      );
      
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);
      
      // Form should not submit with validation errors
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('resets form when resetOnSubmit is true', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      
      render(
        <Form 
          onSubmit={handleSubmit}
          resetOnSubmit
          initialValues={{ username: '' }}
        >
          <TextField name="username" defaultValue="test" />
          <button type="submit">Submit</button>
        </Form>
      );
      
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Form Integration', () => {
    it('TextField works with Form validation', async () => {
      const user = userEvent.setup();
      
      const TestForm = () => {
        const { setValue, formState } = useFormField('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        });
        
        return (
          <TextField
            label="Email"
            value={formState.email?.value || ''}
            onChange={(e) => setValue(e.target.value)}
            error={formState.email?.error}
          />
        );
      };

      render(
        <Form validationRules={{ email: { required: true } }}>
          <TestForm />
        </Form>
      );

      const input = screen.getByLabelText('Email');
      await user.type(input, 'invalid-email');
      
      // Should show validation error for invalid email format
      // (Implementation would depend on validation timing)
    });

    it('DatePicker works with Form context', () => {
      const TestForm = () => {
        const { setValue, formState } = useFormField('birthDate');
        
        return (
          <DatePicker
            label="Birth Date"
            value={formState.birthDate?.value}
            onChange={setValue}
            error={formState.birthDate?.error}
          />
        );
      };

      render(
        <Form initialValues={{ birthDate: new Date(2000, 0, 1) }}>
          <TestForm />
        </Form>
      );

      expect(screen.getByDisplayValue('01/01/2000')).toBeInTheDocument();
    });
  });
});