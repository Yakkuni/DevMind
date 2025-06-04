<template>
  <div class="admin-resource-dashboard historico-page">
    <header class="dashboard-header"> <div class="header-content-alt">
        <button @click="voltarParaDashboard" class="btn btn-back" aria-label="Voltar para o Dashboard" v-if="showBackButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Voltar
        </button>
        <h1>Histórico de Alterações</h1>
      </div>
      </header>

    <div v-if="mensagemErro" class="alert alert-danger">
      <p>{{ mensagemErro }}</p>
      <button @click="fetchLogEntries(1)" class="btn btn-sm btn-retry-alert">Tentar Novamente</button>
    </div>

    <div class="card list-card">
      <div class="table-controls" v-if="!isLoading && logEntries.length > 0">
        <div class="pagination-info">
          Exibindo {{ Math.min((currentPage - 1) * itemsPerPage + 1, totalEntries) }} - {{ Math.min(currentPage * itemsPerPage, totalEntries) }} de {{ totalEntries }} registros
        </div>
        </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        Carregando histórico...
      </div>
      <div v-else-if="logEntries.length === 0 && !mensagemErro" class="empty-state">
        Nenhum registro de histórico encontrado.
      </div>
      <div v-else class="table-responsive-wrapper">
        <table class="data-table historico-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Entidade</th>
              <th>ID da Entidade</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in logEntries" :key="entry.id">
              <td data-label="Data/Hora">{{ formatarTimestamp(entry.timestamp) }}</td>
              <td data-label="Usuário">{{ entry.usuarioNome || entry.usuarioId || 'Sistema' }}</td>
              <td data-label="Ação"><span :class="['action-badge', getActionClass(entry.acao)]">{{ entry.acao }}</span></td>
              <td data-label="Entidade">{{ entry.entidade || '-' }}</td>
              <td data-label="ID da Entidade" class="entity-id">{{ entry.entidadeId || '-' }}</td>
              <td data-label="Detalhes" class="details-cell">
                <pre v-if="typeof entry.detalhes === 'object'">{{ JSON.stringify(entry.detalhes, null, 2) }}</pre>
                <span v-else>{{ entry.detalhes || 'N/A' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-controls" v-if="!isLoading && totalPages > 1">
        <button @click="irParaPagina(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-outline">
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="irParaPagina(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-outline">
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api'; // Sua instância Axios configurada

interface LogEntry {
  id: string | number;
  timestamp: string | Date;
  usuarioId?: string | number | null;
  usuarioNome?: string | null;
  acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | string;
  entidade?: string | null;
  entidadeId?: string | number | null;
  detalhes?: string | Record<string, any> | null;
  ip?: string | null;
}

const router = useRouter();
const logEntries = ref<LogEntry[]>([]);
const isLoading = ref(true);
const mensagemErro = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(15); // Ou o valor que seu backend usa como padrão/máximo
const totalEntries = ref(0);

const showBackButton = computed(() => {
  // Verifica se há um histórico de navegação para exibir o botão "Voltar"
  // Isso pode ser mais complexo dependendo da sua lógica de navegação global
  return window.history.length > 1 && router.options.history.state.back;
});

const fetchLogEntries = async (page: number = 1) => {
  isLoading.value = true;
  mensagemErro.value = null;
  try {
    console.log(`Buscando histórico para a página: ${page}`);
    // Certifique-se que '/admin/historico' é o caminho correto no seu backend
    // e que sua instância 'api' do Axios está configurada com baseURL ou proxy.
    const response = await api.get<{ data: LogEntry[], total: number }>('/admin/historico', {
      params: {
        page: page,
        limit: itemsPerPage.value,
        sortBy: 'timestamp', // Ordenar pelos mais recentes primeiro
        order: 'desc'
      }
    });

    console.log("Resposta da API /admin/historico:", response.data);

    if (response.data && Array.isArray(response.data.data) && typeof response.data.total === 'number') {
      logEntries.value = response.data.data;
      totalEntries.value = response.data.total;
      currentPage.value = page;
    } else {
      console.warn("Formato de resposta da API inválido para o histórico:", response.data);
      throw new Error("Formato de resposta da API inválido.");
    }
  } catch (err: any) {
    console.error("Erro detalhado ao carregar histórico:", err);
    let specificMessage = 'Erro desconhecido ao carregar o histórico.';
    if (err.response) {
      specificMessage = `Falha ao carregar histórico (Status: ${err.response.status}): ${err.response.data?.message || 'Erro do servidor'}`;
      if (err.response.status === 401 || err.response.status === 403) {
        specificMessage = "Você não tem permissão para ver o histórico ou sua sessão expirou.";
      } else if (err.response.status === 404) {
        specificMessage = "Endpoint do histórico não encontrado no servidor.";
      }
    } else if (err.request) {
      specificMessage = "Não foi possível conectar ao servidor para buscar o histórico. Verifique sua conexão e se o backend está rodando.";
    } else {
      specificMessage = err.message || specificMessage;
    }
    mensagemErro.value = specificMessage;
    logEntries.value = [];
    totalEntries.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const formatarTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return 'N/A';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  } catch (e) {
    return 'Data inválida';
  }
};

const getActionClass = (action: string): string => {
  const lowerAction = String(action || '').toLowerCase();
  if (lowerAction.includes('create') || lowerAction.includes('add') || lowerAction.includes('criar')) return 'action-create';
  if (lowerAction.includes('update') || lowerAction.includes('edit') || lowerAction.includes('atualizar')) return 'action-update';
  if (lowerAction.includes('delete') || lowerAction.includes('remove') || lowerAction.includes('deletar')) return 'action-delete';
  if (lowerAction.includes('login')) return 'action-login';
  if (lowerAction.includes('logout')) return 'action-logout';
  return 'action-other';
};

const totalPages = computed(() => {
  if (totalEntries.value === 0 || itemsPerPage.value <= 0) return 0;
  return Math.ceil(totalEntries.value / itemsPerPage.value);
});

const irParaPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= totalPages.value && pagina !== currentPage.value) {
    fetchLogEntries(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo ao mudar de página
  }
};

const voltarParaDashboard = () => {
  router.push({ name: 'Dashboard' }); // Certifique-se que esta rota está nomeada como 'Dashboard'
};

onMounted(() => {
  fetchLogEntries(1);
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
$cinza-borda: #ccd1d9;
$cinza-fundo-pagina: #f4f6f8;
$cor-sucesso: #198754; 
$cor-aviso: #ffc107; 
$cor-erro: #dc3545;  
$cor-info: #0dcaf0; 
$texto-primario: #2d3748;
$texto-secundario: #4a5568;

.historico-page { 
  padding: 1.5rem;
  background-color: $cinza-fundo-pagina;
  min-height: calc(100vh - 60px); 
}

.dashboard-header {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 2.5rem;
  padding: 1.25rem 1.5rem;
  background-color: $complemento; 
  color: $branco;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba($preto, 0.1);

  .header-content-alt {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  h1 {
    color: $branco; 
    font-size: 1.7rem;
    font-weight: 600;
    margin: 0;
  }
}
.btn-back {
  background-color: rgba($branco, 0.1);
  color: $branco;
  border: 1px solid rgba($branco, 0.3);
  padding: 0.6rem 1rem; 
  font-weight: 500; 
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; 
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  svg { fill: $branco; transition: fill 0.2s ease; width: 18px; height: 18px;}

  &:hover {
    background-color: rgba($branco, 0.2);
    border-color: $branco;
  }
}

.card { 
  background-color: $branco;
  border-radius: 10px; 
  box-shadow: 0 4px 12px rgba($preto, 0.06); 
  padding: 2rem;
  margin-bottom: 2.5rem; 
  border: 1px solid $cinza-borda;
}

.alert {
  padding: 0.9rem 1.25rem; margin-bottom: 1.5rem; border-radius: 8px; font-size: 0.9rem;
  border-width: 1px; border-style: solid;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.alert-danger { background-color: lighten($cor-erro, 35%); border-color: darken($cor-erro,5%); color: darken($cor-erro, 25%); }
  .btn-retry-alert {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    margin-left: 1rem;
    background-color: $cor-erro;
    color: $branco;
    border: 1px solid darken($cor-erro, 10%);
    border-radius: 4px;
    &:hover {
        background-color: darken($cor-erro, 10%);
    }
  }
}

.loading-state, .empty-state { 
  text-align: center; padding: 3rem 1rem; color: $complementoCLaro; font-size: 1.1rem;
  min-height: 250px; 
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}

.spinner {
  border: 3px solid rgba($principal, 0.2); 
  border-top-color: $destaque; border-radius: 50%;
  width: 30px; height: 30px; animation: spin 0.7s linear infinite; margin: 0 auto 1rem auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.table-responsive-wrapper { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse; 
  font-size: 0.9rem; 

  th, td {
    padding: 0.9rem 1.1rem; 
    text-align: left;
    border-bottom: 1px solid $cinza-borda;
    vertical-align: top; 
    color: $texto-secundario; 
  }

  th {
    background-color: lighten($principal, 78%); 
    color: $principal; 
    font-weight: 600;
    white-space: nowrap;
    border-bottom-width: 2px; 
    border-color: $principal; 
  }
  
  tr:hover { 
    background-color: lighten($principal, 82%); 
  }

  .entity-id {
    font-family: monospace; 
    font-size: 0.85rem;
    color: $complementoCLaro;
    word-break: break-all; // Para IDs longos quebrarem
  }

  .details-cell {
    max-width: 380px; 
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 0.875rem; 
    color: $texto-secundario;
    pre {
      background-color: $cinza-fundo-pagina; 
      padding: 0.75rem; 
      border-radius: 6px; 
      max-height: 150px; 
      overflow-y: auto;
      border: 1px solid $cinza-borda;
      font-size: 0.8rem; 
      line-height: 1.4;
    }
  }
}

.action-badge {
  padding: 0.35em 0.75em; 
  border-radius: 4px; 
  font-size: 0.8em; 
  font-weight: 600; 
  color: $branco;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2; 
  display: inline-block; 

  &.action-create { background-color: $cor-sucesso; }
  &.action-update { background-color: $destaque; color: $principal; } 
  &.action-delete { background-color: $cor-erro; }
  &.action-login  { background-color: $cor-info; color: $complemento; } 
  &.action-logout { background-color: $complementoCLaro; }
  &.action-other  { background-color: lighten($complementoCLaro, 15%); color: $complemento; }
}

.table-controls { // Container para info de paginação e filtros
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0 1rem 0; // Adicionado padding abaixo
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid $cinza-borda; // Separador antes da tabela
  margin-bottom: 1rem; // Espaço antes da tabela
}

.pagination-info {
  font-size: 0.9rem;
  color: $complementoCLaro; 
}

.pagination-controls {
  margin-top: 1.5rem; 
  display: flex;
  justify-content: center; // Centraliza os controles de paginação
  align-items: center;
  gap: 0.5rem; // Gap entre os botões e o texto

  .btn.btn-outline { // Estilo específico para botões de paginação
    padding: 0.5rem 0.9rem; 
    font-size: 0.8rem;
    font-weight: 500; 
    background-color: $branco;
    color: $principal;
    border: 1px solid $cinza-borda; 
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: lighten($principal, 75%);
      border-color: $principal;
      color: $principal;
      transform: translateY(-1px);
    }
    &:disabled {
      color: lighten($complementoCLaro, 10%);
      border-color: $cinza-borda;
      background-color: $cinza-fundo-pagina;
    }
  }
  span { // "Página X de Y"
    margin: 0 0.5rem; 
    font-size: 0.9rem;
    color: $complemento;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .historico-page { padding: 1rem; }
  .dashboard-header {
    flex-direction: column; align-items: stretch; gap: 1rem;
    .header-content-alt { justify-content: center; } 
    h1 { font-size: 1.6rem; text-align: center; }
  }
  .card { padding: 1.5rem; }
  .list-card h2 { font-size: 1.3rem; }

  .data-table {
    thead { display: none; }
    tr { display: block; margin-bottom: 1rem; border: 1px solid $cinza-borda; border-radius: 8px; box-shadow: 0 2px 6px rgba($preto,0.05); padding: 0.8rem; }
    td { 
      display: grid;
      grid-template-columns: 90px 1fr; // Label com largura um pouco menor
      align-items: center; 
      text-align: left; 
      padding: 0.7rem 0; 
      border-bottom: 1px dotted lighten($cinza-borda, 8%);
      font-size: 0.9rem; 

      &::before {
        content: attr(data-label); 
        font-weight: 600; 
        color: $principal;
        padding-right: 0.5rem;
        white-space: nowrap;
        font-size: 0.8rem; // Label um pouco menor
      }
      &:last-child { border-bottom: none; padding-bottom: 0; }
      
      & > * { 
         justify-self: start; 
         max-width: 100%; 
      }
      &.actions-cell { 
        grid-template-columns: 1fr; 
        justify-items: end; 
        padding-top: 0.7rem; 
        &::before { display: none;} 
      }
      &.details-cell {
        grid-template-columns: 1fr; 
        &::before { display: block; margin-bottom: 0.3rem; grid-column: 1 / -1;}
        pre, span { grid-column: 1 / -1; }
      }
       &.entity-id { 
        word-break: break-all;
      }
    }
  }
  .table-controls {
    justify-content: center; // Centraliza info de paginação em mobile
    .pagination-info { margin-bottom: 0.5rem; text-align:center; width:100%;}
  }
  .pagination-controls {
    flex-direction: column; align-items: stretch;
    .btn { width: 100%; margin: 0.25rem 0; } // Botões empilhados
  }
}
</style>