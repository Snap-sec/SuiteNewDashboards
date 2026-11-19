import { baseApi } from '@/services/baseApi';

export const aptAgentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AptAgents', 'AptAgentSetupCommands'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAptAgents: builder.query({
        query: (params) => ({
          url: '/autopentest/api/v1/agents',
          method: 'GET',
          params,
        }),
        providesTags: ['AptAgents'],
      }),

      getAptAgentSetupCommands: builder.query({
        query: () => ({
          url: '/autopentest/api/v1/agents/setup-commands',
          method: 'GET',
        }),
        providesTags: ['AptAgentSetupCommands'],
      }),

      deleteAptAgent: builder.mutation({
        query: (id) => ({
          url: `/autopentest/api/v1/agents/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AptAgents'],
      }),
    }),
  });

export const {
  useGetAptAgentsQuery,
  useGetAptAgentSetupCommandsQuery,
  useDeleteAptAgentMutation,
  useGetAptgentSetupCommandsQuery,
} = aptAgentsApi;
