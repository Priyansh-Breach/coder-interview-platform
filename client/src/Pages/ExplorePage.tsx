import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, TrendingUpIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PlaceholdersAndVanishInput } from "@/components/ui/Aceternity/placeholders-and-vanish-input";
import { useSearchContentQuery } from "@/redux/features/Explore/explore";
import { ExpandableCardStandard } from "@/components/ui/Aceternity/expandable-card-standard";

const placeholders = [
  "Array",
  "LinkedList",
  "Stacks",
  "Queues",
  "Trees",
  "Graphs",
  "Hash Tables",
  "Sorting",
  "Searching",
  "Dynamic Programming",
  "Recursion",
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [trendingQuestions, setTrendingQuestions] = useState<any[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageNumber = searchParams.get("page") || "";

  const {
    data: searchedData,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchContentQuery(searchQuery, {
    skip: !searchQuery,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
  };

  useEffect(() => {
    const fetchTrendingQuestions = async () => {
      // Fetch trending questions if there is no search term
      if (!searchQuery) {
      }
    };

    fetchTrendingQuestions();
  }, [searchQuery]);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full mt-14">
        <main className="flex-1 border-r bg-background p-6 sm:p-8 md:p-10">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Questions</h1>
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* {searchQuery && searchedData?.map((result: any) => (
              <a
                key={result.id}
                href="#"
                className="group flex flex-col rounded-md border bg-background p-4 transition-colors hover:bg-muted"
              >
                <div className="mb-2 text-lg font-medium">{result.title}</div>
                <div className="text-sm text-muted-foreground">
                  {result.description}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {result.difficulty}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    <TrendingUpIcon className="mr-1 inline h-4 w-4" />
                    {result.popularity}
                  </div>
                </div>
              </a>
            ))} */}
          </div>
          <ExpandableCardStandard data={searchedData} />
        </main>
        <aside className="w-64 border-l bg-background p-6 sm:p-8 md:p-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Trending Questions</h2>
            <div className="mt-4 space-y-4">
              {trendingQuestions.map((question: any) => (
                <a
                  key={question.id}
                  href="#"
                  className="group flex items-center justify-between rounded-md bg-muted p-3 transition-colors hover:bg-accent"
                >
                  <div className="text-sm font-medium">{question.title}</div>
                  <div className="text-xs text-muted-foreground">
                    <TrendingUpIcon className="mr-1 inline h-4 w-4" />
                    {question.popularity}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
