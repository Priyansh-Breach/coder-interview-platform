import { apiSlice } from "../Api/apiSlice";

/**Route regarding the feedback */
export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    giveFeedback: builder.mutation({
      query: ({ feedbackText, rating, userId }) => ({
        url: "users/feedback",
        method: "POST",
        body: {
          feedbackText,
          rating,
          userId,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGiveFeedbackMutation } = feedbackApi;
