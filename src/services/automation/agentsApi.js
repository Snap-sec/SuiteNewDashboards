import { baseApi } from '@/services/baseApi';


export const agentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AutomationAgents'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAgents: builder.query({
        query: (params) => ({
          url: '/automations/api/v1/agents',
          params,
        }),
        providesTags: ['AutomationAgents'],
      }),

      createAgent: builder.mutation({
        query: (body) => ({
          url: '/automations/api/v1/agents',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['AutomationAgents'],
      }),

      runAgent: builder.mutation({
        query: (arg) => {
          const agentId =
            typeof arg === 'string' ? arg : arg?.agentId || arg?.id || arg?._id;
          const body = typeof arg === 'object' ? { ...arg } : {};
          delete body.agentId;
          delete body.id;
          delete body._id;
          return {
            url: `/automations/api/v1/agents/${agentId}/execute`,
            method: 'POST',
            body: Object.keys(body).length > 0 ? body : undefined,
          };
        },
        invalidatesTags: (result, error, arg) => {
          const id =
            typeof arg === 'string' ? arg : arg?.agentId || arg?.id || arg?._id;
          return [
            'AutomationAgents',
            ...(id
              ? [
                  { type: 'AutomationAgents', id: `${id}-runs` },
                  { type: 'AutomationAgents', id },
                ]
              : []),
          ];
        },
      }),

      executeAgent: builder.mutation({
        query: (arg) => {
          const agentId =
            typeof arg === 'string' ? arg : arg?.agentId || arg?.id || arg?._id;
          const body = typeof arg === 'object' ? { ...arg } : {};
          delete body.agentId;
          delete body.id;
          delete body._id;
          return {
            url: `/automations/api/v1/agents/${agentId}/execute`,
            method: 'POST',
            body: Object.keys(body).length > 0 ? body : undefined,
          };
        },
        invalidatesTags: (result, error, arg) => {
          const id =
            typeof arg === 'string' ? arg : arg?.agentId || arg?.id || arg?._id;
          return [
            'AutomationAgents',
            ...(id
              ? [
                  { type: 'AutomationAgents', id: `${id}-runs` },
                  { type: 'AutomationAgents', id },
                ]
              : []),
          ];
        },
      }),

      getAgentById: builder.query({
        query: (agentId) => `/automations/api/v1/agents/${agentId}`,
        providesTags: (result, error, id) => [{ type: 'AutomationAgents', id }],
      }),

      getAgentRuns: builder.query({
        query: (arg) => {
          const agentId = typeof arg === 'string' ? arg : arg?.agentId;
          const params = typeof arg === 'object' ? { ...arg } : {};
          delete params.agentId;
          return {
            url: `/automations/api/v1/agents/${agentId}/runs`,
            params: Object.keys(params).length ? params : undefined,
          };
        },
        providesTags: (result, error, arg) => {
          const id = typeof arg === 'string' ? arg : arg?.agentId;
          return [{ type: 'AutomationAgents', id: `${id}-runs` }];
        },
      }),

      getAgentRunDetails: builder.query({
        query: ({ agentId, runId }) =>
          `/automations/api/v1/agents/${agentId}/runs/${runId}`,
        providesTags: (result, error, { agentId, runId }) => [
          { type: 'AutomationAgents', id: `${agentId}-run-${runId}` },
        ],
      }),

      downloadAgentRunArtifact: builder.mutation({
        query: ({ agentId, runId, fileName }) => ({
          url: `/automations/api/v1/agents/${agentId}/runs/${runId}/artifacts/${encodeURIComponent(fileName)}`,
          responseHandler: (response) => response.blob(),
        }),
      }),

      updateAgent: builder.mutation({
        query: ({ agentId, ...body }) => ({
          url: `/automations/api/v1/agents/${agentId}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, { agentId }) => [
          'AutomationAgents',
          { type: 'AutomationAgents', id: agentId },
        ],
      }),

      deleteAgent: builder.mutation({
        query: (agentId) => ({
          url: `/automations/api/v1/agents/${agentId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AutomationAgents'],
      }),

      getAutomationAgentLibrary: builder.query({
        query: (params) => ({
          url: '/automations/api/v1/agents/library',
          params,
        }),
        providesTags: ['AutomationAgents'],
      }),
      getAutomationAgentById: builder.query({
        query: (agentId) => `/automations/api/v1/agents/library/${agentId}`,
        providesTags: (result, error, id) => [
          { type: 'AutomationAgents', id: `library-${id}` },
        ],
      }),

      importAutomationAgent: builder.mutation({
        query: (agentId) => ({
          url: `/automations/api/v1/agents/import/${agentId}`,
          method: 'POST',
        }),
        invalidatesTags: ['AutomationAgents'],
      }),

      pauseAgentRun: builder.mutation({
        query: ({ agentId, runId }) => ({
          url: `/automations/api/v1/agents/${agentId}/runs/${runId}/pause`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { agentId }) => [
          'AutomationAgents',
          { type: 'AutomationAgents', id: `${agentId}-runs` },
          { type: 'AutomationAgents', id: agentId },
        ],
      }),

      resumeAgentRun: builder.mutation({
        query: ({ agentId, runId }) => ({
          url: `/automations/api/v1/agents/${agentId}/runs/${runId}/resume`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { agentId }) => [
          'AutomationAgents',
          { type: 'AutomationAgents', id: `${agentId}-runs` },
          { type: 'AutomationAgents', id: agentId },
        ],
      }),

      terminateAgentRun: builder.mutation({
        query: ({ agentId, runId }) => ({
          url: `/automations/api/v1/agents/${agentId}/runs/${runId}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { agentId }) => [
          'AutomationAgents',
          { type: 'AutomationAgents', id: `${agentId}-runs` },
          { type: 'AutomationAgents', id: agentId },
        ],
      }),

      cancelAgentRun: builder.mutation({
        query: ({ agentId, runId }) => ({
          url: `/automations/api/v1/agents/${agentId}/runs/${runId}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { agentId }) => [
          'AutomationAgents',
          { type: 'AutomationAgents', id: `${agentId}-runs` },
          { type: 'AutomationAgents', id: agentId },
        ],
      }),

      // POST /automations/api/v1/skills/refresh - Refresh/sync agents
      refreshAutomationAgents: builder.mutation({
        query: () => ({
          url: '/automations/api/v1/skills/refresh',
          method: 'POST',
        }),
        invalidatesTags: ['AutomationAgents', 'AutomationSkills'],
      }),

      getAutomationSingleRunDetails: builder.query({
        query: ({runId}) => `/automations/api/v1/agents/runs/${runId}`,
      }),
    }),
  });

export const {
  useGetAgentsQuery,
  useCreateAgentMutation,
  useRunAgentMutation,
  useExecuteAgentMutation,
  useGetAgentByIdQuery,
  useGetAgentRunsQuery,
  useGetAgentRunDetailsQuery,
  useDownloadAgentRunArtifactMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useGetAutoAgentLibraryQuery,
  useGetLibraryAgentByIdQuery,
  useImportAgentMutation,
  usePauseAgentRunMutation,
  useResumeAgentRunMutation,
  useTerminateAgentRunMutation,
  useCancelAgentRunMutation,
  useGetAutomationAgentLibraryQuery,
  useGetAutomationAgentByIdQuery,
  useImportAutomationAgentMutation,
  useRefreshAutomationAgentsMutation,
  useGetAutomationSingleRunDetailsQuery
} = agentsApi;