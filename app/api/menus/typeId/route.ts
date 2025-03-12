import { NextRequest } from "next/server";
export interface OrderType {
    name: string;
    description: string;
}

export interface Inventory {
    quantity: number;
    start_date: string | null;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    order_type: OrderType;
}

export interface Menu {
    id: string;
    title: string;
    description: string;
    price: string;
    inventory: Inventory[];
    assets: string;
}

export interface MenuCategory {
    id: string;
    title: string;
    description: string;
    menus: Menu[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}


export async function POST(req: NextRequest) {

    try {
        const { searchParams } = new URL(req.url);
        const menuTypeId = searchParams.get("menuTypeId");

        if (!menuTypeId) {
            return Response.json(
                { success: false, error: "Missing menuTypeId query parameter." },
                { status: 400 }
            );
        }

        // ✅ Ensure menuTypeId is always a string (handle spread routes)
        const extractedMenuTypeId = Array.isArray(menuTypeId) ? menuTypeId[0] : menuTypeId;

        console.log("🆔 Received menuTypeId:", extractedMenuTypeId);

        // Fetch order types to validate if menuTypeId is valid
        const orderTypeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/types`);
        if (!orderTypeResponse.ok) {
            throw new Error(`Failed to fetch order types. Status: ${orderTypeResponse.status}`);
        }
        const orderTypesJson = await orderTypeResponse.json();

        // ✅ Extract id and name from order types
        const validOrderTypes: { id: string; name: string }[] = orderTypesJson.map((type: { id: string; name: string }) => ({
            id: type.id,
            name: type.name,
        }));

        // ✅ Find the order type name that matches `menuTypeId`
        const matchedOrderType = validOrderTypes.find((type) => type.id === extractedMenuTypeId);

        if (!matchedOrderType) {
            return Response.json(
                { success: false, error: `Invalid menuTypeId: ${extractedMenuTypeId}.` },
                { status: 400 }
            );
        }

        const selectedOrderTypeName = matchedOrderType.name; // ✅ Use this for filtering inventory

        // Fetch menu categories
        const menuResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus?orderType=${extractedMenuTypeId}`);
        if (!menuResponse.ok) {
            throw new Error(`Failed to fetch menus. Status: ${menuResponse.status}`);
        }
        const menuJsonResponse = await menuResponse.json();
        const menuCategories: MenuCategory[] = menuJsonResponse.data || [];

        // Get today's date and current time
        const now = new Date();

        // ✅ Get today’s date in KL timezone (YYYY-MM-DD)
        const todayDate = new Date(
            new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }).format(now)
        );

        // ✅ Get the current time in KL timezone (HH:MM:SS)
        const currentTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kuala_Lumpur',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(now);

        function filterInventory(inventory: Inventory[]): Inventory[] {
            return inventory.filter((item) => {
                const { start_date, start_time, end_date, end_time, order_type } = item;

                console.log("📌 Checking inventory item:", item);

                let isStartDateValid = false;
                let isStartTimeValid = true; // Default to true if no start_time exists
                let isEndDateValid = false;
                let isEndTimeValid = true; // Default to true if no end_time exists

                // ✅ **Condition 1: Ensure `start_date` is before or equal to today**
                if (start_date) {
                    const parsedStartDate = new Date(start_date.split(" ")[0]); // Extract YYYY-MM-DD part
                    console.log("🎯 Parsed Start Date:", parsedStartDate.toISOString().split("T")[0]);

                    isStartDateValid = parsedStartDate.getTime() <= todayDate.getTime(); // ✅ Compare only date (ignore time)
                }

                // ✅ **Condition 2: If `start_date` is today, check `start_time`**
                if (isStartDateValid && start_date?.split(" ")[0] === todayDate.toISOString().split("T")[0] && start_time) {
                    console.log("⏳ Checking Start Time:", start_time, "against", currentTime);
                    isStartTimeValid = start_time <= currentTime; // ✅ Start time must be before or equal to now
                }

                // ✅ **Condition 3: Ensure `end_date` is after or equal to today**
                if (end_date) {
                    const parsedEndDate = new Date(end_date.split(" ")[0]); // Extract YYYY-MM-DD part
                    console.log("🛑 Parsed End Date:", parsedEndDate.toISOString().split("T")[0]);

                    isEndDateValid = parsedEndDate.getTime() >= todayDate.getTime(); // ✅ Compare only date (ignore time)
                }

                // ✅ **Condition 4: If `end_date` is today, check `end_time`**
                if (isEndDateValid && end_date?.split(" ")[0] === todayDate.toISOString().split("T")[0] && end_time) {
                    console.log("⏳ Checking End Time:", end_time, "against", currentTime);
                    isEndTimeValid = end_time >= currentTime; // ✅ End time must be after or equal to now
                }

                // ✅ **Condition 5: Only include items where `order_type.name` matches `selectedOrderTypeName`**
                const isOrderTypeValid = order_type && order_type.name === selectedOrderTypeName;

                console.log("✅ Final Validation:", { isStartDateValid, isStartTimeValid, isEndDateValid, isEndTimeValid, isOrderTypeValid });

                // ✅ **Return inventory items where all conditions are met**
                return isStartDateValid && isStartTimeValid && isEndDateValid && isEndTimeValid && isOrderTypeValid;
            });
        }

        // Filter menus by valid inventory
        const filteredMenuCategories = menuCategories
            .map((category) => ({
                ...category,
                menus: category.menus
                    .map((menu) => ({
                        ...menu,
                        inventory: filterInventory(menu.inventory),
                    }))
                    .filter((menu) => menu.inventory.length > 0), // Only include menus with valid inventory
            }))
            .filter((category) => category.menus.length > 0); // Remove empty categories

        return Response.json(
            { success: true, data: filteredMenuCategories },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}



