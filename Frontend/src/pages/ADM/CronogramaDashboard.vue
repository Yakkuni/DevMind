<template>
  <div class="admin-resource-dashboard cronograma-dashboard">
    <header class="dashboard-header"> <h1>Gerenciar Cronograma do Evento</h1>
      <button @click="abrirFormularioNovaAtividade" class="btn btn-header-action">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Adicionar Nova Atividade
      </button>
    </header>

    <div v-if="mensagemSucesso" class="alert alert-success">{{ mensagemSucesso }}</div>
    <div v-if="mensagemErro" class="alert alert-danger">{{ mensagemErro }}</div>

    <div v-if="mostrarFormulario" class="card form-card">
      <h2>{{ formAtividade.id ? 'Editar Atividade' : 'Nova Atividade no Cronograma' }}</h2>
      <form @submit.prevent="salvarAtividade">
        <div class="form-grid">
          <div class="form-group">
            <label for="form-titulo">Título da Atividade</label>
            <input id="form-titulo" type="text" v-model="formAtividade.titulo" required placeholder="Ex: Palestra de Abertura" />
          </div>
          <div class="form-group">
            <label for="form-tipo">Tipo da Atividade</label>
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
            <label for="form-data">Data</label>
            <input id="form-data" type="date" v-model="formAtividade.data" required />
          </div>
          <div class="form-group">
            <label for="form-horaInicio">Hora de Início</label>
            <input id="form-horaInicio" type="time" v-model="formAtividade.horaInicio" required />
          </div>
          <div class="form-group">
            <label for="form-horaFim">Hora de Fim <small>(Opcional)</small></label>
            <input id="form-horaFim" type="time" v-model="formAtividade.horaFim" />
          </div>
          <div class="form-group">
            <label for="form-palestranteId">Responsável (Palestrante)</label>
            <select id="form-palestranteId" v-model="formAtividade.palestranteId">
              <option value="">Nenhum específico / Organizador</option>
              <option v-for="p in palestrantesDisponiveis" :key="p.id" :value="p.id">
                {{ p.nome }}
              </option>
            </select>
            <small v-if="isLoadingPalestrantes">Carregando palestrantes...</small>
          </div>
          <div class="form-group">
            <label for="form-local">Local</label>
            <input id="form-local" type="text" v-model="formAtividade.local" placeholder="Ex: Auditório Principal" />
          </div>
          <div class="form-group form-group-full">
            <label for="form-descricao">Descrição (Opcional)</label>
            <textarea id="form-descricao" v-model="formAtividade.descricao" rows="3" placeholder="Detalhes adicionais sobre a atividade"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success" :disabled="isSaving">
            <span v-if="isSaving">Salvando...</span>
            <span v-else>{{ formAtividade.id ? 'Salvar Alterações' : 'Criar Atividade' }}</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="fecharFormulario" :disabled="isSaving">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="card list-card">
      <h2>Cronograma Atual</h2>
      <div v-if="isLoadingAtividades" class="loading-state">
        <div class="spinner"></div> Carregando atividades...
      </div>
      <div v-else-if="!groupedSortedActivities || Object.keys(groupedSortedActivities).length === 0" class="empty-state">
        Nenhuma atividade cadastrada ainda.
      </div>
      <div v-else>
        <div v-for="(atividadesDoDia, dataFormatadaISO) in groupedSortedActivities" :key="dataFormatadaISO" class="day-group">
          <h3>{{ formatarDataParaExibicao(dataFormatadaISO) }}</h3>
          <ul class="activity-list">
            <li v-for="atividade in atividadesDoDia" :key="atividade.id" class="activity-item">
              <div class="activity-time">
                {{ formatarHora(atividade.horario) }}
                <span v-if="atividade.horaFim"> - {{ atividade.horaFim }}</span>
              </div>
              <div class="activity-details">
                <h4>{{ atividade.nome }} <span class="activity-type">({{ atividade.tipo }})</span></h4>
                <p v-if="atividade.local" class="activity-location">Local: {{ atividade.local }}</p>
                <p v-if="atividade.conduzidoPor" class="activity-speaker">
                  Com: {{ atividade.conduzidoPor }}
                </p>
                <p v-if="atividade.descricao" class="activity-description">{{ atividade.descricao }}</p>
              </div>
              <div class="activity-actions">
                <button @click="iniciarEdicao(atividade)" class="btn btn-sm btn-icon btn-edit" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75Z"/></svg>
                </button>
                <button @click="confirmarExclusao(atividade.id)" class="btn btn-sm btn-icon btn-delete" title="Excluir">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zm0 5h2v9H9zm4 0h2v9h-2z"/></svg>
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
// O SCRIPT PERMANECE O MESMO DA RESPOSTA ANTERIOR
import { ref, reactive, onMounted, computed } from 'vue';
import api from '../../services/api'; 

interface PalestranteSimples {
  id: string; 
  nome: string;
}
interface AtividadeApi {
  id: string;
  nome: string; 
  descricao?: string | null;
  horario: string; 
  local?: string | null;
  tipo: string;
  conduzidoPor?: string | null; 
  horaFim?: string | null; 
}
interface FormAtividadeData {
  id?: string | null; 
  titulo: string;
  tipo: string;
  data: string; 
  horaInicio: string; 
  horaFim?: string | null; 
  local?: string | null;
  descricao?: string | null;
  palestranteId?: string | null; 
}

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
const mensagemSucesso = ref<string | null>(null);
const mensagemErro = ref<string | null>(null);

const exibirMensagem = (msg: string, tipo: 'sucesso' | 'erro', tempo: number = 4000) => {
  if (tipo === 'sucesso') {
    mensagemSucesso.value = msg;
    mensagemErro.value = null;
  } else {
    mensagemErro.value = msg;
    mensagemSucesso.value = null;
  }
  setTimeout(() => {
    mensagemSucesso.value = null;
    mensagemErro.value = null;
  }, tempo);
};

const getISODatePart = (isoString: string): string => { 
  if (!isoString) return '';
  try {
    return new Date(isoString).toISOString().split('T')[0];
  } catch (e) { return ''; }
};

const getTimePart = (isoString: string): string => { 
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, '0'); 
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (e) { return ''; }
};

const formatarDataParaExibicao = (dataYYYYMMDD: string): string => { 
  if (!dataYYYYMMDD) return "Data inválida";
  const [year, month, day] = dataYYYYMMDD.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

const formatarHora = (isoString: string): string => { 
  return getTimePart(isoString);
};

const carregarAtividades = async () => {
  isLoadingAtividades.value = true;
  try {
    const response = await api.get<AtividadeApi[]>('/cronograma');
    atividades.value = response.data;
  } catch (err) {
    console.error("Erro ao carregar atividades:", err);
    exibirMensagem('Falha ao carregar atividades do cronograma.', 'erro');
  } finally {
    isLoadingAtividades.value = false;
  }
};

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

const abrirFormularioNovaAtividade = () => {
  resetarFormulario();
  mostrarFormulario.value = true;
};

const fecharFormulario = () => {
  mostrarFormulario.value = false;
  resetarFormulario();
};

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
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const salvarAtividade = async () => {
  isSaving.value = true;
  if (!formAtividade.data || !formAtividade.horaInicio) {
    exibirMensagem('Data e Hora de Início são obrigatórias.', 'erro');
    isSaving.value = false;
    return;
  }
  const horarioISO = new Date(`${formAtividade.data}T${formAtividade.horaInicio}:00`).toISOString();
  const palestranteSelecionado = palestrantesDisponiveis.value.find(p => p.id === formAtividade.palestranteId);
  const nomeConduzidoPor = palestranteSelecionado ? palestranteSelecionado.nome : (formAtividade.palestranteId === '' ? 'Organização' : '');

  const payload: Partial<AtividadeApi> & { nome: string; horario: string; tipo: string; } = { // Garante que campos obrigatórios estejam no tipo
    nome: formAtividade.titulo,
    descricao: formAtividade.descricao || null,
    horario: horarioISO,
    local: formAtividade.local || null,
    tipo: formAtividade.tipo,
    conduzidoPor: nomeConduzidoPor || null,
    ...(formAtividade.horaFim && { horaFim: formAtividade.horaFim })
  };
  if(formAtividade.id) payload.id = formAtividade.id; // Adiciona id apenas para edição

  try {
    if (formAtividade.id) {
      await api.put(`/cronograma/${formAtividade.id}`, payload);
      exibirMensagem('Atividade atualizada com sucesso!', 'sucesso');
    } else {
      await api.post('/cronograma', payload);
      exibirMensagem('Atividade criada com sucesso!', 'sucesso');
    }
    fecharFormulario();
    await carregarAtividades();
    window.dispatchEvent(new CustomEvent('cronogramaUpdated')); 
  } catch (err: any) {
    console.error("Erro ao salvar atividade:", err);
    const errorMsg = err.response?.data?.message || err.message || 'Falha ao salvar atividade.';
    exibirMensagem(errorMsg, 'erro');
  } finally {
    isSaving.value = false;
  }
};

const confirmarExclusao = async (id: string) => {
  if (window.confirm('Tem certeza que deseja excluir esta atividade do cronograma?')) {
    isSaving.value = true; 
    try {
      await api.delete(`/cronograma/${id}`);
      exibirMensagem('Atividade excluída com sucesso!', 'sucesso');
      await carregarAtividades();
      window.dispatchEvent(new CustomEvent('cronogramaUpdated'));
    } catch (err) {
      console.error("Erro ao excluir atividade:", err);
      exibirMensagem('Falha ao excluir atividade.', 'erro');
    } finally {
      isSaving.value = false;
    }
  }
};

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
$cinza-borda: #d1d5db;
$cinza-fundo-pagina: #f4f6f8;

.cronograma-dashboard {
  padding: 1.5rem;
  background-color: $cinza-fundo-pagina;
  min-height: calc(100vh - 60px); // Ajuste conforme altura do seu header principal do admin
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem; // Adicionado padding ao header
  background-color: $complemento; // Fundo escuro para o header
  border-radius: 8px; // Bordas arredondadas
  box-shadow: 0 4px 15px rgba($preto, 0.1);

  h1 {
    color: $branco; // Texto branco sobre fundo escuro
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0; // Remove margem padrão do h1
  }
  // Estilo específico para o botão no header
  .btn-header-action {
    background-color: $destaque;
    color: $principal;
    border: none;
    padding: 0.7rem 1.3rem;
    font-weight: 600;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem; // Espaço entre ícone e texto
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 5px rgba($preto, 0.15);

    svg {
      stroke: $principal; // Cor do ícone
      stroke-width: 2.5;
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
}

.card {
  background-color: $branco;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba($preto, 0.07);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid lighten($cinza-borda, 5%);

  h2 {
    font-size: 1.5rem;
    color: $complemento;
    margin-top: 0;
    margin-bottom: 1.8rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid $cinza-borda;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem 1.8rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 0.6rem;
    font-weight: 600;
    color: $complemento;
    font-size: 0.9rem;
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
    padding: 0.85rem 1rem;
    border: 1px solid $cinza-borda;
    border-radius: 6px;
    font-size: 0.95rem;
    color: $complemento;
    background-color: lighten($cinza-fundo-pagina, 2%);
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder { color: $complementoCLaro; }
    &:focus {
      outline: none;
      border-color: $destaque;
      box-shadow: 0 0 0 3px rgba($destaque, 0.25);
      background-color: $branco;
    }
  }
  textarea { resize: vertical; min-height: 80px; }
  small:not(label small) { // Para o 'Carregando palestrantes...'
    font-size: 0.8rem;
    color: $complementoCLaro;
    margin-top: 0.4rem;
  }
}
.form-group-full { grid-column: 1 / -1; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }

.list-card { /* Estilos específicos para o card da lista se necessário */ }

.day-group {
  margin-bottom: 2.5rem;
  &:last-child { margin-bottom: 0; }
  h3 {
    font-size: 1.6rem;
    font-weight: 700;
    color: $principal;
    padding-bottom: 0.8rem;
    border-bottom: 2px solid $destaque;
    margin-bottom: 1.5rem;
    text-align: left;
  }
}

.activity-list { list-style: none; padding: 0; }

.activity-item {
  background-color: lighten($cinza-fundo-pagina, 2%);
  border: 1px solid $cinza-borda;
  border-left: 5px solid $destaque;
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 1.5rem;
  transition: box-shadow 0.3s ease;

  &:hover { box-shadow: 0 4px 15px rgba($preto, 0.08); }

  @media (max-width: 768px) { flex-direction: column; gap: 0.8rem; padding: 1rem; }
}

.activity-time {
  font-weight: 700;
  color: $principal;
  font-size: 1rem;
  flex-basis: 140px; // Aumentar um pouco a base para XX:XX - XX:XX
  flex-shrink: 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    flex-basis: auto;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px dashed $cinza-borda;
    padding-bottom: 0.5rem;
    width: 100%;
  }
}

.activity-details {
  flex-grow: 1;
  min-width: 200px;
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: $complemento;
    .activity-type {
      font-size: 0.8rem;
      color: $complementoCLaro;
      font-weight: 500;
      margin-left: 0.5rem;
      background-color: lighten($destaque, 30%);
      color: darken($destaque, 20%);
      padding: 0.2em 0.6em;
      border-radius: 4px;
      display: inline-block; // Para o padding funcionar bem
      line-height: 1;
    }
  }
  p { margin: 0.3rem 0; font-size: 0.9rem; color: $complementoCLaro; line-height: 1.5; }
  .activity-location { font-weight: 500; }
  .activity-speaker { font-weight: 600; color: $principal; }
  .activity-description { color: darken($complementoCLaro, 5%); font-size: 0.85rem; }
}

.activity-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-left: auto;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
    margin-top: 0.75rem;
  }
}

// Botões e Alertas
.btn {
  padding: 0.6rem 1.2rem; font-size: 0.9rem; border-radius: 6px; border: none; cursor: pointer;
  transition: all 0.25s ease; font-weight: 600; display: inline-flex; align-items: center; justify-content: center;
  text-transform: uppercase; letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba($preto, 0.1);

  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 3px 7px rgba($preto, 0.15); }
  &:active:not(:disabled) { transform: translateY(0px); box-shadow: 0 1px 3px rgba($preto, 0.1); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  &.btn-primary { background-color: $principal; color: $branco; &:hover:not(:disabled) { background-color: darken($principal, 8%); } }
  &.btn-success { background-color: #198754; color: $branco; &:hover:not(:disabled) { background-color: darken(#198754, 8%); } } // Verde mais escuro
  &.btn-secondary { background-color: $complementoCLaro; color: $branco; &:hover:not(:disabled) { background-color: darken($complementoCLaro, 10%); } }
  
  &.btn-sm { padding: 0.4rem 0.8rem; font-size: 0.8rem; }
  &.btn-icon {
    background: transparent; border: none; padding: 0.5rem; box-shadow: none; border-radius: 50%;
    &:hover:not(:disabled) { background-color: rgba($preto, 0.05); transform: scale(1.1); box-shadow: none; }
    &:active:not(:disabled) { transform: scale(1); }
    svg { width: 18px; height: 18px; }
  }
  &.btn-edit svg { color: $principal; }
  &.btn-delete svg { color: #c82333; }
}

.alert {
  padding: 1rem 1.5rem; margin-bottom: 1.5rem; border-radius: 8px; font-size: 0.95rem;
  border: 1px solid transparent;
  &.alert-success { background-color: lighten(#198754, 55%); border-color: #198754; color: darken(#198754, 20%); }
  &.alert-danger { background-color: lighten(#dc3545, 38%); border-color: #dc3545; color: darken(#dc3545, 20%); }
}
.loading-state, .empty-state { text-align: center; padding: 2.5rem; color: $complementoCLaro; font-size: 1.05rem; }
.loading-state .spinner {
  border: 4px solid rgba($principal, 0.15); border-top-color: $destaque; border-radius: 50%;
  width: 35px; height: 35px; animation: spin 0.7s linear infinite; margin: 0 auto 1rem auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
    .cronograma-dashboard { padding: 1rem; }
    .dashboard-header {
      flex-direction: column; align-items: stretch; gap: 1rem;
      h1 { font-size: 1.6rem; text-align: center; }
      .btn-header-action { width: auto; align-self: center; } // Botão não ocupa largura toda
    }
    .form-grid { grid-template-columns: 1fr; }
    .card { padding: 1.5rem; }
    .card h2 { font-size: 1.3rem; margin-bottom: 1.5rem;}
    .day-group h3 { font-size: 1.4rem; }
}
</style>