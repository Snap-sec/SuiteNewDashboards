import { baseApi } from '@/services/baseApi';

export const sastDashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SastDashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSastDashboardSummary: builder.query({
        query: (params) => ({
          url: '/sast/api/v1/dashboard',
          params,
        }),
        providesTags: ['SastDashboard'],
      }),
    }),
  });

export const scaDashboardApi = sastDashboardApi;

export const { useGetSastDashboardSummaryQuery } = sastDashboardApi;
export const useGetScaDashboardSummaryQuery = useGetSastDashboardSummaryQuery;

