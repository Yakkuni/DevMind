<template>
  <section class="previous-editions-section">
    <h2 class="section-title">Edições Anteriores</h2>
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      Carregando edições anteriores...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else-if="editions.length === 0" class="empty-state">
      Nenhuma edição anterior para mostrar no momento.
    </div>
    <div v-else class="carousel-wrapper">
      <div class="carousel-viewport" ref="viewportRef">
        <div class="carousel-track" :style="trackStyle">
          <div
            class="slide"
            v-for="(edition, index) in editions"
            :key="edition.id"
            :class="{ active: index === currentIndex }"
          >
            <img :src="edition.imagemUrl" :alt="edition.nome" class="slide-image" />
            <div class="slide-caption">
              <h3>{{ edition.nome }}</h3>
              <p v-if="edition.ano">{{ edition.ano }}</p>
            </div>
          </div>
        </div>
      </div>

      <button @click="prevSlide" class="nav-button prev" aria-label="Edição anterior">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <button @click="nextSlide" class="nav-button next" aria-label="Próxima edição">
        <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
      </button>

      <div class="carousel-dots">
        <button
          v-for="(edition, index) in editions"
          :key="`dot-${edition.id}`"
          class="dot"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
          :aria-label="`Ir para ${edition.nome}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import axios from 'axios'; // Certifique-se de ter o axios instalado e configurado

// --- Tipagem ---
interface Edition {
  id: string | number;
  nome: string;
  ano?: string;
  imagemUrl: string;
  descricao?: string; // Opcional
}

// --- Estado Reativo ---
const editions = ref<Edition[]>([]);
const currentIndex = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);
const viewportRef = ref<HTMLElement | null>(null); // Referência ao viewport para calcular largura
const slideWidth = ref(0); // Largura de cada slide (geralmente 100% do viewport)

const autoplayInterval = ref<number | null>(null);
const autoplayDelay = 5000; // 5 segundos

// --- Estilo Dinâmico para o Track ---
const trackStyle = computed(() => {
  return {
    transform: `translateX(-${currentIndex.value * slideWidth.value}px)`,
    width: `${editions.value.length * slideWidth.value}px` // Largura total do track
  };
});

// --- Funções do Carrossel ---
const updateSlideWidth = () => {
  if (viewportRef.value) {
    slideWidth.value = viewportRef.value.offsetWidth;
  }
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % editions.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + editions.value.length) % editions.value.length;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

const startAutoplay = () => {
  if (autoplayInterval.value) clearInterval(autoplayInterval.value);
  autoplayInterval.value = window.setInterval(nextSlide, autoplayDelay);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) clearInterval(autoplayInterval.value);
};

// --- Busca de Dados ---
async function fetchEditions() {
  isLoading.value = true;
  error.value = null;
  console.log("Iniciando fetchEditions...");
  try {
    // TENTE COM A URL COMPLETA DO SEU BACKEND PRIMEIRO
    const response = await axios.get<Edition[]>('http://localhost:3000/api/edicoes-anteriores'); // <<< USE A URL COMPLETA AQUI PARA TESTAR
    
    console.log("Resposta da API:", response.status, response.data);

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      editions.value = response.data;
      console.log("Edições carregadas da API:", JSON.parse(JSON.stringify(editions.value)));
    } else {
      // Se a API retornar sucesso mas um array vazio, ou formato inesperado
      console.warn("API não retornou dados válidos ou retornou lista vazia. Usando mock.", response.data);
      throw new Error("Dados da API vazios ou inválidos, usando mock."); // Força o catch para usar mock
    }

    // Se chegou aqui, os dados da API foram usados e são válidos
    // A lógica de nextTick, updateSlideWidth e startAutoplay será chamada no finally

  } catch (err) { // Este catch agora será para falhas na API ou se forçamos acima
    console.error("Erro ao carregar edições da API ou dados inválidos, usando mock:", err);
    error.value = "Usando edições de exemplo devido a um problema ao carregar os dados.";
    
    editions.value = [
      { id: '1', nome: 'DevMind Mock 2023', ano: '2023', imagemUrl: 'https://via.placeholder.com/800x450/2C2966/FFA051?text=DevMind+2023+(Exemplo)' },
      { id: '2', nome: 'DevMind Mock 2022', ano: '2022', imagemUrl: 'https://via.placeholder.com/800x450/131047/FFA051?text=DevMind+2022+(Exemplo)' },
      { id: '3', nome: 'DevMind Mock 2021', ano: '2021', imagemUrl: 'https://via.placeholder.com/800x450/6C6C94/FFA051?text=DevMind+2021+(Exemplo)' },
    ];
    console.log("Edições definidas com mock data após erro/falha:", JSON.parse(JSON.stringify(editions.value)));
  } finally {
    isLoading.value = false;
    if (editions.value && editions.value.length > 0) {
      await nextTick(); // Garante que o DOM seja atualizado com os itens (da API ou mock)
      updateSlideWidth(); // Calcula a largura do slide
      startAutoplay();    // Inicia o autoplay
    } else {
      // Se mesmo após o mock (ou API retornando vazio e sem mock no catch) não houver edições
      console.log("Nenhuma edição para exibir (nem da API, nem mock).");
    }
  }
}

// --- Ciclo de Vida ---
onMounted(() => {
  fetchEditions();
  window.addEventListener('resize', updateSlideWidth);
  // Pausa autoplay no hover (opcional, pode ser feito via CSS também se não houver track dinâmico)
  if (viewportRef.value) {
    viewportRef.value.addEventListener('mouseenter', stopAutoplay);
    viewportRef.value.addEventListener('mouseleave', startAutoplay);
  }
});

onBeforeUnmount(() => {
  stopAutoplay();
  window.removeEventListener('resize', updateSlideWidth);
  if (viewportRef.value) { // Limpa event listeners do viewport
    viewportRef.value.removeEventListener('mouseenter', stopAutoplay);
    viewportRef.value.removeEventListener('mouseleave', startAutoplay);
  }
});
</script>

<style scoped lang="scss">
// Suas variáveis globais (assumindo que estão disponíveis)
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;

.previous-editions-section {
  padding: 3rem 1rem; // Espaçamento da seção
  background-color: lighten($principal, 78%); // Fundo muito sutil para a seção
  text-align: center; // Centraliza o título da seção

  @media (min-width: 769px) {
    padding: 4rem 1.5rem;
  }
}

.section-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem); // Fonte responsiva
  color: $principal;
  margin-bottom: 2.5rem;
  font-weight: 700;
}

.loading-state, .empty-state, .error-state {
  padding: 3rem 1rem;
  color: $complementoCLaro;
  font-size: 1.1rem;
  min-height: 300px; // Para ocupar espaço enquanto carrega ou se estiver vazio
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-state {
  color: #c82333; // Cor de erro
}

.spinner {
  border: 4px solid rgba($principal, 0.2);
  border-top: 4px solid $destaque;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.carousel-wrapper {
  position: relative;
  max-width: 900px; // Largura máxima do carrossel
  margin: 0 auto; // Centraliza
  border-radius: 16px; // Bordas arredondadas para o wrapper
  overflow: hidden; // Garante que os slides não vazem durante a transição
  box-shadow: 0 10px 30px rgba($complemento, 0.1);
}

.carousel-viewport {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1); // Transição suave
}

.slide {
  min-width: 100%; // Cada slide ocupa 100% da largura do viewport
  box-sizing: border-box;
  position: relative; // Para posicionar a legenda sobre a imagem
  background-color: $complemento; // Fundo para caso a imagem não carregue

  .slide-image {
    display: block;
    width: 100%;
    height: auto; // Mantém a proporção da imagem
    aspect-ratio: 16 / 9; // Proporção comum para banners/slides
    object-fit: cover; // Garante que a imagem cubra a área sem distorcer
    border-radius: 0; // Imagem sem borda interna, o wrapper controla
  }

  .slide-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba($complemento, 0.85) 0%, rgba($complemento, 0.6) 60%, transparent 100%);
    color: $branco;
    padding: 1.5rem 2rem 2rem 2rem; // Espaçamento interno da legenda
    text-align: left; // Alinha texto da legenda à esquerda

    h3 {
      font-size: clamp(1.2rem, 3vw, 1.8rem);
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      text-shadow: 0 1px 3px rgba($preto, 0.5);
    }

    p {
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      margin: 0;
      color: lighten($complementoCLaro, 30%);
      text-shadow: 0 1px 2px rgba($preto, 0.4);
    }
  }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba($branco, 0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: $principal;
  box-shadow: 0 4px 10px rgba($preto, 0.15);
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  z-index: 10;

  svg {
    width: 26px;
    height: 26px;
    fill: currentColor;
  }

  &:hover {
    background-color: $destaque;
    color: $principal;
    transform: translateY(-50%) scale(1.05);
  }
  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.prev {
    left: 1rem;
  }
  &.next {
    right: 1rem;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    svg { width: 22px; height: 22px; }
    &.prev { left: 0.5rem; }
    &.next { right: 0.5rem; }
  }
}

.carousel-dots {
  position: absolute;
  bottom: 1rem; // Posição dos indicadores
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.6rem; // Espaço entre os dots
  z-index: 10;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba($branco, 0.5);
    border: 1px solid rgba($branco, 0.7);
    padding: 0;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: rgba($branco, 0.8);
      transform: scale(1.1);
    }
    &.active {
      background-color: $destaque;
      border-color: darken($destaque, 10%);
      transform: scale(1.2);
    }
  }
}
</style>