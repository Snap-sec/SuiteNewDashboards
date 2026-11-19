import { baseApi } from "@/services/baseApi";

export const vsApi = baseApi.enhanceEndpoints({ addTagTypes: ['VsStats', 'VsVulns', 'VsAssets', 'VsScanners', 'VsGroups', 'VsConfig'] }).injectEndpoints({
    endpoints: (builder) => ({

        getVsStats: builder.query({
            query: (params) => ({
                url: '/vs/api/dashboard',
                params
            }),
            providesTags: (result) => ["VsStats"]
        }),
        getVsAssets: builder.query({
            query: ({ page, limit, sortBy, order, search, ...filters }) => ({
                url: '/vs/api/assets',
                params: {
                    page,
                    limit,
                    sortBy,
                    order,
                    search,
                    ...filters
                }
            }),
            providesTags: (result) => ["VsAssets"]
        }),

        getVsAssetStats: builder.query({
            query: () => ({
                url: '/csm/api/assets/get/stats'
            }),
            providesTags: ['VsStats']
        }),

        getVsVulns: builder.query({
            query: ({ page, limit, sortBy, order, search, ...filters }) => ({
                url: '/vs/api/vulns',
                params: {
                    page,
                    limit,
                    sortBy,
                    order,
                    search,
                    ...filters
                }
            }),
            providesTags: (result) => ["VsVulns"]
        }),

        getVsVulnStats: builder.query({
            query: () => ({
                url: '/vs/api/vulns/stats'
            }),
            providesTags: ['VsStats']
        }),

        getVsScanners: builder.query({
            query: (params) => ({
                url: '/vs/api/scanners',
                params
            }),
            providesTags: (result) => ["VsScanners"]
        }),

        getVsSuppressionRules: builder.query({
            query: (params) => ({
                url: '/vs/api/suppression-rules',
                params
            }),
            providesTags: (result) => ["VsSuppressionRules"]
        }),

        getVsSuppressionRuleProperties: builder.query({
            query: () => ({
                url: '/vs/api/suppression-rules/properties'
            }),
            providesTags: ["VsSuppressionRules"]
        }),

        createVsSuppressionRule: builder.mutation({
            query: (data) => ({
                url: '/vs/api/suppression-rules',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['VsSuppressionRules', 'VsVulns', 'VsStats']
        }),

        updateVsSuppressionRule: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/vs/api/suppression-rules/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['VsSuppressionRules', 'VsVulns', 'VsStats']
        }),

        deleteVsSuppressionRule: builder.mutation({
            query: (id) => ({
                url: `/vs/api/suppression-rules/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['VsSuppressionRules', 'VsVulns', 'VsStats']
        }),

        toggleVsSuppressionRule: builder.mutation({
            query: ({ id, enabled }) => ({
                url: `/vs/api/suppression-rules/${id}/status`,
                method: 'PATCH',
                body: { enabled }
            }),
            invalidatesTags: ['VsSuppressionRules', 'VsVulns', 'VsStats']
        }),

        testVsSuppressionScaffold: builder.mutation({
            query: () => ({
                url: `/vs/api/suppression-rules/test`,
                method: 'POST'
            })
        }),

        CreateVsScanner: builder.mutation({
            query: (data) => ({
                url: '/vs/api/scanners',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['VsStats', "VsScanners"]
        }),

        bulkSendVsToVm: builder.mutation({
            query: (vulnIds = []) => ({
                url: '/vs/api/vulns/sendToVm/bulk',
                method: 'POST',
                body: { vulnIds }
            }),
            invalidatesTags: ['VsStats', "VsVulns"]
        }),

        bulkSuppressVsVulns: builder.mutation({
            query: (vulnIds = []) => ({
                url: '/vs/api/vulns/suppress/bulk',
                method: 'POST',
                body: { vulnIds }
            }),
            invalidatesTags: ['VsStats', "VsVulns"]
        }),

        bulkUnSuppressVsVulns: builder.mutation({
            query: (vulnIds = []) => ({
                url: '/vs/api/vulns/unsuppress/bulk',
                method: 'POST',
                body: { vulnIds }
            }),
            invalidatesTags: ['VsStats', "VsVulns"]
        }),

        suppressVsVuln: builder.mutation({
            query: (data) => ({
                url: '/vs/api/vulns/suppress',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['VsVulns']
        }),

        unSuppressVsVuln: builder.mutation({
            query: (data) => ({
                url: '/vs/api/vulns/unsuppress',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['VsVulns']
        }),


        sendVsToVm: builder.mutation({
            query: (body) => ({
                url: '/vs/api/vulns/sendToVm',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['VsVulns']
        }),

        bulkUpdateVsAssets: builder.mutation({
            query: (body) => ({
                url: '/vs/api/assets/bulk/update',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['VsAssets', 'VsStats']
        }),

        bulkDeleteVsAssets: builder.mutation({
            query: ({ assetIds }) => ({
                url: '/vs/api/assets/bulk/delete',
                method: 'POST',
                body: { assetIds }
            }),
            invalidatesTags: ['VsAssets', 'VsStats']
        }),

        getVsGroups: builder.query({
            query: (params) => ({
                url: '/vs/api/groups',
                params
            }),
            providesTags: (result) => ["VsGroups"]
        }),

        getVsConfig: builder.query({
            query: () => ({
                url: '/vs/api/config'
            }),
            providesTags: ["VsConfig"]
        }),

        bulkAddVsAssetsToGroup: builder.mutation({
            query: (body) => ({
                url: '/vs/api/assets/bulk/group/add',
                method: 'POST',
                body
            }),
            invalidatesTags: ['VsAssets', 'VsStats']
        }),

        bulkSendVsAssetsToVm: builder.mutation({
            query: (body) => ({
                url: '/vs/api/assets/bulk/sendToVm',
                method: 'POST',
                body
            }),
            invalidatesTags: ['VsAssets', 'VsStats']
        }),

    }),
});


export const {
    useGetVsStatsQuery,
    useGetVsAssetsQuery,
    useGetVsAssetStatsQuery,
    useGetVsVulnsQuery,
    useGetVsVulnStatsQuery,
    useGetVsScannersQuery,
    useCreateVsScannerMutation,
    useSuppressVsVulnMutation,
    useUnSuppressVsVulnMutation,
    useSendVsToVmMutation,
    useBulkSendVsToVmMutation,
    useBulkSuppressVsVulnsMutation,
    useBulkUnSuppressVsVulnsMutation,
    useBulkUpdateVsAssetsMutation,
    useBulkDeleteVsAssetsMutation,
    useBulkAddVsAssetsToGroupMutation,
    useBulkSendVsAssetsToVmMutation,
    useGetVsGroupsQuery,
    useGetVsConfigQuery,
    useGetVsSuppressionRulesQuery,
    useGetVsSuppressionRulePropertiesQuery,
    useCreateVsSuppressionRuleMutation,
    useUpdateVsSuppressionRuleMutation,
    useDeleteVsSuppressionRuleMutation,
    useToggleVsSuppressionRuleMutation,
    useTestVsSuppressionScaffoldMutation
} = vsApi;
