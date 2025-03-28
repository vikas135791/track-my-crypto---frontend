import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface StoredUser {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let users: StoredUser[] = [];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const signup = async (email: string, password: string) => {
    if (users.find(u => u.email === email)) {
      setError("User already exists");
      throw new Error("User already exists");
    }
    const newUser: StoredUser = { id: (users.length + 1).toString(), email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("user", JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role }));
    setUser({ id: newUser.id, email: newUser.email, role: newUser.role });
    setError(null);
  };

  const login = async (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      setError("Invalid credentials");
      throw new Error("Invalid credentials");
    }
    localStorage.setItem("user", JSON.stringify({ id: foundUser.id, email: foundUser.email, role: foundUser.role }));
    setUser({ id: foundUser.id, email: foundUser.email, role: foundUser.role });
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
    window.dispatchEvent(new Event("storage"));
  };

  return (
      <AuthContext.Provider value={{ user, login, signup, logout, error }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };