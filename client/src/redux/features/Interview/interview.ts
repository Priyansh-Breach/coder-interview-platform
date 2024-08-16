import { apiSlice } from "../Api/apiSlice";

/** Route regarding the feedback */
export const interviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // giveInterview: builder.mutation({
    //   query: ({ question, language, code, userExplaination }) => ({
    //     url: "/interview/question-context",
    //     method: "POST",
    //     body: {
    //       question,
    //       language,
    //       code,
    //       userExplaination,
    //     },
    //     credentials: "include" as const,
    //   }),
    // }),
    startInterview: builder.mutation({
      query: ({ id }) => ({
        url: `interview/start-Interview/${id}`,
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    questionContext: builder.mutation({
      query: ({ questionId }) => ({
        url: `interview/question-context/${questionId}`,
        method: "POST",
        body: {
          questionId,
        },
        credentials: "include" as const,
      }),
    }),
    getQuestion: builder.query({
      query: (id: string) => ({
        url: `interview/getQuestion/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useQuestionContextMutation,
  useGetQuestionQuery,
  useStartInterviewMutation,
} = interviewApi;
