import React, { ChangeEvent, ReactNode, useState, useEffect } from "react";
import { InventoryContext, InventoryState } from "./InventoryContext";

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showAddInventory, setShowAddInventory] = useState<boolean>(false);
  const [state, setState] = useState<InventoryState>({
    menuId: "", // Default empty, should be updated dynamically
    orderTypeId: "", // Ensure consistent type as a string
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",
    quantity: 0,
    orderType: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setState((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value.toString(),
    }));
  };

  const toggleShowAddInventoryModal = () => {
    setShowAddInventory((prev) => !prev);
  };

  // Debugging state updates
  useEffect(() => {
    console.log("Updated State:", state);
  }, [state]);

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
