import { baseApi } from '@/services/baseApi';

export const reportApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VmReports', 'VmSpecificAssessmentReports'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      // csm/api/reports

      getVmReports: builder.query({
        query: (params) => ({
          url: 'csm/api/reports',
          params,
        }),
        providesTags: (result) => ['VmReports'],
      }),

      generateVmFullExeReport: builder.mutation({
        query: () => ({
          url: 'csm/api/assessments/report/full-exec/generate',
          method: 'GET',
        }),
        invalidatesTags: ['VmReports'],
      }),

      generateVmFullRevalidationReport: builder.mutation({
        query: () => ({
          url: 'csm/api/assessments/org-revalidation-report',
          method: 'GET',
          responseHandler: (response) => response.blob(),
        }),
        invalidatesTags: ['VmReports'],
      }),
      generateVmAssetReport: builder.mutation({
        query: ({ assetType, body }) => ({
          url: `csm/api/assessments/report/generate-asset/${assetType}`,
          method: 'POST',
          body: body,
        }),
        invalidatesTags: ['VmReports'],
      }),

      generateVmAssessmentSpecificReport: builder.mutation({
        query: (data) => ({
          url: `csm/api/assessments/report/generate-report/${data.id}`,
          method: 'POST',
          body: data.body,
        }),

        invalidatesTags: ['VmReports'],
      }),

      generateVmAssessmentSpecificExecutiveReport: builder.mutation({
        query: (data) => ({
          url: `csm/api/assessments/report/generate-exec/${data.id}`,
          method: 'POST',
          body: data.body,
        }),

        invalidatesTags: ['VmReports'],
      }),

      generateVmReport: builder.mutation({
        query: ({ body, params }) => ({
          url: `/csm/api/reports/generate`,
          method: 'POST',
          body,
          params,
        }),

        invalidatesTags: ['VmReports', 'VmSpecificAssessmentReports'],
      }),

      deleteVmReport: builder.mutation({
        query: (reportId) => ({
          url: `/csm/api/reports/${reportId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['VmReports'],
      }),

      // regenerates the failed reports
      reGenerateVmReport: builder.mutation({
        query: (reportId) => ({
          url: `/csm/api/reports/${reportId}/regenerate`,
          method: 'POST',
        }),

        invalidatesTags: ['VmReports'],
      }),

      bulkDeleteVmReports: builder.mutation({
        query: (reportIds) => ({
          url: `/csm/api/reports/bulk`,
          method: 'DELETE',
          body: { reportIds },
        }),
        invalidatesTags: ['VmReports'],
      }),
    }),
  });

export const {
  useGetVmReportsQuery,
  useGenerateVmReportMutation,
  useGenerateVmFullExeReportMutation,
  useGenerateVmFullRevalidationReportMutation,
  useGenerateVmAssetReportMutation,
  useGenerateVmAssessmentSpecificReportMutation,
  useGenerateVmAssessmentSpecificExecutiveReportMutation,
  useDeleteVmReportMutation,
  useReGenerateVmReportMutation,
  useBulkDeleteVmReportsMutation,
} = reportApi;
``;
