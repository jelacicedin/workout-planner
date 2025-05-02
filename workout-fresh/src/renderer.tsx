import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from './components/Tabs';
import { ProfileTab } from './components/ProfileTab';
import 'react-calendar/dist/Calendar.css';

import './index.css';
import CalendarTab from './components/CalendarTab';

const App = () => {
  const [tab, setTab] = useState('Profile');

  return (
    <div className="w-full h-full font-sans">
      <Tabs onTabChange={setTab} />
      <div className="p-4">
        {tab === 'Profile' && <ProfileTab />}
        {tab === 'Workout Log' && <CalendarTab />}
        {tab === 'Charts' && <div>Charts view</div>}
        {tab === 'AI Planner' && <div>AI Planner view</div>}
        
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);


