import { baseApi } from '@/services/baseApi';

export const sastProjectsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SastProjects'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSastProjects: builder.query({
        query: (params) => ({
          url: '/sast/api/v1/projects',
          params,
        }),
        providesTags: ['SastProjects'],
      }),

      getSastProjectById: builder.query({
        query: (args) => {
          if (typeof args === 'object' && args !== null) {
            const { id, ...params } = args;
            return {
              url: `/sast/api/v1/projects/${id}`,
              params,
            };
          }
          return `/sast/api/v1/projects/${args}`;
        },
        providesTags: ['SastProjects'],
      }),

      deleteSastProject: builder.mutation({
        query: (id) => ({
          url: `/sast/api/v1/projects/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['SastProjects'],
      }),
    }),
  });

export const scaProjectsApi = sastProjectsApi;

export const {
  useGetSastProjectsQuery,
  useGetSastProjectByIdQuery,
  useDeleteSastProjectMutation,
} = sastProjectsApi;

export const useGetScaProjectsQuery = useGetSastProjectsQuery;
export const useGetScaProjectByIdQuery = useGetSastProjectByIdQuery;
export const useDeleteScaProjectMutation = useDeleteSastProjectMutation;

