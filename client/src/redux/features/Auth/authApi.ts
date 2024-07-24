/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiSlice } from "../Api/apiSlice";
import { userLoggedIn, userRegistration, userLoggedOut } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //endpoints
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "users/register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "users/user-activation",
        method: "POST",
        body: {
          activation_code,
          activation_token,
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "users/login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    userLoggedOut: builder.mutation({
      query: () => ({
        url: "users/logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { dispatch }) {
        try {
          // You might want to perform some additional actions on logout
          // For example, clear local storage, reset state, etc.
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, password, avatar }) => ({
        url: "social-authentication",
        method: "POST",
        body: {
          email,
          password,
          avatar,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useUserLoggedOutMutation,
} = authApi;