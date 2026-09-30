import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const INACTIVITY_LIMIT = 24 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Store full user object
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // Login
  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Start inactivity timer
    localStorage.setItem("lastActivity", Date.now().toString());

    setToken(newToken);
    setUser(newUser);
  };

  // Update user without re-login
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");

    setToken(null);
    setUser(null);
  };

  // Inactivity timeout
  useEffect(() => {
    // Don't track activity when user is logged out
    if (!token) return;

    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActivity = Number(localStorage.getItem("lastActivity"));

      if (!lastActivity) {
        updateActivity();
        return;
      }

      const inactiveTime = Date.now() - lastActivity;

      if (inactiveTime >= INACTIVITY_LIMIT) {
        logout();
      }
    };

    // User activity events
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Check inactivity every second
    const interval = setInterval(checkInactivity, 1000);

    // Check immediately when app starts
    checkInactivity();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });

      clearInterval(interval);
    };
  }, [token]);

  const isAuthenticated = !!token;

  // User can offer rides if vehicle details exist
  const canOfferRide = !!user?.vehicleDetails;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        canOfferRide,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
