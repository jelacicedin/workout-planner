import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from './components/Tabs';
import { ProfileTab } from './components/ProfileTab';

import './index.css';

const App = () => {
  const [tab, setTab] = useState('Profile');

  return (
    <div className="w-full h-full font-sans">
      <Tabs onTabChange={setTab} />
      <div className="p-4">
        {tab === 'Profile' && <ProfileTab />}
        {tab === 'Workout Log' && <div>Workout Log view</div>}
        {tab === 'Charts' && <div>Charts view</div>}
        {tab === 'AI Planner' && <div>AI Planner view</div>}
        
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);


