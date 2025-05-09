import axios from "axios";
import { BASE_URL } from "../constant";

export const getEvents = async () => {
  const { data, status } = await axios.get(`${BASE_URL}events`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const getEvent = async (id: string) => {
  const { data, status } = await axios.get(`${BASE_URL}events/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const searchEvent = async (query: string) => {
  const { data, status } = await axios.get(`${BASE_URL}events/search`, {
    params: { query },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const filterEventByDate = async (date: string) => {
  const { data, status } = await axios.get(`${BASE_URL}events/filter`, {
    params: { date },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const filterEventByLocation = async (location: string) => {
  const { data, status } = await axios.get(`${BASE_URL}events/filter`, {
    params: { location },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const getCategories = async () => {
  const { data, status } = await axios.get(`${BASE_URL}events/categories`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};
