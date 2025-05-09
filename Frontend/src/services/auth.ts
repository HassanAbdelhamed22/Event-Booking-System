import axios from "axios";
import { BASE_URL } from "../constant";
import api from "./api";
import type { LoginCredentials, RegisterCredentials } from "../types";

export const login = async (credentials: LoginCredentials) => {
  const { data, status } = await axios.post(`${BASE_URL}login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const register = async (credentials: RegisterCredentials) => {
  const { data, status } = await axios.post(
    `${BASE_URL}register`,
    credentials,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return { data, status };
};

export const signOut = async () => {
  const { data, status } = await api.post(`${BASE_URL}logout`, null, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const getCurrentUser = async () => {
  const { data, status } = await api.get(`${BASE_URL}user`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};
