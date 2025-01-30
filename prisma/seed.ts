const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Ensure Order Types exist
  await prisma.orderType.createMany({
    data: [
      { name: "Dine-In", description: "Order placed for dining in the restaurant" },
      { name: "Takeaway", description: "Order placed for takeaway" }
    ],
    skipDuplicates: true, // Prevents duplicate errors
  });

  // Fetch order types after creation
  const dineIn = await prisma.orderType.findFirst({ where: { name: "Dine-In" } });
  const takeAway = await prisma.orderType.findFirst({ where: { name: "Takeaway" } });

  // Create a Customer
  const customer = await prisma.customer.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "123456789",
      address: "123 Main Street, City, Country",
    },
  });

  // Create Menu Items
  await prisma.menu.createMany({
    data: [
      { title: "Nasi Lemak", description: "Delicious Malaysian coconut rice dish", price: 5.0 },
      { title: "Roti Canai", description: "Flaky Malaysian flatbread with curry", price: 3.5 }
    ],
    skipDuplicates: true,
  });

  // Fetch menu items correctly using `findFirst()`
  const nasiLemak = await prisma.menu.findFirst({ where: { title: "Nasi Lemak" } });
  const rotiCanai = await prisma.menu.findFirst({ where: { title: "Roti Canai" } });

  // Create Inventory (Only if menu items exist)
  if (nasiLemak && rotiCanai) {
    await prisma.menuInventory.createMany({
      data: [
        {
          menuId: nasiLemak.id,
          quantity: 50,
          dateStart: new Date(),
          dateEnd: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
        {
          menuId: rotiCanai.id,
          quantity: 30,
          dateStart: new Date(),
          dateEnd: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      ],
      skipDuplicates: true,
    });

    // Create an Order
    await prisma.order.create({
      data: {
        customerId: customer.id,
        orderTypeId: dineIn.id,
        status: "new",
        orderItems: {
          create: [
            { menuId: nasiLemak.id, quantity: 2 },
            { menuId: rotiCanai.id, quantity: 1 },
          ],
        },
      },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
