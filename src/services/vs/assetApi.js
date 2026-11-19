import { baseApi } from '@/services/baseApi';

export const vsAssetApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VsAssets'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      addToVsGroup: builder.mutation({
        query: ({ assetId, groupId }) => ({
          url: `/vs/api/assets/${assetId}/group/${groupId}/add`,
          method: 'POST',
        }),

        invalidatesTags: ['VsAssets'],
      }),

      removeAssetFromVsGroup: builder.mutation({
        query: ({ assetId, groupId }) => ({
          url: `/vs/api/assets/${assetId}/group/${groupId}`,
          method: 'DELETE',
        }),

        invalidatesTags: ['VsAssets'],
      }),
    }),
  });

export const { useAddToVsGroupMutation, useRemoveAssetFromVsGroupMutation } =
  vsAssetApi;
