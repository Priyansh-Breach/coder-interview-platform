import { apiSlice } from "../Api/apiSlice";

/** Route regarding the feedback */
export const interviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startInterview: builder.mutation({
      query: ({ id, time }) => ({
        url: `interview/start-Interview/${id}`,
        method: "POST",
        body: {
          time,
        },
        credentials: "include" as const,
      }),
    }),
    leaveInterview: builder.mutation({
      query: ({ questionId }) => ({
        url: `interview/leave-Interview/${questionId}`,
        method: "POST",
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
    getActiveInterview: builder.query({
      query: () => ({
        url: `interview/getActiveSessions`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getInterviewHistory: builder.mutation({
      query: ({ pageNo, limit }) => ({
        url: `interview/getInterviewHistory`,
        method: "POST",
        body: {
          pageNo,
          limit,
        },
        credentials: "include" as const,
      }),
    }),
    completeInterview: builder.mutation({
      query: ({ id, interviewId }) => ({
        url: `interview/complete-interview/${id}`,
        method: "POST",
        body: {
          interviewId,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useLeaveInterviewMutation,
  useGetQuestionQuery,
  useStartInterviewMutation,
  useGetActiveInterviewQuery,
  useGetInterviewHistoryMutation,
  useCompleteInterviewMutation,
} = interviewApi;
