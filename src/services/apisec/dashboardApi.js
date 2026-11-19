import { baseApi } from '@/services/baseApi';

export const dashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ApisecDashboard', 'AutoPtDashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getApisecDashboard: builder.query({
        query: () => ({
          url: '/apisec/api/v1/dashboard',
        }),
        providesTags: ['ApisecDashboard'],
      }),
      getAutoPtDashboard: builder.query({
        query: () => ({
          url: '/autopentest/api/v1/dashboard',
        }),
        providesTags: ['AutoPtDashboard'],
      }),
    }),
  });

export const { useGetApisecDashboardQuery } = dashboardApi;
export { useGetAutoPtDashboardQuery } from '@/services/auto-pt/dashboardApi';

