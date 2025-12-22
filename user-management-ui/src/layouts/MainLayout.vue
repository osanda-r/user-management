<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar color="primary" dark>
      <v-app-bar-title>User Management</v-app-bar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer permanent>
      <v-list nav>
        <v-list-item to="/dashboard" title="Dashboard" prepend-icon="mdi-view-dashboard" />
        <v-list-item to="/users" title="Users" prepend-icon="mdi-account" />
        <v-list-item to="/roles" title="Roles" prepend-icon="mdi-shield-account" />
        <v-list-item to="/departments" title="Departments" prepend-icon="mdi-office-building" />
        <v-list-item to="/review-requests" title="Review Requests" prepend-icon="mdi-check-decagram" />
        <v-list-item to="/audit-log" title="Audit Log" prepend-icon="mdi-history" />
        <v-list-item to="/activity-log" title="Activity Log" prepend-icon="mdi-chart-line" />
      </v-list>
    </v-navigation-drawer>

    <!-- Page Content -->
    <v-main class="pa-6">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const logout = () => auth.logout()
</script>
