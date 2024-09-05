import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useGetInterviewHistoryMutation } from "@/redux/features/Interview/interview";
import { LoadingIcon } from "./ui/Icons/SelectMore";
import { useParams, useNavigate } from "react-router-dom";

export const InterviewHistory = () => {
  const { pageNo } = useParams<{ pageNo?: string }>();
  const navigate = useNavigate();
  const [limit, setLimit] = useState<number>(6);
  const [page, setPage] = useState<number>(Number(pageNo) || 1);

  const [getInterviewHistory, { isLoading, isError, data, error }] =
    useGetInterviewHistoryMutation();

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        await getInterviewHistory({ pageNo: page, limit });
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchInterviewHistory();
  }, [getInterviewHistory, page, limit]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLimit = Number(e.target.value);
    setLimit(selectedLimit);
    setPage(1);
    // navigate(`/interviews/1`);
  };
  console.log(error);
  return (
    <div className="py-8">
      {isLoading && (
        <div className="flex items-center">
          <LoadingIcon />
          <p className="m-2">Checking for past interview sessions...</p>
        </div>
      )}

      {data?.pastInterviews?.interviews?.length > 0 && (
        <>
          <div className="flex items-center gap-4">
            <p className="text-neutral-700 m-4 mx-0 dark:text-neutral-300 text-sm md:text-base max-w-sm">
              Your Interview History
            </p>

            <div>
              <select
                id="limit"
                value={limit}
                onChange={handleLimitChange}
                className="p-1 cursor-pointer border bg-background rounded-md"
              >
                <option className="hover:bg-green-500" value={6}>6</option>
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2  gap-3 ">
            {data?.pastInterviews?.interviews?.map((interview: any) => (
              <Card
                key={interview._id}
                className="bg-muted dark:bg-card w-full max-w-md h-48 mx-auto overflow-hidden"
              >
                <CardHeader className="py-2">
                  <CardTitle className="text-neutral-700 m-2 mx-0 dark:text-neutral-300 text-sm md:text-base truncate">
                    {interview.questionName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="z-10 flex w-full min-w-fit flex-col gap-2 rounded-md bg-muted p-4 border">
                    <div
                      className="flex w-full items-center gap-2"
                      key={interview._id}
                    >
                      <strong className="text-xs font-mono md:flex-shrink-0 md:text-sm">
                        Score {interview.totalScore}
                      </strong>

                      <span className="ml-auto inline-block flex-shrink-0 text-xs opacity-75">
                        {interview.name}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="m-0 py-0 flex gap-6 truncate">
                  <Badge
                    variant={
                      interview.status === "active"
                        ? "default"
                        : interview.status === "Scheduled"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-neutral-700 m-4 mx-0 dark:text-neutral-300 text-xsm"
                  >
                    {interview.status}
                  </Badge>
                  {interview.difficulty}
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {isError && (
        <p className="text-neutral-700 border p-4 rounded-md m-4 mx-0 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          {error?.data?.message}
        </p>
      )}

      {data?.pastInterviews?.interviews?.length < 1 && (
        <p className="text-neutral-700 border p-4 rounded-md m-4 mx-0 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          No Past Interviews!
        </p>
      )}
    </div>
  );
};
