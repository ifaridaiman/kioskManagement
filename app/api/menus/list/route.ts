import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);

        if (!body || !body.date) {
            return NextResponse.json(
                { success: false, error: "Date is required" },
                { status: 400 }
            );
        }

        const { date } = body;

        const inventories = await prisma.menu_inventories.findMany({
            where: {
                end_date: new Date(date),
            },
            select: {
                id: true,
                menu_id: true,
                quantity: true,
                start_date: true,
                end_date: true,
                start_time: true,
                end_time: true,
                order_types: {
                    select: {
                        name: true,
                        description: true,
                    }
                },
                menus: {
                    select: {
                        price: true,
                        title: true,
                        description: true,
                        menu_categories: {
                            select: {
                                title: true,
                            }
                        },
                        menu_assets: {
                            select: {
                                asset_path: true,
                                created_at: true, // ✅ Fetch creation date to determine the latest
                            },
                            orderBy: {
                                created_at: "desc", // ✅ Sort by latest first
                            },
                            take: 1,
                        },
                    }
                }
            },
        });

        if (!inventories.length) {
            return NextResponse.json(
                { success: true, data: [] },
                { status: 200 }
            );
        }

        // const structuredResponse: {
        //     id: string;
        //     title: string;
        //     description: string;
        //     menus: {
        //         id: string;
        //         title: string;
        //         description: string;
        //         price: string;
        //         inventory: {
        //             inventory_id: string;
        //             quantity: number;
        //             start_date: Date | null;
        //             end_date: Date | null;
        //             start_time: Date | null;
        //             end_time: Date | null;
        //             order_type: {
        //                 name: string;
        //                 description: string;
        //             };
        //         }[];
        //     }[];
        // }[] = inventories.reduce((categories, inventory) => {
        //     if (!inventory.menus) return categories;

        //     const menuItem = {
        //         id: inventory.menu_id,
        //         title: inventory.menus?.title || "Unknown", // ✅ Use menu category title instead
        //         description: inventory.menus?.description || "No description",
        //         price: inventory.menus?.price?.toString() || "0",
        //         inventory: [
        //             {
        //                 inventory_id: inventory.id,
        //                 quantity: inventory.quantity || 0,
        //                 start_date: inventory.start_date || null,
        //                 end_date: inventory.end_date || null,
        //                 start_time: inventory.start_time || null,
        //                 end_time: inventory.end_time || null,
        //                 order_type: {
        //                     name: inventory.order_types?.name || "Unknown",
        //                     description: inventory.order_types?.description ?? "No description",
        //                 }
        //             }
        //         ]
        //     };

        //     const existingCategory = categories.find(cat => cat.id === inventory.menu_id);

        //     if (existingCategory) {
        //         existingCategory.menus.push(menuItem);
        //     } else {
        //         categories.push({
        //             id: inventory.menu_id,
        //             title: inventory.menus?.menu_categories?.title || "Unknown", // ✅ Use menu category title
        //             description: inventory.menus?.description || "No description",
        //             menus: [menuItem]
        //         });
        //     }
        //     return categories;
        // }, [] as typeof structuredResponse);
        const structuredResponse: {
            id: string;
            title: string;
            description: string;
            menus: {
                id: string;
                title: string;
                description: string;
                price: string;
                inventory: {
                    inventory_id: string;
                    quantity: number;
                    start_date: Date | null;
                    end_date: Date | null;
                    start_time: Date | null;
                    end_time: Date | null;
                    order_type: {
                        name: string;
                        description: string;
                    };
                }[];

            }[];
        }[] = inventories.reduce((categories, inventory) => {
            if (!inventory.menus) return categories;

            // Extract category title
            const categoryTitle = inventory.menus.menu_categories?.title || "Unknown";

            const latestAsset = inventory.menus.menu_assets.length > 0
                ? inventory.menus.menu_assets[0].asset_path
                : null; // If no asset, return null
            // Create menu item
            const menuItem = {
                id: inventory.menu_id,
                title: inventory.menus?.title || "Unknown",
                description: inventory.menus?.description || "No description",
                price: inventory.menus?.price?.toString() || "0",
                image_url: latestAsset,
                inventory: [
                    {
                        inventory_id: inventory.id,
                        quantity: inventory.quantity || 0,
                        start_date: inventory.start_date || null,
                        end_date: inventory.end_date || null,
                        start_time: inventory.start_time || null,
                        end_time: inventory.end_time || null,
                        order_type: {
                            name: inventory.order_types?.name || "Unknown",
                            description: inventory.order_types?.description ?? "No description",
                        }
                    }
                ]
            };

            // Find existing category
            const existingCategory = categories.find(cat => cat.title === categoryTitle);

            if (existingCategory) {
                // If category exists, add menu item to it
                existingCategory.menus.push(menuItem);
            } else {
                // If category doesn't exist, create a new one
                categories.push({
                    id: inventory.menu_id, // Can be a random ID
                    title: categoryTitle,  // ✅ Group by category title
                    description: inventory.menus?.description || "No description",
                    menus: [menuItem]
                });
            }
            return categories;
        }, [] as typeof structuredResponse);

        // ✅ Sort categories to always put "Lemang" at the top
        structuredResponse.sort((a, b) => (a.title === "Lemang" ? -1 : b.title === "Lemang" ? 1 : 0));

        return NextResponse.json(
            { success: true, data: structuredResponse },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching inventory data:", error);

        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
