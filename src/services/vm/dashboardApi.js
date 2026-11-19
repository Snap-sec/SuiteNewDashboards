import { baseApi } from '@/services/baseApi';

export const dashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VmStats'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVmStats: builder.query({
        query: (params) => ({
          url: '/csm/api/assessments/dashboard',
          params,
        }),
        providesTags: (result) => ['VmStats'],
      }),

      getVmRiskScore: builder.query({
        query: (params) => ({
          url: '/csm/api/assessments/dashboard/risk-score',
          params,
        }),
        providesTags: (result) => ['VmStats'],
      }),

      downloadVmMonthlyReport: builder.mutation({
        query: (params) => ({
          url: '/csm/api/assessments/dashboard/monthly-report',
          method: 'GET',
          params,
          responseHandler: (response) => response.blob(),
        }),
      }),

      recomputeVmDashboard: builder.mutation({
        query: () => ({
          url: '/csm/api/assessments/recompute',
          method: 'POST',
        }),
        invalidatesTags: ['VmStats', 'VmVulnerabilitySourcesDashboard'],
      }),
    }),
  });

export const {
  useGetVmStatsQuery,
  useGetVmRiskScoreQuery,
  useDownloadVmMonthlyReportMutation,
  useRecomputeVmDashboardMutation,
} = dashboardApi;