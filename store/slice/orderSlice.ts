import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
interface MenuItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    type: "raya" | "bulk" | "daily";
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
    type: "raya" | "bulk" | "daily";
    orders: MenuItem[];
    customerDetails: CustomerDetails | null;
}

const initialState: OrderState = {
    type: "daily", // or "raya" or "bulk" depending on your default
    orders: [],
    customerDetails: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        addOrder: (state, action: PayloadAction<MenuItem>) => {
            const existingOrder = state.orders.find((order) => order.id === action.payload.id);
            if (existingOrder) {
                existingOrder.quantity += action.payload.quantity;
            } else {
                state.orders.push(action.payload);
            }
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
        },


        removeOrder: (state, action: PayloadAction<string>) => {
            state.orders = state.orders.filter((order) => order.id !== action.payload);
        },

        updateCustomerDetails: (state, action: PayloadAction<OrderState["customerDetails"]>) => {
            state.customerDetails = action.payload;
        },

        clearOrder: (state) => {
            state.orders = [];
            state.customerDetails = null;
        },
    },
});

export const { addOrder, updateQuantity, removeOrder, updateCustomerDetails, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
export const selectFullOrder = (state: RootState) => ({
    orders: state.order.orders,
    customerDetails: state.order.customerDetails,
});
