import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // Hook to navigate to other pages
  const [user, setUser] = useState(null); // State to store the user data
  const [loading, setLoading] = useState(true); // To show a loading state while fetching data

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://192.168.49.160:3000/user/basic", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); // Set user data if token is valid
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("token"); // Remove invalid token
          navigate("/login"); // Redirect to login page
        } else {
          console.error("Error fetching user data", error);
        }
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchUserData();
  }, [navigate]); // Dependency on `navigate` to handle the redirection

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
