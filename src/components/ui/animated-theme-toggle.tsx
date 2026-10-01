import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { motion } from "framer-motion";

export const AnimatedThemeToggle = ({ className }: { className?: string }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vjays_theme");
      if (stored) return stored;
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  const isDark = theme === "dark";

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("vjays_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("vjays_theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-9 h-9 p-0 rounded-xl border border-brand-border dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#1C1C1C] hover:text-brand-orange dark:hover:text-[#FB714B] shadow-xs cursor-pointer flex items-center justify-center transition-colors active:scale-95",
        className
      )}
      variant="outline"
      size="icon"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <SolarSwitch isDark={isDark} />
    </Button>
  );
};

const SolarSwitch = ({ isDark }: { isDark: boolean }) => {
  const duration = 0.5;

  const sunVariants = {
    checked: {
      scale: 0,
      opacity: 0,
      pathLength: 0,
      transition: { duration, ease: [0.25, 1, 0.5, 1] },
    },
    unchecked: {
      scale: 1,
      opacity: 1,
      pathLength: 1,
      transition: { duration, ease: [0.25, 1, 0.5, 1] },
    },
  };

  const moonVariants = {
    checked: {
      scale: 1,
      opacity: 1,
      pathLength: 1,
      transition: { duration, ease: [0.25, 1, 0.5, 1] },
    },
    unchecked: {
      scale: 0,
      opacity: 0,
      pathLength: 0,
      transition: { duration, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <motion.div
      initial={false}
      animate={isDark ? "checked" : "unchecked"}
      className="flex items-center justify-center w-5 h-5 pointer-events-none"
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        animate={{ rotate: isDark ? 90 : 0 }}
        transition={{ duration, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Sun Center Circle */}
        <motion.path
          d="M12.4058 17.7625C15.1672 17.7625 17.4058 15.5239 17.4058 12.7625C17.4058 10.0011 15.1672 7.76251 12.4058 7.76251C9.64434 7.76251 7.40576 10.0011 7.40576 12.7625C7.40576 15.5239 9.64434 17.7625 12.4058 17.7625Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 1 (Top) */}
        <motion.path
          d="M12.4058 1.76251V3.76251"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 2 (Bottom) */}
        <motion.path
          d="M12.4058 21.7625V23.7625"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 3 (Top-Left) */}
        <motion.path
          d="M4.62598 4.98248L6.04598 6.40248"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 4 (Bottom-Right) */}
        <motion.path
          d="M18.7656 19.1225L20.1856 20.5425"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 5 (Left) */}
        <motion.path
          d="M1.40576 12.7625H3.40576"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 6 (Right) */}
        <motion.path
          d="M21.4058 12.7625H23.4058"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 7 (Bottom-Left) */}
        <motion.path
          d="M4.62598 20.5425L6.04598 19.1225"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Sun Ray 8 (Top-Right) */}
        <motion.path
          d="M18.7656 6.40248L20.1856 4.98248"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={sunVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />

        {/* Crescent Moon */}
        <motion.path
          d="M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={moonVariants}
          style={{ originX: "12.5px", originY: "12.5px" }}
        />
      </motion.svg>
    </motion.div>
  );
};
