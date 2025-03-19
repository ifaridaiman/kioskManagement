import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        // Get current date in UTC and shift to GMT+8
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0); // Reset time to UTC midnight

        // Convert `now` to GMT+8
        const gmt8Now = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const todayString = gmt8Now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        // Fetch distinct dates from menu_inventories where quantity is greater than 0
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
                // Convert `end_date` (UTC) to GMT+8
                const inventoryDate = new Date(end_date.getTime() + 8 * 60 * 60 * 1000);
                const inventoryDateString = inventoryDate.toISOString().split("T")[0]; // Get only YYYY-MM-DD

                // Only include **future** dates (remove today)
                if (inventoryDateString > todayString) {
                    uniqueDates.add(inventoryDateString);
                }
            }
        });

        return NextResponse.json({
            status: "success",
            data: Array.from(uniqueDates).map(date => ({ date })), // Convert Set to Array
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching inventory dates:", error);
        return NextResponse.json({
            status: "error",
            message: "Internal server error",
        }, { status: 500 });
    }
}
