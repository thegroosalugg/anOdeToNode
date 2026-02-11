import { useEffect, useState } from "react";
import { eventBus } from "../util/eventBus";

export const STORAGE_KEY = "dark-theme";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(STORAGE_KEY) !== null);

  // Apply theme to DOM
  useEffect(() => {
    if (isDark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }, [isDark]);

  // Listen for toggle events
  useEffect(() => {
    const handleToggle = () => {
      setIsDark(prev => {
        const newValue = !prev;
        if (newValue) localStorage.setItem(STORAGE_KEY, "1");
        else          localStorage.removeItem(STORAGE_KEY);
        return newValue;
      });
    };

    const unsubscribe = eventBus.on("theme", handleToggle);
    return unsubscribe;
  }, []);
};
