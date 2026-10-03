import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AUTH_KEY } from '../api/client.js';

const AuthContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored);

  const login = useCallback((data) => {
    const value = { token: data.token, role: data.role, fullName: data.fullName };
    localStorage.setItem(AUTH_KEY, JSON.stringify(value));
    setAuth(value);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  }, []);

  const updateName = useCallback((fullName) => {
    setAuth((prev) => {
      if (!prev) return prev;
      const next = { ...prev, fullName };
      localStorage.setItem(AUTH_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user: auth, role: auth?.role, isAuthenticated: Boolean(auth?.token), login, logout, updateName }),
    [auth, login, logout, updateName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}