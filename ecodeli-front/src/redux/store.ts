import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import userReducer from "./slices/userSlice";
import breadcrumbReducer from './slices/breadcrumbSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    user : userReducer,
    breadcrumb : breadcrumbReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
