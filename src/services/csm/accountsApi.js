import { baseApi } from '@/services/baseApi';

export const csmAccountsApi = baseApi.enhanceEndpoints({ addTagTypes: ['CSM_Accounts'] }).injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query({
      query: (params) => ({
        url: '/cspm/api/v1/accounts',
        params,
      }),
      providesTags: ['CSM_Accounts'],
    }),
    createAccount: builder.mutation({
      query: (body) => ({
        url: '/cspm/api/v1/accounts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CSM_Accounts'],
    }),
    updateAccount: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/cspm/api/v1/accounts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CSM_Accounts'],
    }),
    deleteAccount: builder.mutation({
      query: (id) => ({
        url: `/cspm/api/v1/accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CSM_Accounts'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = csmAccountsApi;
