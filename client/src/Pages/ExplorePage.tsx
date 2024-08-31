import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Bell, BrainCircuit, Play } from "lucide-react";
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
import { LoadingIcon } from "@/components/ui/Icons/SelectMore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileComponent } from "@/components/ProfileComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

      <div className="flex flex-col min-h-screen bg-background ">
        <header className="flex items-center h-14 px-4 border-b shrink-0 md:px-6">
          <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
            <BrainCircuit className="h-6 w-6" />
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ProfileComponent />
          </div>
        </header>
        <div className="flex-1 flex p-4 ">
          <div className="w-3/4 p-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-green-500 cursor-pointer text-white hover:text-green-500"
                  onClick={() =>
                    navigate(
                      `/explore?search=${encodeURIComponent("easy")}&page=1`
                    )
                  }
                >
                  Easy
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-yellow-500 cursor-pointer text-white hover:text-yellow-500"
                  onClick={() =>
                    navigate(
                      `/explore?search=${encodeURIComponent("Medium")}&page=1`
                    )
                  }
                >
                  Medium
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-red-500 cursor-pointer text-white hover:text-red-500"
                  onClick={() =>
                    navigate(
                      `/explore?search=${encodeURIComponent("hard")}&page=1`
                    )
                  }
                >
                  Hard
                </Badge>
              </div>
              <div className="w-fit mx-4">
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleChange}
                  onSubmit={onSubmit}
                />
              </div>
            </div>

            <ExpandableCardStandard data={searchedData?.results} />
            <div className="flex items-center justify-center h-fit">
              {searchLoading && (
                <>
                  <LoadingIcon /> <p className="m-2">{"loading questions.."}</p>
                </>
              )}
            </div>
            {searchedData?.results?.length < 1 && <NotFound />}
            <div className="flex items-center justify-center h-fit">
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
          </div>
          <div className="w-1/4 p-6 border-l">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Introduction to Algorithms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted"></div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <div className="font-semibold">5 Chapters</div>
                    <div className="text-sm text-muted-foreground">
                      128 Items
                    </div>
                  </div>
                  <Button size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={33} className="mb-2" />
                <div className="flex justify-between text-sm">
                  <span>Easy</span>
                  <span>Medium</span>
                  <span>Hard</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
