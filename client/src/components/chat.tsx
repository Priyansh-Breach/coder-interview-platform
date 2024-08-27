import { useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/store";
import { Card, CardContent, CardDescription, CardFooter } from "./ui/card";
import TextToSpeech from "./textToSpeech";
import LoadingIndicator from "./aiLoadinfComponent";
import { motion } from "framer-motion";

export default function Component() {
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

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <div className="flex flex-col w-full max-w-3xl h-screen bg-background text-foreground">
      <div>
        {conversation?.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-center"
            } w-full my-2`}
          >
            <Card
              className={`rounded-lg  max-w-3xl w-full text-start bg-[none] break-words self-center shadow-none border-none overflow-hidden ${
                message.sender === "user"
                  ? "bg-muted w-fit mr-10  break-words rounded-xl max-w-lg "
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <p className={`whitespace-pre-wrap break-words`}>
                  {message.response}
                </p>
              </CardContent>

              {message?.sender === "ai" && (
                <CardFooter className="pl-4 flex gap-4 rounded-b-lg break-words">
                  <div className="pt-1">
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

        <div className="flex justify-center ">
          <Card className="rounded-lg max-w-3xl mb-24 w-full text-start bg-[none] break-words self-center shadow-none border-none overflow-hidden">
            <CardContent className="p-4">
              {streamLoading?.loading ? (
                <LoadingIndicator />
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p className="whitespace-pre-wrap break-words">{response}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
