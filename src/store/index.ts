import { configureStore } from '@reduxjs/toolkit';
import appReducer from 'store/reducers/app';

export function makeStore() {
  return configureStore({
    reducer: { app: appReducer },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
