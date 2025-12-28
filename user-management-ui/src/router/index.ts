import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

import { useAuthStore } from '@/stores/auth'
  router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.auth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return '/unauthorized'
  }
})

export default router
