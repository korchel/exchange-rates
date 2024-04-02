import { createSlice } from '@reduxjs/toolkit';
import { exchangeRatesApi } from './exchangeRatesApi';
import type { RootStateType } from './index';

const initialState = {
  counter: 0,
};

const requesCounterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(exchangeRatesApi.endpoints.getCurrencyRate.matchFulfilled, (state) => {
      state.counter += 1;
    });
  }
});

export const getCounter = (state: RootStateType): number => state.requestCounterSlice.counter;

export default requesCounterSlice.reducer;
