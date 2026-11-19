import { baseApi } from '@/services/baseApi';

export const assessmentsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'VmAssessments',
      'VmAssessment',
      'VmChangeManagementDashboard',
      'VmChangeManagementPentestRequests',
      'VmSpecificAssessmentReports',
      'VmAssessmentStats'
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVmAssessments: builder.query({
        query: (params) => ({
          url: '/csm/api/assessments',
          params,
        }),
        providesTags: (result) => ['VmAssessments'],
      }),

      getVmAssessmentDetails: builder.query({
        query: (assessmentId) => ({
          url: `/csm/api/assessments/${assessmentId}`,
          method: 'GET',
        }),
        providesTags: (result) => ['VmAssessment'],
      }),

      getVmAssessmentToCSV: builder.query({
        query: (id) => `/csm/api/assessments/${id}/csv-export`,
        method: 'GET',
      }),

      createVmAssessment: builder.mutation({
        query: (assessment) => ({
          url: '/csm/api/assessments',
          method: 'POST',
          body: assessment,
        }),
        invalidatesTags: ['VmAssessments'],
      }),

      updateVmAssessment: builder.mutation({
        query: ({ assessmentId, ...updates }) => ({
          url: `/csm/api/assessments/${assessmentId}`,
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags: ['VmAssessments', 'VmAssessment', 'VmAssessmentStats'],
      }),
      updateVmScope: builder.mutation({
        query: ({ assessmentId, ...updates }) => ({
          url: `/csm/api/assessments/scope/${assessmentId}`,
          method: 'POST',
          body: updates,
        }),
        invalidatesTags: ['VmAssessments', 'VmAssessment'],
      }),
      deleteVmAssessment: builder.mutation({
        query: (id) => ({
          url: `/csm/api/assessments/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [
          'VmAssessments',
          'VmChangeManagementDashboard',
          'VmChangeManagementPentestRequests',
        ],
      }),

      getVmPublicDetails: builder.query({
        query: ({ assessmentId, ...params }) => ({
          url: `/csm/api/assessments/${assessmentId}/getPublicDetails`,
          method: 'GET',
          params,
        }),
      }),

      getVmAssessmentStats: builder.query({
        query: (assessmentId) => ({
          url: `/csm/api/assessments/${assessmentId}/stats`,
        }),
        providesTags: ['VmAssessmentStats'],
      }),

      getVmCollaboratorAssessments: builder.query({
        query: (userId) => ({
          url: `/csm/api/assessments/collaborator/${userId}/assessments`,
        }),
        providesTags: (result) => ['CollaboratorAssessments'],
      }),

      addVmAssessmentCollaborator: builder.mutation({
        query: ({ assessmentId, ...collaborator }) => ({
          url: `/csm/api/assessments/${assessmentId}/collaborators/add`,
          method: 'POST',
          body: collaborator,
        }),
        invalidatesTags: ['VmAssessment'],
      }),

      addVmAssessmentsCollaboratorBulk: builder.mutation({
        query: (payload) => ({
          url: '/csm/api/assessments/collaborators/add',
          method: 'POST',
          body: payload,
        }),
      }),

      removeVmAssessmentCollaborator: builder.mutation({
        query: ({ assessmentId, ...collaborator }) => ({
          url: `/csm/api/assessments/${assessmentId}/collaborators/remove`,
          method: 'POST',
          body: collaborator,
        }),
        invalidatesTags: ['VmAssessment'],
      }),

      setVmDefaultAsignee: builder.mutation({
        query: ({ assessmentId, userId, name, email, override }) => ({
          url: `/csm/api/assessments/${assessmentId}/default-ticket-owner`,
          method: 'PATCH',
          body: { userId, name, email, override },
        }),
        invalidatesTags: ['VmAssessment'],
      }),

      createVmCustomReportConfig: builder.mutation({
        query: ({ assessmentId, payload }) => ({
          url: `/csm/api/assessments/${assessmentId}`,
          method: 'PUT',
          body: { customReport: payload },
        }),
      }),
      getVmAssessmentTimeline: builder.query({
        query: ({ assessmentId, ...params }) => ({
          url: `/csm/api/assessments/${assessmentId}/timeline`,
          method: 'GET',
          params,
        }),
      }),

      getVmAssessmentActivity: builder.query({
        query: ({ assessmentId, params }) => ({
          url: `/csm/api/assessments/${assessmentId}/activity`,
          method: 'GET',
          params
        }),
        providesTags: ['VmAssessmentActivity']
      }),

      addVmAssessmentActivity: builder.mutation({
        query: ({ assessmentId, text, attachments, mentions }) => ({
          url: `/csm/api/assessments/${assessmentId}/activity`,
          method: "POST",
          body: { text, attachments, mentions }
        }),
        invalidatesTags: ["VmAssessmentActivity"]
      }),

      deleteVmAssessmentActivity: builder.mutation({
        query: ({ assessmentId, activityId, entityType, entityId }) => ({
          url: `/csm/api/assessments/${assessmentId}/activity/${activityId}`,
          method: "DELETE",
          params: { entityType, entityId }
        }),
        invalidatesTags: ["VmAssessmentActivity"]
      }),

      // Get assessment reports by assessment id
      getVmAssessmentReports: builder.query({
        query: (assessmentId) => ({
          url: `/csm/api/reports/assessment/${assessmentId}`,
          method: 'GET',
        }),
        providesTags: ["VmSpecificAssessmentReports"]
      }),

      removeYourselfFromVmAssessment: builder.mutation({
        query: ({ assessmentId }) => ({
          url: `/csm/api/assessments/${assessmentId}/leave`,
          method: 'POST',
        }),
        invalidatesTags: ['VmAssessment'],
      }),
    }),
  });

export const {
  useCreateVmCustomReportConfigMutation,
  useGetVmCollaboratorAssessmentsQuery,
  useAddVmAssessmentsCollaboratorBulkMutation,
  useAddVmAssessmentCollaboratorMutation,
  useRemoveVmAssessmentCollaboratorMutation,
  useGetVmAssessmentStatsQuery,
  useGetVmAssessmentDetailsQuery,
  useDeleteVmAssessmentMutation,
  useGetVmAssessmentsQuery,
  useLazyGetVmAssessmentToCSVQuery,
  useCreateVmAssessmentMutation,
  useUpdateVmAssessmentMutation,
  useGetVmPublicDetailsQuery,
  useSetVmDefaultAsigneeMutation,
  useUpdateVmScopeMutation,
  useGetVmAssessmentTimelineQuery,
  useGetVmAssessmentActivityQuery,
  useAddVmAssessmentActivityMutation,
  useDeleteVmAssessmentActivityMutation,
  useGetVmAssessmentReportsQuery,
  useRemoveYourselfFromVmAssessmentMutation
} = assessmentsApi;
