import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* =========================
   Tipos
========================= */

export interface User {
  id: number;
  email: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  setCsrfToken: () => Promise<string>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

/* =========================
   Store
========================= */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // 🔐 Garante que o cookie CSRF exista
      setCsrfToken: async (): Promise<string> => {
        const response = await fetch(
          "http://localhost:8000/api/escala/auth/set-csrf-token",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to set CSRF token");
        }

        const data: { csrftoken: string } = await response.json();
        return data.csrftoken;
      },

      // 🔑 Login
      login: async (email: string, password: string): Promise<boolean> => {
        const csrftoken = await get().setCsrfToken();

        const response = await fetch("http://localhost:8000/api/escala/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ email, password }),
        });

        const data: { success: boolean } = await response.json();

        if (data.success) {
          set({ isAuthenticated: true });
          await get().fetchUser();
          return true;
        }

        set({
          user: null,
          isAuthenticated: false,
        });

        return false;
      },

      // 🚪 Logout
      logout: async (): Promise<void> => {
        const csrftoken = await get().setCsrfToken();

        const response = await fetch("http://localhost:8000/api/escala/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          },
        });

        if (response.ok) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      // 👤 Usuário logado
      fetchUser: async (): Promise<void> => {
        try {
          const csrftoken = await get().setCsrfToken();

          const response = await fetch("http://localhost:8000/api/escala/auth/user", {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
          });

          if (!response.ok) {
            throw new Error("Not authenticated");
          }

          const data: User = await response.json();

          set({
            user: data,
            isAuthenticated: true,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const getCSRFToken = (): string => {
  const name = "csrftoken";
  let cookieValue: string | null = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  if (!cookieValue) {
    throw new Error("Missing CSRF cookie.");
  }

  return cookieValue;
};

