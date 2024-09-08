"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoadingIcon } from "../Icons/SelectMore";
import { useNavigate } from "react-router-dom";
let interval: any;

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
    <div className="relative flex overflow-hidden grid grid-cols-2 gap-2 pb-6 px-2">
      {cards.map((card: any, index: any) => {
        return (
          <motion.div
            key={card.id}
            className=" bg-muted h-32 cursor-pointer  rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  flex flex-col justify-between"
            onClick={() => navigate(`/interview-feedback/${card?.session?.interviewId}`)}
          >
            <div className="font-normal flex text-neutral-700 dark:text-neutral-200">
              <p>Interview feedback is in progress..</p>
              <div className="h-4 w-4 mx-2">
                <LoadingIcon />
              </div>
            </div>
            <div>
              <p className="text-neutral-500 font-medium dark:text-white">
                {card.name}
              </p>
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
