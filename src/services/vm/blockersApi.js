import { baseApi } from '@/services/baseApi';

export const blockerApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VmBlockers'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllVmBlockers: builder.query({
        query: (params) => ({
          url: '/csm/api/blockers/all',
          params,
        }),
        providesTags: (result) => ['VmBlockers'],
      }),

      updateVmBlockerStatus: builder.mutation({
        query: ({ id, ...updates }) => ({
          url: `/csm/api/blockers/${id}`,
          method: 'PATCH',
          body: updates,
        }),
        invalidatesTags: [
          'VmBlockers',
          'MyBlockers',
          'Blocker',
          'VmVulnDetail',
          'Vulns',
          'VmVulnReport'
        ],
      }),
    }),
  });

export const { useGetAllVmBlockersQuery, useUpdateVmBlockerStatusMutation } =
  blockerApi;
