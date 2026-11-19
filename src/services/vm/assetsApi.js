import { data } from 'react-router';
import { baseApi } from '../baseApi';

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVmAssetDetail: builder.query({
      query: (id) => `csm/api/assets/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Asset', id }],
    }),

    updateVmAsset: builder.mutation({
      query: ({ id, data }) => {
        console.log('IIDDD', id);
        console.log('DDDAATTA:', data);
        return {
          url: `csm/api/assets/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['Asset', 'AssetStats'],
    }),

    markVmAssetImportant: builder.mutation({
      query: ({ id, important }) => ({
        url: `csm/api/assets/${id}`,
        method: 'PUT',
        body: { important },
      }),
      async onQueryStarted({ id, important }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          assetsApi.util.updateQueryData('getAssets', undefined, (draft) => {
            const asset = draft.assets?.find((a) => a._id === id);
            if (asset) {
              asset.important = important;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Asset'],
    }),

    bulkUpdateVmAssets: builder.mutation({
      query: (assets) => ({
        url: 'csm/api/assets/bulk',
        method: 'PUT',
        body: { assets },
      }),
      invalidatesTags: ['Asset', 'AssetStats'],
    }),

    deleteVmAsset: builder.mutation({
      query: (id) => ({
        url: `csm/api/assets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Asset', 'AssetStats'],
    }),

    getVmAssetTags: builder.query({
      query: () => ({
        url: "/csm/api/assets/get/tags",
        providesTags: result => ["VmAssetTags"]
      })
    }),

  }),
});

export const {
  useGetVmAssetDetailQuery,
  useUpdateVmAssetMutation,
  useMarkVmAssetImportantMutation,
  useBulkUpdateVmAssetsMutation,
  useDeleteVmAssetMutation,
  useGetVmAssetTagsQuery
} = assetsApi;
