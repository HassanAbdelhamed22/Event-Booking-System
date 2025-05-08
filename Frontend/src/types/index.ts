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
