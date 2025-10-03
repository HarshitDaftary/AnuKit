import React, { useState, useRef } from 'react';
import {
  Button,
  Input,
  Modal,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Tooltip
} from '@optimui/components';
import {
  useAriaLive,
  useKeyboardNavigation,
  useFocusWithin,
  useReducedMotion
} from '@optimui/core';

/**
 * Comprehensive accessibility demonstration
 * Shows all accessibility features working together
 */
export const AccessibilityDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notifications: false,
    theme: 'light',
    newsletter: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Accessibility hooks
  const announce = useAriaLive('polite');
  const { focusWithin, containerRef } = useFocusWithin();
  const reducedMotion = useReducedMotion();

  // Refs for focus management
  const modalTriggerRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      announce(`Form validation failed. ${Object.keys(newErrors).length} errors found.`);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      announce('Form submitted successfully!');
      setIsModalOpen(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        notifications: false,
        theme: 'light',
        newsletter: false
      });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    announce('Settings modal opened');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    announce('Settings modal closed');
  };

  const { handleKeyDown } = useKeyboardNavigation({
    onEscape: () => {
      if (isModalOpen) {
        handleCloseModal();
      }
    },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold mb-2">OptimUI Accessibility Demo</h1>
        <p className="text-gray-600 mb-8">
          Comprehensive demonstration of accessibility features including ARIA support,
          keyboard navigation, screen reader compatibility, and reduced motion preferences.
        </p>
      </header>

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Skip to main content
      </a>

      <main id="main-content">
        {/* Reduced motion indicator */}
        {reducedMotion && (
          <div 
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md"
            role="status"
            aria-live="polite"
          >
            <p className="text-blue-800">
              <strong>Accessibility Notice:</strong> Reduced motion is enabled. 
              Animations and transitions have been minimized for your comfort.
            </p>
          </div>
        )}

        {/* Focus within demonstration */}
        <section 
          ref={containerRef}
          className={`mb-8 p-6 border-2 rounded-lg transition-colors ${
            focusWithin ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Interactive Controls</h2>
          <p className="text-gray-600 mb-4">
            This section demonstrates focus-within detection and various interactive components.
          </p>

          <div className="space-y-4">
            {/* Button examples */}
            <div className="space-x-4">
              <Button
                variant="primary"
                onClick={handleOpenModal}
                aria-describedby="settings-help"
              >
                Open Settings
              </Button>
              <p id="settings-help" className="text-sm text-gray-500 mt-1">
                Opens a modal dialog with user preferences
              </p>

              <Tooltip content="This action cannot be undone">
                <Button variant="danger" disabled>
                  Delete Account
                </Button>
              </Tooltip>

              <Button
                variant="secondary"
                loading
                aria-label="Saving your changes"
              >
                Saving...
              </Button>
            </div>

            {/* Form controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
                helperText="This will be displayed on your profile"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                helperText="We'll never share your email"
              />
            </div>

            {/* Checkbox and Switch */}
            <div className="space-y-3">
              <Checkbox
                label="Enable notifications"
                description="Receive updates about your account activity"
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  notifications: e.target.checked 
                }))}
              />

              <Switch
                label="Newsletter subscription"
                description="Get weekly updates about new features"
                checked={formData.newsletter}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  newsletter: e.target.checked 
                }))}
              />
            </div>

            {/* Radio group */}
            <RadioGroup label="Theme Preference" error={errors.theme}>
              <Radio
                name="theme"
                value="light"
                label="Light Theme"
                description="Clean and bright interface"
                checked={formData.theme === 'light'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  theme: e.target.value 
                }))}
              />
              <Radio
                name="theme"
                value="dark"
                label="Dark Theme"
                description="Easy on the eyes for long sessions"
                checked={formData.theme === 'dark'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  theme: e.target.value 
                }))}
              />
              <Radio
                name="theme"
                value="auto"
                label="Auto Theme"
                description="Follows your system preference"
                checked={formData.theme === 'auto'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  theme: e.target.value 
                }))}
              />
            </RadioGroup>
          </div>
        </section>

        {/* Keyboard navigation instructions */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Keyboard Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">General Navigation</h3>
              <ul className="space-y-1 text-gray-600">
                <li><kbd className="bg-white px-2 py-1 rounded border">Tab</kbd> - Move to next element</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Shift + Tab</kbd> - Move to previous element</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Enter</kbd> - Activate buttons/links</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Space</kbd> - Toggle checkboxes/switches</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Modal & Menu Navigation</h3>
              <ul className="space-y-1 text-gray-600">
                <li><kbd className="bg-white px-2 py-1 rounded border">Escape</kbd> - Close modal/menu</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Arrow Keys</kbd> - Navigate options</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Home</kbd> - First option</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">End</kbd> - Last option</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="User Settings"
        size="md"
        initialFocus={firstInputRef}
        finalFocus={modalTriggerRef}
        aria-describedby="modal-description"
      >
        <div id="modal-description" className="sr-only">
          Settings form for updating user preferences and account information
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={firstInputRef}
            label="Display Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            helperText="This is how others will see your name"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={errors.email}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Live region for announcements (hidden) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
};

export default AccessibilityDemo;