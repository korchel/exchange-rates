import { createSlice } from '@reduxjs/toolkit';

import type { RootStateType } from './index';

const initialState = {
  counter: 0,
};

const requesCounterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.counter += 1;
    }
  },
});

export const getCounter = (state: RootStateType): number => state.requestCounterSlice.counter;
export const { increment } = requesCounterSlice.actions;
export default requesCounterSlice.reducer;
