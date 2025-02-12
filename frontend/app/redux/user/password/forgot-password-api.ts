/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const forgetPasswordApi = createApi({
  reducerPath: "forgetPasswordApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    resetPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (payload) => ({
        url: "/api/users/reset",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useResetPasswordMutation } = forgetPasswordApi;