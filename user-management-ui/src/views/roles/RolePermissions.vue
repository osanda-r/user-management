<template>
  <v-card>
    <v-card-title>Role Permissions</v-card-title>

    <v-select
      label="Select Role"
      :items="roles"
      item-title="role_name"
    />

    <v-divider class="my-4" />

    <v-checkbox
      v-for="p in permissions"
      :key="p.permission_id"
      :label="p.permission_name"
    />
  </v-card>
</template>
