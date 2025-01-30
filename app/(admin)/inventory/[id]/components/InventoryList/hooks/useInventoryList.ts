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
      const data = await fetchInventories(1, 10);
      setInventories(data.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (menuId) getInventories();
  }, [menuId]);

  return { inventories, isLoading };
};
