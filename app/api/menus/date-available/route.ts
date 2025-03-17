import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        const now = new Date(); // Current date and time
        now.setSeconds(0, 0);  // Remove seconds and milliseconds for precision

        // Fetch distinct dates from menu_inventories where quantity is greater than 0
        const inventories = await prisma.menu_inventories.findMany({
            where: {
                quantity: {
                    gt: 0
                },
            },
            select: {
                end_date: true,
            },
            orderBy:{
                end_date: 'asc'
            }
        });

        // Extract and filter unique dates that are today or in the future considering time
        const uniqueDates = new Set();

        inventories.forEach(({ end_date }) => {
            if (end_date && new Date(end_date) >= now) {
                uniqueDates.add(end_date.toISOString().split('T')[0]);
            }
        });

        return NextResponse.json({
            status: "success",
            data: Array.from(uniqueDates).map(date => ({ date }))
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching inventory dates:', error);
        return NextResponse.json({
            status: "error",
            message: 'Internal server error',
        }, { status: 500 });
    }
}
