import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
    try {
        const { orderId, newStatus, newDeliveryMethod } = await req.json();

        // ✅ Validate required fields
        if (!orderId || !newStatus || !newDeliveryMethod) {
            return NextResponse.json(
                { error: "orderId, newStatus, and newDeliveryMethod are required." },
                { status: 400 }
            );
        }

        // ✅ Check if the order exists
        const existingOrder = await prisma.orders.findUnique({
            where: { id: orderId },
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: "Order not found." },
                { status: 404 }
            );
        }

        // ✅ Check if there is an existing status for this order
        const existingOrderStatus = await prisma.order_statuses.findFirst({
            where: { order_id: orderId },
            orderBy: { created_at: "desc" }, // Get the latest status
        });

        let updatedStatus;
        if (existingOrderStatus) {
            // ✅ Update existing status record
            updatedStatus = await prisma.order_statuses.update({
                where: { id: existingOrderStatus.id },
                data: { status: newStatus, created_at: new Date() }, // Update timestamp to reflect latest change
            });
        } else {
            return NextResponse.json(
                { error: "Order in order statuses not found." },
                { status: 404 }
            );
        }

        // ✅ Update `delivery_method` in `orders`
        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: { delivery_method: newDeliveryMethod },
        });

        return NextResponse.json(
            {
                message: "Order status updated successfully.",
                status: updatedStatus,
                order: updatedOrder,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
