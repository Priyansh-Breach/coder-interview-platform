import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { ClockIcon } from "lucide-react";
import { useAppSelector } from "@/redux/store";

const TimerComponent: React.FC = () => {
  const remainingTimeSeconds =
    useAppSelector((state: any) => state.editor.interviewTimeLeft) || 0;
  
  // Convert seconds to milliseconds for initial state
  const [remainingTime, setRemainingTime] = useState<number>(
    remainingTimeSeconds * 1000
  );
  const intervalRef = useRef<number | null>(null);

  const formatTime = (time: number): string => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, "0");
    return `${minutes}:${seconds} minutes left`;
  };

  const startTimer = (): void => {
    if (intervalRef.current !== null) return; // Prevent multiple intervals

    intervalRef.current = window.setInterval(() => {
      setRemainingTime((prevTime) => {
        const newRemainingTime = Math.max(prevTime - 1000, 0); // Decrease by 1 second (1000 ms)
        if (newRemainingTime === 0) {
          clearInterval(intervalRef.current!);
        }
        return newRemainingTime;
      });
    }, 1000);
  };

  const stopTimer = (): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Update the timer when remainingTimeSeconds changes
  useEffect(() => {
    setRemainingTime(remainingTimeSeconds * 1000);
  }, [remainingTimeSeconds]);

  // Start the timer once and clean up
  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, []);

  return (
    <Draggable>
      <div className="flex items-center gap-2 cursor-all-scroll  border bg-muted p-2 rounded-lg mt-4 shadow-md">
        <ClockIcon className="w-4 h-4" />
        <span>{formatTime(remainingTime)}</span>
      </div>
    </Draggable>
  );
};

export default TimerComponent;
