import { baseApi } from '@/services/baseApi';

export const workflowsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Workflows', 'NodeDefinitions', 'WorkflowRuns'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNodeDefinitions: builder.query({
        query: () => '/automations/api/v1/workflows/node-definitions',
        providesTags: ['NodeDefinitions'],
      }),
      getWorkflowSchema: builder.query({
        query: (resource) => `/automations/api/v1/workflows/schema/${resource}`,
      }),
      getWorkflows: builder.query({
        query: (params) => ({
          url: '/automations/api/v1/workflows',
          params,
        }),
        providesTags: ['Workflows'],
      }),
      getWorkflowById: builder.query({
        query: (workflowId) => `/automations/api/v1/workflows/${workflowId}`,
        providesTags: (result, error, id) => [{ type: 'Workflows', id }],
      }),
      createWorkflow: builder.mutation({
        query: (body) => ({
          url: '/automations/api/v1/workflows',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Workflows'],
      }),
      updateWorkflow: builder.mutation({
        query: ({ workflowId, ...body }) => ({
          url: `/automations/api/v1/workflows/${workflowId}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, { workflowId }) => [
          'Workflows',
          { type: 'Workflows', id: workflowId },
        ],
      }),
      deleteWorkflow: builder.mutation({
        query: (workflowId) => ({
          url: `/automations/api/v1/workflows/${workflowId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Workflows'],
      }),
      executeWorkflow: builder.mutation({
        query: (workflowId) => ({
          url: `/automations/api/v1/workflows/${workflowId}/execute`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, workflowId) => [
          'Workflows',
          { type: 'Workflows', id: workflowId },
          'WorkflowRuns',
        ],
      }),
    }),
  });

export const {
  useGetNodeDefinitionsQuery,
  useGetWorkflowSchemaQuery,
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useExecuteWorkflowMutation,
} = workflowsApi;
