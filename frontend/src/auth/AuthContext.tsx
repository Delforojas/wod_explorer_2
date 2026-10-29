import { useEffect, useState, type ReactNode } from "react";
import {
  clearAuthSession,
  expireAuthSession,
  hasStoredAuthToken,
  readAuthSession,
  setAuthToken,
  subscribeAuthSession,
  type AuthSession,
} from "./authSession";
import { AuthContext, type AuthContextValue } from "./sessionContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(readAuthSession);

  useEffect(() => {
    const unsubscribe = subscribeAuthSession(setSession);

    if (hasStoredAuthToken() && !readAuthSession()) {
      expireAuthSession();
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    const remainingTime = session.expiresAt - Date.now();

    if (remainingTime <= 0) {
      expireAuthSession();
      return;
    }

    const timeoutId = window.setTimeout(expireAuthSession, remainingTime);

    return () => window.clearTimeout(timeoutId);
  }, [session]);

  const contextValue: AuthContextValue = {
    isAuthenticated: session !== null,
    username: session?.username ?? null,
    signIn: (token) => {
      setAuthToken(token);
    },
    signOut: () => {
      clearAuthSession();
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
