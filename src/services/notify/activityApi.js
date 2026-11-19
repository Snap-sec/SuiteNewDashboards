import { baseApi } from "@/services/baseApi";


export const activityApi = baseApi.enhanceEndpoints({ addTagTypes: ['Activity'] }).injectEndpoints({
    endpoints: (builder) => ({

        getActivity: builder.query({
            query: (params) => ({
                url: "/notify/api/activity/bulk",
                params
            }),
            providesTags: (result) => ["Activity"]
        }),

        getNotifications: builder.query({
            query: (params) => ({
                url: "/notify/api/notification/bulk",
                params
            }),
            providesTags: (result) => ["Notifications"]
        }),

        markNotificationAsSeen: builder.mutation({
            query: ({ notificationId }) => ({
                url: `/notify/api/notification/${notificationId}/seen`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, { notificationId }) => ["Notifications", `Notification-${notificationId}`]
        }),


        markAllNotificationsAsSeen: builder.mutation({
            query: ({origin}) => ({
                url: "/notify/api/notification/seen",
                method: 'POST',
                body: {origin}
            }),
            invalidatesTags: (result) => ["Notifications"]
        }),
    }),
});

export const { useGetActivityQuery, useGetNotificationsQuery, useMarkNotificationAsSeenMutation, useMarkAllNotificationsAsSeenMutation } = activityApi;