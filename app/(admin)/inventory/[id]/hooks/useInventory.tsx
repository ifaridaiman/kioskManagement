import { useContext } from "react";
import { InventoryContext } from "../context/InventoryContext";
import { InventoryContextProps } from "../context/InventoryContext";

// Custom hook for consuming the context
export const useInventory = (): InventoryContextProps => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within a InventoryProvider");
  }
  return context;
};
