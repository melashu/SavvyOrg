/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'frontend/utils/config';

const BASE_URL = config();

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      query: (params) => `/api/blogs/articles/published?${params}`,
    }),
    getBlogs: builder.query({
      query: ({ page, status, authorId, role }) => `/api/blogs?page=${page}&status=${status}&authorId=${authorId}&role=${role}`,
    }),
    fetchBlogById: builder.query({
      query: (id) => `/api/blogs/articles/${id}`,
    }),
    postBlog: builder.mutation({
      query: (formData) => ({
        url: 'api/blogs',
        method: 'POST',
        body: formData, // Correctly passing FormData directly
      }),
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `api/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `api/blogs/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchBlogsQuery, usePostBlogMutation, useGetBlogsQuery, useUpdateBlogMutation, useDeleteBlogMutation
} = blogsApi;
