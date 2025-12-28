<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent app width="260" class="app-sidebar">
    <!-- Logo / Brand -->
    <div class="sidebar-brand">
      <div class="logo">LOGO</div>
      <div v-if="!rail">
        <div class="text-h6 font-weight-bold">User Management</div>
        <div class="text-caption text--secondary">Admin Console</div>
      </div>

      <div style="margin-left: auto">
        <v-btn icon variant="text" @click="rail = !rail">
          <v-icon>{{ rail ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </div>
    </div>

    <v-divider />

    <!-- Menu -->
    <v-list nav density="comfortable">
      <v-list-item
        v-for="item in filteredMenu"
        :key="item.title"
        :to="item.to"
        rounded="lg"
        active-class="v-list-item--active"
      >
        <div class="d-flex align-center" style="width: 100%">
          <v-icon class="mr-3">{{ item.icon }}</v-icon>
          <div v-if="!rail">
            <div class="font-weight-medium">{{ item.title }}</div>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <template #append>
      <v-divider />
      <v-list-item class="px-4 py-3">
        <v-avatar size="36" color="primary">
          <span class="text-white">{{ initials }}</span>
        </v-avatar>

        <v-list-item-title v-if="!rail" class="ml-3">
          {{ user?.full_name }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const drawer = ref(true);
const rail = ref(false);

const auth = useAuthStore();
const user = auth.user;

const initials = computed(() => {
  const name = user?.full_name || "Developer User";
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("");
});

// Sidebar menu
const menu = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: "/dashboard",
    roles: ["Admin", "Manager", "User"],
  },

  { title: "Users", icon: "mdi-account-group", to: "/users", roles: ["Admin", "Manager"] },

  { title: "Roles & Permissions", icon: "mdi-shield-key", to: "/roles", roles: ["Admin"] },

  { title: "Departments", icon: "mdi-office-building", to: "/departments", roles: ["Admin"] },

  {
    title: "Review Requests",
    icon: "mdi-check-decagram",
    to: "/review-requests",
    roles: ["Admin", "Manager"],
  },

  { title: "Login History", icon: "mdi-login", to: "/login-history", roles: ["Admin"] },

  { title: "Audit Log", icon: "mdi-history", to: "/audit-log", roles: ["Admin"] },

  {
    title: "Activity Log",
    icon: "mdi-chart-line",
    to: "/activity-log",
    roles: ["Admin", "Manager"],
  },
];

// Role-based filtering — if no authenticated role, show full menu (dev / guest view)
const filteredMenu = computed(() => {
  const role = auth.role;
  if (!role) return menu;
  return menu.filter((item) => item.roles.includes(role));
});
</script>

<style scoped>
.app-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
