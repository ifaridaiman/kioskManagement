import React, { useState, useEffect, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import { useInventory } from "../../hooks/useInventory";

interface InventoryAddProps {
  menuId: string;
  refreshInventories: () => void;
}

const InventoryAdd: React.FC<InventoryAddProps> = ({ menuId, refreshInventories }) => {
  const { state, handleChange, toggleShowAddInventoryModal } = useInventory();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderTypes, setOrderTypes] = useState<{ id: number; name: string }[]>([]);
  const [fetchingOrderTypes, setFetchingOrderTypes] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch Order Types
  const fetchOrderTypes = useCallback(async () => {
    setFetchingOrderTypes(true);
    setFetchError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/types`);
      if (!response.ok) throw new Error("Failed to fetch order types.");
      
      const result = await response.json();
      setOrderTypes(result);
    } catch (error) {
      setFetchError((error as Error).message || "Error fetching order types.");
    } finally {
      setFetchingOrderTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderTypes();
  }, [fetchOrderTypes]);

  // Handle Submit
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/inventories/${menuId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuId, 
          order_type_id: state.orderTypeId,
          quantity: Number(state.quantity),
          start_date: state.dateStart ? new Date(state.dateStart) : new Date(),
          end_date: state.dateEnd ? new Date(state.dateEnd) : null,
          start_time: state.timeStart,
          end_time: state.timeEnd,
        }),
      });

      if (!response.ok) throw new Error("Failed to add inventory.");

      refreshInventories();
      toggleShowAddInventoryModal();
    } catch (error) {
      setSubmitError((error as Error).message || "Error adding inventory.");
    } finally {
      setLoading(false);
    }
  }, [menuId, state, refreshInventories, toggleShowAddInventoryModal]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Add Inventory</h2>
          <button onClick={toggleShowAddInventoryModal}>
            <IoMdClose className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Order Type */}
          <div>
            <label htmlFor="orderTypeId" className="block text-sm font-medium text-gray-700">
              Order Type
            </label>
            <select
              id="orderTypeId"
              name="orderTypeId"
              value={state.orderTypeId}
              onChange={handleChange}
              className="mt-1 px-4 h-11 text-base border w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              disabled={fetchingOrderTypes}
            >
              <option value="">Select Order Type</option>
              {fetchingOrderTypes ? (
                <option disabled>Loading...</option>
              ) : (
                orderTypes.map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))
              )}
            </select>
            {fetchError && <p className="text-red-500 text-sm mt-1">{fetchError}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Inventory Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={state.quantity}
              onChange={handleChange}
              className="mt-1 px-4 h-11 text-base border w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min={1}
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="dateStart" className="block text-sm font-medium text-gray-700">
              Inventory Start Date
            </label>
            <input
              type="date"
              id="dateStart"
              name="dateStart"
              value={state.dateStart}
              onChange={handleChange}
              className="mt-1 px-4 h-11 text-base border w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="timeStart" className="block text-sm font-medium text-gray-700">
              Inventory Start Time
            </label>
            <input
              type="time"
              id="timeStart"
              name="timeStart"
              value={state.timeStart}
              onChange={handleChange}
              className="mt-1 px-4 h-11 text-base border w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="dateEnd" className="block text-sm font-medium text-gray-700">
              Inventory Date Date
            </label>
            <input
              type="date"
              id="dateEnd"
              name="dateEnd"
              value={state.dateEnd}
              onChange={handleChange}
              className="mt-1 px-4 h-11 text-base border w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {/* End Date */}
          <div>
            <label htmlFor="timeEnd" className="block text-sm font-medium text-gray-700">
              Inventory End Time
            </label>
            <input
              type="time"
              id="timeEnd"
              name="timeEnd"
              value={state.timeEnd}
              onChange={handleChange}
              className="mt-1 px-4 h-11 text-base border w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Error Message */}
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 font-semibold rounded-md shadow w-full transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="px-4 py-2 text-gray-500 bg-gray-300 font-semibold rounded-md shadow hover:bg-gray-600 w-full"
              onClick={toggleShowAddInventoryModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryAdd;
