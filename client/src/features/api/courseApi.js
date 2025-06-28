import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1";
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "/course",
        method: "POST",
        body: {
          courseTitle,
          category,
        },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getSearchCourse:builder.query({
      query: ({searchQuery, categories, sortByPrice}) => {
        // Build qiery string
        let queryString = `/course/search?query=${encodeURIComponent(searchQuery)}`

        // append cateogry 
        if(categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`; 
        }

        // Append sortByPrice is available
        if(sortByPrice){
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`; 
        }

        return {
          url:queryString,
          method:"GET", 
        }
      }
    }),
    getPublishedCourse: builder.query({
      query: () => ({
        url: "/course/published-courses",
        method: "GET",
        
      }),
      providesTags: ["PublishedCourses"],
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "/course",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/course/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
   

    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "GET",
      }),
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/course/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseLecture: builder.query({
      query: ({ courseId }) => ({
        url: `/course/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),
    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `/course/${courseId}/lecture/${lectureId}`,
        method: "PUT",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
      invalidatesTags: ["Refetch_Lecture", "Course"],
    }),

    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/course/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture", "Course"],
    }),

    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/course/lecture/${lectureId}`,
        method: "GET",
      }),
      providesTags: (result, error, lectureId) =>
        result
          ? [{ type: "Refetch_Lecture", id: lectureId }]
          : ["Refetch_Lecture"],
    }),
    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/course/${courseId}/publish?publish=${query}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
        "PublishedCourses",
        "Refetch_Creator_Course",
      ],
    }),
    rateCourse: builder.mutation({
      query: ({ courseId, rating }) => ({
        url: `/course/${courseId}/rate`,
        method: "POST",
        body: { rating },
      }),
    }),
    getCourseRating: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/rating`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetPublishedCourseQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useGetLectureByIdQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  usePublishCourseMutation,
  useRateCourseMutation,
  useGetCourseRatingQuery,
} = courseApi;
