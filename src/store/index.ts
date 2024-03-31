import { configureStore } from '@reduxjs/toolkit';

import { exchangeRatesApi } from './exchangeRatesApi';
import requestCounterSlice from './requestCounterSlice';

const store = configureStore({
  reducer: {
    [exchangeRatesApi.reducerPath]: exchangeRatesApi.reducer,
    requestCounterSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(exchangeRatesApi.middleware),
});

export type RootStateType = ReturnType<typeof store.getState>

export default store;
