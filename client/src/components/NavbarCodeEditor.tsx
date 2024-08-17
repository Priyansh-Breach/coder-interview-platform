// src/components/NavbarCodeEditor.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ClockIcon, CodeIcon } from "lucide-react";
import { ProfileComponent } from "./ProfileComponent";
import DuolingoButton from "./ui/Animata/duolingo";
import { useAppSelector } from "@/redux/store";
// import { useGiveInterviewMutation } from "@/redux/features/Interview/interview";

export default function NavbarCodeEditor() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const code = useAppSelector((state: any) => state.editor.code);
  const language = useAppSelector((state: any) => state.editor.language);

  // const [interview, { isLoading, isSuccess, isError, error, data }] =
  //   useGiveInterviewMutation();

  const formatTime = (time: number): string => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, "0");
    const milliseconds = String(time % 1000).padStart(3, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const startTimer = (): void => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - elapsedTime;
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1);
    }
  };

  const stopTimer = (): void => {
    setIsRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSubmit = (): void => {
    stopTimer();
    console.log("Code submitted");
    // Add your code submission logic here
  };

  async function askAiSubmit() {
    const question = "";
    const userExplanation = "";
    console.log("Pressed");
    console.log("Code:", code);
    console.log("Language:", language);
    if (code === "") {
      console.log("Please provide code"); //Toast
      return;
    }
    // await interview({ question, language, code, userExplanation });
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-background border-b">
      <div className="flex items-center gap-2">
        <a href="#" className="flex items-center gap-2">
          <CodeIcon className="w-6 h-6 text-primary" />
          <span className="text-md font-bold">code editor</span>
        </a>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 text-muted-foreground cursor-pointer"
          onClick={startTimer}
        >
          <ClockIcon className="w-5 h-5" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
       
        <Button onClick={handleSubmit} variant={"ghost"}>
          Submit
        </Button>
      </div>
      <div>
        <ProfileComponent />
      </div>
    </header>
  );
}
