import React, { ChangeEvent, ReactNode, useState } from "react";

import { InventoryContext, InventoryState } from "./InventoryContext";

// Provider component
export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showAddInventory, setShowAddInventory] = useState<boolean>(false);
  const [state, setState] = useState<InventoryState>({
    menuId: 0, // Default ID placeholder (should be updated dynamically)
    orderTypeId: 0, // Default ID placeholder
    dateStart: "", // Empty string for date input
    dateEnd: "", // Empty string for optional end date
    quantity: 0, // Default quantity
    orderType: "", // Empty string for order type
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setState((prev) => ({
      ...prev,
      [name]:
        type === "number" || name.includes("Id") ? Number(value) || "" : value,
    }));
  };

  const toggleShowAddInventoryModal = () => {
    setShowAddInventory((prev) => !prev);
  };
  return (
    <InventoryContext.Provider
      value={{
        state,
        setState,
        handleChange,
        showAddInventory,
        toggleShowAddInventoryModal,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
