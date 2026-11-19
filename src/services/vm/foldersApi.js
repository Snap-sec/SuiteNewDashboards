import { baseApi } from '@/services/baseApi';

export const foldersApi = baseApi.enhanceEndpoints({ addTagTypes: ['vmFolders'] }).injectEndpoints({
    endpoints: (builder) => ({

        getVmFolders: builder.query({
          query: (params) => ({
            url: '/csm/api/folders',
            params,
          }),
          providesTags: ['vmFolders'],
        }),


        getVmFolderById: builder.query({
          query: (folderId) => ({
            url: `/csm/api/folders/${folderId}`,
          }),
          providesTags: ['vmFolders'],
        }),
        
        createVmFolder: builder.mutation({
          query: (folderData) => ({
            url: '/csm/api/folders',
            method: 'POST',
            body: folderData,
          }),
          invalidatesTags: ['vmFolders'],
        }),

        createVmChildFolder: builder.mutation({
          query: ({folderData, parentId}) => ({
            url: `/csm/api/folders/${parentId}/children`,
            method: 'POST',
            body: folderData,
          }),
          invalidatesTags: ['vmFolders'],
        }),

        createVmChildAssessment: builder.mutation({
          query: ({assessmentData, folderId}) => ({
            url: `/csm/api/folders/${folderId}/assessments`,
            method: 'POST',
            body: assessmentData,
          }),
          invalidatesTags: ['vmFolders'],
        }),

        deleteVmFolder: builder.mutation({
          query: (folderId) => ({
            url: `/csm/api/folders/${folderId}`,
            method: 'DELETE'
          }),
          invalidatesTags: ['vmFolders'],
        }),
        
        deleteVmAssessments: builder.mutation({
          query: ({folderId, assessmentId}) => ({
            url: `/csm/api/folders/${folderId}/assessments/${assessmentId}`,
            method: 'DELETE'
          }),
          invalidatesTags: ['vmFolders'],
        }),

        updateVmFolder: builder.mutation({
          query: ({ id, ...folderData }) => ({
            url: `/csm/api/folders/${id}`,
            method: 'PATCH',
            body: folderData,
          }),
          invalidatesTags: ['vmFolders'],
        }),

    }),
});


export const { 
    useGetVmFoldersQuery, 
    useGetVmFolderByIdQuery, 
    useCreateVmFolderMutation, 
    useCreateVmChildAssessmentMutation, 
    useDeleteVmFolderMutation, 
    useDeleteVmAssessmentsMutation,
    useUpdateVmFolderMutation, 
    useCreateVmChildFolderMutation 
} = foldersApi;
