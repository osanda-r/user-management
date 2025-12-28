<template>
  <v-app>
    <div class="layout">
      <!-- Left Sidebar -->
      <SideBar />

      <!-- Right Content Area -->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}
.content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
