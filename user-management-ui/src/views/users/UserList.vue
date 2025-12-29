<template>
  <v-card class="pa-4">
    <v-row class="align-center mb-2">
      <v-col cols="12" md="6">
        <h2 class="ma-0">Users</h2>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-btn color="primary" @click="openCreate">Add User</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search users"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>

      <v-col cols="6" md="3">
        <v-select v-model="roleFilter" :items="roles" label="Role" clearable />
      </v-col>

      <v-col cols="6" md="3" class="d-flex justify-end">
        <v-btn icon @click="exportCSV" :title="'Export CSV'">
          <v-icon>mdi-export</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      item-key="user_id"
      :items-per-page="10"
      class="elevation-1 users-table"
    >
      <template v-slot:item.user_id="{ item }">
        <div class="text-caption">#{{ item.user_id }}</div>
      </template>

      <template v-slot:item.username="{ item }">
        <div>
          <div class="font-weight-medium">{{ item.full_name || item.username }}</div>
          <div class="text--secondary text-caption">{{ item.username }}</div>
        </div>
      </template>

      <template v-slot:item.email="{ item }">
        <div class="text-truncate">{{ item.email }}</div>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status === 'Active' ? 'success' : 'grey'" small>
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="editUser(item)" :title="`Edit ${item.username}`">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteUser(item)" :title="`Delete ${item.username}`">
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:no-data>
        <v-alert type="info">No users found.</v-alert>
      </template>
    </v-data-table>
    <!-- Edit dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title>{{ editForm?.user_id ? "Edit User" : "Edit User" }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent>
            <v-text-field v-model="editForm.username" label="Username" />
            <v-text-field v-model="editForm.full_name" label="Full name" />
            <v-text-field v-model="editForm.email" label="Email" />
            <v-select v-model="editForm.status" :items="['Active', 'Inactive']" label="Status" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text type="button" @click="closeEdit">Cancel</v-btn>
          <v-btn color="primary" type="button" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import usersData from "../../data/users.json";

interface User {
  user_id: number;
  username: string;
  full_name?: string;
  email: string;
  status: string;
  role?: string;
}

const users = ref<User[]>([]);
const router = useRouter();
const search = ref("");
const roleFilter = ref<string | null>(null);

const headers: {
  text: string;
  value: string;
  width?: number;
  sortable?: boolean;
  align?: "start" | "center" | "end";
}[] = [
  { text: "ID", value: "user_id", width: 80 },
  { text: "User", value: "username" },
  { text: "Email", value: "email" },
  { text: "Status", value: "status", width: 140 },
  { text: "Actions", value: "actions", sortable: false, align: "end", width: 120 },
];

const roles = computed(() => {
  const set = new Set<string>();
  users.value.forEach((u) => {
    if (u.role) set.add(u.role);
  });
  return Array.from(set);
});

function loadUsers() {
  const base = Array.isArray(usersData) ? usersData : [];
  const additions = JSON.parse(localStorage.getItem("users_additions") || "[]") || [];
  users.value = [...base, ...additions];
}

onMounted(() => {
  loadUsers();
});

const filteredUsers = computed(() => {
  const q = search.value && search.value.toLowerCase();
  return users.value.filter((u: User) => {
    const matchesSearch =
      !q ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q));
    const matchesRole = !roleFilter.value || u.role === roleFilter.value;
    return matchesSearch && matchesRole;
  });
});

// edit dialog state
const editDialog = ref(false);
const editForm = ref<User>({
  user_id: 0,
  username: "",
  full_name: "",
  email: "",
  status: "Active",
});

function editUser(item: User) {
  editForm.value = { ...item };
  editDialog.value = true;
}

function openCreate() {
  router.push({ name: "UserCreate" });
}

function deleteUser(item: User) {
  if (!confirm(`Delete ${item.username || item.full_name || item.user_id}?`)) return;
  users.value = users.value.filter((u: User) => u.user_id !== item.user_id);
}

function closeEdit() {
  editDialog.value = false;
  editForm.value = null;
}

function saveEdit() {
  if (!editForm.value) return;
  const id = editForm.value.user_id;
  const idx = users.value.findIndex((u: User) => u.user_id === id);
  if (idx >= 0) {
    users.value.splice(idx, 1, { ...editForm.value });
  } else {
    // new created locally (assign a temporary ID)
    const maxId = users.value.reduce((m: number, u: User) => Math.max(m, u.user_id || 0), 0);
    editForm.value.user_id = maxId + 1;
    users.value.push({ ...editForm.value });
  }
  closeEdit();
}

function exportCSV() {
  const rows = filteredUsers.value.map((u: User) => [
    u.user_id,
    u.full_name || u.username,
    u.email,
    u.role || "",
    u.status,
  ]);
  const csv = [
    "ID,Name,Email,Role,Status",
    ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.csv";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.users-table .v-data-table__wrapper tr:hover {
  background: rgba(0, 0, 0, 0.02);
}
.font-weight-medium {
  font-weight: 600;
}
.text-truncate {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
