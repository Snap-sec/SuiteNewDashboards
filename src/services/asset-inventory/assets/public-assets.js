import { baseApi } from '../../baseApi';

export const publicAssetsApi = baseApi.enhanceEndpoints({
    addTagTypes: ['PublicAssets', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets']
}).injectEndpoints({
    endpoints: (builder) => ({
        getAimPublicAssets: builder.query({
            query: ({ orgId, search, limit = 10, page = 1, type }) => ({
                url: `/asset-inventory/api/v1/transformed-assets/public/assets/${orgId}`,
                params: {
                    search,
                    limit,
                    page,
                    type
                }
            }),
            providesTags: ['PublicAssets'],
            transformResponse: (response) => {
                return response;
            },
            transformErrorResponse: (response) => {
                return response.data?.message || 'Failed to fetch public assets';
            }
        }),
        getAimPublicAssetDetailsById: builder.query({
            query: ({ orgId, assetId }) => ({
                url: `/asset-inventory/api/v1/transformed-assets/public/assets/${orgId}/${assetId}`,
                method: 'GET'
            }),
            providesTags: ['PublicAssets'],
            transformResponse: (response) => {
                return response;
            },
            transformErrorResponse: (response) => {
                return response.data?.message || 'Failed to fetch public asset details';
            }
        }),

        getAimPublicAssetsSchema: builder.query({
            query: (params = {}) => {
                const typeVal = typeof params === 'string' ? params : (params?.type || 'all');
                return {
                    url: `/asset-inventory/api/v1/transformed-assets/public/assets/schema`,
                    params: {
                        type: !typeVal || typeVal === 'all' ? 'all' : typeVal,
                    },
                    method: 'GET'
                };
            },
            providesTags: ['PublicAssets'],
            transformResponse: (response) => {
                return response;
            },
            transformErrorResponse: (response) => {
                return response.data?.message || 'Failed to fetch public assets schema';
            }
        }),

        updateAimPublicAsset: builder.mutation({
            query: ({ orgId, assetId, body }) => ({
                url: `/asset-inventory/api/v1/transformed-assets/public/assets/${orgId}/${assetId}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['PublicAssets', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets']
        }),

        exportAimPublicAssetsView: builder.mutation({
            query: ({ orgId, search, type, columns }) => ({
                url: `/asset-inventory/api/v1/transformed-assets/public/assets/${orgId}/export-view`,
                method: 'GET',
                params: {
                    search,
                    type,
                    columns
                },
                responseHandler: (response) => response.blob(),
            })
        }),

    })
});

export const {
    useGetAimPublicAssetsQuery,
    useGetAimPublicAssetDetailsByIdQuery,
    useGetAimPublicAssetsSchemaQuery,
    useUpdateAimPublicAssetMutation,
    useExportAimPublicAssetsViewMutation
} = publicAssetsApi;
