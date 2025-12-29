import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { routes } from "./router";
import { useAuthStore } from "@/stores/auth";

declare module "vue-router" {
  interface RouteMeta {
    auth?: boolean;
    roles?: string[];
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized) => {
  const auth = useAuthStore();

  if (to.meta.auth && !auth.isAuthenticated) {
    return "/auth/login";
  }

  if (to.meta.roles && auth.role && !to.meta.roles.includes(auth.role)) {
    return "/unauthorized";
  }
});

export default router;
