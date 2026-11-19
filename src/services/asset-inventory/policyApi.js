import { baseApi } from '@/services/baseApi';

export const policyApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['getPolicies', 'getPolicy', "getPolicyProperties", "AimRuleJobs", "AimRuleLibrary"] })
    .injectEndpoints({
        endpoints: (builder) => ({

            getAimPolicyProperties: builder.query({
                query: () => ({
                    url: `/asset-inventory/api/v1/policy/schema`,
                }),
                providesTags: (result) => ['getPolicyProperties'],
            }),

            getAimPoliciesByType: builder.query({
                query: (params) => {
                    const url = `/asset-inventory/api/v1/policy`;
                    return {
                        url,
                        method: 'GET',
                        params
                    };
                },
                providesTags: (result) => ['getPolicies'],
            }),

            getAimPolicyById: builder.query({
                query: (id) => ({
                    url: `/asset-inventory/api/v1/policy/${id}`,
                }),
                providesTags: (result) => ['getPolicy'],
            }),

            createAimPolicy: builder.mutation({
                query: (payload) => ({
                    url: '/asset-inventory/api/v1/policy',
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/x-yaml"
                    },
                    body: payload,
                }),
                invalidatesTags: ['getPolicies', 'getPolicy'],
            }),

            updateAimPolicy: builder.mutation({
                query: ({ policyId, payload }) => ({
                    url: `/asset-inventory/api/v1/policy/${policyId}`,
                    method: 'PUT',
                    body: payload,
                    headers: {
                        'Content-Type': "application/x-yaml"
                    },
                }),
                invalidatesTags: ['getPolicies', 'getPolicy'],
            }),

            toggleAimPolicy: builder.mutation({
                query: ({ policyId, enabled }) => ({
                    url: `/asset-inventory/api/v1/policy/${policyId}/toggle`,
                    method: 'PATCH',
                    body: { enabled },
                }),
                invalidatesTags: ['getPolicies', 'getPolicy'],
            }),

            // Execute all policy rules
            executeAllAimPolicy: builder.mutation({
                query: () => ({
                    url: `/asset-inventory/api/v1/policy/execute`,
                    method: 'POST',

                }),
                invalidatesTags: ['getPolicies', 'getPolicy', 'AimRuleJobs'],
            }),

            // Execute single policy by policyId
            executeSingleAimPolicy: builder.mutation({
                query: (policyId) => ({
                    url: `/asset-inventory/api/v1/policy/execute/${policyId}`,
                    method: 'POST',

                }),

                invalidatesTags: ['getPolicies', 'getPolicy', 'AimRuleJobs'],
            }),

            deleteAimPolicy: builder.mutation({
                query: (id) => ({
                    url: `/asset-inventory/api/v1/policy/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['getPolicies'],
            }),

            // Returns matched assets for a policy
            getPolicyMatchedAimAssets: builder.query({
                query: ({ policyId, params }) => ({
                    url: `/asset-inventory/api/v1/policy/${policyId}/matched-assets`,
                    params,
                }),
            }),

            getAimPolicyLibrary: builder.query({
                query: (params) => ({
                    url: `/asset-inventory/api/v1/rule-library`,
                    params,
                }),
                providesTags: ['AimRuleLibrary'],
            }),

            refreshAimPolicyLibrary: builder.mutation({
                query: () => ({
                    url: `/asset-inventory/api/v1/rule-library/refresh`,
                    method: 'POST',
                }),
                invalidatesTags: ['AimRuleLibrary'],
            }),

            importAimPolicyFromLibrary: builder.mutation({
                query: (ruleId) => ({
                    url: `/asset-inventory/api/v1/rule-library/${ruleId}/import`,
                    method: 'POST',
                }),
                invalidatesTags: ['getPolicies', "AimRuleLibrary"],
            }),
        }),
    });


export const {
    useGetAimPolicyPropertiesQuery,
    useGetAimPolicyByIdQuery,
    useGetAimPoliciesByTypeQuery,
    useCreateAimPolicyMutation,
    useUpdateAimPolicyMutation,
    useToggleAimPolicyMutation,
    useDeleteAimPolicyMutation,
    useExecuteAllAimPolicyMutation,
    useExecuteSingleAimPolicyMutation,
    useGetPolicyMatchedAimAssetsQuery,
    useGetAimPolicyLibraryQuery,
    useRefreshAimPolicyLibraryMutation,
    useImportAimPolicyFromLibraryMutation,
} = policyApi;
