import { baseApi } from '@/services/baseApi';

export const filesApi = baseApi.enhanceEndpoints({ addTagTypes: ['VmEvidence'] }).injectEndpoints({
    endpoints: (builder) => ({

        getVmEvidence: builder.query({
          query: (assessmentId) => ({
            url: `/csm/api/files/evidence/${assessmentId}`,
          }),
          providesTags: (result) => ['VmEvidence'],
        }),

    }),
});


export const { useGetVmEvidenceQuery } = filesApi;
