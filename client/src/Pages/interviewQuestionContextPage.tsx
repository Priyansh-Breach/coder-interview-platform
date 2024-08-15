import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DuolingoButton from "@/components/ui/Animata/duolingo";
import { useQuestionContextMutation } from "@/redux/features/Interview/interview";
import { useParams, useNavigate } from "react-router-dom";

const InterviewQuestionContextPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [questionContext, { isLoading, isSuccess, isError, error, data }] =
    useQuestionContextMutation();

  useEffect(() => {
    if (id) {
      questionContext({ questionId: id });
    } else {
      console.error("No question ID found in the URL.");
      navigate("/not-found");
    }
  }, [id, questionContext, navigate]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Card className="border rounded-lg max-w-xl text-start">
        <CardHeader>
          <CardTitle>
            <p>Let's understand what the question says.</p>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p>Loading question context...</p>
          ) : isError ? (
            <p> {error?.data?.message}</p>
          ) : (
            <p>
              {data?.message ||
                "This is an open-source AI chatbot app template built with Next.js, the Vercel AI SDK, and Vercel KV. It uses React Server Components to combine text with generative UI as output of the LLM. The UI state is synced through the SDK so the model is aware of your interactions as they happen."}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <CardDescription>&copy; {currentYear} coderinterview</CardDescription>
        </CardFooter>
      </Card>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a className="border-none cursor-pointer w-full  py-3 px-4 rounded-lg">
          <DuolingoButton
            title="understood"
            handleSubmit={() => {}}
            isLoading={isLoading}
          />
        </a>
        <a className="border-none cursor-pointer w-full py-3 px-4 rounded-lg">
          <DuolingoButton
            title="Explain again"
            handleSubmit={() => {}}
            isLoading={isLoading}
          />
        </a>
      </div>
    </div>
  );
};

export default InterviewQuestionContextPage;
