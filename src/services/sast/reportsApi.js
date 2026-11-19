import { baseApi } from '@/services/baseApi';

export const sastReportsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SastReports'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSastSupportedReports: builder.query({
        query: (params) => ({
          url: '/sast/api/v1/reports/supported',
          params,
        }),
        providesTags: ['SastReports'],
      }),

      downloadSastReport: builder.query({
        query: ({ type, format } = {}) => ({
          url: `/sast/api/v1/reports/download?type=${type}&format=${format}`,
        }),
      }),

      exportFullCatalog: builder.query({
        query: () => ({
          url: '/sast/api/v1/reports/export-full-catalog',
        }),
      }),
    }),
  });

export const {
  useGetSastSupportedReportsQuery,
  useDownloadSastReportQuery,
  useLazyDownloadSastReportQuery,
  useExportFullCatalogQuery,
  useLazyExportFullCatalogQuery,
} = sastReportsApi;
