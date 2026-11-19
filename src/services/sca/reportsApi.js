import { baseApi } from '@/services/baseApi';

export const scaReportsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaReports'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaReports: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/reports',
          params,
        }),
        providesTags: ['ScaReports'],
      }),

      getScaSupportedReports: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/reports/supported-reports',
          params,
        }),
        providesTags: ['ScaReports'],
      }),

      generateScaReport: builder.mutation({
        query: ({ reportType, name }) => ({
          url: `/sca/api/v1/reports/generate/${reportType}`,
          method: 'POST',
          body: { name },
        }),
        invalidatesTags: ['ScaReports'],
      }),

      downloadScaReportById: builder.query({
        query: (id) => ({
          url: `/sca/api/v1/reports/${id}/download`,
        }),
      }),

      downloadScaReport: builder.query({
        query: (id) => ({
          url: `/sca/api/v1/reports/download/${id}`,
        }),
      }),

      deleteScaReport: builder.mutation({
        query: (id) => ({
          url: `/sca/api/v1/reports/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ScaReports'],
      }),
    }),
  });

export const {
  useGetScaReportsQuery,
  useGetScaSupportedReportsQuery,
  useGenerateScaReportMutation,
  useDownloadScaReportByIdQuery,
  useLazyDownloadScaReportByIdQuery,
  useDownloadScaReportQuery,
  useLazyDownloadScaReportQuery,
  useDeleteScaReportMutation,
} = scaReportsApi;
