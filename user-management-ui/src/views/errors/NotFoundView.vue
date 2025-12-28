<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 text-center">
      <div class="display-1 font-weight-bold">404</div>
      <div class="subtitle-1 mb-4">Page Not Found</div>
      <v-btn color="primary" to="/">Go Home</v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts"></script>

<style scoped>
.v-card {
  max-width: 420px;
}
</style>
