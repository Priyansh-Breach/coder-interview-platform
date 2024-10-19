import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { Card, CardContent, CardDescription, CardFooter } from "./ui/card";
import TextToSpeech from "./textToSpeech";
import LoadingIndicator from "./aiLoadinfComponent";
import CodeEditorLike from "./codeEditorLike";
import { socket } from "@/socket";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/redux/store";
import { setFetchConversationLoading } from "@/redux/features/Interview/conversationSlice";
import { LoadingIcon } from "./ui/Icons/SelectMore";

export default function Component() {
  const dispatch = useAppDispatch();
  const conversation = useAppSelector(
    (state: any) => state.conversation.message
  );
  const response = useAppSelector((state: any) => state.aiResponse.response);

  const streamLoading = useAppSelector(
    (state: any) => state.aiResponse.loading
  );
  const error = useAppSelector((state: any) => state.aiResponse.error);
  const currentYear = new Date().getFullYear();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state: any) => state.auth.user);
  const fetchConversationLoading = useAppSelector(
    (state: any) => state.conversation.fetchConversationLoading
  );
  const threadId = useAppSelector((state: any) => state.conversation.threadId);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  useEffect(() => {
    try {
      if (threadId) {
        dispatch(setFetchConversationLoading(true));
        socket.emit("getConversationFromOpenAi", {
          threadId: threadId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="flex flex-col w-full max-w-3xl h-screen bg-background text-foreground">
      <div>
        {conversation?.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-center"
            } w-full my-2 px-14`}
          >
            <Card
              className={`rounded-lg   max-w-3xl w-full text-start bg-[none] break-words self-center shadow-none border-none overflow-hidden ${
                message.sender === "user"
                  ? "bg-muted w-fit   break-words rounded-xl max-w-lg "
                  : ""
              }`}
            >
              <CardContent className="p-4 text-sm">
                <p className={`whitespace-pre-wrap break-words`}>
                  {message.response}
                </p>
                {message?.sender === "user" && message.code !== "" && (
                  <div className="my-3">
                    <CodeEditorLike
                      code={message?.code}
                      language={message.language}
                    />
                  </div>
                )}
              </CardContent>

              {message?.sender === "ai" && (
                <CardFooter className="pl-4 flex gap-4 rounded-b-lg break-words">
                  <div className="pt-1 text-sm">
                    <TextToSpeech text={message.response || error} />
                  </div>

                  <CardDescription className="text-sm">
                    &copy; {currentYear} coderinterview
                  </CardDescription>
                </CardFooter>
              )}
            </Card>
            <div ref={bottomRef} />
          </div>
        ))}
        <div>
          {fetchConversationLoading && (
            <div className="flex gap-2 h-screen w-full justify-center items-center" >
              <LoadingIcon />
              <p className="text-md">fetching old messages..</p>
            </div>
          )}
        </div>
        <div className="flex justify-center ">
          <Card className="rounded-lg max-w-3xl px-14 mb-24 w-full text-start bg-[none] break-words self-center shadow-none border-none overflow-hidden">
            <CardContent className="p-4">
              {streamLoading?.loading ? (
                <LoadingIndicator />
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p className="whitespace-pre-wrap break-words text-sm">
                  {response}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
