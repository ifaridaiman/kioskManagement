const { PrismaClient, OrderStatusEnum } = require("@prisma/client");

const prisma = new PrismaClient();

async function generateOrderId() {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" }, // Ensure we get the latest order
  });

  let nextOrderNumber = 1;
  if (lastOrder && lastOrder.orderId) {
    const match = lastOrder.orderId.match(/LMG-(\d+)/);
    if (match) {
      nextOrderNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `LMG-${String(nextOrderNumber).padStart(3, "0")}`; // Ensures format LMG-001, LMG-002, etc.
}

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Ensure Order Types exist
  await prisma.orderType.createMany({
    data: [
      { name: "Daily", description: "Order Cut off at 3pm" },
      { name: "Catering", description: "Pre-order in bulk min 3 days before" },
    ],
    skipDuplicates: true, // Prevents duplicate errors
  });

  // Fetch order types after creation
  const daily = await prisma.orderType.findFirst({ where: { name: "Daily" } });
  const catering = await prisma.orderType.findFirst({ where: { name: "Catering" } });

  // 2️⃣ Create a Customer
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

  // 3️⃣ Create Menu Items
  await prisma.menu.createMany({
    data: [
      { title: "Lemang XL", description: "Delicious Malaysian coconut rice dish", price: 25.0 },
      { title: "Lemang L", description: "Flaky Malaysian flatbread with curry", price: 20.5 },
      { title: "Lemang M", description: "Flaky Malaysian flatbread with curry", price: 15.5 },
    ],
    skipDuplicates: true,
  });

  // Fetch menu items correctly
  const lemangXL = await prisma.menu.findFirst({ where: { title: "Lemang XL" } });
  const lemangL = await prisma.menu.findFirst({ where: { title: "Lemang L" } });
  const lemangM = await prisma.menu.findFirst({ where: { title: "Lemang M" } });

  // 4️⃣ Create Inventory per Order Type (Valid for 7 days)
  const now = new Date();
  const dateEnd = new Date();
  dateEnd.setDate(now.getDate() + 7); // Set expiry period

  if (lemangXL && lemangL && lemangM && daily && catering) {
    await prisma.menuInventory.createMany({
      data: [
        // Inventory for Lemang XL
        { menuId: lemangXL.id, orderTypeId: daily.id, quantity: 50, dateStart: now, dateEnd },
        { menuId: lemangXL.id, orderTypeId: catering.id, quantity: 40, dateStart: now, dateEnd },

        // Inventory for Lemang L
        { menuId: lemangL.id, orderTypeId: daily.id, quantity: 30, dateStart: now, dateEnd },
        { menuId: lemangL.id, orderTypeId: catering.id, quantity: 25, dateStart: now, dateEnd },

        // Inventory for Lemang M
        { menuId: lemangM.id, orderTypeId: daily.id, quantity: 10, dateStart: now, dateEnd },
        { menuId: lemangM.id, orderTypeId: catering.id, quantity: 15, dateStart: now, dateEnd },
      ],
      skipDuplicates: true,
    });

    // Function to create an order
    async function createOrder() {
      const orderIdValue = await generateOrderId();

      await prisma.order.create({
        data: {
          customerId: customer.id,
          orderId: orderIdValue,
          orderTypeId: daily.id,
          orderItems: {
            create: [
              { menuId: lemangXL.id, quantity: 2 },
              { menuId: lemangL.id, quantity: 1 },
            ],
          },
          orderStatus: {
            create: [
              { status: OrderStatusEnum.NEW },
              { status: OrderStatusEnum.PROCESSED },
              { status: OrderStatusEnum.READY_TO_PICKUP },
              { status: OrderStatusEnum.COMPLETED },
            ],
          },
        },
      });
    }

    // 5️⃣ Create the initial order and three additional orders
    await createOrder();
    await createOrder();
    await createOrder();
    await createOrder();
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