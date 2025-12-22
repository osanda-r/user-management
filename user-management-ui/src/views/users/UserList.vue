<template>
  <v-card>
    <v-card-title>
      Users
      <v-spacer />
      <v-btn color="primary" @click="openCreate">Add User</v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="users"
    >
      <template #item.status="{ item }">
        <v-chip :color="item.status === 'Active' ? 'success' : 'error'">
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
    </v-data-table>
  </v-card>
</template>
