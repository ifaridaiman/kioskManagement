import React from "react";
// import { MdOutlineDelete } from "react-icons/md";
import { InventoryItem } from "./hooks/useInventoryList";

interface InventoryListProps {
  inventories: InventoryItem[];
  isLoading: boolean;
  // deleteInventory: (id: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({
  inventories,
  isLoading,
  // deleteInventory,
}) => {
  return (
    <table className="w-full rounded-tl-md border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 text-left px-4 text-gray-600 font-semibold">
            Date
          </th>
          <th className="py-2 text-left px-4 text-gray-600 font-semibold">
            Quantity
          </th>
          <th className="py-2 text-left px-4 text-gray-600 font-semibold">
            Order Type
          </th>
          <th className="py-2 text-left px-4 text-gray-600 font-semibold">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-500">
              Loading inventories...
            </td>
          </tr>
        ) : inventories.length > 0 ? (
          inventories.map((inventory, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">
                {inventory.start_date
                  ? new Date(inventory.start_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "N/A"}
              </td>
              <td className="px-4 py-2">{inventory.quantity}</td>
              <td className="px-4 py-2">
                {inventory.order_type?.name || "N/A"}
              </td>
              <td className="px-4 py-2 flex justify-center">
                {/* <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteInventory(inventory.start_date || "")} // Use an appropriate identifier
                >
                  <MdOutlineDelete size={20} />
                </button> */}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-500">
              No inventories found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InventoryList;
