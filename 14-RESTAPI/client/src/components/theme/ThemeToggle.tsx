import { useState, useEffect } from "react";
import css from "./ThemeToggle.module.css";
import { motion } from "motion/react";

const STORAGE_KEY = "dark-theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(STORAGE_KEY) !== null);

  const setTheme = () => {
    if (!isDark) localStorage.setItem(STORAGE_KEY, "1");
    else         localStorage.removeItem(STORAGE_KEY);
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }, [isDark]);

  return (
    <button
      data-theme-toggle
      className={css["theme-toggle"]}
          style={{ justifyContent: "flex-" + (isDark ? "start" : "end") }}
        onClick={setTheme}
    >
      <motion.span layout>
        {isDark ? "🌑" : "☀️"}
      </motion.span>
    </button>
  );
}
