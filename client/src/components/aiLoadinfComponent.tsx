import React from "react";
import { motion } from "framer-motion";

const LoadingIndicator: React.FC = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "start" }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`relative h-5 mb-2 rounded overflow-hidden l ${
            index === 2 ? "w-72" : "w-full"
          }`} // Adjust width for the third bar
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/20 to-transparent bg-[length:300%_100%] rounded"
            initial={{ width: 0 }}
            animate={{
              width: ["0%", "100%"], // Expand width from 0% to 100%
              x: ["-100%", "100%"], // Gradient movement
            }}
            transition={{
              width: {
                duration: 1,
                ease: "easeOut",
                delay: index * 0.5, // Delay only for horizontal expansion
              },
              x: {
                duration: 1,
                ease: "linear",
                repeat: Infinity, // Infinite repeat for gradient movement
              },
            }}
          />
          <div className="relative z-10 w-full h-full rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingIndicator;
