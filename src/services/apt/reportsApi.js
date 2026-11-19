import { baseApi } from '@/services/baseApi';

export const aptReportsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AptReports'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAptSupportedReports: builder.query({
        query: (params) => ({
          url: '/autopentest/api/v1/reports/supported-reports',
          params,
        }),
        providesTags: ['AptReports'],
      }),

      getAptReports: builder.query({
        query: (params) => ({
          url: '/autopentest/api/v1/reports',
          params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            ...(params?.search ? { search: params.search } : {}),
            ...(params?.filters ? { filters: params.filters } : {}),
          },
        }),
        providesTags: ['AptReports'],
      }),

      getAptReportData: builder.query({
        query: ({ reportType = 'vuln-report', reportId, accessToken } = {}) => ({
          url: `/autopentest/api/v1/reports/data/${reportType}`,
          params: {
            ...(reportId ? { reportId } : {}),
            ...(accessToken ? { accessToken } : {}),
          },
        }),
        providesTags: ['AptReports'],
      }),

      generateAptReport: builder.mutation({
        query: ({ reportType, name, format } = {}) => ({
          url: `/autopentest/api/v1/reports/generate/${reportType}`,
          method: 'POST',
          body: {
            ...(name && { name }),
            ...(format && { format }),
          },
        }),
        invalidatesTags: ['AptReports'],
      }),

      deleteAptReport: builder.mutation({
        query: (reportId) => ({
          url: `/autopentest/api/v1/reports/${reportId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AptReports'],
      }),
    }),
  });

export const {
  useGetAptSupportedReportsQuery,
  useLazyGetAptSupportedReportsQuery,
  useGetAptReportsQuery,
  useLazyGetAptReportsQuery,
  useGetAptReportDataQuery,
  useLazyGetAptReportDataQuery,
  useGenerateAptReportMutation,
  useDeleteAptReportMutation,
} = aptReportsApi;
