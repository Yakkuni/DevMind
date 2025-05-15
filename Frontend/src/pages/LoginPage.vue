<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">LOGIN</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Digite seu usuário..."
            required
            class="login-input"
          />
        </div>
        <div class="input-group">
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Digite sua senha..."
            required
            class="login-input"
          />
        </div>
        <button type="submit" class="login-button">Enviar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

async function handleLogin() {
  if (!email.value || !password.value) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      senha: password.value, // 👈 Corrigido aqui
    });

    const token = response.data.token;
    localStorage.setItem('token', token);

    // Valida o token e obtém dados do usuário
    const me = await axios.get('http://localhost:3000/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Usuário logado:', me.data);
    router.push('/DevMindADM/dashboard');

  } catch (error: any) {
    if (error.response) {
      alert(error.response.data.message || 'Falha no login.');
    } else {
      alert('Erro ao conectar com o servidor.');
    }
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e2430;
}

.login-card {
  background: #2a2f3e;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.login-title {
  color: #fff;
  font-size: 1.75rem;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  position: relative;
}

.login-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 9999px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.3s, background 0.3s;
  background-clip: padding-box;
  position: relative;
  z-index: 1;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.login-input:hover,
.login-input:focus {
  background: rgba(255, 255, 255, 0.05);
  border-image-slice: 1;
  border-width: 2px;
  border-image-source: linear-gradient(90deg, #6d5dfc, #33c2ff);
}

.login-button {
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 9999px;
  background-clip: padding-box;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, border 0.3s;
  background: linear-gradient(90deg, #6d5dfc, #33c2ff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.login-button:hover {
  background: linear-gradient(90deg, #33c2ff, #6d5dfc);
  border: 2px solid rgba(255, 255, 255, 0.2);
}
</style>
