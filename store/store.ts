// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "@/store/slice/orderSlice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
