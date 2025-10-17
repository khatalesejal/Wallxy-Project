import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
  }),
  tagTypes: ['User', 'File', 'Catalog'],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    // Register new user
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Get single user
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),

    // CRUD for files
    getFiles: builder.query({
      query: () => '/files/crud',
      providesTags: ['File'],
    }),

    addFileToCatalog: builder.mutation({
      query: (fileId) => ({
        url: '/files/catalog/add',
        method: 'POST',
        body: { fileId },
      }),
      invalidatesTags: ['Catalog'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserByIdQuery,
  useGetFilesQuery,
  useAddFileToCatalogMutation,
} = api;
