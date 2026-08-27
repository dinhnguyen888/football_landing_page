import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("fco_theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    // Default to light mode
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
    localStorage.setItem("fco_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Reusable animated Icon-Only Theme Toggle Button Component
export const ThemeToggleButton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border shadow-sm cursor-pointer select-none hover:scale-110 active:scale-95 ${
        isDark
          ? "bg-slate-900/90 text-amber-300 border-amber-400/40 hover:border-amber-300 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
          : "bg-white/95 text-slate-800 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_0_15px_rgba(0,229,117,0.3)]"
      } ${className}`}
      title={isDark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <i className="fa-solid fa-moon text-amber-300 text-sm sm:text-base"></i>
      ) : (
        <i className="fa-solid fa-sun text-amber-500 text-sm sm:text-base"></i>
      )}
    </button>
  );
};
