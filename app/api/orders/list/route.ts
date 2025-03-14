import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure Prisma client is set up

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const orderStatus = searchParams.get("orderStatus"); // Optional
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate pagination parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json({ error: "Invalid pagination values" }, { status: 400 });
    }

    // Get total count of orders (filtered by orderStatus if provided)
    const totalCount = await prisma.orders.count({
      where: orderStatus
        ? {
          order_statuses: {
            some: { status: orderStatus }, // Filter only if `orderStatus` is provided
          },
        }
        : {},
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated orders with latest order status and menu details
    const orders = await prisma.orders.findMany({
      where: {
        deleted_at: null, // ✅ Exclude soft-deleted orders
        ...(orderStatus
          ? {
            order_statuses: {
              some: { status: orderStatus },
            },
          }
          : {}),
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        order_statuses: {
          orderBy: { created_at: "desc" }, // Get the latest order status
          take: 1, // Only take the most recent status
        },
        customers: {
          select: { id: true, name: true, email: true },
        },
        order_items: {
          include: {
            menus: { select: { id: true, title: true, price: true } },
          },
        },
      },
    });

    // If no orders are found
    if (orders.length === 0) {
      return NextResponse.json(
        {
          message: "No orders found",
          data: [],
          meta: { total: 0, page, limit, totalPages: 0 },
        },
        { status: 404 }
      );
    }

    // Return structured response
    return NextResponse.json(
      {
        data: orders.map(order => ({
          id: order.id,
          customer: order.customers || null,
          payment_method: order.payment_method,
          delivery_method: order.delivery_method,
          created_at: order.created_at,
          status: order.order_statuses.length > 0 ? order.order_statuses[0].status : "Unknown",
          items: order.order_items.map(item => ({
            id: item.id,
            menu: item.menus,
            quantity: item.quantity,
          })),
        })),
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
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
