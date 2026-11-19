import { baseApi } from '@/services/baseApi';

export const aimTeamsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimTeams'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimTeams: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/ownership/teams',
          params,
        }),

        providesTags: (result) => ['AimTeams'],
      }),
    }),
  });

export const { useGetAimTeamsQuery } = aimTeamsApi;
