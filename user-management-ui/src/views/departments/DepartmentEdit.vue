<template>
  <v-card class="pa-4">
    <h2 class="ma-0 mb-4">Edit Department</h2>
    <v-form v-if="loaded && form" @submit.prevent="save">
      <v-text-field v-model="form.department_name" label="Name" required />
      <v-text-field v-model="form.department_code" label="Code" />
      <v-textarea v-model="form.description" label="Description" />
      <v-select
        v-model="form.parent_department"
        :items="parentOptions"
        item-title="label"
        item-value="value"
        label="Parent Department"
        clearable
      />
      <v-select v-model="form.status" :items="['Active', 'Inactive']" label="Status" />

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn color="primary" type="submit">Save</v-btn>
      </v-card-actions>
    </v-form>
    <v-alert v-else type="error">Department not found.</v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import baseData from "../../data/departments.json";

interface Department {
  department_id: number;
  department_name: string;
  department_code: string;
  description: string;
  parent_department: number | null;
  status: string;
}

interface ParentOption {
  label: string;
  value: number;
}

const router = useRouter();
const route = useRoute();
const id = Number(route.params.id || 0);
const form = ref<Department | null>(null);
const parentOptions = ref<ParentOption[]>([]);
const loaded = ref(false);

onMounted(() => {
  const base = Array.isArray(baseData) ? baseData : [];
  const additions = JSON.parse(localStorage.getItem("departments_additions") || "[]") || [];
  const updates = JSON.parse(localStorage.getItem("departments_updates") || "{}") || {};
  const all = [...base, ...additions].map((d: Department) => {
    const upd = updates[d.department_id];
    return upd ? { ...d, ...upd } : d;
  });
  parentOptions.value = all.map((d: Department) => ({ label: d.department_name, value: d.department_id }));
  const found = all.find((d: Department) => d.department_id === id);
  if (found) {
    form.value = { ...found };
    loaded.value = true;
  }
});

function cancel() {
  router.push({ name: "Departments" }).catch(() => {});
}

function save() {
  const updates = JSON.parse(localStorage.getItem("departments_updates") || "{}") || {};
  updates[id] = { ...form.value };
  delete updates[id].department_id;
  localStorage.setItem("departments_updates", JSON.stringify(updates));
  router.push({ name: "Departments" }).catch(() => {});
}
</script>

<style scoped></style>
