import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { orderId } = body;

        // Validate required fields
        if (!orderId) {
            return new Response(
                JSON.stringify({ error: "Order ID is required." }),
                { status: 400 }
            );
        }

        // Find order by orderId and include related customer, order status, and order items
        const order = await prisma.order.findUnique({
            where: { orderId },
            include: {
                customer: true,
                orderStatus: {
                    select: {
                        status: true,
                        createdAt: true,
                    }
                },
                orderItems: {
                    select: {
                        quantity: true,
                        menu: {
                            select: {
                                title: true,
                                price: true,
                            }
                        }
                    }
                }
            },
        });

        if (!order) {
            return new Response(
                JSON.stringify({ error: "Order not found." }),
                { status: 404 }
            );
        }

        // Format response
        const formattedResponse = {
            data: {
                orderId: order.orderId,
                customer: {
                    name: order.customer.name,
                },
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
