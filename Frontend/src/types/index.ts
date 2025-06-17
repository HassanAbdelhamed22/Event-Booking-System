export interface UserData {
  token: string;
  name: string;
  role: "admin" | "user";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  token: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    password_confirmation: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  password_confirmation: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  venue_name: string;
  ticket_price: number;
  createdBy: string;
  createdAt: string;
  location: string;
  start_time: string;
  end_time: string;
  organizer: string;
  bookings_count: number;
  category: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id?: string;
  name: string;
  image: string;
}

// Add this to your types file
export interface EventFormValues {
  id?: string | null;
  name: string;
  description: string;
  date: string;
  venue_name: string;
  ticket_price: number;
  location: string;
  start_time: string;
  end_time: string;
  organizer: string;
  category_id: string;
}

export interface AdminBooking {
  id: number;
  user_id: number;
  event_id: number;
  number_of_tickets: number;
  total_price: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
    ticket_price: string;
  };
}
