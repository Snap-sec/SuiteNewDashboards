import { baseApi } from '@/services/baseApi';

export const scaScansApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaScans'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaScans: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/scans',
          params,
        }),
        providesTags: ['ScaScans'],
      }),

      createScaScanConfig: builder.mutation({
        query: (data) => ({
          url: '/sca/api/v1/scans',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['ScaScans'],
      }),

      getScaScanJobStatus: builder.query({
        query: (jobId) => `/sca/api/v1/scans/jobs/${jobId}/status`,
      }),

      streamScaAllJobs: builder.query({
        query: () => `/sca/api/v1/scans/stream`,
      }),

      streamScaJobStatus: builder.query({
        query: (jobId) => `/sca/api/v1/scans/jobs/${jobId}/stream`,
      }),

      getScaScanStatusById: builder.query({
        query: (id) => `/sca/api/v1/scans/${id}/status`,
      }),

      streamScaJobStatusById: builder.query({
        query: (id) => `/sca/api/v1/scans/stream/${id}`,
      }),

      getScanConfigById: builder.query({
        query: (id) => `/sca/api/v1/scans/${id}`,
        providesTags: ['ScaScans'],
      }),

      updateScaScanConfig: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/sca/api/v1/scans/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['ScaScans'],
      }),

      deleteScaScan: builder.mutation({
        query: (id) => ({
          url: `/sca/api/v1/scans/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ScaScans'],
      }),
    }),
  });

export const {
  useGetScaScansQuery,
  useCreateScaScanConfigMutation,
  useGetScaScanJobStatusQuery,
  useStreamScaAllJobsQuery,
  useStreamScaJobStatusQuery,
  useGetScaScanStatusByIdQuery,
  useStreamScaJobStatusByIdQuery,
  useGetScaScanConfigByIdQuery,
  useUpdateScaScanConfigMutation,
  useDeleteScaScanMutation,
} = scaScansApi;
