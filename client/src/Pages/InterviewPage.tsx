import React, { useEffect, useState } from "react";
import SpeechToText from "../components/SpeechToText"; // Ensure this import is correct
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import QuestionScreen from "@/components/QuestionScreen";
import { MetaData } from "@/lib/MetaData/metaData";
import MonacoEditor from "@/components/CodeEditor";
import { useParams } from "react-router-dom";
import {
  useCompleteInterviewMutation,
  useGetQuestionQuery,
  useLeaveInterviewMutation,
} from "@/redux/features/Interview/interview";
import {
  setInterviewTime,
  setQuestionData,
  updateSendCode,
} from "@/redux/features/Interview/editorSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolutionScreen } from "@/components/solutionScreen";
import { InterviewQuestionContextPage } from "@/Routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  ChevronsDown,
  ChevronsRight,
  ChevronsUp,
  SquareArrowOutUpRight,
} from "lucide-react";
import { LoadingIcon, TableOfContents } from "@/components/ui/Icons/SelectMore";
import { FloatingDock } from "@/components/ui/Aceternity/floating-dock";
import { IconTerminal2 } from "@tabler/icons-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/Aceternity/animated-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  setQuestionPanel,
  setConsolePanel,
  setChatPanel,
} from "@/redux/features/Interview/panelSlice";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import TimerComponent from "@/components/NavbarCodeEditor";
import SwipeButton from "@/components/ui/Animata/swipeButton";
import { deleteLocalStorageKey } from "@/lib/Utils/deleteLocalStorageKey";
import {
  setAssistantId,
  setInterviewId,
  setThreadId,
  setquestionId,
} from "@/redux/features/Interview/conversationSlice.tsx";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket";

const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const chatPanelState = useAppSelector(
    (state) => state.panel.chatPanelVisible
  );
  const questionPanelState = useAppSelector(
    (state) => state.panel.questionPanelVisible
  );
  const consolePanelState = useAppSelector(
    (state) => state.panel.consolePanelVisible
  );

  const remainingTimeSecondsForInterview =
    useAppSelector((state: any) => state.editor.interviewTimeLeft) || 0;
  const visiblePanels = [questionPanelState, chatPanelState].filter(
    Boolean
  ).length;
  const {
    data: question,
    isError,
    isLoading,
    error,
  } = useGetQuestionQuery(id!, {
    skip: !id,
  });
  const [
    leaveInterview,
    { isLoading: leaveInterviewLoading, isSuccess: leaveInterviewIsSuccess },
  ] = useLeaveInterviewMutation();
  const [
    completeInterview,
    {
      isLoading: completeInterviewLoading,
      isSuccess: completeInterviewIsSuccess,
    },
  ] = useCompleteInterviewMutation();

  const handleLeaveInterview = async () => {
    deleteLocalStorageKey("persist:panel");
    await leaveInterview({
      questionId: id,
    });
  };

  const handleCompleteInterview = async () => {
    deleteLocalStorageKey("persist:panel");
    //complete interview api
    await completeInterview({
      id: id,
      interviewId: question?.MongoInterviewId,
    });
  };

  useEffect(() => {
    if (question) {
      dispatch(setInterviewId(question?.MongoInterviewId));
      dispatch(setQuestionData(question));
      dispatch(setInterviewTime(question?.timeLeftForInterview));
      dispatch(setAssistantId(question?.assistantId));
      dispatch(setThreadId(question?.threadId));
      dispatch(setquestionId(id));
    }
  }, [question]);

  useEffect(() => {
    if (leaveInterviewIsSuccess) {
      navigate("/explore");
    }
    if (completeInterviewIsSuccess) {
      navigate(`/interview-feedback/${question?.MongoInterviewId}`);
    }
  }, [leaveInterviewIsSuccess, completeInterviewIsSuccess]);

  if (!id) {
    return <div>Invalid question ID</div>;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex gap-2 items-center justify-center">
        <LoadingIcon />
        <p>{"Loading..."}</p>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.data?.message}</div>;
  }

  const links = [
    !questionPanelState && {
      title: "Unhide Question",
      icon: <TableOfContents />,
      href: "#",
      handleClick: () => {
        dispatch(setQuestionPanel(!questionPanelState));
      },
    },
    !chatPanelState && {
      title: "Unhide Chat",
      icon: <Brain />,
      href: "#",
      handleClick: () => {
        dispatch(setChatPanel(!chatPanelState));
      },
    },
    !consolePanelState && {
      title: "UnhideTerminal",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      handleClick: () => {
        dispatch(setConsolePanel(!consolePanelState));
      },
    },
  ].filter(Boolean);

  // const handleLoadOlderMessages = () => {
  //   // If at the top and not already loading more messages

  //   socket.emit("loadMoreMessages", {
  //     threadId: threadId,
  //     cursor: 0, //conversation?.[0]?.id,
  //   }); // Send request with the cursor
  // };

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
      <div className="flex h-screen justify-start  w-screen select-none">
        <div className="absolute z-[1000] left-52 top-2">
          <TimerComponent />
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50} className="relative">
            <ResizablePanelGroup direction="vertical" className="h-full">
              {questionPanelState && (
                <ResizablePanel
                  defaultSize={visiblePanels === 1 ? 100 : 50}
                  className="relative"
                >
                  {visiblePanels > 1 && (
                    <button
                      onClick={() => {
                        dispatch(setQuestionPanel(false));
                      }}
                      className="absolute top-5 right-2 z-10 p-2 rounded"
                    >
                      <ChevronsUp className="h-6 w-6" />
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
              {questionPanelState && chatPanelState && <ResizableHandle />}
              {chatPanelState && (
                <ResizablePanel
                  defaultSize={visiblePanels === 1 ? 100 : 50}
                  className="relative"
                >
                  {visiblePanels > 1 && (
                    <button
                      onClick={() => {
                        dispatch(setChatPanel(false));
                      }}
                      className="absolute top-2 right-2  z-10 p-2 rounded"
                    >
                      <ChevronsDown className="h-6 w-6" />
                    </button>
                  )}
                  <ScrollArea
                    onScrollTop={() => {}}
                    className="h-full w-full rounded-md border"
                  >
                    <div className="flex item-center justify-center w-full p-2 pt-8">
                      <InterviewQuestionContextPage />
                    </div>
                  </ScrollArea>
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {(questionPanelState || chatPanelState) && consolePanelState && (
            <ResizableHandle />
          )}

          {consolePanelState && (
            <ResizablePanel defaultSize={50} className="relative">
              <button
                onClick={() => {
                  dispatch(setConsolePanel(false));
                  dispatch(updateSendCode(false));
                }}
                className="absolute top-4 right-5 z-10 p-2 rounded"
              >
                <ChevronsRight className="h-6 w-6" />
              </button>
              <div className="flex h-full items-center justify-center p-4">
                <MonacoEditor />
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
        {links?.length > 0 && (
          <div className="bottom-56 fixed p-r-4 right-[-10px] hover:right-0 transition-all duration-300 ease-in-out w-fit z-[800]">
            <FloatingDock
              desktopClassName="translate-y-10"
              mobileClassName="translate-y-10"
              items={links}
            />
          </div>
        )}
        {remainingTimeSecondsForInterview && (
          <>
            <div className="bottom-28 fixed  right-[-10px] hover:right-0 transition-all duration-300 ease-in-out w-fit z-[800]">
              <div className="  flex items-center justify-center">
                <Modal>
                  <ModalTrigger className=" rounded-l-xl shadow-md bg-neutral-100 dark:bg-neutral-900 flex justify-center group/modal-btn">
                    <div className="flex items-center  justify-center">
                      <button className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center">
                        <SquareArrowOutUpRight className="h-5 w-5 text-red-500 dark:text-red-300" />
                      </button>
                    </div>
                  </ModalTrigger>
                  <ModalBody>
                    <ModalContent className="p-6 rounded-md shadow-lg">
                      <Card className="bg-[none] border-none">
                        <CardHeader>
                          <div>
                            <h3>
                              Are you sure you want to complete or leave this
                              interview?
                            </h3>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            <p>
                              If you mark the interview as complete, we'll
                              assess it and start the rating process. If you
                              choose to leave, all your progress will be lost,
                              and no rating or review will be provided. This
                              interview cannot be resumed, and you'll need to
                              start a new one.
                            </p>
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </ModalContent>

                    <ModalFooter className="gap-4">
                      <button
                        onClick={handleLeaveInterview}
                        className="text-sm  rounded-md"
                      >
                        <SwipeButton
                          // href="/explore"
                          firstText={`${
                            !leaveInterviewLoading ? "Leave" : "Loading.."
                          }`}
                          secondText={`${
                            !leaveInterviewLoading ? "Leave" : "Loading.."
                          }`}
                          firstClass=" font-light bg-orange-600 text-white "
                          secondClass="font-light bg-orange-600 text-white"
                        />
                      </button>
                      <button
                        onClick={handleCompleteInterview}
                        className="text-sm  rounded-md"
                      >
                        <SwipeButton
                          firstText={`${
                            !completeInterviewLoading ? "Complete" : "Loading.."
                          }`}
                          secondText={`${
                            !completeInterviewLoading ? "Complete" : "Loading.."
                          }`}
                          firstClass=" font-light bg-green-600 text-white "
                          secondClass="font-light bg-green-600 text-white"
                        />
                      </button>
                    </ModalFooter>
                  </ModalBody>
                </Modal>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
