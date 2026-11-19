import { baseApi } from '@/services/baseApi';

export const AimMembersApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimMembers'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimMembers: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/ownership/members',
          params,
        }),

        providesTags: (result) => ['AimMembers'],
      }),
    }),
  });

export const { useGetAimMembersQuery } = AimMembersApi;
