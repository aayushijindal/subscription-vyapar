import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { authApi } from "../services/api";
import { useAuth } from "../context/authHelpers";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.success && response.data) {
        login(response.data);
        navigate("/dashboard");
      } else {
        throw new Error(response.message || "Login failed");
      }
    }
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      if (response.success && response.data) {
        login(response.data);
        navigate("/dashboard");
      } else {
        throw new Error(response.message || "Registration failed");
      }
    }
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refresh_token");
      // Even if API fails, we clear state, but we try the API first
      return authApi.logout(refreshToken || "");
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate("/login");
    }
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};
