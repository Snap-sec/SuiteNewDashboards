import { baseApi } from '@/services/baseApi';

export const asmDashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AsmDashboard', 'AsmROIDashboard', 'AsmAttackSurface'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAsmDashboardStats: builder.query({
        query: (params) => ({
          url: '/op/api/v1/dashboard/main',
          params,
        }),
        providesTags: (result) => ['AsmDashboard'],
      }),

      getAsmROIDashboardStats: builder.query({
        query: () => ({
          url: '/op/api/v1/dashboard/roi',
        }),
        providesTags: (result) => ['AsmROIDashboard'],
      }),

      getAsmAttackSurfaceOverview: builder.query({
        query: (params) => ({
          url: '/op/api/v1/dashboard/attack-surface',
          params,
        }),
        providesTags: (result) => ['AsmAttackSurface'],
      }),

      recomputeAsmAnalyticsDashboard: builder.mutation({
        query: () => ({
          url: '/op/api/v1/dashboard/recompute',
          method: 'POST',
        }),
        invalidatesTags: ['AsmAttackSurface', 'AsmDashboard'],
      }),
    }),
  });

export const {
  useGetAsmDashboardStatsQuery,
  useGetAsmROIDashboardStatsQuery,
  useGetAsmAttackSurfaceOverviewQuery,
  useRecomputeAsmAnalyticsDashboardMutation,
} = asmDashboardApi;
