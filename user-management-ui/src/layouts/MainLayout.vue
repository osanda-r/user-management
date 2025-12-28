<template>
  <v-app>
    <Sidebar />

    <v-app-bar app clipped-left color="primary" flat>
      <v-app-bar-title>User Management System</v-app-bar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="pa-6">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const logout = () => auth.logout();
</script>
