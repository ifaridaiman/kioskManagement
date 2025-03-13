/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";



interface ApiResponse {
  menuName: string; // ✅ Menu title from the API response
  data: InventoryItem[]; // ✅ List of inventories
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Define the structure of an InventoryItem
export interface InventoryItem {
  id: string;
  menu_id: string;
  order_type_id: string;
  quantity: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  order_types?: {
    id: string;
    name: string;
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
      `/api/menus/inventory?menuId=${menuId}`
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
      console.log("Response: ", response);


      // ✅ Ensure data follows the correct response structure
      const inventoryData = response.data || [];
      const menuTitle = response.menuName || "Unknown Menu"; // Default fallback

      setInventories(inventoryData);
      setMenuName(menuTitle);
    } catch (err: any) {
      console.error("Error fetching inventories:", err);
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
