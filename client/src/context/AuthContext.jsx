import { createContext, useEffect, useState } from "react";
import API from "../api/axios.js";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [fetchProfileError, setFetchProfileError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allUsers, setAllUsers] = useState([]);


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

  const getAllUsers = async () => {
    try {
      const response = await API.get("/users");
      setAllUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getAllUsers();
    }
  }, [isAuthenticated]);
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
        allUsers,
        setAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
