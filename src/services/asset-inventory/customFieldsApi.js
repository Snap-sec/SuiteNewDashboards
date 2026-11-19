import { baseApi } from '@/services/baseApi';

export const customFieldsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['CustomFields'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimCustomFields: builder.query({
        query: (params) => ({
          url: `/asset-inventory/api/v1/custom-fields`,
          params,
        }),
        providesTags: ['CustomFields'],
      }),

      getAimCustomFieldsSchema: builder.query({
        query: () => ({
          url: `/asset-inventory/api/v1/custom-fields/schema`,
        }),
      }),

      createAimCustomField: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/custom-fields`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['CustomFields'],
      }),

      updateAimCustomField: builder.mutation({
        query: ({ id, ...payload }) => ({
          url: `/asset-inventory/api/v1/custom-fields/${id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['CustomFields'],
      }),

      deleteAimCustomField: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/custom-fields/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['CustomFields'],
      }),
    }),
  });

export const {
  useGetAimCustomFieldsQuery,
  useGetAimCustomFieldsSchemaQuery,
  useCreateAimCustomFieldMutation,
  useUpdateAimCustomFieldMutation,
  useDeleteAimCustomFieldMutation,
} = customFieldsApi;
