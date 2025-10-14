import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the base API service
export const api = createApi({
  reducerPath: 'api', // name in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', 
  }),
  tagTypes: ['User', 'Post'], //for cache invalidation
  endpoints: (builder) => ({
    
    //Get all users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    //Register new user
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),

    //Login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    //Get single user
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserByIdQuery,
} = api;
