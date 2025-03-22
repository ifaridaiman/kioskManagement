import React from "react";
import { InventoryItem } from "./hooks/useInventoryList";
import { MdOutlineDelete } from "react-icons/md";

interface InventoryListProps {
  inventories: InventoryItem[];
  isLoading: boolean;
  deleteInventory: (id: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const InventoryList: React.FC<InventoryListProps> = ({
  inventories,
  isLoading,
  deleteInventory,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  return (
    <>
    <div className="overflow-auto mx-4">
      <table className="min-w-full w-full rounded-tl-md border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 text-left px-4 text-gray-600 font-semibold">Date Pickup</th>
            <th className="py-2 text-left px-4 text-gray-600 font-semibold">Quantity</th>
            <th className="py-2 text-left px-4 text-gray-600 font-semibold">Order Type</th>
            <th className="py-2 text-left px-4 text-gray-600 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">Loading inventories...</td>
            </tr>
          ) : inventories.length > 0 ? (
            inventories.map((inventory) => (
              <tr key={inventory.id} className="border-t">
                <td className="px-4 py-2">
                  {inventory.end_date
                    ? new Date(inventory.end_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="px-4 py-2">{inventory.quantity}</td>
                <td className="px-4 py-2">{inventory.order_types?.name || "N/A"}</td>
                <td className="px-4 py-2 flex justify-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteInventory(inventory.id)}
                  >
                    <MdOutlineDelete size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">No inventories found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {/* Pagination Controls */}
    <div className="flex justify-between items-center mt-4 mx-4">
        <button
          className={`px-4 py-2 text-white bg-gray-500 rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className={`px-4 py-2 text-white bg-gray-500 rounded-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
    
  );
};

export default InventoryList;
