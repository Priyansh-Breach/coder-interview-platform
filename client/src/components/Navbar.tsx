import { ProfileComponent } from "./ProfileComponent";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FeedbackForm } from "./Feedback";
import { BrainCircuit } from "lucide-react";
import { Badge } from "./ui/badge";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ height: "80px", padding: "0 2rem" }}
      
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 w-full z-50 bg-opacity-0 transition-all duration-300`}
    >
      <motion.div
        initial={{ maxWidth: "100%" }}
        animate={{ maxWidth: scrolled ? "70%" : "100%" }}
        transition={{ duration: 0.3 }}
        className={`mx-auto mt-4 backdrop-blur-lg backdrop-filter px-4 sm:px-6 rounded-xl ${
          scrolled ? "shadow-lg dark:border" : ""
        } bg-opacity-50 flex items-center justify-between h-full`}
      >
        {/* Logo */}
        <motion.div
          transition={{ duration: 0.3 }}
          className=" flex gap-2 items-center justify-center"
        >
          <BrainCircuit className="h-6 w-6" />
          <Badge className="font-light "  variant="secondary">Beta access</Badge>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex flex-row gap-4 text-lg font-medium items-center md:text-sm md:gap-5 lg:gap-6">
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="flex space-x-4">
              <FeedbackForm />
              <ProfileComponent />
            </div>
          </div>
        </nav>
      </motion.div>
    </motion.nav>
  );
};
