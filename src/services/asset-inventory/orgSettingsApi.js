import { baseApi } from '@/services/baseApi';

export const orgSettingsApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['OrgSettings'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getAimOrgSettings: builder.query({
                query: () => ({
                    url: '/util/v1/agents/setup-commands',
                    method: 'GET',
                }),
                providesTags: ['OrgSettings'],
            }),

            getAimOrgApiKey: builder.query({
                query: () => ({
                    url: '/util/v1/settings/agent',
                    method: 'GET',
                }),
                providesTags: ['OrgSettings'],
            }),

            resetAimApiKey: builder.mutation({
                query: () => ({
                    url: '/util/v1/settings/agent/generate-key',
                    method: 'POST',
                }),
                invalidatesTags: ['OrgSettings'],
            }),

            getAimOrgScanTargets: builder.query({
                query: () => ({
                    url: '/asset-inventory/api/v1/settings/scan-targets',
                    method: 'GET',
                }),
                providesTags: ['OrgSettings'],
            }),

            updateAimOrgScanTargets: builder.mutation({
                query: (data) => ({
                    url: '/asset-inventory/api/v1/settings/scan-targets',
                    method: 'PUT',
                    body: data,
                }),
                invalidatesTags: ['OrgSettings'],
            }),
        }),
    });

export const {
    useGetAimOrgSettingsQuery,
    useResetAimApiKeyMutation,
    useGetAimOrgApiKeyQuery,
    useGetAimOrgScanTargetsQuery,
    useUpdateAimOrgScanTargetsMutation,
} = orgSettingsApi;
