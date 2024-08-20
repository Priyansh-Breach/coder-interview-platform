import React, { ChangeEvent, useEffect, useState } from "react";
import TextToSpeech from "@/components/textToSpeech";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuestionContextMutation } from "@/redux/features/Interview/interview";
import { useParams, useNavigate } from "react-router-dom";
import { useTestairesponseMutation } from "@/redux/features/Interview/interview";
import { Volume2Icon } from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/Aceternity/placeholders-and-vanish-input";
import { useAppSelector } from "@/redux/store";
import { socket } from "../socket";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoadingIndicator from "@/components/aiLoadinfComponent";

const intervieweeStatements = [
  "I'll use a hash map for quick lookups.",
  "Is the input array sorted?",
  "I'll try a two-pointer approach.",
  "I'll start with the base case.",
  "Can I explain my approach first?",
  "Dynamic programming might work here.",
  "Should I prioritize time or space?",
  "I'll handle the edge cases now.",
  "I'll use depth-first search here.",
  "Want a quick dry run of the code?",
];

const InterviewQuestionContextPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [userCurrentApproach, setUserCurrentApproach] = useState("");
  const { id } = useParams<{ id: string }>();
  const code = useAppSelector((state: any) => state.editor.code);
  const language = useAppSelector((state: any) => state.editor.language);
  const response = useSelector((state: any) => state.aiResponse.response);
  const streamLoading = useSelector((state: any) => state.aiResponse.loading);
  const error = useSelector((state: any) => state.aiResponse.error);
  // const [questionContext, { isLoading, isSuccess, isError, error, data }] =
  //   useQuestionContextMutation();
  const [
    testAiResponse,
    {
      isLoading: testLoading,
      isSuccess: testSuccess,
      error: testError,
      data: testData,
    },
  ] = useTestairesponseMutation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserCurrentApproach(e.target.value);
  };
  console.log(streamLoading);

  async function onSubmit(e: any) {
    e.preventDefault();
    try {
      await testAiResponse({
        userCurrentApproach: userCurrentApproach,
        userCode: code,
        questionId: id,
        language: language,
      });
    } catch (error: any) {
      console.log(testError);
    }
  }

  useEffect(() => {
    if (id) {
      socket.emit("startQuestionContextGeneration", {
        questionId: id,
      });
    } else {
      navigate("/not-found");
    }
  }, [id, navigate]);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full self-center">
      <Card className=" rounded-lg max-w-3xl w-full text-start bg-[none] break-words self-center shadow-none border-none overflow-hidden ">
        <div className="p-4 pl-1 rounded-t-lg  shadow-sm">
          <TextToSpeech text={response || error} />
        </div>

        <CardContent className="p-4">
          {true ? (
            <>
              <LoadingIndicator />
            </>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <p className=" whitespace-pre-wrap break-words">{response}</p>
          )}
        </CardContent>

        <CardFooter className=" p-2 rounded-b-lg break-words">
          <CardDescription className=" text-sm">
            &copy; {currentYear} coderinterview
          </CardDescription>
        </CardFooter>
      </Card>

      <div className="bottom-0 fixed left-0 w-full z-[900] ">
        <PlaceholdersAndVanishInput
          placeholders={intervieweeStatements}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default InterviewQuestionContextPage;
