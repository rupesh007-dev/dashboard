import { baseApi } from './baseApi';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationsByUserId: builder.query({
      query: (role) => ({
        url: `/notifications/role?name=${role}`,
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsByUserIdQuery } = notificationsApi;
