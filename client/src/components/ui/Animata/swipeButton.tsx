"use client";
import React from "react";

import { cn } from "@/lib/utils";

interface SwipeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  firstText: string;
  secondText: string;
  className?: string;
  firstClass?: string;
  secondClass?: string;
  href?: string;
}

export default function SwipeButton({
  className,
  secondText,
  firstText,
  firstClass = " ",
  secondClass = "",
  href,
  ...props
}: SwipeButtonProps) {
  const common = "block px-4 py-2 cursor-pointer  text-lg font-bold duration-300 ease-in-out";
  return (
    <a
      {...props}
      className={cn(
        "group relative min-w-fit overflow-hidden rounded-xl border flex justify-center items-center",
        className
      )}
      href={href}
    >
      <>
        <span
          className={cn(
            "absolute inset-0 translate-y-full group-hover:translate-y-0",
            common,
            secondClass
          )}
        >
          {secondText}
        </span>
        <span
          className={cn("group-hover:-translate-y-full", common, firstClass)}
        >
          {firstText}
        </span>
      </>
    </a>
  );
}
