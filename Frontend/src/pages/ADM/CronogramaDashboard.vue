<template>
  <div class="schedule-dashboard-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Gerenciamento de Programação</h1>
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
          <h3>Programação Atual</h3>
          <button class="btn btn-primary" @click="abrirModalParaCriar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Adicionar Atividade
          </button>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando programação...</p>
        </div>
        
        <div v-else-if="!atividades.length" class="empty-state">
          <p>Nenhuma atividade encontrada. Que tal adicionar a primeira?</p>
        </div>

        <div v-else class="card-content">
          <div v-for="(atividadesDoDia, dataISO) in atividadesAgrupadas" :key="dataISO" class="day-group">
            <h4 class="day-title">{{ formatarDataParaExibicao(dataISO) }}</h4>
            <ul class="activity-list">
              <li v-for="atividade in atividadesDoDia" :key="atividade.id" class="activity-item">
                <div class="activity-info">
                  <div class="activity-header">
                    <span class="time">{{ formatarHora(atividade.horario) }}<template v-if="atividade.horaFim"> - {{ atividade.horaFim }}</template></span>
                    <span class="title">{{ atividade.nome }}</span>
                  </div>
                  <div class="activity-details">
                    <div class="detail">
                      <span class="type-badge">{{ atividade.tipo }}</span>
                      <span v-if="atividade.conduzidoPor" class="speaker"><strong>Por:</strong> {{ atividade.conduzidoPor }}</span>
                      <span v-if="atividade.local" class="location"><strong>Local:</strong> {{ atividade.local }}</span>
                    </div>
                    <p v-if="atividade.descricao" class="description">{{ atividade.descricao }}</p>
                  </div>
                </div>
                <div class="activity-actions">
                  <button class="btn-icon btn-edit" @click="abrirModalParaEditar(atividade)" title="Editar Atividade">
                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                  </button>
                  <button class="btn-icon btn-delete" @click="confirmarExclusao(atividade.id)" title="Excluir Atividade">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-content">
        <header class="modal-header">
          <h2>{{ isEditing ? 'Editar Atividade' : 'Nova Atividade' }}</h2>
          <button @click="fecharModal" class="close-button">×</button>
        </header>
        <form @submit.prevent="salvarAtividade" class="modal-form">
          <div class="form-group">
            <label for="form-titulo">Título da Atividade*</label>
            <input id="form-titulo" type="text" v-model="formAtividade.titulo" required class="form-control" placeholder="Ex: Palestra de Abertura" />
          </div>
          <div class="form-group">
            <label for="form-tipo">Tipo da Atividade*</label>
            <select id="form-tipo" v-model="formAtividade.tipo" required class="form-control">
              <option disabled value="">Selecione um tipo</option>
              <option value="Palestra">Palestra</option> <option value="Keynote">Keynote</option> <option value="Workshop">Workshop</option> <option value="Painel">Painel</option> <option value="CoffeeBreak">Coffee Break</option> <option value="Abertura">Abertura</option> <option value="Encerramento">Encerramento</option> <option value="Networking">Networking</option> <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="form-data">Data*</label>
            <input id="form-data" type="date" v-model="formAtividade.data" required class="form-control" />
          </div>
          <div class="form-group">
            <label for="form-horaInicio">Hora de Início*</label>
            <input id="form-horaInicio" type="time" v-model="formAtividade.horaInicio" required class="form-control" />
          </div>
          <div class="form-group">
            <label for="form-horaFim">Hora de Fim (Opcional)</label>
            <input id="form-horaFim" type="time" v-model="formAtividade.horaFim" class="form-control" />
          </div>
          <div class="form-group">
            <label for="form-palestranteId">Responsável/Palestrante (Opcional)</label>
            <select id="form-palestranteId" v-model="formAtividade.palestranteId" class="form-control">
              <option value="">Nenhum / Organização</option>
              <option v-for="p in palestrantes" :key="p.id" :value="p.id">{{ p.nome }}</option>
            </select>
            <small v-if="isLoadingPalestrantes">Carregando palestrantes...</small>
          </div>
          <div class="form-group">
            <label for="form-local">Local (Opcional)</label>
            <input id="form-local" type="text" v-model="formAtividade.local" class="form-control" placeholder="Ex: Auditório Principal" />
          </div>
          <div class="form-group">
            <label for="form-descricao">Descrição (Opcional)</label>
            <textarea id="form-descricao" v-model="formAtividade.descricao" rows="3" class="form-control" placeholder="Detalhes adicionais sobre a atividade"></textarea>
          </div>
          <footer class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModal" :disabled="isSaving">Cancelar</button>
            <button type="submit" class="btn btn-success" :disabled="isSaving">
              {{ isSaving ? 'Salvando...' : 'Salvar' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api'; 

interface Palestrante { id: string; nome: string; }
interface Atividade {
  id: string; nome: string; descricao?: string | null;
  horario: string; horaFim?: string | null; local?: string | null;
  tipo: string; conduzidoPor?: string | null;
}
interface FormAtividadeData {
  id?: string | null; titulo: string; tipo: string; data: string;
  horaInicio: string; horaFim: string; local: string;
  descricao: string; palestranteId: string; 
}

const router = useRouter();
const atividades = ref<Atividade[]>([]);
const palestrantes = ref<Palestrante[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isLoadingPalestrantes = ref(false);
const showModal = ref(false);
const isEditing = ref(false);

const formAtividade = reactive<FormAtividadeData>({ id: null, titulo: '', tipo: '', data: '', horaInicio: '', horaFim: '', local: '', descricao: '', palestranteId: '' });
const globalMessage = ref<{ text: string | null, type: 'success' | 'error' }>({ text: null, type: 'success' });

function displayMessage(text: string, type: 'success' | 'error', duration: number = 4000) {
  globalMessage.value = { text, type };
  setTimeout(() => { globalMessage.value.text = null; }, duration);
}

const getISODatePart = (iso?: string) => iso ? iso.split('T')[0] : '';
const formatarDataParaExibicao = (data: string) => new Date(`${data}T12:00:00Z`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
const formatarHora = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const voltarParaDashboard = () => router.push({ name: 'Dashboard' });

async function carregarDados() {
  isLoading.value = true;
  try {
    const [atividadesRes, palestrantesRes] = await Promise.all([
      api.get<Atividade[]>('/cronograma'),
      api.get<Palestrante[]>('/palestrante')
    ]);
    atividades.value = atividadesRes.data;
    palestrantes.value = palestrantesRes.data;
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    displayMessage('Falha ao carregar dados da página.', 'error');
  } finally {
    isLoading.value = false;
  }
}

async function salvarAtividade() {
  isSaving.value = true;
  if (!formAtividade.data || !formAtividade.horaInicio) {
    displayMessage('Data e Hora de Início são obrigatórias.', 'error');
    isSaving.value = false; return;
  }
  
  const horarioISO = new Date(`${formAtividade.data}T${formAtividade.horaInicio}:00`).toISOString();
  const palestranteSelecionado = palestrantes.value.find(p => p.id === formAtividade.palestranteId);

  const payload = {
    nome: formAtividade.titulo.trim(), tipo: formAtividade.tipo, horario: horarioISO,
    horaFim: formAtividade.horaFim || null, local: formAtividade.local.trim() || null,
    descricao: formAtividade.descricao.trim() || null, conduzidoPor: palestranteSelecionado?.nome || null,
  };

  try {
    if (isEditing.value) {
      await api.put(`/cronograma/${formAtividade.id}`, payload);
      displayMessage('Atividade atualizada com sucesso!', 'success');
    } else {
      await api.post('/cronograma', payload);
      displayMessage('Atividade criada com sucesso!', 'success');
    }
    
    // MUDANÇA: Anuncia a atualização para outras abas.
    const channel = new BroadcastChannel('cronograma_updates');
    channel.postMessage('updated');
    channel.close();

    fecharModal();
    await carregarDados();
  } catch (err: any) {
    displayMessage(err.response?.data?.message || 'Falha ao salvar atividade.', 'error');
  } finally {
    isSaving.value = false;
  }
}

async function confirmarExclusao(id: string) {
  if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
    try {
      await api.delete(`/cronograma/${id}`);
      displayMessage('Atividade excluída com sucesso!', 'success');
      
      // MUDANÇA: Anuncia a atualização para outras abas.
      const channel = new BroadcastChannel('cronograma_updates');
      channel.postMessage('updated');
      channel.close();

      await carregarDados();
    } catch (err) {
      displayMessage('Falha ao excluir atividade.', 'error');
    }
  }
}

function abrirModalParaCriar() {
  isEditing.value = false;
  Object.assign(formAtividade, { id: null, titulo: '', tipo: '', data: '', horaInicio: '', horaFim: '', local: '', descricao: '', palestranteId: '' });
  showModal.value = true;
}

function abrirModalParaEditar(atividade: Atividade) {
  isEditing.value = true;
  const palestranteSelecionado = palestrantes.value.find(p => p.nome === atividade.conduzidoPor);
  Object.assign(formAtividade, {
    id: atividade.id, titulo: atividade.nome, tipo: atividade.tipo,
    data: getISODatePart(atividade.horario), horaInicio: atividade.horario.split('T')[1].substring(0, 5),
    horaFim: atividade.horaFim || '', local: atividade.local || '',
    descricao: atividade.descricao || '', palestranteId: palestranteSelecionado?.id || '',
  });
  showModal.value = true;
}

function fecharModal() { showModal.value = false; }

const atividadesAgrupadas = computed(() => {
  const grupos: Record<string, Atividade[]> = {};
  const atividadesOrdenadas = [...atividades.value].sort((a, b) => new Date(a.horario).getTime() - new Date(b.horario).getTime());
  for (const atv of atividadesOrdenadas) {
    const dataKey = getISODatePart(atv.horario);
    if (!grupos[dataKey]) grupos[dataKey] = [];
    grupos[dataKey].push(atv);
  }
  return grupos;
});

onMounted(carregarDados);
</script>

<style scoped lang="scss">
// O CSS é idêntico ao que você enviou, pois ele já estava funcional.
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

// Estilo Base da Página
.sponsors-dashboard-page, .speakers-dashboard-page, .schedule-dashboard-page {
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
  h3 {
    margin: 0;
    color: $principal;
    font-size: 1.25rem;
    font-weight: 600;
  }
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

// Botões
.btn {
  padding: 0.7rem 1.4rem; font-size: 0.9rem; border-radius: 6px; border: 2px solid transparent; cursor: pointer;
  transition: all 0.25s ease; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5em;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
.btn-primary { background-color: $destaque; color: $principal; border-color: $destaque; &:hover:not(:disabled) { background-color: darken($destaque, 8%); border-color: darken($destaque, 8%); } }
.btn-secondary { background-color: #6c757d; color: $branco; border-color: #6c757d; &:hover:not(:disabled) { background-color: darken(#6c757d, 8%); border-color: darken(#6c757d, 8%); } }
.btn-success { background-color: $cor-sucesso; color: $branco; border-color: $cor-sucesso; &:hover:not(:disabled) { background-color: darken($cor-sucesso, 8%); border-color: darken($cor-sucesso, 8%); } }
.btn-outline-light {
    background-color: transparent;
    border-color: rgba($branco, 0.7);
    color: $branco;
    &:hover:not(:disabled) {
        background-color: rgba($branco, 0.1);
        border-color: $branco;
    }
}
.btn-icon {
  background: none; border: none; cursor: pointer; padding: 0.4rem; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; transition: background-color 0.2s;
  svg { width: 20px; height: 20px; }
  &.btn-edit { color: $principal; &:hover { background-color: rgba($principal, 0.1); }}
  &.btn-delete { color: $cor-erro; &:hover { background-color: rgba($cor-erro, 0.1); }}
}

// Modal
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: $branco; border-radius: 10px; width: 90%; max-width: 550px; max-height: 90vh;
  display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slide-down 0.3s ease-out;
}
.modal-header {
  padding: 1rem 1.5rem; border-bottom: 1px solid $borda-card; display: flex;
  justify-content: space-between; align-items: center; flex-shrink: 0;
  h2 { margin: 0; font-size: 1.25rem; color: $principal; }
  .close-button { font-size: 1.8rem; background: none; border: none; cursor: pointer; color: #aaa; padding: 0 .5rem; line-height: 1; }
}
.modal-form {
  padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
}
.form-group {
  display: flex; flex-direction: column;
  label { margin-bottom: 0.5rem; font-weight: 500; color: $texto-escuro-principal; }
  .form-control {
    width: 100%; padding: 0.8rem 1rem; border: 1px solid $borda-card; border-radius: 6px; font-size: 1rem;
    box-sizing: border-box;
    &:focus { outline: none; border-color: $destaque; box-shadow: 0 0 0 3px rgba($destaque, 0.2); }
  }
  textarea.form-control {
    resize: vertical;
    min-height: 100px;
  }
}
.modal-footer {
  padding: 1rem 1.5rem; border-top: 1px solid $borda-card;
  display: flex; justify-content: flex-end; gap: 1rem; flex-shrink: 0;
}

// Animações
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes slide-down { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

// Estilos específicos para a página de Cronograma
.schedule-dashboard-page {
  .card-content {
    padding: 1.5rem;
  }
  .day-group {
    margin-bottom: 2.5rem;
    &:last-child { margin-bottom: 0; }
  }
  .day-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: $principal;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid $destaque;
    margin-bottom: 1.5rem;
  }
  .activity-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .activity-item {
    background-color: #fdfdfd;
    border: 1px solid $borda-card;
    border-left: 5px solid $destaque;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    transition: box-shadow 0.2s ease;
    &:hover {
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    }
  }
  .activity-info {
    flex-grow: 1;
  }
  .activity-header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.5rem;
    .time {
      font-weight: 600;
      color: $principal;
      font-size: 1.1rem;
    }
    .title {
      font-weight: 600;
      font-size: 1.2rem;
      color: $texto-escuro-principal;
    }
  }
  .activity-details {
    font-size: 0.9rem;
    color: #555;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding-left: 0.5rem;
    .detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .type-badge {
        background-color: rgba($principal, 0.1);
        color: $principal;
        font-weight: 500;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.8rem;
      }
    }
  }
  .activity-actions {
    display: flex;
    gap: 0.5rem;
  }
}


// Media Queries para Responsividade
@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem 1rem;
    .header-content { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
    h1 { font-size: 1.6rem; }
  }
  .dashboard-main-content { padding: 0 1rem; }
  .card-header { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 1rem; 
    h3 { font-size: 1.15rem; }
    .btn { width: 100%; justify-content: center; }
  }
  .schedule-dashboard-page .activity-item {
    flex-direction: column;
    align-items: stretch;
  }
  .schedule-dashboard-page .activity-actions {
    align-self: flex-end;
    margin-top: 0.5rem;
  }
}
</style>