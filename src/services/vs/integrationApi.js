import { baseApi } from "@/services/baseApi";


export const vsIntegrationApi = baseApi.enhanceEndpoints({ addTagTypes: ['config', 'Vulns', 'Adapters'] }).injectEndpoints({

    endpoints: (builder) => ({

        getVsConfig: builder.query({
            query: (params) => ({
                url: `/vs/api/config`,
            }),
            providesTags: (result) => ["Config"]
        }),

        updateVsConfig: builder.mutation({
            query: (data) => ({
                url: "/vs/api/config",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Config"]
        }),

        getVsAdapters: builder.query({
            query: (params) => ({
                url: `/vs/api/adapters`
            }),
            providesTags: (result) => ["Adapters"]
        }),

        installVsAdapter: builder.mutation({
            query: (data) => ({
                url: '/vs/api/adapters',
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Adapters"]
        }),

        deleteVsAdapter: builder.mutation({
            query: (adapterId) => ({
                url: `/vs/api/adapters/${adapterId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Adapters"]
        }),

        syncVsVulns: builder.mutation({
            query: (params) => ({
                url: `/vs/api/vulns/sync`,
                method: "POST",
            }),
            invalidatesTags: ["Vulns"]
        }),

        refreshVsAdapter: builder.mutation({
            query: (adapterId) => ({
                url: `/vs/api/adapters/refresh/${adapterId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Adapters"]
        })
    })

});


export const {
    useGetVsConfigQuery,
    useGetVsAdaptersQuery,
    useSyncVsVulnsMutation,
    useInstallVsAdapterMutation,
    useUpdateVsConfigMutation,
    useDeleteVsAdapterMutation,
    useRefreshVsAdapterMutation
} = vsIntegrationApi;

