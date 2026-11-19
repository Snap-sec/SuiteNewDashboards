import { baseApi } from '@/services/baseApi';


export const projectsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ApisecProjects'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getApisecProjects: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/projects`,
          params,
        }),
        providesTags: ['ApisecProjects'],
      }),

      getApisecProject: builder.query({
        query: ({ projectId, ...params }) => ({
          url: `/apisec/api/v1/projects/${projectId}`,
          params,
        }),
        providesTags: ['ApisecProjects'],
      }),

      createApisecProjects: builder.mutation({
        query: (payload) => ({
          url: `/apisec/api/v1/projects`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecProjects'],
      }),

      deleteApisecProjects: builder.mutation({
        query: (projectId) => ({
          url: `/apisec/api/v1/projects/${projectId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ApisecProjects'],
      }),

      getApisecProjectRules: builder.query({
        query: ({ projectId, search = '', page = 1, limit = 20, ...filters }) => ({
          url: `/apisec/api/v1/projects/${projectId}/rules`,
          params: {
            search,
            page,
            limit,
            ...filters
          },
        }),
        providesTags: ['ApisecProjects'],
      }),

      updateApisecProjectRules: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/apisec/api/v1/projects/${projectId}/rules`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['ApisecProjects'],
      }),

      getApisecProjectDashboard: builder.query({
        query: (projectId) => ({
          url: `/apisec/api/v1/projects/${projectId}/dashboard`,
        }),
        providesTags: ['ApisecProjects'],
      }),

      updateApisecProject: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/apisec/api/v1/projects/${projectId}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['ApisecProjects'],
      }),

      configureApisecProject: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/apisec/api/v1/projects/${projectId}/configure`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['ApisecProjects'],
      }),

      // Uploads playwright auth script to project
      uploadProjectAuthScript: builder.mutation({
        query: ({ file, projectId }) => {
          const formData = new FormData()
          formData.append('file', file)

          return {
            url: `/apisec/api/v1/projects/${projectId}/configure/upload`,
            method: 'POST',
            body: formData,
          };
        },
      }),


      updateApisecProjectScanSettings: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/apisec/api/v1/projects/${projectId}/scan-settings`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecProjects'],
      }),


      launchScan: builder.mutation({
        query: ({ projectId, payload }) => ({
          url: `/apisec/api/v1/projects/${projectId}/scan-settings/execute`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecProjects'],
      }),


      getApisecProjectScanHistory: builder.query({
        query: ({ projectId, ...params }) => ({
          url: `/apisec/api/v1/projects/${projectId}/scan-history`,
          params,
        }),
        providesTags: ['ApisecProjects'],
      }),

      stopScan: builder.mutation({
        query: ({ projectId, scanId }) => ({
          url: `/apisec/api/v1/projects/${projectId}/scan-settings/scan/${scanId}/stop`,
          method: 'POST',
        }),
        invalidatesTags: ['ApisecProjects'],
      }),

      testProjectAuthScript: builder.mutation({
        query: ({ projectId, id }) => ({
          url: `/apisec/api/v1/projects/${projectId}/auth_script/test`,
          method: 'POST',
          body: { id }
        }),
      }),

      uploadProjectAuthScript2: builder.mutation({
        query: ({ file, projectId }) => {
          const formData = new FormData()
          formData.append('file', file)

          return {
            url: `/apisec/api/v1/projects/${projectId}/configure/upload2`,
            method: 'POST',
            body: formData,
          };
        },
      }),

      getProjectAuthScript: builder.query({
        query: (projectId) => ({
          url: `/apisec/api/v1/projects/${projectId}/auth_script`,
        }),
      }),

      updateProjectAuthScript: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/apisec/api/v1/projects/${projectId}/auth_script`,
          method: 'PATCH',
          body: payload,
        }),
      }),

      getApisecProjectScanners: builder.query({
        query: ({ projectId }) => ({
          url: `/apisec/api/v1/projects/${projectId}/scanners`,
        }),
        providesTags: ['ApisecProjects'],
      }),

      updateApisecProjectScanner: builder.mutation({
        query: ({ payload, projectId }) => ({
          url: `/apisec/api/v1/projects/${projectId}/scanners`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['ApisecProjects'],
      }),

    }),
  });

export const {
  useGetApisecProjectsQuery,
  useGetApisecProjectQuery,
  useCreateApisecProjectsMutation,
  useDeleteApisecProjectsMutation,
  useGetApisecProjectRulesQuery,
  useUpdateApisecProjectRulesMutation,
  useGetApisecProjectDashboardQuery,
  useUpdateApisecProjectMutation,
  useConfigureApisecProjectMutation,

  useUploadProjectAuthScriptMutation,
  useUploadProjectAuthScript2Mutation,
  useUpdateApisecProjectScanSettingsMutation,
  useLaunchScanMutation,
  useGetApisecProjectScanHistoryQuery,
  useStopScanMutation,
  useTestProjectAuthScriptMutation,
  useGetProjectAuthScriptQuery,
  useUpdateProjectAuthScriptMutation,
  useGetApisecProjectScannersQuery,
  useUpdateApisecProjectScannerMutation
} = projectsApi;
