<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-row class="align-center mb-4">
            <v-col>
              <h2 class="ma-0">Create User</h2>
            </v-col>
          </v-row>

          <v-form @submit.prevent="onSave">
            <v-text-field v-model="form.username" label="Username" required />
            <v-text-field v-model="form.first_name" label="First name" />
            <v-text-field v-model="form.last_name" label="Last name" />
            <v-text-field v-model="form.full_name" label="Full name (optional)" />
            <v-text-field v-model="form.email" label="Email" type="email" />
            <v-text-field v-model="form.phone" label="Phone" />
            <v-text-field v-model="form.password" label="Password" type="password" />
            <v-select v-model="form.status" :items="['Active', 'Inactive']" label="Status" />
            <v-select
              v-model="form.department_id"
              :items="departmentOptions"
              item-title="name"
              item-value="id"
              label="Department"
              clearable
            />

            <v-row class="mt-4">
              <v-col class="d-flex justify-end">
                <v-btn text @click="cancel">Cancel</v-btn>
                <v-btn color="primary" class="ml-3" @click="onSave">Save</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import usersData from "@/data/users.json";
import departmentsData from "@/data/departments.json";

interface User {
  user_id?: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  department_id: number | null;
  last_login_at: string | null;
}

const router = useRouter();

const form = reactive({
  username: "",
  first_name: "",
  last_name: "",
  full_name: "",
  email: "",
  phone: "",
  password: "",
  status: "Active",
  department_id: null as number | null,
});

const departmentOptions = computed(() => (Array.isArray(departmentsData) ? departmentsData : []));

function cancel() {
  router.push({ name: "Users" });
}

function onSave() {
  // ensure full_name
  if (!form.full_name && (form.first_name || form.last_name)) {
    form.full_name =
      `${form.first_name || ""}`.trim() + (form.last_name ? ` ${form.last_name}` : "");
  }

  const base = Array.isArray(usersData) ? usersData : [];
  const additions = JSON.parse(localStorage.getItem("users_additions") || "[]") || [];
  const maxId = base
    .concat(additions)
    .reduce((m: number, u: User) => Math.max(m, u.user_id || 0), 0);

  const newUser = {
    user_id: maxId + 1,
    username: form.username,
    first_name: form.first_name,
    last_name: form.last_name,
    full_name: form.full_name,
    email: form.email,
    phone: form.phone,
    password: form.password || "",
    status: form.status,
    department_id: form.department_id,
    last_login_at: null,
  };

  additions.push(newUser);
  localStorage.setItem("users_additions", JSON.stringify(additions));
  router.push({ name: "Users" });
}
</script>

<style scoped>
.ml-3 {
  margin-left: 12px;
}
</style>
