/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getUserRole: builder.query<{ role: string }, string>({
      query: (accessToken) => ({
        url: '/api/users/role',
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }),
  }),
});

export const { useGetUserRoleQuery } = userApi;
