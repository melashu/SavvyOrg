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
    fetchBlogByTitle: builder.query({
      query: ({ title, authorId }) => `/api/blogs/articles/detail/title?title=${title}&authorId=${authorId}`,
    }),
    postBlog: builder.mutation({
      query: (formData) => ({
        url: 'api/blogs',
        method: 'POST',
        body: formData, // Correctly passing FormData directly
      }),
    }),
    postComment: builder.mutation({
     query: ({ blogId, comment }) => ({
      url: `api/blogs/detail/comment`,
      method: 'POST',
      body: { blogId, comment }, // Ensure correct data format
       headers: {
      'Content-Type': 'application/json', // Ensures JSON format is sent
    },
  }),
}),
getBlogCommentsByBlogId: builder.query<{ comments: Comment[]; totalPages: number }, { blog_id: string; page: number }>({
  query: ({ page, blog_id }) => `api/blogs/detail/comments/${blog_id}?page=${page}&limit=10`,
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
  useFetchBlogsQuery, usePostBlogMutation, useGetBlogsQuery, useGetBlogCommentsByBlogIdQuery, useUpdateBlogMutation, useDeleteBlogMutation
} = blogsApi;
