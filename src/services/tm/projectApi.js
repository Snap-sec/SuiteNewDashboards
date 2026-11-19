import { baseApi } from '@/services/baseApi';

export const projectApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['ProjectThreats', 'Projects', 'collabrators'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      
      getProjects: builder.query({
        query: (params) => ({
          url: '/tm/api/projects',
          params,
        }),
        providesTags: (result) => ['Projects'],
      }),

      getEndpoints: builder.query({
        query: (params) => ({
          url: '/tm/api/endpoints',
          params,
        }),
        providesTags: (result) => ['Projects'],
      }),

      getProjectById: builder.query({
        query: (projectId) => ({
          url: `/tm/api/projects/${projectId}`,
        }),
        providesTags: (result) => ['Project'],
      }),

      getProjectStats: builder.query({
        query: (projectId) => ({
          url: `/tm/api/projects/${projectId}/stats`,
        }),
        providesTags: (result) => ['ProjectStats'],
      }),

      createProject: builder.mutation({
        query: (payload) => ({
          url: '/tm/api/projects',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['Projects'],
      }),

      deleteProject: builder.mutation({
        query: (projectId) => ({
          url: `/tm/api/projects/${projectId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Projects'],
      }),

      importEndpoints: builder.mutation({
        query: ({ projectId, channelId, file }) => ({
          url: `/tm/api/projects/${projectId}/import/${channelId}`,
          method: 'POST',
          body: file,
        }),
        invalidatesTags: (result) => [
          'Projects',
          'Endpoints',
          'Threats',
          'EndpointThreats',
        ],
      }),

      importThreats: builder.mutation({
        query: ({ projectId, channelId, file }) => ({
          url: `/tm/api/projects/${projectId}/threats/import/csv`,
          method: 'POST',
          body: file,
        }),
        invalidatesTags: (result) => [
          'Projects',
          'Endpoints',
          'Threats',
          'EndpointThreats',
          'ProjectThreats',
        ],
      }),

      getProjectEndpoints: builder.query({
        query: ({ projectId, filters = {}, ...params }) => {
          const formatFilter = (values) => {
            if (!values) return undefined;
            // If it's an array or comma-separated string, handle accordingly
            if (Array.isArray(values)) {
              return values.length === 1 ? values[0] : values.join(',');
            }
            if (typeof values === 'string') {
              const arr = values.split(',');
              return arr.length === 1 ? arr[0] : values;
            }
            return values;
          };

          return {
            url: `/tm/api/projects/${projectId}/endpoints`,
            params: {
              ...params,
              ...Object.fromEntries(
                Object.entries(filters).map(([key, value]) => [
                  key,
                  formatFilter(value),
                ]),
              ),
            },
          };
        },
        providesTags: (result) => ['Endpoints'],
      }),

      getProjectThreats: builder.query({
        query: ({ projectId, ...params }) => ({
          url: `/tm/api/projects/${projectId}/threats`,
          params,
        }),
        providesTags: (result) => ['ProjectThreats'],
      }),

      getEndpointThreats: builder.query({
        query: ({ projectId, endpointId }) => ({
          url: `/tm/api/projects/${projectId}/endpoints/${endpointId}/threats`,
        }),
        providesTags: (result) => ['EndpointThreats'],
      }),

      exportProjectCSV: builder.query({
        query: (projectId) => ({
          url: `/tm/api/projects/${projectId}/export`,
        }),
        providesTags: (result) => [],
      }),

      updateProject: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/tm/api/projects/${projectId}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['Projects'],
      }),

      flushThreats: builder.mutation({
        query: (projectId) => ({
          url: `/tm/api/projects/${projectId}/threats/flush`,
          method: 'POST',
        }),
        invalidatesTags: ['Threats'],
      }),

      refreshThreats: builder.mutation({
        query: (projectId) => ({
          url: `/tm/api/projects/${projectId}/threats/refresh`,
          method: 'POST',
        }),
        invalidatesTags: ['Threats'],
      }),

      resetPrompt: builder.mutation({
        query: (projectId) => ({
          url: `/tm/api/projects/${projectId}/prompt/reset`,
          method: 'POST',
        }),
        invalidatesTags: ['Project', 'Projects', 'Threats'],
      }),

      deleteEndpoint: builder.mutation({
        query: (endpointId) => ({
          url: `/tm/api/endpoints/${endpointId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Endpoints'],
      }),

      //Get Project Collabrators

      getProjectCollabrators: builder.query({
        query: ({ projectId, search }) => ({
          url: `/tm/api/projects/${projectId}/collaborators?search=${search}`,
        }),
        providesTags: (result) => ['collabrators'],
      }),

      // Add Collabrators

      updateProjectCollabrators: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/tm/api/projects/${projectId}/collaborators`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['collabrators', 'Project'],
      }),

      removeProjectCollaborator: builder.mutation({
        query: ({ projectId, collaboratorId }) => ({
          url: `/tm/api/projects/${projectId}/collaborators/${collaboratorId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['collabrators', 'Project'],
      }),

      setDefaultProjectThreatOwner: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/tm/api/projects/${projectId}/default-threat-owner`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['Project'],
      }),

      // get collections


      getCollections: builder.query({
        query: () => ({
          url: `/tm/api/collections?available=true`,
        }),
        providesTags: (result) => ['collabrators'],
      }),







    }),
  });

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteEndpointMutation,
  useFlushThreatsMutation,
  useRefreshThreatsMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useImportEndpointsMutation,
  useImportThreatsMutation,
  useGetProjectEndpointsQuery,
  useGetEndpointsQuery,
  useGetProjectThreatsQuery,
  useGetEndpointThreatsQuery,
  useGetProjectByIdQuery,
  useGetProjectStatsQuery,
  useResetPromptMutation,
  useGetProjectCollabratorsQuery,
  useUpdateProjectCollabratorsMutation,
  useRemoveProjectCollaboratorMutation,
  useSetDefaultProjectThreatOwnerMutation,
  useGetCollectionsQuery,
} = projectApi;
