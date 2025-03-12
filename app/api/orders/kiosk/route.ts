export interface Customer {
    name: string;
    email: string;
    phone_number: string;
    address: string;
}

export interface OrderType {
    name: string;
    description: string;
}

export interface Payment {
    payment_gateway: string;
    status: "due" | "paid";
    paid_at: string | null;
}

export interface OrderStatus {
    status: string;
    created_at: string;
}

export interface Collection {
    id: string;
    status: string;
    delivery_method: string;
    customer: Customer;
    order_type: OrderType;
    payment: Payment;
    statuses: OrderStatus[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function GET(): Promise<Response> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        // Check if the response contains a nested "data" object
        const data: Collection[] = jsonResponse.data?.data || jsonResponse.data || [];

        return new Response(
            JSON.stringify({ success: true, data } as ApiResponse<Collection[]>),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            } as ApiResponse<null>),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

