"use client";

import { create } from "zustand";
import type { User } from "./types";
import { api } from "./api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  /* Actions */
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  initialize: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("tirtanexa_token");
    const userStr = localStorage.getItem("tirtanexa_user");
    let user: User | null = null;

    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        user = null;
      }
    }

    set({ token, user, isInitialized: true });

    // Refresh user data from server if we have a token
    if (token) {
      get().fetchMe().catch(() => {
        // Token expired or invalid
        get().logout();
      });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await api.auth.login(email, password);
      const { user, session } = data;
      localStorage.setItem("tirtanexa_token", session.accessToken);
      localStorage.setItem("tirtanexa_user", JSON.stringify(user));
      set({ user, token: session.accessToken, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    try {
      await api.auth.register(email, password, fullName);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("tirtanexa_token");
    localStorage.removeItem("tirtanexa_user");
    set({ user: null, token: null });
    window.location.href = "/login";
  },

  fetchMe: async () => {
    try {
      const user = await api.auth.getMe();
      localStorage.setItem("tirtanexa_user", JSON.stringify(user));
      set({ user });
    } catch {
      get().logout();
    }
  },

  setUser: (user: User) => {
    localStorage.setItem("tirtanexa_user", JSON.stringify(user));
    set({ user });
  },
}));
