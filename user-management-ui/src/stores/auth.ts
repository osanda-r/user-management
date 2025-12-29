import { defineStore } from "pinia";
import api from "@/services/api";

interface User {
  role: string;
  [key: string]: unknown;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.role,
  },

  actions: {
    async login(username: string, password: string) {
      const res = await api.post("/auth/login", { username, password }) as { data: LoginResponse };
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", this.token!);
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
