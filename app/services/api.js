
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData,
      }),
    }),
     loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getDashboard: builder.query({
      query: () => '/dashboard',
    }),
    deleteCatalog:builder.mutation({
      query:(id)=>({
        url:`catalog/${id}`,
        method:'DELETE',
      })
    }),
    createCatalog: builder.mutation({
      query: (newCatalog) => ({
        url: '/catalog/create',
        method: 'POST',
        body: newCatalog,
      }),
    }),

    
    updateCatalog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/catalog/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getAllCatalogs: builder.query({
      query: () => '/catalog/all',
}),

  }),
});

export const { 
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetDashboardQuery,
  useGetAllCatalogsQuery,
  useDeleteCatalogMutation,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  
} = api;