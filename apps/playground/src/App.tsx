import React from 'react';
import { SSRProvider } from '@anukit/core';
import { MedicineTracker } from './components/MedicineTracker';

const App: React.FC = () => {
  return (
    <SSRProvider>
      <MedicineTracker />
    </SSRProvider>
  );
};

export default App;
