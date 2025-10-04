import React from 'react';
import { Button, TextField } from '@anukit/components';

const ButtonShowcase: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Enhanced AnuKit Buttons</h2>
        <p className="text-gray-600 mb-8">
          Premium button components inspired by Ant Design with gradients, shadows, and smooth interactions.
        </p>
      </div>

      {/* Variants */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* Loading States */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Loading States</h3>
          <div className="flex flex-wrap gap-4">
            <Button loading>Loading Primary</Button>
            <Button variant="secondary" loading>Loading Secondary</Button>
            <Button variant="ghost" loading>Loading Ghost</Button>
          </div>
        </div>

        {/* Disabled States */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Disabled States</h3>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
            <Button variant="danger" disabled>Disabled Danger</Button>
          </div>
        </div>

        {/* Interactive Examples */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Examples</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form Example */}
            <div className="p-6 border rounded-lg">
              <h4 className="font-medium mb-4">Form Actions</h4>
              <div className="space-y-4">
                <TextField
                  placeholder="Enter your name"
                  size="md"
                  fullWidth
                />
                <div className="flex gap-3">
                  <Button>Submit</Button>
                  <Button variant="ghost">Cancel</Button>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-6 border rounded-lg">
              <h4 className="font-medium mb-4">Card Actions</h4>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Perform actions on this item with different button styles.
                </p>
                <div className="flex gap-3">
                  <Button size="sm">Edit</Button>
                  <Button variant="secondary" size="sm">View</Button>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;