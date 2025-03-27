import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestBody {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;

    const orderId = body.id;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing order ID" },
        { status: 400 }
      );
    }

    // Get order_items by order ID
    const orderItems = await prisma.order_items.findMany({
      where: {
        order_id: orderId,
      },
      select: {
        menu_inventory_id: true,
      },
    });

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: "No items found for this order" },
        { status: 404 }
      );
    }

    // Extract valid inventory IDs (filter out nulls just in case)
    const inventoryIds = orderItems
      .map((item) => item.menu_inventory_id)
      .filter((id): id is string => !!id); // type guard for non-null

    if (inventoryIds.length === 0) {
      return NextResponse.json(
        { error: "No valid menu_inventory_id found." },
        { status: 404 }
      );
    }

    // Query menu_inventories
    const inventories = await prisma.menu_inventories.findMany({
      where: {
        id: { in: inventoryIds },
      },
      select: {
        id: true,
        end_date: true,
      },
    });

    return NextResponse.json({ data: inventories }, { status: 200 });

  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
