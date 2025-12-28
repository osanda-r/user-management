import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.auth && !auth.isAuthenticated) {
    return "/auth/login";
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return "/unauthorized";
  }
});

export default router;
