import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        const status = body?.status || "ready_to_pickup";

        const todayDate = new Date();
        console.log("Today's Date:", todayDate);

        const orders = await prisma.orders.findMany({
            where: {
                order_statuses: {
                    some: {
                        status: status,
                    },
                },
                status:"Paid"
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
                        menu_inventories: {
                            select: {
                                end_date: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        // Filter orders where endDate is still valid
        const validOrders = orders.filter(order =>
            order.order_items.some(item => {
                const endDate = item.menu_inventories?.end_date;
                if (!endDate) return false;  // Skip if there's no endDate
        
                // Convert both dates to YYYY-MM-DD format (ignore time)
                const endDateFormatted = new Date(endDate).toISOString().split("T")[0];
                const todayFormatted = todayDate.toISOString().split("T")[0];
        
                console.log("End Date:", endDateFormatted);
                console.log("Today Date:", todayFormatted);
        
                return endDateFormatted === todayFormatted;  // Compare only YYYY-MM-DD
            })
        );

        // If no valid orders exist, return an empty response with a message
        if (validOrders.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: "No valid orders for today" },
                { status: 200 }
            );
        }

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
