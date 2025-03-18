import { NextResponse } from "next/server";
import { PrismaClient, customers, orders, order_items } from "@prisma/client";

const prisma = new PrismaClient();

// Define the expected request body structure
interface OrderRequest {
    phoneNumber: string;
    orderNumber: string;
}

// Define the response structure
interface OrderItem {
    menuTitle: string;
    quantity: number;
}

interface OrderResponse {
    orderNumber: string;
    phoneNumber: string;
    address: string;
    orderItems: OrderItem[];
}

// Type-safe API handler
export async function POST(req: Request): Promise<NextResponse> {
    try {
        // Parse request body safely
        const body: Partial<OrderRequest> = await req.json();
        const { phoneNumber, orderNumber } = body;

        // Validate request data
        if (!phoneNumber || !orderNumber) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find the customer by phone number (using `findFirst` because phone_number is NOT unique)
        const customer: customers | null = await prisma.customers.findFirst({
            where: { phone_number: phoneNumber },
        });


        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        // Find the order by orderNumber and match it with the customer's ID
        const order: (orders & { order_items: order_items[] }) | null = await prisma.orders.findFirst({
            where: {
                id: orderNumber, // Assuming orderNumber is stored as 'id'
            },
            include: {
                order_items: true, // Fetch related order items
            },
        });

        

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Format order items with menu title and quantity
        const formattedOrderItems: OrderItem[] = await Promise.all(
            order.order_items.map(async (item) => {
                const menuItem = await prisma.menus.findUnique({
                    where: { id: item.menu_id },
                });
        
                return {
                    menuTitle: menuItem ? menuItem.title : "Unknown Menu Item",
                    quantity: item.quantity,
                };
            })
        );
        

        // Create a type-safe response
        const responseData: OrderResponse = {
            orderNumber: order.id,
            phoneNumber: customer.phone_number,
            address: customer.address,
            orderItems: formattedOrderItems,
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error fetching order details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
