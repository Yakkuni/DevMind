<template>
  <div class="admin-dashboard-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Painel Administrativo</h1>
        <p v-if="userData.nome" class="user-greeting">
          Bem-vindo(a), <strong>{{ userData.nome }}</strong>
          <span v-if="userData.cargo"> ({{ userData.cargo }})</span>
        </p>
        <p v-else-if="isLoadingData && !userData.nome" class="user-greeting">Carregando informações...</p>
        <p v-else-if="!userData.nome" class="user-greeting">Não foi possível carregar os dados do usuário.</p>
      </div>
    </header>

    <section class="dashboard-main-content">
      <div class="stats-and-actions">
        <section class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-icon users-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
            <div class="stat-info">
              <h2>{{ isLoadingData ? '...' : (stats.usuarios !== null ? stats.usuarios : '-') }}</h2>
              <p>Administradores</p>
            </div>
          </div>
          <div class="stat-card">
             <div class="stat-icon speakers-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div class="stat-info">
              <h2>{{ isLoadingData ? '...' : (stats.palestrantes !== null ? stats.palestrantes : '-') }}</h2>
              <p>Palestrantes Confirmados</p>
            </div>
          </div>
          <div class="stat-card">
             <div class="stat-icon schedule-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/></svg>
            </div>
            <div class="stat-info">
              <h2>{{ isLoadingData ? '...' : (stats.atividadesCronograma !== null ? stats.atividadesCronograma : '-') }}</h2>
              <p>Atividades no Cronograma</p>
            </div>
          </div>
        </section>

        <section class="dashboard-actions card">
          <h3>Ações Rápidas</h3>
          <button class="btn btn-secondary" @click="irParaGerenciarCronograma">
            Gerenciar Cronograma
          </button>
          <button class="btn btn-secondary" @click="irParaHistorico">
            Ver Histórico de Alterações
          </button>
          <button class="btn btn-primary" v-if="userData.cargo === 'Admin'" @click="irParaGerenciarUsuarios">
            Gerenciar Administradores
          </button>
        </section>
      </div>

      <section class="ticker-config-section card">
        <h3>Configurar Ticker da Página Inicial</h3>
        <div v-if="isLoadingTickerConfig" class="loading-state minimal">
            <div class="spinner small"></div> Carregando configuração do ticker...
        </div>
        <form @submit.prevent="salvarDataTicker" class="ticker-form" v-else>
          <div class="form-group">
            <label for="ticker-date">Texto da Data para o Ticker:</label>
            <input
              type="text"
              id="ticker-date"
              v-model="formTickerData.textoData"
              placeholder="Ex: 25 A 30 DE NOVEMBRO"
              class="form-control"
            />
            <small>Este texto aparecerá no carrossel giratório da página inicial. Ex: [INSIRA A DATA]</small>
          </div>
          <button type="submit" class="btn btn-success" :disabled="isSavingTickerConfig">
            <span v-if="isSavingTickerConfig">Salvando...</span>
            <span v-else>Salvar Data do Ticker</span>
          </button>
          <p v-if="tickerConfigMessage.text" :class="`message ${tickerConfigMessage.type}`">
            {{ tickerConfigMessage.text }}
          </p>
        </form>
      </section>
      <section class="palestrantes-dashboard-section">
        <PalestrantesDashboard />
      </section>
      
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import api from '../../services/api'; // Seu serviço Axios configurado
import { useRouter } from 'vue-router';
import PalestrantesDashboard from '../../components/ADM/PalestrantesDashboard.vue';

const router = useRouter();
const isLoadingData = ref(true); // Para os stats gerais

const userData = reactive({
  nome: '',
  cargo: '',
});

const stats = reactive({
  usuarios: null as number | null,
  palestrantes: null as number | null,
  atividadesCronograma: null as number | null,
});

interface ListItem { id: string; [key: string]: any; }

// --- Estados para Configuração do Ticker ---
const formTickerData = reactive({
  textoData: '',
});
const currentTickerData = ref(''); // Para exibir a data atual salva, se desejar
const isLoadingTickerConfig = ref(false);
const isSavingTickerConfig = ref(false);
const tickerConfigMessage = ref<{ text: string | null, type: 'success' | 'error' | null }>({
  text: null,
  type: null,
});

// --- Funções para Configuração do Ticker ---
async function carregarConfiguracaoTicker() {
  isLoadingTickerConfig.value = true;
  tickerConfigMessage.value = { text: null, type: null };
  try {
    // SUBSTITUA '/api/configuracoes/ticker-date' PELO SEU ENDPOINT REAL
    const response = await api.get<{ textoData: string }>('/api/configuracoes/ticker-date'); 
    if (response.data && typeof response.data.textoData === 'string') {
      formTickerData.textoData = response.data.textoData;
      currentTickerData.value = response.data.textoData;
    } else {
      formTickerData.textoData = '[INSIRA A DATA]'; // Fallback
      currentTickerData.value = '[INSIRA A DATA]';
    }
  } catch (error) {
    console.error("Erro ao carregar configuração do ticker:", error);
    formTickerData.textoData = '[ERRO AO CARREGAR]'; // Indica erro no campo
    tickerConfigMessage.value = { text: "Falha ao carregar data atual do ticker.", type: 'error' };
  } finally {
    isLoadingTickerConfig.value = false;
  }
}

async function salvarDataTicker() {
  isSavingTickerConfig.value = true;
  tickerConfigMessage.value = { text: null, type: null };
  try {
    // SUBSTITUA '/api/configuracoes/ticker-date' PELO SEU ENDPOINT REAL
    await api.put('/api/configuracoes/ticker-date', { textoData: formTickerData.textoData });
    currentTickerData.value = formTickerData.textoData;
    tickerConfigMessage.value = { text: "Data do ticker salva com sucesso!", type: 'success' };

    // Opcional: Disparar um evento global para que HomePage possa atualizar o ticker
    // se ela estiver ouvindo e buscando dados de forma reativa.
    window.dispatchEvent(new CustomEvent('tickerConfigUpdated', { detail: { newDate: formTickerData.textoData }}));

  } catch (error) {
    console.error("Erro ao salvar data do ticker:", error);
    tickerConfigMessage.value = { text: "Falha ao salvar data do ticker.", type: 'error' };
  } finally {
    isSavingTickerConfig.value = false;
  }
}

// --- Função carregarDados (para os stats) ---
const carregarDados = async () => {
  isLoadingData.value = true;
  try {
    const [
      usuarioRes,
      adminUsersRes,
      palestrantesRes,
      cronogramaRes
    ] = await Promise.all([
      api.get('/me'),
      api.get<ListItem[]>('/user'),
      api.get<ListItem[]>('/palestrante'),
      api.get<ListItem[]>('/cronograma')
    ]);
    
    if (usuarioRes.data) {
      userData.nome = usuarioRes.data.nome || 'Administrador';
      userData.cargo = usuarioRes.data.cargo || 'Não definido';
    } else {
      userData.nome = 'Administrador';
      userData.cargo = 'Não definido';
    }

    if (Array.isArray(adminUsersRes.data)) {
      stats.usuarios = adminUsersRes.data.length;
    } else {
      console.warn("API /user não retornou um array.");
      stats.usuarios = null;
    }

    if (Array.isArray(palestrantesRes.data)) {
      stats.palestrantes = palestrantesRes.data.length;
    } else {
      console.warn("API /palestrante não retornou um array.");
      stats.palestrantes = null;
    }

    if (Array.isArray(cronogramaRes.data)) {
      stats.atividadesCronograma = cronogramaRes.data.length;
    } else {
      console.warn("API /cronograma não retornou um array.");
      stats.atividadesCronograma = null;
    }

  } catch (error: any) {
    console.error('Erro ao carregar dados do dashboard:', error);
    if (error.response) {
      console.error("Erro (API) - Dados:", error.response.data, "Status:", error.response.status, "URL:", error.config.url);
    } else if (error.request) {
      console.error("Erro (Rede) - Nenhuma resposta para:", error.config?.url, error.request);
    } else {
      console.error('Erro (Config):', error.message);
    }
    userData.nome = 'Falha ao carregar';
    userData.cargo = '';
    stats.usuarios = null;
    stats.palestrantes = null;
    stats.atividadesCronograma = null;
  } finally {
    isLoadingData.value = false;
  }
};

// --- Funções de Navegação ---
const irParaHistorico = () => { router.push({ name: 'AdminHistorico' }); };
const irParaGerenciarUsuarios = () => { router.push({ name: 'AdminUsuarios' }); };
const irParaGerenciarCronograma = () => { router.push({ name: 'AdminCronograma' }); };

// --- Ciclo de Vida ---
onMounted(() => {
  carregarDados();
  carregarConfiguracaoTicker(); // Carrega a configuração do ticker ao montar
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
$cinza-fundo-pagina: #f0f2f5; 
$texto-escuro-principal: #334155; 
$texto-escuro-secundario: #64748b; 
$borda-card: #e5e7eb; 
$cor-sucesso: #198754; // Verde para sucesso
$cor-erro: #dc3545; // Vermelho para erro

// Estilos gerais do dashboard (mantidos da resposta anterior)
.admin-dashboard-page { min-height: 100vh; background-color: $cinza-fundo-pagina; padding-bottom: 3rem; }
.page-header { background: linear-gradient(135deg, $principal 0%, darken($principal, 5%) 60%, $complemento 100%); color: $branco; padding: 2.5rem 2rem; text-align: center; box-shadow: 0 4px 12px rgba($preto, 0.12); margin-bottom: 2.5rem;
  .header-content { max-width: 1000px; margin: 0 auto; }
  h1 { font-size: 2.5rem; font-weight: 700; margin-top: 0; margin-bottom: 0.5rem; letter-spacing: -0.5px; }
  .user-greeting { font-size: 1.1rem; font-weight: 300; opacity: 0.95; margin-bottom: 0; strong { font-weight: 600; color: $destaque; } }
}
.dashboard-main-content { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.stats-and-actions { display: flex; flex-wrap: wrap; gap: 2rem; margin-bottom: 2.5rem; }
.dashboard-stats { flex: 2; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.8rem; }
.stat-card { background-color: $branco; border-radius: 12px; padding: 1.8rem; display: flex; align-items: center; gap: 1.5rem; box-shadow: 0 5px 20px rgba($preto, 0.06); border: 1px solid $borda-card; transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover { transform: translateY(-6px); box-shadow: 0 10px 25px rgba($preto, 0.08); }
  .stat-icon { padding: 1rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: $branco; flex-shrink: 0; width: 60px; height: 60px;
    &.users-icon { background-color: $principal; } 
    &.speakers-icon { background-color: $destaque; svg { color: $principal; } }
    &.schedule-icon { background-color: $complementoCLaro; }
  }
  .stat-info {
    h2 { font-size: 2.2rem; font-weight: 700; color: $texto-escuro-principal; margin: 0 0 0.2rem 0; min-height: 2.5rem; }
    p { font-size: 0.95rem; color: $texto-escuro-secundario; margin: 0; }
  }
}
.dashboard-actions { flex: 1; min-width: 280px; background-color: $branco; border-radius: 12px; padding: 1.8rem; box-shadow: 0 5px 20px rgba($preto, 0.06); border: 1px solid $borda-card; display: flex; flex-direction: column; gap: 1rem; 
  h3 { font-size: 1.3rem; color: $principal; margin-top: 0; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid $borda-card; font-weight: 600; }
}
.btn-base { padding: 0.8rem 1.5rem; font-size: 0.95rem; border-radius: 8px; border: 2px solid transparent; cursor: pointer; transition: all 0.3s ease; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; box-shadow: 0 2px 5px rgba($preto, 0.08);
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 10px rgba($preto, 0.12); }
  &:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 5px rgba($preto, 0.08); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
.btn-primary { @extend .btn-base; background-color: $destaque; color: $principal; border-color: $destaque; &:hover:not(:disabled) { background-color: darken($destaque, 10%); border-color: darken($destaque, 10%); } }
.btn-secondary { @extend .btn-base; background-color: $principal; color: $branco; border-color: $principal; &:hover:not(:disabled) { background-color: $complemento; border-color: $complemento; } }
.palestrantes-dashboard-section { margin-top: 2.5rem; }


/* Nova Seção: Configurações do Ticker */
.ticker-config-section {
  // Estilos do .card já aplicados
  h3 { // Estilo para o título da seção de ticker
    font-size: 1.3rem;
    color: $principal;
    margin-top: 0;
    margin-bottom: 1.5rem; // Mais espaço antes do formulário
    padding-bottom: 0.75rem;
    border-bottom: 1px solid $borda-card;
    font-weight: 600;
  }
}

.ticker-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .form-group {
    display: flex;
    flex-direction: column;
    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: $complemento;
      font-size: 0.9rem;
    }
    .form-control { // Classe para o input de texto
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid $borda-card;
      border-radius: 6px;
      font-size: 1rem;
      color: $texto-escuro-principal;
      &:focus {
        outline: none;
        border-color: $destaque;
        box-shadow: 0 0 0 2px rgba($destaque, 0.2);
      }
    }
    small {
      font-size: 0.8rem;
      color: $complementoCLaro;
      margin-top: 0.4rem;
    }
  }

  .btn-success { // Estilo para o botão Salvar
    @extend .btn-base; // Reutiliza estilos base de botão
    background-color: $cor-sucesso; // Verde para salvar/sucesso
    color: $branco;
    border-color: $cor-sucesso;
    width: auto; // Para não ocupar 100% da largura
    align-self: flex-start; // Alinha o botão à esquerda

    &:hover:not(:disabled) {
      background-color: darken($cor-sucesso, 10%);
      border-color: darken($cor-sucesso, 10%);
    }
  }

  .message {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    &.success {
      background-color: lighten($cor-sucesso, 45%);
      color: darken($cor-sucesso, 15%);
      border: 1px solid $cor-sucesso;
    }
    &.error {
      background-color: lighten($cor-erro, 35%);
      color: darken($cor-erro, 15%);
      border: 1px solid $cor-erro;
    }
  }
}

.loading-state.minimal { // Estilo para um loader menor
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: $complementoCLaro;
  padding: 1rem 0;
  .spinner.small {
    width: 20px;
    height: 20px;
    border-width: 3px;
    margin-bottom: 0;
  }
}

@media (max-width: 992px) {
  .stats-and-actions { flex-direction: column; }
  .dashboard-stats, .dashboard-actions { flex: none; width: 100%; }
  .dashboard-stats { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
}
@media (max-width: 768px) {
  .page-header { padding: 2rem 1.5rem; h1 { font-size: 2.2rem; } .user-greeting { font-size: 1rem; } }
  .dashboard-stats { grid-template-columns: 1fr; }
  .stat-info h2 { font-size: 1.8rem; }
  .ticker-config-section h3, .dashboard-actions h3 { font-size: 1.2rem; }
}
@media (max-width: 480px) {
  .dashboard-main-content { padding: 0 1rem; }
  .page-header h1 { font-size: 1.8rem; }
  .btn-base { padding: 0.7rem 1rem; font-size: 0.9rem; }
  .ticker-form .btn-success { width: 100%; } // Botão de salvar ocupa largura total
}
</style>