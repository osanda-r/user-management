<template>
  <v-card class="pa-4">
    <v-row class="align-center mb-2">
      <v-col cols="12" md="6">
        <h2 class="ma-0">Role Permissions</h2>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-select
          v-model="selectedRoleId"
          :items="roles"
          item-title="role_name"
          item-value="role_id"
          label="Select Role"
          dense
          outlined
          style="max-width: 360px"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-row>
      <v-col cols="12" md="6" v-for="group in groupedPermissions" :key="group.module">
        <h3 class="subtitle-2 mb-2">{{ group.module }}</h3>
        <v-checkbox
          v-for="p in group.items"
          :key="p.permission_id"
          :label="p.permission_name"
          :model-value="p.assigned"
          :disabled="true"
          class="d-block"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import rolesData from "../../data/roles.json";
import permissionsData from "../../data/permissions.json";
import rolePermissionsData from "../../data/role_permissions.json";

interface Role {
  role_id: number;
  role_name: string;
}

interface Permission {
  permission_id: number;
  permission_name: string;
  module_name?: string;
  assigned?: boolean;
}

interface RolePermission {
  role_id: number;
  permission_id: number;
}

const route = useRoute();
const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const rolePermissions = ref<RolePermission[]>([]);
const selectedRoleId = ref<number | null>(null);

function loadData() {
  const baseRoles = Array.isArray(rolesData) ? rolesData : [];
  const additions = JSON.parse(localStorage.getItem("roles_additions") || "[]") || [];
  const updates = JSON.parse(localStorage.getItem("roles_updates") || "{}") || {};
  const deletions = JSON.parse(localStorage.getItem("roles_deletions") || "[]") || [];

  const merged = [...baseRoles, ...additions]
    .map((r) => (updates[r.role_id] ? { ...r, ...updates[r.role_id] } : r))
    .filter((r) => !deletions.includes(r.role_id));

  const extraUpdated = Object.keys(updates)
    .map((k) => Number(k))
    .filter((id) => !merged.find((m) => m.role_id === id) && !deletions.includes(id))
    .map((id) => ({ role_id: id, ...updates[id] }));

  roles.value = [...merged, ...extraUpdated];

  permissions.value = Array.isArray(permissionsData) ? permissionsData : [];
  rolePermissions.value = Array.isArray(rolePermissionsData) ? rolePermissionsData : [];

  const paramId = Number(route.params.roleId || route.query.roleId || 0) || null;
  selectedRoleId.value = paramId || (roles.value[0] && roles.value[0].role_id) || null;
}

onMounted(() => {
  loadData();
});

const assignedSet = computed(() => {
  const set = new Set<number>();
  if (!selectedRoleId.value) return set;
  rolePermissions.value.forEach((rp) => {
    if (rp.role_id === selectedRoleId.value) set.add(rp.permission_id);
  });
  return set;
});

const permissionsWithAssigned = computed(() => {
  const set = assignedSet.value;
  return permissions.value.map((p) => ({ ...p, assigned: set.has(p.permission_id) }));
});

const groupedPermissions = computed(() => {
  const map: Record<string, Permission[]> = {};
  permissionsWithAssigned.value.forEach((p) => {
    const m = p.module_name || "General";
    if (!map[m]) map[m] = [];
    map[m].push(p);
  });
  return Object.keys(map).map((k) => ({ module: k, items: map[k] }));
});
</script>

<style scoped>
.subtitle-2 {
  font-weight: 600;
}
</style>
