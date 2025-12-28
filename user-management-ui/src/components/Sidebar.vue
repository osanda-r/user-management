<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    app
    class="app-sidebar"
  >
    <!-- Logo ,Title -->
    <v-list-item class="px-4">
      <v-list-item-title class="text-h6 font-weight-bold">
        UMS
      </v-list-item-title>

      <template #append>
        <v-btn
          icon
          variant="text"
          @click="rail = !rail"
        >
          <v-icon>{{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
        </v-btn>
      </template>
    </v-list-item>

    <v-divider />

    <!-- Menu -->
    <v-list nav density="comfortable">

      <v-list-item
        v-for="item in filteredMenu"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
      />

    </v-list>

    <!-- Bottom User Info -->
    <template #append>
      <v-divider />
      <v-list-item class="px-4 py-3">
        <v-avatar size="32" color="primary">
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
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const drawer = ref(true)
const rail = ref(false)

const auth = useAuthStore()
const user = auth.user

const initials = computed(() =>
  user?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
)

// Sidebar menu 
const menu = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard', roles: ['Admin', 'Manager', 'User'] },

  { title: 'Users', icon: 'mdi-account-group', to: '/users', roles: ['Admin', 'Manager'] },

  { title: 'Roles & Permissions', icon: 'mdi-shield-key', to: '/roles', roles: ['Admin'] },

  { title: 'Departments', icon: 'mdi-office-building', to: '/departments', roles: ['Admin'] },

  { title: 'Review Requests', icon: 'mdi-check-decagram', to: '/review-requests', roles: ['Admin', 'Manager'] },

  { title: 'Login History', icon: 'mdi-login', to: '/login-history', roles: ['Admin'] },

  { title: 'Audit Log', icon: 'mdi-history', to: '/audit-log', roles: ['Admin'] },

  { title: 'Activity Log', icon: 'mdi-chart-line', to: '/activity-log', roles: ['Admin', 'Manager'] },
]

//Role-based filtering
const filteredMenu = computed(() =>
  menu.filter(item => item.roles.includes(auth.role))
)
</script>

<style scoped>
.app-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
