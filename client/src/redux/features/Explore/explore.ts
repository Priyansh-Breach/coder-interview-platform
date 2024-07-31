import { apiSlice } from "../Api/apiSlice";

/** Route regarding the feedback */
export const explorePageContent = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchContent: builder.query({
      query: ({ search, page }: { search: string; page: number }) => ({
        url: `explore/search?search=${encodeURIComponent(search)}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useSearchContentQuery } = explorePageContent;
