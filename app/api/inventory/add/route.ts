import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { menuId, orderTypeId, quantity, dateStart, dateEnd } = body;

    // Validate required fields
    if (!menuId || !orderTypeId || quantity === undefined) {
      return new Response(
        JSON.stringify({ error: "menuId, orderTypeId, and quantity are required." }),
        { status: 400 }
      );
    }

    // Create new inventory record
    const newInventory = await prisma.menuInventory.create({
      data: {
        menuId,
        orderTypeId,
        quantity,
        dateStart: dateStart ? new Date(dateStart) : new Date(),
        dateEnd: dateEnd ? new Date(dateEnd) : null,
      },
    });

    return new Response(JSON.stringify(newInventory), { status: 201 });
  } catch (error) {
    console.error("Error adding inventory:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
