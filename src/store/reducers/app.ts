import { createSlice } from '@reduxjs/toolkit';
import { Location } from 'api/listing';

export interface AppReducer {
  appLoading: boolean;
  appQueryParamsNumber: number;
  appShowReturnButton: boolean;
  appShowFilters: boolean;
  appShowContactAgent: boolean;
  appLocation: (Location & { listingId: number }) | null;
}

const initialState: AppReducer = {
  appLoading: true,
  appQueryParamsNumber: 0,
  appShowReturnButton: false,
  appShowFilters: false,
  appShowContactAgent: false,
  appLocation: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppLoading: (state, action) => {
      state.appLoading = action.payload;
    },
    setAppQueryParamsNumber: (state, action) => {
      state.appQueryParamsNumber = action.payload;
    },
    setAppShowReturnButton: (state, action) => {
      state.appShowReturnButton = action.payload;
    },
    setAppShowFilters: (state, action) => {
      state.appShowFilters = action.payload;
    },
    setAppShowContactAgent: (state, action) => {
      state.appShowContactAgent = action.payload;
    },

    setAppLocation: (state, action) => {
      state.appLocation = action.payload;
    },
  },
});

export default appSlice.reducer;
