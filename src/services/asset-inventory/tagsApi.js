import { baseApi } from '@/services/baseApi';

export const tagsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimTags'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimTags: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/tags',
          params,
        }),
        providesTags: ['AimTags'],
      }),

      createAimTag: builder.mutation({
        query: (payload) => ({
          url: '/asset-inventory/api/v1/tags',
          method: 'POST',
          body: typeof payload === 'string' ? { value: payload } : payload,
        }),
        invalidatesTags: ['AimTags'],
      }),

      updateAimTag: builder.mutation({
        query: ({ id, ...payload }) => ({
          url: `/asset-inventory/api/v1/tags/${id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['AimTags'],
      }),

      deleteAimTag: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/tags/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AimTags'],
      }),
    }),
  });

export const {
  useGetAimTagsQuery,
  useCreateAimTagMutation,
  useUpdateAimTagMutation,
  useDeleteAimTagMutation,
} = tagsApi;
