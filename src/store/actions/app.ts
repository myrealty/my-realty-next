import store from 'store';
import { appSlice } from 'store/reducers/app';
import { Location } from 'api/listing';

// Actions
export const setAppLoading = (bool: boolean) => {
  store.dispatch(appSlice.actions.setAppLoading(bool));
};

export const setAppQueryParamsNumber = (n: number) => {
  store.dispatch(appSlice.actions.setAppQueryParamsNumber(n));
};

export const setAppShowReturnButton = (bool: boolean) => {
  store.dispatch(appSlice.actions.setAppShowReturnButton(bool));
};

export const setAppShowFilters = (bool: boolean) => {
  store.dispatch(appSlice.actions.setAppShowFilters(bool));
};

export const setAppShowContactAgent = (bool: boolean) => {
  store.dispatch(appSlice.actions.setAppShowContactAgent(bool));
};

export const setAppLocation = ({
  location,
}: {
  location: (Location & { listingId: number }) | null;
}) => {
  store.dispatch(appSlice.actions.setAppLocation(location));
};
