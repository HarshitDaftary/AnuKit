/**
 * FormSection and FormRow Tests
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormSection, FormRow, FormControl, TextField } from '../src/index';

describe('FormSection Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <FormSection>
        <TextField name="test" />
      </FormSection>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <FormSection title="Personal Information">
        <TextField name="test" />
      </FormSection>
    );
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <FormSection 
        title="Contact Details" 
        description="Please provide your contact information"
      >
        <TextField name="test" />
      </FormSection>
    );
    expect(screen.getByText('Please provide your contact information')).toBeInTheDocument();
  });

  it('does not render header when title and description are not provided', () => {
    const { container } = render(
      <FormSection>
        <TextField name="test" />
      </FormSection>
    );
    
    const header = container.querySelector('.anukit-form-section__header');
    expect(header).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormSection className="custom-section">
        <TextField name="test" />
      </FormSection>
    );
    expect(container.firstChild).toHaveClass('anukit-form-section');
    expect(container.firstChild).toHaveClass('custom-section');
  });

  it('renders children correctly', () => {
    render(
      <FormSection title="Test Section">
        <TextField name="field1" label="Field 1" />
        <TextField name="field2" label="Field 2" />
      </FormSection>
    );
    
    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(
      <FormSection title="Test">
        <div>Content</div>
      </FormSection>
    );
    
    expect(container.firstChild).toHaveClass('anukit-form-section');
    expect(container.querySelector('.anukit-form-section__header')).toBeInTheDocument();
    expect(container.querySelector('.anukit-form-section__title')).toBeInTheDocument();
    expect(container.querySelector('.anukit-form-section__content')).toBeInTheDocument();
  });
});

describe('FormRow Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <FormRow>
        <TextField name="test" />
      </FormRow>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default single column class', () => {
    const { container } = render(
      <FormRow>
        <TextField name="test" />
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('anukit-form-row');
  });

  it('applies 2-column class when columns={2}', () => {
    const { container } = render(
      <FormRow columns={2}>
        <TextField name="field1" />
        <TextField name="field2" />
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('anukit-form-row--2-cols');
  });

  it('applies 3-column class when columns={3}', () => {
    const { container } = render(
      <FormRow columns={3}>
        <TextField name="field1" />
        <TextField name="field2" />
        <TextField name="field3" />
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('anukit-form-row--3-cols');
  });

  it('applies 4-column class when columns={4}', () => {
    const { container } = render(
      <FormRow columns={4}>
        <TextField name="field1" />
        <TextField name="field2" />
        <TextField name="field3" />
        <TextField name="field4" />
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('anukit-form-row--4-cols');
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormRow className="custom-row" columns={2}>
        <TextField name="test" />
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('anukit-form-row');
    expect(container.firstChild).toHaveClass('anukit-form-row--2-cols');
    expect(container.firstChild).toHaveClass('custom-row');
  });

  it('renders multiple children correctly', () => {
    render(
      <FormRow columns={2}>
        <FormControl>
          <TextField name="firstName" label="First Name" />
        </FormControl>
        <FormControl>
          <TextField name="lastName" label="Last Name" />
        </FormControl>
      </FormRow>
    );
    
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
  });

  it('works with FormSection', () => {
    render(
      <FormSection title="Name Section">
        <FormRow columns={2}>
          <FormControl>
            <TextField name="firstName" label="First Name" />
          </FormControl>
          <FormControl>
            <TextField name="lastName" label="Last Name" />
          </FormControl>
        </FormRow>
      </FormSection>
    );
    
    expect(screen.getByText('Name Section')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
  });
});

describe('FormSection and FormRow Integration', () => {
  it('renders complex form structure without overlapping', () => {
    const { container } = render(
      <div>
        <FormSection 
          title="Personal Information" 
          description="Please provide your personal details"
        >
          <FormRow columns={2}>
            <FormControl>
              <TextField name="firstName" label="First Name" />
            </FormControl>
            <FormControl>
              <TextField name="lastName" label="Last Name" />
            </FormControl>
          </FormRow>
          <FormControl>
            <TextField name="email" label="Email Address" />
          </FormControl>
        </FormSection>
        
        <FormSection 
          title="Address" 
          description="Where do you live?"
        >
          <FormRow columns={3}>
            <FormControl>
              <TextField name="city" label="City" />
            </FormControl>
            <FormControl>
              <TextField name="state" label="State" />
            </FormControl>
            <FormControl>
              <TextField name="zip" label="ZIP Code" />
            </FormControl>
          </FormRow>
        </FormSection>
      </div>
    );
    
    // Verify all sections are rendered
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Please provide your personal details')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Where do you live?')).toBeInTheDocument();
    
    // Verify all fields are rendered
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('ZIP Code')).toBeInTheDocument();
    
    // Verify structure has correct CSS classes
    const sections = container.querySelectorAll('.anukit-form-section');
    expect(sections).toHaveLength(2);
    
    const rows = container.querySelectorAll('.anukit-form-row');
    expect(rows).toHaveLength(2);
  });

  it('handles 4-column layout correctly', () => {
    render(
      <FormRow columns={4}>
        <FormControl>
          <TextField name="q1" label="Q1" />
        </FormControl>
        <FormControl>
          <TextField name="q2" label="Q2" />
        </FormControl>
        <FormControl>
          <TextField name="q3" label="Q3" />
        </FormControl>
        <FormControl>
          <TextField name="q4" label="Q4" />
        </FormControl>
      </FormRow>
    );
    
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });
});
