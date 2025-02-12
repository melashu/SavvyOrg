/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const userConfirmApi = createApi({
  reducerPath: 'userConfirmApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    confirmEmail: builder.query({
      query: (token) => `api/users/confirm/${token}`,
    }),
  }),
});

export const { useConfirmEmailQuery } = userConfirmApi;
