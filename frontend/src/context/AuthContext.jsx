 import {
  createContext,
  useContext,
  useMemo,
    useEffect,
  useState,
} from "react";

import {
  clearAuthData,
  getStoredUser,
  getToken,
  saveAuthData,
    getCurrentUser,

} from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());


  useEffect(() => {
  const loadCurrentUser = async () => {
    const currentToken = getToken();

    if (!currentToken) {
      return;
    }

    try {
      const response =
        await getCurrentUser();

      const currentUser =
        response?.data;

      if (currentUser) {
        setUser(currentUser);

        localStorage.setItem(
          "kaviospix_user",
          JSON.stringify(currentUser)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );
    }
  };

  loadCurrentUser();
}, []);
  const login = (newToken, newUser) => {
    saveAuthData(newToken, newUser);

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearAuthData();

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),

      login,
      logout,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}