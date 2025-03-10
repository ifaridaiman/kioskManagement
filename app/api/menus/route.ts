// app/api/menus/route.ts
import { NextResponse } from 'next/server';

// Define interfaces for the data structure
interface OrderType {
  name: string;
  description: string;
}

interface InventoryItem {
  quantity: number;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  order_type: OrderType;
}

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  inventory: InventoryItem[];
}

interface MenuCategory {
  id: string;
  title: string;
  description: string;
  menus: MenuItem[];
}

// Define the response type
interface MenusResponse {
  data: MenuCategory[];
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Extract query parameters
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page") || "1"; // Default to page 1
    const limitParam = url.searchParams.get("limit") || "10"; // Default to limit 10
    const titleFilter = url.searchParams.get("title") || ""; // Default to no filter

    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);
    const skip = (page - 1) * limit;

    // Fetch data from external API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
    }

    const data: MenusResponse = await response.json();

    // Consolidate all menus into one array
    const consolidatedMenus: MenuItem[] = data.data.flatMap((item) => item.menus);

    // Apply filtering by title (case insensitive)
    const filteredMenus = consolidatedMenus.filter((menu) =>
      menu.title.toLowerCase().includes(titleFilter.toLowerCase())
    );

    // Apply pagination
    const paginatedMenus = filteredMenus.slice(skip, skip + limit);

    // Calculate total count and total pages
    const totalCount = filteredMenus.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Return results with metadata (pagination)
    return new Response(
      JSON.stringify({
        data: paginatedMenus,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching menus:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
