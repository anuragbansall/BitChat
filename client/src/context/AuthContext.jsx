import { createContext, useEffect, useState } from "react";
import API from "../api/axios.js";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [fetchProfileError, setFetchProfileError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log(user);

  const login = async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    setUser(response.data.data.user);
    setIsAuthenticated(true);
  };

  const register = async (details) => {
    const response = await API.post("/auth/register", details);
    setUser(response.data.data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    setIsAuthenticated(false);
  };

  const getProfile = async () => {
    setIsFetchingProfile(true);
    setFetchProfileError(null);

    try {
      const response = await API.get("/auth/profile");
      setUser(response.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setFetchProfileError(error.response.data.message);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        isFetchingProfile,
        fetchProfileError,
        getProfile,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
