import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { User, Tenant, AuthData } from "@/services/api/types";
import { authApi } from "@/services/api/auth";
import { AuthContext } from "@/context/authHelpers";
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = useCallback((authData: AuthData) => {
    localStorage.setItem("accessToken", authData.access);
    localStorage.setItem("refreshToken", authData.refresh);
    setAccessToken(authData.access);
    setUser(authData.user);
    setTenant(authData.tenant);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setUser(null);
    setTenant(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      if (response.success && response.data) {
        setUser(response.data.user);
        setTenant(response.data.tenant);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user state", error);
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

