import type { RouteRecordRaw } from "vue-router";

const usersRoutes: RouteRecordRaw[] = [
  {
    path: "/users",
    name: "Users",
    component: () => import("@/views/users/UserList.vue"),
    meta: { auth: true },
  },
];

export default usersRoutes;
