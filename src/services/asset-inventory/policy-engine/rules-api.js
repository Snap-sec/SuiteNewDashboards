import { baseApi } from '@/services/baseApi';

export const asmRuleApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AsmRules', 'AimRuleJobs'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      createAimRule: builder.mutation({
        query: (payload) => ({
          url: '/op/api/v1/rules',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-yaml',
          },
          body: payload,
        }),
        invalidatesTags: ['AsmRules'],
      }),

      executeAimRule: builder.mutation({
        query: (ruleId) => ({
          url: `/op/api/v1/rules/${ruleId}`,
          method: 'POST',
        }),
        invalidatesTags: ['AsmRules'],
      }),

      deleteAimRule: builder.mutation({
        query: (ruleId) => ({
          url: `/op/api/v1/rules/${ruleId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AsmRules'],
      }),

      updateAimRule: builder.mutation({
        query: ({ ruleId, yaml }) => ({
          url: `/op/api/v1/rules/${ruleId}`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/x-yaml',
          },
          body: yaml,
        }),
        invalidatesTags: ['AsmRules'],
      }),

      updateAimRulePriority: builder.mutation({
        query: ({ ruleId, priority }) => ({
          url: `/op/api/v1/rules/${ruleId}/priority`,
          method: 'PATCH',
          body: { priority },
        }),
        invalidatesTags: ['AsmRules'],
      }),

      toggleAimRuleStatus: builder.mutation({
        async queryFn(
          { ruleId, enabled },
          _queryApi,
          _extraOptions,
          fetchWithBQ,
        ) {
          // The ASM endpoint now handles both visibility status and the DB engine rule DB change
          const opResult = await fetchWithBQ({
            url: `/op/api/v1/rules/${ruleId}/status`,
            method: 'PATCH',
            body: { enabled },
          });

          if (opResult.error) {
            return { error: opResult.error };
          }

          return { data: opResult.data };
        },
        invalidatesTags: ['AsmRules', 'AsmExposures', 'AsmDashboard'],
      }),

      runAllRules: builder.mutation({
        query: () => ({
          url: '/op/api/v1/rules/all',
          method: 'POST',
        }),
      }),

      runAimActiveRules: builder.mutation({
        query: () => ({
          url: '/op/api/v1/rules/active',
          method: 'POST',
        }),
      }),

      syncAimAsmRule: builder.mutation({
        query: (ruleId) => ({
          url: `/op/api/v1/rules/sync`,
          method: 'POST',
        }),
        invalidatesTags: ['AsmRules'],
      }),

      getAimRuleProperties: builder.query({
        query: (params) => ({
          url: `/op/api/v1/rules/properties`,
          params,
        }),
      }),
      getAimRuleJobs: builder.query({
        query: ({ policyId, page, limit }) => ({
          url: `/asset-inventory/api/v1/policy/${policyId}/jobs`,
          params: { page, limit },
        }),
        providesTags: ['AimRuleJobs'],
      }),

      updateAimRuleJob: builder.mutation({
        query: ({ policyId, jobId, payload }) => ({
          url: `/asset-inventory/api/v1/policy/${policyId}/jobs/${jobId}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['AimRuleJobs'],
      }),
    }),
  });

export const {
  useRunAllRulesMutation,
  useCreateAimRuleMutation,
  useExecuteAimRuleMutation,
  useDeleteAimRuleMutation,
  useUpdateAimRuleMutation,
  useUpdateAimRulePriorityMutation,
  useToggleAimRuleStatusMutation,
  useSyncAimRuleMutation,
  useRunAimActiveRulesMutation,
  useGetAimRulePropertiesQuery,
  useGetAimRuleJobsQuery,
  useUpdateAimRuleJobMutation,
} = asmRuleApi;
