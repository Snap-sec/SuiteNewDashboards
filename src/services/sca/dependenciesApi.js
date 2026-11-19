import { baseApi } from '@/services/baseApi';

export const scaDependenciesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaDependencies'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaDependencies: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/dependencies',
          params,
        }),
        providesTags: ['ScaDependencies'],
      }),

      getScaDependencyById: builder.query({
        query: (id) => `/sca/api/v1/dependencies/${encodeURIComponent(id)}`,
        providesTags: ['ScaDependencies'],
      }),
    }),
  });

export const {
  useGetScaDependenciesQuery,
  useGetScaDependencyByIdQuery,
} = scaDependenciesApi;
