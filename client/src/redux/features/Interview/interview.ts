import { apiSlice } from "../Api/apiSlice";

/** Route regarding the feedback */
export const interviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    testairesponse: builder.mutation({
      query: ({ userCurrentApproach, questionId, userCode, language }) => ({
        url: `interview/test-airesponse/${questionId}`,
        method: "POST",
        body: {
          userCurrentApproach,
          questionId,
          userCode,
          language,
        },
        credentials: "include" as const,
      }),
    }),
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
  useTestairesponseMutation,
} = interviewApi;
