import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required." },
        { status: 400 }
      );
    }

    // ✅ Check if order exists
    const existingOrder = await prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // ✅ Soft delete the order (set deleted_at timestamp)
    const softDeletedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: { deleted_at: new Date() }, // Marks order as deleted
    });

    return NextResponse.json(
      {
        message: "Order soft deleted successfully.",
        order: softDeletedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error soft deleting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
