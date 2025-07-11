import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";


const USER_API = "https://patashala-online-learning-management.onrender.com/api/v1/user/";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),

    loginUser: builder.mutation({
      query: (userData) => ({
        url: "login",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (err) {
          console.log(err);
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch,queryFulfilled }) {
        try {
           await queryFulfilled;
         dispatch(userLoggedOut());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (err) {
          
        }
      },
    }),

    updateUser: builder.mutation({
      query: (userData) => ({
        url: "profile/update",
        method: "PUT",
        body: userData,
      }),
    }),

    initiateRegister: builder.mutation({
      query: (userData) => ({
        url: "register/initiate",
        method: "POST",
        body: userData,
      }),
    }),

    verifyRegisterOtp: builder.mutation({
      query: (otpData) => ({
        url: "register/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),

    resendRegisterOtp: builder.mutation({
      query: (emailData) => ({
        url: "register/resend-otp",
        method: "POST",
        body: emailData,
      }),
    }),
  }),
});
export const { 
    useRegisterUserMutation, 
    useLoginUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    useLogoutUserMutation,
    useInitiateRegisterMutation,
    useVerifyRegisterOtpMutation,
    useResendRegisterOtpMutation
 } = authApi;
