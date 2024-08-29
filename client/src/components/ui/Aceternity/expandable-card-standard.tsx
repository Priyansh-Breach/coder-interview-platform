"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import DuolingoButton from "../Animata/duolingo";
import { useStartInterviewMutation } from "@/redux/features/Interview/interview";
import { useToast } from "@/components/ui/use-toast";
import { Navigate } from "react-router-dom";
import { LoadingIcon } from "../Icons/SelectMore";
import { Button } from "../button";
import { Search } from "lucide-react";

interface Card {
  data: any;
}

const getBadgeColor = (difficulty: any) => {
  switch (difficulty) {
    case "Hard":
      return "text-red-500 ";
    case "Medium":
      return "text-yellow-500 ";
    case "Easy":
      return "text-green-500 ";
    default:
      return "text-gray-500 ";
  }
};

export const Badge = ({ difficulty }: any) => (
  <span
    className={`px-2 py-1 rounded-full text-sm font-semibold tracking-[0.05em] ${getBadgeColor(
      difficulty
    )}`}
  >
    {difficulty}
  </span>
);

export function ExpandableCardStandard({ data }: Card) {
  const [active, setActive] = useState<any[number] | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [startInterview, { isSuccess, isLoading }] =
    useStartInterviewMutation();
  const { toast } = useToast();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleSubmit = async () => {
    try {
      await startInterview({ id: active?.id, time: "45" }).unwrap();
    } catch (err: any) {
      toast({
        title: "Failed to start interview",
        description: `${err?.data?.message}`,
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <image
                  width={200}
                  height={200}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-xl  text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                  </div>
                  {isSuccess && (
                    <Navigate to={`/interview/${active.id}`} replace={true} />
                  )}
                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    onClick={handleSubmit}
                    // href={`/interview/question-context/${active.id}`}
                    target="_blank"
                  >
                    {!isLoading ? (
                      <>
                        <DuolingoButton
                          title="Take Interview"
                          handleSubmit={() => {}}
                          isLoading={false}
                        />
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <LoadingIcon />
                        {"setting up interview.."}
                      </div>
                    )}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4 py-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.content.length > 300
                      ? `${active.content.slice(0, 300)}...`
                      : active.content}
                  </motion.div>
                  <Badge
                    difficulty={active?.difficulty ? active?.difficulty : "NaN"}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <table className="w-full max-w-7xl">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">#</th>
            <th className="text-left py-2">Title</th>
            <th className="text-left py-2">Solution</th>
            <th className="text-left py-2">Acceptance</th>
            <th className="text-left py-2">Difficulty</th>
            <th className="text-left py-2">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((problem: any, index: any) => (
            <tr
              key={problem.id}
              className="border-b "
            
            >
              <td className="py-2">
                {/* <CheckCircle className="text-green-500 h-4 w-4" /> */}
                {index}
              </td>
              <td className="py-2 cursor-pointer hover:text-green-500 hover:underline"   onClick={() => setActive(problem)}>{problem.title}</td>
              <td className="py-2 ">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </td>
              <td className="py-2">{problem.acceptance}</td>
              <td className="py-2">
                <Badge
                  difficulty={problem?.difficulty ? problem?.difficulty : "NaN"}
                />
              </td>
              <td className="py-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
