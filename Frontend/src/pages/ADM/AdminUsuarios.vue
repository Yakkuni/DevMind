<template>
  <div class="users-dashboard-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Gerenciamento de Usuários</h1>
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
          <h3>Lista de Usuários</h3>
          <button class="btn btn-primary" @click="abrirModalParaCriar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Adicionar Usuário
          </button>
        </div>

        <div v-if="isLoading" class="loading-state"></div>
        <div v-else-if="usuarios.length === 0" class="empty-state"></div>

        <div v-else class="table-responsive">
          <table class="users-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span class="cargo-badge" :class="`cargo-${usuario.cargo}`">{{ usuario.cargo }}</span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon btn-edit" @click="abrirModalParaEditar(usuario)" title="Editar Usuário"></button>
                  <button class="btn-icon btn-delete" @click="confirmarExclusao(usuario.id)" title="Excluir Usuário"></button>
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
          <h2>{{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
          <button @click="fecharModal" class="close-button" aria-label="Fechar">×</button>
        </header>
        <form @submit.prevent="salvarUsuario" class="modal-form">
          <div class="form-group">
            <label for="nome">Nome do Usuário*</label>
            <input type="text" id="nome" v-model="usuarioAtual.nome" required class="form-control">
          </div>
          <div class="form-group">
            <label for="email">Email*</label>
            <input type="email" id="email" v-model="usuarioAtual.email" :disabled="isEditing" required class="form-control">
            <small v-if="isEditing">O email não pode ser alterado.</small>
          </div>
          <div class="form-group">
            <label for="cargo">Cargo*</label>
            <select id="cargo" v-model="usuarioAtual.cargo" required class="form-control">
              <option value="admin">Admin</option>
              <option value="comum">Comum</option>
            </select>
          </div>
          <div class="form-group">
             <label for="senha">Senha*</label>
             <input type="password" id="senha" v-model="usuarioAtual.senha" :required="!isEditing" class="form-control" :placeholder="isEditing ? 'Deixe em branco para não alterar' : 'Digite a senha inicial'">
          </div>

          <footer class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModal" :disabled="isSaving">Cancelar</button>
            <button type="submit" class="btn btn-success" :disabled="isSaving">
              {{ isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Usuário') }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api'; 

// Interfaces
interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: 'admin' | 'comum';
}
interface FormUsuarioData {
  id?: string;
  nome: string;
  email: string;
  cargo: 'admin' | 'comum';
  senha?: string;
}

const router = useRouter();
const usuarios = ref<Usuario[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);

const usuarioAtual = reactive<FormUsuarioData>({
  id: undefined, nome: '', email: '', cargo: 'comum', senha: ''
});

const globalMessage = ref<{ text: string | null, type: 'success' | 'error' }>({
  text: null, type: 'success',
});

function displayMessage(text: string, type: 'success' | 'error', duration: number = 4000) {
  globalMessage.value = { text, type };
  setTimeout(() => { globalMessage.value.text = null; }, duration);
}

function voltarParaDashboard() { 
  router.push({ name: 'AdminDashboard' }); 
}

async function carregarUsuarios() {
  isLoading.value = true;
  try {
    const response = await api.get<Usuario[]>('/user');
    usuarios.value = response.data;
  } catch (error) {
    displayMessage("Não foi possível carregar a lista de usuários.", "error");
  } finally {
    isLoading.value = false;
  }
}

async function salvarUsuario() {
  isSaving.value = true;

  try {
    if (isEditing.value) {
      // Lógica de ATUALIZAÇÃO (PUT)
      if (!usuarioAtual.id) return;
      const payload: { nome: string; cargo: 'admin' | 'comum'; password?: string } = {
        nome: usuarioAtual.nome,
        cargo: usuarioAtual.cargo,
      };
      // Alinhado com o DTO: a propriedade é 'password'
      if (usuarioAtual.senha) {
        payload.password = usuarioAtual.senha;
      }
      await api.put(`/user/${usuarioAtual.id}`, payload);
      displayMessage("Usuário atualizado com sucesso!", "success");
    } else {
      // Lógica de CRIAÇÃO (POST)
      if (!usuarioAtual.senha) {
        displayMessage("A senha é obrigatória para criar um novo usuário.", "error");
        isSaving.value = false;
        return;
      }
      const payload = {
        nome: usuarioAtual.nome,
        email: usuarioAtual.email,
        cargo: usuarioAtual.cargo,
        // --- ALTERAÇÃO CRÍTICA AQUI ---
        // Enviando 'password' em vez de 'senha' para corresponder ao DTO do backend.
        password: usuarioAtual.senha,
      };
      await api.post('/user', payload);
      displayMessage("Usuário criado com sucesso!", "success");
    }
    fecharModal();
    await carregarUsuarios();
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message || "Ocorreu um erro no servidor.";
    displayMessage(`Falha ao salvar: ${errorMessage}`, "error");
  } finally {
    isSaving.value = false;
  }
}

function confirmarExclusao(id: string) {
  if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
    excluirUsuario(id);
  }
}

async function excluirUsuario(id: string) {
  try {
    await api.delete(`/user/${id}`);
    displayMessage("Usuário excluído com sucesso!", "success");
    await carregarUsuarios();
  } catch (error) {
    displayMessage("Falha ao excluir o usuário.", "error");
  }
}

function abrirModalParaCriar() {
  isEditing.value = false;
  Object.assign(usuarioAtual, { id: undefined, nome: '', email: '', cargo: 'comum', senha: '' });
  showModal.value = true;
}

function abrirModalParaEditar(usuario: Usuario) {
  isEditing.value = true;
  Object.assign(usuarioAtual, { ...usuario, senha: '' });
  showModal.value = true;
}

function fecharModal() {
  showModal.value = false;
}

onMounted(carregarUsuarios);
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

// Estilo Base da Página
.users-dashboard-page {
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
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  color: $branco;
  font-weight: 500;
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
  h3 { margin: 0; color: $principal; font-size: 1.25rem; font-weight: 600; }
}

// Estados
.loading-state, .empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 4rem 2rem; color: #718096; text-align: center;
  .spinner {
    width: 50px; height: 50px; border: 5px solid rgba($principal, 0.2);
    border-top-color: $destaque; border-radius: 50%;
    animation: spin 1s linear infinite; margin-bottom: 1rem;
  }
}

// Tabela
.table-responsive { overflow-x: auto; }
.users-table {
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 1rem 1.5rem; text-align: left;
    border-bottom: 1px solid $borda-card; vertical-align: middle;
  }
  td { color: $texto-escuro-principal; }
  thead th {
    background-color: #f8fafc; color: $texto-escuro-principal;
    font-weight: 600; font-size: 0.85rem;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background-color: #f9f9fc; }
  .actions-cell {
    display: flex; gap: 0.75rem; justify-content: flex-end;
  }
}
.text-right { text-align: right !important; }

// Badge de Cargo
.cargo-badge {
  padding: 0.3em 0.8em;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: $branco;
  text-transform: uppercase;

  &.cargo-admin { background-color: $principal; }
  &.cargo-comum { background-color: #64748b; }
}

// Botões
.btn {
  padding: 0.7rem 1.4rem; font-size: 0.9rem; border-radius: 6px; border: 2px solid transparent; cursor: pointer;
  transition: all 0.25s ease; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5em;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
.btn-primary { background-color: $destaque; color: $principal; border-color: $destaque; &:hover:not(:disabled) { background-color: darken($destaque, 8%); }}
.btn-secondary { background-color: #6c757d; color: $branco; border-color: #6c757d; &:hover:not(:disabled) { background-color: darken(#6c757d, 8%); }}
.btn-success { background-color: $cor-sucesso; color: $branco; border-color: $cor-sucesso; &:hover:not(:disabled) { background-color: darken($cor-sucesso, 8%); }}
.btn-outline-light {
    background-color: transparent; border-color: rgba($branco, 0.7); color: $branco;
    &:hover:not(:disabled) { background-color: rgba($branco, 0.1); border-color: $branco; }
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
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: $branco; border-radius: 10px; width: 90%; max-width: 550px; max-height: 90vh;
  display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slide-down 0.3s ease-out;
}
.modal-header {
  padding: 1rem 1.5rem; border-bottom: 1px solid $borda-card; display: flex;
  justify-content: space-between; align-items: center;
  h2 { margin: 0; font-size: 1.25rem; color: $principal; }
  .close-button { font-size: 1.8rem; background: none; border: none; cursor: pointer; color: #aaa; }
}
.modal-form {
  padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
}
.form-group {
  display: flex; flex-direction: column;
  label { margin-bottom: 0.5rem; font-weight: 500; color: $texto-escuro-principal; }
  .form-control {
    width: 100%; padding: 0.8rem 1rem; border: 1px solid $borda-card; border-radius: 6px; font-size: 1rem;
    box-sizing: border-box; color: $texto-escuro-principal;
    &:focus { outline: none; border-color: $destaque; box-shadow: 0 0 0 3px rgba($destaque, 0.2); }
    &:disabled { background-color: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
  }
  small { font-size: 0.8rem; color: #6b7280; margin-top: 0.4rem; }
}
.modal-footer {
  padding: 1rem 1.5rem; border-top: 1px solid $borda-card;
  display: flex; justify-content: flex-end; gap: 1rem;
}
// Animações
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes slide-down { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>