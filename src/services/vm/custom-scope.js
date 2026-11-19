import { baseApi } from '@/services/baseApi';

export const customScopeApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['customScopeApi'] })
    .injectEndpoints({
        endpoints: (builder) => ({

            getVmCustomScope: builder.query({
                query: ({ assessmentId, params }) => ({
                    url: `/csm/api/assessment-scope/${assessmentId}`,
                    params
                }),
                providesTags: (result) => ['customScopeApi'],
            }),

            getVmCustomScopeIsLocked: builder.query({
                query: ({ assessmentId }) => ({
                    url: `/csm/api/assessment-scope/isLocked/${assessmentId}`,
                }),
                providesTags: (result) => ['customScopeApi'],
            }),

            createVmCustomScope: builder.mutation({
                query: (data) => ({
                    url: `/csm/api/assessment-scope`,
                    method: 'POST',
                    body: data,
                }),
                invalidatesTags: ['customScopeApi'],
            }),

            approveVmCustomScope: builder.mutation({
                query: ({ assessmentId, payload }) => ({
                    url: `/csm/api/assessment-scope/${assessmentId}`,
                    method: 'PATCH',
                    body: payload
                }),
                invalidatesTags: ['customScopeApi'],
            }),

            uploadVmFile: builder.mutation({
                query: ({ data, assessmentId }) => ({
                    url: `/csm/api/assessment-scope/attachment/upload/${assessmentId}`,
                    method: 'POST',
                    body: data,
                }),
                invalidatesTags: ['customScopeApi'],
            }),

            downloadVmFiles: builder.query({
                query: (uid) => ({
                    url: `/csm/api/assessment-scope/attachment/download/${uid}`,
                    responseHandler: (response) => response.blob(),
                }),
            }),
        }),
    });

export const {
    useCreateVmCustomScopeMutation,
    useGetVmCustomScopeQuery,
    useUploadVmFileMutation,
    useLazyDownloadVmFilesQuery,
    useGetVmCustomScopeIsLockedQuery,
    useApproveVmCustomScopeMutation
} = customScopeApi;
