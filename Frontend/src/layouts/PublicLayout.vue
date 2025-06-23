<template>
  <div class="site-container"> 
    <NavBarComponent />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBarComponent from '../components/NavBarComponent.vue';
import Footer from '../components/Footer.vue';
</script>

<style scoped lang="scss">
.site-container {
  /* Define o layout flexível para o container principal */
  display: flex;
  flex-direction: column;

  /* Garante que ele ocupe, no mínimo, 100% da altura da tela */
  min-height: 100vh;
}

main {
  /* Faz com que a área de conteúdo principal cresça e ocupe todo o espaço
     vertical disponível, empurrando o Footer para baixo. */
  flex-grow: 1;
}
</style>