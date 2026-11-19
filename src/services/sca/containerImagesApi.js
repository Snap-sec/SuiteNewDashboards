import { baseApi } from '@/services/baseApi';

export const scaContainerImagesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaContainerImages'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaContainerImages: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/container-images',
          params,
        }),
        providesTags: ['ScaContainerImages'],
      }),

      syncScaGitHubContainerRegistries: builder.mutation({
        query: (data) => ({
          url: '/sca/api/v1/container-images/sync',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['ScaContainerImages'],
      }),

      importScaContainerImage: builder.mutation({
        query: (data) => ({
          url: '/sca/api/v1/container-images',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['ScaContainerImages'],
      }),

      scanScaContainerImage: builder.mutation({
        query: (id = 'all') => ({
          url: `/sca/api/v1/container-images/${id}/scan`,
          method: 'POST',
        }),
        invalidatesTags: ['ScaContainerImages'],
      }),

      deleteScaContainerImage: builder.mutation({
        query: (id) => ({
          url: `/sca/api/v1/container-images/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ScaContainerImages'],
      }),
    }),
  });

export const {
  useGetScaContainerImagesQuery,
  useSyncScaGitHubContainerRegistriesMutation,
  useImportScaContainerImageMutation,
  useScanScaContainerImageMutation,
  useDeleteScaContainerImageMutation,
} = scaContainerImagesApi;
