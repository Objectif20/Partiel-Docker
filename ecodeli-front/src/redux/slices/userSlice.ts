import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  active: boolean;
  language: string;
  iso_code: string;
  language_id: string;
  profile: string[];
  otp?: boolean | false;
  updgradablePlan?: boolean | false;
  planName?: string;
  validateProfile?: boolean | false;
  customer_stripe_id : boolean | false;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateLang: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.language = action.payload;
      }
    },
    addDeliverymanProfile: (state) => {
      if (state.user) {
        if (!state.user.profile.includes("DELIVERYMAN")) {
          state.user.profile.push("DELIVERYMAN");
        }
        state.user.validateProfile = false;
      }
    },
    resetUser: () => {
      return initialState
    },
  },
});

export const { setUser, setLoading, setError, updateLang, resetUser, addDeliverymanProfile } = userSlice.actions;
export default userSlice.reducer;
