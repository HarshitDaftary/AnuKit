import React from 'react';
import { SSRProvider } from '@anukit/core';
import PremiumThemeDemo from './components/PremiumThemeDemo';
import ButtonShowcase from './components/ButtonShowcase';

const App: React.FC = () => {
  return (
    <SSRProvider>
      <div>
        <PremiumThemeDemo />
        <div className="border-t border-gray-200 mt-16">
          <ButtonShowcase />
        </div>
      </div>
    </SSRProvider>
  );
};

export default App;
