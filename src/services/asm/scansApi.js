import { baseApi } from '@/services/baseApi';

export const asmScansApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AsmScansDashboard', 'AsmScans'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAsmScansDashboardStats: builder.query({
        query: (params) => ({
          url: `/op/api/v1/scans`,
          params
        }),
        providesTags: (result) => ['AsmScansDashboard'],
      }),

      getAsmScans: builder.query({
        query: (params) => ({
          url: '/op/cmd/scans',
          params
        }),
        providesTags: (result) => ['AsmScans'],
      }),

      createNewAsmScan: builder.mutation({
        query: (domain) => ({
          url: `/op/cmd/scans`,
          method: 'POST',
          body: {
            domain,
            frequency: 'none',
            repeat: false,
            runTime: 1750320993630,
            scanType: 'quick',
          },
        }),
        invalidatesTags: ['AsmScans', 'AsmScansDashboard'],
      }),

      launchAsmTestScan: builder.mutation({
        query: (domain) => ({
          url: `op/api/v1/scans/launch-test`,
          method: 'POST',
        }),
        invalidatesTags: ['AsmScans', 'AsmScansDashboard'],
      }),

      cancelAsmScan: builder.mutation({
        query: (scanId) => ({
          url: `/op/api/v1/scans/${scanId}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: ['AsmScans', 'AsmScansDashboard'],
      }),

      retryAsmScan: builder.mutation({
        query: () => ({
          url: `/op/api/v1/scans/retry`,
          method: 'POST',
        }),
        invalidatesTags: ['AsmScans', 'AsmScansDashboard'],
      }),
    }),
  });

export const {
  useGetAsmScansDashboardStatsQuery,
  useGetAsmScansQuery,
  useCreateNewAsmScanMutation,
  useLaunchAsmTestScanMutation,
  useCancelAsmScanMutation,
  useRetryAsmScanMutation,
} = asmScansApi;
