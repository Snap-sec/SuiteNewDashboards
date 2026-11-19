import { baseApi } from '@/services/baseApi';

export const sastScansApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SastScans'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSastScans: builder.query({
        query: (params) => ({
          url: '/sast/api/v1/scans',
          params,
        }),
        providesTags: ['SastScans'],
      }),

      createSastScan: builder.mutation({
        query: (data) => ({
          url: '/sast/api/v1/scans',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['SastScans'],
      }),

      getScanJobStatus: builder.query({
        query: (jobId) => `/sast/api/v1/scans/jobs/${jobId}/status`,
      }),

      streamAllJobs: builder.query({
        query: () => `/sast/api/v1/scans/stream`,
      }),

      streamJobStatus: builder.query({
        query: (jobId) => `/sast/api/v1/scans/jobs/${jobId}/stream`,
      }),

      getScanStatusById: builder.query({
        query: (id) => `/sast/api/v1/scans/${id}/status`,
      }),

      streamJobStatusById: builder.query({
        query: (id) => `/sast/api/v1/scans/stream/${id}`,
      }),

      getSastScanById: builder.query({
        query: (id) => `/sast/api/v1/scans/${id}`,
        providesTags: ['SastScans'],
      }),

      updateScanConfig: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/sast/api/v1/scans/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['SastScans'],
      }),

      deleteSastScan: builder.mutation({
        query: (id) => ({
          url: `/sast/api/v1/scans/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['SastScans'],
      }),
    }),
  });

export const scaScansApi = sastScansApi;

export const {
  useGetSastScansQuery,
  useCreateSastScanMutation,
  useGetSastScanByIdQuery,
  useDeleteSastScanMutation,
  useGetScanJobStatusQuery,
  useStreamAllJobsQuery,
  useStreamJobStatusQuery,
  useGetScanStatusByIdQuery,
  useStreamJobStatusByIdQuery,
  useUpdateScanConfigMutation,
} = sastScansApi;

export const useGetScaScansQuery = useGetSastScansQuery;
export const useCreateScanConfigMutation = useCreateSastScanMutation;
export const useDeleteScaScanMutation = useDeleteSastScanMutation;
export const useGetScanConfigByIdQuery = useGetSastScanByIdQuery;


