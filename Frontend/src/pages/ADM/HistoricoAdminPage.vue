<template>
  <div class="history-dashboard-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Histórico de Alterações</h1>
        <button @click="voltarParaDashboard" class="btn btn-outline-light">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Voltar ao Painel
        </button>
      </div>
    </header>

    <main class="dashboard-main-content">
      <div v-if="globalMessage.text" :class="['global-alert', `alert-${globalMessage.type}`]">
        {{ globalMessage.text }}
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Registros de Atividade</h3>
          <div v-if="!isLoading && logEntries.length > 0" class="pagination-info">
            Exibindo {{ Math.min((currentPage - 1) * itemsPerPage + 1, totalEntries) }} - {{ Math.min(currentPage * itemsPerPage, totalEntries) }} de {{ totalEntries }}
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando histórico...</p>
        </div>
        
        <div v-else-if="logEntries.length === 0" class="empty-state">
          <p>Nenhum registro de histórico foi encontrado.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="history-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Usuário</th>
                <th>Ação</th>
                <th>Entidade</th>
                <th class="text-center">ID Entidade</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in logEntries" :key="entry.id">
                <td data-label="Data/Hora" class="timestamp-cell">{{ formatarTimestamp(entry.timestamp) }}</td>
                <td data-label="Usuário">{{ entry.usuarioNome || entry.usuarioId || 'Sistema' }}</td>
                <td data-label="Ação"><span :class="['action-badge', getActionClass(entry.acao)]">{{ entry.acao }}</span></td>
                <td data-label="Entidade">{{ entry.entidade || '-' }}</td>
                <td data-label="ID da Entidade" class="entity-id-cell">{{ entry.entidadeId || '-' }}</td>
                <td data-label="Detalhes" class="details-cell">
                  <pre v-if="typeof entry.detalhes === 'object'">{{ JSON.stringify(entry.detalhes, null, 2) }}</pre>
                  <span v-else>{{ entry.detalhes || '-' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card-footer" v-if="!isLoading && totalPages > 1">
          <div class="pagination-controls">
            <button @click="irParaPagina(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-secondary">
              Anterior
            </button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="irParaPagina(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-secondary">
              Próxima
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

interface LogEntry {
  id: string | number;
  timestamp: string | Date;
  usuarioId?: string | number | null;
  usuarioNome?: string | null;
  acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | string;
  entidade?: string | null;
  entidadeId?: string | number | null;
  detalhes?: string | Record<string, any> | null;
}

const router = useRouter();
const logEntries = ref<LogEntry[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const totalEntries = ref(0);

const globalMessage = ref<{ text: string | null, type: 'success' | 'error' }>({
  text: null,
  type: 'success',
});

function displayMessage(text: string, type: 'success' | 'error', duration: number = 5000) {
  globalMessage.value = { text, type };
  setTimeout(() => {
    globalMessage.value.text = null;
  }, duration);
}

const fetchLogEntries = async (page: number = 1) => {
  isLoading.value = true;
  globalMessage.value.text = null; // Limpa mensagens anteriores
  try {
    const response = await api.get<{ data: LogEntry[], total: number }>('/admin/historico', {
      params: {
        page: page,
        limit: itemsPerPage.value,
        sortBy: 'timestamp',
        order: 'desc'
      }
    });

    if (response.data && Array.isArray(response.data.data) && typeof response.data.total === 'number') {
      logEntries.value = response.data.data;
      totalEntries.value = response.data.total;
      currentPage.value = page;
    } else {
      throw new Error("Formato de resposta da API inválido.");
    }
  } catch (err: any) {
    console.error("Erro ao carregar histórico:", err);
    let specificMessage = 'Ocorreu um erro ao carregar o histórico.';
    if (err.response) {
      specificMessage = `Falha ao carregar histórico: ${err.response.data?.message || 'Erro do servidor'}`;
    } else if (err.request) {
      specificMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }
    displayMessage(specificMessage, "error");
    logEntries.value = [];
    totalEntries.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const formatarTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return '-';
  try {
    return new Date(timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' });
  } catch (e) {
    return 'Data inválida';
  }
};

const getActionClass = (action: string): string => {
  const lowerAction = String(action || '').toLowerCase();
  if (lowerAction.includes('create')) return 'action-create';
  if (lowerAction.includes('update')) return 'action-update';
  if (lowerAction.includes('delete')) return 'action-delete';
  if (lowerAction.includes('login')) return 'action-login';
  if (lowerAction.includes('logout')) return 'action-logout';
  return 'action-other';
};

const totalPages = computed(() => {
  if (totalEntries.value === 0) return 1;
  return Math.ceil(totalEntries.value / itemsPerPage.value);
});

const irParaPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= totalPages.value && pagina !== currentPage.value) {
    fetchLogEntries(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const voltarParaDashboard = () => {
  router.push({ name: 'Dashboard' });
};

onMounted(() => {
  fetchLogEntries(1);
});
</script>

<style scoped lang="scss">
// Variáveis de tema (reutilizadas do padrão)
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;
$branco: #ffffff;
$cinza-fundo-pagina: #eef0f2;
$texto-escuro-principal: #2d3748;
$borda-card: #e2e8f0;
$cor-sucesso: #38a169;
$cor-erro: #e53e3e;
$cor-aviso: #f59e0b; // Cor de aviso para UPDATE
$cor-info: #3b82f6;  // Cor de info para LOGIN
$cor-neutra: #64748b; // Cor neutra para LOGOUT/OTHER

// Importando ou colando o SCSS padrão
// ======================================

// Estilo Base da Página
.sponsors-dashboard-page, .speakers-dashboard-page, .schedule-dashboard-page, .history-dashboard-page {
  min-height: 100vh;
  background-color: $cinza-fundo-pagina;
  padding-bottom: 3rem;
}

// Cabeçalho da Página
.page-header {
  background: linear-gradient(135deg, $principal 0%, $complemento 100%);
  color: $branco;
  padding: 2rem;
  border-bottom: 5px solid $destaque;
  margin-bottom: 2.5rem;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }
}

// Conteúdo Principal
.dashboard-main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

// Alerta Global
.global-alert {
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  color: $branco;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  
  &.alert-success { background-color: $cor-sucesso; }
  &.alert-error { background-color: $cor-erro; }
}

// Card Principal
.card {
  background-color: $branco;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  border: 1px solid $borda-card;
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $borda-card;
  flex-wrap: wrap; // Permite quebra em telas menores
  gap: 1rem;

  h3 {
    margin: 0;
    color: $principal;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid $borda-card;
  background-color: #f8fafc;
}

// Estados de Carregamento e Vazio
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #718096;
  text-align: center;
  min-height: 300px;
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba($principal, 0.2);
    border-top-color: $destaque;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
}

// Tabela Padrão (será estendida)
.table-responsive { overflow-x: auto; }
table {
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid $borda-card;
    vertical-align: middle;
  }
  thead th {
    background-color: #f8fafc;
    color: $texto-escuro-principal;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background-color: #f9f9fc; }
}
.text-center { text-align: center !important; }

// Botões
.btn {
  padding: 0.7rem 1.4rem; font-size: 0.9rem; border-radius: 6px; border: 2px solid transparent; cursor: pointer;
  transition: all 0.25s ease; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 0.5em;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
.btn-secondary { background-color: #6c757d; color: $branco; border-color: #6c757d; &:hover:not(:disabled) { background-color: darken(#6c757d, 8%); border-color: darken(#6c757d, 8%); } }
.btn-outline-light {
    background-color: transparent;
    border-color: rgba($branco, 0.7);
    color: $branco;
    &:hover:not(:disabled) {
        background-color: rgba($branco, 0.1);
        border-color: $branco;
    }
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

// ESTILOS ESPECÍFICOS PARA A PÁGINA DE HISTÓRICO
// ===============================================

.history-table {
  .timestamp-cell {
    white-space: nowrap;
    color: $texto-escuro-principal;
    font-weight: 500;
  }
  .entity-id-cell {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    color: $cor-neutra;
    text-align: center;
  }
  .details-cell {
    max-width: 400px;
    pre {
      background-color: #f8fafc;
      border: 1px solid $borda-card;
      padding: 0.75rem;
      border-radius: 6px;
      max-height: 200px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 0.85em;
      line-height: 1.5;
    }
  }
}

.action-badge {
  padding: 0.3em 0.7em;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: $branco;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  text-align: center;
  min-width: 70px;
  
  &.action-create { background-color: $cor-sucesso; }
  &.action-update { background-color: $cor-aviso; }
  &.action-delete { background-color: $cor-erro; }
  &.action-login  { background-color: $cor-info; }
  &.action-logout { background-color: $cor-neutra; }
  &.action-other  { background-color: lighten($cor-neutra, 20%); color: $texto-escuro-principal; }
}

.pagination-info {
  font-size: 0.9rem;
  color: $cor-neutra;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  span {
    font-weight: 500;
    color: $texto-escuro-principal;
  }
  .btn { // Botões de paginação usam o .btn-secondary
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}


// Media Queries para Responsividade
@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem 1rem;
    .header-content { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
    h1 { font-size: 1.6rem; }
    .btn-outline-light { align-self: flex-start; }
  }
  .dashboard-main-content { padding: 0 1rem; }
  .card-header { 
    justify-content: center;
    h3 { width: 100%; text-align: center; }
    .pagination-info { text-align: center; }
  }
  .pagination-controls {
    .btn { flex-grow: 1; } // Faz os botões crescerem
  }
}
</style>