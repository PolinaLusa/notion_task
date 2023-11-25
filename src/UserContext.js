import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("app-user");

    const user = JSON.parse(userString);

    if (!user) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${user.id}`);
        if (response.ok) {
          const userData = await response.json();
          if (userData) {
            setLoggedInUser(userData);
            setLoggedIn(true);
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUserLogin = (user) => {
    setLoggedInUser(user);
    setLoggedIn(true);

    localStorage.setItem("app-user", JSON.stringify(user));
  };

  const handleUserSignOut = () => {
    setLoggedInUser(null);
    setLoggedIn(false);
  };

  const contextValue = {
    loggedIn,
    loggedInUser,
    handleUserLogin,
    handleUserSignOut,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
