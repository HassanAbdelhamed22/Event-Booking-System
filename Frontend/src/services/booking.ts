import { BASE_URL } from "../constant";
import api from "./api";

export const getUserBookings = async () => {
  try {
    const response = await api.get(`${BASE_URL}user/bookings`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("getUserBookings raw response:", response); // Debug log
    return response.data; // Ensure this returns { data: [{ event_id, ... }, ...] }
  } catch (error) {
    console.error("getUserBookings error:", error);
    throw error;
  }
};

export const checkUserBookedEvent = async (eventId: string) => {
  const { data, status } = await api.get(
    `${BASE_URL}events/${eventId}/bookings/check`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return { data, status };
};

export const createBooking = async (
  eventId: string,
  numberOfTickets: number
) => {
  const { data, status } = await api.post(
    `${BASE_URL}events/${eventId}/bookings`,
    { number_of_tickets: numberOfTickets },
    { headers: { "Content-Type": "application/json" } }
  );
  return { data, status };
};
