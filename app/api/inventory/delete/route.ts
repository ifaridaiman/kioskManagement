import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request): Promise<Response> {
    try {
        // Parse the request body
        const body = await req.json();
        const { id } = body;

        // Validate the input
        if (!id || typeof id !== "number") {
            return new Response(JSON.stringify({ error: "ID is required and must be a number." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }


        // Update the inventory item in the database
        const updatedInventory = await prisma.menuInventory.update({
            where: { id },
            data: {
                deletedAt: new Date()
            },
        });

        // Return the updated inventory item
        return new Response(JSON.stringify(updatedInventory), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating inventory:", error);

        // Handle specific Prisma errors
        if (error.code === "P2025") {
            return new Response(JSON.stringify({ error: "inventory item not found." }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
