'use client'
import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: Tab[];
}

const TabsContainer: React.FC<TabsContainerProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === tab.label
                ? 'text-green-800 border-b-2 border-green-800'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs.map(
          (tab) =>
            activeTab === tab.label && (
              <div key={tab.label}>{tab.content}</div>
            )
        )}
      </div>
    </div>
  );
};

export default TabsContainer;
