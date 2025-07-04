<template>
  <div class="speakers-dashboard-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Gerenciamento de Palestrantes</h1>
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
          <h3>Lista de Palestrantes</h3>
          <button class="btn btn-primary" @click="abrirModalParaCriar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Adicionar Palestrante
          </button>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando palestrantes...</p>
        </div>
        
        <div v-else-if="palestrantes.length === 0" class="empty-state">
          <p>Nenhum palestrante encontrado. Que tal adicionar o primeiro?</p>
        </div>

        <div v-else class="table-responsive">
          <table class="speakers-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th class="description-col">Descrição</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="palestrante in palestrantes" :key="palestrante.id">
                <td>
                  <img :src="palestrante.foto" :alt="`Foto de ${palestrante.nome}`" class="speaker-photo"/>
                </td>
                <td>{{ palestrante.nome }}</td>
                <td class="description-col" :title="palestrante.descricao">{{ palestrante.descricao || '-' }}</td>
                <td class="actions-cell">
                  <button class="btn-icon btn-edit" @click="abrirModalParaEditar(palestrante)" title="Editar">
                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                  </button>
                  <button class="btn-icon btn-delete" @click="confirmarExclusao(palestrante.id)" title="Excluir">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-content">
        <header class="modal-header">
          <h2>{{ isEditing ? 'Editar Palestrante' : 'Novo Palestrante' }}</h2>
          <button @click="fecharModal" class="close-button">×</button>
        </header>
        <form @submit.prevent="salvarPalestrante" class="modal-form">
          <div class="form-group">
            <label for="speaker-name">Nome Completo*</label>
            <input id="speaker-name" type="text" v-model="palestranteAtual.nome" required placeholder="Nome do palestrante" class="form-control" />
          </div>
          <div class="form-group">
            <label for="speaker-photo-url">URL da Foto*</label>
            <input id="speaker-photo-url" type="url" v-model="palestranteAtual.foto" required placeholder="https://exemplo.com/foto.jpg" class="form-control" />
          </div>
          <div class="form-group">
            <label for="speaker-description">Descrição/Bio*</label>
            <textarea id="speaker-description" v-model="palestranteAtual.descricao" required rows="4" placeholder="Uma breve descrição ou biografia" class="form-control"></textarea>
          </div>
          
          <h4 class="form-section-title">Redes Sociais (Opcional)</h4>
          <div class="form-group">
            <label for="speaker-instagram">Instagram URL</label>
            <input id="speaker-instagram" type="url" v-model="palestranteAtual.redes.instagram" placeholder="https://instagram.com/usuario" class="form-control" />
          </div>
          <div class="form-group">
            <label for="speaker-linkedin">LinkedIn URL</label>
            <input id="speaker-linkedin" type="url" v-model="palestranteAtual.redes.linkedin" placeholder="https://linkedin.com/in/usuario" class="form-control" />
          </div>
          <div class="form-group">
            <label for="speaker-youtube">YouTube URL</label>
            <input id="speaker-youtube" type="url" v-model="palestranteAtual.redes.youtube" placeholder="https://youtube.com/c/usuario" class="form-control" />
          </div>
          <div class="form-group">
            <label for="speaker-site">Site Pessoal URL</label>
            <input id="speaker-site" type="url" v-model="palestranteAtual.redes.site" placeholder="https://meusite.com" class="form-control" />
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

interface SocialLinks {
  instagram: string;
  linkedin: string;
  youtube: string;
  site: string;
}

interface Speaker {
  id: string | number;
  nome: string;
  descricao: string;
  foto: string;
  redes: Partial<SocialLinks>;
}

interface SpeakerFormData {
  id?: string | number;
  nome: string;
  descricao: string;
  foto: string;
  redes: SocialLinks;
}

const router = useRouter();
const palestrantes = ref<Speaker[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);

const palestranteAtual = reactive<SpeakerFormData>({
  id: undefined, nome: '', descricao: '', foto: '',
  redes: { instagram: '', linkedin: '', youtube: '', site: '' },
});

const globalMessage = ref<{ text: string | null, type: 'success' | 'error' }>({
  text: null,
  type: 'success',
});

function displayMessage(text: string, type: 'success' | 'error', duration: number = 4000) {
  globalMessage.value = { text, type };
  setTimeout(() => { globalMessage.value.text = null; }, duration);
}

const voltarParaDashboard = () => {
  router.push({ name: 'Dashboard' }); // Padronizado para 'Dashboard'
};

async function carregarPalestrantes() {
  isLoading.value = true;
  try {
    const response = await api.get<Speaker[]>('/palestrante');
    palestrantes.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao carregar palestrantes:", error);
    displayMessage("Falha ao carregar a lista de palestrantes.", "error");
  } finally {
    isLoading.value = false;
  }
}

function tratarString(value: string | undefined | null): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

async function salvarPalestrante() {
  isSaving.value = true;
  const payload = {
    nome: tratarString(palestranteAtual.nome),
    descricao: tratarString(palestranteAtual.descricao),
    foto: tratarString(palestranteAtual.foto),
    instagram: tratarString(palestranteAtual.redes.instagram),
    linkedin: tratarString(palestranteAtual.redes.linkedin),
    youtube: tratarString(palestranteAtual.redes.youtube),
    site: tratarString(palestranteAtual.redes.site),
  };

  if (!payload.nome || !payload.descricao || !payload.foto) {
    displayMessage("Os campos Nome, Descrição e Foto são obrigatórios.", "error");
    isSaving.value = false;
    return;
  }

  try {
    if (isEditing.value) {
      await api.put(`/palestrante/${palestranteAtual.id}`, payload);
      displayMessage("Palestrante atualizado com sucesso!", "success");
    } else {
      await api.post('/palestrante', payload);
      displayMessage("Palestrante criado com sucesso!", "success");
    }
    fecharModal();
    await carregarPalestrantes();
  } catch (error: any) {
    console.error("Erro ao salvar palestrante:", error);
    displayMessage(error.response?.data?.message || "Ocorreu um erro ao salvar.", "error");
  } finally {
    isSaving.value = false;
  }
}

function confirmarExclusao(id: string | number) {
  if (window.confirm("Tem certeza que deseja excluir este palestrante?")) {
    excluirPalestrante(id);
  }
}

async function excluirPalestrante(id: string | number) {
  try {
    await api.delete(`/palestrante/${id}`);
    displayMessage("Palestrante excluído com sucesso!", "success");
    await carregarPalestrantes();
  } catch (error: any) {
    console.error("Erro ao excluir palestrante:", error);
    displayMessage(error.response?.data?.message || "Falha ao excluir o palestrante.", "error");
  }
}

function abrirModalParaCriar() {
  isEditing.value = false;
  Object.assign(palestranteAtual, {
    id: undefined, nome: '', descricao: '', foto: '',
    redes: { instagram: '', linkedin: '', youtube: '', site: '' },
  });
  showModal.value = true;
}

function abrirModalParaEditar(palestrante: Speaker) {
  isEditing.value = true;
  Object.assign(palestranteAtual, {
    ...palestrante,
    redes: {
      instagram: palestrante.redes?.instagram || '',
      linkedin: palestrante.redes?.linkedin || '',
      youtube: palestrante.redes?.youtube || '',
      site: palestrante.redes?.site || '',
    }
  });
  showModal.value = true;
}

function fecharModal() {
  showModal.value = false;
}

onMounted(carregarPalestrantes);
</script>

<style scoped lang="scss">
// Variáveis de tema (com adição de uma cor para texto secundário)
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;
$branco: #ffffff;
$cinza-fundo-pagina: #eef0f2;
$texto-escuro-principal: #2d3748;
$borda-card: #e2e8f0;
$cor-sucesso: #38a169;
$cor-erro: #e53e3e;
$cor-neutra: #64748b; /* --- CORREÇÃO: Nova variável para texto secundário legível --- */

// Estilo Base da Página
.speakers-dashboard-page {
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

// Tabela
.table-responsive { overflow-x: auto; }
.speakers-table { // Focando apenas na tabela de palestrantes
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid $borda-card;
    vertical-align: middle;
  }
  
  // CORREÇÃO APLICADA AQUI
  td {
    color: $texto-escuro-principal; /* --- CORREÇÃO: Define a cor padrão do texto das células --- */
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
  
  .speaker-photo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid $borda-card;
  }
  
  .description-col {
    color: $cor-neutra; /* --- CORREÇÃO: Define uma cor secundária, mas legível, para a descrição --- */
    max-width: 350px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .actions-cell {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
}

.text-right { text-align: right !important; }

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
    color: $texto-escuro-principal; // Garante que o texto digitado seja legível
    &:focus { outline: none; border-color: $destaque; box-shadow: 0 0 0 3px rgba($destaque, 0.2); }
  }
  textarea.form-control {
    resize: vertical;
    min-height: 100px;
  }
}
.form-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: $principal;
    margin-top: 1rem;
    margin-bottom: -0.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid $borda-card;
}
.modal-footer {
  padding: 1rem 1.5rem; border-top: 1px solid $borda-card;
  display: flex; justify-content: flex-end; gap: 1rem; flex-shrink: 0;
}

// Animações
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes slide-down { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }


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
    flex-direction: column; 
    align-items: flex-start; 
    gap: 1rem; 
    h3 { font-size: 1.15rem; }
    .btn { width: 100%; justify-content: center; }
  }
}
</style>