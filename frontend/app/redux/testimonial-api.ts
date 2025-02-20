/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const testimonialApi = createApi({
  reducerPath: 'testimonialApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    createTestimony: builder.mutation({
      query: ({ name, role, testimony }: { name: string; role: string; testimony: string }) => ({
        url: 'api/testimonies', // Endpoint URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name, role, testimony },
      }),
    }),
  }),
});

export const { useCreateTestimonyMutation } = testimonialApi;
