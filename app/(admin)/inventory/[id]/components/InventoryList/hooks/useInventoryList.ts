import { useEffect, useState, useCallback } from "react";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 5;

  const refreshInventories = () => {
    setRefresh((prev) => prev + 1);
  };

  const fetchInventories = async (): Promise<ApiResponse> => {
    const response = await fetch(
      `/api/menus/inventory?menuId=${menuId}&page=${currentPage}&limit=${itemsPerPage}`
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to fetch inventories");
    }

    return response.json();
  };

  const getInventories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchInventories();
      setInventories(response.data || []);
      setMenuName(response.menuName || "Unknown Menu");
      setTotalPages(response.meta.totalPages || 1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching inventories:", error.message);
        alert(error.message);
      } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [menuId, refresh, currentPage]);

  const deleteInventory = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this inventory?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/inventories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to delete inventory");
      }

      alert("Inventory deleted successfully!");
      refreshInventories();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting inventory:", error.message);
        alert(error.message);
      } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if (menuId) getInventories();
  }, [getInventories]);

  return {
    inventories,
    menuName,
    isLoading,
    refreshInventories,
    deleteInventory,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
