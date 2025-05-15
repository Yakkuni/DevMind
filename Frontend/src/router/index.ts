import { createRouter, createWebHistory } from 'vue-router';
import PublicLayout from '../layouts/PublicLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

import HomePage from '../pages/HomePage.vue';
import SchedulePage from '../pages/SchedulePage.vue';
import SponsorsPage from '../pages/SponsorsPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage,
      },
      {
        path: 'programacao',
        name: 'Programacao',
        component: SchedulePage,
      },
      {
        path: 'patrocinadores',
        name: 'Patrocinadores',
        component: SponsorsPage,
      },
    ],
  },
  {
    path: '/DevmindADM',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'LoginADM',
        component: LoginPage,
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true }, // <- rota protegida
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Proteção de rotas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    return next('/DevmindADM');
  }

  next();
});

export default router;
