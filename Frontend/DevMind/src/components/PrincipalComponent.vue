<template>
  <!-- Container principal para ocupar toda a largura -->
  <v-container fluid class="pa-0" style="position: relative;">
    <!-- Seção hero, com imagem de fundo -->
    <div
      class="hero-section d-flex flex-column justify-center px-6 py-10"
      style="background: url('https://via.placeholder.com/1600x600?text=Fundo+Hero') center center / cover no-repeat;"
    >
      <h1 class="text-h2 font-weight-bold mb-3" style="max-width: 600px;">
        Venha se desenvolver com novas tecnologias.
      </h1>
      <p class="text-subtitle-1 mb-6" style="max-width: 600px;">
        Venha se reinventar | 2ª Edição | 8, 9 e 10 de maio
      </p>
      <v-btn
        variant="contained"
        color="secondary"
        size="large"
        :ripple="false"
      >
        Participar do evento
      </v-btn>
    </div>

    <!-- Faixa roxa fixa na parte inferior, com texto alternado -->
    <div
      class="bottom-bar d-flex align-center justify-center px-4"
      style="
        background-color: #6200ea;
        height: 50px;
        width: 100%;
        position: absolute;
        bottom: 0;
      "
    >
      <transition name="fade">
        <span
          v-if="showFirstText"
          class="white--text text-subtitle-1 text-uppercase"
          key="ingresso"
        >
          INGRESSO GRATUITO
        </span>
        <span
          v-else
          class="white--text text-subtitle-1 text-uppercase"
          key="data"
        >
          DIA 24 DE MAIO
        </span>
      </transition>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Estado para alternar o texto
const showFirstText = ref(true)

// Ao montar o componente, inicia um intervalo que alterna o texto a cada 3 segundos
onMounted(() => {
  setInterval(() => {
    showFirstText.value = !showFirstText.value
  }, 3000)
})
</script>

<style scoped>
/* Animação de transição do texto */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Ajustes adicionais de layout, se necessário */
.hero-section {
  min-height: 400px; /* Ajuste conforme a altura desejada */
}

@media (min-width: 960px) {
  .hero-section {
    min-height: 600px; /* Em telas maiores, aumentar a altura */
  }
}
</style>
