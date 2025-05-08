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