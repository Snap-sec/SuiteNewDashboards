import { baseApi } from '@/services/baseApi';

export const autoPtIntegrationsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AutoPtIntegrations', 'AutoPtIntegrationLogs'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      // GET /integrations/installed - List all installed integrations
      getInstalledAutoPtIntegrations: builder.query({
        query: (params) => ({
          url: '/integrations/api/v1/integrations/installed',
          method: 'GET',
          params,
        }),
        providesTags: ['AutoPtIntegrations'],
      }),

      // GET /integrations/supported - List all supported integrations
      getSupportedAutoPtIntegrations: builder.query({
        query: (params) => ({
          url: '/integrations/api/v1/integrations/supported',
          method: 'GET',
          params,
        }),
        providesTags: ['AutoPtIntegrations'],
      }),

      // POST /integrations/install/{integrationId} - Install an integration
      installAutoPtIntegration: builder.mutation({
        query: ({ integrationId, ...data }) => ({
          url: `/integrations/api/v1/integrations/install/${integrationId}`,
          method: 'POST',
          body: data?.body || data?.data || data,
        }),
        invalidatesTags: ['AutoPtIntegrations', 'AutoPtIntegrationLogs'],
      }),

      // PUT /integrations/update/{id} - Update an installed integration
      updateAutoPtIntegration: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/integrations/api/v1/integrations/update/${id}`,
          method: 'PUT',
          body: data?.body || data?.data || data,
        }),
        invalidatesTags: ['AutoPtIntegrations', 'AutoPtIntegrationLogs'],
      }),

      // POST /integrations/refresh-all - Refresh all installed integrations
      refreshAllAutoPtIntegrations: builder.mutation({
        query: () => ({
          url: '/integrations/api/v1/integrations/refresh-all',
          method: 'POST',
        }),
        invalidatesTags: ['AutoPtIntegrations', 'AutoPtIntegrationLogs'],
      }),

      // POST /integrations/refresh/{id} - Refresh a specific integration
      refreshAutoPtIntegration: builder.mutation({
        query: (id) => ({
          url: `/integrations/api/v1/integrations/refresh/${id}`,
          method: 'POST',
        }),
        invalidatesTags: ['AutoPtIntegrations', 'AutoPtIntegrationLogs'],
      }),

      // DELETE /integrations/remove/{id} - Remove an installed integration
      removeAutoPtIntegration: builder.mutation({
        query: (id) => ({
          url: `/integrations/api/v1/integrations/remove/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AutoPtIntegrations', 'AutoPtIntegrationLogs'],
      }),

      // GET /integrations/logs - Get integration audit logs
      getAutoPtIntegrationLogs: builder.query({
        query: (params) => ({
          url: '/integrations/api/v1/integrations/logs',
          method: 'GET',
          params,
        }),
        providesTags: ['AutoPtIntegrationLogs'],
      }),

      // GET /query-or-mutate/{instanceId}/{method} - Query integration capability (e.g. repos, branches)
      getIntegrationCapability: builder.query({
        query: ({ instanceId, method = 'repos', params }) => ({
          url: `/integrations/api/v1/query-or-mutate/${instanceId}/${method}`,
          method: 'GET',
          params,
        }),
      }),
    }),
  });

export const {
  useGetInstalledAutoPtIntegrationsQuery,
  useGetSupportedAutoPtIntegrationsQuery,
  useInstallAutoPtIntegrationMutation,
  useUpdateAutoPtIntegrationMutation,
  useRefreshAllAutoPtIntegrationsMutation,
  useRefreshAutoPtIntegrationMutation,
  useRemoveAutoPtIntegrationMutation,
  useGetAutoPtIntegrationLogsQuery,
  useGetIntegrationCapabilityQuery,
  useLazyGetIntegrationCapabilityQuery,
} = autoPtIntegrationsApi;
