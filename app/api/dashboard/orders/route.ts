import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ✅ Get the current date in GMT+8
    const now = new Date();
    const offset = 4 * 60 * 60 * 1000; // ✅ GMT+4 offset in milliseconds

    const today = new Date(now.getTime() + offset);
    today.setHours(0, 0, 0, 0); // ✅ Start of today in GMT+8

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // ✅ Start of tomorrow in GMT+8

    // ✅ Convert to UTC for Prisma query
    const todayUTC = today.toISOString();
    const tomorrowUTC = tomorrow.toISOString();

    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: todayUTC, // ✅ Orders created at or after today (GMT+8)
          lt: tomorrowUTC, // ✅ Orders before tomorrow (GMT+8)
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
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Orders for today retrieved successfully (GMT+8).",
        data: orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
