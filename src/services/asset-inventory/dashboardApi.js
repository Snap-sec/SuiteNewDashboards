import { baseApi } from '../baseApi';

export const dashboardApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['AssetInventoryDashboard'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimDashboardStats: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/dashboard',
          params,
        }),
        providesTags: ['AssetInventoryDashboard'],
      }),

      recomputeAimDashboard: builder.mutation({
        query: () => ({
          url: '/asset-inventory/api/v1/dashboard/recompute',
          method: 'POST',
        }),
        invalidatesTags: ['AssetInventoryDashboard', 'AssetInventoryAssetStats', 'AssetInventoryAssets'],
      }),
    }),
  });

export const {
  useGetAimDashboardStatsQuery,
  useRecomputeAimDashboardMutation,
} = dashboardApi;
