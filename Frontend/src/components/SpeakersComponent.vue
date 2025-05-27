<template>
  <div class="speakers-carousel-section">
    <div class="carousel-container">
      <button class="nav-button prev" @click="prevSlide" aria-label="Slide anterior">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <div
        ref="carouselTrack"
        class="carousel-track"
        :style="{
          transform: `translate3d(${trackPosition}%, 0, 0)`,
          transition: isAnimating ? 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }"
        @transitionend="onTransitionEnd"
      >
        <div
          v-for="sp in speakers"
          :key="sp.id"
          class="carousel-item"
        >
          <div class="speaker-card">
            <div class="label">{{ sp.tag || 'Palestrante Confirmado' }}</div>
            <div class="photo-wrapper">
              <img :src="sp.foto" :alt="`Foto de ${sp.nome}`" class="photo" />
            </div>
            <div class="name">{{ sp.nome }}</div>
            <div class="description">{{ sp.descricao }}</div>
            <div class="social-links" v-if="hasSocialLinks(sp.redes)">
                <a v-if="sp.redes.instagram" :href="sp.redes.instagram" target="_blank" rel="noopener noreferrer" :aria-label="`Instagram de ${sp.nome}`">
                    <svg viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" /></svg>
                </a>
                <a v-if="sp.redes.linkedin" :href="sp.redes.linkedin" target="_blank" rel="noopener noreferrer" :aria-label="`LinkedIn de ${sp.nome}`">
                    <svg viewBox="0 0 24 24"><path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.5A1.92,1.92 0 0,1 14.84,11.58C15.82,11.58 16.76,12.42 16.76,13.72V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.92 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.92,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z" /></svg>
                </a>
            </div>
          </div>
        </div>
      </div>

      <button class="nav-button next" @click="nextSlide" aria-label="Próximo slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import axios from 'axios';

interface SocialLinks {
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  site?: string | null;
}

interface Speaker {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  redes: SocialLinks;
  tag?: string;
}

const speakers = ref<Speaker[]>([]);
const carouselTrack = ref<HTMLElement>();
const direction = ref<'next'|'prev'>('next');
const isAnimating = ref(false);
const trackPosition = ref(0);
const isMobileQuery = ref(window.matchMedia('(max-width: 768px)'));
const isMobile = ref(isMobileQuery.value.matches);

const slidesVisiveisDesktop = 3;
const slidePct = computed(() => isMobile.value ? 100 : 100 / slidesVisiveisDesktop);
const interval = ref<number>();
const autoTime = computed(() => isMobile.value ? 4000 : 5500);

const hasSocialLinks = (redes: SocialLinks) => {
    return Object.values(redes).some(link => link && link.trim() !== '');
};

async function fetchSpeakers() {
  console.log('Disparando fetchSpeakers...'); // Log inicial
  try {
    const res = await axios.get<Speaker[]>('/palestrante'); // Ou a URL completa se não usar proxy
    console.log('Resposta da API em fetchSpeakers:', res); // Veja o objeto de resposta completo
    console.log('Dados recebidos (res.data):', res.data); // Veja os dados específicos
    console.log('É res.data um array?:', Array.isArray(res.data));

    if (Array.isArray(res.data)) {
      speakers.value = res.data;
    } else {
      console.warn('API /palestrante não retornou um array. Definindo speakers como vazio.');
      speakers.value = [];
    }
    // ... resto da função (resetCarouselVisualState, etc.) ...
  } catch (err) {
    console.error('Erro detalhado em fetchSpeakers:', err); // Log completo do erro
    speakers.value = []; // Garante que, em caso de erro, a lista fique vazia
  } 
}

function startAuto() {
  clearInterval(interval.value);
  if (speakers.value.length > (isMobile.value ? 1 : slidesVisiveisDesktop)) {
    interval.value = window.setInterval(nextSlide, autoTime.value);
  }
}

function resetCarouselVisualState() {
  isAnimating.value = false;
  trackPosition.value = 0;
  if (carouselTrack.value) {
    void carouselTrack.value.offsetWidth;
  }
}

function resetCarouselAndRestartAuto() {
  clearInterval(interval.value);
  resetCarouselVisualState();
  startAuto();
}

function nextSlide() {
  if (isAnimating.value || speakers.value.length <= (isMobile.value ? 1 : slidesVisiveisDesktop)) return;
  direction.value = 'next';
  isAnimating.value = true;
  trackPosition.value = -slidePct.value;
}

function prevSlide() {
  if (isAnimating.value || speakers.value.length <= (isMobile.value ? 1 : slidesVisiveisDesktop)) return;
  direction.value = 'prev';
  const lastSpeaker = speakers.value.pop();
  if (lastSpeaker) {
    speakers.value.unshift(lastSpeaker);
  }
  trackPosition.value = -slidePct.value;
  requestAnimationFrame(() => {
      isAnimating.value = true;
      trackPosition.value = 0;
  });
}

function onTransitionEnd() {
  if (!isAnimating.value) return;
  if (direction.value === 'next') {
    const firstSpeaker = speakers.value.shift();
    if (firstSpeaker) {
      speakers.value.push(firstSpeaker);
    }
  }
  isAnimating.value = false;
  trackPosition.value = 0;
  if (carouselTrack.value) {
    void carouselTrack.value.offsetWidth;
  }
}

function onMqChange(e: MediaQueryListEvent) {
  isMobile.value = e.matches;
  resetCarouselAndRestartAuto();
}

const handleSpeakersUpdate = () => {
  console.log('Evento speakersUpdated recebido. Atualizando palestrantes...');
  fetchSpeakers().then(() => {
    resetCarouselAndRestartAuto();
  });
};

onMounted(() => {
  isMobileQuery.value.addEventListener('change', onMqChange);
  fetchSpeakers().then(() => {
    startAuto();
  });
  window.addEventListener('speakersUpdated', handleSpeakersUpdate);
});

onBeforeUnmount(() => {
  isMobileQuery.value.removeEventListener('change', onMqChange);
  clearInterval(interval.value);
  window.removeEventListener('speakersUpdated', handleSpeakersUpdate);
});


</script>

<style scoped lang="scss">
// Suas variáveis globais
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$cinza-borda-suave: #e0e0e0;
$cinza-texto-claro: #757575;

.speakers-carousel-section {
  padding: 3rem 0;
}

.carousel-container {
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  // --- ADICIONADO PADDING VERTICAL AQUI ---
  // Este padding dá espaço para o translateY(-8px) e para a expansão da sombra do card no hover.
  // Ajuste o valor (ex: 20px) conforme o tamanho do seu efeito de hover.
  // Se a sombra for grande, pode precisar de um pouco mais.
  padding-top: 20px;
  padding-bottom: 20px;
  // O padding horizontal (se necessário para as setas) pode ser adicionado aqui também,
  // ou as setas podem ser ajustadas para ficarem mais para dentro.
  // Exemplo: padding-left: 50px; padding-right: 50px; se as setas tiverem 48px de largura.
  // Por agora, focamos no vertical para o hover do card.
}

.carousel-track {
  display: flex;
}

.carousel-item {
  flex: 0 0 100%;
  // Adicionar um pouco de padding vertical aqui também pode ajudar a garantir
  // que a sombra não seja cortada pelo item vizinho ou pelo track se eles tiverem alturas fixas.
  // No entanto, com align-items: stretch, os itens devem ter a altura do track.
  // O padding no .carousel-container é o mais importante para o overflow:hidden.
  padding: 0 0.75rem; // Mantém o espaçamento horizontal entre os cards
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: stretch;

  @media (min-width: 769px) {
    flex: 0 0 calc(100% / 3);
  }
  @media (min-width: 1024px) {
     padding: 0 1rem;
  }
}

.speaker-card {
  background: $branco;
  border-radius: 16px;
  padding: 1.8rem 1.5rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba($complemento, 0.08), 0 4px 10px rgba($complemento, 0.05);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  border: 1px solid $cinza-borda-suave;

  &:hover {
    transform: translateY(-8px); // Este movimento para cima precisa de espaço no container pai
    box-shadow: 0 12px 35px rgba($complemento, 0.12), 0 6px 15px rgba($complemento, 0.08);
  }

  // ... (resto do estilo do .speaker-card como estava, pois é bom) ...
  .label {
    display: inline-block;
    background-color: $destaque;
    color: $principal;
    padding: 0.4rem 0.9rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin: 0 auto 1.25rem auto;
    line-height: 1;
  }

  .photo-wrapper {
    margin: 0 auto 1.25rem auto;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 0 6px $branco, 0 0 0 8px $destaque;
  }
  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name {
    font-size: 1.3rem;
    font-weight: 700;
    color: $principal;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .description {
    font-size: 0.9rem;
    color: $complementoCLaro;
    line-height: 1.55;
    flex-grow: 1;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
    max-height: 120px;
    overflow-y: auto;
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-thumb { background-color: darken($cinza-borda-suave, 15%); border-radius: 3px; }
    &::-webkit-scrollbar-track { background: transparent; }
  }

  .social-links {
    margin-top: auto;
    padding-top: 0.75rem;
    display: flex;
    justify-content: center;
    gap: 1rem;

    a {
      color: $complementoCLaro;
      transition: color 0.3s ease, transform 0.2s ease;
      &:hover {
        color: $destaque;
        transform: translateY(-2px);
      }
      svg {
        width: 22px;
        height: 22px;
        fill: currentColor;
      }
    }
  }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: $branco;
  border: 1px solid $cinza-borda-suave;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba($preto, 0.08);
  z-index: 20;

  svg {
    width: 28px;
    height: 28px;
    color: $principal;
    transition: color 0.3s ease;
  }

  &:hover {
    background: $destaque;
    border-color: $destaque;
    box-shadow: 0 6px 16px rgba($destaque, 0.3);
    transform: translateY(-50%) scale(1.05);
    svg {
      color: $principal;
    }
  }
  &:active {
    transform: translateY(-50%) scale(0.98);
  }

  &.prev {
    left: 15px;
  }
  &.next {
    right: 15px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    svg { width: 24px; height: 24px;}
    &.prev { left: 8px; }
    &.next { right: 8px; }
  }
}
</style>