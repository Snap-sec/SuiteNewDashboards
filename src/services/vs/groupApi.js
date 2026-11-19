import { baseApi } from '@/services/baseApi';

export const vsGroupApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VsGroups'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVsGroups: builder.query({
        query: (params) => ({
          url: '/vs/api/groups',
          params
        }),
        providesTags: ['VsGroups'],
      }),

      createVsGroup: builder.mutation({
        query: (data) => ({
          url: '/vs/api/groups',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['VsGroups'],
      }),

      updateVsGroup: builder.mutation({
        query: ({ groupId, ...data }) => ({
          url: `/vs/api/groups/${groupId}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['VsGroups'],
      }),

      deleteVsGroup: builder.mutation({
        query: (id) => ({
          url: `/vs/api/groups/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['VsGroups'],
      }),

      getAllVsGroupAssets: builder.query({
        query: ({ groupId }) => ({
          url: `/vs/api/groups/${groupId}`,
        }),
        providesTags: ['VsGroupsAssets'],
      }),

      addAssetsToVsGroup: builder.mutation({
        query: ({ groupId, assetIds }) => ({
          url: `/vs/api/groups/${groupId}/assets`,
          method: 'POST',
          body: { assetIds },
        }),
        invalidatesTags: ['VsGroups', 'VsGroupsAssets'],
      }),
    }),
  });

export const {
  useGetVsGroupsQuery,
  useGetAllVsGroupAssetsQuery,
  useCreateVsGroupMutation,
  useUpdateVsGroupMutation,
  useDeleteVsGroupMutation,
  useAddAssetsToVsGroupMutation,
} = vsGroupApi;
