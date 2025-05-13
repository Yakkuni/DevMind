<template>
  <div>
    <!-- Slideshow -->
    <div class="slideshow">
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
        <div class="button secondary">
          <button type="button">Participar do Evento</button>
        </div>
      </div>
    </div>

    <CarouselComponent />

    <AbaoutUs />

    <!-- Palestrantes -->
    <SpeakersComponent />

    <!-- Banner abaixo do Sobre o Evento -->
    <div class="aboutEventBanner">
      <!-- coloque aqui sua imagem ou conteúdo -->
    </div>

    <!-- Seção "O QUE ESPERAR?" com cards -->
    <div class="AboutEvent">
      <div class="header-what-to-expect">
        <h1>O QUE ESPERAR?</h1>
        <div>
          <button class="detail-button">Ver detalhes do evento</button>
        </div>
      <CardsContainer />
    </div>

      <!-- container de cards -->
    </div>
  </div>
</template>

<script setup lang="ts">
import AbaoutUs from '../components/AboutUs.vue'
import CarouselComponent from '../components/CarouselComponent.vue'
import SpeakersComponent from '../components/SpeakersComponent.vue'
import CardsContainer from '../components/CardsContainer.vue'

</script>

<style scoped lang="scss">
/* Slideshow */
.slideshow {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  padding: 6.5rem;

  &__container {
    text-align: center;
  }
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

h6 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.button {
  &.secondary button {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    border: none;
    background-color: #333;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s ease;
    &:hover {
      background-color: #555;
    }
  }
}

/* Seção “O QUE ESPERAR?” */
.AboutEvent {
  background: #111;
  padding: 4rem 1rem;
  color: #fff;

  .header-what-to-expect {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;

    h1 {
      font-size: 2.25rem;
      margin: 0;
    }
    .detail-button {
      background: #fff;
      color: #000;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background: #ddd;
      }
    }
  }
}

/* breaks para mobile */
@media (max-width: 768px) {
  .slideshow {
    padding: 2rem 1rem;
    padding-top: 5rem;
  }
  h1 { font-size: 1.8rem; }
  h6 { font-size: 1rem; }
  .button.secondary button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .AboutEvent .header-what-to-expect {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
