import { BASE_URL } from "../constant";
import api from "./api";

export const getTotalBookings = async () => {
  const { data, status } = await api.get(`${BASE_URL}admin/bookings/total`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
}

export const getBookings = async () => {
  const { data, status } = await api.get(`${BASE_URL}admin/bookings`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
}