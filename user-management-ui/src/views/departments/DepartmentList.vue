<template>
  <v-card class="pa-4">
    <v-row class="align-center mb-2">
      <v-col cols="12" md="6">
        <h2 class="ma-0">Departments</h2>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-btn color="primary" @click="openCreate">Add Department</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search departments"
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
      :headers="headers"
      :items="filteredDepartments"
      item-key="department_id"
      :items-per-page="10"
      class="elevation-1"
    >
      <template #item.department_id="{ item }">
        <div class="text-caption">#{{ item.department_id }}</div>
      </template>

      <template #item.department_name="{ item }">
        <div>
          <div class="font-weight-medium">{{ item.department_name }}</div>
          <div class="text--secondary text-caption">{{ item.department_code }}</div>
        </div>
      </template>

      <template #item.description="{ item }">
        <div class="text-truncate">{{ item.description }}</div>
      </template>

      <template #item.parent_department="{ item }">
        <div>
          <span v-if="parentName(item.parent_department)">
            {{ parentName(item.parent_department) }}
          </span>
          <span v-else class="text--secondary">—</span>
        </div>
      </template>

      <template #item.status="{ item }">
        <v-chip :color="item.status === 'Active' ? 'success' : 'grey'" small>
          {{ item.status }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon @click="editDepartment(item)" :title="`Edit ${item.department_name}`">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteDepartment(item)" :title="`Delete ${item.department_name}`">
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #no-data>
        <v-alert type="info">No departments found.</v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import departmentsData from "../../data/departments.json";

const router = useRouter();
const search = ref("");
const departments = ref<any[]>([]);

const headers = [
  { text: "ID", value: "department_id", width: 80 },
  { text: "Department", value: "department_name" },
  { text: "Description", value: "description" },
  { text: "Parent", value: "parent_department", width: 200 },
  { text: "Status", value: "status", width: 140 },
  { text: "Actions", value: "actions", sortable: false, align: "end", width: 120 },
];

function loadDepartments() {
  const base = Array.isArray(departmentsData) ? departmentsData : [];
  const additions = JSON.parse(localStorage.getItem("departments_additions") || "[]") || [];
  const updates = JSON.parse(localStorage.getItem("departments_updates") || "{}") || {};
  const merged = [...base, ...additions].map((d) => {
    const upd = updates[d.department_id];
    return upd ? { ...d, ...upd } : d;
  });

  const extraUpdated = Object.keys(updates)
    .map((k) => Number(k))
    .filter((id) => !merged.find((m) => m.department_id === id))
    .map((id) => ({ department_id: id, ...updates[id] }));
  departments.value = [...merged, ...extraUpdated];
}

onMounted(() => {
  loadDepartments();
});

const filteredDepartments = computed(() => {
  const q = search.value && search.value.toLowerCase();
  return departments.value.filter((d: any) => {
    const matchesSearch =
      !q ||
      (d.department_name && d.department_name.toLowerCase().includes(q)) ||
      (d.department_code && d.department_code.toLowerCase().includes(q)) ||
      (d.description && d.description.toLowerCase().includes(q));
    return matchesSearch;
  });
});

function parentName(parentId: number | null) {
  if (parentId == null) return "";
  const p = departments.value.find((d) => d.department_id === parentId);
  return p ? p.department_name : "";
}

function editDepartment(item: any) {
  router.push({ name: "DepartmentEdit", params: { id: item.department_id } }).catch(() => {});
}

function openCreate() {
  router.push({ name: "DepartmentCreate" }).catch(() => {});
}

function deleteDepartment(item: any) {
  if (!confirm(`Delete ${item.department_name || item.department_id}?`)) return;
  departments.value = departments.value.filter((d) => d.department_id !== item.department_id);
}

function exportCSV() {
  const rows = filteredDepartments.value.map((d: any) => [
    d.department_id,
    d.department_name,
    d.department_code,
    d.description,
    parentName(d.parent_department) || "",
    d.status,
  ]);
  const csv = [
    "ID,Name,Code,Description,Parent,Status",
    ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "departments.csv";
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
