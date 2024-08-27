import React, { ChangeEvent, useEffect, useState } from "react";
import TextToSpeech from "@/components/textToSpeech";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useTestairesponseMutation } from "@/redux/features/Interview/interview";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import LoadingIndicator from "@/components/aiLoadinfComponent";
import { userMessage } from "@/redux/features/Interview/editorSlice";
import { PlaceholdersAndVanishInput } from "@/components/ui/Aceternity/placeholders-and-vanish-input";
import { setConversation } from "@/redux/features/Interview/conversationSlice";
import ChatComponent from "@/components/chat";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userCurrentApproach, setUserCurrentApproach] = useState("");
  const { id } = useParams<{ id: string }>();
  const code = useSelector((state: any) => state.editor.code);
  const language = useSelector((state: any) => state.editor.language);
  const response = useSelector((state: any) => state.aiResponse.response);
  const streamLoading = useSelector((state: any) => state.aiResponse.loading);
  const error = useSelector((state: any) => state.aiResponse.error);

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

  async function onSubmit(e: any) {
    e.preventDefault();

    try {
      dispatch(userMessage(userCurrentApproach));
      dispatch(
        setConversation({
          sender: "user",
          response: userCurrentApproach,
          code: code,
          language: language,
        })
      );

      socket.emit("startConversationResponseGeneration", {
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
      console.log("Called Emit");
      socket.emit("startQuestionContextGeneration", {
        questionId: id,
      });
    } else {
      navigate("/not-found");
    }
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex flex-col w-full self-center p-5">
      <div className="flex justify-center" >
        <ChatComponent />
      </div>
      <div className="bottom-6 fixed h-fit left-0 w-full z-[900] ">
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
