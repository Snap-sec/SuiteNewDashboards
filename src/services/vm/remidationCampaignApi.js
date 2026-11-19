import { baseApi } from '@/services/baseApi';

export const remidationCampaignApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['VMremidationCampaign', 'VMremidationCampaignDashboard'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVmRemidationCampaign: builder.query({
        query: (params) => ({
          url: `/csm/api/remediation-campaigns`,
          params,
        }),
        providesTags: (result) => ['VMremidationCampaign'],
      }),

      getVmRemidationCampaignById: builder.query({
        query: (id) => ({
          url: `/csm/api/remediation-campaigns/${id}`,
        }),
        providesTags: ['VMremidationCampaign'],
      }),

      // Recompute all remidation campaigns
      recomputeVmRemidationCampaigns: builder.mutation({
        query: (payload) => ({
          url: '/csm/api/remediation-campaigns/recompute',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['VMremidationCampaign'],
      }),

      // POST/remediation-campaigns/:id/recompute
      recomputeVmRemidationCampaignById: builder.mutation({
        query: (id) => ({
          url: `/csm/api/remediation-campaigns/${id}/recompute`,
          method: 'POST',
        }),
        invalidatesTags: ['VMremidationCampaign'],
      }),

      // DELETE /remediation-campaigns/:id
      deleteVmRemidationCampaign: builder.mutation({
        query: (id) => ({
          url: `/csm/api/remediation-campaigns/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['VMremidationCampaign'],
      }),

      // GET /remediation-campaigns/:id/vulns
      getVmRemidationCampaignVulnsById: builder.query({
        query: ({ id, params }) => ({
          url: `/csm/api/remediation-campaigns/${id}/vulns`,
          params,
        }),
        providesTags: ['VMremidationCampaign'],
      }),

      // GET /remediation-campaigns/:id/assets
      getVmRemidationCampaignAssetsById: builder.query({
        query: (remediationCampaignId) => ({
          url: `/csm/api/remediation-campaigns/${remediationCampaignId}/assets`,
        }),
        providesTags: ['VMremidationCampaign'],
      }),

      // POST /remediation-campaigns/:id/export
      exportVmRemidationCampaignActionPlan: builder.mutation({
        query: (id) => ({
          url: `/csm/api/remediation-campaigns/${id}/export?type=action-plan`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
          responseType: 'blob',
        }),
      }),

      // GET /remediation-campaigns/:id/dashboard
      getVmRemidationCampaignDashboard: builder.query({
        query: (remediationCampaignId) => ({
          url: `/csm/api/remediation-campaigns/${remediationCampaignId}/dashboard`,
        }),
        providesTags: ['VMremidationCampaignDashboard'],
      }),

      // POST/remediation-campaigns/:id/jira
      sendVmRemediationCampaignToJira: builder.mutation({
        query: (id) => ({
          url: `/csm/api/remediation-campaigns/${id}/jira`,
          method: 'POST',
        }),
        invalidatesTags: ['VMremidationCampaign'],
      }),

      // PATCH /remediation-campaigns/:id
      changeVmRemediationCampaignOwner: builder.mutation({
        query: ({ id, payload }) => ({
          url: `/csm/api/remediation-campaigns/${id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['VMremidationCampaign'],
      }),

      // POST /remediation-campaigns/:id/risk-acceptance
      riskAcceptVmRemediationCampaign: builder.mutation({
        query: ({ id, payload }) => ({
          url: `/csm/api/remediation-campaigns/${id}/risk-acceptance`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['VMremidationCampaign'],
      }),
    }),
  });

export const {
  useGetVmRemidationCampaignQuery,
  useGetVmRemidationCampaignByIdQuery,
  useGetVmRemidationCampaignVulnsByIdQuery,
  useGetVmRemidationCampaignAssetsByIdQuery,
  useGetVmRemidationCampaignDashboardQuery,

  useRecomputeVmRemidationCampaignsMutation,
  useRecomputeVmRemidationCampaignByIdMutation,
  useDeleteVmRemidationCampaignMutation,
  useExportVmRemidationCampaignActionPlanMutation,
  useSendVmRemediationCampaignToJiraMutation,
  useChangeVmRemediationCampaignOwnerMutation,
  useRiskAcceptVmRemediationCampaignMutation,
} = remidationCampaignApi;
