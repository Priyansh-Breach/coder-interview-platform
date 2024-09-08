import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/Aceternity/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import ModernInterviewFeedback, {
  FeedbackFields,
  HiredWithFeedback,
  ProfileCard,
  ScoreCard,
} from "@/components/interviewFeedbackCard";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const links = [
  {
    label: "Dashboard",
    href: "#",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Profile",
    href: "#",
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Settings",
    href: "#",
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];
export default function SidebarDemo() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div
        className={cn(
          "flex pt-24 flex-col md:flex-row bg-background w-full mx-auto  overflow-auto",
          "min-h-screen"
        )}
      >
        <Dashboard />
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <div className="font-normal h-fit flex space-x-2 items-center text-sm text-black py-1  z-20">
      <MessageCircle className="dark:text-white " />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium h-fit text-black dark:text-white whitespace-pre"
      >
        Chat with Interviewer
      </motion.span>
    </div>
  );
};

const CardsOnTop = [
  {
    card: ProfileCard,
  },
  {
    card: ScoreCard,
  },
  {
    card: FeedbackFields,
  },
  {
    card: HiredWithFeedback,
  },
];

// Dummy dashboard component with content
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-1">
      <div className="p-2 md:pt-3 md:p-10  bg-background flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-4">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between h-full rounded-2xl  gap-10 border ">
              <div>
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <div>chat with Interviewer</div>
                  ))}
                </div>
              </div>
              {open && <Logo />}
            </SidebarBody>
          </Sidebar>
          <div className="w-full">
            <div className="flex gap-2 container w-full justify-end p-0">
              {CardsOnTop.map((Cards: any, index: any) => (
                <div key={"first-array" + index} className="h-fit  rounded-lg">
                  {<Cards.card />}
                </div>
              ))}
            </div>
            <div className="container  h-screen mt-4 bg-muted rounded-2xl p-4">
              Chat with reviews and feedback
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
