import { baseApi } from '@/services/baseApi';

export const teamsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Teams'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTeams: builder.query({
        query: (params) => ({
          url: '/auth/api/teams',
          params,
        }),
        providesTags: (result) => ['Teams'],
      }),

      createTeam: builder.mutation({
        query: (payload) => ({
          url: '/auth/api/teams',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['Teams'],
      }),

      // addes members into a team members[]
      addMembersIntoTeam: builder.mutation({
        query: ({ teamId, payload }) => ({
          url: `/auth/api/teams/${teamId}/members`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['Teams'],
      }),

      removeMemberFromTeam: builder.mutation({
        query: ({ teamId, memberId }) => ({
          url: `/auth/api/teams/${teamId}/members/remove/${memberId}`,
          method: 'POST',
        }),
        invalidatesTags: ['Teams'],
      }),

      updateTeamAuth: builder.mutation({
        query: ({ payload, teamId }) => ({
          url: `/auth/api/teams/${teamId}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['Teams'],
      }),

      deleteTeam: builder.mutation({
        query: (teamId) => ({
          url: `/auth/api/teams/${teamId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Teams'],
      }),

      getTeamDetails: builder.query({
        query: (teamId) => ({
          url: `/auth/api/teams/${teamId}`,
        }),
        providesTags: (result) => ['Teams'],
      }),
    }),
  });

export const {
  useGetTeamsQuery,
  useDeleteTeamMutation,
  useCreateTeamMutation,
  useUpdateTeamAuthMutation,
  useAddMembersIntoTeamMutation,
  useRemoveMemberFromTeamMutation,
  useGetTeamDetailsQuery
} = teamsApi;
