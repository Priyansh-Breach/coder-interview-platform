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
  const [streamData, setStreamData] = useState("");
  const navigate = useNavigate();
  const [userCurrentApproach, setUserCurrentApproach] = useState("");
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [questionContext, { isLoading, isSuccess, isError, error, data }] =
    useQuestionContextMutation();
  const [
    testAiResponse,
    {
      isLoading: testLoading,
      isSuccess: testSuccess,
      error: testError,
      data: testData,
    },
  ] = useTestairesponseMutation();
  const code = useAppSelector((state: any) => state.editor.code);
  const language = useAppSelector((state: any) => state.editor.language);
  const response = useSelector((state: any) => state.aiResponse.response);
  if (response) {
    JSON.parse(response);
  }
  console.log(response, "response Page");
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserCurrentApproach(e.target.value);
  };

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
      questionContext({ questionId: id });
      socket.emit("startQuestionContextGeneration", {
        questionId: id,
      });
    } else {
      navigate("/not-found");
    }
  }, [id, questionContext, navigate]);

  useEffect(() => {
    // Handle streaming data from Socket.IO
    socket.on("responseStream", (chunk) => {
      setStreamData((prev) => prev + chunk); // Append received chunk to the streamData
    });

    socket.on("responseComplete", () => {
      console.log("Streaming complete.");
    });

    socket.on("error", (message) => {
      console.error("Error:", message);
    });

    return () => {
      socket.off("responseStream");
      socket.off("responseComplete");
      socket.off("error");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full items-center">
      <Card className="border rounded-lg w-full text-start self-center">
        <div className=" w-fit p-2 rounded mt-2 mx-2">
          <TextToSpeech text={data?.message || error?.data?.message} />
        </div>
        <CardHeader>
          <CardTitle>
            <p>Let's understand what the question says.</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading question context...</p>
          ) : isError ? (
            <p>{error?.data?.message}</p>
          ) : (
            <p>{response.response || "Null"}</p>
          )}
        </CardContent>
        <CardFooter>
          <CardDescription>&copy; {currentYear} coderinterview</CardDescription>
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
