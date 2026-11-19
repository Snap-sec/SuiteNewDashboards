import { baseApi } from '@/services/baseApi';

export const falsePositiveApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VMfalsePositive'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVmPotentialFalsePositives: builder.query({
        query: (params) => ({
          url: '/csm/api/vuln-enrichment/potential_false_positives',
          params,
        }),
        providesTags: ['VMfalsePositive'],
      }),

      vmActionFalsePositive: builder.mutation({
        query: ({ vulnId, action }) => ({
          url: '/csm/api/vuln-enrichment/action',
          method: 'POST',
          body: { vulnId, action }, // action: 'accept' | 'reject'
        }),
        invalidatesTags: ['VMfalsePositive'],
      }),

      runVmFalsePositiveAnalysis: builder.mutation({
        query: (vulnIds) => ({
          url: '/csm/api/exploitability/bulk-analyze',
          method: 'POST',
          body: { vulnIds },
        }),
        invalidatesTags: ['VMfalsePositive'],
      }),
    }),
  });

export const {
  useGetVmPotentialFalsePositivesQuery,
  useVmActionFalsePositiveMutation,
  useRunVmFalsePositiveAnalysisMutation,
} = falsePositiveApi;
