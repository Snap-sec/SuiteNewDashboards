import { data } from 'react-router';
import { baseApi } from '../../baseApi';

export const assetsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'AssetInventoryAssets',
      'AssetInventoryAssetStats',
      'AssetInventoryGlobalAssets',
      'AssetInventoryPublicAssets',
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // Get assets by specifying assetType
      getAimAssets: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/transformed-assets',
          params,
        }),

        providesTags: ['AssetInventoryAssets'],
      }),

      getAimPublicTransformedAssets: builder.query({
        query: ({orgId, params}) => ({
          url: `/asset-inventory/api/v1/transformed-assets/public/assets/${orgId}`,
          params,
        }),
        providesTags: ['AssetInventoryPublicAssets'],
      }),

      // Get asset stats by assetType
      getAimAssetStats: builder.query({
        query: (assetType) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetType}/stats`,
        }),

        providesTags: ['AssetInventoryAssetStats'],
      }),

      deleteAimAssetById: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}/stage-for-decommission`,
          method: 'POST',
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryAssetStats', 'AdvancedAssets'],
      }),

      // Get asset stats by assetType
      getAimAssetDetailsById: builder.query({
        query: (assetId) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetId}`,
        }),

        providesTags: ['AssetInventoryAssets'],
      }),

      updateAimAsset: builder.mutation({
        query: ({ id, body }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      getAimAssetImpact: builder.query({
        query: (assetId) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetId}/impact`,
        }),
        providesTags: ['AssetInventoryAssets'],
      }),

      updateAimAssetImpact: builder.mutation({
        query: ({ id, body }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}/impact`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['AssetInventoryAssets'],
      }),

      getAimAssetImpactConfiguration: builder.query({
        query: () => ({
          url: `/asset-inventory/api/v1/transformed-assets/impact/configuration`,
        }),
      }),



      // Get global list of transformed assets with filters
      getAimGlobalAssets: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/transformed-assets/global/list',
          params,
        }),

        providesTags: ['AssetInventoryGlobalAssets'],
      }),

      decommissionAimGlobalAsset: builder.mutation({
        query: ({ assetId, ...payload }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetId}/decommission`,
          method: "POST",
          body: payload
        }),

        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AdvancedAssets'],
      }),

      aimStageForDecommission: builder.mutation({
        query: ({ assetId, ...payload }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetId}/stage-for-decommission`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AdvancedAssets'],
      }),

      reactivateAimAsset: builder.mutation({
        query: ({ assetId, ...payload }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetId}/reactivate`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AdvancedAssets'],
      }),

      getAimAssetDetailsTimeline: builder.query({
        query: (arg) => {
          if (typeof arg === 'object' && arg !== null) {
            const assetId = arg.id || arg.assetId;
            return {
              url: `/asset-inventory/api/v1/transformed-assets/${assetId}/timeline`,
              params: arg.params,
            };
          }
          return {
            url: `/asset-inventory/api/v1/transformed-assets/${arg}/timeline`,
          };
        },

        providesTags: ['AssetInventoryGlobalAssets'],
      }),

      // used on edit asset page to get asset configs for dropdowns
      getAimAssetConfigs: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/transformed-assets/edit/properties-config',
          params,
        }),

        providesTags: ['AssetInventoryGlobalAssets'],
      }),

      updateAimAssetBulk: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/transformed-assets/bulk-update`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AdvancedAssets'],
      }),

      // used on edit asset page to add asset relationships
      setAimAssetsRelationship: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/relationships`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AdvancedAssets'],
      }),

  addAimAssetTimelineActivity: builder.mutation({
        query: ({ id, body }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}/timeline`,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['AssetInventoryGlobalAssets'],
      }),

  deleteAimAssetTimelineActivity: builder.mutation({
        query: ({ id, activityId }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}/timeline/${activityId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AssetInventoryGlobalAssets'],
      }),


      getAimAssetApprovals: builder.query({
        query: ({ assetId, search }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetId}/approvals`,
          params: { search },
        }),
        providesTags: ['AssetApprovals'],
      }),

      updateAimAssetApproval: builder.mutation({
        query: ({ assetId, status, reason }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${assetId}/approvals/${status}`,
          method: 'POST',
          body: { reason },
        }),
        invalidatesTags: ['AssetApprovals'],
      }),

      bulkAimUpdate: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/transformed-assets/bulk/update`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AdvancedAssets'],
      }),

      deleteBulkAimAssets: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/transformed-assets/bulk-delete`,
          method: "POST",
          body: payload
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AdvancedAssets'],
      }),
    }),

  });

export const {
  useGetAimAssetsQuery,
  useGetAimAssetStatsQuery,
  useGetAimAssetDetailsByIdQuery,
  useGetAimGlobalAssetsQuery,
  useGetAimAssetConfigsQuery,
  useGetAimPublicTransformedAssetsQuery,

  useDecommissionAimGlobalAssetMutation,
  useAimStageForDecommissionMutation,
  useReactivateAimAssetMutation,

  useUpdateAimAssetMutation,
  useUpdateAimAssetBulkMutation,
  
  useGetAimAssetImpactQuery,
  useUpdateAimAssetImpactMutation,
  useGetAimAssetImpactConfigurationQuery,

  useSetAimAssetsRelationshipMutation,
  
  useDeleteAimAssetByIdMutation,
  useGetAimAssetDetailsTimelineQuery,
  useAddAimAssetTimelineActivityMutation,
  useDeleteAimAssetTimelineActivityMutation,


  useGetAimAssetApprovalsQuery,
  useUpdateAimAssetApprovalMutation,
  useBulkAimUpdateMutation,
  useDeleteBulkAimAssetsMutation,
} = assetsApi;
