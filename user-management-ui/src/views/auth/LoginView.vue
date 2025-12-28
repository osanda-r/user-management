<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <v-card class="pa-6">
          <v-card-title class="text-h6">Login</v-card-title>

          <v-text-field label="Username" v-model="username" />
          <v-text-field label="Password" type="password" v-model="password" />

          <v-btn block color="primary" @click="login"> Login </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const username = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();

function login() {
  const fakeToken = "dev-token";
  const fakeUser = {
    id: 1,
    full_name: "Developer User",
    role: "Admin",
    email: `${username.value || "dev"}@example.com`,
  };

  auth.token = fakeToken;
  auth.user = fakeUser;
  localStorage.setItem("token", fakeToken);

  router.push("/users");
}
</script>
