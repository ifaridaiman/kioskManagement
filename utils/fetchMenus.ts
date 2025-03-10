export interface MenuItem {
    id: number;
    title: string;
    description:string;
    price: number;
  }
  
  export interface ApiResponse {
    data: MenuItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export const fetchMenus = async (page = 1, limit = 10, title = ""): Promise<ApiResponse> => {
    const response = await fetch(
      `/api/menus?page=${page}&limit=${limit}&title=${encodeURIComponent(title)}`
    );
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch menus");
    }
  
    return response.json();
  };
  