import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { signIn, signOut as firebaseSignOut, onAuthChange } from "@/lib/firebase-auth";

const OWNER_EMAIL = "owner@cablehq.com";
const OWNER_PASSWORD = "SecurePass123!";

interface OwnerAuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const OwnerAuthContext = createContext<OwnerAuthContextValue | undefined>(undefined);

export const OwnerAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user && user.email === OWNER_EMAIL) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedEmail !== OWNER_EMAIL || normalizedPassword !== OWNER_PASSWORD) {
      return false;
    }

    try {
      await signIn(normalizedEmail, normalizedPassword);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Owner login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      loading,
    }),
    [isAuthenticated, login, logout, loading],
  );

  return <OwnerAuthContext.Provider value={value}>{children}</OwnerAuthContext.Provider>;
};

export const useOwnerAuth = () => {
  const context = useContext(OwnerAuthContext);

  if (!context) {
    throw new Error("useOwnerAuth must be used within an OwnerAuthProvider");
  }

  return context;
};
