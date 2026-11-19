import { baseApi } from '@/services/baseApi';

export const threatApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['threats', 'threat'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      
      getThreats: builder.query({
        query: (params) => ({
          url: '/tm/api/threats',
          params,
        }),
        providesTags: (result) => ['threats'],
      }),

      getThreatById: builder.query({
        query: ({ params, threatId }) => { console.log(params, threatId); return ({
          url: `/tm/api/threats/${threatId}`,
          params,
        }) },
        providesTags: (result) => ['threat'],
      }),

      addCommentToThreat: builder.mutation({
        query: ({ threatId, comment }) => ({
          url: `/tm/api/threats/${threatId}/comment`,
          method: 'POST',
          body: comment,
        }),
        invalidatesTags: ['threat'],
      }),

      updateThreatDetailsById: builder.mutation({
        query: ({ threatId, updates }) => ({
          url: `/tm/api/threats/${threatId}`,
          method: 'PATCH',
          body: updates,
        }),
        invalidatesTags: ['threat', 'threats'],
      }),

      createManualThreat: builder.mutation({
        query: ({ projectId, data }) => ({
          url: `/tm/api/projects/${projectId}/threats`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ["threats", "ProjectThreats", "EndpointThreats"],
      }),

      deleteThreatById: builder.mutation({
        query: (threatId) => ({
          url: `/tm/api/threats/${threatId}`,
          method: "DELETE"
        }),
        invalidatesTags: ["threats"]
      }),

      bulkUpdateThreats: builder.mutation({
        query: ({ body }) => ({
          url: `/tm/api/threats/update/bulk`,
          method: 'PATCH',
          body: body,
        }),
        invalidatesTags: ['threats','Threats', 'EndpointThreats'],
      }),

      deleteThreatComment: builder.mutation({
        query: ({ threatId, commentId }) => ({
          url: `/tm/api/threats/${threatId}/comment/${commentId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['threat'],
      }),
    }),
  });

export const {
  useGetThreatsQuery,
  useGetThreatByIdQuery,
  useAddCommentToThreatMutation,
  useUpdateThreatDetailsByIdMutation,
  useCreateManualThreatMutation,
  useDeleteThreatByIdMutation,
  useBulkUpdateThreatsMutation,
  useDeleteThreatCommentMutation,
} = threatApi;
