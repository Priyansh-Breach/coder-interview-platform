import { useEffect, useState } from "react";
import { useCallback, useRef } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import SwipeButton from "./swipeButton";
import { useNavigate } from "react-router-dom";
import TimerComponent from "@/components/NavbarCodeEditor";
import { useAppSelector } from "@/redux/store";

export function useMousePosition(
  ref: React.RefObject<HTMLElement>,
  callback?: ({ x, y }: { x: number; y: number }) => void
) {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback?.({ x: clientX - left, y: clientY - top });
    };

    const handleTouchMove = (event: TouchEvent) => {
      const { clientX, clientY } = event.touches[0];
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback?.({ x: clientX - left, y: clientY - top });
    };

    ref.current?.addEventListener("mousemove", handleMouseMove);
    ref.current?.addEventListener("touchmove", handleTouchMove);

    const nodeRef = ref.current;
    return () => {
      nodeRef?.removeEventListener("mousemove", handleMouseMove);
      nodeRef?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref, callback]);
}

export default function GithubCardShiny({
  className,
  data,
}: {
  className?: string;
  data?: any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!overlayRef.current) {
      return;
    }

    const { width, height } = overlayRef.current?.getBoundingClientRect() ?? {};
    const xOffset = x - width / 2;
    const yOffset = y - height / 2;

    overlayRef.current?.style.setProperty("--x", `${xOffset}px`);
    overlayRef.current?.style.setProperty("--y", `${yOffset}px`);
  }, []);

  useMousePosition(containerRef, update);
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
    return `${minutes}:${seconds} min`;
  };

  const startTimer = (): void => {
    if (intervalRef.current !== null) return;

    intervalRef.current = window.setInterval(() => {
      setRemainingTime((prevTime) => {
        const newRemainingTime = Math.max(prevTime - 1000, 0);
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
    <>
      <div
        ref={containerRef}
        className={cn(
          "group  relative w-96 cursor-pointer min-w-fit max-w-full overflow-hidden rounded-md border border-border bg-zinc-700 p-6 text-zinc-200 shadow-lg",
          className
        )}
        onClick={() => navigate(`/interview/${data?.interview?.questionId}`)}
      >
        <div
          ref={overlayRef}
          // Adjust height & width as required
          className="-z-1 absolute h-64 w-64 rounded-full bg-white opacity-0 bg-blend-soft-light blur-3xl transition-opacity group-hover:opacity-20"
          style={{
            transform: "translate(var(--x), var(--y))",
          }}
        />

        <div className="font-mono text-sm">
          {data?.interview?.questionName}
          <div className="text-xs text-zinc-400"> {data?.interview?.slug}</div>
        </div>

        <div className="z-10 mt-10 flex w-full min-w-fit flex-col gap-2 rounded-md bg-zinc-600 p-4 shadow-2xl">
          {[
            {
              title: "Status",
              time: "Active",
              Icon: CheckCircle2,
            },
            {
              title: "Time left",
              time: formatTime(remainingTime),
              Icon: Clock ,
            },
          ].map((step) => {
            return (
              <div className="flex w-full items-center gap-2" key={step.title}>
                <step.Icon className="h-3 w-3" />
                <strong className="text-xs font-mono md:flex-shrink-0 md:text-sm">
                  {step.title}
                </strong>

                <span className="ml-auto inline-block flex-shrink-0 text-xs opacity-75">
                  {step?.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
