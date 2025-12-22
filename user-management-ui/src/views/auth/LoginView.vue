<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <v-card class="pa-6">
          <v-card-title class="text-h6">Login</v-card-title>

          <v-text-field label="Username" v-model="username" />
          <v-text-field label="Password" type="password" v-model="password" />

          <v-btn block color="primary" @click="login">
            Login
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
