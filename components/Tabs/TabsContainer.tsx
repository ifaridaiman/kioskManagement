'use client'
import React, { useState } from 'react';

interface Tab {
  label: string;
  description: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: Tab[];
}

const TabsContainer: React.FC<TabsContainerProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  // Find the active tab's details
  const activeTabDetails = tabs.find((tab) => tab.label === activeTab);

  return (
    <div>
      <div className="flex border-b border-gray-200 sticky top-0 z-10 bg-white">
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

      <div className="mt-4 px-4 h-full min-h-screen">
        {/* Display description of the active tab */}
        {activeTabDetails && <p className="text-gray-600 text-xs mb-4">{activeTabDetails.description}</p>}
        
        {/* Display content of the active tab */}
        {activeTabDetails && <div>{activeTabDetails.content}</div>}
      </div>
    </div>
  );
};

export default TabsContainer;
