import { useEffect, useState } from "react";

interface OrderType {
  name: string;
}

interface InventoryItem {
  id: number;
  dateStart: string;
  quantity: number;
  orderType: OrderType;
}

interface ApiResponse {
  menuName: string;
  data: InventoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useInventoryList = (menuId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [menuName, setMenuName] = useState<string>("");
  const [refresh, setRefresh] = useState<number>(0);

  const refreshInventories = () => {
    setRefresh((prev) => prev + 1);
  };

  const fetchInventories = async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse> => {
    const response = await fetch(
      `/api/inventory?menu=${menuId}&page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch inventories");
    }

    return response.json();
  };

  
  const getInventories = async () => {
    setIsLoading(true);
    try {
      const response = await fetchInventories(1, 10);
      setInventories(response.data);
      setMenuName(response.menuName);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInventory = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this inventory?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/inventory/delete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete inventory");

      alert("inventory deleted successfully!");
      refreshInventories(); // Refresh the inventory list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting inventory:", error);
      alert(error.message || "Error deleting inventory.");
    }
  };

  

  useEffect(() => {
    if (menuId) getInventories();
  }, [menuId, refresh]);

  return { inventories, menuName, isLoading, refreshInventories, deleteInventory  };
};
