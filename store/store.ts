// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "@/store/slice/orderSlice";
import navigationReducer from "@/store/slice/navigationSlice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
