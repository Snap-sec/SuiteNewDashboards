import { baseApi } from '@/services/baseApi';

export const assetGroupsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'AssetInventoryAssetGroups',
      'AssetInventoryAssetGroupMembers',
      'AssetInventoryGlobalAssets',
      'AssetInventoryAssets',
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAssetGroups: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/asset-groups',
          params,
        }),
        providesTags: ['AssetInventoryAssetGroups'],
      }),
      getAssetGroup: builder.query({
        query: (id) => ({ url: `/asset-inventory/api/v1/asset-groups/${id}` }),
        providesTags: ['AssetInventoryAssetGroups'],
      }),
      createAssetGroup: builder.mutation({
        query: (body) => ({
          url: '/asset-inventory/api/v1/asset-groups',
          method: 'POST',
          body,
        }),
        invalidatesTags: [
          'AssetInventoryAssetGroups',
          'AssetInventoryAssetGroupMembers',
          'AssetInventoryGlobalAssets',
          'AssetInventoryAssets',
        ],
      }),
      updateAssetGroup: builder.mutation({
        query: ({ id, body }) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['AssetInventoryAssetGroups'],
      }),
      replaceAssetGroup: builder.mutation({
        query: ({ id, body }) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['AssetInventoryAssetGroups'],
      }),
      deleteAssetGroup: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [
          'AssetInventoryAssetGroups',
          'AssetInventoryAssetGroupMembers',
          'AssetInventoryGlobalAssets',
          'AssetInventoryAssets',
        ],
      }),
      recomputeAssetGroup: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}/recompute`,
          method: 'POST',
        }),
        invalidatesTags: ['AssetInventoryAssetGroups'],
      }),
      recomputeAllAssetGroups: builder.mutation({
        query: () => ({
          url: '/asset-inventory/api/v1/asset-groups/recompute-all',
          method: 'POST',
        }),
        invalidatesTags: ['AssetInventoryAssetGroups'],
      }),
      initializeDefaultAssetGroups: builder.mutation({
        query: () => ({
          url: '/asset-inventory/api/v1/asset-groups/init-defaults',
          method: 'POST',
        }),
        invalidatesTags: [
          'AssetInventoryAssetGroups',
          'AssetInventoryAssetGroupMembers',
          'AssetInventoryGlobalAssets',
          'AssetInventoryAssets',
        ],
      }),
      getAssetGroupMembers: builder.query({
        query: ({ id, ...params }) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}/assets`,
          params,
        }),
        providesTags: [
          'AssetInventoryAssetGroupMembers',
          'AssetInventoryAssetGroups',
        ],
      }),
      addAssetGroupMembers: builder.mutation({
        query: ({ id, assetIds }) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}/assets`,
          method: 'POST',
          body: { assetIds },
        }),
        invalidatesTags: [
          'AssetInventoryAssetGroups',
          'AssetInventoryAssetGroupMembers',
          'AssetInventoryGlobalAssets',
          'AssetInventoryAssets',
        ],
      }),
      removeAssetGroupMembers: builder.mutation({
        query: ({ id, assetIds }) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}/assets`,
          method: 'DELETE',
          body: { assetIds },
        }),
        invalidatesTags: [
          'AssetInventoryAssetGroups',
          'AssetInventoryAssetGroupMembers',
          'AssetInventoryGlobalAssets',
          'AssetInventoryAssets',
        ],
      }),
      removeAssetGroupMember: builder.mutation({
        query: ({ id, assetId }) => ({
          url: `/asset-inventory/api/v1/asset-groups/${id}/assets/${assetId}`,
          method: 'DELETE',
        }),
        invalidatesTags: [
          'AssetInventoryAssetGroups',
          'AssetInventoryAssetGroupMembers',
          'AssetInventoryGlobalAssets',
          'AssetInventoryAssets',
        ],
      }),
    }),
  });

export const {
  useGetAssetGroupsQuery,
  useGetAssetGroupQuery,
  useCreateAssetGroupMutation,
  useUpdateAssetGroupMutation,
  useReplaceAssetGroupMutation,
  useDeleteAssetGroupMutation,
  useRecomputeAssetGroupMutation,
  useRecomputeAllAssetGroupsMutation,
  useInitializeDefaultAssetGroupsMutation,
  useGetAssetGroupMembersQuery,
  useAddAssetGroupMembersMutation,
  useRemoveAssetGroupMembersMutation,
  useRemoveAssetGroupMemberMutation,
} = assetGroupsApi;
