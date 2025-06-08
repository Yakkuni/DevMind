<template>
  <div class="admin-dashboard-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Gerenciamento de Imagens</h1>
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
          <h3>Galeria do Site</h3>
          <button class="btn btn-primary" @click="abrirModalParaCriar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Adicionar Imagem
          </button>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando imagens...</p>
        </div>
        
        <div v-else-if="!images.length" class="empty-state">
          <p>Nenhuma imagem encontrada. Que tal adicionar a primeira?</p>
        </div>

        <div v-else class="card-content">
          <div class="image-grid">
            <div class="image-card" v-for="(image, index) in images" :key="image.id">
              <img :src="getFullImageUrl(image.url)" :alt="image.originalName" class="gallery-image" @click="abrirLightbox(index)" />
              <div class="image-overlay">
                <span class="image-name">{{ image.originalName }}</span>
                <button class="btn-icon btn-delete" @click.stop="confirmarExclusao(image.id)" title="Excluir Imagem">
                  <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Adicionar Nova Imagem</h2>
          <button @click="fecharModal" class="close-button" aria-label="Fechar">×</button>
        </header>
        <div class="modal-form">
          <div
            class="drop-zone"
            :class="{ 'drag-over': isDragOver, 'has-file': uploadFile }"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <div v-if="!uploadFile" class="drop-zone-prompt">
              <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
              <p>Arraste e solte ou clique aqui</p>
            </div>
            <div v-else class="upload-preview-container">
              <img :src="uploadPreviewUrl" alt="Pré-visualização" class="upload-preview" />
              <button class="btn-remove-preview" @click.stop="removerArquivo">Trocar Imagem</button>
            </div>
          </div>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="file-input-hidden" />
          
          <div class="form-group" v-if="uploadFile">
            <label for="form-nome">Nome da Imagem*</label>
            <input id="form-nome" type="text" v-model="formImage.nome" required class="form-control" placeholder="Ex: Entrada do evento" />
          </div>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="fecharModal" :disabled="isSaving">Cancelar</button>
          <button type="submit" class="btn btn-success" @click="salvarImagem" :disabled="isSaving || !uploadFile">
            {{ isSaving ? 'Salvando...' : 'Salvar Imagem' }}
          </button>
        </footer>
      </div>
    </div>

    <div v-if="showLightbox" class="lightbox-overlay" @click.self="fecharLightbox">
      <button class="lightbox-close" @click="fecharLightbox" aria-label="Fechar">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
      <button class="lightbox-nav prev" @click.stop="imagemAnterior" aria-label="Anterior">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <img :src="getFullImageUrl(images[currentLightboxIndex].url)" :alt="images[currentLightboxIndex].originalName" class="lightbox-image" />
      <button class="lightbox-nav next" @click.stop="proximaImagem" aria-label="Próxima">
        <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

// --- Interfaces ---
interface Image {
  id: string;
  originalName: string;
  url: string;
}
interface FormImageData {
  nome: string;
}

/**
 * Constrói a URL completa para uma imagem a partir da variável de ambiente.
 * @param relativeUrl A URL vinda da API (ex: /uploads/imagem.png)
 */
function getFullImageUrl(relativeUrl: string | undefined): string {
  if (!relativeUrl || relativeUrl.startsWith('http')) {
    return relativeUrl || '';
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}${relativeUrl}`;
}

// --- Estado Principal ---
const router = useRouter();
const images = ref<Image[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const globalMessage = ref<{ text: string | null, type: 'success' | 'error' }>({ text: null, type: 'success' });

// --- Estado do Modal e Upload ---
const showModal = ref(false);
const isDragOver = ref(false);
const uploadFile = ref<File | null>(null);
const uploadPreviewUrl = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const formImage = reactive<FormImageData>({ nome: '' });

// --- Estado do Lightbox ---
const showLightbox = ref(false);
const currentLightboxIndex = ref(0);

// --- Funções ---
const voltarParaDashboard = () => router.push({ name: 'Dashboard' });

function displayMessage(text: string, type: 'success' | 'error', duration: number = 4000) {
  globalMessage.value = { text, type };
  setTimeout(() => { globalMessage.value.text = null; }, duration);
}

async function carregarImagens() {
  isLoading.value = true;
  try {
    const response = await api.get<Image[]>('/images');
    images.value = response.data;
  } catch (error) {
    displayMessage("Falha ao carregar a galeria de imagens.", 'error');
  } finally {
    isLoading.value = false;
  }
}

async function salvarImagem() {
  if (!uploadFile.value || !formImage.nome.trim()) {
    displayMessage("Selecione uma imagem e digite um nome.", 'error');
    return;
  }
  isSaving.value = true;
  const formData = new FormData();
  formData.append('image', uploadFile.value); // Campo 'image' para corresponder ao backend
  formData.append('originalName', formImage.nome.trim());

  try {
    await api.post('/images', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    displayMessage("Imagem salva com sucesso!", 'success');
    fecharModal();
    await carregarImagens();
  } catch (error: any) {
    console.error("Erro detalhado no envio:", error);
    const errorMessage = error.response?.data?.message || "Falha no envio da imagem.";
    displayMessage(errorMessage, 'error');
  } finally {
    isSaving.value = false;
  }
}

async function confirmarExclusao(id: string) {
  if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
    try {
      await api.delete(`/images/${id}`);
      displayMessage('Imagem excluída com sucesso!', 'success');
      await carregarImagens();
    } catch (err) {
      displayMessage('Falha ao excluir a imagem.', 'error');
    }
  }
}

function abrirModalParaCriar() { showModal.value = true; }
function fecharModal() { showModal.value = false; removerArquivo(); }
function removerArquivo() {
  uploadFile.value = null;
  formImage.nome = '';
  if (uploadPreviewUrl.value) { URL.revokeObjectURL(uploadPreviewUrl.value); uploadPreviewUrl.value = ''; }
  if (fileInput.value) { fileInput.value.value = ''; }
}

function processarArquivo(file: File) {
  if (!file.type.startsWith('image/')) {
    displayMessage("Por favor, selecione um arquivo de imagem.", 'error'); return;
  }
  uploadFile.value = file;
  formImage.nome = file.name.replace(/\.[^/.]+$/, "");
  uploadPreviewUrl.value = URL.createObjectURL(file);
}

const handleDragOver = () => { isDragOver.value = true; };
const handleDragLeave = () => { isDragOver.value = false; };
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) processarArquivo(file);
};
const triggerFileInput = () => { if (!uploadFile.value) fileInput.value?.click(); };
const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) processarArquivo(file);
};

const abrirLightbox = (index: number) => { currentLightboxIndex.value = index; showLightbox.value = true; };
const fecharLightbox = () => { showLightbox.value = false; };
const proximaImagem = () => { currentLightboxIndex.value = (currentLightboxIndex.value + 1) % images.value.length; };
const imagemAnterior = () => { currentLightboxIndex.value = (currentLightboxIndex.value - 1 + images.value.length) % images.value.length; };

onMounted(carregarImagens);
</script>

<style scoped lang="scss">
// Assumindo que as variáveis ($principal, $destaque, etc.) estão disponíveis globalmente
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;
$branco: #ffffff;
$cinza-fundo-pagina: #eef0f2;
$texto-escuro-principal: #2d3748;
$borda-card: #e2e8f0;
$cor-sucesso: #38a169;
$cor-erro: #e53e3e;

.admin-dashboard-page{min-height:100vh;background-color:$cinza-fundo-pagina;padding-bottom:3rem}.page-header{background:linear-gradient(135deg,$principal 0,$complemento 100%);color:$branco;padding:2rem;border-bottom:5px solid $destaque;margin-bottom:2.5rem}.page-header .header-content{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}.page-header h1{margin:0;font-size:2rem;font-weight:600}.dashboard-main-content{max-width:1200px;margin:0 auto;padding:0 1.5rem}.global-alert{padding:1rem 1.5rem;margin-bottom:1.5rem;border-radius:8px;color:$branco;font-weight:500}.global-alert.alert-success{background-color:$cor-sucesso}.global-alert.alert-error{background-color:$cor-erro}.card{background-color:$branco;border-radius:10px;box-shadow:0 4px 15px #00000012;border:1px solid $borda-card;overflow:hidden}.card-header{padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid $borda-card}.card-header h3{margin:0;color:$principal;font-size:1.25rem;font-weight:600}.card-content{padding:1.5rem}.loading-state,.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 2rem;color:#718096;text-align:center}.loading-state .spinner,.empty-state .spinner{width:50px;height:50px;border:5px solid #2c296633;border-top-color:$destaque;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:1rem}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.image-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem}.image-card{position:relative;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px #0000001a;aspect-ratio:4/3;cursor:pointer;background-color:#f3f4f6}.image-card .gallery-image{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}.image-card:hover .gallery-image{transform:scale(1.1)}.image-card .image-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(0deg,#000000cc 0,transparent 50%);opacity:0;transition:opacity .4s ease;display:flex;align-items:flex-end;justify-content:space-between;padding:1rem;box-sizing:border-box}.image-card:hover .image-overlay{opacity:1}.image-card .image-name{color:$branco;font-weight:600;transform:translateY(20px);opacity:0;transition:all .4s ease .1s}.image-card:hover .image-name{transform:translateY(0);opacity:1}.image-card .btn-icon.btn-delete{position:absolute;top:.5rem;right:.5rem;z-index:5;background-color:#e53e3eB3}.image-card .btn-icon.btn-delete:hover{background-color:$cor-erro}.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000099;display:flex;justify-content:center;align-items:center;z-index:1000}.modal-content{background:$branco;border-radius:10px;width:90%;max-width:550px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 10px 25px #0000001a;animation:slide-down .3s ease-out}@keyframes slide-down{0%{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}.modal-header{padding:1rem 1.5rem;border-bottom:1px solid $borda-card;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}.modal-header h2{margin:0;font-size:1.25rem;color:$principal}.modal-header .close-button{font-size:1.8rem;background:0 0;border:none;cursor:pointer;color:#aaa}.modal-form{padding:1.5rem;overflow-y:auto;display:flex;flex-direction:column;gap:1.2rem}.modal-footer{padding:1rem 1.5rem;border-top:1px solid $borda-card;display:flex;justify-content:flex-end;gap:1rem;flex-shrink:0}.drop-zone{border:2px dashed $borda-card;border-radius:8px;background-color:#f9fafb;padding:2rem;text-align:center;color:#6b7280;cursor:pointer;transition:all .2s ease}.drop-zone.drag-over{border-color:$destaque;background-color:lighten($destaque,38%)}.drop-zone .drop-zone-prompt svg{width:40px;height:40px;fill:#9ca3af;margin-bottom:.5rem}.drop-zone .drop-zone-prompt p{margin:0;font-weight:500}.drop-zone .upload-preview-container{position:relative}.drop-zone .upload-preview-container .upload-preview{max-height:200px;max-width:100%;border-radius:6px}.drop-zone .upload-preview-container .btn-remove-preview{position:absolute;top:.5rem;right:.5rem;background:#00000099;color:$branco;border:none;border-radius:4px;padding:.3rem .6rem;font-size:.8rem}.file-input-hidden{display:none}.lightbox-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#131047e6;backdrop-filter:blur(5px);z-index:2000;display:flex;align-items:center;justify-content:center}.lightbox-image{max-width:90vw;max-height:85vh;object-fit:contain}.lightbox-close,.lightbox-nav{position:absolute;background:#0000004d;color:$branco;border:none;border-radius:50%;cursor:pointer;transition:all .2s ease}.lightbox-close:hover,.lightbox-nav:hover{background:#00000099;transform:scale(1.1)}.lightbox-close{top:1rem;right:1rem;width:44px;height:44px}.lightbox-close svg{width:24px;height:24px}.lightbox-nav{top:50%;transform:translateY(-50%);width:50px;height:50px}.lightbox-nav svg{width:30px;height:30px}.lightbox-nav.prev{left:1rem}.lightbox-nav.next{right:1rem}.btn{padding:.7rem 1.4rem;font-size:.9rem;border-radius:6px;border:2px solid transparent;cursor:pointer;transition:all .25s ease;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.5em}.btn:disabled{opacity:.6;cursor:not-allowed}.btn-primary{background-color:$destaque;color:$principal;border-color:$destaque}.btn-primary:hover:not(:disabled){background-color:darken($destaque,8%);border-color:darken($destaque,8%)}.btn-secondary{background-color:#6c757d;color:$branco;border-color:#6c757d}.btn-secondary:hover:not(:disabled){background-color:darken(#6c757d,8%);border-color:darken(#6c757d,8%)}.btn-success{background-color:$cor-sucesso;color:$branco;border-color:$cor-sucesso}.btn-success:hover:not(:disabled){background-color:darken($cor-sucesso,8%);border-color:darken($cor-sucesso,8%)}.btn-outline-light{background-color:transparent;border-color:#ffffffb3;color:$branco}.btn-outline-light:hover:not(:disabled){background-color:#ffffff1a;border-color:$branco}.btn-icon{background:0 0;border:none;cursor:pointer;padding:.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background-color .2s}.btn-icon svg{width:20px;height:20px;fill:#fff}.btn-icon.btn-delete{color:$cor-erro}.btn-icon.btn-delete:hover{background-color:#e53e3e1a}.form-group{display:flex;flex-direction:column}.form-group label{margin-bottom:.5rem;font-weight:500;color:$texto-escuro-principal}.form-group .form-control{width:100%;padding:.8rem 1rem;border:1px solid $borda-card;border-radius:6px;font-size:1rem;box-sizing:border-box}.form-group .form-control:focus{outline:0;border-color:$destaque;box-shadow:0 0 0 3px #ffa05133}
</style>