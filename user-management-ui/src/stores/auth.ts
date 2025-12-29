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
      const res = (await api.post("/auth/login", { username, password })) as {
        data: LoginResponse;
      };
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", this.token!);
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    logout() {
      // update local login history: set logout_time for last open session for this user
      try {
        const userId = this.user?.user_id as number | undefined;
        const raw = localStorage.getItem("login_history_local");
        const baseRaw = raw ? JSON.parse(raw) : null;
        const arr = Array.isArray(baseRaw) ? baseRaw : [];
        if (userId !== undefined && arr.length) {
          const idx = arr.findIndex((r: any) => r.user_id === userId && !r.logout_time);
          if (idx !== -1) {
            arr[idx].logout_time = new Date().toISOString();
            localStorage.setItem("login_history_local", JSON.stringify(arr));
            window.dispatchEvent(
              new CustomEvent("login-history-updated", {
                detail: { action: "logout", entry: arr[idx] },
              })
            );
          }
        }
      } catch (e) {
        // ignore
      }

      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
