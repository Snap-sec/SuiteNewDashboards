import { baseApi } from '@/services/baseApi';

export const sastVulnerabilitiesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SastVulnerabilities', 'SastProjects'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSastVulnerabilities: builder.query({
        query: (params) => ({
          url: '/sast/api/v1/vulnerabilities',
          params,
        }),
        providesTags: ['SastVulnerabilities'],
      }),

      getSastVulnerabilityById: builder.query({
        query: (id) => `/sast/api/v1/vulnerabilities/${id}`,
        providesTags: ['SastVulnerabilities'],
      }),

      sendSastVulnToVm: builder.mutation({
        query: (payload) => {
          const vulnId = typeof payload === 'string' ? payload : payload?.vulnerabilityId || payload?.id;
          return {
            url: `/sast/api/v1/vulnerabilities/${vulnId}/send-to-vm`,
            method: 'POST',
            body: typeof payload === 'object' ? payload : {},
          };
        },
        invalidatesTags: ['SastVulnerabilities'],
      }),

      runVulnerabilityScan: builder.mutation({
        query: (id = 'all') => ({
          url: `/sast/api/v1/scans`,
          method: 'POST',
          body: { targetType: id === 'all' ? 'all' : 'repo', targetIds: id === 'all' ? [] : [id] },
        }),
        invalidatesTags: ['SastVulnerabilities', 'SastProjects'],
      }),
    }),
  });

export const scaVulnerabilitiesApi = sastVulnerabilitiesApi;

export const {
  useGetSastVulnerabilitiesQuery,
  useGetSastVulnerabilityByIdQuery,
  useSendSastVulnToVmMutation,
  useRunVulnerabilityScanMutation,
} = sastVulnerabilitiesApi;

export const useGetScaVulnerabilitiesQuery = useGetSastVulnerabilitiesQuery;
export const useSendScaVulnToVmMutation = useSendSastVulnToVmMutation;
export const useSyncScaVulnToVmMutation = useSendSastVulnToVmMutation;
export const useRunTrivyScanMutation = useRunVulnerabilityScanMutation;


