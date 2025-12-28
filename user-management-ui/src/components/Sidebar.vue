<template>
  <aside :class="['sidebar', { collapsed }]">
    <div class="brand">
      <h1>User Management</h1>
      <button
        class="menu-btn"
        aria-label="toggle sidebar"
        @click="toggleSidebar"
        :aria-expanded="!collapsed"
      >
        <span class="hamburger">≡</span>
      </button>
    </div>

    <nav class="menu" role="navigation" aria-label="Main menu">
      <ul>
        <li v-for="(item, idx) in filteredMenu" :key="item.title" class="menu-item">
          <div
            class="main-row"
            :class="{ open: isOpen(idx), active: isActive(item) }"
            @click="onMainClick(idx, item)"
            role="button"
            tabindex="0"
            @keyup.enter="onMainClick(idx, item)"
          >
            <span class="icon"><i :class="['mdi', item.icon]" aria-hidden="true"></i></span>
            <span class="label">{{ item.title }}</span>
            <span class="chev" v-if="item.children">
              <i
                class="mdi mdi-chevron-right chevron"
                :class="{ open: isOpen(idx) }"
                aria-hidden="true"
              ></i>
            </span>
          </div>

          <transition name="slide-fade">
            <ul v-if="item.children && isOpen(idx)" class="sub-list">
              <li
                v-for="child in item.children"
                :key="child.title"
                class="sub-item"
                :class="{ selected: routeMatches(child) }"
                @click.stop="onChildClick(child)"
              >
                {{ child.title }}
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

type Child = { title: string; to?: string };
type MenuItem = { title: string; icon?: string; to?: string; roles?: string[]; children?: Child[] };

// menu (role-based)
const menu: MenuItem[] = [
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

// Role-based filtering
const filteredMenu = computed(() => {
  const role = auth.role;
  if (!role) return menu;
  return menu.filter((item) => item.roles?.includes(role));
});

const openIndex = ref<number | null>(null);

const collapsed = ref(false);

function toggleSidebar() {
  collapsed.value = !collapsed.value;
  // close any open submenu when collapsing
  if (collapsed.value) openIndex.value = null;
}

function isOpen(idx: number) {
  return openIndex.value === idx;
}

function onMainClick(idx: number, item: MenuItem) {
  if (item.children && item.children.length) {
    openIndex.value = isOpen(idx) ? null : idx;
  } else if (item.to) {
    router.push(item.to);
  }
}

function onChildClick(child: Child) {
  if (child.to) router.push(child.to);
}

function routeMatches(item: Child | undefined) {
  if (!item) return false;
  if (item.to) return route.path === item.to;
  return false;
}

function isActive(item: MenuItem) {
  if (item.to && route.path === item.to) return true;
  if (item.children) {
    return item.children.some((c: Child) => routeMatches(c));
  }
  return false;
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  padding: 20px 16px;
  background: var(--v-theme-surface);
  border-right: 1px solid rgba(24, 135, 137, 0.2);
  min-height: 100vh;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.brand h1 {
  font-size: 20px;
  margin: 0;
}
.menu-btn {
  background: transparent;
  border: 0;
  cursor: pointer;
}
.menu ul {
  list-style: none;
  padding: 0;
  margin: 30;
}
.menu-item {
  margin-bottom: 8px;
}
.main-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 8px;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 180ms ease, color 180ms ease, transform 120ms ease;
}
.main-row .icon {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
}
.main-row .label {
  flex: 1;
  font-size: 15.5px;
  letter-spacing: 0.1px;
}
.main-row .chev {
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
}
.main-row .icon i {
  font-size: 20px;
}
.main-row.active {
  color: var(--v-theme-primary);
  font-weight: 600;
}
.main-row.open {
  background: rgba(0, 0, 0, 0.04);
}

/* Collapsed state */
.sidebar.collapsed {
  width: 72px;
  padding-left: 10px;
  padding-right: 10px;
}
.sidebar.collapsed .brand h1 {
  display: none;
}
.sidebar.collapsed .main-row {
  justify-content: center;
  padding: 10px 6px;
}
.sidebar.collapsed .main-row .label {
  display: none;
}
.sidebar.collapsed .main-row .chev {
  display: none;
}

/* Hover and focus styles */
.main-row:hover,
.main-row:focus {
  color: var(--v-theme-primary);
  background: rgba(47, 161, 255, 0.31);
  transform: translateY(-1px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-from {
  opacity: 1;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.hamburger {
  font-size: 25px;
  color: var(--v-theme-primary);
}
.hamburger:hover,
.hamburger:focus {
  color: #239d60;
}
/* Chevron rotate when open */
.chevron {
  font-size: 16px;
  color: var(--v-theme-primary);
  transition: transform 200ms ease;
  display: inline-flex;
  align-items: center;
}
.chevron.open {
  transform: rotate(90deg);
}

/* Slight separator between main groups */
.menu-item + .menu-item {
  margin-top: 6px;
}
</style>
