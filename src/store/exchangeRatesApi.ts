import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exchangeRatesApi = createApi({
  reducerPath: 'exchangeRates',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/' }),
  endpoints: (builder) => ({
    getCurrencyRate: builder.query({
      query: ({ date, currency }) => `currency-api@${date}/v1/currencies/${currency}.json`,
    }),
  }),
});

export const {
  useLazyGetCurrencyRateQuery
} = exchangeRatesApi;
