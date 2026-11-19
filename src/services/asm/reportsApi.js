import { baseApi } from '@/services/baseApi';

export const asmReportsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AsmReports'] })
  .injectEndpoints({
    endpoints: (builder) => ({


      getAsmReports: builder.query({
        query: ({ page = 1, limit = 10, search = '' } = {}) => ({
          url: `/op/api/v1/reports`,
          params: { page, limit, ...(search && { search }) },
        }),
        providesTags: (result) => ['AsmReports'],
      }),


      getAsmSupportedReports: builder.query({
        query: () => ({
          url: `/op/api/v1/reports/supported-reports`,
        }),
        providesTags: ['AsmReports'],
      }),


      getReportData: builder.query({
        query: (reportType) => ({
          url: `/op/api/v1/reports/${reportType}/data`,
        }),
        providesTags: ['AsmReports'],
      }),


      getPublicReportData: builder.query({
        query: ({ reportType, orgId, reportId, token } = {}) => ({
          url: `/op/api/v1/reports/data/${reportType}`,
          params: {
            ...(orgId && { orgId }),
            ...(reportId && { reportId }),
            ...(token && { token }),
          },
        }),
      }),


      generateAsmReport: builder.mutation({
        query: (reportName) => ({
          // url: `/op/report`,
          url: '/op/api/v1/reports',
          method: 'POST',
          body: { name: reportName },
        }),
        invalidatesTags: ['AsmReports'],
      }),


      deleteAsmReport: builder.mutation({
        query: (reportId) => ({
          // url: `/op/report/${reportId}`,
          url: `/op/api/v1/reports/${reportId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AsmReports'],
      }),


      downloadAsmReport: builder.mutation({
        query: (reportId) => ({
          url: `/op/api/v1/reports/download/${reportId}`,
        }),
      }),


      previewAsmReport: builder.mutation({
        query: (reportId) => ({
          url: `/op/api/v1/reports/preview/${reportId}`,
        }),
      }),


      //new reports 
      generateAsmNewReport: builder.mutation({
        query: ({ reportType, name, format }) => ({
          url: `/op/api/v1/reports/generate/${reportType}`,
          method: 'POST',
          body: { name, format },
        }),
        invalidatesTags: ['AsmReports'],
      }),

      bulkDeleteAsmReports: builder.mutation({
        query: (reportIds) => ({
          url: `/op/api/v1/reports/bulk`,
          method: 'DELETE',
          body: { reportIds },
        }),
        invalidatesTags: ['AsmReports'],
      }),

      cancelAsmReport: builder.mutation({
        query: (reportId) => ({
          url: `/op/api/v1/reports/${reportId}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: ['AsmReports'],
      }),
    }),
  });

export const {
  useGetAsmReportsQuery,
  useGetAsmSupportedReportsQuery,
  useGetAsmReportDataQuery,
  useGetAsmPublicReportDataQuery,
  useLazyGetAsmReportDataQuery,
  useDeleteAsmReportMutation,
  useLazyPreviewAsmReportQuery,
  useGenerateAsmReportMutation,
  useGenerateAsmNewReportMutation,
  useDownloadAsmReportMutation,
  usePreviewAsmReportMutation,
  useBulkDeleteAsmReportsMutation,
  useCancelAsmReportMutation,
} = asmReportsApi;
