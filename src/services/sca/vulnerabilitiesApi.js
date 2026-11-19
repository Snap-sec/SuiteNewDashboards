import { baseApi } from '@/services/baseApi';

export const scaVulnerabilitiesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaVulnerabilities', 'ScaProjects'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaVulnerabilities: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/vulnerabilities',
          params,
        }),
        providesTags: ['ScaVulnerabilities'],
      }),

      runScaVulnerabilityScan: builder.mutation({
        query: (id = 'all') => ({
          url: `/sca/api/v1/vulnerabilities/scan/${id}`,
          method: 'POST',
        }),
        invalidatesTags: ['ScaVulnerabilities', 'ScaProjects'],
      }),

      syncScaVulnToVm: builder.mutation({
        query: (payload) => ({
          url: '/sca/api/v1/vulnerabilities/sync',
          method: 'POST',
          body: typeof payload === 'string' ? { vulnerabilityId: payload } : payload,
        }),
        invalidatesTags: ['ScaVulnerabilities'],
      }),

      sendScaVulnToVm: builder.mutation({
        query: (payload) => ({
          url: '/sca/api/v1/vulnerabilities/sync',
          method: 'POST',
          body: typeof payload === 'string' ? { vulnerabilityId: payload } : payload,
        }),
        invalidatesTags: ['ScaVulnerabilities'],
      }),
    }),
  });

export const {
  useGetScaVulnerabilitiesQuery,
  useRunScaVulnerabilityScanMutation,
  useRunScaVulnerabilityScanMutation: useRunTrivyScanMutation,
  useSendScaVulnToVmMutation,
  useSyncScaVulnToVmMutation,
} = scaVulnerabilitiesApi;

