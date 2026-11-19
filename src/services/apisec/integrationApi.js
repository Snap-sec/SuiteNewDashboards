import { baseApi } from '@/services/baseApi';

export const integrationApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'apiSecIntegration', 'apiSec', 'ApisecDashboard', 'ApisecEnvironments', 'ApisecRules', 'apiSecVulns'
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      addConnectApiSecIntegration: builder.mutation({
        query: ({ type, payload }) => ({
          url: `/apisec/api/v1/integrations/${type}`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: [
          'apiSecIntegration', 'apiSec', 'ApisecDashboard', 'ApisecEnvironments', 'ApisecRules', 'apiSecVulns'
        ],
      }),

      getApiSecIntegration: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/integrations`,
          params,
        }),
        providesTags: ['apiSecIntegration'],
      }),

      updateApisecIntegration: builder.mutation({
        query: ({ integrationId, payload }) => ({
          url: `/apisec/api/v1/integrations/${integrationId}`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: [
          'apiSecIntegration', 'apiSec', 'ApisecDashboard', 'ApisecEnvironments', 'ApisecRules', 'apiSecVulns'
        ],
      }),

      deleteApisecIntegration: builder.mutation({
        query: ({ integrationId }) => ({
          url: `/apisec/api/v1/integrations/${integrationId}`,
          method: 'DELETE',
        }),
        invalidatesTags: [
          'apiSecIntegration', 'apiSec', 'ApisecDashboard', 'ApisecEnvironments', 'ApisecRules', 'apiSecVulns'
        ],
      }),

      refreshApisecIntegration: builder.mutation({
        query: ({ integrationId }) => ({
          url: `/apisec/api/v1/integrations/${integrationId}/refresh`,
          method: 'POST',
        }),
        invalidatesTags: [
          'apiSecIntegration', 'apiSec', 'ApisecDashboard', 'ApisecEnvironments', 'ApisecRules', 'apiSecVulns'
        ],
      }),
    }),
  });

export const {
  useAddConnectApiSecIntegrationMutation,
  useGetApiSecIntegrationQuery,
  useDeleteApisecIntegrationMutation,
  useRefreshApisecIntegrationMutation,
  useUpdateApisecIntegrationMutation,
} = integrationApi;
