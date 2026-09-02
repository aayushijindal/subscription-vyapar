import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { User, Tenant, AuthData } from "@/services/api/types";
import { AuthContext } from "@/context/authHelpers";
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = useCallback((authData: AuthData) => {
    localStorage.setItem("access_token", authData.access);
    localStorage.setItem("refresh_token", authData.refresh);
    if (authData.user) {
      localStorage.setItem("auth_user", JSON.stringify(authData.user));
      if (authData.user.company) {
        localStorage.setItem("active_company_id", authData.user.company.toString());
      }
      if (authData.user.financial_year) {
        localStorage.setItem("active_fy_id", authData.user.financial_year.toString());
      }
    }
    setAccessToken(authData.access);
    setUser(authData.user);
    setTenant(authData.tenant || null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    setAccessToken(null);
    setUser(null);
    setTenant(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const storedUser = localStorage.getItem("auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to restore user state", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    // Run refreshUser in a microtask to avoid synchronously calling setState inside effect
    Promise.resolve().then(() => refreshUser());

    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, [refreshUser, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

