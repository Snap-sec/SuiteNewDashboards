import { baseApi } from '@/services/baseApi';

export const archivedVulnsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['ArchivedVulns'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // Get archived vulns
      getVmArchivedVulns: builder.query({
        query: (params) => ({
          url: '/csm/api/archive/',
          params,
        }),

        providesTags: (result) => ['ArchivedVulns'],
      }),

      // Archive vuln
      archiveVmVuln: builder.mutation({
        query: (vulnId) => ({
          url: `/csm/api/archive/vuln/${vulnId}`,
          method: 'POST',
        }),

        invalidatesTags: ['ArchivedVulns'],
      }),

      // Archive VM vulns in bulk
      bulkArchiveVmVulns: builder.mutation({
        query: (vulnIds) => ({
          url: `/csm/api/archive/bulk/vuln/`,
          method: 'POST',
          body: { resource_ids: vulnIds },
        }),

        invalidatesTags: ['ArchivedVulns', 'Vulns'],
      }),

      // Archive vuln group
      archiveVmVulnGroup: builder.mutation({
        query: ({ resource, resource_id }) => ({
          url: `/csm/api/archive/${resource}/${resource_id}`,
          method: 'POST',
          body,
        }),

        invalidatesTags: ['ArchivedVulns'],
      }),

      //   Unarchive a vm archived vuln
      unarchiveVmVuln: builder.mutation({
        query: (archiveId) => ({
          url: `/csm/api/archive/restore/${archiveId}`,
          method: 'POST',
        }),

        // Invalidate only when success
        invalidatesTags: (result, error) => (error ? [] : ['ArchivedVulns']),
      }),

      // Get archived vuln details
      getArchiveDetails: builder.query({
        query: (archiveId) => ({
          url: `/csm/api/archive/details/${archiveId}`,
        }),
      }),
    }),
  });

export const {
  useGetVmArchivedVulnsQuery,
  useArchiveVmVulnMutation,
  useArchiveVmVulnGroupMutation,
  useUnarchiveVmVulnMutation,
  useGetArchiveDetailsQuery,
  useBulkArchiveVmVulnsMutation,
} = archivedVulnsApi;
