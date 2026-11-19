import { get } from 'react-hook-form';
import { baseApi } from '@/services/baseApi';

export const asmAttackSurfaceApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Attack Surface', "AsmAssetTimelineData", "AsmAssetExposures"] })
  .injectEndpoints({
    endpoints: (builder) => ({

      getAsmAssets: builder.query({
        query: (params) => ({
          url: '/op/api/v1/assets',
          params,
        }),
        providesTags: (result) => ['Attack Surface'],
      }),

      getAsmAssetTimelineData: builder.query({
        query: (arg) => {
          if (typeof arg === 'object' && arg !== null) {
            const { assetId, ...params } = arg;
            return {
              url: `/op/api/v1/assets/${assetId}/timeline`,
              params,
            };
          }
          return {
            url: `/op/api/v1/assets/${arg}/timeline`,
          };
        },
        providesTags: ["AsmAssetTimelineData"]
      }),

      exportAsmAssetsToCSV: builder.query({
        query: (params) => ({
          url: '/op/api/v1/assets/export',
          params,
          responseHandler: (response) => response.text(),
        }),
      }),


      getAsmIPs: builder.query({
        query: (params) => ({
          url: '/op/assets/ips',
          params,
        }),
        providesTags: (result) => ['Attack Surface'],
      }),

      getAsmDNSRecords: builder.query({
        query: (params) => ({
          url: '/op/dns',
          params,
        }),
        providesTags: (result) => ['Attack Surface'],
      }),

      getAsmPorts: builder.query({
        query: (params) => ({
          url: '/op/ports',
          params,
        }),
        providesTags: (result) => ['Attack Surface'],
      }),

      getAsmCertificates: builder.query({
        query: (params) => ({
          url: '/op/certificates',
          params,
        }),
        providesTags: (result) => ['Attack Surface'],
      }),

      getAsmTechnologies: builder.query({
        query: (params) => ({
          url: '/op/technologies',
          params,
        }),
        providesTags: (result) => ['Attack Surface'],
      }),

      setAsmExposure: builder.mutation({
        query: ({ assetType, assetId, risk, reason }) => ({
          url: `/op/api/v1/assets/${assetId}/exposure`,
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: { risk, reason },
        }),
        invalidatesTags: ['Attack Surface'],
      }),

      getAsmAssetGeneralDetails: builder.query({
        query: ({ value, type }) => ({
          url: `/csm/api/assets/general-details?value=${value}&type=${type}`,
        }),
        providesTags: (result) => ['AsmAssetGeneralDetails'],
      }),


      getAsmAssetsDetailsById: builder.query({
        query: (assetId) => ({
          url: `/op/api/v1/assets/${assetId}`,
        }),
        providesTags: (result) => ['Attack Surface'],
      }),

      getAsmAssetSignalsData: builder.query({
        query: (assetId) => ({
          url: `/op/api/v1/assets/${assetId}/signals`,
        }),
        providesTags: ['AsmAssetSignals'],
      }),

      // Returns asset exposures data.
      getAsmAssetExposures: builder.query({
        query: (args) => {
          if (typeof args === 'object' && args !== null) {
            const { assetId, id, ...params } = args;
            return {
              url: `/op/api/v1/assets/${assetId || id}/exposures`,
              params,
            };
          }
          return {
            url: `/op/api/v1/assets/${args}/exposures`,
          };
        },
        providesTags: ['AsmAssetExposures'],
      }),

    }),
  });

export const {
  useGetAsmAssetsQuery,
  useGetAsmIPsQuery,
  useGetAsmDNSRecordsQuery,
  useGetAsmPortsQuery,
  useGetAsmCertificatesQuery,
  useGetAsmTechnologiesQuery,
  useSetAsmExposureMutation,
  useGetAsmAssetGeneralDetailsQuery,
  useLazyExportAsmAssetsToCSVQuery,
  useGetAsmAssetsDetailsByIdQuery,
  useGetAsmAssetSignalsDataQuery,
  useGetAsmAssetTimelineDataQuery,
  useGetAsmAssetExposuresQuery
} = asmAttackSurfaceApi;
