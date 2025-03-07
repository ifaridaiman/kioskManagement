import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  activeId: string | null;
}

const initialState: NavigationState = {
  activeId: null, // Default is no active tab
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeId = action.payload;
    },
  },
});

export const { setActiveTab } = navigationSlice.actions;
export default navigationSlice.reducer;
