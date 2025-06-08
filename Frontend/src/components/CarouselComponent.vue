<template>
  <div class="carousel-ticker-container">
    <div class="carousel-ticker-track" :style="{ animationDuration: animationDuration }">
      <div class="carousel-ticker-item" v-for="n in repetitions" :key="`item-${n}`">
        <span class="ticker-text main-text">{{ textoIngressos }}</span>
        <img class="arrow-icon" :src="arrowIconSrc" alt="Seta para a direita" />
        <span class="ticker-text accent-text">{{ dataParaEvento }}</span>
        <img class="arrow-icon" :src="arrowIconSrc" alt="Seta para a direita" />
      </div>
      <div class="carousel-ticker-item" v-for="n in repetitions" :key="`dup-item-${n}`" aria-hidden="true">
        <span class="ticker-text main-text">{{ textoIngressos }}</span>
        <img class="arrow-icon" :src="arrowIconSrc" alt="" /> <span class="ticker-text accent-text">{{ dataParaEvento }}</span>
        <img class="arrow-icon" :src="arrowIconSrc" alt="" /> </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  dataParaEvento: {
    type: String,
    default: '[INSIRA A DATA]' // Valor padrão
  },
  textoIngressos: {
    type: String,
    default: 'INGRESSOS – GRATUITOS'
  },
  repetitions: {
    type: Number,
    default: 7 // Número de blocos. Ajuste conforme a largura e o visual desejado.
  },
  animationDuration: {
    type: String,
    default: '30s' // Duração da animação (velocidade do scroll)
  },
  arrowIconSrc: {
    type: String,
    default: '/src/assets/right-arrow.svg' // Ajuste este caminho se a imagem estiver em src/assets via @/assets/right-arrow.svg
  }
});
</script>

<style scoped lang="scss">

// Para este exemplo, vou redeclará-las para autossuficiência do snippet.
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;

$texto-sobre-destaque: $principal;
$texto-accent-sobre-destaque: $complemento;

.carousel-ticker-container {
  overflow: hidden;
  width: 100%;
  background-color: $destaque;
  padding: 0.85rem 0; // ~14px vertical padding
  cursor: default;

  @media (max-width: 768px) {
    display: none;
  }
}

.carousel-ticker-track {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation-name: scroll-right;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  // animation-duration é definido via style binding a partir da prop

  // &:hover { // REMOVIDO - Não pausa mais no hover
  //   animation-play-state: paused;
  // }
}

.carousel-ticker-item {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.arrow-icon {
  width: 22px;
  height: 22px;
  margin: 0 0.85rem; // ~14px de margem entre texto e seta
  flex-shrink: 0;
}

.ticker-text {
  font-size: 1.1rem; // ~18px
  font-weight: 500;
  color: $texto-sobre-destaque;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.main-text {
    font-weight: 600;
  }

  &.accent-text {
    color: $texto-accent-sobre-destaque;
    font-weight: 700;
  }
}

@keyframes scroll-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>