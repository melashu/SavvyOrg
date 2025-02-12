/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const authApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'api/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: ({ name, email, password }: { name: string; email: string; password: string }) => ({
        url: 'api/users', // Endpoint URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name, email, password },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
