import { ChangeEvent, createContext } from "react";

export interface InventoryState {
  menuId: number;
  orderTypeId: number;
  dateStart: string;
  dateEnd: string;
  quantity: number;
  orderType: string;
}

// Define the shape of the context
export interface InventoryContextProps {
  state: InventoryState;
  setState: React.Dispatch<React.SetStateAction<InventoryState>>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  showAddInventory: boolean;
  toggleShowAddInventoryModal: () => void;
}

// Create the context
export const InventoryContext = createContext<
  InventoryContextProps | undefined
>(undefined);
