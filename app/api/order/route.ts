import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request): Promise<Response> {
    try {
        // Extract query parameters
        const url = new URL(req.url);
        const pageParam = url.searchParams.get("page") || "1";
        const limitParam = url.searchParams.get("limit") || "10";
        const orderIdFilter = url.searchParams.get("orderId") || "";
        const orderTypeFilter = url.searchParams.get("orderType");

        const page = parseInt(pageParam, 10);
        const limit = parseInt(limitParam, 10);
        const skip = (page - 1) * limit;

        // Construct filters for Prisma query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filterOptions: any = {};

        if (orderIdFilter) {
            filterOptions.orderId = { equals: orderIdFilter };
        }

        if (orderTypeFilter) {
            filterOptions.orderTypeId = Number(orderTypeFilter);
        }


        // Fetch filtered and paginated orders
        const orders = await prisma.order.findMany({
            where: filterOptions,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                customer: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true,
                        address: true,
                    },
                },
                orderStatus: {
                    select: {
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: "desc" }, // Get the latest first
                    take: 1, // Only return the most recent status
                },
                orderItems: {
                    select: {
                        quantity: true,
                        menu: {
                            select: { title: true, price: true },
                        },
                    },
                },
                orderType: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Fetch total count for pagination metadata
        const totalCount = await prisma.order.count({ where: filterOptions });

        // Return results with metadata
        return new Response(
            JSON.stringify({
                data: orders,
                meta: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit),
                },
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
