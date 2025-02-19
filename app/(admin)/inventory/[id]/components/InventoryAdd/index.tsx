import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useInventory } from "../../hooks/useInventory";
import { useEffect } from "react";
interface InventoryAddProps {
  menuId: number;
  refreshInventories: () => void;
}

const InventoryAdd: React.FC<InventoryAddProps> = ({
  menuId,
  refreshInventories,
}) => {
  const { state, handleChange, toggleShowAddInventoryModal } = useInventory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderTypes, setOrderTypes] = useState<{ id: number; name: string }[]>([]);
  const [fetchingOrderTypes, setFetchingOrderTypes] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/inventory/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuId, // Received from props
          orderTypeId: state.orderTypeId,
          quantity: Number(state.quantity),
          dateStart: state.dateStart ? new Date(state.dateStart) : new Date(),
          dateEnd: state.dateEnd ? new Date(state.dateEnd) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add inventory.");
      }
      refreshInventories();
      toggleShowAddInventoryModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrderTypes = async () => {
      setFetchingOrderTypes(true);
      try {
        const response = await fetch("/api/enum/orderType");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch order types.");
        }

        setOrderTypes(result.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching order types.");
      } finally {
        setFetchingOrderTypes(false);
      }
    };

    fetchOrderTypes();
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-10 absolute top-0 left-0">
      <div className="bg-white p-4 rounded min-w-80">
        <div className="flex items-bottom justify-between">
          <p className="font-bold text-gray-700">Add Inventory</p>
          <button onClick={toggleShowAddInventoryModal}>
            <IoMdClose className="text-xl" />
          </button>
        </div>

        <div className="py-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="orderTypeId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Type
                </label>
                <select
                  id="orderTypeId"
                  name="orderTypeId"
                  value={state.orderTypeId}
                  onChange={handleChange}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Order Type</option>
                  {fetchingOrderTypes ? (
                    <option disabled>Loading...</option>
                  ) : (
                    orderTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Inventory Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={state.quantity}
                  onChange={handleChange}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="dateStart"
                  className="block text-sm font-medium text-gray-700"
                >
                  Inventory Start Date
                </label>
                <input
                  type="date"
                  id="dateStart"
                  name="dateStart"
                  value={state.dateStart}
                  onChange={handleChange}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="dateEnd"
                  className="block text-sm font-medium text-gray-700"
                >
                  Inventory End Date
                </label>
                <input
                  type="date"
                  id="dateEnd"
                  name="dateEnd"
                  value={state.dateEnd}
                  onChange={handleChange}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 font-semibold rounded-md shadow w-full ${
                  loading
                    ? "bg-gray-400"
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
    </div>
  );
};

export default InventoryAdd;
