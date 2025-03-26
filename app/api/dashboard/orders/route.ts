import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // ✅ Extract the `date` query param (Expected format: YYYY-MM-DD)
    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get("date");

    // ✅ If `date` param exists, use it; otherwise, default to today in GMT+8
    const targetDate = selectedDate ? new Date(selectedDate) : new Date();
    
    // ✅ Convert to GMT+8
    const gmtOffset = 8 * 60; // GMT+8 in minutes
    targetDate.setMinutes(targetDate.getMinutes() + gmtOffset);

    // ✅ Format as YYYY-MM-DD (After converting to GMT+8)
    const formattedDate = targetDate.toISOString().split("T")[0];

    console.log(`Fetching orders for GMT+8 end_date: ${formattedDate}`);

    // ✅ Calculate the correct start and end time range for GMT+8
    const startOfDay = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 0, 0, 0)); 
    const endOfDay = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 23, 59, 59, 999)); 

    // ✅ Fetch orders where any `menu_inventories.end_date` matches the selected date in GMT+8
    const orders = await prisma.orders.findMany({
      where: {
        status: "Paid",
        order_items: {
          some: {
            menu_inventories: {
              end_date: {
                gte: startOfDay, // Start of the day in GMT+8
                lt: endOfDay,  // End of the day in GMT+8
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
          select: { id: true, name: true, email: true, phone_number:true, address:true },
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
        message: `Orders for ${formattedDate} (GMT+8) retrieved successfully (based on end_date).`,
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
