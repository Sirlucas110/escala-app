import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  csrftoken: string | null;

  initCSRF: () => Promise<string>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  csrftoken: null,

  // 🔐 Garante CSRF token (cacheado)
  initCSRF: async () => {
    const token = get().csrftoken;
    if (token) return token;

    const response = await fetch(
      "http://localhost:8000/api/escala/auth/set-csrf-token",
      {
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get CSRF token");
    }

    const data: { csrftoken: string } = await response.json();
    set({ csrftoken: data.csrftoken });
    return data.csrftoken;
  },

  // 🔑 Login
  login: async (email, password) => {
    const csrftoken = await get().initCSRF();

    const response = await fetch(
      "http://localhost:8000/api/escala/auth/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!response.ok) {
      set({ user: null, isAuthenticated: false });
      return false;
    }

    const data: { success: boolean } = await response.json();

    if (data.success) {
      await get().fetchUser();
      return true;
    }

    set({ user: null, isAuthenticated: false });
    return false;
  },

  // 🚪 Logout
  logout: async () => {
    const csrftoken = await get().initCSRF();

    await fetch("http://localhost:8000/api/escala/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrftoken,
      },
    });

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  // 👤 Usuário logado (fonte da verdade = backend)
  fetchUser: async () => {
    const csrftoken = await get().initCSRF();

    const response = await fetch("http://localhost:8000/api/escala/auth/user", {
      credentials: "include",
      headers: {
        "X-CSRFToken": csrftoken,
      },
    });

    if (!response.ok) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    const data: User = await response.json();

    set({
      user: data,
      isAuthenticated: true,
    });
  },
}));
