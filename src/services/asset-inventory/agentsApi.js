import { baseApi } from '@/services/baseApi';

export const agentsApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['AssetInventoryAgents', "AssetInventoryAgentsSettings"] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getAimAgents: builder.query({
                query: (params) => ({
                    url: '/asset-inventory/api/v1/agents',
                    method: 'GET',
                    params,
                }),
                providesTags: (result) => ['AssetInventoryAgents'],
            }),

            getAimAgentSettings: builder.query({
                query: () => ({
                    url: '/asset-inventory/api/v1/settings',
                    method: 'GET',
                }),
                providesTags: ['AssetInventoryAgentsSettings'],
            }),

            deleteAimAgent: builder.mutation({
                query: (id) => ({
                    url: `/asset-inventory/api/v1/agents/${id}/kill`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['AssetInventoryAgents'],
            }),

            configureAimAgentsSetting: builder.mutation({
                query: (data) => ({
                    url: '/util/v1/agents/configure/aim',
                    method: 'POST',
                    body: data,
                }),
                invalidatesTags: ['AssetInventoryAgentsSettings', 'OrgSettings'],
            }),
        }),
    });

export const {
    useGetAimAgentsQuery,
    useGetAimAgentSettingsQuery,
    useDeleteAimAgentMutation,
    useConfigureAimAgentsSettingMutation
} = agentsApi;
