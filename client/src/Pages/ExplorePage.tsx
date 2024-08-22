import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PlaceholdersAndVanishInput } from "@/components/ui/Aceternity/placeholders-and-vanish-input";
import { useSearchContentQuery } from "@/redux/features/Explore/explore";
import { ExpandableCardStandard } from "@/components/ui/Aceternity/expandable-card-standard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import NotFound from "@/components/notFound";
import { MetaData } from "@/lib/MetaData/metaData";
import { ExpandableCardGrid } from "@/components/ui/Aceternity/expandable-card-grid";
import { LoadingIcon } from "@/components/ui/Icons/SelectMore";

const placeholders = [
  "Easy",
  "Hard",
  "Medium",
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
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );
  const [currentSet, setCurrentSet] = useState<number>(0);

  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";

  const { data: searchedData, isLoading: searchLoading } =
    useSearchContentQuery({ search: searchQuery, page: currentPage });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchTerm)}&page=1`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      navigate(
        `/explore?search=${encodeURIComponent(searchQuery)}&page=${newPage}`
      );
    }
  };

  const handleNextPage = () => {
    if (currentPage < (searchedData?.totalPages || 1)) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      navigate(
        `/explore?search=${encodeURIComponent(searchQuery)}&page=${newPage}`
      );
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}&page=${page}`);
  };

  const handlePreviousSet = () => {
    if (currentSet > 0) {
      const newSet = currentSet - 1;
      setCurrentSet(newSet);
      setCurrentPage(newSet * 5 + 1);
      navigate(
        `/explore?search=${encodeURIComponent(searchQuery)}&page=${
          newSet * 5 + 1
        }`
      );
    }
  };

  const handleNextSet = () => {
    if ((currentSet + 1) * 5 < (searchedData?.totalPages || 0)) {
      const newSet = currentSet + 1;
      setCurrentSet(newSet);
      setCurrentPage(newSet * 5 + 1);
      navigate(
        `/explore?search=${encodeURIComponent(searchQuery)}&page=${
          newSet * 5 + 1
        }`
      );
    }
  };

  const renderPaginationItems = () => {
    if (!searchedData?.totalPages) return null;

    const start = currentSet * 5;
    const end = Math.min(start + 5, searchedData.totalPages);

    return Array.from({ length: end - start }, (_, index) => (
      <PaginationItem key={index + start}>
        <PaginationLink onClick={() => handlePageClick(index + start + 1)}>
          {index + start + 1}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  return (
    <>
      <MetaData
        title={
          searchTerm
            ? `${searchTerm} - coder interview`
            : `Explore - coder interview`
        }
        description="Join our innovative platform where you can give interviews and solve coding problems simultaneously. Enhance your skills with real-time coding challenges and comprehensive interview practice. Prepare for your dream job with our AI-powered educational resources and expert guidance."
        keywords="interview platform, coding interview, real-time coding, coding challenges, interview practice, AI-powered education, job preparation, educational resources"
      />
      <Navbar />
      <div className="flex flex-col-reverse  min-h-screen w-full mt-14">
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
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
          <div className="flex items-center justify-center h-fit">
            {searchLoading && (
              <>
                <LoadingIcon /> <p className="m-2">{"loading Questions.."}</p>
              </>
            )}
          </div>
          <ExpandableCardStandard data={searchedData?.results} />
          {searchedData?.results?.length < 1 && <NotFound />}
          <div>
            {!searchLoading && (
              <>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={handlePreviousPage} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink onClick={handlePreviousSet}>
                        <PaginationEllipsis />
                      </PaginationLink>
                    </PaginationItem>
                    {renderPaginationItems()}
                    {searchedData?.totalPages}
                    <PaginationItem>
                      <PaginationLink onClick={handleNextSet}>
                        <PaginationEllipsis />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={handleNextPage} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </div>
        </main>
        <aside className="w-full border-b bg-background p-6 sm:p-8 md:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Your Interviews</h2>
            <div className="mt-4 space-y-4">
              <ExpandableCardGrid />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
