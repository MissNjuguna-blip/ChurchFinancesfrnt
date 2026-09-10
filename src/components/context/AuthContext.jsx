import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  // Get token from localStorage when application starts
  const [token, setToken] = useState(
    () => localStorage.getItem("access_token") || ""
  );

  // Get user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;

    } catch (error) {
      console.error(
        "Could not load user:",
        error
      );

      return null;
    }
  });


  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------

  const Logout = useCallback(() => {

    console.log("Logging out...");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);

    navigate("/login", {
      replace: true,
    });

  }, [navigate]);


  // -----------------------------------------
  // CHECK TOKEN
  // -----------------------------------------

  useEffect(() => {

    if (!token) {
      return;
    }

    try {

      const decodedToken = jwtDecode(token);

      const isExpired =
        decodedToken.exp * 1000 < Date.now();

      if (isExpired) {

        console.log(
          "Access token has expired."
        );

        Logout();

      }

    } catch (error) {

      console.error(
        "Invalid JWT token:",
        error
      );

      Logout();

    }

  }, [token, Logout]);


  // -----------------------------------------
  // SAVE TOKEN WHEN IT CHANGES
  // -----------------------------------------

  useEffect(() => {

    if (token) {

      localStorage.setItem(
        "access_token",
        token
      );

    }

  }, [token]);


  // -----------------------------------------
  // SAVE USER WHEN IT CHANGES
  // -----------------------------------------

  useEffect(() => {

    if (user) {

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

    }

  }, [user]);


  // -----------------------------------------
  // PROVIDER
  // -----------------------------------------

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,

        user,
        setUser,

        Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};