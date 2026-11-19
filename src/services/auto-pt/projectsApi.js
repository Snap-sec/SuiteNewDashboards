import { baseApi } from '@/services/baseApi';

export const pentestsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Pentests', 'AutoPtDashboard', 'APT_Scans'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      // GET /pentests/types
      getAptProjectTypes: builder.query({
        query: () => ({
          url: `/autopentest/api/v1/projects/types`,
          method: 'GET',
        }),
        providesTags: ['Pentests'],
      }),

      // GET /pentests - List all pentests
      getAptProjects: builder.query({
        query: (params) => ({
          url: `/autopentest/api/v1/projects`,
          method: 'GET',
          params,
        }),
        providesTags: ['Pentests'],
      }),

      // POST /pentests - Create a pentest
      createAptProject: builder.mutation({
        query: (payload) => ({
          url: `/autopentest/api/v1/projects`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['Pentests', 'AutoPtDashboard'],
      }),

      // GET /pentests/{id} - Get pentest by ID
      getAptProjectById: builder.query({
        query: (id) => ({
          url: `/autopentest/api/v1/projects/${id}`,
          method: 'GET',
        }),
        providesTags: (result, error, id) => [{ type: 'Pentests', id }],
      }),

      // PATCH /pentests/{id} - Update a pentest
      updateAptProject: builder.mutation({
        query: ({ id, payload }) => ({
          url: `/autopentest/api/v1/projects/${id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          'Pentests',
          'AutoPtDashboard',
          { type: 'Pentests', id },
        ],
      }),

      // DELETE /pentests/{id} - Delete a pentest
      deleteAptProject: builder.mutation({
        query: (id) => ({
          url: `/autopentest/api/v1/projects/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Pentests', 'AutoPtDashboard'],
      }),

      // POST /pentests/{id}/execute - Trigger automated penetration test
      executeAptProject: builder.mutation({
        query: (id) => ({
          url: `/autopentest/api/v1/projects/${id}/execute`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, id) => [
          'Pentests',
          'AutoPtDashboard',
          'APT_Scans',
          { type: 'Pentests', id },
        ],
      }),

      // GET /pentests/{id}/scans - List scans for a given pentest ID
      getAptProjectScans: builder.query({
        query: ({ id, ...params }) => ({
          url: `/autopentest/api/v1/projects/${id}/scans`,
          method: 'GET',
          params,
        }),
        providesTags: (result, error, { id }) => [{ type: 'Pentests', id }],
      }),

      // GET /pentests/{id}/metrics - Get metrics for a specific pentest
      getAptProjectMetrics: builder.query({
        query: (id) => ({
          url: `/autopentest/api/v1/projects/${id}/metrics`,
          method: 'GET',
        }),
        providesTags: (result, error, id) => [{ type: 'Pentests', id }],
      }),

      // POST /scans/{scanId}/cancel - Cancel an auto pentest scan
      cancelAptProjectScan: builder.mutation({
        query: (arg) => {
          const scanId = typeof arg === 'object' ? arg.scanId : arg;
          return {
            url: `/autopentest/api/v1/scans/${scanId}/cancel`,
            method: 'POST',
          };
        },
        invalidatesTags: (result, error, arg) => {
          const pentestId = typeof arg === 'object' ? arg.pentestId : undefined;
          return [
            'Pentests',
            'AutoPtDashboard',
            'APT_Scans',
            ...(pentestId ? [{ type: 'Pentests', id: pentestId }] : []),
          ];
        },
      }),

      // DELETE /scans/{scanId} - Delete an auto pentest scan
      deleteAptProjectScan: builder.mutation({
        query: (arg) => {
          const scanId = typeof arg === 'object' ? arg.scanId : arg;
          return {
            url: `/autopentest/api/v1/scans/${scanId}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: (result, error, arg) => {
          const pentestId = typeof arg === 'object' ? arg.pentestId : undefined;
          return [
            'Pentests',
            'AutoPtDashboard',
            'APT_Scans',
            ...(pentestId ? [{ type: 'Pentests', id: pentestId }] : []),
          ];
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetAptProjectTypesQuery,
  useGetAptProjectsQuery,
  useCreateAptProjectMutation,
  useGetAptProjectByIdQuery,
  useUpdateAptProjectMutation,
  useDeleteAptProjectMutation,
  useExecuteAptProjectMutation,
  useGetAptProjectScansQuery,
  useGetAptProjectMetricsQuery,
  useCancelAptProjectScanMutation,
  useDeleteAptProjectScanMutation,
} = pentestsApi;
