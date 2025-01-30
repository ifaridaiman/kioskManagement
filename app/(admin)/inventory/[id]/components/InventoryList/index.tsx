import React from "react";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";

interface OrderType {
  name: string;
}

interface InventoryItem {
  id: number;
  dateStart: string;
  quantity: number;
  orderType: OrderType;
}

interface InventoryListProps {
  inventories: InventoryItem[];
  isLoading: boolean;
}

const InventoryList: React.FC<InventoryListProps> = ({
  inventories,
  isLoading,
}) => {
  return (
    <table className="w-full rounded-tl-md">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 text-left px-4 text-gray-500 font-semibold">
            Date
          </th>
          <th className="py-2 text-left px-4 text-gray-500 font-semibold">
            Quantity
          </th>
          <th className="py-2 text-left px-4 text-gray-500 font-semibold">
            Order Type
          </th>
          <th className="py-2 text-left px-4 text-gray-500 font-semibold">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={4} className="text-center py-4">
              Loading inventories...
            </td>
          </tr>
        ) : inventories.length > 0 ? (
          inventories.map((inventory) => (
            <tr key={inventory.id}>
              <td className="px-4 py-2">
                {new Date(inventory.dateStart).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-2">{inventory.quantity}</td>
              <td className="px-4 py-2">{inventory.orderType.name}</td>
              <td className="px-4 py-2 flex flex-row gap-4">
                <button>
                  <LuPencilLine />
                </button>
                <button>
                  <MdOutlineDelete />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center py-4">
              No inventories found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InventoryList;
