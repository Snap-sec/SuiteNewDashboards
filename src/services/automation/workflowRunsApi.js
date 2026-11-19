import { baseApi } from '@/services/baseApi';

export const workflowRunsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['WorkflowRuns'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getWorkflowRuns: builder.query({
        query: (params) => ({
          url: '/automations/api/v1/workflow-runs',
          params,
        }),
        providesTags: ['WorkflowRuns'],
      }),
      getWorkflowRunById: builder.query({
        query: (runId) => `/automations/api/v1/workflow-runs/${runId}`,
        providesTags: (result, error, id) => [{ type: 'WorkflowRuns', id }],
      }),
      cancelWorkflowRun: builder.mutation({
        query: (runId) => ({
          url: `/automations/api/v1/workflow-runs/${runId}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: ['WorkflowRuns'],
      }),
      retryFailedWorkflowRun: builder.mutation({
        query: (runId) => ({
          url: `/automations/api/v1/workflow-runs/${runId}/retry-failed`,
          method: 'POST',
        }),
        invalidatesTags: ['WorkflowRuns'],
      }),
    }),
  });

export const {
  useGetWorkflowRunsQuery,
  useGetWorkflowRunByIdQuery,
  useCancelWorkflowRunMutation,
  useRetryFailedWorkflowRunMutation,
} = workflowRunsApi;
