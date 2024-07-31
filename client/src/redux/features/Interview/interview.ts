import { apiSlice } from "../Api/apiSlice";

/** Route regarding the feedback */
export const interviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    giveInterview: builder.mutation({
      query: ({ question, language, code, userExplaination }) => ({
        url: "/interview",
        method: "POST",
        body: {
          question,
          language,
          code,
          userExplaination,
        },
        credentials: "include" as const,
      }),
    }),
    getQuestion: builder.query({
      query: (id: string) => ({
        url: `/getQuestion/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGiveInterviewMutation, useGetQuestionQuery } = interviewApi;
