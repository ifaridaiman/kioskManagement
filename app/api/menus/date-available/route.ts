import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

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
        });

        // Extract and filter unique dates that are today or in the future
        const uniqueDates = new Set();

        inventories.forEach(({ end_date }) => {
            if (end_date && new Date(end_date) >= today) {
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