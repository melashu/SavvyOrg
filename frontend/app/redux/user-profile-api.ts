/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken'); // Get token from localStorage
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Set Authorization header
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUserProfile: builder.query({
      query: (accessId) => {
        return {
          url: 'api/users/profile',
          params: { accessId },
        };
      },
    }),
    // updateUserProfile: builder.mutation({
    //   query: ({ accessId, textData }) => ({
    //     url: 'api/users/profile',
    //     method: 'PUT',
    //     body: textData,
    //     params: { accessId },
    //   }),
    // }),

    updateUserProfile: builder.mutation({
  query: ({ accessId, formData }) => ({
    url: 'api/users/profile',
    method: 'PUT',
    body: formData,
    params: { accessId },
    // Make sure to set the Content-Type to multipart/form-data for file upload
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  }),
}),
    uploadProfilePicture: builder.mutation({
      query: ({ accessId, formData }) => ({
        url: 'api/users/profile/upload',
        method: 'POST',
        body: formData,
        params: { accessId },
      }),
    }),
  }),
});

export const {
  useFetchUserProfileQuery, // Hook to fetch the user profile
  useUpdateUserProfileMutation, // Hook to update the user profile
  useUploadProfilePictureMutation, // Hook to upload profile picture
} = userProfileApi;
