import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { phoneNumber } = body;

        // Validate required fields
        if (!phoneNumber) {
            return new Response(
                JSON.stringify({ error: "Phone Number is required." }),
                { status: 400 }
            );
        }

        // Find customer by phoneNumber and include related orders, order status, and order items
        const customer = await prisma.customer.findFirst({
            where: { phoneNumber },
            include: {
                orders: {
                    include: {
                        orderStatus: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            take: 1
                        },
                        orderItems: {
                            include: {
                                menu: true,
                            },
                        },
                    },
                },
            },
        });

        if (!customer || customer.orders.length === 0) {
            return new Response(
                JSON.stringify({ error: "Order not found." }),
                { status: 404 }
            );
        }

        const orders = customer.orders;

        // Separate orders into active orders and history (completed orders)
        const activeOrders = orders.filter(order => 
            order.orderStatus[0].status !== 'COMPLETED'
        );
        const historyOrders = orders.filter(order => 
            order.orderStatus[0].status === 'COMPLETED'
        );

        // Format response
        const formattedResponse = {
            data: {
                customer: {
                    name: customer.name,
                },
                orders: activeOrders.map(order => ({
                    orderId: order.orderId,
                    orderStatus: order.orderStatus.map(status => ({
                        status: status.status,
                        createdAt: status.createdAt,
                    })),
                    orderItems: order.orderItems.map(item => ({
                        menu: {
                            title: item.menu.title,
                            price: item.menu.price,
                        },
                        quantity: item.quantity,
                    })),
                })),
                history: historyOrders.map(order => ({
                    orderId: order.id,
                    orderStatus: order.orderStatus.map(status => ({
                        status: status.status,
                        createdAt: status.createdAt,
                    })),
                    orderItems: order.orderItems.map(item => ({
                        menu: {
                            title: item.menu.title,
                            price: item.menu.price,
                        },
                        quantity: item.quantity,
                    })),
                })),
            },
        };

        return new Response(JSON.stringify(formattedResponse), { status: 200 });
    } catch (error) {
        console.error("Error fetching order:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}