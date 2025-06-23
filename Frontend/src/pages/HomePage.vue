<template>
  <div class="homepage-container">
    <section class="slideshow">
      <div class="overlay"></div>
      <div class="slideshow__container">
        <h1>
          <span>O <b>&nbsp;maior&nbsp;</b> evento</span>
          <span> de tecnologia de</span>
          <span> Tabuleiro do Norte</span>
        </h1>
        <h6>
          <span>Venha se reinventar |&nbsp;</span>
          <span> o seu futuro é agora!</span>
        </h6>
        <div class="hero-cta-container">
          <button type="button" class="cta-button hero-cta-button" @click="handleParticiparClick">
            Participar do Evento
          </button>
        </div>
      </div>
      
      <div v-if="!showFullPage" class="scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
      </div>

    </section>

    <CarouselComponent />

    <template v-if="showFullPage">
      <GoldSponsors />
      <AbaoutUs /> 
      <SpeakersComponent />
      
      <section class="about-event-section"> 
        <div class="about-event-container">
          <div class="header-what-to-expect">
            <h1>O QUE ESPERAR?</h1>
            <button class="detail-button" @click="handleVerDetalhesClick">
              Ver detalhes do evento
            </button>
          </div>
          <CardsContainer />
        </div>
      </section>
      <OtherEditions/> 
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AbaoutUs from '../components/AboutUs.vue';
import CarouselComponent from '../components/CarouselComponent.vue';
import SpeakersComponent from '../components/SpeakersComponent.vue';
import CardsContainer from '../components/CardsContainer.vue';
import OtherEditions from '../components/Images.vue';
import GoldSponsors from '../components/GoldSponsors.vue';

// --- LÓGICA DE VISIBILIDADE ---
const showFullPage = ref(false);

const handleFirstScroll = () => {
  showFullPage.value = true;
  sessionStorage.setItem('hasVisitedDevMindSession', 'true');
  window.removeEventListener('scroll', handleFirstScroll);
};

onMounted(() => {
  const hasVisited = sessionStorage.getItem('hasVisitedDevMindSession');
  if (hasVisited) {
    showFullPage.value = true;
  } else {
    window.addEventListener('scroll', handleFirstScroll);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleFirstScroll);
});
// --- FIM DA LÓGICA ---

const handleParticiparClick = () => {
  console.log("Botão 'Participar do Evento' (Hero) clicado");
  window.open("https://www.even3.com.br/devmind-571467/", "_blank");
};

const handleVerDetalhesClick = () => {
  console.log("Botão 'Ver detalhes do evento' clicado");
  window.open("https://www.even3.com.br/devmind-571467/", "_blank");
};
</script>

<style scoped lang="scss">
// --- Variáveis de Tema ---
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$cinza-fundo: #f8f9fa;

$section-spacing: 4rem; 

.homepage-container > section {
  padding-top: $section-spacing;
  padding-bottom: $section-spacing;

  &:first-child {
    padding-top: 0;
    padding-bottom: 0;
  }
}

/* Slideshow / Hero Section */
.slideshow {
  position: relative;
  background-image: url('@/assets/initialBanner.png');
  background-size: cover;
  background-position: center center;
  padding: 6rem 1.5rem;
  color: $branco;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;

  &.slideshow {
    padding-top: 6rem !important;
    padding-bottom: 6rem !important;
  }

  @media (max-width: 768px) {
    min-height: 70vh;
    padding: 4rem 1rem;
    padding-top: 6rem;
  }
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba($complemento, 0.7);
  z-index: 1;
}

.slideshow__container {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;

  h1 {
    font-size: clamp(2rem, 6vw, 3.8rem);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.25;
    text-shadow: 0 2px 8px rgba($preto, 0.4);
    span {
      display: block;
      b {
        color: $destaque;
      }
    }
  }

  h6 {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    font-weight: 400;
    margin-bottom: 2.5rem;
    color: lighten($complementoCLaro, 30%);
    span {
      display: inline-block;
    }
  }
}

.cta-button {
  padding: 0.8rem 2rem;
  background-color: $destaque;
  border: 2px solid $destaque;
  color: $principal;
  font-weight: 700;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  box-shadow: 0 4px 15px rgba($destaque, 0.3);

  &:hover {
    background-color: darken($destaque, 10%);
    border-color: darken($destaque, 10%);
    color: $complemento;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba($destaque, 0.4);
  }
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 10px rgba($destaque, 0.3);
  }
}

.hero-cta-button {
  // Estilos específicos do Hero CTA, se necessário
}

/* O Bloco de estilo para .aboutEventBanner FOI REMOVIDO DAQUI */

/* Seção “O QUE ESPERAR?” */
.about-event-section {
  background: $destaque;
  color: $principal;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-bottom: 3px solid $complemento;

  .about-event-container { max-width: 1200px; margin: 0 auto; }
  .header-what-to-expect {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
    margin-bottom: 3rem; gap: 1.5rem;
    h1 { font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 700; margin: 0; color: $principal; }
    .detail-button {
      padding: 0.7rem 1.8rem; background-color: $principal; color: $branco; border: 2px solid $principal;
      font-weight: 600; font-size: clamp(0.85rem, 1.8vw, 1rem); border-radius: 25px;
      cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba($complemento, 0.2);
      &:hover { background-color: $complemento; border-color: $complemento; transform: translateY(-2px); box-shadow: 0 4px 12px rgba($complemento, 0.3); }
      &:active { transform: translateY(0); }
    }
  }
}

/* Fundo Padrão para seções sem cor específica */
// A classe .aboutEventBanner foi removida do seletor :not()
.homepage-container > section:not(.slideshow):not(.about-event-section) {
  background-color: $branco;
}

/* Estilo do Indicador de Rolagem */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: rgba($branco, 0.7);
  animation: bounce 2s infinite;

  svg {
    width: 32px;
    height: 32px;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-15px);
  }
  60% {
    transform: translateX(-50%) translateY(-10px);
  }
}

/* Ajustes de Responsividade */
@media (max-width: 768px) {
  .homepage-container > section {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  .slideshow__container {
    h1 { margin-bottom: 0.8rem; }
    h6 { margin-bottom: 2rem; }
  }

  .about-event-section .header-what-to-expect {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    h1 { margin-bottom: 0.5rem; }
  }
}
</style>