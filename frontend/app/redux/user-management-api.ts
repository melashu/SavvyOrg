/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const userManagementApi = createApi({
  reducerPath: 'userManagementApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: ({ page, role, searchQuery }) => `api/users?pageNumber=${page}&role=${role}&searchQuery=${searchQuery}`,
    }),
    fetchArchivedUsers: builder.query({
      query: ({page, searchQuery}) => `api/users/archived?pageNumber=${page}&searchQuery=${searchQuery}`,
    }),
changeUserRole: builder.mutation({
  query: ({ userId, role, token }) => {

    console.log('API Called with');

    // Log the parameters received before returning the query object
    console.log('API Called with:', { userId, role, token });
    return {
      url: `api/users/${userId}/role`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { role },
    };
  },
}),

moveUserToArchive: builder.mutation({
  query: ({ userId, isDeleted, token }) => {

    console.log('API Called with');

    // Log the parameters received before returning the query object
    console.log('API Called with:', { userId, isDeleted, token });
    return {
      url: `api/users/archive/${userId}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { isDeleted },
    };
  },
}),
    deleteUser: builder.mutation({
      query: ({userId, token}) => ({
        url: `api/users/${userId}`,
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${token}`,
      },
      }),
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useChangeUserRoleMutation,
  useDeleteUserMutation,
} = userManagementApi;
