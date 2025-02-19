import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(): Promise<Response> {
    try {
        // Fetch all order types
        const orderTypes = await prisma.orderType.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return new Response(
            JSON.stringify({ data: orderTypes }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error fetching order types:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
