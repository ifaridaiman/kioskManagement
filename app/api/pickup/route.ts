import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        
        // Default status to "ready_to_pickup" if not provided
        const status = body?.status || "ready_to_pickup";

        // Fetch orders based on the provided status
        const orders = await prisma.orders.findMany({
            where: {
                order_statuses: {
                    some: {
                        status: status,
                    },
                },
            },
            select: {
                id: true,
                customer_id: true,
                order_type_id: true,
                payment_id: true,
                payment_method: true,
                delivery_method: true,
                created_at: true,
                updated_at: true,
                status: true,
                customers: {
                    select: {
                        name: true,
                        phone_number: true,
                        email: true,
                        address: true,
                    },
                },
                order_statuses: {
                    select: {
                        status: true,
                        created_at: true,
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                },
                order_items: {
                    select: {
                        id: true,
                        quantity: true,
                        menus: {
                            select: {
                                title: true,
                                price: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        return NextResponse.json(
            { success: true, data: orders },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
