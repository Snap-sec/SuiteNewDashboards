import { baseApi } from '@/services/baseApi';

export const aimDepartmentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimDepartments'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimDepartments: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/ownership/departments',
          params,
        }),

        providesTags: (result) => ['AimDepartments'],
      }),
    }),
  });

export const { useGetAimDepartmentsQuery } = aimDepartmentsApi;
