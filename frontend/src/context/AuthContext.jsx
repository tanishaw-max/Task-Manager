import { createContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("rbac_user");
        const storedToken = localStorage.getItem("rbac_token");
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          // Validate user object structure
          if (parsedUser.id && parsedUser.role) {
            api.setToken(storedToken);
            setUser(parsedUser);
          } else {
            // Invalid user data, clear storage
            localStorage.removeItem("rbac_user");
            localStorage.removeItem("rbac_token");
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear corrupted data
        localStorage.removeItem("rbac_user");
        localStorage.removeItem("rbac_token");
        setError('Authentication data corrupted');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    try {
      if (!userData || !token) {
        throw new Error('Invalid login data');
      }
      
      if (!userData.id || !userData.role) {
        throw new Error('Invalid user data structure');
      }

      localStorage.setItem("rbac_user", JSON.stringify(userData));
      localStorage.setItem("rbac_token", token);
      api.setToken(token);
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("rbac_user");
      localStorage.removeItem("rbac_token");
      api.setToken(null);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };