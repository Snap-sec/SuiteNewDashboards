
import { baseApi } from '@/services/baseApi';

export const automationApi = baseApi.enhanceEndpoints({ addTagTypes: ['VMautomation'] }).injectEndpoints({
    endpoints: (builder) => ({

        // ─── Rules CRUD ───────────────────────────────────────────────────────────

        getAutomationRules: builder.query({
            query: (params) => ({
                url: `/csm/api/automation/rules`,
                params,
            }),
            providesTags: ['VMautomation'],
        }),

        getAutomationRule: builder.query({
            query: (id) => ({
                url: `/csm/api/automation/rules/${id}`,
            }),
            providesTags: ['VMautomation'],
        }),

        postAutomationRule: builder.mutation({
            query: (args) => {
                if (args && args.payload) {
                    return {
                        url: '/csm/api/automation/rules',
                        method: 'POST',
                        body: args.payload,
                        params: args.params,
                    };
                }
                return {
                    url: '/csm/api/automation/rules',
                    method: 'POST',
                    body: args,
                };
            },
            invalidatesTags: ['VMautomation'],
        }),

        updateAutomationRule: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/csm/api/automation/rules/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['VMautomation'],
        }),

        deleteAutomationRule: builder.mutation({
            query: (id) => ({
                url: `/csm/api/automation/rules/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['VMautomation'],
        }),

        toggleAutomationRule: builder.mutation({
            query: ({ id, enabled }) => ({
                url: `/csm/api/automation/rules/${id}/toggle`,
                method: 'PATCH',
                body: { enabled },
            }),
            invalidatesTags: ['VMautomation'],
        }),

        // ─── Execution ────────────────────────────────────────────────────────────

        getAutomationRuleMatches: builder.query({
            query: ({ id, ...params }) => ({
                url: `/csm/api/automation/rules/${id}/matches`,
                params,
            }),
            providesTags: ['VMautomation'],
        }),

        executeAutomationRule: builder.mutation({
            query: (id) => ({
                url: `/csm/api/automation/rules/${id}/execute`,
                method: 'POST',
            }),
            invalidatesTags: ['VMautomation'],
        }),

        getAutomationRuleJobs: builder.query({
            query: ({ id, ...params }) => ({
                url: `/csm/api/automation/rules/${id}/jobs`,
                params,
            }),
            providesTags: ['VMautomation'],
        }),

        cancelAutomationRuleJob: builder.mutation({
            query: ({ ruleId, jobId, payload }) => ({
                url: `/csm/api/automation/rules/${ruleId}/jobs/${jobId}`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['VMautomation'],
        }),

        bulkAutomationPushToJira: builder.mutation({
            query: ({ vulnIds, config }) => ({
                url: '/csm/api/automation/jira/bulk-push',
                method: 'POST',
                body: { vulnIds, config },
            }),
        }),

        // ─── Discovery ────────────────────────────────────────────────────────────

        getAutomationActions: builder.query({
            query: () => ({
                url: '/csm/api/automation/actions',
            }),
            providesTags: ['VMautomation'],
        }),

        getAutomationSchema: builder.query({
            query: () => ({
                url: '/csm/api/automation/schema',
            }),
            providesTags: ['VMautomation'],
        }),

    }),
});

export const {
    useGetAutomationRulesQuery,
    useGetAutomationRuleQuery,
    usePostAutomationRuleMutation,
    useUpdateAutomationRuleMutation,
    useDeleteAutomationRuleMutation,
    useToggleAutomationRuleMutation,
    useGetAutomationRuleMatchesQuery,
    useExecuteAutomationRuleMutation,
    useGetAutomationRuleJobsQuery,
    useCancelAutomationRuleJobMutation,
    useBulkAutomationPushToJiraMutation,
    useGetAutomationActionsQuery,
    useGetAutomationSchemaQuery,
} = automationApi;
