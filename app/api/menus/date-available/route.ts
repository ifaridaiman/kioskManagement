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

        // Check if the current time in GMT+8 is past 3 PM
        const currentHourGmt8 = gmt8Now.getUTCHours(); // Extract GMT+8 hours (0-23)
        const isPast3PM = currentHourGmt8 >= 15; // 15:00 in 24-hour format


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

                // Include only today or future dates in GMT+8
                if (inventoryDateString > todayString || (!isPast3PM && inventoryDateString === todayString)) {
                    uniqueDates.add(inventoryDateString);
                }

            }
        });

        return NextResponse.json({
            status: "success",
            data: Array.from(uniqueDates).map(date => ({ date })),
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching inventory dates:", error);
        return NextResponse.json({
            status: "error",
            message: "Internal server error",
        }, { status: 500 });
    }
}
