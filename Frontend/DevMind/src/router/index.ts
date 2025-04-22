import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SchedulePage from '../pages/SchedulePage.vue';
import SponsorsPage from '../pages/SponsorsPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/programacao',
    name: 'Programacao',
    component: SchedulePage,
  },
  {
    path: '/patrocinadores',
    name: 'Patrocinadores',
    component: SponsorsPage,
  },
  // Adicione outras rotas conforme necessário
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
