import { configureStore } from '@reduxjs/toolkit';

import { exchangeRatesApi } from './exchangeRatesApi';
// import exchangeRatesSlice from './exchangeRatesSlice';

export default configureStore({
  reducer: {
    [exchangeRatesApi.reducerPath]: exchangeRatesApi.reducer,
    // exchangeRatesSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(exchangeRatesApi.middleware),
});
