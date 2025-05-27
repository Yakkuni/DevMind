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
    </section>

    <CarouselComponent />

    <AbaoutUs /> 

    <SpeakersComponent class="section-spacer" /> <section class="aboutEventBanner"> 
      <div class="banner-content">
        <h2>Próxima Edição em Breve!</h2>
        <p>Fique ligado para mais novidades e prepare-se para uma imersão tecnológica.</p>
      </div>
    </section>

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
  </div>
</template>

<script setup lang="ts">
import AbaoutUs from '../components/AboutUs.vue';
import CarouselComponent from '../components/CarouselComponent.vue';
import SpeakersComponent from '../components/SpeakersComponent.vue';
import CardsContainer from '../components/CardsContainer.vue';
import OtherEditions from '../components/OtherEditions.vue';

const handleParticiparClick = () => {
  console.log("Botão 'Participar do Evento' (Hero) clicado");
};

const handleVerDetalhesClick = () => {
  console.log("Botão 'Ver detalhes do evento' clicado");
};
</script>

<style scoped lang="scss">
// Suas variáveis globais (assumindo que estão disponíveis)
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;

// Espaçador padrão entre seções (APLICADO SELETIVAMENTE AGORA)
// Esta classe ainda existe para ser usada onde o espaçamento é desejado.
.section-spacer {
  margin-top: 3rem;
  margin-bottom: 3rem;
  @media (min-width: 769px) {
    margin-top: 4rem;
    margin-bottom: 4rem;
  }
}

/* Slideshow / Hero Section */
.slideshow {
  position: relative;
  background-image: url('@/assets/initialBanner.png');
  background-size: cover;
  background-position: center center;
  padding: clamp(4rem, 15vh, 8rem) 1.5rem;
  color: $branco;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  margin-bottom: 0; // Garante que não há margem inferior aqui

  @media (max-width: 768px) {
    min-height: 70vh;
    padding: clamp(3rem, 20vh, 6rem) 1rem;
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


/* Banner Intermediário (aboutEventBanner) */
.aboutEventBanner {
  background-color: $complemento;
  color: $branco;
  padding: 3rem 1.5rem; // Padding interno para o conteúdo do banner
  text-align: center;
  // margin-top e margin-bottom agora são controlados pela ausência de .section-spacer
  // ou pela presença de .section-spacer em componentes adjacentes.

  .banner-content {
    position: relative;
    z-index: 2; // Caso haja um overlay no banner no futuro
    max-width: 700px;
    margin: 0 auto;

    h2 {
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      color: $destaque;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    p {
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      color: lighten($complementoCLaro, 25%);
      margin-bottom: 0; // Removida margem inferior se não houver botão
    }
  }
}


/* Seção “O QUE ESPERAR?” */
.about-event-section {
  background: $destaque;
  padding: 4rem 1.5rem; // Padding interno para o conteúdo da seção
  color: $principal;
  // margin-top e margin-bottom agora são controlados pela ausência de .section-spacer
  // ou pela presença de .section-spacer em componentes adjacentes.

  .about-event-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-what-to-expect {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3rem;
    gap: 1.5rem;

    h1 {
      font-size: clamp(1.8rem, 5vw, 2.8rem);
      font-weight: 700;
      margin: 0;
      color: $principal;
    }
    
    .detail-button {
      padding: 0.7rem 1.8rem;
      background-color: $principal;
      color: $branco;
      border: 2px solid $principal;
      font-weight: 600;
      font-size: clamp(0.85rem, 1.8vw, 1rem);
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba($complemento, 0.2);

      &:hover {
        background-color: $complemento;
        border-color: $complemento;
        color: $branco;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($complemento, 0.3);
      }
       &:active {
        transform: translateY(0);
      }
    }
  }
}

/* Ajustes de Responsividade Globais para a Página */
@media (max-width: 768px) {
  .slideshow__container {
    h1 {
      margin-bottom: 0.8rem;
    }
    h6 {
      margin-bottom: 2rem;
    }
  }

  .about-event-section .header-what-to-expect {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    h1 {
      margin-bottom: 0.5rem;
    }
  }
  
  .section-spacer { 
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
}
</style>