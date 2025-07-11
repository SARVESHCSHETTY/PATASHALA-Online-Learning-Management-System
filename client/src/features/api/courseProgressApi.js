import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "https://patashala-online-learning-management.onrender.com/api/v1/progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method:"POST"
      }),
    }),

    completeCourse: builder.mutation({
        query:(courseId) => ({
            url:`/${courseId}/complete`,
            method:"POST"
        })
    }),
    inCompleteCourse: builder.mutation({
        query:(courseId) => ({
            url:`/${courseId}/incomplete`,
            method:"POST"
        })
    }),
    askLectureQuestion: builder.mutation({
      query: ({ courseId, lectureId, question }) => ({
        url: "/question",
        method: "POST",
        body: { courseId, lectureId, question },
      }),
    }),
    getLectureQuestions: builder.query({
      query: ({ courseId, lectureId }) => ({
        url: `/questions?courseId=${courseId}&lectureId=${lectureId}`,
        method: "GET",
      }),
    }),
    replyLectureQuestion: builder.mutation({
      query: ({ questionId, reply }) => ({
        url: `/question/${questionId}/reply`,
        method: "PATCH",
        body: { reply },
      }),
    }),
    likeLectureQuestion: builder.mutation({
      query: (questionId) => ({
        url: `/question/${questionId}/like`,
        method: "POST",
      }),
    }),
    unlikeLectureQuestion: builder.mutation({
      query: (questionId) => ({
        url: `/question/${questionId}/unlike`,
        method: "POST",
      }),
    }),
    addReplyToLectureQuestion: builder.mutation({
      query: ({ questionId, text }) => ({
        url: `/question/${questionId}/reply-threaded`,
        method: "POST",
        body: { text },
      }),
    }),
  }),
});
export const {
useGetCourseProgressQuery,
useUpdateLectureProgressMutation,
useCompleteCourseMutation,
useInCompleteCourseMutation,
useAskLectureQuestionMutation,
useGetLectureQuestionsQuery,
useReplyLectureQuestionMutation,
useLikeLectureQuestionMutation,
useUnlikeLectureQuestionMutation,
useAddReplyToLectureQuestionMutation
} = courseProgressApi;
