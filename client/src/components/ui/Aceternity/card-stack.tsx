"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const [cards, setCards] = useState<Card[]>(items);
  const navigate = useNavigate();
  return (
    <div className="relative flex overflow-hidden grid grid-cols-2 gap-2 pb-6 dark:px-0 px-2">
      {cards.map((card: any, index: any) => {
        return (
          <motion.div
            key={card.id}
            className=" bg-muted h-32 cursor-pointer  rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  flex flex-col justify-between"
            onClick={() =>
              navigate(`/interview-feedback/${card?.session?.interviewId}`)
            }
          >
            <div className="font-normal flex text-neutral-700 dark:text-neutral-200">
              <p>Interview feedback is in progress..</p>
            </div>
            <div>
              <p className="text-neutral-500 font-medium ">{card.name}</p>
              <div className="flex items-center space-x-2">
                <span className="text-green-500 animate-blink font-bold text-sm">
                  In Progress
                </span>
                <svg
                  className="w-2 h-2 text-green-500 animate-blink"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="50" fill="currentColor" />
                </svg>
              </div>
              <p className="text-neutral-400 font-normal dark:text-neutral-200">
                {card.designation}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
