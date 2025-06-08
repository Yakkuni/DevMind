// Em router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import PublicLayout from '../layouts/PublicLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

import HomePage from '../pages/HomePage.vue';
import SchedulePage from '../pages/SchedulePage.vue';
import SponsorsPage from '../pages/SponsorsPage.vue';
import LoginPage from '../pages/ADM/LoginPage.vue';
import DashboardPage from '../pages/ADM/DashboardPage.vue';
import CronogramaAdminPage from '../pages/ADM/CronogramaDashboard.vue';
// 1. Importe o componente da página de histórico (crie este arquivo se não existir)
import HistoricoAdminPage from '../pages/ADM/HistoricoAdminPage.vue'; // Ajuste o caminho se necessário
import PalestrantesDashboard from '../components/ADM/PalestrantesDashboard.vue';
import PatrocinadoresDashboard from '../pages/ADM/PatrocinadoresDashboard.vue';
import SobreNosPage from '../pages/SobreNosPage.vue';
import AdminImagens from '../pages/ADM/AdminImagens.vue';
import AdminUsuarios from '../pages/ADM/AdminUsuarios.vue';

const routes = [
  // ... suas rotas públicas ...
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'programacao', name: 'Programacao', component: SchedulePage },
      { path: 'patrocinadores', name: 'Patrocinadores', component: SponsorsPage },
      { path: 'sobreNos', name: 'SobreNos', component: SobreNosPage },
    ],
  },
  {
    path: '/admin',
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
        meta: { requiresAuth: true },
      },
      {
        path: 'cronograma',
        name: 'AdminCronograma',
        component: CronogramaAdminPage,
        meta: { requiresAuth: true },
      },
      // 2. Adicione a nova rota para o histórico aqui
      {
        path: 'historico',
        name: 'AdminHistorico',
        component: HistoricoAdminPage,
        meta: { requiresAuth: true }, // Provavelmente requer autenticação também
      },
      {
        path: 'palestrantes',
        name: 'AdminPalestrantes', // O nome usado em router.push({ name: 'AdminPalestrantes' })
        component: PalestrantesDashboard, // Ajuste o caminho!
        meta: { requiresAuth: true }
      },
      {
        path: 'patrocinadores',
        name: 'AdminPatrocinadores', // O nome usado em router.push({ name: 'AdminPalestrantes' })
        component: PatrocinadoresDashboard, // Ajuste o caminho!
        meta: { requiresAuth: true }
      },
      {
        path: 'imagens',
        name: 'AdminImagens', // O nome usado em router.push({ name: 'AdminImagens' })
        component: AdminImagens,
        meta: { requiresAuth: true }
      },
            {
        path: 'usuarios',
        name: 'AdminUsuarios', // O nome usado em router.push({ name: 'AdminImagens' })
        component: AdminUsuarios,
        meta: { requiresAuth: true }
      }
    ],
  },
  // ... (rota NotFound comentada ou removida) ...
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    return next({ name: 'LoginADM', query: { redirect: to.fullPath } });
  }
  if (to.name === 'LoginADM' && token) {
    return next({ name: 'Dashboard' });
  }
  next();
});

export default router;