import { baseApi } from '@/services/baseApi';

export const vsScansApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VsScans'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVsScans: builder.query({
        query: (params) => ({
          url: '/vs/api/scans',
          params,
        }),
        providesTags: (result) => ['VsScans'],
      }),

      getVsScanDetails: builder.query({
        query: (scanId) => ({
          url: `/vs/api/scans/${scanId}/details`,
        }),
        providesTags: (result) => ['VsScans'],
      }),

      createVsScan: builder.mutation({
        query: (data) => ({
          url: '/vs/api/scans',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['VsScans'],
      }),

      deleteVsScan: builder.mutation({
        query: (scanId) => ({
          url: `/vs/api/scans/${scanId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['VsScans'],
      }),

      updateVsScan: builder.mutation({
        query: ({ scanId, ...updates }) => ({
          url: `/vs/api/scans/${scanId}`,
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags: ['VsScans'],
      }),

      haltVsScan: builder.mutation({
        query: ({ scannerId, scanId }) => ({
          url: `/vs/api/scanners/${scannerId}/stop/${scanId}`,
          method: 'POST',
        }),
        invalidatesTags: ['VsScans'],
      }),
      startVsScan: builder.mutation({
        query: (scanId) => ({
          url: `/vs/api/scans/${scanId}/start`,
          method: 'POST',
        }),
        invalidatesTags: ['VsScans'],
      }),
    }),
  });

export const {
  useGetVsScansQuery,
  useGetVsScanDetailsQuery,
  useCreateVsScanMutation,
  useDeleteVsScanMutation,
  useUpdateVsScanMutation,
  useHaltVsScanMutation,
  useStartVsScanMutation,
  useGetScanDetailsQuery
} = vsScansApi;
