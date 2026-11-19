import { baseApi } from '@/services/baseApi';

export const csmScansApi = baseApi.enhanceEndpoints({ addTagTypes: ['CSM_Scans'] }).injectEndpoints({
  endpoints: (builder) => ({
    getScans: builder.query({
      query: (params) => ({
        url: '/cspm/api/v1/scans',
        params,
      }),
      providesTags: ['CSM_Scans'],
    }),
    createScan: builder.mutation({
      query: (body) => ({
        url: '/cspm/api/v1/scans',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CSM_Scans'],
    }),
    updateScan: builder.mutation({
      query: ({ scanId, ...body }) => ({
        url: `/cspm/api/v1/scans/${scanId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CSM_Scans'],
    }),
    deleteScan: builder.mutation({
      query: (scanId) => ({
        url: `/cspm/api/v1/scans/${scanId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CSM_Scans'],
    }),
    triggerScan: builder.mutation({
      query: (scanId) => ({
        url: `/cspm/api/v1/scans/${scanId}/trigger`,
        method: 'POST',
      }),
      invalidatesTags: ['CSM_Scans'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetScansQuery,
  useCreateScanMutation,
  useUpdateScanMutation,
  useDeleteScanMutation,
  useTriggerScanMutation,
} = csmScansApi;
