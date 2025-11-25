import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    count: 0,
  },
  reducers: {
    startLoading(state) {
      state.count += 1;
    },
    endLoading(state) {
      state.count = Math.max(0, state.count - 1);
    },
  },
});

export const { startLoading, endLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

export const selectIsLoading = (state: RootState) => state.loading.count > 0;
