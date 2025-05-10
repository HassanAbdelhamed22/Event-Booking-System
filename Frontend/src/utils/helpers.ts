import type { UserData } from "../types";

export const saveUserData = (data: UserData): void => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("name", data.name);
  localStorage.setItem("role", data.role);
};

export const removeUserData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("tokenExpiry");
};

export const formatTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};