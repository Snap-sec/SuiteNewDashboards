import { baseApi } from '@/services/baseApi';

export const playgroundApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['PlaygroundSession', 'PlaygroundLogs', 'PlaygroundRuns'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      // GET /automations/api/v1/playground - Get current user playground session
      getPlaygroundSession: builder.query({
        query: () => '/automations/api/v1/playground',
        providesTags: ['PlaygroundSession'],
      }),

      // PUT /automations/api/v1/playground - Save playground configuration
      savePlaygroundConfig: builder.mutation({
        query: (body) => ({
          url: '/automations/api/v1/playground',
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['PlaygroundSession'],
      }),

      // POST /automations/api/v1/playground/context/upload - Upload context artifact file
      uploadPlaygroundContextFile: builder.mutation({
        query: (arg) => {
          let body;
          if (arg instanceof FormData) {
            body = arg;
          } else {
            const formData = new FormData();
            const file = arg?.file || arg;
            formData.append('file', file);
            body = formData;
          }

          return {
            url: '/automations/api/v1/playground/context/upload',
            method: 'POST',
            body,
          };
        },
        invalidatesTags: ['PlaygroundSession'],
      }),

      // DELETE /automations/api/v1/playground/context - Clear context data
      clearPlaygroundContext: builder.mutation({
        query: () => ({
          url: '/automations/api/v1/playground/context',
          method: 'DELETE',
        }),
        invalidatesTags: ['PlaygroundSession'],
      }),

      // POST /automations/api/v1/playground/execute - Execute playground agent
      executePlaygroundAgent: builder.mutation({
        query: (body) => ({
          url: '/automations/api/v1/playground/execute',
          method: 'POST',
          body: body || {},
        }),
        invalidatesTags: ['PlaygroundSession', 'PlaygroundLogs', 'PlaygroundRuns'],
      }),

      // GET /automations/api/v1/playground/runs - List historical playground runs
      getPlaygroundRuns: builder.query({
        query: (params) => ({
          url: '/automations/api/v1/playground/runs',
          params: params || undefined,
        }),
        providesTags: ['PlaygroundRuns'],
      }),

      // GET /automations/api/v1/playground/runs/:runId - Single playground run details (full logs + artifacts)
      getPlaygroundRunDetails: builder.query({
        query: (runId) => `/automations/api/v1/playground/runs/${runId}`,
        providesTags: (result, error, runId) => [{ type: 'PlaygroundRuns', id: runId }],
      }),

      // GET /automations/api/v1/playground/runs/:runId/artifacts/:fileName - Download run artifact
      downloadPlaygroundRunArtifact: builder.mutation({
        query: ({ runId, fileName }) => ({
          url: `/automations/api/v1/playground/runs/${runId}/artifacts/${encodeURIComponent(fileName)}`,
          responseHandler: (response) => response.blob(),
        }),
      }),

      // GET /automations/api/v1/playground/logs - Poll live run logs
      getPlaygroundLogs: builder.query({
        query: (params) => {
          let queryParams = {};
          if (typeof params === 'string') {
            queryParams = { runId: params };
          } else if (params && typeof params === 'object') {
            queryParams = { ...params };
          }
          return {
            url: '/automations/api/v1/playground/logs',
            params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
          };
        },
        providesTags: ['PlaygroundLogs'],
      }),

      // GET /automations/api/v1/playground/artifacts/download/{fileName} - Download output artifact
      downloadPlaygroundArtifact: builder.mutation({
        query: (fileName) => ({
          url: `/automations/api/v1/playground/artifacts/download/${encodeURIComponent(fileName)}`,
          responseHandler: (response) => response.blob(),
        }),
      }),

      // POST /automations/api/v1/playground/runs/:runId/pause - Pause run
      pausePlaygroundRun: builder.mutation({
        query: (runId) => ({
          url: `/automations/api/v1/playground/runs/${runId}/pause`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, runId) => [
          'PlaygroundSession',
          'PlaygroundRuns',
          { type: 'PlaygroundRuns', id: runId },
        ],
      }),

      // POST /automations/api/v1/playground/runs/:runId/resume - Resume run
      resumePlaygroundRun: builder.mutation({
        query: (runId) => ({
          url: `/automations/api/v1/playground/runs/${runId}/resume`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, runId) => [
          'PlaygroundSession',
          'PlaygroundRuns',
          { type: 'PlaygroundRuns', id: runId },
        ],
      }),

      // POST /automations/api/v1/playground/runs/:runId/cancel - Cancel run
      cancelPlaygroundRun: builder.mutation({
        query: (runId) => ({
          url: `/automations/api/v1/playground/runs/${runId}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, runId) => [
          'PlaygroundSession',
          'PlaygroundRuns',
          { type: 'PlaygroundRuns', id: runId },
        ],
      }),
    }),
  });

export const {
  useGetPlaygroundSessionQuery,
  useSavePlaygroundConfigMutation,
  useUploadPlaygroundContextFileMutation,
  useClearPlaygroundContextMutation,
  useExecutePlaygroundAgentMutation,
  useGetPlaygroundRunsQuery,
  useGetPlaygroundRunDetailsQuery,
  useDownloadPlaygroundRunArtifactMutation,
  useGetPlaygroundLogsQuery,
  useDownloadPlaygroundArtifactMutation,
  usePausePlaygroundRunMutation,
  useResumePlaygroundRunMutation,
  useCancelPlaygroundRunMutation,
} = playgroundApi;
