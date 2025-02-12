/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import config from 'frontend/utils/config';

const BASE_URL = config();

export const resetApi = createApi({
  reducerPath: 'resetApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    resetPassword: builder.mutation({
      query: ({ token, password }: { token: string; password: string }) => ({
        url: `/api/users/reset/${token}`,
        method: 'PUT',
        body: { password },
      }),
    }),
  }),
});

export const { useResetPasswordMutation } = resetApi;