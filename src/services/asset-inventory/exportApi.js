import { baseApi } from '@/services/baseApi';

export const exportApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['AimSupportedReports'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getAimSupportedReports: builder.query({
                query: () => ({
                    url: `/asset-inventory/api/v1/exports/supported`,
                }),
                providesTags: (result) => ['AimSupportedReports'],
            }),
            downloadAimExport: builder.mutation({
                query: ({ type, format }) => ({
                    url: `/asset-inventory/api/v1/exports/download?type=${type}&format=${format}`,
                    method: 'GET',
                    responseHandler: (response) => response.blob(),
                }),
            }),
        }),
    });

export const {
    useGetAimSupportedReportsQuery,
    useDownloadAimExportMutation,
} = exportApi;
