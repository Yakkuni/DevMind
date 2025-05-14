<template>
  <div class="carousel-container">
    <!-- Track animada -->
    <div class="carousel-track">
      <!-- Itens do carrossel (primeira parte) -->
      <div class="carousel-item" v-for="n in repetitions" :key="n">
        <img class="arrow" src="/src/assets/right-arrow.svg" alt="Seta para a direita" />
        <span class="text">INGRESSOS – GRATUITOS</span>
        <img class="arrow" src="/src/assets/right-arrow.svg" alt="Seta para a direita" />
        <span class="text">[INSIRA A DATA]</span>
      </div>
      <!-- Duplicação dos itens para continuidade -->
      <div class="carousel-item" v-for="n in repetitions" :key="'dup-' + n">
        <img class="arrow" src="/src/assets/right-arrow.svg" alt="Seta para a direita" />
        <span class="text">INGRESSOS – GRATUITOS</span>
        <img class="arrow" src="/src/assets/right-arrow.svg" alt="Seta para a direita" />
        <span class="text">[INSIRA A DATA]</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const repetitions = 7
</script>

<style scoped lang="scss">
.carousel-container {
  overflow: hidden;
  width: 100%;
  background-color: #f5f5f5;
  padding: 10px 0;

  @media (max-width: 768px) {
    display: none;
  }
}

.carousel-track {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: scroll 16s linear infinite reverse;
}

.carousel-item {
  display: inline-flex;
  align-items: center;
  margin-left: 3px;
}

.arrow {
  width: 26px;
  height: 26px;
  margin: 0 10px;
}

.text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
