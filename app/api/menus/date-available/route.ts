import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        // Get current UTC time
        const now = new Date();

        // Reset `now` to **UTC** midnight first (to avoid carryover issues)
        now.setUTCHours(0, 0, 0, 0);

        // Convert **UTC midnight** to **GMT+8 midnight**
        const gmt8Now = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const todayString = gmt8Now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        const currentRealTimeGMT8 = new Date(Date.now() + 8 * 60 * 60 * 1000);
        const currentRealTimeGMT8String = currentRealTimeGMT8.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        console.info("✅ Server (UTC) Midnight:", now.toISOString());
        console.info("✅ Server (GMT+8) Midnight:", gmt8Now.toISOString());
        console.info("✅ Server (GMT+8) Real-Time:", currentRealTimeGMT8String);
        console.info("✅ Today's Date (GMT+8):", todayString);

        // Fetch distinct dates from menu_inventories where quantity > 0
        const inventories = await prisma.menu_inventories.findMany({
            where: {
                quantity: { gt: 0 },
            },
            select: {
                end_date: true,
            },
            orderBy: { end_date: "asc" },
        });

        // Extract and filter unique dates in GMT+8
        const uniqueDates = new Set<string>();

        inventories.forEach(({ end_date }) => {
            if (end_date) {
                // Convert `end_date` (UTC) to **GMT+8**
                const inventoryDate = new Date(end_date.getTime() + 8 * 60 * 60 * 1000);
                const inventoryDateString = inventoryDate.toISOString().split("T")[0];

                // Strictly include only **future** dates (greater than today)
                if (inventoryDateString > currentRealTimeGMT8String) {
                    uniqueDates.add(inventoryDateString);
                }
            }
        });

        return NextResponse.json(
            {
                status: "success",
                data: Array.from(uniqueDates).map((date) => ({ date })), // Convert Set to Array
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching inventory dates:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
