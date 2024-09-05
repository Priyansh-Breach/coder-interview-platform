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
import { ScrollArea } from "@/components/ui/scroll-area";

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
                <option className="hover:bg-green-500" value={6}>
                  6
                </option>
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <ScrollArea className="h-[50em] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.pastInterviews.interviews.map((interview: any) => (
                <Card
                  key={interview._id}
                  className="w-full bg-muted dark:bg-card"
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base truncate">
                      {interview.questionName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex w-full items-center justify-between gap-2 rounded-md bg-background p-2 border">
                      <strong className="text-xs font-mono md:text-sm">
                        Score {interview.totalScore}
                      </strong>
                      <span className="text-xs opacity-75">
                        {interview.name}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex items-center justify-between">
                    <Badge
                      variant={
                        interview.status === "active"
                          ? "default"
                          : interview.status === "Scheduled"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {interview.status}
                    </Badge>
                    <span className="text-xs">{interview.difficulty}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
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
