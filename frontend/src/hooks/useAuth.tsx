import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { loginAdmin } from "../api/tickets";
import { setAuthCredentials, clearAuthCredentials } from "../api/client";

interface AuthContextValue {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    await loginAdmin(username, password);
    setAuthCredentials(username, password);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    clearAuthCredentials();
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
