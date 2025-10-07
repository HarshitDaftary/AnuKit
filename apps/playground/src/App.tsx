import React from 'react';
import { SSRProvider } from '@anukit/core';
import PremiumThemeDemo from './components/PremiumThemeDemo';
import ButtonShowcase from './components/ButtonShowcase';
import FormDemo from './components/FormDemo';

const App: React.FC = () => {
  return (
    <SSRProvider>
      <div>
        <FormDemo />
        <div className="border-t border-gray-200 mt-16">
          <PremiumThemeDemo />
        </div>
        <div className="border-t border-gray-200 mt-16">
          <ButtonShowcase />
        </div>
      </div>
    </SSRProvider>
  );
};

export default App;
