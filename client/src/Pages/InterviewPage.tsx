import React, { useEffect, useState } from "react";
import socket from "../socket"; // Import the socket instance
import SpeechToText from "../components/SpeechToText"; // Ensure this import is correct
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";


import QuestionScreen from "@/components/QuestionScreen";

import { MetaData } from "@/lib/MetaData/metaData";
import { ModeToggle } from "@/components/mode-toggle";
import MonacoEditor from "@/components/CodeEditor";

const InterviewPage: React.FC = () => {
    const [aiResponse, setAiResponse] = useState<string>("");

    useEffect(() => {
        socket.on("aiResponse", (response: string) => {
            setAiResponse(response);
        });

        return () => {
            socket.off("aiResponse");
        };
    }, []);

    return (
        <div>
            <MetaData
                title="Interview & Coding Platform"
                description="Join our innovative platform where you can give interviews and solve coding problems simultaneously. Enhance your skills with real-time coding challenges and comprehensive interview practice. Prepare for your dream job with our AI-powered educational resources and expert guidance."
                keywords="interview platform, coding interview, real-time coding, coding challenges, interview practice, AI-powered education, job preparation, educational resources, Dronacharya.co"
            />
            <div>
                Test NavBar
                <ModeToggle />
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-screen max-w-screen rounded-lg border"
            >

                <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                        <QuestionScreen question={"Questions will appear here."} />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-4">
                        <MonacoEditor />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default InterviewPage;