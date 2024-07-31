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
import MonacoEditor from "@/components/CodeEditor";
import NavbarCodeEditor from "@/components/NavbarCodeEditor";
import { useParams } from "react-router-dom";
import { useGetQuestionQuery } from "@/redux/features/Interview/interview";
import { useDispatch } from "react-redux";
import { setQuestionData } from "@/redux/features/Interview/editorSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolutionScreen } from "@/components/solutionScreen";

const InterviewPage: React.FC = () => {
  const [aiResponse, setAiResponse] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const {
    data: question,
    isError,
    isLoading,
    error,
  } = useGetQuestionQuery(id!, {
    skip: !id,
  });

  useEffect(() => {
    if (question) {
      dispatch(setQuestionData(question));
    }
  }, [question, dispatch]);

  if (!id) {
    return <div>Invalid question ID</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      <MetaData
        title={
          question?.data
            ? `${question?.data?.title}- coder interview`
            : "Interview & Coding Platform"
        }
        description="Join our innovative platform where you can give interviews and solve coding problems simultaneously. Enhance your skills with real-time coding challenges and comprehensive interview practice. Prepare for your dream job with our AI-powered educational resources and expert guidance."
        keywords="interview platform, coding interview, real-time coding, coding challenges, interview practice, AI-powered education, job preparation, educational resources, Dronacharya.co"
      />
      <div>
        <NavbarCodeEditor />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen max-w-screen rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex items-center justify-center p-6">
            <Tabs defaultValue="question" className="w-full">
              <TabsList>
                <TabsTrigger value="question">Question</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
              </TabsList>
              <TabsContent value="question">
                <QuestionScreen />
              </TabsContent>
              <TabsContent value="solution">
                <SolutionScreen />
              </TabsContent>
            </Tabs>
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
