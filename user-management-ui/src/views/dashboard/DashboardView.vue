<template>
  <v-container fluid>
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="dashboard-header d-flex align-center justify-space-between">
          <div>
            <h1 class="mb-1">Dashboard</h1>
            <div class="subtitle-2 text--secondary">Overview of system activity</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="stats-row" align="stretch">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-4 elevation-6">
          <div class="stat-content">
            <div>
              <div class="stat-label">Total Users</div>
              <div class="stat-value">{{ totalUsers }}</div>
            </div>
            <div class="stat-icon bg-primary">
              <v-icon color="white">mdi-account-multiple</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-4 elevation-6">
          <div class="stat-content">
            <div>
              <div class="stat-label">Active Users</div>
              <div class="stat-value">{{ activeUsers }}</div>
            </div>
            <div class="stat-icon bg-success">
              <v-icon color="white">mdi-account-check</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-4 elevation-6">
          <div class="stat-content">
            <div>
              <div class="stat-label">Pending Reviews</div>
              <div class="stat-value">{{ pendingReviews }}</div>
            </div>
            <div class="stat-icon bg-warning">
              <v-icon color="white">mdi-clock-outline</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-4 elevation-6">
          <div class="stat-content">
            <div>
              <div class="stat-label">Login Today</div>
              <div class="stat-value">{{ loginToday }}</div>
            </div>
            <div class="stat-icon bg-info">
              <v-icon color="white">mdi-login-variant</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card class="pa-4 elevation-2">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="subtitle-1">Recent Logins</div>
            <div class="text--secondary">Showing last 10</div>
          </div>

          <v-data-table :items="recentLogins" :headers="loginHeaders" dense>
            <template #item.login_time="{ item }">
              {{ formatDate(item.login_time) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 elevation-2">
          <div class="subtitle-1 mb-3">Quick Actions</div>
          <v-list dense>
            <v-list-item @click="goTo('/users')">
              <div class="d-flex align-center" style="width: 100%">
                <v-icon class="mr-3">mdi-account-group</v-icon>
                <div>
                  <div class="font-weight-medium">Manage Users</div>
                  <div class="text--secondary">View, edit or add users</div>
                </div>
              </div>
            </v-list-item>

            <v-list-item @click="goTo('/review-requests')">
              <div class="d-flex align-center" style="width: 100%">
                <v-icon class="mr-3">mdi-check-decagram</v-icon>
                <div>
                  <div class="font-weight-medium">Review Requests</div>
                  <div class="text--secondary">Approve pending changes</div>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import usersData from "@/data/users.json";
import reviewsData from "@/data/review_requests.json";
import loginsData from "@/data/login_history.json";

const router = useRouter();

const users = usersData || [];
const reviews = reviewsData || [];
const logins = loginsData || [];

const totalUsers = computed(() => users.length);
const activeUsers = computed(
  () =>
    users.filter((u: any) => (u.status || u.user_status || u.state || u.active) === "Active").length
);
const pendingReviews = computed(
  () => reviews.filter((r: any) => r.request_status === "Pending").length
);

function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const loginToday = computed(() => logins.filter((l: any) => isToday(l.login_time)).length);

const recentLogins = computed(() =>
  logins
    .slice()
    .sort((a: any, b: any) => new Date(b.login_time).getTime() - new Date(a.login_time).getTime())
    .slice(0, 10)
);

const loginHeaders = [
  { text: "User ID", value: "user_id" },
  { text: "Login Time", value: "login_time" },
  { text: "IP", value: "ip_address" },
  { text: "Device", value: "device_info" },
];

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
}

function goTo(path: string) {
  router.push(path);
}
</script>

<style scoped>
.dashboard-header h1 {
  margin: 0;
  font-weight: 700;
}
.stat-row {
  gap: 16px;
}
.stat-card {
  border-radius: 12px;
  display: flex;
  align-items: center;
  height: 120px;
}
.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.stat-label {
  color: var(--muted);
  font-size: 0.9rem;
}
.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 6px;
}
.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-primary {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
}
.bg-success {
  background: linear-gradient(135deg, #16a34a, #4ade80);
}
.bg-warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}
.bg-info {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

.v-data-table thead th {
  color: var(--muted);
  font-weight: 600;
}
.v-list-item {
  cursor: pointer;
}

.elevation-6 {
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06) !important;
}
.elevation-2 {
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04) !important;
}
</style>
