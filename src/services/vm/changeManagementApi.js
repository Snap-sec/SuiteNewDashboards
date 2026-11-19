import { baseApi } from '@/services/baseApi';

export const changeManagementApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'VmChangeManagementDashboard',
      'VmChangeManagementPentestRequests',
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVmChangeManagementDashboard: builder.query({
        query: () => ({
          url: '/csm/api/assessments/change-requests/dashboard',
        }),
        transformResponse: (response) => response.data,
        providesTags: () => ['VmChangeManagementDashboard'],
      }),

      getVmChangeManagementPentestRequests: builder.query({
        query: ({ ...params }) => ({
          url: `/csm/api/assessments/change-requests`,
          params
        }),
        transformResponse: (response) => response.data,
        providesTags: () => ['VmChangeManagementPentestRequests'],
      }),

      createNewVmChangeRequest: builder.mutation({
        query: (data) => ({
          url: '/csm/api/assessments/change-request',
          method: 'POST',
          body: data,
        }),
        transformResponse: (response) => response.data,
        invalidatesTags: [
          'VmChangeManagementPentestRequests',
          'VmChangeManagementDashboard',
        ],
      }),
    }),
  });

export const {
  useGetVmChangeManagementDashboardQuery,
  useGetVmChangeManagementPentestRequestsQuery,
  useCreateNewVmChangeRequestMutation,
} = changeManagementApi;
