import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure Prisma client is set up

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const menuId = searchParams.get("menuId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    // Validate menuId
    if (!menuId) {
      return NextResponse.json({ error: "menuId is required" }, { status: 400 });
    }

    // Fetch menu details to get the menuName
    const menu = await prisma.menus.findUnique({
      where: { id: menuId }, // Ensure menu is not deleted
      select: { title: true }, // Get only the menu name (title)
    });

    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    // Get total count of inventory items
    const totalCount = await prisma.menu_inventories.count({
      where: { menu_id: menuId, deleted_at: null },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated inventory for the given menuId
    const paginatedInventories = await prisma.menu_inventories.findMany({
      where: { menu_id: menuId, deleted_at: null },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        end_date: 'asc'
      },
      include: {
        order_types: true, // Include order type details
      },
    });

    // If no inventory is found, return a structured response with empty data
    if (paginatedInventories.length === 0) {
      return NextResponse.json(
        {
          menuName: menu.title, // Menu name from the database
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        },
        { status: 404 }
      );
    }

    // Return structured response
    return NextResponse.json(
      {
        menuName: menu.title, // Menu name from the database
        data: paginatedInventories,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
