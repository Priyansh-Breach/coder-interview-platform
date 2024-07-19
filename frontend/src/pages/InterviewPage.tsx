import React, { useEffect, useState } from "react";
import socket from "../socket";
import QuestionScreen from "../components/QuestionScreen";
import CodingArea from "../components/CodingArea";
import AIAnimation from "../components/AIAnimation";
import MicrophoneButton from "../components/MicrophoneButton";

const InterviewPage: React.FC = () => {
    const [question, setQuestion] = useState("");
    const [aiResponse, setAiResponse] = useState("");

    useEffect(() => {
        socket.on("question", (data: string) => {
            setQuestion(data);
        });

        socket.on("aiResponse", (data: string) => {
            setAiResponse(data);
        });

        return () => {
            socket.off("question");
            socket.off("aiResponse");
        };
    }, []);

    return (
        <div>
            <QuestionScreen question={question} />
            <CodingArea />
            <MicrophoneButton />
            {aiResponse && <AIAnimation />}
        </div>
    );
};

export default InterviewPage;
