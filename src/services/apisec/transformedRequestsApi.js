import { baseApi } from '@/services/baseApi';

const transformedRequestsApi = baseApi
  .injectEndpoints({
    endpoints: (builder) => ({
      getTransformedRequests: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/transformed_requests`,
          params
        }),
      }),
    }),
  });


export const { useGetTransformedRequestsQuery } = transformedRequestsApi;