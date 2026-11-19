import { baseApi } from "@/services/baseApi";


export const asmExposureApi = baseApi.enhanceEndpoints({ addTagTypes: ['Exposures'] }).injectEndpoints({
    endpoints: (builder) => ({

        getAsmExposures: builder.query({
            query: (params) => ({
                url: "/op/api/v1/exposures",
                params
            }),
            providesTags: (result) => ["Exposures"]
        }),


        updateAsmExposure: builder.mutation({
            query: ({ exposureId, ...updates }) => ({
                url: `/op/api/v1/exposures/${exposureId}`,
                method: "PATCH",
                body: updates
            }),
            invalidatesTags: ['Exposures']
        }),

        createAsmExposure: builder.mutation({
            query: (body) => ({
                url: `/op/api/v1/exposures`,
                method: "POST",
                body
            }),
            invalidatesTags: ['Exposures']
        }),

        markAsmExposureSafe: builder.mutation({
            query: (exposureId) => ({
                url: `/op/assets/exposure/${exposureId}/safe`,
                method: "POST"
            }),
            invalidatesTags: ["Exposures"]
        }),

        deleteAsmExposure: builder.mutation({
            query: (exposureId) => ({
                url: `/op/api/v1/exposures/${exposureId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Exposures"]
        }),

        syncAsmVulns: builder.mutation({
            query: (exposureId) => ({
                url: "/op/api/v1/exposures/sync",
                method: "POST",
                body: { exposureId }
            }),
            invalidatesTags: ["Exposures"]
        }),

        analyzeAsmExposures: builder.mutation({
            query: () => ({
                url: "/op/api/v1/exposures/ai-analysis",
                method: "POST"
            }),
            invalidatesTags: ["Exposures"]
        }),


        getAsmExposureReasons: builder.query({
            query: ({ assetType, status }) => ({
                url: `/op/api/v1/exposures/reason-list/${assetType}`,
                params: {
                    status: status // 'exposure' or 'safe'
                }
            }),
            providesTags: (result) => ["Exposures"]
        }),




        //Bulk Update 
        bulkUpdateAsmExposure: builder.mutation({
            query: ({ exposureIds, ...updates }) => ({
                url: `/op/api/v1/exposures/update/bulk`,
                method: "PATCH",
                body: {
                    exposureIds,
                    updates
                }
            }),
            invalidatesTags: ["Exposures"]
        }),

        bulkDeleteAsmExposure: builder.mutation({
            query: (exposureIds) => ({
                url: `/op/api/v1/exposures/delete/bulk`,
                method: "POST",
                body: {
                    exposureIds
                }
            }),
            invalidatesTags: ["Exposures"]
        }),

        getAsmExposuresByIds: builder.query({
            query: ({ ruleId, ...params }) => ({
                url: `/op/api/v1/assets/impacted/${ruleId}`,
                method: "GET",
                params
            }),
            providesTags: (result) => ["AsmExposuresByIds"]
        }),

        raiseAsmExposure: builder.mutation({
            query: ({ assetId, ruleId }) => ({
                url: `/op/api/v1/assets/raise-exposure`,
                method: "POST",
                body: { assetId, ruleId }
            }),
            invalidatesTags: ["Exposures", "AsmExposuresByIds"]
        }),


        exportAsmExposures: builder.query({
            query: ({ ruleId, search }) => ({
                url: `/op/api/v1/assets/impacted/${ruleId}/export`,
                method: 'GET',
                params: search ? { search } : undefined,
                responseHandler: (response) => response.blob(),
            }),
        }),

    }),
});

export const {
    useCreateAsmExposureMutation,
    useGetAsmExposuresQuery,
    useGetAsmExposuresByIdsQuery,
    useRaiseAsmExposureMutation,
    useUpdateAsmExposureMutation,
    useDeleteAsmExposureMutation,
    useMarkAsmExposureSafeMutation,
    useSyncAsmVulnsMutation,
    useAnalyzeAsmExposuresMutation,
    useGetAsmExposureReasonsQuery,
    useBulkUpdateAsmExposureMutation,
    useBulkDeleteAsmExposureMutation,
    useLazyExportAsmExposuresQuery,
} = asmExposureApi;