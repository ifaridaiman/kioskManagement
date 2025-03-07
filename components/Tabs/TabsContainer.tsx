"use client";
import React, { useEffect, useState } from "react";
import { updateOrderType, clearOrder } from "@/store/slice/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setActiveTab } from "@/store/slice/navigationSlice";

interface Tab {
  id: string;
  label: string;
  description: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: Tab[];
  activeTab: string | null;
  // onTabChange: (tabId: string) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({ tabs, activeTab }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders);
  const [showModal, setShowModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<{ id: string; label: string } | null>(null);

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      dispatch(setActiveTab(tabs[0].id)); // ✅ Set first tab as default globally
      dispatch(updateOrderType(tabs[0].id)); // ✅ Set default order type when tabs load
    }
  }, [dispatch, tabs, activeTab]);

  const handleTabChange = (tabId: string, tabLabel: string) => {
    if (orders.length > 0) {
      setPendingTab({ id: tabId, label: tabLabel });
      setShowModal(true);
    } else {
      confirmTabChange(tabId);
    }
  };

  const confirmTabChange = (tabId: string) => {
    dispatch(clearOrder()); // ✅ Clear existing orders
    dispatch(updateOrderType(tabId)); // ✅ Update order type
    dispatch(setActiveTab(tabId)); // ✅ Update global active tab
    setShowModal(false);
    setPendingTab(null);
  };

  const activeTabDetails = tabs.find((tab) => tab.id === activeTab); // ✅ Find tab by `id`, not `label`

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 sticky top-0 z-10 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === tab.id
                ? "text-green-800 border-b-2 border-green-800"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange(tab.id, tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 px-4 h-full min-h-screen">
        {activeTabDetails && <p className="text-gray-600 text-xs mb-4">{activeTabDetails.description}</p>}
        {activeTabDetails && <div>{activeTabDetails.content}</div>}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <p className="text-lg font-semibold">Confirm Tab Change</p>
            <p className="text-gray-600 mt-2">
              Switching tabs will remove all selected orders. Are you sure?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => pendingTab && confirmTabChange(pendingTab.id)}
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
