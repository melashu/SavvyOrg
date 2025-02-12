/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();
export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), // Replace with actual API URL
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/contact/messages',
    }),
  }),
});

export const { useGetMessagesQuery } = messagesApi;
