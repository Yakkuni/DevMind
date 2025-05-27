<template>
  <div class="admin-resource-dashboard historico-page">
    <header class="dashboard-header"> <h1>Histórico de Alterações</h1>
      </header>

    <div v-if="mensagemErro" class="alert alert-danger">{{ mensagemErro }}</div>

    <div class="card list-card">
      <div class="table-controls" v-if="!isLoading && logEntries.length > 0">
        <div class="pagination-info">
          Exibindo {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, totalEntries) }} de {{ totalEntries }} registros
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
// SEU SCRIPT ATUAL (sem alterações na lógica principal)
import { ref, onMounted, computed } from 'vue';
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
  ip?: string | null;
}

const logEntries = ref<LogEntry[]>([]);
const isLoading = ref(false); // Inicialmente true para carregar ao montar
const mensagemErro = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const totalEntries = ref(0);

const fetchLogEntries = async (page: number = 1) => {
  isLoading.value = true;
  mensagemErro.value = null;
  try {
    const response = await api.get<{ data: LogEntry[], total: number }>('/admin/historico', { // Certifique-se que este endpoint existe e suporta paginação
      params: {
        page: page,
        limit: itemsPerPage.value,
        sortBy: 'timestamp', // Exemplo: ordenar pelos mais recentes
        order: 'desc'
      }
    });
    if (response.data && Array.isArray(response.data.data)) {
      logEntries.value = response.data.data;
      totalEntries.value = response.data.total;
      currentPage.value = page;
    } else {
      throw new Error("Formato de resposta da API inválido.");
    }
  } catch (err: any) {
    console.error("Erro ao carregar histórico:", err);
    mensagemErro.value = `Falha ao carregar histórico: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`;
    logEntries.value = [];
    totalEntries.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const formatarTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
};

const getActionClass = (action: string): string => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('create') || lowerAction.includes('add') || lowerAction.includes('criar')) return 'action-create';
  if (lowerAction.includes('update') || lowerAction.includes('edit') || lowerAction.includes('atualizar')) return 'action-update';
  if (lowerAction.includes('delete') || lowerAction.includes('remove') || lowerAction.includes('deletar')) return 'action-delete';
  if (lowerAction.includes('login')) return 'action-login';
  if (lowerAction.includes('logout')) return 'action-logout';
  return 'action-other';
};

const totalPages = computed(() => {
  return Math.ceil(totalEntries.value / itemsPerPage.value);
});

const irParaPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= totalPages.value && pagina !== currentPage.value) {
    fetchLogEntries(pagina);
  }
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
$cinza-borda: #dee2e6; // Um cinza padrão para bordas
$cinza-fundo-pagina: #f4f6f8;
$cor-sucesso: #198754; // Verde para sucesso
$cor-aviso: #ffc107; // Amarelo para aviso/update
$cor-erro: #dc3545;  // Vermelho para erro/delete
$cor-info: #0dcaf0; // Azul claro para info/login

.historico-page { // Classe específica para esta página
  padding: 1.5rem;
  background-color: $cinza-fundo-pagina;
  min-height: calc(100vh - 60px); // Ajuste conforme altura do header do AdminLayout
}

.dashboard-header {
  display: flex;
  justify-content: space-between; // Mantido, caso adicione botões no futuro
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: $complemento; // Fundo escuro
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba($preto, 0.1);

  h1 {
    color: $branco; // Texto branco
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }
}

.card { // Estilo base para cards
  background-color: $branco;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba($preto, 0.07);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid lighten($cinza-borda, 5%);
}

.list-card {
  // Estilos específicos para o card que contém a lista/tabela, se necessário
}

.alert {
  padding: 1rem 1.5rem; margin-bottom: 1.5rem; border-radius: 8px; font-size: 0.95rem;
  border: 1px solid transparent;
  &.alert-danger { background-color: lighten($cor-erro, 38%); border-color: $cor-erro; color: darken($cor-erro, 20%); }
}

.loading-state, .empty-state {
  text-align: center; padding: 3rem 1rem; color: $complementoCLaro; font-size: 1.1rem;
  min-height: 250px; // Altura mínima para feedback visual
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}

.spinner {
  border: 4px solid rgba($principal, 0.15); border-top-color: $destaque; border-radius: 50%;
  width: 35px; height: 35px; animation: spin 0.7s linear infinite; margin: 0 auto 1rem auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.table-responsive-wrapper { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 0.8rem 1rem; // Padding ajustado
    text-align: left;
    border-bottom: 1px solid $cinza-borda;
    vertical-align: top; // Alinha no topo para melhor leitura de detalhes longos
  }

  th {
    background-color: lighten($principal, 75%); // Fundo do cabeçalho da tabela bem claro
    color: $principal; // Texto do cabeçalho com cor principal
    font-weight: 600;
    white-space: nowrap;
    border-bottom-width: 2px; // Linha mais grossa abaixo do header
    border-color: darken($cinza-borda, 5%);
  }
  
  tr:hover {
    background-color: lighten($principal, 78%); // Hover sutil
  }

  .entity-id {
    font-family: monospace; // Para IDs ficarem mais legíveis
    font-size: 0.85rem;
    color: $complementoCLaro;
  }

  .details-cell {
    max-width: 400px; // Aumentar um pouco
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 0.85rem;
    color: darken($complementoCLaro, 10%);
    pre {
      background-color: $cinza-fundo-pagina; // Fundo do <pre> sutil
      padding: 0.6rem;
      border-radius: 4px;
      max-height: 120px; // Altura um pouco menor
      overflow-y: auto;
      border: 1px solid $cinza-borda;
    }
  }
}

.action-badge {
  padding: 0.3em 0.7em; // Padding ajustado
  border-radius: 4px; // Menos arredondado para um visual mais "badge"
  font-size: 0.75em; // Tamanho da fonte do badge
  font-weight: 700; // Mais forte
  color: $branco;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1; // Para melhor alinhamento vertical do texto
  display: inline-block; // Para o padding funcionar corretamente

  &.action-create { background-color: $cor-sucesso; }
  &.action-update { background-color: $destaque; color: $principal; } // Usando $destaque para update
  &.action-delete { background-color: $cor-erro; }
  &.action-login  { background-color: $cor-info; color: $complemento; } // Usando azul claro
  &.action-logout { background-color: $complementoCLaro; }
  &.action-other  { background-color: lighten($complementoCLaro, 20%); color: $complemento; }
}

.table-controls, .pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0; // Adicionado padding vertical
  margin-bottom: 0; // Removida margem se for o último elemento do card
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.9rem;
  color: $complementoCLaro; // Cor mais suave
}

.pagination-controls {
  margin-top: 1rem; // Adiciona margem acima da paginação se houver tabela
  .btn { // Estilo dos botões de paginação
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    background-color: $branco;
    color: $principal;
    border: 1px solid $principal;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: $principal;
      color: $branco;
      transform: translateY(-1px);
    }
    &:disabled {
      color: $complementoCLaro;
      border-color: $cinza-borda;
      background-color: $cinza-fundo-pagina;
    }
  }
  span {
    margin: 0 0.75rem; // Espaçamento do texto "Página X de Y"
    font-size: 0.9rem;
    color: $complemento;
    font-weight: 500;
  }
}


// Botões Genéricos (Se precisar de algum botão não coberto pelos de paginação)
.btn { /* ... seus estilos de .btn se definidos globalmente ou no AdminDashboardPage ... */ }
// Exemplo:
// .btn {
//   padding: 0.6rem 1.2rem; font-size: 0.9rem; border-radius: 6px; border: none; cursor: pointer;
//   transition: all 0.25s ease; font-weight: 600; display: inline-flex; align-items: center;
//   text-transform: uppercase; letter-spacing: 0.5px;
//   box-shadow: 0 1px 3px rgba($preto, 0.1);

//   &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 3px 7px rgba($preto, 0.15); }
//   &:active:not(:disabled) { transform: translateY(0px); box-shadow: 0 1px 3px rgba($preto, 0.1); }
//   &:disabled { opacity: 0.6; cursor: not-allowed; }

//   &.btn-secondary { background-color: $complementoCLaro; color: $branco; &:hover:not(:disabled) { background-color: darken($complementoCLaro, 10%); } }
// }

// Responsividade da tabela (mantida, pois é uma boa abordagem)
@media (max-width: 768px) {
  .historico-page { padding: 1rem; }
  .dashboard-header {
    flex-direction: column; align-items: stretch; gap: 1rem;
    h1 { font-size: 1.6rem; text-align: center; }
  }
  .card { padding: 1.5rem; }

  .data-table {
    thead { display: none; }
    tr { display: block; margin-bottom: 1rem; border: 1px solid $cinza-borda; border-radius: 6px; box-shadow: 0 2px 4px rgba($preto,0.05); }
    td { display: block; text-align: right; padding-left: 45%; position: relative; border-bottom: 1px dotted lighten($cinza-borda, 5%);
      &::before {
        content: attr(data-label); position: absolute; left: 0.75rem; width: calc(45% - 1.5rem); 
        padding-right: 0.5rem; font-weight: 600; text-align: left; white-space: nowrap; color: $principal;
      }
      &:last-child { border-bottom: none; }
    }
    .details-cell { max-width: none; pre { max-height: 180px; } }
  }
  .table-controls, .pagination-controls {
    flex-direction: column; align-items: stretch;
    .btn { width: 100%; margin-bottom: 0.5rem; &:last-child{ margin-bottom:0; } }
    .pagination-info { margin-bottom: 0.5rem; text-align:center; width:100%;}
  }
}
</style>