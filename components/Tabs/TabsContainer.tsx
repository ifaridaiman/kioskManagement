'use client'
import React, { useState, useEffect } from 'react';
import { updateOrderType, clearOrder } from "@/store/slice/orderSlice"; // Import actions
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface Tab {
  id: string;
  label: string;
  description: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: Tab[];
}

const TabsContainer: React.FC<TabsContainerProps> = ({ tabs }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders);

  // Set the default active tab to the first tab
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const [showModal, setShowModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<{ id: string; label: string } | null>(null);

  useEffect(() => {
    dispatch(updateOrderType(tabs[0].id)); // Set default order type on mount
  }, [dispatch, tabs]);

  const handleTabChange = (tabId: string, tabLabel: string) => {
    if (orders.length > 0) {
      setPendingTab({ id: tabId, label: tabLabel });
      setShowModal(true);
    } else {
      confirmTabChange(tabId, tabLabel);
    }
  };

  const confirmTabChange = (tabId: string, tabLabel: string) => {
    dispatch(clearOrder()); // Clear existing orders
    dispatch(updateOrderType(tabId));
    setActiveTab(tabLabel);
    setShowModal(false);
    setPendingTab(null);
  };

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
            onClick={() => handleTabChange(tab.id, tab.label)}
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <p className="text-lg font-semibold">Confirm Tab Change</p>
            <p className="text-gray-600 mt-2">Switching tabs will remove all selected orders. Are you sure?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => pendingTab && confirmTabChange(pendingTab.id, pendingTab.label)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabsContainer;
