import React from 'react';
import { SSRProvider } from '@anukit/core';
import PremiumThemeDemo from './components/PremiumThemeDemo';
import ButtonShowcase from './components/ButtonShowcase';
import FormUsageExamples from '../../../examples/FormUsageExamples';

const App: React.FC = () => {
  return (
    <SSRProvider>
      <div>
        <PremiumThemeDemo />
        <div className="border-t border-gray-200 mt-16">
          <ButtonShowcase />
        </div>
        <div className="border-t border-gray-200 mt-16">
          <FormUsageExamples />
        </div>
      </div>
    </SSRProvider>
  );
};

export default App;
