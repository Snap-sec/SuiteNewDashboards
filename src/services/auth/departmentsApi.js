import { baseApi } from '@/services/baseApi';

export const departmentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Departments'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getDepartments: builder.query({
        query: (params) => ({
          url: '/auth/api/org/departments',
          params,
        }),
        providesTags: (result) => ['Departments'],
      }),

      createDepartment: builder.mutation({
        query: (payload) => ({
          url: '/auth/api/org/departments',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['Departments'],
      }),

      updateDepartment: builder.mutation({
        query: ({ payload, departmentId }) => ({
          url: `/auth/api/org/departments/${departmentId}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['Departments'],
      }),

      deleteDepartment: builder.mutation({
        query: (departmentId) => ({
          url: `/auth/api/org/departments/${departmentId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Departments'],
      }),

      deleteDepartmentTeam: builder.mutation({
        query: ({ departmentId, teamId }) => ({
          url: `/auth/api/org/departments/${departmentId}/team/${teamId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Departments', 'Teams'],
      }),


      getDepartmentDetails: builder.query({
        query: ({ departmentId, sortBy, sortOrder, search } = {}) => ({
          url: `/auth/api/org/departments/${departmentId}`,
          params: {
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
            ...(search && { search }),
          },
        }),
        providesTags: (result) => ['Departments'],
      }),
      removeTeamFromDepartment: builder.mutation({
        query: ({ departmentId, teamId }) => ({
          url: `/auth/api/org/departments/${departmentId}/team/${teamId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Departments'],
      }),


    }),
  });

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useDeleteDepartmentTeamMutation,
  useRemoveTeamFromDepartmentMutation,
  useGetDepartmentDetailsQuery
} = departmentsApi;
