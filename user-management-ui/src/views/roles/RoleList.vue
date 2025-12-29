<template>
  <v-card class="pa-4">
    <v-row class="align-center mb-2">
      <v-col cols="12" md="6">
        <h2 class="ma-0">Roles</h2>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-btn color="primary" @click="openCreate">Add Role</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search roles"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>

      <v-col cols="6" md="3" class="d-flex justify-end">
        <v-btn icon @click="exportCSV" :title="'Export CSV'">
          <v-icon>mdi-export</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :items="filteredRoles"
      item-key="role_id"
      :items-per-page="10"
      class="elevation-1"
    >
      <template #[`item.role_id`]="{ item }">
        <div class="text-caption">#{{ item.role_id }}</div>
      </template>

      <template #[`item.role_name`]="{ item }">
        <div class="font-weight-medium">{{ item.role_name }}</div>
      </template>

      <template #[`item.description`]="{ item }">
        <div class="text-truncate">{{ item.description }}</div>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn icon @click="editRole(item)" :title="`Edit ${item.role_name}`">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteRole(item)" :title="`Delete ${item.role_name}`">
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #no-data>
        <v-alert type="info">No roles found.</v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import rolesData from "../../data/roles.json";

interface Role {
  role_id: number;
  role_name: string;
  description: string;
}

const router = useRouter();
const search = ref("");
const roles = ref<Role[]>([]);

const headers = [
  { text: "ID", value: "role_id", width: 80 },
  { text: "Role", value: "role_name" },
  { text: "Description", value: "description" },
  { text: "Actions", value: "actions", sortable: false, align: "end" as const, width: 120 },
];

function loadRoles() {
  const base = Array.isArray(rolesData) ? rolesData : [];
  const additions = JSON.parse(localStorage.getItem("roles_additions") || "[]") || [];
  const updates = JSON.parse(localStorage.getItem("roles_updates") || "{}") || {};
  const deletions = JSON.parse(localStorage.getItem("roles_deletions") || "[]") || [];

  const merged = [...base, ...additions]
    .map((r) => {
      const upd = updates[r.role_id];
      return upd ? { ...r, ...upd } : r;
    })
    .filter((r) => !deletions.includes(r.role_id));

  const extraUpdated = Object.keys(updates)
    .map((k) => Number(k))
    .filter((id) => !merged.find((m) => m.role_id === id) && !deletions.includes(id))
    .map((id) => ({ role_id: id, ...updates[id] }));

  roles.value = [...merged, ...extraUpdated];
}

onMounted(() => {
  loadRoles();
});

const filteredRoles = computed(() => {
  const q = search.value && search.value.toLowerCase();
  return roles.value.filter((r: Role) => {
    return (
      !q ||
      (r.role_name && r.role_name.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      String(r.role_id).includes(q || "")
    );
  });
});

function editRole(item: Role) {
  router.push({ name: "RolePermissions", params: { roleId: item.role_id } }).catch(() => {});
}

function openCreate() {
  router.push({ name: "Roles" }).catch(() => {});
}

function deleteRole(item: Role) {
  if (!confirm(`Delete ${item.role_name || item.role_id}?`)) return;
  const deletions = JSON.parse(localStorage.getItem("roles_deletions") || "[]") || [];
  deletions.push(item.role_id);
  localStorage.setItem("roles_deletions", JSON.stringify(Array.from(new Set(deletions))));
  loadRoles();
}

function exportCSV() {
  const rows = filteredRoles.value.map((r: Role) => [r.role_id, r.role_name, r.description]);
  const csv = [
    "ID,Name,Description",
    ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "roles.csv";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.font-weight-medium {
  font-weight: 600;
}
.text-truncate {
  max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
