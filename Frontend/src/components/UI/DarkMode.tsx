import { useState, useEffect } from "react";
import sun from "../../assets/sun.webp";
import moon from "../../assets/moon.webp";

interface IProps {
  className?: string;
}

const DarkMode = ({ className = "" }: IProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle Dark Mode"
      aria-pressed={darkMode}
      className={`text-xl p-2 rounded-full shadow-md transition-colors duration-300 ml-auto sm:ml-0 border ${
        darkMode
          ? "bg-[#252529] text-gray-200 dark:border-borderDark hover:bg-[#1f1f22]"
          : "bg-[#fafafa] text-gray-800 border-borderLight hover:bg-gray-200"
      } ${className}`}
    >
      {darkMode ? (
        <img
          src={sun}
          alt="sun icon"
          className="transition-transform duration-300 ease-in-out w-6 h-6 "
        />
      ) : (
        <img
          src={moon}
          alt="moon icon"
          className="transition-transform duration-300 ease-in-out w-6 h-6 "
        />
      )}
    </button>
  );
};

export default DarkMode;
