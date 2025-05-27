<template>
  <div class="admin-speakers-dashboard">
    <header class="dashboard-header">
      <h1>Gerenciar Palestrantes</h1>
      <button @click="toggleFormularioNovoPalestrante" class="btn btn-primary">
        {{ mostrarFormularioNovo ? 'Cancelar Novo Palestrante' : 'Adicionar Novo Palestrante' }}
      </button>
    </header>

    <div v-if="mensagemSucesso" class="alert alert-success">
      {{ mensagemSucesso }}
    </div>
    <div v-if="mensagemErro" class="alert alert-danger">
      {{ mensagemErro }}
    </div>

    <div v-if="mostrarFormularioNovo" class="card novo-palestrante-form">
      <h2>Adicionar Novo Palestrante</h2>
      <form @submit.prevent="criarNovoPalestrante">
        <div class="form-grid">
          <div class="form-group">
            <label for="novo-nome">Nome</label>
            <input id="novo-nome" v-model="novoPalestrante.nome" placeholder="Nome completo" required />
          </div>
          <div class="form-group">
            <label for="novo-foto">Link da Foto (URL)</label>
            <input id="novo-foto" type="url" v-model="novoPalestrante.foto" placeholder="https://exemplo.com/foto.jpg" required />
          </div>
          <div class="form-group form-group-full">
            <label for="novo-descricao">Descrição</label>
            <textarea id="novo-descricao" v-model="novoPalestrante.descricao" placeholder="Breve descrição do palestrante" required rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="novo-instagram">Instagram (URL)</label>
            <input id="novo-instagram" type="url" v-model="novoPalestrante.redes.instagram" placeholder="https://instagram.com/usuario" />
          </div>
          <div class="form-group">
            <label for="novo-linkedin">LinkedIn (URL)</label>
            <input id="novo-linkedin" type="url" v-model="novoPalestrante.redes.linkedin" placeholder="https://linkedin.com/in/usuario" />
          </div>
          <div class="form-group">
            <label for="novo-youtube">YouTube (URL)</label>
            <input id="novo-youtube" type="url" v-model="novoPalestrante.redes.youtube" placeholder="https://youtube.com/canal" />
          </div>
          <div class="form-group">
            <label for="novo-site">Site Pessoal (URL)</label>
            <input id="novo-site" type="url" v-model="novoPalestrante.redes.site" placeholder="https://site.com" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success" :disabled="isLoading">
            <span v-if="isLoading">Salvando...</span>
            <span v-else>Criar Palestrante</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="toggleFormularioNovoPalestrante" :disabled="isLoading">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="table-container card">
      <h2>Palestrantes Cadastrados</h2>
      <div v-if="isLoading && palestrantes.length === 0" class="loading-state">
        Carregando palestrantes...
      </div>
      <div v-else-if="!isLoading && palestrantes.length === 0 && !mensagemErro" class="empty-state">
        Nenhum palestrante cadastrado ainda. Adicione um novo!
      </div>
      <table v-else-if="palestrantes.length > 0" class="tabela-palestrantes">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Redes Sociais</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="palestrante in palestrantes" :key="palestrante.id">
            <td><img :src="palestrante.foto" :alt="palestrante.nome" class="speaker-photo-thumbnail" /></td>
            <td><input type="text" v-model="palestrante.nome" placeholder="Nome" class="form-control-table" /></td>
            <td><textarea v-model="palestrante.descricao" placeholder="Descrição" class="form-control-table" rows="2"></textarea></td>
            <td class="social-links-inputs">
              <input type="url" v-model="palestrante.redes.instagram" placeholder="Instagram" class="form-control-table mb-small" />
              <input type="url" v-model="palestrante.redes.linkedin" placeholder="LinkedIn" class="form-control-table mb-small" />
              <input type="url" v-model="palestrante.redes.youtube" placeholder="YouTube" class="form-control-table mb-small" />
              <input type="url" v-model="palestrante.redes.site" placeholder="Site" class="form-control-table" />
            </td>
            <td class="actions-cell">
              <button @click="salvarAlteracoes(palestrante)" class="btn btn-sm btn-primary" :disabled="isLoading">
                <span v-if="isLoadingItem === palestrante.id && currentAction === 'salvar'">Salvando...</span>
                <span v-else>Salvar</span>
              </button>
              <button @click="deletarPalestrante(palestrante.id)" class="btn btn-sm btn-danger" :disabled="isLoading">
                 <span v-if="isLoadingItem === palestrante.id && currentAction === 'deletar'">Excluindo...</span>
                <span v-else>Excluir</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import api from '../../services/api'; // Seu arquivo de configuração do Axios

// --- Tipagem ---
interface SocialLinks {
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  site?: string | null;
}

interface Speaker {
  id: string; // Ou number, dependendo do seu backend
  nome: string;
  descricao: string;
  foto: string;
  redes: SocialLinks;
}

// --- Estado Reativo ---
const palestrantes = ref<Speaker[]>([]);
const novoPalestrante = reactive<Omit<Speaker, 'id'>>({
  nome: '',
  descricao: '',
  foto: '',
  redes: {
    instagram: '',
    linkedin: '',
    youtube: '',
    site: '',
  },
});

const isLoading = ref(false);
const isLoadingItem = ref<string | null>(null); // Para feedback em botões específicos
const currentAction = ref<'salvar' | 'deletar' | null>(null);
const mensagemSucesso = ref<string | null>(null);
const mensagemErro = ref<string | null>(null);
const mostrarFormularioNovo = ref(false);

// --- Funções de Feedback ---
const mostrarMensagem = (msg: string, tipo: 'sucesso' | 'erro', tempo: number = 3000) => {
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

// --- Funções CRUD ---
const carregarPalestrantes = async () => {
  isLoading.value = true;
  mensagemErro.value = null;
  try {
    // Ajuste 'res.data' se a sua API retornar os dados de forma diferente (ex: res.data.data)
    const res = await api.get<Speaker[]>('/palestrante');
    palestrantes.value = res.data;
  } catch (error) {
    console.error('Erro ao carregar palestrantes:', error);
    mostrarMensagem('Falha ao carregar palestrantes. Verifique o console.', 'erro');
    palestrantes.value = []; // Limpa para evitar exibir dados obsoletos
  } finally {
    isLoading.value = false;
  }
};

const salvarAlteracoes = async (palestrante: Speaker) => {
  isLoading.value = true;
  isLoadingItem.value = palestrante.id;
  currentAction.value = 'salvar';
  try {
    await api.put(`/palestrante/${palestrante.id}`, palestrante);
    mostrarMensagem('Palestrante atualizado com sucesso!', 'sucesso');
    window.dispatchEvent(new CustomEvent('speakersUpdated')); // Notifica outros componentes
    // Opcional: recarregar para garantir consistência total, mas o v-model já atualiza localmente.
    // await carregarPalestrantes();
  } catch (error) {
    console.error('Erro ao atualizar palestrante:', error);
    mostrarMensagem('Erro ao atualizar palestrante.', 'erro');
  } finally {
    isLoading.value = false;
    isLoadingItem.value = null;
    currentAction.value = null;
  }
};

const deletarPalestrante = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir este palestrante? Esta ação não pode ser desfeita.')) {
    isLoading.value = true;
    isLoadingItem.value = id;
    currentAction.value = 'deletar';
    try {
      await api.delete(`/palestrante/${id}`);
      palestrantes.value = palestrantes.value.filter(p => p.id !== id);
      mostrarMensagem('Palestrante excluído com sucesso!', 'sucesso');
      window.dispatchEvent(new CustomEvent('speakersUpdated')); // Notifica outros componentes
    } catch (error) {
      console.error('Erro ao excluir palestrante:', error);
      mostrarMensagem('Erro ao excluir palestrante.', 'erro');
    } finally {
      isLoading.value = false;
      isLoadingItem.value = null;
      currentAction.value = null;
    }
  }
};

const resetarFormularioNovo = () => {
  novoPalestrante.nome = '';
  novoPalestrante.descricao = '';
  novoPalestrante.foto = '';
  novoPalestrante.redes = {
    instagram: '',
    linkedin: '',
    youtube: '',
    site: '',
  };
};

const criarNovoPalestrante = async () => {
  isLoading.value = true;
  try {
    const { data: novoPalestranteCriado } = await api.post<Speaker>('/palestrante', novoPalestrante);
    palestrantes.value.push(novoPalestranteCriado);
    mostrarMensagem('Palestrante criado com sucesso!', 'sucesso');
    resetarFormularioNovo();
    mostrarFormularioNovo.value = false; // Oculta o formulário após sucesso
    window.dispatchEvent(new CustomEvent('speakersUpdated')); // Notifica outros componentes
  } catch (error) {
    console.error('Erro ao criar palestrante:', error);
    mostrarMensagem('Erro ao criar palestrante. Verifique os campos e tente novamente.', 'erro');
  } finally {
    isLoading.value = false;
  }
};

const toggleFormularioNovoPalestrante = () => {
  mostrarFormularioNovo.value = !mostrarFormularioNovo.value;
  if (!mostrarFormularioNovo.value) {
    resetarFormularioNovo(); // Limpa o formulário se for fechado
  }
};

// --- Ciclo de Vida ---
onMounted(carregarPalestrantes);
</script>

<style scoped lang="scss">
.admin-speakers-dashboard {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7f6;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;

  h1 {
    color: #333;
    font-size: 2rem;
    font-weight: 600;
  }
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    color: #444;
    margin-top: 0;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.75rem;
  }
}

.alert {
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  border: 1px solid transparent;

  &.alert-success {
    background-color: #e6fffa;
    border-color: #a3e9d8;
    color: #00695c;
  }

  &.alert-danger {
    background-color: #ffebee;
    border-color: #f7caca;
    color: #c62828;
  }
}

.novo-palestrante-form {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
      font-size: 0.9rem;
    }

    input[type="text"],
    input[type="url"],
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    }
    
    textarea {
      resize: vertical;
    }
  }
   .form-group-full {
      grid-column: 1 / -1; // Faz o campo ocupar a largura total
    }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
}

.table-container {
  overflow-x: auto; // Para tabelas largas em telas pequenas
}

.tabela-palestrantes {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  th, td {
    border-bottom: 1px solid #e0e0e0;
    padding: 0.8rem 1rem;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #f8f9fa;
    color: #333;
    font-weight: 600;
    white-space: nowrap;
  }
  
  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: #f1f3f5;
  }

  .speaker-photo-thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
  }
  
  .form-control-table {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.9rem;
    box-sizing: border-box;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  textarea.form-control-table {
    resize: vertical;
    min-height: 40px;
  }
  
  .mb-small {
    margin-bottom: 0.5rem;
  }

  .social-links-inputs {
    min-width: 200px; // Para evitar quebra excessiva
  }

  .actions-cell {
    white-space: nowrap;
    min-width: 180px; // Espaço para os botões
    button {
      margin-right: 0.5rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.loading-state, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #777;
  font-size: 1.1rem;
}

// Estilos de Botões Globais
.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-primary {
    background-color: #007bff;
    color: white;
    &:hover:not(:disabled) { background-color: #0056b3; }
  }

  &.btn-success {
    background-color: #28a745;
    color: white;
    &:hover:not(:disabled) { background-color: #1e7e34; }
  }
  
  &.btn-danger {
    background-color: #dc3545;
    color: white;
    &:hover:not(:disabled) { background-color: #c82333; }
  }

  &.btn-secondary {
    background-color: #6c757d;
    color: white;
    &:hover:not(:disabled) { background-color: #545b62; }
  }

  &.btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>