import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const body = await req.json();
    const { title, description, price } = body;

    // Validate the input
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

    // Create the menu item in the database
    const newMenu = await prisma.menu.create({
      data: {
        title,
        description,
        price: parseFloat(price),
      },
    });

    // Return the created menu item
    return new Response(JSON.stringify(newMenu), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
