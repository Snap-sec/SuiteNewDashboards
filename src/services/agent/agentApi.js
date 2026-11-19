import { baseApi } from '@/services/baseApi';

export const agentApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Agents'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAgents: builder.query({
        query: (params) => ({
          url: '/util/v1/agents',
          method: 'GET',
          params,
        }),
        providesTags: ['Agents'],
      }),
      getAgentSettings: builder.query({
        query: () => ({
          url: `/util/v1/agents/setup-commands`,
          method: 'GET',
        }),
      }),
      getDashboardMetrics: builder.query({
        query: () => ({
          url: '/util/v1/agents/dashboard',
          method: 'GET',
        }),
        providesTags: ['Agents'],
      }),
      getAgentGlobalSettings: builder.query({
        query: () => ({
          url: '/util/v1/agents/configure',
          method: 'GET',
        }),
        providesTags: ['Agents'],
      }),
      configureAimAgent: builder.mutation({
        query: (body) => ({
          url: '/util/v1/agents/configure',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Agents'],
      }),
      runAgentScan: builder.mutation({
        query: (body) => ({
          url: '/util/v1/agents/scan',
          method: 'POST',
          body,
        }),
      }),
      deleteAgent: builder.mutation({
        query: (id) => ({
          url: `/util/v1/agents/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Agents'],
      }),
    }),
  });

export const {
  useGetAgentsQuery,
  useGetAgentSettingsQuery,
  useGetDashboardMetricsQuery,
  useGetAgentGlobalSettingsQuery,
  useConfigureAimAgentMutation,
  useRunAgentScanMutation,
  useDeleteAgentMutation
} = agentApi;
