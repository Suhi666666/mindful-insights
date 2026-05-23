import { useEffect, useState, useCallback } from "react";

const KEY = "theme-pref-v1";

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(KEY);
    const isDark = v === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((d) => {
      const nd = !d;
      localStorage.setItem(KEY, nd ? "dark" : "light");
      document.documentElement.classList.toggle("dark", nd);
      return nd;
    });
  }, []);

  return { dark, toggle };
}
