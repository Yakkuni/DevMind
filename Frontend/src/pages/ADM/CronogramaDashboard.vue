<template>
  <div class="admin-resource-dashboard cronograma-dashboard">
    <header class="page-header-alt">
      <div class="header-content-alt">
        <button @click="voltarParaDashboard" class="btn btn-back" aria-label="Voltar para o Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Voltar
        </button>
        <h1>Gerenciar Cronograma</h1>
      </div>
      <button @click="abrirFormularioNovaAtividade" class="btn btn-primary btn-add-new">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Adicionar Atividade
      </button>
    </header>

    <div v-if="mensagemGlobal.text" :class="['alert', `alert-${mensagemGlobal.type}`]">{{ mensagemGlobal.text }}</div>

    <div v-if="mostrarFormulario" class="card form-card">
      <h2>{{ formAtividade.id ? 'Editar Atividade' : 'Nova Atividade no Cronograma' }}</h2>
      <form @submit.prevent="salvarAtividade" class="resource-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="form-titulo">Título da Atividade*</label>
            <input id="form-titulo" type="text" v-model="formAtividade.titulo" required placeholder="Ex: Palestra de Abertura" />
          </div>
          <div class="form-group">
            <label for="form-tipo">Tipo da Atividade*</label>
            <select id="form-tipo" v-model="formAtividade.tipo" required>
              <option disabled value="">Selecione um tipo</option>
              <option value="Palestra">Palestra</option>
              <option value="Keynote">Keynote</option>
              <option value="Workshop">Workshop</option>
              <option value="Painel">Painel de Discussão</option>
              <option value="CoffeeBreak">Coffee Break</option>
              <option value="Abertura">Abertura</option>
              <option value="Encerramento">Encerramento</option>
              <option value="Networking">Networking</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="form-data">Data*</label>
            <input id="form-data" type="date" v-model="formAtividade.data" required />
          </div>
          <div class="form-group">
            <label for="form-horaInicio">Hora de Início*</label>
            <input id="form-horaInicio" type="time" v-model="formAtividade.horaInicio" required />
          </div>
          <div class="form-group">
            <label for="form-horaFim">Hora de Fim <small>(Opcional, se aplicável)</small></label>
            <input id="form-horaFim" type="time" v-model="formAtividade.horaFim" />
          </div>
          <div class="form-group">
            <label for="form-palestranteId">Responsável/Palestrante <small>(Opcional)</small></label>
            <select id="form-palestranteId" v-model="formAtividade.palestranteId">
              <option value="">Nenhum específico / Organização</option>
              <option v-for="p in palestrantesDisponiveis" :key="p.id" :value="p.id">
                {{ p.nome }}
              </option>
            </select>
            <small v-if="isLoadingPalestrantes">Carregando palestrantes...</small>
          </div>
          <div class="form-group">
            <label for="form-local">Local <small>(Opcional)</small></label>
            <input id="form-local" type="text" v-model="formAtividade.local" placeholder="Ex: Auditório Principal" />
          </div>
          <div class="form-group form-group-full">
            <label for="form-descricao">Descrição <small>(Opcional)</small></label>
            <textarea id="form-descricao" v-model="formAtividade.descricao" rows="3" placeholder="Detalhes adicionais sobre a atividade"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="fecharFormulario" :disabled="isSaving">
            Cancelar
          </button>
          <button type="submit" class="btn btn-success" :disabled="isSaving">
            <span v-if="isSaving">Salvando...</span>
            <span v-else>{{ formAtividade.id ? 'Salvar Alterações' : 'Criar Atividade' }}</span>
          </button>
        </div>
      </form>
    </div>

    <div class="card list-card">
      <h2>Cronograma Atual ({{ atividades.length }} atividades)</h2>
      <div v-if="isLoadingAtividades" class="loading-state">
        <div class="spinner"></div> Carregando atividades...
      </div>
      <div v-else-if="!groupedSortedActivities || Object.keys(groupedSortedActivities).length === 0 && !mensagemGlobal.text" class="empty-state">
        Nenhuma atividade cadastrada. Adicione a primeira!
      </div>
      <div v-else>
        <div v-for="(atividadesDoDia, dataISO) in groupedSortedActivities" :key="dataISO" class="day-group">
          <h3>{{ formatarDataParaExibicao(dataISO) }}</h3>
          <ul class="activity-list">
            <li v-for="atividade in atividadesDoDia" :key="atividade.id" class="activity-item">
              <div class="activity-main-info">
                <div class="activity-time-type">
                  <span class="time">{{ formatarHora(atividade.horario) }}
                    <template v-if="atividade.horaFim"> - {{ atividade.horaFim }}</template>
                  </span>
                  <span class="type" v-if="atividade.tipo">{{ atividade.tipo }}</span>
                </div>
                <div class="activity-presentation">
                  <h4 class="activity-title">{{ atividade.nome }}</h4>
                  <p v-if="atividade.conduzidoPor" class="activity-speaker">
                    <i class="mdi mdi-account-voice"></i> {{ atividade.conduzidoPor }}
                  </p>
                </div>
              </div>
              <div class="activity-secondary-info">
                <p v-if="atividade.local" class="activity-location">
                  <i class="mdi mdi-map-marker"></i> {{ atividade.local }}
                </p>
                <p v-if="atividade.descricao" class="activity-description">{{ atividade.descricao }}</p>
              </div>
              <div class="activity-actions">
                <button @click="iniciarEdicao(atividade)" class="btn btn-sm btn-icon btn-edit" title="Editar Atividade">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75Z"/></svg>
                </button>
                <button @click="confirmarExclusao(atividade.id)" class="btn btn-sm btn-icon btn-delete" title="Excluir Atividade">
                 <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zm0 5h2v9H9zm4 0h2v9h-2z"/></svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // Importado, mas não usado diretamente no script. Pode ser removido se não houver outras navegações.
import api from '../../services/api'; 

// Tipagem para palestrantes (usado no dropdown)
interface PalestranteSimples {
  id: string; 
  nome: string;
}
// Tipagem para dados da atividade como vêm/vão para a API
interface AtividadeApi {
  id: string;
  nome: string; 
  descricao?: string | null;
  horario: string; // Data e hora de início completas (ISO string)
  local?: string | null;
  tipo: string;
  conduzidoPor?: string | null; // Nome do palestrante/responsável
  horaFim?: string | null; // Opcional, se o backend enviar/receber
}
// Tipagem para o formulário
interface FormAtividadeData {
  id?: string | null; 
  titulo: string;
  tipo: string;
  data: string; // Formato YYYY-MM-DD
  horaInicio: string; // Formato HH:MM
  horaFim?: string | null; 
  local?: string | null;
  descricao?: string | null;
  palestranteId?: string | null; 
}

const router = useRouter(); // Instância do router
const atividades = ref<AtividadeApi[]>([]);
const palestrantesDisponiveis = ref<PalestranteSimples[]>([]);
const formAtividade = reactive<FormAtividadeData>({
  id: null,
  titulo: '',
  tipo: '',
  data: '',
  horaInicio: '',
  horaFim: '',
  local: '',
  descricao: '',
  palestranteId: '', 
});
const mostrarFormulario = ref(false);
const isLoadingAtividades = ref(false);
const isSaving = ref(false); 
const isLoadingPalestrantes = ref(false);
const mensagemGlobal = ref<{ text: string | null, type: 'success' | 'error' | null }>({ text: null, type: null });

// Exibe mensagens de feedback
const exibirMensagem = (msg: string | null, tipo: 'success' | 'error' | null, tempo: number = 4000) => {
  mensagemGlobal.value = { text: msg, type: tipo };
  if (msg) { setTimeout(() => { mensagemGlobal.value = { text: null, type: null }; }, tempo); }
};

// Converte ISO string para YYYY-MM-DD
const getISODatePart = (isoString: string): string => { 
  if (!isoString) return '';
  try { return new Date(isoString).toISOString().split('T')[0]; } catch (e) { return ''; }
};

// Converte ISO string para HH:MM (considerando UTC para consistência com o input ISO)
const getTimePart = (isoString: string): string => { 
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    // Usar getUTCHours e getUTCMinutes se o 'horario' da API é sempre Z (UTC)
    // Se 'horario' pode ter timezones diferentes ou ser local, ajuste esta lógica.
    const hours = date.getUTCHours().toString().padStart(2, '0'); 
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (e) { return ''; }
};

// Formata YYYY-MM-DD para exibição (ex: "11/Novembro - Segunda")
const formatarDataParaExibicao = (dataYYYYMMDD: string): string => { 
  if (!dataYYYYMMDD) return "Data inválida";
  const [year, month, day] = dataYYYYMMDD.split('-');
  // Adiciona 12:00 para evitar problemas de timezone ao converter só a data
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }); // Removido o ano para brevidade
};

// Formata ISO string completo para HH:MM para exibição
const formatarHora = (isoString: string): string => { 
  return getTimePart(isoString);
};

// Busca atividades do backend
const carregarAtividades = async () => {
  isLoadingAtividades.value = true;
  try {
    const response = await api.get<AtividadeApi[]>('/cronograma');
    atividades.value = response.data;
  } catch (err) {
    console.error("Erro ao carregar atividades:", err);
    exibirMensagem('Falha ao carregar atividades.', 'error');
  } finally {
    isLoadingAtividades.value = false;
  }
};

// Busca palestrantes para o dropdown
const carregarPalestrantes = async () => {
  isLoadingPalestrantes.value = true;
  try {
    const response = await api.get<PalestranteSimples[]>('/palestrante');
    palestrantesDisponiveis.value = response.data;
  } catch (err) {
    console.error("Erro ao carregar palestrantes:", err);
  } finally {
    isLoadingPalestrantes.value = false;
  }
};

// Reseta o formulário
const resetarFormulario = () => {
  formAtividade.id = null;
  formAtividade.titulo = '';
  formAtividade.tipo = '';
  formAtividade.data = '';
  formAtividade.horaInicio = '';
  formAtividade.horaFim = '';
  formAtividade.local = '';
  formAtividade.descricao = '';
  formAtividade.palestranteId = '';
};

// Abre formulário para nova atividade
const abrirFormularioNovaAtividade = () => {
  resetarFormulario();
  mostrarFormulario.value = true;
  exibirMensagem(null, null);
};

// Fecha formulário
const fecharFormulario = () => {
  mostrarFormulario.value = false;
  resetarFormulario();
};

// Preenche formulário para edição
const iniciarEdicao = (atividade: AtividadeApi) => {
  formAtividade.id = atividade.id;
  formAtividade.titulo = atividade.nome; 
  formAtividade.tipo = atividade.tipo;
  formAtividade.data = getISODatePart(atividade.horario);
  formAtividade.horaInicio = getTimePart(atividade.horario);
  formAtividade.horaFim = atividade.horaFim || ''; 
  formAtividade.local = atividade.local || '';
  formAtividade.descricao = atividade.descricao || '';
  const palestranteSelecionado = palestrantesDisponiveis.value.find(p => p.nome === atividade.conduzidoPor);
  formAtividade.palestranteId = palestranteSelecionado ? palestranteSelecionado.id : '';
  mostrarFormulario.value = true;
  exibirMensagem(null, null);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Trata string: remove espaços e converte vazia para null
function tratarString(value: string | undefined | null): string | null {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim(); 
    return trimmed === '' ? null : trimmed; 
}

// Salva (cria ou atualiza) atividade
async function salvarAtividade() {
  isSaving.value = true;
  exibirMensagem(null, null);
  if (!formAtividade.data || !formAtividade.horaInicio) {
    exibirMensagem('Data e Hora de Início são obrigatórias.', 'error');
    isSaving.value = false;
    return;
  }
  // Constrói o ISO string para 'horario' assumindo que a data e hora do form estão no fuso local do usuário
  // E o backend espera UTC ou lida com a conversão.
  // Para evitar ambiguidades, o ideal é o backend esperar data e hora e ele montar o DateTime.
  // Mas se o backend espera um ISO string completo:
  const dataHoraInicioCombined = `${formAtividade.data}T${formAtividade.horaInicio}:00`;
  let horarioISO;
  try {
    // Tenta criar data local e converter para ISO. Cuidado com timezones.
    // Se o servidor espera UTC, e a data/hora inserida é local, esta conversão é importante.
    horarioISO = new Date(dataHoraInicioCombined).toISOString();
  } catch (e) {
    exibirMensagem('Formato de data ou hora de início inválido.', 'error');
    isSaving.value = false;
    return;
  }
  
  let horarioFimISO = null;
  if (formAtividade.horaFim) {
    const dataHoraFimCombined = `${formAtividade.data}T${formAtividade.horaFim}:00`;
    try {
        horarioFimISO = new Date(dataHoraFimCombined).toISOString();
    } catch (e) {
        // Não crítico se horaFim for opcional
        console.warn("Formato de hora de fim inválido, enviando null/undefined.");
    }
  }


  const palestranteSelecionado = palestrantesDisponiveis.value.find(p => p.id === formAtividade.palestranteId);
  const nomeConduzidoPor = palestranteSelecionado ? palestranteSelecionado.nome : (formAtividade.palestranteId === '' ? 'Organização' : null);

  const payload: Omit<AtividadeApi, 'id'> & { id?: string } = {
    nome: tratarString(formAtividade.titulo) || 'Atividade Sem Título', // Fallback para nome
    descricao: tratarString(formAtividade.descricao),
    horario: horarioISO,
    local: tratarString(formAtividade.local),
    tipo: formAtividade.tipo, // Tipo é obrigatório
    conduzidoPor: nomeConduzidoPor,
    horaFim: formAtividade.horaFim ? tratarString(formAtividade.horaFim) : null, // Envia horaFim tratada se existir
                                                                              // Ajuste aqui se o backend espera ISO para horaFim
  };
  // Se horaFim no backend for um datetime completo, você precisaria construir o ISO string como fez para horarioISO
  if (formAtividade.horaFim) {
      // payload.horaFim = new Date(`${formAtividade.data}T${formAtividade.horaFim}:00`).toISOString();
      // Ou se o backend espera apenas HH:MM e já tem a data:
      payload.horaFim = tratarString(formAtividade.horaFim);
  }


  try {
    if (formAtividade.id) {
      await api.put(`/cronograma/${formAtividade.id}`, payload);
      exibirMensagem('Atividade atualizada com sucesso!', 'success');
    } else {
      await api.post('/cronograma', payload);
      exibirMensagem('Atividade criada com sucesso!', 'success');
    }
    fecharFormulario();
    await carregarAtividades();
    window.dispatchEvent(new CustomEvent('cronogramaUpdated')); 
  } catch (err: any) {
    console.error("Erro ao salvar atividade:", err);
    const errorMsg = err.response?.data?.message || err.message || 'Falha ao salvar atividade.';
    exibirMensagem(errorMsg, 'error');
  } finally {
    isSaving.value = false;
  }
}

// Confirma e executa exclusão
async function confirmarExclusao(id: string) {
  if (window.confirm('Tem certeza que deseja excluir esta atividade do cronograma?')) {
    isSaving.value = true; 
    try {
      await api.delete(`/cronograma/${id}`);
      exibirMensagem('Atividade excluída com sucesso!', 'success');
      await carregarAtividades();
      window.dispatchEvent(new CustomEvent('cronogramaUpdated'));
    } catch (err) {
      console.error("Erro ao excluir atividade:", err);
      exibirMensagem('Falha ao excluir atividade.', 'error');
    } finally {
      isSaving.value = false;
    }
  }
}

// Agrupa e ordena atividades
const groupedSortedActivities = computed(() => {
  const grupos: Record<string, AtividadeApi[]> = {};
  if (!Array.isArray(atividades.value)) return grupos;

  atividades.value.forEach(atv => {
    if (atv && atv.horario) {
      const dataKey = getISODatePart(atv.horario); 
      if (!grupos[dataKey]) {
        grupos[dataKey] = [];
      }
      grupos[dataKey].push(atv);
    }
  });
  
  const chavesOrdenadas = Object.keys(grupos).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const gruposOrdenados: Record<string, AtividadeApi[]> = {};
  for (const chave of chavesOrdenadas) {
    gruposOrdenados[chave] = grupos[chave].sort((a, b) => {
      const timeA = getTimePart(a.horario);
      const timeB = getTimePart(b.horario);
      return timeA.localeCompare(timeB);
    });
  }
  return gruposOrdenados;
});

// Navega para o dashboard principal
function voltarParaDashboard() { 
  router.push({ name: 'Dashboard' }); // Certifique-se que esta rota está nomeada como 'Dashboard'
}

onMounted(() => {
  carregarAtividades();
  carregarPalestrantes();
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
$cor-erro: #dc3545;   

.cronograma-dashboard {
  padding: 1.5rem;
  background-color: $cinza-fundo-pagina;
  min-height: calc(100vh - 60px); 
}

.page-header-alt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem; 
  background-color: $complemento; 
  border-radius: 8px; 
  box-shadow: 0 4px 15px rgba($preto, 0.1);

  .header-content-alt {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  h1 {
    color: $branco; 
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0; 
  }
}

.btn-back {
  background-color: rgba($branco, 0.1); // Fundo sutil
  color: $branco; // Texto branco
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

// Botão de Adicionar (no header)
.btn-add-new {
    background-color: $destaque; 
    color: $principal; 
    border: none;
    padding: 0.7rem 1.3rem;
    font-weight: 600;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem; 
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 5px rgba($preto, 0.15);

    svg {
      stroke: $principal; 
      stroke-width: 2.5;
      fill: none; // Para ícones de linha
    }

    &:hover {
      background-color: darken($destaque, 10%);
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba($preto, 0.2);
    }
     &:active {
      transform: translateY(0);
    }
}


.card {
  background-color: $branco;
  border-radius: 10px; 
  box-shadow: 0 4px 12px rgba($preto, 0.06); 
  padding: 2rem;
  margin-bottom: 2.5rem; 
  border: 1px solid $cinza-borda;

  h2 {
    font-size: 1.4rem; 
    color: $complemento;
    margin-top: 0;
    margin-bottom: 1.5rem; 
    padding-bottom: 0.75rem; 
    border-bottom: 1px solid $cinza-borda;
    font-weight: 600; 
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem 1.5rem; 
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 0.5rem; 
    font-weight: 500; 
    color: darken($complementoCLaro, 10%); 
    font-size: 0.875rem; 
    small {
        font-weight: normal;
        color: $complementoCLaro;
    }
  }
  input[type="text"],
  input[type="date"],
  input[type="time"],
  select,
  textarea {
    width: 100%;
    padding: 0.8rem 1rem; 
    border: 1px solid $cinza-borda;
    border-radius: 6px;
    font-size: 0.95rem;
    color: $texto-primario; // Cor de texto mais escura para inputs
    background-color: $branco; 
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder { color: lighten($complementoCLaro, 10%); } 
    &:focus {
      outline: none;
      border-color: $destaque;
      box-shadow: 0 0 0 3px rgba($destaque, 0.2);
    }
  }
  textarea { resize: vertical; min-height: 100px; }
  small:not(label small) { 
    font-size: 0.8rem;
    color: $complementoCLaro;
    margin-top: 0.4rem;
  }
}
.form-group-full { grid-column: 1 / -1; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; } 
.form-section-title {
    grid-column: 1 / -1;
    font-size: 1.05rem; 
    font-weight: 600;
    color: $principal;
    margin-top: 1.5rem; 
    margin-bottom: 1rem; // Aumentar margem
    padding-bottom: 0.6rem; 
    border-bottom: 1px solid lighten($cinza-borda, 5%); 
}

.list-card h2 {
    // Adicionar um contador ao lado do título da lista, se desejar
}

.day-group {
  margin-bottom: 2.5rem; 
  &:last-child { margin-bottom: 0; }
  h3 { // Título da Data (Ex: 11/Novembro - Segunda)
    font-size: 1.5rem; 
    font-weight: 700;
    color: $principal;
    padding-bottom: 0.75rem; 
    border-bottom: 2px solid $destaque; 
    margin-bottom: 1.5rem; 
    text-align: left; 
  }
}

.activity-list { list-style: none; padding: 0; }

.activity-item {
  background-color: $branco; // Itens com fundo branco para contraste com a página
  border: 1px solid $cinza-borda;
  border-left: 4px solid $destaque; // Borda lateral com cor de destaque
  border-radius: 8px;
  padding: 1.25rem; // Padding interno
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap; // Permite quebra para mobile
  align-items: flex-start;
  gap: 1rem; // Gap entre os blocos
  transition: box-shadow 0.25s ease;

  &:hover { box-shadow: 0 6px 18px rgba($preto, 0.08); }
}

.activity-main-info {
    flex: 1 1 60%; // Permite crescer, base de 60%
    min-width: 250px; // Para não espremer demais
}

.activity-time-type {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    color: $principal;
    font-weight: 600;

    .time {
      font-size: 1rem;
    }
    .type {
      font-size: 0.75rem;
      text-transform: uppercase;
      background-color: lighten($principal, 70%);
      color: $principal;
      padding: 0.25em 0.6em;
      border-radius: 4px;
      font-weight: 500;
    }
}

.activity-presentation {
    .activity-title {
        font-size: 1.25rem; // Título da atividade
        font-weight: 600;
        color: $complemento;
        margin: 0 0 0.4rem 0;
    }
    .activity-speaker {
        font-size: 0.9rem;
        color: $complementoCLaro;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.3rem;
        i.mdi { font-size: 1.1rem; color: $destaque; }
    }
}

.activity-secondary-info {
    flex: 1 1 35%; // Espaço para local e descrição
    font-size: 0.875rem;
    color: $texto-secundario;
    line-height: 1.5;
    padding-left: 1rem; // Pequeno recuo se estiver ao lado
    border-left: 1px solid $cinza-borda; // Separador se estiver ao lado

    @media (max-width: 768px) {
        padding-left: 0;
        border-left: none;
        margin-top: 0.75rem;
    }

    .activity-location {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        margin-bottom: 0.4rem;
        font-weight: 500;
        i.mdi { font-size: 1.1rem; color: $destaque; }
    }
    .activity-description {
        font-size: 0.85rem;
    }
}


.activity-actions {
  display: flex;
  gap: 0.5rem; // Gap menor
  align-items: center;
  margin-left: auto; // Empurra para a direita no desktop

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
    margin-top: 1rem; // Espaço acima das ações
  }
}

// Botões e Alertas (Estilos padrão do admin)
.btn {
  padding: 0.6rem 1.2rem; font-size: 0.875rem; border-radius: 6px; border: 1px solid transparent; cursor: pointer;
  transition: all 0.2s ease-in-out; font-weight: 600; display: inline-flex; align-items: center; justify-content: center;
  text-transform: uppercase; letter-spacing: 0.5px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba($preto, 0.05);
  svg { margin-right: 0.5em; width: 16px; height: 16px;}

  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 3px 6px rgba($preto, 0.1); }
  &:active:not(:disabled) { transform: translateY(0px); box-shadow: 0 1px 2px rgba($preto, 0.05); }
  &:disabled { opacity: 0.65; cursor: not-allowed; }

  &.btn-primary { background-color: $principal; color: $branco; border-color: $principal;
    &:hover:not(:disabled) { background-color: darken($principal, 7%); border-color: darken($principal, 7%);}
  }
  &.btn-success { background-color: $cor-sucesso; color: $branco; border-color: $cor-sucesso;
    &:hover:not(:disabled) { background-color: darken($cor-sucesso, 7%); border-color: darken($cor-sucesso, 7%);}
  }
  &.btn-secondary { background-color: $complementoCLaro; color: $branco; border-color: $complementoCLaro;
    &:hover:not(:disabled) { background-color: darken($complementoCLaro, 10%); border-color: darken($complementoCLaro, 10%); }
  }
  
  &.btn-sm { padding: 0.35rem 0.7rem; font-size: 0.75rem; 
    svg { width: 14px; height: 14px; }
  }
  &.btn-icon {
    background: transparent; border: none; padding: 0.4rem; box-shadow: none; border-radius: 50%;
    svg { margin-right: 0; fill: currentColor; width: 18px; height: 18px;} 
    &:hover:not(:disabled) { background-color: rgba($preto, 0.07); transform: scale(1.1); box-shadow: none; }
  }
  &.btn-edit { color: $principal; }
  &.btn-delete { color: $cor-erro; }
}

.alert {
  padding: 0.9rem 1.25rem; margin-bottom: 1.5rem; border-radius: 8px; font-size: 0.9rem;
  border-width: 1px; border-style: solid;
  &.alert-success { background-color: lighten($cor-sucesso, 50%); border-color: darken($cor-sucesso,5%); color: darken($cor-sucesso, 25%); }
  &.alert-danger { background-color: lighten($cor-erro, 35%); border-color: darken($cor-erro,5%); color: darken($cor-erro, 25%); }
}
.loading-state, .empty-state { text-align: center; padding: 2.5rem; color: $complementoCLaro; font-size: 1.05rem; }
.loading-state .spinner {
  border: 3px solid rgba($principal, 0.2); 
  border-top-color: $destaque; border-radius: 50%;
  width: 30px; height: 30px; animation: spin 0.7s linear infinite; margin: 0 auto 1rem auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

// Responsividade
@media (max-width: 768px) {
    .cronograma-dashboard { padding: 1rem; }
    .page-header-alt {
      flex-direction: column; align-items: stretch; gap: 1rem;
      .header-content-alt { justify-content: center; } 
      h1 { font-size: 1.5rem; text-align: center; } 
      .btn-add-new { width: 100%; font-size: 0.9rem; }
      .btn-back { align-self: flex-start; margin-bottom: 0.5rem;}
    }
    .form-grid { grid-template-columns: 1fr; }
    .card { padding: 1.25rem; }
    .card h2 { font-size: 1.25rem; margin-bottom: 1.25rem;}
    .form-actions { flex-direction: column; gap: 0.75rem; button { width: 100%;} }
    .day-group h3 { font-size: 1.3rem; } // Título do dia um pouco menor
    .activity-item { // Ajustes para o item de atividade em mobile
        gap: 0.75rem; // Menor gap
        padding: 1rem;
    }
    .activity-main-info { min-width: auto; } // Permite que o bloco principal encolha
    .activity-secondary-info { padding-left: 0; border-left: none; margin-top: 0.75rem; width: 100%;}
    .activity-time-type { 
        flex-direction: column; // Empilha tempo e tipo
        align-items: flex-start; // Alinha à esquerda
        gap: 0.3rem;
        .time { font-size: 0.95rem; }
        .type { font-size: 0.7rem; }
    }
    .activity-details .activity-title { font-size: 1.15rem;}


    .data-table { // Estilo de "cards" para tabela em mobile
        thead { display: none; }
        tr { display: block; margin-bottom: 1.2rem; border: 1px solid $cinza-borda; border-radius: 8px; box-shadow: 0 2px 6px rgba($preto,0.05); padding: 0.8rem; }
        td { 
          display: grid;
          grid-template-columns: 100px 1fr; 
          align-items: baseline; 
          text-align: left; 
          padding: 0.6rem 0; 
          border-bottom: 1px dotted lighten($cinza-borda, 8%);
          font-size: 0.9rem; 

          &::before {
            content: attr(data-label); 
            font-weight: 600; 
            color: $principal;
            padding-right: 0.5rem;
            white-space: nowrap;
          }
          &:last-child { border-bottom: none; padding-bottom: 0; }
          
          & > * { 
             justify-self: start; 
          }

          &.actions-cell { 
            grid-template-columns: 1fr; 
            justify-items: end; 
            padding-top: 0.7rem; 
            &::before { display: none;} 
          }
          &.description-col { 
            grid-template-columns: 1fr; 
            word-break: break-word; 
            &::before{display: block; margin-bottom: 0.3rem; grid-column: 1 / -1;}  
             div, p, span { grid-column: 1 / -1; } 
          }
        }
        .table-photo-thumbnail, .no-photo-placeholder { 
          grid-column: 2; 
        }
    }
}
</style>