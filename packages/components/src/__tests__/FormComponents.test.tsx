/**
 * Form Components Test
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select, Textarea, FormControl } from '../src/index';

describe('Form Components', () => {
  describe('Select Component', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    it('renders without crashing', () => {
      const { container } = render(
        <Select options={options} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders options correctly', () => {
      render(<Select options={options} data-testid="select" />);
      const select = screen.getByTestId('select');
      
      // Check if options are rendered
      options.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('applies error styles when error prop is provided', () => {
      render(
        <Select 
          options={options} 
          error="This field is required"
          data-testid="select"
        />
      );
      
      const select = screen.getByTestId('select');
      expect(select).toHaveClass('anukit-select-error');
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('displays placeholder when provided', () => {
      render(
        <Select 
          options={options} 
          placeholder="Select an option"
          data-testid="select"
        />
      );
      
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(
        <Select options={options} size="sm" data-testid="select" />
      );
      
      expect(screen.getByTestId('select')).toHaveClass('anukit-select-sm');
      
      rerender(<Select options={options} size="lg" data-testid="select" />);
      expect(screen.getByTestId('select')).toHaveClass('anukit-select-lg');
    });
  });

  describe('Textarea Component', () => {
    it('renders without crashing', () => {
      const { container } = render(<Textarea />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies error styles when error prop is provided', () => {
      render(
        <Textarea 
          error="This field is required"
          data-testid="textarea"
        />
      );
      
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('anukit-textarea-error');
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('shows character count when enabled', () => {
      render(
        <Textarea 
          showCharacterCount
          maxLength={100}
          value="Hello world"
          data-testid="textarea"
        />
      );
      
      expect(screen.getByText('11/100')).toBeInTheDocument();
    });

    it('handles auto-resize functionality', () => {
      const { container } = render(
        <Textarea autoResize minRows={3} data-testid="textarea" />
      );
      
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('anukit-textarea-auto-resize');
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(
        <Textarea size="sm" data-testid="textarea" />
      );
      
      expect(screen.getByTestId('textarea')).toHaveClass('anukit-textarea-sm');
      
      rerender(<Textarea size="lg" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('anukit-textarea-lg');
    });
  });

  describe('FormControl Component', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <FormControl label="Test Label">
          <input type="text" />
        </FormControl>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders label correctly', () => {
      render(
        <FormControl label="Test Label">
          <input type="text" />
        </FormControl>
      );
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      render(
        <FormControl label="Required Field" required>
          <input type="text" />
        </FormControl>
      );
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('displays error message when error prop is provided', () => {
      render(
        <FormControl 
          label="Test Field" 
          error="This field is required"
        >
          <input type="text" />
        </FormControl>
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('displays helper text when provided', () => {
      render(
        <FormControl 
          label="Test Field" 
          helperText="This is helper text"
        >
          <input type="text" />
        </FormControl>
      );
      
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('applies disabled styles when disabled', () => {
      const { container } = render(
        <FormControl label="Test Field" disabled>
          <input type="text" />
        </FormControl>
      );
      
      const formControl = container.firstChild as HTMLElement;
      expect(formControl).toHaveClass('anukit-form-control-disabled');
    });

    it('applies size classes correctly', () => {
      const { rerender, container } = render(
        <FormControl label="Test Field" size="sm">
          <input type="text" />
        </FormControl>
      );
      
      expect(container.firstChild).toHaveClass('anukit-form-control-sm');
      
      rerender(
        <FormControl label="Test Field" size="lg">
          <input type="text" />
        </FormControl>
      );
      expect(container.firstChild).toHaveClass('anukit-form-control-lg');
    });
  });

  describe('Form Component Integration', () => {
    it('works together with FormControl wrapper', () => {
      render(
        <FormControl 
          label="Select Option" 
          helperText="Choose one option"
          required
        >
          <Select 
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' }
            ]}
            placeholder="Select..."
          />
        </FormControl>
      );
      
      expect(screen.getByText('Select Option')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Choose one option')).toBeInTheDocument();
      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('FormControl passes accessibility props to children', () => {
      render(
        <FormControl 
          label="Test Field" 
          error="Error message"
          htmlFor="test-field"
        >
          <Textarea data-testid="textarea" />
        </FormControl>
      );
      
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('id', 'test-field');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('aria-describedby');
    });
  });
});