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
import { InterviewQuestionContextPage } from "@/Routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, CodeXml, EyeOff } from "lucide-react";
import { TableOfContents } from "@/components/ui/Icons/SelectMore";
const InterviewPage: React.FC = () => {
  const [aiResponse, setAiResponse] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [showPanel1, setShowPanel1] = useState<boolean>(true);
  const [showPanel2, setShowPanel2] = useState<boolean>(true);
  const [showPanel3, setShowPanel3] = useState<boolean>(true);
  // Calculate the number of visible panels
  const visiblePanels = [showPanel1, showPanel2].filter(Boolean).length;
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
      <div className="flex h-screen w-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50} className="relative">
            <ResizablePanelGroup direction="vertical" className="h-full">
              {showPanel1 && (
                <ResizablePanel
                  defaultSize={visiblePanels === 1 ? 100 : 50}
                  className="relative"
                >
                  {visiblePanels > 1 && (
                    <button
                      onClick={() => setShowPanel1(false)}
                      className="absolute top-1 left-1 z-10 p-2 rounded"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  )}
                  <ScrollArea className="h-full w-full rounded-md border">
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
                  </ScrollArea>
                </ResizablePanel>
              )}
              {showPanel1 && showPanel2 && <ResizableHandle withHandle />}
              {showPanel2 && (
                <ResizablePanel
                  defaultSize={visiblePanels === 1 ? 100 : 50}
                  className="relative"
                >
                  {visiblePanels > 1 && (
                    <button
                      onClick={() => setShowPanel2(false)}
                      className="absolute top-2 left-1 z-10    p-2 rounded"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  )}
                  <ScrollArea className="h-full w-full rounded-md border">
                    <div className="flex item-center justify-center w-full p-2 pt-8">
                      <InterviewQuestionContextPage />
                    </div>
                  </ScrollArea>
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {(showPanel1 || showPanel2) && showPanel3 && (
            <ResizableHandle withHandle />
          )}

          {showPanel3 && (
            <ResizablePanel defaultSize={50} className="relative">
              <button
                onClick={() => setShowPanel3(false)}
                className="absolute top-5 right-5 z-10  p-2 rounded"
              >
                <EyeOff className="h-4 w-4" />
              </button>
              <div className="flex h-full items-center justify-center p-4">
                <MonacoEditor />
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>

        {!showPanel1 && (
          <button
            onClick={() => setShowPanel1(true)}
            className="absolute bottom-2 left-5 z-[1000] p-2 rounded-full bg-green-500"
          >
            <TableOfContents />
          </button>
        )}
        {!showPanel2 && (
          <button
            onClick={() => setShowPanel2(true)}
            className="absolute bottom-2 left-5 z-[1000]  p-2 rounded-full bg-green-500"
          >
            <Brain />
          </button>
        )}
        {!showPanel3 && (
          <button
            onClick={() => setShowPanel3(true)}
            className="absolute bottom-2 left-16 z-[1000] p-2 rounded-full bg-green-500"
          >
            <CodeXml />
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
