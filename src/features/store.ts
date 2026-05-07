import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import todoReducer from "./todo/todoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todo: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
