import { baseApi } from '@/services/baseApi';

export const scaDashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaDashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaDashboardSummary: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/dashboard/summary',
          params,
        }),
        providesTags: ['ScaDashboard'],
      }),
    }),
  });

export const { useGetScaDashboardSummaryQuery } = scaDashboardApi;
