<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item to="/users">Users</v-list-item>
        <v-list-item to="/roles">Roles</v-list-item>
        <v-list-item to="/audit-log">Audit Log</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
