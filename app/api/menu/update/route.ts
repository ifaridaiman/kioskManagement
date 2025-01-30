import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const body = await req.json();
    const { id, title, price } = body;

    // Validate the input
    if (!id || typeof id !== "number") {
      return new Response(JSON.stringify({ error: "ID is required and must be a number." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!title || typeof title !== "string") {
      return new Response(JSON.stringify({ error: "Title is required and must be a string." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (price === undefined || isNaN(Number(price))) {
      return new Response(JSON.stringify({ error: "Price is required and must be a number." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update the menu item in the database
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        title,
        price: parseFloat(price),
      },
    });

    // Return the updated menu item
    return new Response(JSON.stringify(updatedMenu), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.error("Error updating menu:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Menu item not found." }), {
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
