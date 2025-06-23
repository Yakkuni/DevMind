<template>
  <section class="event-gallery-section">
    <h2 class="section-title">Edições Anteriores</h2>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      Carregando...
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="images.length === 0" class="empty-state">
      Nenhuma edição anterior encontrada.
    </div>

    <div v-else class="carousel-3d-wrapper">
      <div class="carousel-3d-track">
        <div
          v-for="(image, index) in images"
          :key="image.id"
          class="slide-3d"
          :class="getSlideClass(index)"
          @click="handleSlideClick(index)"
        >
          <img :src="getFullImageUrl(image.url)" :alt="image.originalName || `Imagem ${index + 1}`" class="slide-image" />
        </div>
      </div>

      <button @click="userPrevSlide" class="nav-button prev" aria-label="Anterior">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <button @click="userNextSlide" class="nav-button next" aria-label="Próximo">
        <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
      </button>
    </div>

    <div v-if="isLightboxVisible" class="lightbox-overlay" @click="closeLightbox">
       <button class="lightbox-close" @click="closeLightbox" aria-label="Fechar">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
      <img :src="lightboxImageUrl" alt="Imagem em destaque" class="lightbox-image" @click.stop />
    </div>

  </section>
</template>

<script setup lang="ts">
// O SCRIPT PERMANECE O MESMO DA VERSÃO ANTERIOR
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
interface GalleryImage { id: string; url: string; originalName?: string; }
function getFullImageUrl(relativeUrl: string | undefined): string {
  if (!relativeUrl || relativeUrl.startsWith('http')) return relativeUrl || '';
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}${relativeUrl}`;
}
const images = ref<GalleryImage[]>([]);
const currentIndex = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);
const isLightboxVisible = ref(false);
const lightboxImageUrl = ref('');
const nextSlide = () => { currentIndex.value = (currentIndex.value + 1) % images.value.length; };
const prevSlide = () => { currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length; };
const userNextSlide = () => nextSlide();
const userPrevSlide = () => prevSlide();
const getSlideClass = (index: number) => {
  const total = images.value.length;
  if (total < 3) {
     return index === currentIndex.value ? 'is-active' : 'is-hidden';
  }
  const prevIndex = (currentIndex.value - 1 + total) % total;
  const nextIndex = (currentIndex.value + 1) % total;
  const prev2Index = (currentIndex.value - 2 + total) % total;
  const next2Index = (currentIndex.value + 2) % total;
  if (index === currentIndex.value) return 'is-active';
  if (index === prevIndex) return 'is-prev';
  if (index === nextIndex) return 'is-next';
  if (index === prev2Index) return 'is-hidden-left';
  if (index === next2Index) return 'is-hidden-right';
  return 'is-hidden';
};
const openLightbox = (imageUrl: string) => {
  lightboxImageUrl.value = getFullImageUrl(imageUrl);
  isLightboxVisible.value = true;
};
const closeLightbox = () => { isLightboxVisible.value = false; };
const handleSlideClick = (index: number) => {
  if (index === currentIndex.value) {
    openLightbox(images.value[index].url);
  } else {
    currentIndex.value = index;
  }
};
async function fetchImages() {
  isLoading.value = true;
  error.value = null;
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/images`;
    const response = await axios.get<GalleryImage[]>(apiUrl);
    if (response.data && response.data.length > 0) {
      images.value = response.data;
    }
  } catch (err) {
    error.value = "Não foi possível carregar as edições anteriores.";
  } finally {
    isLoading.value = false;
  }
}
onMounted(fetchImages);
</script>


<style scoped lang="scss">
// Suas variáveis de tema
$principal: #2C2966;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$cinza-fundo: #f8f9fa;

.event-gallery-section {
  padding: 6rem 0;
  background-color: $cinza-fundo;
  text-align: center;
  overflow-x: hidden;
}

.section-title {
  display: inline-block; 
  position: relative;
  font-size: clamp(2.5rem, 5vw, 3.2rem);
  color: $principal; 
  font-weight: 800;
  margin-bottom: 4rem;
  padding-bottom: 1rem;
  letter-spacing: -0.5px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); 
    width: 100px; 
    height: 5px; 
    background-color: $destaque; 
    border-radius: 3px;
  }
}

.carousel-3d-wrapper {
  position: relative;
  width: 100%;
  // MUDANÇA: Altura do carrossel reduzida para se ajustar melhor às imagens.
  height: 500px; 
  perspective: 2000px;
}

.carousel-3d-track {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.slide-3d {
  position: absolute;
  left: 0; right: 0; margin: 0 auto;
  width: 55%; 
  max-width: 800px;
  aspect-ratio: 16 / 9;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease;
  
  .slide-image {
    width: 100%; height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  &.is-active { transform: translateY(-50%) translateZ(0) rotateY(0); opacity: 1; z-index: 10; }
  &.is-prev { transform: translateY(-50%) translateX(-65%) translateZ(-350px) rotateY(45deg); opacity: 0.5; z-index: 5; }
  &.is-next { transform: translateY(-50%) translateX(65%) translateZ(-350px) rotateY(-45deg); opacity: 0.5; z-index: 5; }
  &.is-hidden-left { transform: translateY(-50%) translateX(-130%) translateZ(-600px) rotateY(50deg); opacity: 0; z-index: 1; }
  &.is-hidden-right { transform: translateY(-50%) translateX(130%) translateZ(-600px) rotateY(-50deg); opacity: 0; z-index: 1; }
  &.is-hidden { display: none; }
}

.nav-button {
  position: absolute; top: 50%;
  z-index: 20; background-color: rgba($branco, 0.95); border: none;
  width: 60px; height: 60px;
  border-radius: 50%; 
  margin-top: -30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: $principal; box-shadow: 0 5px 20px rgba($preto, 0.2);
  transition: all 0.3s ease;
  
  svg { 
    width: 36px; height: 36px; fill: currentColor; 
  }
  
  &:hover { background-color: $destaque; transform: scale(1.1); }
  
  &.prev { left: 12%; }
  &.next { right: 12%; }
}

@media (max-width: 900px) {
  .nav-button {
    &.prev { left: 5%; }
    &.next { right: 5%; }
  }
}

@media (max-width: 768px) {
  .carousel-3d-wrapper {
    // MUDANÇA: Altura menor também no mobile para evitar excesso de espaço.
    height: 280px; 
    perspective: none;
  }
  
  .carousel-3d-track {
    transform-style: flat;
  }

  .slide-3d {
    width: 85%;
    top: 50%;
    transform: translateY(-50%);
    
    &.is-active { transform: translateY(-50%) translateX(0); opacity: 1; }
    &.is-prev { transform: translateY(-50%) translateX(-105%); opacity: 1; }
    &.is-next { transform: translateY(-50%) translateX(105%); opacity: 1; }
    &.is-hidden, &.is-hidden-left, &.is-hidden-right { transform: scale(0.8); opacity: 0; }
  }

  .nav-button {
    width: 48px;
    height: 48px;
    margin-top: -24px;
    &.prev { left: 0.5rem; }
    &.next { right: 0.5rem; }
  }
}

// Estilos do Lightbox
.lightbox-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(#131047, 0.9); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem; animation: fadeIn 0.3s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.lightbox-image {
  max-width: 90vw; max-height: 90vh; object-fit: contain;
  border-radius: 8px; box-shadow: 0 0 50px rgba(0,0,0,0.5);
}
.lightbox-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: rgba($preto, 0.3); color: $branco; border: none;
  border-radius: 50%; width: 44px; height: 44px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
  &:hover { background: $destaque; color: $principal; transform: rotate(90deg); }
}
</style>