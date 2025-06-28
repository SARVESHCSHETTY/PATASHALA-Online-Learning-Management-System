
import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
        query: (data) => ({
          url: "/auth/reset-password",
          method: "POST",
          body: data,
        }),
      }),
      
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } = authApiSlice;
