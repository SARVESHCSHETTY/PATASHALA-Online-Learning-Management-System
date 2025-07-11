import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "https://patashala-online-learning-management.onrender.com/api/v1", credentials: "include" }),
    endpoints: () => ({}),
});
