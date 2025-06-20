import { BASE_URL } from "../constant";
import api from "./api";

export const createEvent = async (eventData: any) => {
  const { data, status } = await api.post(
    `${BASE_URL}admin/events`,
    eventData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return { data, status };
};

export const updateEvent = async (id: string, eventData: any) => {
  // Prepare payload
  const { category, ...rest } = eventData;
  const payload = {
    ...rest,
    start_time: eventData.start_time.slice(0, 5),
    end_time: eventData.end_time.slice(0, 5),
    ticket_price: Number(eventData.ticket_price),
  };

  try {
    const { data, status } = await api.put(
      `${BASE_URL}admin/events/${id}`,
      payload
    );
    return { data, status };
  } catch (error) {
    if (error instanceof Error && (error as any).response?.data) {
      console.error("Update error:", (error as any).response.data);
    } else {
      console.error("Update error:", error);
    }
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  const { data, status } = await api.delete(`${BASE_URL}admin/events/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data, status };
};

export const getEventsWithRevenue = async () => {
  const { data, status } = await api.get(
    `${BASE_URL}admin/events-with-revenue`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return { data, status };
};

export const createCategory = async (categoryData: any) => {
  const { data, status } = await api.post(
    `${BASE_URL}admin/categories`,
    categoryData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return { data, status };
};

export const updateCategory = async (id: string, formData: FormData) => {
  try {
    const { data, status } = await api.post(
      `${BASE_URL}admin/categories/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { data, status };
  } catch (error) {
    console.error("Update category error:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  const { data, status } = await api.delete(
    `${BASE_URL}admin/categories/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return { data, status };
};
