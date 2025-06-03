import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  twoFactorRequired: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  twoFactorRequired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ accessToken: string | null; twoFactorRequired: boolean }>) => {
      state.accessToken = action.payload.accessToken;
      state.twoFactorRequired = action.payload.twoFactorRequired;
    },
    logout: (state) => {
      state.accessToken = null;
      state.twoFactorRequired = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
