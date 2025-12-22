import { defineStore } from "pinia";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token"),
    user: null as any,
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.role,
  },

  actions: {
    async login(username: string, password: string) {
      const res = await api.post("/auth/login", { username, password });
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", this.token!);
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.clear();
    },
  },
});
