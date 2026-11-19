import { baseApi } from '@/services/baseApi';

export const aptScansApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['APT_Scans', 'Pentests', 'AutoPtDashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAptScans: builder.query({
        query: (params) => ({
          url: '/autopentest/api/v1/scans',
          params,
        }),
        providesTags: ['APT_Scans'],
      }),
      createAptScan: builder.mutation({
        query: (body) => ({
          url: '/autopentest/api/v1/scans',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['APT_Scans', 'Pentests', 'AutoPtDashboard'],
      }),
      updateAptScan: builder.mutation({
        query: ({ scanId, ...body }) => ({
          url: `/autopentest/api/v1/scans/${scanId}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['APT_Scans', 'Pentests', 'AutoPtDashboard'],
      }),
      deleteAptScan: builder.mutation({
        query: (scanId) => ({
          url: `/autopentest/api/v1/scans/${scanId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['APT_Scans', 'Pentests', 'AutoPtDashboard'],
      }),
      triggerAptScan: builder.mutation({
        query: (scanId) => ({
          url: `/autopentest/api/v1/scans/${scanId}/trigger`,
          method: 'POST',
        }),
        invalidatesTags: ['APT_Scans', 'Pentests', 'AutoPtDashboard'],
      }),

      cancelAptScan: builder.mutation({
        query: (scanId) => ({
          url: `/autopentest/api/v1/scans/${scanId}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: ['APT_Scans', 'Pentests', 'AutoPtDashboard'],
      }),

      retryAptScan: builder.mutation({
        query: (scanId) => ({
          url: `/autopentest/api/v1/scans/${scanId}/retry`,
          method: 'POST',
        }),
        invalidatesTags: ['APT_Scans', 'Pentests', 'AutoPtDashboard'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetAptScansQuery,
  useCreateAptScanMutation,
  useUpdateAptScanMutation,
  useDeleteAptScanMutation,
  useTriggerAptScanMutation,
  useCancelAptScanMutation,
  useRetryAptScanMutation,
} = aptScansApi;
