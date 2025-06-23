<template>
  <div class="card-item" :style="{ '--card-bg-color': bgColor, '--card-border-color': borderColor }">
    <div class="card-icon" v-html="image"></div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  image: String, // Receberá uma string SVG
  bgColor: String,
  borderColor: String
})
</script>

<style scoped lang="scss">
$branco: #ffffff;
$destaque: #FFA051;

.card-item {
  // Usando variáveis CSS para receber as cores do componente pai
  background-color: var(--card-bg-color);
  color: $branco;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  text-align: left;
  
  // A borda de destaque agora fica no topo, criando um detalhe elegante
  border-top: 5px solid var(--card-border-color);
  
  box-shadow: 0 8px 30px -10px rgba(0,0,0, 0.2);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 15px 40px -10px rgba(0,0,0, 0.25);
  }
}

.card-icon {
  margin-bottom: 1.5rem;
  
  // Estilo para o SVG que passamos como string
  :deep(svg) {
    width: 48px;
    height: 48px;
    color: $destaque;
  }
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.card-description {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.85;
  margin: 0;
}
</style>