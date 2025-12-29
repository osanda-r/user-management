<template>
  <v-card class="pa-4">
    <h2 class="ma-0 mb-4">Create Department</h2>
    <v-form @submit.prevent="save">
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
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import baseData from "../../data/departments.json";

const router = useRouter();
const form = ref<any>({
  department_name: "",
  department_code: "",
  description: "",
  parent_department: null,
  status: "Active",
});
const parentOptions = ref<any[]>([]);

onMounted(() => {
  // prepare parent options from base data + additions
  const base = Array.isArray(baseData) ? baseData : [];
  const additions = JSON.parse(localStorage.getItem("departments_additions") || "[]") || [];
  const all = [...base, ...additions];
  parentOptions.value = all.map((d: any) => ({ label: d.department_name, value: d.department_id }));
});

function cancel() {
  router.push({ name: "Departments" }).catch(() => {});
}

function save() {
  const additions = JSON.parse(localStorage.getItem("departments_additions") || "[]") || [];
  const base = Array.isArray(baseData) ? baseData : [];
  const maxId = Math.max(0, ...[...base, ...additions].map((d: any) => d.department_id || 0));
  const newId = maxId + 1;
  const payload = { department_id: newId, ...form.value };
  additions.push(payload);
  localStorage.setItem("departments_additions", JSON.stringify(additions));
  router.push({ name: "Departments" }).catch(() => {});
}
</script>

<style scoped></style>
