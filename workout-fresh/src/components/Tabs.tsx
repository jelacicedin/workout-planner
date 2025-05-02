import React, { useState } from 'react';

const tabs = ['Profile', 'Workout Log', 'Charts', 'AI Planner'];

type Props = {
  onTabChange: (tab: string) => void;
};

export const Tabs = ({ onTabChange }: Props) => {
  const [selected, setSelected] = useState('Profile');

  return (
    <div className="flex space-x-4 border-b px-4 py-2 bg-gray-100">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`py-2 px-4 rounded-t-md text-sm font-medium ${
            selected === tab ? 'bg-white text-blue-600 border border-b-0' : 'text-gray-600'
          }`}
          onClick={() => {
            setSelected(tab);
            onTabChange(tab);
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
