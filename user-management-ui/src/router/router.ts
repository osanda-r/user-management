import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  // Auth (blank) layout
  {
    path: "/auth",
    component: () => import("@/layouts/BlankLayout.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/LoginView.vue"),
        meta: { title: "Sign In" },
      },
    ],
  },

  // Main layout
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: "/auth/login" },

      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/DashboardView.vue"),
        meta: { title: "Dashboard", icon: "mdi-view-dashboard", showInSidebar: true, auth: true },
      },

      {
        path: "users",
        name: "Users",
        component: () => import("@/views/users/UserList.vue"),
        meta: { title: "Users", icon: "mdi-account-group", showInSidebar: true, auth: true },
      },
      {
        path: "users/create",
        name: "UserCreate",
        component: () => import("@/views/users/UserCreate.vue"),
        meta: { title: "Create User", showInSidebar: false, auth: true },
      },

      {
        path: "roles",
        name: "Roles",
        component: () => import("@/views/roles/RoleList.vue"),
        meta: { title: "Roles", icon: "mdi-shield-key", showInSidebar: true, auth: true },
      },
      {
        path: "roles/permissions",
        name: "RolePermissions",
        component: () => import("@/views/roles/RolePermissions.vue"),
        meta: { title: "Role Permissions", showInSidebar: false, auth: true },
      },

      {
        path: "departments",
        name: "Departments",
        component: () => import("@/views/departments/DepartmentList.vue"),
        meta: {
          title: "Departments",
          icon: "mdi-office-building",
          showInSidebar: true,
          auth: true,
        },
      },
      {
        path: "departments/create",
        name: "DepartmentCreate",
        component: () => import("@/views/departments/DepartmentCreate.vue"),
        meta: { title: "Create Department", showInSidebar: false, auth: true },
      },
      {
        path: "departments/:id/edit",
        name: "DepartmentEdit",
        component: () => import("@/views/departments/DepartmentEdit.vue"),
        meta: { title: "Edit Department", showInSidebar: false, auth: true },
      },

      {
        path: "review-requests",
        name: "ReviewRequests",
        component: () => import("@/views/review/ReviewRequests.vue"),
        meta: {
          title: "Review Requests",
          icon: "mdi-check-decagram",
          showInSidebar: true,
          auth: true,
        },
      },

      // Logs
      {
        path: "login-history",
        name: "LoginHistory",
        component: () => import("@/views/logs/LoginHistory.vue"),
        meta: { title: "Login History", icon: "mdi-login", showInSidebar: true, auth: true },
      },
      {
        path: "audit-log",
        name: "AuditLog",
        component: () => import("@/views/logs/AuditLog.vue"),
        meta: { title: "Audit Log", icon: "mdi-history", showInSidebar: true, auth: true },
      },
      {
        path: "activity-log",
        name: "ActivityLog",
        component: () => import("@/views/logs/ActivityLog.vue"),
        meta: { title: "Activity Log", icon: "mdi-chart-line", showInSidebar: true, auth: true },
      },
    ],
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/errors/NotFoundView.vue"),
    meta: { title: "Page Not Found", type: "hidden" },
  },
];

export { routes };
