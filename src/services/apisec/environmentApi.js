// /
// /scan/:scanId

import { baseApi } from '@/services/baseApi';

export const environmentApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'ApisecEnvironments',
      'ApisecDashboard',
      'ApisecEnvironmentCollections',
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getApisecEnvironments: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/raw-environments`,
          params
        }),
        providesTags: ['ApisecEnvironments'],
      }),

      // Get env details by env id
      getApisecEnvironmentById: builder.query({
        query: (envId) => ({
          url: `/apisec/api/v1/raw-environments/${envId}`
        }),
        providesTags: ['ApisecEnvironments'],
      }),

      getApisecEnvironmentCollections: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/collections`,
          params
        }),
        providesTags: ['ApisecEnvironmentCollections'],
      }),

      createRawEnvironment: builder.mutation({
        query: (payload) => ({
          url: `/apisec/api/v1/raw-environments`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecEnvironments', 'ApisecDashboard'],
      }),

      createApisecEnvironment: builder.mutation({
        query: ({ payload, environmentId }) => ({
          url: `/apisec/api/v1/raw-environments/${environmentId}/variables`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecEnvironments', 'ApisecDashboard'],
      }),

      updateApisecEnvironment: builder.mutation({
        query: ({ yaml, ruleId }) => ({
          url: `/apisec/api/v1/rule/${ruleId}`,
          headers: { 'Content-Type': 'application/x-yaml' },
          method: 'PUT',
          body: yaml,
        }),
        invalidatesTags: ['ApisecEnvironments', 'ApisecDashboard'],
      }),

      updateApisecEnvironmentValue: builder.mutation({
        query: ({ data, envId, variableKey }) => ({
          url: `/apisec/api/v1/raw-environments/${envId}/variables/${variableKey}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['ApisecEnvironments', 'ApisecDashboard'],
      }),

      deleteApisecEnvironment: builder.mutation({
        query: ({ environmentId, variableKey }) => ({
          url: `/apisec/api/v1/raw-environments/${environmentId}/variables/${variableKey}}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ApisecEnvironments', 'ApisecDashboard'],
      }),

      deleteApisecEnvironmentVariable: builder.mutation({
        query: ({ environmentId, variableKey }) => ({
          url: `/apisec/api/v1/raw-environments/${environmentId}/variables/${variableKey}}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ApisecEnvironments', 'ApisecDashboard'],
      }),
    }),
  });

export const {
  useGetApisecEnvironmentsQuery,
  useGetApisecEnvironmentByIdQuery,

  useCreateRawEnvironmentMutation,
  useCreateApisecEnvironmentMutation,
  useUpdateApisecEnvironmentMutation,
  useDeleteApisecEnvironmentMutation,
  useUpdateApisecEnvironmentValueMutation,
  useDeleteApisecEnvironmentVariableMutation,

  useGetApisecEnvironmentCollectionsQuery,
} = environmentApi;
