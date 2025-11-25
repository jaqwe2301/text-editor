import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import loadingReducer from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
