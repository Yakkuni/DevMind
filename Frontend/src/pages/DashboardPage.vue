<template>
  <div class="dashboard-page">
    <header class="dashboard-header">
      <h1>Bem-vindo, {{ user.nome }}</h1>
      <button @click="logout" class="logout-button">Sair</button>
    </header>

    <section class="dashboard-content">
      <p>Este é o seu painel administrativo.</p>
      <!-- Aqui você pode adicionar cards, gráficos, estatísticas, etc. -->
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

interface User {
  id: string;
  nome: string;
  email: string;
}

const user = ref<User>({ id: '', nome: '', email: '' });
const router = useRouter();

async function fetchMe() {
  try {
    const resp = await api.get<User>('/auth/me');
    user.value = resp.data;
  } catch (err) {
    console.error('Não autenticado, redirecionando...', err);
    router.push('/DevmindADM');
  }
}

function logout() {
  localStorage.removeItem('token');
  router.push('/DevmindADM');
}

onMounted(() => {
  fetchMe();
});
</script>

<style scoped lang="scss">
.dashboard-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #2a2f3e;
  color: #fff;

  h1 {
    margin: 0;
    font-size: 1.75rem;
  }

  .logout-button {
    background: #e74c3c;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #c0392b;
    }
  }
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  color: #333;

  p {
    font-size: 1.1rem;
  }
}
</style>
