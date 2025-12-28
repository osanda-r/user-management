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
      item-key="id"
      :items-per-page="10"
      class="elevation-1"
    >
      <template #item.name="{ item }">
        <div class="d-flex align-center">
          <v-avatar size="36" class="mr-3">
            <img :src="item.avatar || avatarPlaceholder(item.name)" alt="avatar" />
          </v-avatar>
          <div>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text--secondary text-caption">{{ item.email }}</div>
          </div>
        </div>
      </template>

      <template #item.status="{ item }">
        <v-chip :color="item.status === 'Active' ? 'success' : 'grey darken-1'" small>
          {{ item.status }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon @click="editUser(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteUser(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #no-data>
        <v-alert type="info" border="left">No users found.</v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import usersData from "../../data/users.json";

const users = ref(Array.isArray(usersData) ? usersData : []);
const search = ref("");
const roleFilter = ref<string | null>(null);

const headers = [
  { text: "Name", value: "name" },
  { text: "Role", value: "role" },
  { text: "Status", value: "status" },
  { text: "Actions", value: "actions", sortable: false, align: "end" },
];

const roles = computed(() => {
  const set = new Set<string>();
  users.value.forEach((u) => {
    if (u.role) set.add(u.role);
  });
  return Array.from(set);
});

const filteredUsers = computed(() => {
  return users.value.filter((u: any) => {
    const matchesSearch =
      !search.value ||
      (u.name && u.name.toLowerCase().includes(search.value.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.value.toLowerCase()));
    const matchesRole = !roleFilter.value || u.role === roleFilter.value;
    return matchesSearch && matchesRole;
  });
});

function avatarPlaceholder(name: string) {
  const bg = "0D8ABC";
  const color = "fff";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${bg}&color=${color}`;
}

function editUser(item: any) {
  // TODO: wire into router or modal
  // eslint-disable-next-line no-alert
  alert("Edit user: " + item.name);
}

function openCreate() {
  // TODO: show create form/modal
  // eslint-disable-next-line no-alert
  alert("Open create user form");
}

function deleteUser(item: any) {
  // confirm then remove locally
  // eslint-disable-next-line no-alert
  if (!confirm(`Delete ${item.name}?`)) return;
  users.value = users.value.filter((u: any) => u.id !== item.id);
}

function exportCSV() {
  const rows = filteredUsers.value.map((u: any) => [u.id, u.name, u.email, u.role, u.status]);
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
.title {
  font-size: 1.25rem;
}
</style>
