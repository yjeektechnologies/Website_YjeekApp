import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface AdminAuthContextValue {
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  fetchWithAuth: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  token: null,
  email: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
  fetchWithAuth: async () => new Response(),
});

const TOKEN_KEY = "yjeek_admin_token";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    if (token) {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "x-admin-token": token },
      }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setEmail(null);
  }, [token]);

  const fetchWithAuth = useCallback(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set("x-admin-token", token);
    }
    const res = await fetch(input, { ...init, headers });
    if (res.status === 401) {
      await logout();
    }
    return res;
  }, [token, logout]);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      // Validate token is still alive
      fetch("/api/admin/me", {
        headers: { "x-admin-token": stored },
      })
        .then((r) => {
          if (r.ok) return r.json();
          throw new Error("Invalid");
        })
        .then((d) => {
          setToken(stored);
          setEmail(d.email);
        })
        .catch(() => localStorage.removeItem(TOKEN_KEY))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (emailInput: string, password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Login failed");
    }
    const { token: t } = await res.json();
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setEmail(emailInput);
  };

  return (
    <AdminAuthContext.Provider value={{ token, email, login, logout, isLoading, fetchWithAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
