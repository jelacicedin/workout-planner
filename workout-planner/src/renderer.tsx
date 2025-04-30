import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return <div>Hello from Electron React!</div>;
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
