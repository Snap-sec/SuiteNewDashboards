import { baseApi } from '@/services/baseApi';

export const csmDashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['csm_dashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCsmDashboard: builder.query({
        query: () => ({
          url: '/csm/api/assessments/system-assessment-stats',
        }),
        providesTags: ['csm_dashboard'],
      }),
      getCspmDashboard: builder.query({
        query: () => ({
          url: '/cspm/api/v1/dashboard',
        }),
        providesTags: ['csm_dashboard'],
      }),
    }),
  });

export const { useGetCsmDashboardQuery, useGetCspmDashboardQuery } = csmDashboardApi;
