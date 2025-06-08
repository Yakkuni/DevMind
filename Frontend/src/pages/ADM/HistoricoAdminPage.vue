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
          <div v-if="!isLoading && allLogEntries.length > 0" class="pagination-info">
            Exibindo {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, totalEntries) }} de {{ totalEntries }}
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando histórico...</p>
        </div>
        
        <div v-else-if="allLogEntries.length === 0" class="empty-state">
          <p>Nenhum registro de histórico foi encontrado.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="history-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Usuário</th>
                <th>Ação</th>
                <th>Entidade Afetada</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in paginatedLogEntries" :key="entry.id">
                <td data-label="Data/Hora" class="timestamp-cell">{{ formatarTimestamp(entry.data) }}</td>
                <td data-label="Usuário">{{ entry.usuario }}</td>
                <td data-label="Ação"><span :class="['action-badge', getActionClass(entry.acao)]">{{ entry.acao }}</span></td>
                <td data-label="Entidade">{{ entry.entidade }}</td>
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

// Interface ajustada para corresponder ao seu 'Historico' model do backend
interface HistoricoEntry {
  id: string;
  acao: string;
  entidade: string;
  usuario: string;
  data: Date;
}

const router = useRouter();
// allLogEntries vai guardar a lista completa vinda da API
const allLogEntries = ref<HistoricoEntry[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(15); // Itens por página

const globalMessage = ref<{ text: string | null, type: 'success' | 'error' }>({
  text: null, type: 'success',
});

function displayMessage(text: string, type: 'success' | 'error', duration: number = 5000) {
  globalMessage.value = { text, type };
  setTimeout(() => { globalMessage.value.text = null; }, duration);
}

// Função para buscar os dados da API
const fetchHistory = async () => {
  isLoading.value = true;
  globalMessage.value.text = null;
  try {
    // Chamando o endpoint correto e sem parâmetros de paginação
    const response = await api.get<HistoricoEntry[]>('/history');
    
    // Ordena os resultados pela data mais recente
    allLogEntries.value = response.data.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  } catch (err: any) {
    console.error("Erro ao carregar histórico:", err);
    displayMessage("Ocorreu um erro ao carregar o histórico.", "error");
    allLogEntries.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Formata a data para um formato legível
const formatarTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' });
};

// Define a cor do "badge" da ação
const getActionClass = (action: string): string => {
  const lowerAction = String(action || '').toLowerCase();
  if (lowerAction.includes('create') || lowerAction.includes('criou')) return 'action-create';
  if (lowerAction.includes('update') || lowerAction.includes('atualizou')) return 'action-update';
  if (lowerAction.includes('delete') || lowerAction.includes('deletou')) return 'action-delete';
  if (lowerAction.includes('login')) return 'action-login';
  return 'action-other';
};

// --- LÓGICA DE PAGINAÇÃO NO FRONT-END ---

// Propriedade computada para o total de entradas
const totalEntries = computed(() => allLogEntries.value.length);

// Propriedade computada para o total de páginas
const totalPages = computed(() => {
  if (totalEntries.value === 0) return 1;
  return Math.ceil(totalEntries.value / itemsPerPage.value);
});

// Propriedade computada que "fatia" a lista completa para exibir apenas a página atual
const paginatedLogEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allLogEntries.value.slice(start, end);
});

// Função para navegar entre as páginas
const irParaPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= totalPages.value) {
    currentPage.value = pagina;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const voltarParaDashboard = () => {
  router.push({ name: 'Dashboard' });
};

onMounted(() => {
  fetchHistory();
});
</script>

<style scoped lang="scss">
// Variáveis de tema
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;
$branco: #ffffff;
$cinza-fundo-pagina: #eef0f2;
$texto-escuro-principal: #2d3748;
$borda-card: #e2e8f0;
$cor-sucesso: #38a169;
$cor-erro: #e53e3e;
$cor-aviso: #f59e0b;
$cor-info: #3b82f6;
$cor-neutra: #64748b;

// Estilo Base da Página
.history-dashboard-page {
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
  h1 { margin: 0; font-size: 2rem; font-weight: 600; }
}

// Conteúdo Principal e Alertas
.dashboard-main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.global-alert {
  padding: 1rem 1.5rem; margin-bottom: 1.5rem;
  border-radius: 8px; color: $branco; font-weight: 500;
  &.alert-success { background-color: $cor-sucesso; }
  &.alert-error { background-color: $cor-erro; }
}

// Card, Header, Footer
.card {
  background-color: $branco; border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  border: 1px solid $borda-card;
  overflow: hidden;
}
.card-header {
  padding: 1.25rem 1.5rem; display: flex;
  justify-content: space-between; align-items: center;
  border-bottom: 1px solid $borda-card; flex-wrap: wrap; gap: 1rem;
  h3 { margin: 0; color: $principal; font-size: 1.25rem; font-weight: 600; }
}
.card-footer {
  padding: 1rem 1.5rem; border-top: 1px solid $borda-card;
  background-color: #f8fafc;
}

// Estados
.loading-state, .empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 4rem 2rem; color: #718096;
  text-align: center; min-height: 300px;
  .spinner {
    width: 50px; height: 50px; border: 5px solid rgba($principal, 0.2);
    border-top-color: $destaque; border-radius: 50%;
    animation: spin 1s linear infinite; margin-bottom: 1rem;
  }
}

// Tabela
.table-responsive { overflow-x: auto; }
.history-table {
  width: 100%; border-collapse: collapse;
  
  th, td {
    padding: 1rem 1.5rem; text-align: left;
    border-bottom: 1px solid $borda-card;
    vertical-align: middle;
  }

  thead th {
    background-color: #f8fafc; color: $texto-escuro-principal;
    font-weight: 600; font-size: 0.85rem;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background-color: #f9f9fc; }

  // --- INÍCIO DA CORREÇÃO ---
  tbody td {
    // Define uma cor base legível para todas as células
    color: $cor-neutra; 
  }

  .timestamp-cell {
    white-space: nowrap;
    color: $texto-escuro-principal;
    font-weight: 500;
  }

  .usuario-cell {
    color: $texto-escuro-principal;
    font-weight: 500;
  }
  // --- FIM DA CORREÇÃO ---
}

// Badge de Ação
.action-badge {
  padding: 0.3em 0.7em; border-radius: 14px;
  font-size: 0.8rem; font-weight: 600; color: $branco;
  text-transform: uppercase; letter-spacing: 0.5px;
  
  &.action-create { background-color: $cor-sucesso; }
  &.action-update { background-color: $cor-aviso; }
  &.action-delete { background-color: $cor-erro; }
  &.action-login  { background-color: $cor-info; }
  &.action-other  { background-color: $cor-neutra; }
}

// Paginação
.pagination-info { font-size: 0.9rem; color: $cor-neutra; }
.pagination-controls {
  display: flex; justify-content: center;
  align-items: center; gap: 1rem;
  span { font-weight: 500; color: $texto-escuro-principal; }
  .btn { padding: 0.5rem 1rem; font-size: 0.85rem; }
}

// Botões Genéricos
.btn {
  padding: 0.7rem 1.4rem; font-size: 0.9rem; border-radius: 6px;
  border: 2px solid transparent; cursor: pointer; transition: all 0.25s ease;
  font-weight: 600; display: inline-flex; align-items: center; gap: 0.5em;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
.btn-secondary { background-color: #6c757d; color: $branco; border-color: #6c757d; &:hover:not(:disabled) { background-color: darken(#6c757d, 8%); }}
.btn-outline-light {
    background-color: transparent; border-color: rgba($branco, 0.7); color: $branco;
    &:hover:not(:disabled) { background-color: rgba($branco, 0.1); border-color: $branco; }
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>