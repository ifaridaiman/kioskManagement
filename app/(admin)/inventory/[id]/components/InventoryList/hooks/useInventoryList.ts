/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";

interface OrderType {
  name: string;
  description: string;
}

export interface InventoryItem {
  quantity: number;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  order_type: OrderType;
}

interface ApiResponse {
  data: {
    id: string;
    title: string;
    description: string;
    price: string;
    inventory: InventoryItem[];
    assets: any[];
  };
}

export const useInventoryList = (menuId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [menuName, setMenuName] = useState<string>("");
  const [refresh, setRefresh] = useState<number>(0);

  const refreshInventories = () => {
    setRefresh((prev) => prev + 1);
  };

  const fetchInventories = async (): Promise<ApiResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menus/${menuId}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch inventories");
    }

    return response.json();
  };

  // ✅ Stable function with useCallback to prevent unnecessary re-fetches
  const getInventories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchInventories();

      // ✅ Ensure inventory exists and set default if empty
      const inventoryData = response.data.inventory || [];

      setInventories(inventoryData);
      setMenuName(response.data.title); // ✅ Updated to match API response
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [menuId, refresh]);

  const deleteInventory = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this inventory?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/inventories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete inventory");

      alert("Inventory deleted successfully!");
      refreshInventories(); // ✅ Refresh inventory safely
    } catch (error: any) {
      console.error("Error deleting inventory:", error);
      alert(error.message || "Error deleting inventory.");
    }
  };

  useEffect(() => {
    if (menuId) getInventories();
  }, [getInventories]);

  return { inventories, menuName, isLoading, refreshInventories, deleteInventory };
};
