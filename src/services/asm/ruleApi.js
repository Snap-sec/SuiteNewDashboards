import { baseApi } from '@/services/baseApi';

const asmRulesListTag = { type: 'AsmRules', id: 'LIST' };

export const asmRuleApi = baseApi.enhanceEndpoints({ addTagTypes: ['AsmRules', 'RuleLibrary'] }).injectEndpoints({
    endpoints: (builder) => ({

        getAsmRules: builder.query({
            query: (params) => ({
                url: `/op/api/v1/rules`,
                params: params
            }),
            providesTags: (result) => {
                const rules = result?.results || [];
                return [
                    asmRulesListTag,
                    ...rules.map((r) => ({ type: 'AsmRules', id: r._id })),
                ];
            },
            transformResponse: (response) => {
                if (response.results) return response;
                return { results: response, totalPages: 1, page: 1, totalResults: response.length };
            }
        }),

        getAsmRule: builder.query({
            query: (ruleId) => ({
                url: `/op/api/v1/rules/${ruleId}`,
            }),
            providesTags: (result, error, ruleId) => [{ type: 'AsmRules', id: ruleId }]
        }),

        createAsmRule: builder.mutation({
            query: (payload) => ({
                url: '/op/api/v1/rules',
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-yaml',
                },
                body: payload
            }),
            invalidatesTags: [asmRulesListTag]
        }),

        executeAsmRule: builder.mutation({
            query: (ruleId) => ({
                url: `/op/api/v1/rules/${ruleId}`,
                method: "POST"
            }),
            invalidatesTags: (_result, _error, ruleId) => [
                asmRulesListTag,
                { type: 'AsmRules', id: ruleId },
            ]
        }),

        deleteAsmRule: builder.mutation({
            query: (ruleId) => ({
                url: `/op/api/v1/rules/${ruleId}`,
                method: "DELETE"
            }),
            invalidatesTags: (_result, _error, ruleId) => [
                asmRulesListTag,
                { type: 'AsmRules', id: ruleId },
            ]
        }),

        updateAsmRule: builder.mutation({
            query: ({ ruleId, yaml }) => ({
                url: `/op/api/v1/rules/${ruleId}`,
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/x-yaml'
                },
                body: yaml
            }),
            invalidatesTags: (_result, _error, { ruleId }) => [
                asmRulesListTag,
                { type: 'AsmRules', id: ruleId },
            ]
        }),

        updateAsmRulePriority: builder.mutation({
            query: ({ ruleId, priority }) => ({
                url: `/op/api/v1/rules/${ruleId}/priority`,
                method: "PATCH",
                body: { priority }
            }),
            invalidatesTags: (_result, _error, { ruleId }) => [
                asmRulesListTag,
                { type: 'AsmRules', id: ruleId },
            ]
        }),

        toggleAsmRuleStatus: builder.mutation({
            async queryFn({ ruleId, enabled }, _queryApi, _extraOptions, fetchWithBQ) {
                // The ASM endpoint now handles both visibility status and the DB engine rule DB change
                const opResult = await fetchWithBQ({
                    url: `/op/api/v1/rules/${ruleId}/status`,
                    method: "PATCH",
                    body: { enabled }
                });

                if (opResult.error) {
                    return { error: opResult.error };
                }

                return { data: opResult.data };
            },
            invalidatesTags: (_result, _error, { ruleId }) => [
                asmRulesListTag,
                { type: 'AsmRules', id: ruleId },
                "AsmExposures",
                "AsmDashboard",
            ]
        }),

        runAllAsmRules: builder.mutation({
            query: () => ({
                url: "/op/api/v1/rules/all",
                method: "POST"
            })
        }),

        runActiveAsmRules: builder.mutation({
            query: () => ({
                url: "/op/api/v1/rules/active",
                method: "POST"
            })
        }),

        syncAsmRule: builder.mutation({
            query: (ruleId) => ({
                url: `/op/api/v1/rules/sync`,
                method: "POST"
            }),
            invalidatesTags: [asmRulesListTag]
        }),

        getAsmRuleProperties: builder.query({
            query: (params) => ({
                url: `/op/api/v1/rules/properties`,
                params
            })
        }),

        //risk Register endpoints 

        executeRiskRegisterAsmRule: builder.mutation({
            query: (ruleId) => ({
                url: `/risk-register/api/v1/rules/execute/${ruleId}`,
                method: "POST"
            }),
            invalidatesTags: ["AsmRules"]
        }),

        runAllRiskRegisterAsmRules: builder.mutation({
            query: () => ({
                url: "/risk-register/api/v1/rules/execute/all",
                method: "POST"
            })
        }),

        getAsmRuleLibrary: builder.query({
            query: (params) => ({
                url: `/op/api/v1/rule-library`,
                params
            }),
            providesTags: ['RuleLibrary']
        }),

        refreshAsmRuleLibrary: builder.mutation({
            query: () => ({
                url: `/op/api/v1/rule-library/refresh`,
                method: "POST"
            }),
            invalidatesTags: ['RuleLibrary']
        }),

        importAsmRuleFromLibrary: builder.mutation({
            query: (ruleId) => ({
                url: `/op/api/v1/rule-library/import/${ruleId}`,
                method: "POST"
            }),
            invalidatesTags: [asmRulesListTag, "RuleLibrary"]
        }),

        importAllAsmRulesFromLibrary: builder.mutation({
            query: (params) => ({
                url: `/op/api/v1/rule-library/import/all`,
                method: "POST",
                params: params // e.g. { skipExisting: false }
            }),
            invalidatesTags: [asmRulesListTag, "RuleLibrary"]
        }),

    }),
});

export const {
    useRunAllAsmRulesMutation,
    useGetAsmRulesQuery,
    useGetAsmRuleQuery,
    useCreateAsmRuleMutation,
    useExecuteAsmRuleMutation,
    useDeleteAsmRuleMutation,
    useUpdateAsmRuleMutation,
    useUpdateAsmRulePriorityMutation,
    useToggleAsmRuleStatusMutation,
    useSyncAsmRuleMutation,
    useRunActiveAsmRulesMutation,
    useGetAsmRulePropertiesQuery,
    useGetAsmRuleLibraryQuery,
    useRefreshAsmRuleLibraryMutation,
    useImportAsmRuleFromLibraryMutation,
    useImportAllAsmRulesFromLibraryMutation,
    useExecuteRiskRegisterAsmRuleMutation,
    useRunAllinRiskRegisterAsmRulesMutation
} = asmRuleApi;
