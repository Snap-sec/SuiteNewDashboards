import { baseApi } from '@/services/baseApi';

export const membersApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['members'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMembers: builder.query({
        query: (params) => ({
          url: '/auth/api/org/members',
          params,
        }),
        providesTags: (result) => ['members'],
      }),
    }),
  });

export const {
  useGetMembersQuery,
} = membersApi;
