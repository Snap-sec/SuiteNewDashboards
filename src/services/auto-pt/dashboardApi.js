import { baseApi } from '@/services/baseApi';

export const autoPtDashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AutoPtDashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAutoPtDashboard: builder.query({
        query: (params) => ({
          url: '/autopentest/api/v1/projects/dashboard',
          params: params && Object.keys(params).length > 0 ? params : undefined,
        }),
        providesTags: ['AutoPtDashboard'],
      }),
    }),
  });

export const { useGetAutoPtDashboardQuery } = autoPtDashboardApi;
