import { apiSlice } from "./api/apiSlice";

export const superadminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/superadmin/users",
      providesTags: ['Users'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/superadmin/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/superadmin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Users'],
    }),
    getInstructorDashboard: builder.query({
      query: (id) => `/superadmin/instructor/${id}/dashboard`,
    }),
    getStudentDashboard: builder.query({
      query: (id) => `/superadmin/student/${id}/dashboard`,
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetInstructorDashboardQuery,
  useGetStudentDashboardQuery,
} = superadminApi;
