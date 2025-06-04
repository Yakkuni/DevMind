<template>
  <div class="admin-resource-dashboard palestrantes-admin-page">
    <header class="page-header-alt">
      <div class="header-content-alt">
        <button @click="voltarParaDashboard" class="btn btn-back" aria-label="Voltar para o Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Voltar
        </button>
        <h1>Gerenciar Palestrantes</h1>
      </div>
      <button @click="abrirFormularioNovoPalestrante" class="btn btn-primary btn-add-new">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Adicionar Palestrante
      </button>
    </header>

    <div v-if="mensagemGlobal.text" :class="['alert', `alert-${mensagemGlobal.type}`]">{{ mensagemGlobal.text }}</div>

    <div v-if="mostrarFormulario" class="card form-card">
      <h2>{{ formPalestrante.id ? 'Editar Palestrante' : 'Adicionar Novo Palestrante' }}</h2>
      <form @submit.prevent="handleSalvarPalestrante" class="resource-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="speaker-name">Nome Completo*</label>
            <input id="speaker-name" type="text" v-model="formPalestrante.nome" required placeholder="Nome do palestrante" />
          </div>
          <div class="form-group form-group-full">
            <label for="speaker-description">Descrição/Bio*</label>
            <textarea id="speaker-description" v-model="formPalestrante.descricao" required rows="4" placeholder="Uma breve descrição ou biografia do palestrante"></textarea>
          </div>
          <div class="form-group form-group-full">
            <label for="speaker-photo-url">URL da Foto*</label>
            <input id="speaker-photo-url" type="url" v-model="formPalestrante.foto" required placeholder="https://exemplo.com/foto.jpg" />
          </div>
          
          <h4 class="form-section-title">Redes Sociais (Opcional)</h4>
          <div class="form-group">
            <label for="speaker-instagram">Instagram URL</label>
            <input id="speaker-instagram" type="url" v-model="formPalestrante.redes.instagram" placeholder="https://instagram.com/usuario" />
          </div>
          <div class="form-group">
            <label for="speaker-linkedin">LinkedIn URL</label>
            <input id="speaker-linkedin" type="url" v-model="formPalestrante.redes.linkedin" placeholder="https://linkedin.com/in/usuario" />
          </div>
          <div class="form-group">
            <label for="speaker-youtube">YouTube URL</label>
            <input id="speaker-youtube" type="url" v-model="formPalestrante.redes.youtube" placeholder="https://youtube.com/channel/..." />
          </div>
          <div class="form-group">
            <label for="speaker-site">Site Pessoal URL</label>
            <input id="speaker-site" type="url" v-model="formPalestrante.redes.site" placeholder="https://meusite.com" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="fecharFormulario" :disabled="isSaving">
            Cancelar
          </button>
          <button type="submit" class="btn btn-success" :disabled="isSaving">
            <span v-if="isSaving">Salvando...</span>
            <span v-else>{{ formPalestrante.id ? 'Salvar Alterações' : 'Criar Palestrante' }}</span>
          </button>
        </div>
      </form>
    </div>

    <div class="card list-card">
      <h2>Palestrantes Cadastrados ({{ palestrantes.length }})</h2>
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div> Carregando palestrantes...
      </div>
      <div v-else-if="palestrantes.length === 0 && !mensagemGlobal.text" class="empty-state">
        Nenhum palestrante cadastrado. Clique em "Adicionar Palestrante" para começar.
      </div>
      <div v-else class="table-responsive-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th class="description-col">Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="speaker in palestrantes" :key="speaker.id">
              <td data-label="Foto">
                <img :src="speaker.foto" :alt="`Foto de ${speaker.nome}`" class="table-photo-thumbnail" v-if="speaker.foto"/>
                <span v-else class="no-photo-placeholder">Sem foto</span>
              </td>
              <td data-label="Nome">{{ speaker.nome }}</td>
              <td data-label="Descrição" class="description-col">{{ speaker.descricao || '-' }}</td>
              <td data-label="Ações" class="actions-cell">
                <button @click="iniciarEdicao(speaker)" class="btn btn-sm btn-icon btn-edit" title="Editar Palestrante">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75Z"/></svg>
                </button>
                <button @click="confirmarDelecao(speaker.id)" class="btn btn-sm btn-icon btn-delete" title="Excluir Palestrante">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zm0 5h2v9H9zm4 0h2v9h-2z"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api'; 

// Tipagem para redes sociais (como recebido da API GET)
interface SocialLinksFromAPI {
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  site?: string | null;
}

// Tipagem para dados do palestrante como vêm da API (GET)
interface SpeakerFromAPI {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  redes: SocialLinksFromAPI; 
  // tag?: string; // Removido
}

// Tipagem para o formulário
type SpeakerFormData = {
  id?: string;
  nome: string;
  descricao: string;
  foto: string;
  // tag: string; // Removido
  redes: { 
    instagram: string;
    linkedin: string;
    youtube: string;
    site: string;
  };
};

// Tipagem para o payload enviado para o backend (POST/PUT)
interface SpeakerApiPayload {
    nome: string;
    descricao: string | null;
    foto: string | null;
    // tag: string | null; // Removido
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    site: string | null;
}

const router = useRouter();
const palestrantes = ref<SpeakerFromAPI[]>([]);
const mostrarFormulario = ref(false);

const formPalestrante = reactive<SpeakerFormData>({
  id: undefined,
  nome: '',
  descricao: '',
  foto: '',
  // tag: 'Palestrante Confirmado', // Removido
  redes: { instagram: '', linkedin: '', youtube: '', site: '' },
});

const isLoading = ref(true); 
const isSaving = ref(false);  
const mensagemGlobal = ref<{ text: string | null, type: 'success' | 'error' | null }>({
  text: null,
  type: null,
});

// Exibe mensagens de feedback
const exibirMensagemGlobal = (msg: string | null, tipo: 'success' | 'error' | null, tempo: number = 4000) => {
  mensagemGlobal.value = { text: msg, type: tipo };
  if (msg) { 
    setTimeout(() => { mensagemGlobal.value = { text: null, type: null }; }, tempo);
  }
};

// Busca palestrantes do backend
async function fetchPalestrantes() {
  isLoading.value = true;
  try {
    const response = await api.get<SpeakerFromAPI[]>('/palestrante');
    palestrantes.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar palestrantes:", error);
    exibirMensagemGlobal("Falha ao carregar lista de palestrantes.", "error");
  } finally {
    isLoading.value = false;
  }
}

// Abre formulário para novo palestrante
function abrirFormularioNovoPalestrante() {
  formPalestrante.id = undefined;
  formPalestrante.nome = '';
  formPalestrante.descricao = '';
  formPalestrante.foto = '';
  // formPalestrante.tag = 'Palestrante Confirmado'; // Removido
  formPalestrante.redes = { instagram: '', linkedin: '', youtube: '', site: '' };
  mostrarFormulario.value = true;
  exibirMensagemGlobal(null, null); 
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fecha formulário
function fecharFormulario() {
  mostrarFormulario.value = false;
}

// Preenche formulário para edição
function iniciarEdicao(speaker: SpeakerFromAPI) {
  formPalestrante.id = speaker.id;
  formPalestrante.nome = speaker.nome || '';
  formPalestrante.descricao = speaker.descricao || '';
  formPalestrante.foto = speaker.foto || '';
  // formPalestrante.tag = speaker.tag || 'Palestrante Confirmado'; // Removido
  formPalestrante.redes = {
    instagram: speaker.redes?.instagram || '',
    linkedin: speaker.redes?.linkedin || '',
    youtube: speaker.redes?.youtube || '',
    site: speaker.redes?.site || '',
  };
  mostrarFormulario.value = true;
  exibirMensagemGlobal(null, null); 
  console.log("[INICIAR EDIÇÃO] formPalestrante populado:", JSON.parse(JSON.stringify(formPalestrante)));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Trata strings (remove espaços, converte vazias para null)
function tratarString(value: string | undefined | null): string | null {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim(); 
    return trimmed === '' ? null : trimmed; 
}

// Salva (cria ou atualiza) palestrante
async function handleSalvarPalestrante() {
  isSaving.value = true;
  exibirMensagemGlobal(null, null);
  console.log("[SALVAR] Estado inicial de formPalestrante.redes:", JSON.parse(JSON.stringify(formPalestrante.redes)));

  const nomeTratado = tratarString(formPalestrante.nome);
  if (!nomeTratado) {
    exibirMensagemGlobal("O nome do palestrante é obrigatório.", "error");
    isSaving.value = false;
    return;
  }
  
  const fotoTratada = tratarString(formPalestrante.foto);
  if (fotoTratada && !(fotoTratada.startsWith('http://') || fotoTratada.startsWith('https://'))) {
      exibirMensagemGlobal("URL da foto inválida. Deve começar com http:// ou https://", "error");
      isSaving.value = false;
      return;
  }
  // A validação da descrição é feita pelo 'required' no template, mas poderia ser adicionada aqui também.

  const payload: SpeakerApiPayload = {
    nome: nomeTratado,
    descricao: tratarString(formPalestrante.descricao) || '', // Envia string vazia se for null, pois é obrigatório no form
    foto: fotoTratada || '', // Envia string vazia se for null, pois é obrigatório no form
    // tag: tratarString(formPalestrante.tag), // Removido
    instagram: tratarString(formPalestrante.redes.instagram),
    linkedin: tratarString(formPalestrante.redes.linkedin),
    youtube: tratarString(formPalestrante.redes.youtube),
    site: tratarString(formPalestrante.redes.site),
  };
  
  console.log("[SALVAR] Payload FINAL a ser enviado:", JSON.parse(JSON.stringify(payload)));

  try {
    if (formPalestrante.id) {
      await api.put(`/palestrante/${formPalestrante.id}`, payload);
      exibirMensagemGlobal("Palestrante atualizado com sucesso!", "success");
    } else {
      await api.post('/palestrante', payload); 
      exibirMensagemGlobal("Palestrante criado com sucesso!", "success");
    }
    fecharFormulario();
    fetchPalestrantes(); 
    window.dispatchEvent(new CustomEvent('speakersUpdated'));
  } catch (error: any) {
    console.error("Erro ao salvar palestrante:", error);
    exibirMensagemGlobal(error.response?.data?.message || "Falha ao salvar palestrante.", "error");
  } finally {
    isSaving.value = false;
  }
}

// Confirma e executa exclusão
async function confirmarDelecao(id: string) {
  if (window.confirm("Tem certeza que deseja excluir este palestrante? Esta ação não pode ser desfeita.")) {
    isSaving.value = true; 
    try {
      await api.delete(`/palestrante/${id}`);
      exibirMensagemGlobal("Palestrante excluído com sucesso!", "success");
      fetchPalestrantes();
      window.dispatchEvent(new CustomEvent('speakersUpdated'));
    } catch (error: any) {
      console.error("Erro ao excluir palestrante:", error);
      exibirMensagemGlobal(error.response?.data?.message || "Falha ao excluir palestrante.", "error");
    } finally {
      isSaving.value = false;
    }
  }
}

// Navega para o dashboard principal
function voltarParaDashboard() { 
  router.push({ name: 'Dashboard' }); 
}

onMounted(fetchPalestrantes);
</script>

<style scoped lang="scss">
// Suas variáveis de tema (assumindo que estão disponíveis globalmente ou importe-as)
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
$texto-primario: #2d3748; 
$texto-secundario: #4a5568; 

.palestrantes-admin-page {
  padding: 1.5rem;
  background-color: $cinza-fundo-pagina;
  min-height: calc(100vh - 70px); 
}

.page-header-alt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem; 
  padding: 1.25rem 1.5rem; // Padding uniforme
  background-color: $branco; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba($preto, 0.06);
  border: 1px solid $cinza-borda;

  .header-content-alt {
    display: flex;
    align-items: center;
    gap: 0.75rem; 
  }

  h1 {
    font-size: 1.7rem; // Ajustado
    color: $principal;
    font-weight: 600; // Um pouco menos "bold" que 700
    margin: 0;
  }
}

.btn-back {
  background-color: transparent;
  color: $principal;
  border: 1px solid $cinza-borda; // Borda mais suave
  padding: 0.5rem 0.9rem; 
  font-weight: 500; 
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; 
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  svg { fill: $principal; transition: fill 0.2s ease; width: 18px; height: 18px;}

  &:hover {
    background-color: lighten($principal, 75%);
    border-color: $principal;
  }
}

.card {
  background-color: $branco;
  border-radius: 10px; 
  box-shadow: 0 4px 12px rgba($preto, 0.06); 
  padding: 2rem 2.5rem; // Mais padding lateral
  margin-bottom: 2.5rem; 
  border: 1px solid $cinza-borda;

  h2 { // Título dentro dos cards (Formulário e Lista)
    font-size: 1.35rem; 
    color: $complemento;
    margin-top: 0;
    margin-bottom: 1.8rem; 
    padding-bottom: 0.75rem; 
    border-bottom: 1px solid $cinza-borda;
    font-weight: 600; 
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); // Aumentado minmax
  gap: 1.5rem; 
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 0.5rem; 
    font-weight: 500; 
    color: $texto-secundario; 
    font-size: 0.9rem; // Labels um pouco maiores
  }
  input[type="text"],
  input[type="url"],
  select,
  textarea {
    width: 100%;
    padding: 0.85rem 1rem; 
    border: 1px solid $cinza-borda;
    border-radius: 6px;
    font-size: 0.95rem;
    color: $texto-primario;
    background-color: $branco; 
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder { color: lighten($complementoCLaro, 20%); } // Placeholder ainda mais claro
    &:focus {
      outline: none;
      border-color: $destaque;
      box-shadow: 0 0 0 3px rgba($destaque, 0.2);
    }
  }
  textarea { resize: vertical; min-height: 100px; }
  small { font-size: 0.8rem; color: $complementoCLaro; margin-top: 0.4rem; }
}
.form-group-full { grid-column: 1 / -1; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; } 
.form-section-title {
    grid-column: 1 / -1;
    font-size: 1.05rem; 
    font-weight: 600;
    color: $principal;
    margin-top: 1.5rem; 
    margin-bottom: 1rem; 
    padding-bottom: 0.6rem; 
    border-bottom: 1px solid lighten($cinza-borda, 5%); 
}

.table-responsive-wrapper { overflow-x: auto; }
.data-table {
  width: 100%;
  border-collapse: collapse; 
  font-size: 0.9rem; 
  th, td {
    padding: 0.9rem 1.1rem; 
    text-align: left;
    border-bottom: 1px solid $cinza-borda;
    vertical-align: middle; 
    color: $texto-secundario; 
  }
  th {
    background-color: lighten($cinza-fundo-pagina, 2%); // Cabeçalho da tabela mais sutil
    color: $complemento; // Texto do cabeçalho escuro
    font-weight: 600;
    white-space: nowrap;
    border-bottom: 2px solid $cinza-borda; // Borda inferior do header
  }
  tr:last-child td { border-bottom: none; }
  tr:hover { background-color: lighten($principal, 80%); } 
  
  td[data-label="Nome"] {
    font-weight: 500; 
    color: $complemento;
  }

  .table-photo-thumbnail {
    width: 48px; // Foto um pouco maior na tabela
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid $branco; 
    box-shadow: 0 1px 4px rgba($preto, 0.1); // Sombra mais definida
  }
  .no-photo-placeholder {
    display: inline-flex; 
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: $complementoCLaro;
    color: $branco;
    font-size: 0.65rem; 
    font-weight: 500;
    border: 2px solid $branco;
    box-shadow: 0 1px 4px rgba($preto, 0.1);
  }
  .description-col { 
    max-width: 350px; // Permite mais texto
    font-size: 0.875rem; 
    white-space: normal; // Permite quebra de linha
  }
  td.actions-cell {
    white-space: nowrap; 
    text-align: right; 
  }
}

// Botões e Alertas (Estilos padrão do admin)
.btn {
  padding: 0.65rem 1.25rem; 
  font-size: 0.875rem; 
  border-radius: 6px; 
  border: 1px solid transparent; 
  cursor: pointer;
  transition: all 0.2s ease-in-out; 
  font-weight: 600; 
  display: inline-flex; align-items: center; justify-content: center;
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba($preto, 0.05);
  svg { margin-right: 0.5em; width: 16px; height: 16px;}

  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 3px 6px rgba($preto, 0.1); }
  &:active:not(:disabled) { transform: translateY(0px); box-shadow: 0 1px 2px rgba($preto, 0.05); }
  &:disabled { opacity: 0.65; cursor: not-allowed; }

  &.btn-primary { 
    background-color: $principal; 
    color: $branco; 
    border-color: $principal;
    &:hover:not(:disabled) { background-color: darken($principal, 7%); border-color: darken($principal, 7%);}
  }
  &.btn-add-new { 
    background-color: $destaque; 
    color: $principal; 
    border-color: $destaque;
    &:hover:not(:disabled) { background-color: darken($destaque, 10%); border-color: darken($destaque, 10%);}
  } 
  &.btn-success { 
    background-color: $cor-sucesso; 
    color: $branco; 
    border-color: $cor-sucesso;
    &:hover:not(:disabled) { background-color: darken($cor-sucesso, 7%); border-color: darken($cor-sucesso, 7%);}
  }
  &.btn-secondary { 
    background-color: $complementoCLaro; 
    color: $branco; 
    border-color: $complementoCLaro;
    &:hover:not(:disabled) { background-color: darken($complementoCLaro, 10%); border-color: darken($complementoCLaro, 10%); }
  }
  
  &.btn-sm { padding: 0.35rem 0.7rem; font-size: 0.75rem; 
    svg { width: 14px; height: 14px; }
  }
  &.btn-icon {
    background: transparent; border: none; padding: 0.4rem; box-shadow: none; border-radius: 50%; // Padding menor
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
    .palestrantes-admin-page { padding: 1rem; }
    .page-header-alt {
      flex-direction: column;
      align-items: stretch; 
      gap: 1rem;
      .header-content-alt { justify-content: center; } 
      h1 { font-size: 1.5rem; text-align: center; } 
      .btn-add-new { width: 100%; font-size: 0.9rem; }
      .btn-back { align-self: flex-start; margin-bottom: 0.5rem;}
    }
    .form-grid { grid-template-columns: 1fr; }
    .card { padding: 1.25rem; }
    .card h2 { font-size: 1.25rem; margin-bottom: 1.25rem;}
    .form-actions { flex-direction: column; gap: 0.75rem; button { width: 100%;} }
    .data-table { 
        thead { display: none; }
        tr { display: block; margin-bottom: 1rem; border: 1px solid $cinza-borda; border-radius: 8px; box-shadow: 0 2px 6px rgba($preto,0.05); padding: 0.8rem; } 
        td { 
          display: grid;
          grid-template-columns: 90px 1fr; // Label com largura fixa
          align-items: center; // Alinha melhor o label com inputs de diferentes alturas
          text-align: left; 
          padding: 0.7rem 0; // Aumentado padding vertical
          border-bottom: 1px dotted lighten($cinza-borda, 8%);
          font-size: 0.9rem; 

          &::before {
            content: attr(data-label); 
            font-weight: 600; 
            color: $principal;
            padding-right: 0.5rem;
            white-space: nowrap;
            font-size: 0.85rem; // Label um pouco menor
          }
          &:last-child { border-bottom: none; padding-bottom: 0; }
          
          & > * { // Conteúdo da célula
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
            white-space: normal; 
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