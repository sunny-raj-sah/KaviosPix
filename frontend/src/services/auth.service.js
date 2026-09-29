const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import api  from "./api";
export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

export const getCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};

export const saveAuthData = (token, user) => {
  localStorage.setItem("kaviospix_token", token);
  localStorage.setItem(
    "kaviospix_user",
    JSON.stringify(user)
  );
};

export const getToken = () => {
  return localStorage.getItem("kaviospix_token");
};

export const getStoredUser = () => {
  const user = localStorage.getItem("kaviospix_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("kaviospix_token");
  localStorage.removeItem("kaviospix_user");
};