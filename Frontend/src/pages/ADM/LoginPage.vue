<template>
  <div class="login-page">
    <div class="login-card">
      <img src="@/assets/DevMindIcon.png" alt="Logo DevMind" class="login-logo" />
      <h2 class="login-title">PAINEL DEVMIND</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email" class="input-label">Usuário (Email)</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="seuemail@exemplo.com"
            required
            class="login-input"
            autocomplete="username"
          />
        </div>
        <div class="input-group">
          <label for="password" class="input-label">Senha</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Digite sua senha"
            required
            class="login-input"
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
const isLoading = ref(false); // Estado de carregamento para o botão
const errorMessage = ref<string | null>(null); // Para exibir mensagens de erro
const router = useRouter();

// NOTA: Em um projeto maior, configure uma baseURL para o Axios globalmente
// ou use variáveis de ambiente para a URL da API.
// Ex: axios.defaults.baseURL = 'http://localhost:3000';
const API_URL = 'http://localhost:3000'; // Mantenha configurável para produção

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = null; // Limpa erros anteriores

  try {
    const response = await axios.post(`${API_URL}/login`, { // Usando API_URL
      email: email.value,
      senha: password.value, // 'senha' conforme seu backend espera
    });

    const token = response.data.token;
    if (!token) {
        throw new Error("Token não recebido do servidor.");
    }
    localStorage.setItem('token', token);

    // Valida o token e obtém dados do usuário (opcional, mas boa prática)
    // Se o login já retorna os dados do usuário, este passo pode não ser necessário aqui.
    // Algumas APIs de login já retornam os dados do usuário junto com o token.
    const meResponse = await axios.get(`${API_URL}/auth/me`, { // Usando API_URL
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Usuário logado:', meResponse.data);
    // Redireciona para o dashboard ou para a rota de 'redirect' se existir
    const redirectPath = router.currentRoute.value.query.redirect as string || '/admin/dashboard';
    router.push(redirectPath);

  } catch (error: any) {
    console.error("Erro no login:", error);
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Falha no login. Verifique suas credenciais ou tente mais tarde.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
// Suas variáveis de tema globais
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $complemento; // Fundo da página com a cor mais escura do tema
  padding: 1rem; // Espaçamento para telas menores
}

.login-card {
  background-color: $principal; // Card com a cor principal do tema
  padding: 2.5rem 3rem; // Padding interno do card
  border-radius: 16px; // Bordas mais suaves
  box-shadow: 0 10px 30px rgba($preto, 0.3); // Sombra mais pronunciada
  width: 100%;
  max-width: 400px; // Largura máxima do card
  text-align: center;
  border: 1px solid rgba($complementoCLaro, 0.2); // Borda sutil
}

.login-logo {
  width: 80px; // Tamanho do logo
  height: auto;
  margin-bottom: 1.5rem;
}

.login-title {
  color: $branco;
  font-size: 1.5rem; // Tamanho ajustado
  font-weight: 600; // Peso da fonte
  letter-spacing: 1px; // Espaçamento entre letras
  text-transform: uppercase; // Caixa alta
  margin-bottom: 2.5rem; // Mais espaço abaixo do título
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // Espaçamento entre os grupos de input
}

.input-group {
  position: relative;
  text-align: left; // Alinha a label à esquerda
}

.input-label {
  display: block;
  color: $complementoCLaro;
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
  padding-left: 0.5rem; // Pequeno padding para a label
}

.login-input {
  width: 100%;
  padding: 0.9rem 1.2rem; // Padding interno do input
  background-color: rgba($complemento, 0.5); // Fundo do input
  border: 1px solid $complementoCLaro; // Borda sutil
  border-radius: 8px; // Bordas mais suaves para os inputs
  color: $branco;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;

  &::placeholder {
    color: rgba($branco, 0.4); // Placeholder mais sutil
  }

  &:focus {
    background-color: rgba($complemento, 0.7);
    border-color: $destaque; // Borda com cor de destaque ao focar
    box-shadow: 0 0 0 3px rgba($destaque, 0.3); // Efeito de anel ao focar
  }
}

.login-button {
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 8px; // Consistente com os inputs
  background-color: $destaque; // Botão com cor de destaque
  color: $principal; // Texto do botão com cor principal para contraste
  font-size: 1.05rem;
  font-weight: 700; // Texto do botão em negrito
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba($destaque, 0.25);

  &:hover:not(:disabled) {
    background-color: darken($destaque, 10%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba($destaque, 0.35);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: lighten($destaque, 10%);
  }
}

.error-message {
  color: lighten(red, 15%); // Cor para mensagens de erro
  font-size: 0.875rem;
  margin-top: 1rem; // Espaço acima da mensagem de erro
  min-height: 1.2em; // Para evitar pulo de layout
}

// Responsividade
@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem; // Menos padding em telas muito pequenas
  }
  .login-title {
    font-size: 1.3rem;
    margin-bottom: 2rem;
  }
  .login-input, .login-button {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }
}
</style>