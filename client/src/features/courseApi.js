import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/v1" }),
  endpoints: (builder) => ({
    getCourseEnrollmentStats: builder.query({
      query: (id) => `/course/${id}/enrollment-stats`,
    }),
  }),
});

export const {
  useGetCourseByIdQuery,
  useSearchCourseQuery,
  useGetCreatorCourseQuery,
  useGetCourseEnrollmentStatsQuery,
} = courseApi; 