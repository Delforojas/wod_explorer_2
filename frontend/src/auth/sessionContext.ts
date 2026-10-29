import { createContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
