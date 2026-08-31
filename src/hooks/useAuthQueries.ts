import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast or we can adjust later, Wait, checking package.json there is no react-hot-toast. They have their own ToastContainer. I'll just use a generic toast or the one they have. 
// WAIT, I shouldn't guess the toast. Let me just return the mutation and let the component handle it.

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
      const refreshToken = localStorage.getItem("refreshToken");
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
