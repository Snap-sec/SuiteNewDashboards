import { baseApi } from '@/services/baseApi';

export const slaApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['slaApi'] })
  .injectEndpoints({
    endpoints: (builder) => ({

      getVmSLA: builder.query({
        query: (params) => ({
          url: '/csm/api/sla/settings',
          params,
        }),
        providesTags: (result) => ['VmReports'],
      }),

      createVmSLA: builder.mutation({
        query: (data) => ({
          url: `csm/api/sla/settings`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['slaApi'],
      }),


      getVmSLADashboard: builder.query({
        query: (params) => ({
          url: '/csm/api/sla/dashboard',
          params,
        }),
        providesTags: (result) => ['VmReports'],
      }),


      getVmSLAVoilationsBy: builder.query({
        query: (params) => ({
          url: '/csm/api/sla/violations',
          params,
        }),
        providesTags: (result) => ['VmReports'],
      }),


      getVmSLALoaderboard: builder.query({
        query: (params) => ({
          url: '/csm/api/sla/leaderboard',
          params,
        }),
        providesTags: (result) => ['VmReports'],
      }),


      refreshVmSLA: builder.mutation({
        query: (params) => ({
          url: '/csm/api/sla/refresh',
          method: 'POST',
        }),
        providesTags: (result) => ['VmReports'],
      }),

      getVmSLAReport: builder.mutation({
        query: (params) => ({
          url: '/csm/api/sla/report',
          params,
          // CRITICAL: Tells fetchBaseQuery to expect binary data
          responseHandler: (response) => response.blob(),
          headers: {
            // Explicitly request the Excel MIME type
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        }),
        // Optional: If you have a global transformResponse, 
        // ensure it doesn't try to parse this blob as an object.
      }),

      //   deleteVmReport: builder.mutation({
      //     query: (reportId) => ({
      //       url: `/csm/api/assessments/report/delete-report/${reportId}`,
      //       method: 'DELETE',
      //     }),
      //     invalidatesTags: ['VmReports'],
      //   }),

      exportVmSLAViolations: builder.mutation({
        query: (params) => ({
          url: '/csm/api/sla/violations/export',
          method: 'GET',
          params,
          responseHandler: (response) => response.blob(), // <-- IMPORTANT
        }),
        invalidatesTags: ['VmReports'],
      }),


      getVmSLAReportConfig: builder.query({
        query: (params) => ({
          url: '/csm/api/sla/report-schedule',
          method: 'GET',
          params,
        }),
        providesTags: (result) => ['SLAReportConfig'],
      }),

      createVmSLAReportConfig: builder.mutation({
        query: (data) => ({
          url: `csm/api/sla/report-schedule`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['SLAReportConfig'],
      }),


      sendVmSLAReportConfig: builder.mutation({
        query: (params) => ({
          url: '/csm/api/sla/send-now',
          method: 'POST',
        }),
        providesTags: (result) => ['SLAReportConfig'],
      }),

    }),
  });

export const {
  useGetVmSLAQuery,
  useCreateVmSLAMutation,
  useGetVmSLADashboardQuery,
  useGetVmSLAVoilationsByQuery,
  useGetVmSLALoaderboardQuery,
  useRefreshVmSLAMutation,
  useGetVmSLAReportMutation,
  useExportVmSLAViolationsMutation,
  useGetVmSLAReportConfigQuery,
  useCreateVmSLAReportConfigMutation,
  useSendVmSLAReportConfigMutation,

} = slaApi;
