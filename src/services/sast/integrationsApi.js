import { baseApi } from '@/services/baseApi';

export const scaIntegrationsApi = baseApi.enhanceEndpoints({ addTagTypes: ['ScaIntegrations'] }).injectEndpoints({
  endpoints: (builder) => ({
    getScaIntegrations: builder.query({
      query: (params) => ({
        url: '/sca/api/v1/integrations',
        params,
      }),
      providesTags: ['ScaIntegrations'],
    }),

    getActiveScaIntegrations: builder.query({
      query: (params) => ({
        url: '/sca/api/v1/integrations/active',
        params,
      }),
      providesTags: ['ScaIntegrations'],
    }),

    getScaIntegrationById: builder.query({
      query: (id) => ({
        url: `/sca/api/v1/integrations/${id}`,
      }),
      providesTags: ['ScaIntegrations'],
    }),

    configureScaIntegration: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sca/api/v1/integrations/${id}/configure`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ScaIntegrations'],
    }),

    disconnectScaIntegration: builder.mutation({
      query: (id) => ({
        url: `/sca/api/v1/integrations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ScaIntegrations'],
    }),

    triggerScaSync: builder.mutation({
      query: (id) => ({
        url: `/sca/api/v1/integrations/${id}/refresh`,
        method: 'POST',
      }),
      invalidatesTags: ['ScaIntegrations', 'ScaProjects'],
    }),

    getScaSyncLogs: builder.query({
      query: (params) => ({
        url: '/sca/api/v1/integrations/logs',
        params,
      }),
      providesTags: ['ScaIntegrations'],
    }),
  }),
});

export const {
  useGetScaIntegrationsQuery,
  useGetActiveScaIntegrationsQuery,
  useGetScaIntegrationByIdQuery,
  useLazyGetScaIntegrationByIdQuery,
  useConfigureScaIntegrationMutation,
  useDisconnectScaIntegrationMutation,
  useTriggerScaSyncMutation,
  useGetScaSyncLogsQuery,
} = scaIntegrationsApi;
