// /
// /scan/:scanId

import { baseApi } from '@/services/baseApi';

export const scansApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ApisecScans', 'ApisecDashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getApisecScans: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/scan`,
          params: params
        }),
        providesTags: ['ApisecScans'],
      }),

      createApisecScan: builder.mutation({
        query: ({ payload }) => ({
          url: `/apisec/api/v1/scan`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecScans', 'ApisecDashboard'],
      }),

      deleteApisecScan: builder.mutation({
        query: ({ scanId }) => ({
          url: `/apisec/api/v1/scan/${scanId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ApisecScans', 'ApisecDashboard'],
      }),

      updateScans: builder.mutation({
        query: (data) => ({
          url: `/apisec/api/v1/scan/${data?.scanId}/execution`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['ApisecScans', 'ApisecDashboard'],
      }),

      reRunScan: builder.mutation({
        query: (data) => ({
          url: `/apisec/api/v1/scan/${data?.scanId}/rescan`,
          method: 'POST',
          // body: data
        }),
        invalidatesTags: ['ApisecScans', 'ApisecDashboard'],
      }),

      flushScans: builder.mutation({
        query: () => ({
          url: `/apisec/api/v1/scan/flush`,
          method: 'POST',
        }),
        invalidatesTags: ['ApisecScans', 'ApisecDashboard'],
      }),

    }),
  });

export const {
  useGetApisecScansQuery,
  useCreateApisecScanMutation,
  useDeleteApisecScanMutation,
  useUpdateScansMutation,
  useReRunScanMutation,
  useFlushScansMutation
} = scansApi;
