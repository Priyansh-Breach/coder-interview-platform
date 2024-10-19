import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/store";
import { socket } from "../socket";
import { useSelector } from "react-redux";
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
  const user = useSelector((state: any) => state.auth.user);
  const sendCodeState = useSelector((state: any) => state.editor.sendCode);
  const interviewId = useSelector(
    (state: any) => state.conversation.interviewId
  );
  const assistantId = useSelector(
    (state: any) => state.conversation.assistantId
  );
  const threadId = useSelector((state: any) => state.conversation.threadId);
  const conversation = useSelector((state: any) => state.conversation.message);

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
          code: sendCodeState ? code : "",
          language: language,
          interviewId: interviewId,
        })
      );

      socket.emit("startConversationResponseGeneration", {
        userCurrentApproach: userCurrentApproach,
        userCode: sendCodeState ? code : "",
        questionId: id,
        language: language,
        user: user,
      });

     
    } catch (error: any) {
      console.log("testError");
    }
  }

  return (
    <div className="min-h-screen flex flex-col w-full self-center p-5">
      <div className="flex justify-center ">
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
