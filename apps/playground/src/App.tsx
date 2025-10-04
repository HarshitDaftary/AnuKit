import React, { useState } from 'react';
import {
  Button,
  Input,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
  Modal
} from '@anukit/components';
import { SSRProvider } from '@anukit/core';

const ComponentShowcase: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [indeterminateValue, setIndeterminateValue] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchValue, setSwitchValue] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">OptimUI Components</h1>
        <p className="text-lg text-gray-600">
          A comprehensive showcase of all base primitive components
        </p>
      </header>

      {/* Button Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Buttons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Variants</h3>
            <div className="space-y-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Sizes</h3>
            <div className="space-y-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">States</h3>
            <div className="space-y-2">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Interactive</h3>
            <div className="space-y-2">
              <Button onClick={() => setShowModal(true)}>Open Modal</Button>
              <Tooltip content="This is a helpful tooltip">
                <Button variant="secondary">Hover me</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Inputs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Basic Inputs</h3>
            <Input
              label="Username"
              placeholder="Enter your username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="user@example.com"
              helperText="We'll never share your email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error="Password must be at least 8 characters"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Sizes & Variants</h3>
            <Input size="sm" placeholder="Small input" />
            <Input size="md" placeholder="Medium input" />
            <Input size="lg" placeholder="Large input" />
            <Input variant="success" placeholder="Success state" />
          </div>
        </div>
      </section>

      {/* Checkbox Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Checkboxes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Basic Checkboxes</h3>
            <Checkbox
              label="Terms and Conditions"
              description="I agree to the terms and conditions"
              checked={checkboxValue}
              onChange={(e) => setCheckboxValue(e.target.checked)}
            />
            <Checkbox
              label="Newsletter"
              description="Subscribe to our newsletter"
            />
            <Checkbox
              label="Indeterminate"
              indeterminate={indeterminateValue}
              onChange={() => setIndeterminateValue(!indeterminateValue)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Sizes</h3>
            <Checkbox size="sm" label="Small checkbox" />
            <Checkbox size="md" label="Medium checkbox" />
            <Checkbox size="lg" label="Large checkbox" />
            <Checkbox label="Error state" error="This field is required" />
          </div>
        </div>
      </section>

      {/* Radio Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Radio Buttons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Radio Group</h3>
            <RadioGroup label="Choose your plan">
              <Radio
                name="plan"
                value="option1"
                label="Free Plan"
                description="Perfect for getting started"
                checked={radioValue === 'option1'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
              <Radio
                name="plan"
                value="option2"
                label="Pro Plan"
                description="For growing businesses"
                checked={radioValue === 'option2'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
              <Radio
                name="plan"
                value="option3"
                label="Enterprise Plan"
                description="For large organizations"
                checked={radioValue === 'option3'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Sizes</h3>
            <Radio size="sm" name="size" label="Small radio" />
            <Radio size="md" name="size" label="Medium radio" />
            <Radio size="lg" name="size" label="Large radio" />
          </div>
        </div>
      </section>

      {/* Switch Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Switches</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Basic Switches</h3>
            <Switch
              label="Enable notifications"
              description="Receive push notifications"
              checked={switchValue}
              onChange={(e) => setSwitchValue(e.target.checked)}
            />
            <Switch
              label="Dark mode"
              labelPosition="left"
            />
            <Switch label="Error state" error="This setting is required" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Sizes</h3>
            <Switch size="sm" label="Small switch" />
            <Switch size="md" label="Medium switch" />
            <Switch size="lg" label="Large switch" />
          </div>
        </div>
      </section>

      {/* Tooltip Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Tooltips</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Tooltip Placements</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="Top tooltip" placement="top">
                <Button variant="secondary">Top</Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" placement="bottom">
                <Button variant="secondary">Bottom</Button>
              </Tooltip>
              <Tooltip content="Left tooltip" placement="left">
                <Button variant="secondary">Left</Button>
              </Tooltip>
              <Tooltip content="Right tooltip" placement="right">
                <Button variant="secondary">Right</Button>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Interactive Elements</h3>
            <div className="space-y-4">
              <Tooltip content="This input accepts your name">
                <Input placeholder="Hover over me" />
              </Tooltip>
              <Tooltip content="Check this to agree to terms">
                <Checkbox label="Terms and conditions" />
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Demo Modal"
      >
        <div className="space-y-4">
          <p>This is a demo modal showcasing the Modal component.</p>
          <Input label="Modal Input" placeholder="Type something..." />
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SSRProvider>
      <div className="min-h-screen bg-gray-50">
        <ComponentShowcase />
      </div>
    </SSRProvider>
  );
};

export default App;