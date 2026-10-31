import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import { useAuthStore } from "../stores/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: "/register",
      component: RegisterView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: "/dashboard",
      component: DashboardView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.currentUser) {
    await authStore.loadUserFromSession();
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return "/login";
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return "/dashboard";
  }
});

export default router;
