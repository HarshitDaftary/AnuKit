# AnuKit Form Components

Complete form components with accessibility, validation, and consistent styling following AnuKit's performance-first approach.

## Components

### Select

A fully accessible select dropdown with options, validation, and customizable styling.

```tsx
import { Select } from '@anukit/components';

// Basic usage
<Select 
  options={[
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'py', label: 'Python' }
  ]}
  placeholder="Choose a language"
/>

// With validation
<Select 
  options={options}
  error="Please select a language"
  variant="error"
  required
/>

// Advanced features
<Select 
  options={options}
  leftIcon={<CodeIcon />}
  size="lg"
  loading={isLoading}
  helperText="This will affect your experience"
/>
```

#### Props

- `options` - Array of `{ value, label, disabled? }` objects
- `variant` - `'default' | 'error' | 'success'`
- `size` - `'sm' | 'md' | 'lg'`
- `error` - Error message string
- `helperText` - Helper text string
- `leftIcon` - Icon element for left side
- `placeholder` - Placeholder text
- `loading` - Shows loading state
- `fullWidth` - Takes full container width

### Textarea

Multi-line text input with auto-resize, character counting, and validation.

```tsx
import { Textarea } from '@anukit/components';

// Basic usage
<Textarea 
  placeholder="Enter your message..."
  rows={4}
/>

// Auto-resize
<Textarea 
  autoResize
  minRows={3}
  maxRows={8}
  placeholder="This will grow as you type..."
/>

// Character counter
<Textarea 
  maxLength={280}
  showCharacterCount
  placeholder="Tweet-like input..."
/>

// With validation
<Textarea 
  error="Message is required"
  variant="error"
  helperText="Please provide more details"
/>
```

#### Props

- `variant` - `'default' | 'error' | 'success'`
- `size` - `'sm' | 'md' | 'lg'`
- `error` - Error message string
- `helperText` - Helper text string
- `autoResize` - Automatically adjusts height
- `minRows` - Minimum number of rows
- `maxRows` - Maximum rows for auto-resize
- `showCharacterCount` - Displays character counter
- `fullWidth` - Takes full container width

### FormControl

Wrapper component for consistent form styling and accessibility.

```tsx
import { FormControl, Select, Textarea } from '@anukit/components';

// Basic wrapper
<FormControl 
  label="Programming Language"
  helperText="Choose your preferred language"
>
  <Select options={languageOptions} />
</FormControl>

// Required field
<FormControl 
  label="Description"
  required
  error="This field is required"
>
  <Textarea placeholder="Describe your project..." />
</FormControl>

// Custom sizing
<FormControl 
  label="Large Input"
  size="lg"
  fullWidth
>
  <Select options={options} size="lg" />
</FormControl>
```

#### Props

- `label` - Label text
- `error` - Error message
- `helperText` - Helper text
- `required` - Shows required indicator (*)
- `disabled` - Disabled state
- `size` - `'sm' | 'md' | 'lg'`
- `fullWidth` - Takes full container width
- `htmlFor` - Associates with form element ID

## Features

### Accessibility

- **ARIA Support**: Proper `aria-*` attributes for screen readers
- **Focus Management**: Keyboard navigation and focus indicators
- **Error Announcements**: `role="alert"` for error messages
- **Label Association**: Proper `htmlFor` and `id` connections
- **Required Fields**: Clear indication with `*` and ARIA

### Performance

- **Zero Dependencies**: No external UI library dependencies
- **CSS Variables**: Runtime theming without JavaScript
- **Tree Shaking**: Individual component imports
- **SSR Ready**: Server-side rendering compatible
- **Small Bundle**: < 5KB per component

### Styling

Form components use AnuKit's CSS variable system:

```css
/* CSS Variables for theming */
:root {
  --anukit-color-primary: #2563eb;
  --anukit-color-error: #dc2626;
  --anukit-color-success: #16a34a;
  --anukit-border-radius-md: 0.375rem;
  /* ... */
}
```

### Responsive Design

All form components support responsive behavior:

- Mobile-first CSS approach
- Touch-friendly target sizes
- Appropriate spacing on small screens
- Flexible layouts

### Validation States

Components support multiple validation states:

```tsx
// Error state
<Select variant="error" error="Required field" />

// Success state  
<Textarea variant="success" />

// Loading state
<Select loading />
```

## Examples

### Complete Form

```tsx
function ContactForm() {
  return (
    <Stack direction="vertical" spacing={4}>
      <FormControl label="Name" required>
        <Input placeholder="Your full name" />
      </FormControl>
      
      <FormControl label="Country" helperText="Where are you located?">
        <Select 
          options={countryOptions}
          placeholder="Select country"
        />
      </FormControl>
      
      <FormControl 
        label="Message" 
        required
        helperText="Tell us about your project"
      >
        <Textarea 
          autoResize
          minRows={3}
          maxRows={6}
          maxLength={500}
          showCharacterCount
          placeholder="Describe your needs..."
        />
      </FormControl>
    </Stack>
  );
}
```

### Dynamic Validation

```tsx
function DynamicForm() {
  const [errors, setErrors] = useState({});
  
  return (
    <FormControl 
      label="Email"
      error={errors.email}
      required
    >
      <Input 
        type="email"
        variant={errors.email ? 'error' : 'default'}
        onChange={validateEmail}
      />
    </FormControl>
  );
}
```

## Best Practices

1. **Use FormControl wrapper** for consistent styling and accessibility
2. **Provide helpful labels** and helper text
3. **Implement proper validation** with clear error messages  
4. **Use appropriate sizes** for your design system
5. **Test with keyboard navigation** and screen readers
6. **Consider character limits** for textareas
7. **Use loading states** for async operations

## CSS Classes

Form components generate optimized CSS classes:

- `.anukit-form-control` - Form control wrapper
- `.anukit-select` - Select component
- `.anukit-textarea` - Textarea component  
- `.anukit-form-error` - Error message styling
- `.anukit-form-helper` - Helper text styling

## TypeScript Support

All components include comprehensive TypeScript definitions:

```tsx
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  options?: SelectOption[];
  // ... additional props
}
```