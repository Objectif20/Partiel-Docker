import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BreadcrumbState {
  segments: string[];
  links: string[];
}

const initialState: BreadcrumbState = {
  segments: [],
  links: [],
};

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumb: (state, action: PayloadAction<{ segments: string[], links: string[] }>) => {
      state.segments = action.payload.segments;
      state.links = action.payload.links;
    },
  },
});

export const { setBreadcrumb } = breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;
