import { baseApi } from '@/services/baseApi';

export const scaProjectsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaProjects'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaProjects: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/projects',
          params,
        }),
        providesTags: ['ScaProjects'],
      }),

      getScaProjectById: builder.query({
        query: (args) => {
          if (typeof args === 'object' && args !== null) {
            const { id, ...params } = args;
            return {
              url: `/sca/api/v1/projects/${id}`,
              params,
            };
          }
          return `/sca/api/v1/projects/${args}`;
        },
        providesTags: ['ScaProjects'],
      }),

      importGitHubRepos: builder.mutation({
        query: (data) => ({
          url: '/sca/api/v1/projects/import-github',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['ScaProjects'],
      }),

      scanScaProject: builder.mutation({
        query: (id) => ({
          url: `/sca/api/v1/projects/${id}/scan`,
          method: 'POST',
        }),
        invalidatesTags: ['ScaProjects'],
      }),

      deleteScaProject: builder.mutation({
        query: (id) => ({
          url: `/sca/api/v1/projects/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ScaProjects'],
      }),

      getScaWebhooks: builder.query({
        query: () => '/sca/api/v1/webhooks',
        providesTags: ['ScaProjects'],
      }),

      rotateScaWebhook: builder.mutation({
        query: () => ({
          url: '/sca/api/v1/webhooks/rotate',
          method: 'POST',
        }),
        invalidatesTags: ['ScaProjects'],
      }),

      triggerScaWebhookTest: builder.mutation({
        query: ({ token, projectId }) => ({
          url: `/sca/webhooks/${token}/${encodeURIComponent(projectId)}`,
          method: 'POST',
        }),
        invalidatesTags: ['ScaProjects'],
      }),
    }),
  });

export const {
  useGetScaProjectsQuery,
  useGetScaProjectByIdQuery,
  useImportScaGitHubReposMutation,
  useScanScaProjectMutation,
  useDeleteScaProjectMutation,
  useGetScaWebhooksQuery,
  useRotateScaWebhookMutation,
  useTriggerScaWebhookTestMutation,
} = scaProjectsApi;
