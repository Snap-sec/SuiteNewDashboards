import { baseApi } from '@/services/baseApi';

export const vsAgentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VsAgents', 'VsAgentSetupCommands'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVsAgents: builder.query({
        query: (params) => ({
          url: '/vs/api/agents',
          method: 'GET',
          params,
        }),
        providesTags: ['VsAgents'],
      }),

      getVsAgentSetupCommands: builder.query({
        query: () => ({
          url: '/vs/api/agents/setup-commands',
          method: 'GET',
        }),
        providesTags: ['VsAgentSetupCommands'],
      }),

      deleteVsAgent: builder.mutation({
        query: (id) => ({
          url: `/vs/api/agents/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['VsAgents'],
      }),
    }),
  });

export const {
  useGetVsAgentsQuery,
  useGetVsAgentSetupCommandsQuery,
  useDeleteVsAgentMutation,
  // Aliases for convenience
  useGetVsAgentsQuery: useGetAgentsQuery,
  useGetVsAgentSetupCommandsQuery: useGetAgentSetupCommandsQuery,
  useDeleteVsAgentMutation: useDeleteAgentMutation,
} = vsAgentsApi;
