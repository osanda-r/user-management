<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <v-card class="pa-6">
          <v-card-title class="text-h6">Login</v-card-title>

          <v-text-field label="Email" v-model="email" autocomplete="email" />
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            autocomplete="current-password"
          />

          <v-alert v-if="error" type="error" dense class="mb-2">{{ error }}</v-alert>

          <v-btn block color="primary" @click="login"> Login </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import usersData from "@/data/users.json";
import loginsData from "@/data/login_history.json";
import bcrypt from "bcryptjs";

interface AppUser {
  user_id: string | number;
  full_name: string;
  role: string;
  email: string;
  [key: string]: unknown;
}

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const auth = useAuthStore();

function login() {
  error.value = "";
  const user = (usersData as any[]).find(
    (u) => (u.email || "").toLowerCase() === (email.value || "").toLowerCase()
  );
  if (!user) {
    error.value = "Invalid email or password.";
    return;
  }
  if (user.status && user.status !== "Active") {
    error.value = "Account is not active. Contact administrator.";
    return;
  }
  try {
    const stored = user.password || "";
    const isBcryptHash = typeof stored === "string" && /^\$2[aby]\$/.test(stored);
    let match = false;
    if (isBcryptHash) {
      match = bcrypt.compareSync(password.value, stored);
    } else {
      match = password.value === stored;
    }

    if (!match) {
      error.value = "Invalid email or password.";
      return;
    }
  } catch (e) {
    console.error(e);
    error.value = "Unable to verify credentials.";
    return;
  }

  const token = `local-${user.user_id}-${Date.now()}`;
  const appUser = {
    user_id: user.user_id,
    full_name: user.full_name || `${user.first_name || ""} ${user.last_name || ""}`,
    role: user.role || "User",
    email: user.email,
  };

  auth.token = token;
  auth.user = appUser as AppUser;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(appUser));

  // Record login in local login history and notify listeners
  try {
    const base = Array.isArray(loginsData) ? loginsData : [];
    const local = JSON.parse(localStorage.getItem("login_history_local") || "null");
    const merged = (local && Array.isArray(local) ? local : [...base]).slice();
    const nextId = merged.length ? Math.max(...merged.map((r: any) => r.login_id)) + 1 : 1;
    const newEntry = {
      login_id: nextId,
      user_id: user.user_id,
      login_time: new Date().toISOString(),
      logout_time: null,
      ip_address: "127.0.0.1",
      device_info: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };
    merged.unshift(newEntry);
    localStorage.setItem("login_history_local", JSON.stringify(merged));
    window.dispatchEvent(
      new CustomEvent("login-history-updated", { detail: { action: "login", entry: newEntry } })
    );
  } catch (e) {
    console.warn("Unable to update local login history", e);
  }

  // clear password field
  password.value = "";

  router.push("/dashboard");
}
</script>
