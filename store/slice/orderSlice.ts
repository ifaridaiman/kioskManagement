import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
interface MenuItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    inventoryId: string;
}

interface CustomerDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    deliveryMethod: "pickup" | "delivery";
    paymentMethod: "cod" | "online";
    remarks: string;
}

interface OrderState {
    type: string;
    description: string;
    orders: MenuItem[];
    customerDetails: CustomerDetails | null;
}

const initialState: OrderState = {
    type: "", // or "raya" or "bulk" depending on your default
    description: "",
    orders: [],
    customerDetails: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {

        updateOrderType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
        },
        addOrder: (state, action: PayloadAction<MenuItem>) => {
            const existingOrder = state.orders.find((order) => order.id === action.payload.id);
            if (existingOrder) {
                existingOrder.quantity += action.payload.quantity;
            } else {
                state.orders.push(action.payload);
            }

            state.description = state.orders
                .map(order => `${order.name} (x${order.quantity})`)
                .join(", ");
        },

        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const orderIndex = state.orders.findIndex(order => order.id === action.payload.id);
            if (orderIndex !== -1) {
                if (action.payload.quantity <= 0) {
                    state.orders.splice(orderIndex, 1); // Remove item if quantity is 0
                } else {
                    state.orders[orderIndex].quantity = action.payload.quantity;
                }
            }

            state.description = state.orders
                .map(order => `${order.name} (x${order.quantity})`)
                .join(", ");
        },


        removeOrder: (state, action: PayloadAction<string>) => {
            state.orders = state.orders.filter((order) => order.id !== action.payload);
            state.description = state.orders
                .map(order => `${order.name} (x${order.quantity})`)
                .join(", ");
        },

        updateCustomerDetails: (state, action: PayloadAction<OrderState["customerDetails"]>) => {
            state.customerDetails = action.payload;
        },

        clearOrder: (state) => {
            state.orders = [];
            state.customerDetails = null;
            state.description = "";
        },
    },
});

export const { addOrder, updateQuantity, removeOrder, updateCustomerDetails, clearOrder, updateOrderType } = orderSlice.actions;
export default orderSlice.reducer;
export const selectFullOrder = (state: RootState) => ({
    orders: state.order.orders,
    customerDetails: state.order.customerDetails,
    description: state.order.description
});
