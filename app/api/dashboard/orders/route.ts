import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // ✅ Extract the `date` query param (Expected format: YYYY-MM-DD)
    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get("date");

    // ✅ If `date` param exists, use it; otherwise, default to today's date
    const targetDate = selectedDate ? new Date(selectedDate) : new Date();
    targetDate.setHours(0, 0, 0, 0); // ✅ Start of selected day (ignoring time)

    // ✅ Convert to YYYY-MM-DD format for comparison
    const formattedDate = targetDate.toISOString().split("T")[0];

    console.log(`Fetching orders for end_date: ${formattedDate}`);

    // ✅ Fetch orders where any `menu_inventories.end_date` matches the selected date
    const orders = await prisma.orders.findMany({
      where: {
        order_items: {
          some: {
            menu_inventories: {
              end_date: {
                gte: new Date(`${formattedDate}T00:00:00.000Z`), // Start of the selected date
                lt: new Date(`${formattedDate}T23:59:59.999Z`),  // End of the selected date
              },
            },
          },
        },
        deleted_at: null, // ✅ Exclude soft-deleted orders
      },
      include: {
        order_statuses: {
          orderBy: { created_at: "desc" },
          take: 1, // ✅ Only latest status
        },
        customers: {
          select: { id: true, name: true, email: true },
        },
        order_items: {
          include: {
            menus: { select: { id: true, title: true, price: true } },
            menu_inventories: { select: { end_date: true } },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: `Orders for ${formattedDate} retrieved successfully (based on end_date).`,
        data: orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
