import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request): Promise<Response> {
  try {
    // Extract query parameters
    const url = new URL(req.url);
    const menu: number = Number(url.searchParams.get("menu")) || 1;
    const pageParam = url.searchParams.get("page") || "1";
    const limitParam = url.searchParams.get("limit") || "10";
    const titleFilter = url.searchParams.get("title") || "";

    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);
    const skip = (page - 1) * limit;

    // Fetch filtered and paginated results
    const menus = await prisma.menuInventory.findMany({
      where: {
        menuId: menu,
        deletedAt: null,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderType: {
          select: {
            name: true, // Fetch only the name of OrderType
          },
        },
      },
    });


    // Fetch total count for pagination metadata
    const totalCount = await prisma.menu.count({
      where: {
        title: {
          contains: titleFilter, // Apply the same filter for total count
          mode: "insensitive",
        },
      },
    });

    // Fetch Menu Name
    const menuName = await prisma.menu.findMany({
      where: {
        id: menu,
      },
      select: {
        title: true,
      },
    });

    // Return results with metadata
    return new Response(
      JSON.stringify({
        menuName: menuName[0].title,
        data: menus,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
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
