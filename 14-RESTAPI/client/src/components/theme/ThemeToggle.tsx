import { motion } from "motion/react";
import { eventBus } from "@/lib/util/eventBus";
import React, { useState } from "react";
import { STORAGE_KEY } from "@/lib/hooks/useTheme";
import css from "./ThemeToggle.module.css";

export default function ThemeToggle({ style }: { style?: React.CSSProperties }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(STORAGE_KEY) !== null);

  const toggleTheme = () => {
    setIsDark(!isDark);
    eventBus.emit("theme");
  }

  return (
    <button
      data-theme-toggle
      className={css["theme-toggle"]}
          style={{ justifyContent: "flex-" + (isDark ? "start" : "end"), ...style }}
        onClick={toggleTheme}
    >
      <motion.span layout>
        {isDark ? "🌑" : "☀️"}
      </motion.span>
    </button>
  );
}
