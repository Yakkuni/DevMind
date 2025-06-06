<template>
  <div class="admin-dashboard-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Painel Administrativo DevMind</h1>
        <p v-if="userData.nome" class="user-greeting">
          Bem-vindo(a), <strong>{{ userData.nome }}</strong>
          <span v-if="userData.cargo"> ({{ userData.cargo }})</span>
        </p>
        <p v-else-if="isLoadingData && !userData.nome" class="user-greeting">Carregando informações...</p>
        <p v-else-if="!userData.nome" class="user-greeting">Não foi possível carregar os dados do usuário.</p>
      </div>
    </header>

    <main class="dashboard-main-content">
      <section class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon users-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="stat-info">
            <h2>{{ isLoadingData ? '...' : (stats.usuarios !== null ? stats.usuarios : '-') }}</h2>
            <p>Administradores</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon speakers-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.05 10.05L12 6.05l-4.05 4c-.5.5-1.3.5-1.8 0s-.5-1.3 0-1.8l5-5c.45-.45 1.15-.5 1.65-.1l.1.1 5 5c.5.5.5 1.3 0 1.8s-1.3.5-1.8 0zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="stat-info">
            <h2>{{ isLoadingData ? '...' : (stats.palestrantes !== null ? stats.palestrantes : '-') }}</h2>
            <p>Palestrantes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon schedule-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/></svg>
          </div>
          <div class="stat-info">
            <h2>{{ isLoadingData ? '...' : (stats.atividadesCronograma !== null ? stats.atividadesCronograma : '-') }}</h2>
            <p>Atividades Agendadas</p>
          </div>
        </div>
      </section>

      <section class="dashboard-actions card">
        <h3>Ações Rápidas</h3>
        <button class="btn btn-primary" v-if="userData.cargo === 'Admin'" @click="irParaGerenciarUsuarios">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05C16.44 14.69 17 15.77 17 17v2h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          Gerenciar Administradores
        </button>
        <button class="btn btn-secondary" @click="irParaGerenciarPalestrantes">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          Gerenciar Palestrantes
        </button>
        <button class="btn btn-secondary" @click="irParaGerenciarCronograma">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/></svg>
          Gerenciar Cronograma
        </button>
        <button class="btn btn-secondary" @click="irParaGerenciarPatrocinadores">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c2.14-.46 3.5-1.78 3.5-3.85 0-2.34-1.71-3.47-4.2-4.1z"/></svg>
            Gerenciar Patrocinadores
        </button>
        <button class="btn btn-secondary" @click="irParaHistorico">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.77-1.28l-3.52-2.09V8z"/></svg>
          Ver Histórico
        </button>
        <button class="btn btn-outline-destaque" @click="verPaginaPrincipal">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"/></svg>
          Ver Site Principal
        </button>
      </section>

      <section class="ticker-config-section card">
        <h3>Configurar Ticker da Homepage</h3>
        <div v-if="isLoadingTickerConfig" class="loading-state minimal">
            <div class="spinner small"></div> Carregando...
        </div>
        <form @submit.prevent="salvarDataTicker" class="ticker-form" v-else>
          <div class="form-group">
            <label for="ticker-date">Texto da Data (Ex: 25 A 30 DE NOV)</label>
            <input
              type="text"
              id="ticker-date"
              v-model="formTickerData.textoData"
              placeholder="DEVMIND 2024"
              class="form-control"
            />
            <small>Este texto aparecerá no ticker da página inicial.</small>
          </div>
          <button type="submit" class="btn btn-success" :disabled="isSavingTickerConfig">
            <span v-if="isSavingTickerConfig">Salvando...</span>
            <span v-else>Salvar Texto do Ticker</span>
          </button>
          <p v-if="tickerConfigMessage.text" :class="`message ${tickerConfigMessage.type}`">
            {{ tickerConfigMessage.text }}
          </p>
        </form>
      </section>
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import api from '../../services/api'; 
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoadingData = ref(true); 

const userData = reactive({
  nome: '',
  cargo: '',
});

const stats = reactive({
  usuarios: null as number | null,
  palestrantes: null as number | null,
  atividadesCronograma: null as number | null,
});

interface ListItem { id: string | number; [key: string]: any; }
interface CountResponse { count: number; }

const formTickerData = reactive({ textoData: '' });
const isLoadingTickerConfig = ref(false);
const isSavingTickerConfig = ref(false);
const tickerConfigMessage = ref<{ text: string | null, type: 'success' | 'error' | null }>({
  text: null,
  type: null,
});

async function carregarConfiguracaoTicker() {
  isLoadingTickerConfig.value = true;
  tickerConfigMessage.value = { text: null, type: null };
  try {
    const response = await api.get<{ textoData: string }>('/api/configuracoes/ticker'); 
    if (response.data && typeof response.data.textoData === 'string') {
      formTickerData.textoData = response.data.textoData;
    } else {
      formTickerData.textoData = '[DEFINA A DATA DO EVENTO]';
    }
  } catch (error) {
    console.error("Erro ao carregar config do ticker:", error);
    formTickerData.textoData = '[ERRO AO CARREGAR]';
    tickerConfigMessage.value = { text: "Falha ao carregar config do ticker.", type: 'error' };
  } finally {
    isLoadingTickerConfig.value = false;
  }
}

async function salvarDataTicker() {
  isSavingTickerConfig.value = true;
  tickerConfigMessage.value = { text: null, type: null };
  try {
    await api.put('/api/configuracoes/ticker', { textoData: formTickerData.textoData });
    tickerConfigMessage.value = { text: "Configuração do ticker salva!", type: 'success' };
    window.dispatchEvent(new CustomEvent('tickerConfigUpdated', { detail: { newDate: formTickerData.textoData }}));
  } catch (error) {
    console.error("Erro ao salvar config do ticker:", error);
    tickerConfigMessage.value = { text: "Falha ao salvar config do ticker.", type: 'error' };
  } finally {
    isSavingTickerConfig.value = false;
  }
}

const carregarDados = async () => {
  isLoadingData.value = true;
  try {
    const [
      usuarioRes,
      adminUsersRes,
      palestrantesCountRes, // Nome da variável reflete que esperamos uma contagem
      cronogramaRes
    ] = await Promise.all([
      api.get('/auth/me'),               // Para dados do usuário logado (requer auth)
      api.get<ListItem[]>('/user'),      // Lista de administradores (requer auth)
      api.get<CountResponse>('/palestrante'), // Rota dedicada para contagem (requer auth)
      api.get<ListItem[]>('/cronograma')   // Lista de atividades (não requer auth no seu exemplo de rotas)
    ]);
    
    // Processa dados do usuário logado
    if (usuarioRes.data && typeof usuarioRes.data === 'object' && usuarioRes.data !== null && 'nome' in usuarioRes.data) {
      userData.nome = usuarioRes.data.nome || 'Admin';
      userData.cargo = usuarioRes.data.cargo || 'Master';
    } else {
       console.warn("API /me não retornou dados do usuário esperados:", usuarioRes.data);
      userData.nome = 'Admin'; // Fallback
      userData.cargo = 'Master';
    }

    // Processa contagem de Administradores (da rota /user)
    console.log("Resposta de /user:", adminUsersRes.data);
    if (Array.isArray(adminUsersRes.data)) {
      stats.usuarios = adminUsersRes.data.length;
    } else {
      console.warn("API /user não retornou um array. Não foi possível contar os administradores.");
      stats.usuarios = null;
    }

    // Processa contagem de Palestrantes (da rota /palestrante/count)
    console.log("Resposta de /palestrante/count:", palestrantesCountRes.data);
    if (palestrantesCountRes.data && typeof palestrantesCountRes.data.count === 'number') {
      stats.palestrantes = palestrantesCountRes.data.count;
    } else {
      // Se /palestrante/count falhar ou não existir, tenta /palestrante e conta.
      // Isso só deve acontecer se você não conseguir implementar /palestrante/count no backend.
      console.warn("API /palestrante/count não retornou { count: number }. Tentando GET /palestrante para contagem. Recebido de /palestrante/count:", palestrantesCountRes.data);
      try {
        const palestrantesListRes = await api.get<ListItem[]>('/palestrante');
        if (Array.isArray(palestrantesListRes.data)) {
            stats.palestrantes = palestrantesListRes.data.length;
            console.log("Contagem de palestrantes obtida de GET /palestrante (lista):", stats.palestrantes);
        } else {
            console.warn("API /palestrante (lista) também não retornou um array.");
            stats.palestrantes = null;
        }
      } catch (listError) {
          console.error("Erro ao tentar buscar lista de palestrantes como fallback:", listError);
          stats.palestrantes = null;
      }
    }

    // Processa contagem de Atividades no Cronograma (da rota /cronograma)
    console.log("Resposta de /cronograma:", cronogramaRes.data);
    if (Array.isArray(cronogramaRes.data)) {
      stats.atividadesCronograma = cronogramaRes.data.length;
    } else {
      console.warn("API /cronograma não retornou um array. Não foi possível contar as atividades.");
      stats.atividadesCronograma = null;
    }

  } catch (error: any) {
    console.error('Erro ao carregar dados do dashboard:', error);
    if (error.isAxiosError && error.config) {
      console.error("Falha na requisição para:", error.config.url);
    }
    if (error.response) {
      console.error("Erro (API) - Dados:", error.response.data, "Status:", error.response.status);
    } else if (error.request) {
      console.error("Erro (Rede) - Nenhuma resposta recebida. Request:", error.request);
    } else {
      console.error('Erro (Configuração/Script):', error.message);
    }
    // Reseta todos os dados em caso de erro
    userData.nome = 'Falha';
    userData.cargo = '';
    stats.usuarios = null;
    stats.palestrantes = null;
    stats.atividadesCronograma = null;
  } finally {
    isLoadingData.value = false;
  }
};

const irParaHistorico = () => { router.push({ name: 'AdminHistorico' }); };
const irParaGerenciarUsuarios = () => { router.push({ name: 'AdminUsuarios' }); };
const irParaGerenciarCronograma = () => { router.push({ name: 'AdminCronograma' }); };
const irParaGerenciarPalestrantes = () => { router.push({ name: 'AdminPalestrantes' }); };
// NOVA FUNÇÃO PARA NAVEGAÇÃO
const irParaGerenciarPatrocinadores = () => { router.push({ name: 'AdminPatrocinadores' }); };
const verPaginaPrincipal = () => {
  const routeData = router.resolve({ name: 'Home' });
  window.open(routeData.href, '_blank');
};

onMounted(() => {
  carregarDados();
  carregarConfiguracaoTicker();
});
</script>

<style scoped lang="scss">
// Suas variáveis de tema
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$cinza-fundo-pagina: #eef0f2; 
$texto-escuro-principal: #2d3748; 
$texto-escuro-secundario: #718096; 
$borda-card: #e2e8f0; 
$cor-sucesso: #38a169; 
$cor-erro: #e53e3e; 

.admin-dashboard-page { min-height: 100vh; background-color: $cinza-fundo-pagina; padding-bottom: 3rem; }
.page-header { background: linear-gradient(135deg, $principal 0%, $complemento 100%); color: $branco; padding: 3rem 2rem; text-align: center; margin-bottom: 2.5rem; border-bottom: 5px solid $destaque; 
  .header-content { max-width: 900px; margin: 0 auto; }
  h1 { font-size: 2.2rem; font-weight: 700; margin-top: 0; margin-bottom: 0.4rem; text-shadow: 1px 1px 3px rgba($preto, 0.3); }
  .user-greeting { font-size: 1.05rem; font-weight: 400; opacity: 0.9; margin-bottom: 0; strong { font-weight: 600; color: $destaque; } }
}
.dashboard-main-content { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.card { background-color: $branco; border-radius: 10px; padding: 1.8rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); border: 1px solid $borda-card; margin-bottom: 2rem; }
.stats-and-actions { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2.5rem;
  @media (max-width: 992px) { grid-template-columns: 1fr; }
}
.dashboard-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
.stat-card { padding: 1.5rem; display: flex; align-items: center; gap: 1.2rem; transition: transform 0.25s ease, box-shadow 0.25s ease;
  &:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08); }
  .stat-icon { padding: 0.9rem; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: $branco; flex-shrink: 0; width: 56px; height: 56px; svg { width: 28px; height: 28px; } 
    &.users-icon { background-color: $principal; } 
    &.speakers-icon { background-color: $destaque; svg { color: $principal; } }
    &.schedule-icon { background-color: $complementoCLaro; }
  }
  .stat-info {
    h2 { font-size: 2rem; font-weight: 700; color: $texto-escuro-principal; margin: 0 0 0.1rem 0; min-height: 2.2rem; }
    p { font-size: 0.9rem; color: $texto-escuro-secundario; margin: 0; }
  }
}
.dashboard-actions { display: flex; flex-direction: column; gap: 1rem; 
  h3 { font-size: 1.2rem; color: $principal; margin-top: 0; margin-bottom: 1.2rem; padding-bottom: 0.7rem; border-bottom: 1px solid $borda-card; font-weight: 600; }
  .btn { margin-bottom: 0.75rem; &:last-child { margin-bottom: 0; } }
}
.btn-base { padding: 0.75rem 1.25rem; font-size: 0.9rem; border-radius: 6px; border: 2px solid transparent; cursor: pointer; transition: all 0.25s ease; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; line-height: 1.5; 
  svg { margin-right: 0.5em; vertical-align: middle; width:16px; height:16px; } 
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 8px rgba($preto, 0.1); }
  &:active:not(:disabled) { transform: translateY(0px); box-shadow: 0 1px 3px rgba($preto, 0.08); }
  &:disabled { opacity: 0.65; cursor: not-allowed; background-color: $complementoCLaro !important; border-color: $complementoCLaro !important; color: $branco !important; }
}
.btn-primary { @extend .btn-base; background-color: $destaque; color: $principal; border-color: $destaque; &:hover:not(:disabled) { background-color: darken($destaque, 8%); border-color: darken($destaque, 8%); } }
.btn-secondary { @extend .btn-base; background-color: $principal; color: $branco; border-color: $principal; &:hover:not(:disabled) { background-color: $complemento; border-color: $complemento; } }
.btn-success { @extend .btn-base; background-color: $cor-sucesso; color: $branco; border-color: $cor-sucesso; width: auto; align-self: flex-start; &:hover:not(:disabled) { background-color: darken($cor-sucesso, 10%); border-color: darken($cor-sucesso, 10%); } }
.btn-outline-destaque { @extend .btn-base; background-color: transparent; color: $destaque; border-color: $destaque; &:hover:not(:disabled) { background-color: rgba($destaque, 0.1); color: darken($destaque, 10%); } }
.ticker-config-section { h3 { font-size: 1.2rem; color: $principal; margin-top: 0; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid $borda-card; font-weight: 600; } }
.ticker-form { display: flex; flex-direction: column; gap: 1.2rem; 
  .form-group { display: flex; flex-direction: column; 
    label { margin-bottom: 0.5rem; font-weight: 500; color: $complemento; font-size: 0.9rem; }
    .form-control { width: 100%; padding: 0.8rem 1rem; border: 1px solid $borda-card; border-radius: 6px; font-size: 1rem; color: $texto-escuro-principal;
      &:focus { outline: none; border-color: $destaque; box-shadow: 0 0 0 3px rgba($destaque, 0.2); }
    }
    small { font-size: 0.8rem; color: $complementoCLaro; margin-top: 0.4rem; }
  }
  .message { margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.9rem;
    &.success { background-color: lighten($cor-sucesso, 45%); color: darken($cor-sucesso, 15%); border: 1px solid darken($cor-sucesso, 5%); }
    &.error { background-color: lighten($cor-erro, 38%); color: darken($cor-erro, 15%); border: 1px solid darken($cor-erro, 5%); }
  }
}
.loading-state.minimal { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: $complementoCLaro; padding: 1rem 0;
  .spinner.small { width: 20px; height: 20px; border-width: 3px; margin-bottom: 0; border-top-color: $destaque; border-left-color: $destaque; }
}
@media (max-width: 992px) { .stats-and-actions { grid-template-columns: 1fr; .dashboard-stats { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); } } }
@media (max-width: 768px) {
  .page-header { padding: 2rem 1.5rem; h1 { font-size: 1.8rem; } .user-greeting { font-size: 0.95rem; } } 
  .dashboard-stats { grid-template-columns: 1fr; } 
  .stat-info h2 { font-size: 1.9rem; } 
  .ticker-config-section h3, .dashboard-actions h3 { font-size: 1.1rem; }
}
@media (max-width: 480px) {
  .admin-dashboard-page { padding-bottom: 2rem; }
  .dashboard-main-content { padding: 0 1rem; }
  .page-header { padding: 1.5rem 1rem; h1 { font-size: 1.6rem; }}
  .btn-base { padding: 0.7rem 1rem; font-size: 0.85rem; svg { width:14px; height:14px; margin-right: 0.4em;} }
  .ticker-form .btn-success { width: 100%; } 
  .stat-card { flex-direction: column; align-items: flex-start; gap: 0.8rem; .stat-icon {margin-bottom: 0.5rem;} }
}
</style>