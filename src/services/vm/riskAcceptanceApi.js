import { baseApi } from '@/services/baseApi';

export const riskAcceptanceApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['VmRiskAcceptanceDashboard', 'VmRiskAcceptanceList'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVmRiskAcceptanceDashboard: builder.query({
        query: () => ({
          url: '/csm/api/risk-acceptance/dashboard',
        }),
        providesTags: () => ['VmRiskAcceptanceDashboard'],
      }),

      getVmRiskAcceptanceList: builder.query({
        query: (params) => ({
          url: `/csm/api/risk-acceptance/list`,
          params
        }),
        providesTags: () => ['VmRiskAcceptanceList'],
      }),

      submitVmRiskAcceptance: builder.mutation({
        query: (data) => ({
          url: '/csm/api/risk-acceptance/submit',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['VmRiskAcceptanceList', 'VmRiskAcceptanceDashboard', 'VmVulnReport'],
      }),

      updateVmRiskAcceptanceStatus: builder.mutation({
        query: ({ id, status, reason }) => {
          const body = { status };
          if (reason) {
            body.resolutionReason = reason;
          }
          return {
            url: `/csm/api/risk-acceptance/${id}/risk-acceptance-status`,
            method: 'POST',
            body,
          };
        },
        invalidatesTags: ['VmRiskAcceptanceList', 'VmRiskAcceptanceDashboard'],
      }),

      // update bulk vulns state to Risk Acceptance
      submitVmBulkRiskAcceptance: builder.mutation({
        query: (data) => ({
          url: '/csm/api/risk-acceptance/submit-bulk',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Vulns', 'VmRiskAcceptanceList', 'VmRiskAcceptanceDashboard',],
      }),
    }),
  });

export const {
  useGetVmRiskAcceptanceDashboardQuery,
  useGetVmRiskAcceptanceListQuery,

  useSubmitVmRiskAcceptanceMutation,
  useUpdateVmRiskAcceptanceStatusMutation,
  useSubmitVmBulkRiskAcceptanceMutation,
} = riskAcceptanceApi;
